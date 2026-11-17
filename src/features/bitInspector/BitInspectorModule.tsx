import { ArrowRight } from 'lucide-react';
import { AccordionPanel } from '../../components/AccordionPanel';
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
  const maxBytes = vm.cols.reduce((acc, col) => acc + col.bytes, 0);
  const fillPct = maxBytes > 0 ? Math.round((vm.payloadBytes / maxBytes) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm sm:text-base font-semibold text-stone-800">{t.m4.clickPrompt}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vm.cols.map((col, idx) => (
            <button
              key={col.key}
              onClick={() => vm.toggleNull(idx)}
              className={`p-4 rounded-xl border-2 border-stone-900 text-left transition-all cursor-pointer shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                col.isNull ? 'bg-amber-100' : 'bg-[#FFFDF8] hover:bg-[#EFE9DC]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-stone-700 font-semibold">{col.type}</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold border border-stone-900 ${
                    col.isNull ? 'bg-amber-300 text-stone-950' : 'bg-emerald-200 text-emerald-950'
                  }`}
                >
                  {col.isNull ? t.m4.nullBadge : t.m4.presentBadge}
                </span>
              </div>
              <div className="text-base sm:text-lg font-mono font-bold text-stone-900 mt-2">
                {col.key}:{' '}
                <span className={col.isNull ? 'text-[#B83B1D] italic' : 'text-blue-900'}>
                  {col.isNull ? 'NULL' : col.val}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-stone-800 mt-2 pt-2 border-t border-stone-900/15">
                <span>bit={col.isNull ? '0' : '1'}</span>
                <span>{col.isNull ? t.m4.zeroBytesStored : col.hex}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AccordionPanel title={t.m4.bitmapTitle} badge="t_bits" defaultOpen={true}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs sm:text-sm text-stone-700">{t.m4.bitmapExplain}</p>
            <div className="font-mono text-xs sm:text-sm font-bold px-3 py-1.5 rounded-md bg-emerald-100 border-2 border-stone-900 text-emerald-950">
              {t.m4.payloadSize}: {vm.payloadBytes} Bytes ({t.m4.nullBitmapSuffix})
            </div>
          </div>

          <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden border border-stone-900">
            <div
              className="h-full bg-[#D94E28] transition-all duration-300"
              style={{ width: `${fillPct}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-[#1C1917] p-4 rounded-lg border-2 border-stone-900 font-mono">
            <div className="p-3 rounded-md bg-stone-800 border-2 border-[#D94E28] text-center">
              <div className="text-xs text-amber-300 uppercase">{t.m4.nullBitmapHeader}</div>
              <div className="text-lg font-bold tracking-widest text-white mt-0.5">
                0000<span className="text-[#D94E28]">{vm.bitmapBits}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1.5 text-[11px] text-stone-300">
                {vm.cols.map((col) => (
                  <span key={col.key}>
                    {col.key}:{col.isNull ? '0' : '1'}
                  </span>
                ))}
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-stone-300 hidden sm:block" />

            {vm.cols.map((col) =>
              col.isNull ? null : (
                <div
                  key={col.key}
                  className="animate-springIn p-3 rounded-md bg-stone-800 border border-stone-500 text-center"
                >
                  <div className="text-xs text-emerald-300">
                    {col.key} ({col.bytes}B)
                  </div>
                  <div className="text-sm font-bold text-stone-100 mt-1">{col.hex}</div>
                </div>
              )
            )}
          </div>
        </div>
      </AccordionPanel>

      <AccordionPanel title={t.m4.alignTitle} badge="64-BIT" defaultOpen={false}>
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">{t.m4.alignExplain}</p>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded bg-[#1C1917] text-amber-300 font-mono text-xs font-bold">
              {vm.alignMode === 'good' ? t.m4.oneReadLabel : t.m4.twoReadsLabel}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => vm.setAlignMode('good')}
                className={`px-3 py-1.5 rounded-md border-2 border-stone-900 text-xs sm:text-sm font-mono font-bold cursor-pointer ${
                  vm.alignMode === 'good'
                    ? 'bg-emerald-700 text-white shadow-[2px_2px_0px_#1c1917]'
                    : 'bg-[#EFE9DC] text-stone-900'
                }`}
              >
                ✓ {t.m4.goodAlign}
              </button>
              <button
                onClick={() => vm.setAlignMode('bad')}
                className={`px-3 py-1.5 rounded-md border-2 border-stone-900 text-xs sm:text-sm font-mono font-bold cursor-pointer ${
                  vm.alignMode === 'bad'
                    ? 'bg-rose-700 text-white shadow-[2px_2px_0px_#1c1917]'
                    : 'bg-[#EFE9DC] text-stone-900'
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
                    <div className="text-xs text-stone-700">{t.m4.bytePrefix} {b}</div>
                    <div className="font-bold mt-0.5">id[{b}]</div>
                  </div>
                ))}
                {[4, 5, 6, 7].map((b) => (
                  <div
                    key={b}
                    className="p-3 rounded-md bg-blue-100 border-2 border-stone-900 text-blue-950"
                  >
                    <div className="text-xs text-stone-700">{t.m4.bytePrefix} {b}</div>
                    <div className="font-bold mt-0.5">price[{b - 4}]</div>
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 font-mono font-semibold">{t.m4.goodDesc}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-1 overflow-x-auto font-mono text-xs sm:text-sm text-center pb-1">
                <div className="p-2.5 rounded bg-rose-700 border-2 border-stone-900 text-white font-bold shrink-0">
                  {t.m4.flag1Bit}
                </div>
                <div className="p-2.5 rounded bg-[#EFE9DC] border-2 border-stone-900 text-stone-900 flex-1">
                  id (32 bits) [Bit 1..32]
                </div>
                <div className="p-2.5 rounded bg-rose-700 border-2 border-stone-900 text-white font-bold shrink-0">
                  {t.m4.flag1Bit}
                </div>
                <div className="p-2.5 rounded bg-amber-200 border-2 border-dashed border-rose-800 text-rose-950 font-bold flex-1">
                  {t.m4.straddlesWarning}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-rose-950 font-mono font-semibold">{t.m4.badDesc}</p>
            </div>
          )}
        </div>
      </AccordionPanel>
    </div>
  );
}
