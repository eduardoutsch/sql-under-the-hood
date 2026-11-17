import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DeployModal } from '../../src/components/DeployModal';
import { I18N } from '../../src/core/i18n';

describe('DeployModal component', () => {
  it('does not render when isOpen is false', () => {
    render(<DeployModal isOpen={false} t={I18N.pt} onClose={vi.fn()} />);
    expect(screen.queryByText(I18N.pt.deployModal.title)).not.toBeInTheDocument();
  });

  it('renders deploy steps and triggers onClose when Close is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DeployModal isOpen={true} t={I18N.en} onClose={onClose} />);

    expect(screen.getByText(I18N.en.deployModal.title)).toBeInTheDocument();
    for (const step of I18N.en.deployModal.steps) {
      expect(screen.getByText(step)).toBeInTheDocument();
    }

    await user.click(screen.getByText(I18N.en.deployModal.close));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
