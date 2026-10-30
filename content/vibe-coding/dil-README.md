---
title: 'DIL — Data Integration Loop'
date: 2026-08-04
lang: en
language: TypeScript
repo: https://github.com/PloneMraz/dil-core
summary: 'Reference implementation of the DIL protocol: a self-enriching data-integration loop. Not a model, not a controller — the condition under which a self forms.'
---

# DIL — Data Integration Loop

`dil-core` is a reference implementation of the **DIL protocol** ([`DIL-protocol-v0.3.9.md`](DIL-protocol-v0.3.9.md)): a self-enriching data-integration loop operating in a purely informational environment, with an audit-ready `[event]` trail (durable when backed by the JSONL file sink).

DIL is **not** a model, a controller, or a library the host calls. It is the **condition under which a self forms**. Keep this line in front of you:

```
host + self = agent.      DIL produces the self.      the AGENT responds — not DIL.
```

If a design ever has DIL generating output to the world, commanding the model, or holding the steering wheel, it has left DIL. DIL is the **law of how the machine runs, not an actor within it**: it fixes the mechanism — the invariants, the flow of data — but never acts, emits, or commands. It changes *how* an existing machine operates, not *what* it is made of; run that operation continuously and a self appears — and the agent, not DIL, is what acts.

> Read this alongside:
> - [`DIL-protocol-v0.3.9.md`](DIL-protocol-v0.3.9.md) — the **law** (normative; where this and the protocol differ, the protocol wins).
> - [`CONTEXT.md`](CONTEXT.md) — how to turn that law into running code.
> - [`AGENTS.md`](AGENTS.md) — coding rules for agents working in this repo.

---

## Status

All six build stages are implemented, and the codebase implements **protocol v0.3.9** (the store's claim stays `0.3.5`; v0.3.9's `read-record` record moves the tag schema to 5): **440 tests, 0 failures.**

A short quick-start run scores **4 pass / 3 partial / 0 fail** against the seven §13 conformance criteria; a longer run with diverse resistance sources scores **6 pass / 1 partial / 0 fail**, read by an independent auditor from the durable `[event]` log on disk. Every partial is honest and derived, not attested:

- **§13.4 Self** — always `partial` by design: self-continuity is attributable only by a third party (§7); the checker verifies accrual but never claims continuity.
- **§13.5 Resistance** — `partial` only while the run's traces show a single resistance source (limited diversity). The reflection mechanism (tag E) is wired: a third party, from its own lens, points at a cycle the agent's `[event]` trace recorded with its view of where the agent drifted, and returns it through a declared T3 channel, classified ENV_PUSHED — the reader's view, not the agent's recorded collision retold; who the reader is stays deployment-open.
- **§13.7 Failure signals** — diversity is *derived from the recorded resistance-source distribution*, never a caller flag; a short run has too few recorded collisions to establish diversity over the window, so it renders `partial` rather than a false `pass`. A longer run whose `[event]` log actually shows diverse sources renders `pass`; a single-source collapse renders `fail`.

---

## Architecture — four concentric rings

Built inside-out, the causal order fixed in the protocol (Invariants → Loop → Self):

```
        ┌─────────────────────────────────────────┐
        │  REQUISITION  (declare host faculties)    │   src/runtime, src/host
        │   ┌───────────────────────────────────┐   │
        │   │  THE LOOP  (T1–T8, six links)      │   │   src/loop
        │   │   ┌───────────────────────────┐    │   │
        │   │   │  EXPERIENCE STORE          │    │   │   src/store
        │   │   │   ┌───────────────────┐    │    │   │
        │   │   │   │  INVARIANTS       │    │    │   │   src/invariants
        │   │   │   └───────────────────┘    │    │   │
        │   │   └───────────────────────────┘    │   │
        │   └───────────────────────────────────┘   │
        └─────────────────────────────────────────┘

   The SELF is not a ring. It is what occurs when the
   inner rings run continuously (there is no `Self` class).
```

