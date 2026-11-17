import { describe, expect, it } from 'vitest';
import {
  clampModuleIndex,
  computeProgressPct,
  MODULE_COUNT,
  stepModuleIndex,
} from '../../src/core/appNavigation';

describe('appNavigation pure helpers', () => {
  it('clamps module index within [0, MODULE_COUNT - 1]', () => {
    expect(clampModuleIndex(-3)).toBe(0);
    expect(clampModuleIndex(0)).toBe(0);
    expect(clampModuleIndex(2)).toBe(2);
    expect(clampModuleIndex(99)).toBe(MODULE_COUNT - 1);
  });

  it('steps module index forward and backward without overflowing', () => {
    expect(stepModuleIndex(0, -1)).toBe(0);
    expect(stepModuleIndex(0, 1)).toBe(1);
    expect(stepModuleIndex(4, 1)).toBe(4);
    expect(stepModuleIndex(4, -1)).toBe(3);
  });

  it('computes progress percentage accurately', () => {
    expect(computeProgressPct(0, 5)).toBe(20);
    expect(computeProgressPct(4, 5)).toBe(100);
    expect(computeProgressPct(0, 0)).toBe(0);
  });
});
