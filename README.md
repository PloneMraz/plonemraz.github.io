# Plone Mraz

Personal site and open document vault of **Huỳnh Mai Phúc** (Plone Mraz) — independent
researcher, Vietnam.

- **Site** — <https://plonemraz.github.io>
- **ORCID** — [0009-0009-0571-7151](https://orcid.org/0009-0009-0571-7151)
- **Contact** — <plone.mraz@gmail.com>

Source of <https://plonemraz.github.io>: a static front page plus a vault of papers,
essays, specifications and project pages, built with [Eleventy](https://www.11ty.dev/) 3
and deployed to GitHub Pages by GitHub Actions.

This file is about the repository — how the site is put together and how to change it.
What the site says is on the site.

---

## Quick start

Requires Node.js (CI builds with Node 20).

```sh
npm ci          # install Eleventy and eleventy-img
npm run dev     # build and serve with live reload (Eleventy default: http://localhost:8080)
npm run build   # one-off build into _site/
```

`_site/` and `node_modules/` are gitignored; never commit build output.

## How the site is built

The site has two halves, and they are built differently.

- **Front page — `index.html`.** Hand-written, self-contained, and copied to the output
  **verbatim**. Eleventy ignores it as a template, so it gets no layouts, data or
  Nunjucks. Edit it directly.
- **Everything under `/vault/`**, plus the generated files at the root, is built by
  Eleventy from `vault/`, `content/`, `_data/` and `_includes/`.

Both halves read `theme.css` and share the `ui-lang` key in `localStorage`, so the
EN / VI choice a visitor makes on one half carries over to the other.

All configuration lives in [`eleventy.config.js`](eleventy.config.js): passthrough
copies, ignores, collections, filters and the `photo` shortcode.

## Repository layout

```
index.html            Front page, copied as-is (not a template)
theme.css             Colour tokens, dark-only; shared by both halves
eleventy.config.js    Build configuration
package.json          Scripts: dev, build

vault/                Section index pages and paginated templates (papers, albums, books)
content/              Source content, one folder per section (see below)
_includes/            Nunjucks layouts and partials
_data/                Global data: site metadata, paper list, abstracts, UI strings, ...
assets/vault.css      Styles for the vault
visual/               Logos, icons, profile pictures, images used inside posts

404.njk               /404.html
feed.xml.njk          /feed.xml
sitemap.xml.njk       /sitemap.xml
robots.txt.njk        /robots.txt
search.json.njk       /search.json — index for the vault's search box
llms.txt.njk          /llms.txt
google*.html          Search-console verification, copied under its exact name

.github/workflows/deploy.yml   Build and deploy to GitHub Pages
```

## Content sections

Each folder under `content/` is one section. Its directory data file (`<folder>.json`)
assigns the layout, the `section` key and the permalink, so a new file needs only its
own front matter.

| Folder | Section | Layout | URL | Order |
|---|---|---|---|---|
| `content/blog/` | Essays | `post.njk` | `/vault/blog/<slug>/` | newest first |
| `content/fiction/` | Fiction | `post.njk` | `/vault/fiction/<slug>/` | newest first |
| `content/gems-space/` | Gem's Space | `gem-post.njk` | `/vault/gems-space/<slug>/` | newest first |
| `content/vibe-coding/` | Vibe Coding | `project.njk` | `/vault/vibe-coding/<slug>/` | newest first |
| `content/gems/` | GEMs | `gems-doc.njk` | `/vault/gems/<path>/` | by `group`, then `order` |
| `content/corpus/` | Papers (PDFs) | — | `/corpus/<file>.pdf` | as listed in `_data/papers.json` |
| `content/p's gems/` | P's Gems (albums) | — | `/vault/ps-gems/<album>/` | alphabetical |
| `content/books/` | Books | — | `/vault/books/<book>/` | alphabetical |

The section index pages live in `vault/`: `index.njk` (the blog, served at `/vault/`),
`fiction.njk`, `gems-space.njk`, `vibe-coding.njk`, `gems.njk`, `papers.njk`,
`ps-gems.njk`, `books.njk`, `about.njk`.

## Adding content

### A post (Essays, Fiction, Gem's Space)

Drop a Markdown file into the section's folder:

```yaml
---
title: 'Title'
date: 2026-09-23
lang: vi               # or en
summary: 'One or two sentences, used in lists, search and the feed.'
tags: [some-tag]
---
```

The slug comes from the file name. Images for Gem's Space posts live in
`visual/gems-space/`.

### A project page (Vibe Coding)

A snapshot of a repository's README, with extra front matter:

```yaml
---
title: 'Project name'
date: 2026-09-21
lang: en
language: TypeScript
repo: https://github.com/PloneMraz/<repo>
summary: '...'
---
```

Relative links in the snapshot (`LICENSE`, `src/...`) would 404 on the site; the
`repoLinks` filter rewrites them to `<repo>/blob/HEAD/<path>`.

### A GEMs chapter

GEMs is a document, not a feed. Chapters are ordered by `group`, in the sequence
defined in `_data/gemsGroups.json`, and then by `order` inside each group. Dates play no
part. Subfolders are allowed: a file's path under `content/gems/` becomes both its URL
and its depth in the table of contents.

```yaml
---
title: 'Architecture'
lede: 'One-line subtitle'
group: overview        # a key from _data/gemsGroups.json; unknown keys sort last
order: 20
lang: en
source: https://github.com/PloneMraz/GEMs/blob/HEAD/spec/01-architecture.md
---
```

Chapters are copied verbatim from the GEMs repository and link to each other by
`#anchor`. To keep those links alive, `eleventy.config.js` gives every heading an `id`
built with GitHub's slug rule (`6.4 Emission log` → `64-emission-log`, duplicates get
`-1`, `-2`). Do not change that rule without checking the cross-links.

### A paper

1. Put the PDF in `content/corpus/`. It is published at `/corpus/<file>.pdf`, the URL
   kept from before the move into `content/`, so outside links still work.
2. Add an entry to `_data/papers.json` with `slug`, `group` (`programme`, `overview`,
   `specs` or `applied`), `title`, `pages`, `pdf` and `doi`. Programme papers also
   carry `code` and `asks`.
3. Add the abstract to `_data/abstracts.json`, keyed by the same `slug`.

`vault/paper.njk` generates one page per entry at `/vault/papers/<slug>/`.

### An album or a book

No declaration is needed; `_data/albums.js` and `_data/books.js` scan the folders at
build time.

- **Albums:** `content/p's gems/<Character>/` is one album. Images can sit directly in
  it or in subfolders, and each subfolder becomes a named group. The `photo` shortcode
  resizes each image with eleventy-img into two WebP widths (400 px for the grid,
  2000 px for the lightbox). The originals are not published.
- **Books:** every file in `content/books/` becomes a downloadable entry. An optional
  `content/books/books.json` maps file names to `{ "title", "description" }`. The folder
  does not exist yet, so the Books section is currently empty.

## Interface strings and languages

The vault is bilingual. Navigation and label text lives in `_data/ui.json` as
`{ "en": ..., "vi": ... }` pairs. Pages render both languages, marked with `data-l`,
and CSS hides the one that does not match `data-ui-lang` on `<html>`.

## Deployment

Every push to `main` triggers [`deploy.yml`](.github/workflows/deploy.yml), which runs
`npm ci` and `npm run build` on Node 20, uploads `_site/` as a Pages artifact and
deploys it. The workflow can also be started by hand (`workflow_dispatch`). A newer run
cancels one that is still in progress.

## Analytics

Both halves load the [Umami](https://umami.is/) script. The vote widget
(`_includes/vote.njk`, with its script in `base.njk`) sends each vote as an Umami event
and remembers the visitor's own choice in their browser's `localStorage`. The site has
no backend of its own.

## Citing the papers

Cite by DOI, which is listed on each paper's page. The PDFs in `content/corpus/` are
mirrors kept for direct reading, and the figshare records hold the version history.

## License

[MIT](LICENSE) for the code in this repository. The papers are distributed under the
terms recorded on their respective figshare records.
