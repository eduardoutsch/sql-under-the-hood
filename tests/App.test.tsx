import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { I18N } from '../src/core/i18n';

describe('App integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('starts in EN on HomeView, toggles theme & PT-BR, and navigates modules', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(I18N.en.home.headline)).toBeInTheDocument();

    // Toggle dark mode
    await user.click(screen.getByRole('button', { name: I18N.en.themeDark }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Switch to PT-BR
    await user.click(screen.getByText('EN'));
    expect(screen.getByText(I18N.pt.home.headline)).toBeInTheDocument();

    // Enter Module 1 from Home CTA
    await user.click(screen.getByText(I18N.pt.home.startBtn));
    expect(screen.getByText(/Módulo 01 \/ 07/)).toBeInTheDocument();

    // Navigate via Next Module and keyboard
    await user.click(screen.getByText(I18N.pt.nextMod));
    expect(screen.getByText(/Módulo 02 \/ 07/)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText(/Módulo 03 \/ 07/)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText(/Módulo 02 \/ 07/)).toBeInTheDocument();

    // Click logo to return to Home page
    await user.click(screen.getByAltText(I18N.pt.brandTitle));
    expect(screen.getByText(I18N.pt.home.headline)).toBeInTheDocument();
  });
});
