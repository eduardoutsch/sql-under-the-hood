import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSlottedPageViewModel } from '../../../src/features/slottedPage/useSlottedPageViewModel';

describe('useSlottedPageViewModel', () => {
  it('inserts tuples, marks dead tuples, compacts, and tracks hovered slot', () => {
    const { result } = renderHook(() => useSlottedPageViewModel());

    expect(result.current.metrics.pdLower).toBe(36);

    act(() => result.current.insert());
    expect(result.current.tuples).toHaveLength(4);

    act(() => result.current.markDead(2));
    expect(result.current.tuples[1].alive).toBe(false);

    act(() => result.current.compact());
    expect(result.current.tuples).toHaveLength(3);

    act(() => result.current.setHoveredSlot(1));
    expect(result.current.hoveredSlot).toBe(1);
  });
});
