/**
 * Bilingual (PT-BR default, EN secondary) translation dictionary and locale helpers.
 * Centralizing copy in a declarative lookup table keeps UI components free of inline
 * branching and guarantees parity between Portuguese and English seminar views.
 */

export type Locale = 'pt' | 'en';

export const DEFAULT_LOCALE: Locale = 'pt';

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
  deployModal: {
    title: string;
    close: string;
    steps: string[];
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
        'Acompanhe como uma string SQL bruta atravessa o analisador léxico, vira árvore sintática, passa pelo otimizador baseado em custo e executa como Bytecode ou código nativo via LLVM JIT.',
      sqlInput: 'ENTRADA SQL',
      lexerBanner: 'Stream de Bytes ASCII/UTF-8 → Scanner Léxico (Flex) → Lista de Tokens',
      astHeading: 'Árvore Sintática Abstrata (Nó SelectStmt)',
      rewriterHeading: 'Árvore de Consulta Reescrita (Catálogo pg_class + Predicado Normalizado)',
      candidatePlanA: 'PLANO CANDIDATO A',
      costLabel: 'Custo',
      seqFormula: '1.000 páginas × seq_page_cost(1.0) + 80.000 linhas × cpu_tuple_cost(0.01)',
      seqIo: 'E/S: 8.000 KB lidos do Heap File',
      idxSelectivity: 'Profundidade B-Tree=3 + Seletividade estimada (4,2% das linhas > 100)',
      idxSpeedup: '43x mais rápido • Saltando direto para páginas folha relevantes',
      tupleDeforming: 'Decodificação de Tupla',
      unrolledOffsets: 'Offsets Nativos Desenrolados',
      exprEval: 'Avaliação de Expressão',
      threeInstructions: '3 Instruções de CPU',
      stages: [
        {
          name: 'Lexer / Tokenizer',
          desc: 'Fatia a string SQL bruta em tokens atômicos classificados (palavras-chave, identificadores, operadores e literais).',
        },
        {
          name: 'Parser (AST)',
          desc: 'Valida a gramática SQL e constrói a Árvore Sintática Abstrata (Query Tree) na memória.',
        },
        {
          name: 'Rewriter',
          desc: 'Aplica regras de reescrita, expande Views (ex: active_users -> users WHERE active = true) e normaliza predicados.',
        },
        {
          name: 'Optimizer (CBO)',
          desc: 'Estima cardinalidade usando estatísticas e compara custos de E/S + CPU entre planos físicos.',
        },
        {
          name: 'Execução (VM / JIT)',
          desc: 'Compila o plano vencedor em Bytecode VDBE (SQLite) ou código de máquina x86_64 via LLVM JIT (PostgreSQL).',
        },
      ],
      seqScan: 'Sequential Scan (Varredura Completa)',
      idxScan: 'B-Tree Index Scan (idx_users_price)',
      winner: 'PLANO ESCOLHIDO (MENOR CUSTO)',
      sqliteMode: 'SQLite VDBE Bytecode VM',
      jitMode: 'PostgreSQL LLVM JIT Nativo',
      stepVm: 'sqlite3_step()',
      jitDesc:
        'O LLVM compila em tempo de execução a decodificação binária da tupla (Tuple Deforming) e o filtro WHERE price > 100 diretamente em instruções nativas da CPU, eliminando chamadas virtuais e branches de interpretação.',
    },
    m2: {
      subtitle:
        'A CPU opera em nanossegundos, mas o disco leva milissegundos. Veja a escala humana de latência e como o Buffer Pool evita idas caras ao armazenamento.',
      startPulse: 'Disparar Pulso de Leitura',
      humanScale: 'Escala Humana (1 ns = 1 s)',
      realLatency: 'Latência Real',
      bufferSimTitle: 'Simulador de Buffer Pool & Heap File',
      pageSizeLabel: 'Tamanho da Página',
      fetchBtn: 'Buscar Página',
      evictBtn: 'Limpar Buffer Pool',
      hit: 'CACHE HIT (100 ns na DRAM!)',
      miss: 'PAGE FAULT / MISS (Buscando no Disco via Offset...)',
      formula: 'Deslocamento Físico no Arquivo',
      diskHeapTitle: 'ARQUIVO HEAP EM DISCO (users.heap)',
      clickToFetch: 'Clique para Buscar',
      pagePrefix: 'Pág',
      bufferPoolTitle: 'BUFFER POOL EM MEMÓRIA (3 Frames LRU)',
      emptyFrame: 'VAZIO',
      pinnedPtr: 'Pont. Fixado ✓',
    },
    m3: {
      subtitle:
        'Bancos relacionais não gravam linhas soltas no disco: eles organizam blocos fixos de 8 KB onde ponteiros crescem da esquerda para a direita e tuplas crescem do fim para o início.',
      insertBtn: 'Inserir Tupla',
      compactBtn: 'VACUUM / Compactar',
      headerDesc: 'PageHeaderData (24B): LSN, checksum, pd_lower, pd_upper',
      slotsDesc: 'ItemIdData (4B cada): Ponteiros [offset, length] crescendo →',
      freeDesc: 'Espaço Livre Contíguo',
      tuplesDesc: ' ← Tuplas binárias crescendo do fim (8192) para o início',
      pageFull: 'Página cheia! Remova uma tupla ou compacte.',
      clickDelete: 'Clique em um slot ou tupla para deletar (tupla morta)',
      pageSizeBadge: 'Tamanho da Página: 8192 B',
      freeLabel: 'Livre',
      slotPrefix: 'Slot',
      tuplePrefix: 'Tupla',
      deadSpace: 'Espaço Morto (Aguardando VACUUM)',
    },
    m4: {
      subtitle:
        'Como representar NULL sem desperdiçar bytes ou quebrar o alinhamento de palavras de 64 bits da CPU? Ative ou anule colunas abaixo e inspecione os bits reais.',
      toggleNull: 'Alternar Valor / NULL',
      bitmapTitle: 'Header Centralizado: Bitmap de Nulos (1 bit por coluna)',
      bitmapExplain: '1 = Valor Presente | 0 = NULL (Colunas NULL ocupam ZERO bytes no payload da tupla!)',
      alignTitle: 'Alinhamento de Palavra de 64-bit (8 Bytes) na CPU',
      goodAlign: 'Bitmap Centralizado / Placeholder Colunar (Alinhado)',
      badAlign: 'Flag de 1-bit por Atributo (Desalinhado - NUNCA FAÇA ISSO!)',
      goodDesc: 'Inteiros começam em múltiplos exatos de 4/8 bytes. A CPU lê em 1 único ciclo de memória.',
      badDesc:
        'Inserir 1 bit de flag antes de cada coluna desloca os campos seguintes, atravessando fronteiras de Cache Line / Word e exigindo múltiplos shifts e leituras da CPU.',
      payloadSize: 'Tamanho do Payload',
      nullBitmapSuffix: '+ 1B Bitmap de Nulos',
      zeroBytesStored: '(0 bytes gravados!)',
      nullBitmapHeader: 't_bits[0] (Bitmap de Nulos)',
      bytePrefix: 'Byte',
      flag1Bit: 'Flag 1-bit',
      straddlesWarning: '⚠ price [Bit 34..65] ATRAVESSA A FRONTEIRA DE 64 BITS!',
    },
    m5: {
      subtitle:
        'Compare o modelo clássico linha-a-linha (Volcano) contra motores analíticos modernos (ClickHouse / DuckDB) usando registradores vetoriais AVX2 e AVX-512.',
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
    deployModal: {
      title: 'Como publicar no Cloudflare Pages + Vite',
      close: 'Fechar',
      steps: [
        '1. Build de produção: npm run build (gera os arquivos estáticos em dist/).',
        '2. Testes automatizados: npm test e npm run test:coverage.',
        '3. Deploy via CLI: npx wrangler pages deploy dist (usando wrangler.toml).',
        '4. Ou conecte o repositório GitHub ao Cloudflare Pages (Build command: npm run build | Output directory: dist).',
      ],
    },
  },
  en: {
    brandSub: 'From SELECT to Silicon',
    brandTitle: 'SQL Under the Hood',
    labSubtitle: 'SQL INTERNALS LAB',
    keyboardNav: '← / → Keyboard Navigation',
    presMode: 'Presentation Mode',
    exitPres: 'Exit Presentation',
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
        'Trace how raw SQL text flows through the lexer, forms an Abstract Syntax Tree, gets optimized by cost, and executes as VDBE Bytecode or LLVM JIT machine code.',
      sqlInput: 'SQL INPUT',
      lexerBanner: 'ASCII/UTF-8 Byte Stream → Lexical Scanner (Flex) → Token List',
      astHeading: 'Abstract Syntax Tree (SelectStmt Node)',
      rewriterHeading: 'Rewritten Query Tree (Catalog OIDs Bound + Normalized Predicate)',
      candidatePlanA: 'CANDIDATE PLAN A',
      costLabel: 'Cost',
      seqFormula: '1,000 pages × seq_page_cost(1.0) + 80,000 rows × cpu_tuple_cost(0.01)',
      seqIo: 'I/O: 8,000 KB read from Heap File',
      idxSelectivity: 'B-Tree depth=3 + Estimated selectivity (4.2% of rows > 100)',
      idxSpeedup: '43x faster • Jumping directly to relevant leaf pages',
      tupleDeforming: 'Tuple Deforming',
      unrolledOffsets: 'Unrolled Native Offsets',
      exprEval: 'Expr Eval',
      threeInstructions: '3 CPU Instructions',
      stages: [
        {
          name: 'Lexer / Tokenizer',
          desc: 'Splits the raw SQL string into classified atomic tokens (keywords, identifiers, operators, literals).',
        },
        {
          name: 'Parser (AST)',
          desc: 'Validates SQL grammar and constructs the in-memory Abstract Syntax / Query Tree.',
        },
        {
          name: 'Rewriter',
          desc: 'Applies rule-based rewrites, expands views (e.g., active_users -> users WHERE active = true), and normalizes predicates.',
        },
        {
          name: 'Optimizer (CBO)',
          desc: 'Estimates cardinality from table statistics and compares I/O + CPU costs across candidate physical plans.',
        },
        {
          name: 'Execution (VM / JIT)',
          desc: 'Compiles the winning plan into SQLite VDBE Bytecode or native x86_64 machine code via PostgreSQL LLVM JIT.',
        },
      ],
      seqScan: 'Sequential Scan (Full Table Heap Scan)',
      idxScan: 'B-Tree Index Scan (idx_users_price)',
      winner: 'WINNING PLAN (LOWEST COST)',
      sqliteMode: 'SQLite VDBE Bytecode VM',
      jitMode: 'PostgreSQL LLVM Native JIT',
      stepVm: 'sqlite3_step()',
      jitDesc:
        'LLVM compiles binary Tuple Deforming and the WHERE price > 100 predicate evaluation into native machine instructions at runtime, eliminating virtual function calls and interpreter branches.',
    },
    m2: {
      subtitle:
        'CPUs operate in nanoseconds while disks take milliseconds. Experience the human time-scale of hardware latency and simulate Buffer Pool page fetches.',
      startPulse: 'Trigger Read Pulse',
      humanScale: 'Human Scale (1 ns = 1 sec)',
      realLatency: 'Real Latency',
      bufferSimTitle: 'Buffer Pool & Disk Heap File Simulator',
      pageSizeLabel: 'Page Size',
      fetchBtn: 'Fetch Page',
      evictBtn: 'Clear Buffer Pool',
      hit: 'CACHE HIT (100 ns from DRAM!)',
      miss: 'PAGE FAULT / MISS (Reading Disk Offset...)',
      formula: 'Physical File Byte Offset',
      diskHeapTitle: 'DISK HEAP FILE (users.heap)',
      clickToFetch: 'Click to Fetch',
      pagePrefix: 'Page',
      bufferPoolTitle: 'MEMORY BUFFER POOL (3 Frames LRU)',
      emptyFrame: 'EMPTY',
      pinnedPtr: 'Pinned ptr ✓',
    },
    m3: {
      subtitle:
        'Relational engines organize tables into fixed 8 KB slotted pages where slot pointers grow left-to-right and binary tuples grow right-to-left from the end.',
      insertBtn: 'Insert Tuple',
      compactBtn: 'VACUUM / Compact',
      headerDesc: 'PageHeaderData (24B): LSN, checksum, pd_lower, pd_upper',
      slotsDesc: 'ItemIdData (4B each): [offset, length] array growing →',
      freeDesc: 'Contiguous Free Space',
      tuplesDesc: ' ← Binary Tuple Items growing backward from byte 8192',
      pageFull: 'Page full! Delete a tuple or compact space.',
      clickDelete: 'Click any slot pointer or tuple block to delete it',
      pageSizeBadge: 'Page Size: 8192 B',
      freeLabel: 'Free',
      slotPrefix: 'Slot',
      tuplePrefix: 'Tuple',
      deadSpace: 'Dead Space (Awaiting VACUUM)',
    },
    m4: {
      subtitle:
        'How do databases store NULLs without wasting space or breaking 64-bit CPU word alignment? Toggle column values below to inspect live bits and hex layouts.',
      toggleNull: 'Toggle Value / NULL',
      bitmapTitle: 'Centralized Header: Null Column Bitmap (1 bit per attribute)',
      bitmapExplain: '1 = Value Present | 0 = NULL (NULL columns consume ZERO bytes in the tuple data payload!)',
      alignTitle: '64-Bit CPU Word Alignment (8-Byte Boundaries)',
      goodAlign: 'Centralized Bitmap / Columnar Placeholder (Word-Aligned)',
      badAlign: 'Naive Per-Attribute 1-Bit Flag (Unaligned - DO NOT DO THIS!)',
      goodDesc: '32-bit integers land cleanly on 4/8-byte boundaries. The CPU fetches each field in a single aligned load.',
      badDesc:
        'Placing a 1-bit null flag inline shifts every subsequent attribute off byte/word boundaries, straddling cache lines and forcing bit-shifts.',
      payloadSize: 'Payload Size',
      nullBitmapSuffix: '+ 1B Null Bitmap',
      zeroBytesStored: '(0 bytes stored!)',
      nullBitmapHeader: 't_bits[0] (Null Bitmap)',
      bytePrefix: 'Byte',
      flag1Bit: '1-bit Flag',
      straddlesWarning: '⚠ price [Bit 34..65] STRADDLES 64-BIT WORD BOUNDARY!',
    },
    m5: {
      subtitle:
        'Race the classic row-at-a-time Volcano iterator against modern analytical vectorized execution (ClickHouse / DuckDB) powered by AVX2 & AVX-512 SIMD.',
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
    deployModal: {
      title: 'Deploy to Cloudflare Pages + Vite',
      close: 'Close',
      steps: [
        '1. Production build: npm run build (outputs static bundle to dist/).',
        '2. Automated tests: npm test and npm run test:coverage.',
        '3. Direct CLI deploy: npx wrangler pages deploy dist (configured via wrangler.toml).',
        '4. Or connect your GitHub repo to Cloudflare Pages (Build command: npm run build | Output directory: dist).',
      ],
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
