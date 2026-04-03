import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  Globe,
  Shield,
  Zap,
  Brain,
  AlertCircle,
  Rocket,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { fabricxaiLogoDark } from "../../config/branding";
import { signIn, signInWithDemo, isValidEmail } from "../../utils/auth";
import { showDemoCredentialsPanel } from "../../config/demoAccounts";
import { DemoCredentialsPanel } from "../auth/DemoCredentialsPanel";
import { useIsMobileErpLayout } from "../../hooks/useMediaQuery";
import { MobileFabricLanding } from "../auth/MobileFabricLanding";

// Form error state
interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobileErpLayout();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Error states
  const [errors, setErrors] = useState<FormErrors>({});

  // Clear error when user starts typing
  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await signIn({ email, password });

      if (result.success) {
        toast.success("Welcome back!");
        navigate("/");
      } else {
        setErrors({
          general: result.error.error,
        });
        if (result.error.hint) {
          toast.error(result.error.hint);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({
        general: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goDemoRequest = () => navigate("/demo-request");
  const goSignup = () => navigate("/signup");

  const handleDemoAdminSignIn = async () => {
    setErrors({});
    setIsLoading(true);
    try {
      const result = await signInWithDemo();
      if (result.success) {
        toast.success("Welcome back!");
        navigate("/");
      } else {
        setErrors({ general: result.error.error });
        if (result.error.hint) {
          toast.error(result.error.hint);
        }
      }
    } catch {
      setErrors({ general: "Demo sign-in failed. Try again or use the form." });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      text: "AI-Powered Intelligence",
      color: "#EAB308",
    },
    {
      icon: Zap,
      text: "14 Integrated Modules",
      color: "#57ACAF",
    },
    {
      icon: Shield,
      text: "Enterprise-Grade Security",
      color: "#EAB308",
    },
    {
      icon: Globe,
      text: "Multi-Location Support",
      color: "#57ACAF",
    },
  ];

  if (isMobile) {
    return (
      <MobileFabricLanding
        logoImage={fabricxaiLogoDark}
        email={email}
        password={password}
        showPassword={showPassword}
        setEmail={setEmail}
        setPassword={setPassword}
        setShowPassword={setShowPassword}
        errors={errors}
        clearError={clearError}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onMarbimSignup={goDemoRequest}
        onDesktopSignupInfo={() =>
          toast.info(
            "Open this site on a PC or laptop to complete full company signup—business profile, modules, and the complete ERP workspace.",
            { duration: 6500 },
          )
        }
        features={features}
        afterForm={
          showDemoCredentialsPanel() ? (
            <DemoCredentialsPanel
              compact
              onFillForm={(e, p) => {
                setEmail(e);
                setPassword(p);
                clearError("email");
                clearError("password");
                toast.success("Filled — tap Sign in");
              }}
              onSignInAsAdmin={handleDemoAdminSignIn}
              isLoading={isLoading}
            />
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#101725] to-[#0A0F1C] overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#57ACAF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#EAB308]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#57ACAF]/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
        {/* UPDATED DESIGN - Version 2.0 */}
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Branding & Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            {/* Logo & Title */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 mb-2">
                  <img
                    src={fabricxaiLogoDark}
                    alt="FabricXAI"
                    className="h-10 sm:h-11 w-auto max-w-[min(100%,300px)] object-contain object-left"
                  />
                  <div className="hidden sm:block h-11 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent shrink-0" />
                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-white">
                      Garments
                    </h1>
                    <p className="text-xs text-[#6F83A7] uppercase tracking-wider">
                      Intelligent Platform
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-5"
              >
                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20 px-4 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                  AI-Powered ERP Platform
                </Badge>

                <h2 className="text-5xl xl:text-6xl font-bold text-white leading-[1.1]">
                  Transform Your
                  <span className="block mt-3 bg-gradient-to-r from-[#57ACAF] via-[#EAB308] to-[#57ACAF] bg-clip-text text-transparent">
                    Garment Business with AI
                  </span>
                </h2>

                <p className="text-lg text-[#6F83A7] leading-relaxed max-w-xl">
                  A robust platform with 14 tailored modules and
                  22 AI agents to revolutionize garment operations,
                  built to streamline operations, improve
                  efficiency, increase margins, and fuel
                  sustainable growth
                </p>
              </motion.div>
            </div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 group overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${feature.color}08, transparent)`,
                      }}
                    />
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${feature.color}30, ${feature.color}15)`,
                        }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: feature.color }}
                        />
                      </div>
                      <p className="text-white font-semibold mb-1">
                        {feature.text}
                      </p>
                      <div
                        className="h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-full"
                        style={{
                          background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Side - Login/Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8 flex items-center justify-center"
            >
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#57ACAF]/10 via-[#57ACAF]/5 to-[#EAB308]/10 border border-white/10">
                <div className="relative">
                  <Shield className="w-5 h-5 text-[#57ACAF]" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#EAB308] rounded-full animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">
                    AI-Monitored Data Security
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#57ACAF] animate-pulse" />
                </div>
              </div>
            </motion.div>

            {/* Form Container */}
            <div className="relative bg-gradient-to-br from-white/[0.12] to-white/[0.03] backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#57ACAF]/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#EAB308]/10 rounded-full blur-3xl -z-10" />

              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Sign in</h2>
                <p className="text-sm text-[#6F83A7] mt-1">
                  New organization?{" "}
                  <button type="button" onClick={goDemoRequest} className="text-[#57ACAF] hover:underline font-medium">
                    Request demo access
                  </button>
                  {" · "}
                  <button type="button" onClick={goSignup} className="text-[#57ACAF] hover:underline font-medium">
                    Full company signup (desktop)
                  </button>
                </p>
              </div>

              {showDemoCredentialsPanel() ? (
                <DemoCredentialsPanel
                  className="mb-6"
                  onFillForm={(e, p) => {
                    setEmail(e);
                    setPassword(p);
                    clearError("email");
                    clearError("password");
                    toast.success("Credentials filled — press Sign in to workspace");
                  }}
                  onSignInAsAdmin={handleDemoAdminSignIn}
                  isLoading={isLoading}
                />
              ) : null}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Email Field */}
                <div className="space-y-2">
                  <Label className="text-white font-medium">
                    Work Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError('email');
                      }}
                      placeholder="you@company.com"
                      className={`pl-12 h-13 bg-white/[0.07] border-white/10 text-white placeholder:text-[#6F83A7]/60 focus:border-[#57ACAF] focus:bg-white/10 transition-all rounded-xl ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label className="text-white font-medium">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7] group-focus-within:text-[#57ACAF] transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError('password');
                      }}
                      placeholder="••••••••"
                      className={`pl-12 pr-12 h-13 bg-white/[0.07] border-white/10 text-white placeholder:text-[#6F83A7]/60 focus:border-[#57ACAF] focus:bg-white/10 transition-all rounded-xl ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6F83A7] hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#57ACAF] focus:ring-[#57ACAF] focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-[#6F83A7] group-hover:text-white transition-colors">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-[#57ACAF] hover:text-[#57ACAF]/80 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {errors.general && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.general}
                  </p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 text-base font-semibold shadow-2xl transition-all duration-300 rounded-xl bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-[#EAB308]/40 hover:shadow-[#EAB308]/60 hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Signing in…</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign in to workspace</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gradient-to-r from-transparent via-[#101725] to-transparent text-[#6F83A7]">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-white/10 bg-white/[0.05] text-white hover:bg-white/10 hover:border-white/20 transition-all rounded-xl"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-white/10 bg-white/[0.05] text-white hover:bg-white/10 hover:border-white/20 transition-all rounded-xl"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </Button>
                </div>

                {/* Demo Mode Button */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gradient-to-r from-transparent via-[#101725] to-transparent text-[#6F83A7]">
                      Quick Start
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={goDemoRequest}
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#6F83A7]/20 to-[#6F83A7]/10 hover:from-[#6F83A7]/30 hover:to-[#6F83A7]/20 text-white border border-[#6F83A7]/30 hover:border-[#6F83A7]/50 transition-all duration-300 rounded-xl"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Request demo access (email credentials)
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-[#6F83A7]">
                Company onboarding (profile + modules) is on{" "}
                <button
                  type="button"
                  onClick={goSignup}
                  className="text-[#57ACAF] hover:text-[#57ACAF]/80 transition-colors font-semibold"
                >
                  desktop signup
                </button>
                .
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-gradient-to-b from-transparent to-black/20 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#6F83A7]">
                Developed by{" "}
                <span className="text-white font-semibold">
                  SocioFi Technology
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <a
                  href="#privacy"
                  className="text-[#6F83A7] hover:text-[#57ACAF] transition-colors"
                >
                  Privacy Policy
                </a>
                <span className="text-white/20">|</span>
                <a
                  href="#terms"
                  className="text-[#6F83A7] hover:text-[#57ACAF] transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}