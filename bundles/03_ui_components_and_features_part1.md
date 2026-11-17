# 03_ui_components_and_features_part1

> Generated snapshot containing 9 file(s).

## Table of Contents

- [`src/App.tsx`](#src-app-tsx)
- [`src/components/AccordionPanel.tsx`](#src-components-accordionpanel-tsx)
- [`src/components/Navbar.tsx`](#src-components-navbar-tsx)
- [`src/components/README.md`](#src-components-readme-md)
- [`src/features/bitInspector/BitInspectorModule.tsx`](#src-features-bitinspector-bitinspectormodule-tsx)
- [`src/features/bitInspector/useBitInspectorViewModel.ts`](#src-features-bitinspector-usebitinspectorviewmodel-ts)
- [`src/features/queryPipeline/PipelineStageViews.tsx`](#src-features-querypipeline-pipelinestageviews-tsx)
- [`src/features/queryPipeline/QueryPipelineModule.tsx`](#src-features-querypipeline-querypipelinemodule-tsx)
- [`src/features/queryPipeline/useQueryPipelineViewModel.ts`](#src-features-querypipeline-usequerypipelineviewmodel-ts)

---

## `src/App.tsx`

````tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MODULE_COUNT } from './core/appNavigation';
import { BitInspectorModule } from './features/bitInspector/BitInspectorModule';
import { QueryPipelineModule } from './features/queryPipeline/QueryPipelineModule';
import { SlottedPageModule } from './features/slottedPage/SlottedPageModule';
import { StorageHierarchyModule } from './features/storageHierarchy/StorageHierarchyModule';
import { VolcanoVsSimdModule } from './features/volcanoSimd/VolcanoVsSimdModule';
import { useAppViewModel } from './useAppViewModel';

/**
 * Dumb View for the top-level seminar shell.
 * Projects state and dispatches user events via `useAppViewModel`.
 */
export default function App() {
  const vm = useAppViewModel();

  const modules = [
    <QueryPipelineModule key="m1" t={vm.t} lang={vm.lang} />,
    <StorageHierarchyModule key="m2" t={vm.t} lang={vm.lang} />,
    <SlottedPageModule key="m3" t={vm.t} />,
    <BitInspectorModule key="m4" t={vm.t} />,
    <VolcanoVsSimdModule key="m5" t={vm.t} />,
  ];

  return (
    <div className="min-h-screen text-stone-900 selection:bg-[#D94E28]/20 selection:text-stone-950 flex flex-col">
      <Navbar
        t={vm.t}
        lang={vm.lang}
        activeModule={vm.activeModule}
        presMode={vm.presMode}
        progressPct={vm.progressPct}
        onSelectModule={vm.selectModule}
        onToggleLang={vm.toggleLang}
        onTogglePresMode={vm.togglePresMode}
      />

      <main
        className={`flex-1 ${
          vm.presMode ? 'max-w-full px-6 sm:px-12 py-8' : 'max-w-7xl px-4 sm:px-6 py-8'
        } mx-auto w-full`}
      >
        <div className="mb-7 border-l-4 border-[#D94E28] pl-4">
          <div className="flex items-center gap-2 text-sm font-mono font-semibold text-[#B83B1D] uppercase tracking-[0.12em]">
            <span>
              {vm.t.moduleLabel} 0{vm.activeModule + 1} / 0{MODULE_COUNT}
            </span>
            <span>•</span>
            <span>{vm.t.labSubtitle}</span>
          </div>
          <h2
            className={`${
              vm.presMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
            } font-bold text-stone-900 tracking-tight mt-1`}
          >
            {vm.activeTitle}
          </h2>
          <p className="text-stone-800 text-base sm:text-lg mt-2 max-w-4xl leading-relaxed">
            {vm.activeSubtitle}
          </p>
        </div>

        <div className="animate-fadeIn">{modules[vm.activeModule]}</div>

        <div className="mt-10 pt-6 border-t-2 border-stone-900/15 flex items-center justify-between">
          <button
            onClick={vm.prevModule}
            disabled={vm.activeModule === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FFFDF8] hover:bg-[#EFE9DC] disabled:opacity-40 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-sm font-mono font-semibold text-stone-900 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> {vm.t.prevMod}
          </button>

          <span className="text-sm font-mono text-stone-700 hidden sm:inline">
            {vm.t.keyboardNav}
          </span>

          <button
            onClick={vm.nextModule}
            disabled={vm.activeModule === MODULE_COUNT - 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D94E28] hover:bg-[#C2411F] disabled:opacity-40 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-sm font-mono text-[#FFFDF8] font-bold transition cursor-pointer"
          >
            {vm.t.nextMod} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
````

## `src/components/AccordionPanel.tsx`

````tsx
import { type ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionPanelProps {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Collapsible hardware-manual drawer with smooth CSS grid-row expansion.
 * Keeps secondary explanations tucked away until the user chooses to inspect them.
 */
export function AccordionPanel({
  title,
  badge,
  defaultOpen = false,
  children,
}: AccordionPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-[#FFFDF8] border-2 border-stone-900 rounded-xl shadow-[3px_3px_0px_#1c1917] overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-[#EFE9DC]/80 hover:bg-[#EFE9DC] text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {badge && (
            <span className="px-2 py-0.5 rounded bg-[#1C1917] text-amber-300 font-mono text-xs font-bold shrink-0">
              {badge}
            </span>
          )}
          <span className="font-bold text-sm sm:text-base text-stone-900 truncate">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-stone-900 shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 sm:p-5 border-t-2 border-stone-900/15">{children}</div>
        </div>
      </div>
    </div>
  );
}
````

## `src/components/Navbar.tsx`

````tsx
import {
  Binary,
  Code2,
  Cpu,
  Globe,
  HardDrive,
  Layers,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import type { Locale, TranslationBundle } from '../core/i18n';

const MODULE_ICONS = [Code2, HardDrive, Layers, Binary, Cpu] as const;

export interface NavbarProps {
  t: TranslationBundle;
  lang: Locale;
  activeModule: number;
  presMode: boolean;
  progressPct: number;
  onSelectModule: (index: number) => void;
  onToggleLang: () => void;
  onTogglePresMode: () => void;
}

/**
 * Sticky top navigation bar styled as a hardware lab instrument panel
 * with the custom vault-gear logo, binder-tab module selectors, and tactile switches.
 */
export function Navbar({
  t,
  lang,
  activeModule,
  presMode,
  progressPct,
  onSelectModule,
  onToggleLang,
  onTogglePresMode,
}: NavbarProps) {
  const containerWidth = presMode ? 'max-w-full px-6' : 'max-w-7xl px-4 sm:px-6';

  return (
    <header className="sticky top-0 z-40 bg-[#EFE9DC]/95 backdrop-blur-md border-b-2 border-stone-900">
      <div className={`${containerWidth} mx-auto h-16 flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/assets/logo.png"
            alt={t.brandTitle}
            className="w-11 h-11 rounded-full border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] object-contain bg-[#F6F2EA] p-0.5 shrink-0"
          />
          <div className="truncate">
            <div className="text-xs font-mono font-semibold uppercase tracking-[0.12em] text-[#B83B1D]">
              {t.brandSub}
            </div>
            <h1 className="font-bold text-base sm:text-lg text-stone-900 tracking-tight truncate">
              {t.brandTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onTogglePresMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-xs font-semibold transition cursor-pointer ${
              presMode
                ? 'bg-stone-900 text-[#F6F2EA]'
                : 'bg-[#FFFDF8] hover:bg-stone-100 text-stone-900'
            }`}
          >
            {presMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{presMode ? t.exitPres : t.presMode}</span>
          </button>

          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1C1917] hover:bg-stone-800 border-2 border-stone-900 shadow-[2px_2px_0px_#D94E28] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-[#F6F2EA] font-mono text-xs font-bold transition cursor-pointer"
            title="Toggle Language PT-BR / EN"
          >
            <Globe className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{lang === 'pt' ? 'PT-BR' : 'EN'}</span>
          </button>
        </div>
      </div>

      <div className={`${containerWidth} mx-auto flex items-center gap-2 overflow-x-auto pt-1 pb-2.5 no-scrollbar`}>
        {t.modules.map((mod, idx) => {
          const active = idx === activeModule;
          const Icon = MODULE_ICONS[idx];
          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(idx)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono whitespace-nowrap border-2 transition-all cursor-pointer ${
                active
                  ? 'bg-[#D94E28] text-[#FFFDF8] border-stone-900 font-bold shadow-[2px_2px_0px_#1c1917]'
                  : 'bg-[#FFFDF8] text-stone-700 border-stone-900/30 hover:border-stone-900 hover:text-stone-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {mod.short}
            </button>
          );
        })}
      </div>

      <div className="w-full h-1.5 bg-stone-300 border-t border-stone-900/20">
        <div
          className="h-full bg-[#D94E28] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </header>
  );
}
````

## `src/components/README.md`

````markdown
# `src/components/` — Shared Shell Components

Stateless UI components used by the top-level application shell and feature drawers:

- `Navbar.tsx`: Sticky header with logo, module tabs, presentation mode toggle, and PT-BR/EN language switcher.
- `AccordionPanel.tsx`: Collapsible drawer with smooth height transition for progressive disclosure.
````

## `src/features/bitInspector/BitInspectorModule.tsx`

````tsx
import { ArrowRight } from 'lucide-react';
import { AccordionPanel } from '../../components/AccordionPanel';
import type { TranslationBundle } from '../../core/i18n';
import { useBitInspectorViewModel } from './useBitInspectorViewModel';

export interface BitInspectorModuleProps {
  t: TranslationBundle;
}

/**
 * Dumb View for Module 4 (Null Bitmaps & 64-Bit CPU Word Alignment).
 * Delegates column nullability and alignment mode to `useBitInspectorViewModel`.
 */
export function BitInspectorModule({ t }: BitInspectorModuleProps) {
  const vm = useBitInspectorViewModel();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {vm.cols.map((col, idx) => (
          <button
            key={col.key}
            onClick={() => vm.toggleNull(idx)}
            className={`p-4 rounded-xl border-2 border-stone-900 text-left transition-all cursor-pointer shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              col.isNull ? 'bg-amber-100' : 'bg-[#FFFDF8] hover:bg-[#EFE9DC]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-800 font-semibold">
                col[{idx}] • {col.type}
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold border border-stone-900 ${
                  col.isNull ? 'bg-amber-300 text-stone-950' : 'bg-emerald-200 text-emerald-950'
                }`}
              >
                bit={col.isNull ? '0' : '1'}
              </span>
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-stone-900 mt-2">
              {col.key}:{' '}
              <span className={col.isNull ? 'text-[#B83B1D] italic' : 'text-blue-900'}>
                {col.isNull ? 'NULL' : col.val}
              </span>
            </div>
            <div className="text-xs font-mono text-stone-800 mt-1.5">
              Hex: {col.isNull ? t.m4.zeroBytesStored : col.hex}
            </div>
          </button>
        ))}
      </div>

      <AccordionPanel title={t.m4.bitmapTitle} badge="t_bits" defaultOpen={true}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs sm:text-sm text-stone-700">{t.m4.bitmapExplain}</p>
            <div className="font-mono text-xs sm:text-sm font-bold px-3 py-1.5 rounded-md bg-emerald-100 border-2 border-stone-900 text-emerald-950">
              {t.m4.payloadSize}: {vm.payloadBytes} Bytes ({t.m4.nullBitmapSuffix})
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-[#1C1917] p-4 rounded-lg border-2 border-stone-900 font-mono">
            <div className="p-3 rounded-md bg-stone-800 border-2 border-[#D94E28] text-center">
              <div className="text-xs text-amber-300 uppercase">{t.m4.nullBitmapHeader}</div>
              <div className="text-lg font-bold tracking-widest text-white mt-0.5">
                0000<span className="text-[#D94E28]">{vm.bitmapBits}</span>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-stone-300 hidden sm:block" />

            {vm.cols.map((col) =>
              col.isNull ? null : (
                <div
                  key={col.key}
                  className="p-3 rounded-md bg-stone-800 border border-stone-500 text-center"
                >
                  <div className="text-xs text-emerald-300">
                    {col.key} ({col.bytes}B)
                  </div>
                  <div className="text-sm font-bold text-stone-100 mt-1">{col.hex}</div>
                </div>
              )
            )}
          </div>
        </div>
      </AccordionPanel>

      <AccordionPanel title={t.m4.alignTitle} badge="64-BIT" defaultOpen={false}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={() => vm.setAlignMode('good')}
              className={`px-3 py-1.5 rounded-md border-2 border-stone-900 text-xs sm:text-sm font-mono font-bold cursor-pointer ${
                vm.alignMode === 'good'
                  ? 'bg-emerald-700 text-white shadow-[2px_2px_0px_#1c1917]'
                  : 'bg-[#EFE9DC] text-stone-900'
              }`}
            >
              ✓ {t.m4.goodAlign}
            </button>
            <button
              onClick={() => vm.setAlignMode('bad')}
              className={`px-3 py-1.5 rounded-md border-2 border-stone-900 text-xs sm:text-sm font-mono font-bold cursor-pointer ${
                vm.alignMode === 'bad'
                  ? 'bg-rose-700 text-white shadow-[2px_2px_0px_#1c1917]'
                  : 'bg-[#EFE9DC] text-stone-900'
              }`}
            >
              ✕ {t.m4.badAlign}
            </button>
          </div>

          {vm.alignMode === 'good' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-8 gap-1.5 font-mono text-xs text-center">
                {[0, 1, 2, 3].map((b) => (
                  <div
                    key={b}
                    className="p-3 rounded-md bg-emerald-100 border-2 border-stone-900 text-emerald-950"
                  >
                    <div className="text-xs text-stone-700">{t.m4.bytePrefix} {b}</div>
                    <div className="font-bold mt-0.5">id[{b}]</div>
                  </div>
                ))}
                {[4, 5, 6, 7].map((b) => (
                  <div
                    key={b}
                    className="p-3 rounded-md bg-blue-100 border-2 border-stone-900 text-blue-950"
                  >
                    <div className="text-xs text-stone-700">{t.m4.bytePrefix} {b}</div>
                    <div className="font-bold mt-0.5">price[{b - 4}]</div>
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 font-mono font-semibold">{t.m4.goodDesc}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-1 overflow-x-auto font-mono text-xs sm:text-sm text-center pb-1">
                <div className="p-2.5 rounded bg-rose-700 border-2 border-stone-900 text-white font-bold shrink-0">
                  {t.m4.flag1Bit}
                </div>
                <div className="p-2.5 rounded bg-[#EFE9DC] border-2 border-stone-900 text-stone-900 flex-1">
                  id (32 bits) [Bit 1..32]
                </div>
                <div className="p-2.5 rounded bg-rose-700 border-2 border-stone-900 text-white font-bold shrink-0">
                  {t.m4.flag1Bit}
                </div>
                <div className="p-2.5 rounded bg-amber-200 border-2 border-dashed border-rose-800 text-rose-950 font-bold flex-1">
                  {t.m4.straddlesWarning}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-rose-950 font-mono font-semibold">{t.m4.badDesc}</p>
            </div>
          )}
        </div>
      </AccordionPanel>
    </div>
  );
}
````

## `src/features/bitInspector/useBitInspectorViewModel.ts`

````typescript
import { useState } from 'react';
import {
  computeNullBitmap,
  computePayloadBytes,
  INITIAL_COLUMNS,
  toggleColumnNull,
  type TupleColumn,
} from '../../core/bitInspector';

/**
 * ViewModel for Module 4 (Bit-Level Inspector: Null Bitmaps & Word Alignment).
 * Manages column nullability toggles and alignment mode selection.
 */
export function useBitInspectorViewModel() {
  const [cols, setCols] = useState<TupleColumn[]>([...INITIAL_COLUMNS]);
  const [alignMode, setAlignMode] = useState<'good' | 'bad'>('good');

  return {
    cols,
    alignMode,
    bitmapBits: computeNullBitmap(cols),
    payloadBytes: computePayloadBytes(cols),
    setAlignMode,
    toggleNull: (idx: number) => setCols((prev) => toggleColumnNull(prev, idx)),
  };
}
````

## `src/features/queryPipeline/PipelineStageViews.tsx`

````tsx
import { Terminal } from 'lucide-react';
import type { TranslationBundle } from '../../core/i18n';
import type { SqlToken, VdbeOpcode } from '../../core/queryPipeline';

export function LexerStageView({ tokens, banner }: { tokens: readonly SqlToken[]; banner: string }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="text-sm font-mono font-semibold uppercase tracking-wider text-stone-700 text-center">
        {banner}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {tokens.map((tok, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 55}ms` }}
            className={`animate-springIn px-4 py-3 rounded-lg border-2 shadow-[2px_2px_0px_#1c1917] font-mono transition-transform hover:-translate-y-0.5 ${tok.color}`}
          >
            <div className="text-base font-bold">{tok.text}</div>
            <div className="text-xs tracking-wider mt-1 font-semibold">{tok.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AstStageView({ isRewriter, t }: { isRewriter: boolean; t: TranslationBundle }) {
  const heading = isRewriter ? t.m1.rewriterHeading : t.m1.astHeading;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="text-sm font-mono font-semibold text-stone-700 uppercase tracking-wider text-center">
        {heading}
      </div>
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="px-4 py-2 rounded-lg bg-[#1C1917] border-2 border-stone-900 text-[#FFFDF8] font-mono text-sm font-bold shadow-[3px_3px_0px_#D94E28]">
          SELECT_QUERY {isRewriter && <span className="text-xs text-amber-300 ml-1">[OID:16384]</span>}
        </div>
        <div className="w-0.5 h-5 bg-stone-900" />
        <div className="w-3/4 h-0.5 bg-stone-900" />
        <div className="grid grid-cols-3 gap-3 w-full mt-0">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-stone-900" />
            <div className="p-3 rounded-lg bg-emerald-50 border-2 border-stone-900 text-center w-full shadow-[2px_2px_0px_#1c1917]">
              <div className="text-xs font-mono text-emerald-950 font-bold">TARGET_LIST</div>
              <div className="text-xs font-mono text-stone-800 mt-1">
                col[0]: id (INT4)
                <br />
                col[1]: name (TEXT)
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-stone-900" />
            <div
              className={`p-3 rounded-lg border-2 border-stone-900 text-center w-full transition-all shadow-[2px_2px_0px_#1c1917] ${
                isRewriter ? 'bg-blue-100' : 'bg-blue-50'
              }`}
            >
              <div className="text-xs font-mono text-blue-950 font-bold">FROM_CLAUSE</div>
              <div className="text-xs font-mono text-stone-900 mt-1">rel: "users"</div>
              {isRewriter && (
                <div className="mt-1.5 text-xs font-mono bg-blue-900 text-white px-1.5 py-0.5 rounded">
                  + AND deleted_at IS NULL
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-stone-900" />
            <div className="p-3 rounded-lg bg-amber-50 border-2 border-stone-900 text-center w-full shadow-[2px_2px_0px_#1c1917]">
              <div className="text-xs font-mono text-amber-950 font-bold">QUAL (WHERE)</div>
              <div className="text-xs font-mono text-stone-900 mt-1">OpExpr [&gt;]</div>
              <div className="text-xs font-mono text-amber-950 mt-1">Var(price) | Const(100)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OptimizerStageView({ t }: { t: TranslationBundle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="p-4 rounded-xl bg-[#EFE9DC] border-2 border-stone-900/60 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-950 border border-rose-900/40">
              {t.m1.candidatePlanA}
            </span>
            <span className="font-mono text-sm text-rose-900 font-bold">{t.m1.costLabel}: 1,840.00</span>
          </div>
          <h5 className="font-bold text-base text-stone-900 mt-3">{t.m1.seqScan}</h5>
          <p className="text-xs sm:text-sm text-stone-800 mt-1 font-mono">{t.m1.seqFormula}</p>
        </div>
        <div className="mt-4">
          <div className="w-full bg-stone-300 h-3 rounded-full overflow-hidden border border-stone-900">
            <div className="bg-rose-700 h-full w-[92%]" />
          </div>
          <div className="text-xs font-mono text-stone-800 mt-1.5">{t.m1.seqIo}</div>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-emerald-50 border-2 border-stone-900 shadow-[4px_4px_0px_#15803d] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-700 text-white font-bold">
              ✓ {t.m1.winner}
            </span>
            <span className="font-mono text-sm text-emerald-900 font-bold">{t.m1.costLabel}: 42.65</span>
          </div>
          <h5 className="font-bold text-base text-stone-900 mt-3">{t.m1.idxScan}</h5>
          <p className="text-xs sm:text-sm text-stone-800 mt-1 font-mono">{t.m1.idxSelectivity}</p>
        </div>
        <div className="mt-4">
          <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden border border-stone-900">
            <div className="bg-emerald-700 h-full w-[12%]" />
          </div>
          <div className="text-xs font-mono text-emerald-950 font-semibold mt-1.5">{t.m1.idxSpeedup}</div>
        </div>
      </div>
    </div>
  );
}

interface ExecutionStageViewProps {
  t: TranslationBundle;
  execTarget: 'sqlite' | 'jit';
  vmPc: number;
  opcodes: readonly VdbeOpcode[];
  onSetExecTarget: (target: 'sqlite' | 'jit') => void;
  onStepVm: () => void;
  onSelectPc: (pc: number) => void;
}

export function ExecutionStageView({
  t,
  execTarget,
  vmPc,
  opcodes,
  onSetExecTarget,
  onStepVm,
  onSelectPc,
}: ExecutionStageViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-stone-900/15 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetExecTarget('sqlite')}
            className={`px-3 py-1.5 rounded-md border-2 border-stone-900 text-xs sm:text-sm font-mono font-bold transition cursor-pointer ${
              execTarget === 'sqlite'
                ? 'bg-[#1C1917] text-[#FFFDF8] shadow-[2px_2px_0px_#D94E28]'
                : 'bg-[#EFE9DC] text-stone-900 hover:bg-stone-200'
            }`}
          >
            {t.m1.sqliteMode}
          </button>
          <button
            onClick={() => onSetExecTarget('jit')}
            className={`px-3 py-1.5 rounded-md border-2 border-stone-900 text-xs sm:text-sm font-mono font-bold transition cursor-pointer ${
              execTarget === 'jit'
                ? 'bg-[#D94E28] text-[#FFFDF8] shadow-[2px_2px_0px_#1c1917]'
                : 'bg-[#EFE9DC] text-stone-900 hover:bg-stone-200'
            }`}
          >
            {t.m1.jitMode}
          </button>
        </div>
        {execTarget === 'sqlite' && (
          <button
            onClick={onStepVm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] text-white font-mono text-xs sm:text-sm font-bold cursor-pointer"
          >
            <Terminal className="w-4 h-4" /> {t.m1.stepVm} [PC={vmPc}]
          </button>
        )}
      </div>

      {execTarget === 'sqlite' ? (
        <div className="overflow-x-auto bg-[#1C1917] rounded-lg border-2 border-stone-900 p-3">
          <table className="w-full text-left font-mono text-xs sm:text-sm">
            <thead>
              <tr className="text-stone-300 border-b border-stone-700">
                <th className="py-2 px-2">addr</th>
                <th className="py-2 px-2">opcode</th>
                <th className="py-2 px-2">p1</th>
                <th className="py-2 px-2">p2</th>
                <th className="py-2 px-2">p3</th>
                <th className="py-2 px-2">comment (sqlite3_prepare_v2)</th>
              </tr>
            </thead>
            <tbody>
              {opcodes.map((row, idx) => {
                const active = idx === vmPc;
                return (
                  <tr
                    key={row.addr}
                    onClick={() => onSelectPc(idx)}
                    className={`cursor-pointer transition ${
                      active ? 'bg-[#D94E28]/35 text-amber-100 font-bold' : 'text-stone-100 hover:bg-stone-800'
                    }`}
                  >
                    <td className="py-2 px-2">{active ? '▶ ' : '  '}{row.addr}</td>
                    <td className="py-2 px-2 text-amber-300">{row.op}</td>
                    <td className="py-2 px-2">{row.p1}</td>
                    <td className="py-2 px-2">{row.p2}</td>
                    <td className="py-2 px-2">{row.p3}</td>
                    <td className="py-2 px-2 text-stone-300">{row.comment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="bg-[#1C1917] p-4 rounded-lg border-2 border-stone-900 font-mono text-xs sm:text-sm space-y-1.5 text-stone-100">
            <div className="text-amber-400 font-bold mb-2">; LLVM IR -&gt; x86_64 Native JIT Function</div>
            <div><span className="text-amber-300">eval_qual_jit:</span></div>
            <div className="pl-4">mov eax, dword ptr [rdi + 16] <span className="text-stone-300">; Direct offset col price</span></div>
            <div className="pl-4">cmp eax, 100 <span className="text-stone-300">; Hardware ALU compare</span></div>
            <div className="pl-4">setg al <span className="text-stone-300">; Branchless boolean 0/1</span></div>
            <div className="pl-4">ret <span className="text-emerald-300">; 0 virtual dispatch!</span></div>
          </div>
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-[#EFE9DC] border-2 border-stone-900 text-sm sm:text-base text-stone-900 leading-relaxed">
              {t.m1.jitDesc}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-mono">
              <div className="p-2.5 rounded-lg bg-[#FFFDF8] border-2 border-stone-900">
                <span className="text-stone-700 block">{t.m1.tupleDeforming}</span>
                <span className="text-emerald-900 font-bold">{t.m1.unrolledOffsets}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FFFDF8] border-2 border-stone-900">
                <span className="text-stone-700 block">{t.m1.exprEval}</span>
                <span className="text-emerald-900 font-bold">{t.m1.threeInstructions}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
````

## `src/features/queryPipeline/QueryPipelineModule.tsx`

````tsx
import { CheckCircle2, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
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

      <AccordionPanel
        title={`${t.m1.stageNotesLabel}: ${t.m1.stages[vm.stage].name}`}
        badge="INFO"
        defaultOpen={false}
      >
        <p className="text-sm sm:text-base text-stone-800 leading-relaxed">{t.m1.stages[vm.stage].desc}</p>
      </AccordionPanel>
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
    tokens,
    opcodes,
    setExecTarget,
    setVmPc,
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
