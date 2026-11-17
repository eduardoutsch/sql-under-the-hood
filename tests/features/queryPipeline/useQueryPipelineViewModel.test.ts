import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useQueryPipelineViewModel } from '../../../src/features/queryPipeline/useQueryPipelineViewModel';

describe('useQueryPipelineViewModel', () => {
  it('steps stages, toggles play/pause, switches execution target, and resets', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useQueryPipelineViewModel('pt'));

    expect(result.current.stage).toBe(0);
    expect(result.current.tokens).toHaveLength(10);
    expect(result.current.opcodes).toHaveLength(8);

    act(() => result.current.stepStage());
    expect(result.current.stage).toBe(1);

    act(() => result.current.togglePlay());
    expect(result.current.isPlaying).toBe(true);

    act(() => vi.advanceTimersByTime(1800 * 4));
    expect(result.current.stage).toBe(4);
    expect(result.current.isPlaying).toBe(false);

    act(() => result.current.setExecTarget('jit'));
    expect(result.current.execTarget).toBe('jit');

    act(() => result.current.stepVm());
    expect(result.current.vmPc).toBe(1);

    act(() => result.current.toggleNotes());
    expect(result.current.notesOpen).toBe(true);

    act(() => result.current.reset());
    expect(result.current.stage).toBe(0);
    expect(result.current.vmPc).toBe(0);
    vi.useRealTimers();
  });
});
