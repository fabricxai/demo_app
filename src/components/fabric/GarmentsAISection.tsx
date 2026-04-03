import { Sparkles } from 'lucide-react';
import { cn } from '../ui/utils';
import marbimLogoMark from '../../assets/marbim-logo.png';

export interface GarmentsAISectionProps {
  title: string;
  description?: string;
  bullets: string[];
  className?: string;
  onAskMarbim?: (prompt: string) => void;
  marbimPrompt: string;
}

/**
 * Consistent “garment ERP” AI insight block: industry bullets + MARBIM entry point.
 */
export function GarmentsAISection({
  title,
  description,
  bullets,
  className,
  onAskMarbim,
  marbimPrompt,
}: GarmentsAISectionProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#EAB308]/25 bg-gradient-to-br from-[#EAB308]/10 via-[#57ACAF]/5 to-transparent p-5 relative overflow-hidden',
        className,
      )}
    >
      {onAskMarbim && (
        <button
          type="button"
          onClick={() => onAskMarbim(marbimPrompt)}
          className="absolute top-3 right-3 p-0 bg-transparent border-0 cursor-pointer transition-transform hover:scale-105 z-10"
          title="Ask MARBIM"
        >
          <img src={marbimLogoMark} alt="" className="w-8 h-8 object-contain" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-3 pr-12">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#EAB308] to-[#57ACAF]">
          <Sparkles className="w-4 h-4 text-[#0D1117]" />
        </div>
        <h3 className="text-white text-sm font-semibold">{title}</h3>
      </div>
      {description ? <p className="text-xs text-[#6F83A7] mb-3">{description}</p> : null}
      <ul className="space-y-2 text-sm text-[#6F83A7] list-disc pl-4">
        {bullets.map((line, i) => (
          <li key={i} className="leading-snug">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