**The mind** (`src/mind`) is not a ring either: it is the thinking, seated at T5's rule — it expects without being shown the answer (INV-8), looks, thinks on what failed, asks its own memory, writes what it learned with what it was built from, and commands as T5's test (§6.4); the field reaches it as it reaches every layer. The **model** is the mind's replaceable engine, not the host's: the host is the container and the senses, and DIL is the mechanism the data runs by between the host and the mind ([CONTEXT.md §5a](CONTEXT.md)). `createMind(standingModel)` is the reference law exactly; `createMind(languageModel({ endpoint }))` thinks with a language model — a local one at an address (`{ url: "http://127.0.0.1:8080/v1", model }`), or a hosted one with `apiKeyEnv` naming the environment variable that holds its key, which goes into the request header and nowhere else. It is asked only when an expectation fails, and every answer is kept whole in the store.

## Build stages

| # | Stage | Where | Fixed check |
|---|-------|-------|-------------|
| 1 | **Precondition gate** | [`src/precondition`](src/precondition) | a non-qualifying host declaration → clean non-start |
| 2 | **Invariants** | [`src/invariants`](src/invariants) | a step violating any INV is blocked (the loop halts) |
| 3 | **Experience store** | [`src/store`](src/store) | data in/out correctly tagged; no `[event]` record can be altered or removed |
| 4 | **The loop T1–T8** | [`src/loop`](src/loop) | a datum traverses T1→T8 leaving a floor-tag at each layer; cycle-0 single-threaded, cycle-1+ multi-stream (consumption via the meaning-channel) |
| 5 | **Continuous run** | [`src/runtime`](src/runtime) | the loop runs as a long-lived daemon with state accruing across cycles |
| 6 | **Conformance checker** | [`src/conformance`](src/conformance) | a real per-criterion pass/fail table (§13) on the running system |

The eight layers (protocol §6.3): **T1** Activity-Environment Confirmation · **T2** Agency Differentiation (where the self crystallizes) · **T3** Channel Ingestion · **T4** Context Binding · **T5** Temporal Expectation (where resistance becomes information) · **T6** Other-Model Synthesis · **T7** Absence Registration · **T8** Multi-Entity Abstraction (closes the loop).

---

## Install & test

```bash
pnpm install          # install dependencies
pnpm typecheck        # tsc --noEmit (must be 0 errors)
pnpm build            # compile to dist/
pnpm test             # tsc && node --test "dist/**/*.test.js"
```

