import { describe, expect, it } from 'vitest';
import {
  computeExecutionMetrics,
  computeSurvivingIndices,
  DATASET_PRICES,
  stepExecutionRace,
} from '../../src/core/volcanoSimd';

describe('volcanoSimd pure domain logic', () => {
  it('advances volcano by 1 and simd by simdLane without exceeding dataset length', () => {
    expect(stepExecutionRace({ volcanoIdx: 0, simdIdx: 0 }, 8)).toEqual({
      volcanoIdx: 1,
      simdIdx: 8,
    });
    expect(stepExecutionRace({ volcanoIdx: 32, simdIdx: 30 }, 16)).toEqual({
      volcanoIdx: 32,
      simdIdx: DATASET_PRICES.length,
    });
  });

  it('computes surviving indices where price > 100 up to simdIdx', () => {
    const surviving = computeSurvivingIndices(DATASET_PRICES, 8);
    // Prices > 100 in first 8: index 1 (120), 3 (250), 5 (175), 7 (310)
    expect(surviving).toEqual([1, 3, 5, 7]);
  });

  it('computes Volcano and SIMD CPU cycles accurately', () => {
    const metrics = computeExecutionMetrics(10, 16, 8);
    expect(metrics.volcanoCycles).toBe(180);
    expect(metrics.simdCycles).toBe(4);
  });
});
