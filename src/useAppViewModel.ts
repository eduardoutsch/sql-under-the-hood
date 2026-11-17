import { useEffect, useState } from 'react';
import { computeProgressPct, stepModuleIndex } from './core/appNavigation';
import { DEFAULT_LOCALE, getTranslations, type Locale, toggleLocale } from './core/i18n';

/**
 * ViewModel for the top-level App shell.
 * Manages locale, active module index, presentation mode, and keyboard shortcuts.
 */
export function useAppViewModel() {
  const [lang, setLang] = useState<Locale>(DEFAULT_LOCALE);
  const [activeModule, setActiveModule] = useState(0);
  const [presMode, setPresMode] = useState(false);

  const t = getTranslations(lang);
  const progressPct = computeProgressPct(activeModule, t.modules.length);
  const subtitles = [t.m1.subtitle, t.m2.subtitle, t.m3.subtitle, t.m4.subtitle, t.m5.subtitle];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActiveModule((m) => stepModuleIndex(m, 1));
      else if (e.key === 'ArrowLeft') setActiveModule((m) => stepModuleIndex(m, -1));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return {
    lang,
    t,
    activeModule,
    presMode,
    progressPct,
    activeTitle: t.modules[activeModule].title,
    activeSubtitle: subtitles[activeModule],
    selectModule: setActiveModule,
    prevModule: () => setActiveModule((m) => stepModuleIndex(m, -1)),
    nextModule: () => setActiveModule((m) => stepModuleIndex(m, 1)),
    toggleLang: () => setLang((prev) => toggleLocale(prev)),
    togglePresMode: () => setPresMode((prev) => !prev),
  };
}
