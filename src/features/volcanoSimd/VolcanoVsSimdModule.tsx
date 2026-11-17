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
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={vm.toggleRunning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#D94E28] hover:bg-[#C2411F] border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] text-white font-semibold text-sm cursor-pointer"
          >
            {vm.running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {vm.running ? t.pause : t.play}
          </button>
          <button
            onClick={vm.step}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#EFE9DC] hover:bg-stone-200 text-stone-900 font-semibold text-sm border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] cursor-pointer"
          >
            {t.step} <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={vm.reset}
            className="p-2 rounded-md bg-[#EFE9DC] hover:bg-stone-200 text-stone-900 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-stone-600 font-semibold">{t.m5.simdWidth}:</span>
          <button
            onClick={() => vm.selectLaneWidth(8)}
            className={`px-3 py-1.5 rounded-md border-2 border-stone-900 cursor-pointer ${
              vm.simdLane === 8
                ? 'bg-emerald-700 text-white font-bold shadow-[2px_2px_0px_#1c1917]'
                : 'bg-[#EFE9DC] text-stone-800'
            }`}
          >
            AVX2 (8× int32)
          </button>
          <button
            onClick={() => vm.selectLaneWidth(16)}
            className={`px-3 py-1.5 rounded-md border-2 border-stone-900 cursor-pointer ${
              vm.simdLane === 16
                ? 'bg-[#1C1917] text-amber-300 font-bold shadow-[2px_2px_0px_#D94E28]'
                : 'bg-[#EFE9DC] text-stone-800'
            }`}
          >
            AVX-512 (16× int32)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#b45309] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-stone-900">
                PostgreSQL / SQLite / MySQL
              </span>
              <h4 className="font-bold text-stone-900 mt-1.5">{t.m5.volcanoTitle}</h4>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-stone-600">{t.m5.cycles}</div>
              <div className="text-xl font-bold text-amber-800">{vm.volcanoCycles} clk</div>
            </div>
          </div>

          <div className="bg-[#1C1917] p-3 rounded-lg border-2 border-stone-900 font-mono text-xs flex items-center justify-between">
            <span className="text-stone-200">
              Filter.next() → Scan.next() <span className="text-amber-400">[1 row/call]</span>
            </span>
            <span className="text-rose-400 font-semibold">~65% Dispatch Tax</span>
          </div>

          <div className="grid grid-cols-8 gap-1.5">
            {DATASET_PRICES.map((price, idx) => {
              const processed = idx < vm.progress.volcanoIdx;
              const current = idx === vm.progress.volcanoIdx && vm.progress.volcanoIdx < DATASET_PRICES.length;
              const match = price > 100;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-md font-mono text-xs text-center border-2 transition-all ${
                    current
                      ? 'bg-[#D94E28] text-white font-bold border-stone-900 scale-110'
                      : processed
                      ? match
                        ? 'bg-emerald-100 border-stone-900 text-emerald-950 font-bold'
                        : 'bg-stone-200 border-stone-400 text-stone-500'
                      : 'bg-[#EFE9DC] border-stone-900/30 text-stone-700'
                  }`}
                >
                  {price}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-xs font-mono text-stone-600 pt-1">
            <span>
              Rows: {vm.progress.volcanoIdx}/{DATASET_PRICES.length}
            </span>
            <span>
              {t.m5.cacheLocality}: {t.m5.poor}
            </span>
          </div>
        </div>

        <div className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#15803d] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-stone-900">
                ClickHouse / DuckDB / Photon
              </span>
              <h4 className="font-bold text-stone-900 mt-1.5">{t.m5.vectorTitle}</h4>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-stone-600">{t.m5.cycles}</div>
              <div className="text-xl font-bold text-emerald-800">{vm.simdCycles} clk</div>
            </div>
          </div>

          <div className="bg-[#1C1917] p-3 rounded-lg border-2 border-stone-900 font-mono text-xs flex items-center justify-between">
            <span className="text-emerald-400">
              {vm.simdLane === 8 ? 'vpcmpgtd ymm0, ymm1' : 'vpcmpgtd zmm0, zmm1'} ({vm.simdLane} lanes/clk)
            </span>
            <span className="text-amber-300 font-semibold">Branchless SIMD</span>
          </div>

          <div className="grid grid-cols-8 gap-1.5">
            {DATASET_PRICES.map((price, idx) => {
              const processed = idx < vm.progress.simdIdx;
              const inNextVector = idx >= vm.progress.simdIdx && idx < vm.progress.simdIdx + vm.simdLane;
              const match = price > 100;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-md font-mono text-xs text-center border-2 transition-all ${
                    inNextVector
                      ? 'bg-blue-100 border-stone-900 text-blue-950 font-semibold'
                      : processed
                      ? match
                        ? 'bg-emerald-700 border-stone-900 text-white font-bold'
                        : 'bg-stone-200 border-stone-400 text-stone-500'
                      : 'bg-[#EFE9DC] border-stone-900/30 text-stone-700'
                  }`}
                >
                  {price}
                </div>
              );
            })}
          </div>

          <div className="bg-[#1C1917] p-3 rounded-lg border-2 border-stone-900 font-mono text-xs">
            <div className="text-stone-400 mb-1">{t.m5.selVector}:</div>
            <div className="text-emerald-400 truncate">
              sel_vec[{vm.survivingIndices.length}] = [{vm.survivingIndices.join(', ')}]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
