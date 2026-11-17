# 03_ui_components_and_features_part2

> Generated snapshot containing 9 file(s).

## Table of Contents

- [`src/features/slottedPage/SlottedPageModule.tsx`](#src-features-slottedpage-slottedpagemodule-tsx)
- [`src/features/slottedPage/useSlottedPageViewModel.ts`](#src-features-slottedpage-useslottedpageviewmodel-ts)
- [`src/features/storageHierarchy/StorageHierarchyModule.tsx`](#src-features-storagehierarchy-storagehierarchymodule-tsx)
- [`src/features/storageHierarchy/useStorageHierarchyViewModel.ts`](#src-features-storagehierarchy-usestoragehierarchyviewmodel-ts)
- [`src/features/volcanoSimd/useVolcanoSimdViewModel.ts`](#src-features-volcanosimd-usevolcanosimdviewmodel-ts)
- [`src/features/volcanoSimd/VolcanoVsSimdModule.tsx`](#src-features-volcanosimd-volcanovssimdmodule-tsx)
- [`src/index.css`](#src-index-css)
- [`src/main.tsx`](#src-main-tsx)
- [`src/useAppViewModel.ts`](#src-useappviewmodel-ts)

---

## `src/features/slottedPage/SlottedPageModule.tsx`

````tsx
import { Plus, Zap } from 'lucide-react';
import type { TranslationBundle } from '../../core/i18n';
import { PAGE_SIZE_BYTES } from '../../core/slottedPage';
import { useSlottedPageViewModel } from './useSlottedPageViewModel';

export interface SlottedPageModuleProps {
  t: TranslationBundle;
}

/**
 * Dumb View for Module 3 (8 KB PostgreSQL Slotted Page Layout).
 * Delegates tuple state, metrics, and compaction to `useSlottedPageViewModel`.
 */
export function SlottedPageModule({ t }: SlottedPageModuleProps) {
  const vm = useSlottedPageViewModel();
  const { pdLower, pdUpper, freeBytes } = vm.metrics;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">
            Page Size: 8192 B
          </span>
          <span className="text-cyan-400">pd_lower: {pdLower} B</span>
          <span className="text-emerald-400">pd_upper: {pdUpper} B</span>
          <span className="text-amber-300">Free: {freeBytes} B</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={vm.insert}
            disabled={vm.isPageFull}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {t.m3.insertBtn}
          </button>
          <button
            onClick={vm.compact}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            <Zap className="w-4 h-4" /> {t.m3.compactBtn}
          </button>
        </div>
      </div>

      <div className="bg-slate-900/90 border-2 border-slate-700 rounded-2xl p-5 space-y-5 relative overflow-hidden">
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>Byte 0x0000 (0)</span>
          <span>{t.m3.clickDelete}</span>
          <span>Byte 0x2000 (8192)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="p-3 rounded-xl bg-violet-950/70 border border-violet-400/60 font-mono text-xs shrink-0">
            <div className="font-bold text-violet-300">PageHeaderData</div>
            <div className="text-[10px] text-violet-200/80">24 Bytes [0..23]</div>
          </div>

          {vm.tuples.map((item) => (
            <button
              key={item.slot}
              onMouseEnter={() => vm.setHoveredSlot(item.slot)}
              onMouseLeave={() => vm.setHoveredSlot(null)}
              onClick={() => vm.markDead(item.slot)}
              className={`p-2.5 rounded-xl border font-mono text-left transition-all cursor-pointer ${
                !item.alive
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-400 line-through opacity-70'
                  : vm.hoveredSlot === item.slot
                  ? 'bg-cyan-500/30 border-cyan-300 scale-105 shadow-lg'
                  : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300'
              }`}
            >
              <div className="text-[10px] font-bold">Slot #{item.slot} (4B)</div>
              <div className="text-[10px] text-slate-300">
                {item.alive ? `off:${item.offset} len:${item.len}` : 'LP_DEAD (0)'}
              </div>
            </button>
          ))}

          <div className="flex items-center text-cyan-400 font-mono text-xs px-2 animate-pulse">
            pd_lower →
          </div>
        </div>

        <div className="py-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 text-center font-mono">
          <div className="text-xs text-slate-400 uppercase tracking-widest">{t.m3.freeDesc}</div>
          <div className="text-lg font-bold text-slate-200 mt-1">
            {freeBytes} Bytes ({((freeBytes / PAGE_SIZE_BYTES) * 100).toFixed(1)}%)
          </div>
          {vm.isPageFull && <div className="text-xs text-amber-400 mt-1">{t.m3.pageFull}</div>}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex items-center text-emerald-400 font-mono text-xs px-2 animate-pulse">
            ← pd_upper
          </div>

          {[...vm.tuples].reverse().map((item) => (
            <button
              key={item.slot}
              onMouseEnter={() => vm.setHoveredSlot(item.slot)}
              onMouseLeave={() => vm.setHoveredSlot(null)}
              onClick={() => vm.markDead(item.slot)}
              className={`p-3 rounded-xl border font-mono text-left transition-all cursor-pointer ${
                !item.alive
                  ? 'bg-rose-950/30 border-rose-500/30 text-rose-400/70 opacity-60'
                  : vm.hoveredSlot === item.slot
                  ? 'bg-emerald-500/30 border-emerald-300 scale-105 shadow-lg'
                  : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[10px]">
                <span className="font-bold text-emerald-300">Tuple #{item.slot}</span>
                <span className="text-slate-400">@{item.offset}</span>
              </div>
              <div className="text-xs text-white mt-1">
                ('{item.name}', ${item.price})
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {item.alive ? `${item.len}B HeapTuple` : 'Dead Space (Awaiting VACUUM)'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-violet-500/30 text-violet-200">
          {t.m3.headerDesc}
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-cyan-200">
          {t.m3.slotsDesc}
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 text-emerald-200">
          {t.m3.tuplesDesc}
        </div>
      </div>
    </div>
  );
}
````

## `src/features/slottedPage/useSlottedPageViewModel.ts`

````typescript
import { useState } from 'react';
import {
  compactSlottedPage,
  computePageMetrics,
  INITIAL_TUPLES,
  insertTuple,
  markTupleDead,
  MAX_TUPLES,
  type SlottedTuple,
} from '../../core/slottedPage';

/**
 * ViewModel for Module 3 (8 KB PostgreSQL Slotted Page Layout).
 * Manages tuple list, hover highlight, and page compaction actions.
 */
export function useSlottedPageViewModel() {
  const [tuples, setTuples] = useState<SlottedTuple[]>([...INITIAL_TUPLES]);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  const metrics = computePageMetrics(tuples);
  const isPageFull = tuples.length >= MAX_TUPLES;

  return {
    tuples,
    hoveredSlot,
    metrics,
    isPageFull,
    setHoveredSlot,
    insert: () => setTuples((prev) => insertTuple(prev)),
    markDead: (slot: number) => setTuples((prev) => markTupleDead(prev, slot)),
    compact: () => setTuples((prev) => compactSlottedPage(prev)),
  };
}
````

## `src/features/storageHierarchy/StorageHierarchyModule.tsx`

````tsx
import { Activity, HardDrive, Layers, Pause, Play } from 'lucide-react';
import type { Locale, TranslationBundle } from '../../core/i18n';
import { useStorageHierarchyViewModel } from './useStorageHierarchyViewModel';

export interface StorageHierarchyModuleProps {
  t: TranslationBundle;
  lang: Locale;
}

/**
 * Dumb View for Module 2 (Storage Hierarchy & Buffer Pool Simulator).
 * Projects state and dispatches user actions via `useStorageHierarchyViewModel`.
 */
export function StorageHierarchyModule({ t, lang }: StorageHierarchyModuleProps) {
  const vm = useStorageHierarchyViewModel(lang);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            {t.m2.realLatency} vs. {t.m2.humanScale}
          </h3>
          <button
            onClick={vm.togglePulsing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 cursor-pointer"
          >
            {vm.pulsing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {vm.pulsing ? t.pause : t.m2.startPulse}
          </button>
        </div>

        <div className="space-y-3">
          {vm.tiers.map((tier) => (
            <div key={tier.name} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
              <div className="flex flex-wrap items-center justify-between text-xs font-mono mb-2 gap-2">
                <span className={`font-bold ${tier.text}`}>{tier.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-slate-300">{tier.real}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300">
                    ⏱ {tier.human}
                  </span>
                </div>
              </div>
              <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className={`h-full opacity-25 ${tier.color} ${tier.barWidth}`} />
                {vm.pulsing && (
                  <div
                    style={{ animation: `pulseRace ${tier.animDurationSec}s linear infinite` }}
                    className={`absolute top-0 bottom-0 w-8 rounded-full ${tier.color} shadow-[0_0_12px_currentColor]`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-100">{t.m2.bufferSimTitle}</h3>
            <p className="text-xs font-mono text-cyan-400 mt-0.5">
              {t.m2.formula}: Offset = Page#{vm.activePage} × {vm.pageSizeKb * 1024} bytes ={' '}
              <span className="text-amber-300 font-bold">{vm.byteOffset.toLocaleString()} bytes</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">{t.m2.pageSizeLabel}:</span>
            {[4, 8].map((sz) => (
              <button
                key={sz}
                onClick={() => vm.setPageSizeKb(sz)}
                className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer ${
                  vm.pageSizeKb === sz ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {sz} KB
              </button>
            ))}
            <button
              onClick={vm.clearBufferPool}
              className="px-2.5 py-1 rounded text-xs font-mono bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 cursor-pointer"
            >
              {t.m2.evictBtn}
            </button>
          </div>
        </div>

        {vm.lastStatus && (
          <div
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold border flex items-center justify-between ${
              vm.lastStatus === 'hit'
                ? 'bg-emerald-950/50 border-emerald-400 text-emerald-300'
                : 'bg-amber-950/50 border-amber-400 text-amber-300'
            }`}
          >
            <span>
              Page #{vm.activePage}: {vm.lastStatus === 'hit' ? t.m2.hit : t.m2.miss}
            </span>
            <span>{vm.lastStatus === 'hit' ? '~100 ns' : '~16,000 ns'}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <HardDrive className="w-4 h-4" /> DISK HEAP FILE (users.heap)
              </span>
              <span>Click to Fetch</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((pg) => {
                const inRam = vm.bufferPool.includes(pg);
                const selected = vm.activePage === pg;
                return (
                  <button
                    key={pg}
                    onClick={() => vm.fetchPage(pg)}
                    className={`p-3 rounded-xl border font-mono text-center transition-all cursor-pointer ${
                      selected
                        ? 'border-cyan-400 bg-cyan-950/50 scale-105'
                        : inRam
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-200">Pág #{pg}</div>
                    <div className="text-[10px] text-slate-500 mt-1">@{pg * vm.pageSizeKb}KB</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-violet-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-violet-400 font-bold">
                <Layers className="w-4 h-4" /> MEMORY BUFFER POOL (3 Frames LRU)
              </span>
              <span className="text-slate-400">{vm.bufferPool.length}/3 frames</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((frameIdx) => {
                const pageId = vm.bufferPool[frameIdx];
                const occupied = pageId !== undefined;
                return (
                  <div
                    key={frameIdx}
                    className={`p-3 rounded-xl border font-mono text-center transition-all ${
                      occupied
                        ? 'bg-violet-950/40 border-violet-400/60 text-violet-200'
                        : 'bg-slate-900/40 border-dashed border-slate-800 text-slate-600'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400">Frame [{frameIdx}]</div>
                    <div className="text-sm font-bold mt-1">{occupied ? `Page #${pageId}` : 'EMPTY'}</div>
                    {occupied && <div className="text-[10px] text-emerald-400 mt-0.5">Pinned ptr ✓</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
````

## `src/features/storageHierarchy/useStorageHierarchyViewModel.ts`

````typescript
import { useState } from 'react';
import type { Locale } from '../../core/i18n';
import {
  type BufferFetchStatus,
  computeByteOffset,
  fetchBufferPage,
  getHardwareTiers,
} from '../../core/storageHierarchy';

/**
 * ViewModel for Module 2 (Storage Hierarchy & Buffer Pool Simulator).
 * Encapsulates pulse animation toggle, page size selection, and Buffer Pool state.
 */
export function useStorageHierarchyViewModel(lang: Locale) {
  const [pulsing, setPulsing] = useState(true);
  const [pageSizeKb, setPageSizeKb] = useState(8);
  const [bufferPool, setBufferPool] = useState<number[]>([0, 3]);
  const [activePage, setActivePage] = useState(2);
  const [lastStatus, setLastStatus] = useState<BufferFetchStatus | null>(null);

  const tiers = getHardwareTiers(lang);
  const byteOffset = computeByteOffset(activePage, pageSizeKb);

  return {
    pulsing,
    pageSizeKb,
    bufferPool,
    activePage,
    lastStatus,
    tiers,
    byteOffset,
    togglePulsing: () => setPulsing((prev) => !prev),
    setPageSizeKb,
    fetchPage: (pageNum: number) => {
      setActivePage(pageNum);
      const result = fetchBufferPage(bufferPool, pageNum);
      setLastStatus(result.status);
      setBufferPool(result.nextPool);
    },
    clearBufferPool: () => {
      setBufferPool([]);
      setLastStatus(null);
    },
  };
}
````

## `src/features/volcanoSimd/useVolcanoSimdViewModel.ts`

````typescript
import { useEffect, useState } from 'react';
import {
  computeExecutionMetrics,
  computeSurvivingIndices,
  DATASET_PRICES,
  type SimdLaneWidth,
  stepExecutionRace,
} from '../../core/volcanoSimd';

/**
 * ViewModel for Module 5 (Volcano Iterator vs. Vectorized SIMD Race).
 * Manages race timer, SIMD lane width, and derived cycle/selection-vector metrics.
 */
export function useVolcanoSimdViewModel() {
  const [simdLane, setSimdLane] = useState<SimdLaneWidth>(8);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ volcanoIdx: 0, simdIdx: 0 });

  useEffect(() => {
    if (!running) return;
    if (progress.volcanoIdx >= DATASET_PRICES.length && progress.simdIdx >= DATASET_PRICES.length) {
      setRunning(false);
      return;
    }
    const timer = setInterval(() => {
      setProgress((prev) => stepExecutionRace(prev, simdLane));
    }, 420);
    return () => clearInterval(timer);
  }, [running, progress.volcanoIdx, progress.simdIdx, simdLane]);

  const reset = () => {
    setRunning(false);
    setProgress({ volcanoIdx: 0, simdIdx: 0 });
  };

  const survivingIndices = computeSurvivingIndices(DATASET_PRICES, progress.simdIdx);
  const { volcanoCycles, simdCycles } = computeExecutionMetrics(
    progress.volcanoIdx,
    progress.simdIdx,
    simdLane
  );

  return {
    simdLane,
    running,
    progress,
    survivingIndices,
    volcanoCycles,
    simdCycles,
    step: () => setProgress((prev) => stepExecutionRace(prev, simdLane)),
    reset,
    toggleRunning: () => {
      if (progress.volcanoIdx >= DATASET_PRICES.length) reset();
      setRunning((prev) => !prev);
    },
    selectLaneWidth: (width: SimdLaneWidth) => {
      reset();
      setSimdLane(width);
    },
  };
}
````

## `src/features/volcanoSimd/VolcanoVsSimdModule.tsx`

````tsx
import { ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import type { TranslationBundle } from '../../core/i18n';
import { DATASET_PRICES } from '../../core/volcanoSimd';
import { useVolcanoSimdViewModel } from './useVolcanoSimdViewModel';

export interface VolcanoVsSimdModuleProps {
  t: TranslationBundle;
}

/**
 * Dumb View for Module 5 (Volcano Iterator vs. Vectorized SIMD Execution).
 * Delegates simulation timers and cycle/index metrics to `useVolcanoSimdViewModel`.
 */
export function VolcanoVsSimdModule({ t }: VolcanoVsSimdModuleProps) {
  const vm = useVolcanoSimdViewModel();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={vm.toggleRunning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm cursor-pointer"
          >
            {vm.running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {vm.running ? t.pause : t.play}
          </button>
          <button
            onClick={vm.step}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm border border-slate-700 cursor-pointer"
          >
            {t.step} <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={vm.reset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">{t.m5.simdWidth}:</span>
          <button
            onClick={() => vm.selectLaneWidth(8)}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              vm.simdLane === 8 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            AVX2 (8× int32)
          </button>
          <button
            onClick={() => vm.selectLaneWidth(16)}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              vm.simdLane === 16 ? 'bg-violet-500 text-white font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            AVX-512 (16× int32)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                PostgreSQL / SQLite / MySQL
              </span>
              <h4 className="font-semibold text-slate-100 mt-1.5">{t.m5.volcanoTitle}</h4>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-slate-400">{t.m5.cycles}</div>
              <div className="text-xl font-bold text-amber-400">{vm.volcanoCycles} clk</div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs flex items-center justify-between">
            <span className="text-slate-300">
              Filter.next() → Scan.next() <span className="text-amber-400">[1 row/call]</span>
            </span>
            <span className="text-rose-400">~65% Dispatch Tax</span>
          </div>

          <div className="grid grid-cols-8 gap-1.5">
            {DATASET_PRICES.map((price, idx) => {
              const processed = idx < vm.progress.volcanoIdx;
              const current = idx === vm.progress.volcanoIdx && vm.progress.volcanoIdx < DATASET_PRICES.length;
              const match = price > 100;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-lg font-mono text-xs text-center border transition-all ${
                    current
                      ? 'bg-amber-400 text-slate-950 font-bold border-white scale-110'
                      : processed
                      ? match
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
                  }`}
                >
                  {price}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-xs font-mono text-slate-400 pt-1">
            <span>
              Rows: {vm.progress.volcanoIdx}/{DATASET_PRICES.length}
            </span>
            <span>
              {t.m5.cacheLocality}: {t.m5.poor}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/80 border-2 border-emerald-400/60 rounded-2xl p-5 space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                ClickHouse / DuckDB / Photon
              </span>
              <h4 className="font-semibold text-white mt-1.5">{t.m5.vectorTitle}</h4>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-slate-400">{t.m5.cycles}</div>
              <div className="text-xl font-bold text-emerald-400">{vm.simdCycles} clk</div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 font-mono text-xs flex items-center justify-between">
            <span className="text-emerald-300">
              {vm.simdLane === 8 ? 'vpcmpgtd ymm0, ymm1' : 'vpcmpgtd zmm0, zmm1'} ({vm.simdLane} lanes/clk)
            </span>
            <span className="text-cyan-300">Branchless SIMD</span>
          </div>

          <div className="grid grid-cols-8 gap-1.5">
            {DATASET_PRICES.map((price, idx) => {
              const processed = idx < vm.progress.simdIdx;
              const inNextVector = idx >= vm.progress.simdIdx && idx < vm.progress.simdIdx + vm.simdLane;
              const match = price > 100;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-lg font-mono text-xs text-center border transition-all ${
                    inNextVector
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200'
                      : processed
                      ? match
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
                  }`}
                >
                  {price}
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs">
            <div className="text-slate-400 mb-1">{t.m5.selVector}:</div>
            <div className="text-emerald-400 truncate">
              sel_vec[{vm.survivingIndices.length}] = [{vm.survivingIndices.join(', ')}]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
````

## `src/index.css`

````css
@import "tailwindcss";

@keyframes pulseRace {
  0% {
    left: 0%;
  }
  100% {
    left: calc(100% - 2rem);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
````

## `src/main.tsx`

````tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
````

## `src/useAppViewModel.ts`

````typescript
import { useEffect, useState } from 'react';
import { computeProgressPct, stepModuleIndex } from './core/appNavigation';
import { DEFAULT_LOCALE, getTranslations, type Locale, toggleLocale } from './core/i18n';

/**
 * ViewModel for the top-level App shell.
 * Manages locale, active module index, presentation mode, modal state, and keyboard shortcuts.
 */
export function useAppViewModel() {
  const [lang, setLang] = useState<Locale>(DEFAULT_LOCALE);
  const [activeModule, setActiveModule] = useState(0);
  const [presMode, setPresMode] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);

  const t = getTranslations(lang);
  const progressPct = computeProgressPct(activeModule, t.modules.length);
  const subtitles = [t.m1.subtitle, t.m2.subtitle, t.m3.subtitle, t.m4.subtitle, t.m5.subtitle];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActiveModule((m) => stepModuleIndex(m, 1));
      else if (e.key === 'ArrowLeft') setActiveModule((m) => stepModuleIndex(m, -1));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return {
    lang,
    t,
    activeModule,
    presMode,
    showDeployModal,
    progressPct,
    activeTitle: t.modules[activeModule].title,
    activeSubtitle: subtitles[activeModule],
    selectModule: setActiveModule,
    prevModule: () => setActiveModule((m) => stepModuleIndex(m, -1)),
    nextModule: () => setActiveModule((m) => stepModuleIndex(m, 1)),
    toggleLang: () => setLang((prev) => toggleLocale(prev)),
    togglePresMode: () => setPresMode((prev) => !prev),
    openDeployModal: () => setShowDeployModal(true),
    closeDeployModal: () => setShowDeployModal(false),
  };
}
````
