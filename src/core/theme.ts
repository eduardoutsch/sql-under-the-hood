/**
 * Pure theme helpers for Light (Drafting Paper) and Dark (Carbon Blueprint) modes.
 */

export type ThemeMode = 'light' | 'dark';

export const DEFAULT_THEME: ThemeMode = 'light';
export const THEME_STORAGE_KEY = 'sql_hood_theme';

/**
 * Resolve initial theme from a stored preference string.
 */
export function resolveInitialTheme(stored: string | null): ThemeMode {
  return stored === 'dark' ? 'dark' : DEFAULT_THEME;
}

/**
 * Toggle between light and dark theme modes.
 */
export function toggleTheme(current: ThemeMode): ThemeMode {
  return current === 'light' ? 'dark' : 'light';
}
