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
    messageTitle: string;
    messageBody: string;
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
    messageTitle: string;
    messageBody: string;
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
    clickPrompt: string;
    presentBadge: string;
    nullBadge: string;
    alignExplain: string;
    oneReadLabel: string;
    twoReadsLabel: string;
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
      messageTitle: 'Como o Buffer Pool funciona',
      messageBody:
        'Ler do disco é muito lento. O banco guarda as páginas mais usadas na memória RAM (Buffer Pool). Se a página já está na RAM, ele responde em 100 ns sem tocar no disco.',
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
      messageTitle: 'Por que usar Slotted Page?',
      messageBody:
        'Os ponteiros (Slot #) crescem da esquerda e os dados (Tupla #) crescem da direita. Assim o espaço livre fica todo junto no meio, e o VACUUM limpa linhas apagadas.',
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
      clickPrompt: 'Clique em qualquer coluna para alternar entre Valor e NULL:',
      presentBadge: 'Valor Salvo',
      nullBadge: 'NULL (0B)',
      alignExplain:
        'A CPU lê a memória em blocos de 8 bytes (64 bits). Campos alinhados cabem em 1 leitura; campos desalinhados cruzam blocos e exigem leituras extras.',
      oneReadLabel: '1 Leitura da CPU (Bloco de 8 Bytes)',
      twoReadsLabel: '2 Leituras da CPU (Cruza o bloco de 8 Bytes)',
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
      messageTitle: 'How the Buffer Pool works',
      messageBody:
        'Disk reads are slow. The database keeps hot 8 KB pages in RAM (Buffer Pool). If a page is already in RAM, it answers in 100 ns without touching the disk.',
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
      messageTitle: 'Why use a Slotted Page?',
      messageBody:
        'Line pointers (Slot #) grow from the left while row data (Tuple #) grows from the right. Free space stays together in the middle, and VACUUM reclaims deleted rows.',
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
      clickPrompt: 'Click any column below to switch between a saved value and NULL:',
      presentBadge: 'Saved Value',
      nullBadge: 'NULL (0B)',
      alignExplain:
        'The CPU reads memory in 8-byte (64-bit) chunks. Aligned fields fit in 1 read; unaligned fields cross chunk borders and need extra reads.',
      oneReadLabel: '1 CPU Read (8-Byte Chunk)',
      twoReadsLabel: '2 CPU Reads (Crosses 8-Byte Chunk)',
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
