import { useEffect, useState } from 'react';
import {
  computeExecutionMetrics,
  computeSurvivingIndices,
  DATASET_PRICES,
  type SimdLaneWidth,
  stepExecutionRace,
} from '../../core/volcanoSimd';

/**
 * ViewModel for Module 5 (Volcano Iterator vs. Vectorized SIMD Race).
 * Manages race timer, SIMD lane width, and derived cycle/selection-vector metrics.
 */
export function useVolcanoSimdViewModel() {
  const [simdLane, setSimdLane] = useState<SimdLaneWidth>(8);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ volcanoIdx: 0, simdIdx: 0 });

  useEffect(() => {
    if (!running) return;
    if (progress.volcanoIdx >= DATASET_PRICES.length && progress.simdIdx >= DATASET_PRICES.length) {
      setRunning(false);
      return;
    }
    const timer = setInterval(() => {
      setProgress((prev) => stepExecutionRace(prev, simdLane));
    }, 420);
    return () => clearInterval(timer);
  }, [running, progress.volcanoIdx, progress.simdIdx, simdLane]);

  const reset = () => {
    setRunning(false);
    setProgress({ volcanoIdx: 0, simdIdx: 0 });
  };

  const survivingIndices = computeSurvivingIndices(DATASET_PRICES, progress.simdIdx);
  const { volcanoCycles, simdCycles } = computeExecutionMetrics(
    progress.volcanoIdx,
    progress.simdIdx,
    simdLane
  );

  return {
    simdLane,
    running,
    progress,
    survivingIndices,
    volcanoCycles,
    simdCycles,
    step: () => setProgress((prev) => stepExecutionRace(prev, simdLane)),
    reset,
    toggleRunning: () => {
      if (progress.volcanoIdx >= DATASET_PRICES.length) reset();
      setRunning((prev) => !prev);
    },
    selectLaneWidth: (width: SimdLaneWidth) => {
      reset();
      setSimdLane(width);
    },
  };
}
