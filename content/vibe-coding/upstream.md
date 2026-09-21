---
title: 'Upstream contributions'
date: 2026-09-21
lang: en
summary: 'Seven forks of other people’s projects, and what they are for. Each one is a workbench for a change meant to go back to the project it came from — not a copy kept for private use.'
---

There are forks on my GitHub account of projects I did not write. This page
says what they are for, because a fork on its own says nothing: it looks the
same whether someone is contributing to a project, keeping a private patch, or
did nothing at all.

## What the forks are

Each one is a **workbench**, not a product. The working pattern is the same
every time: fork the project, take one issue, do the work on its own branch,
and open a pull request back to the project it came from. The fork exists
because that is how GitHub requires the work to be staged. It is not a
separate version of the software, it is not maintained, and nothing here is
offered for anyone to install.

The code is written with **Claude Code**, and that is worth stating rather
than leaving to be inferred. What it does not change is the part that
decides whether a change is worth anything: reading the issue, reading the
surrounding code, deciding what the fix actually is, and being answerable for
it in review. A maintainer reviewing a pull request is owed a change someone
understands and will defend.

## How to read one of these forks

A fork carries every branch of the project it came from, so most of what you
see in the branch list is not mine. My own work sits on separate branches —
usually one branch per issue. The default branch is generally left tracking
upstream.

## The projects

| Project | What it is |
|---|---|
| [WebdriverIO](https://github.com/webdriverio/webdriverio) | Browser and mobile automation framework for Node.js |
| [Trilium](https://github.com/TriliumNext/Trilium) | Hierarchical note-taking application |
| [Joplin](https://github.com/laurent22/joplin) | Note-taking and to-do application with sync |
| [Zettlr](https://github.com/Zettlr/Zettlr) | Markdown editor for writing and research |
| [Super Productivity](https://github.com/johannesjo/super-productivity) | Task manager and time tracker |
| [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) | TypeScript ORM for SQL databases |
| [Preflight](https://github.com/newrelic-experimental/preflight) | Observability for AI coding assistants, from New Relic |

My forks of these live at
[github.com/PloneMraz](https://github.com/PloneMraz?tab=repositories&type=fork).

## The contributions

This is the part that counts, and it is the part a reader should be able to
check. Each entry below is a pull request against the project itself, with
its state as it stands.

As of 21 September 2026: **27 pull requests opened, 7 merged.** All seven
landed in one project. The other twenty are either still waiting or were
closed, and the reasons are given below rather than left out.

### WebdriverIO

| Pull request | What it changes | State |
|---|---|---|
| [#15624](https://github.com/webdriverio/webdriverio/pull/15624) | `switchToParentFrame` recovers a context the page destroyed | merged |
| [#15637](https://github.com/webdriverio/webdriverio/pull/15637) | keeps a valid top-level context on `switchToParentFrame` | merged |
| [#15638](https://github.com/webdriverio/webdriverio/pull/15638) | releases the session-manager registration on `removeListeners` | merged |
| [#15643](https://github.com/webdriverio/webdriverio/pull/15643) | releases an intercepted request once per phase, not once per mock | merged |
| [#15672](https://github.com/webdriverio/webdriverio/pull/15672) | removes two v10 compatibility shims from `@wdio/runner` | merged |
| [#15674](https://github.com/webdriverio/webdriverio/pull/15674) | multiremote `$$` returns a real element array | merged |
| [#15678](https://github.com/webdriverio/webdriverio/pull/15678) | stops two driver installs racing on one cache directory | merged |
| [#15675](https://github.com/webdriverio/webdriverio/pull/15675) | stabilises multiremote `select()` and deletes its env flag | open |

One issue as well —
[#15676](https://github.com/webdriverio/webdriverio/issues/15676), the driver
race — found by reading a CI failure that looked like flakiness, and closed by
the pull request that fixed it.

### Trilium

| Pull request | What it changes | State |
|---|---|---|
| [#11596](https://github.com/TriliumNext/Trilium/pull/11596) | keeps the full-text word written against an attribute prefix | open |
| [#11598](https://github.com/TriliumNext/Trilium/pull/11598) | lets a grouping parenthesis open the expression part | open |
| [#11599](https://github.com/TriliumNext/Trilium/pull/11599) | lets a grouping parenthesis open a note-property expression | open |

Three fixes to the search lexer, stacked in that order because each builds on
the one before it.

### Super Productivity

| Pull request | What it changes | State |
|---|---|---|
| [#10167](https://github.com/super-productivity/super-productivity/pull/10167) | sizes images with a space after the opening parenthesis | open |
| [#10168](https://github.com/super-productivity/super-productivity/pull/10168) | leaves `=WxH` inside fenced code blocks alone | open |
| [#10169](https://github.com/super-productivity/super-productivity/pull/10169) | keeps locale-only plural forms when cleaning translations | open |

### Drizzle ORM

| Pull request | What it changes | State |
|---|---|---|
| [#6316](https://github.com/drizzle-team/drizzle-orm/pull/6316) | reports `delete`/`update` without `where` on private class fields | open |
| [#6317](https://github.com/drizzle-team/drizzle-orm/pull/6317) | keeps trailing check-constraint modifiers out of the pulled expression | open |
| [#6319](https://github.com/drizzle-team/drizzle-orm/pull/6319) | the same fix, against the `beta` branch | open |

### Joplin

| Pull request | What it changes | State |
|---|---|---|
| [#16622](https://github.com/laurent22/joplin/pull/16622) | escapes square brackets in imported Evernote link labels | closed |
| [#16623](https://github.com/laurent22/joplin/pull/16623) | drops clipped anchors that no link points at | closed |
| [#16626](https://github.com/laurent22/joplin/pull/16626) | keeps an undefined column out of the note list `ORDER BY` | closed |

Closed by the maintainer, who is currently only accepting pull requests from
long-term contributors while review capacity is short. Nothing was said about
the changes themselves.
([#16624](https://github.com/laurent22/joplin/pull/16624) was the same change
as #16626, closed by a bot because the title prefix was wrong, and reopened
under a new number.)

### Preflight

| Pull request | What it changes | State |
|---|---|---|
| [#772](https://github.com/newrelic-experimental/preflight/pull/772) | extracts `computeHistoricalCosts` into its own module | closed |
| [#774](https://github.com/newrelic-experimental/preflight/pull/774) | removes a permanent `costByTask: null` stub | closed |
| [#775](https://github.com/newrelic-experimental/preflight/pull/775) | one git remote-URL parser, with credential stripping | closed |

Closed by the maintainer: the `good first issue` label on the linked issue had
been applied by mistake, and the work was already assigned internally.

### Zettlr

| Pull request | What it changes | State |
|---|---|---|
| [#6576](https://github.com/Zettlr/Zettlr/pull/6576) | never shows 1000 or more of a smaller size unit | closed |
| [#6577](https://github.com/Zettlr/Zettlr/pull/6577) | matches file extensions case-insensitively | closed |
| [#6578](https://github.com/Zettlr/Zettlr/pull/6578) | compares extended language subtags by value, not identity | closed |

Closed by the maintainer for breaching the project's contributor guide: the
pull request descriptions were machine-written, the commits carried a
`Co-Authored-By` trailer naming the assistant, and the project's pull request
template was not used. That was my error, not a disagreement about the code,
and the rule now is to read a project's contributing guide and code of conduct
before opening anything.

A fork is not a contribution, and neither is an open pull request. Of the
seven projects above, one has taken work; the rest so far record only that
work was attempted.
