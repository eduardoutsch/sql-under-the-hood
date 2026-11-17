/**
 * Pure navigation helpers for the 5-module SQL seminar shell.
 * Keeps index bounds and progress bar math deterministic and decoupled from React/DOM.
 */

export const MODULE_COUNT = 5;

/**
 * Clamp a module index within [0, MODULE_COUNT - 1].
 */
export function clampModuleIndex(index: number): number {
  if (index < 0) return 0;
  if (index >= MODULE_COUNT) return MODULE_COUNT - 1;
  return index;
}

/**
 * Step the active module index by delta (-1 or +1) within valid bounds.
 */
export function stepModuleIndex(current: number, delta: number): number {
  return clampModuleIndex(current + delta);
}

/**
 * Compute seminar progress percentage in [0, 100].
 */
export function computeProgressPct(activeIndex: number, totalModules: number): number {
  if (totalModules <= 0) return 0;
  return ((activeIndex + 1) / totalModules) * 100;
}
