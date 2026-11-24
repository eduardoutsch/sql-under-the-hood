import {
  Binary,
  Code2,
  Cpu,
  GitBranch,
  Globe,
  HardDrive,
  Layers,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Terminal,
} from 'lucide-react';
import type { Locale, TranslationBundle } from '../core/i18n';
import type { ThemeMode } from '../core/theme';

const MODULE_ICONS = [Code2, HardDrive, Layers, Binary, Cpu, Terminal, GitBranch] as const;

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
  const containerWidth = presMode ? 'max-w-full px-3 sm:px-6' : 'max-w-7xl px-3 sm:px-6';

  return (
    <header className="sticky top-0 z-40 bg-[#EFE9DC]/95 backdrop-blur-md border-b-2 border-stone-900">
      <div className={`${containerWidth} mx-auto h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3`}>
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-2 sm:gap-3 min-w-0 text-left cursor-pointer group"
        >
          <img
            src="/assets/logo.png"
            alt={t.brandTitle}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] object-contain bg-[#F6F2EA] p-0.5 shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em] text-[#B83B1D] truncate">
              {t.brandSub}
            </div>
            <h1 className="font-bold text-sm sm:text-lg text-stone-900 tracking-tight truncate group-hover:text-[#B83B1D] transition-colors">
              {t.brandTitle}
            </h1>
          </div>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t.themeLight : t.themeDark}
            title={theme === 'dark' ? t.themeLight : t.themeDark}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none bg-[#FFFDF8] hover:bg-stone-100 text-stone-900 text-xs font-mono font-semibold transition cursor-pointer"
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
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-xs font-semibold transition cursor-pointer ${
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
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-md bg-[#1C1917] hover:bg-stone-800 border-2 border-stone-900 shadow-[2px_2px_0px_#D94E28] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-[#F6F2EA] font-mono text-xs font-bold transition cursor-pointer"
            title="Toggle Language PT-BR / EN"
          >
            <Globe className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{lang === 'pt' ? 'PT-BR' : 'EN'}</span>
          </button>
        </div>
      </div>

      <div className={`${containerWidth} mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-1 pb-2.5 no-scrollbar`}>
        {t.modules.map((mod, idx) => {
          const active = idx === activeModule;
          const Icon = MODULE_ICONS[idx];
          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(idx)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-md text-xs font-mono whitespace-nowrap border-2 transition-all cursor-pointer ${
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
