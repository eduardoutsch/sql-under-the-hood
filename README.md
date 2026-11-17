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

## Architecture (Functional Core, Humble View)

- `src/core/`: Pure, deterministic domain modules with zero UI/DOM dependencies.
- `src/components/`: Reusable shell components (`Navbar`, `DeployModal`).
- `src/features/`: Thin, idempotent React views projecting domain state.
- `tests/`: Vitest + Testing Library suites strictly mirroring `src/`.

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
