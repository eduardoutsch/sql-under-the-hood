/**
 * Pure domain logic and static descriptors for Module 1 (SQL Query Pipeline).
 * Separates token classification, VDBE opcode tables, and stage/PC transitions
 * from React rendering and interval timers.
 */

import type { Locale } from './i18n';

export const PIPELINE_STAGE_COUNT = 5;

export interface SqlToken {
  text: string;
  type: 'KEYWORD' | 'IDENT' | 'PUNCT' | 'OPERATOR' | 'NUMBER';
  color: string;
}

export interface VdbeOpcode {
  addr: number;
  op: string;
  p1: number;
  p2: number;
  p3: number;
  comment: string;
}

const SQL_TOKENS: readonly SqlToken[] = [
  { text: 'SELECT', type: 'KEYWORD', color: 'text-[#B83B1D] border-stone-900 bg-[#FDE8E1]' },
  { text: 'id', type: 'IDENT', color: 'text-emerald-900 border-stone-900 bg-emerald-100' },
  { text: ',', type: 'PUNCT', color: 'text-stone-700 border-stone-900 bg-[#EFE9DC]' },
  { text: 'name', type: 'IDENT', color: 'text-emerald-900 border-stone-900 bg-emerald-100' },
  { text: 'FROM', type: 'KEYWORD', color: 'text-[#B83B1D] border-stone-900 bg-[#FDE8E1]' },
  { text: 'users', type: 'IDENT', color: 'text-blue-900 border-stone-900 bg-blue-100' },
  { text: 'WHERE', type: 'KEYWORD', color: 'text-[#B83B1D] border-stone-900 bg-[#FDE8E1]' },
  { text: 'price', type: 'IDENT', color: 'text-emerald-900 border-stone-900 bg-emerald-100' },
  { text: '>', type: 'OPERATOR', color: 'text-amber-900 border-stone-900 bg-amber-100' },
  { text: '100', type: 'NUMBER', color: 'text-rose-900 border-stone-900 bg-rose-100' },
];

const VDBE_OPCODES: Record<Locale, readonly VdbeOpcode[]> = {
  pt: [
    { addr: 0, op: 'Init', p1: 0, p2: 7, p3: 0, comment: 'Inicia programa bytecode' },
    { addr: 1, op: 'OpenRead', p1: 0, p2: 2, p3: 0, comment: 'Abre B-Tree da tabela users (root pág 2)' },
    { addr: 2, op: 'Rewind', p1: 0, p2: 6, p3: 0, comment: 'Posiciona cursor na 1ª tupla' },
    { addr: 3, op: 'Column', p1: 0, p2: 2, p3: 1, comment: 'Extrai col[2] (price) -> Reg[1]' },
    { addr: 4, op: 'Le', p1: 100, p2: 5, p3: 1, comment: 'Se Reg[1] <= 100, pula para Next (5)' },
    { addr: 5, op: 'ResultRow', p1: 2, p2: 2, p3: 0, comment: 'Devolve (id, name) para quem pediu' },
    { addr: 6, op: 'Next', p1: 0, p2: 3, p3: 0, comment: 'Avança cursor e volta p/ addr 3' },
    { addr: 7, op: 'Halt', p1: 0, p2: 0, p3: 0, comment: 'Fim do programa' },
  ],
  en: [
    { addr: 0, op: 'Init', p1: 0, p2: 7, p3: 0, comment: 'Start bytecode program' },
    { addr: 1, op: 'OpenRead', p1: 0, p2: 2, p3: 0, comment: 'Open users B-Tree (root page 2)' },
    { addr: 2, op: 'Rewind', p1: 0, p2: 6, p3: 0, comment: 'Move cursor to first tuple' },
    { addr: 3, op: 'Column', p1: 0, p2: 2, p3: 1, comment: 'Read col[2] (price) -> Reg[1]' },
    { addr: 4, op: 'Le', p1: 100, p2: 5, p3: 1, comment: 'If Reg[1] <= 100 jump to Next (5)' },
    { addr: 5, op: 'ResultRow', p1: 2, p2: 2, p3: 0, comment: 'Emit (id, name) row to caller!' },
    { addr: 6, op: 'Next', p1: 0, p2: 3, p3: 0, comment: 'Advance cursor, loop to addr 3' },
    { addr: 7, op: 'Halt', p1: 0, p2: 0, p3: 0, comment: 'Exit VM execution' },
  ],
};

/**
 * Return the classified SQL tokens for the seminar sample query.
 */
export function getSqlTokens(): readonly SqlToken[] {
  return SQL_TOKENS;
}

/**
 * Return localized SQLite VDBE opcodes for the given locale.
 */
export function getVdbeOpcodes(locale: Locale): readonly VdbeOpcode[] {
  return VDBE_OPCODES[locale];
}

/**
 * Advance the pipeline stage index, wrapping around after the final stage.
 */
export function advancePipelineStage(currentStage: number): number {
  return (currentStage + 1) % PIPELINE_STAGE_COUNT;
}

/**
 * Step the VDBE program counter forward with wrap-around.
 */
export function stepVmProgramCounter(currentPc: number, opcodeCount: number): number {
  if (opcodeCount <= 0) return 0;
  return (currentPc + 1) % opcodeCount;
}
