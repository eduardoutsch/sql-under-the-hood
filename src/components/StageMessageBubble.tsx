import { MessageCircle, X } from 'lucide-react';
import type { ChatBubblePlacement } from '../core/queryPipeline';

export interface StageMessageBubbleProps {
  label: string;
  badge: string;
  title: string;
  body: string;
  open: boolean;
  placement: ChatBubblePlacement;
  onToggle: () => void;
}

/**
 * Floating icon-only trigger and animated speech bubble positioned above the
 * parent panel border so it never shifts or obscures centered module content.
 */
export function StageMessageBubble({
  label,
  badge,
  title,
  body,
  open,
  placement,
  onToggle,
}: StageMessageBubbleProps) {
  return (
    <div
      className={`mt-3 lg:mt-0 lg:absolute lg:z-30 flex flex-col gap-2 ${placement.alignClass} ${
        placement.side === 'left' ? 'lg:left-6 lg:items-start' : 'lg:right-16 lg:items-end'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={label}
        title={label}
        className="w-10 h-10 rounded-full bg-[#1C1917] hover:bg-stone-800 border-2 border-stone-900 shadow-[2px_2px_0px_#D94E28] text-amber-300 flex items-center justify-center transition cursor-pointer hover:scale-105"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {open && (
        <div
          role="status"
          className={`animate-springIn relative w-full lg:w-72 bg-[#FFFDF8] border-2 border-stone-900 shadow-[4px_4px_0px_#D94E28] rounded-2xl p-4 pr-10 ${
            placement.side === 'left' ? 'lg:rounded-tl-sm' : 'lg:rounded-tr-sm'
          }`}
        >
          <button
            type="button"
            onClick={onToggle}
            aria-label="Close stage note"
            className="absolute top-2.5 right-2.5 p-1 rounded-md hover:bg-[#EFE9DC] text-stone-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-xs font-mono font-bold text-[#B83B1D] uppercase tracking-wider">
            {badge} • {title}
          </div>
          <p className="text-sm sm:text-base text-stone-900 mt-1 leading-relaxed">{body}</p>
        </div>
      )}
    </div>
  );
}
