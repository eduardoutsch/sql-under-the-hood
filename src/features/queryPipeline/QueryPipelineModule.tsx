import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
} from 'lucide-react';
import type { Locale, TranslationBundle } from '../../core/i18n';
import {
  advancePipelineStage,
  getSqlTokens,
  getVdbeOpcodes,
  stepVmProgramCounter,
} from '../../core/queryPipeline';

export interface QueryPipelineModuleProps {
  t: TranslationBundle;
  lang: Locale;
}

/**
 * Interactive visualizer for Module 1: SQL text through Lexer, AST Parser,
 * Rewriter, Cost-Based Optimizer, and VDBE/LLVM JIT Execution.
 */
export function QueryPipelineModule({ t, lang }: QueryPipelineModuleProps) {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [execTarget, setExecTarget] = useState<'sqlite' | 'jit'>('sqlite');
  const [vmPc, setVmPc] = useState(0);

  const tokens = getSqlTokens();
  const opcodes = getVdbeOpcodes(lang);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStage((prev) => {
        if (prev < 4) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
            SQL INPUT
          </span>
          <code className="font-mono text-sm sm:text-base text-slate-100 whitespace-nowrap">
            <span className="text-cyan-400">SELECT</span> id, name{' '}
            <span className="text-cyan-400">FROM</span> users{' '}
            <span className="text-cyan-400">WHERE</span> price &gt;{' '}
            <span className="text-amber-400">100</span>;
          </code>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (stage === 4) setStage(0);
              setIsPlaying((prev) => !prev);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? t.pause : t.play}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setStage((prev) => advancePipelineStage(prev));
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm border border-slate-700 transition cursor-pointer"
          >
            {t.step} <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setStage(0);
              setVmPc(0);
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title={t.reset}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {t.m1.stages.map((st, idx) => {
          const active = idx === stage;
          const done = idx < stage;
          return (
            <button
              key={st.name}
              onClick={() => {
                setIsPlaying(false);
                setStage(idx);
              }}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                active
                  ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.18)]'
                  : done
                  ? 'bg-slate-900/80 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-slate-400">0{idx + 1}</span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {active && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
              </div>
              <div className={`font-semibold text-xs sm:text-sm ${active ? 'text-cyan-300' : 'text-slate-200'}`}>
                {st.name}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-slate-100">{t.m1.stages[stage].name}</h4>
          <p className="text-sm text-slate-400 mt-0.5">{t.m1.stages[stage].desc}</p>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 min-h-[340px] flex flex-col justify-center">
        {stage === 0 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 text-center">
              Stream de Bytes ASCII/UTF-8 → Scanner Léxico (Flex) → Lista de Tokens
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {tokens.map((tok, i) => (
                <div
                  key={i}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className={`px-3.5 py-2.5 rounded-xl border font-mono transition-transform hover:scale-105 ${tok.color}`}
                >
                  <div className="text-base font-bold">{tok.text}</div>
                  <div className="text-[10px] opacity-75 tracking-wider mt-1">{tok.type}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(stage === 1 || stage === 2) && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {stage === 1
                ? 'Abstract Syntax Tree (SelectStmt Node)'
                : lang === 'pt'
                ? 'Query Tree Reescrita (Regra: Validação de Catálogo pg_class + Predicado Normalizado)'
                : 'Rewritten Query Tree (Catalog OIDs Bound + Normalized Predicate)'}
            </div>

            <div className="w-full max-w-2xl flex flex-col items-center">
              <div className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-mono text-sm font-bold shadow-lg">
                SELECT_QUERY {stage === 2 && <span className="text-xs text-emerald-400 ml-1">[OID:16384]</span>}
              </div>
              <div className="w-0.5 h-5 bg-slate-700" />
              <div className="w-3/4 h-0.5 bg-slate-700" />

              <div className="grid grid-cols-3 gap-3 w-full mt-0">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-slate-700" />
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center w-full">
                    <div className="text-xs font-mono text-emerald-400 font-bold">TARGET_LIST</div>
                    <div className="text-xs font-mono text-slate-300 mt-1">
                      col[0]: id (INT4)
                      <br />
                      col[1]: name (TEXT)
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-slate-700" />
                  <div
                    className={`p-3 rounded-xl border text-center w-full transition-all ${
                      stage === 2
                        ? 'bg-violet-950/70 border-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.2)]'
                        : 'bg-violet-950/40 border-violet-500/40'
                    }`}
                  >
                    <div className="text-xs font-mono text-violet-300 font-bold">FROM_CLAUSE</div>
                    <div className="text-xs font-mono text-slate-200 mt-1">rel: "users"</div>
                    {stage === 2 && (
                      <div className="mt-1.5 text-[11px] font-mono bg-violet-500/20 text-violet-200 px-1.5 py-0.5 rounded">
                        + AND deleted_at IS NULL (View Rule)
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-slate-700" />
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-center w-full">
                    <div className="text-xs font-mono text-amber-400 font-bold">QUAL (WHERE)</div>
                    <div className="text-xs font-mono text-slate-200 mt-1">OpExpr [&gt;]</div>
                    <div className="text-[11px] font-mono text-amber-300/90 mt-1">Var(price) | Const(100)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 flex flex-col justify-between opacity-80">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    CANDIDATE PLAN A
                  </span>
                  <span className="font-mono text-sm text-rose-400 font-bold">Cost: 1,840.00</span>
                </div>
                <h5 className="font-semibold text-slate-200 mt-3">{t.m1.seqScan}</h5>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  1,000 pages × seq_page_cost(1.0) + 80,000 rows × cpu_tuple_cost(0.01)
                </p>
              </div>
              <div className="mt-4">
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[92%]" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1.5">
                  I/O: 8,000 KB lidos do Heap File
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/25 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.15)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                    ✓ {t.m1.winner}
                  </span>
                  <span className="font-mono text-sm text-emerald-400 font-bold">Cost: 42.65</span>
                </div>
                <h5 className="font-semibold text-white mt-3">{t.m1.idxScan}</h5>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  B-Tree depth=3 + Seletividade estimada (4.2% das linhas &gt; 100)
                </p>
              </div>
              <div className="mt-4">
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[12%]" />
                </div>
                <div className="text-[11px] font-mono text-emerald-300 mt-1.5">
                  43x mais rápido • Saltando direto para páginas folha relevantes
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === 4 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExecTarget('sqlite')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                    execTarget === 'sqlite'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t.m1.sqliteMode}
                </button>
                <button
                  onClick={() => setExecTarget('jit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                    execTarget === 'jit'
                      ? 'bg-violet-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t.m1.jitMode}
                </button>
              </div>

              {execTarget === 'sqlite' && (
                <button
                  onClick={() => setVmPc((pc) => stepVmProgramCounter(pc, opcodes.length))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 font-mono text-xs cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" /> {t.m1.stepVm} [PC={vmPc}]
                </button>
              )}
            </div>

            {execTarget === 'sqlite' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800">
                      <th className="py-1.5 px-2">addr</th>
                      <th className="py-1.5 px-2">opcode</th>
                      <th className="py-1.5 px-2">p1</th>
                      <th className="py-1.5 px-2">p2</th>
                      <th className="py-1.5 px-2">p3</th>
                      <th className="py-1.5 px-2">comment (sqlite3_prepare_v2)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opcodes.map((row, idx) => {
                      const active = idx === vmPc;
                      return (
                        <tr
                          key={row.addr}
                          onClick={() => setVmPc(idx)}
                          className={`cursor-pointer transition ${
                            active
                              ? 'bg-cyan-500/20 text-cyan-200 font-bold'
                              : 'text-slate-300 hover:bg-slate-800/50'
                          }`}
                        >
                          <td className="py-1.5 px-2">
                            {active ? '▶ ' : '  '}
                            {row.addr}
                          </td>
                          <td className="py-1.5 px-2 text-amber-300">{row.op}</td>
                          <td className="py-1.5 px-2">{row.p1}</td>
                          <td className="py-1.5 px-2">{row.p2}</td>
                          <td className="py-1.5 px-2">{row.p3}</td>
                          <td className="py-1.5 px-2 text-slate-400">{row.comment}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="bg-slate-950 p-4 rounded-xl border border-violet-500/30 font-mono text-xs space-y-1.5 text-slate-300">
                  <div className="text-violet-400 font-bold mb-2">; LLVM IR -&gt; x86_64 Native JIT Function</div>
                  <div><span className="text-cyan-400">eval_qual_jit:</span></div>
                  <div className="pl-4">
                    mov eax, dword ptr [rdi + 16] <span className="text-slate-500">; Direct offset col price</span>
                  </div>
                  <div className="pl-4">
                    cmp eax, 100 <span className="text-slate-500">; Hardware ALU compare</span>
                  </div>
                  <div className="pl-4">
                    setg al <span className="text-slate-500">; Branchless boolean 0/1</span>
                  </div>
                  <div className="pl-4">
                    ret <span className="text-emerald-400">; 0 virtual dispatch!</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/30 text-sm text-slate-300">
                    {t.m1.jitDesc}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Tuple Deforming</span>
                      <span className="text-emerald-400 font-bold">Unrolled Native Offsets</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Expr Eval</span>
                      <span className="text-emerald-400 font-bold">3 CPU Instructions</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
