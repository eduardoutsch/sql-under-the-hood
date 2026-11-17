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
