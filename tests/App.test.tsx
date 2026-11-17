import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';
import { I18N } from '../src/core/i18n';

describe('App integration', () => {
  it('opens on HomeView, enters modules, returns home via logo, and switches language', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(I18N.pt.home.headline)).toBeInTheDocument();

    // Switch to EN
    await user.click(screen.getByText('PT-BR'));
    expect(screen.getByText(I18N.en.home.headline)).toBeInTheDocument();

    // Enter Module 1 from Home CTA
    await user.click(screen.getByText(I18N.en.home.startBtn));
    expect(screen.getByText(/Module 01 \/ 05/)).toBeInTheDocument();

    // Navigate via Next Module and keyboard
    await user.click(screen.getByText('Next Module'));
    expect(screen.getByText(/Module 02 \/ 05/)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText(/Module 03 \/ 05/)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText(/Module 02 \/ 05/)).toBeInTheDocument();

    // Click logo to return to Home page
    await user.click(screen.getByAltText(I18N.en.brandTitle));
    expect(screen.getByText(I18N.en.home.headline)).toBeInTheDocument();
  });
});
