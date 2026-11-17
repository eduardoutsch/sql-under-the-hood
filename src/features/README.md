# `src/features/` — Interactive Seminar Modules (MVVM)

Each feature folder follows **Model-View-ViewModel (MVVM)**:
- `use*ViewModel.ts`: Owns React state, intervals/effects, and calls into `src/core/`.
- `*Module.tsx`: Dumb view projecting ViewModel state and forwarding user events.

## Modules
- `queryPipeline/`: Lexer, AST/Rewriter, Cost-Based Optimizer, and VDBE / LLVM JIT execution.
- `storageHierarchy/`: Hardware latency scale and 3-frame LRU Buffer Pool simulator.
- `slottedPage/`: 8 KB PostgreSQL slotted page inspector (`PageHeaderData`, `ItemIdData`, `HeapTuple`).
- `bitInspector/`: Centralized Null Bitmap and 64-bit CPU word alignment visualizer.
- `volcanoSimd/`: Row-at-a-time Volcano iterator vs. AVX2 / AVX-512 vectorized execution race.
