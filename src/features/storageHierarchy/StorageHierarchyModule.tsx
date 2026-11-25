import { Activity, HardDrive, Layers, Pause, Play } from 'lucide-react';
import { AccordionPanel } from '../../components/AccordionPanel';
import { StageMessageBubble } from '../../components/StageMessageBubble';
import type { Locale, TranslationBundle } from '../../core/i18n';
import { useStorageHierarchyViewModel } from './useStorageHierarchyViewModel';

export interface StorageHierarchyModuleProps {
  t: TranslationBundle;
  lang: Locale;
}

/**
 * Dumb View for Module 2 (Storage Hierarchy & Buffer Pool Simulator).
 * Projects state and dispatches user actions via `useStorageHierarchyViewModel`.
 */
export function StorageHierarchyModule({ t, lang }: StorageHierarchyModuleProps) {
  const vm = useStorageHierarchyViewModel(lang);

  return (
    <div className="space-y-6">
      <div className="relative bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-xl p-3.5 sm:p-5 space-y-4 sm:space-y-5">
        <StageMessageBubble
          label={t.m1.stageNotesLabel}
          badge="02"
          title={t.m2.messageTitle}
          body={t.m2.messageBody}
          open={vm.notesOpen}
          placement={vm.bubblePlacement}
          onToggle={vm.toggleNotes}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-stone-900">{t.m2.bufferSimTitle}</h3>
            <p className="text-xs sm:text-sm font-mono text-stone-800 mt-0.5">
              {t.m2.formula}: Offset = {t.m2.pagePrefix}#{vm.activePage} × {vm.pageSizeKb * 1024} bytes ={' '}
              <span className="text-[#B83B1D] font-bold">{vm.byteOffset.toLocaleString()} bytes</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm text-stone-800 font-mono font-semibold">{t.m2.pageSizeLabel}:</span>
            {[4, 8].map((sz) => (
              <button
                key={sz}
                onClick={() => vm.setPageSizeKb(sz)}
                className={`px-3 py-1 rounded-md text-xs sm:text-sm font-mono border-2 border-stone-900 cursor-pointer ${
                  vm.pageSizeKb === sz
                    ? 'bg-[#D94E28] text-white font-bold shadow-[2px_2px_0px_#1c1917]'
                    : 'bg-[#EFE9DC] text-stone-900'
                }`}
              >
                {sz} KB
              </button>
            ))}
            <button
              onClick={vm.clearBufferPool}
              className="px-3 py-1 rounded-md text-xs sm:text-sm font-mono bg-rose-100 hover:bg-rose-200 text-rose-950 font-semibold border-2 border-stone-900 cursor-pointer"
            >
              {t.m2.evictBtn}
            </button>
          </div>
        </div>

        {vm.lastStatus && (
          <div
            key={vm.fetchSeq}
            className={`animate-springIn px-3 sm:px-4 py-2.5 rounded-lg font-mono text-xs sm:text-sm font-bold border-2 border-stone-900 flex flex-wrap items-center justify-between gap-2 ${
              vm.lastStatus === 'hit'
                ? 'bg-emerald-100 text-emerald-950'
                : 'bg-amber-100 text-amber-950'
            }`}
          >
            <span>
              {t.m2.pagePrefix} #{vm.activePage}: {vm.lastStatus === 'hit' ? t.m2.hit : t.m2.miss}
            </span>
            <span>{vm.lastStatus === 'hit' ? '~100 ns' : '~16,000 ns'}</span>
          </div>
        )}

        {vm.lastStatus === 'miss' && (
          <div className="h-1.5 w-full rounded-full animate-busFlow" aria-hidden="true" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#EFE9DC] border-2 border-stone-900 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs sm:text-sm font-mono text-stone-800">
              <span className="flex items-center gap-1.5 text-[#B83B1D] font-bold">
                <HardDrive className="w-4 h-4" /> {t.m2.diskHeapTitle}
              </span>
              <span className="font-semibold">{t.m2.clickToFetch}</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((pg) => {
                const inRam = vm.bufferPool.includes(pg);
                const selected = vm.activePage === pg;
                return (
                  <button
                    key={pg}
                    onClick={() => vm.fetchPage(pg)}
                    className={`p-2 sm:p-3 rounded-lg border-2 border-stone-900 font-mono text-center transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#D94E28] text-white shadow-[2px_2px_0px_#1c1917] -translate-y-0.5'
                        : inRam
                        ? 'bg-emerald-100 text-emerald-950'
                        : 'bg-[#FFFDF8] text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Pág #{pg}</div>
                    <div className={`text-xs mt-1 ${selected ? 'text-amber-100' : 'text-stone-700'}`}>
                      @{pg * vm.pageSizeKb}KB
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-[#1C1917] border-2 border-stone-900 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs sm:text-sm font-mono">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Layers className="w-4 h-4" /> {t.m2.bufferPoolTitle}
              </span>
              <span className="text-stone-200">{vm.bufferPool.length}/3 frames</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {[0, 1, 2].map((frameIdx) => {
                const pageId = vm.bufferPool[frameIdx];
                const occupied = pageId !== undefined;
                return (
                  <div
                    key={frameIdx}
                    className={`p-3 rounded-lg border-2 font-mono text-center transition-all ${
                      occupied
                        ? 'animate-springIn bg-stone-800 border-amber-400 text-amber-100'
                        : 'bg-stone-900/60 border-dashed border-stone-600 text-stone-300'
                    }`}
                  >
                    <div className="text-xs text-stone-300">Frame [{frameIdx}]</div>
                    <div className="text-sm font-bold mt-1">
                      {occupied ? `${t.m2.pagePrefix} #${pageId}` : t.m2.emptyFrame}
                    </div>
                    {occupied && <div className="text-xs text-emerald-300 mt-0.5">{t.m2.pinnedPtr}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AccordionPanel
        title={`${t.m2.realLatency} vs. ${t.m2.humanScale}`}
        badge="L1 → HDD"
        defaultOpen={false}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <span className="text-sm text-stone-700 flex items-center gap-2 font-semibold">
              <Activity className="w-4 h-4 text-[#D94E28]" />
              {t.m2.humanScale}
            </span>
            <button
              onClick={vm.togglePulsing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EFE9DC] hover:bg-stone-200 text-xs sm:text-sm font-mono font-semibold text-stone-900 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] cursor-pointer"
            >
              {vm.pulsing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {vm.pulsing ? t.pause : t.m2.startPulse}
            </button>
          </div>

          <div className="space-y-3">
            {vm.tiers.map((tier) => (
              <div key={tier.name} className="bg-[#EFE9DC]/60 border-2 border-stone-900/80 rounded-lg p-3">
                <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm font-mono mb-2 gap-2">
                  <span className={`font-bold ${tier.text}`}>{tier.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-stone-800 font-semibold">{tier.real}</span>
                    <span className="px-2.5 py-0.5 rounded bg-[#1C1917] text-amber-300 font-semibold">
                      ⏱ {tier.human}
                    </span>
                  </div>
                </div>
                <div className="relative h-3.5 bg-stone-200 rounded-full overflow-hidden border border-stone-900">
                  <div className={`h-full opacity-30 ${tier.color} ${tier.barWidth}`} />
                  {vm.pulsing && (
                    <div
                      style={{ animation: `pulseRace ${tier.animDurationSec}s linear infinite` }}
                      className={`absolute top-0 bottom-0 w-8 rounded-full ${tier.color}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AccordionPanel>
    </div>
  );
}
