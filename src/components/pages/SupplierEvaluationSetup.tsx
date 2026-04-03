import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, FileSpreadsheet, Users, CheckCircle, ArrowRight, ArrowLeft, 
  Loader2, X, Brain, Sparkles, Award, AlertTriangle, TrendingUp,
  Shield, Target, BarChart3, Package, FileText, Download, Plus,
  Minus, Edit2, Trash2, Check, Settings, Zap, Globe, Star,
  DollarSign, Clock, Truck, Factory, ChevronRight, ChevronDown
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

interface SupplierEvaluationSetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface SupplierData {
  id: string;
  name: string;
  category: string;
  location: string;
  contact: string;
}

interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  enabled: boolean;
}

interface ComplianceRequirement {
  id: string;
  type: string;
  mandatory: boolean;
}

export function SupplierEvaluationSetup({ onComplete, onClose, onAskMarbim }: SupplierEvaluationSetupProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Welcome
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Step 1 - Welcome & Overview
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Step 2 - Upload Supplier Database
  const [uploadMethod, setUploadMethod] = useState<'csv' | 'excel' | 'manual' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualSuppliers, setManualSuppliers] = useState<SupplierData[]>([
    { id: '1', name: '', category: '', location: '', contact: '' }
  ]);
  const [importedSuppliers, setImportedSuppliers] = useState<number>(0);
  
  // Step 3 - Evaluation Criteria
  const [evaluationCriteria, setEvaluationCriteria] = useState<EvaluationCriteria[]>([
    { id: '1', name: 'Quality Score', weight: 30, enabled: true },
    { id: '2', name: 'Delivery Performance', weight: 25, enabled: true },
    { id: '3', name: 'Pricing Competitiveness', weight: 20, enabled: true },
    { id: '4', name: 'Compliance & Certifications', weight: 15, enabled: true },
    { id: '5', name: 'Communication & Support', weight: 10, enabled: true },
  ]);
  
  // Step 4 - Compliance Requirements
  const [complianceRequirements, setComplianceRequirements] = useState<ComplianceRequirement[]>([
    { id: '1', type: 'ISO 9001', mandatory: true },
    { id: '2', type: 'OEKO-TEX', mandatory: false },
    { id: '3', type: 'WRAP', mandatory: false },
    { id: '4', type: 'BSCI', mandatory: false },
    { id: '5', type: 'GOTS', mandatory: false },
  ]);
  
  // Step 5 - Automated Workflows
  const [autoRFQRouting, setAutoRFQRouting] = useState(true);
  const [autoScoring, setAutoScoring] = useState(true);
  const [autoAlerts, setAutoAlerts] = useState(true);
  const [monthlyReports, setMonthlyReports] = useState(true);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [marbimMessage, setMarbimMessage] = useState('');

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'Import Suppliers', icon: Upload, color: '#EAB308', desc: 'Upload your database' },
    { number: 2, title: 'Evaluation Criteria', icon: BarChart3, color: '#57ACAF', desc: 'Set scoring weights' },
    { number: 3, title: 'Compliance', icon: Shield, color: '#EAB308', desc: 'Define requirements' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'supplier-database', 
      title: 'Supplier Database', 
      desc: 'Centralized repository of all suppliers with detailed profiles',
      icon: Users 
    },
    { 
      id: 'rfq-management', 
      title: 'RFQ Management', 
      desc: 'Create and send RFQs to multiple suppliers, compare quotes',
      icon: FileText 
    },
    { 
      id: 'performance-scoring', 
      title: 'Performance Scoring', 
      desc: 'AI-powered evaluation based on quality, delivery, pricing',
      icon: TrendingUp 
    },
    { 
      id: 'compliance-tracking', 
      title: 'Compliance Tracking', 
      desc: 'Monitor certifications, audits, and compliance status',
      icon: Shield 
    },
    { 
      id: 'sample-tracking', 
      title: 'Sample Tracking', 
      desc: 'Request, track, and evaluate material samples',
      icon: Package 
    },
    { 
      id: 'ai-recommendations', 
      title: 'AI Recommendations', 
      desc: 'MARBIM suggests best suppliers for each material type',
      icon: Brain 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up Supplier Evaluation. This module helps you manage suppliers, evaluate performance, and make data-driven sourcing decisions. Let's get started!",
      "Let's import your existing supplier database. You can upload a CSV/Excel file with supplier details, or I can help you extract data from emails and documents. You can also add suppliers manually.",
      "Now let's define how you'll evaluate suppliers. I've set up common criteria with recommended weights based on industry best practices. You can customize these to match your priorities.",
      "Compliance is crucial in garment manufacturing. Select which certifications and standards are mandatory for your suppliers. I'll help track renewals and flag any compliance issues.",
      "Finally, let's automate your workflows! Enable features like automatic RFQ routing to qualified suppliers, real-time scoring updates, and monthly performance reports. I'll handle the heavy lifting!"
    ];
    return messages[step] || '';
  };

  const handleNext = async () => {
    // Validation
    if (currentStep === 2 && uploadMethod === 'manual' && manualSuppliers.some(s => !s.name)) {
      toast.error('Please fill in supplier names');
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
    toast.success('🎉 Supplier Evaluation module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      // Simulate import
      setImportedSuppliers(Math.floor(Math.random() * 50) + 20);
      toast.success(`Analyzing ${file.name}...`);
    }
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addManualSupplier = () => {
    setManualSuppliers(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      category: '',
      location: '',
      contact: ''
    }]);
  };

  const removeManualSupplier = (id: string) => {
    if (manualSuppliers.length > 1) {
      setManualSuppliers(prev => prev.filter(s => s.id !== id));
    }
  };

  const updateManualSupplier = (id: string, field: keyof SupplierData, value: string) => {
    setManualSuppliers(prev => prev.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const updateCriteria = (id: string, field: keyof EvaluationCriteria, value: number | boolean) => {
    setEvaluationCriteria(prev => prev.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const toggleCompliance = (id: string) => {
    setComplianceRequirements(prev => prev.map(c =>
      c.id === id ? { ...c, mandatory: !c.mandatory } : c
    ));
  };

  const totalWeight = evaluationCriteria.reduce((sum, c) => c.enabled ? sum + c.weight : sum, 0);

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
              Supplier Evaluation Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your Supplier Module
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
                        boxShadow: `0 8px 16px -4px ${step.color}40`
                      } : {}}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
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
                            {isCompleted ? <Check className="w-3 h-3" /> : step.number}
                          </div>
                          <Icon 
                            className="w-4 h-4"
                            style={{ color: isActive || isCompleted ? step.color : '#6F83A7' }}
                          />
                        </div>
                        <h3 className={`text-xs font-medium ${isActive || isCompleted ? 'text-white' : 'text-[#6F83A7]'}`}>
                          {step.title}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-xs font-medium">Setup Progress</span>
                  <Badge className="bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30 text-xs px-2 py-0.5">
                    Step {currentStep} of 5
                  </Badge>
                </div>
                <Progress value={progress} className="h-1 bg-white/10" />
              </div>
            </motion.div>
          )}

          {/* MARBIM Assistant Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-br from-[#EAB308]/10 to-[#57ACAF]/10 backdrop-blur-xl border border-[#EAB308]/30 rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 shadow-2xl shadow-[#EAB308]/30 flex items-center justify-center flex-shrink-0"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold">MARBIM</h3>
                  <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border border-[#57ACAF]/30 text-xs px-2 py-0.5">
                    AI Assistant
                  </Badge>
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-2">
                  {marbimMessage || getMarbimMessage(currentStep)}
                </p>
                <Button
                  onClick={() => onAskMarbim(`I need help with Supplier Evaluation setup, step ${currentStep}: ${currentStep > 0 ? steps[currentStep - 1].title : 'getting started'}`)}
                  variant="outline"
                  size="sm"
                  className="border-[#EAB308]/30 bg-[#EAB308]/10 text-[#EAB308] hover:bg-[#EAB308]/20 h-8 text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Ask MARBIM
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {/* Step 0 - Welcome */}
            {currentStep === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8"
              >
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#57ACAF] via-[#EAB308] to-[#57ACAF] shadow-2xl flex items-center justify-center mx-auto mb-6"
                  >
                    <Users className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Welcome to Supplier Evaluation
                  </h2>
                  <p className="text-lg text-[#6F83A7] leading-relaxed">
                    Manage your supplier network, evaluate performance, ensure compliance, and make data-driven sourcing decisions with AI-powered insights.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    const isSelected = selectedFeatures.includes(feature.id);
                    
                    return (
                      <button
                        key={feature.id}
                        onClick={() => toggleFeature(feature.id)}
                        className={`
                          p-5 rounded-xl border transition-all text-left group
                          ${isSelected
                            ? 'bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/10 border-[#57ACAF]'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
                            ${isSelected 
                              ? 'bg-[#57ACAF]/20' 
                              : 'bg-white/5 group-hover:bg-white/10'
                            }
                          `}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-[#57ACAF]' : 'text-[#6F83A7]'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`font-medium ${isSelected ? 'text-white' : 'text-[#6F83A7]'}`}>
                                {feature.title}
                              </h3>
                              {isSelected && (
                                <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                              )}
                            </div>
                            <p className="text-xs text-[#6F83A7]">{feature.desc}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium mb-1">All Features Included</p>
                    <p className="text-xs text-[#6F83A7]">
                      Select the features you want to learn about, or skip ahead to start configuring the module.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1 - Import Suppliers */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 shadow-2xl shadow-[#EAB308]/30 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Import Supplier Database</h2>
                    <p className="text-[#6F83A7] text-sm">Choose how to add your suppliers</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setUploadMethod('csv')}
                      className={`
                        p-6 rounded-xl border-2 transition-all
                        ${uploadMethod === 'csv'
                          ? 'bg-[#EAB308]/20 border-[#EAB308]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      <FileSpreadsheet className={`w-8 h-8 mx-auto mb-3 ${uploadMethod === 'csv' ? 'text-[#EAB308]' : 'text-[#6F83A7]'}`} />
                      <h3 className="text-white font-medium mb-1">CSV Upload</h3>
                      <p className="text-xs text-[#6F83A7]">Import from spreadsheet</p>
                    </button>

                    <button
                      onClick={() => setUploadMethod('excel')}
                      className={`
                        p-6 rounded-xl border-2 transition-all
                        ${uploadMethod === 'excel'
                          ? 'bg-[#EAB308]/20 border-[#EAB308]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      <FileText className={`w-8 h-8 mx-auto mb-3 ${uploadMethod === 'excel' ? 'text-[#EAB308]' : 'text-[#6F83A7]'}`} />
                      <h3 className="text-white font-medium mb-1">Excel Upload</h3>
                      <p className="text-xs text-[#6F83A7]">Import from Excel file</p>
                    </button>

                    <button
                      onClick={() => setUploadMethod('manual')}
                      className={`
                        p-6 rounded-xl border-2 transition-all
                        ${uploadMethod === 'manual'
                          ? 'bg-[#EAB308]/20 border-[#EAB308]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      <Edit2 className={`w-8 h-8 mx-auto mb-3 ${uploadMethod === 'manual' ? 'text-[#EAB308]' : 'text-[#6F83A7]'}`} />
                      <h3 className="text-white font-medium mb-1">Manual Entry</h3>
                      <p className="text-xs text-[#6F83A7]">Add one by one</p>
                    </button>
                  </div>

                  {(uploadMethod === 'csv' || uploadMethod === 'excel') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#EAB308]/30 rounded-xl p-8 text-center hover:border-[#EAB308]/50 transition-all bg-[#EAB308]/5 cursor-pointer group"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={uploadMethod === 'csv' ? '.csv' : '.xlsx,.xls'}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Upload className="w-12 h-12 text-[#EAB308] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-white font-medium mb-2">
                          {uploadedFile ? uploadedFile.name : 'Drop file here or click to browse'}
                        </h3>
                        <p className="text-sm text-[#6F83A7]">
                          {uploadMethod === 'csv' ? 'CSV file' : 'Excel file'} with supplier details
                        </p>
                      </div>

                      {uploadedFile && importedSuppliers > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/30 rounded-xl p-5"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-6 h-6 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-medium mb-1">File Processed Successfully</h3>
                              <p className="text-sm text-[#6F83A7] mb-3">
                                MARBIM analyzed your file and found <span className="text-[#57ACAF] font-medium">{importedSuppliers} suppliers</span>
                              </p>
                              <div className="flex items-center gap-2 text-xs text-[#6F83A7]">
                                <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                <span>Data validated and categorized</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <Button
                        onClick={() => onAskMarbim('Help me prepare a supplier database CSV file. What columns should I include?')}
                        variant="outline"
                        className="w-full border-[#EAB308]/30 bg-[#EAB308]/10 text-[#EAB308] hover:bg-[#EAB308]/20"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV Template
                      </Button>
                    </motion.div>
                  )}

                  {uploadMethod === 'manual' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {manualSuppliers.map((supplier, index) => (
                        <div
                          key={supplier.id}
                          className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                                <span className="text-[#EAB308] font-bold text-sm">{index + 1}</span>
                              </div>
                              <span className="text-white text-sm font-medium">Supplier {index + 1}</span>
                            </div>
                            {manualSuppliers.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeManualSupplier(supplier.id)}
                                className="text-white/60 hover:text-white h-8"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-white text-xs">Supplier Name *</Label>
                              <Input
                                value={supplier.name}
                                onChange={(e) => updateManualSupplier(supplier.id, 'name', e.target.value)}
                                placeholder="ABC Textiles Ltd."
                                className="h-9 bg-white/5 border-white/10 text-white text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-white text-xs">Category</Label>
                              <Select 
                                value={supplier.category}
                                onValueChange={(val) => updateManualSupplier(supplier.id, 'category', val)}
                              >
                                <SelectTrigger className="h-9 bg-white/5 border-white/10 text-white text-sm">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="fabric">Fabric</SelectItem>
                                  <SelectItem value="trim">Trims & Accessories</SelectItem>
                                  <SelectItem value="packaging">Packaging</SelectItem>
                                  <SelectItem value="chemicals">Chemicals & Dyes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-white text-xs">Location</Label>
                              <Input
                                value={supplier.location}
                                onChange={(e) => updateManualSupplier(supplier.id, 'location', e.target.value)}
                                placeholder="Bangladesh"
                                className="h-9 bg-white/5 border-white/10 text-white text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-white text-xs">Contact</Label>
                              <Input
                                value={supplier.contact}
                                onChange={(e) => updateManualSupplier(supplier.id, 'contact', e.target.value)}
                                placeholder="contact@supplier.com"
                                className="h-9 bg-white/5 border-white/10 text-white text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        onClick={addManualSupplier}
                        variant="outline"
                        className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 h-10"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Supplier
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2 - Evaluation Criteria */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 shadow-2xl shadow-[#57ACAF]/30 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Evaluation Criteria</h2>
                    <p className="text-[#6F83A7] text-sm">Define how suppliers will be scored</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-[#57ACAF]" />
                      <div>
                        <p className="text-white text-sm font-medium">Total Weight</p>
                        <p className="text-xs text-[#6F83A7]">Should equal 100%</p>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${totalWeight === 100 ? 'text-[#57ACAF]' : 'text-[#EAB308]'}`}>
                      {totalWeight}%
                    </div>
                  </div>

                  {evaluationCriteria.map((criteria) => (
                    <div
                      key={criteria.id}
                      className={`
                        p-4 rounded-xl border transition-all
                        ${criteria.enabled 
                          ? 'bg-white/5 border-white/10' 
                          : 'bg-white/[0.02] border-white/5 opacity-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={criteria.enabled}
                          onCheckedChange={(checked) => updateCriteria(criteria.id, 'enabled', checked)}
                        />
                        
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-sm mb-2">{criteria.name}</h3>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={criteria.weight}
                              onChange={(e) => updateCriteria(criteria.id, 'weight', parseInt(e.target.value))}
                              disabled={!criteria.enabled}
                              className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#57ACAF]"
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateCriteria(criteria.id, 'weight', Math.max(0, criteria.weight - 5))}
                                disabled={!criteria.enabled}
                                className="h-7 w-7 p-0 text-white/60 hover:text-white"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-white font-medium text-sm w-12 text-center">
                                {criteria.weight}%
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateCriteria(criteria.id, 'weight', Math.min(100, criteria.weight + 5))}
                                disabled={!criteria.enabled}
                                className="h-7 w-7 p-0 text-white/60 hover:text-white"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={() => onAskMarbim('What evaluation criteria should I prioritize for garment suppliers?')}
                    variant="outline"
                    className="w-full border-[#57ACAF]/30 bg-[#57ACAF]/10 text-[#57ACAF] hover:bg-[#57ACAF]/20"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ask MARBIM for Recommendations
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3 - Compliance Requirements */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 shadow-2xl shadow-[#EAB308]/30 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Compliance Requirements</h2>
                    <p className="text-[#6F83A7] text-sm">Set certification standards for suppliers</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    {complianceRequirements.map((req) => (
                      <button
                        key={req.id}
                        onClick={() => toggleCompliance(req.id)}
                        className={`
                          p-4 rounded-xl border transition-all text-left
                          ${req.mandatory
                            ? 'bg-gradient-to-br from-[#EAB308]/20 to-[#EAB308]/10 border-[#EAB308]'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Award className={`w-5 h-5 ${req.mandatory ? 'text-[#EAB308]' : 'text-[#6F83A7]'}`} />
                            <span className={`font-medium ${req.mandatory ? 'text-white' : 'text-[#6F83A7]'}`}>
                              {req.type}
                            </span>
                          </div>
                          {req.mandatory ? (
                            <Badge className="bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30 text-xs px-2 py-0.5">
                              Mandatory
                            </Badge>
                          ) : (
                            <span className="text-xs text-[#6F83A7]">Optional</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium mb-1">Compliance Tracking</p>
                      <p className="text-xs text-[#6F83A7]">
                        MARBIM will monitor certification expiry dates and alert you 60 days before renewal is needed.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4 - Automation Settings */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 shadow-2xl shadow-[#57ACAF]/30 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Automation & AI Features</h2>
                    <p className="text-[#6F83A7] text-sm">Let MARBIM handle routine tasks</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 'auto-rfq',
                      title: 'Automatic RFQ Routing',
                      desc: 'Send RFQs to qualified suppliers based on material type, capacity, and performance scores',
                      icon: Target,
                      enabled: autoRFQRouting,
                      setter: setAutoRFQRouting
                    },
                    {
                      id: 'auto-scoring',
                      title: 'Real-time Performance Scoring',
                      desc: 'Automatically update supplier scores based on delivery, quality, and compliance data',
                      icon: TrendingUp,
                      enabled: autoScoring,
                      setter: setAutoScoring
                    },
                    {
                      id: 'auto-alerts',
                      title: 'Smart Alerts & Notifications',
                      desc: 'Get notified about compliance issues, quote deadlines, and performance anomalies',
                      icon: AlertTriangle,
                      enabled: autoAlerts,
                      setter: setAutoAlerts
                    },
                    {
                      id: 'monthly-reports',
                      title: 'Monthly Performance Reports',
                      desc: 'Receive automated supplier performance summaries with AI-generated insights',
                      icon: BarChart3,
                      enabled: monthlyReports,
                      setter: setMonthlyReports
                    }
                  ].map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.id}
                        className="p-5 bg-white/5 border border-white/10 rounded-xl"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`
                              w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                              ${feature.enabled ? 'bg-[#57ACAF]/20' : 'bg-white/5'}
                            `}>
                              <Icon className={`w-5 h-5 ${feature.enabled ? 'text-[#57ACAF]' : 'text-[#6F83A7]'}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                              <p className="text-xs text-[#6F83A7] leading-relaxed">{feature.desc}</p>
                            </div>
                          </div>
                          <Switch
                            checked={feature.enabled}
                            onCheckedChange={feature.setter}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#EAB308]/10 border border-[#57ACAF]/30 rounded-xl p-5 flex items-start gap-3">
                    <Brain className="w-6 h-6 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">AI Learning Enabled</p>
                      <p className="text-xs text-[#6F83A7] leading-relaxed">
                        MARBIM will continuously learn from your sourcing decisions and improve recommendations over time.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            {currentStep > 0 ? (
              <Button
                onClick={handleBack}
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 px-6 py-5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/5 px-6 py-5"
              >
                Skip Setup
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={isProcessing}
              className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black px-8 py-5 shadow-lg shadow-[#EAB308]/30"
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
