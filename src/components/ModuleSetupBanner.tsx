import { Button } from './ui/button';
import { Sparkles, Rocket, TrendingUp } from 'lucide-react';

interface ModuleSetupBannerProps {
  moduleName: string;
  onSetupClick: () => void;
}

export function ModuleSetupBanner({ moduleName, onSetupClick }: ModuleSetupBannerProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#EAB308]/10 via-[#57ACAF]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6 mb-6">
      <div className="relative flex items-center justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/80 shadow-lg shadow-[#EAB308]/30 flex items-center justify-center flex-shrink-0">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium text-lg mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#EAB308]" />
              Set Up {moduleName} Module
            </h3>
            <p className="text-[#6F83A7] text-sm leading-relaxed">
              Learn how {moduleName} can transform your operations with AI-powered automation. Discover features, pricing, and get started in minutes.
            </p>
          </div>
        </div>

        <Button
          onClick={onSetupClick}
          className="relative bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 shadow-lg shadow-[#EAB308]/30 px-8 py-6 rounded-xl flex-shrink-0 transition-all hover:scale-105 overflow-hidden group"
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Pulsing glow for first-time users */}
          <div className="absolute inset-0 bg-[#EAB308]/40 blur-xl animate-pulse" />
          
          <div className="relative flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-semibold">Let MARBIM Guide You</span>
            <Rocket className="w-5 h-5 ml-1" />
          </div>
        </Button>
      </div>
    </div>
  );
}