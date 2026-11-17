import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StageMessageBubble } from '../../src/components/StageMessageBubble';

describe('StageMessageBubble component', () => {
  it('renders icon-only trigger and toggles speech bubble visibility on click', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const { rerender } = render(
      <StageMessageBubble
        label="Message"
        badge="01"
        title="Buffer Pool"
        body="Keeps hot pages in RAM."
        open={false}
        placement={{ side: 'left', alignClass: 'lg:-top-5' }}
        onToggle={onToggle}
      />
    );

    const btn = screen.getByRole('button', { name: 'Message' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    await user.click(btn);
    expect(onToggle).toHaveBeenCalledTimes(1);

    rerender(
      <StageMessageBubble
        label="Message"
        badge="01"
        title="Buffer Pool"
        body="Keeps hot pages in RAM."
        open={true}
        placement={{ side: 'right', alignClass: 'lg:-top-4' }}
        onToggle={onToggle}
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent('Keeps hot pages in RAM.');
    await user.click(screen.getByRole('button', { name: 'Close stage note' }));
    expect(onToggle).toHaveBeenCalledTimes(2);
  });
});
