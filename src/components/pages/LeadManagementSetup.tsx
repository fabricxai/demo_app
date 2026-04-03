import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, FileSpreadsheet, Users, CheckCircle, ArrowRight, ArrowLeft, 
  Loader2, X, Brain, Sparkles, Award, AlertTriangle, TrendingUp,
  Shield, Target, BarChart3, Package, FileText, Download, Plus,
  Minus, Edit2, Trash2, Check, Settings, Zap, Globe, Star,
  DollarSign, Clock, Truck, Factory, ChevronRight, ChevronDown,
  UserPlus, Building2, Heart, CreditCard, MessageSquare, Calendar,
  Phone, Mail, MapPin, ThumbsUp, Activity, Send, FilePlus, Tag,
  Database, Bell, TrendingDown, Filter, Layers, PieChart, Eye
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

interface LeadManagementSetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface LeadData {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  source: string;
}

interface LeadStage {
  id: string;
  name: string;
  probability: number;
  enabled: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'nurture' | 'conversion' | 'alert' | 'reporting';
  enabled: boolean;
}

export function LeadManagementSetup({ onComplete, onClose, onAskMarbim }: LeadManagementSetupProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Welcome
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Step 1 - Welcome & Overview
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Step 2 - Upload Lead Database
  const [uploadMethod, setUploadMethod] = useState<'pdf' | 'excel' | 'manual' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualLeads, setManualLeads] = useState<LeadData[]>([
    { id: '1', companyName: '', contactPerson: '', email: '', phone: '', source: 'Website' }
  ]);
  const [importedLeads, setImportedLeads] = useState<number>(0);
  const [extractionProgress, setExtractionProgress] = useState(0);
  
  // Step 3 - Lead Stages & Pipeline
  const [leadStages, setLeadStages] = useState<LeadStage[]>([
    { id: '1', name: 'New Lead', probability: 10, enabled: true },
    { id: '2', name: 'Contacted', probability: 25, enabled: true },
    { id: '3', name: 'Qualified', probability: 50, enabled: true },
    { id: '4', name: 'Proposal Sent', probability: 75, enabled: true },
    { id: '5', name: 'Negotiation', probability: 90, enabled: true },
  ]);
  
  // Step 4 - Lead Scoring & Qualification
  const [scoringMethod, setScoringMethod] = useState<'ai' | 'manual'>('ai');
  const [qualificationCriteria, setQualificationCriteria] = useState({
    minBudget: '10000',
    requiredVolume: '500',
    targetRegions: ['USA', 'Europe', 'Asia'],
  });
  
  // Step 5 - Automated Workflows
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([
    { 
      id: '1', 
      name: 'Auto Lead Assignment', 
      description: 'Automatically assign new leads to sales reps based on region/product',
      category: 'conversion',
      enabled: true 
    },
    { 
      id: '2', 
      name: 'Lead Nurturing Campaigns', 
      description: 'Send automated email sequences based on lead stage and behavior',
      category: 'nurture',
      enabled: true 
    },
    { 
      id: '3', 
      name: 'Lead Scoring Updates', 
      description: 'MARBIM continuously updates lead scores based on engagement',
      category: 'conversion',
      enabled: true 
    },
    { 
      id: '4', 
      name: 'Stale Lead Alerts', 
      description: 'Notify when leads haven\'t been contacted in 7+ days',
      category: 'alert',
      enabled: true 
    },
    { 
      id: '5', 
      name: 'Hot Lead Notifications', 
      description: 'Instant alerts when high-value leads show buying signals',
      category: 'alert',
      enabled: true 
    },
    { 
      id: '6', 
      name: 'Weekly Pipeline Reports', 
      description: 'Automated reports on pipeline health, conversion rates, and forecasts',
      category: 'reporting',
      enabled: true 
    },
    { 
      id: '7', 
      name: 'Follow-up Reminders', 
      description: 'Smart reminders for scheduled follow-ups and next actions',
      category: 'conversion',
      enabled: true 
    },
    { 
      id: '8', 
      name: 'Lead Source Tracking', 
      description: 'Automatically track and analyze which sources generate best leads',
      category: 'reporting',
      enabled: true 
    },
  ]);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [marbimMessage, setMarbimMessage] = useState('');

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'Import Leads', icon: Upload, color: '#EAB308', desc: 'Upload your database' },
    { number: 2, title: 'Pipeline Stages', icon: Layers, color: '#57ACAF', desc: 'Configure workflow' },
    { number: 3, title: 'Lead Scoring', icon: Target, color: '#EAB308', desc: 'Set criteria' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'lead-capture', 
      title: 'Multi-Channel Lead Capture', 
      desc: 'Capture leads from website, email, trade shows, and referrals',
      icon: Database 
    },
    { 
      id: 'ai-scoring', 
      title: 'AI Lead Scoring', 
      desc: 'MARBIM scores leads based on fit, engagement, and buying signals',
      icon: Target 
    },
    { 
      id: 'pipeline-management', 
      title: 'Visual Pipeline', 
      desc: 'Drag-and-drop pipeline with real-time conversion tracking',
      icon: Layers 
    },
    { 
      id: 'automated-nurturing', 
      title: 'Automated Nurturing', 
      desc: 'Multi-touch email campaigns that adapt to lead behavior',
      icon: Send 
    },
    { 
      id: 'activity-tracking', 
      title: 'Activity Tracking', 
      desc: 'Log calls, emails, meetings, and track engagement history',
      icon: Activity 
    },
    { 
      id: 'conversion-analytics', 
      title: 'Conversion Analytics', 
      desc: 'Deep insights into conversion rates, bottlenecks, and forecasts',
      icon: TrendingUp 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up Lead Management. This module helps you capture, qualify, and convert leads into customers efficiently. Let's build your sales pipeline!",
      "Let's import your existing leads. You can upload a PDF (I'll extract contact info), Excel file, or add leads manually. I can also help extract leads from business cards, emails, and trade show lists.",
      "Now let's define your sales pipeline stages. These represent the journey from initial contact to closed deal. I've set up industry-standard stages, but you can customize them to match your sales process.",
      "Lead scoring helps prioritize your efforts. I can use AI to automatically score leads based on firmographics, behavior, and fit - or you can set manual criteria. Let's configure your qualification rules.",
      "Finally, let's automate your lead workflows! Enable features like auto-assignment, nurturing campaigns, hot lead alerts, and more. I'll help you convert more leads with less manual work!"
    ];
    return messages[step] || '';
  };

  const handleNext = async () => {
    // Validation
    if (currentStep === 2 && uploadMethod === 'manual' && manualLeads.some(l => !l.companyName)) {
      toast.error('Please fill in company names');
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing for PDF extraction
    if (currentStep === 2 && uploadMethod === 'pdf' && uploadedFile) {
      for (let i = 0; i <= 100; i += 20) {
        setExtractionProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
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
    toast.success('🎉 Lead Management module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      // Simulate different processing for different file types
      if (uploadMethod === 'pdf') {
        setImportedLeads(Math.floor(Math.random() * 30) + 15);
        toast.success(`Analyzing PDF with AI extraction...`);
      } else {
        setImportedLeads(Math.floor(Math.random() * 100) + 50);
        toast.success(`Processing ${file.name}...`);
      }
    }
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addManualLead = () => {
    setManualLeads(prev => [...prev, {
      id: Date.now().toString(),
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      source: 'Website'
    }]);
  };

  const removeManualLead = (id: string) => {
    if (manualLeads.length > 1) {
      setManualLeads(prev => prev.filter(l => l.id !== id));
    }
  };

  const updateManualLead = (id: string, field: keyof LeadData, value: string) => {
    setManualLeads(prev => prev.map(l =>
      l.id === id ? { ...l, [field]: value } : l
    ));
  };

  const updateStage = (id: string, field: keyof LeadStage, value: number | boolean | string) => {
    setLeadStages(prev => prev.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const addStage = () => {
    setLeadStages(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Stage',
      probability: 50,
      enabled: true
    }]);
  };

  const removeStage = (id: string) => {
    if (leadStages.length > 2) {
      setLeadStages(prev => prev.filter(s => s.id !== id));
    }
  };

  const toggleAutomation = (id: string) => {
    setAutomationWorkflows(prev => prev.map(a =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const progress = currentStep === 0 ? 0 : ((currentStep) / steps.length) * 100;

  const getWorkflowIcon = (category: string) => {
    switch (category) {
      case 'nurture': return Send;
      case 'conversion': return Target;
      case 'alert': return Bell;
      case 'reporting': return BarChart3;
      default: return Zap;
    }
  };

  const getWorkflowColor = (category: string) => {
    switch (category) {
      case 'nurture': return '#57ACAF';
      case 'conversion': return '#EAB308';
      case 'alert': return '#D0342C';
      case 'reporting': return '#6F83A7';
      default: return '#57ACAF';
    }
  };

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
              Lead Management Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your Lead Pipeline
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
                            <Target className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-center text-white mb-3">
                        Lead Management Module
                      </h2>
                      <p className="text-center text-[#6F83A7] text-lg mb-6 max-w-2xl mx-auto">
                        Build a high-performance sales machine with AI-powered lead scoring, automated nurturing, 
                        and intelligent pipeline management that helps you close more deals faster.
                      </p>

                      {/* Key Benefits */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Target className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">AI Lead Scoring</h3>
                          <p className="text-xs text-[#6F83A7]">Prioritize high-value leads</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Send className="w-8 h-8 text-[#EAB308] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Auto Nurturing</h3>
                          <p className="text-xs text-[#6F83A7]">Engage leads on autopilot</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <TrendingUp className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Pipeline Analytics</h3>
                          <p className="text-xs text-[#6F83A7]">Data-driven insights</p>
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
                          Complete setup in just 5-10 minutes. MARBIM will guide you through importing leads, 
                          configuring your pipeline, setting up lead scoring, and enabling automated workflows.
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

              {/* Step 1: Import Leads */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[#EAB308]" />
                      Choose Import Method
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { id: 'pdf', icon: FilePlus, title: 'Upload PDF', desc: 'AI extracts contact info', highlight: true },
                        { id: 'excel', icon: FileSpreadsheet, title: 'Upload Excel', desc: 'Import from spreadsheet' },
                        { id: 'manual', icon: UserPlus, title: 'Add Manually', desc: 'Enter lead details' },
                      ].map((method) => {
                        const Icon = method.icon;
                        const isSelected = uploadMethod === method.id;
                        
                        return (
                          <motion.button
                            key={method.id}
                            onClick={() => setUploadMethod(method.id as any)}
                            className={`
                              p-5 rounded-xl border transition-all duration-300 text-center relative overflow-hidden
                              ${isSelected 
                                ? 'bg-gradient-to-br from-[#57ACAF]/15 to-[#57ACAF]/5 border-[#57ACAF]/50 shadow-lg' 
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                              }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {method.highlight && (
                              <Badge className="absolute top-2 right-2 bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 text-[10px]">
                                AI Powered
                              </Badge>
                            )}
                            <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-[#57ACAF]' : 'text-[#6F83A7]'}`} />
                            <h4 className={`font-medium mb-1 ${isSelected ? 'text-white' : 'text-[#6F83A7]'}`}>
                              {method.title}
                            </h4>
                            <p className="text-xs text-[#6F83A7]">{method.desc}</p>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* PDF Upload with AI Extraction */}
                    {uploadMethod === 'pdf' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        
                        <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <Brain className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-white font-medium mb-1">AI-Powered Extraction</h4>
                              <p className="text-sm text-[#6F83A7]">
                                MARBIM will intelligently extract company names, contact persons, emails, phone numbers, 
                                and other details from your PDF. Works with business cards, trade show lists, and contact sheets.
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-[#57ACAF]/50 hover:bg-white/5 transition-all duration-300 group"
                        >
                          <Upload className="w-12 h-12 text-[#6F83A7] mx-auto mb-3 group-hover:text-[#57ACAF] transition-colors" />
                          <p className="text-white font-medium mb-1">
                            {uploadedFile ? uploadedFile.name : 'Click to upload PDF file'}
                          </p>
                          <p className="text-sm text-[#6F83A7]">
                            or drag and drop your PDF here
                          </p>
                        </button>

                        {uploadedFile && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-xl p-5"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <Brain className="w-5 h-5 text-[#57ACAF] animate-pulse" />
                              <span className="text-white font-medium">AI extracting contact information...</span>
                            </div>
                            <p className="text-sm text-[#6F83A7] mb-2">
                              Found {importedLeads} potential leads
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
                      </motion.div>
                    )}

                    {/* Excel Upload */}
                    {uploadMethod === 'excel' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-[#57ACAF]/50 hover:bg-white/5 transition-all duration-300 group"
                        >
                          <Upload className="w-12 h-12 text-[#6F83A7] mx-auto mb-3 group-hover:text-[#57ACAF] transition-colors" />
                          <p className="text-white font-medium mb-1">
                            {uploadedFile ? uploadedFile.name : 'Click to upload Excel/CSV file'}
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
                              Detected {importedLeads} leads in your file
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
                              <span className="text-[#6F83A7]">Company Name</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                              <span className="text-[#6F83A7]">Contact Person (optional)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                              <span className="text-[#6F83A7]">Email (optional)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                              <span className="text-[#6F83A7]">Phone (optional)</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Manual Entry */}
                    {uploadMethod === 'manual' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {manualLeads.map((lead, index) => (
                          <div
                            key={lead.id}
                            className="bg-white/5 border border-white/10 rounded-xl p-5"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-white font-medium">Lead #{index + 1}</h4>
                              {manualLeads.length > 1 && (
                                <Button
                                  onClick={() => removeManualLead(lead.id)}
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
                                <Label className="text-[#6F83A7] mb-2 block">Company Name *</Label>
                                <Input
                                  value={lead.companyName}
                                  onChange={(e) => updateManualLead(lead.id, 'companyName', e.target.value)}
                                  placeholder="e.g., Fashion Inc."
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Contact Person</Label>
                                <Input
                                  value={lead.contactPerson}
                                  onChange={(e) => updateManualLead(lead.id, 'contactPerson', e.target.value)}
                                  placeholder="John Doe"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Email</Label>
                                <Input
                                  value={lead.email}
                                  onChange={(e) => updateManualLead(lead.id, 'email', e.target.value)}
                                  placeholder="john@example.com"
                                  type="email"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Phone</Label>
                                <Input
                                  value={lead.phone}
                                  onChange={(e) => updateManualLead(lead.id, 'phone', e.target.value)}
                                  placeholder="+1 234 567 8900"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div className="col-span-2">
                                <Label className="text-[#6F83A7] mb-2 block">Lead Source</Label>
                                <Select
                                  value={lead.source}
                                  onValueChange={(value) => updateManualLead(lead.id, 'source', value)}
                                >
                                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Website">Website</SelectItem>
                                    <SelectItem value="Trade Show">Trade Show</SelectItem>
                                    <SelectItem value="Referral">Referral</SelectItem>
                                    <SelectItem value="Cold Outreach">Cold Outreach</SelectItem>
                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          onClick={addManualLead}
                          variant="outline"
                          className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Lead
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Pipeline Stages */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#57ACAF]" />
                      Configure Sales Pipeline Stages
                    </h3>

                    <div className="space-y-3 mb-6">
                      {leadStages.map((stage, index) => (
                        <div
                          key={stage.id}
                          className={`
                            bg-white/5 border border-white/10 rounded-xl p-5 transition-all
                            ${stage.enabled ? 'opacity-100' : 'opacity-50'}
                          `}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-3 flex-1">
                              <Switch
                                checked={stage.enabled}
                                onCheckedChange={() => updateStage(stage.id, 'enabled', !stage.enabled)}
                              />
                              <div className="flex-1">
                                <Input
                                  value={stage.name}
                                  onChange={(e) => updateStage(stage.id, 'name', e.target.value)}
                                  className="bg-white/5 border-white/10 text-white font-medium"
                                  placeholder="Stage name"
                                />
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-3">
                              <div>
                                <div className="text-xs text-[#6F83A7] mb-1">Win Probability</div>
                                <span className="text-xl font-bold text-white">{stage.probability}%</span>
                              </div>
                              {leadStages.length > 2 && (
                                <Button
                                  onClick={() => removeStage(stage.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {stage.enabled && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  step="5"
                                  value={stage.probability}
                                  onChange={(e) => updateStage(stage.id, 'probability', parseInt(e.target.value))}
                                  className="flex-1"
                                />
                              </div>
                              <Progress value={stage.probability} className="h-2" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addStage}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Stage
                    </Button>
                  </div>

                  {/* Visual Pipeline Preview */}
                  <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-5">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-[#57ACAF]" />
                      Pipeline Preview
                    </h4>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {leadStages.filter(s => s.enabled).map((stage, index) => (
                        <div key={stage.id} className="flex items-center gap-2">
                          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 min-w-[120px] text-center">
                            <div className="text-white font-medium text-sm mb-1">{stage.name}</div>
                            <div className="text-xs text-[#6F83A7]">{stage.probability}%</div>
                          </div>
                          {index < leadStages.filter(s => s.enabled).length - 1 && (
                            <ChevronRight className="w-4 h-4 text-[#6F83A7] flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Lead Scoring */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#EAB308]" />
                      Lead Scoring Configuration
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { id: 'ai', icon: Brain, title: 'AI Scoring', desc: 'MARBIM automatically scores based on behavior, fit, and engagement', recommended: true },
                        { id: 'manual', icon: Target, title: 'Manual Criteria', desc: 'Set custom rules based on budget, volume, and region' },
                      ].map((method) => {
                        const Icon = method.icon;
                        const isSelected = scoringMethod === method.id;
                        
                        return (
                          <motion.button
                            key={method.id}
                            onClick={() => setScoringMethod(method.id as any)}
                            className={`
                              p-5 rounded-xl border transition-all duration-300 text-left relative overflow-hidden
                              ${isSelected 
                                ? 'bg-gradient-to-br from-[#57ACAF]/15 to-[#57ACAF]/5 border-[#57ACAF]/50 shadow-lg' 
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                              }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {method.recommended && (
                              <Badge className="absolute top-2 right-2 bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 text-[10px]">
                                Recommended
                              </Badge>
                            )}
                            <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-[#57ACAF]' : 'text-[#6F83A7]'}`} />
                            <h4 className={`font-medium mb-1 ${isSelected ? 'text-white' : 'text-[#6F83A7]'}`}>
                              {method.title}
                            </h4>
                            <p className="text-xs text-[#6F83A7]">{method.desc}</p>
                          </motion.button>
                        );
                      })}
                    </div>

                    {scoringMethod === 'ai' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <Brain className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-white font-medium mb-2">How AI Scoring Works</h4>
                            <p className="text-sm text-[#6F83A7] mb-4">
                              MARBIM analyzes multiple signals to score each lead from 0-100. Higher scores indicate 
                              better fit and higher conversion probability.
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-white/5 rounded-lg p-3">
                            <h5 className="text-white font-medium text-sm mb-2">Firmographic Fit</h5>
                            <ul className="text-xs text-[#6F83A7] space-y-1">
                              <li>• Company size</li>
                              <li>• Industry match</li>
                              <li>• Location</li>
                              <li>• Budget capacity</li>
                            </ul>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <h5 className="text-white font-medium text-sm mb-2">Engagement Level</h5>
                            <ul className="text-xs text-[#6F83A7] space-y-1">
                              <li>• Email opens</li>
                              <li>• Website visits</li>
                              <li>• Content downloads</li>
                              <li>• Response time</li>
                            </ul>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <h5 className="text-white font-medium text-sm mb-2">Buying Signals</h5>
                            <ul className="text-xs text-[#6F83A7] space-y-1">
                              <li>• Pricing inquiries</li>
                              <li>• Sample requests</li>
                              <li>• Timeline urgency</li>
                              <li>• Decision authority</li>
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {scoringMethod === 'manual' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-[#6F83A7] mb-2 block">Minimum Budget (USD)</Label>
                            <Input
                              type="text"
                              value={qualificationCriteria.minBudget}
                              onChange={(e) => setQualificationCriteria(prev => ({ ...prev, minBudget: e.target.value }))}
                              placeholder="10000"
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-[#6F83A7] mb-2 block">Required Order Volume (pcs)</Label>
                            <Input
                              type="text"
                              value={qualificationCriteria.requiredVolume}
                              onChange={(e) => setQualificationCriteria(prev => ({ ...prev, requiredVolume: e.target.value }))}
                              placeholder="500"
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Automation Workflows */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#EAB308]" />
                      Automated Lead Workflows
                    </h3>
                    
                    {/* Category Tabs */}
                    <div className="grid grid-cols-4 gap-2 mb-6 bg-white/5 p-1 rounded-lg">
                      {[
                        { id: 'all', label: 'All', count: automationWorkflows.length },
                        { id: 'nurture', label: 'Nurture', count: automationWorkflows.filter(w => w.category === 'nurture').length },
                        { id: 'conversion', label: 'Conversion', count: automationWorkflows.filter(w => w.category === 'conversion').length },
                        { id: 'alert', label: 'Alerts', count: automationWorkflows.filter(w => w.category === 'alert').length },
                      ].map((cat) => (
                        <div
                          key={cat.id}
                          className="bg-white/5 rounded-lg px-3 py-2 text-center border border-white/10"
                        >
                          <div className="text-white font-medium text-sm">{cat.label}</div>
                          <div className="text-xs text-[#6F83A7]">{cat.count} workflows</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 mb-6">
                      {automationWorkflows.map((workflow) => {
                        const Icon = getWorkflowIcon(workflow.category);
                        const color = getWorkflowColor(workflow.category);
                        
                        return (
                          <div
                            key={workflow.id}
                            className={`
                              bg-white/5 border border-white/10 rounded-xl p-5 transition-all
                              ${workflow.enabled ? 'bg-gradient-to-br from-white/5 to-white/[0.02]' : 'opacity-60'}
                            `}
                          >
                            <div className="flex items-start gap-4">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${color}20` }}
                              >
                                <Icon className="w-5 h-5" style={{ color }} />
                              </div>
                              <Switch
                                checked={workflow.enabled}
                                onCheckedChange={() => toggleAutomation(workflow.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-white font-medium">{workflow.name}</h4>
                                  <Badge 
                                    className="text-[10px] px-2 py-0"
                                    style={{ 
                                      backgroundColor: `${color}20`,
                                      color: color,
                                      borderColor: `${color}40`
                                    }}
                                  >
                                    {workflow.category}
                                  </Badge>
                                </div>
                                <p className="text-sm text-[#6F83A7]">{workflow.description}</p>
                              </div>
                              {workflow.enabled && (
                                <CheckCircle className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-white font-medium mb-2">MARBIM Lead Automation</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            With these workflows enabled, MARBIM will continuously nurture leads, prioritize high-value 
                            opportunities, and alert you to important actions. Focus on closing deals while I handle the rest.
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">24/7 Monitoring</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Never miss a hot lead</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">Smart Nurturing</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Personalized engagement</p>
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
                      You've configured all the essentials. Click "Complete Setup" to activate your Lead Management 
                      module and start converting more leads into customers.
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {uploadedFile ? importedLeads : manualLeads.length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Leads Ready</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {leadStages.filter(s => s.enabled).length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Pipeline Stages</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {scoringMethod === 'ai' ? 'AI' : 'Manual'}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Scoring Method</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {automationWorkflows.filter(a => a.enabled).length}
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
                disabled={isProcessing}
                className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20 min-w-[140px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {uploadMethod === 'pdf' && uploadedFile ? 'Extracting...' : 'Processing...'}
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
