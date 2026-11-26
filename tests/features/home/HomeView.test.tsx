import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { HomeView } from '../../../src/features/home/HomeView';

describe('HomeView component', () => {
  it('renders plain-language SQL intro, collapsible tutorials, and module cards', async () => {
    const user = userEvent.setup();
    const onSelectModule = vi.fn();
    render(<HomeView t={I18N.pt} onSelectModule={onSelectModule} />);

    expect(screen.getByText(I18N.pt.home.headline)).toBeInTheDocument();
    expect(screen.getByText(I18N.pt.home.whatIsSqlTitle)).toBeInTheDocument();

    // Start CTA navigates to module 0
    await user.click(screen.getByText(I18N.pt.home.startBtn));
    expect(onSelectModule).toHaveBeenCalledWith(0);

    // Tutorial accordion expands on click
    const tutorialBtn = screen.getByRole('button', { name: /Como usar este site/i });
    expect(tutorialBtn).toHaveAttribute('aria-expanded', 'false');
    await user.click(tutorialBtn);
    expect(tutorialBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(I18N.pt.home.howToUseSteps[0].title)).toBeVisible();

    // Language topics accordion expands on click
    const langBtn = screen.getByRole('button', { name: /SQL como Linguagem/i });
    expect(langBtn).toHaveAttribute('aria-expanded', 'false');
    await user.click(langBtn);
    expect(langBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(I18N.pt.home.languageTopics[0].title)).toBeVisible();

    // Module directory cards open selected module
    await user.click(screen.getByText('3. Slotted Page 8KB'));
    expect(onSelectModule).toHaveBeenCalledWith(2);
  });
});
