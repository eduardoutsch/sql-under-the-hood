import { CheckCircle2, ChevronRight, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
            SQL INPUT
          </span>
          <code className="font-mono text-sm sm:text-base text-slate-100 whitespace-nowrap">
            <span className="text-cyan-400">SELECT</span> id, name{' '}
            <span className="text-cyan-400">FROM</span> users{' '}
            <span className="text-cyan-400">WHERE</span> price &gt;{' '}
            <span className="text-amber-400">100</span>;
          </code>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={vm.togglePlay}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition cursor-pointer"
          >
            {vm.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {vm.isPlaying ? t.pause : t.play}
          </button>
          <button
            onClick={vm.stepStage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm border border-slate-700 transition cursor-pointer"
          >
            {t.step} <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={vm.reset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title={t.reset}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {t.m1.stages.map((st, idx) => {
          const active = idx === vm.stage;
          const done = idx < vm.stage;
          return (
            <button
              key={st.name}
              onClick={() => vm.selectStage(idx)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                active
                  ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.18)]'
                  : done
                  ? 'bg-slate-900/80 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-slate-400">0{idx + 1}</span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {active && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
              </div>
              <div className={`font-semibold text-xs sm:text-sm ${active ? 'text-cyan-300' : 'text-slate-200'}`}>
                {st.name}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-slate-100">{t.m1.stages[vm.stage].name}</h4>
          <p className="text-sm text-slate-400 mt-0.5">{t.m1.stages[vm.stage].desc}</p>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 min-h-[340px] flex flex-col justify-center">
        {vm.stage === 0 && <LexerStageView tokens={vm.tokens} />}
        {(vm.stage === 1 || vm.stage === 2) && <AstStageView isRewriter={vm.stage === 2} lang={lang} />}
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
    </div>
  );
}
