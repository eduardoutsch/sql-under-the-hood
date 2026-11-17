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
