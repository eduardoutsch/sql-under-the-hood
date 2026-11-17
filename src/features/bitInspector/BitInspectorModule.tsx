import { ArrowRight } from 'lucide-react';
import type { TranslationBundle } from '../../core/i18n';
import { useBitInspectorViewModel } from './useBitInspectorViewModel';

export interface BitInspectorModuleProps {
  t: TranslationBundle;
}

/**
 * Dumb View for Module 4 (Null Bitmaps & 64-Bit CPU Word Alignment).
 * Delegates column nullability and alignment mode to `useBitInspectorViewModel`.
 */
export function BitInspectorModule({ t }: BitInspectorModuleProps) {
  const vm = useBitInspectorViewModel();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {vm.cols.map((col, idx) => (
          <button
            key={col.key}
            onClick={() => vm.toggleNull(idx)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              col.isNull
                ? 'bg-amber-950/30 border-amber-500/50'
                : 'bg-slate-900/90 border-cyan-500/40 hover:border-cyan-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                col[{idx}] • {col.type}
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${
                  col.isNull ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                bit={col.isNull ? '0' : '1'}
              </span>
            </div>
            <div className="text-base font-mono font-bold text-white mt-2">
              {col.key}:{' '}
              <span className={col.isNull ? 'text-amber-400 italic' : 'text-cyan-300'}>
                {col.isNull ? 'NULL' : col.val}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1.5">
              Hex: {col.isNull ? '(0 bytes stored!)' : col.hex}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="font-semibold text-slate-100">{t.m4.bitmapTitle}</h4>
            <p className="text-xs text-slate-400">{t.m4.bitmapExplain}</p>
          </div>
          <div className="font-mono text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400">
            Payload Size: {vm.payloadBytes} Bytes (+ 1B Null Bitmap)
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
          <div className="p-3 rounded-lg bg-violet-950/60 border border-violet-400 text-center">
            <div className="text-[10px] text-violet-300 uppercase">t_bits[0] (Null Bitmap)</div>
            <div className="text-lg font-bold tracking-widest text-white mt-0.5">
              0000<span className="text-amber-300">{vm.bitmapBits}</span>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

          {vm.cols.map((col) =>
            col.isNull ? null : (
              <div
                key={col.key}
                className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center"
              >
                <div className="text-[10px] text-cyan-300">
                  {col.key} ({col.bytes}B)
                </div>
                <div className="text-sm font-bold text-slate-100 mt-1">{col.hex}</div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="font-semibold text-slate-100">{t.m4.alignTitle}</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => vm.setAlignMode('good')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer ${
                vm.alignMode === 'good' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              ✓ {t.m4.goodAlign}
            </button>
            <button
              onClick={() => vm.setAlignMode('bad')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer ${
                vm.alignMode === 'bad' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              ✕ {t.m4.badAlign}
            </button>
          </div>
        </div>

        {vm.alignMode === 'good' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-8 gap-1.5 font-mono text-xs text-center">
              {[0, 1, 2, 3].map((b) => (
                <div
                  key={b}
                  className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-400/60 text-emerald-200"
                >
                  <div className="text-[10px] text-slate-400">Byte {b}</div>
                  <div className="font-bold mt-0.5">id[{b}]</div>
                </div>
              ))}
              {[4, 5, 6, 7].map((b) => (
                <div
                  key={b}
                  className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-400/60 text-cyan-200"
                >
                  <div className="text-[10px] text-slate-400">Byte {b}</div>
                  <div className="font-bold mt-0.5">price[{b - 4}]</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-emerald-300 font-mono">{t.m4.goodDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-1 overflow-x-auto font-mono text-xs text-center pb-1">
              <div className="p-2.5 rounded bg-rose-600/40 border border-rose-400 text-rose-200 shrink-0">
                1-bit Flag
              </div>
              <div className="p-2.5 rounded bg-slate-800 border border-rose-500/50 text-slate-200 flex-1">
                id (32 bits) [Bit 1..32]
              </div>
              <div className="p-2.5 rounded bg-rose-600/40 border border-rose-400 text-rose-200 shrink-0">
                1-bit Flag
              </div>
              <div className="p-2.5 rounded bg-amber-950/60 border-2 border-dashed border-rose-400 text-amber-200 flex-1">
                ⚠ price [Bit 34..65] STRADDLES 64-BIT WORD BOUNDARY!
              </div>
            </div>
            <p className="text-xs text-rose-300 font-mono">{t.m4.badDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
