import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME, resolveInitialTheme, toggleTheme } from '../../src/core/theme';

describe('theme core helpers', () => {
  it('defaults to light theme when no preference is stored', () => {
    expect(DEFAULT_THEME).toBe('light');
    expect(resolveInitialTheme(null)).toBe('light');
    expect(resolveInitialTheme('invalid')).toBe('light');
  });

  it('restores dark theme when stored', () => {
    expect(resolveInitialTheme('dark')).toBe('dark');
  });

  it('toggles between light and dark', () => {
    expect(toggleTheme('light')).toBe('dark');
    expect(toggleTheme('dark')).toBe('light');
  });
});
