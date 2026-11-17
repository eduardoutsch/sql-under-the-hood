# 02_core_domain_part1

> Generated snapshot containing 6 file(s).

## Table of Contents

- [`src/core/appNavigation.ts`](#src-core-appnavigation-ts)
- [`src/core/bitInspector.ts`](#src-core-bitinspector-ts)
- [`src/core/i18n.ts`](#src-core-i18n-ts)
- [`src/core/queryPipeline.ts`](#src-core-querypipeline-ts)
- [`src/core/README.md`](#src-core-readme-md)
- [`src/core/slottedPage.ts`](#src-core-slottedpage-ts)

---

## `src/core/appNavigation.ts`

````typescript
/**
 * Pure navigation helpers for the 5-module SQL seminar shell.
 * Keeps index bounds and progress bar math deterministic and decoupled from React/DOM.
 */

export const MODULE_COUNT = 5;

/**
 * Clamp a module index within [0, MODULE_COUNT - 1].
 */
export function clampModuleIndex(index: number): number {
  if (index < 0) return 0;
  if (index >= MODULE_COUNT) return MODULE_COUNT - 1;
  return index;
}

/**
 * Step the active module index by delta (-1 or +1) within valid bounds.
 */
export function stepModuleIndex(current: number, delta: number): number {
  return clampModuleIndex(current + delta);
}

/**
 * Compute seminar progress percentage in [0, 100].
 */
export function computeProgressPct(activeIndex: number, totalModules: number): number {
  if (totalModules <= 0) return 0;
  return ((activeIndex + 1) / totalModules) * 100;
}
````

## `src/core/bitInspector.ts`

````typescript
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
````

## `src/core/i18n.ts`

````typescript
/**
 * Bilingual (PT-BR default, EN secondary) translation dictionary and locale helpers.
 * Centralizing copy in a declarative lookup table keeps UI components free of inline
 * branching and guarantees parity between Portuguese and English seminar views.
 */

export type Locale = 'pt' | 'en';

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_STORAGE_KEY = 'sql_hood_locale';

/**
 * Resolve initial locale from persisted storage: defaults to EN unless PT was saved.
 */
export function resolveInitialLocale(stored: string | null): Locale {
  return stored === 'pt' ? 'pt' : DEFAULT_LOCALE;
}

export interface ModuleMeta {
  id: number;
  short: string;
  title: string;
}

export interface PipelineStageCopy {
  name: string;
  desc: string;
}

export interface TranslationBundle {
  brandSub: string;
  brandTitle: string;
  labSubtitle: string;
  keyboardNav: string;
  presMode: string;
  exitPres: string;
  themeDark: string;
  themeLight: string;
  cfDeploy: string;
  moduleLabel: string;
  prevMod: string;
  nextMod: string;
  play: string;
  pause: string;
  step: string;
  reset: string;
  modules: ModuleMeta[];
  m1: {
    subtitle: string;
    sqlInput: string;
    lexerBanner: string;
    astHeading: string;
    rewriterHeading: string;
    candidatePlanA: string;
    costLabel: string;
    seqFormula: string;
    seqIo: string;
    idxSelectivity: string;
    idxSpeedup: string;
    tupleDeforming: string;
    unrolledOffsets: string;
    exprEval: string;
    threeInstructions: string;
    stageNotesLabel: string;
    stages: PipelineStageCopy[];
    seqScan: string;
    idxScan: string;
    winner: string;
    sqliteMode: string;
    jitMode: string;
    stepVm: string;
    jitDesc: string;
  };
  m2: {
    subtitle: string;
    startPulse: string;
    humanScale: string;
    realLatency: string;
    bufferSimTitle: string;
    pageSizeLabel: string;
    fetchBtn: string;
    evictBtn: string;
    hit: string;
    miss: string;
    formula: string;
    diskHeapTitle: string;
    clickToFetch: string;
    pagePrefix: string;
    bufferPoolTitle: string;
    emptyFrame: string;
    pinnedPtr: string;
  };
  m3: {
    subtitle: string;
    insertBtn: string;
    compactBtn: string;
    headerDesc: string;
    slotsDesc: string;
    freeDesc: string;
    tuplesDesc: string;
    pageFull: string;
    clickDelete: string;
    pageSizeBadge: string;
    freeLabel: string;
    slotPrefix: string;
    tuplePrefix: string;
    deadSpace: string;
    legendSectionLabel: string;
  };
  m4: {
    subtitle: string;
    toggleNull: string;
    bitmapTitle: string;
    bitmapExplain: string;
    alignTitle: string;
    goodAlign: string;
    badAlign: string;
    goodDesc: string;
    badDesc: string;
    payloadSize: string;
    nullBitmapSuffix: string;
    zeroBytesStored: string;
    nullBitmapHeader: string;
    bytePrefix: string;
    flag1Bit: string;
    straddlesWarning: string;
  };
  m5: {
    subtitle: string;
    volcanoTitle: string;
    vectorTitle: string;
    simdWidth: string;
    cycles: string;
    overhead: string;
    cacheLocality: string;
    poor: string;
    tight: string;
    selVector: string;
    rowPerCall: string;
    dispatchTax: string;
    rowsLabel: string;
    lanesPerClk: string;
    branchlessSimd: string;
  };
  home: {
    badge: string;
    headline: string;
    intro: string;
    startBtn: string;
    whatIsSqlTitle: string;
    whatIsSqlPoints: { title: string; body: string }[];
    howToUseTitle: string;
    howToUseSteps: { title: string; body: string }[];
    exploreModulesTitle: string;
  };
}

export const I18N: Record<Locale, TranslationBundle> = {
  pt: {
    brandSub: 'Do SELECT ao Silício',
    brandTitle: 'SQL por Baixo dos Panos',
    labSubtitle: 'LABORATÓRIO DE INTERNOS SQL',
    keyboardNav: '← / → Navegação por Teclado',
    presMode: 'Modo Apresentação',
    exitPres: 'Sair da Apresentação',
    themeDark: 'Modo Escuro',
    themeLight: 'Modo Claro',
    cfDeploy: 'Deploy Cloudflare',
    moduleLabel: 'Módulo',
    prevMod: 'Módulo Anterior',
    nextMod: 'Próximo Módulo',
    play: 'Executar',
    pause: 'Pausar',
    step: 'Passo',
    reset: 'Reiniciar',
    modules: [
      { id: 0, short: '1. Pipeline SQL', title: 'Pipeline de Consulta: Do Texto ao Código Nativo' },
      { id: 1, short: '2. Hierarquia & Buffer', title: 'Hierarquia de Memória & Simulador de Buffer Pool' },
      { id: 2, short: '3. Slotted Page 8KB', title: 'Layout Físico: Slotted Page de 8 KB (PostgreSQL)' },
      { id: 3, short: '4. Bits & Alinhamento', title: 'Inspetor de Bits: Null Bitmaps & Alinhamento de CPU' },
      { id: 4, short: '5. Volcano vs SIMD', title: 'Corrida na CPU: Iterador Volcano vs. Execução Vetorizada SIMD' },
    ],
    m1: {
      subtitle:
        'Veja uma consulta SQL virar tokens, árvore sintática, plano de execução e código nativo.',
      sqlInput: 'ENTRADA SQL',
      lexerBanner: 'Texto SQL → Scanner Léxico → Tokens',
      astHeading: 'Árvore Sintática (SelectStmt)',
      rewriterHeading: 'Árvore Reescrita (Catálogo + Filtro)',
      candidatePlanA: 'PLANO CANDIDATO A',
      costLabel: 'Custo',
      seqFormula: '1.000 páginas × seq_page_cost(1.0) + 80.000 linhas × cpu_tuple_cost(0.01)',
      seqIo: 'E/S: 8.000 KB lidos do Heap File',
      idxSelectivity: 'B-Tree profundidade=3 + 4,2% das linhas > 100',
      idxSpeedup: '43x mais rápido • Vai direto nas páginas folha',
      tupleDeforming: 'Leitura de Tupla',
      unrolledOffsets: 'Offsets Nativos',
      exprEval: 'Avaliação do Filtro',
      threeInstructions: '3 Instruções de CPU',
      stageNotesLabel: 'Mensagem',
      stages: [
        {
          name: 'Lexer / Tokenizer',
          desc: 'Separa o texto SQL em tokens (palavras-chave, nomes, operadores e números).',
        },
        {
          name: 'Parser (AST)',
          desc: 'Confere a gramática e monta a Árvore Sintática (AST) na memória.',
        },
        {
          name: 'Rewriter',
          desc: 'Expande Views e ajusta os filtros da consulta.',
        },
        {
          name: 'Optimizer (CBO)',
          desc: 'Calcula o custo de disco e CPU para escolher o plano mais rápido.',
        },
        {
          name: 'Execução (VM / JIT)',
          desc: 'Gera bytecode VDBE (SQLite) ou código nativo com LLVM JIT (PostgreSQL).',
        },
      ],
      seqScan: 'Sequential Scan (Tabela Inteira)',
      idxScan: 'B-Tree Index Scan (idx_users_price)',
      winner: 'PLANO ESCOLHIDO (MENOR CUSTO)',
      sqliteMode: 'SQLite VDBE Bytecode VM',
      jitMode: 'PostgreSQL LLVM JIT Nativo',
      stepVm: 'sqlite3_step()',
      jitDesc:
        'O LLVM compila a leitura da tupla e o filtro WHERE price > 100 direto para instruções da CPU.',
    },
    m2: {
      subtitle:
        'A CPU trabalha em nanossegundos; o disco, em milissegundos. Veja como o Buffer Pool evita ir ao disco toda hora.',
      startPulse: 'Disparar Pulso de Leitura',
      humanScale: 'Escala Humana (1 ns = 1 s)',
      realLatency: 'Latência Real',
      bufferSimTitle: 'Simulador de Buffer Pool & Heap File',
      pageSizeLabel: 'Tamanho da Página',
      fetchBtn: 'Buscar Página',
      evictBtn: 'Limpar Buffer Pool',
      hit: 'CACHE HIT (100 ns na DRAM)',
      miss: 'PAGE FAULT / MISS (Lendo do disco...)',
      formula: 'Offset no Arquivo',
      diskHeapTitle: 'ARQUIVO HEAP EM DISCO (users.heap)',
      clickToFetch: 'Clique para buscar',
      pagePrefix: 'Pág',
      bufferPoolTitle: 'BUFFER POOL EM MEMÓRIA (3 Frames LRU)',
      emptyFrame: 'VAZIO',
      pinnedPtr: 'Pont. Fixado ✓',
    },
    m3: {
      subtitle:
        'Tabelas usam páginas fixas de 8 KB: ponteiros crescem da esquerda e tuplas crescem da direita.',
      insertBtn: 'Inserir Tupla',
      compactBtn: 'VACUUM / Compactar',
      headerDesc: 'PageHeaderData (24B): LSN, checksum, pd_lower, pd_upper',
      slotsDesc: 'ItemIdData (4B cada): Ponteiros [offset, length] crescendo →',
      freeDesc: 'Espaço Livre',
      tuplesDesc: ' ← Tuplas crescendo do fim (8192) para o início',
      pageFull: 'Página cheia. Remova uma tupla ou compacte.',
      clickDelete: 'Clique em um slot ou tupla para apagar (tupla morta)',
      pageSizeBadge: 'Tamanho da Página: 8192 B',
      freeLabel: 'Livre',
      slotPrefix: 'Slot',
      tuplePrefix: 'Tupla',
      deadSpace: 'Espaço Morto (Aguardando VACUUM)',
      legendSectionLabel: 'Anatomia da Página de 8 KB (Legenda)',
    },
    m4: {
      subtitle:
        'Veja como o banco guarda campos NULL sem gastar espaço extra nem quebrar o alinhamento de 64 bits.',
      toggleNull: 'Alternar Valor / NULL',
      bitmapTitle: 'Header Centralizado: Bitmap de Nulos (1 bit por coluna)',
      bitmapExplain: '1 = Tem valor | 0 = NULL (Colunas NULL ocupam 0 bytes no payload)',
      alignTitle: 'Alinhamento de 64-bit (8 Bytes) na CPU',
      goodAlign: 'Bitmap Centralizado (Alinhado)',
      badAlign: 'Flag de 1-bit por Coluna (Desalinhado)',
      goodDesc: 'Inteiros caem em múltiplos de 4/8 bytes. A CPU lê em 1 ciclo.',
      badDesc:
        'Um bit de flag antes da coluna desloca os campos seguintes e exige leituras extras da CPU.',
      payloadSize: 'Tamanho do Payload',
      nullBitmapSuffix: '+ 1B Bitmap de Nulos',
      zeroBytesStored: '(0 bytes gravados)',
      nullBitmapHeader: 't_bits[0] (Bitmap de Nulos)',
      bytePrefix: 'Byte',
      flag1Bit: 'Flag 1-bit',
      straddlesWarning: '⚠ price [Bit 34..65] ATRAVESSA A FRONTEIRA DE 64 BITS!',
    },
    m5: {
      subtitle:
        'Compare a leitura linha por linha (Volcano) com a execução em lote usando SIMD (AVX2 / AVX-512).',
      volcanoTitle: 'Modelo Iterador Volcano (Linha por Linha)',
      vectorTitle: 'Execução Vetorizada + SIMD',
      simdWidth: 'Largura do Registrador',
      cycles: 'Ciclos de CPU Estimados',
      overhead: 'Custo de Interpretação / Dispatch',
      cacheLocality: 'Localidade de Cache L1',
      poor: 'Baixa (Tuplas inteiras)',
      tight: 'Alta (Buffer colunar contíguo)',
      selVector: 'Selection Vector (Índices aprovados sem copiar memória)',
      rowPerCall: '[1 linha/chamada]',
      dispatchTax: '~65% Custo de Dispatch',
      rowsLabel: 'Linhas',
      lanesPerClk: 'pistas/clk',
      branchlessSimd: 'SIMD sem Desvios',
    },
    home: {
      badge: 'BEM-VINDO',
      headline: 'Entenda como o banco de dados lê suas perguntas.',
      intro:
        'Não precisa entender de programação. Acompanhe o caminho de uma consulta SQL até o processador.',
      startBtn: 'Começar pelo Módulo 1',
      whatIsSqlTitle: 'O que é SQL e o que ele faz?',
      whatIsSqlPoints: [
        {
          title: 'Um arquivo organizado',
          body: 'Um banco de dados funciona como uma planilha com linhas e colunas salva no computador.',
        },
        {
          title: 'A linguagem das perguntas',
          body: 'SQL é a linguagem que você usa para pedir dados, como "mostre produtos acima de R$ 100" ou "salve este cliente".',
        },
        {
          title: 'O trabalho por trás',
          body: 'Para responder rápido, o banco lê o pedido, acha onde os dados estão no disco e filtra tudo na memória.',
        },
      ],
      howToUseTitle: 'Como usar este site (Tutorial rápido)',
      howToUseSteps: [
        {
          title: '1. Escolha um módulo no topo',
          body: 'As abas de 1 a 5 mostram cada etapa, do texto em SQL até os bits na memória.',
        },
        {
          title: '2. Clique nos botões para testar',
          body: 'Clique em Executar, Passo, Buscar Página ou Inserir Tupla para ver o que acontece.',
        },
        {
          title: '3. Abra os painéis fechados',
          body: 'Clique nas barras com seta para abrir ou fechar mais detalhes.',
        },
        {
          title: '4. Troque idioma ou tela cheia',
          body: 'No topo à direita, dá para trocar o idioma ou usar o Modo Apresentação.',
        },
      ],
      exploreModulesTitle: 'Módulos interativos (clique para abrir)',
    },
  },
  en: {
    brandSub: 'From SELECT to Silicon',
    brandTitle: 'SQL Under the Hood',
    labSubtitle: 'SQL INTERNALS LAB',
    keyboardNav: '← / → Keyboard Navigation',
    presMode: 'Presentation Mode',
    exitPres: 'Exit Presentation',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    cfDeploy: 'Cloudflare Deploy',
    moduleLabel: 'Module',
    prevMod: 'Previous Module',
    nextMod: 'Next Module',
    play: 'Play',
    pause: 'Pause',
    step: 'Step',
    reset: 'Reset',
    modules: [
      { id: 0, short: '1. Query Pipeline', title: 'The Query Pipeline: From SQL Text to Native Code' },
      { id: 1, short: '2. Storage & Buffer', title: 'Storage Hierarchy & Buffer Pool Simulator' },
      { id: 2, short: '3. 8KB Slotted Page', title: 'Physical Storage: 8 KB Slotted Page (PostgreSQL)' },
      { id: 3, short: '4. Bits & Alignment', title: 'Bit-Level Inspector: Null Bitmaps & Word Alignment' },
      { id: 4, short: '5. Volcano vs SIMD', title: 'CPU Execution Race: Volcano Iterator vs. Vectorized SIMD' },
    ],
    m1: {
      subtitle:
        'See how a SQL query turns into tokens, a syntax tree, an execution plan, and machine code.',
      sqlInput: 'SQL INPUT',
      lexerBanner: 'SQL Text → Lexical Scanner → Tokens',
      astHeading: 'Syntax Tree (SelectStmt)',
      rewriterHeading: 'Rewritten Tree (Catalog + Filter)',
      candidatePlanA: 'CANDIDATE PLAN A',
      costLabel: 'Cost',
      seqFormula: '1,000 pages × seq_page_cost(1.0) + 80,000 rows × cpu_tuple_cost(0.01)',
      seqIo: 'I/O: 8,000 KB read from Heap File',
      idxSelectivity: 'B-Tree depth=3 + 4.2% of rows > 100',
      idxSpeedup: '43x faster • Jumps straight to leaf pages',
      tupleDeforming: 'Tuple Reading',
      unrolledOffsets: 'Native Offsets',
      exprEval: 'Filter Eval',
      threeInstructions: '3 CPU Instructions',
      stageNotesLabel: 'Message',
      stages: [
        {
          name: 'Lexer / Tokenizer',
          desc: 'Splits the SQL text into tokens (keywords, names, operators, and numbers).',
        },
        {
          name: 'Parser (AST)',
          desc: 'Checks SQL grammar and builds the Syntax Tree (AST) in memory.',
        },
        {
          name: 'Rewriter',
          desc: 'Expands views and normalizes query filters.',
        },
        {
          name: 'Optimizer (CBO)',
          desc: 'Estimates disk and CPU cost to pick the fastest plan.',
        },
        {
          name: 'Execution (VM / JIT)',
          desc: 'Generates VDBE bytecode (SQLite) or native code via LLVM JIT (PostgreSQL).',
        },
      ],
      seqScan: 'Sequential Scan (Full Table)',
      idxScan: 'B-Tree Index Scan (idx_users_price)',
      winner: 'WINNING PLAN (LOWEST COST)',
      sqliteMode: 'SQLite VDBE Bytecode VM',
      jitMode: 'PostgreSQL LLVM Native JIT',
      stepVm: 'sqlite3_step()',
      jitDesc:
        'LLVM compiles tuple reading and WHERE price > 100 straight into CPU instructions.',
    },
    m2: {
      subtitle:
        'CPUs run in nanoseconds while disks take milliseconds. See how the Buffer Pool avoids disk reads.',
      startPulse: 'Trigger Read Pulse',
      humanScale: 'Human Scale (1 ns = 1 sec)',
      realLatency: 'Real Latency',
      bufferSimTitle: 'Buffer Pool & Disk Heap File Simulator',
      pageSizeLabel: 'Page Size',
      fetchBtn: 'Fetch Page',
      evictBtn: 'Clear Buffer Pool',
      hit: 'CACHE HIT (100 ns from DRAM!)',
      miss: 'PAGE FAULT / MISS (Reading from Disk...)',
      formula: 'File Byte Offset',
      diskHeapTitle: 'DISK HEAP FILE (users.heap)',
      clickToFetch: 'Click to Fetch',
      pagePrefix: 'Page',
      bufferPoolTitle: 'MEMORY BUFFER POOL (3 Frames LRU)',
      emptyFrame: 'EMPTY',
      pinnedPtr: 'Pinned ptr ✓',
    },
    m3: {
      subtitle:
        'Tables use fixed 8 KB pages: pointers grow from the left and tuples grow from the right.',
      insertBtn: 'Insert Tuple',
      compactBtn: 'VACUUM / Compact',
      headerDesc: 'PageHeaderData (24B): LSN, checksum, pd_lower, pd_upper',
      slotsDesc: 'ItemIdData (4B each): [offset, length] array growing →',
      freeDesc: 'Free Space',
      tuplesDesc: ' ← Tuples growing backward from byte 8192',
      pageFull: 'Page full! Delete a tuple or compact space.',
      clickDelete: 'Click any slot pointer or tuple block to delete it',
      pageSizeBadge: 'Page Size: 8192 B',
      freeLabel: 'Free',
      slotPrefix: 'Slot',
      tuplePrefix: 'Tuple',
      deadSpace: 'Dead Space (Awaiting VACUUM)',
      legendSectionLabel: '8 KB Page Anatomy (Legend)',
    },
    m4: {
      subtitle:
        'See how databases store NULL values without wasting space or breaking 64-bit alignment.',
      toggleNull: 'Toggle Value / NULL',
      bitmapTitle: 'Centralized Header: Null Bitmap (1 bit per column)',
      bitmapExplain: '1 = Value present | 0 = NULL (NULL columns take 0 bytes in the payload)',
      alignTitle: '64-Bit CPU Word Alignment (8-Byte Boundaries)',
      goodAlign: 'Centralized Bitmap (Word-Aligned)',
      badAlign: '1-Bit Flag per Column (Unaligned)',
      goodDesc: 'Integers land on 4/8-byte boundaries. The CPU reads them in 1 cycle.',
      badDesc:
        'A 1-bit flag before each column shifts later fields and forces extra CPU reads.',
      payloadSize: 'Payload Size',
      nullBitmapSuffix: '+ 1B Null Bitmap',
      zeroBytesStored: '(0 bytes stored)',
      nullBitmapHeader: 't_bits[0] (Null Bitmap)',
      bytePrefix: 'Byte',
      flag1Bit: '1-bit Flag',
      straddlesWarning: '⚠ price [Bit 34..65] STRADDLES 64-BIT WORD BOUNDARY!',
    },
    m5: {
      subtitle:
        'Compare row-by-row execution (Volcano) with batch SIMD execution (AVX2 / AVX-512).',
      volcanoTitle: 'Volcano Iterator Model (Row-at-a-Time)',
      vectorTitle: 'Vectorized + SIMD Execution',
      simdWidth: 'SIMD Register Width',
      cycles: 'Simulated CPU Cycles',
      overhead: 'Interpreter / Dispatch Tax',
      cacheLocality: 'L1 Cache Locality',
      poor: 'Poor (Row tuple hopping)',
      tight: 'Tight (Contiguous column buffer)',
      selVector: 'Selection Vector (Surviving row indices — zero data copying)',
      rowPerCall: '[1 row/call]',
      dispatchTax: '~65% Dispatch Tax',
      rowsLabel: 'Rows',
      lanesPerClk: 'lanes/clk',
      branchlessSimd: 'Branchless SIMD',
    },
    home: {
      badge: 'WELCOME',
      headline: 'See how a database answers your questions.',
      intro:
        'You do not need a computer science background. Follow step by step how a SQL question travels to the computer processor.',
      startBtn: 'Start at Module 1',
      whatIsSqlTitle: 'What is SQL and what does it do?',
      whatIsSqlPoints: [
        {
          title: 'An organized filing cabinet',
          body: 'Think of a database as a large spreadsheet with rows and columns saved on a computer.',
        },
        {
          title: 'The language of questions',
          body: 'SQL is the language used to ask that cabinet for data, like "show items over $100" or "save this customer".',
        },
        {
          title: 'The work underneath',
          body: 'Before answering, the database reads your sentence, picks the shortest path on disk, and uses memory and the CPU to filter rows.',
        },
      ],
      howToUseTitle: 'How to use this site (Quick tutorial)',
      howToUseSteps: [
        {
          title: '1. Pick a module at the top',
          body: 'Tabs 1 to 5 show each step, from SQL text down to bits in memory.',
        },
        {
          title: '2. Click buttons to experiment',
          body: 'Use Play, Step, Fetch Page, or Insert Tuple to watch the engine react live.',
        },
        {
          title: '3. Open collapsed panels',
          body: 'Click any bar with an arrow to expand or collapse extra explanations anytime.',
        },
        {
          title: '4. Switch language or fullscreen',
          body: 'At the top right, toggle PT-BR / EN or turn on Presentation Mode.',
        },
      ],
      exploreModulesTitle: 'Interactive modules (click to open)',
    },
  },
};

/**
 * Retrieve the translation bundle for a given locale.
 */
export function getTranslations(locale: Locale): TranslationBundle {
  return I18N[locale];
}

/**
 * Toggle between Portuguese (PT-BR) and English (EN) locales.
 */
export function toggleLocale(current: Locale): Locale {
  return current === 'pt' ? 'en' : 'pt';
}
````

## `src/core/queryPipeline.ts`

````typescript
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

export interface ChatBubblePlacement {
  side: 'left' | 'right';
  alignClass: string;
}

const ALIGN_CLASSES = ['lg:top-16', 'lg:top-1/2 lg:-translate-y-1/2', 'lg:bottom-4'] as const;

/**
 * Pick a side (left/right) and vertical alignment for the stage Message chat bubble.
 */
export function pickChatBubblePlacement(
  sideRand: number = Math.random(),
  alignRand: number = Math.random()
): ChatBubblePlacement {
  const side = sideRand < 0.5 ? 'left' : 'right';
  const alignIdx = Math.min(ALIGN_CLASSES.length - 1, Math.floor(alignRand * ALIGN_CLASSES.length));
  return { side, alignClass: ALIGN_CLASSES[alignIdx] };
}
````

## `src/core/README.md`

````markdown
# `src/core/` — Domain Logic

Deterministic domain modules with zero React, DOM, or timer dependencies.

- `i18n.ts`: PT-BR (default) and EN translation dictionary and locale helpers.
- `appNavigation.ts`: Module index bounds and seminar progress calculations.
- `queryPipeline.ts`: SQL token list, localized VDBE opcodes, and stage/PC transitions.
- `storageHierarchy.ts`: Hardware latency tiers, heap-file byte offset formula, and Buffer Pool page lookup.
- `slottedPage.ts`: 8 KB slotted page metrics (`pd_lower`, `pd_upper`), tuple insertion, dead-tuple marking, and `VACUUM` compaction.
- `bitInspector.ts`: Null bitmap formatting and payload byte summation.
- `volcanoSimd.ts`: Volcano vs. SIMD race progression, cycle estimates, and Selection Vector extraction.
````

## `src/core/slottedPage.ts`

````typescript
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
````
