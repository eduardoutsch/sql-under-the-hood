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
