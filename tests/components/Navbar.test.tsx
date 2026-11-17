import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from '../../src/components/Navbar';
import { I18N } from '../../src/core/i18n';

describe('Navbar component', () => {
  const baseProps = {
    t: I18N.en,
    lang: 'en' as const,
    theme: 'light' as const,
    activeModule: 0 as number | null,
    presMode: false,
    progressPct: 20,
    onGoHome: vi.fn(),
    onSelectModule: vi.fn(),
    onToggleLang: vi.fn(),
    onToggleTheme: vi.fn(),
    onTogglePresMode: vi.fn(),
  };

  it('renders brand title, logo image, 5 module tabs, theme toggle, and EN toggle', () => {
    render(<Navbar {...baseProps} />);
    expect(screen.getByText('SQL Under the Hood')).toBeInTheDocument();
    expect(screen.getByAltText('SQL Under the Hood')).toHaveAttribute('src', '/assets/logo.png');
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: I18N.en.themeDark })).toBeInTheDocument();
  });

  it('invokes callbacks when clicking logo, theme, tabs, language toggle, and presentation mode', async () => {
    const user = userEvent.setup();
    render(<Navbar {...baseProps} />);

    await user.click(screen.getByAltText('SQL Under the Hood'));
    expect(baseProps.onGoHome).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: I18N.en.themeDark }));
    expect(baseProps.onToggleTheme).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('2. Storage & Buffer'));
    expect(baseProps.onSelectModule).toHaveBeenCalledWith(1);

    await user.click(screen.getByText('EN'));
    expect(baseProps.onToggleLang).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Presentation Mode'));
    expect(baseProps.onTogglePresMode).toHaveBeenCalledTimes(1);
  });

  it('shows exit presentation label and PT-BR toggle when presMode and pt are active', () => {
    render(<Navbar {...baseProps} presMode={true} theme="dark" lang="pt" t={I18N.pt} />);
    expect(screen.getByText('Sair da Apresentação')).toBeInTheDocument();
    expect(screen.getByText('PT-BR')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: I18N.pt.themeLight })).toBeInTheDocument();
  });
});
