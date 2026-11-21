// GEMs URDF viewer: the robot of hardware/sim-model/gems.urdf, one slider per
// actuated joint. Reads the URDF that scripts/sync_gems.py copies from the GEMs
// repository, so it always shows the committed model — nothing here restates a
// dimension or a limit.
//
// Ranges: the URDF carries two per joint (GEMs kinematics §1.5). <limit> is the
// mechanical travel the design targets; <safety_controller> soft limits are the
// human range, the default profile. The viewer shows the human range by
// default and the mechanical travel on request. urdf-loader itself clamps to
// <limit>, and drives the six coupled trunk joints from their masters (<mimic>).
//
// Open the page with #selftest to run a self-check whose result is written into
// the page (used to test the page headless before it is published).

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import URDFLoader from '/assets/vendor/urdf-loader-0.13.1/URDFLoader.js';

const root = document.getElementById('gems-viewer');
const stage = root.querySelector('.gv-stage');
const panel = root.querySelector('.gv-joints');
const status = root.querySelector('.gv-status');
const DEG = 180 / Math.PI;

// --- scene ------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.add(new THREE.HemisphereLight(0xffffff, 0x3a4446, 2.2));
const sun = new THREE.DirectionalLight(0xffffff, 2.0);
sun.position.set(3, 5, 2);
scene.add(sun);
const grid = new THREE.GridHelper(4, 40, 0x67787c, 0x2a3336);
scene.add(grid);

const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 50);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;

let dirty = true;
const render = () => { dirty = true; };
controls.addEventListener('change', render);
(function loop() {
  if (dirty) { dirty = false; renderer.render(scene, camera); }
  requestAnimationFrame(loop);
})();

new ResizeObserver(() => {
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  render();
}).observe(stage);

// --- the robot ----------------------------------------------------------------
const bi = (en, vi) => `<span data-l="en">${en}</span> <span data-l="vi">${vi}</span>`;
const GROUPS = [
  ['l_leg', bi('Left leg', 'Chân trái'), (n) => /^l_(hip|knee|ankle)/.test(n)],
  ['r_leg', bi('Right leg', 'Chân phải'), (n) => /^r_(hip|knee|ankle)/.test(n)],
  ['l_arm', bi('Left arm', 'Tay trái'), (n) => /^l_(shoulder|elbow|wrist)/.test(n)],
  ['r_arm', bi('Right arm', 'Tay phải'), (n) => /^r_(shoulder|elbow|wrist)/.test(n)],
  ['trunk', bi('Trunk', 'Thân'), (n) => /^trunk_/.test(n)],
  ['neck', bi('Neck', 'Cổ'), (n) => /^neck_/.test(n)],
];

function softLimits(xml) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const out = {};
  for (const j of doc.querySelectorAll('robot > joint')) {
    const s = j.querySelector('safety_controller');
    if (s) out[j.getAttribute('name')] = [parseFloat(s.getAttribute('soft_lower_limit')),
                                          parseFloat(s.getAttribute('soft_upper_limit'))];
  }
  return out;
}

async function main() {
  const res = await fetch(root.dataset.urdf);
  if (!res.ok) throw new Error(`could not load ${root.dataset.urdf}: HTTP ${res.status}`);
  const xml = await res.text();
  const robot = new URDFLoader().parse(xml);
  const soft = softLimits(xml);

  robot.rotation.x = -Math.PI / 2;          // URDF is z-up, three.js is y-up
  scene.add(robot);
  robot.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(robot);
  robot.position.y = -box.min.y;            // feet on the grid
  robot.updateMatrixWorld(true);
  const height = box.max.y - box.min.y;

  // The body faces URDF +X: look at its front, a little from its left.
  const target = new THREE.Vector3(0, height * 0.55, 0);
  camera.position.set(height * 1.9, height * 0.75, -height * 0.7);
  controls.target.copy(target);
  controls.update();

  const joints = Object.values(robot.joints);
  const actuated = joints.filter((j) => j.jointType !== 'fixed' && j.type !== 'URDFMimicJoint');
  const rows = new Map();
  let mode = 'soft';

  const range = (j) => (mode === 'soft' && soft[j.name]) ? soft[j.name] : [j.limit.lower, j.limit.upper];

  function setRow(j, rad) {
    robot.setJointValue(j.name, rad);
    const r = rows.get(j.name);
    r.input.value = String(j.angle * DEG);
    r.out.textContent = `${(j.angle * DEG).toFixed(1)}°`;
    render();
  }

  function applyMode() {
    for (const j of actuated) {
      const r = rows.get(j.name);
      const [lo, hi] = range(j);
      r.input.min = String(lo * DEG);
      r.input.max = String(hi * DEG);
      r.span.textContent = `${(lo * DEG).toFixed(0)}° … ${(hi * DEG).toFixed(0)}°`;
      setRow(j, Math.min(hi, Math.max(lo, j.angle)));
    }
  }

  panel.innerHTML = '';
  let first = true;
  for (const [key, label, match] of GROUPS) {
    const members = actuated.filter((j) => match(j.name));
    if (!members.length) continue;
    const group = document.createElement('details');
    group.className = 'gv-group';
    group.dataset.group = key;
    group.open = first;                       // the first group open, the others folded
    first = false;
    group.innerHTML = `<summary>${label}<small>${members.length}</small></summary>`;
    const sec = document.createElement('div');
    sec.className = 'gv-rows';
    group.appendChild(sec);
    for (const j of members) {
      const row = document.createElement('label');
      row.className = 'gv-row';
      const name = j.name.replace(/^[lr]_/, '');
      const followers = (j.mimicJoints || []).map((m) => m.name);
      row.innerHTML =
        `<span class="gv-name" title="${j.name}">${name}` +
        (followers.length ? ` <small>${bi(`+ ${followers.length} coupled`, `+ ${followers.length} khớp theo`)}</small>` : '') +
        `</span><input type="range" step="0.5" aria-label="${j.name}">` +
        `<output class="gv-val">0.0°</output><span class="gv-span"></span>`;
      const input = row.querySelector('input');
      rows.set(j.name, { input, out: row.querySelector('output'), span: row.querySelector('.gv-span') });
      input.addEventListener('input', () => setRow(j, parseFloat(input.value) / DEG));
      sec.appendChild(row);
    }
    panel.appendChild(group);
  }

  root.querySelectorAll('input[name="gv-range"]').forEach((el) =>
    el.addEventListener('change', () => { mode = el.value; applyMode(); }));
  root.querySelector('.gv-reset').addEventListener('click', () => actuated.forEach((j) => setRow(j, 0)));
  const fold = (open) => panel.querySelectorAll('details.gv-group').forEach((d) => { d.open = open; });
  root.querySelector('.gv-expand').addEventListener('click', () => fold(true));
  root.querySelector('.gv-collapse').addEventListener('click', () => fold(false));
  applyMode();

  const mimic = joints.filter((j) => j.type === 'URDFMimicJoint').length;
  status.innerHTML = bi(
    `${joints.length} joints: ${actuated.length} actuated, ${mimic} coupled through &lt;mimic&gt;. Height ${height.toFixed(3)} m.`,
    `${joints.length} khớp: ${actuated.length} chủ động, ${mimic} khớp mimic. Cao ${height.toFixed(3)} m.`);

  if (location.hash === '#selftest') selftest(robot, joints, actuated, mimic, height, setRow);
}

