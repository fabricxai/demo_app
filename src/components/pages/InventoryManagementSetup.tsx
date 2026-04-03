import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, FileSpreadsheet, CheckCircle, ArrowRight, ArrowLeft, 
  Loader2, X, Brain, Sparkles, AlertTriangle, TrendingUp,
  Shield, Target, BarChart3, Package, FileText, Plus,
  Minus, Trash2, Settings, Zap, Clock,
  Database, Bell, Filter, Layers, PieChart,
  Calculator, List, AlertCircle, Boxes, Warehouse,
  TrendingDown, ShoppingCart, Truck, DollarSign, Activity
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Switch } from '../ui/switch';

interface InventoryManagementSetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface Material {
  id: string;
  materialId: string;
  name: string;
  category: string;
  currentStock: number;
}

interface ReorderRule {
  id: string;
  category: string;
  reorderLevel: number;
  safetyStock: number;
  enabled: boolean;
}

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: string;
  enabled: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'forecasting' | 'reorder' | 'tracking' | 'optimization';
  enabled: boolean;
}

export function InventoryManagementSetup({ onComplete, onClose, onAskMarbim }: InventoryManagementSetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Step 0 - Welcome & Overview
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Step 1 - Import Materials
  const [uploadMethod, setUploadMethod] = useState<'pdf' | 'excel' | 'manual' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualMaterials, setManualMaterials] = useState<Material[]>([
    { id: '1', materialId: '', name: '', category: '', currentStock: 0 }
  ]);
  const [importedMaterials, setImportedMaterials] = useState<number>(0);
  
  // Step 2 - Reorder Rules
  const [reorderRules, setReorderRules] = useState<ReorderRule[]>([
    { id: '1', category: 'Fabric', reorderLevel: 5000, safetyStock: 2000, enabled: true },
    { id: '2', category: 'Trims & Accessories', reorderLevel: 10000, safetyStock: 5000, enabled: true },
    { id: '3', category: 'Packaging Materials', reorderLevel: 3000, safetyStock: 1000, enabled: true },
  ]);
  
  // Step 3 - Warehouses
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    { id: '1', name: 'Main Warehouse', location: 'Building A', capacity: '10,000 sq ft', enabled: true },
    { id: '2', name: 'Fabric Storage', location: 'Building B', capacity: '5,000 sq ft', enabled: true },
  ]);
  
  // Step 4 - Automated Workflows
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([
    { 
      id: '1', 
      name: 'AI Demand Forecasting', 
      description: 'MARBIM predicts material demand based on production orders, historical usage, and trends',
      category: 'forecasting',
      enabled: true 
    },
    { 
      id: '2', 
      name: 'Smart Reorder Alerts', 
      description: 'Automatic alerts when inventory reaches reorder levels with AI-optimized quantities',
      category: 'reorder',
      enabled: true 
    },
    { 
      id: '3', 
      name: 'Stockout Prevention', 
      description: 'Early detection of potential stockouts with recommended actions',
      category: 'forecasting',
      enabled: true 
    },
    { 
      id: '4', 
      name: 'Excess Inventory Detection', 
      description: 'Identify slow-moving items and suggest liquidation strategies',
      category: 'optimization',
      enabled: true 
    },
    { 
      id: '5', 
      name: 'ABC Classification', 
      description: 'Automatic categorization of materials by value and consumption patterns',
      category: 'optimization',
      enabled: true 
    },
    { 
      id: '6', 
      name: 'Barcode/RFID Tracking', 
      description: 'Real-time inventory tracking with automatic stock updates',
      category: 'tracking',
      enabled: true 
    },
    { 
      id: '7', 
      name: 'Supplier Performance Analytics', 
      description: 'Track supplier delivery times, quality, and reliability',
      category: 'tracking',
      enabled: true 
    },
    { 
      id: '8', 
      name: 'JIT Inventory Optimization', 
      description: 'Just-in-Time inventory recommendations to minimize holding costs',
      category: 'optimization',
      enabled: true 
    },
    { 
      id: '9', 
      name: 'Wastage Tracking', 
      description: 'Monitor material wastage and identify improvement opportunities',
      category: 'tracking',
      enabled: true 
    },
    { 
      id: '10', 
      name: 'Multi-Warehouse Optimization', 
      description: 'Optimal stock distribution across multiple warehouse locations',
      category: 'optimization',
      enabled: true 
    },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'Import Materials', icon: Upload, color: '#EAB308', desc: 'Inventory data' },
    { number: 2, title: 'Reorder Rules', icon: AlertTriangle, color: '#57ACAF', desc: 'Stock levels' },
    { number: 3, title: 'Warehouses', icon: Warehouse, color: '#EAB308', desc: 'Storage locations' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'demand-forecasting', 
      title: 'AI Demand Forecasting', 
      desc: 'Predict material requirements based on production plans and historical data',
      icon: Brain 
    },
    { 
      id: 'smart-reordering', 
      title: 'Smart Reordering', 
      desc: 'Automated purchase requisitions when stock reaches critical levels',
      icon: ShoppingCart 
    },
    { 
      id: 'stockout-prevention', 
      title: 'Stockout Prevention', 
      desc: 'Early warnings and recommendations to prevent production delays',
      icon: AlertTriangle 
    },
    { 
      id: 'abc-analysis', 
      title: 'ABC Classification', 
      desc: 'Automatic categorization by value, usage frequency, and criticality',
      icon: Target 
    },
    { 
      id: 'multi-warehouse', 
      title: 'Multi-Warehouse Mgmt', 
      desc: 'Track inventory across multiple storage locations in real-time',
      icon: Warehouse 
    },
    { 
      id: 'cost-optimization', 
      title: 'Cost Optimization', 
      desc: 'Minimize holding costs while ensuring material availability',
      icon: DollarSign 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up the Inventory Management Module. This module uses AI to forecast demand, prevent stockouts, optimize reorder levels, and minimize inventory costs. Let's build your intelligent inventory system!",
      "Let's import your material inventory. You can upload material lists (PDF), Excel files, or enter stock items manually. I'll help you catalog all your fabrics, trims, accessories, and packaging materials.",
      "Now let's configure smart reorder rules. Set reorder levels and safety stock for each category. MARBIM will automatically alert you when stock runs low and suggest optimal order quantities.",
      "Let's set up your warehouse locations. Define storage facilities, capacities, and enable multi-location tracking for better inventory visibility and distribution.",
      "Finally, let's enable AI-powered inventory workflows! From demand forecasting to automatic reordering, ABC classification, and wastage tracking - I'll help you achieve zero stockouts and optimal inventory turnover!"
    ];
    return messages[step] || '';
  };

  const handleNext = async () => {
    if (currentStep === 1 && uploadMethod === 'manual' && manualMaterials.some(m => !m.materialId)) {
      toast.error('Please fill in material IDs');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCompletedSteps([...completedSteps, currentStep]);
    setIsProcessing(false);
    
    if (currentStep < steps.length - 1) {
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
    toast.success('🎉 Inventory Management module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      if (uploadMethod === 'pdf') {
        setImportedMaterials(Math.floor(Math.random() * 100) + 150);
        toast.success(`AI extracting material data from PDF...`);
      } else {
        setImportedMaterials(Math.floor(Math.random() * 150) + 200);
        toast.success(`Processing ${file.name}...`);
      }
    }
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addManualMaterial = () => {
    setManualMaterials(prev => [...prev, {
      id: Date.now().toString(),
      materialId: '',
      name: '',
      category: '',
      currentStock: 0
    }]);
  };

  const removeManualMaterial = (id: string) => {
    if (manualMaterials.length > 1) {
      setManualMaterials(prev => prev.filter(m => m.id !== id));
    }
  };

  const updateManualMaterial = (id: string, field: keyof Material, value: string | number) => {
    setManualMaterials(prev => prev.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const updateReorderRule = (id: string, field: keyof ReorderRule, value: any) => {
    setReorderRules(prev => prev.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const addReorderRule = () => {
    setReorderRules(prev => [...prev, {
      id: Date.now().toString(),
      category: 'New Category',
      reorderLevel: 1000,
      safetyStock: 500,
      enabled: true
    }]);
  };

  const removeReorderRule = (id: string) => {
    if (reorderRules.length > 1) {
      setReorderRules(prev => prev.filter(r => r.id !== id));
    }
  };

  const updateWarehouse = (id: string, field: keyof Warehouse, value: any) => {
    setWarehouses(prev => prev.map(w =>
      w.id === id ? { ...w, [field]: value } : w
    ));
  };

  const addWarehouse = () => {
    setWarehouses(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Warehouse',
      location: '',
      capacity: '',
      enabled: true
    }]);
  };

  const removeWarehouse = (id: string) => {
    if (warehouses.length > 1) {
      setWarehouses(prev => prev.filter(w => w.id !== id));
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
      case 'forecasting': return Brain;
      case 'reorder': return ShoppingCart;
      case 'tracking': return Activity;
      case 'optimization': return TrendingUp;
      default: return Zap;
    }
  };

  const getWorkflowColor = (category: string) => {
    switch (category) {
      case 'forecasting': return '#57ACAF';
      case 'reorder': return '#EAB308';
      case 'tracking': return '#6F83A7';
      case 'optimization': return '#D0342C';
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
              Inventory Management Module Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your Intelligent Inventory System
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
                            <Package className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-center text-white mb-3">
                        Inventory Management Module
                      </h2>
                      <p className="text-center text-[#6F83A7] text-lg mb-6 max-w-2xl mx-auto">
                        Build an intelligent inventory system with AI-powered demand forecasting, smart reordering, 
                        stockout prevention, and cost optimization that ensures zero production delays.
                      </p>

                      {/* Key Benefits */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Brain className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">AI Forecasting</h3>
                          <p className="text-xs text-[#6F83A7]">Predict demand</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <AlertTriangle className="w-8 h-8 text-[#EAB308] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Zero Stockouts</h3>
                          <p className="text-xs text-[#6F83A7]">Smart alerts</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <DollarSign className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Cost Savings</h3>
                          <p className="text-xs text-[#6F83A7]">Optimize holding</p>
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
                          Complete setup in just 5-10 minutes. MARBIM will guide you through importing materials, 
                          configuring reorder rules, setting up warehouses, and enabling AI-powered inventory workflows.
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

              {/* Step 1: Import Materials */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[#EAB308]" />
                      Choose Import Method
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { id: 'pdf', icon: FileText, title: 'Upload PDF', desc: 'AI extracts material data', highlight: true },
                        { id: 'excel', icon: FileSpreadsheet, title: 'Upload Excel', desc: 'Import from records' },
                        { id: 'manual', icon: List, title: 'Add Manually', desc: 'Enter material details' },
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

                    {uploadMethod === 'manual' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {manualMaterials.map((material, index) => (
                          <div key={material.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-white font-medium">Material #{index + 1}</h4>
                              {manualMaterials.length > 1 && (
                                <Button
                                  onClick={() => removeManualMaterial(material.id)}
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
                                <Label className="text-[#6F83A7] mb-2 block">Material ID *</Label>
                                <Input
                                  value={material.materialId}
                                  onChange={(e) => updateManualMaterial(material.id, 'materialId', e.target.value)}
                                  placeholder="e.g., MAT-001"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Material Name</Label>
                                <Input
                                  value={material.name}
                                  onChange={(e) => updateManualMaterial(material.id, 'name', e.target.value)}
                                  placeholder="e.g., Cotton Fabric"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Category</Label>
                                <Select
                                  value={material.category}
                                  onValueChange={(value) => updateManualMaterial(material.id, 'category', value)}
                                >
                                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Fabric">Fabric</SelectItem>
                                    <SelectItem value="Trims & Accessories">Trims & Accessories</SelectItem>
                                    <SelectItem value="Packaging Materials">Packaging Materials</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Current Stock</Label>
                                <Input
                                  type="number"
                                  value={material.currentStock}
                                  onChange={(e) => updateManualMaterial(material.id, 'currentStock', parseInt(e.target.value) || 0)}
                                  placeholder="0"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          onClick={addManualMaterial}
                          variant="outline"
                          className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Material
                        </Button>
                      </motion.div>
                    )}

                    {(uploadMethod === 'pdf' || uploadMethod === 'excel') && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={uploadMethod === 'pdf' ? '.pdf' : '.xlsx,.xls'}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        
                        {!uploadedFile ? (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-[#57ACAF]/50 hover:bg-white/5 transition-all duration-300 group"
                          >
                            <Upload className="w-12 h-12 text-[#6F83A7] group-hover:text-[#57ACAF] mx-auto mb-3 transition-colors" />
                            <p className="text-white font-medium mb-1">Click to upload {uploadMethod?.toUpperCase()}</p>
                            <p className="text-sm text-[#6F83A7]">or drag and drop</p>
                          </button>
                        ) : (
                          <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/30 rounded-xl p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <CheckCircle className="w-8 h-8 text-[#57ACAF]" />
                              <div>
                                <p className="text-white font-medium">{uploadedFile.name}</p>
                                <p className="text-sm text-[#6F83A7]">{importedMaterials} materials detected</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Reorder Rules */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-[#EAB308]" />
                      Configure Smart Reorder Rules
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {reorderRules.map((rule) => (
                        <div key={rule.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Input
                                value={rule.category}
                                onChange={(e) => updateReorderRule(rule.id, 'category', e.target.value)}
                                className="bg-white/5 border-white/10 text-white font-medium w-64"
                              />
                              <Switch
                                checked={rule.enabled}
                                onCheckedChange={(checked) => updateReorderRule(rule.id, 'enabled', checked)}
                              />
                            </div>
                            {reorderRules.length > 1 && (
                              <Button
                                onClick={() => removeReorderRule(rule.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Reorder Level</Label>
                              <Input
                                type="number"
                                value={rule.reorderLevel}
                                onChange={(e) => updateReorderRule(rule.id, 'reorderLevel', parseInt(e.target.value) || 0)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Safety Stock</Label>
                              <Input
                                type="number"
                                value={rule.safetyStock}
                                onChange={(e) => updateReorderRule(rule.id, 'safetyStock', parseInt(e.target.value) || 0)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addReorderRule}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Reorder Rule
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Warehouses */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Warehouse className="w-5 h-5 text-[#EAB308]" />
                      Configure Warehouse Locations
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {warehouses.map((warehouse) => (
                        <div key={warehouse.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{warehouse.name}</h4>
                              <Switch
                                checked={warehouse.enabled}
                                onCheckedChange={(checked) => updateWarehouse(warehouse.id, 'enabled', checked)}
                              />
                            </div>
                            {warehouses.length > 1 && (
                              <Button
                                onClick={() => removeWarehouse(warehouse.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Warehouse Name</Label>
                              <Input
                                value={warehouse.name}
                                onChange={(e) => updateWarehouse(warehouse.id, 'name', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Location</Label>
                              <Input
                                value={warehouse.location}
                                onChange={(e) => updateWarehouse(warehouse.id, 'location', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Capacity</Label>
                              <Input
                                value={warehouse.capacity}
                                onChange={(e) => updateWarehouse(warehouse.id, 'capacity', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addWarehouse}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Warehouse
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Automation Workflows */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#EAB308]" />
                      Enable AI-Powered Workflows
                    </h3>
                    
                    <div className="space-y-3">
                      {automationWorkflows.map((workflow) => {
                        const Icon = getWorkflowIcon(workflow.category);
                        const color = getWorkflowColor(workflow.category);
                        
                        return (
                          <div
                            key={workflow.id}
                            className={`
                              bg-white/5 border rounded-xl p-4 transition-all duration-300
                              ${workflow.enabled ? 'border-white/20' : 'border-white/10 opacity-60'}
                            `}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${color}20` }}
                              >
                                <Icon className="w-5 h-5" style={{ color }} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="text-white font-medium mb-1">{workflow.name}</h4>
                                    <p className="text-sm text-[#6F83A7] leading-relaxed">
                                      {workflow.description}
                                    </p>
                                  </div>
                                  <Switch
                                    checked={workflow.enabled}
                                    onCheckedChange={() => toggleAutomation(workflow.id)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
              {currentStep > 0 && currentStep < steps.length - 1 && (
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
                ) : currentStep === steps.length - 1 ? (
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
