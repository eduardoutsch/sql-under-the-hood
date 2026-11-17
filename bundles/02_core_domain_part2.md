# 02_core_domain_part2

> Generated snapshot containing 2 file(s).

## Table of Contents

- [`src/core/storageHierarchy.ts`](#src-core-storagehierarchy-ts)
- [`src/core/volcanoSimd.ts`](#src-core-volcanosimd-ts)

---

## `src/core/storageHierarchy.ts`

````typescript
/**
 * Pure domain logic for Module 2 (Storage Hierarchy & Buffer Pool Simulator).
 * Models hardware latency tiers, physical heap-file byte offsets, and a fixed-capacity
 * FIFO/LRU-style page frame pool without touching React state.
 */

import type { Locale } from './i18n';

export const BUFFER_POOL_CAPACITY = 3;

export type BufferFetchStatus = 'hit' | 'miss';

export interface HardwareTier {
  name: string;
  real: string;
  human: string;
  barWidth: string;
  color: string;
  text: string;
  animDurationSec: number;
}

export interface BufferFetchResult {
  status: BufferFetchStatus;
  nextPool: number[];
}

/**
 * Build the 5 hardware memory/storage tiers with localized human-scale equivalents.
 */
export function getHardwareTiers(locale: Locale): HardwareTier[] {
  const isPt = locale === 'pt';
  return [
    {
      name: 'L1 Cache',
      real: '1 ns',
      human: isPt ? '1 seg' : '1 sec',
      barWidth: 'w-[6%]',
      color: 'bg-[#D94E28]',
      text: 'text-[#B83B1D]',
      animDurationSec: 0.45,
    },
    {
      name: 'L2 Cache',
      real: '4 ns',
      human: isPt ? '4 seg' : '4 sec',
      barWidth: 'w-[14%]',
      color: 'bg-emerald-700',
      text: 'text-emerald-800',
      animDurationSec: 0.9,
    },
    {
      name: 'DRAM (Buffer Pool)',
      real: '100 ns',
      human: isPt ? '100 seg' : '100 sec',
      barWidth: 'w-[32%]',
      color: 'bg-blue-700',
      text: 'text-blue-800',
      animDurationSec: 2.0,
    },
    {
      name: 'NVMe SSD',
      real: '16,000 ns',
      human: isPt ? '4,4 horas' : '4.4 hours',
      barWidth: 'w-[68%]',
      color: 'bg-amber-600',
      text: 'text-amber-800',
      animDurationSec: 4.5,
    },
    {
      name: 'HDD Magnético',
      real: '2,000,000 ns',
      human: isPt ? '3,3 semanas' : '3.3 weeks',
      barWidth: 'w-full',
      color: 'bg-rose-700',
      text: 'text-rose-800',
      animDurationSec: 9.0,
    },
  ];
}

/**
 * Compute the physical byte offset of a page in a heap file.
 */
export function computeByteOffset(pageNumber: number, pageSizeKb: number): number {
  if (pageNumber < 0 || pageSizeKb <= 0) return 0;
  return pageNumber * pageSizeKb * 1024;
}

/**
 * Simulate fetching a page into the 3-frame DRAM Buffer Pool.
 * Returns a cache hit if present, or evicts the oldest frame on miss when full.
 */
export function fetchBufferPage(
  currentPool: readonly number[],
  pageNumber: number,
  capacity: number = BUFFER_POOL_CAPACITY
): BufferFetchResult {
  if (currentPool.includes(pageNumber)) {
    return { status: 'hit', nextPool: [...currentPool] };
  }
  const next = [...currentPool, pageNumber];
  const nextPool = next.length > capacity ? next.slice(next.length - capacity) : next;
  return { status: 'miss', nextPool };
}
````

## `src/core/volcanoSimd.ts`

````typescript
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
````