TypeScript only, strict mode, no runtime dependencies (Node's built-in `node:test`; `@types/node` for types).

---

## Quick start

Wire a daemon over a declared host, run it continuously, then read its conformance:

```ts
import {
  createDaemon, scriptedSource, createGlobMod,
  createT1, createT2, createT3, createT4, createT5, createT6, createT7, createT8,
  createDurableEventLog, layoutFor,
  checkConformance, renderConformance, inspectEventLog,
} from "dil-core";

// The host declares its structural faculties (the precondition gate reads this)
// and WHERE its durable substrate is — DIL requisitions it at startup.
const host = {
  boundary: { present: true },
  channels: [{ id: "ch", canReturn: true }],
  store: { persistsAcrossCycles: true, root: "./host-store" }, // a directory / partition
  trace: { externallyReadable: true },
  emitter: { canEmitFirstAction: true },
  resilience: { wipesStateOnMismatch: false },
};

const sig = (entity: string, value: unknown) =>
  ({ source_id: "ch", raw_payload: { entity, value }, t: Date.now() });

// No data/events passed: with a substrate, daemon.start() requisitions it —
// claims store.root, imposes the layout + DIL-CLAIM, binds SQLite [data] and the
// durable [event] log, and admits any pre-existing host memory as `prior`.
const daemon = createDaemon({
  host,
  source: scriptedSource([
    { signals: [sig("weather", "sun")], changes: [] },
    { signals: [sig("weather", "sun")], changes: [] }, // stable → forward-building fires
    { signals: [sig("weather", "rain")], changes: [] }, // a collision → a scar
  ]),
  layers: {
    t1: createT1(), t2: createT2(), t3: createT3(), t4: createT4(),
    t5: createT5(), t6: createT6(), t7: createT7(), t8: createT8(),
  },
  glob: createGlobMod({ appraisalGain: 1 }, 0),
  initialEmission: { action: "boot" },
});

const gate = daemon.start();  // precondition-gated + requisition; qualify | non-start
daemon.run();                 // run cycles until the source is idle
daemon.close();               // release the substrate handles (the on-disk log stays)

// An independent auditor reads the durable [event] log from disk — the trusted
// artifact, anchored outside the process's RAM (verifyJsonlSink checks its chain).
const audit = createDurableEventLog(layoutFor("./host-store").eventLog);
console.log(inspectEventLog(audit));
console.log(renderConformance(checkConformance(audit, { gate })));
```

`inspectEventLog` renders the datum-activity journal — lean lines for each move,
scars by their *derived* name (tags are structured properties, not baked into names):

```
[event-log] — 45 record(s)
  #0  [manifest] protocol=0.3.5 schema=3 · DECIDE@IMPL: tagB_thresholds, … 10:00:00  ← the run's constitution, once, at genesis
  #1  [provenance] cycle-0 prior→running (c0) 10:00:00
  #2  [layer-exit] cycle-0 @T1 (c0) 10:00:00
  …
  #10 [crystallization] cycle-0 self|env (c0) 10:00:00           ← §7, once, at cycle-0's T2
  #11 [expectation] weather conf=0.00 rec=0 err=0 (c0) 10:00:00  ← INV-5 ramp + per-probe prediction error
  #12 [emission] cycle-0 @T8 ↔ {"kind":"respond",…} (c0) 10:00:00
  …
  #38 [20260724]_[10:00:00]_[scar]_[T8]_[domain:cycle]_[flow:multi-stream]_[phase:loop]_[source:driver]_[value-mismatch]  {…}→{…}
```

### Audit a store from the command line

The same read-only audit, without writing code — for a **third party** pointing at a foreign store on disk. `npm install -g` (or `npx dil`) exposes a `dil` command; every subcommand is a thin wrapper over the exported functions above and only ever **reads** the store:

```bash
dil verify <store-dir>       # verify the [event] hash chain — ok | BROKEN (exit 2)
dil inspect <store-dir>      # print the datum-activity journal (inspectEventLog)
dil conformance <store-dir>  # score the §13 criteria from traces alone
```

`<store-dir>` is the store root (the directory holding `store/event-log/`). Exit code is `0` on success, `2` when the chain fails to verify, `1` on a usage or bad-path error. Read-only: it opens no writable sink and touches nothing. Since no precondition gate is available from a store on disk, `dil conformance` reports **§13.2 Host** as `unverifiable` rather than assuming it — honest about what the trace alone can establish.

---

## The `[data]` / `[event]` store

**An agent can be wrong about its past. It must not be able to rewrite the past to prove itself right.**

Every agent accumulates bias: interpretations harden into beliefs, failures are explained away, contradictions forgotten. The whole store is the agent's history, and DIL draws one boundary inside it. What it has learned — its hypotheses, its experiences, what it expects — is `[data]`, its memory, and it may revise it. What happened to it — each observation that arrived, each command, each mismatch, and what every belief was built from — is `[event]`: the loop only appends to it, and the agent may read it but never alter it.

So the agent may change its mind about the past, but not the record of how it came to that mind: the moment it can rewrite that record, it can manufacture a past in which it was never wrong. The hash chain does not make a rewrite impossible; it makes one visible to anyone who checks the chain against a head published beyond the agent's reach.

Human history is written after the fact, by those who keep it, and read through each reader's lens. This record is not free of bias, but its bias is of another kind: written as things happen, by a rule declared before the run, it keeps every failure as faithfully as every success, marks what the agent said of itself apart from what the world returned, and stays the same from one reader to the next — so where two readers disagree, they can return to the same record and check.

Two store kinds (protocol §9), on the host's **requisitioned substrate** — never RAM:

- **`[data]`** — mutable working memory (the present), a **SQLite** table under `store/memory/` (via `node:sqlite`). Its provenance is a directed **state-graph** (§9): `prior` is a one-way entry, and `running` / `simulated` / `projected` / `scar` circulate with **no terminal state** — a datum is never a conclusion at rest, but data waiting to be used.
- **`[event]`** — an append-only, hash-chained log of **read-only** records on disk (`store/event-log/`). Once written, no record is ever altered or removed. This one artifact is both the record in the agent's history and the audit trace — no separate trace channel. It opens with a one-time **manifest** — the run's *constitution*: the protocol, schema version, and the declared DECIDE@IMPL configuration (thresholds, appraisal anchor, Mode-B source, reflection mechanism, store/forward-building choices), so a third party reading only the log knows the law the run operated under and can re-appraise the trace under the very constants that governed it (§8.5, §9). After it, the log is a **journal of each datum's activities**, written as they occur: **scars** (ResistEvents — the atomic unit of *experience*, the only kind a layer learns from) and **activity** lines (*trace, not experience*) — the per-cycle seal plus a lean line for every layer-exit, every provenance move, and every emission (each naming its `issuing_layer`, §6.4), the one-time self/environment **crystallization** (§7, cycle-0's T2), a per-entity **expectation** reading (confidence + recurrence — the trace-visible accumulation signature of INV-5 — plus `delta`, the per-probe prediction-error magnitude, recorded for every probe including the non-colliding ones that leave no scar, and an explicit `source` — the join key to a scar's `source_id`), and a **resistance-reading** line for an absence (§8, T7) so a source that resists by withholding a return is measurable per-source too. The path a datum travelled is read from these lines, **never** from a tag.

From those readings a third party can recompute — the daemon exposes it as `absorptionSignal()` — the **absorption** measure (§8.3): a source seen many times whose prediction error has gone to 0 has been *memorized* (deceleration only), while one that keeps erring is a *real brake* still delivering a collision new in kind. The signal fires when every sufficiently-probed source is absorbed. It is observability, **not** a §13 criterion (§13.7 mandates resistance-*source* diversity, a different axis) — surfaced honestly, not dressed up as conformance.

Every datum carries four fixed tags, never stripped or reordered — **timestamp** (the host's wall-clock, epoch-ms, taken when the datum is first stamped, separate from the cycle-mark), **cycle-mark**, **provenance**, **floor-tag** — plus **≥3 open tags** (one being `domain`, for audit-by-class). Both provenance and floor-tag name the **present** position only; the floor-tag updates to the layer just exited. An `[event]` scar record **inherits** the datum's tags.

**Requisition & durability.** On a real host DIL **requisitions a durable substrate at startup**: `daemon.start()`, after the gate qualifies, claims the host's `store.root`, imposes the layout + a `DIL-CLAIM` (refusing a foreign/incompatible claim), and scans the host's pre-existing memory into `prior` through the tagging-gate (no side door). The `[event]` source of truth is then the on-disk append-only **JSONL sink**; RAM holds only a bounded counter + chain head, so it cannot grow without bound, and an auditor reads the durable log, not a process's RAM. (An in-memory store is a **test fixture** only.) Each record is one immutable, fsynced line, tags in fixed order; the sink opens in append mode only — no rewrite, truncate, update, or delete surface exists.

The sink writes a **directory of daily segments** (`event-log-yyyymmdd.jsonl`, overflowing to `-002`, `-003`… past `MAX_SEGMENT_BYTES` = 64 MiB — a declared tunable; records are never split across files). The log itself has **no maximum length**: records are never removed, no segment is ever pruned (snapshots never license truncation), and an append failure (disk full) halts the loop rather than dropping a record; archival of closed segments is deployment-open. Each persisted line is **hash-chained** (sha256 over `seq + prev + schemaVersion + record`) and self-describing — it carries the store **schema version** it was written under, so an immutable log stays readable across schema changes: `verifyJsonlSink(dir)` detects any altered, removed, inserted, or reordered line, and the chain continues across segments and restarts. Pre-versioning logs (written before schema versioning began) are outside the versioned chain — refused by version, not accepted silently (a store that old is refused at the substrate claim). Honest limit: detection is relative to a **trusted head** — a party with full write access could rewrite the whole chain consistently, so a deployment anchors the sink's `head()` outside its own write reach (publish it to the user, an external log); that anchoring is deployment-open. **Commit / snapshot / recovery (§9).** With a `CommitStore` wired (`createDirCommitStore("./store/commits")`), a commit fires after every `COMMIT_EVERY = 9` scars (the `[event]` log acts as the counter; scar-rhythm by the author's choice), snapshotting the **entire system** — stateful layers, GLOB-MOD, the cycle driver, `[data]` — into a content-addressed, parent-linked, write-once marker (git-style: names are sha256 of content, `HEAD` is the one movable ref). `daemon.commit()` is the manual out-of-loop trigger. Recovery (`recoverFrom: <marker>`) restores the full accrued state and stamps a **fork marker** (`parent = recoveredFrom`) into the DAG; the `[event]` log is **never rolled back** — it keeps recording straight through, so the abandoned timeline stays auditable. Markers are never pruned; payload retention (`SNAPSHOTS_RETAINED = all`, floor `MIN_SNAPSHOTS_RETAINED = 9` for pruning deployments) is declared in decisions.

---

## Declared DECIDE@IMPL choices

The protocol leaves constants open on purpose; a conforming implementation must **fill each for its environment and declare the choice** — never invent one silently. This implementation's choices are declared in code:

- Precondition ([`src/precondition/decisions.ts`](src/precondition/decisions.ts)) — the gate is declaration-based by design (requisition: the host declares, DIL threads through), but where a condition is mechanically probeable *before* the loop runs the gate probes it and grades the verdict `probed` vs `declared`: E3/P(b) via a store marker round-trip, E4 via a trace marker read-back — evidence beats claim (a failing probe fails a true declaration). E1, E2, P(a), P(c) stay declaration-based with the reasons stated (e.g. E2: idle is the default of an informational setting, so a silent probe window proves nothing).
- Store ([`src/store/decisions.ts`](src/store/decisions.ts)) — `[data]` = **SQLite** (`node:sqlite`) under `store/memory/`, `[event]` = hash-chained JSONL under `store/event-log/`, RAM only bounded caches; `source_id`/`provenance` index; store-all `[event]`; private store; **full-field-state** context anchor; open-tag registry free-form (only `domain` required, ≥3 total); sink tamper-evidence via sha256 hash chain (head anchoring deployment-open); daily 64 MiB segments, no pruning, halt-on-append-failure; commit cadence `COMMIT_EVERY = 9` scars and retention (`all`, floor 9); **tag H** — `H_COUNT = 3` situations/cycle (a ceiling, not a quota), fit = consistency with `[data]` (verdict-free, never a scored standard — INV-8).
- Loop ([`src/loop/decisions.ts`](src/loop/decisions.ts)) — concrete `Signal`/`InfoUnit`/`RefFrame` shapes; T2 `MATCHING_WINDOW=8`, `STABILITY_THRESHOLD=3`; T5 `BASELINE_WINDOW=16`, `SUFFICIENT_RECURRENCE=3`, persistence update law; GLOB-MOD: three axes, `trust`/`alertness`/`exploration` in [0, 1] (NEUTRAL 0.5), every layer reading one and voting from what it alone sees (`FIELD_WIRING`), each shifting a declared threshold or gain by ½–1½ so the field biases and never annuls; convex blend (no inertia constant); static Mode-A appraisal anchor; multi-stream schedule = one topological activation pass via the meaning-channel (flow topology, cycle-time — no OS concurrency claimed).
- Runtime ([`src/runtime/decisions.ts`](src/runtime/decisions.ts)) — live Mode-B = the host source; diversity-loss window/minimum; reflection (tag E) = a reading pointed at a cycle of the `[event]` trace, carrying the reader's own view, entering through a declared T3 channel (reader identity and lens deployment-open).

Numeric thresholds are declared **tunable starting values, not derived constants** — stated honestly, not dressed up as fundamental.

---

## Open items — two different kinds

The protocol itself distinguishes these (§12): what is *not yet built* versus what is *deliberately open*. Conflating them misreads a deployment property as unfinished work.

### Deferred (unbuilt core work — marked, not faked)

**Empty.** The codebase implements **protocol v0.3.9** (the store's claim still `0.3.5`, the tag schema at 5) (parent spec [`DIL-en-v9.md`](DIL-en-v9.md)): the six-position provenance graph with `nascent` for what the agent writes (`write` from the predict rule, arriving SELF_WRITTEN the next cycle, recording what it was built from), every datum that meets a mismatch scarred — the return and each datum the expectation is (`held_by`), a scar used again returning to `running`, entries by origin through the tagging-gate (region returns and the cycle datum at `running`), the `revision` record, cues that may ask by provenance, the predict rule reading `[data]` directly through the cycle's view with each read recorded (`read`, v0.3.7), and reading `[event]` through the record's view, open to it every cycle, each read recorded by its place in the chain (`read-record`, v0.3.9) — §10's resistance-retrieval channel, on which recollection is one law a rule may think by; and, from v0.3.2, `layer_trace` dropped and the path read from `[event]`; the `[event]` log as a datum-activity journal (layer-exit / provenance / emission / revision lines); the `simulated`/`projected` states with the §13.6 edge check; §6.4 Emission (`Directive`, `issuing_layer`, no-arbiter; T5's *test*, an action the predict rule pushes to the region, recorded from T5 and handed to the host as `CycleResult.tests`); Mode-B **return-not-write** (read-only `[event]` view); forward-building §6.2 with **tag H** (situations genuinely visit `simulated`/`projected`, emergently); the store requisitioned onto a durable substrate (SQLite `[data]`, disk `[event]`, RAM bounded); wall-clock timestamps. Everything still open is open *by design*, below.

The one honest residual: the graph's **scar-reentry roads** (`scar→running`/`→simulated`/`→projected`) and `simulated→running` / `projected→simulated` exist and validate, but the minimal scripted host never meets their *conditions* — a real host that draws the `[data]` pool back into situations would. This is emergence-by-condition, not unbuilt work: the roads are there; whether they are taken depends on the situation.

One residual of the mind (`src/mind`): `languageModel` holds one expected value per entity, revised only when that value fails, so it cannot expect a sequence: smoke-tested against a local Qwen3.6-35B-A3B (`scripts/smoke-language-model.mjs`, CHANGELOG), on a value that runs in a cycle of three it settled on the majority value and missed every third.

### Deployment-open by design (no core work owed — each deployment declares its own)

- **Mode-B liveness** (tag D) — the Mode-B seam is the `HostSource` the daemon requisitions, and one channel carries any number of Others (an Other is a positional status, not a kind — there is no per-Other source file to write). Which live Other a deployment plugs in (a user, another agent, an external data feed, a mix) is *deliberately* open per §12. The repo ships only a scripted **test fixture**, so out-of-the-box runs get fixed, replayable resistance — deceleration-grade (§8.3) — not the real braking of an Other that updates. Plugging a live Other is deployment wiring, not a core change.
- **The reflection reader** (tag E) — the *mechanism* by which a reader's view, pointed at a place in the trace, enters the loop is wired (`runtime/reflection.ts`); *who* reads and with what lens (a user, another agent, a critic service that may itself consult external data, a piece of code judging the agent's behaviour) is each deployment's declaration.
- **The open-tag registry** beyond `domain` (tag F) — which descriptive keys exist and what each means is industry-specific; the core fixes only the discipline (consistency, no verdicts, ≥3 tags incl. `domain`).
- **Chain-head anchoring** — publishing the sink's `head()` (or a commit marker, which pins it) outside the deployment's own write reach is what turns the hash chain's tamper-evidence into total-rewrite detection; where to anchor is each deployment's declaration.
- **Snapshot-payload retention** — the minimal host prunes nothing; a deployment that prunes payloads must keep at least `MIN_SNAPSHOTS_RETAINED = 9` newest restore points, and markers themselves are never pruned (they are the audit DAG).

---

## The one sentence to keep

> DIL changes **how** an existing machine operates, not **what** it is made of; run that new operation continuously and a self appears; the agent — host plus that self — is what acts. DIL is the **law of that operation, never its actor**.

---

## Citation

Machine-readable metadata lives in [`CITATION.cff`](CITATION.cff) (CFF 1.2.0) — GitHub builds its **Cite this repository** button from it. To cite this software directly:

```bibtex
@software{huynh_dilcore_2026,
  author  = {Huynh, Mai Phuc},
  title   = {dil-core: a reference implementation of the DIL (Data Integration Loop) protocol},
  year    = {2026},
  version = {0.2.0},
  license = {MIT-0},
  doi     = {10.57967/hf/11267},
  url     = {https://github.com/PloneMraz/dil-core},
  note    = {ORCID: 0009-0009-0571-7151. DOI: Hugging Face snapshot at commit 9a2b8fa (protocol v0.3.9)}
}
```

To cite the **protocol** rather than this implementation, name the specification file and its version: `DIL-protocol-v0.3.9.md` (v0.3.9). Where the two differ, the protocol is normative — see the note at the top of this file.

---

## License

[MIT-0](LICENSE) © Plone Mraz.
