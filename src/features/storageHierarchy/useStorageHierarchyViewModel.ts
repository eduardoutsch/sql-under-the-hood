import { useState } from 'react';
import type { Locale } from '../../core/i18n';
import { pickChatBubblePlacement } from '../../core/queryPipeline';
import {
  type BufferFetchStatus,
  computeByteOffset,
  fetchBufferPage,
  getHardwareTiers,
} from '../../core/storageHierarchy';

/**
 * ViewModel for Module 2 (Storage Hierarchy & Buffer Pool Simulator).
 * Encapsulates pulse animation toggle, page size selection, Buffer Pool state,
 * and floating message bubble state.
 */
export function useStorageHierarchyViewModel(lang: Locale) {
  const [pulsing, setPulsing] = useState(true);
  const [pageSizeKb, setPageSizeKb] = useState(8);
  const [bufferPool, setBufferPool] = useState<number[]>([0, 3]);
  const [activePage, setActivePage] = useState(2);
  const [lastStatus, setLastStatus] = useState<BufferFetchStatus | null>(null);
  const [fetchSeq, setFetchSeq] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [bubblePlacement] = useState(() => pickChatBubblePlacement());

  const tiers = getHardwareTiers(lang);
  const byteOffset = computeByteOffset(activePage, pageSizeKb);

  return {
    pulsing,
    pageSizeKb,
    bufferPool,
    activePage,
    lastStatus,
    fetchSeq,
    notesOpen,
    bubblePlacement,
    tiers,
    byteOffset,
    toggleNotes: () => setNotesOpen((prev) => !prev),
    togglePulsing: () => setPulsing((prev) => !prev),
    setPageSizeKb,
    fetchPage: (pageNum: number) => {
      setActivePage(pageNum);
      const result = fetchBufferPage(bufferPool, pageNum);
      setLastStatus(result.status);
      setBufferPool(result.nextPool);
      setFetchSeq((s) => s + 1);
    },
    clearBufferPool: () => {
      setBufferPool([]);
      setLastStatus(null);
    },
  };
}
