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
  Database, Bell, TrendingDown, Filter, Layers, PieChart, Eye,
  Calculator, Percent, Scissors, Shirt, List, AlertCircle, 
  TrendingDownIcon, ArrowUpRight, ArrowDownRight, Gauge, Boxes
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

interface CostingSetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface CostSheetData {
  id: string;
  productName: string;
  buyer: string;
  orderQty: string;
  targetFOB: string;
}

interface CostComponent {
  id: string;
  category: 'material' | 'labor' | 'overhead';
  name: string;
  unit: string;
  rate: number;
  enabled: boolean;
}

interface MarginRule {
  id: string;
  name: string;
  minMargin: number;
  targetMargin: number;
  enabled: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'calculation' | 'alert' | 'approval' | 'reporting';
  enabled: boolean;
}

export function CostingSetup({ onComplete, onClose, onAskMarbim }: CostingSetupProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Welcome
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Step 1 - Welcome & Overview
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Step 2 - Import Cost Sheets
  const [uploadMethod, setUploadMethod] = useState<'pdf' | 'excel' | 'manual' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualCostSheets, setManualCostSheets] = useState<CostSheetData[]>([
    { id: '1', productName: '', buyer: '', orderQty: '', targetFOB: '' }
  ]);
  const [importedCostSheets, setImportedCostSheets] = useState<number>(0);
  
  // Step 3 - Cost Components
  const [costComponents, setCostComponents] = useState<CostComponent[]>([
    { id: '1', category: 'material', name: 'Fabric', unit: 'kg', rate: 8.50, enabled: true },
    { id: '2', category: 'material', name: 'Trims & Accessories', unit: 'set', rate: 2.30, enabled: true },
    { id: '3', category: 'material', name: 'Packaging', unit: 'pc', rate: 0.80, enabled: true },
    { id: '4', category: 'labor', name: 'Cutting', unit: 'min', rate: 0.15, enabled: true },
    { id: '5', category: 'labor', name: 'Sewing', unit: 'min', rate: 0.12, enabled: true },
    { id: '6', category: 'labor', name: 'Finishing', unit: 'min', rate: 0.10, enabled: true },
    { id: '7', category: 'overhead', name: 'Factory Overhead', unit: '%', rate: 15, enabled: true },
    { id: '8', category: 'overhead', name: 'Admin & Selling', unit: '%', rate: 8, enabled: true },
  ]);
  
  // Step 4 - Pricing & Margins
  const [marginRules, setMarginRules] = useState<MarginRule[]>([
    { id: '1', name: 'Standard Products', minMargin: 18, targetMargin: 25, enabled: true },
    { id: '2', name: 'Premium/Complex', minMargin: 22, targetMargin: 30, enabled: true },
    { id: '3', name: 'Bulk Orders (>5000)', minMargin: 15, targetMargin: 20, enabled: true },
  ]);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [costingMethod, setCostingMethod] = useState<'standard' | 'actual'>('standard');
  
  // Step 5 - Automated Workflows
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([
    { 
      id: '1', 
      name: 'Auto BOM Generation', 
      description: 'MARBIM generates Bill of Materials from product specs and tech packs',
      category: 'calculation',
      enabled: true 
    },
    { 
      id: '2', 
      name: 'Smart Cost Calculation', 
      description: 'AI calculates material, labor, and overhead costs automatically',
      category: 'calculation',
      enabled: true 
    },
    { 
      id: '3', 
      name: 'Dynamic Margin Optimization', 
      description: 'Suggests optimal margins based on buyer, volume, and market conditions',
      category: 'calculation',
      enabled: true 
    },
    { 
      id: '4', 
      name: 'Price Competitiveness Check', 
      description: 'Compares your FOB prices against market benchmarks',
      category: 'alert',
      enabled: true 
    },
    { 
      id: '5', 
      name: 'Low Margin Alerts', 
      description: 'Notify when cost sheets have margins below minimum thresholds',
      category: 'alert',
      enabled: true 
    },
    { 
      id: '6', 
      name: 'Material Price Variance Alerts', 
      description: 'Alert when material costs deviate significantly from standards',
      category: 'alert',
      enabled: true 
    },
    { 
      id: '7', 
      name: 'Cost Sheet Approval Workflow', 
      description: 'Route cost sheets above threshold to managers for approval',
      category: 'approval',
      enabled: true 
    },
    { 
      id: '8', 
      name: 'Revision Tracking', 
      description: 'Automatically track and log all cost sheet revisions',
      category: 'reporting',
      enabled: true 
    },
    { 
      id: '9', 
      name: 'Profitability Analysis', 
      description: 'Generate reports on margin trends, cost breakdowns, and profitability',
      category: 'reporting',
      enabled: true 
    },
    { 
      id: '10', 
      name: 'Buyer-Specific Costing Templates', 
      description: 'Auto-apply buyer-specific pricing rules and formats',
      category: 'calculation',
      enabled: true 
    },
  ]);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [marbimMessage, setMarbimMessage] = useState('');

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'Import Costs', icon: Upload, color: '#EAB308', desc: 'Upload cost sheets' },
    { number: 2, title: 'Components', icon: Layers, color: '#57ACAF', desc: 'Material/Labor/OH' },
    { number: 3, title: 'Margins', icon: Percent, color: '#EAB308', desc: 'Pricing rules' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'bom-builder', 
      title: 'Smart BOM Builder', 
      desc: 'AI-powered Bill of Materials generation from tech packs and specifications',
      icon: List 
    },
    { 
      id: 'cost-calculator', 
      title: 'Auto Cost Calculator', 
      desc: 'Instant cost calculations with material, labor, and overhead breakdowns',
      icon: Calculator 
    },
    { 
      id: 'margin-analyzer', 
      title: 'Margin Health Monitor', 
      desc: 'Real-time margin tracking with profitability alerts and optimization',
      icon: Gauge 
    },
    { 
      id: 'scenario-modeling', 
      title: 'Scenario Modeling', 
      desc: 'Compare multiple cost scenarios (economy, standard, premium)',
      icon: Layers 
    },
    { 
      id: 'version-control', 
      title: 'Version Control', 
      desc: 'Track all cost sheet revisions and buyer negotiations',
      icon: FileText 
    },
    { 
      id: 'profitability-analytics', 
      title: 'Profitability Analytics', 
      desc: 'Deep insights into cost trends, margin performance, and efficiency',
      icon: TrendingUp 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up the Costing Module. This module helps you create accurate cost sheets, optimize margins, and ensure profitability on every order. Let's configure your costing engine!",
      "Let's import your existing cost sheets. You can upload a PDF (I'll extract cost details), Excel file, or add cost sheets manually. I can also extract costing data from buyer quotations and historical orders.",
      "Now let's define your cost components. Set up standard rates for materials (fabric, trims, packaging), labor operations (cutting, sewing, finishing), and overhead percentages. These form the foundation of your costing.",
      "Let's configure your margin rules and pricing strategy. Set minimum and target margins for different product categories, buyers, and order volumes. I'll help you maintain profitability while staying competitive.",
      "Finally, let's automate your costing workflows! From auto BOM generation to margin alerts, price competitiveness checks, and profitability reports - I'll help you cost faster and more accurately!"
    ];
    return messages[step] || '';
  };

  const handleNext = async () => {
    // Validation
    if (currentStep === 2 && uploadMethod === 'manual' && manualCostSheets.some(c => !c.productName)) {
      toast.error('Please fill in product names');
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
    toast.success('🎉 Costing module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      if (uploadMethod === 'pdf') {
        setImportedCostSheets(Math.floor(Math.random() * 15) + 8);
        toast.success(`AI extracting cost sheet data from PDF...`);
      } else {
        setImportedCostSheets(Math.floor(Math.random() * 40) + 20);
        toast.success(`Processing ${file.name}...`);
      }
    }
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addManualCostSheet = () => {
    setManualCostSheets(prev => [...prev, {
      id: Date.now().toString(),
      productName: '',
      buyer: '',
      orderQty: '',
      targetFOB: ''
    }]);
  };

  const removeManualCostSheet = (id: string) => {
    if (manualCostSheets.length > 1) {
      setManualCostSheets(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateManualCostSheet = (id: string, field: keyof CostSheetData, value: string) => {
    setManualCostSheets(prev => prev.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const updateComponent = (id: string, field: keyof CostComponent, value: number | boolean | string) => {
    setCostComponents(prev => prev.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const addComponent = (category: 'material' | 'labor' | 'overhead') => {
    setCostComponents(prev => [...prev, {
      id: Date.now().toString(),
      category,
      name: 'New Component',
      unit: category === 'overhead' ? '%' : 'unit',
      rate: 0,
      enabled: true
    }]);
  };

  const removeComponent = (id: string) => {
    setCostComponents(prev => prev.filter(c => c.id !== id));
  };

  const updateMarginRule = (id: string, field: keyof MarginRule, value: number | boolean | string) => {
    setMarginRules(prev => prev.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const addMarginRule = () => {
    setMarginRules(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Rule',
      minMargin: 15,
      targetMargin: 20,
      enabled: true
    }]);
  };

  const removeMarginRule = (id: string) => {
    if (marginRules.length > 1) {
      setMarginRules(prev => prev.filter(r => r.id !== id));
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
      case 'calculation': return Calculator;
      case 'alert': return Bell;
      case 'approval': return CheckCircle;
      case 'reporting': return BarChart3;
      default: return Zap;
    }
  };

  const getWorkflowColor = (category: string) => {
    switch (category) {
      case 'calculation': return '#57ACAF';
      case 'alert': return '#D0342C';
      case 'approval': return '#EAB308';
      case 'reporting': return '#6F83A7';
      default: return '#57ACAF';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'material': return Shirt;
      case 'labor': return Users;
      case 'overhead': return Factory;
      default: return Package;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'material': return '#57ACAF';
      case 'labor': return '#EAB308';
      case 'overhead': return '#6F83A7';
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
              Costing Module Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your Costing Engine
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
                        Costing Module
                      </h2>
                      <p className="text-center text-[#6F83A7] text-lg mb-6 max-w-2xl mx-auto">
                        Build a precision costing system with AI-powered BOM generation, automated cost calculations, 
                        and intelligent margin optimization that ensures profitability on every order.
                      </p>

                      {/* Key Benefits */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Calculator className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Auto Calculations</h3>
                          <p className="text-xs text-[#6F83A7]">Instant accurate costing</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Gauge className="w-8 h-8 text-[#EAB308] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Margin Monitor</h3>
                          <p className="text-xs text-[#6F83A7]">Real-time profitability</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Brain className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">AI BOM Builder</h3>
                          <p className="text-xs text-[#6F83A7]">Smart material lists</p>
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
                          Complete setup in just 5-10 minutes. MARBIM will guide you through importing cost sheets, 
                          configuring cost components, setting margin rules, and enabling automated costing workflows.
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

              {/* Step 1: Import Cost Sheets */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[#EAB308]" />
                      Choose Import Method
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { id: 'pdf', icon: FilePlus, title: 'Upload PDF', desc: 'AI extracts cost data', highlight: true },
                        { id: 'excel', icon: FileSpreadsheet, title: 'Upload Excel', desc: 'Import from spreadsheet' },
                        { id: 'manual', icon: List, title: 'Add Manually', desc: 'Enter cost details' },
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
                              <h4 className="text-white font-medium mb-1">AI-Powered Cost Extraction</h4>
                              <p className="text-sm text-[#6F83A7]">
                                MARBIM will intelligently extract product names, buyers, order quantities, material costs, 
                                labor details, FOB prices, and margin breakdowns from your cost sheets.
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
                            or drag and drop your cost sheet PDF here
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
                              <span className="text-white font-medium">AI extracting cost sheet data...</span>
                            </div>
                            <p className="text-sm text-[#6F83A7] mb-2">
                              Found {importedCostSheets} cost sheets
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
                              Detected {importedCostSheets} cost sheets in your file
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
                          <h4 className="text-white font-medium mb-3 text-sm">Recommended Columns:</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF]" />
                              <span className="text-[#6F83A7]">Product Name</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF]" />
                              <span className="text-[#6F83A7]">Buyer</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                              <span className="text-[#6F83A7]">Order Qty (optional)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                              <span className="text-[#6F83A7]">FOB Price (optional)</span>
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
                        {manualCostSheets.map((sheet, index) => (
                          <div
                            key={sheet.id}
                            className="bg-white/5 border border-white/10 rounded-xl p-5"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-white font-medium">Cost Sheet #{index + 1}</h4>
                              {manualCostSheets.length > 1 && (
                                <Button
                                  onClick={() => removeManualCostSheet(sheet.id)}
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
                                <Label className="text-[#6F83A7] mb-2 block">Product Name *</Label>
                                <Input
                                  value={sheet.productName}
                                  onChange={(e) => updateManualCostSheet(sheet.id, 'productName', e.target.value)}
                                  placeholder="e.g., Basic T-Shirt"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Buyer</Label>
                                <Input
                                  value={sheet.buyer}
                                  onChange={(e) => updateManualCostSheet(sheet.id, 'buyer', e.target.value)}
                                  placeholder="e.g., Zara"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Order Quantity</Label>
                                <Input
                                  value={sheet.orderQty}
                                  onChange={(e) => updateManualCostSheet(sheet.id, 'orderQty', e.target.value)}
                                  placeholder="1000 pcs"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Target FOB</Label>
                                <Input
                                  value={sheet.targetFOB}
                                  onChange={(e) => updateManualCostSheet(sheet.id, 'targetFOB', e.target.value)}
                                  placeholder="$8.50"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          onClick={addManualCostSheet}
                          variant="outline"
                          className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Cost Sheet
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Cost Components */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#57ACAF]" />
                      Configure Cost Components
                    </h3>

                    {/* Categories */}
                    {['material', 'labor', 'overhead'].map((category) => {
                      const Icon = getCategoryIcon(category);
                      const color = getCategoryColor(category);
                      const components = costComponents.filter(c => c.category === category);
                      
                      return (
                        <div key={category} className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${color}20` }}
                            >
                              <Icon className="w-4 h-4" style={{ color }} />
                            </div>
                            <h4 className="text-white font-medium capitalize">{category} Costs</h4>
                            <Badge className="bg-white/5 text-[#6F83A7] border-white/10 text-xs">
                              {components.filter(c => c.enabled).length} active
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            {components.map((component) => (
                              <div
                                key={component.id}
                                className={`
                                  bg-white/5 border border-white/10 rounded-lg p-3 transition-all
                                  ${component.enabled ? 'opacity-100' : 'opacity-50'}
                                `}
                              >
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={component.enabled}
                                    onCheckedChange={() => updateComponent(component.id, 'enabled', !component.enabled)}
                                  />
                                  <div className="flex-1 grid grid-cols-3 gap-3">
                                    <Input
                                      value={component.name}
                                      onChange={(e) => updateComponent(component.id, 'name', e.target.value)}
                                      className="bg-white/5 border-white/10 text-white text-sm"
                                      placeholder="Component name"
                                    />
                                    <Input
                                      value={component.unit}
                                      onChange={(e) => updateComponent(component.id, 'unit', e.target.value)}
                                      className="bg-white/5 border-white/10 text-white text-sm"
                                      placeholder="Unit"
                                    />
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="w-4 h-4 text-[#6F83A7]" />
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={component.rate}
                                        onChange={(e) => updateComponent(component.id, 'rate', parseFloat(e.target.value) || 0)}
                                        className="bg-white/5 border-white/10 text-white text-sm"
                                        placeholder="Rate"
                                      />
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() => removeComponent(component.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <Button
                            onClick={() => addComponent(category as any)}
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add {category.charAt(0).toUpperCase() + category.slice(1)} Component
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Margins & Pricing */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Percent className="w-5 h-5 text-[#EAB308]" />
                      Margin Rules & Pricing Strategy
                    </h3>

                    <div className="space-y-3 mb-6">
                      {marginRules.map((rule) => (
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
                                onCheckedChange={() => updateMarginRule(rule.id, 'enabled', !rule.enabled)}
                              />
                              <div className="flex-1">
                                <Input
                                  value={rule.name}
                                  onChange={(e) => updateMarginRule(rule.id, 'name', e.target.value)}
                                  className="bg-white/5 border-white/10 text-white font-medium"
                                  placeholder="Rule name"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-xs text-[#6F83A7] mb-1">Min</div>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    value={rule.minMargin}
                                    onChange={(e) => updateMarginRule(rule.id, 'minMargin', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 text-white w-16 text-center"
                                  />
                                  <span className="text-white">%</span>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-[#6F83A7] mb-1">Target</div>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    value={rule.targetMargin}
                                    onChange={(e) => updateMarginRule(rule.id, 'targetMargin', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 text-white w-16 text-center"
                                  />
                                  <span className="text-white">%</span>
                                </div>
                              </div>
                              {marginRules.length > 1 && (
                                <Button
                                  onClick={() => removeMarginRule(rule.id)}
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
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs text-[#6F83A7] mb-2">Minimum Margin</div>
                                <Progress value={(rule.minMargin / 50) * 100} className="h-2" />
                              </div>
                              <div>
                                <div className="text-xs text-[#6F83A7] mb-2">Target Margin</div>
                                <Progress value={(rule.targetMargin / 50) * 100} className="h-2" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addMarginRule}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5 mb-6"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Margin Rule
                    </Button>

                    {/* Settings */}
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
                        <Label className="text-[#6F83A7] mb-2 block">Costing Method</Label>
                        <Select value={costingMethod} onValueChange={(v: any) => setCostingMethod(v)}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Costing</SelectItem>
                            <SelectItem value="actual">Actual Costing</SelectItem>
                          </SelectContent>
                        </Select>
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
                      Automated Costing Workflows
                    </h3>
                    
                    {/* Category Summary */}
                    <div className="grid grid-cols-4 gap-2 mb-6 bg-white/5 p-1 rounded-lg">
                      {[
                        { id: 'all', label: 'All', count: automationWorkflows.length },
                        { id: 'calculation', label: 'Calculation', count: automationWorkflows.filter(w => w.category === 'calculation').length },
                        { id: 'alert', label: 'Alerts', count: automationWorkflows.filter(w => w.category === 'alert').length },
                        { id: 'reporting', label: 'Reports', count: automationWorkflows.filter(w => w.category === 'reporting').length },
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
                          <h4 className="text-white font-medium mb-2">MARBIM Costing Intelligence</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            With these workflows enabled, MARBIM will automatically generate BOMs, calculate costs, 
                            optimize margins, and alert you to profitability issues. Cost with precision and confidence.
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Calculator className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">Auto Calculations</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Instant accurate costing</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Gauge className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">Margin Protection</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Real-time profitability alerts</p>
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
                      You've configured all the essentials. Click "Complete Setup" to activate your Costing 
                      module and start creating accurate, profitable cost sheets with AI assistance.
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {uploadedFile ? importedCostSheets : manualCostSheets.length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Cost Sheets</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {costComponents.filter(c => c.enabled).length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Components</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {marginRules.filter(r => r.enabled).length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Margin Rules</div>
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