function selftest(robot, joints, actuated, mimic, height, setRow) {
  const at = (name) => robot.links[name].getWorldPosition(new THREE.Vector3());
  const r = {};
  r.joints = joints.length; r.actuated = actuated.length; r.mimic = mimic;
  r.height = +height.toFixed(3);
  const f0 = at('l_foot');
  setRow(robot.joints.l_knee, 1.0);
  robot.updateMatrixWorld(true);
  const f1 = at('l_foot');
  r.knee_1rad_foot_dx = +(f1.x - f0.x).toFixed(3);     // URDF x (forward) is three x
  r.knee_1rad_foot_dz = +(f1.y - f0.y).toFixed(3);     // URDF z (up) is three y
  setRow(robot.joints.l_knee, 3.0);
  r.knee_clamped_to = +robot.joints.l_knee.angle.toFixed(3);
  setRow(robot.joints.trunk_pitch, 0.3);
  r.trunk_followers = ['trunk_pitch_2', 'trunk_pitch_3'].map((n) => +robot.joints[n].angle.toFixed(3));
  actuated.forEach((j) => setRow(j, 0));
  r.after_reset_nonzero = joints.filter((j) => Math.abs(j.angle || 0) > 1e-9).map((j) => j.name);
  // layout: groups fold and unfold; with all open and the page scrolled, the model stays in view
  const groups = [...panel.querySelectorAll('details.gv-group')];
  r.groups = groups.length;
  r.open_at_start = groups.filter((d) => d.open).length;
  root.querySelector('.gv-expand').click();
  r.open_after_expand = groups.filter((d) => d.open).length;
  // scroll to the last slider, as someone working down the list would; the model must still be in view
  const rowsAll = panel.querySelectorAll('.gv-row');
  rowsAll[rowsAll.length - 1].scrollIntoView({ block: 'end' });
  const s = stage.getBoundingClientRect();
  r.stage_in_view_after_scroll = s.top >= 0 && s.bottom <= window.innerHeight + 1 && s.height > 100;
  r.scrolled_by = Math.round(window.scrollY);
  root.querySelector('.gv-collapse').click();
  r.open_after_collapse = groups.filter((d) => d.open).length;
  window.scrollTo(0, 0);
  r.pass = r.joints === 37 && r.actuated === 31 && r.mimic === 6 && Math.abs(r.height - 1.656) < 0.002
    && Math.abs(r.knee_1rad_foot_dx + 0.337) < 0.002 && Math.abs(r.knee_1rad_foot_dz - 0.184) < 0.002
    && Math.abs(r.knee_clamped_to - 2.44) < 1e-3 && r.trunk_followers.every((v) => Math.abs(v - 0.3) < 1e-6)
    && r.after_reset_nonzero.length === 0
    && r.groups === 6 && r.open_at_start === 1 && r.open_after_expand === 6 && r.open_after_collapse === 0
    && r.stage_in_view_after_scroll && r.scrolled_by > 200;
  const pre = document.createElement('pre');
  pre.className = 'gv-selftest';
  pre.textContent = JSON.stringify(r);
  root.appendChild(pre);
  root.dataset.selftest = r.pass ? 'pass' : 'fail';
}

main().catch((err) => {
  status.textContent = String(err && err.message || err);
  root.dataset.selftest = 'error';
});
