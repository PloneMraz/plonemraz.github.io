"""Mirror the GEMs repositories into content/gems/.

    python3 scripts/sync_gems.py [NAME ...]      (default: every source)

What is mirrored, and where, is declared in scripts/gems-manifest.json, one
entry per source repository. A source names its local `checkout` (relative to
the site), its `github` URL, an `images` folder of the site it owns, paths to
`ignore`, and its documents:

- `specTable`: a README whose table lists chapters as
  `| # | [Title](file.md) | site group | contents |`. Each row becomes a page at
  the top of the GEMs area (`/vault/gems/<stem>/`), in the row's group, with the
  row's contents as its lede, in the table's order (10, 20, … per group). The
  table is GEMs' own declaration of what the site shows of its chapters.
- `docs`: every other Markdown file, `{src, group, order, lede?, title?, path?}`.
  `path` defaults to the file's path, lower-cased, `_` as `-`, a folder's
  `README.md` standing for the folder — `hardware/bom/EBOM.md` is
  `hardware/bom/ebom`. A page's place in the menu follows its path: the page at
  `hardware/bom` is a child of the page at `hardware` (_includes/gems-tree.njk).

Each file is copied verbatim, but for what the site needs:

- its first line, `# Title` (`# NN — Title` for a chapter), becomes the
  front-matter `title` unless the manifest gives one, and is dropped from the
  body: the layout prints the title;
- relative links go to the site page when the target is mirrored (a folder, to
  its README's page), anchors kept — the site builds heading ids with GitHub's
  rule (eleventy.config.js); to GitHub otherwise, `blob/HEAD` or `tree/HEAD`;
- an image a mirrored file embeds is copied into the source's `images` folder
  and the link follows it;
- GitHub's alert markers (`> [!NOTE]`) become a bold first line of the quote;
- `templateEngineOverride: md`: the text is not run through Nunjucks.

A Markdown file of the source that is neither listed nor ignored is reported.

Each page records its source in `source:`. Pages of a source that it no longer
lists are removed, and so are images in its folder that nothing embeds; pages
and images of another source, or written by hand, are never touched. So one
source can be synced without the others. Standard library only.
"""
from __future__ import annotations

import json
import posixpath
import re
import shutil
import subprocess
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
OUT = SITE / "content" / "gems"
MANIFEST = Path(__file__).with_name("gems-manifest.json")

ROW = re.compile(r"^\|\s*[^|]*\|\s*\[([^\]]+)\]\(([^)]+\.md)\)\s*\|\s*([a-z-]+)\s*\|\s*(.+?)\s*\|\s*$")
LINK = re.compile(r"\]\((?!https?:|mailto:|#|/)([^)\s]+)\)")
IMG = re.compile(r"(!\[[^\]]*\]\()(?!https?:|/)([^)\s]+)\)")
ALERT = re.compile(r"^(>\s*)\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$", re.M)
TITLE = re.compile(r"^#\s+(?:\d+\s+—\s+)?(.+?)\s*$")
PATH = re.compile(r"^[a-z0-9-]+(/[a-z0-9-]+)*$")


def default_path(src: str) -> str:
    p = src[:-len("README.md")].rstrip("/") if src.endswith("README.md") else src[:-3]
    return p.lower().replace("_", "-")


def spec_rows(repo: Path, table: str) -> list[dict]:
    rows = []
    for line in (repo / table).read_text(encoding="utf-8").splitlines():
        m = ROW.match(line)
        if m:
            _, file, group, lede = m.groups()
            rows.append({"src": posixpath.join(posixpath.dirname(table), file),
                         "path": Path(file).stem, "group": group, "lede": lede})
    if not rows:
        sys.exit(f"no chapter table found in {table}")
    seen: dict[str, int] = {}
    for r in rows:
        seen[r["group"]] = seen.get(r["group"], 0) + 10
        r["order"] = seen[r["group"]]
    return rows


def owner(page: Path) -> str | None:
    m = re.search(r"^source: (\S+)$", page.read_text(encoding="utf-8").partition("\n---")[0], re.M)
    return m.group(1) if m else None


