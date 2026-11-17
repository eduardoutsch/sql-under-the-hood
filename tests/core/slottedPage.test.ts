import { describe, expect, it } from 'vitest';
import {
  compactSlottedPage,
  computePageMetrics,
  INITIAL_TUPLES,
  insertTuple,
  markTupleDead,
  MAX_TUPLES,
  PAGE_SIZE_BYTES,
} from '../../src/core/slottedPage';

describe('slottedPage pure domain logic', () => {
  it('computes pd_lower, pd_upper, and freeBytes for initial tuples', () => {
    const metrics = computePageMetrics(INITIAL_TUPLES);
    expect(metrics.pdLower).toBe(24 + 3 * 4);
    expect(metrics.pdUpper).toBe(8044);
    expect(metrics.freeBytes).toBe(8044 - 36);
  });

  it('handles empty page metrics gracefully', () => {
    const metrics = computePageMetrics([]);
    expect(metrics.pdLower).toBe(24);
    expect(metrics.pdUpper).toBe(PAGE_SIZE_BYTES);
    expect(metrics.freeBytes).toBe(PAGE_SIZE_BYTES - 24);
  });

  it('inserts a new tuple growing downward from pd_upper and stops at MAX_TUPLES', () => {
    let tuples = INITIAL_TUPLES;
    while (tuples.length < MAX_TUPLES) {
      tuples = insertTuple(tuples);
    }
    expect(tuples).toHaveLength(MAX_TUPLES);
    expect(tuples[tuples.length - 1].offset).toBeLessThan(INITIAL_TUPLES[2].offset);
    // Inserting beyond MAX_TUPLES is a no-op
    expect(insertTuple(tuples)).toEqual(tuples);
  });

  it('marks a specific tuple as dead without removing its slot', () => {
    const updated = markTupleDead(INITIAL_TUPLES, 2);
    expect(updated).toHaveLength(3);
    expect(updated[1].alive).toBe(false);
    expect(updated[0].alive).toBe(true);
  });

  it('compacts alive tuples toward the end of the 8KB page and renumbers slots', () => {
    const withDead = markTupleDead(INITIAL_TUPLES, 2);
    const compacted = compactSlottedPage(withDead);
    expect(compacted).toHaveLength(2);
    expect(compacted[0]).toMatchObject({ slot: 1, name: 'Ana', offset: 8144 });
    expect(compacted[1]).toMatchObject({ slot: 2, name: 'Carla', offset: 8096 });
  });
});
