---
title: 'Comic Translator'
date: 2026-09-21
lang: en
language: TypeScript
repo: https://github.com/PloneMraz/manga-translator
summary: 'An image translation tool for comics and manga that runs on your own device. The manual path works end to end; the automatic one is built but has never been run.'
---

# Comic Translator

An image translation tool for comics and manga. You give it pages; it finds
the text, translates it, and writes each page back out with the translation
set in place of the original.

It is built to run **on your own device** — as a desktop application and an
Android app — with no account, no server to start, and no network once the
models are cached. Using a hosted AI model is an option you turn on by
pasting your own API key, not a requirement.

---

## Status: not usable yet

This is an honest read of where the code is, so nobody wastes an evening.

**Works, and is verified:**

- `src/engine/` — the translation engine layer, with a hosted-AI engine
  (Gemini) and an on-device engine behind one interface.
- `BubbleDetector` — finds speech bubbles with no model download at all.
  Tested in a real browser: 3 of 3 bubbles at IoU 0.97–0.98, no false
  regions, ~110 ms on an 800×1200 page. Run `npm run test:detector`.
- `src/output/` — renders a page with its translations set in place, at the
  source resolution, and writes each approved page into the output folder.
  Tested in a real browser: the original text is gone, the translation is
  drawn, the artwork is byte-identical, and regions the user did not approve
  are untouched. Run `npm run test:render`.
- **The whole manual path.** Load a page, draw a region, type a translation,
  approve it, export it — and get that page back as a PNG with the text set
  in place. Driven end to end in a real browser by `npm run test:app`. This
  is the path that needs no model and no API key, so it is the one that must
  never break.

**Written but never executed:**

- The on-device reading and translation paths. They typecheck and bundle,
  but the models behind them have not been run, because they were written in
  an environment where `huggingface.co` is unreachable. First real run is
  still ahead.

**Does not work:**

- **Automatic translation has never actually run.** The engine layer is
  wired into the interface, but the on-device models were written in an
  environment where `huggingface.co` is unreachable, so nobody has yet
  watched them read a page. Expect the first run to need fixing.
- There is no desktop build and no Android build yet.
- The layout has no responsive breakpoints and will not fit a phone screen.
- `server.ts` still exists, and `npm run dev` still goes through it, although
  nothing in the app calls it any more.

So: you can already use this as a hand-lettering tool — load pages, translate
them yourself, export them, and the files are real. The automatic part is
built but unproven.

---

## How it is meant to work

1. You load between 1 and 100 images. Any image the browser can decode.
2. The app finds every text region on a page.
3. It reads the text, then translates it into the language you chose.
4. **You review the page.** Machine output is a draft; you fix wording,
   fonts, sizes and boxes by hand. Nothing is written out until you approve
   it. Even a rough translation is useful, because correcting is faster than
   typing from nothing.
5. Each page you approve is written out **immediately, as its own image**.
   Not zipped, not batched to the end.

The review step is the point, not an inconvenience. This is a tool for
someone who cares how the result reads.

### Output layout

Approved pages go into a dated folder under an output root you pick once:

```
Results/
└── output-20260920/
    ├── 001-page-one.png
    ├── 002-page-two.png
    └── ...
```

The folder can take the input's name plus `-translated` instead. Where the
platform allows it, the app writes into that folder directly: the File System
Access API on desktop browsers, the native filesystem in the desktop and
Android builds. Where it does not, each approved page arrives as its own
download.

---

## The two engines

You choose one; you can switch at any time.

### Offline — on your own device

No account, no key, no network after the first download. This is the default
and the priority.

