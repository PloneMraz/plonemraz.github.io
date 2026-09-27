---
title: 'GEMs platform specification'
lede: 'Platform specification — the capability envelopes and their derivations'
group: overview
order: 2
lang: en
source: https://github.com/PloneMraz/GEMs/blob/HEAD/spec/README.md
sourceRepo: GEMs
templateEngineOverride: md
---
This is the body's side of GEMs: what it consists of, what it can do, and what
each capability costs. It does not specify the controller that operates the body
(see [Scope boundary](/vault/gems/body/#scope-boundary)).

The specification declares **envelopes and trade-offs**, never a chosen
operating point. Structure, actuation and energy sit on one coupled loop, so
fixing any single figure fixes the rest; the point on that curve is chosen by
whoever runs the body, not here.

## Chapters

| # | Chapter | Site group | Contents |
|---|---|---|---|
| 00 | [Scope and acceptance criteria](/vault/gems/00-scope-and-criteria/) | overview | What must be true of anything in this specification, and the notation |
| 01 | [Architecture](/vault/gems/01-architecture/) | overview | The invariant pillar, and the application frame it serves |
| 02 | [Structure and motion](/vault/gems/02-structure-and-motion/) | hardware | Mass loop, convergence condition, protection, reach and payload, peak power |
| 03 | [Energy](/vault/gems/03-energy/) | hardware | Sources, the six levers, state levels, docking, quiescent power and sleep ceiling |
| 04 | [Shell](/vault/gems/04-shell/) | hardware | Programmable stiffness, self-healing, colour, and the three-layer division |
| 05 | [Sensing](/vault/gems/05-sensing/) | hardware | Per-channel envelopes, aggregate rate, and the on-body/off-body compute split |
| 06 | [Audit surface](/vault/gems/06-audit-surface/) | hardware | Attestation, audit log, low-power beacon, contact amplitude |
| 07 | [Firmware and software](/vault/gems/07-firmware-and-software/) | software | What runs on the body: responsibilities, rates, guarantees, and link-loss behaviour |
| 08 | [Platform contract](/vault/gems/08-platform-contract/) | protocols | What an external processing loop requires of a body, and where this body supplies it |
| 09 | [Open constants](/vault/gems/09-open-constants/) | resources | Values deliberately left unfilled, and why |
| — | [Glossary](/vault/gems/glossary/) | resources | Technical terms, their standard sources, and repository terms still to review |

## Reading order

Chapters 00 and 01 set the terms; read them first. Chapters 02, 03 and 05 are
mutually dependent — mass determines power, power determines endurance,
endurance determines mass — and each states where it hands off to the others.
Chapter 07 states what the on-body stack must do; chapter 08 is the one to read
if you are checking this body against an external specification rather than
building it.

> **Note**
>
> **Nothing specified here has been built.** There is no money behind this work
> to buy parts with, so every figure in these chapters is derived or cited and
> none is measured on hardware. See the [repository README](/vault/gems/body/) for
> what that does and does not mean.

## Status

All ten chapters are written. Every capability cluster is closed: no chapter is
still at the level of a sketch.

The conformance protocol that turns chapter 08 from a map into a test lives
in [`../protocol/`](/vault/gems/protocol/), in draft at v0.1, together with an
assessment of this repository's simulated body against it.
