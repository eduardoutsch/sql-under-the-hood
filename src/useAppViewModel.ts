import { useEffect, useState } from 'react';
import { computeProgressPct, stepModuleIndex } from './core/appNavigation';
import {
  getTranslations,
  type Locale,
  LOCALE_STORAGE_KEY,
  resolveInitialLocale,
  toggleLocale,
} from './core/i18n';
import {
  resolveInitialTheme,
  THEME_STORAGE_KEY,
  type ThemeMode,
  toggleTheme as switchTheme,
} from './core/theme';

function readStoredValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStoredValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors in restricted environments
  }
}

/**
 * ViewModel for the top-level App shell.
 * Starts on the Home page (`activeModule === null`), defaults to EN unless PT was
 * previously saved on this machine, and persists theme & language preferences.
 */
export function useAppViewModel() {
  const [lang, setLang] = useState<Locale>(() =>
    resolveInitialLocale(readStoredValue(LOCALE_STORAGE_KEY))
  );
  const [theme, setTheme] = useState<ThemeMode>(() =>
    resolveInitialTheme(readStoredValue(THEME_STORAGE_KEY))
  );
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [presMode, setPresMode] = useState(false);

  const t = getTranslations(lang);
  const progressPct =
    activeModule === null ? 0 : computeProgressPct(activeModule, t.modules.length);
  const subtitles = [
    t.m1.subtitle,
    t.m2.subtitle,
    t.m3.subtitle,
    t.m4.subtitle,
    t.m5.subtitle,
    t.m7.subtitle,
    t.m6.subtitle,
  ];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveModule((m) => (m === null ? 0 : stepModuleIndex(m, 1)));
      } else if (e.key === 'ArrowLeft') {
        setActiveModule((m) => (m === null ? null : stepModuleIndex(m, -1)));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return {
    lang,
    theme,
    t,
    activeModule,
    presMode,
    progressPct,
    activeTitle: activeModule === null ? t.brandTitle : t.modules[activeModule].title,
    activeSubtitle: activeModule === null ? t.home.intro : subtitles[activeModule],
    goHome: () => setActiveModule(null),
    selectModule: (idx: number) => setActiveModule(idx),
    prevModule: () =>
      setActiveModule((m) => (m === null ? null : stepModuleIndex(m, -1))),
    nextModule: () =>
      setActiveModule((m) => (m === null ? 0 : stepModuleIndex(m, 1))),
    toggleLang: () =>
      setLang((prev) => {
        const next = toggleLocale(prev);
        writeStoredValue(LOCALE_STORAGE_KEY, next);
        return next;
      }),
    toggleTheme: () =>
      setTheme((prev) => {
        const next = switchTheme(prev);
        writeStoredValue(THEME_STORAGE_KEY, next);
        return next;
      }),
    togglePresMode: () => setPresMode((prev) => !prev),
  };
}
