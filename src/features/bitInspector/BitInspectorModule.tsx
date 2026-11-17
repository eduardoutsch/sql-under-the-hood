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
            className={`p-4 rounded-xl border-2 border-stone-900 text-left transition-all cursor-pointer shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              col.isNull ? 'bg-amber-100' : 'bg-[#FFFDF8] hover:bg-[#EFE9DC]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-600 font-semibold">
                col[{idx}] • {col.type}
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold border border-stone-900 ${
                  col.isNull ? 'bg-amber-300 text-stone-950' : 'bg-emerald-200 text-emerald-950'
                }`}
              >
                bit={col.isNull ? '0' : '1'}
              </span>
            </div>
            <div className="text-base font-mono font-bold text-stone-900 mt-2">
              {col.key}:{' '}
              <span className={col.isNull ? 'text-[#B83B1D] italic' : 'text-blue-800'}>
                {col.isNull ? 'NULL' : col.val}
              </span>
            </div>
            <div className="text-[11px] font-mono text-stone-600 mt-1.5">
              Hex: {col.isNull ? '(0 bytes stored!)' : col.hex}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-stone-900">{t.m4.bitmapTitle}</h4>
            <p className="text-xs text-stone-600">{t.m4.bitmapExplain}</p>
          </div>
          <div className="font-mono text-xs font-bold px-3 py-1.5 rounded-md bg-emerald-100 border-2 border-stone-900 text-emerald-950">
            Payload Size: {vm.payloadBytes} Bytes (+ 1B Null Bitmap)
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-[#1C1917] p-4 rounded-lg border-2 border-stone-900 font-mono">
          <div className="p-3 rounded-md bg-stone-800 border-2 border-[#D94E28] text-center">
            <div className="text-[10px] text-amber-300 uppercase">t_bits[0] (Null Bitmap)</div>
            <div className="text-lg font-bold tracking-widest text-white mt-0.5">
              0000<span className="text-[#D94E28]">{vm.bitmapBits}</span>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-stone-400 hidden sm:block" />

          {vm.cols.map((col) =>
            col.isNull ? null : (
              <div
                key={col.key}
                className="p-3 rounded-md bg-stone-800 border border-stone-600 text-center"
              >
                <div className="text-[10px] text-emerald-400">
                  {col.key} ({col.bytes}B)
                </div>
                <div className="text-sm font-bold text-stone-100 mt-1">{col.hex}</div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="font-bold text-stone-900">{t.m4.alignTitle}</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => vm.setAlignMode('good')}
              className={`px-3 py-1.5 rounded-md border-2 border-stone-900 text-xs font-mono font-bold cursor-pointer ${
                vm.alignMode === 'good'
                  ? 'bg-emerald-700 text-white shadow-[2px_2px_0px_#1c1917]'
                  : 'bg-[#EFE9DC] text-stone-800'
              }`}
            >
              ✓ {t.m4.goodAlign}
            </button>
            <button
              onClick={() => vm.setAlignMode('bad')}
              className={`px-3 py-1.5 rounded-md border-2 border-stone-900 text-xs font-mono font-bold cursor-pointer ${
                vm.alignMode === 'bad'
                  ? 'bg-rose-700 text-white shadow-[2px_2px_0px_#1c1917]'
                  : 'bg-[#EFE9DC] text-stone-800'
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
                  className="p-3 rounded-md bg-emerald-100 border-2 border-stone-900 text-emerald-950"
                >
                  <div className="text-[10px] text-stone-600">Byte {b}</div>
                  <div className="font-bold mt-0.5">id[{b}]</div>
                </div>
              ))}
              {[4, 5, 6, 7].map((b) => (
                <div
                  key={b}
                  className="p-3 rounded-md bg-blue-100 border-2 border-stone-900 text-blue-950"
                >
                  <div className="text-[10px] text-stone-600">Byte {b}</div>
                  <div className="font-bold mt-0.5">price[{b - 4}]</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-emerald-900 font-mono font-semibold">{t.m4.goodDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-1 overflow-x-auto font-mono text-xs text-center pb-1">
              <div className="p-2.5 rounded bg-rose-700 border-2 border-stone-900 text-white font-bold shrink-0">
                1-bit Flag
              </div>
              <div className="p-2.5 rounded bg-[#EFE9DC] border-2 border-stone-900 text-stone-900 flex-1">
                id (32 bits) [Bit 1..32]
              </div>
              <div className="p-2.5 rounded bg-rose-700 border-2 border-stone-900 text-white font-bold shrink-0">
                1-bit Flag
              </div>
              <div className="p-2.5 rounded bg-amber-200 border-2 border-dashed border-rose-800 text-rose-950 font-bold flex-1">
                ⚠ price [Bit 34..65] STRADDLES 64-BIT WORD BOUNDARY!
              </div>
            </div>
            <p className="text-xs text-rose-900 font-mono font-semibold">{t.m4.badDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
