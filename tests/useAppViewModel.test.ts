import { act, fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAppViewModel } from '../src/useAppViewModel';

describe('useAppViewModel', () => {
  it('initializes with pt locale, module 0, and 20% progress', () => {
    const { result } = renderHook(() => useAppViewModel());
    expect(result.current.lang).toBe('pt');
    expect(result.current.activeModule).toBe(0);
    expect(result.current.presMode).toBe(false);
    expect(result.current.progressPct).toBe(20);
  });

  it('handles language toggle, presentation mode, and keyboard navigation', () => {
    const { result } = renderHook(() => useAppViewModel());

    act(() => result.current.toggleLang());
    expect(result.current.lang).toBe('en');

    act(() => result.current.togglePresMode());
    expect(result.current.presMode).toBe(true);

    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    });
    expect(result.current.activeModule).toBe(1);

    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
    });
    expect(result.current.activeModule).toBe(0);
  });
});
