import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

describe('App integration', () => {
  it('defaults to PT-BR, switches to EN, and navigates modules via buttons and keyboard', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('SQL por Baixo dos Panos')).toBeInTheDocument();
    expect(screen.getByText(/Módulo 01 \/ 05/)).toBeInTheDocument();

    // Switch to EN
    await user.click(screen.getByText('PT-BR'));
    expect(screen.getByText('SQL Under the Hood')).toBeInTheDocument();

    // Navigate forward via Next Module button
    await user.click(screen.getByText('Next Module'));
    expect(screen.getByText(/Module 02 \/ 05/)).toBeInTheDocument();

    // Navigate via keyboard ArrowRight & ArrowLeft
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText(/Module 03 \/ 05/)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText(/Module 02 \/ 05/)).toBeInTheDocument();

    // Open and close Cloudflare Deploy modal
    await user.click(screen.getByText('Cloudflare Deploy'));
    expect(screen.getByText('Deploy to Cloudflare Pages + Vite')).toBeInTheDocument();
    await user.click(screen.getByText('Close'));
    expect(screen.queryByText('Deploy to Cloudflare Pages + Vite')).not.toBeInTheDocument();
  });
});
