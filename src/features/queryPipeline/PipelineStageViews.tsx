import { Terminal } from 'lucide-react';
import type { Locale, TranslationBundle } from '../../core/i18n';
import type { SqlToken, VdbeOpcode } from '../../core/queryPipeline';

export function LexerStageView({ tokens }: { tokens: readonly SqlToken[] }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500 text-center">
        Stream de Bytes ASCII/UTF-8 → Scanner Léxico (Flex) → Lista de Tokens
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {tokens.map((tok, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 70}ms` }}
            className={`px-3.5 py-2.5 rounded-lg border-2 shadow-[2px_2px_0px_#1c1917] font-mono transition-transform hover:-translate-y-0.5 ${tok.color}`}
          >
            <div className="text-base font-bold">{tok.text}</div>
            <div className="text-[10px] opacity-80 tracking-wider mt-1 font-semibold">{tok.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AstStageView({ isRewriter, lang }: { isRewriter: boolean; lang: Locale }) {
  const heading = !isRewriter
    ? 'Abstract Syntax Tree (SelectStmt Node)'
    : lang === 'pt'
    ? 'Query Tree Reescrita (Regra: Validação de Catálogo pg_class + Predicado Normalizado)'
    : 'Rewritten Query Tree (Catalog OIDs Bound + Normalized Predicate)';

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="text-xs font-mono font-semibold text-stone-600 uppercase tracking-wider text-center">
        {heading}
      </div>
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="px-4 py-2 rounded-lg bg-[#1C1917] border-2 border-stone-900 text-[#FFFDF8] font-mono text-sm font-bold shadow-[3px_3px_0px_#D94E28]">
          SELECT_QUERY {isRewriter && <span className="text-xs text-amber-400 ml-1">[OID:16384]</span>}
        </div>
        <div className="w-0.5 h-5 bg-stone-900" />
        <div className="w-3/4 h-0.5 bg-stone-900" />
        <div className="grid grid-cols-3 gap-3 w-full mt-0">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-stone-900" />
            <div className="p-3 rounded-lg bg-emerald-50 border-2 border-stone-900 text-center w-full shadow-[2px_2px_0px_#1c1917]">
              <div className="text-xs font-mono text-emerald-900 font-bold">TARGET_LIST</div>
              <div className="text-xs font-mono text-stone-700 mt-1">
                col[0]: id (INT4)
                <br />
                col[1]: name (TEXT)
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-stone-900" />
            <div
              className={`p-3 rounded-lg border-2 border-stone-900 text-center w-full transition-all shadow-[2px_2px_0px_#1c1917] ${
                isRewriter ? 'bg-blue-100' : 'bg-blue-50'
              }`}
            >
              <div className="text-xs font-mono text-blue-900 font-bold">FROM_CLAUSE</div>
              <div className="text-xs font-mono text-stone-800 mt-1">rel: "users"</div>
              {isRewriter && (
                <div className="mt-1.5 text-[11px] font-mono bg-blue-900 text-white px-1.5 py-0.5 rounded">
                  + AND deleted_at IS NULL (View Rule)
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-stone-900" />
            <div className="p-3 rounded-lg bg-amber-50 border-2 border-stone-900 text-center w-full shadow-[2px_2px_0px_#1c1917]">
              <div className="text-xs font-mono text-amber-900 font-bold">QUAL (WHERE)</div>
              <div className="text-xs font-mono text-stone-800 mt-1">OpExpr [&gt;]</div>
              <div className="text-[11px] font-mono text-amber-900 mt-1">Var(price) | Const(100)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OptimizerStageView({ t }: { t: TranslationBundle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="p-4 rounded-xl bg-[#EFE9DC] border-2 border-stone-900/50 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-900/30">
              CANDIDATE PLAN A
            </span>
            <span className="font-mono text-sm text-rose-800 font-bold">Cost: 1,840.00</span>
          </div>
          <h5 className="font-bold text-stone-900 mt-3">{t.m1.seqScan}</h5>
          <p className="text-xs text-stone-700 mt-1 font-mono">
            1,000 pages × seq_page_cost(1.0) + 80,000 rows × cpu_tuple_cost(0.01)
          </p>
        </div>
        <div className="mt-4">
          <div className="w-full bg-stone-300 h-3 rounded-full overflow-hidden border border-stone-900">
            <div className="bg-rose-700 h-full w-[92%]" />
          </div>
          <div className="text-[11px] font-mono text-stone-700 mt-1.5">I/O: 8,000 KB lidos do Heap File</div>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-emerald-50 border-2 border-stone-900 shadow-[4px_4px_0px_#15803d] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-700 text-white font-bold">
              ✓ {t.m1.winner}
            </span>
            <span className="font-mono text-sm text-emerald-800 font-bold">Cost: 42.65</span>
          </div>
          <h5 className="font-bold text-stone-900 mt-3">{t.m1.idxScan}</h5>
          <p className="text-xs text-stone-700 mt-1 font-mono">
            B-Tree depth=3 + Seletividade estimada (4.2% das linhas &gt; 100)
          </p>
        </div>
        <div className="mt-4">
          <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden border border-stone-900">
            <div className="bg-emerald-700 h-full w-[12%]" />
          </div>
          <div className="text-[11px] font-mono text-emerald-900 font-semibold mt-1.5">
            43x mais rápido • Saltando direto para páginas folha relevantes
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExecutionStageViewProps {
  t: TranslationBundle;
  execTarget: 'sqlite' | 'jit';
  vmPc: number;
  opcodes: readonly VdbeOpcode[];
  onSetExecTarget: (target: 'sqlite' | 'jit') => void;
  onStepVm: () => void;
  onSelectPc: (pc: number) => void;
}

export function ExecutionStageView({
  t,
  execTarget,
  vmPc,
  opcodes,
  onSetExecTarget,
  onStepVm,
  onSelectPc,
}: ExecutionStageViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-stone-900/15 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetExecTarget('sqlite')}
            className={`px-3 py-1.5 rounded-md border-2 border-stone-900 text-xs font-mono font-bold transition cursor-pointer ${
              execTarget === 'sqlite'
                ? 'bg-[#1C1917] text-[#FFFDF8] shadow-[2px_2px_0px_#D94E28]'
                : 'bg-[#EFE9DC] text-stone-800 hover:bg-stone-200'
            }`}
          >
            {t.m1.sqliteMode}
          </button>
          <button
            onClick={() => onSetExecTarget('jit')}
            className={`px-3 py-1.5 rounded-md border-2 border-stone-900 text-xs font-mono font-bold transition cursor-pointer ${
              execTarget === 'jit'
                ? 'bg-[#D94E28] text-[#FFFDF8] shadow-[2px_2px_0px_#1c1917]'
                : 'bg-[#EFE9DC] text-stone-800 hover:bg-stone-200'
            }`}
          >
            {t.m1.jitMode}
          </button>
        </div>
        {execTarget === 'sqlite' && (
          <button
            onClick={onStepVm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] text-white font-mono text-xs font-bold cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" /> {t.m1.stepVm} [PC={vmPc}]
          </button>
        )}
      </div>

      {execTarget === 'sqlite' ? (
        <div className="overflow-x-auto bg-[#1C1917] rounded-lg border-2 border-stone-900 p-3">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-stone-400 border-b border-stone-700">
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
                    onClick={() => onSelectPc(idx)}
                    className={`cursor-pointer transition ${
                      active ? 'bg-[#D94E28]/30 text-amber-200 font-bold' : 'text-stone-200 hover:bg-stone-800'
                    }`}
                  >
                    <td className="py-1.5 px-2">{active ? '▶ ' : '  '}{row.addr}</td>
                    <td className="py-1.5 px-2 text-amber-400">{row.op}</td>
                    <td className="py-1.5 px-2">{row.p1}</td>
                    <td className="py-1.5 px-2">{row.p2}</td>
                    <td className="py-1.5 px-2">{row.p3}</td>
                    <td className="py-1.5 px-2 text-stone-400">{row.comment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="bg-[#1C1917] p-4 rounded-lg border-2 border-stone-900 font-mono text-xs space-y-1.5 text-stone-200">
            <div className="text-[#D94E28] font-bold mb-2">; LLVM IR -&gt; x86_64 Native JIT Function</div>
            <div><span className="text-amber-300">eval_qual_jit:</span></div>
            <div className="pl-4">mov eax, dword ptr [rdi + 16] <span className="text-stone-500">; Direct offset col price</span></div>
            <div className="pl-4">cmp eax, 100 <span className="text-stone-500">; Hardware ALU compare</span></div>
            <div className="pl-4">setg al <span className="text-stone-500">; Branchless boolean 0/1</span></div>
            <div className="pl-4">ret <span className="text-emerald-400">; 0 virtual dispatch!</span></div>
          </div>
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-[#EFE9DC] border-2 border-stone-900 text-sm text-stone-800">
              {t.m1.jitDesc}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#FFFDF8] border-2 border-stone-900">
                <span className="text-stone-500 block">Tuple Deforming</span>
                <span className="text-emerald-800 font-bold">Unrolled Native Offsets</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FFFDF8] border-2 border-stone-900">
                <span className="text-stone-500 block">Expr Eval</span>
                <span className="text-emerald-800 font-bold">3 CPU Instructions</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
