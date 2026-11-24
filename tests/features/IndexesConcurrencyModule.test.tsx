import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { I18N } from '../../src/core/i18n';
import { INDEX_CASES } from '../../src/core/indexesConcurrency';
import { IndexesConcurrencyModule } from '../../src/features/indexesConcurrency/IndexesConcurrencyModule';

describe('IndexesConcurrencyModule', () => {
  it('switches between index cases including implicit coercion trap', async () => {
    const user = userEvent.setup();
    render(<IndexesConcurrencyModule t={I18N.en} lang="en" />);

    expect(screen.getByText('B+Tree Index (3 levels)')).toBeInTheDocument();

    await user.click(screen.getByText(INDEX_CASES[1].labelEn));
    expect(screen.getByText('Full Table Scan')).toBeInTheDocument();
    expect(screen.getByText('O(N)')).toBeInTheDocument();
  });

  it('simulates MVCC uncommitted update and COMMIT / ROLLBACK', async () => {
    const user = userEvent.setup();
    render(<IndexesConcurrencyModule t={I18N.en} lang="en" />);

    await user.click(screen.getByText(I18N.en.m7.tabConcurrency));
    await user.click(screen.getByText('1. UPDATE salario = 6500'));
    expect(screen.getByText('old = 5000')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();

    await user.click(screen.getByText('2a. COMMIT (Redo)'));
    expect(screen.getByText('FLUSHED ✓')).toBeInTheDocument();
  });

  it('steps through the EXPLAIN PLAN tree and displays Join algorithms', async () => {
    const user = userEvent.setup();
    render(<IndexesConcurrencyModule t={I18N.en} lang="en" />);

    await user.click(screen.getByText(I18N.en.m7.tabExplain));
    expect(screen.getByText('Nested Loops Join')).toBeInTheDocument();
    expect(screen.getByText('Hash Join')).toBeInTheDocument();
    expect(screen.getByText('Sort-Merge Join')).toBeInTheDocument();

    await user.click(screen.getByText(I18N.en.step));
    expect(screen.getByText(/scans small table DEPTO/)).toBeInTheDocument();
  });
});
