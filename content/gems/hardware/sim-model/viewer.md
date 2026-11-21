---
title: 'URDF viewer'
lede: 'The simulation model in the browser: one slider per actuated joint, within the human range or the mechanical travel the URDF declares'
group: hardware
order: 105.5
lang: en
---
<link rel="stylesheet" href="/assets/gems-viewer/viewer.css">
<script type="importmap">
{ "imports": {
  "three": "/assets/vendor/three-0.187.0/build/three.module.js",
  "three/examples/jsm/controls/OrbitControls.js": "/assets/vendor/three-0.187.0/examples/jsm/controls/OrbitControls.js",
  "three/examples/jsm/loaders/STLLoader.js": "/assets/gems-viewer/mesh-loaders-stub.js",
  "three/examples/jsm/loaders/ColladaLoader.js": "/assets/gems-viewer/mesh-loaders-stub.js"
} }
</script>
<div id="gems-viewer" class="gems-viewer" data-urdf="/assets/gems/hardware/sim-model/gems.urdf">
  <div class="gv-layout">
    <div class="gv-side">
      <div class="gv-controls">
        <label><input type="radio" name="gv-range" value="soft" checked> <span data-l="en">Human range</span> <span data-l="vi">Tầm của người</span></label>
        <label><input type="radio" name="gv-range" value="mech"> <span data-l="en">Mechanical travel</span> <span data-l="vi">Tầm cơ khí</span></label>
        <span class="gv-buttons">
          <button type="button" class="gv-btn gv-expand"><span data-l="en">Open all</span> <span data-l="vi">Mở hết</span></button>
          <button type="button" class="gv-btn gv-collapse"><span data-l="en">Close all</span> <span data-l="vi">Thu hết</span></button>
          <button type="button" class="gv-btn gv-reset"><span data-l="en">Reset</span> <span data-l="vi">Về 0</span></button>
        </span>
      </div>
      <div class="gv-joints"></div>
    </div>
    <div class="gv-stage" role="img" aria-label="GEMs body, 3D view"></div>
  </div>
  <p class="gv-status"><span data-l="en">Loading the model…</span> <span data-l="vi">Đang tải mô hình…</span></p>
  <noscript><p>This viewer needs JavaScript and WebGL.</p></noscript>
</div>
<script type="module" src="/assets/gems-viewer/viewer.js"></script>

<span data-l="en">Drag to orbit, scroll to zoom, right-drag to pan. The model is the [simulation model](/vault/gems/hardware/sim-model/) itself, read from the same `gems.urdf` the GEMs repository generates; the trunk's three coupled segments move together from one slider each axis. Segments are drawn as boxes and cylinders sized by proportion, not structure: this shows where the joints are and how they move, not what the body looks like.</span>
<span data-l="vi">Kéo để xoay, lăn chuột để phóng, kéo chuột phải để dời. Mô hình chính là [mô hình mô phỏng](/vault/gems/hardware/sim-model/), đọc từ đúng tệp `gems.urdf` mà repo GEMs sinh ra; ba đoạn thân khớp nối quay cùng nhau, mỗi trục một thanh trượt. Các đoạn được vẽ bằng hộp và trụ theo tỷ lệ, không theo cấu trúc: trang cho thấy khớp nằm đâu và cử động ra sao, không cho thấy cơ thể trông thế nào.</span>
