# 01_docs_and_config

> Generated snapshot containing 13 file(s).

## Table of Contents

- [`.gitignore`](#gitignore)
- [`AGENTS.md`](#agents-md)
- [`index.html`](#index-html)
- [`LICENSE`](#license)
- [`package.json`](#package-json)
- [`public/_headers`](#public-headers)
- [`public/_redirects`](#public-redirects)
- [`public/favicon.svg`](#public-favicon-svg)
- [`README.md`](#readme-md)
- [`tsconfig.json`](#tsconfig-json)
- [`vite.config.ts`](#vite-config-ts)
- [`vitest.config.ts`](#vitest-config-ts)
- [`wrangler.toml`](#wrangler-toml)

---

## `.gitignore`

````text
# Dependencies
node_modules/

# Build & coverage outputs
dist/
coverage/

# Environment & local files
.env
.env.*
*.local

# OS / Editor
.DS_Store
Thumbs.db
````

## `AGENTS.md`

````markdown
# Engineering Principles // AGENTS.md

To ensure that our codebase—whether written by human developers or autonomous AI agents (such as Google Antigravity, OPSX, and automated coding assistants)—remains cohesive, testable, maintainable, and simple, we adopt foundational, non-negotiable engineering principles.

These principles MUST guide any and all new implementations, refactoring, or modifications in this repository

## I. Everything in EN-PT
The entire repository MUST **mostly** be in English. This includes, but is not limited to: documentation, specifications, architecture notes, Jupyter notebooks, code comments, function names, class and module names, API schemas, UI labels, test descriptions, and variable names. On the interface itself, there must always be PT-br options alongside EN options (PT-br being the default)

## II. Independent Components (Feature-First & Modular Architecture)
Every feature MUST be built in a modular fashion.
- Components, scientific processing routines, I/O adapters, transport serializers, and UI views must be self-contained, independently testable, and clearly documented.
- Avoid creating empty wrapper classes, components, or functions that exist solely for superficial organizational purposes; every component must have a clear functional responsibility.
- Do not mix scientific algorithms, domain rules, or core state logic into monolithic HTTP route handlers, exploratory notebooks, or UI files. Maintain a clean separation of concerns (pure scientific/domain logic and data structures separated from network I/O, archive streaming, HTTP transport, and UI rendering).

## III. The "Dumb UI" (Humble View) & Functional Core Pattern
The UI/Display layer MUST remain "dumb"—acting strictly as a humble visual projection of state (`State → UI`) and a thin forwarder of user intent (`User Event → Action`).
- **Functional Core, Imperative Shell**:
  - **Functional Core (Pure Logic)**: Astronomical and spectral calculations, FITS binary array transformations, WCS coordinate projections, image alignment/reprojection logic (`reproject`), and compact binary payload encoders/decoders MUST be written as pure, deterministic functions (`(data, params) -> result`) with zero direct dependency on network sockets, `httpx` HTTP/2 streams, live `astroquery` IRSA archive calls, filesystem caches, FastAPI request contexts, or UI/DOM rendering APIs.
  - **Imperative Shell (Boundary Adapters)**: Remote IRSA archive queries (`astroquery`), async HTTP/2 and byte-range binary FITS streaming (`httpx`), local FITS caching, FastAPI/Uvicorn HTTP endpoints, and UI rendering/interaction handlers must reside at the outer boundary—acquiring raw inputs, invoking the pure functional core, and persisting, transmitting, or rendering the resulting state.
- **Explicit State Over View-as-State**: Maintain an explicit, well-typed state model/object for each view or module rather than treating scattered UI widget/DOM input properties or ad-hoc global variables as the primary source of truth.
- **Idempotent Rendering**: Every `render*` or `update*` view function must be idempotent—calling it repeatedly with the same state must produce the exact same visual output without duplicating nodes, overlays, timers, or event listeners.
- **Declarative Lookup Tables Over Branching Chains**: Prefer declarative lookup maps/tables and structured configuration descriptors (e.g., mapping SPHEREx spectral bands, cutout levels, colormap presets, or binary frame types to metadata descriptors) over deeply nested `if / elif / else` or `switch` chains.
- **Guard Clauses & Single Level of Abstraction**: Use early returns (guard clauses) at the top of functions to handle missing headers, invalid WCS projections, empty cutouts, or malformed states, keeping the happy path flat and readable. High-level workflow functions should read like a clear table of contents delegating to small, single-purpose helpers.

## IV. 100% Test Coverage Target
Any submitted change must strive for and target 100% test coverage (covering unit, boundary/API integration, and UI component paths). This standard is non-negotiable.

## V. Test-First Imperative (TDD)
Test-Driven Development (TDD) is **mandatory** and non-negotiable.
- ANY production logic module, boundary adapter, HTTP endpoint, or UI module MUST have a corresponding test suite file in the `tests/` directory, **strictly mirroring the directory structure of the source**, API tests and UI tests mirroring the frontend module tree.
- Tests MUST be written and executed first (and must initially fail) before starting any production code implementation.
- Unit tests for scientific, reprojection, and binary-serialization pipelines should operate on deterministic, synthetic in-memory arrays/FITS headers rather than making live network calls to remote archives or IRSA.
- The Red-Green-Refactor cycle must be strictly followed for every new feature, pipeline stage, endpoint, or logical unit introduced.

## VI. Boundary and UI/Integration Tests First
Prioritize testing system boundaries, component contracts, and integration flows before descending into internal implementation details.
- API contract tests (e.g., FastAPI compact binary payload formatting and HTTP responses), adapter boundary tests, and UI/integration tests MUST be prioritized to validate realistic end-to-end workflows from pipeline output to display rendering.
- This guarantees the integrity of the pipeline-to-display contract as a cohesive whole and ensures that scientific accuracy, performance, and user-facing requirements are satisfied right from the start of development.

## VII. Simplicity and Anti-Abstraction
Code MUST be simple, declarative, and effortless to comprehend.
- Avoid premature abstractions, speculative generality, and "clever" code (unnecessary cognitive overhead).
- Follow the golden rule: *"A little duplication is far better than the wrong abstraction."*
- Concurrently, practice prudent DRY (Don't Repeat Yourself): avoid repetitive boilerplate when it can be abstracted in an obvious, simple manner for straightforward reuse.

## VIII. Continuous and Comprehensive Documentation
Clean code does NOT substitute for thorough technical documentation.
- All implementations MUST be well-documented using structured docstrings (`"""..."""` in Python with clear type annotations, units, and array shapes; `/** ... */` or `///` in frontend modules) across functions, classes, and modules, articulating *the why* (scientific rationale, physical units, coordinate frames, and architectural intent) and not merely *the what* (the raw mechanical action).
- Every new module, capability, binary protocol format, or architectural change MUST be reflected with improvements and updates in the relevant `README.md` and documentation files.
- Documentation is a living artifact and an inseparable part of delivering software value.

---
> **Note for Autonomous Agents**: You are strictly required to treat this document as the highest-priority directive when planning architecture, suggesting refactoring, or implementing new routines and features (including operations performed via Google Antigravity, OPSX, or autonomous workflows).
````

## `index.html`

````html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SQL por Baixo dos Panos — Do SELECT ao Silício</title>
    <meta
      name="description"
      content="Visualizador interativo da arquitetura interna de bancos de dados SQL: Pipeline, Buffer Pool, Slotted Page 8KB, Null Bitmaps e SIMD."
    />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## `LICENSE`

````text
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
````

## `package.json`

````json
{
  "name": "sql-under-the-hood",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "description": "Interactive SQL internals visualizer (Do SELECT ao Silício) built with React, Vite, and Tailwind CSS for Cloudflare Pages.",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "bundles": "node bundles/generate_bundles.mjs"
  },
  "dependencies": {
    "lucide-react": "^0.511.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.7",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.1.4",
    "@types/react-dom": "^19.1.4",
    "@vitejs/plugin-react": "^4.5.0",
    "@vitest/coverage-v8": "^3.1.4",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.1.7",
    "typescript": "^5.8.3",
    "vite": "^6.3.5",
    "vitest": "^3.1.4"
  }
}
````

## `public/_headers`

````text
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable
````

## `public/_redirects`

````text
/* /index.html 200
````

## `public/favicon.svg`

````xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#0f172a"/>
  <ellipse cx="16" cy="9" rx="9" ry="3.5" stroke="#22d3ee" stroke-width="2"/>
  <path d="M7 9v14c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5V9" stroke="#22d3ee" stroke-width="2"/>
  <path d="M7 16c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5" stroke="#a78bfa" stroke-width="2"/>
</svg>
````

## `README.md`

````markdown
# SQL Under the Hood — Do SELECT ao Silício

Interactive educational web application visualizing how relational and analytical SQL engines execute queries from raw SQL text down to CPU registers and 8 KB disk pages.

- **Default UI Language**: Portuguese (PT-BR) with 1-click English (EN) toggle.
- **Presentation Mode**: Full-width seminar mode with keyboard navigation (`←` / `→`).
- **Hosting**: Configured for **Cloudflare Pages** (`npm run build` → `dist/`).

## Interactive Modules

1. **Query Pipeline (`01`)**: Lexer/Tokenizer, AST Parser, Rewriter, Cost-Based Optimizer (CBO), and Execution (SQLite VDBE Bytecode VM vs. PostgreSQL LLVM JIT).
2. **Storage Hierarchy & Buffer Pool (`02`)**: Hardware latency scale (L1/L2/DRAM/NVMe/HDD) and interactive 3-frame LRU Buffer Pool + Heap File byte-offset simulator.
3. **8 KB Slotted Page (`03`)**: PostgreSQL `PageHeaderData` (24B), `ItemIdData` slots (`pd_lower`), contiguous free space, `HeapTuple` items (`pd_upper`), dead-tuple marking, and `VACUUM` compaction.
4. **Bits & Alignment (`04`)**: Centralized Null Bitmap (`t_bits`) and 64-bit CPU word alignment comparison.
5. **Volcano vs. SIMD (`05`)**: Row-at-a-time Volcano iterator vs. AVX2 (8× int32) and AVX-512 (16× int32) vectorized execution with Selection Vectors.

## Architecture (MVVM & Functional Core)

- [`src/core/`](src/core/README.md): Deterministic domain modules with zero UI/DOM dependencies.
- [`src/components/`](src/components/README.md): Shared shell components (`Navbar`, `DeployModal`).
- [`src/features/`](src/features/README.md): Feature modules split into ViewModel hooks (`use*ViewModel.ts`) and dumb views (`*Module.tsx`).
- [`tests/`](tests/README.md): Vitest + Testing Library suites mirroring `src/`.
- [`bundles/`](bundles/README.md): Modular Markdown snapshots for NotebookLM.

## Development & Testing

```bash
npm install
npm test
npm run test:coverage
npm run build
```

## Deploying to Cloudflare Pages

1. Connect the repository to **Cloudflare Pages** (Build command: `npm run build`, Output directory: `dist`), **or**
2. Deploy directly with Wrangler:
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```
````

## `tsconfig.json`

````json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "tests"]
}
````

## `vite.config.ts`

````typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
````

## `vitest.config.ts`

````typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx'],
    },
  },
});
````

## `wrangler.toml`

````toml
name = "sql-under-the-hood"
pages_build_output_dir = "dist"
compatibility_date = "2025-01-01"
````
