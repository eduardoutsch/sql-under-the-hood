import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18N } from '../../../src/core/i18n';
import { VolcanoVsSimdModule } from '../../../src/features/volcanoSimd/VolcanoVsSimdModule';

describe('VolcanoVsSimdModule component', () => {
  it('steps simulation and switches between AVX2 and AVX-512', async () => {
    const user = userEvent.setup();
    render(<VolcanoVsSimdModule t={I18N.pt} />);

    await user.click(screen.getByText(I18N.pt.step));
    expect(screen.getByText('18 clk')).toBeInTheDocument();
    expect(screen.getByText('2 clk')).toBeInTheDocument();

    await user.click(screen.getByText('AVX-512 (16× int32)'));
    expect(screen.getByText(/vpcmpgtd zmm0, zmm1/)).toBeInTheDocument();
    expect(screen.getAllByText('0 clk')).toHaveLength(2);
  });

  it('runs race with Play and stops cleanly when finished', () => {
    vi.useFakeTimers();
    render(<VolcanoVsSimdModule t={I18N.en} />);

    act(() => {
      screen.getByText(I18N.en.play).click();
    });
    expect(screen.getByText(I18N.en.pause)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(420 * 35);
    });
    expect(screen.getByText(I18N.en.play)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
