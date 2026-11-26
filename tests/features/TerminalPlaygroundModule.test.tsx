import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18N } from '../../src/core/i18n';
import { buildBootstrapBatScript, PECULIARITY_EXAMPLES } from '../../src/core/terminalPlayground';
import { TerminalPlaygroundModule } from '../../src/features/terminalPlayground/TerminalPlaygroundModule';

describe('TerminalPlaygroundModule', () => {
  it('renders launcher CTA, 3 engine panels, and switches peculiarity examples', async () => {
    const user = userEvent.setup();
    render(<TerminalPlaygroundModule t={I18N.en} lang="en" />);

    expect(screen.getByText(I18N.en.m6.downloadBatBtn)).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL 17')).toBeInTheDocument();
    expect(screen.getByText('MySQL 8.4')).toBeInTheDocument();
    expect(screen.getByText('SQLite 3')).toBeInTheDocument();

    // Switch to the second peculiarity example ('||' Concatenation)
    await user.click(screen.getByText(PECULIARITY_EXAMPLES[1].labelEn));
    expect(screen.getByText(PECULIARITY_EXAMPLES[1].sql)).toBeInTheDocument();
    expect(screen.getByText(PECULIARITY_EXAMPLES[1].noteEn)).toBeInTheDocument();

    // Switch to Slide 15 EXPLAIN subquery example
    const explainExample = PECULIARITY_EXAMPLES.find((ex) => ex.id === 'explain-subquery')!;
    await user.click(screen.getByText(explainExample.labelEn));
    expect(screen.getByText(explainExample.sql)).toBeInTheDocument();
  });

  it('triggers a .bat file download when clicking Download', async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn(() => 'blob:mock-url');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });

    render(<TerminalPlaygroundModule t={I18N.en} lang="en" />);
    await user.click(screen.getByText(I18N.en.m6.downloadBatBtn));

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    vi.unstubAllGlobals();
  });

  it('generates a valid self-bootstrapping .bat script', () => {
    const script = buildBootstrapBatScript();
    expect(script).toContain('@echo off');
    expect(script).toContain('terminal-sequel.git');
    expect(script).toContain('setup.bat');
  });
});
