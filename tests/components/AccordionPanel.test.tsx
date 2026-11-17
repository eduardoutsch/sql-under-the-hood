import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AccordionPanel } from '../../src/components/AccordionPanel';

describe('AccordionPanel component', () => {
  it('starts collapsed when defaultOpen is false and expands on click', async () => {
    const user = userEvent.setup();
    render(
      <AccordionPanel title="Details" badge="01" defaultOpen={false}>
        <p>Hidden technical content</p>
      </AccordionPanel>
    );

    const toggle = screen.getByRole('button', { name: /Details/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Hidden technical content')).toBeVisible();
  });

  it('starts expanded when defaultOpen is true and collapses on click', async () => {
    const user = userEvent.setup();
    render(
      <AccordionPanel title="Open Panel" defaultOpen={true}>
        <p>Visible content</p>
      </AccordionPanel>
    );

    const toggle = screen.getByRole('button', { name: /Open Panel/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
