---
title: 'Reference models'
lede: 'Executable specifications the on-body code is checked against: audit log, agency tagging. They run on no target'
group: resources
order: 100
lang: en
source: https://github.com/PloneMraz/GEMs/blob/HEAD/reference/README.md
sourceRepo: GEMs
templateEngineOverride: md
---
Executable specifications, in Python, that on-body code is checked against. They run on no target: they are neither firmware nor software as [spec 07.1](/vault/gems/07-firmware-and-software/#71-the-division) defines them, which is why they sit apart from both. A port — to a microcontroller in C, or to the edge module — is correct when it produces what these produce on the same input.

| Module | Reference for | Status |
|---|---|---|
| [`audit_log.py`](https://github.com/PloneMraz/GEMs/blob/HEAD/reference/audit_log.py) | The audit log of [spec 06.4](/vault/gems/06-audit-surface/#64-audit-log): record schema, hash chain, per-batch Merkle root, and the verifier the Main Controller and an assessor run. Ported by the firmware log writer (plan F-10) and the software log assembly (plan S-4) | ✅ with tests |
| [`agency.py`](https://github.com/PloneMraz/GEMs/blob/HEAD/reference/agency.py) | Body differentiation by efference copy ([spec 07.3](/vault/gems/07-firmware-and-software/#73-what-the-real-time-code-must-guarantee), guarantee 7; RSIL R2): each change tagged `BODY_CAUSED`, `HOST_REACTED` (a declared faculty acted) or `ENV_PUSHED`. Ported by the firmware agency stage (plan F-7) | ✅ with tests |

The design reasons for [`agency.py`](https://github.com/PloneMraz/GEMs/blob/HEAD/reference/agency.py) are in its module docstring.

Python 3, standard library only.

```bash
python3 -m unittest discover -s reference -v
```

## The audit log

The log's record schema uses the vocabulary of the RSIL contract it carries evidence for — an *emission* is an output event, and the *anchored* tier holds each emission's anchored context (spec 08.2). Those are field names of the contract, not names for components; the component is the audit log.

**On the body this log is a buffer, not the record** (RSIL §8.2–8.3). The record lives with the Main Controller. The body chains each record when it is made, signs it no later than its batch closes, and keeps it until the Main Controller has appended it and said so. The verifier is what the Main Controller runs on what arrives, before it appends, and what an assessor runs on the record afterwards.

Protocol requirements **C-4**, **C-8**, **C-9**, **C-12** and **C-19** carry evidence class **T** — an assessor reads the log and checks a property. That needs a defined format and a reader, or the class is unusable. This module is both; for C-8 it is the trace half, and the classification itself is [`agency.py`](https://github.com/PloneMraz/GEMs/blob/HEAD/reference/agency.py); for C-19 it is the chain and the batch signing, not yet the acknowledgement. For **C-3** and **C-6** it is only the record half: the body-datum they rest on has no reference implementation yet (plan S-10). [`protocol/assess.py`](https://github.com/PloneMraz/GEMs/blob/HEAD/protocol/assess.py) runs these checks for the [conformance record](/vault/gems/protocol/conformance-record/).

**The write path refuses what the specification forbids.** An emission without anchored context, a reflex that does not record the version and age of the field it ran under, an emission still marked `UNDECIDED`, a contact event with no measured amplitude, a sequence number out of order — each raises rather than being written. The error message names the clause.

**The verifier checks the same rules independently**, because a record can reach an assessor without having passed this write path — from a different implementation, or a broken one, or a hostile one. It reports findings rather than raising: `GAP`, `NO_CONTEXT`, `NO_FIELD`, `UNDECIDED`, `NO_AMPLITUDE`, `ROOT_MISMATCH`, `BATCH_INCOMPLETE`, `BAD_SIGNATURE`.

### Two structural choices worth naming

**Hash chain at full rate, signature once per batch.** A secure element signs tens to hundreds of times per second; the loop runs at 500 Hz across tens of channels. Chaining is cheap and continuous, signing is not, so the chain carries ordering and tamper-evidence while a Merkle root per window carries the signature. The batch period is the implementer's trade between trace granularity and signing load.

**An odd Merkle node is promoted, not duplicated.** Duplicating the last node would let two distinct batches produce one root — so a batch could be rewritten under a signature that still verifies. There is a test for this.

### What it does not do

It does not choose a signature scheme. `sign` and `verify` are callables you supply; the module fixes *what* is signed and *when*, never *how*. The specification leaves the scheme open, and a reference implementation that picked one would be inventing a constant the reasoning does not fix. The tests use HMAC because a test needs *something*, and it is named as a test key, not a scheme.

It also does not judge. A log that verifies clean says the record holds together — nothing about whether the body behaved acceptably. There is a test asserting exactly that: a contact event logging 400 N for thirty seconds verifies without a single finding. Whether that was acceptable is a third party's question, as [protocol §10](/vault/gems/protocol/conformance/) states.
