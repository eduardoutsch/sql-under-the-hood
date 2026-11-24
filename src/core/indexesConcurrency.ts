/**
 * Pure models and simulation data for Module 7:
 * B+Tree vs. Bitmap Indexes (+ implicit coercion trap), MVCC Concurrency (Redo/Undo),
 * and Execution Plans (EXPLAIN + Join algorithms).
 */

export type IndexStrategy = 'btree' | 'bitmap' | 'fullscan';

export interface IndexComparisonCase {
  id: string;
  labelPt: string;
  labelEn: string;
  sql: string;
  winningStrategy: IndexStrategy;
  complexity: string;
  pagesRead: number;
  totalPages: number;
  explanationPt: string;
  explanationEn: string;
}

export const INDEX_CASES: IndexComparisonCase[] = [
  {
    id: 'pk-lookup',
    labelPt: 'Alta Seletividade (cod = \'10\')',
    labelEn: 'High Selectivity (cod = \'10\')',
    sql: "SELECT * FROM cliente WHERE cod = '10';",
    winningStrategy: 'btree',
    complexity: 'O(log N)',
    pagesRead: 4,
    totalPages: 1000,
    explanationPt:
      'Tipos iguais (VARCHAR2 = VARCHAR2): o motor desce 3 níveis da B+Tree até o ROWID e lê apenas 1 página de 8 KB da tabela.',
    explanationEn:
      'Matching types (VARCHAR2 = VARCHAR2): the engine traverses 3 B+Tree levels to the ROWID and reads just 1 table 8 KB page.',
  },
  {
    id: 'implicit-coercion',
    labelPt: 'Coerção Implícita (cod = 10)',
    labelEn: 'Implicit Coercion (cod = 10)',
    sql: 'SELECT * FROM cliente WHERE cod = 10;',
    winningStrategy: 'fullscan',
    complexity: 'O(N)',
    pagesRead: 1000,
    totalPages: 1000,
    explanationPt:
      'Armadilha! Comparar VARCHAR2 com NUMBER força TO_NUMBER(cod) em cada linha. O índice ordenado textualmente (\'1\', \'10\', \'2\') é inutilizado!',
    explanationEn:
      'Trap! Comparing VARCHAR2 to NUMBER forces TO_NUMBER(cod) on every row. The text-sorted index (\'1\', \'10\', \'2\') becomes unusable!',
  },
  {
    id: 'low-cardinality',
    labelPt: 'Baixa Cardinalidade (AND / OR)',
    labelEn: 'Low Cardinality (AND / OR)',
    sql: "SELECT COUNT(*) FROM cliente WHERE ativo = 'S' AND uf = 'MG';",
    winningStrategy: 'bitmap',
    complexity: 'O(N / 64) bitwise',
    pagesRead: 18,
    totalPages: 1000,
    explanationPt:
      'Colunas com poucos valores distintos (S/N, UF): Índices Bitmap fazem AND/OR bit a bit diretamente na CPU antes de tocar nas páginas de 8 KB.',
    explanationEn:
      'Low-cardinality columns (Y/N, State): Bitmap indexes execute bitwise AND/OR directly in CPU registers before touching 8 KB heap pages.',
  },
];

export interface JoinAlgorithmInfo {
  id: 'nested' | 'hash' | 'merge';
  name: string;
  cost: string;
  ideaPt: string;
  ideaEn: string;
  whenPt: string;
  whenEn: string;
}

export const JOIN_ALGORITHMS: JoinAlgorithmInfo[] = [
  {
    id: 'nested',
    name: 'Nested Loops Join',
    cost: 'O(N · M) / O(N log M)',
    ideaPt: 'Dois laços: para cada tupla da tabela externa, busca correspondência na interna (ideal com índice B+Tree).',
    ideaEn: 'Two loops: for each outer row, probes the inner table (fast when an inner B+Tree index exists).',
    whenPt: 'Tabela externa pequena + índice B+Tree na chave de junção interna.',
    whenEn: 'Small outer table + B+Tree index on the inner join key.',
  },
  {
    id: 'hash',
    name: 'Hash Join',
    cost: 'O(N + M)',
    ideaPt: 'Constrói tabela Hash na RAM (PGA) com a menor relação e varre a maior testando colisões.',
    ideaEn: 'Builds an in-RAM (PGA) hash table on the smaller relation and probes it while scanning the larger one.',
    whenPt: 'Tabelas grandes unidas por igualdade (=) sem índice útil.',
    whenEn: 'Large tables joined on equality (=) without a selective index.',
  },
  {
    id: 'merge',
    name: 'Sort-Merge Join',
    cost: 'O(N log N + M log M)',
    ideaPt: 'Ordena ambas as relações pela chave e avança dois ponteiros simultaneamente em uma única passada.',
    ideaEn: 'Sorts both inputs on the join key and advances two pointers in lockstep in a single pass.',
    whenPt: 'Entradas já ordenadas por índice ou junções por intervalo (<, >, BETWEEN).',
    whenEn: 'Inputs already sorted by an index or range joins (<, >, BETWEEN).',
  },
];

export interface ExplainStep {
  id: number;
  op: string;
  target: string;
  rows: number;
  cost: number;
  kind: 'access' | 'filter' | 'join' | 'root';
  detailPt: string;
  detailEn: string;
}

export const EXPLAIN_PLAN_STEPS: ExplainStep[] = [
  {
    id: 3,
    op: 'INDEX RANGE SCAN',
    target: 'IX_MAT',
    rows: 40,
    cost: 1,
    kind: 'access',
    detailPt: 'Folha 1: acessa diretamente o índice B+Tree (access) para localizar os ROWIDs dos alunos.',
    detailEn: 'Leaf 1: probes the B+Tree index directly (access) to locate matching student ROWIDs.',
  },
  {
    id: 2,
    op: 'TABLE ACCESS FULL',
    target: 'DEPTO',
    rows: 2,
    cost: 3,
    kind: 'access',
    detailPt: "Folha 2: varre a tabela pequena DEPTO e aplica filter(d.ativo = 'S') linha a linha.",
    detailEn: "Leaf 2: scans small table DEPTO and applies filter(d.ativo = 'S') row by row.",
  },
  {
    id: 1,
    op: 'HASH JOIN',
    target: 'a.cod_depto = d.cod',
    rows: 40,
    cost: 6,
    kind: 'join',
    detailPt: 'Nó pai puxa tuplas dos filhos sob demanda (FETCH/Next), monta hash de DEPTO na PGA e casa com ALUNO.',
    detailEn: 'Parent node pulls tuples on demand (FETCH/Next), hashes DEPTO in PGA, and probes with ALUNO.',
  },
  {
    id: 0,
    op: 'SELECT STATEMENT',
    target: 'ROOT',
    rows: 40,
    cost: 6,
    kind: 'root',
    detailPt: 'Raiz da árvore entrega as 40 tuplas resultantes ao cliente.',
    detailEn: 'Tree root streams the 40 resulting tuples back to the client.',
  },
];
