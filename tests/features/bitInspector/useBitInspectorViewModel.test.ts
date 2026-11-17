import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useBitInspectorViewModel } from '../../../src/features/bitInspector/useBitInspectorViewModel';

describe('useBitInspectorViewModel', () => {
  it('toggles column null state and alignment mode', () => {
    const { result } = renderHook(() => useBitInspectorViewModel());

    expect(result.current.bitmapBits).toBe('1110');
    expect(result.current.payloadBytes).toBe(12);
    expect(result.current.alignMode).toBe('good');

    act(() => result.current.toggleNull(3));
    expect(result.current.bitmapBits).toBe('1111');
    expect(result.current.payloadBytes).toBe(16);

    act(() => result.current.setAlignMode('bad'));
    expect(result.current.alignMode).toBe('bad');
  });
});
