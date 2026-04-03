import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, FileSpreadsheet, Users, CheckCircle, ArrowRight, ArrowLeft, 
  Loader2, X, Brain, Sparkles, Award, AlertTriangle, TrendingUp,
  Shield, Target, BarChart3, Package, FileText, Download, Plus,
  Minus, Edit2, Trash2, Check, Settings, Zap, Globe, Star,
  DollarSign, Clock, Truck, Factory, ChevronRight, ChevronDown,
  UserPlus, Building2, Heart, CreditCard, MessageSquare, Calendar,
  Phone, Mail, MapPin, ThumbsUp, Activity
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Switch } from '../ui/switch';

interface BuyerManagementSetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface BuyerData {
  id: string;
  name: string;
  country: string;
  tier: string;
  contact: string;
}

interface HealthMetric {
  id: string;
  name: string;
  weight: number;
  enabled: boolean;
}

interface AutomationFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export function BuyerManagementSetup({ onComplete, onClose, onAskMarbim }: BuyerManagementSetupProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Welcome
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Step 1 - Welcome & Overview
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Step 2 - Upload Buyer Database
  const [uploadMethod, setUploadMethod] = useState<'csv' | 'excel' | 'manual' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualBuyers, setManualBuyers] = useState<BuyerData[]>([
    { id: '1', name: '', country: '', tier: 'B', contact: '' }
  ]);
  const [importedBuyers, setImportedBuyers] = useState<number>(0);
  
  // Step 3 - Health Score Configuration
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    { id: '1', name: 'Payment Performance', weight: 30, enabled: true },
    { id: '2', name: 'Order Volume & Consistency', weight: 25, enabled: true },
    { id: '3', name: 'Communication Quality', weight: 15, enabled: true },
    { id: '4', name: 'Claim Resolution Speed', weight: 15, enabled: true },
    { id: '5', name: 'Relationship Duration', weight: 15, enabled: true },
  ]);
  
  // Step 4 - Buyer Tiers & Business Terms
  const [tierAThreshold, setTierAThreshold] = useState(90);
  const [tierBThreshold, setTierBThreshold] = useState(70);
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState('60');
  const [defaultCreditLimit, setDefaultCreditLimit] = useState('500000');
  
  // Step 5 - Automated Workflows
  const [automationFeatures, setAutomationFeatures] = useState<AutomationFeature[]>([
    { id: '1', name: 'Auto Health Alerts', description: 'Notify when buyer health scores drop below threshold', enabled: true },
    { id: '2', name: 'Payment Reminders', description: 'Automated AR reminders based on payment terms', enabled: true },
    { id: '3', name: 'Feedback Collection', description: 'Automatically request feedback after order completion', enabled: true },
    { id: '4', name: 'Monthly Reports', description: 'Generate and email buyer performance reports', enabled: true },
  ]);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [marbimMessage, setMarbimMessage] = useState('');

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'Import Buyers', icon: Upload, color: '#EAB308', desc: 'Upload your database' },
    { number: 2, title: 'Health Metrics', icon: Activity, color: '#57ACAF', desc: 'Configure scoring' },
    { number: 3, title: 'Tiers & Terms', icon: Award, color: '#EAB308', desc: 'Set classifications' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'buyer-directory', 
      title: 'Buyer Directory', 
      desc: 'Centralized database with detailed buyer profiles and history',
      icon: Users 
    },
    { 
      id: 'health-scoring', 
      title: 'Health Scoring', 
      desc: 'AI-powered buyer health tracking with predictive alerts',
      icon: Activity 
    },
    { 
      id: 'tier-management', 
      title: 'Tier Management', 
      desc: 'Automatic buyer classification based on performance',
      icon: Award 
    },
    { 
      id: 'feedback-tracking', 
      title: 'Feedback Tracking', 
      desc: 'Collect and analyze buyer feedback for continuous improvement',
      icon: MessageSquare 
    },
    { 
      id: 'issue-management', 
      title: 'Issue Management', 
      desc: 'Track and resolve buyer complaints and claims efficiently',
      icon: AlertTriangle 
    },
    { 
      id: 'ai-insights', 
      title: 'AI Insights', 
      desc: 'MARBIM provides buyer behavior predictions and recommendations',
      icon: Brain 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up Buyer Management. This module helps you maintain strong relationships, track buyer health, and maximize retention. Let's get your buyers organized!",
      "Let's import your existing buyer database. You can upload a CSV/Excel file with buyer details, or I can help you extract data from your CRM or emails. You can also add buyers manually.",
      "Now let's define how you'll measure buyer health. I've set up common metrics with recommended weights based on garment industry best practices. Customize these to match your business priorities.",
      "Let's configure buyer tiers and business terms. Tier A buyers get premium treatment and better terms. I'll help you set the right thresholds and default terms for each tier.",
      "Finally, let's automate your workflows! Enable features like automatic health alerts, payment reminders, and feedback collection. I'll keep your buyer relationships healthy!"
    ];
    return messages[step] || '';
  };

  const handleNext = async () => {
    // Validation
    if (currentStep === 2 && uploadMethod === 'manual' && manualBuyers.some(b => !b.name)) {
      toast.error('Please fill in buyer names');
      return;
    }

    setIsProcessing(true);
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
    toast.success('🎉 Buyer Management module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      // Simulate import
      setImportedBuyers(Math.floor(Math.random() * 80) + 30);
      toast.success(`Analyzing ${file.name}...`);
    }
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addManualBuyer = () => {
    setManualBuyers(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      country: '',
      tier: 'B',
      contact: ''
    }]);
  };

  const removeManualBuyer = (id: string) => {
    if (manualBuyers.length > 1) {
      setManualBuyers(prev => prev.filter(b => b.id !== id));
    }
  };

  const updateManualBuyer = (id: string, field: keyof BuyerData, value: string) => {
    setManualBuyers(prev => prev.map(b =>
      b.id === id ? { ...b, [field]: value } : b
    ));
  };

  const updateMetric = (id: string, field: keyof HealthMetric, value: number | boolean) => {
    setHealthMetrics(prev => prev.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const toggleAutomation = (id: string) => {
    setAutomationFeatures(prev => prev.map(a =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const totalWeight = healthMetrics.reduce((sum, m) => m.enabled ? sum + m.weight : sum, 0);

  const progress = currentStep === 0 ? 0 : ((currentStep) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0A0F1C] via-[#101725] to-[#0A0F1C] overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#57ACAF]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#EAB308]/10 rounded-full blur-[100px]" />
      </div>

      {/* Close button */}
      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute top-6 right-6 z-10 text-white/60 hover:text-white hover:bg-white/10"
      >
        <X className="w-5 h-5" />
      </Button>

      <div className="relative h-full overflow-auto custom-scrollbar px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <Badge className="bg-gradient-to-r from-[#57ACAF]/20 to-[#EAB308]/20 text-white border border-[#57ACAF]/30 px-4 py-2 mb-4">
              <Settings className="w-4 h-4 inline mr-2" />
              Buyer Management Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your Buyer Module
            </h1>
            <p className="text-lg text-[#6F83A7]">
              MARBIM will guide you through the setup process
            </p>
          </motion.div>

          {/* Progress (hidden on welcome screen) */}
          {currentStep > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <div className="grid grid-cols-5 gap-2 mb-3">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = completedSteps.includes(step.number);
                  const isActive = currentStep === step.number;
                  
                  return (
                    <div key={step.number} className="relative">
                      <div className={`
                        relative overflow-hidden rounded-lg p-3 transition-all duration-300 border
                        ${isCompleted 
                          ? 'bg-gradient-to-br from-[#57ACAF]/15 to-[#57ACAF]/5 border-[#57ACAF]/50' 
                          : isActive
                          ? 'border-2 bg-gradient-to-br from-white/10 to-white/[0.02] shadow-lg'
                          : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 opacity-50'
                        }
                      `}
                      style={isActive ? { 
                        borderColor: step.color,
                        boxShadow: `0 0 20px ${step.color}40`
                      } : undefined}
                      >
                        <div className="flex flex-col items-center text-center gap-1">
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center mb-1 transition-all
                            ${isCompleted 
                              ? 'bg-[#57ACAF]/20' 
                              : isActive 
                              ? 'bg-gradient-to-br from-white/10 to-white/5'
                              : 'bg-white/5'
                            }
                          `}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                            ) : (
                              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#6F83A7]'}`} />
                            )}
                          </div>
                          <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-[#6F83A7]'}`}>
                            {step.title}
                          </span>
                          <span className={`text-[10px] ${isActive ? 'text-[#6F83A7]' : 'text-[#6F83A7]/60'}`}>
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}

          {/* MARBIM Message Card */}
          {currentStep > 0 && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">MARBIM</span>
                    <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 text-[10px] px-2 py-0">
                      AI Assistant
                    </Badge>
                  </div>
                  <p className="text-sm text-[#6F83A7] leading-relaxed">
                    {getMarbimMessage(currentStep)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 0: Welcome Screen */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  {/* Hero Section */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#57ACAF]/10 via-white/5 to-[#EAB308]/10 border border-white/10 rounded-2xl p-8">
                    <div className="relative z-10">
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#57ACAF]/20 blur-2xl rounded-full" />
                          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/80 flex items-center justify-center shadow-lg">
                            <Users className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-center text-white mb-3">
                        Buyer Management Module
                      </h2>
                      <p className="text-center text-[#6F83A7] text-lg mb-6 max-w-2xl mx-auto">
                        Transform your buyer relationships with AI-powered health tracking, automated workflows, 
                        and intelligent insights that help you retain your best customers and grow revenue.
                      </p>

                      {/* Key Benefits */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Activity className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Health Monitoring</h3>
                          <p className="text-xs text-[#6F83A7]">Real-time buyer health scores</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Award className="w-8 h-8 text-[#EAB308] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Smart Tiers</h3>
                          <p className="text-xs text-[#6F83A7]">Automatic buyer classification</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Brain className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">AI Insights</h3>
                          <p className="text-xs text-[#6F83A7]">Predictive recommendations</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#EAB308]" />
                      Key Features
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {features.map((feature) => {
                        const Icon = feature.icon;
                        const isSelected = selectedFeatures.includes(feature.id);
                        
                        return (
                          <motion.button
                            key={feature.id}
                            onClick={() => toggleFeature(feature.id)}
                            className={`
                              relative overflow-hidden text-left p-4 rounded-xl border transition-all duration-300
                              ${isSelected 
                                ? 'bg-gradient-to-br from-[#57ACAF]/15 to-[#57ACAF]/5 border-[#57ACAF]/50 shadow-lg' 
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                              }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                                ${isSelected ? 'bg-[#57ACAF]/20' : 'bg-white/5'}
                              `}>
                                <Icon className={`w-5 h-5 ${isSelected ? 'text-[#57ACAF]' : 'text-[#6F83A7]'}`} />
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-medium mb-1 ${isSelected ? 'text-white' : 'text-[#6F83A7]'}`}>
                                  {feature.title}
                                </h4>
                                <p className="text-xs text-[#6F83A7] leading-relaxed">
                                  {feature.desc}
                                </p>
                              </div>
                              {isSelected && (
                                <CheckCircle className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Setup Time Estimate */}
                  <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-2">Quick Setup</h3>
                        <p className="text-sm text-[#6F83A7] mb-3">
                          Complete setup in just 5-10 minutes. MARBIM will guide you through importing buyers, 
                          configuring health metrics, setting up tiers, and enabling automated workflows.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                            <span className="text-[#6F83A7]">5 simple steps</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                            <span className="text-[#6F83A7]">AI-powered defaults</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                            <span className="text-[#6F83A7]">Instant activation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Import Buyers */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[#EAB308]" />
                      Choose Import Method
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { id: 'csv', icon: FileSpreadsheet, title: 'Upload CSV', desc: 'Import from spreadsheet' },
                        { id: 'excel', icon: FileText, title: 'Upload Excel', desc: 'Import from Excel file' },
                        { id: 'manual', icon: UserPlus, title: 'Add Manually', desc: 'Enter buyer details' },
                      ].map((method) => {
                        const Icon = method.icon;
                        const isSelected = uploadMethod === method.id;
                        
                        return (
                          <motion.button
                            key={method.id}
                            onClick={() => setUploadMethod(method.id as any)}
                            className={`
                              p-5 rounded-xl border transition-all duration-300 text-center
                              ${isSelected 
                                ? 'bg-gradient-to-br from-[#57ACAF]/15 to-[#57ACAF]/5 border-[#57ACAF]/50 shadow-lg' 
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                              }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-[#57ACAF]' : 'text-[#6F83A7]'}`} />
                            <h4 className={`font-medium mb-1 ${isSelected ? 'text-white' : 'text-[#6F83A7]'}`}>
                              {method.title}
                            </h4>
                            <p className="text-xs text-[#6F83A7]">{method.desc}</p>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* File Upload UI */}
                    {(uploadMethod === 'csv' || uploadMethod === 'excel') && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={uploadMethod === 'csv' ? '.csv' : '.xlsx,.xls'}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-[#57ACAF]/50 hover:bg-white/5 transition-all duration-300 group"
                        >
                          <Upload className="w-12 h-12 text-[#6F83A7] mx-auto mb-3 group-hover:text-[#57ACAF] transition-colors" />
                          <p className="text-white font-medium mb-1">
                            {uploadedFile ? uploadedFile.name : `Click to upload ${uploadMethod.toUpperCase()} file`}
                          </p>
                          <p className="text-sm text-[#6F83A7]">
                            or drag and drop your file here
                          </p>
                        </button>

                        {uploadedFile && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-xl p-5"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                              <span className="text-white font-medium">File uploaded successfully!</span>
                            </div>
                            <p className="text-sm text-[#6F83A7] mb-2">
                              Detected {importedBuyers} buyers in your file
                            </p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-[#6F83A7]">Processing...</span>
                                <span className="text-white">100%</span>
                              </div>
                              <Progress value={100} className="h-2" />
                            </div>
                          </motion.div>
                        )}

                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <h4 className="text-white font-medium mb-3 text-sm">Required Columns:</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF]" />
                              <span className="text-[#6F83A7]">Buyer Name</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF]" />
                              <span className="text-[#6F83A7]">Country</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                              <span className="text-[#6F83A7]">Contact Person (optional)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                              <span className="text-[#6F83A7]">Tier (optional)</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Manual Entry UI */}
                    {uploadMethod === 'manual' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {manualBuyers.map((buyer, index) => (
                          <div
                            key={buyer.id}
                            className="bg-white/5 border border-white/10 rounded-xl p-5"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-white font-medium">Buyer #{index + 1}</h4>
                              {manualBuyers.length > 1 && (
                                <Button
                                  onClick={() => removeManualBuyer(buyer.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Buyer Name *</Label>
                                <Input
                                  value={buyer.name}
                                  onChange={(e) => updateManualBuyer(buyer.id, 'name', e.target.value)}
                                  placeholder="e.g., H&M, Zara"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Country *</Label>
                                <Input
                                  value={buyer.country}
                                  onChange={(e) => updateManualBuyer(buyer.id, 'country', e.target.value)}
                                  placeholder="e.g., Sweden, Spain"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Tier</Label>
                                <Select
                                  value={buyer.tier}
                                  onValueChange={(value) => updateManualBuyer(buyer.id, 'tier', value)}
                                >
                                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="A">Tier A (Premium)</SelectItem>
                                    <SelectItem value="B">Tier B (Standard)</SelectItem>
                                    <SelectItem value="C">Tier C (Basic)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Contact Person</Label>
                                <Input
                                  value={buyer.contact}
                                  onChange={(e) => updateManualBuyer(buyer.id, 'contact', e.target.value)}
                                  placeholder="Contact name"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          onClick={addManualBuyer}
                          variant="outline"
                          className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Buyer
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Health Metrics */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#57ACAF]" />
                        Health Score Configuration
                      </h3>
                      <div className="text-right">
                        <div className="text-sm text-[#6F83A7]">Total Weight</div>
                        <div className={`text-lg font-bold ${totalWeight === 100 ? 'text-[#57ACAF]' : 'text-[#EAB308]'}`}>
                          {totalWeight}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {healthMetrics.map((metric) => (
                        <div
                          key={metric.id}
                          className={`
                            bg-white/5 border border-white/10 rounded-xl p-5 transition-all
                            ${metric.enabled ? 'opacity-100' : 'opacity-50'}
                          `}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <Switch
                              checked={metric.enabled}
                              onCheckedChange={() => updateMetric(metric.id, 'enabled', !metric.enabled)}
                            />
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{metric.name}</h4>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-white">{metric.weight}%</span>
                            </div>
                          </div>

                          {metric.enabled && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <input
                                  type="range"
                                  min="0"
                                  max="50"
                                  step="5"
                                  value={metric.weight}
                                  onChange={(e) => updateMetric(metric.id, 'weight', parseInt(e.target.value))}
                                  className="flex-1"
                                />
                              </div>
                              <Progress value={metric.weight * 2} className="h-2" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {totalWeight !== 100 && (
                      <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-white font-medium mb-1">Adjust Weights</p>
                            <p className="text-sm text-[#6F83A7]">
                              Total weight should equal 100%. Currently at {totalWeight}%.
                              {totalWeight < 100 ? ` Add ${100 - totalWeight}% more.` : ` Remove ${totalWeight - 100}%.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preview Card */}
                  <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-5">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-[#57ACAF]" />
                      How Health Scores Work
                    </h4>
                    <p className="text-sm text-[#6F83A7] mb-4">
                      MARBIM continuously monitors each metric and calculates an overall health score (0-100). 
                      You'll receive alerts when scores drop below thresholds, helping you proactively manage relationships.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-[#57ACAF] mb-1">90+</div>
                        <div className="text-xs text-[#6F83A7]">Excellent</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-[#EAB308] mb-1">70-89</div>
                        <div className="text-xs text-[#6F83A7]">Good</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-red-400 mb-1">&lt;70</div>
                        <div className="text-xs text-[#6F83A7]">At Risk</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Tiers & Business Terms */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Tier Thresholds */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#EAB308]" />
                      Configure Buyer Tiers
                    </h3>
                    
                    <div className="space-y-5">
                      {/* Tier A */}
                      <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/30 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-white font-medium flex items-center gap-2">
                              <Star className="w-5 h-5 text-[#57ACAF]" />
                              Tier A (Premium)
                            </h4>
                            <p className="text-sm text-[#6F83A7] mt-1">Best buyers with highest revenue potential</p>
                          </div>
                          <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                            Score ≥ {tierAThreshold}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[#6F83A7]">Minimum Health Score</Label>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min="80"
                              max="95"
                              step="5"
                              value={tierAThreshold}
                              onChange={(e) => setTierAThreshold(parseInt(e.target.value))}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={tierAThreshold}
                              onChange={(e) => setTierAThreshold(parseInt(e.target.value) || 90)}
                              className="w-20 bg-white/5 border-white/10 text-white text-center"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tier B */}
                      <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/30 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-white font-medium flex items-center gap-2">
                              <Award className="w-5 h-5 text-[#EAB308]" />
                              Tier B (Standard)
                            </h4>
                            <p className="text-sm text-[#6F83A7] mt-1">Solid performers with growth potential</p>
                          </div>
                          <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30">
                            Score {tierBThreshold}-{tierAThreshold - 1}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[#6F83A7]">Minimum Health Score</Label>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min="60"
                              max="80"
                              step="5"
                              value={tierBThreshold}
                              onChange={(e) => setTierBThreshold(parseInt(e.target.value))}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={tierBThreshold}
                              onChange={(e) => setTierBThreshold(parseInt(e.target.value) || 70)}
                              className="w-20 bg-white/5 border-white/10 text-white text-center"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tier C */}
                      <div className="bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/30 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-white font-medium flex items-center gap-2">
                              <Minus className="w-5 h-5 text-[#6F83A7]" />
                              Tier C (Basic)
                            </h4>
                            <p className="text-sm text-[#6F83A7] mt-1">New or lower-performing buyers</p>
                          </div>
                          <Badge className="bg-[#6F83A7]/20 text-[#6F83A7] border-[#6F83A7]/30">
                            Score &lt; {tierBThreshold}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Default Business Terms */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#57ACAF]" />
                      Default Business Terms
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#6F83A7] mb-2 block">Default Payment Terms (days)</Label>
                        <Select value={defaultPaymentTerms} onValueChange={setDefaultPaymentTerms}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="45">45 days</SelectItem>
                            <SelectItem value="60">60 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-[#6F83A7] mb-2 block">Default Credit Limit (USD)</Label>
                        <Input
                          type="text"
                          value={defaultCreditLimit}
                          onChange={(e) => setDefaultCreditLimit(e.target.value)}
                          placeholder="500000"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-sm text-[#6F83A7]">
                        <Brain className="w-4 h-4 inline mr-2 text-[#EAB308]" />
                        MARBIM Tip: These defaults apply to new buyers. You can customize terms individually 
                        based on tier, relationship history, and risk assessment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Automation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#EAB308]" />
                      Automated Workflows
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      {automationFeatures.map((feature) => (
                        <div
                          key={feature.id}
                          className={`
                            bg-white/5 border border-white/10 rounded-xl p-5 transition-all
                            ${feature.enabled ? 'bg-gradient-to-br from-white/5 to-white/[0.02]' : 'opacity-60'}
                          `}
                        >
                          <div className="flex items-start gap-4">
                            <Switch
                              checked={feature.enabled}
                              onCheckedChange={() => toggleAutomation(feature.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <h4 className="text-white font-medium mb-1">{feature.name}</h4>
                              <p className="text-sm text-[#6F83A7]">{feature.description}</p>
                            </div>
                            {feature.enabled && (
                              <CheckCircle className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-white font-medium mb-2">MARBIM AI Automation</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            With these workflows enabled, MARBIM will continuously monitor your buyers and take 
                            intelligent actions to help maintain healthy relationships and maximize revenue.
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">Proactive Monitoring</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">24/7 health score tracking</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">Smart Alerts</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Context-aware notifications</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">Action Recommendations</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Next-best-action suggestions</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">Automated Reports</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Scheduled insights delivery</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-6">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                      Ready to Launch!
                    </h4>
                    <p className="text-sm text-[#6F83A7] mb-4">
                      You've configured all the essentials. Click "Complete Setup" to activate your Buyer Management 
                      module and start leveraging AI-powered insights.
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {uploadedFile ? importedBuyers : manualBuyers.length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Buyers Ready</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {healthMetrics.filter(m => m.enabled).length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Health Metrics</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">3</div>
                        <div className="text-xs text-[#6F83A7]">Buyer Tiers</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {automationFeatures.filter(a => a.enabled).length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Automations</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 0 || isProcessing}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {currentStep > 0 && currentStep < steps.length && (
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="text-[#6F83A7] hover:text-white hover:bg-white/5"
                >
                  Save & Exit
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={isProcessing || (currentStep === 2 && totalWeight !== 100)}
                className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20 min-w-[140px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : currentStep === steps.length ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    {currentStep === 0 ? 'Start Setup' : 'Next Step'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
