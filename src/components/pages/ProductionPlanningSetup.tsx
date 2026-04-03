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
  ClipboardList, Layout, LayoutGrid, Boxes, PackageCheck, Gauge,
  Box, Container, Workflow, Route, Map, PlayCircle, PauseCircle
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

interface ProductionPlanningSetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface ProductionOrder {
  id: string;
  orderNo: string;
  buyer: string;
  product: string;
  quantity: string;
  deliveryDate: string;
}

interface ProductionLine {
  id: string;
  name: string;
  capacity: number;
  workers: number;
  enabled: boolean;
}

interface WorkflowStage {
  id: string;
  name: string;
  duration: number;
  department: string;
  enabled: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'scheduling' | 'alert' | 'optimization' | 'reporting';
  enabled: boolean;
}

export function ProductionPlanningSetup({ onComplete, onClose, onAskMarbim }: ProductionPlanningSetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Step 1 - Welcome & Overview
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Step 2 - Import Production Orders
  const [uploadMethod, setUploadMethod] = useState<'pdf' | 'excel' | 'manual' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualOrders, setManualOrders] = useState<ProductionOrder[]>([
    { id: '1', orderNo: '', buyer: '', product: '', quantity: '', deliveryDate: '' }
  ]);
  const [importedOrders, setImportedOrders] = useState<number>(0);
  
  // Step 3 - Production Lines & Capacity
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([
    { id: '1', name: 'Line A - Knits', capacity: 1200, workers: 45, enabled: true },
    { id: '2', name: 'Line B - Woven', capacity: 1000, workers: 40, enabled: true },
    { id: '3', name: 'Line C - Denim', capacity: 800, workers: 35, enabled: true },
  ]);
  
  // Step 4 - Workflow Stages
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>([
    { id: '1', name: 'Fabric Inspection', duration: 1, department: 'QC', enabled: true },
    { id: '2', name: 'Cutting', duration: 2, department: 'Cutting', enabled: true },
    { id: '3', name: 'Sewing', duration: 5, department: 'Sewing', enabled: true },
    { id: '4', name: 'Finishing', duration: 2, department: 'Finishing', enabled: true },
    { id: '5', name: 'QC Inspection', duration: 1, department: 'QC', enabled: true },
    { id: '6', name: 'Packing', duration: 1, department: 'Packing', enabled: true },
  ]);
  const [planningHorizon, setPlanningHorizon] = useState('30');
  
  // Step 5 - Automated Workflows
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([
    { 
      id: '1', 
      name: 'AI Production Scheduler', 
      description: 'MARBIM automatically schedules orders based on capacity, deadlines, and priorities',
      category: 'scheduling',
      enabled: true 
    },
    { 
      id: '2', 
      name: 'Smart Line Balancing', 
      description: 'Optimizes work distribution across production lines for maximum efficiency',
      category: 'optimization',
      enabled: true 
    },
    { 
      id: '3', 
      name: 'Capacity Planning', 
      description: 'Predicts capacity constraints and suggests resource adjustments',
      category: 'optimization',
      enabled: true 
    },
    { 
      id: '4', 
      name: 'Delay Prediction & Alerts', 
      description: 'AI predicts delivery delays and alerts teams proactively',
      category: 'alert',
      enabled: true 
    },
    { 
      id: '5', 
      name: 'Bottleneck Detection', 
      description: 'Identifies production bottlenecks and suggests process improvements',
      category: 'alert',
      enabled: true 
    },
    { 
      id: '6', 
      name: 'Material Availability Check', 
      description: 'Alerts when materials needed for scheduled orders are not available',
      category: 'alert',
      enabled: true 
    },
    { 
      id: '7', 
      name: 'Production Progress Tracking', 
      description: 'Real-time tracking of order progress through workflow stages',
      category: 'reporting',
      enabled: true 
    },
    { 
      id: '8', 
      name: 'Efficiency Analytics', 
      description: 'Tracks line efficiency, throughput, and on-time delivery metrics',
      category: 'reporting',
      enabled: true 
    },
    { 
      id: '9', 
      name: 'Dynamic Rescheduling', 
      description: 'Automatically adjusts schedules when priorities or capacities change',
      category: 'scheduling',
      enabled: true 
    },
    { 
      id: '10', 
      name: 'OEE Monitoring', 
      description: 'Overall Equipment Effectiveness tracking with AI-powered insights',
      category: 'reporting',
      enabled: true 
    },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'Import Orders', icon: Upload, color: '#EAB308', desc: 'Production orders' },
    { number: 2, title: 'Lines', icon: Factory, color: '#57ACAF', desc: 'Capacity setup' },
    { number: 3, title: 'Workflow', icon: Workflow, color: '#EAB308', desc: 'Process stages' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'ai-scheduler', 
      title: 'AI Production Scheduler', 
      desc: 'Intelligent order scheduling based on capacity, deadlines, and priorities',
      icon: Calendar 
    },
    { 
      id: 'line-balancing', 
      title: 'Smart Line Balancing', 
      desc: 'Optimize work distribution across lines for maximum efficiency',
      icon: LayoutGrid 
    },
    { 
      id: 'capacity-planning', 
      title: 'Capacity Planning', 
      desc: 'Predict bottlenecks and optimize resource utilization',
      icon: Gauge 
    },
    { 
      id: 'progress-tracking', 
      title: 'Real-time Tracking', 
      desc: 'Live visibility into order progress through each workflow stage',
      icon: Activity 
    },
    { 
      id: 'delay-prediction', 
      title: 'Delay Prediction', 
      desc: 'AI-powered early warning system for potential delivery delays',
      icon: AlertTriangle 
    },
    { 
      id: 'efficiency-analytics', 
      title: 'Efficiency Analytics', 
      desc: 'OEE monitoring, throughput analysis, and performance insights',
      icon: TrendingUp 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up the Production Planning Module. This module helps you schedule production, optimize capacity, and deliver orders on time. Let's build your production command center!",
      "Let's import your production orders. You can upload buyer order sheets (PDF), Excel files, or enter orders manually. I'll help you organize and prioritize your production queue.",
      "Now let's configure your production lines. Define your line capacities, worker counts, and specializations. This helps me schedule orders to the right lines and predict bottlenecks.",
      "Let's map your production workflow. Define the stages each order goes through (cutting, sewing, finishing, QC, packing) and their typical durations. This powers smart scheduling and progress tracking.",
      "Finally, let's automate your production planning! From AI scheduling to delay prediction, bottleneck detection, and efficiency analytics - I'll help you run a smooth, on-time production floor!"
    ];
    return messages[step] || '';
  };

  const handleNext = async () => {
    if (currentStep === 2 && uploadMethod === 'manual' && manualOrders.some(o => !o.orderNo)) {
      toast.error('Please fill in order numbers');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCompletedSteps([...completedSteps, currentStep]);
    setIsProcessing(false);
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCompletedSteps(completedSteps.filter(step => step < currentStep - 1));
    }
  };

  const handleComplete = () => {
    toast.success('🎉 Production Planning module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      if (uploadMethod === 'pdf') {
        setImportedOrders(Math.floor(Math.random() * 20) + 15);
        toast.success(`AI extracting production order data from PDF...`);
      } else {
        setImportedOrders(Math.floor(Math.random() * 50) + 30);
        toast.success(`Processing ${file.name}...`);
      }
    }
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addManualOrder = () => {
    setManualOrders(prev => [...prev, {
      id: Date.now().toString(),
      orderNo: '',
      buyer: '',
      product: '',
      quantity: '',
      deliveryDate: ''
    }]);
  };

  const removeManualOrder = (id: string) => {
    if (manualOrders.length > 1) {
      setManualOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const updateManualOrder = (id: string, field: keyof ProductionOrder, value: string) => {
    setManualOrders(prev => prev.map(o =>
      o.id === id ? { ...o, [field]: value } : o
    ));
  };

  const updateProductionLine = (id: string, field: keyof ProductionLine, value: number | boolean | string) => {
    setProductionLines(prev => prev.map(l =>
      l.id === id ? { ...l, [field]: value } : l
    ));
  };

  const addProductionLine = () => {
    setProductionLines(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Line',
      capacity: 1000,
      workers: 40,
      enabled: true
    }]);
  };

  const removeProductionLine = (id: string) => {
    if (productionLines.length > 1) {
      setProductionLines(prev => prev.filter(l => l.id !== id));
    }
  };

  const updateWorkflowStage = (id: string, field: keyof WorkflowStage, value: number | boolean | string) => {
    setWorkflowStages(prev => prev.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const addWorkflowStage = () => {
    setWorkflowStages(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Stage',
      duration: 1,
      department: 'Production',
      enabled: true
    }]);
  };

  const removeWorkflowStage = (id: string) => {
    if (workflowStages.length > 1) {
      setWorkflowStages(prev => prev.filter(s => s.id !== id));
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
      case 'scheduling': return Calendar;
      case 'alert': return Bell;
      case 'optimization': return Target;
      case 'reporting': return BarChart3;
      default: return Zap;
    }
  };

  const getWorkflowColor = (category: string) => {
    switch (category) {
      case 'scheduling': return '#57ACAF';
      case 'alert': return '#D0342C';
      case 'optimization': return '#EAB308';
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
              Production Planning Module Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your Production Floor
            </h1>
            <p className="text-lg text-[#6F83A7]">
              MARBIM will guide you through the setup process
            </p>
          </motion.div>

          {/* Progress */}
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

          {/* MARBIM Message */}
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
                            <Factory className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-center text-white mb-3">
                        Production Planning Module
                      </h2>
                      <p className="text-center text-[#6F83A7] text-lg mb-6 max-w-2xl mx-auto">
                        Build an intelligent production system with AI-powered scheduling, capacity optimization, 
                        and real-time tracking that ensures on-time delivery every time.
                      </p>

                      {/* Key Benefits */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Calendar className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Smart Scheduling</h3>
                          <p className="text-xs text-[#6F83A7]">AI-optimized planning</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Gauge className="w-8 h-8 text-[#EAB308] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Capacity Optimization</h3>
                          <p className="text-xs text-[#6F83A7]">Maximize throughput</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Activity className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Real-time Tracking</h3>
                          <p className="text-xs text-[#6F83A7]">Live order visibility</p>
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

                  {/* Setup Time */}
                  <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-2">Quick Setup</h3>
                        <p className="text-sm text-[#6F83A7] mb-3">
                          Complete setup in just 5-10 minutes. MARBIM will guide you through importing production orders, 
                          configuring production lines, mapping workflows, and enabling intelligent automation.
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

              {/* Step 1: Import Production Orders */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[#EAB308]" />
                      Choose Import Method
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { id: 'pdf', icon: FilePlus, title: 'Upload PDF', desc: 'AI extracts order data', highlight: true },
                        { id: 'excel', icon: FileSpreadsheet, title: 'Upload Excel', desc: 'Import from spreadsheet' },
                        { id: 'manual', icon: List, title: 'Add Manually', desc: 'Enter order details' },
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

                    {/* PDF Upload */}
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
                              <h4 className="text-white font-medium mb-1">AI-Powered Order Extraction</h4>
                              <p className="text-sm text-[#6F83A7]">
                                MARBIM will extract order numbers, buyers, products, quantities, delivery dates, 
                                and priorities from your order sheets or buyer POs.
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
                            or drag and drop your order sheet PDF here
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
                              <span className="text-white font-medium">AI extracting production order data...</span>
                            </div>
                            <p className="text-sm text-[#6F83A7] mb-2">
                              Found {importedOrders} production orders
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
                              Detected {importedOrders} production orders in your file
                            </p>
                            <Progress value={100} className="h-2" />
                          </motion.div>
                        )}

                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <h4 className="text-white font-medium mb-3 text-sm">Recommended Columns:</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF]" />
                              <span className="text-[#6F83A7]">Order Number</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF]" />
                              <span className="text-[#6F83A7]">Buyer</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF]" />
                              <span className="text-[#6F83A7]">Product</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF]" />
                              <span className="text-[#6F83A7]">Quantity</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                              <span className="text-[#6F83A7]">Delivery Date (optional)</span>
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
                        {manualOrders.map((order, index) => (
                          <div
                            key={order.id}
                            className="bg-white/5 border border-white/10 rounded-xl p-5"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-white font-medium">Order #{index + 1}</h4>
                              {manualOrders.length > 1 && (
                                <Button
                                  onClick={() => removeManualOrder(order.id)}
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
                                <Label className="text-[#6F83A7] mb-2 block">Order Number *</Label>
                                <Input
                                  value={order.orderNo}
                                  onChange={(e) => updateManualOrder(order.id, 'orderNo', e.target.value)}
                                  placeholder="e.g., PO-2024-001"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Buyer</Label>
                                <Input
                                  value={order.buyer}
                                  onChange={(e) => updateManualOrder(order.id, 'buyer', e.target.value)}
                                  placeholder="e.g., Zara"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Product</Label>
                                <Input
                                  value={order.product}
                                  onChange={(e) => updateManualOrder(order.id, 'product', e.target.value)}
                                  placeholder="e.g., Cotton T-Shirt"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Quantity</Label>
                                <Input
                                  value={order.quantity}
                                  onChange={(e) => updateManualOrder(order.id, 'quantity', e.target.value)}
                                  placeholder="1000 pcs"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div className="col-span-2">
                                <Label className="text-[#6F83A7] mb-2 block">Delivery Date</Label>
                                <Input
                                  type="date"
                                  value={order.deliveryDate}
                                  onChange={(e) => updateManualOrder(order.id, 'deliveryDate', e.target.value)}
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          onClick={addManualOrder}
                          variant="outline"
                          className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Order
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Production Lines */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Factory className="w-5 h-5 text-[#57ACAF]" />
                      Configure Production Lines & Capacity
                    </h3>

                    <div className="space-y-3 mb-6">
                      {productionLines.map((line) => (
                        <div
                          key={line.id}
                          className={`
                            bg-white/5 border border-white/10 rounded-xl p-5 transition-all
                            ${line.enabled ? 'opacity-100' : 'opacity-50'}
                          `}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <Switch
                              checked={line.enabled}
                              onCheckedChange={() => updateProductionLine(line.id, 'enabled', !line.enabled)}
                            />
                            <div className="flex-1">
                              <Input
                                value={line.name}
                                onChange={(e) => updateProductionLine(line.id, 'name', e.target.value)}
                                className="bg-white/5 border-white/10 text-white font-medium"
                                placeholder="Line name"
                              />
                            </div>
                            {productionLines.length > 1 && (
                              <Button
                                onClick={() => removeProductionLine(line.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          {line.enabled && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block text-sm">Daily Capacity (pcs)</Label>
                                <div className="flex items-center gap-2">
                                  <Gauge className="w-4 h-4 text-[#57ACAF]" />
                                  <Input
                                    type="number"
                                    value={line.capacity}
                                    onChange={(e) => updateProductionLine(line.id, 'capacity', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 text-white"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block text-sm">Workers</Label>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-[#6F83A7]" />
                                  <Input
                                    type="number"
                                    value={line.workers}
                                    onChange={(e) => updateProductionLine(line.id, 'workers', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addProductionLine}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Production Line
                    </Button>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-5">
                    <h4 className="text-white font-medium mb-3">Total Capacity</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {productionLines.filter(l => l.enabled).reduce((sum, l) => sum + l.capacity, 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Pieces/Day</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {productionLines.filter(l => l.enabled).reduce((sum, l) => sum + l.workers, 0)}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Total Workers</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {productionLines.filter(l => l.enabled).length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Active Lines</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Workflow Stages */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-[#EAB308]" />
                      Configure Production Workflow
                    </h3>

                    <div className="space-y-3 mb-6">
                      {workflowStages.map((stage, index) => (
                        <div
                          key={stage.id}
                          className={`
                            bg-white/5 border border-white/10 rounded-xl p-5 transition-all
                            ${stage.enabled ? 'opacity-100' : 'opacity-50'}
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium
                                ${stage.enabled ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : 'bg-white/5 text-[#6F83A7]'}
                              `}>
                                {index + 1}
                              </div>
                              <Switch
                                checked={stage.enabled}
                                onCheckedChange={() => updateWorkflowStage(stage.id, 'enabled', !stage.enabled)}
                              />
                            </div>
                            <div className="flex-1 grid grid-cols-3 gap-3">
                              <Input
                                value={stage.name}
                                onChange={(e) => updateWorkflowStage(stage.id, 'name', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="Stage name"
                              />
                              <Input
                                value={stage.department}
                                onChange={(e) => updateWorkflowStage(stage.id, 'department', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="Department"
                              />
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={stage.duration}
                                  onChange={(e) => updateWorkflowStage(stage.id, 'duration', parseInt(e.target.value) || 0)}
                                  className="bg-white/5 border-white/10 text-white"
                                  placeholder="Days"
                                />
                                <span className="text-[#6F83A7] text-sm whitespace-nowrap">days</span>
                              </div>
                            </div>
                            {workflowStages.length > 1 && (
                              <Button
                                onClick={() => removeWorkflowStage(stage.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addWorkflowStage}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5 mb-6"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Workflow Stage
                    </Button>

                    {/* Planning Horizon */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                      <Label className="text-white mb-3 block">Planning Horizon</Label>
                      <Select value={planningHorizon} onValueChange={setPlanningHorizon}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="15">15 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[#6F83A7] mt-2">
                        How far ahead should MARBIM plan production schedules?
                      </p>
                    </div>
                  </div>

                  {/* Workflow Summary */}
                  <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                    <h4 className="text-white font-medium mb-3">Total Lead Time</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white/5 rounded-lg p-4">
                        <div className="text-3xl font-bold text-white mb-1">
                          {workflowStages.filter(s => s.enabled).reduce((sum, s) => sum + s.duration, 0)}
                        </div>
                        <div className="text-sm text-[#6F83A7]">days from fabric to shipment</div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-[#6F83A7]" />
                      <div className="flex-1 bg-white/5 rounded-lg p-4">
                        <div className="text-3xl font-bold text-white mb-1">
                          {workflowStages.filter(s => s.enabled).length}
                        </div>
                        <div className="text-sm text-[#6F83A7]">workflow stages</div>
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
                      Automated Production Workflows
                    </h3>
                    
                    {/* Category Summary */}
                    <div className="grid grid-cols-4 gap-2 mb-6 bg-white/5 p-1 rounded-lg">
                      {[
                        { id: 'all', label: 'All', count: automationWorkflows.length },
                        { id: 'scheduling', label: 'Scheduling', count: automationWorkflows.filter(w => w.category === 'scheduling').length },
                        { id: 'alert', label: 'Alerts', count: automationWorkflows.filter(w => w.category === 'alert').length },
                        { id: 'optimization', label: 'Optimization', count: automationWorkflows.filter(w => w.category === 'optimization').length },
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
                          <h4 className="text-white font-medium mb-2">MARBIM Production Intelligence</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            With these workflows enabled, MARBIM will automatically schedule orders, balance production lines, 
                            predict delays, and optimize capacity. Deliver on time, every time.
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">Smart Scheduling</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">AI-optimized planning</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">Early Warnings</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Proactive delay alerts</p>
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
                      Your production floor is configured and ready. Click "Complete Setup" to activate intelligent 
                      scheduling and start delivering orders on time with AI-powered production planning.
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {uploadedFile ? importedOrders : manualOrders.length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Orders</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {productionLines.filter(l => l.enabled).length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Lines</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {workflowStages.filter(s => s.enabled).length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Stages</div>
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
