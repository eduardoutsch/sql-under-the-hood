"""Generate modular codebase Markdown bundles for NotebookLM (<= 1000 lines each)."""

from __future__ import annotations

import os
import re
from pathlib import Path

MAX_LINES = 950
ROOT = Path(__file__).resolve().parent.parent
BUNDLES_DIR = ROOT / "bundles"

IGNORE_DIRS = {"node_modules", "dist", "coverage", ".git", "bundles", ".venv"}
IGNORE_FILES = {"GEMINI.md", "package-lock.json"}

LANG_MAP = {
    ".ts": "typescript",
    ".tsx": "tsx",
    ".js": "javascript",
    ".mjs": "javascript",
    ".py": "python",
    ".json": "json",
    ".md": "markdown",
    ".css": "css",
    ".html": "html",
    ".toml": "toml",
    ".svg": "xml",
}


def slugify(text: str) -> str:
    """Create a GitHub-compatible Markdown anchor slug."""
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def collect_files() -> dict[str, list[Path]]:
    """Group repository files into logical bundle categories."""
    groups: dict[str, list[Path]] = {
        "01_docs_and_config": [],
        "02_core_domain": [],
        "03_ui_components_and_features": [],
        "04_tests": [],
    }
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = sorted(d for d in dirnames if d not in IGNORE_DIRS)
        for fname in sorted(filenames):
            if fname in IGNORE_FILES:
                continue
            path = Path(dirpath) / fname
            rel = path.relative_to(ROOT).as_posix()
            if rel.startswith("src/core/"):
                groups["02_core_domain"].append(path)
            elif rel.startswith("src/"):
                groups["03_ui_components_and_features"].append(path)
            elif rel.startswith("tests/"):
                groups["04_tests"].append(path)
            else:
                groups["01_docs_and_config"].append(path)
    return groups


def render_bundle(title: str, entries: list[tuple[str, str, str]]) -> str:
    """Render a single Markdown bundle with TOC and quadruple-backtick fences."""
    toc = ["## Table of Contents\n"]
    body: list[str] = []
    for rel, lang, content in entries:
        anchor = slugify(rel)
        toc.append(f"- [`{rel}`](#{anchor})")
        body.append(f"## `{rel}`\n\n````{lang}\n{content.rstrip()}\n````\n")
    header = (
        f"# {title}\n\n"
        f"> Generated snapshot containing {len(entries)} file(s).\n\n"
    )
    return header + "\n".join(toc) + "\n\n---\n\n" + "\n".join(body)


def write_group_bundles(group_name: str, files: list[Path]) -> list[tuple[str, int]]:
    """Write one or more <= 1000-line bundle files for a group."""
    results: list[tuple[str, int]] = []
    if not files:
        return results

    parts: list[list[tuple[str, str, str]]] = [[]]
    for path in files:
        rel = path.relative_to(ROOT).as_posix()
        lang = LANG_MAP.get(path.suffix.lower(), "text")
        content = path.read_text(encoding="utf-8", errors="replace")
        candidate = parts[-1] + [(rel, lang, content)]
        rendered = render_bundle(group_name, candidate)
        if len(rendered.splitlines()) > MAX_LINES and parts[-1]:
            parts.append([(rel, lang, content)])
        else:
            parts[-1].append((rel, lang, content))

    for idx, entries in enumerate(parts, start=1):
        suffix = f"_part{idx}" if len(parts) > 1 else ""
        out_path = BUNDLES_DIR / f"{group_name}{suffix}.md"
        text = render_bundle(f"{group_name}{suffix}", entries)
        out_path.write_text(text, encoding="utf-8")
        line_count = len(text.splitlines())
        results.append((out_path.name, line_count))
    return results


def main() -> None:
    """Regenerate all bundles and verify the 1,000-line ceiling."""
    for old in BUNDLES_DIR.glob("*.md"):
        old.unlink()
    for group_name, files in collect_files().items():
        for name, lines in write_group_bundles(group_name, files):
            print(f"{name}: {lines} lines")
            if lines > 1000:
                raise RuntimeError(f"Bundle {name} exceeded 1000 lines ({lines})")


if __name__ == "__main__":
    main()
