# 03_ui_components_and_features_part1

> Generated snapshot containing 8 file(s).

## Table of Contents

- [`src/App.tsx`](#src-app-tsx)
- [`src/components/AccordionPanel.tsx`](#src-components-accordionpanel-tsx)
- [`src/components/Navbar.tsx`](#src-components-navbar-tsx)
- [`src/components/README.md`](#src-components-readme-md)
- [`src/components/StageMessageBubble.tsx`](#src-components-stagemessagebubble-tsx)
- [`src/features/bitInspector/BitInspectorModule.tsx`](#src-features-bitinspector-bitinspectormodule-tsx)
- [`src/features/bitInspector/useBitInspectorViewModel.ts`](#src-features-bitinspector-usebitinspectorviewmodel-ts)
- [`src/features/home/HomeView.tsx`](#src-features-home-homeview-tsx)

---

## `src/App.tsx`

````tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MODULE_COUNT } from './core/appNavigation';
import { BitInspectorModule } from './features/bitInspector/BitInspectorModule';
import { HomeView } from './features/home/HomeView';
import { QueryPipelineModule } from './features/queryPipeline/QueryPipelineModule';
import { SlottedPageModule } from './features/slottedPage/SlottedPageModule';
import { StorageHierarchyModule } from './features/storageHierarchy/StorageHierarchyModule';
import { VolcanoVsSimdModule } from './features/volcanoSimd/VolcanoVsSimdModule';
import { useAppViewModel } from './useAppViewModel';

/**
 * Dumb View for the top-level seminar shell.
 * Renders HomeView by default (`activeModule === null`) or the selected module.
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
        theme={vm.theme}
        activeModule={vm.activeModule}
        presMode={vm.presMode}
        progressPct={vm.progressPct}
        onGoHome={vm.goHome}
        onSelectModule={vm.selectModule}
        onToggleLang={vm.toggleLang}
        onToggleTheme={vm.toggleTheme}
        onTogglePresMode={vm.togglePresMode}
      />

      <main
        className={`flex-1 ${
          vm.presMode ? 'max-w-full px-6 sm:px-12 py-8' : 'max-w-7xl px-4 sm:px-6 py-8'
        } mx-auto w-full`}
      >
        {vm.activeModule === null ? (
          <HomeView t={vm.t} onSelectModule={vm.selectModule} />
        ) : (
          <>
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
          </>
        )}
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
  Moon,
  Sun,
} from 'lucide-react';
import type { Locale, TranslationBundle } from '../core/i18n';
import type { ThemeMode } from '../core/theme';

const MODULE_ICONS = [Code2, HardDrive, Layers, Binary, Cpu] as const;

export interface NavbarProps {
  t: TranslationBundle;
  lang: Locale;
  theme: ThemeMode;
  activeModule: number | null;
  presMode: boolean;
  progressPct: number;
  onGoHome: () => void;
  onSelectModule: (index: number) => void;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onTogglePresMode: () => void;
}

/**
 * Sticky top navigation bar styled as a hardware lab instrument panel
 * with clickable home logo, theme switcher, binder-tab selectors, and language toggle.
 */
export function Navbar({
  t,
  lang,
  theme,
  activeModule,
  presMode,
  progressPct,
  onGoHome,
  onSelectModule,
  onToggleLang,
  onToggleTheme,
  onTogglePresMode,
}: NavbarProps) {
  const containerWidth = presMode ? 'max-w-full px-6' : 'max-w-7xl px-4 sm:px-6';

  return (
    <header className="sticky top-0 z-40 bg-[#EFE9DC]/95 backdrop-blur-md border-b-2 border-stone-900">
      <div className={`${containerWidth} mx-auto h-16 flex items-center justify-between gap-3`}>
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-3 min-w-0 text-left cursor-pointer group"
        >
          <img
            src="/assets/logo.png"
            alt={t.brandTitle}
            className="w-11 h-11 rounded-full border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] object-contain bg-[#F6F2EA] p-0.5 shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="truncate">
            <div className="text-xs font-mono font-semibold uppercase tracking-[0.12em] text-[#B83B1D]">
              {t.brandSub}
            </div>
            <h1 className="font-bold text-base sm:text-lg text-stone-900 tracking-tight truncate group-hover:text-[#B83B1D] transition-colors">
              {t.brandTitle}
            </h1>
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t.themeLight : t.themeDark}
            title={theme === 'dark' ? t.themeLight : t.themeDark}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none bg-[#FFFDF8] hover:bg-stone-100 text-stone-900 text-xs font-mono font-semibold transition cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-stone-800" />
            )}
          </button>

          <button
            type="button"
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
            type="button"
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

## `src/components/StageMessageBubble.tsx`

````tsx
import { MessageCircle, X } from 'lucide-react';
import type { ChatBubblePlacement } from '../core/queryPipeline';

export interface StageMessageBubbleProps {
  label: string;
  badge: string;
  title: string;
  body: string;
  open: boolean;
  placement: ChatBubblePlacement;
  onToggle: () => void;
}

/**
 * Floating icon-only trigger and animated speech bubble positioned above the
 * parent panel border so it never shifts or obscures centered module content.
 */
export function StageMessageBubble({
  label,
  badge,
  title,
  body,
  open,
  placement,
  onToggle,
}: StageMessageBubbleProps) {
  return (
    <div
      className={`mt-3 lg:mt-0 lg:absolute lg:z-30 flex flex-col gap-2 ${placement.alignClass} ${
        placement.side === 'left' ? 'lg:left-6 lg:items-start' : 'lg:right-16 lg:items-end'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={label}
        title={label}
        className="w-10 h-10 rounded-full bg-[#1C1917] hover:bg-stone-800 border-2 border-stone-900 shadow-[2px_2px_0px_#D94E28] text-amber-300 flex items-center justify-center transition cursor-pointer hover:scale-105"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {open && (
        <div
          role="status"
          className={`animate-springIn relative w-full lg:w-72 bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#D94E28] rounded-2xl p-4 pr-10 ${
            placement.side === 'left' ? 'lg:rounded-tl-sm' : 'lg:rounded-tr-sm'
          }`}
        >
          <button
            type="button"
            onClick={onToggle}
            aria-label="Close stage note"
            className="absolute top-2.5 right-2.5 p-1 rounded-md hover:bg-[#EFE9DC] text-stone-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-xs font-mono font-bold text-[#B83B1D] uppercase tracking-wider">
            {badge} • {title}
          </div>
          <p className="text-sm sm:text-base text-stone-900 mt-1 leading-relaxed">{body}</p>
        </div>
      )}
    </div>
  );
}
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
  const maxBytes = vm.cols.reduce((acc, col) => acc + col.bytes, 0);
  const fillPct = maxBytes > 0 ? Math.round((vm.payloadBytes / maxBytes) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm sm:text-base font-semibold text-stone-800">{t.m4.clickPrompt}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vm.cols.map((col, idx) => (
            <button
              key={col.key}
              onClick={() => vm.toggleNull(idx)}
              className={`p-4 rounded-xl border-2 border-stone-900 text-left transition-all cursor-pointer shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                col.isNull ? 'bg-amber-100' : 'bg-[#FFFDF8] hover:bg-[#EFE9DC]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-stone-700 font-semibold">{col.type}</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold border border-stone-900 ${
                    col.isNull ? 'bg-amber-300 text-stone-950' : 'bg-emerald-200 text-emerald-950'
                  }`}
                >
                  {col.isNull ? t.m4.nullBadge : t.m4.presentBadge}
                </span>
              </div>
              <div className="text-base sm:text-lg font-mono font-bold text-stone-900 mt-2">
                {col.key}:{' '}
                <span className={col.isNull ? 'text-[#B83B1D] italic' : 'text-blue-900'}>
                  {col.isNull ? 'NULL' : col.val}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-stone-800 mt-2 pt-2 border-t border-stone-900/15">
                <span>bit={col.isNull ? '0' : '1'}</span>
                <span>{col.isNull ? t.m4.zeroBytesStored : col.hex}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AccordionPanel title={t.m4.bitmapTitle} badge="t_bits" defaultOpen={true}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs sm:text-sm text-stone-700">{t.m4.bitmapExplain}</p>
            <div className="font-mono text-xs sm:text-sm font-bold px-3 py-1.5 rounded-md bg-emerald-100 border-2 border-stone-900 text-emerald-950">
              {t.m4.payloadSize}: {vm.payloadBytes} Bytes ({t.m4.nullBitmapSuffix})
            </div>
          </div>

          <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden border border-stone-900">
            <div
              className="h-full bg-[#D94E28] transition-all duration-300"
              style={{ width: `${fillPct}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-[#1C1917] p-4 rounded-lg border-2 border-stone-900 font-mono">
            <div className="p-3 rounded-md bg-stone-800 border-2 border-[#D94E28] text-center">
              <div className="text-xs text-amber-300 uppercase">{t.m4.nullBitmapHeader}</div>
              <div className="text-lg font-bold tracking-widest text-white mt-0.5">
                0000<span className="text-[#D94E28]">{vm.bitmapBits}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1.5 text-[11px] text-stone-300">
                {vm.cols.map((col) => (
                  <span key={col.key}>
                    {col.key}:{col.isNull ? '0' : '1'}
                  </span>
                ))}
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-stone-300 hidden sm:block" />

            {vm.cols.map((col) =>
              col.isNull ? null : (
                <div
                  key={col.key}
                  className="animate-springIn p-3 rounded-md bg-stone-800 border border-stone-500 text-center"
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
          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">{t.m4.alignExplain}</p>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded bg-[#1C1917] text-amber-300 font-mono text-xs font-bold">
              {vm.alignMode === 'good' ? t.m4.oneReadLabel : t.m4.twoReadsLabel}
            </span>
            <div className="flex items-center gap-2">
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

## `src/features/home/HomeView.tsx`

````tsx
import { ArrowRight, BookOpen, Compass, HelpCircle } from 'lucide-react';
import { AccordionPanel } from '../../components/AccordionPanel';
import type { TranslationBundle } from '../../core/i18n';

export interface HomeViewProps {
  t: TranslationBundle;
  onSelectModule: (index: number) => void;
}

/**
 * Opening home page introducing SQL in plain language for non-technical readers,
 * with collapsible site tutorials and direct module entry cards.
 */
export function HomeView({ t, onSelectModule }: HomeViewProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Banner */}
      <section className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[5px_5px_0px_#1c1917] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
        <div
          aria-hidden="true"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#EFE9DC] border-2 border-stone-900 shadow-[4px_4px_0px_#D94E28] flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold text-[#B83B1D] shrink-0 animate-springIn select-none"
        >
          {'{^_^}'}
        </div>
        <div className="space-y-3 text-center md:text-left">
          <span className="inline-block px-2.5 py-1 rounded bg-[#1C1917] text-amber-300 font-mono text-xs font-bold tracking-wider">
            {t.home.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {t.home.headline}
          </h2>
          <p className="text-base sm:text-lg text-stone-800 max-w-2xl leading-relaxed">
            {t.home.intro}
          </p>
          <div className="pt-1">
            <button
              onClick={() => onSelectModule(0)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D94E28] hover:bg-[#C2411F] border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-[#FFFDF8] font-bold text-sm sm:text-base transition cursor-pointer"
            >
              {t.home.startBtn} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* What is SQL? (Open by default) */}
      <AccordionPanel title={t.home.whatIsSqlTitle} badge="SQL" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.home.whatIsSqlPoints.map((point, idx) => (
            <div
              key={point.title}
              className="p-4 rounded-lg bg-[#EFE9DC]/70 border-2 border-stone-900 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B83B1D]">
                <BookOpen className="w-4 h-4" />
                <span>0{idx + 1}</span>
              </div>
              <h3 className="font-bold text-base text-stone-900">{point.title}</h3>
              <p className="text-sm sm:text-base text-stone-800 leading-relaxed">{point.body}</p>
            </div>
          ))}
        </div>
      </AccordionPanel>

      {/* How to use this site (Collapsed by default) */}
      <AccordionPanel title={t.home.howToUseTitle} badge="TUTORIAL" defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.home.howToUseSteps.map((step) => (
            <div
              key={step.title}
              className="p-4 rounded-lg bg-[#FFFDF8] border-2 border-stone-900 space-y-1"
            >
              <div className="flex items-center gap-2 font-bold text-base text-stone-900">
                <HelpCircle className="w-4 h-4 text-[#D94E28] shrink-0" />
                <span>{step.title}</span>
              </div>
              <p className="text-sm sm:text-base text-stone-800 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </AccordionPanel>

      {/* Module Directory (Collapsed by default) */}
      <AccordionPanel title={t.home.exploreModulesTitle} badge="01–05" defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {t.modules.map((mod, idx) => (
            <button
              key={mod.id}
              onClick={() => onSelectModule(idx)}
              className="p-4 rounded-lg bg-[#EFE9DC]/60 hover:bg-[#FFFDF8] border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] text-left transition cursor-pointer flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#B83B1D]">
                <span>{mod.short}</span>
                <Compass className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm sm:text-base text-stone-900">{mod.title}</div>
            </button>
          ))}
        </div>
      </AccordionPanel>
    </div>
  );
}
````
