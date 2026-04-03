import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Users, MapPin, Globe, Check, ArrowRight, ArrowLeft,
  Loader2, Upload, FileText, X, Sparkles, Brain, Target,
  Package, ShoppingBag, Zap, Shield, CheckCircle, Settings,
  Factory, TrendingUp, BarChart3, Briefcase, Mail, Send
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { useIsMobileErpLayout } from '../../hooks/useMediaQuery';
import { MobileSignupBlocked } from '../auth/MobileSignupBlocked';
import { buildDemoPayload, submitDemoRequest } from '../../utils/demoRequest';
import { isValidEmail } from '../../utils/auth';

interface CompanySignupProps {
  onComplete?: () => void;
}

export function CompanySignup({ onComplete }: CompanySignupProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobileErpLayout();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [demoEarlyName, setDemoEarlyName] = useState('');
  const [demoEarlyEmail, setDemoEarlyEmail] = useState('');
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  
  // Step 1 - Company Info
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  
  // Step 2 - Contact & Location
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  
  // Step 3 - Business Details
  const [businessType, setBusinessType] = useState('');
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [monthlyVolume, setMonthlyVolume] = useState('');
  const [currentChallenges, setCurrentChallenges] = useState('');
  
  // Step 4 - Module Selection
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'lead-management',
    'rfq-quotation',
    'production-planning'
  ]);
  
  // File uploads
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { number: 1, title: 'Company Info', icon: Building2, color: '#57ACAF' },
    { number: 2, title: 'Your Details', icon: Users, color: '#EAB308' },
    { number: 3, title: 'Business Profile', icon: Factory, color: '#57ACAF' },
    { number: 4, title: 'Select Modules', icon: Package, color: '#EAB308' },
  ];

  const modules = [
    { id: 'lead-management', name: 'Lead Management', icon: Target, desc: 'CRM & Lead Tracking', popular: true },
    { id: 'buyer-management', name: 'Buyer Management', icon: ShoppingBag, desc: 'Customer Relations' },
    { id: 'rfq-quotation', name: 'RFQ & Quotation', icon: FileText, desc: 'Quote Management', popular: true },
    { id: 'costing', name: 'Costing', icon: BarChart3, desc: 'Cost Analysis' },
    { id: 'production-planning', name: 'Production Planning', icon: Factory, desc: 'Production Schedules', popular: true },
    { id: 'quality-control', name: 'Quality Control', icon: CheckCircle, desc: 'QC & Inspections' },
    { id: 'supplier-evaluation', name: 'Supplier Evaluation', icon: TrendingUp, desc: 'Supplier Management' },
    { id: 'inventory', name: 'Inventory', icon: Package, desc: 'Stock Management' },
  ];

  const handleNext = () => {
    // Validation
    if (currentStep === 1 && (!companyName || !industry || !companySize)) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (currentStep === 2 && (!fullName || !jobTitle || !country)) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (currentStep === 3 && (!businessType || productTypes.length === 0)) {
      toast.error('Please select your business type and product categories');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setCompletedSteps([...completedSteps, currentStep]);
      setIsProcessing(false);
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }, 1000);
  };

  const handleBack = () => {
    const newStep = Math.max(1, currentStep - 1);
    setCurrentStep(newStep);
    setCompletedSteps(completedSteps.filter(step => step < newStep));
  };

  const handleComplete = () => {
    toast.success('🎉 Welcome to fabricXai! Setting up your workspace...');
    setTimeout(() => {
      if (onComplete) onComplete();
      else navigate('/login');
    }, 2000);
  };

  const handleRequestDemoFromCompanyStep = async () => {
    if (!companyName.trim() || !industry || !companySize) {
      toast.error('Add company name, industry, and size first.');
      return;
    }
    if (!demoEarlyName.trim() || !demoEarlyEmail.trim()) {
      toast.error('Add your name and work email for the demo request.');
      return;
    }
    if (!isValidEmail(demoEarlyEmail)) {
      toast.error('Please enter a valid email.');
      return;
    }
    setDemoSubmitting(true);
    try {
      const industryLabel =
        industry === 'apparel'
          ? 'Apparel Manufacturing'
          : industry === 'textiles'
            ? 'Textile Manufacturing'
            : industry;
      const payload = buildDemoPayload({
        fullName: demoEarlyName,
        email: demoEarlyEmail,
        companyName,
        jobTitle: '—',
        companySize,
        industry: industryLabel,
        location: '—',
        useCase: 'Early demo request from company signup (step 1)',
        notes: companyWebsite ? `Website: ${companyWebsite}` : '',
      });
      const res = await submitDemoRequest(payload);
      if (!res.ok) throw new Error('failed');
      toast.success('Request sent — check your email for credentials when approved.');
      setDemoEarlyName('');
      setDemoEarlyEmail('');
    } catch {
      toast.error('Could not submit demo request. Try again.');
    } finally {
      setDemoSubmitting(false);
    }
  };

  if (isMobile) {
    return <MobileSignupBlocked />;
  }

  const getStepStatus = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  };

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleProductType = (type: string) => {
    setProductTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
      toast.success(`${fileArray.length} file(s) uploaded`);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#101725] to-[#0A0F1C] overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#57ACAF]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#EAB308]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative px-8 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-[#EAB308]/20 to-[#57ACAF]/20 text-white border border-[#EAB308]/30 px-4 py-2 mb-6">
              <Settings className="w-4 h-4 inline mr-2" />
              Company Setup
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome to fabricXai
            </h1>
            <p className="text-xl text-[#6F83A7]">
              Let's set up your company profile in 4 simple steps
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {steps.map((step) => {
                const Icon = step.icon;
                const status = getStepStatus(step.number);
                const isActive = status === 'active';
                const isCompleted = status === 'completed';

                return (
                  <div key={step.number} className="relative">
                    <div className={`
                      relative overflow-hidden rounded-2xl p-5 transition-all duration-300 border
                      ${isCompleted 
                        ? 'bg-gradient-to-br from-[#57ACAF]/15 to-[#57ACAF]/5 border-[#57ACAF]/50' 
                        : isActive
                        ? 'border-2 bg-gradient-to-br from-white/10 to-white/[0.02] shadow-lg'
                        : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 opacity-50'
                      }
                    `}
                    style={isActive ? { 
                      borderColor: step.color,
                      boxShadow: `0 12px 24px -8px ${step.color}40`
                    } : {}}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                          style={isActive ? {
                            background: `linear-gradient(135deg, ${step.color}, ${step.color}CC)`,
                            color: 'white'
                          } : isCompleted ? {
                            background: `${step.color}20`,
                            color: step.color
                          } : {
                            background: 'rgba(255,255,255,0.05)',
                            color: '#6F83A7'
                          }}
                        >
                          {isCompleted ? <Check className="w-5 h-5" /> : step.number}
                        </div>
                        {isActive && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-2 h-2 rounded-full"
                            style={{ background: step.color }}
                          />
                        )}
                      </div>
                      <div 
                        className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center"
                        style={isActive || isCompleted ? {
                          background: `${step.color}20`
                        } : {
                          background: 'rgba(255,255,255,0.05)'
                        }}
                      >
                        <Icon 
                          className="w-6 h-6"
                          style={{ color: isActive || isCompleted ? step.color : '#6F83A7' }}
                        />
                      </div>
                      <h3 className={`font-medium ${isActive || isCompleted ? 'text-white' : 'text-[#6F83A7]'}`}>
                        {step.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Overall Progress</span>
                <Badge className="bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30">
                  Step {currentStep} of 4
                </Badge>
              </div>
              <Progress value={progress} className="h-2 bg-white/10" />
            </div>
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {/* Step 1 - Company Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 shadow-2xl shadow-[#57ACAF]/30 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Company Information</h2>
                    <p className="text-[#6F83A7]">Tell us about your business</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Company Name *</Label>
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Your Company Ltd."
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Company Website</Label>
                      <Input
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        placeholder="www.yourcompany.com"
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Industry *</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apparel">Apparel Manufacturing</SelectItem>
                          <SelectItem value="textiles">Textile Manufacturing</SelectItem>
                          <SelectItem value="fashion">Fashion & Design</SelectItem>
                          <SelectItem value="accessories">Garment Accessories</SelectItem>
                          <SelectItem value="retail">Retail & Distribution</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Company Size *</Label>
                      <Select value={companySize} onValueChange={setCompanySize}>
                        <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="500+">500+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-xl p-5 flex items-start gap-3">
                    <Shield className="w-6 h-6 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">Data Privacy</p>
                      <p className="text-sm text-[#6F83A7]">
                        Your information is encrypted and secured with enterprise-grade security.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#EAB308]/25 bg-gradient-to-br from-[#EAB308]/10 to-transparent p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-[#EAB308]" />
                      <h3 className="text-white font-semibold">Request demo access</h3>
                    </div>
                    <p className="text-sm text-[#6F83A7]">
                      Prefer to try the workspace before finishing setup? We’ll email login credentials after we
                      review your company details above.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Your name *</Label>
                        <Input
                          value={demoEarlyName}
                          onChange={(e) => setDemoEarlyName(e.target.value)}
                          placeholder="Your full name"
                          className="h-11 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Work email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                          <Input
                            type="email"
                            value={demoEarlyEmail}
                            onChange={(e) => setDemoEarlyEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="h-11 pl-10 bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={demoSubmitting}
                      onClick={handleRequestDemoFromCompanyStep}
                      className="border-[#EAB308]/40 text-[#EAB308] hover:bg-[#EAB308]/10"
                    >
                      {demoSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Request demo access (email credentials)
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 - Contact & Location */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 shadow-2xl shadow-[#EAB308]/30 flex items-center justify-center">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Your Details</h2>
                    <p className="text-[#6F83A7]">Contact information and location</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Full Name *</Label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Job Title *</Label>
                      <Input
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="CEO, Manager, Director..."
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Phone Number</Label>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Country *</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="bd">Bangladesh</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="cn">China</SelectItem>
                          <SelectItem value="vn">Vietnam</SelectItem>
                          <SelectItem value="pk">Pakistan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">City</Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City name"
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Address</Label>
                    <Textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, building number..."
                      className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] resize-none"
                    />
                  </div>

                  <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl p-5 flex items-start gap-3">
                    <Globe className="w-6 h-6 text-[#EAB308] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">Global Support</p>
                      <p className="text-sm text-[#6F83A7]">
                        fabricXai supports multi-location businesses with localized features.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 - Business Details */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 shadow-2xl shadow-[#57ACAF]/30 flex items-center justify-center">
                    <Factory className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Business Profile</h2>
                    <p className="text-[#6F83A7]">Help us understand your operations</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-white">Business Type *</Label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturer">Manufacturer</SelectItem>
                        <SelectItem value="supplier">Supplier/Vendor</SelectItem>
                        <SelectItem value="buyer">Buyer/Brand</SelectItem>
                        <SelectItem value="both">Manufacturer & Supplier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">Product Categories * (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'T-Shirts & Tops',
                        'Denim & Jeans',
                        'Activewear',
                        'Formal Wear',
                        'Kids Wear',
                        'Home Textiles',
                        'Accessories',
                        'Other'
                      ].map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleProductType(type)}
                          className={`
                            p-4 rounded-xl border transition-all text-left
                            ${productTypes.includes(type)
                              ? 'bg-[#57ACAF]/20 border-[#57ACAF] text-white'
                              : 'bg-white/5 border-white/10 text-[#6F83A7] hover:bg-white/10'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{type}</span>
                            {productTypes.includes(type) && (
                              <Check className="w-4 h-4 text-[#57ACAF]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Monthly Production Volume</Label>
                    <Select value={monthlyVolume} onValueChange={setMonthlyVolume}>
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select volume range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<1000">Less than 1,000 units</SelectItem>
                        <SelectItem value="1000-5000">1,000 - 5,000 units</SelectItem>
                        <SelectItem value="5000-10000">5,000 - 10,000 units</SelectItem>
                        <SelectItem value="10000-50000">10,000 - 50,000 units</SelectItem>
                        <SelectItem value=">50000">50,000+ units</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Current Challenges (Optional)</Label>
                    <Textarea
                      value={currentChallenges}
                      onChange={(e) => setCurrentChallenges(e.target.value)}
                      placeholder="What are your biggest operational challenges? This helps us customize your experience..."
                      className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] resize-none"
                    />
                  </div>

                  <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-xl p-5 flex items-start gap-3">
                    <Brain className="w-6 h-6 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">AI Personalization</p>
                      <p className="text-sm text-[#6F83A7]">
                        MARBIM uses this information to provide tailored recommendations and insights.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4 - Module Selection */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 shadow-2xl shadow-[#EAB308]/30 flex items-center justify-center">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Select Your Modules</h2>
                    <p className="text-[#6F83A7]">Choose modules to activate (you can add more later)</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {modules.map((module) => {
                      const Icon = module.icon;
                      const isSelected = selectedModules.includes(module.id);
                      return (
                        <motion.button
                          key={module.id}
                          onClick={() => toggleModule(module.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            relative p-5 rounded-2xl border transition-all text-left overflow-hidden
                            ${isSelected
                              ? 'bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/5 border-[#57ACAF] shadow-lg shadow-[#57ACAF]/20'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }
                          `}
                        >
                          {module.popular && (
                            <Badge className="absolute top-3 right-3 bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30 text-xs">
                              Popular
                            </Badge>
                          )}
                          <div className="flex items-start gap-4">
                            <div className={`
                              w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                              ${isSelected ? 'bg-[#57ACAF]/20' : 'bg-white/5'}
                            `}>
                              <Icon 
                                className="w-6 h-6"
                                style={{ color: isSelected ? '#57ACAF' : '#6F83A7' }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className={`font-medium ${isSelected ? 'text-white' : 'text-[#6F83A7]'}`}>
                                  {module.name}
                                </h3>
                                {isSelected && (
                                  <Check className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-[#6F83A7]">{module.desc}</p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#57ACAF]/10 border border-[#EAB308]/20 rounded-xl p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <Sparkles className="w-6 h-6 text-[#EAB308] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white font-medium mb-1">Selected: {selectedModules.length} Modules</p>
                        <p className="text-sm text-[#6F83A7]">
                          All modules include AI-powered features, real-time analytics, and seamless integration.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#6F83A7]">
                      <Zap className="w-4 h-4 text-[#EAB308]" />
                      <span>Free 30-day trial for all modules • No credit card required</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1}
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 px-8 py-6 text-base"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={isProcessing}
              className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black px-10 py-6 text-base shadow-lg shadow-[#EAB308]/30"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : currentStep === 4 ? (
                <>
                  Complete Setup
                  <CheckCircle className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
