import { type ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionPanelProps {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Collapsible hardware-manual drawer with smooth CSS grid-row expansion.
 * Keeps secondary explanations tucked away until the user chooses to inspect them.
 */
export function AccordionPanel({
  title,
  badge,
  defaultOpen = false,
  children,
}: AccordionPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-[#FFFDF8] border-2 border-stone-900 rounded-xl shadow-[3px_3px_0px_#1c1917] overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-[#EFE9DC]/80 hover:bg-[#EFE9DC] text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {badge && (
            <span className="px-2 py-0.5 rounded bg-[#1C1917] text-amber-300 font-mono text-xs font-bold shrink-0">
              {badge}
            </span>
          )}
          <span className="font-bold text-sm sm:text-base text-stone-900 truncate">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-stone-900 shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 sm:p-5 border-t-2 border-stone-900/15">{children}</div>
        </div>
      </div>
    </div>
  );
}
