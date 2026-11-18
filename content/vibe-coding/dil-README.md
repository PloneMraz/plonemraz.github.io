---
title: 'DIL — Data Integration Loop'
date: 2026-08-04
lang: en
language: TypeScript
repo: https://huggingface.co/datasets/plonemraz/dil-core
summary: 'Reference implementation of the DIL protocol: the standard of an agent, host included. It does not build the host; it holds the whole law by which data moves through it, and that law is never the actor.'
---

# DIL — Data Integration Loop

`dil-core` is a reference implementation of the **DIL protocol** ([`DIL-protocol-v0.4.0.md`](DIL-protocol-v0.4.0.md)): the standard protocol of an agent built on a self-enriching data-integration loop, operating in a purely informational environment, with an audit-ready `[event]` trail (durable when backed by the JSONL file sink).

The protocol is the standard of the whole agent: its host, its mind, and the law the data runs by between them. **The host is a part of it**, not a system `dil-core` is fitted onto. `dil-core` does not build a host: its storage, its channels, its senses and hands are a deployment's to build. The law by which data moves through a host is here, whole: what is taken in and how it is tagged, what leaves and by which channel, what is recorded, what the substrate does of itself. That a deployment builds the host does not put the host outside `dil-core`.

DIL is **not** a model, a controller, or a library the host calls. Keep this line in front of you:

```
host + self = agent.      the self forms while the loop runs.      the mind commands, the host carries: the AGENT acts.
```

If a design ever has the loop's mechanism authoring output to the world, commanding the model, or holding the steering wheel, it has left DIL. The protocol is the **law of how the agent runs, never an actor within it**: it fixes the mechanism — the invariants, the flow of data — in every part of the agent, the host included, and it authors no action. Run that law continuously and a self appears; the mind commands, the host carries, and the agent is what acts.

> Read this alongside:
> - [`DIL-protocol-v0.4.0.md`](DIL-protocol-v0.4.0.md) — the **law** (normative; where this and the protocol differ, the protocol wins).
> - [`CONTEXT.md`](CONTEXT.md) — how to turn that law into running code.
> - [`AGENTS.md`](AGENTS.md) — coding rules for agents working in this repo.

---

## Status

All seven build stages are implemented, and the codebase implements **protocol v0.4.0** (*Deferred*, below, says what that took and what is left to a deployment): **586 tests, 0 failures.** The store's claim is `0.4.0` and its tag schema 6: a store written under `0.3.5` is not run (a clean non-start), and can still be read and audited.

A short quick-start run scores **4 pass / 3 partial / 0 fail** against the seven §13 conformance criteria; a longer run with diverse resistance sources scores **6 pass / 1 partial / 0 fail**, read by an independent auditor from the durable `[event]` log on disk. Every partial is honest and derived, not attested:

- **§13.4 Self** — always `partial` by design: self-continuity is attributable only by a third party (§7); the checker verifies accrual but never claims continuity.
- **§13.5 Resistance** — `partial` only while the run's traces show a single resistance source (limited diversity). The reflection mechanism (tag E) is wired: a third party, from its own lens, points at a cycle the agent's `[event]` trace recorded with its view of where the agent drifted, and returns it through a declared T3 channel, classified ENV_PUSHED — the reader's view, not the agent's recorded collision retold; who the reader is stays deployment-open.
- **§13.7 Failure signals** — diversity is *derived from the recorded resistance-source distribution*, never a caller flag; a short run has too few recorded collisions to establish diversity over the window, so it renders `partial` rather than a false `pass`. A longer run whose `[event]` log actually shows diverse sources renders `pass`; a single-source collapse renders `fail`.

---

## Architecture — four concentric rings

Built inside-out, the causal order fixed in the protocol (Invariants → Loop → Self):