| Step | What runs |
| --- | --- |
| Find text regions | `BubbleDetector`, classical computer vision, no download |
| Read the text | [`manga-ocr`](https://huggingface.co/kha-white/manga-ocr-base) via [ONNX build](https://huggingface.co/onnx-community/manga-ocr-base-ONNX) |
| Translate | [`opus-mt-ja-en`](https://huggingface.co/Xenova/opus-mt-ja-en) |

Everything runs through [Transformers.js](https://github.com/huggingface/transformers.js)
on ONNX Runtime Web, in the page itself.

**Its limits, stated plainly:**

- **Japanese to English only.** `manga-ocr` reads Japanese and nothing else;
  `opus-mt-ja-en` writes English and nothing else. Ask for another pair and
  the engine refuses and points you at the AI engine. It does not guess.
- **Sound effects drawn over artwork are missed.** The default detector finds
  light regions enclosed by line art — speech and thought bubbles. An SFX
  painted across a panel has no enclosing region to find. A trained detector
  behind the same interface will fix this; the slot is already there.
- **The translation reads stiff.** `opus-mt-ja-en` is a compact machine
  translation model, not a large language model. It gets the meaning across.
  It does not get the voice across. That is what the review step is for.
- Models are roughly 200 MB, downloaded once and cached.

### AI — your own API key

Pick a provider, paste a key. The request goes straight from your device to
that provider; there is no server in this app to relay it through, and the
key never leaves your machine except to the provider you chose.

Gemini is implemented. Any language pair works, and quality is markedly
better, because the model sees the whole page — who is speaking, what is
happening, panel order — rather than isolated strings.

Adding another provider is one file implementing `AiProvider`, plus a line in
`AI_PROVIDERS`. Nothing else in the app needs to know.

---

## Getting started

Requires Node.js 20 or newer.

```bash
git clone https://github.com/PloneMraz/Manga-translator.git
cd Manga-translator
npm install
npm run dev          # http://localhost:3000
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on port 3000 |
| `npm run lint` | `tsc --noEmit` |
| `npm run build` | Production bundle |
| `npm start` | Serve the production build |
| `npm run test:detector` | Run `BubbleDetector` in a real browser |
| `npm run test:render` | Render a page and check the result, in a real browser |
| `npm run test:app` | Drive the whole app end to end, in a real browser |
| `npm test` | All three |

`npm run dev` and `npm start` still go through `server.ts`, which is on its
way out. They will disappear once the UI talks to the engine layer directly.

### Configuration

Copy `.env.example` to `.env` if you want to use the AI engine from the
server path that still exists:

```bash
GEMINI_API_KEY="your-key"       # https://aistudio.google.com/apikey
GEMINI_MODEL="gemini-3.8-flash" # optional; any multimodal Gemini model
DEFAULT_TARGET_LANG="English"   # optional
```

None of this is needed for the offline engine, and none of it will be needed
at all once the engine layer is wired in — the key will be a field in the
app, stored on your device.

### Running the detector test

Playwright is deliberately **not** a dependency, because installing it pulls
down a browser. To run the test:

```bash
npm i -D playwright && npx playwright install chromium
npm run test:detector
```

Set `CHROMIUM_PATH` to reuse a browser you already have.

---

## Project layout

```
src/
├── engine/              the seam between the app and whatever translates
│   ├── types.ts         TranslationEngine — the whole contract
│   ├── ai/
│   │   ├── provider.ts  what a hosted provider implements
│   │   ├── gemini.ts    Gemini, over REST
│   │   └── index.ts     AiEngine + the provider registry
│   └── offline/
│       ├── bubbleDetector.ts   classical detection, no download
│       └── index.ts            Transformers.js OCR + translation
├── output/              rendering approved pages and writing them out
│   ├── renderPage.ts    cover the original, set the translation, encode
│   ├── destination.ts   a folder you picked, or one download per page
│   └── index.ts         folder and file naming
├── settings.ts          engine choice and languages, kept on the device
├── lib/
│   ├── image.ts         shared canvas helpers
│   └── regions.ts       fills in the fields an engine does not report
├── components/          the interface
├── types.ts             Page and Region
└── App.tsx              state and workflow
tests/
├── bubble-detector.mjs  browser test for the detector
├── render-page.mjs      browser test for the renderer
└── app-flow.mjs         end-to-end test of the whole manual path
server.ts                Express + Gemini — being retired
```

### One rule worth knowing before you contribute

**Engines never fabricate.** A failure throws an `EngineError` with a code. A
region the model skipped is left empty so the interface can show the original
text. Do not add a fallback that returns invented regions or translations: a
caller that cannot tell a failure from a result is worse off than one handed
an error. An earlier version of this code returned HTTP 200 with three
made-up Japanese speech bubbles whenever the API call failed, and that is
precisely the behaviour this rule exists to prevent.

---

## Roadmap

In the order it is being built:

1. ~~**Real export.**~~ Done: `src/output/` renders and writes pages.
2. ~~**Wire the UI to the engine and output layers.**~~ Done: engine picker,
   provider dropdown, key field, language selectors, and an Export button
   that writes a real page. `server.ts` is unused now and can go.
3. **A trained region detector**, exported to ONNX, so sound effects are
   found too.
4. **Desktop build** (Tauri) and **Android build** (WebView shell), from the
   same interface code.
5. **Rebuild the layout** so it works on a phone.

---

## Credits

This project is mostly an arrangement of other people's work:

- [manga-ocr](https://github.com/kha-white/manga_ocr) by kha-white — Japanese
  OCR built for manga, trained on Manga109-s. Apache-2.0.
- [Transformers.js](https://github.com/huggingface/transformers.js) and
  [ONNX Runtime Web](https://onnxruntime.ai/) — the reason any of this can
  run in a page with no backend.
- [OPUS-MT](https://huggingface.co/Helsinki-NLP/opus-mt-ja-en) by
  Helsinki-NLP, via Xenova's ONNX conversion.
- [comic-text-detector](https://github.com/dmMaze/comic-text-detector) and
  [manga109-segmentation-bubble](https://huggingface.co/huyvux3005/manga109-segmentation-bubble)
  — prior art for the detector, and the intended replacement for the
  classical one.

Check each model's own card for its licence and dataset terms before you ship
anything built on it.

## Licence

Apache-2.0. The full text is in [LICENSE](LICENSE), and every source file
carries an `SPDX-License-Identifier: Apache-2.0` header.

Translating a comic you do not hold the rights to, and distributing the
result, is your responsibility and in most places not lawful. This tool is
built for reading, study and work you are entitled to do.
