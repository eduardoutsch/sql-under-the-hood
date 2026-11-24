/**
 * Pure data and script-generation helpers for Module 6 (3-Engine SQL Terminal Playground).
 * Generates a self-bootstrapping Windows .bat launcher for terminal-sequel and provides
 * side-by-side dialect peculiarity examples for PostgreSQL, MySQL, and SQLite.
 */

export const TERMINAL_REPO_URL = 'https://github.com/eduardoutsch/terminal-sequel.git';
export const BOOTSTRAP_BAT_FILENAME = 'setup-terminal-sequel.bat';

export interface EnginePeculiarityExample {
  id: string;
  labelPt: string;
  labelEn: string;
  sql: string;
  notePt: string;
  noteEn: string;
  engines: {
    postgres: { ok: boolean; output: string };
    mysql: { ok: boolean; output: string };
    sqlite: { ok: boolean; output: string };
  };
}

export const PECULIARITY_EXAMPLES: EnginePeculiarityExample[] = [
  {
    id: 'int-div',
    labelPt: 'Divisão Inteira (1 / 2)',
    labelEn: 'Integer Division (1 / 2)',
    sql: 'SELECT 1 / 2 AS int_division;',
    notePt:
      'PostgreSQL e SQLite truncam divisão entre inteiros para 0; MySQL promove para decimal.',
    noteEn:
      'PostgreSQL and SQLite truncate integer division to 0; MySQL promotes to decimal.',
    engines: {
      postgres: { ok: true, output: ' int_division \n--------------\n            0\n(1 row)' },
      mysql: { ok: true, output: '+--------------+\n| int_division |\n+--------------+\n|       0.5000 |\n+--------------+' },
      sqlite: { ok: true, output: '┌──────────────┐\n│ int_division │\n├──────────────┤\n│ 0            │\n└──────────────┘' },
    },
  },
  {
    id: 'concat',
    labelPt: "Operador '||'",
    labelEn: "'||' Concatenation",
    sql: "SELECT 'hello ' || 'world' AS concat_test;",
    notePt:
      'Em SQL padrão (PostgreSQL e SQLite), || concatena strings. No MySQL padrão, || é OR lógico!',
    noteEn:
      'In standard SQL (PostgreSQL & SQLite), || concatenates strings. In default MySQL, || is logical OR!',
    engines: {
      postgres: { ok: true, output: ' concat_test \n-------------\n hello world\n(1 row)' },
      mysql: { ok: true, output: '+-------------+\n| concat_test |\n+-------------+\n|           0 |\n+-------------+' },
      sqlite: { ok: true, output: '┌─────────────┐\n│ concat_test │\n├─────────────┤\n│ hello world │\n└─────────────┘' },
    },
  },
  {
    id: 'quotes',
    labelPt: 'Aspas Duplas ("...")',
    labelEn: 'Double Quotes ("...")',
    sql: 'SELECT sid, name FROM student WHERE name = "Kanye";',
    notePt:
      'PostgreSQL trata "..." como identificador de coluna; MySQL aceita como string; SQLite faz fallback para string.',
    noteEn:
      'PostgreSQL treats "..." as a column identifier; MySQL accepts it as a string; SQLite falls back to a string.',
    engines: {
      postgres: { ok: false, output: 'ERROR:  column "Kanye" does not exist\nLINE 1: ... FROM student WHERE name = "Kanye";' },
      mysql: { ok: true, output: '+-------+-------+\n| sid   | name  |\n+-------+-------+\n| 53666 | Kanye |\n+-------+-------+' },
      sqlite: { ok: true, output: '┌───────┬───────┐\n│  sid  │ name  │\n├───────┼───────┤\n│ 53666 │ Kanye │\n└───────┴───────┘' },
    },
  },
  {
    id: 'groupby',
    labelPt: 'GROUP BY Ambíguo',
    labelEn: 'Ambiguous GROUP BY',
    sql: 'SELECT cid, grade, COUNT(*) AS total FROM enrolled GROUP BY cid;',
    notePt:
      'PostgreSQL e MySQL (ONLY_FULL_GROUP_BY) rejeitam colunas não agregadas; SQLite escolhe uma linha arbitrária.',
    noteEn:
      'PostgreSQL and MySQL (ONLY_FULL_GROUP_BY) reject unaggregated columns; SQLite picks an arbitrary row.',
    engines: {
      postgres: { ok: false, output: 'ERROR:  column "enrolled.grade" must appear in the GROUP BY clause' },
      mysql: { ok: false, output: "ERROR 1055 (42000): 'demo.enrolled.grade' isn't in GROUP BY" },
      sqlite: { ok: true, output: '┌────────┬───────┬───────┐\n│  cid   │ grade │ total │\n├────────┼───────┼───────┤\n│ 15-445 │ C     │ 4     │\n│ 15-721 │ A     │ 1     │\n│ 15-826 │ B     │ 1     │\n└────────┴───────┴───────┘' },
    },
  },
  {
    id: 'nulls',
    labelPt: 'Ordenação de NULL',
    labelEn: 'NULL Ordering',
    sql: 'SELECT name, gpa FROM student ORDER BY gpa ASC;',
    notePt:
      'PostgreSQL ordena NULL por último no ASC; MySQL e SQLite ordenam NULL primeiro no ASC.',
    noteEn:
      'PostgreSQL sorts NULL last in ASC; MySQL and SQLite sort NULL first in ASC.',
    engines: {
      postgres: { ok: true, output: ' name   | gpa  \n--------+------\n Tupac  | 3.50\n Taylor | 3.85\n Bieber | 3.90\n Kanye  | 4.00\n Ada    | NULL' },
      mysql: { ok: true, output: '+--------+------+\n| name   | gpa  |\n+--------+------+\n| Ada    | NULL |\n| Tupac  | 3.50 |\n| Taylor | 3.85 |\n| Bieber | 3.90 |\n| Kanye  | 4.00 |\n+--------+------+' },
      sqlite: { ok: true, output: '┌────────┬──────┐\n│  name  │ gpa  │\n├────────┼──────┤\n│ Ada    │ NULL │\n│ Tupac  │ 3.5  │\n│ Taylor │ 3.85 │\n│ Bieber │ 3.9  │\n│ Kanye  │ 4.0  │\n└────────┴──────┘' },
    },
  },
  {
    id: 'like',
    labelPt: 'LIKE Case-Sensitive',
    labelEn: 'LIKE Case Sensitivity',
    sql: "SELECT name FROM student WHERE name LIKE 'kanye';",
    notePt:
      'PostgreSQL diferencia maiúsculas no LIKE (use ILIKE); MySQL e SQLite (ASCII) ignoram maiúsculas por padrão.',
    noteEn:
      'PostgreSQL LIKE is case-sensitive (use ILIKE); MySQL and SQLite (ASCII) are case-insensitive by default.',
    engines: {
      postgres: { ok: true, output: ' name \n------\n(0 rows)' },
      mysql: { ok: true, output: '+-------+\n| name  |\n+-------+\n| Kanye |\n+-------+' },
      sqlite: { ok: true, output: '┌───────┐\n│ name  │\n├───────┤\n│ Kanye │\n└───────┘' },
    },
  },
];

