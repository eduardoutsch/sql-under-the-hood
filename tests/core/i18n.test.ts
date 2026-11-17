import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LOCALE,
  getTranslations,
  I18N,
  resolveInitialLocale,
  toggleLocale,
} from '../../src/core/i18n';

describe('i18n core dictionary and helpers', () => {
  it('defaults to en locale unless pt was previously stored', () => {
    expect(DEFAULT_LOCALE).toBe('en');
    expect(resolveInitialLocale(null)).toBe('en');
    expect(resolveInitialLocale('en')).toBe('en');
    expect(resolveInitialLocale('pt')).toBe('pt');
    expect(getTranslations('en').brandTitle).toBe('SQL Under the Hood');
  });

  it('provides complete English and Portuguese translations for all 5 modules', () => {
    expect(I18N.pt.modules).toHaveLength(5);
    expect(I18N.en.modules).toHaveLength(5);
    expect(I18N.pt.m1.stages).toHaveLength(5);
    expect(I18N.en.m1.stages).toHaveLength(5);
    expect(getTranslations('pt').brandTitle).toBe('SQL por Baixo dos Panos');
  });

  it('toggles cleanly between pt and en', () => {
    expect(toggleLocale('en')).toBe('pt');
    expect(toggleLocale('pt')).toBe('en');
  });
});
