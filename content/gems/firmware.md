---
title: 'Firmware'
lede: 'Code that runs directly on the microcontrollers, bare metal or RTOS: joint control, battery management, secure boot and attestation, low-power beacon — and the real-time controller''s balance, reflex and supervisor modules if D-3 makes it a microcontroller'
group: software
order: 100
lang: en
source: https://github.com/PloneMraz/GEMs/blob/HEAD/firmware/README.md
sourceRepo: GEMs
templateEngineOverride: md
---
Code that runs directly on the body's microcontrollers, bare metal or under an
RTOS — joint drive boards, the battery management board, the secure element,
the beacon radio, and the real-time controller if decision D-3 makes it a
microcontroller — as [spec 07.1](/vault/gems/07-firmware-and-software/#71-the-division)
defines firmware. Which of its tasks are hard, firm or soft real-time is decided
in [`../realtime_config/`](/vault/gems/realtime-config/), not here.

| Document | Contents | Status |
|---|---|---|
| [`ARCHITECTURE.md`](/vault/gems/firmware/architecture/) | Modules and the deadline each carries, the reflex budget split across stages, and the firmware/software interface | ✅ |
| Source | — | 🔜 *waiting a target* |
| Reference models | Executable specifications the ports are checked against — in [`../reference/`](/vault/gems/reference/) | ✅ |

## Why there is no source yet

Firmware is written against a processor, a bus and a set of drivers. The bus
is chosen — EtherCAT for the joint chain, CAN FD for distributed sensing — and
so is the perception compute, in
[`../hardware/electrical/`](/vault/gems/hardware/electrical/). The **real-time
processor is not**: the Jetson-class module carries perception and
compression, not the 500 Hz balance loop or the 10 ms reflex path, and nothing
has been chosen for those. The specification's `⟦IMPL⟧` constants that firmware
would encode (joint current loop rate, permitted timestamp skew, thermal
envelope) depend on that choice and on the drive electronics.

Source written before that would be inventing the target, which is the one thing
this repository does not do. What *can* be written without a target is the
architecture: which module carries which deadline, how the 10 ms reflex budget is
divided, and what crosses the line into software. That is
[`ARCHITECTURE.md`](/vault/gems/firmware/architecture/).

## What must be decided before source

| Decision | Blocks |
|---|---|
| Real-time processor and RTOS, or bare metal | Everything |
| Bus topology | Timestamp skew budget, loop rates |
| Actuator driver interface | Current loop, joint telemetry format |
| Secure element part | Attestation agent, signing throughput |
| Low-power radio part | Beacon duty cycle |

Each of these is an `⟦IMPL⟧` in [spec
09](/vault/gems/09-open-constants/) — open because it depends on choices not yet
made, not because it was overlooked. The work that follows from them, module by
module, is listed in [`../plan/firmware.md`](/vault/gems/plan/firmware/); the parts that
do not depend on a target can be written now and run in simulation.
