import { ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import type { TranslationBundle } from '../../core/i18n';
import { DATASET_PRICES } from '../../core/volcanoSimd';
import { useVolcanoSimdViewModel } from './useVolcanoSimdViewModel';

export interface VolcanoVsSimdModuleProps {
  t: TranslationBundle;
}

/**
 * Dumb View for Module 5 (Volcano Iterator vs. Vectorized SIMD Execution).
 * Delegates simulation timers and cycle/index metrics to `useVolcanoSimdViewModel`.
 */
export function VolcanoVsSimdModule({ t }: VolcanoVsSimdModuleProps) {
  const vm = useVolcanoSimdViewModel();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={vm.toggleRunning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm cursor-pointer"
          >
            {vm.running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {vm.running ? t.pause : t.play}
          </button>
          <button
            onClick={vm.step}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm border border-slate-700 cursor-pointer"
          >
            {t.step} <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={vm.reset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">{t.m5.simdWidth}:</span>
          <button
            onClick={() => vm.selectLaneWidth(8)}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              vm.simdLane === 8 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            AVX2 (8× int32)
          </button>
          <button
            onClick={() => vm.selectLaneWidth(16)}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              vm.simdLane === 16 ? 'bg-violet-500 text-white font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            AVX-512 (16× int32)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                PostgreSQL / SQLite / MySQL
              </span>
              <h4 className="font-semibold text-slate-100 mt-1.5">{t.m5.volcanoTitle}</h4>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-slate-400">{t.m5.cycles}</div>
              <div className="text-xl font-bold text-amber-400">{vm.volcanoCycles} clk</div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs flex items-center justify-between">
            <span className="text-slate-300">
              Filter.next() → Scan.next() <span className="text-amber-400">[1 row/call]</span>
            </span>
            <span className="text-rose-400">~65% Dispatch Tax</span>
          </div>

          <div className="grid grid-cols-8 gap-1.5">
            {DATASET_PRICES.map((price, idx) => {
              const processed = idx < vm.progress.volcanoIdx;
              const current = idx === vm.progress.volcanoIdx && vm.progress.volcanoIdx < DATASET_PRICES.length;
              const match = price > 100;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-lg font-mono text-xs text-center border transition-all ${
                    current
                      ? 'bg-amber-400 text-slate-950 font-bold border-white scale-110'
                      : processed
                      ? match
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
                  }`}
                >
                  {price}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-xs font-mono text-slate-400 pt-1">
            <span>
              Rows: {vm.progress.volcanoIdx}/{DATASET_PRICES.length}
            </span>
            <span>
              {t.m5.cacheLocality}: {t.m5.poor}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/80 border-2 border-emerald-400/60 rounded-2xl p-5 space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                ClickHouse / DuckDB / Photon
              </span>
              <h4 className="font-semibold text-white mt-1.5">{t.m5.vectorTitle}</h4>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-slate-400">{t.m5.cycles}</div>
              <div className="text-xl font-bold text-emerald-400">{vm.simdCycles} clk</div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 font-mono text-xs flex items-center justify-between">
            <span className="text-emerald-300">
              {vm.simdLane === 8 ? 'vpcmpgtd ymm0, ymm1' : 'vpcmpgtd zmm0, zmm1'} ({vm.simdLane} lanes/clk)
            </span>
            <span className="text-cyan-300">Branchless SIMD</span>
          </div>

          <div className="grid grid-cols-8 gap-1.5">
            {DATASET_PRICES.map((price, idx) => {
              const processed = idx < vm.progress.simdIdx;
              const inNextVector = idx >= vm.progress.simdIdx && idx < vm.progress.simdIdx + vm.simdLane;
              const match = price > 100;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-lg font-mono text-xs text-center border transition-all ${
                    inNextVector
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200'
                      : processed
                      ? match
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
                  }`}
                >
                  {price}
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs">
            <div className="text-slate-400 mb-1">{t.m5.selVector}:</div>
            <div className="text-emerald-400 truncate">
              sel_vec[{vm.survivingIndices.length}] = [{vm.survivingIndices.join(', ')}]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
