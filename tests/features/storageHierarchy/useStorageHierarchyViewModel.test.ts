import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useStorageHierarchyViewModel } from '../../../src/features/storageHierarchy/useStorageHierarchyViewModel';

describe('useStorageHierarchyViewModel', () => {
  it('manages pulse state, page size, buffer fetches, and eviction', () => {
    const { result } = renderHook(() => useStorageHierarchyViewModel('en'));

    expect(result.current.pulsing).toBe(true);
    expect(result.current.byteOffset).toBe(16384);

    act(() => result.current.togglePulsing());
    expect(result.current.pulsing).toBe(false);

    act(() => result.current.fetchPage(0));
    expect(result.current.lastStatus).toBe('hit');

    act(() => result.current.fetchPage(2));
    expect(result.current.lastStatus).toBe('miss');
    expect(result.current.bufferPool).toEqual([3, 0, 2]);

    act(() => result.current.setPageSizeKb(4));
    expect(result.current.byteOffset).toBe(8192);

    act(() => result.current.clearBufferPool());
    expect(result.current.bufferPool).toEqual([]);
    expect(result.current.lastStatus).toBeNull();
  });
});
