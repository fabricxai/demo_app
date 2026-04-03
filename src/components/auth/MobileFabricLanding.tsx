import { type FormEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  Monitor,
  MessageSquare,
  Bot,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { LucideIcon } from 'lucide-react';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

type Feature = { icon: LucideIcon; text: string; color: string };

interface MobileFabricLandingProps {
  logoImage: string;
  email: string;
  password: string;
  showPassword: boolean;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setShowPassword: (v: boolean) => void;
  errors: FormErrors;
  clearError: (field: keyof FormErrors) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  onMarbimSignup: () => void;
  onDesktopSignupInfo: () => void;
  features: Feature[];
  /** Optional block below the sign-in form (e.g. demo credentials). */
  afterForm?: ReactNode;
}

export function MobileFabricLanding({
  logoImage,
  email,
  password,
  showPassword,
  setEmail,
  setPassword,
  setShowPassword,
  errors,
  clearError,
  onSubmit,
  isLoading,
  onMarbimSignup,
  onDesktopSignupInfo,
  features,
  afterForm,
}: MobileFabricLandingProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-[#0A0F1C] via-[#101725] to-[#0A0F1C] relative overflow-hidden pb-[max(10rem,env(safe-area-inset-bottom))]">
      {/* Same background layers as desktop LoginPage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#57ACAF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#EAB308]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#57ACAF]/5 rounded-full blur-[100px]" />
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-0 w-full max-w-lg mx-auto pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(1.5rem,env(safe-area-inset-top))] pb-6">
        {/* Brand — clear hierarchy + safe tap spacing */}
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6 pb-6 border-b border-white/[0.08]"
        >
          <img
            src={logoImage}
            alt="FabricXAI"
            className="h-9 w-auto max-w-[min(100%,280px)] object-contain object-left"
          />
          <div className="min-w-0 sm:text-right">
            <h1 className="text-[1.875rem] font-bold text-white tracking-tight leading-[1.1]">Garments</h1>
            <p className="mt-1 text-[12px] font-semibold text-[#57ACAF] uppercase tracking-[0.16em]">
              Intelligent platform
            </p>
          </div>
        </motion.header>

        {/* Hero copy — grouped card for scanability on small screens */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[1.25rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm mb-7"
        >
          <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-[#57ACAF]/40 bg-[#57ACAF]/12 px-3.5 py-2 mb-5">
            <Sparkles className="h-4 w-4 shrink-0 text-[#57ACAF]" aria-hidden />
            <span className="text-[13px] font-semibold leading-tight text-[#57ACAF]">
              AI-Powered ERP Platform
            </span>
          </div>

          <h2 className="text-[2rem] font-bold leading-[1.08] tracking-tight text-white mb-4">
            Transform Your
            <span className="mt-1.5 block">
              <span className="text-[#57ACAF]">Garment </span>
              <span className="text-[#EAB308]">Business</span>
              <span className="text-[#57ACAF]"> with</span>
            </span>
            <span className="mt-1.5 block text-[#57ACAF]">AI</span>
          </h2>

          <p className="text-[15px] leading-[1.6] text-[#8FA3C4] text-pretty">
            A robust platform with 14 tailored modules and 22 AI agents to revolutionize garment operations—built to
            streamline workflows, improve efficiency, protect margins, and fuel sustainable growth.
          </p>
        </motion.section>

        {/* Feature tiles — 1 col on very narrow phones, 2 col from ~360px */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 mb-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="relative min-h-0 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                <div
                  className="mb-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}38, ${feature.color}15)`,
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: feature.color }} aria-hidden />
                </div>
                <p className="text-[15px] font-semibold leading-snug text-white">{feature.text}</p>
                <div
                  className="mt-3 h-0.5 w-11 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                  }}
                />
              </div>
            );
          })}
        </motion.div>

        {/* Sign in */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-white/12 bg-white/[0.06] backdrop-blur-xl p-5 shadow-xl"
        >
          <h3 className="text-white font-semibold mb-1">Welcome back</h3>
          <p className="text-xs text-[#6F83A7] mb-4">Sign in with the credentials we sent to your email.</p>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-white text-xs">Work email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError('email');
                  }}
                  placeholder="you@company.com"
                  className={`pl-10 h-11 bg-white/10 border-white/10 text-white rounded-xl text-sm ${errors.email ? 'border-red-500' : ''}`}
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-white text-xs">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError('password');
                  }}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 h-11 bg-white/10 border-white/10 text-white rounded-xl text-sm ${errors.password ? 'border-red-500' : ''}`}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F83A7]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
            </div>
            {errors.general && <p className="text-xs text-red-400">{errors.general}</p>}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#EAB308] text-black hover:bg-[#EAB308]/90 font-semibold rounded-xl text-sm"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          {afterForm ? <div className="mt-4">{afterForm}</div> : null}
        </motion.div>
      </div>

      {/* Fixed bottom notice */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0D1117]/95 backdrop-blur-xl px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.45)]">
        <div className="max-w-lg mx-auto space-y-3">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#57ACAF]/15 border border-[#57ACAF]/25">
              <Monitor className="w-4 h-4 text-[#57ACAF]" />
            </div>
            <p className="text-[11px] text-[#6F83A7] leading-relaxed pt-0.5">
              <span className="text-white/90 font-medium">Full ERP works best on desktop.</span> Boards, modules, and
              detail drawers are designed for PC or laptop. Complete{' '}
              <span className="text-[#57ACAF]">company signup</span> on a larger screen when you’re ready.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={onDesktopSignupInfo}
              variant="outline"
              size="sm"
              className="flex-1 border border-white/15 !bg-black dark:!bg-black !text-white hover:!text-white text-xs h-9 hover:!bg-white/10 dark:hover:!bg-white/10 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]"
            >
              Desktop signup
            </Button>
            <Button
              type="button"
              onClick={onMarbimSignup}
              size="sm"
              className="flex-1 flex gap-1.5 items-center justify-center bg-[#57ACAF] text-[#0D1117] hover:bg-[#57ACAF]/90 text-xs h-9 font-semibold"
            >
              <Bot className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Marbim AI signup</span>
            </Button>
          </div>
          <p className="text-[10px] text-[#6F83A7]/90 text-center flex items-center justify-center gap-1">
            <MessageSquare className="w-3 h-3 text-[#EAB308]" />
            Sign up here to talk with <span className="text-[#57ACAF]">Marbim AI</span> about FabricXAI—we’ll follow up
            by email.
          </p>
        </div>
      </div>
    </div>
  );
}
