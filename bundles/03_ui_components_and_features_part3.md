# 03_ui_components_and_features_part3

> Generated snapshot containing 3 file(s).

## Table of Contents

- [`src/index.css`](#src-index-css)
- [`src/main.tsx`](#src-main-tsx)
- [`src/useAppViewModel.ts`](#src-useappviewmodel-ts)

---

## `src/index.css`

````css
@import "tailwindcss";

@layer base {
  body {
    font-family: 'Atkinson Hyperlegible', system-ui, -apple-system, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    letter-spacing: 0.01em;
    background-color: #f6f2ea;
    background-image:
      linear-gradient(to right, rgba(28, 25, 23, 0.045) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(28, 25, 23, 0.045) 1px, transparent 1px);
    background-size: 24px 24px;
    color: #1c1917;
  }

  code,
  pre,
  .font-mono {
    font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace;
    letter-spacing: 0.015em;
  }
}

@keyframes pulseRace {
  0% {
    left: 0%;
  }
  100% {
    left: calc(100% - 2rem);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes springIn {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes busFlow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 28px 0;
  }
}

@keyframes laneSweep {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(217, 78, 40, 0.35);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(217, 78, 40, 0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}

.animate-springIn {
  animation: springIn 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.animate-busFlow {
  background-image: repeating-linear-gradient(
    90deg,
    #d94e28 0px,
    #d94e28 10px,
    transparent 10px,
    transparent 18px
  );
  background-size: 28px 4px;
  animation: busFlow 0.7s linear infinite;
}

.animate-laneSweep {
  animation: laneSweep 1.3s ease-in-out infinite;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
````

## `src/main.tsx`

````tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
````

## `src/useAppViewModel.ts`

````typescript
import { useEffect, useState } from 'react';
import { computeProgressPct, stepModuleIndex } from './core/appNavigation';
import { DEFAULT_LOCALE, getTranslations, type Locale, toggleLocale } from './core/i18n';

/**
 * ViewModel for the top-level App shell.
 * Starts on the Home page (`activeModule === null`) and manages module navigation,
 * locale switching, presentation mode, and keyboard shortcuts.
 */
export function useAppViewModel() {
  const [lang, setLang] = useState<Locale>(DEFAULT_LOCALE);
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [presMode, setPresMode] = useState(false);

  const t = getTranslations(lang);
  const progressPct =
    activeModule === null ? 0 : computeProgressPct(activeModule, t.modules.length);
  const subtitles = [t.m1.subtitle, t.m2.subtitle, t.m3.subtitle, t.m4.subtitle, t.m5.subtitle];

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
    toggleLang: () => setLang((prev) => toggleLocale(prev)),
    togglePresMode: () => setPresMode((prev) => !prev),
  };
}
````
