import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../../utils/supabase/client';
import { fabricxaiLogoLight } from '../../config/branding';

interface ForgotPasswordProps {
  onNavigateToLogin: () => void;
}

export function ForgotPassword({ onNavigateToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        toast.error(error.message || 'Failed to send password reset email');
        setIsLoading(false);
        return;
      }

      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send password reset email');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101725] to-[#182336] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-[#57ACAF]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#EAB308]/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl p-8 lg:p-10"
        >
          {/* Light-background wordmark (navy + gold) */}
          <div className="flex flex-col items-center mb-8">
            <div className="rounded-2xl bg-white px-6 py-3 shadow-lg">
              <img
                src={fabricxaiLogoLight}
                alt="FabricXAI"
                className="h-9 w-auto max-w-[min(100%,240px)] object-contain object-left"
              />
            </div>
            <p className="text-xs text-[#6F83A7] mt-3">Garments Intelligent Platform</p>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl text-white mb-2">
                {emailSent ? 'Check Your Email' : 'Reset Password'}
              </h2>
              <p className="text-[#6F83A7]">
                {emailSent
                  ? 'We sent a password reset link to your email address'
                  : "Enter your email address and we'll send you a link to reset your password"}
              </p>
            </div>

            {/* Email Sent Message */}
            {emailSent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-xl p-6 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="text-white font-semibold">Reset Link Sent</h3>
                    <p className="text-sm text-[#6F83A7]">
                      We've sent a password reset link to <strong className="text-white">{email}</strong>.
                      Please check your inbox and click the link to reset your password.
                    </p>
                    <p className="text-xs text-[#6F83A7]">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5"
                >
                  Use Different Email
                </Button>
              </motion.div>
            )}

            {/* Form */}
            {!emailSent && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]/20"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20 transition-all duration-180"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Back to login */}
            <Button
              type="button"
              onClick={onNavigateToLogin}
              variant="outline"
              className="w-full h-12 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] transition-all duration-180"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Login
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


