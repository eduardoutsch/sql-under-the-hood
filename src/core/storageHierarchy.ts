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
 * Build the 6 hardware memory/storage tiers with localized human-scale equivalents (1 ns = 0.25 s).
 */
export function getHardwareTiers(locale: Locale): HardwareTier[] {
  const isPt = locale === 'pt';
  return [
    {
      name: 'L1 Cache',
      real: '1 ns',
      human: isPt ? '0,25 seg' : '0.25 sec',
      barWidth: 'w-[6%]',
      color: 'bg-[#D94E28]',
      text: 'text-[#B83B1D]',
      animDurationSec: 0.25,
    },
    {
      name: 'L2 Cache',
      real: '4 ns',
      human: isPt ? '1 seg' : '1 sec',
      barWidth: 'w-[14%]',
      color: 'bg-emerald-700',
      text: 'text-emerald-800',
      animDurationSec: 1,
    },
    {
      name: isPt ? 'Buffer Pool (Cache em RAM)' : 'Buffer Pool (RAM Cache)',
      real: '60 ns',
      human: isPt ? '15 seg' : '15 sec',
      barWidth: 'w-[24%]',
      color: 'bg-cyan-700',
      text: 'text-cyan-800',
      animDurationSec: 15,
    },
    {
      name: isPt ? 'DRAM (RAM Principal)' : 'DRAM (Main RAM)',
      real: '100 ns',
      human: isPt ? '25 seg' : '25 sec',
      barWidth: 'w-[36%]',
      color: 'bg-blue-700',
      text: 'text-blue-800',
      animDurationSec: 25,
    },
    {
      name: 'NVMe SSD',
      real: '16,000 ns',
      human: isPt ? '1,1 horas' : '1.1 hours',
      barWidth: 'w-[68%]',
      color: 'bg-amber-600',
      text: 'text-amber-800',
      animDurationSec: 4000,
    },
    {
      name: 'HDD Magnético',
      real: '2,000,000 ns',
      human: isPt ? '5,8 dias' : '5.8 days',
      barWidth: 'w-full',
      color: 'bg-rose-700',
      text: 'text-rose-800',
      animDurationSec: 500000,
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
 * Simulate fetching a page into the 3-frame DRAM Buffer Pool (LRU).
 * On hit, promotes the page to the most-recently-used slot; on miss, evicts the LRU frame when full.
 */
export function fetchBufferPage(
  currentPool: readonly number[],
  pageNumber: number,
  capacity: number = BUFFER_POOL_CAPACITY
): BufferFetchResult {
  if (currentPool.includes(pageNumber)) {
    const withoutPage = currentPool.filter((p) => p !== pageNumber);
    return { status: 'hit', nextPool: [...withoutPage, pageNumber] };
  }
  const next = [...currentPool, pageNumber];
  const nextPool = next.length > capacity ? next.slice(next.length - capacity) : next;
  return { status: 'miss', nextPool };
}
