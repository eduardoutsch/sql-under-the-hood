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