def sync(src: dict) -> None:
    repo = (SITE / src["checkout"]).resolve()
    github = src["github"].rstrip("/")
    images = SITE / src["images"]
    docs = spec_rows(repo, src["specTable"]) if src.get("specTable") else []
    docs += [dict(d, path=d.get("path") or default_path(d["src"])) for d in src["docs"]]

    pages = {}                                              # repo path -> site path
    for d in docs:
        if not (repo / d["src"]).is_file():
            sys.exit(f"{src['name']}: {d['src']} is not in {repo}")
        if not PATH.match(d["path"]):
            sys.exit(f"{d['src']}: path {d['path']!r} is not lower-case ASCII words")
        if d["path"] in pages.values():
            sys.exit(f"{d['src']}: path {d['path']!r} is taken twice")
        pages[d["src"]] = d["path"]
    for d in docs:
        parent = posixpath.dirname(d["path"])
        up = [e for e in docs if e["path"] == parent]
        if parent and (not up or up[0]["group"] != d["group"]):
            sys.exit(f"{d['src']}: no page at {parent!r} in group {d['group']!r} to sit under")

    listed = set(pages) | {src.get("specTable")}
    ignore = tuple(src.get("ignore", []))
    tracked = subprocess.run(["git", "-C", str(repo), "ls-files", "*.md"],
                             capture_output=True, text=True, check=True).stdout.split()
    for f in tracked:
        if f not in listed and not f.startswith(ignore):
            print(f"warning: {f} is neither listed nor ignored in the manifest")

    embedded: set[str] = set()

    def rewrite(body: str, at: str) -> str:
        def fix(m: re.Match) -> str:
            target = m.group(1)
            path, _, anchor = target.partition("#")
            anchor = f"#{anchor}" if anchor else ""
            if not path:
                return m.group(0)
            rel = posixpath.normpath(posixpath.join(posixpath.dirname(at), path))
            if rel.startswith(".."):
                sys.exit(f"{at}: link leaves the repository: {target}")
            if (repo / rel).is_dir():
                readme = "README.md" if rel == "." else f"{rel}/README.md"
                if readme in pages:
                    return f"](/vault/gems/{pages[readme]}/{anchor})"
                return f"]({github}/tree/HEAD/{'' if rel == '.' else rel + '/'}{anchor})"
            if rel in pages:
                return f"](/vault/gems/{pages[rel]}/{anchor})"
            if not (repo / rel).exists():
                print(f"warning: {at}: link to a missing file: {target}")
            return f"]({github}/blob/HEAD/{rel}{anchor})"
        def image(m: re.Match) -> str:
            rel = posixpath.normpath(posixpath.join(posixpath.dirname(at), m.group(2)))
            if rel.startswith("..") or not (repo / rel).is_file():
                sys.exit(f"{at}: image not in the repository: {m.group(2)}")
            embedded.add(rel)
            return f"{m.group(1)}/{src['images']}/{rel})"
        body = LINK.sub(fix, IMG.sub(image, body))
        return ALERT.sub(lambda m: f"{m.group(1)}**{m.group(2).title()}**\n{m.group(1).rstrip()}", body)

    q = lambda s: "'" + s.replace("'", "''") + "'"
    written = set()
    for d in docs:
        text = (repo / d["src"]).read_text(encoding="utf-8")
        head, _, body = text.partition("\n")
        m = TITLE.match(head)
        if not m:
            sys.exit(f"{d['src']}: first line is not a '# Title' heading")
        front = ["---", f"title: {q(d.get('title') or m.group(1))}"]
        if d.get("lede"):
            front.append(f"lede: {q(d['lede'])}")
        front += [f"group: {d['group']}", f"order: {d['order']}", "lang: en",
                  f"source: {github}/blob/HEAD/{d['src']}", f"sourceRepo: {src['name']}",
                  "templateEngineOverride: md", "---", ""]
        page = OUT / f"{d['path']}.md"
        if page.exists() and not (owner(page) or "").startswith(f"{github}/blob/"):
            sys.exit(f"{page.relative_to(SITE)} exists and is not {src['name']}'s: not overwriting")
        page.parent.mkdir(parents=True, exist_ok=True)
        page.write_text("\n".join(front) + rewrite(body.lstrip("\n"), d["src"]), encoding="utf-8")
        written.add(page)

    for page in sorted(OUT.rglob("*.md")):
        if page not in written and (owner(page) or "").startswith(f"{github}/blob/"):
            page.unlink()
            print(f"removed {page.relative_to(SITE)}: {src['name']} no longer lists it")
    for rel in embedded:
        (images / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(repo / rel, images / rel)
    if images.exists():
        for f in sorted(images.rglob("*")):
            if f.is_file() and f.relative_to(images).as_posix() not in embedded:
                f.unlink()
                print(f"removed {f.relative_to(SITE)}: nothing embeds it")
    for folder in sorted([*OUT.rglob("*"), *images.rglob("*")], reverse=True):
        if folder.is_dir() and not any(folder.iterdir()):
            folder.rmdir()
    print(f"{src['name']}: {len(written)} pages, {len(embedded)} images, from {repo}")


def main() -> None:
    sources = json.loads(MANIFEST.read_text(encoding="utf-8"))["sources"]
    names = sys.argv[1:] or [s["name"] for s in sources]
    for name in names:
        match = [s for s in sources if s["name"] == name]
        if not match:
            sys.exit(f"no source named {name!r} in {MANIFEST.name}")
        sync(match[0])


if __name__ == "__main__":
    main()
