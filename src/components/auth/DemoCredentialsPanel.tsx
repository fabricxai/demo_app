import { Copy, UserCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { DEMO_ACCOUNTS } from '../../config/demoAccounts';
import { cn } from '../ui/utils';

type DemoCredentialsPanelProps = {
  className?: string;
  /** Tighter layout for mobile sign-in card */
  compact?: boolean;
  onFillForm: (email: string, password: string) => void;
  onSignInAsAdmin: () => void;
  isLoading?: boolean;
};

export function DemoCredentialsPanel({
  className,
  compact,
  onFillForm,
  onSignInAsAdmin,
  isLoading,
}: DemoCredentialsPanelProps) {
  const copyLine = (email: string, password: string) => {
    void navigator.clipboard.writeText(`${email} / ${password}`);
    toast.success('Copied email and password');
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-[#EAB308]/25 bg-[#EAB308]/10 p-4',
        compact && 'p-3',
        className,
      )}
    >
      <p className={cn('font-medium text-white', compact ? 'text-xs' : 'text-sm')}>
        Temporary demo sign-in
      </p>
      <p className={cn('mt-1 text-[#6F83A7]', compact ? 'text-[10px] leading-snug' : 'text-xs')}>
        Use after running{' '}
        <code className="rounded bg-black/30 px-1 py-0.5 text-[#EAB308]/90">create-demo-users</code> on your
        Supabase project, or create the same users in the Auth dashboard. Full company signup stays available below.
      </p>

      <ul className={cn('mt-3 space-y-2', compact && 'space-y-1.5')}>
        {DEMO_ACCOUNTS.map((row) => (
          <li
            key={row.email}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/20 px-2.5 py-2"
          >
            <div className="min-w-0 flex items-center gap-2">
              <UserCircle2 className={cn('shrink-0 text-[#57ACAF]', compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
              <div className="min-w-0">
                <p className={cn('truncate font-medium text-white', compact ? 'text-[11px]' : 'text-xs')}>
                  {row.label}{' '}
                  <span className="font-normal text-[#6F83A7]">({row.role})</span>
                </p>
                <p
                  className={cn(
                    'truncate font-mono text-[#9aacbe]',
                    compact ? 'text-[10px]' : 'text-[11px]',
                  )}
                >
                  {row.email}
                </p>
                <p className={cn('font-mono text-[#6F83A7]', compact ? 'text-[10px]' : 'text-[11px]')}>
                  Password: {row.password}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 border-white/15 px-2 text-[10px] text-white hover:bg-white/10"
                onClick={() => copyLine(row.email, row.password)}
              >
                <Copy className="mr-1 h-3 w-3" />
                Copy
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7 bg-white/10 px-2 text-[10px] text-white hover:bg-white/15"
                onClick={() => onFillForm(row.email, row.password)}
              >
                Fill form
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        disabled={isLoading}
        className={cn(
          'mt-3 w-full bg-[#EAB308] font-semibold text-black hover:bg-[#EAB308]/90',
          compact ? 'h-9 text-xs' : 'h-10 text-sm',
        )}
        onClick={onSignInAsAdmin}
      >
        {isLoading ? 'Signing in…' : 'Sign in as demo admin'}
      </Button>
    </div>
  );
}
