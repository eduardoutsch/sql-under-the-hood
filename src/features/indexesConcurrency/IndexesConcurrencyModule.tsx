import { GitBranch, LockOpen, Play, RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';
import {
  EXPLAIN_PLAN_STEPS,
  INDEX_CASES,
  JOIN_ALGORITHMS,
} from '../../core/indexesConcurrency';
import type { Locale, TranslationBundle } from '../../core/i18n';

export interface IndexesConcurrencyModuleProps {
  t: TranslationBundle;
  lang: Locale;
}

type SubTab = 'indexes' | 'concurrency' | 'explain';

/**
 * Module 7: B+Tree vs. Bitmap Indexes, MVCC Concurrency (Redo/Undo),
 * and Execution Plans (EXPLAIN PLAN + Join Algorithms).
 */
export function IndexesConcurrencyModule({ t, lang }: IndexesConcurrencyModuleProps) {
  const [subTab, setSubTab] = useState<SubTab>('indexes');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(INDEX_CASES[0].id);
  const [txState, setTxState] = useState<'initial' | 'uncommitted' | 'committed' | 'rolledback'>('initial');
  const [explainStepIdx, setExplainStepIdx] = useState<number>(0);

  const activeCase = INDEX_CASES.find((c) => c.id === selectedCaseId) ?? INDEX_CASES[0];
  const activeExplain = EXPLAIN_PLAN_STEPS[explainStepIdx];
  const pctPages = Math.max(1, Math.round((activeCase.pagesRead / activeCase.totalPages) * 100));

  const txSalaryInBuffer = txState === 'uncommitted' || txState === 'committed' ? 6500 : 5000;
  const readerSnapshot = txState === 'committed' ? 6500 : 5000;

  return (
    <div className="space-y-6">
      {/* Sub-lab switcher */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'indexes', label: t.m7.tabIndexes, icon: Search },
            { id: 'concurrency', label: t.m7.tabConcurrency, icon: LockOpen },
            { id: 'explain', label: t.m7.tabExplain, icon: GitBranch },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-mono border-2 transition cursor-pointer ${
                active
                  ? 'bg-[#D94E28] text-[#FFFDF8] border-stone-900 font-bold shadow-[2px_2px_0px_#1c1917]'
                  : 'bg-[#FFFDF8] text-stone-800 border-stone-900/40 hover:border-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. B+Tree vs Bitmap + Implicit Coercion */}
      {subTab === 'indexes' && (
        <section className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-xl p-4 sm:p-6 space-y-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900">{t.m7.indexesTitle}</h3>
            <p className="text-sm text-stone-800 mt-1">{t.m7.indexesDesc}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {INDEX_CASES.map((c) => {
              const active = c.id === activeCase.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono border-2 transition cursor-pointer ${
                    active
                      ? 'bg-[#1C1917] text-amber-300 border-stone-900 font-bold shadow-[2px_2px_0px_#D94E28]'
                      : 'bg-[#EFE9DC] text-stone-900 border-stone-900/40 hover:border-stone-900'
                  }`}
                >
                  {lang === 'pt' ? c.labelPt : c.labelEn}
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-lg bg-[#1C1917] border-2 border-stone-900 text-amber-300 font-mono text-xs sm:text-sm overflow-x-auto">
            {activeCase.sql}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#EFE9DC]/70 border-2 border-stone-900 space-y-1">
              <div className="text-xs font-mono font-bold text-[#B83B1D] uppercase">{t.m7.strategyLabel}</div>
              <div className="text-base font-bold font-mono text-stone-900">
                {activeCase.winningStrategy === 'btree' && 'B+Tree Index (3 levels)'}
                {activeCase.winningStrategy === 'bitmap' && 'Bitmap Index (Bitwise)'}
                {activeCase.winningStrategy === 'fullscan' && 'Full Table Scan'}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#EFE9DC]/70 border-2 border-stone-900 space-y-1">
              <div className="text-xs font-mono font-bold text-[#B83B1D] uppercase">{t.m7.complexityLabel}</div>
              <div className="text-base font-bold font-mono text-stone-900">{activeCase.complexity}</div>
            </div>

            <div className="p-4 rounded-lg bg-[#EFE9DC]/70 border-2 border-stone-900 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#B83B1D]">
                <span>{t.m7.pagesReadLabel}</span>
                <span>
                  {activeCase.pagesRead} / {activeCase.totalPages} (8 KB)
                </span>
              </div>
              <div className="w-full h-3 rounded bg-stone-300 border border-stone-900 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    activeCase.winningStrategy === 'fullscan' ? 'bg-rose-600' : 'bg-[#D94E28]'
                  }`}
                  style={{ width: `${pctPages}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#EFE9DC]/80 border-2 border-stone-900 text-sm text-stone-900 leading-relaxed">
            {lang === 'pt' ? activeCase.explanationPt : activeCase.explanationEn}
          </div>
        </section>
      )}

      {/* 2. MVCC Concurrency (Redo / Undo / Snapshots) */}
      {subTab === 'concurrency' && (
        <section className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-xl p-4 sm:p-6 space-y-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900">{t.m7.concurrencyTitle}</h3>
            <p className="text-sm text-stone-800 mt-1">{t.m7.concurrencyDesc}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTxState('uncommitted')}
              className="px-3.5 py-2 rounded-lg bg-[#D94E28] hover:bg-[#C2411F] text-[#FFFDF8] border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] font-mono text-xs font-bold cursor-pointer"
            >
              1. UPDATE salario = 6500
            </button>
            <button
              type="button"
              onClick={() => setTxState('committed')}
              disabled={txState !== 'uncommitted'}
              className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] font-mono text-xs font-bold cursor-pointer"
            >
              2a. COMMIT (Redo)
            </button>
            <button
              type="button"
              onClick={() => setTxState('rolledback')}
              disabled={txState !== 'uncommitted'}
              className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] font-mono text-xs font-bold cursor-pointer"
            >
              2b. ROLLBACK (Undo)
            </button>
            <button
              type="button"
              onClick={() => setTxState('initial')}
              className="px-3 py-2 rounded-lg bg-[#EFE9DC] hover:bg-stone-200 text-stone-900 border-2 border-stone-900 font-mono text-xs font-semibold cursor-pointer"
            >
              {t.reset}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#EFE9DC]/70 border-2 border-stone-900 space-y-1.5">
              <div className="text-xs font-mono font-bold text-[#B83B1D]">BUFFER POOL (8 KB)</div>
              <div className="font-mono text-lg font-bold text-stone-900">salario = {txSalaryInBuffer}</div>
              <p className="text-xs text-stone-800">
                {txState === 'uncommitted' ? t.m7.dirtyPageNote : t.m7.cleanPageNote}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#EFE9DC]/70 border-2 border-stone-900 space-y-1.5">
              <div className="text-xs font-mono font-bold text-[#B83B1D]">UNDO LOG (MVCC)</div>
              <div className="font-mono text-lg font-bold text-stone-900">
                {txState === 'uncommitted' ? 'old = 5000' : '—'}
              </div>
              <p className="text-xs text-stone-800">
                {t.m7.readerSeesLabel}: <strong className="font-mono">{readerSnapshot}</strong>
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#EFE9DC]/70 border-2 border-stone-900 space-y-1.5">
              <div className="text-xs font-mono font-bold text-[#B83B1D]">REDO LOG (WAL)</div>
              <div className="font-mono text-lg font-bold text-stone-900">
                {txState === 'committed' ? 'FLUSHED ✓' : txState === 'uncommitted' ? 'PENDING' : 'IDLE'}
              </div>
              <p className="text-xs text-stone-800">{t.m7.redoNote}</p>
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-[#EFE9DC]/60 border-2 border-stone-900 text-xs sm:text-sm text-stone-900">
            {t.m7.sgaPgaNote}
          </div>
        </section>
      )}

      {/* 3. EXPLAIN PLAN + Join Algorithms */}
      {subTab === 'explain' && (
        <div className="space-y-6">
          <section className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900">{t.m7.explainTitle}</h3>
                <p className="text-sm text-stone-800 mt-1">{t.m7.explainDesc}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExplainStepIdx((i) => Math.min(EXPLAIN_PLAN_STEPS.length - 1, i + 1))}
                  disabled={explainStepIdx >= EXPLAIN_PLAN_STEPS.length - 1}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D94E28] hover:bg-[#C2411F] disabled:opacity-40 text-[#FFFDF8] border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] font-mono text-xs font-bold cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" /> {t.step}
                </button>
                <button
                  type="button"
                  onClick={() => setExplainStepIdx(0)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EFE9DC] hover:bg-stone-200 text-stone-900 border-2 border-stone-900 font-mono text-xs font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> {t.reset}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {EXPLAIN_PLAN_STEPS.map((step, idx) => {
                const isActive = idx === explainStepIdx;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setExplainStepIdx(idx)}
                    className={`w-full text-left p-3 rounded-lg border-2 font-mono text-xs sm:text-sm transition cursor-pointer flex flex-wrap items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-[#1C1917] text-amber-300 border-stone-900 shadow-[3px_3px_0px_#D94E28]'
                        : 'bg-[#EFE9DC]/60 text-stone-900 border-stone-900/40 hover:border-stone-900'
                    }`}
                  >
                    <span>
                      Id {step.id} • <strong>{step.op}</strong> ({step.target})
                    </span>
                    <span className={isActive ? 'text-stone-300' : 'text-stone-700'}>
                      Rows={step.rows} | Cost={step.cost}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-lg bg-[#EFE9DC]/80 border-2 border-stone-900 text-sm text-stone-900">
              {lang === 'pt' ? activeExplain.detailPt : activeExplain.detailEn}
            </div>
          </section>

          <section className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-xl p-4 sm:p-6 space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900">{t.m7.joinsTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {JOIN_ALGORITHMS.map((algo) => (
                <div
                  key={algo.id}
                  className="p-4 rounded-lg bg-[#EFE9DC]/70 border-2 border-stone-900 space-y-2"
                >
                  <div className="text-xs font-mono font-bold text-[#B83B1D]">{algo.cost}</div>
                  <h4 className="font-bold text-base text-stone-900">{algo.name}</h4>
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                    {lang === 'pt' ? algo.ideaPt : algo.ideaEn}
                  </p>
                  <div className="pt-1 text-xs font-mono text-stone-700 border-t border-stone-900/20">
                    {lang === 'pt' ? algo.whenPt : algo.whenEn}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-xl p-4 sm:p-6 space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-stone-900">{t.m7.plsqlTitle}</h3>
            <pre className="p-3 rounded-lg bg-[#1C1917] text-amber-300 font-mono text-xs sm:text-sm overflow-x-auto border-2 border-stone-900">
              {t.m7.plsqlCode}
            </pre>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">{t.m7.plsqlNote}</p>
          </section>
        </div>
      )}
    </div>
  );
}
