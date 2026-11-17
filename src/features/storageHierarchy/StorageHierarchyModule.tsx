import { useState } from 'react';
import { Activity, HardDrive, Layers, Pause, Play } from 'lucide-react';
import type { Locale, TranslationBundle } from '../../core/i18n';
import {
  type BufferFetchStatus,
  computeByteOffset,
  fetchBufferPage,
  getHardwareTiers,
} from '../../core/storageHierarchy';

export interface StorageHierarchyModuleProps {
  t: TranslationBundle;
  lang: Locale;
}

/**
 * Interactive visualizer for Module 2: Hardware latency scale and 3-frame
 * DRAM Buffer Pool + Disk Heap File byte-offset simulator.
 */
export function StorageHierarchyModule({ t, lang }: StorageHierarchyModuleProps) {
  const [pulsing, setPulsing] = useState(true);
  const [pageSizeKb, setPageSizeKb] = useState(8);
  const [bufferPool, setBufferPool] = useState<number[]>([0, 3]);
  const [activePage, setActivePage] = useState(2);
  const [lastStatus, setLastStatus] = useState<BufferFetchStatus | null>(null);

  const tiers = getHardwareTiers(lang);
  const byteOffset = computeByteOffset(activePage, pageSizeKb);

  const handleFetchPage = (pageNum: number) => {
    setActivePage(pageNum);
    const result = fetchBufferPage(bufferPool, pageNum);
    setLastStatus(result.status);
    setBufferPool(result.nextPool);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            {t.m2.realLatency} vs. {t.m2.humanScale}
          </h3>
          <button
            onClick={() => setPulsing((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 cursor-pointer"
          >
            {pulsing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {pulsing ? t.pause : t.m2.startPulse}
          </button>
        </div>

        <div className="space-y-3">
          {tiers.map((tier) => (
            <div key={tier.name} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
              <div className="flex flex-wrap items-center justify-between text-xs font-mono mb-2 gap-2">
                <span className={`font-bold ${tier.text}`}>{tier.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-slate-300">{tier.real}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300">
                    ⏱ {tier.human}
                  </span>
                </div>
              </div>
              <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className={`h-full opacity-25 ${tier.color} ${tier.barWidth}`} />
                {pulsing && (
                  <div
                    style={{ animation: `pulseRace ${tier.animDurationSec}s linear infinite` }}
                    className={`absolute top-0 bottom-0 w-8 rounded-full ${tier.color} shadow-[0_0_12px_currentColor]`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-100">{t.m2.bufferSimTitle}</h3>
            <p className="text-xs font-mono text-cyan-400 mt-0.5">
              {t.m2.formula}: Offset = Page#{activePage} × {pageSizeKb * 1024} bytes ={' '}
              <span className="text-amber-300 font-bold">{byteOffset.toLocaleString()} bytes</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">{t.m2.pageSizeLabel}:</span>
            {[4, 8].map((sz) => (
              <button
                key={sz}
                onClick={() => setPageSizeKb(sz)}
                className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer ${
                  pageSizeKb === sz ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {sz} KB
              </button>
            ))}
            <button
              onClick={() => {
                setBufferPool([]);
                setLastStatus(null);
              }}
              className="px-2.5 py-1 rounded text-xs font-mono bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 cursor-pointer"
            >
              {t.m2.evictBtn}
            </button>
          </div>
        </div>

        {lastStatus && (
          <div
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold border flex items-center justify-between ${
              lastStatus === 'hit'
                ? 'bg-emerald-950/50 border-emerald-400 text-emerald-300'
                : 'bg-amber-950/50 border-amber-400 text-amber-300'
            }`}
          >
            <span>
              Page #{activePage}: {lastStatus === 'hit' ? t.m2.hit : t.m2.miss}
            </span>
            <span>{lastStatus === 'hit' ? '~100 ns' : '~16,000 ns'}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <HardDrive className="w-4 h-4" /> DISK HEAP FILE (users.heap)
              </span>
              <span>Click to Fetch</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((pg) => {
                const inRam = bufferPool.includes(pg);
                const selected = activePage === pg;
                return (
                  <button
                    key={pg}
                    onClick={() => handleFetchPage(pg)}
                    className={`p-3 rounded-xl border font-mono text-center transition-all cursor-pointer ${
                      selected
                        ? 'border-cyan-400 bg-cyan-950/50 scale-105'
                        : inRam
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-200">Pág #{pg}</div>
                    <div className="text-[10px] text-slate-500 mt-1">@{pg * pageSizeKb}KB</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-violet-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-violet-400 font-bold">
                <Layers className="w-4 h-4" /> MEMORY BUFFER POOL (3 Frames LRU)
              </span>
              <span className="text-slate-400">{bufferPool.length}/3 frames</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((frameIdx) => {
                const pageId = bufferPool[frameIdx];
                const occupied = pageId !== undefined;
                return (
                  <div
                    key={frameIdx}
                    className={`p-3 rounded-xl border font-mono text-center transition-all ${
                      occupied
                        ? 'bg-violet-950/40 border-violet-400/60 text-violet-200'
                        : 'bg-slate-900/40 border-dashed border-slate-800 text-slate-600'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400">Frame [{frameIdx}]</div>
                    <div className="text-sm font-bold mt-1">{occupied ? `Page #${pageId}` : 'EMPTY'}</div>
                    {occupied && <div className="text-[10px] text-emerald-400 mt-0.5">Pinned ptr ✓</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
