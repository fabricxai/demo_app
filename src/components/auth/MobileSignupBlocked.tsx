import { useNavigate, useLocation } from 'react-router';
import { Monitor, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { MobileDemoRequestForm } from './MobileDemoRequestForm';
import { fabricxaiLogoDark } from '../../config/branding';

/**
 * Full company signup (multi-step profile + modules) is desktop-only.
 */
export function MobileSignupBlocked() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isProfileSetup = pathname.includes('profile-setup');
  const title = isProfileSetup ? 'Profile setup needs a larger screen' : 'Company signup needs a larger screen';
  const body = isProfileSetup
    ? 'Finish your company profile, team, and production details on a desktop or laptop. On mobile you can log in or request demo access below.'
    : 'Setting up your company, business profile, and modules is designed for desktop or laptop. On mobile you can log in if you already have access, or request a demo below—we’ll email credentials when ready.';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#101725] to-[#0A0F1C] px-4 py-10">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <img src={fabricxaiLogoDark} alt="FabricXAI" className="h-9 w-auto max-w-[220px] object-contain object-left" />
          <div>
            <h1 className="text-lg font-semibold text-white">FabricXAI</h1>
            <p className="text-xs text-[#6F83A7]">Garments intelligent platform</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 flex gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-[#EAB308]/15 flex items-center justify-center">
            <Monitor className="w-5 h-5 text-[#EAB308]" />
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-1">{title}</p>
            <p className="text-xs text-[#6F83A7] leading-relaxed">{body}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#57ACAF]" />
            <h2 className="text-white font-medium">Request demo access</h2>
          </div>
          <MobileDemoRequestForm />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full border-white/15 text-white hover:bg-white/10"
            onClick={() => navigate('/login')}
          >
            Already have access? Log in
          </Button>
        </div>
      </div>
    </div>
  );
}
