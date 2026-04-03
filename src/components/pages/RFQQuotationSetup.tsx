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
  Database, Bell, TrendingDown, Filter, Layers, PieChart, Calculator,
  FileCheck, ClipboardList, Percent, ShoppingCart, AlertCircle
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

interface RFQQuotationSetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface RFQData {
  id: string;
  buyerName: string;
  productType: string;
  quantity: string;
  targetPrice: string;
}

interface QuotationTemplate {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
}

interface PricingRule {
  id: string;
  name: string;
  type: 'margin' | 'markup' | 'fixed';
  value: number;
  enabled: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'processing' | 'approval' | 'follow-up' | 'analytics';
  enabled: boolean;
}

export function RFQQuotationSetup({ onComplete, onClose, onAskMarbim }: RFQQuotationSetupProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Welcome
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Step 1 - Welcome & Overview
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Step 2 - Import RFQs
  const [uploadMethod, setUploadMethod] = useState<'pdf' | 'excel' | 'manual' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualRFQs, setManualRFQs] = useState<RFQData[]>([
    { id: '1', buyerName: '', productType: '', quantity: '', targetPrice: '' }
  ]);
  const [importedRFQs, setImportedRFQs] = useState<number>(0);
  
  // Step 3 - Quotation Templates
  const [quotationTemplates, setQuotationTemplates] = useState<QuotationTemplate[]>([
    { id: '1', name: 'Standard Garment Quote', category: 'Apparel', enabled: true },
    { id: '2', name: 'Bulk Order Quote', category: 'Apparel', enabled: true },
    { id: '3', name: 'Sample Development Quote', category: 'Sample', enabled: true },
    { id: '4', name: 'Rush Order Quote', category: 'Urgent', enabled: false },
  ]);
  
  // Step 4 - Pricing Rules
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    { id: '1', name: 'Standard Margin', type: 'margin', value: 25, enabled: true },
    { id: '2', name: 'Volume Discount (>1000)', type: 'margin', value: 20, enabled: true },
    { id: '3', name: 'Premium Buyer Margin', type: 'margin', value: 22, enabled: true },
  ]);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState('30% advance, 70% before shipment');
  
  // Step 5 - Automated Workflows
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([
    { 
      id: '1', 
      name: 'Auto RFQ Acknowledgment', 
      description: 'Instantly acknowledge receipt of new RFQs with estimated response time',
      category: 'processing',
      enabled: true 
    },
    { 
      id: '2', 
      name: 'AI Cost Estimation', 
      description: 'MARBIM auto-generates preliminary cost estimates based on historical data',
      category: 'processing',
      enabled: true 
    },
    { 
      id: '3', 
      name: 'Smart Quote Builder', 
      description: 'AI suggests optimal pricing, materials, and lead times for each RFQ',
      category: 'processing',
      enabled: true 
    },
    { 
      id: '4', 
      name: 'Multi-Scenario Quotes', 
      description: 'Auto-generate multiple quote scenarios (economy, standard, premium)',
      category: 'processing',
      enabled: true 
    },
    { 
      id: '5', 
      name: 'Quote Approval Routing', 
      description: 'Automatically route quotes above threshold to managers for approval',
      category: 'approval',
      enabled: true 
    },
    { 
      id: '6', 
      name: 'Expiry Alerts', 
      description: 'Notify team when quotes are about to expire (7 days before)',
      category: 'follow-up',
      enabled: true 
    },
    { 
      id: '7', 
      name: 'Follow-up Reminders', 
      description: 'Smart reminders for pending quotes that haven\'t received responses',
      category: 'follow-up',
      enabled: true 
    },
    { 
      id: '8', 
      name: 'Competitor Price Alerts', 
      description: 'Alert when your pricing is significantly higher than market rates',
      category: 'analytics',
      enabled: true 
    },
    { 
      id: '9', 
      name: 'Win/Loss Analysis', 
      description: 'Automatically track and analyze quote conversion rates',
      category: 'analytics',
      enabled: true 
    },
    { 
      id: '10', 
      name: 'Auto-Send on Approval', 
      description: 'Automatically send quotes to buyers once approved',
      category: 'processing',
      enabled: false 
    },
  ]);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [marbimMessage, setMarbimMessage] = useState('');

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'Import RFQs', icon: Upload, color: '#EAB308', desc: 'Upload requests' },
    { number: 2, title: 'Templates', icon: FileText, color: '#57ACAF', desc: 'Quote formats' },
    { number: 3, title: 'Pricing Rules', icon: Calculator, color: '#EAB308', desc: 'Set margins' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'rfq-inbox', 
      title: 'Smart RFQ Inbox', 
      desc: 'Centralized inbox with AI-powered prioritization and categorization',
      icon: FileCheck 
    },
    { 
      id: 'quote-builder', 
      title: 'Quote Builder', 
      desc: 'Dynamic quote creation with BOM, costing, and multi-scenario support',
      icon: Calculator 
    },
    { 
      id: 'ai-costing', 
      title: 'AI Cost Estimation', 
      desc: 'MARBIM predicts costs based on materials, labor, and market data',
      icon: Brain 
    },
    { 
      id: 'approval-workflow', 
      title: 'Approval Workflows', 
      desc: 'Configurable approval chains for quotes above thresholds',
      icon: CheckCircle 
    },
    { 
      id: 'version-control', 
      title: 'Version Control', 
      desc: 'Track quote revisions, negotiations, and final agreements',
      icon: FileText 
    },
    { 
      id: 'conversion-tracking', 
      title: 'Conversion Analytics', 
      desc: 'Track win rates, analyze losses, and optimize pricing strategies',
      icon: TrendingUp 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up RFQ & Quotation Management. This module helps you process RFQs faster, create accurate quotes, and win more business. Let's configure your quoting engine!",
      "Let's import your existing RFQs. You can upload a PDF (I'll extract requirements), Excel file, or add RFQs manually. I can also extract RFQ details from emails and buyer documents.",
      "Now let's set up your quotation templates. These standardized formats ensure consistency and professionalism. I've created industry-standard templates, but you can customize them for your business.",
      "Let's configure your pricing rules and margins. Set default margins, volume discounts, and buyer-specific pricing. I'll help you maintain profitability while staying competitive.",
      "Finally, let's automate your RFQ workflows! From auto-acknowledgment to AI cost estimation, follow-up reminders, and conversion tracking - I'll help you respond faster and win more quotes!"
    ];
    return messages[step] || '';
  };

  const handleNext = async () => {
    // Validation
    if (currentStep === 2 && uploadMethod === 'manual' && manualRFQs.some(r => !r.buyerName)) {
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
    toast.success('🎉 RFQ & Quotation module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      if (uploadMethod === 'pdf') {
        setImportedRFQs(Math.floor(Math.random() * 20) + 10);
        toast.success(`AI extracting RFQ requirements from PDF...`);
      } else {
        setImportedRFQs(Math.floor(Math.random() * 50) + 25);
        toast.success(`Processing ${file.name}...`);
      }
    }
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addManualRFQ = () => {
    setManualRFQs(prev => [...prev, {
      id: Date.now().toString(),
      buyerName: '',
      productType: '',
      quantity: '',
      targetPrice: ''
    }]);
  };

  const removeManualRFQ = (id: string) => {
    if (manualRFQs.length > 1) {
      setManualRFQs(prev => prev.filter(r => r.id !== id));
    }
  };

  const updateManualRFQ = (id: string, field: keyof RFQData, value: string) => {
    setManualRFQs(prev => prev.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const toggleTemplate = (id: string) => {
    setQuotationTemplates(prev => prev.map(t =>
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ));
  };

  const updatePricingRule = (id: string, field: keyof PricingRule, value: number | boolean) => {
    setPricingRules(prev => prev.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const addPricingRule = () => {
    setPricingRules(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Rule',
      type: 'margin',
      value: 20,
      enabled: true
    }]);
  };

  const removePricingRule = (id: string) => {
    if (pricingRules.length > 1) {
      setPricingRules(prev => prev.filter(r => r.id !== id));
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
      case 'processing': return Zap;
      case 'approval': return CheckCircle;
      case 'follow-up': return Bell;
      case 'analytics': return BarChart3;
      default: return Sparkles;
    }
  };

  const getWorkflowColor = (category: string) => {
    switch (category) {
      case 'processing': return '#57ACAF';
      case 'approval': return '#EAB308';
      case 'follow-up': return '#9333EA';
      case 'analytics': return '#6F83A7';
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
              RFQ & Quotation Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your Quoting Engine
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
                            <Calculator className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-center text-white mb-3">
                        RFQ & Quotation Module
                      </h2>
                      <p className="text-center text-[#6F83A7] text-lg mb-6 max-w-2xl mx-auto">
                        Transform your quotation process with AI-powered cost estimation, automated quote generation, 
                        and intelligent pricing that helps you respond faster and win more business.
                      </p>

                      {/* Key Benefits */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Brain className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">AI Costing</h3>
                          <p className="text-xs text-[#6F83A7]">Instant cost estimates</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Zap className="w-8 h-8 text-[#EAB308] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Auto Quotes</h3>
                          <p className="text-xs text-[#6F83A7]">Multi-scenario generation</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <TrendingUp className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Win Rate Tracking</h3>
                          <p className="text-xs text-[#6F83A7]">Optimize pricing strategy</p>
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
                          Complete setup in just 5-10 minutes. MARBIM will guide you through importing RFQs, 
                          configuring quote templates, setting pricing rules, and enabling AI-powered automation.
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

              {/* Step 1: Import RFQs */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[#EAB308]" />
                      Choose Import Method
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { id: 'pdf', icon: FilePlus, title: 'Upload PDF', desc: 'AI extracts RFQ details', highlight: true },
                        { id: 'excel', icon: FileSpreadsheet, title: 'Upload Excel', desc: 'Import from spreadsheet' },
                        { id: 'manual', icon: ClipboardList, title: 'Add Manually', desc: 'Enter RFQ details' },
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
                              <h4 className="text-white font-medium mb-1">AI-Powered RFQ Extraction</h4>
                              <p className="text-sm text-[#6F83A7]">
                                MARBIM will intelligently extract buyer names, product specifications, quantities, 
                                target prices, delivery requirements, and other critical RFQ details from your PDF.
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
                            or drag and drop your RFQ PDF here
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
                              <span className="text-white font-medium">AI extracting RFQ requirements...</span>
                            </div>
                            <p className="text-sm text-[#6F83A7] mb-2">
                              Found {importedRFQs} RFQ requests
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
                              Detected {importedRFQs} RFQs in your file
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
                              <span className="text-[#6F83A7]">Product Type</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                              <span className="text-[#6F83A7]">Quantity (optional)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                              <span className="text-[#6F83A7]">Target Price (optional)</span>
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
                        {manualRFQs.map((rfq, index) => (
                          <div
                            key={rfq.id}
                            className="bg-white/5 border border-white/10 rounded-xl p-5"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-white font-medium">RFQ #{index + 1}</h4>
                              {manualRFQs.length > 1 && (
                                <Button
                                  onClick={() => removeManualRFQ(rfq.id)}
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
                                  value={rfq.buyerName}
                                  onChange={(e) => updateManualRFQ(rfq.id, 'buyerName', e.target.value)}
                                  placeholder="e.g., H&M"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Product Type</Label>
                                <Input
                                  value={rfq.productType}
                                  onChange={(e) => updateManualRFQ(rfq.id, 'productType', e.target.value)}
                                  placeholder="e.g., T-Shirt, Jeans"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Quantity</Label>
                                <Input
                                  value={rfq.quantity}
                                  onChange={(e) => updateManualRFQ(rfq.id, 'quantity', e.target.value)}
                                  placeholder="1000 pcs"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Target Price</Label>
                                <Input
                                  value={rfq.targetPrice}
                                  onChange={(e) => updateManualRFQ(rfq.id, 'targetPrice', e.target.value)}
                                  placeholder="$10.50"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          onClick={addManualRFQ}
                          variant="outline"
                          className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another RFQ
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Quotation Templates */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#57ACAF]" />
                      Quotation Templates
                    </h3>

                    <div className="space-y-3 mb-6">
                      {quotationTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={`
                            bg-white/5 border border-white/10 rounded-xl p-5 transition-all
                            ${template.enabled ? 'opacity-100' : 'opacity-50'}
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <Switch
                              checked={template.enabled}
                              onCheckedChange={() => toggleTemplate(template.id)}
                            />
                            <div className="flex-1">
                              <h4 className="text-white font-medium mb-1">{template.name}</h4>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-white/5 text-[#6F83A7] border-white/10 text-xs">
                                  {template.category}
                                </Badge>
                              </div>
                            </div>
                            {template.enabled && (
                              <CheckCircle className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-white font-medium mb-2">Template Features</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            Each template includes BOM breakdown, labor costs, profit margins, payment terms, 
                            and delivery schedules. Customize them in the Quote Builder after setup.
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <span className="text-xs text-[#6F83A7]">Cost Breakdown</span>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <span className="text-xs text-[#6F83A7]">Terms & Conditions</span>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <span className="text-xs text-[#6F83A7]">Branding</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Pricing Rules */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-[#EAB308]" />
                      Pricing Rules & Margins
                    </h3>

                    <div className="space-y-3 mb-6">
                      {pricingRules.map((rule) => (
                        <div
                          key={rule.id}
                          className={`
                            bg-white/5 border border-white/10 rounded-xl p-5 transition-all
                            ${rule.enabled ? 'opacity-100' : 'opacity-50'}
                          `}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-3 flex-1">
                              <Switch
                                checked={rule.enabled}
                                onCheckedChange={() => updatePricingRule(rule.id, 'enabled', !rule.enabled)}
                              />
                              <div className="flex-1">
                                <Input
                                  value={rule.name}
                                  onChange={(e) => updatePricingRule(rule.id, 'name', e.target.value)}
                                  className="bg-white/5 border-white/10 text-white font-medium"
                                  placeholder="Rule name"
                                />
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-3">
                              <div>
                                <div className="text-xs text-[#6F83A7] mb-1">
                                  {rule.type === 'margin' ? 'Margin' : rule.type === 'markup' ? 'Markup' : 'Fixed'}
                                </div>
                                <span className="text-2xl font-bold text-white">{rule.value}%</span>
                              </div>
                              {pricingRules.length > 1 && (
                                <Button
                                  onClick={() => removePricingRule(rule.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {rule.enabled && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <input
                                  type="range"
                                  min="0"
                                  max="50"
                                  step="1"
                                  value={rule.value}
                                  onChange={(e) => updatePricingRule(rule.id, 'value', parseInt(e.target.value))}
                                  className="flex-1"
                                />
                              </div>
                              <Progress value={rule.value * 2} className="h-2" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addPricingRule}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5 mb-6"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Pricing Rule
                    </Button>

                    {/* Default Settings */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#6F83A7] mb-2 block">Default Currency</Label>
                        <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-[#6F83A7] mb-2 block">Default Payment Terms</Label>
                        <Input
                          value={defaultPaymentTerms}
                          onChange={(e) => setDefaultPaymentTerms(e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Payment terms"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Automation Workflows */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#EAB308]" />
                      Automated RFQ & Quotation Workflows
                    </h3>
                    
                    {/* Category Summary */}
                    <div className="grid grid-cols-4 gap-2 mb-6 bg-white/5 p-1 rounded-lg">
                      {[
                        { id: 'all', label: 'All', count: automationWorkflows.length },
                        { id: 'processing', label: 'Processing', count: automationWorkflows.filter(w => w.category === 'processing').length },
                        { id: 'approval', label: 'Approval', count: automationWorkflows.filter(w => w.category === 'approval').length },
                        { id: 'follow-up', label: 'Follow-up', count: automationWorkflows.filter(w => w.category === 'follow-up').length },
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
                          <h4 className="text-white font-medium mb-2">MARBIM Quote Automation</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            With these workflows enabled, MARBIM will process RFQs instantly, generate accurate quotes, 
                            track approvals, and analyze win rates. Respond to buyers 10x faster with AI automation.
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Zap className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">Instant Processing</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Respond in minutes, not days</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Brain className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">AI Costing</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Accurate price estimates</p>
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
                      You've configured all the essentials. Click "Complete Setup" to activate your RFQ & Quotation 
                      module and start winning more business with AI-powered quoting.
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {uploadedFile ? importedRFQs : manualRFQs.length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">RFQs Ready</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {quotationTemplates.filter(t => t.enabled).length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Templates</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {pricingRules.filter(r => r.enabled).length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Pricing Rules</div>
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
