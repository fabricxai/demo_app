import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Monitor, Sparkles, X, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';

interface MobileWorkspaceNoticeProps {
  onOpenFabricAI: () => void;
}

export function MobileWorkspaceNotice({ onOpenFabricAI }: MobileWorkspaceNoticeProps) {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-lg rounded-xl border border-white/10 bg-[#0D1117]/95 backdrop-blur-xl shadow-2xl shadow-black/40">
        <div className="flex items-start gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#57ACAF]/15 border border-[#57ACAF]/30">
            <Monitor className="h-5 w-5 text-[#57ACAF]" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">Better on desktop</p>
            <p className="text-xs text-[#6F83A7] mt-1 leading-relaxed">
              FabricXAI’s ERP layout—boards, tables, and{' '}
              <span className="text-[#57ACAF]/90">right-hand detail drawers</span>—is tuned for PC and laptop screens.
              You can still sign up and chat with FabricXAI below.
            </p>
            <div className="flex flex-col gap-2 mt-3">
              <Button
                size="sm"
                className="w-full bg-[#57ACAF] text-[#0D1117] hover:bg-[#57ACAF]/90 font-medium"
                onClick={() => navigate('/signup')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create account
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                onClick={onOpenFabricAI}
              >
                <Sparkles className="h-4 w-4 mr-2 text-[#EAB308]" />
                Open FabricXAI chat
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="shrink-0 rounded-md p-1 text-[#6F83A7] hover:text-white hover:bg-white/10"
            aria-label="Dismiss notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