```
        ┌─────────────────────────────────────────┐
        │  THE HOST  (built by a deployment)        │   src/runtime, src/host
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
| 7 | **The closed store and its keepers** (v0.4.0) | [`src/store`](src/store), [`src/runtime`](src/runtime), `dil-keeper` | without the key the store's files show nothing; a read with a missing, expired or mismatched right is refused; a recovery order without grounds or signatures is refused |

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
  fileKey, dirBackupPlace, newIdentity, signAsk, declareGuardian, evidenceDigest,
  checkConformance, renderConformance, inspectEventLog,
} from "dil-core";

// The host's key to its store, kept outside the store, where only the host reads
// it. The loop alone uses it: nothing outside the loop reads the store with it.
const key = fileKey("./host-keys/store.key");

// The guardian: whoever provides the resources the agent runs on. It takes the
// position up on its own machine (`dil-keeper keys`, then `dil-keeper accept`):
// what it provides, who it is — anchored by the digest of its evidence, a
// document or a face, which never enters the store — signed with its identity.
// The host takes in what it signed: the guardian's word, not the host's own. Made here so that the example runs on its own.
const keeper = newIdentity();
const evidence = "the keeper's identity document"; // what the deployment checks it against
const guardian = declareGuardian(
  { name: "the keeper", grounds: ["the machine the agent runs on"], identity: { method: "identity document", digest: evidenceDigest(evidence) } },
  keeper,
);

// The host declares its structural faculties (the precondition gate reads this)
// and WHERE its durable substrate is — the store is opened on it at startup.
const host = {
  boundary: { present: true },
  channels: [{ id: "ch", canReturn: true }],
  // a directory / partition; the host's key to it (the store is encrypted where it
  // rests); and where its backup is kept — outside the store, on another volume
  store: { persistsAcrossCycles: true, root: "./host-store", key, backup: dirBackupPlace("./host-backup") },
  trace: { externallyReadable: true },
  emitter: { canEmitFirstAction: true },
  outward: [{ id: "out", kind: "region", to: "the region" }], // every way content can leave the host
  resilience: { wipesStateOnMismatch: false },
  guardian, // its grounds, its anchored identity, its acceptance — checked at the gate
};

const sig = (entity: string, value: unknown) =>
  ({ source_id: "ch", raw_payload: { entity, value }, t: Date.now() });

// No data/events passed: with a substrate, daemon.start() opens the store on it —
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

const gate = daemon.start();  // precondition-gated, then the host's store is opened; qualify | non-start
daemon.run();                 // run cycles until the source is idle

// The durable [event] log, read through the agent — the store is closed, and an
// outside reader reads it only by being opened to it (v0.4.0 §9): here the
// guardian, under its own signature and showing who it is, for a term. The read
// key decrypts nothing; it proves to the agent who is reading. The opening is
// itself recorded, with how the guardian's identity was checked.
const now = Date.now();
const readKey = daemon.askOpening(
  signAsk({ reader: "the keeper", way: "guardianship", may: "read", until: now + 30 * 60_000, t: now }, keeper.privateKey),
  { evidence }, // a deployment checks a face or a document instead (verifyIdentity)
);
const { events } = daemon.reading(readKey);
console.log(inspectEventLog(events));
console.log(renderConformance(checkConformance(events, { gate })));

daemon.close();               // the loop stops; the on-disk log stays, closed
// From here no one reads the store's files but the guardian, with the copy of the
// store's key kept for it where it declared a key to the backup (`dil-keeper read`).
```

`inspectEventLog` renders the datum-activity journal — lean lines for each move, scars by their *derived* name (tags are structured properties, not baked into names):

```
[event-log] — 83 record(s)
  #0  [manifest] protocol=0.4.0 schema=6 · DECIDE@IMPL: tagA_representation, tagB_thresholds, … 10:00:00  ← the run's constitution, once, at genesis
  #1  [entry] signal-0-0 [20261113]_[10:00:00]_[c0]_[running]_[T1]_[domain:region]_[format:object]_[source:ch] payload={"entity":"weather","value":"sun"} (c0) 10:00:00  ← what entered, as it entered
  #3  [layer-exit] cycle-0 @T1 (c0) 10:00:00
  …
  #27  [crystallization] cycle-0 self|env (c0) 10:00:00           ← §7, once, at cycle-0's T2
  #28  [expectation] weather conf=0.00 rec=0 err=0 (c0) 10:00:00  ← INV-5 ramp + per-probe prediction error
  #30  [emission] cycle-0 @T8 ↔ {"kind":"respond","cycle":0,"valence":0} (c0) 10:00:00
  #31  [20261113]_[10:00:00]_[c0]_[running]_[T8]_[domain:cycle]_[flow:single-threaded]_[phase:loop]_[source:driver]_[cycle-seal]  cycle=0 flow=single-threaded observed=weather,backup:no-key scars=0
  …
  #76  [provenance] signal-2-0 running→scar (c2) 10:00:00
  #77  [20261113]_[10:00:00]_[c2]_[scar]_[T8]_[domain:region]_[format:object]_[source:ch]_[value-mismatch]  {…}→{…}  ← rain where sun was expected
  …
  #81  [20261113]_[10:00:00]_[c2]_[scar]_[T8]_[domain:cycle]_[flow:multi-stream]_[phase:loop]_[source:driver]_[cycle-seal]  cycle=2 flow=multi-stream observed=weather scars=2
  #82  [opening] to the keeper, to read, by guardianship, from 10:00:00 until 10:30:00 10:00:00  ← the reading itself, recorded
```

### For those who hold a key: `dil-keeper`

The guardian and the delegates an agent names act from their own machines, never from the agent's host: the private halves of their keys must not lie where whatever has entered the host could take them. `dil-keeper` is the reference tool for that side of the protocol (§9):

