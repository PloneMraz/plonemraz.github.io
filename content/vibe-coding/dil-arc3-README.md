---
title: 'dil-arc3'
date: 2026-11-03
lang: en
language: Python
repo: https://github.com/PloneMraz/dil-arc3
summary: 'An ARC-AGI-3 agent whose whole operation is the DIL protocol. Not a solver with a protocol wrapped around it: the protocol is the mechanism, and what the loop did can be read back from its record.'
---

# dil-arc3

An [ARC-AGI-3](https://arcprize.org/arc-agi/3/) agent whose whole operation is
the DIL protocol.

Not a solver with a protocol wrapped around it. The protocol *is* the mechanism:
there is no decision procedure underneath that DIL decorates, and no step where
the agent leaves the loop to think.

## Status, plainly

It runs, with one mind, which learns from nothing; its model is the computing it
learns with, an inducer (below). What it has done — the scored submissions, and
every run — is in `LOG.md`, with the code each ran; this file says only what the
agent is.

In the code, the mind holds its learning — `Mind(inducer, organs, priors)` —
and its model's seat takes the inducer, so a model seated there changes how it
computes, never whether it learns.

**Goal and aim.** A goal is an instruction from outside; the aim is the mind's
own, and there is always one (Plone, 2026-09-28). The mind's aim takes the
goal's value when a goal is given; when none is, it holds its own: that the
region reports something other than what it reports most, in a state it has
not ended in. No model has an aim: the mind tells its model what it computes
for.

**What it is told.** Its store holds, before it lives, two things, each as host
data stamped `prior`: what its mind is told (`prior:mind-task`, this project's
own words — the goal, to get through the levels, said as what the region will
report when it is met; and the words a language model is asked in, which name
no game); and the competition's published rules, quoted. The mind recalls the
first itself; the rules are recalled by T3 on a cue, as the protocol does.

The language model's earlier form — which submission `56588469` ran: it wrote
`predict`, `propose` and a `GOAL` of its own, and sat in the place of the mind's
learning — is gone; `3b31806` keeps it (LOG.md).

## The four roles

Settled deliberately, with Plone.

| role | what it is | in this repo |
|---|---|---|
| **DIL** | the operating mechanism of the whole — how information moves; its store is the agent's history: what it had before it lived (`prior`), what it met, and what its mind wrote — `[data]` its memory, `[event]` the record it reads and never alters | `src/dil/` |
| **host** | its sensory organs take in what the region returns and carry it inward; its effectors carry out the mind's command; it declares both to the mind. **Computes nothing and weighs nothing.** | `src/arc3/frame.py`, `action.py`, `host.py`, `observe.py`, `command.py`, `organs.py`, `prior.py` |
| **model** | the mind's computing, inside it — not a second mind — and replaceable: an inducer the mind learns with — grid, or a language model. The **mind** is **one** and neutral about its region: it learns, reads, expects, is curious and wants, holds an aim, and constructs the next action; commands it as T5's test. **Acts on nothing.** | `src/mind/` (`mind.py`, `learning.py`, `models/`); `src/arc3/task.py` |
| **self** | what the loop produces when it runs (§7) — a law, located in no file. Its behaviour is the host's acting under the mind's command. | none: the word is not used in the code |

Outside all four is the **world** (`src/world/`): the region the agent acts on,
and an onlooker, an Other who sees it act and says what it sees (tag E). The host
touches the region and hears the onlooker; it holds neither.

The line that matters: **the mind acts on nothing; it commands, and the host
carries the command out through its effectors.** The mind constructs the next
action toward getting through the level and commands it as T5's test (§6.4); the
host carries it out, or, with no command it can carry out, waits. What judges a command is the region's return,
which scars the experience or hypothesis the expectation came from when it does
not hold. What else the mind sends out is a
question to its own memory: a store query, by cue, that it chooses itself
(§6.4). The query is traced like any emission, so what the
mind read is in `[event]`. What it writes, it writes as data (§9 `nascent`), with
what it was built from.

**Seeing is the host's; computing is the mind's.** The host takes the grid in as
the engine returns it; working out what is in it is the mind's computing.

## What the mind is

One mind, neutral about its region (`src/mind/mind.py`), learning with a model:
the part of it that computes (Plone, 2026-09-27). What the mind is — its
learning, curiosity, want and expectation — stays whatever its model; replacing
the model changes how well it computes, not what it is (Plone, 2026-09-28). It
learns from nothing, with no weights and no text. Submission `56623380` ran it
before its learning was moved out of the model (code `f76ff5f`; LOG.md,
2026-09-28).

**Learning is the mind's; an inducer computes for it** (Plone, 2026-09-28).
The loop is the mind's and names no task (`src/mind/learning.py`): it keeps
every step as experience, holds what an experience suggests as a hypothesis,
written as data built from the step, expects from the hypothesis that fits the
store best, which holds that expectation and is scarred when the region returns
otherwise, weighs each hypothesis by how often the region bore it out (held
while right more often than wrong; of those that apply, the one right at the
highest rate is expected from), and chooses by the paths it knows and by
curiosity — what it knows least. The inducer is replaceable and only computes:
what a state is to it, what can be done in one, what an experience suggests past
itself and what a hypothesis predicts. What an experience itself says — this act
from this situation gives that — is the mind's own, from its memory. Each
inducer stands on its own. There are two (`--inducer`):

- **grid** (`src/mind/models/grid.py`) reads a grid — the clock a region keeps
  whatever is done, the things an act may be put on — and suggests hypotheses
  that reach past where they were met: "this act changes nothing" (for an act that takes a place, on that
  colour), or "this act rewrites, in each part of the grid it changes, L into
  R", each part found on its own wherever L lies, one place only. When the aim
  comes it suggests what brought it: "this act, taken where these cells lie,
  brings the aim" — the cells the act was to change, or the thing it was put on,
  with what lay around them — which the mind carries to the next level (S4).
  Once the aim has come, and only then, it also reads what moved ("this act
  moves this thing by so much"), what blocked it, and an aim of no one act: a
  thing moved into cells of these colours.
- **language** (`src/mind/models/language.py`) is a served language
  model. Asked only when no hypothesis the mind holds foresaw a step, and shown
  the recent steps, it writes one program:
  `predict(grid, action, x, y)`, a hypothesis that applies wherever the region
  stands, and, if it can, `where(grid)` and `targets(grid)` — where the region
  stands, and where an act that takes a cell is worth putting: its reading of
  the grid. All that reads the grid is the model's; code keeps only a record
  beside it, a state's hash. What it is told is the
  task prior's words, which name no game, filled with what the host declares of
  the region and with the aim the mind holds. Each answer is kept whole in the
  store, built from the prior. Not run against a served model, and not used for
  ARC-AGI-3 for now (Plone, 2026-09-28).

Curiosity counts how often a kind of act reached a situation not met before
(S2b). An act that takes a place may be put on any thing the inducer sees — a
region of one colour, every one — and its kind is the thing's colour first,
then its size, so what a colour did carries to a thing of it at another size; five other laws — a change (S2), somewhere new then a change (S2c), the
two added (S2d), something made not made before (B1, `made`: what a step
made is the model's to say), and T1 (`test`: each command tests the expectation
that least says what will come, no count of outcomes sought) — are kept to be
measured against it (`--curiosity`). With
`--attention` (off by default), what an act did is read not from everywhere but
from the sixteen situations most like where the mind stands, each weighed by how
alike — the inducer says how alike two states are — and the choice names the
experiences it went by. An
untried act its hypotheses say leads where it has stood is tried last, after the
acts it cannot foresee here and the ways to them elsewhere — never out of reach,
or the hypothesis could never be refuted.

**What it expects, and what a collision does.** Where nothing it knows says
what will come, it first recalls what the same kind of act did where it stood
in states alike, and expects that again; failing that, it expects the region to
be otherwise than it was — to act is to expect it to tell, so silence is a
mismatch. Every state it expects is expected as it reads it: what its model does
not read (a clock) is expected nothing of. A mismatch is not a penalty or a
score; it is data that deviates from what was expected, and it turns the mind:
on a step, silence turns its next choice from that kind of act and an answer
other than it foresaw turns it to where the answer differed; on the region's
report, an end turns it from the kind of act that led there. Each turn is a
thought written as data, built from the return that collided, and the choice it
turned names both (`scripts/chains.py` finds these chains in a store alone).

**The field, and the individual.** The mind votes on the field as every layer
does, from what it alone sees — on exploration, whether the region came where
it had not stood; on trust, whether what its memory named was borne out — and
reads it back in the counts it works by (how often an expectation must be borne
out, how long a turn holds, how far it looks ahead), each a whole number that
follows the field on average. The field carries its own history (`FIELD_CARRY`),
so the same DIL, born in another field or meeting the region with or without the
Other, becomes another individual, and where it parts is read back from the two
stores (`scripts/differ.py`). An act is opaque to the mind: what an act is, the
host declares in its organs, and the mind only asks.

`[data]` is the agent's memory, and what a model computes from, the mind
reads there: what came in a cycle is in hand in that cycle, and from the next it
is read from `[data]` through T5's view — the states the mind has stood in,
each hypothesis's form (restored by its inducer from its datum), the recent
steps when the model looks at them. Each cycle's
reads are a `read` line in `[event]`, and what is written from them names them
among what it was built from.

**A pretrained language model, used as it is, and the program it writes.** The
model is not trained here and does not hold the region: what it knows of one is
what the mind shows it, and what it produces is a program, which the mind's
learning then weighs against the region like any hypothesis. Three constraints
shape that, and each is met:

- the scored games are unseen, so foreign weights would predict the wrong world
  — the model does not predict the world; it writes a program from this game's
  own evidence, and the program is what is tested;
- Kaggle's evaluation session has no network — the model is served offline, from
  a Kaggle Models mirror checked file by file against Hugging Face's hashes;
- INV-5: "refeeding the whole game history into a context window each step is a
  load, not an accrual" — the model is shown the recent steps, as many as
  T5's window, never the whole history; and it is asked only on a step no
  hypothesis the mind holds foresaw.

`dependencies = []` holds: the model is reached over HTTP with the
standard library.

## Findings

Porting DIL from [dil-core](https://github.com/PloneMraz/dil-core) and running it
against a live environment turned up more about the protocol than about
ARC-AGI-3. These are the substance of the work rather than a side effect of it,
and they fall into three kinds — which is worth keeping straight. Each says what
holds now; how it was found, and the measurements, are in `LOG.md`.

### Channels the protocol requires, which an implementation can leave undrawn

The topology has channels an implementation can build and never draw on, and
nothing in running it shows one is dead until it is traced. Five are drawn on
now, in dil-core first and then here.

1. **The store is read back.** §9 has the self accrue from scars. A scar
   returns to `running` when it is used again — an expectation it is, or a
   recall — and `[event]` records each `scar → running`. §10's
   resistance-retrieval channel is the record's view: open to the mind's rule
   every cycle, never a switch, each read recorded (`read-record`, protocol
   v0.3.9). Recollection, one law over it, is not the mind's: as a predictor it
   loses (6).
2. **The field reaches every layer, and every layer reads it.** INV-7 has it
   reach every layer as background — "same data plus a different field yields
   different meaning". It carries dispositions, never what was read (DIL-en-v9
   §2: "how to read, never what is read"): three axes, the specification's own
   examples — `trust`, `alertness`, `exploration`. Each layer reads the one that
   bears on its operation and shifts a declared threshold or gain by ½ to 1½:
   the declared value when the field has not leaned, never nothing, so the
   field biases and never annuls. Appraisal and forward-building read it too.
   Confidence it never touches, since §13.4 reads a confidence that fails to
   rise as a reloaded self. Which layer reads what is declared
   (`dil/loop/decisions.py`, `FIELD_WIRING`).
3. **Contributions blend.** "Every layer contributes to it as one competing
   parameter; contributions blend, never last-write-wins." Every layer votes on
   an axis from what it alone sees — whether the region spoke, how much it
   pushed, how much was new, how much mismatched or fell silent; each axis is a
   convex blend of the cycle's votes, taking effect the next cycle, and one no
   layer voted on carries over. Here the field before takes part in the blend
   too, by a carry this host declares (0.95; dil-core's `FIELD_CARRY`, 0 by default), so the field holds the loop's
   history and not one cycle's votes alone.
4. **T8 closes back into the loop through the field.** §6.2: "T8 closes back
   into the loop, not into a sink"; the meaning-channel cannot carry its output
   down, so T8 votes on the dispositions the layers below it read — `trust`,
   which T4 and T6 read, as the parent specification routes its feedback, and
   `exploration`. Every scar's context anchor records the field it was met under.
5. **What is admitted is asked for.** Host data enters through the tagging-gate
   stamped `prior`, and §9 has it move to `running` "once it has run". T3 asks
   the store with the description of each kind of arrival on the open-tag keys
   (§6.4: "T3 emits a *query*") — once, unless the field leans to explore, when
   it asks again one asked `T3_REASK_AFTER` cycles ago or more (16, shortened as
   exploration grows); the answer comes back through T1,
   runs every layer, and moves `prior → running`. Recalled on a cue, never
   poured in.

### A property of the protocol's own design

6. **The scars are a biased sample, by construction.** §9 moves to `scar` only
   what met a mismatch, so the scars are the region's *surprises*. Asked to
   predict, they lose to a model of what usually happens — an exception loses to
   a distribution. No verdict is involved anywhere: §9 is explicit that a scar
   "carries no claim of correctness". This is not a defect to fix; it is what a
   record of collisions *is*: right for driving change, wrong for answering what
   happens next.

### Gaps in this agent

7. **What brings the aim reaches only where the same cells lie again.** The grid
   inducer's hypothesis about the aim applies where every part it names lies —
   the cells the act was to change and the ring around them — exactly. A level
   drawn otherwise, with the same thing in another setting, is not met by it.
8. **What the onlooker says reaches no further than the acts it names.** It
   strikes the mind as a collision, and the mind answers there and then — it
   objects to the named acts where they were taken and commands again before
   the host acts. It learns nothing wider from being told: an objection is
   held while the onlooker says it and lifted when it stops.
9. **The language model's prompt does not show the field.** The field reaches
   the mind at T5 and conditions it whatever its model: its alertness bounds how
   often in a cycle the mind hands a mismatch to its learning to think on, and
   the learning reads it in the counts it works by and in how far an objection
   reaches; a language model is not shown it — neither the earlier form nor the
   language inducer — so what it writes is not conditioned by the loop's
   disposition.

Local to this repository, not upstream's.

## Running it

Requires Python 3.12+. No dependencies.

```sh
# tests
uv run --with pytest python -m pytest tests/ -q

# an environment with the game engine, on Python 3.12 (Kaggle's): this
# repository's own .venv, made with uv and the starter kit's pinned packages
PY=.venv/bin/python

# a live game, the mind learning with the grid inducer
$PY scripts/run_game.py ls20 600 --inducer grid

```

Playing a game needs the ARC-AGI-3 environment, which is not vendored here: point
the host at an environment exposing `reset()` and `step(action, data)` and hand
it the engine's action class. `scripts/kaggle/build_dil_run.py` builds the Kaggle
notebook that runs it, on CPU.

```python
from arc3 import admit, transducers
from arc3.host import create_source, declaration
from arc3.organs import ARC_ORGANS
from arc3.task import TASK_CUE
from mind.mind import Mind, mind_rule
from mind.models.grid import GridInducer
from arc3.command import carry_out

mind = Mind(GridInducer(ARC_ORGANS), ARC_ORGANS, priors={"task": TASK_CUE})
```

`scripts/run_game.py` shows the whole wiring; `src/arc3/decisions.py`
records what this host declares for the protocol's deferred constants.

## Layout

```
src/dil/          the protocol — invariants, the eight-layer loop, the store,
                  the runtime, the conformance checker. Knows nothing about
                  ARC-AGI-3.
src/mind/         the one mind, neutral about its region; its learning
                  (learning.py); the models it learns with (grid, objects,
                  language, which holds what a served language model
                  needs). Imports nothing from arc3.
src/arc3/         the host, its declared organs, and what the mind is told.
src/world/        what lies outside the agent: the region it acts on, served to
                  a game's own process in a scored run, and the onlooker.
spec/             the DIL protocol and the specification it derives from,
                  copied from dil-core with their provenance.
scripts/          the measurement and run scripts behind every figure here.
CLAUDE.md         the working rules: the roles, declarations and constraints in
                  force, and the competition's rules.
LOG.md            the history: every measurement, the designs replaced, the
                  corrections made along the way.
```

History — the measurements behind this README, the designs it replaced and the
mistakes made on the way — is in [LOG.md](LOG.md).

## Licence

[MIT-0](LICENSE). No attribution required.
