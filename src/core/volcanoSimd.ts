/**
 * Pure domain logic for Module 5 (Volcano Iterator vs. Vectorized SIMD Execution).
 * Models row-at-a-time vs. AVX2/AVX-512 batch progress, CPU cycle estimates, and
 * zero-copy Selection Vector index extraction.
 */

export type SimdLaneWidth = 8 | 16;

export interface RaceProgress {
  volcanoIdx: number;
  simdIdx: number;
}

export interface ExecutionMetrics {
  volcanoCycles: number;
  simdCycles: number;
}

export const DATASET_PRICES: readonly number[] = [
  45, 120, 88, 250, 30, 175, 99, 310,
  140, 60, 205, 15, 190, 102, 75, 400,
  55, 130, 95, 280, 110, 40, 160, 82,
  210, 19, 145, 305, 90, 115, 64, 500,
];

const VOLCANO_CYCLES_PER_ROW = 18;
const SIMD_CYCLES_PER_BATCH = 2;
const FILTER_THRESHOLD = 100;

/**
 * Advance Volcano by 1 row and SIMD by `simdLane` rows, clamped to dataset length.
 */
export function stepExecutionRace(
  progress: RaceProgress,
  simdLane: SimdLaneWidth,
  totalRows: number = DATASET_PRICES.length
): RaceProgress {
  return {
    volcanoIdx: Math.min(totalRows, progress.volcanoIdx + 1),
    simdIdx: Math.min(totalRows, progress.simdIdx + simdLane),
  };
}

/**
 * Collect indices of rows matching `price > 100` within the processed SIMD prefix.
 */
export function computeSurvivingIndices(
  prices: readonly number[],
  simdIdx: number
): number[] {
  const surviving: number[] = [];
  const limit = Math.min(prices.length, simdIdx);
  for (let i = 0; i < limit; i += 1) {
    if (prices[i] > FILTER_THRESHOLD) {
      surviving.push(i);
    }
  }
  return surviving;
}

/**
 * Estimate CPU clock cycles consumed by Volcano vs. SIMD execution.
 */
export function computeExecutionMetrics(
  volcanoIdx: number,
  simdIdx: number,
  simdLane: SimdLaneWidth
): ExecutionMetrics {
  const simdBatchesDone = Math.ceil(simdIdx / simdLane);
  return {
    volcanoCycles: volcanoIdx * VOLCANO_CYCLES_PER_ROW,
    simdCycles: simdBatchesDone * SIMD_CYCLES_PER_BATCH,
  };
}
