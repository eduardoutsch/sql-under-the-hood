import { describe, expect, it } from 'vitest';
import {
  computeNullBitmap,
  computePayloadBytes,
  INITIAL_COLUMNS,
  toggleColumnNull,
} from '../../src/core/bitInspector';

describe('bitInspector pure domain logic', () => {
  it('computes null bitmap string with 1 for present and 0 for NULL', () => {
    expect(computeNullBitmap(INITIAL_COLUMNS)).toBe('1110');
  });

  it('computes payload bytes excluding NULL columns', () => {
    expect(computePayloadBytes(INITIAL_COLUMNS)).toBe(12);
  });

  it('toggles a column NULL state immutably and ignores out-of-bounds index', () => {
    const toggled = toggleColumnNull(INITIAL_COLUMNS, 3);
    expect(toggled[3].isNull).toBe(false);
    expect(computeNullBitmap(toggled)).toBe('1111');
    expect(computePayloadBytes(toggled)).toBe(16);

    expect(toggleColumnNull(INITIAL_COLUMNS, -1)).toEqual(INITIAL_COLUMNS);
    expect(toggleColumnNull(INITIAL_COLUMNS, 99)).toEqual(INITIAL_COLUMNS);
  });
});
