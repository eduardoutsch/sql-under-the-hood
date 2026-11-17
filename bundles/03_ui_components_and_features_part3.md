# 03_ui_components_and_features_part3

> Generated snapshot containing 4 file(s).

## Table of Contents

- [`src/features/volcanoSimd/VolcanoVsSimdModule.tsx`](#src-features-volcanosimd-volcanovssimdmodule-tsx)
- [`src/index.css`](#src-index-css)
- [`src/main.tsx`](#src-main-tsx)
- [`src/useAppViewModel.ts`](#src-useappviewmodel-ts)

---

## `src/features/volcanoSimd/VolcanoVsSimdModule.tsx`

````tsx
import { ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { AccordionPanel } from '../../components/AccordionPanel';
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
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={vm.toggleRunning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#D94E28] hover:bg-[#C2411F] border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] text-white font-semibold text-sm cursor-pointer"
          >
            {vm.running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {vm.running ? t.pause : t.play}
          </button>
          <button
            onClick={vm.step}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#EFE9DC] hover:bg-stone-200 text-stone-900 font-semibold text-sm border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] cursor-pointer"
          >
            {t.step} <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={vm.reset}
            className="p-2 rounded-md bg-[#EFE9DC] hover:bg-stone-200 text-stone-900 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
          <span className="text-stone-800 font-semibold">{t.m5.simdWidth}:</span>
          <button
            onClick={() => vm.selectLaneWidth(8)}
            className={`px-3 py-1.5 rounded-md border-2 border-stone-900 cursor-pointer ${
              vm.simdLane === 8
                ? 'bg-emerald-700 text-white font-bold shadow-[2px_2px_0px_#1c1917]'
                : 'bg-[#EFE9DC] text-stone-900'
            }`}
          >
            AVX2 (8× int32)
          </button>
          <button
            onClick={() => vm.selectLaneWidth(16)}
            className={`px-3 py-1.5 rounded-md border-2 border-stone-900 cursor-pointer ${
              vm.simdLane === 16
                ? 'bg-[#1C1917] text-amber-300 font-bold shadow-[2px_2px_0px_#D94E28]'
                : 'bg-[#EFE9DC] text-stone-900'
            }`}
          >
            AVX-512 (16× int32)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#b45309] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-stone-900">
                PostgreSQL / SQLite / MySQL
              </span>
              <h4 className="font-bold text-base sm:text-lg text-stone-900 mt-1.5">{t.m5.volcanoTitle}</h4>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-stone-700">{t.m5.cycles}</div>
              <div className="text-xl font-bold text-amber-900">{vm.volcanoCycles} clk</div>
            </div>
          </div>

          <div className="bg-[#1C1917] p-3 rounded-lg border-2 border-stone-900 font-mono text-xs sm:text-sm flex items-center justify-between">
            <span className="text-stone-100">
              Filter.next() → Scan.next() <span className="text-amber-300">{t.m5.rowPerCall}</span>
            </span>
            <span className="text-rose-300 font-semibold">{t.m5.dispatchTax}</span>
          </div>

          <div className="grid grid-cols-8 gap-1.5">
            {DATASET_PRICES.map((price, idx) => {
              const processed = idx < vm.progress.volcanoIdx;
              const current = idx === vm.progress.volcanoIdx && vm.progress.volcanoIdx < DATASET_PRICES.length;
              const match = price > 100;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-md font-mono text-xs sm:text-sm text-center border-2 transition-all ${
                    current
                      ? 'animate-laneSweep bg-[#D94E28] text-white font-bold border-stone-900 scale-110'
                      : processed
                      ? match
                        ? 'bg-emerald-100 border-stone-900 text-emerald-950 font-bold'
                        : 'bg-stone-200 border-stone-500 text-stone-700'
                      : 'bg-[#EFE9DC] border-stone-900/40 text-stone-800'
                  }`}
                >
                  {price}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-xs sm:text-sm font-mono text-stone-800 pt-1">
            <span>
              {t.m5.rowsLabel}: {vm.progress.volcanoIdx}/{DATASET_PRICES.length}
            </span>
            <span>
              {t.m5.cacheLocality}: {t.m5.poor}
            </span>
          </div>
        </div>

        <div className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#15803d] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-stone-900">
                ClickHouse / DuckDB / Photon
              </span>
              <h4 className="font-bold text-base sm:text-lg text-stone-900 mt-1.5">{t.m5.vectorTitle}</h4>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-stone-700">{t.m5.cycles}</div>
              <div className="text-xl font-bold text-emerald-900">{vm.simdCycles} clk</div>
            </div>
          </div>

          <div className="bg-[#1C1917] p-3 rounded-lg border-2 border-stone-900 font-mono text-xs sm:text-sm flex items-center justify-between">
            <span className="text-emerald-300">
              {vm.simdLane === 8 ? 'vpcmpgtd ymm0, ymm1' : 'vpcmpgtd zmm0, zmm1'} ({vm.simdLane} {t.m5.lanesPerClk})
            </span>
            <span className="text-amber-300 font-semibold">{t.m5.branchlessSimd}</span>
          </div>

          <div className="grid grid-cols-8 gap-1.5">
            {DATASET_PRICES.map((price, idx) => {
              const processed = idx < vm.progress.simdIdx;
              const inNextVector = idx >= vm.progress.simdIdx && idx < vm.progress.simdIdx + vm.simdLane;
              const match = price > 100;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-md font-mono text-xs sm:text-sm text-center border-2 transition-all ${
                    inNextVector
                      ? 'animate-laneSweep bg-blue-100 border-stone-900 text-blue-950 font-semibold'
                      : processed
                      ? match
                        ? 'bg-emerald-700 border-stone-900 text-white font-bold'
                        : 'bg-stone-200 border-stone-500 text-stone-700'
                      : 'bg-[#EFE9DC] border-stone-900/40 text-stone-800'
                  }`}
                >
                  {price}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AccordionPanel title={t.m5.selVector} badge={`[${vm.survivingIndices.length}]`} defaultOpen={false}>
        <div className="bg-[#1C1917] p-3 rounded-lg border-2 border-stone-900 font-mono text-xs sm:text-sm">
          <div className="text-emerald-300 break-all">
            sel_vec[{vm.survivingIndices.length}] = [{vm.survivingIndices.join(', ')}]
          </div>
        </div>
      </AccordionPanel>
    </div>
  );
}
````

## `src/index.css`

````css
@import "tailwindcss";

@layer base {
  body {
    font-family: 'Atkinson Hyperlegible', system-ui, -apple-system, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    letter-spacing: 0.01em;
    background-color: #f6f2ea;
    background-image:
      linear-gradient(to right, rgba(28, 25, 23, 0.045) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(28, 25, 23, 0.045) 1px, transparent 1px);
    background-size: 24px 24px;
    color: #1c1917;
  }

  code,
  pre,
  .font-mono {
    font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace;
    letter-spacing: 0.015em;
  }
}

/* Dark mode: Phosphor Oscilloscope & Copper PCB Hardware Lab */
html.dark body {
  background-color: #080f0c;
  background-image:
    radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.12), transparent 60%),
    linear-gradient(to right, rgba(52, 211, 153, 0.055) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(52, 211, 153, 0.055) 1px, transparent 1px),
    linear-gradient(to right, rgba(245, 158, 11, 0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(245, 158, 11, 0.07) 1px, transparent 1px);
  background-size: 100% 100%, 24px 24px, 24px 24px, 96px 96px, 96px 96px;
  color: #ecfdf5;
}

html.dark .bg-\[\#FFFDF8\],
html.dark .bg-\[\#F6F2EA\] {
  background-color: #0f1c16 !important;
}

html.dark .bg-\[\#EFE9DC\],
html.dark .bg-\[\#EFE9DC\]\/95,
html.dark .bg-\[\#EFE9DC\]\/80,
html.dark .bg-\[\#EFE9DC\]\/70,
html.dark .bg-\[\#EFE9DC\]\/60 {
  background-color: #152820 !important;
}

html.dark .bg-\[\#1C1917\] {
  background-color: #050a08 !important;
}

html.dark .bg-emerald-50,
html.dark .bg-emerald-100 {
  background-color: #0c2e22 !important;
}

html.dark .bg-blue-50,
html.dark .bg-blue-100,
html.dark .bg-blue-200 {
  background-color: #0d2137 !important;
}

html.dark .bg-amber-50,
html.dark .bg-amber-100,
html.dark .bg-amber-200 {
  background-color: #2b1d07 !important;
}

html.dark .bg-rose-100 {
  background-color: #2e1018 !important;
}

html.dark .text-stone-900,
html.dark .text-stone-950,
html.dark .text-stone-800,
html.dark .text-stone-700 {
  color: #ecfdf5 !important;
}

html.dark .text-stone-600 {
  color: #a7f3d0 !important;
}

html.dark .text-emerald-950,
html.dark .text-emerald-900,
html.dark .text-emerald-800 {
  color: #6ee7b7 !important;
}

html.dark .text-blue-950,
html.dark .text-blue-900,
html.dark .text-blue-800 {
  color: #93c5fd !important;
}

html.dark .text-amber-950,
html.dark .text-amber-900,
html.dark .text-amber-800 {
  color: #fcd34d !important;
}

html.dark .text-rose-950,
html.dark .text-rose-900,
html.dark .text-rose-800 {
  color: #fda4af !important;
}

html.dark .border-stone-900 {
  border-color: #d97706 !important;
}

html.dark .shadow-\[4px_4px_0px_\#1c1917\],
html.dark .shadow-\[5px_5px_0px_\#1c1917\],
html.dark .shadow-\[3px_3px_0px_\#1c1917\],
html.dark .shadow-\[2px_2px_0px_\#1c1917\] {
  box-shadow: 3px 3px 0px #92400e !important;
}

html.dark .text-\[\#B83B1D\] {
  color: #fbbf24 !important;
}

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

@keyframes springIn {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes busFlow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 28px 0;
  }
}

@keyframes laneSweep {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(217, 78, 40, 0.35);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(217, 78, 40, 0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}

.animate-springIn {
  animation: springIn 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.animate-busFlow {
  background-image: repeating-linear-gradient(
    90deg,
    #d94e28 0px,
    #d94e28 10px,
    transparent 10px,
    transparent 18px
  );
  background-size: 28px 4px;
  animation: busFlow 0.7s linear infinite;
}

.animate-laneSweep {
  animation: laneSweep 1.3s ease-in-out infinite;
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
import {
  getTranslations,
  type Locale,
  LOCALE_STORAGE_KEY,
  resolveInitialLocale,
  toggleLocale,
} from './core/i18n';
import {
  resolveInitialTheme,
  THEME_STORAGE_KEY,
  type ThemeMode,
  toggleTheme as switchTheme,
} from './core/theme';

function readStoredValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStoredValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors in restricted environments
  }
}

/**
 * ViewModel for the top-level App shell.
 * Starts on the Home page (`activeModule === null`), defaults to EN unless PT was
 * previously saved on this machine, and persists theme & language preferences.
 */
export function useAppViewModel() {
  const [lang, setLang] = useState<Locale>(() =>
    resolveInitialLocale(readStoredValue(LOCALE_STORAGE_KEY))
  );
  const [theme, setTheme] = useState<ThemeMode>(() =>
    resolveInitialTheme(readStoredValue(THEME_STORAGE_KEY))
  );
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [presMode, setPresMode] = useState(false);

  const t = getTranslations(lang);
  const progressPct =
    activeModule === null ? 0 : computeProgressPct(activeModule, t.modules.length);
  const subtitles = [t.m1.subtitle, t.m2.subtitle, t.m3.subtitle, t.m4.subtitle, t.m5.subtitle];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveModule((m) => (m === null ? 0 : stepModuleIndex(m, 1)));
      } else if (e.key === 'ArrowLeft') {
        setActiveModule((m) => (m === null ? null : stepModuleIndex(m, -1)));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return {
    lang,
    theme,
    t,
    activeModule,
    presMode,
    progressPct,
    activeTitle: activeModule === null ? t.brandTitle : t.modules[activeModule].title,
    activeSubtitle: activeModule === null ? t.home.intro : subtitles[activeModule],
    goHome: () => setActiveModule(null),
    selectModule: (idx: number) => setActiveModule(idx),
    prevModule: () =>
      setActiveModule((m) => (m === null ? null : stepModuleIndex(m, -1))),
    nextModule: () =>
      setActiveModule((m) => (m === null ? 0 : stepModuleIndex(m, 1))),
    toggleLang: () =>
      setLang((prev) => {
        const next = toggleLocale(prev);
        writeStoredValue(LOCALE_STORAGE_KEY, next);
        return next;
      }),
    toggleTheme: () =>
      setTheme((prev) => {
        const next = switchTheme(prev);
        writeStoredValue(THEME_STORAGE_KEY, next);
        return next;
      }),
    togglePresMode: () => setPresMode((prev) => !prev),
  };
}
````
