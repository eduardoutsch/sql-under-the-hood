import { useState } from 'react';
import {
  computeNullBitmap,
  computePayloadBytes,
  INITIAL_COLUMNS,
  toggleColumnNull,
  type TupleColumn,
} from '../../core/bitInspector';

/**
 * ViewModel for Module 4 (Bit-Level Inspector: Null Bitmaps & Word Alignment).
 * Manages column nullability toggles and alignment mode selection.
 */
export function useBitInspectorViewModel() {
  const [cols, setCols] = useState<TupleColumn[]>([...INITIAL_COLUMNS]);
  const [alignMode, setAlignMode] = useState<'good' | 'bad'>('good');

  return {
    cols,
    alignMode,
    bitmapBits: computeNullBitmap(cols),
    payloadBytes: computePayloadBytes(cols),
    setAlignMode,
    toggleNull: (idx: number) => setCols((prev) => toggleColumnNull(prev, idx)),
  };
}
