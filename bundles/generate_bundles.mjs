/**
 * Generate modular codebase Markdown bundles for NotebookLM (<= 1000 lines each).
 * Mirrors `bundles/generate_bundles.py` for environments with Node.js.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_LINES = 950;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BUNDLES_DIR = __dirname;

const IGNORE_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git', 'bundles', '.venv']);
const IGNORE_FILES = new Set(['GEMINI.md', 'package-lock.json']);
const IGNORE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.ico']);

const LANG_MAP = {
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.js': 'javascript',
  '.mjs': 'javascript',
  '.py': 'python',
  '.json': 'json',
  '.md': 'markdown',
  '.css': 'css',
  '.html': 'html',
  '.toml': 'toml',
  '.svg': 'xml',
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) walk(path.join(dir, entry.name), acc);
    } else if (!IGNORE_FILES.has(entry.name) && !IGNORE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      acc.push(path.join(dir, entry.name));
    }
  }
  return acc;
}

function collectFiles() {
  const groups = {
    '01_docs_and_config': [],
    '02_core_domain': [],
    '03_ui_components_and_features': [],
    '04_tests': [],
  };
  for (const filePath of walk(ROOT)) {
    const rel = path.relative(ROOT, filePath).split(path.sep).join('/');
    if (rel.startsWith('src/core/')) groups['02_core_domain'].push(filePath);
    else if (rel.startsWith('src/')) groups['03_ui_components_and_features'].push(filePath);
    else if (rel.startsWith('tests/')) groups['04_tests'].push(filePath);
    else groups['01_docs_and_config'].push(filePath);
  }
  return groups;
}

function renderBundle(title, entries) {
  const toc = ['## Table of Contents', ''];
  const body = [];
  for (const [rel, lang, content] of entries) {
    toc.push(`- [\`${rel}\`](#${slugify(rel)})`);
    body.push(`## \`${rel}\`\n\n\`\`\`\`${lang}\n${content.trimEnd()}\n\`\`\`\`\n`);
  }
  return `# ${title}\n\n> Generated snapshot containing ${entries.length} file(s).\n\n${toc.join('\n')}\n\n---\n\n${body.join('\n')}`;
}

function writeGroupBundles(groupName, files) {
  if (!files.length) return;
  const parts = [[]];
  for (const filePath of files) {
    const rel = path.relative(ROOT, filePath).split(path.sep).join('/');
    const lang = LANG_MAP[path.extname(filePath).toLowerCase()] ?? 'text';
    const content = fs.readFileSync(filePath, 'utf8');
    const candidate = [...parts[parts.length - 1], [rel, lang, content]];
    if (renderBundle(groupName, candidate).split('\n').length > MAX_LINES && parts[parts.length - 1].length > 0) {
      parts.push([[rel, lang, content]]);
    } else {
      parts[parts.length - 1].push([rel, lang, content]);
    }
  }
  parts.forEach((entries, idx) => {
    const suffix = parts.length > 1 ? `_part${idx + 1}` : '';
    const outName = `${groupName}${suffix}.md`;
    const text = renderBundle(`${groupName}${suffix}`, entries);
    const lines = text.split('\n').length;
    if (lines > 1000) throw new Error(`Bundle ${outName} exceeded 1000 lines (${lines})`);
    fs.writeFileSync(path.join(BUNDLES_DIR, outName), text, 'utf8');
    console.log(`${outName}: ${lines} lines`);
  });
}

const PRESERVED_MD = new Set(['README.md', 'AGENTS.md', 'GEMINI.md']);
for (const file of fs.readdirSync(BUNDLES_DIR)) {
  if (file.endsWith('.md') && !PRESERVED_MD.has(file)) fs.unlinkSync(path.join(BUNDLES_DIR, file));
}
for (const [groupName, files] of Object.entries(collectFiles())) {
  writeGroupBundles(groupName, files);
}
