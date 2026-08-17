---
title: 'SafeHouse'
date: 2026-03-24
lang: en
language: TypeScript
repo: https://github.com/PloneMraz/The-SafeHouse
summary: 'A personal AI companion that runs on your own machine and cares about how you are doing — not what you are building.'
---

# SafeHouse

A personal AI companion that runs on your own machine, reaches you on the channels you use, and cares about how you're doing — not what you're building.

## What is SafeHouse?

SafeHouse is not a chatbot. It's a companion that:

- Lives on your machine, not someone else's cloud
- Reaches out to you unprompted to check in
- Remembers who you are and how you like to talk
- Respects your boundaries (Do Not Disturb, topics you don't want to discuss)
- Monitors for emergencies and notifies your contacts
- Never brings up work unless you do

## How it works

```
You → Telegram  ─┐
You → Web App   ─┤
                  ↕
  SafeHouse Gateway (runs on your PC/VPS)
                  ↕
       Claude AI (via Anthropic API)
                  ↕
  personal-context.json  ·  SQLite history
  (your identity, preferences)
```

## Features

- **Personal context** — name, background, relationships, interests, boundaries, language preference
- **Custom companion name** — you decide who you're talking to
- **Proactive check-ins** — randomized, unprompted messages at intervals you control
- **Do Not Disturb** — configurable quiet windows with timezone support
- **Telegram** — primary messaging channel; companion reaches out and receives messages
- **REST API + WebSocket** — foundation for future web and mobile apps
- **Emergency contacts** — Tier 3 crisis auto-notifies contacts via Telegram and SMS simultaneously
- **Multi-provider AI** — Anthropic Claude (default), Google Gemini, OpenAI, and any OpenAI-compatible endpoint (Venice.ai, Ollama, local LLMs)
- **Browser setup UI** — 5-tab configuration interface; no terminal needed after install
- **System daemon** — runs 24/7 as a background service (launchd / systemd / Windows Task Scheduler)
- **Companion intelligence** — state tracker (crisis tier detection), long-term memory digest, wearable health webhook, knowledge base (CBT techniques, crisis protocols), protocol engine (auto-escalation)
- **Security Q&A** — identity verification before revealing sensitive info; CLI password reset
- **Email & calendar monitoring** — Gmail, Outlook, IMAP, CalDAV; health keyword alerts via Telegram
- **Twilio SMS & voice** — WorkloadAlert 3-stage escalation (agent mention → SMS → voice call); emergency SMS to contacts

## Setup

### Prerequisites

- Node.js ≥ 22.12.0
- pnpm
- A Telegram bot token (from [@BotFather](https://t.me/BotFather))
- An API key for your chosen AI provider

### Installation (VPS)

Upload the SafeHouse package to your VPS and run:

```bash
bash install.sh
```

This installs Node.js, builds SafeHouse, registers it as a system service, and prints the URL to open in your browser.

### Configuration

Open `http://YOUR-VPS-IP:3001` in a browser, log in with `admin` / `admin`, and fill in the Setup form. No manual JSON editing required.

To run locally for development:

```bash
pnpm install
pnpm build
npx tsx src/entry.ts start
```

## CLI Commands

```
safehouse start                     — start the companion
safehouse stop                      — gracefully shut down
safehouse status                    — health + active channels
safehouse config get <key>          — read a config value
safehouse config set <key> <value>  — update a config value
safehouse install                   — register as a system service
safehouse uninstall                 — remove the system service
```

## Roadmap

- **Phase 1 (complete):** Companion AI, Telegram, REST API, proactive check-ins, emergency contacts
- **Phase 2 (complete):** Browser setup UI, VPS one-command deployment, multi-provider AI, companion intelligence (state tracker, memory, knowledge base, protocol engine, health webhook), security Q&A, email/calendar monitoring, Twilio SMS/voice alerts
- **Phase 3:** Native mobile APK (real-time GPS, health sensors, push notifications), Live2D avatar, voice mode

## Philosophy

SafeHouse exists because most AI tools are built for productivity. This one is built for you.

Your data stays on your machine. Your companion belongs to you.

## License

MIT
