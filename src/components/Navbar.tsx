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
