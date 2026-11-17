# `tests/` — Test Suites

Vitest + Testing Library suites mirroring `src/`:

- `tests/core/`: Unit tests for deterministic domain helpers.
- `tests/components/`: Component tests for `Navbar` and `DeployModal`.
- `tests/features/`: ViewModel hook tests (`renderHook`) and feature UI tests.
- `tests/useAppViewModel.test.ts` & `tests/App.test.tsx`: App ViewModel and end-to-end integration tests.

Run with `npm test` or `npm run test:coverage`.
