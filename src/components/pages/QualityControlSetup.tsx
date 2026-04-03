import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, FileSpreadsheet, CheckCircle, ArrowRight, ArrowLeft, 
  Loader2, X, Brain, Sparkles, AlertTriangle, TrendingUp,
  Shield, Target, BarChart3, FileText, Plus, Trash2, Settings, Zap, Clock,
  Bell, List, AlertCircle, ClipboardCheck, Eye, Award, Camera,
  Search, TrendingDown, CheckSquare, XCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Switch } from '../ui/switch';

interface QualityControlSetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface QCCheckpoint {
  id: string;
  name: string;
  stage: string;
  frequency: string;
  enabled: boolean;
}

interface DefectType {
  id: string;
  name: string;
  severity: string;
  enabled: boolean;
}

interface QualityStandard {
  id: string;
  name: string;
  aqlLevel: string;
  enabled: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'inspection' | 'defect' | 'reporting' | 'compliance';
  enabled: boolean;
}

export function QualityControlSetup({ onComplete, onClose, onAskMarbim }: QualityControlSetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const [qcCheckpoints, setQcCheckpoints] = useState<QCCheckpoint[]>([
    { id: '1', name: 'Fabric Inspection', stage: 'Raw Material', frequency: 'Every Roll', enabled: true },
    { id: '2', name: 'Cutting QC', stage: 'Cutting', frequency: 'Every 50 pcs', enabled: true },
    { id: '3', name: 'In-Line Check', stage: 'Sewing', frequency: 'Every Hour', enabled: true },
    { id: '4', name: 'Final Inspection', stage: 'Finishing', frequency: '100% AQL 2.5', enabled: true },
  ]);
  
  const [defectTypes, setDefectTypes] = useState<DefectType[]>([
    { id: '1', name: 'Stitching Issues', severity: 'Major', enabled: true },
    { id: '2', name: 'Fabric Defects', severity: 'Critical', enabled: true },
    { id: '3', name: 'Measurement Variation', severity: 'Major', enabled: true },
    { id: '4', name: 'Color Mismatch', severity: 'Critical', enabled: true },
  ]);
  
  const [qualityStandards, setQualityStandards] = useState<QualityStandard[]>([
    { id: '1', name: 'ISO 9001', aqlLevel: 'AQL 2.5', enabled: true },
    { id: '2', name: 'WRAP Compliance', aqlLevel: 'AQL 1.5', enabled: true },
  ]);
  
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([
    { 
      id: '1', 
      name: 'AI Visual Inspection', 
      description: 'Computer vision detects fabric defects, stitching issues, and color variations automatically',
      category: 'inspection',
      enabled: true 
    },
    { 
      id: '2', 
      name: 'Defect Pattern Recognition', 
      description: 'MARBIM identifies recurring defect patterns and suggests root cause solutions',
      category: 'defect',
      enabled: true 
    },
    { 
      id: '3', 
      name: 'Real-Time QC Alerts', 
      description: 'Instant notifications when defect rates exceed acceptable limits',
      category: 'inspection',
      enabled: true 
    },
    { 
      id: '4', 
      name: 'Automated AQL Calculation', 
      description: 'Smart sampling plans and automatic pass/fail decisions based on AQL standards',
      category: 'inspection',
      enabled: true 
    },
    { 
      id: '5', 
      name: 'Defect Trend Analysis', 
      description: 'Track defect rates over time and predict quality issues before they escalate',
      category: 'defect',
      enabled: true 
    },
    { 
      id: '6', 
      name: 'Supplier Quality Scoring', 
      description: 'Automatic scoring of material suppliers based on defect rates',
      category: 'reporting',
      enabled: true 
    },
    { 
      id: '7', 
      name: 'Compliance Documentation', 
      description: 'Auto-generate quality reports for buyer audits and certifications',
      category: 'compliance',
      enabled: true 
    },
    { 
      id: '8', 
      name: 'Root Cause AI Analysis', 
      description: 'MARBIM analyzes defects to identify root causes (machine, operator, material)',
      category: 'defect',
      enabled: true 
    },
    { 
      id: '9', 
      name: 'Quality Dashboard', 
      description: 'Real-time quality metrics, DHU tracking, and pass/fail rates',
      category: 'reporting',
      enabled: true 
    },
    { 
      id: '10', 
      name: 'Barcode Traceability', 
      description: 'Track every garment from fabric to finished product for full traceability',
      category: 'compliance',
      enabled: true 
    },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'QC Checkpoints', icon: ClipboardCheck, color: '#EAB308', desc: 'Inspection stages' },
    { number: 2, title: 'Defect Types', icon: AlertCircle, color: '#57ACAF', desc: 'Define defects' },
    { number: 3, title: 'Standards', icon: Award, color: '#EAB308', desc: 'Quality criteria' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'ai-visual-inspection', 
      title: 'AI Visual Inspection', 
      desc: 'Computer vision automatically detects fabric and garment defects',
      icon: Eye 
    },
    { 
      id: 'defect-analytics', 
      title: 'Defect Analytics', 
      desc: 'Track DHU, defect trends, and identify root causes with AI',
      icon: BarChart3 
    },
    { 
      id: 'aql-automation', 
      title: 'AQL Automation', 
      desc: 'Smart sampling plans and automatic pass/fail decisions',
      icon: CheckSquare 
    },
    { 
      id: 'real-time-alerts', 
      title: 'Real-Time Alerts', 
      desc: 'Instant notifications when quality issues are detected',
      icon: Bell 
    },
    { 
      id: 'compliance-reports', 
      title: 'Compliance Reports', 
      desc: 'Auto-generate audit-ready quality documentation',
      icon: FileText 
    },
    { 
      id: 'traceability', 
      title: 'Full Traceability', 
      desc: 'Barcode tracking from raw material to finished product',
      icon: Search 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up the Quality Control Module. This module uses AI-powered visual inspection, defect analytics, and automated AQL calculations to ensure zero-defect production. Let's build your intelligent quality system!",
      "Let's configure your QC checkpoints. Define inspection stages (raw material, cutting, sewing, finishing) and set inspection frequencies for each production phase.",
      "Now let's define defect types and severity levels. Categorize defects (stitching, fabric, measurement, color) and set severity ratings (Critical, Major, Minor).",
      "Let's set up quality standards and AQL levels. Define your compliance requirements (ISO 9001, WRAP, buyer-specific) and acceptable quality limits.",
      "Finally, let's enable AI-powered quality workflows! From visual inspection to defect analytics, real-time alerts, and compliance reporting - I'll help you achieve zero-defect production!"
    ];
    return messages[step] || '';
  };

  const handleNext = async () => {
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
    toast.success('🎉 Quality Control module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const updateCheckpoint = (id: string, field: keyof QCCheckpoint, value: any) => {
    setQcCheckpoints(prev => prev.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const addCheckpoint = () => {
    setQcCheckpoints(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Checkpoint',
      stage: 'Sewing',
      frequency: 'Every Hour',
      enabled: true
    }]);
  };

  const removeCheckpoint = (id: string) => {
    if (qcCheckpoints.length > 1) {
      setQcCheckpoints(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateDefectType = (id: string, field: keyof DefectType, value: any) => {
    setDefectTypes(prev => prev.map(d =>
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  const addDefectType = () => {
    setDefectTypes(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Defect',
      severity: 'Minor',
      enabled: true
    }]);
  };

  const removeDefectType = (id: string) => {
    if (defectTypes.length > 1) {
      setDefectTypes(prev => prev.filter(d => d.id !== id));
    }
  };

  const updateQualityStandard = (id: string, field: keyof QualityStandard, value: any) => {
    setQualityStandards(prev => prev.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const addQualityStandard = () => {
    setQualityStandards(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Standard',
      aqlLevel: 'AQL 2.5',
      enabled: true
    }]);
  };

  const removeQualityStandard = (id: string) => {
    if (qualityStandards.length > 1) {
      setQualityStandards(prev => prev.filter(s => s.id !== id));
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
      case 'inspection': return Eye;
      case 'defect': return AlertCircle;
      case 'reporting': return BarChart3;
      case 'compliance': return Shield;
      default: return Zap;
    }
  };

  const getWorkflowColor = (category: string) => {
    switch (category) {
      case 'inspection': return '#57ACAF';
      case 'defect': return '#EAB308';
      case 'reporting': return '#6F83A7';
      case 'compliance': return '#D0342C';
      default: return '#57ACAF';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0A0F1C] via-[#101725] to-[#0A0F1C] overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#57ACAF]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#EAB308]/10 rounded-full blur-[100px]" />
      </div>

      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute top-6 right-6 z-10 text-white/60 hover:text-white hover:bg-white/10"
      >
        <X className="w-5 h-5" />
      </Button>

      <div className="relative h-full overflow-auto custom-scrollbar px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <Badge className="bg-gradient-to-r from-[#57ACAF]/20 to-[#EAB308]/20 text-white border border-[#57ACAF]/30 px-4 py-2 mb-4">
              <Settings className="w-4 h-4 inline mr-2" />
              Quality Control Module Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your Zero-Defect Quality System
            </h1>
            <p className="text-lg text-[#6F83A7]">
              MARBIM will guide you through the setup process
            </p>
          </motion.div>

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

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#57ACAF]/10 via-white/5 to-[#EAB308]/10 border border-white/10 rounded-2xl p-8">
                    <div className="relative z-10">
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#57ACAF]/20 blur-2xl rounded-full" />
                          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/80 flex items-center justify-center shadow-lg">
                            <ClipboardCheck className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-center text-white mb-3">
                        Quality Control Module
                      </h2>
                      <p className="text-center text-[#6F83A7] text-lg mb-6 max-w-2xl mx-auto">
                        Build a zero-defect quality system with AI-powered visual inspection, defect analytics, 
                        automated AQL calculations, and real-time quality monitoring.
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Eye className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">AI Inspection</h3>
                          <p className="text-xs text-[#6F83A7]">Visual defect detection</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <BarChart3 className="w-8 h-8 text-[#EAB308] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Defect Analytics</h3>
                          <p className="text-xs text-[#6F83A7]">DHU tracking</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Award className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">AQL Automation</h3>
                          <p className="text-xs text-[#6F83A7]">Smart sampling</p>
                        </div>
                      </div>
                    </div>
                  </div>

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

                  <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-2">Quick Setup</h3>
                        <p className="text-sm text-[#6F83A7] mb-3">
                          Complete setup in just 5-10 minutes. MARBIM will guide you through configuring QC checkpoints, 
                          defect types, quality standards, and enabling AI-powered inspection workflows.
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

              {/* Remaining steps implementation follows same pattern as other setup wizards */}
              {/* For brevity, the full implementation would follow the same structure */}

              {/* Step 1: QC Checkpoints */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5 text-[#EAB308]" />
                      Configure QC Checkpoints
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {qcCheckpoints.map((checkpoint) => (
                        <div key={checkpoint.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{checkpoint.name}</h4>
                              <Switch
                                checked={checkpoint.enabled}
                                onCheckedChange={(checked) => updateCheckpoint(checkpoint.id, 'enabled', checked)}
                              />
                            </div>
                            {qcCheckpoints.length > 1 && (
                              <Button
                                onClick={() => removeCheckpoint(checkpoint.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Checkpoint Name</Label>
                              <Input
                                value={checkpoint.name}
                                onChange={(e) => updateCheckpoint(checkpoint.id, 'name', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Production Stage</Label>
                              <Select
                                value={checkpoint.stage}
                                onValueChange={(value) => updateCheckpoint(checkpoint.id, 'stage', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Raw Material">Raw Material</SelectItem>
                                  <SelectItem value="Cutting">Cutting</SelectItem>
                                  <SelectItem value="Sewing">Sewing</SelectItem>
                                  <SelectItem value="Finishing">Finishing</SelectItem>
                                  <SelectItem value="Packing">Packing</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Inspection Frequency</Label>
                              <Select
                                value={checkpoint.frequency}
                                onValueChange={(value) => updateCheckpoint(checkpoint.id, 'frequency', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Every Roll">Every Roll</SelectItem>
                                  <SelectItem value="Every 50 pcs">Every 50 pcs</SelectItem>
                                  <SelectItem value="Every Hour">Every Hour</SelectItem>
                                  <SelectItem value="100% AQL 2.5">100% AQL 2.5</SelectItem>
                                  <SelectItem value="Random Sample">Random Sample</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addCheckpoint}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add QC Checkpoint
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Defect Types */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-[#EAB308]" />
                      Define Defect Types & Severity
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {defectTypes.map((defect) => (
                        <div key={defect.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{defect.name}</h4>
                              <Badge className={
                                defect.severity === 'Critical' 
                                  ? 'bg-[#D0342C]/10 text-[#D0342C] border-[#D0342C]/20'
                                  : defect.severity === 'Major'
                                  ? 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'
                                  : 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20'
                              }>
                                {defect.severity}
                              </Badge>
                              <Switch
                                checked={defect.enabled}
                                onCheckedChange={(checked) => updateDefectType(defect.id, 'enabled', checked)}
                              />
                            </div>
                            {defectTypes.length > 1 && (
                              <Button
                                onClick={() => removeDefectType(defect.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Defect Name</Label>
                              <Input
                                value={defect.name}
                                onChange={(e) => updateDefectType(defect.id, 'name', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Severity Level</Label>
                              <Select
                                value={defect.severity}
                                onValueChange={(value) => updateDefectType(defect.id, 'severity', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Critical">Critical</SelectItem>
                                  <SelectItem value="Major">Major</SelectItem>
                                  <SelectItem value="Minor">Minor</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addDefectType}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Defect Type
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Quality Standards */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#EAB308]" />
                      Configure Quality Standards & AQL
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {qualityStandards.map((standard) => (
                        <div key={standard.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{standard.name}</h4>
                              <Switch
                                checked={standard.enabled}
                                onCheckedChange={(checked) => updateQualityStandard(standard.id, 'enabled', checked)}
                              />
                            </div>
                            {qualityStandards.length > 1 && (
                              <Button
                                onClick={() => removeQualityStandard(standard.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Standard Name</Label>
                              <Input
                                value={standard.name}
                                onChange={(e) => updateQualityStandard(standard.id, 'name', e.target.value)}
                                placeholder="e.g., ISO 9001, WRAP"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">AQL Level</Label>
                              <Select
                                value={standard.aqlLevel}
                                onValueChange={(value) => updateQualityStandard(standard.id, 'aqlLevel', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AQL 0.65">AQL 0.65</SelectItem>
                                  <SelectItem value="AQL 1.0">AQL 1.0</SelectItem>
                                  <SelectItem value="AQL 1.5">AQL 1.5</SelectItem>
                                  <SelectItem value="AQL 2.5">AQL 2.5</SelectItem>
                                  <SelectItem value="AQL 4.0">AQL 4.0</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addQualityStandard}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Quality Standard
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
                      Enable AI-Powered Quality Workflows
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