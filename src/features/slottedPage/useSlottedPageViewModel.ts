import { useState } from 'react';
import { pickChatBubblePlacement } from '../../core/queryPipeline';
import {
  compactSlottedPage,
  computePageMetrics,
  INITIAL_TUPLES,
  insertTuple,
  markTupleDead,
  MAX_TUPLES,
  type SlottedTuple,
} from '../../core/slottedPage';

/**
 * ViewModel for Module 3 (8 KB PostgreSQL Slotted Page Layout).
 * Manages tuple list, hover highlight, page compaction, and message bubble state.
 */
export function useSlottedPageViewModel() {
  const [tuples, setTuples] = useState<SlottedTuple[]>([...INITIAL_TUPLES]);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [bubblePlacement] = useState(() => pickChatBubblePlacement());

  const metrics = computePageMetrics(tuples);
  const isPageFull = tuples.length >= MAX_TUPLES;

  return {
    tuples,
    hoveredSlot,
    metrics,
    isPageFull,
    notesOpen,
    bubblePlacement,
    toggleNotes: () => setNotesOpen((prev) => !prev),
    setHoveredSlot,
    insert: () => setTuples((prev) => insertTuple(prev)),
    markDead: (slot: number) => setTuples((prev) => markTupleDead(prev, slot)),
    compact: () => setTuples((prev) => compactSlottedPage(prev)),
  };
}
