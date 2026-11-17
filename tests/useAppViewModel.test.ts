import { act, fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAppViewModel } from '../src/useAppViewModel';

describe('useAppViewModel', () => {
  it('initializes on the home page with pt locale and 0% progress', () => {
    const { result } = renderHook(() => useAppViewModel());
    expect(result.current.lang).toBe('pt');
    expect(result.current.activeModule).toBeNull();
    expect(result.current.presMode).toBe(false);
    expect(result.current.progressPct).toBe(0);
  });

  it('navigates between home and modules via actions and keyboard', () => {
    const { result } = renderHook(() => useAppViewModel());

    act(() => result.current.toggleLang());
    expect(result.current.lang).toBe('en');

    act(() => result.current.togglePresMode());
    expect(result.current.presMode).toBe(true);

    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    });
    expect(result.current.activeModule).toBe(0);

    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    });
    expect(result.current.activeModule).toBe(1);

    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
    });
    expect(result.current.activeModule).toBe(0);

    act(() => result.current.goHome());
    expect(result.current.activeModule).toBeNull();
  });
});
