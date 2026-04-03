import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Upload, FileText, Users, Factory, Package, Check, 
  ArrowRight, ArrowLeft, Loader2, X, Sparkles, Brain, Shield,
  Award, MapPin, Globe, Phone, Mail, Briefcase, Target,
  TrendingUp, BarChart3, ChevronRight, CheckCircle, Settings,
  AlertCircle, Camera, Plus, Minus, Edit2, Trash2, Image as ImageIcon
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

interface CompanyProfileSetupProps {
  onComplete?: () => void;
  onAskMarbim?: (prompt: string) => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface ProductionLine {
  id: string;
  lineType: string;
  capacity: string;
  machines: number;
}

interface CatalogItem {
  id: string;
  name: string;
  category: string;
  image?: File;
}

export function CompanyProfileSetup({
  onComplete = () => {},
  onAskMarbim = () => {},
}: CompanyProfileSetupProps) {
  const isMobile = useIsMobileErpLayout();
  const [currentStep, setCurrentStep] = useState(0); // 0 = Welcome screen
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Step 1 - Company Basics
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [yearEstablished, setYearEstablished] = useState('');
  const [numberOfEmployees, setNumberOfEmployees] = useState('');
  const [factoryArea, setFactoryArea] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  
  // Step 2 - Certifications
  const [certifications, setCertifications] = useState<File[]>([]);
  const [selectedCertTypes, setSelectedCertTypes] = useState<string[]>([]);
  
  // Step 3 - Key People
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: '', role: 'CEO', email: '', phone: '' }
  ]);
  
  // Step 4 - Production Capabilities
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([
    { id: '1', lineType: '', capacity: '', machines: 0 }
  ]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [moq, setMoq] = useState('');
  const [leadTime, setLeadTime] = useState('');
  
  // Step 5 - Product Catalog
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [bulkUploadFiles, setBulkUploadFiles] = useState<File[]>([]);
  
  // Refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const catalogInputRef = useRef<HTMLInputElement>(null);
  const bulkCatalogInputRef = useRef<HTMLInputElement>(null);

  const [marbimMessage, setMarbimMessage] = useState('');

  const steps = [
    { number: 0, title: 'Company Basics', icon: Building2, color: '#57ACAF', desc: 'Tell us about your company' },
    { number: 1, title: 'Certifications', icon: Award, color: '#EAB308', desc: 'Upload compliance documents' },
    { number: 2, title: 'Key People', icon: Users, color: '#57ACAF', desc: 'Add your team members' },
    { number: 3, title: 'Production', icon: Factory, color: '#EAB308', desc: 'Define your capabilities' },
    { number: 4, title: 'Catalog', icon: Package, color: '#57ACAF', desc: 'Showcase your products' },
  ];

  const certificationTypes = [
    'ISO 9001', 'ISO 14001', 'WRAP', 'BSCI', 'OEKO-TEX',
    'GOTS', 'Sedex', 'SA8000', 'LEED', 'BCI'
  ];

  const productCategories = [
    'T-Shirts & Tops', 'Denim & Jeans', 'Activewear', 'Formal Wear',
    'Kids Wear', 'Home Textiles', 'Accessories', 'Undergarments'
  ];

  // MARBIM Messages per step
  const getMarbimMessage = (step: number) => {
    const messages = [
      "Hi! I'm MARBIM, your AI assistant. I'll guide you through setting up your company profile. This will help buyers discover you and understand your capabilities. Ready to get started?",
      "Let me know about your company! I'll use this to create a professional profile. Don't worry about making it perfect - you can always update later.",
      "Certifications build trust with buyers! Upload any compliance documents you have. I can help identify what certifications might benefit your business.",
      "Who are the key people buyers should know about? Adding your leadership team makes your company more credible and personal.",
      "Now, let's showcase what you can produce! Tell me about your production lines, capacity, and specialties. I'll help buyers understand your manufacturing capabilities.",
      "Finally, let's build your product catalog! You can add items individually or upload in bulk. I'll help categorize them with AI."
    ];
    return messages[step] || '';
  };

  const handleNext = async () => {
    // Validation
    if (currentStep === 1 && !companyName) {
      toast.error('Please enter your company name');
      return;
    }
    if (currentStep === 3 && teamMembers.some(m => !m.name || !m.email)) {
      toast.error('Please fill in all team member details');
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCompletedSteps([...completedSteps, currentStep]);
    setIsProcessing(false);
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setMarbimMessage(getMarbimMessage(currentStep + 1));
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCompletedSteps(completedSteps.filter(step => step < currentStep - 1));
      setMarbimMessage(getMarbimMessage(currentStep - 1));
    }
  };

  const handleComplete = () => {
    toast.success('🎉 Company profile created! Now let\'s set up your modules...');
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyLogo(e.target.files[0]);
      toast.success('Logo uploaded');
    }
  };

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setCertifications(prev => [...prev, ...files]);
      toast.success(`${files.length} file(s) uploaded`);
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCertType = (type: string) => {
    setSelectedCertTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const addTeamMember = () => {
    setTeamMembers(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      role: '',
      email: '',
      phone: ''
    }]);
  };

  const removeTeamMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(prev => prev.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const addProductionLine = () => {
    setProductionLines(prev => [...prev, {
      id: Date.now().toString(),
      lineType: '',
      capacity: '',
      machines: 0
    }]);
  };

  const removeProductionLine = (id: string) => {
    if (productionLines.length > 1) {
      setProductionLines(prev => prev.filter(l => l.id !== id));
    }
  };

  const updateProductionLine = (id: string, field: keyof ProductionLine, value: string | number) => {
    setProductionLines(prev => prev.map(l =>
      l.id === id ? { ...l, [field]: value } : l
    ));
  };

  const toggleSpecialization = (spec: string) => {
    setSpecializations(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const addCatalogItem = () => {
    setCatalogItems(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      category: '',
    }]);
  };

  const removeCatalogItem = (id: string) => {
    setCatalogItems(prev => prev.filter(i => i.id !== id));
  };

  const updateCatalogItem = (id: string, field: keyof CatalogItem, value: string | File) => {
    setCatalogItems(prev => prev.map(i =>
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

  const handleBulkCatalogUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setBulkUploadFiles(files);
      toast.success(`${files.length} images uploaded - MARBIM will categorize them`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const progress = currentStep === 0 ? 0 : ((currentStep) / steps.length) * 100;

  if (isMobile) {
    return <MobileSignupBlocked />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#101725] to-[#0A0F1C] overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#57ACAF]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#EAB308]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="bg-gradient-to-r from-[#EAB308]/20 to-[#57ACAF]/20 text-white border border-[#EAB308]/30 px-4 py-2 mb-6">
              <Settings className="w-4 h-4 inline mr-2" />
              Company Profile Setup
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              Let's Build Your Profile
            </h1>
            <p className="text-xl text-[#6F83A7]">
              MARBIM will guide you through creating a complete company profile
            </p>
          </motion.div>

          {/* Progress (hidden on welcome screen) */}
          {currentStep > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <div className="grid grid-cols-5 gap-3 mb-4">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = completedSteps.includes(step.number);
                  const isActive = currentStep === step.number;
                  
                  return (
                    <div key={step.number} className="relative">
                      <div className={`
                        relative overflow-hidden rounded-xl p-4 transition-all duration-300 border
                        ${isCompleted 
                          ? 'bg-gradient-to-br from-[#57ACAF]/15 to-[#57ACAF]/5 border-[#57ACAF]/50' 
                          : isActive
                          ? 'border-2 bg-gradient-to-br from-white/10 to-white/[0.02] shadow-lg'
                          : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 opacity-50'
                        }
                      `}
                      style={isActive ? { 
                        borderColor: step.color,
                        boxShadow: `0 8px 16px -4px ${step.color}40`
                      } : {}}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
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
                            {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                          </div>
                          <Icon 
                            className="w-5 h-5"
                            style={{ color: isActive || isCompleted ? step.color : '#6F83A7' }}
                          />
                        </div>
                        <h3 className={`text-sm font-medium ${isActive || isCompleted ? 'text-white' : 'text-[#6F83A7]'}`}>
                          {step.title}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Overall Progress</span>
                  <Badge className="bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30 text-xs">
                    Step {currentStep} of 5
                  </Badge>
                </div>
                <Progress value={progress} className="h-1.5 bg-white/10" />
              </div>
            </motion.div>
          )}

          {/* MARBIM Assistant Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-br from-[#EAB308]/10 to-[#57ACAF]/10 backdrop-blur-xl border border-[#EAB308]/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 shadow-2xl shadow-[#EAB308]/30 flex items-center justify-center flex-shrink-0"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-bold text-lg">MARBIM</h3>
                  <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border border-[#57ACAF]/30 text-xs">
                    AI Assistant
                  </Badge>
                </div>
                <p className="text-white/90 leading-relaxed mb-3">
                  {marbimMessage || getMarbimMessage(currentStep)}
                </p>
                <Button
                  onClick={() => onAskMarbim(`I need help with step ${currentStep}: ${currentStep > 0 ? steps[currentStep - 1].title : 'getting started'}`)}
                  variant="outline"
                  size="sm"
                  className="border-[#EAB308]/30 bg-[#EAB308]/10 text-[#EAB308] hover:bg-[#EAB308]/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ask MARBIM for Help
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {/* Welcome Screen */}
            {currentStep === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-12"
              >
                <div className="text-center max-w-2xl mx-auto">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#EAB308] via-[#57ACAF] to-[#EAB308] shadow-2xl flex items-center justify-center mx-auto mb-8"
                  >
                    <Building2 className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Welcome to fabricXai!
                  </h2>
                  <p className="text-xl text-[#6F83A7] mb-8 leading-relaxed">
                    Let's create your company profile together. This helps buyers discover your business, understand your capabilities, and connect with you for opportunities.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-10">
                    {[
                      { icon: Sparkles, title: 'AI-Guided', desc: 'Smart suggestions at every step' },
                      { icon: Shield, title: 'Secure', desc: 'Your data is encrypted' },
                      { icon: TrendingUp, title: 'Grow', desc: 'Attract more buyers' }
                    ].map((feature, idx) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                          className="p-5 rounded-xl bg-white/5 border border-white/10"
                        >
                          <Icon className="w-8 h-8 text-[#57ACAF] mx-auto mb-3" />
                          <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                          <p className="text-sm text-[#6F83A7]">{feature.desc}</p>
                        </motion.div>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => {
                      setCurrentStep(1);
                      setMarbimMessage(getMarbimMessage(1));
                    }}
                    className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black px-10 py-6 text-lg shadow-2xl shadow-[#EAB308]/30"
                  >
                    Let's Get Started
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>

                  <p className="text-sm text-[#6F83A7] mt-6">
                    ⏱️ Takes about 10 minutes • You can save and continue later
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 1 - Company Basics */}
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
                    <h2 className="text-3xl font-bold text-white">Company Basics</h2>
                    <p className="text-[#6F83A7]">Essential information about your business</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label className="text-white">Company Logo</Label>
                    <div className="flex items-center gap-4">
                      <div 
                        onClick={() => logoInputRef.current?.click()}
                        className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center group"
                      >
                        {companyLogo ? (
                          <img 
                            src={URL.createObjectURL(companyLogo)} 
                            alt="Logo" 
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <Camera className="w-8 h-8 text-[#6F83A7] group-hover:text-white transition-colors" />
                        )}
                      </div>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <div>
                        <Button
                          onClick={() => logoInputRef.current?.click()}
                          variant="outline"
                          className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                        </Button>
                        <p className="text-xs text-[#6F83A7] mt-2">PNG or JPG, max 2MB</p>
                      </div>
                    </div>
                  </div>

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
                      <Label className="text-white">Tagline</Label>
                      <Input
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="Quality Garments Since 1995"
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Year Established</Label>
                      <Input
                        value={yearEstablished}
                        onChange={(e) => setYearEstablished(e.target.value)}
                        placeholder="1995"
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Number of Employees</Label>
                      <Input
                        value={numberOfEmployees}
                        onChange={(e) => setNumberOfEmployees(e.target.value)}
                        placeholder="500"
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Factory Area (sq ft)</Label>
                      <Input
                        value={factoryArea}
                        onChange={(e) => setFactoryArea(e.target.value)}
                        placeholder="50,000"
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Company Description</Label>
                    <Textarea
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      placeholder="Tell buyers about your company, expertise, values, and what makes you unique..."
                      className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] resize-none"
                    />
                    <Button
                      onClick={() => onAskMarbim('Help me write a compelling company description based on what I do')}
                      variant="ghost"
                      size="sm"
                      className="text-[#EAB308] hover:text-[#EAB308]/80 hover:bg-[#EAB308]/10"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Let MARBIM write this for me
                    </Button>
                  </div>

                  <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-xl p-4 flex items-start gap-3">
                    <Brain className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium mb-1">AI Tip</p>
                      <p className="text-xs text-[#6F83A7]">
                        A strong company description helps buyers understand your expertise and builds trust.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 - Certifications */}
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
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Certifications & Compliance</h2>
                    <p className="text-[#6F83A7]">Build trust with verified credentials</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-white">Select Your Certifications</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {certificationTypes.map((cert) => (
                        <button
                          key={cert}
                          onClick={() => toggleCertType(cert)}
                          className={`
                            p-4 rounded-xl border transition-all text-left
                            ${selectedCertTypes.includes(cert)
                              ? 'bg-[#EAB308]/20 border-[#EAB308] text-white'
                              : 'bg-white/5 border-white/10 text-[#6F83A7] hover:bg-white/10'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{cert}</span>
                            {selectedCertTypes.includes(cert) && (
                              <Check className="w-4 h-4 text-[#EAB308]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">Upload Certification Documents</Label>
                    <div
                      onClick={() => certInputRef.current?.click()}
                      className="border-2 border-dashed border-[#EAB308]/30 rounded-2xl p-8 text-center hover:border-[#EAB308]/50 transition-all bg-[#EAB308]/5 cursor-pointer group"
                    >
                      <input
                        ref={certInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleCertUpload}
                        className="hidden"
                      />
                      <Award className="w-12 h-12 text-[#EAB308] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-white font-medium mb-2">Drop files here or click to browse</h3>
                      <p className="text-sm text-[#6F83A7]">PDF, JPG, or PNG • Up to 10 files</p>
                    </div>
                  </div>

                  {certifications.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-white">Uploaded Files ({certifications.length})</Label>
                      {certifications.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-[#EAB308]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">{file.name}</p>
                              <p className="text-sm text-[#6F83A7]">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCertification(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium mb-1">Why Certifications Matter</p>
                      <p className="text-xs text-[#6F83A7]">
                        Certified manufacturers are 3x more likely to win RFQs from international buyers.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => onAskMarbim('What certifications should I pursue for my garment manufacturing business?')}
                    variant="outline"
                    className="w-full border-[#EAB308]/30 bg-[#EAB308]/10 text-[#EAB308] hover:bg-[#EAB308]/20"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ask MARBIM which certifications you need
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3 - Key People */}
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
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Key People</h2>
                    <p className="text-[#6F83A7]">Who should buyers connect with?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-white font-medium">Team Member {index + 1}</h3>
                        </div>
                        {teamMembers.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTeamMember(member.id)}
                            className="text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white text-sm">Full Name *</Label>
                          <Input
                            value={member.name}
                            onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                            placeholder="John Doe"
                            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white text-sm">Role/Title *</Label>
                          <Input
                            value={member.role}
                            onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                            placeholder="CEO, Sales Manager, etc."
                            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white text-sm">Email *</Label>
                          <Input
                            type="email"
                            value={member.email}
                            onChange={(e) => updateTeamMember(member.id, 'email', e.target.value)}
                            placeholder="john@company.com"
                            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white text-sm">Phone</Label>
                          <Input
                            value={member.phone}
                            onChange={(e) => updateTeamMember(member.id, 'phone', e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <Button
                    onClick={addTeamMember}
                    variant="outline"
                    className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 h-12"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Another Team Member
                  </Button>

                  <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium mb-1">Build Trust</p>
                      <p className="text-xs text-[#6F83A7]">
                        Showing your team helps buyers feel confident about working with you.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4 - Production Capabilities */}
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
                    <Factory className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Production Capabilities</h2>
                    <p className="text-[#6F83A7]">What can you manufacture?</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-white">Production Lines</Label>
                    {productionLines.map((line, index) => (
                      <motion.div
                        key={line.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-white/5 border border-white/10 rounded-xl space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                              <span className="text-[#EAB308] font-bold text-sm">{index + 1}</span>
                            </div>
                            <span className="text-white text-sm font-medium">Production Line {index + 1}</span>
                          </div>
                          {productionLines.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProductionLine(line.id)}
                              className="text-white/60 hover:text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Line Type</Label>
                            <Select 
                              value={line.lineType} 
                              onValueChange={(val) => updateProductionLine(line.id, 'lineType', val)}
                            >
                              <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="knit">Knit Garments</SelectItem>
                                <SelectItem value="woven">Woven Garments</SelectItem>
                                <SelectItem value="denim">Denim</SelectItem>
                                <SelectItem value="sweater">Sweater/Knitwear</SelectItem>
                                <SelectItem value="activewear">Activewear</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Monthly Capacity</Label>
                            <Input
                              value={line.capacity}
                              onChange={(e) => updateProductionLine(line.id, 'capacity', e.target.value)}
                              placeholder="50,000 pcs"
                              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white text-sm"># of Machines</Label>
                            <Input
                              type="number"
                              value={line.machines}
                              onChange={(e) => updateProductionLine(line.id, 'machines', parseInt(e.target.value) || 0)}
                              placeholder="100"
                              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <Button
                      onClick={addProductionLine}
                      variant="outline"
                      className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Production Line
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">Specializations</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Embroidery', 'Screen Printing', 'Digital Printing', 'Washing', 'Dyeing', 'Finishing'].map((spec) => (
                        <button
                          key={spec}
                          onClick={() => toggleSpecialization(spec)}
                          className={`
                            p-3 rounded-xl border transition-all text-sm
                            ${specializations.includes(spec)
                              ? 'bg-[#EAB308]/20 border-[#EAB308] text-white'
                              : 'bg-white/5 border-white/10 text-[#6F83A7] hover:bg-white/10'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{spec}</span>
                            {specializations.includes(spec) && (
                              <Check className="w-4 h-4 text-[#EAB308]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Minimum Order Quantity (MOQ)</Label>
                      <Input
                        value={moq}
                        onChange={(e) => setMoq(e.target.value)}
                        placeholder="500 pieces per design"
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Average Lead Time</Label>
                      <Input
                        value={leadTime}
                        onChange={(e) => setLeadTime(e.target.value)}
                        placeholder="45-60 days"
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>
                  </div>

                  <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl p-4 flex items-start gap-3">
                    <Target className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium mb-1">Match with Buyers</p>
                      <p className="text-xs text-[#6F83A7]">
                        Accurate production details help MARBIM match you with the right RFQs.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5 - Product Catalog */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 shadow-2xl shadow-[#57ACAF]/30 flex items-center justify-center">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Product Catalog</h2>
                    <p className="text-[#6F83A7]">Showcase what you make</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div
                      onClick={() => catalogInputRef.current?.click()}
                      className="border-2 border-dashed border-[#57ACAF]/30 rounded-xl p-8 text-center hover:border-[#57ACAF]/50 transition-all bg-[#57ACAF]/5 cursor-pointer group"
                    >
                      <input
                        ref={catalogInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                      <Plus className="w-10 h-10 text-[#57ACAF] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="text-white font-medium mb-1">Add Individual Product</h3>
                      <p className="text-xs text-[#6F83A7]">Upload one at a time</p>
                    </div>

                    <div
                      onClick={() => bulkCatalogInputRef.current?.click()}
                      className="border-2 border-dashed border-[#EAB308]/30 rounded-xl p-8 text-center hover:border-[#EAB308]/50 transition-all bg-[#EAB308]/5 cursor-pointer group"
                    >
                      <input
                        ref={bulkCatalogInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleBulkCatalogUpload}
                        className="hidden"
                      />
                      <ImageIcon className="w-10 h-10 text-[#EAB308] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="text-white font-medium mb-1">Bulk Upload</h3>
                      <p className="text-xs text-[#6F83A7]">Upload multiple at once</p>
                      <Badge className="mt-2 bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30 text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Categorization
                      </Badge>
                    </div>
                  </div>

                  {bulkUploadFiles.length > 0 && (
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/30 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <Brain className="w-6 h-6 text-[#EAB308]" />
                        <div>
                          <h3 className="text-white font-medium">MARBIM is Processing Your Images</h3>
                          <p className="text-sm text-[#6F83A7]">AI will categorize and tag your products automatically</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {bulkUploadFiles.slice(0, 8).map((file, index) => (
                          <div key={index} className="aspect-square rounded-lg bg-white/5 overflow-hidden">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      {bulkUploadFiles.length > 8 && (
                        <p className="text-sm text-[#6F83A7] mt-3 text-center">
                          +{bulkUploadFiles.length - 8} more products
                        </p>
                      )}
                    </div>
                  )}

                  {catalogItems.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-white">Your Products ({catalogItems.length})</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        {catalogItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 bg-white/5 border border-white/10 rounded-xl"
                          >
                            <div className="flex gap-3">
                              <div className="w-20 h-20 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                {item.image ? (
                                  <img 
                                    src={URL.createObjectURL(item.image)} 
                                    alt={item.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <Package className="w-8 h-8 text-[#6F83A7]" />
                                )}
                              </div>
                              <div className="flex-1 space-y-2">
                                <Input
                                  value={item.name}
                                  onChange={(e) => updateCatalogItem(item.id, 'name', e.target.value)}
                                  placeholder="Product name"
                                  className="h-9 bg-white/5 border-white/10 text-white text-sm"
                                />
                                <Select
                                  value={item.category}
                                  onValueChange={(val) => updateCatalogItem(item.id, 'category', val)}
                                >
                                  <SelectTrigger className="h-9 bg-white/5 border-white/10 text-white text-sm">
                                    <SelectValue placeholder="Category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {productCategories.map(cat => (
                                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCatalogItem(item.id)}
                                className="text-white/60 hover:text-white"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-xl p-4 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium mb-1">Stand Out to Buyers</p>
                      <p className="text-xs text-[#6F83A7]">
                        High-quality product images increase buyer interest by 85%. You can add more products later from your profile.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {currentStep > 0 && (
            <div className="flex items-center justify-between mt-8">
              <Button
                onClick={handleBack}
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 px-8 py-6 text-base"
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
                ) : currentStep === 5 ? (
                  <>
                    Complete Profile
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
          )}
        </div>
      </div>
    </div>
  );
}
