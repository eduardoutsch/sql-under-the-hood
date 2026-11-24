import { Check, Copy, Download, Terminal as TerminalIcon } from 'lucide-react';
import { useState } from 'react';
import { AccordionPanel } from '../../components/AccordionPanel';
import type { Locale, TranslationBundle } from '../../core/i18n';
import {
  BOOTSTRAP_BAT_FILENAME,
  buildBootstrapBatScript,
  PECULIARITY_EXAMPLES,
  TERMINAL_REPO_URL,
} from '../../core/terminalPlayground';

export interface TerminalPlaygroundModuleProps {
  t: TranslationBundle;
  lang: Locale;
}

/**
 * Module 6: 3-Engine SQL Terminal Playground (PostgreSQL, MySQL, SQLite).
 * Lets the user download the Windows .bat launcher (setup-terminal-sequel.bat),
 * copy CLI commands, and preview SQL dialect peculiarities side by side.
 */
export function TerminalPlaygroundModule({ t, lang }: TerminalPlaygroundModuleProps) {
  const [selectedId, setSelectedId] = useState<string>(PECULIARITY_EXAMPLES[0].id);
  const [copiedKey, setCopiedKey] = useState<'cli' | 'bat' | 'runall' | null>(null);

  const selectedExample =
    PECULIARITY_EXAMPLES.find((ex) => ex.id === selectedId) ?? PECULIARITY_EXAMPLES[0];

  const batScript = buildBootstrapBatScript();
  const cliCommand = `git clone ${TERMINAL_REPO_URL} && cd terminal-sequel && setup.bat`;
  const runAllCommand = `.\\scripts\\run-all.ps1 -Query "${selectedExample.sql.replace(/"/g, '\\"')}"`;

  const handleDownloadBat = () => {
    const blob = new Blob([batScript], { type: 'application/x-bat;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = BOOTSTRAP_BAT_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (key: 'cli' | 'bat' | 'runall', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Ignore clipboard errors in restricted contexts
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. One-Click .bat Setup Card */}
      <section className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-xl p-4 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#1C1917] text-amber-300 font-mono text-xs font-bold">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>WINDOWS • DOCKER • WINDOWS TERMINAL</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900">{t.m6.launcherTitle}</h3>
            <p className="text-sm sm:text-base text-stone-800 max-w-3xl leading-relaxed">
              {t.m6.launcherDesc}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadBat}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#D94E28] hover:bg-[#C2411F] border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-[#FFFDF8] font-mono font-bold text-sm transition cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{t.m6.downloadBatBtn}</span>
          </button>
        </div>

        {/* 3-Step Usage + Shortcut Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-[#EFE9DC]/70 border-2 border-stone-900 space-y-1">
            <div className="text-xs font-mono font-bold text-[#B83B1D]">01 • {t.m6.step1Title}</div>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">{t.m6.step1Body}</p>
          </div>
          <div className="p-3.5 rounded-lg bg-[#EFE9DC]/70 border-2 border-stone-900 space-y-1">
            <div className="text-xs font-mono font-bold text-[#B83B1D]">02 • {t.m6.step2Title}</div>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">{t.m6.step2Body}</p>
          </div>
          <div className="p-3.5 rounded-lg bg-[#EFE9DC]/70 border-2 border-stone-900 space-y-1">
            <div className="text-xs font-mono font-bold text-[#B83B1D]">03 • {t.m6.step3Title}</div>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">{t.m6.step3Body}</p>
          </div>
        </div>

        {/* CLI Quick-Clone Strip */}
        <div className="p-3.5 rounded-lg bg-[#1C1917] border-2 border-stone-900 text-[#F6F2EA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 mb-1">
              {t.m6.cliAlternativeLabel}
            </div>
            <code className="text-xs sm:text-sm font-mono break-all text-stone-100">
              {cliCommand}
            </code>
          </div>
          <button
            type="button"
            onClick={() => handleCopy('cli', cliCommand)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-600 text-xs font-mono font-semibold text-[#F6F2EA] transition cursor-pointer shrink-0 self-start sm:self-center"
          >
            {copiedKey === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'cli' ? t.m6.copied : t.m6.copyCmd}</span>
          </button>
        </div>

        <AccordionPanel title={t.m6.inspectBatTitle} badge="setup-terminal-sequel.bat" defaultOpen={false}>
          <div className="space-y-2">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleCopy('bat', batScript)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#EFE9DC] hover:bg-stone-200 border-2 border-stone-900 text-xs font-mono font-semibold text-stone-900 transition cursor-pointer"
              >
                {copiedKey === 'bat' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'bat' ? t.m6.copied : t.m6.copyScript}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-lg bg-[#1C1917] text-stone-100 font-mono text-xs overflow-x-auto leading-relaxed">
              {batScript}
            </pre>
          </div>
        </AccordionPanel>
      </section>

      {/* 2. Interactive 3-Engine Peculiarities Comparison */}
      <section className="bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-xl p-4 sm:p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-stone-900">{t.m6.compareTitle}</h3>
          <p className="text-sm text-stone-800">{t.m6.compareDesc}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PECULIARITY_EXAMPLES.map((ex) => {
            const active = ex.id === selectedExample.id;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => setSelectedId(ex.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono border-2 transition cursor-pointer ${
                  active
                    ? 'bg-[#D94E28] text-[#FFFDF8] border-stone-900 font-bold shadow-[2px_2px_0px_#1c1917]'
                    : 'bg-[#EFE9DC] text-stone-900 border-stone-900/40 hover:border-stone-900'
                }`}
              >
                {lang === 'pt' ? ex.labelPt : ex.labelEn}
              </button>
            );
          })}
        </div>

        <div className="p-3.5 rounded-lg bg-[#1C1917] border-2 border-stone-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <code className="text-xs sm:text-sm font-mono text-amber-300 break-all">
            {selectedExample.sql}
          </code>
          <button
            type="button"
            onClick={() => handleCopy('runall', runAllCommand)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-600 text-xs font-mono font-semibold text-[#F6F2EA] transition cursor-pointer shrink-0 self-start sm:self-center"
          >
            {copiedKey === 'runall' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'runall' ? t.m6.copied : 'run-all.ps1'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {(
            [
              { key: 'postgres', name: 'PostgreSQL 17', accent: 'bg-[#336791] text-white' },
              { key: 'mysql', name: 'MySQL 8.4', accent: 'bg-[#F29111] text-stone-950' },
              { key: 'sqlite', name: 'SQLite 3', accent: 'bg-[#0F80CC] text-white' },
            ] as const
          ).map((engine) => {
            const res = selectedExample.engines[engine.key];
            return (
              <div
                key={engine.key}
                className="rounded-lg border-2 border-stone-900 overflow-hidden bg-[#1C1917] flex flex-col"
              >
                <div className={`px-3 py-2 font-mono text-xs font-bold flex items-center justify-between border-b-2 border-stone-900 ${engine.accent}`}>
                  <span>{engine.name}</span>
                  <span>{res.ok ? 'OK' : 'ERROR'}</span>
                </div>
                <pre
                  className={`p-3 font-mono text-xs overflow-x-auto leading-relaxed flex-1 ${
                    res.ok ? 'text-stone-100' : 'text-rose-300'
                  }`}
                >
                  {res.output}
                </pre>
              </div>
            );
          })}
        </div>

        <div className="p-3.5 rounded-lg bg-[#EFE9DC]/80 border-2 border-stone-900 space-y-1">
          <div className="text-xs font-mono font-bold text-[#B83B1D] uppercase tracking-wider">
            {t.m6.whyDifferentLabel}
          </div>
          <p className="text-sm text-stone-900 leading-relaxed">
            {lang === 'pt' ? selectedExample.notePt : selectedExample.noteEn}
          </p>
        </div>
      </section>
    </div>
  );
}
