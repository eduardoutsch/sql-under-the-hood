# `bundles/` — NotebookLM Codebase Snapshots

Generates modular Markdown snapshots of the repository (`<= 1000` lines per file) with a Table of Contents and quadruple-backtick code fences.

- `generate_bundles.mjs`: Node.js generator (`npm run bundles`).
- `generate_bundles.py`: Python generator (`.venv\Scripts\python bundles/generate_bundles.py`).
