import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { StorageHierarchyModule } from '../../../src/features/storageHierarchy/StorageHierarchyModule';

describe('StorageHierarchyModule component', () => {
  it('displays hardware latency tiers and toggles read pulse', async () => {
    const user = userEvent.setup();
    render(<StorageHierarchyModule t={I18N.pt} lang="pt" />);

    expect(screen.getByText('L1 Cache')).toBeInTheDocument();
    expect(screen.getByText('HDD Magnético')).toBeInTheDocument();

    await user.click(screen.getByText(I18N.pt.pause));
    expect(screen.getByText(I18N.pt.m2.startPulse)).toBeInTheDocument();
  });

  it('simulates buffer pool hit, miss, page size switch, and eviction', async () => {
    const user = userEvent.setup();
    render(<StorageHierarchyModule t={I18N.en} lang="en" />);

    // Page 0 is initially in buffer pool -> HIT
    await user.click(screen.getByText('Pág #0'));
    expect(screen.getByText(/CACHE HIT/i)).toBeInTheDocument();

    // Page 2 is not in buffer pool -> MISS
    await user.click(screen.getByText('Pág #2'));
    expect(screen.getByText(/PAGE FAULT \/ MISS/i)).toBeInTheDocument();

    // Switch page size to 4 KB
    await user.click(screen.getByText('4 KB'));
    expect(screen.getByText(/8,192 bytes|8.192 bytes/)).toBeInTheDocument();

    // Evict buffer pool
    await user.click(screen.getByText(I18N.en.m2.evictBtn));
    expect(screen.getByText('0/3 frames')).toBeInTheDocument();

    // Toggle floating message bubble
    await user.click(screen.getByRole('button', { name: I18N.en.m1.stageNotesLabel }));
    expect(screen.getByRole('status')).toHaveTextContent(I18N.en.m2.messageBody);
  });
});
