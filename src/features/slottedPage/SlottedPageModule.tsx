import { Plus, Zap } from 'lucide-react';
import type { TranslationBundle } from '../../core/i18n';
import { PAGE_SIZE_BYTES } from '../../core/slottedPage';
import { useSlottedPageViewModel } from './useSlottedPageViewModel';

export interface SlottedPageModuleProps {
  t: TranslationBundle;
}

/**
 * Dumb View for Module 3 (8 KB PostgreSQL Slotted Page Layout).
 * Delegates tuple state, metrics, and compaction to `useSlottedPageViewModel`.
 */
export function SlottedPageModule({ t }: SlottedPageModuleProps) {
  const vm = useSlottedPageViewModel();
  const { pdLower, pdUpper, freeBytes } = vm.metrics;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs sm:text-sm">
          <span className="px-2.5 py-1 rounded bg-[#1C1917] text-amber-300 font-bold">
            {t.m3.pageSizeBadge}
          </span>
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-950 font-semibold border border-stone-900">
            pd_lower: {pdLower} B
          </span>
          <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-950 font-semibold border border-stone-900">
            pd_upper: {pdUpper} B
          </span>
          <span className="px-2 py-1 rounded bg-amber-100 text-amber-950 font-semibold border border-stone-900">
            {t.m3.freeLabel}: {freeBytes} B
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={vm.insert}
            disabled={vm.isPageFull}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] text-white font-semibold text-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {t.m3.insertBtn}
          </button>
          <button
            onClick={vm.compact}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-amber-300 hover:bg-amber-400 text-stone-950 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] font-semibold text-sm transition cursor-pointer"
          >
            <Zap className="w-4 h-4" /> {t.m3.compactBtn}
          </button>
        </div>
      </div>

      <div className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-xl p-5 space-y-5 relative overflow-hidden">
        <div className="flex justify-between text-xs font-mono font-semibold text-stone-700">
          <span>Byte 0x0000 (0)</span>
          <span>{t.m3.clickDelete}</span>
          <span>Byte 0x2000 (8192)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="p-3 rounded-lg bg-[#1C1917] border-2 border-stone-900 font-mono text-xs shrink-0 text-amber-200">
            <div className="font-bold">PageHeaderData</div>
            <div className="text-xs text-stone-300">24 Bytes [0..23]</div>
          </div>

          {vm.tuples.map((item) => (
            <button
              key={item.slot}
              onMouseEnter={() => vm.setHoveredSlot(item.slot)}
              onMouseLeave={() => vm.setHoveredSlot(null)}
              onClick={() => vm.markDead(item.slot)}
              className={`p-2.5 rounded-lg border-2 border-stone-900 font-mono text-left transition-all cursor-pointer ${
                !item.alive
                  ? 'bg-rose-100 text-rose-900 line-through opacity-80'
                  : vm.hoveredSlot === item.slot
                  ? 'bg-blue-200 shadow-[2px_2px_0px_#1c1917] -translate-y-0.5 text-stone-950'
                  : 'bg-blue-50 text-blue-950'
              }`}
            >
              <div className="text-xs font-bold">{t.m3.slotPrefix} #{item.slot} (4B)</div>
              <div className="text-xs text-stone-800">
                {item.alive ? `off:${item.offset} len:${item.len}` : 'LP_DEAD (0)'}
              </div>
            </button>
          ))}

          <div className="flex items-center text-blue-900 font-mono font-bold text-xs sm:text-sm px-2 animate-pulse">
            pd_lower →
          </div>
        </div>

        <div className="py-6 rounded-lg border-2 border-dashed border-stone-900/50 bg-[#EFE9DC]/60 text-center font-mono">
          <div className="text-xs sm:text-sm text-stone-800 uppercase tracking-widest font-semibold">{t.m3.freeDesc}</div>
          <div className="text-lg font-bold text-stone-900 mt-1">
            {freeBytes} Bytes ({((freeBytes / PAGE_SIZE_BYTES) * 100).toFixed(1)}%)
          </div>
          {vm.isPageFull && <div className="text-sm text-[#B83B1D] font-bold mt-1">{t.m3.pageFull}</div>}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex items-center text-emerald-900 font-mono font-bold text-xs sm:text-sm px-2 animate-pulse">
            ← pd_upper
          </div>

          {[...vm.tuples].reverse().map((item) => (
            <button
              key={item.slot}
              onMouseEnter={() => vm.setHoveredSlot(item.slot)}
              onMouseLeave={() => vm.setHoveredSlot(null)}
              onClick={() => vm.markDead(item.slot)}
              className={`p-3 rounded-lg border-2 border-stone-900 font-mono text-left transition-all cursor-pointer ${
                !item.alive
                  ? 'bg-rose-100 text-rose-900 opacity-80'
                  : vm.hoveredSlot === item.slot
                  ? 'bg-emerald-200 shadow-[2px_2px_0px_#1c1917] -translate-y-0.5 text-stone-950'
                  : 'bg-emerald-50 text-emerald-950'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-bold text-emerald-950">{t.m3.tuplePrefix} #{item.slot}</span>
                <span className="text-stone-700">@{item.offset}</span>
              </div>
              <div className="text-sm font-bold text-stone-900 mt-1">
                ('{item.name}', ${item.price})
              </div>
              <div className="text-xs text-stone-800 mt-0.5">
                {item.alive ? `${item.len}B HeapTuple` : t.m3.deadSpace}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm font-mono">
        <div className="p-3 rounded-lg bg-[#EFE9DC] border-2 border-stone-900 text-stone-900">
          {t.m3.headerDesc}
        </div>
        <div className="p-3 rounded-lg bg-blue-50 border-2 border-stone-900 text-blue-950">
          {t.m3.slotsDesc}
        </div>
        <div className="p-3 rounded-lg bg-emerald-50 border-2 border-stone-900 text-emerald-950">
          {t.m3.tuplesDesc}
        </div>
      </div>
    </div>
  );
}
