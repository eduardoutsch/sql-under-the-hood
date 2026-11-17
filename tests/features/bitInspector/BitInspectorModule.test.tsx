import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { BitInspectorModule } from '../../../src/features/bitInspector/BitInspectorModule';

describe('BitInspectorModule component', () => {
  it('toggles column NULL state and updates payload size', async () => {
    const user = userEvent.setup();
    render(<BitInspectorModule t={I18N.pt} />);

    expect(screen.getByText(I18N.pt.m4.clickPrompt)).toBeInTheDocument();
    expect(screen.getByText(/Tamanho do Payload: 12 Bytes/)).toBeInTheDocument();

    // Toggle coupon (initially NULL) to present
    await user.click(screen.getByRole('button', { name: /coupon:/i }));
    expect(screen.getByText(/Tamanho do Payload: 16 Bytes/)).toBeInTheDocument();
  });

  it('switches between good and bad 64-bit word alignment modes', async () => {
    const user = userEvent.setup();
    render(<BitInspectorModule t={I18N.en} />);

    expect(screen.getByText(I18N.en.m4.goodDesc)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /1-Bit Flag per Column/i }));
    expect(screen.getByText(/STRADDLES 64-BIT WORD BOUNDARY/i)).toBeInTheDocument();
  });
});
