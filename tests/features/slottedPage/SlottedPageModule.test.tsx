import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { SlottedPageModule } from '../../../src/features/slottedPage/SlottedPageModule';

describe('SlottedPageModule component', () => {
  it('inserts a tuple, marks a tuple dead on click, and compacts dead tuples', async () => {
    const user = userEvent.setup();
    render(<SlottedPageModule t={I18N.pt} />);

    expect(screen.getByText('pd_lower: 36 B')).toBeInTheDocument();

    await user.click(screen.getByText(I18N.pt.m3.insertBtn));
    expect(screen.getByText('pd_lower: 40 B')).toBeInTheDocument();
    expect(screen.getByText('Slot #4 (4B)')).toBeInTheDocument();

    // Mark Slot #2 as dead
    await user.click(screen.getByText('Slot #2 (4B)'));
    expect(screen.getByText('LP_DEAD (0)')).toBeInTheDocument();

    // Compact page (VACUUM)
    await user.click(screen.getByText(I18N.pt.m3.compactBtn));
    expect(screen.queryByText('LP_DEAD (0)')).not.toBeInTheDocument();
    expect(screen.getByText('pd_lower: 36 B')).toBeInTheDocument();

    // Toggle floating message bubble
    await user.click(screen.getByRole('button', { name: I18N.pt.m1.stageNotesLabel }));
    expect(screen.getByRole('status')).toHaveTextContent(I18N.pt.m3.messageBody);
  });
});
