import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DeployModal } from './components/DeployModal';
import { Navbar } from './components/Navbar';
import {
  computeProgressPct,
  MODULE_COUNT,
  stepModuleIndex,
} from './core/appNavigation';
import { DEFAULT_LOCALE, getTranslations, type Locale, toggleLocale } from './core/i18n';
import { BitInspectorModule } from './features/bitInspector/BitInspectorModule';
import { QueryPipelineModule } from './features/queryPipeline/QueryPipelineModule';
import { SlottedPageModule } from './features/slottedPage/SlottedPageModule';
import { StorageHierarchyModule } from './features/storageHierarchy/StorageHierarchyModule';
import { VolcanoVsSimdModule } from './features/volcanoSimd/VolcanoVsSimdModule';

/**
 * Top-level seminar shell orchestrating active module selection,
 * PT-BR/EN locale state, presentation mode, and keyboard navigation.
 */
export default function App() {
  const [lang, setLang] = useState<Locale>(DEFAULT_LOCALE);
  const [activeModule, setActiveModule] = useState(0);
  const [presMode, setPresMode] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);

  const t = getTranslations(lang);
  const progressPct = computeProgressPct(activeModule, t.modules.length);
  const subtitles = [
    t.m1.subtitle,
    t.m2.subtitle,
    t.m3.subtitle,
    t.m4.subtitle,
    t.m5.subtitle,
  ];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveModule((m) => stepModuleIndex(m, 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveModule((m) => stepModuleIndex(m, -1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col">
      <Navbar
        t={t}
        lang={lang}
        activeModule={activeModule}
        presMode={presMode}
        progressPct={progressPct}
        onSelectModule={setActiveModule}
        onToggleLang={() => setLang((prev) => toggleLocale(prev))}
        onTogglePresMode={() => setPresMode((prev) => !prev)}
        onOpenDeployModal={() => setShowDeployModal(true)}
      />

      <main
        className={`flex-1 ${
          presMode ? 'max-w-full px-6 sm:px-12 py-8' : 'max-w-7xl px-4 sm:px-6 py-8'
        } mx-auto w-full`}
      >
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <span>
              {t.moduleLabel} 0{activeModule + 1} / 0{MODULE_COUNT}
            </span>
            <span>•</span>
            <span>SQL INTERNALS SEMINAR</span>
          </div>
          <h2
            className={`${
              presMode ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'
            } font-bold text-white mt-1`}
          >
            {t.modules[activeModule].title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-4xl">
            {subtitles[activeModule]}
          </p>
        </div>

        <div className="animate-fadeIn">
          {activeModule === 0 && <QueryPipelineModule t={t} lang={lang} />}
          {activeModule === 1 && <StorageHierarchyModule t={t} lang={lang} />}
          {activeModule === 2 && <SlottedPageModule t={t} />}
          {activeModule === 3 && <BitInspectorModule t={t} />}
          {activeModule === 4 && <VolcanoVsSimdModule t={t} />}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => setActiveModule((m) => stepModuleIndex(m, -1))}
            disabled={activeModule === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-sm font-mono text-slate-200 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> {t.prevMod}
          </button>

          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            ← / → Keyboard Navigation
          </span>

          <button
            onClick={() => setActiveModule((m) => stepModuleIndex(m, 1))}
            disabled={activeModule === MODULE_COUNT - 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 disabled:opacity-40 border border-cyan-500/40 text-sm font-mono text-cyan-300 font-semibold transition cursor-pointer"
          >
            {t.nextMod} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <DeployModal
        isOpen={showDeployModal}
        t={t}
        onClose={() => setShowDeployModal(false)}
      />
    </div>
  );
}
