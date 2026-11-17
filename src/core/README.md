# `src/core/` — Domain Logic

Deterministic domain modules with zero React, DOM, or timer dependencies.

- `i18n.ts`: PT-BR (default) and EN translation dictionary and locale helpers.
- `appNavigation.ts`: Module index bounds and seminar progress calculations.
- `queryPipeline.ts`: SQL token list, localized VDBE opcodes, and stage/PC transitions.
- `storageHierarchy.ts`: Hardware latency tiers, heap-file byte offset formula, and Buffer Pool page lookup.
- `slottedPage.ts`: 8 KB slotted page metrics (`pd_lower`, `pd_upper`), tuple insertion, dead-tuple marking, and `VACUUM` compaction.
- `bitInspector.ts`: Null bitmap formatting and payload byte summation.
- `volcanoSimd.ts`: Volcano vs. SIMD race progression, cycle estimates, and Selection Vector extraction.
