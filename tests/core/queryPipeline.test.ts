import { describe, expect, it } from 'vitest';
import {
  advancePipelineStage,
  getSqlTokens,
  getVdbeOpcodes,
  PIPELINE_STAGE_COUNT,
  stepVmProgramCounter,
} from '../../src/core/queryPipeline';

describe('queryPipeline pure domain logic', () => {
  it('returns the 10 classified SQL tokens for the sample query', () => {
    const tokens = getSqlTokens();
    expect(tokens).toHaveLength(10);
    expect(tokens[0]).toMatchObject({ text: 'SELECT', type: 'KEYWORD' });
    expect(tokens[9]).toMatchObject({ text: '100', type: 'NUMBER' });
  });

  it('returns localized VDBE opcodes for pt and en', () => {
    const ptOps = getVdbeOpcodes('pt');
    const enOps = getVdbeOpcodes('en');
    expect(ptOps).toHaveLength(8);
    expect(enOps).toHaveLength(8);
    expect(ptOps[0].op).toBe('Init');
    expect(ptOps[0].comment).not.toBe(enOps[0].comment);
  });

  it('advances pipeline stage with wrap-around', () => {
    expect(advancePipelineStage(0)).toBe(1);
    expect(advancePipelineStage(PIPELINE_STAGE_COUNT - 1)).toBe(0);
  });

  it('steps VDBE program counter with wrap-around and handles non-positive length', () => {
    expect(stepVmProgramCounter(0, 8)).toBe(1);
    expect(stepVmProgramCounter(7, 8)).toBe(0);
    expect(stepVmProgramCounter(2, 0)).toBe(0);
  });
});
