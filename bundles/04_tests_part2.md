# 04_tests_part2

> Generated snapshot containing 4 file(s).

## Table of Contents

- [`tests/features/volcanoSimd/VolcanoVsSimdModule.test.tsx`](#tests-features-volcanosimd-volcanovssimdmodule-test-tsx)
- [`tests/README.md`](#tests-readme-md)
- [`tests/setup.ts`](#tests-setup-ts)
- [`tests/useAppViewModel.test.ts`](#tests-useappviewmodel-test-ts)

---

## `tests/features/volcanoSimd/VolcanoVsSimdModule.test.tsx`

````tsx
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { VolcanoVsSimdModule } from '../../../src/features/volcanoSimd/VolcanoVsSimdModule';

describe('VolcanoVsSimdModule component', () => {
  it('steps simulation and switches between AVX2 and AVX-512', async () => {
    const user = userEvent.setup();
    render(<VolcanoVsSimdModule t={I18N.pt} />);

    await user.click(screen.getByText(I18N.pt.step));
    expect(screen.getByText('18 clk')).toBeInTheDocument();
    expect(screen.getByText('2 clk')).toBeInTheDocument();

    await user.click(screen.getByText('AVX-512 (16× int32)'));
    expect(screen.getByText(/vpcmpgtd zmm0, zmm1/)).toBeInTheDocument();
    expect(screen.getAllByText('0 clk')).toHaveLength(2);
  });

  it('runs race with Play and stops cleanly when finished', () => {
    vi.useFakeTimers();
    render(<VolcanoVsSimdModule t={I18N.en} />);

    act(() => {
      screen.getByText(I18N.en.play).click();
    });
    expect(screen.getByText(I18N.en.pause)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(420 * 35);
    });
    expect(screen.getByText(I18N.en.play)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
````

## `tests/README.md`

````markdown
# `tests/` — Test Suites

Vitest + Testing Library suites mirroring `src/`:

- `tests/core/`: Unit tests for deterministic domain helpers.
- `tests/components/`: Component tests for `Navbar` and `DeployModal`.
- `tests/features/`: ViewModel hook tests (`renderHook`) and feature UI tests.
- `tests/useAppViewModel.test.ts` & `tests/App.test.tsx`: App ViewModel and end-to-end integration tests.

Run with `npm test` or `npm run test:coverage`.
````

## `tests/setup.ts`

````typescript
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
````

## `tests/useAppViewModel.test.ts`

````typescript
import { act, fireEvent, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { LOCALE_STORAGE_KEY } from '../src/core/i18n';
import { THEME_STORAGE_KEY } from '../src/core/theme';
import { useAppViewModel } from '../src/useAppViewModel';

describe('useAppViewModel', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('initializes on the home page with en locale and light theme by default', () => {
    const { result } = renderHook(() => useAppViewModel());
    expect(result.current.lang).toBe('en');
    expect(result.current.theme).toBe('light');
    expect(result.current.activeModule).toBeNull();
    expect(result.current.progressPct).toBe(0);
  });

  it('restores pt locale when previously saved in localStorage', () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'pt');
    const { result } = renderHook(() => useAppViewModel());
    expect(result.current.lang).toBe('pt');
  });

  it('persists language and theme toggles and handles keyboard navigation', () => {
    const { result } = renderHook(() => useAppViewModel());

    act(() => result.current.toggleLang());
    expect(result.current.lang).toBe('pt');
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('pt');

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    });
    expect(result.current.activeModule).toBe(0);

    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
    });
    expect(result.current.activeModule).toBe(0);

    act(() => result.current.goHome());
    expect(result.current.activeModule).toBeNull();
  });
});
````
