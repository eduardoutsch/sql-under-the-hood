import { CheckCircle2, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { AccordionPanel } from '../../components/AccordionPanel';
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#1C1917] border-2 border-stone-900 shadow-[4px_4px_0px_#D94E28] p-4 rounded-xl">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider bg-[#D94E28] text-[#FFFDF8] rounded">
            {t.m1.sqlInput}
          </span>
          <code className="font-mono text-sm sm:text-base text-stone-100 whitespace-nowrap">
            <span className="text-amber-400 font-semibold">SELECT</span> id, name{' '}
            <span className="text-amber-400 font-semibold">FROM</span> users{' '}
            <span className="text-amber-400 font-semibold">WHERE</span> price &gt;{' '}
            <span className="text-emerald-400 font-semibold">100</span>;
          </code>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={vm.togglePlay}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#D94E28] hover:bg-[#C2411F] border-2 border-stone-950 text-[#FFFDF8] font-semibold text-sm transition cursor-pointer"
          >
            {vm.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {vm.isPlaying ? t.pause : t.play}
          </button>
          <button
            onClick={vm.stepStage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#FFFDF8] hover:bg-stone-200 text-stone-900 font-semibold text-sm border-2 border-stone-950 transition cursor-pointer"
          >
            {t.step} <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={vm.reset}
            className="p-2 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 border-2 border-stone-950 transition cursor-pointer"
            title={t.reset}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {t.m1.stages.map((st, idx) => {
          const active = idx === vm.stage;
          const done = idx < vm.stage;
          return (
            <button
              key={st.name}
              onClick={() => vm.selectStage(idx)}
              className={`text-left p-3 rounded-lg border-2 transition-all cursor-pointer relative ${
                active
                  ? 'bg-[#FFFDF8] border-stone-900 shadow-[3px_3px_0px_#D94E28]'
                  : done
                  ? 'bg-emerald-50 border-stone-900 text-stone-800'
                  : 'bg-[#EFE9DC]/70 border-stone-900/30 text-stone-600 hover:border-stone-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-stone-500">0{idx + 1}</span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                {active && <span className="w-2.5 h-2.5 rounded-full bg-[#D94E28] animate-ping" />}
              </div>
              <div className={`font-semibold text-xs sm:text-sm ${active ? 'text-[#B83B1D]' : 'text-stone-900'}`}>
                {st.name}
              </div>
            </button>
          );
        })}
      </div>

      <AccordionPanel
        title={t.m1.stages[vm.stage].name}
        badge={`0${vm.stage + 1}`}
        defaultOpen={true}
      >
        <div className="min-h-[280px] flex flex-col justify-center">
          {vm.stage === 0 && <LexerStageView tokens={vm.tokens} banner={t.m1.lexerBanner} />}
          {(vm.stage === 1 || vm.stage === 2) && <AstStageView isRewriter={vm.stage === 2} t={t} />}
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
      </AccordionPanel>

      <AccordionPanel
        title={`${t.m1.stageNotesLabel}: ${t.m1.stages[vm.stage].name}`}
        badge="INFO"
        defaultOpen={false}
      >
        <p className="text-sm sm:text-base text-stone-800 leading-relaxed">{t.m1.stages[vm.stage].desc}</p>
      </AccordionPanel>
    </div>
  );
}
