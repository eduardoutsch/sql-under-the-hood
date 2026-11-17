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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-amber-400" />
            {t.deployModal.title}
          </h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
          >
            {t.deployModal.close}
          </button>
        </div>
        <div className="space-y-2.5 font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
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
