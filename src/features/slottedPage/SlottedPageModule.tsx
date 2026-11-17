import { useState } from 'react';
import { Plus, Zap } from 'lucide-react';
import type { TranslationBundle } from '../../core/i18n';
import {
  compactSlottedPage,
  computePageMetrics,
  INITIAL_TUPLES,
  insertTuple,
  markTupleDead,
  MAX_TUPLES,
  PAGE_SIZE_BYTES,
  type SlottedTuple,
} from '../../core/slottedPage';

export interface SlottedPageModuleProps {
  t: TranslationBundle;
}

/**
 * Interactive visualizer for Module 3: 8 KB PostgreSQL Slotted Page layout,
 * forward-growing ItemIdData pointers, and backward-growing HeapTuples.
 */
export function SlottedPageModule({ t }: SlottedPageModuleProps) {
  const [tuples, setTuples] = useState<SlottedTuple[]>([...INITIAL_TUPLES]);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  const { pdLower, pdUpper, freeBytes } = computePageMetrics(tuples);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">
            Page Size: 8192 B
          </span>
          <span className="text-cyan-400">pd_lower: {pdLower} B</span>
          <span className="text-emerald-400">pd_upper: {pdUpper} B</span>
          <span className="text-amber-300">Free: {freeBytes} B</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTuples((prev) => insertTuple(prev))}
            disabled={tuples.length >= MAX_TUPLES}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {t.m3.insertBtn}
          </button>
          <button
            onClick={() => setTuples((prev) => compactSlottedPage(prev))}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            <Zap className="w-4 h-4" /> {t.m3.compactBtn}
          </button>
        </div>
      </div>

      <div className="bg-slate-900/90 border-2 border-slate-700 rounded-2xl p-5 space-y-5 relative overflow-hidden">
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>Byte 0x0000 (0)</span>
          <span>{t.m3.clickDelete}</span>
          <span>Byte 0x2000 (8192)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="p-3 rounded-xl bg-violet-950/70 border border-violet-400/60 font-mono text-xs shrink-0">
            <div className="font-bold text-violet-300">PageHeaderData</div>
            <div className="text-[10px] text-violet-200/80">24 Bytes [0..23]</div>
          </div>

          {tuples.map((item) => (
            <button
              key={item.slot}
              onMouseEnter={() => setHoveredSlot(item.slot)}
              onMouseLeave={() => setHoveredSlot(null)}
              onClick={() => setTuples((prev) => markTupleDead(prev, item.slot))}
              className={`p-2.5 rounded-xl border font-mono text-left transition-all cursor-pointer ${
                !item.alive
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-400 line-through opacity-70'
                  : hoveredSlot === item.slot
                  ? 'bg-cyan-500/30 border-cyan-300 scale-105 shadow-lg'
                  : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300'
              }`}
            >
              <div className="text-[10px] font-bold">Slot #{item.slot} (4B)</div>
              <div className="text-[10px] text-slate-300">
                {item.alive ? `off:${item.offset} len:${item.len}` : 'LP_DEAD (0)'}
              </div>
            </button>
          ))}

          <div className="flex items-center text-cyan-400 font-mono text-xs px-2 animate-pulse">
            pd_lower →
          </div>
        </div>

        <div className="py-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 text-center font-mono">
          <div className="text-xs text-slate-400 uppercase tracking-widest">{t.m3.freeDesc}</div>
          <div className="text-lg font-bold text-slate-200 mt-1">
            {freeBytes} Bytes ({((freeBytes / PAGE_SIZE_BYTES) * 100).toFixed(1)}%)
          </div>
          {tuples.length >= MAX_TUPLES && (
            <div className="text-xs text-amber-400 mt-1">{t.m3.pageFull}</div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex items-center text-emerald-400 font-mono text-xs px-2 animate-pulse">
            ← pd_upper
          </div>

          {[...tuples].reverse().map((item) => (
            <button
              key={item.slot}
              onMouseEnter={() => setHoveredSlot(item.slot)}
              onMouseLeave={() => setHoveredSlot(null)}
              onClick={() => setTuples((prev) => markTupleDead(prev, item.slot))}
              className={`p-3 rounded-xl border font-mono text-left transition-all cursor-pointer ${
                !item.alive
                  ? 'bg-rose-950/30 border-rose-500/30 text-rose-400/70 opacity-60'
                  : hoveredSlot === item.slot
                  ? 'bg-emerald-500/30 border-emerald-300 scale-105 shadow-lg'
                  : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[10px]">
                <span className="font-bold text-emerald-300">Tuple #{item.slot}</span>
                <span className="text-slate-400">@{item.offset}</span>
              </div>
              <div className="text-xs text-white mt-1">
                ('{item.name}', ${item.price})
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {item.alive ? `${item.len}B HeapTuple` : 'Dead Space (Awaiting VACUUM)'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-violet-500/30 text-violet-200">
          {t.m3.headerDesc}
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-cyan-200">
          {t.m3.slotsDesc}
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 text-emerald-200">
          {t.m3.tuplesDesc}
        </div>
      </div>
    </div>
  );
}
