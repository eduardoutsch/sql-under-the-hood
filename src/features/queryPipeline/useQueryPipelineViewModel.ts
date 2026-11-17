import { useEffect, useState } from 'react';
import type { Locale } from '../../core/i18n';
import {
  advancePipelineStage,
  getSqlTokens,
  getVdbeOpcodes,
  pickChatBubblePlacement,
  stepVmProgramCounter,
} from '../../core/queryPipeline';

/**
 * ViewModel for Module 1 (Query Pipeline).
 * Owns stage playback timer, execution target toggle, and VDBE program counter.
 */
export function useQueryPipelineViewModel(lang: Locale) {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [execTarget, setExecTarget] = useState<'sqlite' | 'jit'>('sqlite');
  const [vmPc, setVmPc] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [bubblePlacement] = useState(() => pickChatBubblePlacement());

  const tokens = getSqlTokens();
  const opcodes = getVdbeOpcodes(lang);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStage((prev) => {
        if (prev < 4) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return {
    stage,
    isPlaying,
    execTarget,
    vmPc,
    notesOpen,
    bubblePlacement,
    tokens,
    opcodes,
    setExecTarget,
    setVmPc,
    toggleNotes: () => setNotesOpen((prev) => !prev),
    selectStage: (idx: number) => {
      setIsPlaying(false);
      setStage(idx);
    },
    togglePlay: () => {
      if (stage === 4) setStage(0);
      setIsPlaying((prev) => !prev);
    },
    stepStage: () => {
      setIsPlaying(false);
      setStage((prev) => advancePipelineStage(prev));
    },
    stepVm: () => setVmPc((pc) => stepVmProgramCounter(pc, opcodes.length)),
    reset: () => {
      setIsPlaying(false);
      setStage(0);
      setVmPc(0);
    },
  };
}
