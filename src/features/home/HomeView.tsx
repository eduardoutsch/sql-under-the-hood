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
      <section className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[5px_5px_0px_#1c1917] rounded-xl p-4 sm:p-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
        <div
          aria-hidden="true"
          className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#EFE9DC] border-2 border-stone-900 shadow-[4px_4px_0px_#D94E28] flex items-center justify-center font-mono text-xl sm:text-3xl font-bold text-[#B83B1D] shrink-0 animate-springIn select-none"
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
