---
title: 'Software'
lede: 'Code that runs under Linux on the embedded computers: capture drivers, feature extraction and compression, sensor fusion, log synchronisation, link management'
group: software
order: 110
lang: en
source: https://github.com/PloneMraz/GEMs/blob/HEAD/software/README.md
sourceRepo: GEMs
templateEngineOverride: md
---
Code that runs under an operating system on the body's embedded computer — the
edge AI module, under Linux — as
[spec 07.1](/vault/gems/07-firmware-and-software/#71-the-division) defines
software. Which of its tasks are hard, firm or soft real-time is not decided
here but in [`../realtime_config/`](/vault/gems/realtime-config/).

| Module | What it is | Status |
|---|---|---|
| Capture drivers | Camera, thermal, LiDAR, microphone and SDR capture, timestamped on the shared time base (plan S-9) | 🔜 *waiting a target* |
| Feature extraction and compression | The ≥2:1 the link requires ([spec 05.4](/vault/gems/05-sensing/#54-aggregate-rate-against-the-link)) | 🔜 *waiting update* |
| Sensor fusion | Multi-rate, on a shared time base | 🔜 *waiting update* |
| Log assembly and synchronisation | Two tiers, synchronised off-board after an outage | 🔜 — port of [`../reference/audit_log.py`](https://github.com/PloneMraz/GEMs/blob/HEAD/reference/audit_log.py) |
| Link management | Graceful degradation before dropped streams | 🔜 *waiting update* |

No source yet. The executable specifications this code will be checked against
are in [`../reference/`](/vault/gems/reference/). Planned work, module by module:
[`../plan/software.md`](/vault/gems/plan/software/).
