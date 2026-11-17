import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useVolcanoSimdViewModel } from '../../../src/features/volcanoSimd/useVolcanoSimdViewModel';

describe('useVolcanoSimdViewModel', () => {
  it('steps race, switches SIMD lane width, and auto-completes on play', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useVolcanoSimdViewModel());

    act(() => result.current.step());
    expect(result.current.volcanoCycles).toBe(18);
    expect(result.current.simdCycles).toBe(2);

    act(() => result.current.selectLaneWidth(16));
    expect(result.current.simdLane).toBe(16);
    expect(result.current.volcanoCycles).toBe(0);

    act(() => result.current.toggleRunning());
    expect(result.current.running).toBe(true);

    act(() => vi.advanceTimersByTime(420 * 35));
    expect(result.current.running).toBe(false);
    vi.useRealTimers();
  });
});
