/**
 * Pure domain logic for Module 3 (8 KB PostgreSQL Slotted Page Layout).
 * Models PageHeaderData (24B), ItemIdData line pointers (4B each) growing forward
 * via pd_lower, and HeapTuple items growing backward from byte 8192 via pd_upper.
 */

export const PAGE_SIZE_BYTES = 8192;
export const PAGE_HEADER_BYTES = 24;
export const SLOT_POINTER_BYTES = 4;
export const MAX_TUPLES = 7;

const SAMPLE_NAMES = ['Diego', 'Elena', 'Fabio', 'Gabi', 'Hugo', 'Iris'] as const;

export interface SlottedTuple {
  slot: number;
  name: string;
  price: number;
  len: number;
  offset: number;
  alive: boolean;
}

export interface PageMetrics {
  pdLower: number;
  pdUpper: number;
  freeBytes: number;
}

export const INITIAL_TUPLES: readonly SlottedTuple[] = [
  { slot: 1, name: 'Ana', price: 150, len: 48, offset: 8144, alive: true },
  { slot: 2, name: 'Bruno', price: 85, len: 52, offset: 8092, alive: true },
  { slot: 3, name: 'Carla', price: 320, len: 48, offset: 8044, alive: true },
];

/**
 * Compute pd_lower, pd_upper, and contiguous free space in bytes.
 */
export function computePageMetrics(tuples: readonly SlottedTuple[]): PageMetrics {
  const pdLower = PAGE_HEADER_BYTES + tuples.length * SLOT_POINTER_BYTES;
  const pdUpper =
    tuples.length > 0 ? Math.min(...tuples.map((item) => item.offset)) : PAGE_SIZE_BYTES;
  const freeBytes = Math.max(0, pdUpper - pdLower);
  return { pdLower, pdUpper, freeBytes };
}

/**
 * Append a new HeapTuple growing downward from pd_upper, unless MAX_TUPLES is reached.
 */
export function insertTuple(tuples: readonly SlottedTuple[]): SlottedTuple[] {
  if (tuples.length >= MAX_TUPLES) {
    return [...tuples];
  }
  const { pdUpper } = computePageMetrics(tuples);
  const nextSlot = tuples.length + 1;
  const len = 48;
  const newOffset = pdUpper - len;
  const name = SAMPLE_NAMES[tuples.length % SAMPLE_NAMES.length];
  const price = 90 + nextSlot * 35;
  return [...tuples, { slot: nextSlot, name, price, len, offset: newOffset, alive: true }];
}

/**
 * Mark a tuple slot as LP_DEAD without reclaiming its physical bytes yet.
 */
export function markTupleDead(
  tuples: readonly SlottedTuple[],
  slotNumber: number
): SlottedTuple[] {
  return tuples.map((item) =>
    item.slot === slotNumber ? { ...item, alive: false } : item
  );
}

/**
 * Reclaim dead-tuple space (VACUUM / page compaction) by packing alive tuples
 * contiguously from byte 8192 downward and renumbering slots.
 */
export function compactSlottedPage(tuples: readonly SlottedTuple[]): SlottedTuple[] {
  let cursor = PAGE_SIZE_BYTES;
  return tuples
    .filter((item) => item.alive)
    .map((item, idx) => {
      cursor -= item.len;
      return { ...item, slot: idx + 1, offset: cursor };
    });
}
