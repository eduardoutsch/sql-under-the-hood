# Local Notebook Bundles Directive // GEMINI.md

This workspace rule supplements `AGENTS.md` locally (gitignored alongside `bundles/`) to maintain modular codebase snapshots for **Gemini Notebook / NotebookLM**.

## Modular Codebase Bundles Synchronization (`bundles/` Directory)

Whenever repository source, test, configuration, or documentation files or frontend files are created, modified, renamed, or deleted, you MUST keep the Markdown bundles inside `bundles/` synchronized before concluding the task:

1. **Strict 1,000-Line Ceiling**:
   - Every generated `.md` bundle file inside `bundles/` MUST be **strictly `<= 1000` lines** in total (including headers, Table of Contents, and code fences; target `~750–900` lines per file for clean Gemini Notebook chunking).
   - Never allow a bundle file to exceed `1000` lines; automatically split groups into sequential parts (`_part1.md`, `_part2.md`, ...) or line-range slices if a single source file approaches the limit.
2. **Structure & Safe Code Fences**:
   - Start every bundle with a header, generation summary, and a **Table of Contents** with Markdown anchor links to each constituent file.
   - Wrap all embedded file contents in **quadruple backticks** (` ````python `, ` ````markdown `, ` ````text `) so nested triple-backtick blocks inside docs or docstrings never break Markdown parsing.
3. **Regeneration Command**:
   - Run `.venv\Scripts\python bundles/generate_bundles.py` after codebase edits and confirm every `bundles/*.md` file reports `<= 1000` lines.
   - Keep both `GEMINI.md` and `bundles/` listed in `.gitignore` so local notebook bundles never pollute Git commits or PRs.
