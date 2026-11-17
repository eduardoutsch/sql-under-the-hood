# 04_tests

> Generated snapshot containing 16 file(s).

## Table of Contents

- [`tests/App.test.tsx`](#tests-app-test-tsx)
- [`tests/components/DeployModal.test.tsx`](#tests-components-deploymodal-test-tsx)
- [`tests/components/Navbar.test.tsx`](#tests-components-navbar-test-tsx)
- [`tests/core/appNavigation.test.ts`](#tests-core-appnavigation-test-ts)
- [`tests/core/bitInspector.test.ts`](#tests-core-bitinspector-test-ts)
- [`tests/core/i18n.test.ts`](#tests-core-i18n-test-ts)
- [`tests/core/queryPipeline.test.ts`](#tests-core-querypipeline-test-ts)
- [`tests/core/slottedPage.test.ts`](#tests-core-slottedpage-test-ts)
- [`tests/core/storageHierarchy.test.ts`](#tests-core-storagehierarchy-test-ts)
- [`tests/core/volcanoSimd.test.ts`](#tests-core-volcanosimd-test-ts)
- [`tests/features/bitInspector/BitInspectorModule.test.tsx`](#tests-features-bitinspector-bitinspectormodule-test-tsx)
- [`tests/features/queryPipeline/QueryPipelineModule.test.tsx`](#tests-features-querypipeline-querypipelinemodule-test-tsx)
- [`tests/features/slottedPage/SlottedPageModule.test.tsx`](#tests-features-slottedpage-slottedpagemodule-test-tsx)
- [`tests/features/storageHierarchy/StorageHierarchyModule.test.tsx`](#tests-features-storagehierarchy-storagehierarchymodule-test-tsx)
- [`tests/features/volcanoSimd/VolcanoVsSimdModule.test.tsx`](#tests-features-volcanosimd-volcanovssimdmodule-test-tsx)
- [`tests/setup.ts`](#tests-setup-ts)

---

## `tests/App.test.tsx`

````tsx
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

describe('App integration', () => {
  it('defaults to PT-BR, switches to EN, and navigates modules via buttons and keyboard', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('SQL por Baixo dos Panos')).toBeInTheDocument();
    expect(screen.getByText(/Módulo 01 \/ 05/)).toBeInTheDocument();

    // Switch to EN
    await user.click(screen.getByText('PT-BR'));
    expect(screen.getByText('SQL Under the Hood')).toBeInTheDocument();

    // Navigate forward via Next Module button
    await user.click(screen.getByText('Next Module'));
    expect(screen.getByText(/Module 02 \/ 05/)).toBeInTheDocument();

    // Navigate via keyboard ArrowRight & ArrowLeft
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText(/Module 03 \/ 05/)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText(/Module 02 \/ 05/)).toBeInTheDocument();

    // Open and close Cloudflare Deploy modal
    await user.click(screen.getByText('Cloudflare Deploy'));
    expect(screen.getByText('Deploy to Cloudflare Pages + Vite')).toBeInTheDocument();
    await user.click(screen.getByText('Close'));
    expect(screen.queryByText('Deploy to Cloudflare Pages + Vite')).not.toBeInTheDocument();
  });
});
````

## `tests/components/DeployModal.test.tsx`

````tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DeployModal } from '../../src/components/DeployModal';
import { I18N } from '../../src/core/i18n';

describe('DeployModal component', () => {
  it('does not render when isOpen is false', () => {
    render(<DeployModal isOpen={false} t={I18N.pt} onClose={vi.fn()} />);
    expect(screen.queryByText(I18N.pt.deployModal.title)).not.toBeInTheDocument();
  });

  it('renders deploy steps and triggers onClose when Close is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DeployModal isOpen={true} t={I18N.en} onClose={onClose} />);

    expect(screen.getByText(I18N.en.deployModal.title)).toBeInTheDocument();
    for (const step of I18N.en.deployModal.steps) {
      expect(screen.getByText(step)).toBeInTheDocument();
    }

    await user.click(screen.getByText(I18N.en.deployModal.close));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
````

## `tests/components/Navbar.test.tsx`

````tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from '../../src/components/Navbar';
import { I18N } from '../../src/core/i18n';

describe('Navbar component', () => {
  const baseProps = {
    t: I18N.pt,
    lang: 'pt' as const,
    activeModule: 0,
    presMode: false,
    progressPct: 20,
    onSelectModule: vi.fn(),
    onToggleLang: vi.fn(),
    onTogglePresMode: vi.fn(),
    onOpenDeployModal: vi.fn(),
  };

  it('renders brand title, 5 module tabs, and PT-BR toggle by default', () => {
    render(<Navbar {...baseProps} />);
    expect(screen.getByText('SQL por Baixo dos Panos')).toBeInTheDocument();
    expect(screen.getByText('PT-BR')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(8);
  });

  it('invokes callbacks when clicking tabs, language toggle, presentation mode, and deploy button', async () => {
    const user = userEvent.setup();
    render(<Navbar {...baseProps} />);

    await user.click(screen.getByText('2. Hierarquia & Buffer'));
    expect(baseProps.onSelectModule).toHaveBeenCalledWith(1);

    await user.click(screen.getByText('PT-BR'));
    expect(baseProps.onToggleLang).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Modo Apresentação'));
    expect(baseProps.onTogglePresMode).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Deploy Cloudflare'));
    expect(baseProps.onOpenDeployModal).toHaveBeenCalledTimes(1);
  });

  it('hides deploy button and shows exit presentation label when presMode is true', () => {
    render(<Navbar {...baseProps} presMode={true} lang="en" t={I18N.en} />);
    expect(screen.queryByText('Cloudflare Deploy')).not.toBeInTheDocument();
    expect(screen.getByText('Exit Presentation')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });
});
````

## `tests/core/appNavigation.test.ts`

````typescript
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
````

## `tests/core/bitInspector.test.ts`

````typescript
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
````

## `tests/core/i18n.test.ts`

````typescript
import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, getTranslations, I18N, toggleLocale } from '../../src/core/i18n';

describe('i18n core dictionary and helpers', () => {
  it('defaults to pt-BR locale', () => {
    expect(DEFAULT_LOCALE).toBe('pt');
    expect(getTranslations('pt').brandTitle).toBe('SQL por Baixo dos Panos');
  });

  it('provides complete English and Portuguese translations for all 5 modules', () => {
    expect(I18N.pt.modules).toHaveLength(5);
    expect(I18N.en.modules).toHaveLength(5);
    expect(I18N.pt.m1.stages).toHaveLength(5);
    expect(I18N.en.m1.stages).toHaveLength(5);
    expect(getTranslations('en').brandTitle).toBe('SQL Under the Hood');
  });

  it('toggles cleanly between pt and en', () => {
    expect(toggleLocale('pt')).toBe('en');
    expect(toggleLocale('en')).toBe('pt');
  });
});
````

## `tests/core/queryPipeline.test.ts`

````typescript
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
````

## `tests/core/slottedPage.test.ts`

````typescript
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
````

## `tests/core/storageHierarchy.test.ts`

````typescript
import { describe, expect, it } from 'vitest';
import {
  BUFFER_POOL_CAPACITY,
  computeByteOffset,
  fetchBufferPage,
  getHardwareTiers,
} from '../../src/core/storageHierarchy';

describe('storageHierarchy pure domain logic', () => {
  it('returns 5 localized hardware latency tiers', () => {
    const ptTiers = getHardwareTiers('pt');
    const enTiers = getHardwareTiers('en');
    expect(ptTiers).toHaveLength(5);
    expect(enTiers).toHaveLength(5);
    expect(ptTiers[0].human).toBe('1 seg');
    expect(enTiers[0].human).toBe('1 sec');
  });

  it('computes physical heap file byte offset', () => {
    expect(computeByteOffset(2, 8)).toBe(16384);
    expect(computeByteOffset(3, 4)).toBe(12288);
    expect(computeByteOffset(-1, 8)).toBe(0);
  });

  it('reports cache hit when page is already in buffer pool without mutating pool', () => {
    const pool = [0, 3];
    const result = fetchBufferPage(pool, 3);
    expect(result.status).toBe('hit');
    expect(result.nextPool).toEqual([0, 3]);
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
````

## `tests/core/volcanoSimd.test.ts`

````typescript
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
````

## `tests/features/bitInspector/BitInspectorModule.test.tsx`

````tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { BitInspectorModule } from '../../../src/features/bitInspector/BitInspectorModule';

describe('BitInspectorModule component', () => {
  it('toggles column NULL state and updates payload size', async () => {
    const user = userEvent.setup();
    render(<BitInspectorModule t={I18N.pt} />);

    expect(screen.getByText(/Payload Size: 12 Bytes/)).toBeInTheDocument();

    // Toggle coupon (initially NULL) to present
    await user.click(screen.getByText(/coupon:/));
    expect(screen.getByText(/Payload Size: 16 Bytes/)).toBeInTheDocument();
  });

  it('switches between good and bad 64-bit word alignment modes', async () => {
    const user = userEvent.setup();
    render(<BitInspectorModule t={I18N.en} />);

    expect(screen.getByText(I18N.en.m4.goodDesc)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Naive Per-Attribute/i }));
    expect(screen.getByText(/STRADDLES 64-BIT WORD BOUNDARY/i)).toBeInTheDocument();
  });
});
````

## `tests/features/queryPipeline/QueryPipelineModule.test.tsx`

````tsx
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { QueryPipelineModule } from '../../../src/features/queryPipeline/QueryPipelineModule';

describe('QueryPipelineModule component', () => {
  it('renders initial Lexer stage and steps through all 5 stages', async () => {
    const user = userEvent.setup();
    render(<QueryPipelineModule t={I18N.pt} lang="pt" />);

    expect(screen.getAllByText('KEYWORD')).toHaveLength(3);

    // Step to Parser (AST)
    await user.click(screen.getByText(I18N.pt.step));
    expect(screen.getByText(/Abstract Syntax Tree/i)).toBeInTheDocument();

    // Step to Rewriter
    await user.click(screen.getByText(I18N.pt.step));
    expect(screen.getByText(/Query Tree Reescrita/i)).toBeInTheDocument();

    // Step to Optimizer (CBO)
    await user.click(screen.getByText(I18N.pt.step));
    expect(screen.getByText('CANDIDATE PLAN A')).toBeInTheDocument();

    // Step to Execution (VM / JIT)
    await user.click(screen.getByText(I18N.pt.step));
    expect(screen.getByText(I18N.pt.m1.sqliteMode)).toBeInTheDocument();

    // Step VDBE PC and switch to LLVM JIT
    await user.click(screen.getByText(/sqlite3_step\(\)/i));
    expect(screen.getByText(/\[PC=1\]/)).toBeInTheDocument();

    await user.click(screen.getByText(I18N.pt.m1.jitMode));
    expect(screen.getByText(/eval_qual_jit:/i)).toBeInTheDocument();
  });

  it('auto-advances stages when Play is clicked and resets on Reset', async () => {
    vi.useFakeTimers();
    render(<QueryPipelineModule t={I18N.en} lang="en" />);

    act(() => {
      screen.getByText(I18N.en.play).click();
    });
    expect(screen.getByText(I18N.en.pause)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1800 * 5);
    });
    expect(screen.getByText(I18N.en.m1.sqliteMode)).toBeInTheDocument();

    act(() => {
      screen.getByTitle(I18N.en.reset).click();
    });
    expect(screen.getAllByText('KEYWORD')).toHaveLength(3);
    vi.useRealTimers();
  });
});
````

## `tests/features/slottedPage/SlottedPageModule.test.tsx`

````tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { SlottedPageModule } from '../../../src/features/slottedPage/SlottedPageModule';

describe('SlottedPageModule component', () => {
  it('inserts a tuple, marks a tuple dead on click, and compacts dead tuples', async () => {
    const user = userEvent.setup();
    render(<SlottedPageModule t={I18N.pt} />);

    expect(screen.getByText('pd_lower: 36 B')).toBeInTheDocument();

    await user.click(screen.getByText(I18N.pt.m3.insertBtn));
    expect(screen.getByText('pd_lower: 40 B')).toBeInTheDocument();
    expect(screen.getByText('Slot #4 (4B)')).toBeInTheDocument();

    // Mark Slot #2 as dead
    await user.click(screen.getByText('Slot #2 (4B)'));
    expect(screen.getByText('LP_DEAD (0)')).toBeInTheDocument();

    // Compact page (VACUUM)
    await user.click(screen.getByText(I18N.pt.m3.compactBtn));
    expect(screen.queryByText('LP_DEAD (0)')).not.toBeInTheDocument();
    expect(screen.getByText('pd_lower: 36 B')).toBeInTheDocument();
  });
});
````

## `tests/features/storageHierarchy/StorageHierarchyModule.test.tsx`

````tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { StorageHierarchyModule } from '../../../src/features/storageHierarchy/StorageHierarchyModule';

describe('StorageHierarchyModule component', () => {
  it('displays hardware latency tiers and toggles read pulse', async () => {
    const user = userEvent.setup();
    render(<StorageHierarchyModule t={I18N.pt} lang="pt" />);

    expect(screen.getByText('L1 Cache')).toBeInTheDocument();
    expect(screen.getByText('HDD Magnético')).toBeInTheDocument();

    await user.click(screen.getByText(I18N.pt.pause));
    expect(screen.getByText(I18N.pt.m2.startPulse)).toBeInTheDocument();
  });

  it('simulates buffer pool hit, miss, page size switch, and eviction', async () => {
    const user = userEvent.setup();
    render(<StorageHierarchyModule t={I18N.en} lang="en" />);

    // Page 0 is initially in buffer pool -> HIT
    await user.click(screen.getByText('Pág #0'));
    expect(screen.getByText(/CACHE HIT/i)).toBeInTheDocument();

    // Page 2 is not in buffer pool -> MISS
    await user.click(screen.getByText('Pág #2'));
    expect(screen.getByText(/PAGE FAULT \/ MISS/i)).toBeInTheDocument();

    // Switch page size to 4 KB
    await user.click(screen.getByText('4 KB'));
    expect(screen.getByText(/8,192 bytes|8.192 bytes/)).toBeInTheDocument();

    // Evict buffer pool
    await user.click(screen.getByText(I18N.en.m2.evictBtn));
    expect(screen.getByText('0/3 frames')).toBeInTheDocument();
  });
});
````

## `tests/features/volcanoSimd/VolcanoVsSimdModule.test.tsx`

````tsx
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { VolcanoVsSimdModule } from '../../../src/features/volcanoSimd/VolcanoVsSimdModule';

describe('VolcanoVsSimdModule component', () => {
  it('steps simulation and switches between AVX2 and AVX-512', async () => {
    const user = userEvent.setup();
    render(<VolcanoVsSimdModule t={I18N.pt} />);

    await user.click(screen.getByText(I18N.pt.step));
    expect(screen.getByText('18 clk')).toBeInTheDocument();
    expect(screen.getByText('2 clk')).toBeInTheDocument();

    await user.click(screen.getByText('AVX-512 (16× int32)'));
    expect(screen.getByText(/vpcmpgtd zmm0, zmm1/)).toBeInTheDocument();
    expect(screen.getAllByText('0 clk')).toHaveLength(2);
  });

  it('runs race with Play and stops cleanly when finished', () => {
    vi.useFakeTimers();
    render(<VolcanoVsSimdModule t={I18N.en} />);

    act(() => {
      screen.getByText(I18N.en.play).click();
    });
    expect(screen.getByText(I18N.en.pause)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(420 * 35);
    });
    expect(screen.getByText(I18N.en.play)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
````

## `tests/setup.ts`

````typescript
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
````
