import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from '../../src/components/Navbar';
import { I18N } from '../../src/core/i18n';

describe('Navbar component', () => {
  const baseProps = {
    t: I18N.pt,
    lang: 'pt' as const,
    activeModule: 0,
    presMode: false,
    progressPct: 20,
    onSelectModule: vi.fn(),
    onToggleLang: vi.fn(),
    onTogglePresMode: vi.fn(),
    onOpenDeployModal: vi.fn(),
  };

  it('renders brand title, 5 module tabs, and PT-BR toggle by default', () => {
    render(<Navbar {...baseProps} />);
    expect(screen.getByText('SQL por Baixo dos Panos')).toBeInTheDocument();
    expect(screen.getByText('PT-BR')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(8);
  });

  it('invokes callbacks when clicking tabs, language toggle, presentation mode, and deploy button', async () => {
    const user = userEvent.setup();
    render(<Navbar {...baseProps} />);

    await user.click(screen.getByText('2. Hierarquia & Buffer'));
    expect(baseProps.onSelectModule).toHaveBeenCalledWith(1);

    await user.click(screen.getByText('PT-BR'));
    expect(baseProps.onToggleLang).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Modo Apresentação'));
    expect(baseProps.onTogglePresMode).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Deploy Cloudflare'));
    expect(baseProps.onOpenDeployModal).toHaveBeenCalledTimes(1);
  });

  it('hides deploy button and shows exit presentation label when presMode is true', () => {
    render(<Navbar {...baseProps} presMode={true} lang="en" t={I18N.en} />);
    expect(screen.queryByText('Cloudflare Deploy')).not.toBeInTheDocument();
    expect(screen.getByText('Exit Presentation')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });
});
