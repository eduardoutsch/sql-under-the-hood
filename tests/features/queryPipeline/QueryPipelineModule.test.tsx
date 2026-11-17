import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { QueryPipelineModule } from '../../../src/features/queryPipeline/QueryPipelineModule';

describe('QueryPipelineModule component', () => {
  it('renders initial Lexer stage, toggles stage chat bubble, and steps through all 5 stages', async () => {
    const user = userEvent.setup();
    render(<QueryPipelineModule t={I18N.pt} lang="pt" />);

    expect(screen.getAllByText('KEYWORD')).toHaveLength(3);

    // Chat bubble appears and disappears on click
    const notesBtn = screen.getByRole('button', { name: new RegExp(I18N.pt.m1.stageNotesLabel) });
    expect(notesBtn).toHaveAttribute('aria-expanded', 'false');
    await user.click(notesBtn);
    expect(screen.getByRole('status')).toHaveTextContent(I18N.pt.m1.stages[0].desc);
    await user.click(screen.getByRole('button', { name: 'Close stage note' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Step to Parser (AST)
    await user.click(screen.getByText(I18N.pt.step));
    expect(screen.getByText(I18N.pt.m1.astHeading)).toBeInTheDocument();

    // Step to Rewriter
    await user.click(screen.getByText(I18N.pt.step));
    expect(screen.getByText(I18N.pt.m1.rewriterHeading)).toBeInTheDocument();

    // Step to Optimizer (CBO)
    await user.click(screen.getByText(I18N.pt.step));
    expect(screen.getByText(I18N.pt.m1.candidatePlanA)).toBeInTheDocument();

    // Step to Execution (VM / JIT)
    await user.click(screen.getByText(I18N.pt.step));
    expect(screen.getByText(I18N.pt.m1.sqliteMode)).toBeInTheDocument();

    // Step VDBE PC and switch to LLVM JIT
    await user.click(screen.getByText(/sqlite3_step\(\)/i));
    expect(screen.getByText(/\[PC=1\]/)).toBeInTheDocument();

    await user.click(screen.getByText(I18N.pt.m1.jitMode));
    expect(screen.getByText(/eval_qual_jit:/i)).toBeInTheDocument();
  });

  it('auto-advances stages when Play is clicked and resets on Reset', () => {
    vi.useFakeTimers();
    render(<QueryPipelineModule t={I18N.en} lang="en" />);

    act(() => {
      screen.getByText(I18N.en.play).click();
    });
    expect(screen.getByText(I18N.en.pause)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1800 * 5);
    });
    expect(screen.getByText(I18N.en.m1.sqliteMode)).toBeInTheDocument();

    act(() => {
      screen.getByTitle(I18N.en.reset).click();
    });
    expect(screen.getAllByText('KEYWORD')).toHaveLength(3);
    vi.useRealTimers();
  });
});
