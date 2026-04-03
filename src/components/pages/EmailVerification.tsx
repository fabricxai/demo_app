import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { supabase } from '../../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import { fabricxaiLogoLight } from '../../config/branding';

interface EmailVerificationProps {
  onVerified: (email: string, role: string, name: string, company: string) => void;
  onNavigateToLogin: () => void;
}

export function EmailVerification({ onVerified, onNavigateToLogin }: EmailVerificationProps) {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if Supabase has already handled the auth callback
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus('error');
          setErrorMessage(sessionError.message || 'Email verification failed');
          return;
        }

        if (session && session.user) {
          // Email already verified, user is authenticated
          const userMetadata = session.user.user_metadata || {};
          const fullName = userMetadata.full_name || session.user.email?.split('@')[0] || 'User';
          const companyName = userMetadata.company_name || 'My Company';
          const role = userMetadata.role || 'manager';

          // Store user profile
          const userProfile = {
            email: session.user.email!,
            fullName,
            companyName,
            role,
            phone: userMetadata.phone || '',
          };

          localStorage.setItem('fabricxai_user', JSON.stringify(userProfile));
          localStorage.setItem('fabricxai_token', session.access_token);

          setStatus('success');
          
          // Call the verified handler after a short delay
          setTimeout(() => {
            onVerified(
              session.user.email!,
              role,
              fullName,
              companyName
            );
          }, 1500);
          return;
        }

        // Try to get token from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type') || urlParams.get('type');

        if (accessToken && type === 'signup') {
          // Set the session from the token
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || '',
          });

          if (error) {
            console.error('Session set error:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Email verification failed');
            return;
          }

          if (data.session && data.user) {
            const userMetadata = data.user.user_metadata || {};
            const fullName = userMetadata.full_name || data.user.email?.split('@')[0] || 'User';
            const companyName = userMetadata.company_name || 'My Company';
            const role = userMetadata.role || 'manager';

            const userProfile = {
              email: data.user.email!,
              fullName,
              companyName,
              role,
              phone: userMetadata.phone || '',
            };

            localStorage.setItem('fabricxai_user', JSON.stringify(userProfile));
            localStorage.setItem('fabricxai_token', data.session.access_token);

            setStatus('success');
            
            setTimeout(() => {
              onVerified(
                data.user.email!,
                role,
                fullName,
                companyName
              );
            }, 1500);
          }
        } else {
          setStatus('error');
          setErrorMessage('Invalid verification link');
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Email verification failed');
      }
    };

    verifyEmail();
  }, [onVerified]);

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
          className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl p-8 lg:p-10 text-center"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="rounded-2xl bg-white px-6 py-3 shadow-lg">
              <img
                src={fabricxaiLogoLight}
                alt="FabricXAI"
                className="h-10 w-auto max-w-[min(100%,260px)] object-contain object-left"
              />
            </div>
            <p className="text-xs text-[#6F83A7] mt-3">Garments Intelligent Platform</p>
          </div>

          {/* Status Content */}
          {status === 'verifying' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Loader2 className="w-16 h-16 text-[#57ACAF] animate-spin" />
              </div>
              <div>
                <h2 className="text-2xl text-white mb-2">Verifying Your Email</h2>
                <p className="text-[#6F83A7]">Please wait while we verify your email address...</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-[#57ACAF]/20 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-[#57ACAF]" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl text-white mb-2">Email Verified!</h2>
                <p className="text-[#6F83A7]">Your email has been successfully verified. Redirecting you to the dashboard...</p>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-[#D0342C]/20 flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-[#D0342C]" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl text-white mb-2">Verification Failed</h2>
                <p className="text-[#6F83A7] mb-4">{errorMessage}</p>
                <p className="text-sm text-[#6F83A7]">
                  The verification link may have expired or is invalid. Please request a new verification email.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={onNavigateToLogin}
                  className="w-full h-12 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white"
                >
                  Go to Login
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

