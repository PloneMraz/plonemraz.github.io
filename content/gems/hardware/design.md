---
title: 'Design'
lede: 'How the body looks and what it can express: concept art now; industrial design and expression to follow (plan ID)'
group: hardware
order: 106
lang: en
source: https://github.com/PloneMraz/GEMs/blob/HEAD/hardware/design/README.md
sourceRepo: GEMs
templateEngineOverride: md
---
How the body looks, and how it can show things — work package ID of
[`plan/`](/vault/gems/plan/#id--industrial-and-expressive-design).

| Path | Contents | Plan | Status |
|---|---|---|---|
| [`concept/`](/vault/gems/hardware/design/concept/) | The author's concept art, AI-generated with Google Gemini: the original visual idea of the body — a reference, not a blueprint | input to ID-1 | ✅ two images |
| `industrial/` | Industrial design: form, proportion, class-A surfaces, colour–material–finish, human-contact surfaces, renders | ID-1 to ID-4, ID-7 | 🔜 |
| `expression/` | Expressive capability: face geometry, the FACS action units to be actuated, range and speed per unit, gaze, the evaluation protocol | ID-5, ID-6, ID-8 | 🔜 |

**Industrial design** here means the discipline that decides how a manufactured
physical product looks and is handled — form, proportion, surfaces, colour,
material and finish, fit to the human body. **Expression** is the separate
discipline of what the body can show through movement: face, eyes, posture.
The two share one surface and are kept in one parent directory, but apart, so
that "how it looks" is never confused with "what it can express".

Neither specifies *when* or *why* the body expresses anything. That belongs to
the controller, which this repository does not specify
([README](/vault/gems/body/#scope-boundary)).

Concept art and renders are documents under `CC-BY-4.0` — for the AI-generated
concept art, only to the extent rights in it exist (see [`concept/`](/vault/gems/hardware/design/concept/#provenance-and-rights)); surface CAD, once it
exists, is a hardware design under `CERN-OHL-S-2.0` ([LICENSE.md](/vault/gems/license/)).
