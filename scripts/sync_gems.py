"""Mirror the GEMs platform specification into content/gems/.

    python3 scripts/sync_gems.py [PATH_TO_GEMS_REPO]    (default: ../GEMs-main)

The GEMs repository is the working copy; this site mirrors its `spec/` chapters.
What the site shows of each chapter, and where, is declared by GEMs itself: the
chapter table in `spec/README.md` gives, per row, the file, the site group and
the one-line contents (the site's `lede`). The order inside a group is the
table's order.

Each chapter is copied verbatim, but for three changes the site needs:

- its `# NN — Title` heading becomes the front-matter `title`, and is dropped
  from the body (the layout prints the title);
- links between chapters (`03-energy.md#33-…`) become site URLs
  (`/vault/gems/03-energy/#33-…`); the anchors keep working because the site
  builds heading ids with GitHub's rule (eleventy.config.js);
- links out of `spec/` (`../hardware/kinematics.md`) become GitHub URLs:
  `blob/HEAD` for a file, `tree/HEAD` for a folder.

Chapters no longer in the table are removed from content/gems/. Nothing else in
the site is touched. Standard library only.
"""
from __future__ import annotations

import posixpath
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
OUT = SITE / "content" / "gems"
GITHUB = "https://github.com/PloneMraz/GEMs"

ROW = re.compile(r"^\|\s*[^|]*\|\s*\[([^\]]+)\]\(([^)]+\.md)\)\s*\|\s*([a-z-]+)\s*\|\s*(.+?)\s*\|\s*$")
LINK = re.compile(r"\]\((?!https?:|mailto:|#)([^)\s]+)\)")


def chapters(spec: Path) -> list[dict]:
    rows = []
    for line in (spec / "README.md").read_text(encoding="utf-8").splitlines():
        m = ROW.match(line)
        if m:
            text, file, group, lede = m.groups()
            rows.append({"file": file, "group": group, "lede": lede})
    if not rows:
        sys.exit("no chapter table found in spec/README.md")
    seen: dict[str, int] = {}
    for r in rows:
        seen[r["group"]] = seen.get(r["group"], 0) + 10
        r["order"] = seen[r["group"]]
    return rows


def rewrite(body: str, repo: Path, spec: Path, names: set[str]) -> str:
    def fix(m: re.Match) -> str:
        target = m.group(1)
        path, _, anchor = target.partition("#")
        anchor = f"#{anchor}" if anchor else ""
        if not path:
            return m.group(0)
        if path in names:                                   # another chapter
            return f"](/vault/gems/{path[:-3]}/{anchor})"
        rel = posixpath.normpath(posixpath.join("spec", path))
        if rel.startswith(".."):
            sys.exit(f"link leaves the repository: {target}")
        kind = "tree" if path.endswith("/") or (repo / rel).is_dir() else "blob"
        return f"]({GITHUB}/{kind}/HEAD/{rel}{'/' if kind == 'tree' else ''}{anchor})"
    return LINK.sub(fix, body)


def main() -> None:
    repo = Path(sys.argv[1] if len(sys.argv) > 1 else SITE.parent / "GEMs-main").resolve()
    spec = repo / "spec"
    rows = chapters(spec)
    names = {r["file"] for r in rows}
    written = []
    for r in rows:
        text = (spec / r["file"]).read_text(encoding="utf-8")
        head, _, body = text.partition("\n")
        m = re.match(r"^#\s+(?:\d+\s+—\s+)?(.+?)\s*$", head)
        if not m:
            sys.exit(f"{r['file']}: first line is not a '# Title' heading")
        title = m.group(1)
        body = rewrite(body.lstrip("\n"), repo, spec, names)
        q = lambda s: "'" + s.replace("'", "''") + "'"
        front = (
            "---\n"
            f"title: {q(title)}\n"
            f"lede: {q(r['lede'])}\n"
            f"group: {r['group']}\n"
            f"order: {r['order']}\n"
            "lang: en\n"
            f"source: {GITHUB}/blob/HEAD/spec/{r['file']}\n"
            "---\n"
        )
        (OUT / r["file"]).write_text(front + body, encoding="utf-8")
        written.append(r["file"])
    for old in OUT.glob("*.md"):
        if old.name not in written:
            old.unlink()
            print(f"removed {old.name}: no longer in the chapter table")
    print(f"{len(written)} chapters from {repo}: {', '.join(written)}")


if __name__ == "__main__":
    main()