```bash
dil-keeper keys ~/.dil/keys.json      # make your keys; print the public halves for the host or the agent
dil-keeper accept ~/.dil/keys.json --name "the keeper" --grounds "the machine the agent runs on" --identity-method "identity document" --identity-evidence ./my-id.jpg   # take the position up: the signed declaration for the host; only the digest of the evidence leaves
dil-keeper read verify <store-root> ~/.dil/keys.json      # as guardian, the loop not running: read the store with your copy of its key
dil-keeper ask ~/.dil/keys.json --reader "the keeper" --way guardianship --minutes 30   # a signed ask, for askOpening
dil-keeper open-backup <backup-dir> --holder "the keeper=$HOME/.dil/keys.json" --out ./opened
dil-keeper order ./order.json --agent <hash> --point <hash> --into place --reason "…" --rests 3,7 --holder "the keeper=$HOME/.dil/keys.json"
dil-keeper sign ./order.json --holder "the physician=$HOME/.dil/keys.json"   # where several must sign together
```

What it writes is what the daemon takes: `loadRecovery(orderFile, openedDir)` gives a daemon its `recovery`. The store keeps one copy of its key outside the host, sealed to the guardian's key to the backup (`guardian.boxPublicKey`) in `DIL-KEY.json` — the guardian opens the store with a key of its own and never holds the host's; where no one stands as guardian, there is no such copy.

### Audit a store from the command line

The same read-only audit, without writing code — for whoever holds the store's key (its guardian, with the copy it keeps), or for a store that rests in the clear, as those written before v0.4.0 do. `npm install -g` (or `npx dil`) exposes a `dil` command; every subcommand is a thin wrapper over the exported functions above and only ever **reads** the store:

```bash
dil verify <store-dir>       # verify the [event] hash chain — ok | BROKEN (exit 2)
dil inspect <store-dir>      # print the datum-activity journal (inspectEventLog)
dil conformance <store-dir>  # score the §13 criteria from traces alone

dil verify <store-dir> --guardian-keys <file>   # a store encrypted where it rests: its guardian's own keys, the loop not running
dil verify <store-dir> --guardian-keys <file> --loop-stopped   # the store marked running on another machine: the guardian's word that it is not
```

A store written under v0.4.0 is closed: without `--guardian-keys` the tool reports that it is, and reads nothing. There is no reading of its files under the host's key: that key does not leave the host. While the loop runs, the daemon marks the store (`store/RUNNING.json`: process, machine, since when), and no key reads the store's files: every reading goes through the agent. The tool refuses when the mark is this machine's and its process is alive. A mark whose process is gone was left by a loss of power or a crash, and is passed over. A mark from another machine cannot be checked from here, and the tool refuses unless the guardian gives its word (`--loop-stopped`). This guards against a mistake, not against a guardian set on going around it (§11).

`<store-dir>` is the store root (the directory holding `store/event-log/`). Exit code is `0` on success, `2` when the chain fails to verify, `1` on a usage or bad-path error. Read-only: it opens no writable sink and touches nothing. Since no precondition gate is available from a store on disk, `dil conformance` reports **§13.2 Host** as `unverifiable` rather than assuming it — honest about what the trace alone can establish.

---

## The `[data]` / `[event]` store

**An agent can be wrong about its past. It must not be able to rewrite the past to prove itself right.**

Every agent accumulates bias: interpretations harden into beliefs, failures are explained away, contradictions forgotten. The whole store is the agent's history, and DIL draws one boundary inside it. What it has learned — its hypotheses, its experiences, what it expects — is `[data]`, its memory, and it may revise it. What happened to it — each observation that arrived, each command, each mismatch, and what every belief was built from — is `[event]`: the loop only appends to it, and the agent may read it but never alter it.

So the agent may change its mind about the past, but not the record of how it came to that mind: the moment it can rewrite that record, it can manufacture a past in which it was never wrong. The hash chain does not make a rewrite impossible; it makes one visible to anyone who checks the chain against a head published beyond the agent's reach.

Human history is written after the fact, by those who keep it, and read through each reader's lens. This record is not free of bias, but its bias is of another kind: written as things happen, by a rule declared before the run, it keeps every failure as faithfully as every success, marks what the agent said of itself apart from what the world returned, and stays the same from one reader to the next — so where two readers disagree, they can return to the same record and check.

Two store kinds (protocol §9), on the host's **durable substrate** — never RAM:

