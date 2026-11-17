# 03_ui_components_and_features_part1

> Generated snapshot containing 9 file(s).

## Table of Contents

- [`src/App.tsx`](#src-app-tsx)
- [`src/components/DeployModal.tsx`](#src-components-deploymodal-tsx)
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
import { DeployModal } from './components/DeployModal';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col">
      <Navbar
        t={vm.t}
        lang={vm.lang}
        activeModule={vm.activeModule}
        presMode={vm.presMode}
        progressPct={vm.progressPct}
        onSelectModule={vm.selectModule}
        onToggleLang={vm.toggleLang}
        onTogglePresMode={vm.togglePresMode}
        onOpenDeployModal={vm.openDeployModal}
      />

      <main
        className={`flex-1 ${
          vm.presMode ? 'max-w-full px-6 sm:px-12 py-8' : 'max-w-7xl px-4 sm:px-6 py-8'
        } mx-auto w-full`}
      >
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <span>
              {vm.t.moduleLabel} 0{vm.activeModule + 1} / 0{MODULE_COUNT}
            </span>
            <span>•</span>
            <span>SQL INTERNALS SEMINAR</span>
          </div>
          <h2
            className={`${
              vm.presMode ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'
            } font-bold text-white mt-1`}
          >
            {vm.activeTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-4xl">
            {vm.activeSubtitle}
          </p>
        </div>

        <div className="animate-fadeIn">{modules[vm.activeModule]}</div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={vm.prevModule}
            disabled={vm.activeModule === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-sm font-mono text-slate-200 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> {vm.t.prevMod}
          </button>

          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            ← / → Keyboard Navigation
          </span>

          <button
            onClick={vm.nextModule}
            disabled={vm.activeModule === MODULE_COUNT - 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 disabled:opacity-40 border border-cyan-500/40 text-sm font-mono text-cyan-300 font-semibold transition cursor-pointer"
          >
            {vm.t.nextMod} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <DeployModal
        isOpen={vm.showDeployModal}
        t={vm.t}
        onClose={vm.closeDeployModal}
      />
    </div>
  );
}
````

## `src/components/DeployModal.tsx`

````tsx
import { Cloud } from 'lucide-react';
import type { TranslationBundle } from '../core/i18n';

export interface DeployModalProps {
  isOpen: boolean;
  t: TranslationBundle;
  onClose: () => void;
}

/**
 * Modal displaying Cloudflare Pages + Vite deployment instructions.
 */
export function DeployModal({ isOpen, t, onClose }: DeployModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-amber-400" />
            {t.deployModal.title}
          </h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
          >
            {t.deployModal.close}
          </button>
        </div>
        <div className="space-y-2.5 font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
          {t.deployModal.steps.map((stepText, idx) => (
            <div key={idx} className="leading-relaxed">
              {stepText}
            </div>
          ))}
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
  Cloud,
  Code2,
  Cpu,
  Database,
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
  onOpenDeployModal: () => void;
}

/**
 * Sticky top navigation bar projecting seminar branding, module tabs,
 * presentation mode toggle, and PT-BR/EN language switcher.
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
  onOpenDeployModal,
}: NavbarProps) {
  const containerWidth = presMode ? 'max-w-full px-6' : 'max-w-7xl px-4 sm:px-6';

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/90">
      <div className={`${containerWidth} mx-auto h-16 flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-slate-950 shadow-lg shrink-0">
            <Database className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="truncate">
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              {t.brandSub}
            </div>
            <h1 className="font-bold text-sm sm:text-base text-white truncate">{t.brandTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!presMode && (
            <button
              onClick={onOpenDeployModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-amber-300 transition cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5" /> {t.cfDeploy}
            </button>
          )}

          <button
            onClick={onTogglePresMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
              presMode
                ? 'bg-violet-500 text-white border-violet-400'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            {presMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{presMode ? t.exitPres : t.presMode}</span>
          </button>

          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition cursor-pointer"
            title="Toggle Language PT-BR / EN"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'pt' ? 'PT-BR' : 'EN'}</span>
          </button>
        </div>
      </div>

      <div className={`${containerWidth} mx-auto flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar`}>
        {t.modules.map((mod, idx) => {
          const active = idx === activeModule;
          const Icon = MODULE_ICONS[idx];
          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(idx)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                  : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {mod.short}
            </button>
          );
        })}
      </div>

      <div className="w-full h-1 bg-slate-900">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-500 transition-all duration-300"
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

Stateless UI components used by the top-level application shell:

- `Navbar.tsx`: Sticky header with branding, module tabs, presentation mode toggle, and PT-BR/EN language switcher.
- `DeployModal.tsx`: Modal displaying Cloudflare Pages + Vite build and deployment steps.
````

## `src/features/bitInspector/BitInspectorModule.tsx`

````tsx
import { ArrowRight } from 'lucide-react';
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
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              col.isNull
                ? 'bg-amber-950/30 border-amber-500/50'
                : 'bg-slate-900/90 border-cyan-500/40 hover:border-cyan-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                col[{idx}] • {col.type}
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${
                  col.isNull ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                bit={col.isNull ? '0' : '1'}
              </span>
            </div>
            <div className="text-base font-mono font-bold text-white mt-2">
              {col.key}:{' '}
              <span className={col.isNull ? 'text-amber-400 italic' : 'text-cyan-300'}>
                {col.isNull ? 'NULL' : col.val}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1.5">
              Hex: {col.isNull ? '(0 bytes stored!)' : col.hex}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="font-semibold text-slate-100">{t.m4.bitmapTitle}</h4>
            <p className="text-xs text-slate-400">{t.m4.bitmapExplain}</p>
          </div>
          <div className="font-mono text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400">
            Payload Size: {vm.payloadBytes} Bytes (+ 1B Null Bitmap)
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
          <div className="p-3 rounded-lg bg-violet-950/60 border border-violet-400 text-center">
            <div className="text-[10px] text-violet-300 uppercase">t_bits[0] (Null Bitmap)</div>
            <div className="text-lg font-bold tracking-widest text-white mt-0.5">
              0000<span className="text-amber-300">{vm.bitmapBits}</span>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

          {vm.cols.map((col) =>
            col.isNull ? null : (
              <div
                key={col.key}
                className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center"
              >
                <div className="text-[10px] text-cyan-300">
                  {col.key} ({col.bytes}B)
                </div>
                <div className="text-sm font-bold text-slate-100 mt-1">{col.hex}</div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="font-semibold text-slate-100">{t.m4.alignTitle}</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => vm.setAlignMode('good')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer ${
                vm.alignMode === 'good' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              ✓ {t.m4.goodAlign}
            </button>
            <button
              onClick={() => vm.setAlignMode('bad')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer ${
                vm.alignMode === 'bad' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              ✕ {t.m4.badAlign}
            </button>
          </div>
        </div>

        {vm.alignMode === 'good' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-8 gap-1.5 font-mono text-xs text-center">
              {[0, 1, 2, 3].map((b) => (
                <div
                  key={b}
                  className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-400/60 text-emerald-200"
                >
                  <div className="text-[10px] text-slate-400">Byte {b}</div>
                  <div className="font-bold mt-0.5">id[{b}]</div>
                </div>
              ))}
              {[4, 5, 6, 7].map((b) => (
                <div
                  key={b}
                  className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-400/60 text-cyan-200"
                >
                  <div className="text-[10px] text-slate-400">Byte {b}</div>
                  <div className="font-bold mt-0.5">price[{b - 4}]</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-emerald-300 font-mono">{t.m4.goodDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-1 overflow-x-auto font-mono text-xs text-center pb-1">
              <div className="p-2.5 rounded bg-rose-600/40 border border-rose-400 text-rose-200 shrink-0">
                1-bit Flag
              </div>
              <div className="p-2.5 rounded bg-slate-800 border border-rose-500/50 text-slate-200 flex-1">
                id (32 bits) [Bit 1..32]
              </div>
              <div className="p-2.5 rounded bg-rose-600/40 border border-rose-400 text-rose-200 shrink-0">
                1-bit Flag
              </div>
              <div className="p-2.5 rounded bg-amber-950/60 border-2 border-dashed border-rose-400 text-amber-200 flex-1">
                ⚠ price [Bit 34..65] STRADDLES 64-BIT WORD BOUNDARY!
              </div>
            </div>
            <p className="text-xs text-rose-300 font-mono">{t.m4.badDesc}</p>
          </div>
        )}
      </div>
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
import type { Locale, TranslationBundle } from '../../core/i18n';
import type { SqlToken, VdbeOpcode } from '../../core/queryPipeline';

export function LexerStageView({ tokens }: { tokens: readonly SqlToken[] }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="text-xs font-mono uppercase tracking-wider text-slate-400 text-center">
        Stream de Bytes ASCII/UTF-8 → Scanner Léxico (Flex) → Lista de Tokens
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {tokens.map((tok, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 70}ms` }}
            className={`px-3.5 py-2.5 rounded-xl border font-mono transition-transform hover:scale-105 ${tok.color}`}
          >
            <div className="text-base font-bold">{tok.text}</div>
            <div className="text-[10px] opacity-75 tracking-wider mt-1">{tok.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AstStageView({ isRewriter, lang }: { isRewriter: boolean; lang: Locale }) {
  const heading = !isRewriter
    ? 'Abstract Syntax Tree (SelectStmt Node)'
    : lang === 'pt'
    ? 'Query Tree Reescrita (Regra: Validação de Catálogo pg_class + Predicado Normalizado)'
    : 'Rewritten Query Tree (Catalog OIDs Bound + Normalized Predicate)';

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">{heading}</div>
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-mono text-sm font-bold shadow-lg">
          SELECT_QUERY {isRewriter && <span className="text-xs text-emerald-400 ml-1">[OID:16384]</span>}
        </div>
        <div className="w-0.5 h-5 bg-slate-700" />
        <div className="w-3/4 h-0.5 bg-slate-700" />
        <div className="grid grid-cols-3 gap-3 w-full mt-0">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-slate-700" />
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center w-full">
              <div className="text-xs font-mono text-emerald-400 font-bold">TARGET_LIST</div>
              <div className="text-xs font-mono text-slate-300 mt-1">
                col[0]: id (INT4)
                <br />
                col[1]: name (TEXT)
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-slate-700" />
            <div
              className={`p-3 rounded-xl border text-center w-full transition-all ${
                isRewriter
                  ? 'bg-violet-950/70 border-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.2)]'
                  : 'bg-violet-950/40 border-violet-500/40'
              }`}
            >
              <div className="text-xs font-mono text-violet-300 font-bold">FROM_CLAUSE</div>
              <div className="text-xs font-mono text-slate-200 mt-1">rel: "users"</div>
              {isRewriter && (
                <div className="mt-1.5 text-[11px] font-mono bg-violet-500/20 text-violet-200 px-1.5 py-0.5 rounded">
                  + AND deleted_at IS NULL (View Rule)
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-slate-700" />
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-center w-full">
              <div className="text-xs font-mono text-amber-400 font-bold">QUAL (WHERE)</div>
              <div className="text-xs font-mono text-slate-200 mt-1">OpExpr [&gt;]</div>
              <div className="text-[11px] font-mono text-amber-300/90 mt-1">Var(price) | Const(100)</div>
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
      <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 flex flex-col justify-between opacity-80">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
              CANDIDATE PLAN A
            </span>
            <span className="font-mono text-sm text-rose-400 font-bold">Cost: 1,840.00</span>
          </div>
          <h5 className="font-semibold text-slate-200 mt-3">{t.m1.seqScan}</h5>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            1,000 pages × seq_page_cost(1.0) + 80,000 rows × cpu_tuple_cost(0.01)
          </p>
        </div>
        <div className="mt-4">
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full w-[92%]" />
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1.5">I/O: 8,000 KB lidos do Heap File</div>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-emerald-950/25 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.15)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
              ✓ {t.m1.winner}
            </span>
            <span className="font-mono text-sm text-emerald-400 font-bold">Cost: 42.65</span>
          </div>
          <h5 className="font-semibold text-white mt-3">{t.m1.idxScan}</h5>
          <p className="text-xs text-slate-300 mt-1 font-mono">
            B-Tree depth=3 + Seletividade estimada (4.2% das linhas &gt; 100)
          </p>
        </div>
        <div className="mt-4">
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full w-[12%]" />
          </div>
          <div className="text-[11px] font-mono text-emerald-300 mt-1.5">
            43x mais rápido • Saltando direto para páginas folha relevantes
          </div>
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetExecTarget('sqlite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
              execTarget === 'sqlite' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.m1.sqliteMode}
          </button>
          <button
            onClick={() => onSetExecTarget('jit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
              execTarget === 'jit' ? 'bg-violet-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.m1.jitMode}
          </button>
        </div>
        {execTarget === 'sqlite' && (
          <button
            onClick={onStepVm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 font-mono text-xs cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" /> {t.m1.stepVm} [PC={vmPc}]
          </button>
        )}
      </div>

      {execTarget === 'sqlite' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="py-1.5 px-2">addr</th>
                <th className="py-1.5 px-2">opcode</th>
                <th className="py-1.5 px-2">p1</th>
                <th className="py-1.5 px-2">p2</th>
                <th className="py-1.5 px-2">p3</th>
                <th className="py-1.5 px-2">comment (sqlite3_prepare_v2)</th>
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
                      active ? 'bg-cyan-500/20 text-cyan-200 font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-1.5 px-2">{active ? '▶ ' : '  '}{row.addr}</td>
                    <td className="py-1.5 px-2 text-amber-300">{row.op}</td>
                    <td className="py-1.5 px-2">{row.p1}</td>
                    <td className="py-1.5 px-2">{row.p2}</td>
                    <td className="py-1.5 px-2">{row.p3}</td>
                    <td className="py-1.5 px-2 text-slate-400">{row.comment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="bg-slate-950 p-4 rounded-xl border border-violet-500/30 font-mono text-xs space-y-1.5 text-slate-300">
            <div className="text-violet-400 font-bold mb-2">; LLVM IR -&gt; x86_64 Native JIT Function</div>
            <div><span className="text-cyan-400">eval_qual_jit:</span></div>
            <div className="pl-4">mov eax, dword ptr [rdi + 16] <span className="text-slate-500">; Direct offset col price</span></div>
            <div className="pl-4">cmp eax, 100 <span className="text-slate-500">; Hardware ALU compare</span></div>
            <div className="pl-4">setg al <span className="text-slate-500">; Branchless boolean 0/1</span></div>
            <div className="pl-4">ret <span className="text-emerald-400">; 0 virtual dispatch!</span></div>
          </div>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/30 text-sm text-slate-300">
              {t.m1.jitDesc}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Tuple Deforming</span>
                <span className="text-emerald-400 font-bold">Unrolled Native Offsets</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Expr Eval</span>
                <span className="text-emerald-400 font-bold">3 CPU Instructions</span>
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
import { CheckCircle2, ChevronRight, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
            SQL INPUT
          </span>
          <code className="font-mono text-sm sm:text-base text-slate-100 whitespace-nowrap">
            <span className="text-cyan-400">SELECT</span> id, name{' '}
            <span className="text-cyan-400">FROM</span> users{' '}
            <span className="text-cyan-400">WHERE</span> price &gt;{' '}
            <span className="text-amber-400">100</span>;
          </code>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={vm.togglePlay}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition cursor-pointer"
          >
            {vm.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {vm.isPlaying ? t.pause : t.play}
          </button>
          <button
            onClick={vm.stepStage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm border border-slate-700 transition cursor-pointer"
          >
            {t.step} <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={vm.reset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title={t.reset}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {t.m1.stages.map((st, idx) => {
          const active = idx === vm.stage;
          const done = idx < vm.stage;
          return (
            <button
              key={st.name}
              onClick={() => vm.selectStage(idx)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                active
                  ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.18)]'
                  : done
                  ? 'bg-slate-900/80 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-slate-400">0{idx + 1}</span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {active && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
              </div>
              <div className={`font-semibold text-xs sm:text-sm ${active ? 'text-cyan-300' : 'text-slate-200'}`}>
                {st.name}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-slate-100">{t.m1.stages[vm.stage].name}</h4>
          <p className="text-sm text-slate-400 mt-0.5">{t.m1.stages[vm.stage].desc}</p>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 min-h-[340px] flex flex-col justify-center">
        {vm.stage === 0 && <LexerStageView tokens={vm.tokens} />}
        {(vm.stage === 1 || vm.stage === 2) && <AstStageView isRewriter={vm.stage === 2} lang={lang} />}
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
