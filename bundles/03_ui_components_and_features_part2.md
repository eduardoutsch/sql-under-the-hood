# 03_ui_components_and_features_part2

> Generated snapshot containing 8 file(s).

## Table of Contents

- [`src/features/queryPipeline/QueryPipelineModule.tsx`](#src-features-querypipeline-querypipelinemodule-tsx)
- [`src/features/queryPipeline/useQueryPipelineViewModel.ts`](#src-features-querypipeline-usequerypipelineviewmodel-ts)
- [`src/features/README.md`](#src-features-readme-md)
- [`src/features/slottedPage/SlottedPageModule.tsx`](#src-features-slottedpage-slottedpagemodule-tsx)
- [`src/features/slottedPage/useSlottedPageViewModel.ts`](#src-features-slottedpage-useslottedpageviewmodel-ts)
- [`src/features/storageHierarchy/StorageHierarchyModule.tsx`](#src-features-storagehierarchy-storagehierarchymodule-tsx)
- [`src/features/storageHierarchy/useStorageHierarchyViewModel.ts`](#src-features-storagehierarchy-usestoragehierarchyviewmodel-ts)
- [`src/features/volcanoSimd/useVolcanoSimdViewModel.ts`](#src-features-volcanosimd-usevolcanosimdviewmodel-ts)

---

## `src/features/queryPipeline/QueryPipelineModule.tsx`

````tsx
import { CheckCircle2, ChevronRight, MessageCircle, Pause, Play, RotateCcw, X } from 'lucide-react';
import { AccordionPanel } from '../../components/AccordionPanel';
import type { Locale, TranslationBundle } from '../../core/i18n';
import {
  AstStageView,
  ExecutionStageView,
  LexerStageView,
  OptimizerStageView,
} from './PipelineStageViews';
import { useQueryPipelineViewModel } from './useQueryPipelineViewModel';

export interface QueryPipelineModuleProps {
  t: TranslationBundle;
  lang: Locale;
}

/**
 * Dumb View for Module 1 (SQL Query Pipeline).
 * Delegates all state and timer logic to `useQueryPipelineViewModel`.
 */
export function QueryPipelineModule({ t, lang }: QueryPipelineModuleProps) {
  const vm = useQueryPipelineViewModel(lang);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#1C1917] border-2 border-stone-900 shadow-[4px_4px_0px_#D94E28] p-4 rounded-xl">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider bg-[#D94E28] text-[#FFFDF8] rounded">
            {t.m1.sqlInput}
          </span>
          <code className="font-mono text-sm sm:text-base text-stone-100 whitespace-nowrap">
            <span className="text-amber-400 font-semibold">SELECT</span> id, name{' '}
            <span className="text-amber-400 font-semibold">FROM</span> users{' '}
            <span className="text-amber-400 font-semibold">WHERE</span> price &gt;{' '}
            <span className="text-emerald-400 font-semibold">100</span>;
          </code>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={vm.togglePlay}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#D94E28] hover:bg-[#C2411F] border-2 border-stone-950 text-[#FFFDF8] font-semibold text-sm transition cursor-pointer"
          >
            {vm.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {vm.isPlaying ? t.pause : t.play}
          </button>
          <button
            onClick={vm.stepStage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#FFFDF8] hover:bg-stone-200 text-stone-900 font-semibold text-sm border-2 border-stone-950 transition cursor-pointer"
          >
            {t.step} <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={vm.reset}
            className="p-2 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 border-2 border-stone-950 transition cursor-pointer"
            title={t.reset}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {t.m1.stages.map((st, idx) => {
          const active = idx === vm.stage;
          const done = idx < vm.stage;
          return (
            <button
              key={st.name}
              onClick={() => vm.selectStage(idx)}
              className={`text-left p-3 rounded-lg border-2 transition-all cursor-pointer relative ${
                active
                  ? 'bg-[#FFFDF8] border-stone-900 shadow-[3px_3px_0px_#D94E28]'
                  : done
                  ? 'bg-emerald-50 border-stone-900 text-stone-800'
                  : 'bg-[#EFE9DC]/70 border-stone-900/30 text-stone-600 hover:border-stone-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-stone-500">0{idx + 1}</span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                {active && <span className="w-2.5 h-2.5 rounded-full bg-[#D94E28] animate-ping" />}
              </div>
              <div className={`font-semibold text-xs sm:text-sm ${active ? 'text-[#B83B1D]' : 'text-stone-900'}`}>
                {st.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Stage Content + Side-Positioned Message Chat Bubble (All 5 Steps) */}
      <div
        className={`flex flex-col gap-4 ${
          vm.bubblePlacement.side === 'left' ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } lg:items-stretch`}
      >
        <div className="flex-1 min-w-0">
          <AccordionPanel
            title={t.m1.stages[vm.stage].name}
            badge={`0${vm.stage + 1}`}
            defaultOpen={true}
          >
            <div className="min-h-[280px] flex flex-col justify-center">
              {vm.stage === 0 && <LexerStageView tokens={vm.tokens} banner={t.m1.lexerBanner} />}
              {(vm.stage === 1 || vm.stage === 2) && <AstStageView isRewriter={vm.stage === 2} t={t} />}
              {vm.stage === 3 && <OptimizerStageView t={t} />}
              {vm.stage === 4 && (
                <ExecutionStageView
                  t={t}
                  execTarget={vm.execTarget}
                  vmPc={vm.vmPc}
                  opcodes={vm.opcodes}
                  onSetExecTarget={vm.setExecTarget}
                  onStepVm={vm.stepVm}
                  onSelectPc={vm.setVmPc}
                />
              )}
            </div>
          </AccordionPanel>
        </div>

        <div
          className={`flex flex-col gap-2.5 lg:w-72 shrink-0 ${vm.bubblePlacement.alignClass} ${
            vm.bubblePlacement.side === 'left' ? 'lg:items-end' : 'lg:items-start'
          }`}
        >
          <button
            type="button"
            onClick={vm.toggleNotes}
            aria-expanded={vm.notesOpen}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1917] hover:bg-stone-800 border-2 border-stone-900 shadow-[2px_2px_0px_#D94E28] text-[#FFFDF8] font-mono text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-amber-300" />
            <span>{t.m1.stageNotesLabel}</span>
            <span className="px-1.5 py-0.5 rounded bg-[#D94E28] text-white text-xs">
              0{vm.stage + 1}
            </span>
          </button>

          {vm.notesOpen && (
            <div
              role="status"
              className={`animate-springIn relative w-full bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#D94E28] rounded-2xl p-4 pr-10 ${
                vm.bubblePlacement.side === 'left' ? 'lg:rounded-tr-sm' : 'lg:rounded-tl-sm'
              }`}
            >
              {/* Speech-bubble pointer tail */}
              <span
                aria-hidden="true"
                className={`hidden lg:block absolute top-4 w-3 h-3 bg-[#FFFDF8] border-stone-900 rotate-45 ${
                  vm.bubblePlacement.side === 'left'
                    ? '-right-[7px] border-t-2 border-r-2'
                    : '-left-[7px] border-b-2 border-l-2'
                }`}
              />
              <button
                type="button"
                onClick={vm.toggleNotes}
                aria-label="Close stage note"
                className="absolute top-2.5 right-2.5 p-1 rounded-md hover:bg-[#EFE9DC] text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-xs font-mono font-bold text-[#B83B1D] uppercase tracking-wider">
                0{vm.stage + 1} • {t.m1.stages[vm.stage].name}
              </div>
              <p className="text-sm sm:text-base text-stone-900 mt-1 leading-relaxed">
                {t.m1.stages[vm.stage].desc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
````

## `src/features/queryPipeline/useQueryPipelineViewModel.ts`

````typescript
import { useEffect, useState } from 'react';
import type { Locale } from '../../core/i18n';
import {
  advancePipelineStage,
  getSqlTokens,
  getVdbeOpcodes,
  pickChatBubblePlacement,
  stepVmProgramCounter,
} from '../../core/queryPipeline';

/**
 * ViewModel for Module 1 (Query Pipeline).
 * Owns stage playback timer, execution target toggle, and VDBE program counter.
 */
export function useQueryPipelineViewModel(lang: Locale) {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [execTarget, setExecTarget] = useState<'sqlite' | 'jit'>('sqlite');
  const [vmPc, setVmPc] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [bubblePlacement] = useState(() => pickChatBubblePlacement());

  const tokens = getSqlTokens();
  const opcodes = getVdbeOpcodes(lang);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStage((prev) => {
        if (prev < 4) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return {
    stage,
    isPlaying,
    execTarget,
    vmPc,
    notesOpen,
    bubblePlacement,
    tokens,
    opcodes,
    setExecTarget,
    setVmPc,
    toggleNotes: () => setNotesOpen((prev) => !prev),
    selectStage: (idx: number) => {
      setIsPlaying(false);
      setStage(idx);
    },
    togglePlay: () => {
      if (stage === 4) setStage(0);
      setIsPlaying((prev) => !prev);
    },
    stepStage: () => {
      setIsPlaying(false);
      setStage((prev) => advancePipelineStage(prev));
    },
    stepVm: () => setVmPc((pc) => stepVmProgramCounter(pc, opcodes.length)),
    reset: () => {
      setIsPlaying(false);
      setStage(0);
      setVmPc(0);
    },
  };
}
````

## `src/features/README.md`

````markdown
# `src/features/` — Interactive Seminar Modules (MVVM)

Each feature folder follows **Model-View-ViewModel (MVVM)**:
- `use*ViewModel.ts`: Owns React state, intervals/effects, and calls into `src/core/`.
- `*Module.tsx`: Dumb view projecting ViewModel state and forwarding user events.

## Modules
- `queryPipeline/`: Lexer, AST/Rewriter, Cost-Based Optimizer, and VDBE / LLVM JIT execution.
- `storageHierarchy/`: Hardware latency scale and 3-frame LRU Buffer Pool simulator.
- `slottedPage/`: 8 KB PostgreSQL slotted page inspector (`PageHeaderData`, `ItemIdData`, `HeapTuple`).
- `bitInspector/`: Centralized Null Bitmap and 64-bit CPU word alignment visualizer.
- `volcanoSimd/`: Row-at-a-time Volcano iterator vs. AVX2 / AVX-512 vectorized execution race.
````

## `src/features/slottedPage/SlottedPageModule.tsx`

````tsx
import { Plus, Zap } from 'lucide-react';
import { AccordionPanel } from '../../components/AccordionPanel';
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
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs sm:text-sm">
          <span className="px-2.5 py-1 rounded bg-[#1C1917] text-amber-300 font-bold">
            {t.m3.pageSizeBadge}
          </span>
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-950 font-semibold border border-stone-900">
            pd_lower: {pdLower} B
          </span>
          <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-950 font-semibold border border-stone-900">
            pd_upper: {pdUpper} B
          </span>
          <span className="px-2 py-1 rounded bg-amber-100 text-amber-950 font-semibold border border-stone-900">
            {t.m3.freeLabel}: {freeBytes} B
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={vm.insert}
            disabled={vm.isPageFull}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] text-white font-semibold text-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {t.m3.insertBtn}
          </button>
          <button
            onClick={vm.compact}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-amber-300 hover:bg-amber-400 text-stone-950 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] font-semibold text-sm transition cursor-pointer"
          >
            <Zap className="w-4 h-4" /> {t.m3.compactBtn}
          </button>
        </div>
      </div>

      <AccordionPanel title={t.m3.pageSizeBadge} badge="HEX" defaultOpen={true}>
        <div className="space-y-5 relative overflow-hidden">
          <div className="flex justify-between text-xs font-mono font-semibold text-stone-700">
            <span>Byte 0x0000 (0)</span>
            <span>{t.m3.clickDelete}</span>
            <span>Byte 0x2000 (8192)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="p-3 rounded-lg bg-[#1C1917] border-2 border-stone-900 font-mono text-xs shrink-0 text-amber-200">
              <div className="font-bold">PageHeaderData</div>
              <div className="text-xs text-stone-300">24 Bytes [0..23]</div>
            </div>

            {vm.tuples.map((item) => (
              <button
                key={item.slot}
                onMouseEnter={() => vm.setHoveredSlot(item.slot)}
                onMouseLeave={() => vm.setHoveredSlot(null)}
                onClick={() => vm.markDead(item.slot)}
                className={`p-2.5 rounded-lg border-2 border-stone-900 font-mono text-left transition-all cursor-pointer ${
                  !item.alive
                    ? 'bg-rose-100 text-rose-900 line-through opacity-80'
                    : vm.hoveredSlot === item.slot
                    ? 'bg-blue-200 shadow-[2px_2px_0px_#1c1917] -translate-y-0.5 text-stone-950'
                    : 'bg-blue-50 text-blue-950'
                }`}
              >
                <div className="text-xs font-bold">{t.m3.slotPrefix} #{item.slot} (4B)</div>
                <div className="text-xs text-stone-800">
                  {item.alive ? `off:${item.offset} len:${item.len}` : 'LP_DEAD (0)'}
                </div>
              </button>
            ))}

            <div className="flex items-center text-blue-900 font-mono font-bold text-xs sm:text-sm px-2 animate-pulse">
              pd_lower →
            </div>
          </div>

          <div className="py-6 rounded-lg border-2 border-dashed border-stone-900/50 bg-[#EFE9DC]/60 text-center font-mono">
            <div className="text-xs sm:text-sm text-stone-800 uppercase tracking-widest font-semibold">{t.m3.freeDesc}</div>
            <div className="text-lg font-bold text-stone-900 mt-1">
              {freeBytes} Bytes ({((freeBytes / PAGE_SIZE_BYTES) * 100).toFixed(1)}%)
            </div>
            {vm.isPageFull && <div className="text-sm text-[#B83B1D] font-bold mt-1">{t.m3.pageFull}</div>}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex items-center text-emerald-900 font-mono font-bold text-xs sm:text-sm px-2 animate-pulse">
              ← pd_upper
            </div>

            {[...vm.tuples].reverse().map((item) => (
              <button
                key={item.slot}
                onMouseEnter={() => vm.setHoveredSlot(item.slot)}
                onMouseLeave={() => vm.setHoveredSlot(null)}
                onClick={() => vm.markDead(item.slot)}
                className={`animate-springIn p-3 rounded-lg border-2 border-stone-900 font-mono text-left transition-all cursor-pointer ${
                  !item.alive
                    ? 'bg-rose-100 text-rose-900 opacity-80'
                    : vm.hoveredSlot === item.slot
                    ? 'bg-emerald-200 shadow-[2px_2px_0px_#1c1917] -translate-y-0.5 text-stone-950'
                    : 'bg-emerald-50 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-emerald-950">{t.m3.tuplePrefix} #{item.slot}</span>
                  <span className="text-stone-700">@{item.offset}</span>
                </div>
                <div className="text-sm font-bold text-stone-900 mt-1">
                  ('{item.name}', ${item.price})
                </div>
                <div className="text-xs text-stone-800 mt-0.5">
                  {item.alive ? `${item.len}B HeapTuple` : t.m3.deadSpace}
                </div>
              </button>
            ))}
          </div>
        </div>
      </AccordionPanel>

      <AccordionPanel title={t.m3.legendSectionLabel} badge="8 KB" defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm font-mono">
          <div className="p-3 rounded-lg bg-[#EFE9DC] border-2 border-stone-900 text-stone-900">
            {t.m3.headerDesc}
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border-2 border-stone-900 text-blue-950">
            {t.m3.slotsDesc}
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 border-2 border-stone-900 text-emerald-950">
            {t.m3.tuplesDesc}
          </div>
        </div>
      </AccordionPanel>
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
import { AccordionPanel } from '../../components/AccordionPanel';
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
      <div className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-xl p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-stone-900">{t.m2.bufferSimTitle}</h3>
            <p className="text-xs sm:text-sm font-mono text-stone-800 mt-0.5">
              {t.m2.formula}: Offset = {t.m2.pagePrefix}#{vm.activePage} × {vm.pageSizeKb * 1024} bytes ={' '}
              <span className="text-[#B83B1D] font-bold">{vm.byteOffset.toLocaleString()} bytes</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-stone-800 font-mono font-semibold">{t.m2.pageSizeLabel}:</span>
            {[4, 8].map((sz) => (
              <button
                key={sz}
                onClick={() => vm.setPageSizeKb(sz)}
                className={`px-3 py-1 rounded-md text-xs sm:text-sm font-mono border-2 border-stone-900 cursor-pointer ${
                  vm.pageSizeKb === sz
                    ? 'bg-[#D94E28] text-white font-bold shadow-[2px_2px_0px_#1c1917]'
                    : 'bg-[#EFE9DC] text-stone-900'
                }`}
              >
                {sz} KB
              </button>
            ))}
            <button
              onClick={vm.clearBufferPool}
              className="px-3 py-1 rounded-md text-xs sm:text-sm font-mono bg-rose-100 hover:bg-rose-200 text-rose-950 font-semibold border-2 border-stone-900 cursor-pointer"
            >
              {t.m2.evictBtn}
            </button>
          </div>
        </div>

        {vm.lastStatus && (
          <div
            className={`animate-springIn px-4 py-2.5 rounded-lg font-mono text-xs sm:text-sm font-bold border-2 border-stone-900 flex items-center justify-between ${
              vm.lastStatus === 'hit'
                ? 'bg-emerald-100 text-emerald-950'
                : 'bg-amber-100 text-amber-950'
            }`}
          >
            <span>
              {t.m2.pagePrefix} #{vm.activePage}: {vm.lastStatus === 'hit' ? t.m2.hit : t.m2.miss}
            </span>
            <span>{vm.lastStatus === 'hit' ? '~100 ns' : '~16,000 ns'}</span>
          </div>
        )}

        {vm.lastStatus === 'miss' && (
          <div className="h-1.5 w-full rounded-full animate-busFlow" aria-hidden="true" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl bg-[#EFE9DC] border-2 border-stone-900 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-stone-800">
              <span className="flex items-center gap-1.5 text-[#B83B1D] font-bold">
                <HardDrive className="w-4 h-4" /> {t.m2.diskHeapTitle}
              </span>
              <span className="font-semibold">{t.m2.clickToFetch}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((pg) => {
                const inRam = vm.bufferPool.includes(pg);
                const selected = vm.activePage === pg;
                return (
                  <button
                    key={pg}
                    onClick={() => vm.fetchPage(pg)}
                    className={`p-3 rounded-lg border-2 border-stone-900 font-mono text-center transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#D94E28] text-white shadow-[2px_2px_0px_#1c1917] -translate-y-0.5'
                        : inRam
                        ? 'bg-emerald-100 text-emerald-950'
                        : 'bg-[#FFFDF8] text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Pág #{pg}</div>
                    <div className={`text-xs mt-1 ${selected ? 'text-amber-100' : 'text-stone-700'}`}>
                      @{pg * vm.pageSizeKb}KB
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1C1917] border-2 border-stone-900 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Layers className="w-4 h-4" /> {t.m2.bufferPoolTitle}
              </span>
              <span className="text-stone-200">{vm.bufferPool.length}/3 frames</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((frameIdx) => {
                const pageId = vm.bufferPool[frameIdx];
                const occupied = pageId !== undefined;
                return (
                  <div
                    key={frameIdx}
                    className={`p-3 rounded-lg border-2 font-mono text-center transition-all ${
                      occupied
                        ? 'animate-springIn bg-stone-800 border-amber-400 text-amber-100'
                        : 'bg-stone-900/60 border-dashed border-stone-600 text-stone-300'
                    }`}
                  >
                    <div className="text-xs text-stone-300">Frame [{frameIdx}]</div>
                    <div className="text-sm font-bold mt-1">
                      {occupied ? `${t.m2.pagePrefix} #${pageId}` : t.m2.emptyFrame}
                    </div>
                    {occupied && <div className="text-xs text-emerald-300 mt-0.5">{t.m2.pinnedPtr}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AccordionPanel
        title={`${t.m2.realLatency} vs. ${t.m2.humanScale}`}
        badge="L1 → HDD"
        defaultOpen={false}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-stone-700 flex items-center gap-2 font-semibold">
              <Activity className="w-4 h-4 text-[#D94E28]" />
              {t.m2.humanScale}
            </span>
            <button
              onClick={vm.togglePulsing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EFE9DC] hover:bg-stone-200 text-xs sm:text-sm font-mono font-semibold text-stone-900 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] cursor-pointer"
            >
              {vm.pulsing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {vm.pulsing ? t.pause : t.m2.startPulse}
            </button>
          </div>

          <div className="space-y-3">
            {vm.tiers.map((tier) => (
              <div key={tier.name} className="bg-[#EFE9DC]/60 border-2 border-stone-900/80 rounded-lg p-3">
                <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm font-mono mb-2 gap-2">
                  <span className={`font-bold ${tier.text}`}>{tier.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-stone-800 font-semibold">{tier.real}</span>
                    <span className="px-2.5 py-0.5 rounded bg-[#1C1917] text-amber-300 font-semibold">
                      ⏱ {tier.human}
                    </span>
                  </div>
                </div>
                <div className="relative h-3.5 bg-stone-200 rounded-full overflow-hidden border border-stone-900">
                  <div className={`h-full opacity-30 ${tier.color} ${tier.barWidth}`} />
                  {vm.pulsing && (
                    <div
                      style={{ animation: `pulseRace ${tier.animDurationSec}s linear infinite` }}
                      className={`absolute top-0 bottom-0 w-8 rounded-full ${tier.color}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AccordionPanel>
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