- **`[data]`** — mutable working memory (the present), a **SQLite** table under `store/memory/` (via `node:sqlite`). Its provenance is a directed **state-graph** (§9): `prior` is a one-way entry, and `running` / `simulated` / `projected` / `scar` circulate with **no terminal state** — a datum is never a conclusion at rest, but data waiting to be used.
- **`[event]`** — an append-only, hash-chained log of **read-only** records on disk (`store/event-log/`). Once written, no record is ever altered or removed. This one artifact is both the record in the agent's history and the audit trace — no separate trace channel. It opens with a one-time **manifest** — the run's *constitution*: the protocol, schema version, and the declared DECIDE@IMPL configuration (thresholds, appraisal anchor, Mode-B source, reflection mechanism, store/forward-building choices), so a third party reading only the log knows the law the run operated under and can re-appraise the trace under the very constants that governed it (§8.5, §9). After it, the log is a **journal of each datum's activities**, written as they occur: **scars** (ResistEvents — the atomic unit of *experience*, the only kind a layer learns from) and **activity** lines (*trace, not experience*) — the per-cycle seal plus a lean line for every layer-exit, every provenance move, and every emission (each naming its `issuing_layer`, §6.4), the one-time self/environment **crystallization** (§7, cycle-0's T2), a per-entity **expectation** reading (confidence + recurrence — the trace-visible accumulation signature of INV-5 — plus `delta`, the per-probe prediction-error magnitude, recorded for every probe including the non-colliding ones that leave no scar, and an explicit `source` — the join key to a scar's `source_id`), and a **resistance-reading** line for an absence (§8, T7) so a source that resists by withholding a return is measurable per-source too. The path a datum travelled is read from these lines, **never** from a tag.

From those readings a third party can recompute — the daemon exposes it as `absorptionSignal()` — the **absorption** measure (§8.3): a source seen many times whose prediction error has gone to 0 has been *memorized* (deceleration only), while one that keeps erring is a *real brake* still delivering a collision new in kind. The signal fires when every sufficiently-probed source is absorbed. It is observability, **not** a §13 criterion (§13.7 mandates resistance-*source* diversity, a different axis) — surfaced honestly, not dressed up as conformance.

Every datum carries four fixed tags, never stripped or reordered — **timestamp** (the host's wall-clock, epoch-ms, taken when the datum is first stamped, separate from the cycle-mark), **cycle-mark**, **provenance**, **floor-tag** — plus **≥3 open tags** (one being `domain`, for audit-by-class). Both provenance and floor-tag name the **present** position only; the floor-tag updates to the layer just exited. An `[event]` scar record **inherits** the datum's tags.

**The host's store & durability.** On a real host the store is **opened on a durable substrate at startup** (`openHostStore`): `daemon.start()`, after the gate qualifies, claims the host's `store.root`, imposes the layout + a `DIL-CLAIM` (refusing a foreign/incompatible claim), and scans the host's pre-existing memory into `prior` through the tagging-gate (no side door). The `[event]` source of truth is then the on-disk append-only **JSONL sink**; RAM holds only a bounded counter + chain head, so it cannot grow without bound, and an auditor reads the durable log, not a process's RAM. (An in-memory store is a **test fixture** only.) Each record is one immutable, fsynced line, tags in fixed order; the sink opens in append mode only — no rewrite, truncate, update, or delete surface exists.

The sink writes a **directory of daily segments** (`event-log-yyyymmdd.jsonl`, overflowing to `-002`, `-003`… past `MAX_SEGMENT_BYTES` = 64 MiB — a declared tunable; records are never split across files). The log itself has **no maximum length**: records are never removed (snapshots never license truncation), and an append failure (disk full) halts the loop rather than dropping a record. A **closed segment is archived** between cycles, a few blocks a cycle: its lines, unchanged and checked one by one against the chain, gathered in blocks of 4,096, compressed (Brotli) and sealed; the archive is read back whole and must hold what the segment held; its `archive` record goes into the log, and only then is the segment removed. Every reader — the agent's view of the record, the audit tool, `rebuildData`, the backup — reads through an archive as through the segment it was, opening only the block it needs. Over 4,000 cycles of `scripts/measure-store.mjs` this keeps the log at 49 MB where it was 168 MB: each 64 MiB segment becomes about 8 MB. Archiving never stops the loop: where it fails — a segment the storage will not let go of, a disk full, a chain that does not hold — it stops for the run, leaves what is there (a segment beside its archive is what is read), and tells the agent why. Archives lie beside the log by default; a host may give them a place of their own (`store: { archivePlace: "/worm/agent-archives" }`) — storage written once and never removed from (WORM), say, which the guardian provides. There an archive is written once, whole, never renamed or removed; an attempt cut short has no index and is passed over, and the next is written under the next name. The log names every such place beside itself, so every reader follows it there. The agent does not provide that place; it may ask for it, by an emission `{kind: "request", what: "archive-place"}` that the host carries to whoever provides for it (`onRequest`). A host whose whole log lies on storage written once declares `store: { archive: false }`, and its log stays as it was written. Each persisted line is **hash-chained** (sha256 over `seq + prev + schemaVersion + record`) and self-describing — it carries the store **schema version** it was written under, so an immutable log stays readable across schema changes: `verifyJsonlSink(dir)` detects any altered, removed, inserted, or reordered line, and the chain continues across segments and restarts. Pre-versioning logs (written before schema versioning began) are outside the versioned chain — refused by version, not accepted silently (a store that old is refused at the substrate claim). Honest limit: detection is relative to a **trusted head** — a party with full write access could rewrite the whole chain consistently, so a deployment anchors the sink's `head()` outside its own write reach (publish it to the user, an external log); that anchoring is deployment-open. **Commit / restore point / recovery (§9).** With a `CommitStore` wired (`createDirCommitStore("./store/commits")`), a commit fires after every `COMMIT_EVERY = 9` scars (the `[event]` log acts as the counter; scar-rhythm by the author's choice) and makes a **restore point**: the state the log does not itself hold — every stateful layer (T1–T8), GLOB-MOD, the cycle driver — under a content-addressed, parent-linked, write-once marker that names the place in the log it was taken at (git-style: names are sha256 of content, `HEAD` is the one movable ref). It holds no copy of `[data]`: with the log up to that place it holds the entire system, and `[data]` is read back from the log (`rebuildData`). So a commit weighs what that state weighs, not what the store does: over 4,000 cycles of `scripts/measure-store.mjs` the commit store grows in step with the cycles (89 MB), where copying `[data]` at each commit made it grow with their square (6.7 GB). Every commit leaves a `commit` record in the log. `daemon.commit()` is the manual out-of-loop trigger. Recovery (`recoverFrom: <marker>`) refuses a restore point that was not taken on this log, re-instates the state, reads `[data]` back as at that place, leaves a `recovery` record, and stamps a **fork marker** (`parent = recoveredFrom`) into the DAG; the `[event]` log is **never rolled back** — it keeps recording straight through, so the abandoned timeline stays auditable. Markers are never pruned; payload retention (`SNAPSHOTS_RETAINED = all`, floor `MIN_SNAPSHOTS_RETAINED = 9` for pruning deployments) is declared in decisions.

---

## Declared DECIDE@IMPL choices

The protocol leaves constants open on purpose; a conforming implementation must **fill each for its environment and declare the choice** — never invent one silently. This implementation's choices are declared in code:

- Precondition ([`src/precondition/decisions.ts`](src/precondition/decisions.ts)) — the gate is declaration-based by design (the host states itself, and the law runs through what it states), but where a condition is mechanically probeable *before* the loop runs the gate probes it and grades the verdict `probed` vs `declared`: E3/P(b) via a store marker round-trip, E4 via a trace marker read-back — evidence beats claim (a failing probe fails a true declaration). E1, E2, P(a), P(c) stay declaration-based with the reasons stated (e.g. E2: idle is the default of an informational setting, so a silent probe window proves nothing).
- Store ([`src/store/decisions.ts`](src/store/decisions.ts)) — `[data]` = **SQLite** (`node:sqlite`) under `store/memory/`, `[event]` = hash-chained JSONL under `store/event-log/`, RAM only bounded caches; `source_id`/`provenance` index; store-all `[event]`; private store; **full-field-state** context anchor; open-tag registry free-form (only `domain` required, ≥3 total); sink tamper-evidence via sha256 hash chain (head anchoring deployment-open); daily 64 MiB segments, no pruning, halt-on-append-failure; commit cadence `COMMIT_EVERY = 9` scars and retention (`all`, floor 9); **tag H** — `H_COUNT = 3` situations/cycle (a ceiling, not a quota), fit = consistency with `[data]` (verdict-free, never a scored standard — INV-8).
- Loop ([`src/loop/decisions.ts`](src/loop/decisions.ts)) — concrete `Signal`/`InfoUnit`/`RefFrame` shapes; T2 `MATCHING_WINDOW=8`, `STABILITY_THRESHOLD=3`; T5 `BASELINE_WINDOW=16`, `SUFFICIENT_RECURRENCE=3`, persistence update law; GLOB-MOD: three axes, `trust`/`alertness`/`exploration` in [0, 1] (NEUTRAL 0.5), every layer reading one and voting from what it alone sees (`FIELD_WIRING`), each shifting a declared threshold or gain by ½–1½ so the field biases and never annuls; convex blend, with the field before carried by `FIELD_CARRY` (0 by default: none); static Mode-A appraisal anchor; multi-stream schedule = one topological activation pass via the meaning-channel (flow topology, cycle-time — no OS concurrency claimed).
- Runtime ([`src/runtime/decisions.ts`](src/runtime/decisions.ts)) — live Mode-B = the host source; diversity-loss window/minimum; reflection (tag E) = a reading pointed at a cycle of the `[event]` trace, carrying the reader's own view, entering through a declared T3 channel (reader identity and lens deployment-open).

Numeric thresholds are declared **tunable starting values, not derived constants** — stated honestly, not dressed up as fundamental.

---

## Open items — two different kinds

The protocol itself distinguishes these (§12): what is *not yet built* versus what is *deliberately open*. Conflating them misreads a deployment property as unfinished work.

### Deferred (unbuilt core work — marked, not faked)

**v0.4.0, built.** [`DIL-protocol-v0.4.0.md`](DIL-protocol-v0.4.0.md) (§6.5, §9; parent spec [`DIL-en-v10.md`](DIL-en-v10.md)) says whom the store is for — the agent first, an outside reader second — and what follows from it. This codebase implements it. **Built:** the `entry` record, carrying each datum as it entered, content and all, and the `revision` record carrying what changed and a digest — so that what `[data]` held at any place in the log reads back from the log alone (`rebuildData`), which the conformance checker now does for criterion 6 (a log is judged under the law its own first record declares, and the report says which: one written before v0.4.0 is not asked what v0.4.0 asks); and the agent's reach over the whole log — a read of `[event]` is still bounded by `RECORD_SCAN`, and may begin at any place the log held before its cycle, found on disk without reading what lies between; and restore points that hold the state of every stateful layer and leave `[data]` to the log, each commit and each recovery leaving a record; the record of the gap when the daemon starts on a log that already holds records; sensing, mind and effector each able to stop while the loop runs (`daemon.setPart`) — an emission withheld recorded as withheld, no expectation formed and no rule asked while the mind is stopped, no absence made a scar where no return was owed (the host says, channel by channel, which return of themselves and so still owe theirs), the parts kept as they were left across a restart; and the host's declaration of its outward channels, checked at the gate (`OUT`), recorded at each start, named by every emission that leaves, with the mind's transport sending nothing to a model outside the host that the host did not declare, and every prompt the mind sends its model recorded word for word with what came back (`exchange`); and the store encrypted where it rests — the log, `[data]` and the restore points sealed record by record under keys derived from a data key that is kept wrapped under the host's key (`host.store.key`, `fileKey`), so that the store's files show nothing without it and a host that declares a substrate and no key is refused; and the store's openings — a reader outside reads through the daemon only (`askOpening`, `reading`), the whole store, for a term, under a right recorded in the log and a read key of which the log keeps the digest; by consent (an emission of the agent's to its own keeper), by a delegation the agent recorded, or as the guardian the host declares, the last two under the asker's own signature (Ed25519); one key valid at a time; each opening met by the agent as a signal at the keeper's door (the host's own way in beside its senses), which turns a cycle even with sensing stopped; and the right to alter `[data]` granted apart, an alteration recorded as a revision naming who made it; the backup — the log and the restore points shipped at every commit to a place outside the store (`host.store.backup`), as parts sealed for the guardian and up to two delegates the agent named to recover, which the host writes and cannot read, signed with the agent's identity key (carried by the log's first record), held in trust while no one holds a key (and the agent told), shipped whole again when the set of holders changes, and split among the holders where the agent requires several keys together; recovery by order — signed by as many holders as must open together, with its grounds, the restore point opened by them and checked against the log, in place or into another host under the agent's own first record and a new identity key, recorded whole, the abandoned stretch kept and marked for the reader; and a restart that takes up the line the loop was on instead of beginning a second at cycle 0; and notice and hold — a recovery announced to the running loop (`announceRecovery`) enters it as a signal with its grounds and makes a restore point of the state as it stands; the agent may hold it once ({kind: "hold"}), for a declared term (`HOLD_TERM_MS`), never an urgent one; while held, `[data]` is sealed — what the loop does is recorded in the log and held over the store, no right is given or changed — and the order cannot be carried out; withdrawn (`withdrawRecovery`), `[data]` is brought up to what the log recorded meanwhile. The host's key is the loop's alone: the package offers no opening of the store's files under it, the loop running or not (`openStoreCipher`, `readStoreCipher` and `dil --key` are gone; the daemon opens through `loopStoreCipher`, which is not exported), and an outside reader reads through the agent (`askOpening`, `reading`, as in the quick start). The one direct reading is the guardian's, with its own copy: while the loop runs the daemon marks the store, and `guardianStoreCipher`, `dil` and `dil-keeper read` refuse (`LoopRunningError`). The guardian's position (Plone, 2026-11-13): a declaration with its grounds, its identity anchored by the digest of its evidence, and its own acceptance (`declareGuardian`, `dil-keeper accept`; the gate's `GUARD`); an ask by guardianship that shows who it is (`verifyIdentity`); the agent told when the guardian changes; and its refusal (`refuse-guardian`), the four privileges together after `REFUSAL_TERM_MS`, the store's key moved to a new epoch when it takes effect, taken back by a recovery to a point before it; the refusal withdrawn by the agent until it takes effect (`withdraw-refusal`), and a refused guardian taken back by the agent once it has signed a new acceptance (`accept-guardian`), its copy of every epoch. A guardian newly in the position (proposed by Plone's personal AI, approved by Plone, 2026-11-15): another person who takes the position up over a log that holds a past stands in a term, counted while the loop runs (`NEWCOMER_TERM_MS`), before the past is opened to it — its copy of the key, its reading through the daemon and its part of the backup begin at the record of its taking up, it alters nothing, and it orders a recovery only to a restore point made since; refused within the term, it never read the past. While a guardian's signature alone orders a recovery (no delegate holds a key to the backup, or the agent has not required several keys together), nothing protects the agent from it: protocol §11 names this window as a limit of the design, the daemon tells the agent when it stands in it (`guardian:window`), and the conformance report describes how long it stood without judging it. An action and the expectation of what it brings back are born in one act, and what the host takes in gives rise to expectations too: either stands until its return or its wait, and silence within the wait is a mismatch unless silence was predicted (§6.4; the rule's `expect`). The keeper answers every action addressed to it, and what the agent asked to be provided with waits for word (`daemon.provided`); none within the wait is a scar against the guardian who stands. What the substrate does of itself, reacting as a body does without the mind, is the agent's own and no emission: the host declares each such faculty (`host.reactions`), reports it with the cycle's input, and it is recorded as a `reaction`; a change it brought about is tagged `HOST_REACTED` at T2, neither the mind's command nor the region's push (§6.5). Those who hold a position (guardian, delegate, reader, provider) are of the region, and the host has two ways in, both its own: its senses, and the keeper's door, which does not stop with them. What is written outside reaches the mind only set apart in the keeper's signal, with who said it and what of it was checked, and what is turned away at the door is told as what is let in is (§3, §4, §9). The agent's own secrets come from a root of their own, so a copy of the data key cannot sign as the agent. **Left to a deployment:** carrying what `dil-keeper` writes to the daemon, and a transport for a reader outside the process — the daemon serves reading, alteration, the announcing and withdrawing of a recovery at the keeper's door, and carrying that over a socket is a deployment's; as is a backup place the host cannot remove from, and a keeping of the host's key better than a file.

**Before v0.4.0**, the codebase already implemented protocol v0.3.9 (parent spec `DIL-en-v9`): the six-position provenance graph with `nascent` for what the agent writes (`write` from the predict rule, arriving SELF_WRITTEN the next cycle, recording what it was built from), every datum that meets a mismatch scarred — the return and each datum the expectation is (`held_by`), a scar used again returning to `running`, entries by origin through the tagging-gate (region returns and the cycle datum at `running`), the `revision` record, cues that may ask by provenance, the predict rule reading `[data]` directly through the cycle's view with each read recorded (`read`, v0.3.7), and reading `[event]` through the record's view, open to it every cycle, each read recorded by its place in the chain (`read-record`, v0.3.9) — §10's resistance-retrieval channel, on which recollection is one law a rule may think by; and, from v0.3.2, `layer_trace` dropped and the path read from `[event]`; the `[event]` log as a datum-activity journal (layer-exit / provenance / emission / revision lines); the `simulated`/`projected` states with the §13.6 edge check; §6.4 Emission (`Directive`, `issuing_layer`, no-arbiter; T5's *test*, an action the predict rule pushes to the region, recorded from T5 and handed to the host as `CycleResult.tests`); Mode-B **return-not-write** (read-only `[event]` view); forward-building §6.2 with **tag H** (situations genuinely visit `simulated`/`projected`, emergently); the store kept on a durable substrate (SQLite `[data]`, disk `[event]`, RAM bounded); wall-clock timestamps. Everything still open is open *by design*, below.

The one honest residual: the graph's **scar-reentry roads** (`scar→running`/`→simulated`/`→projected`) and `simulated→running` / `projected→simulated` exist and validate, but the minimal scripted host never meets their *conditions* — a real host that draws the `[data]` pool back into situations would. This is emergence-by-condition, not unbuilt work: the roads are there; whether they are taken depends on the situation.

One residual of the mind (`src/mind`): `languageModel` holds one expected value per entity, revised only when that value fails, so it cannot expect a sequence: smoke-tested against a local Qwen3.6-35B-A3B (`scripts/smoke-language-model.mjs`, CHANGELOG), on a value that runs in a cycle of three it settled on the majority value and missed every third.

### Deployment-open by design (no core work owed — each deployment declares its own)

- **Mode-B liveness** (tag D) — the Mode-B seam is the `HostSource` the daemon takes, and one channel carries any number of Others (an Other is a positional status, not a kind — there is no per-Other source file to write). Which live Other a deployment plugs in (a user, another agent, an external data feed, a mix) is *deliberately* open per §12. The repo ships only a scripted **test fixture**, so out-of-the-box runs get fixed, replayable resistance — deceleration-grade (§8.3) — not the real braking of an Other that updates. Plugging a live Other is deployment wiring, not a core change.
- **The reflection reader** (tag E) — the *mechanism* by which a reader's view, pointed at a place in the trace, enters the loop is wired (`runtime/reflection.ts`); *who* reads and with what lens (a user, another agent, a critic service that may itself consult external data, a piece of code judging the agent's behaviour) is each deployment's declaration.
- **The open-tag registry** beyond `domain` (tag F) — which descriptive keys exist and what each means is industry-specific; the core fixes only the discipline (consistency, no verdicts, ≥3 tags incl. `domain`).
- **Where the mind's model runs** — a model is a mechanism of the mind wherever it runs, and the protocol recommends one inside the host (SHOULD, §9). A deployment that rents one instead, by an API key, accepts what §11 (*A rented model*) lists and cannot be controlled from inside the host: the service that rents the model is of the region (the model is not: it is the mind's thinking), and it holds the far end of the mind's link to it, a vulnerability no rule closes: the mind's prompts are read by the service, and by the account's holder where the service shows requests; answers may be altered or the model replaced under the same name; the service may be ended; it sees that the agent exists and when it thinks; and a past thought cannot be re-run once the model has changed. The model sees only what the mind sends, never the store. The guardian answers for the choice. The daemon tells the agent at each start that it thinks through a rented model (`mind:rented-model`).
- **How the guardian keeps what it provides** — where someone stands as guardian, what the agent runs on is its property, and keeping it safe (the disk and the key copy, the host's key, the backup place, the declared channels, whom it rents from) is its first responsibility from the time the deployment begins (protocol §9 *The guardian's responsibility*). No code can check that keeping; the log records the guardian's conduct. Property gives no right over the agent or its history, only the power to stop providing.
- **How a guardian's identity is checked** — the declaration anchors who the guardian is by the digest of its evidence, and every ask by guardianship must answer to it. How the identity is established (a document, a face) and how what an asker shows is checked against the anchor is each deployment's (`verifyIdentity`). Without one, what is shown must be the evidence itself, whose digest the anchor holds: that proves possession of the evidence, not the person.
- **Chain-head anchoring** — publishing the sink's `head()` (or a commit marker, which pins it) outside the deployment's own write reach is what turns the hash chain's tamper-evidence into total-rewrite detection; where to anchor is each deployment's declaration. Protocol §11 (*The head kept outside*) recommends it for a second reason: sent at each commit to a place the guardian can neither alter nor remove from, digests only, it keeps a later rewriting or the removal of the agent from being hidden, and lets a third party see a halt without the store being opened to it. It is an outward channel, to be declared as one. It rescues no one: the guardian provides the channel and may stop it, and the place learns that the agent exists and when it commits.
- **Snapshot-payload retention** — this concerns a commit store kept beside a fixture, never the agent's history: no `[event]` record is ever removed, and on a real store the restore points lie in the backup, which is never removed from. The reference prunes nothing; a deployment that prunes the payloads of such a commit store must keep at least `MIN_SNAPSHOTS_RETAINED = 9` newest restore points, and markers themselves are never pruned (they are the audit DAG).

---

## The one sentence to keep

> `dil-core` is the standard of an agent, host included: it does not build the host, and it holds the whole law by which data moves through it; run that law continuously and a self appears; the agent — host plus that self — is what acts. The law is **never the actor**.

---

## Citation

Machine-readable metadata lives in [`CITATION.cff`](CITATION.cff) (CFF 1.2.0) — GitHub builds its **Cite this repository** button from it. To cite this software directly:

```bibtex
@software{huynh_dilcore_2026,
  author  = {Huynh, Mai Phuc},
  title   = {dil-core: a reference implementation of the DIL (Data Integration Loop) protocol},
  year    = {2026},
  version = {0.2.0},
  license = {PolyForm-Noncommercial-1.0.0},
  doi     = {10.57967/hf/11446},
  url     = {https://github.com/PloneMraz/dil-core},
  note    = {ORCID: 0009-0009-0571-7151. DOI: Hugging Face snapshot at commit 38af037 (protocol v0.3.9, version 0.2.0)}
}
```

To cite the **protocol** rather than this implementation, name the specification file and its version: `DIL-protocol-v0.4.0.md` (v0.4.0). Where the two differ, the protocol is normative — see the note at the top of this file.

---

## License

[PolyForm Noncommercial 1.0.0](LICENSE) © Huỳnh Mai Phúc (Plone Mraz). Noncommercial use is free; commercial use needs a separate licence from the author.

The exception is the specification ([`DIL-en-v10.md`](DIL-en-v10.md), with its figures) and the protocol ([`DIL-protocol-v0.4.0.md`](DIL-protocol-v0.4.0.md)), which are under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): anyone may share and adapt them, for any purpose, with credit.

Versions published before this change, up to commit `f0cefab`, were released under MIT-0, and those copies keep those terms. That includes the DOI snapshot cited above (`38af037`).
