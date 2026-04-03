import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, Lock, User, Building2, Phone, Eye, EyeOff,
  CheckCircle, ArrowRight, Sparkles, Shield, Zap,
  Users, Target, BarChart3, Award, Chrome
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { fabricxaiLogoDark } from '../../config/branding';

export function AuthPage() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    phone: '',
    role: ''
  });

  const features = [
    {
      icon: Zap,
      title: '8 AI Agent Modes',
      description: 'Autonomous workflows for every operation',
      color: '#57ACAF'
    },
    {
      icon: Target,
      title: '85% Time Saved',
      description: 'Let AI handle repetitive tasks',
      color: '#EAB308'
    },
    {
      icon: Users,
      title: '500+ Teams Trust Us',
      description: 'Join leading manufacturers worldwide',
      color: '#57ACAF'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant, encrypted data',
      color: '#EAB308'
    }
  ];

  const stats = [
    { value: '94%', label: 'Faster Response' },
    { value: '$47K', label: 'Avg Monthly Savings' },
    { value: '50+', label: 'Automated Workflows' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle authentication logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101725] via-[#182336] to-[#0A0F1C] flex">
      {/* Left Panel - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#57ACAF]/20 via-transparent to-[#EAB308]/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <img src={fabricxaiLogoDark} alt="FabricXAI" className="h-11 w-auto max-w-[260px] object-contain object-left" />
              <div>
                <div className="text-white font-bold text-2xl">MARBIM</div>
                <div className="text-[#6F83A7] text-sm">AI Agent Platform</div>
              </div>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Manufacturing Operations
              <span className="block bg-gradient-to-r from-[#57ACAF] to-[#EAB308] bg-clip-text text-transparent">
                Run on Autopilot
              </span>
            </h1>

            <p className="text-lg text-[#6F83A7] mb-12 leading-relaxed">
              Join 500+ garment manufacturers automating workflows with AI agents. From lead management to machine maintenance—MARBIM handles it all.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-4 backdrop-blur-xl"
                >
                  <div 
                    className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${feature.color}40, ${feature.color}10)` }}
                  >
                    <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                  </div>
                  <div className="text-white font-semibold text-sm mb-1">
                    {feature.title}
                  </div>
                  <div className="text-xs text-[#6F83A7]">
                    {feature.description}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-[#6F83A7]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Award key={i} className="w-4 h-4 fill-[#EAB308] text-[#EAB308]" />
              ))}
            </div>
            <p className="text-white text-sm mb-4 leading-relaxed">
              "MARBIM responded to 47 RFQs while I was in meetings. I just approved and they went out. This is transformational."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#EAB308] flex items-center justify-center text-lg">
                👩‍💼
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Sarah Chen</div>
                <div className="text-xs text-[#6F83A7]">Operations Director, Premium Textiles</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src={fabricxaiLogoDark} alt="FabricXAI" className="h-9 w-auto max-w-[220px] object-contain object-left mx-auto" />
              <div className="text-left">
                <div className="text-white font-bold text-xl">MARBIM</div>
                <div className="text-[#6F83A7] text-xs">AI Agent Platform</div>
              </div>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 xl:p-10 backdrop-blur-xl shadow-2xl">
            {/* Mode Tabs */}
            <div className="flex gap-2 mb-8 bg-white/5 rounded-xl p-1.5 border border-white/10">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 text-sm font-medium ${
                  authMode === 'signin'
                    ? 'bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/80 text-white shadow-lg'
                    : 'text-[#6F83A7] hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 text-sm font-medium ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/80 text-white shadow-lg'
                    : 'text-[#6F83A7] hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {authMode === 'signin' ? 'Welcome back' : 'Get started'}
              </h2>
              <p className="text-[#6F83A7]">
                {authMode === 'signin' 
                  ? 'Sign in to continue to your dashboard' 
                  : 'Create your account and start automating'}
              </p>
            </div>

            {/* Social Auth */}
            <div className="space-y-3 mb-8">
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 bg-white/5 py-6"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 bg-white/5 py-6"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gradient-to-r from-[#101725] via-[#182336] to-[#101725] px-4 text-[#6F83A7]">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {authMode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white text-sm">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white text-sm">
                      Company
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                      <Input
                        id="company"
                        type="text"
                        placeholder="Acme Garments"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] h-11"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] h-11"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white text-sm">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] h-11"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F83A7] hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {authMode === 'signup' && (
                  <p className="text-xs text-[#6F83A7] mt-1">
                    At least 8 characters with uppercase, lowercase, and numbers
                  </p>
                )}
              </div>

              {authMode === 'signin' && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#57ACAF] focus:ring-[#57ACAF] focus:ring-offset-0"
                    />
                    <span className="text-[#6F83A7]">Remember me</span>
                  </label>
                  <a href="#" className="text-[#57ACAF] hover:text-[#57ACAF]/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              {authMode === 'signup' && (
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-[#57ACAF] focus:ring-[#57ACAF] focus:ring-offset-0"
                    />
                    <span className="text-xs text-[#6F83A7] leading-relaxed">
                      I agree to the{' '}
                      <a href="#" className="text-[#57ACAF] hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-[#57ACAF] hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-[#57ACAF] focus:ring-[#57ACAF] focus:ring-offset-0"
                    />
                    <span className="text-xs text-[#6F83A7] leading-relaxed">
                      Send me product updates and marketing communications
                    </span>
                  </label>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white font-medium h-12 text-base shadow-lg shadow-[#57ACAF]/20"
              >
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {authMode === 'signup' && (
                <div className="flex items-start gap-2 p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                  <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-white leading-relaxed">
                    <span className="font-semibold">14-day free trial</span> with full access to all 8 AI agents. No credit card required.
                  </div>
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-[#6F83A7]">
                {authMode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signup')}
                      className="text-[#57ACAF] hover:text-[#57ACAF]/80 font-medium transition-colors"
                    >
                      Sign up for free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signin')}
                      className="text-[#57ACAF] hover:text-[#57ACAF]/80 font-medium transition-colors"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#6F83A7]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#57ACAF]" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
              <span>GDPR Ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
