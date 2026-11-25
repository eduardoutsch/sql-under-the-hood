import { describe, expect, it } from 'vitest';
import {
  BUFFER_POOL_CAPACITY,
  computeByteOffset,
  fetchBufferPage,
  getHardwareTiers,
} from '../../src/core/storageHierarchy';

describe('storageHierarchy pure domain logic', () => {
  it('returns 6 localized hardware latency tiers', () => {
    const ptTiers = getHardwareTiers('pt');
    const enTiers = getHardwareTiers('en');
    expect(ptTiers).toHaveLength(6);
    expect(enTiers).toHaveLength(6);
    expect(ptTiers[0].human).toBe('0,25 seg');
    expect(enTiers[0].human).toBe('0.25 sec');
  });

  it('computes physical heap file byte offset', () => {
    expect(computeByteOffset(2, 8)).toBe(16384);
    expect(computeByteOffset(3, 4)).toBe(12288);
    expect(computeByteOffset(-1, 8)).toBe(0);
  });

  it('promotes hit page to most-recently-used slot (LRU) without mutating input', () => {
    const pool = [0, 3, 2];
    const result = fetchBufferPage(pool, 0);
    expect(result.status).toBe('hit');
    expect(result.nextPool).toEqual([3, 2, 0]);
    expect(pool).toEqual([0, 3, 2]);
  });

  it('reports cache miss and evicts oldest frame when capacity is exceeded', () => {
    const fullPool = [0, 1, 2];
    expect(fullPool).toHaveLength(BUFFER_POOL_CAPACITY);
    const result = fetchBufferPage(fullPool, 4);
    expect(result.status).toBe('miss');
    expect(result.nextPool).toEqual([1, 2, 4]);
  });

  it('appends page on miss when buffer pool has free frames', () => {
    const result = fetchBufferPage([0, 3], 2);
    expect(result.status).toBe('miss');
    expect(result.nextPool).toEqual([0, 3, 2]);
  });
});
