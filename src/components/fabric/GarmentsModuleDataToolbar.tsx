import type { LucideIcon } from 'lucide-react';
import { Download, RefreshCw, Filter, Sparkles } from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { TOOLBAR_LABELS } from '../../config/garmentsIndustry';

export interface GarmentsModuleDataToolbarProps {
  className?: string;
  /** Shown above optional subtitle */
  title?: string;
  subtitle?: string;
  onAskMarbim?: (prompt: string) => void;
  askPrompt?: string;
  onExport?: () => void;
  exportLabel?: string;
  onRefresh?: () => void;
  onFilter?: () => void;
  filterLabel?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export function GarmentsModuleDataToolbar({
  className,
  title,
  subtitle,
  onAskMarbim,
  askPrompt,
  onExport,
  exportLabel = TOOLBAR_LABELS.exportData,
  onRefresh,
  onFilter,
  filterLabel = TOOLBAR_LABELS.seasonFilter,
  primaryAction,
}: GarmentsModuleDataToolbarProps) {
  const PrimaryIcon = primaryAction?.icon;

  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between', className)}>
      {(title || subtitle) && (
        <div className="min-w-0">
          {title ? <h3 className="text-white font-medium tracking-tight">{title}</h3> : null}
          {subtitle ? <p className="text-sm text-[#6F83A7] mt-0.5">{subtitle}</p> : null}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {onFilter && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-[#6F83A7] border-white/10 hover:bg-white/5 hover:border-[#57ACAF]/40"
            onClick={onFilter}
          >
            <Filter className="w-4 h-4 mr-2" />
            {filterLabel}
          </Button>
        )}
        {onExport && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-[#6F83A7] border-white/10 hover:bg-white/5 hover:border-[#57ACAF]/40"
            onClick={onExport}
          >
            <Download className="w-4 h-4 mr-2" />
            {exportLabel}
          </Button>
        )}
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-[#6F83A7] border-white/10 hover:bg-white/5"
            onClick={onRefresh}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {TOOLBAR_LABELS.refresh}
          </Button>
        )}
        {onAskMarbim && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-[#EAB308]/35 text-[#EAB308] hover:bg-[#EAB308]/10"
            onClick={() => onAskMarbim(askPrompt ?? '')}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {TOOLBAR_LABELS.askMarbim}
          </Button>
        )}
        {primaryAction && (
          <Button
            type="button"
            size="sm"
            className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90"
            onClick={primaryAction.onClick}
          >
            {PrimaryIcon ? <PrimaryIcon className="w-3.5 h-3.5 mr-1.5" /> : null}
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
