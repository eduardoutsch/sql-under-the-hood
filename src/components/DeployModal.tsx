import { Cloud } from 'lucide-react';
import type { TranslationBundle } from '../core/i18n';

export interface DeployModalProps {
  isOpen: boolean;
  t: TranslationBundle;
  onClose: () => void;
}

/**
 * Modal displaying Cloudflare Pages + Vite deployment instructions.
 */
export function DeployModal({ isOpen, t, onClose }: DeployModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] border-2 border-stone-900 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-[6px_6px_0px_#1c1917]">
        <div className="flex items-center justify-between border-b-2 border-stone-900 pb-3">
          <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-[#D94E28]" />
            {t.deployModal.title}
          </h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-[#EFE9DC] hover:bg-stone-200 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] text-xs font-mono font-semibold text-stone-900 cursor-pointer"
          >
            {t.deployModal.close}
          </button>
        </div>
        <div className="space-y-2.5 font-mono text-xs text-amber-100 bg-[#1C1917] p-4 rounded-lg border-2 border-stone-900">
          {t.deployModal.steps.map((stepText, idx) => (
            <div key={idx} className="leading-relaxed">
              {stepText}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
