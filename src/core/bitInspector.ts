/**
 * Pure domain logic for Module 4 (Null Bitmaps & 64-Bit CPU Word Alignment).
 * Computes live t_bits bitmap strings and byte payload sizes when columns are NULL.
 */

export interface TupleColumn {
  key: string;
  type: string;
  val: string;
  hex: string;
  bytes: number;
  isNull: boolean;
}

export const INITIAL_COLUMNS: readonly TupleColumn[] = [
  { key: 'id', type: 'INT32 (4B)', val: '42', hex: '2A 00 00 00', bytes: 4, isNull: false },
  { key: 'price', type: 'INT32 (4B)', val: '150', hex: '96 00 00 00', bytes: 4, isNull: false },
  { key: 'name', type: 'VARCHAR (4B)', val: "'Ana'", hex: '09 41 6E 61', bytes: 4, isNull: false },
  { key: 'coupon', type: 'INT32 (4B)', val: '20', hex: '14 00 00 00', bytes: 4, isNull: true },
];

/**
 * Toggle the NULL state of a column at targetIndex immutably.
 */
export function toggleColumnNull(
  columns: readonly TupleColumn[],
  targetIndex: number
): TupleColumn[] {
  if (targetIndex < 0 || targetIndex >= columns.length) {
    return [...columns];
  }
  return columns.map((col, idx) =>
    idx === targetIndex ? { ...col, isNull: !col.isNull } : col
  );
}

/**
 * Build the binary Null Bitmap string ('1' = present, '0' = NULL).
 */
export function computeNullBitmap(columns: readonly TupleColumn[]): string {
  return columns.map((col) => (col.isNull ? '0' : '1')).join('');
}

/**
 * Sum the payload bytes of all non-NULL columns (NULLs occupy 0 bytes in payload).
 */
export function computePayloadBytes(columns: readonly TupleColumn[]): number {
  return columns.reduce((acc, col) => acc + (col.isNull ? 0 : col.bytes), 0);
}
