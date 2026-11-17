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
