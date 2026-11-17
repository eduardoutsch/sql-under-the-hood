import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { BitInspectorModule } from '../../../src/features/bitInspector/BitInspectorModule';

describe('BitInspectorModule component', () => {
  it('toggles column NULL state and updates payload size', async () => {
    const user = userEvent.setup();
    render(<BitInspectorModule t={I18N.pt} />);

    expect(screen.getByText(/Payload Size: 12 Bytes/)).toBeInTheDocument();

    // Toggle coupon (initially NULL) to present
    await user.click(screen.getByText(/coupon:/));
    expect(screen.getByText(/Payload Size: 16 Bytes/)).toBeInTheDocument();
  });

  it('switches between good and bad 64-bit word alignment modes', async () => {
    const user = userEvent.setup();
    render(<BitInspectorModule t={I18N.en} />);

    expect(screen.getByText(I18N.en.m4.goodDesc)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Naive Per-Attribute/i }));
    expect(screen.getByText(/STRADDLES 64-BIT WORD BOUNDARY/i)).toBeInTheDocument();
  });
});