/**
 * Generates a self-contained Windows .bat launcher that either runs an adjacent setup.bat
 * or clones/updates terminal-sequel into %USERPROFILE%\terminal-sequel and launches it.
 */
export function buildBootstrapBatScript(): string {
  return [
    '@echo off',
    'setlocal EnableExtensions',
    '',
    'echo ============================================',
    'echo   terminal-sequel: 3-Engine SQL Bootstrap',
    'echo   (PostgreSQL + MySQL + SQLite)',
    'echo ============================================',
    'echo.',
    '',
    'if exist "%~dp0setup.bat" if exist "%~dp0docker-compose.yml" (',
    '    call "%~dp0setup.bat" %*',
    '    exit /b %errorlevel%',
    ')',
    '',
    'where git >nul 2>&1',
    'if errorlevel 1 (',
    '    echo [ERROR] Git was not found in PATH.',
    '    echo Install Git: winget install -e --id Git.Git',
    '    pause',
    '    exit /b 1',
    ')',
    '',
    'set "TARGET_DIR=%USERPROFILE%\\terminal-sequel"',
    'if not exist "%TARGET_DIR%\\.git" (',
    `    echo Cloning terminal-sequel into "%TARGET_DIR%"...`,
    `    git clone "${TERMINAL_REPO_URL}" "%TARGET_DIR%"`,
    '    if errorlevel 1 (',
    '        echo [ERROR] Failed to clone repository.',
    '        pause',
    '        exit /b 1',
    '    )',
    ') else (',
    '    echo Updating existing terminal-sequel in "%TARGET_DIR%"...',
    '    git -C "%TARGET_DIR%" pull --ff-only',
    ')',
    '',
    'call "%TARGET_DIR%\\setup.bat" %*',
    'exit /b %errorlevel%',
    '',
  ].join('\r\n');
}
