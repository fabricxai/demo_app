import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, FileSpreadsheet, CheckCircle, ArrowRight, ArrowLeft, 
  Loader2, X, Brain, Sparkles, AlertTriangle, TrendingUp,
  Shield, Target, BarChart3, FileText, Plus, Trash2, Settings, Zap, Clock,
  Bell, List, Award, CheckSquare, FileCheck, AlertCircle, Users,
  Calendar, Flag, Book, Briefcase, Scale
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Switch } from '../ui/switch';

interface CompliancePolicySetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface ComplianceStandard {
  id: string;
  name: string;
  category: string;
  renewalDate: string;
  enabled: boolean;
}

interface PolicyDocument {
  id: string;
  name: string;
  category: string;
  lastUpdated: string;
  enabled: boolean;
}

interface AuditSchedule {
  id: string;
  auditType: string;
  frequency: string;
  nextDate: string;
  enabled: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'monitoring' | 'audit' | 'documentation' | 'training';
  enabled: boolean;
}

export function CompliancePolicySetup({ onComplete, onClose, onAskMarbim }: CompliancePolicySetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const [complianceStandards, setComplianceStandards] = useState<ComplianceStandard[]>([
    { id: '1', name: 'WRAP Certification', category: 'Social', renewalDate: '2025-06-30', enabled: true },
    { id: '2', name: 'ISO 9001:2015', category: 'Quality', renewalDate: '2025-12-31', enabled: true },
    { id: '3', name: 'BSCI Audit', category: 'Social', renewalDate: '2025-09-15', enabled: true },
    { id: '4', name: 'OEKO-TEX Standard 100', category: 'Safety', renewalDate: '2026-03-20', enabled: true },
  ]);
  
  const [policyDocuments, setPolicyDocuments] = useState<PolicyDocument[]>([
    { id: '1', name: 'Code of Conduct', category: 'Ethics', lastUpdated: '2024-01-15', enabled: true },
    { id: '2', name: 'Health & Safety Policy', category: 'Safety', lastUpdated: '2024-02-20', enabled: true },
    { id: '3', name: 'Anti-Harassment Policy', category: 'HR', lastUpdated: '2024-01-10', enabled: true },
    { id: '4', name: 'Environmental Policy', category: 'Sustainability', lastUpdated: '2024-03-05', enabled: true },
  ]);
  
  const [auditSchedules, setAuditSchedules] = useState<AuditSchedule[]>([
    { id: '1', auditType: 'Internal Quality Audit', frequency: 'Quarterly', nextDate: '2025-03-15', enabled: true },
    { id: '2', auditType: 'Fire Safety Inspection', frequency: 'Monthly', nextDate: '2025-01-10', enabled: true },
    { id: '3', auditType: 'Social Compliance Audit', frequency: 'Semi-Annual', nextDate: '2025-06-01', enabled: true },
  ]);
  
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([
    { 
      id: '1', 
      name: 'Compliance Monitoring Dashboard', 
      description: 'Real-time tracking of all certifications, audits, and policy compliance',
      category: 'monitoring',
      enabled: true 
    },
    { 
      id: '2', 
      name: 'Audit Reminder System', 
      description: 'Automatic alerts for upcoming audits and certification renewals',
      category: 'audit',
      enabled: true 
    },
    { 
      id: '3', 
      name: 'Corrective Action Tracker', 
      description: 'Track and manage corrective actions from audit findings',
      category: 'audit',
      enabled: true 
    },
    { 
      id: '4', 
      name: 'Policy Document Manager', 
      description: 'Version control and distribution of policy documents to all employees',
      category: 'documentation',
      enabled: true 
    },
    { 
      id: '5', 
      name: 'Training Compliance Tracker', 
      description: 'Ensure all workers complete mandatory compliance training',
      category: 'training',
      enabled: true 
    },
    { 
      id: '6', 
      name: 'Incident Reporting System', 
      description: 'Anonymous reporting of safety, ethical, or compliance violations',
      category: 'monitoring',
      enabled: true 
    },
    { 
      id: '7', 
      name: 'Buyer Audit Preparation', 
      description: 'AI-powered checklist and document preparation for buyer audits',
      category: 'audit',
      enabled: true 
    },
    { 
      id: '8', 
      name: 'Regulatory Change Alerts', 
      description: 'MARBIM monitors legal changes and alerts you to new compliance requirements',
      category: 'monitoring',
      enabled: true 
    },
    { 
      id: '9', 
      name: 'Certificate Expiry Tracker', 
      description: 'Track all certifications and send renewal reminders 90 days before expiry',
      category: 'documentation',
      enabled: true 
    },
    { 
      id: '10', 
      name: 'Compliance Reports Generator', 
      description: 'Auto-generate compliance reports for buyers and auditors',
      category: 'documentation',
      enabled: true 
    },
  ]);

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'Standards', icon: Award, color: '#EAB308', desc: 'Certifications' },
    { number: 2, title: 'Policies', icon: FileText, color: '#57ACAF', desc: 'Documents' },
    { number: 3, title: 'Audits', icon: CheckSquare, color: '#EAB308', desc: 'Schedule' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'compliance-monitoring', 
      title: 'Compliance Monitoring', 
      desc: 'Real-time dashboard of all certifications and audits',
      icon: Shield 
    },
    { 
      id: 'audit-management', 
      title: 'Audit Management', 
      desc: 'Schedule audits, track findings, manage corrective actions',
      icon: CheckSquare 
    },
    { 
      id: 'policy-documents', 
      title: 'Policy Documents', 
      desc: 'Centralized repository with version control',
      icon: FileText 
    },
    { 
      id: 'training-tracker', 
      title: 'Training Tracker', 
      desc: 'Ensure all workers complete mandatory compliance training',
      icon: Users 
    },
    { 
      id: 'incident-reporting', 
      title: 'Incident Reporting', 
      desc: 'Anonymous reporting system for violations',
      icon: AlertCircle 
    },
    { 
      id: 'buyer-audit-prep', 
      title: 'Buyer Audit Prep', 
      desc: 'AI-powered checklist and document preparation',
      icon: Briefcase 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up the Compliance & Policy Module. This module helps you maintain all certifications (WRAP, BSCI, ISO), manage policies, schedule audits, and ensure 100% compliance. Let's build your compliance system!",
      "Let's configure your compliance standards and certifications. Add your current certifications (WRAP, ISO 9001, BSCI, OEKO-TEX) with renewal dates so we can track expiry and send reminders.",
      "Now let's set up your policy documents. Upload or create workplace policies (Code of Conduct, Health & Safety, Anti-Harassment) so all employees can access them.",
      "Let's configure your audit schedule. Define internal audits, buyer audits, and compliance inspections so MARBIM can send reminders and help you prepare.",
      "Finally, let's enable AI-powered compliance workflows! From monitoring certifications to audit preparation, incident reporting, and training tracking - I'll help you achieve 100% compliance!"
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
    toast.success('🎉 Compliance & Policy module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const updateStandard = (id: string, field: keyof ComplianceStandard, value: any) => {
    setComplianceStandards(prev => prev.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const addStandard = () => {
    setComplianceStandards(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Standard',
      category: 'Quality',
      renewalDate: '2025-12-31',
      enabled: true
    }]);
  };

  const removeStandard = (id: string) => {
    if (complianceStandards.length > 1) {
      setComplianceStandards(prev => prev.filter(s => s.id !== id));
    }
  };

  const updatePolicy = (id: string, field: keyof PolicyDocument, value: any) => {
    setPolicyDocuments(prev => prev.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addPolicy = () => {
    setPolicyDocuments(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Policy',
      category: 'General',
      lastUpdated: new Date().toISOString().split('T')[0],
      enabled: true
    }]);
  };

  const removePolicy = (id: string) => {
    if (policyDocuments.length > 1) {
      setPolicyDocuments(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateAudit = (id: string, field: keyof AuditSchedule, value: any) => {
    setAuditSchedules(prev => prev.map(a =>
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const addAudit = () => {
    setAuditSchedules(prev => [...prev, {
      id: Date.now().toString(),
      auditType: 'New Audit',
      frequency: 'Quarterly',
      nextDate: '2025-06-01',
      enabled: true
    }]);
  };

  const removeAudit = (id: string) => {
    if (auditSchedules.length > 1) {
      setAuditSchedules(prev => prev.filter(a => a.id !== id));
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
      case 'monitoring': return Shield;
      case 'audit': return CheckSquare;
      case 'documentation': return FileText;
      case 'training': return Users;
      default: return Zap;
    }
  };

  const getWorkflowColor = (category: string) => {
    switch (category) {
      case 'monitoring': return '#57ACAF';
      case 'audit': return '#EAB308';
      case 'documentation': return '#6F83A7';
      case 'training': return '#D0342C';
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
              Compliance & Policy Module Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your Compliance Management System
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
              {/* Step 0: Welcome Screen */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#57ACAF]/10 via-white/5 to-[#EAB308]/10 border border-white/10 rounded-2xl p-8">
                    <div className="relative z-10">
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#57ACAF]/20 blur-2xl rounded-full" />
                          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/80 flex items-center justify-center shadow-lg">
                            <Shield className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-center text-white mb-3">
                        Compliance & Policy Module
                      </h2>
                      <p className="text-center text-[#6F83A7] text-lg mb-6 max-w-2xl mx-auto">
                        Build a comprehensive compliance system to maintain all certifications (WRAP, BSCI, ISO), 
                        manage policies, schedule audits, and ensure 100% regulatory compliance.
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Award className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Certification Tracking</h3>
                          <p className="text-xs text-[#6F83A7]">Never miss renewals</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <CheckSquare className="w-8 h-8 text-[#EAB308] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Audit Management</h3>
                          <p className="text-xs text-[#6F83A7]">Prepare & track</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <FileText className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Policy Hub</h3>
                          <p className="text-xs text-[#6F83A7]">Centralized docs</p>
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
                          Complete setup in just 5-10 minutes. MARBIM will guide you through adding certifications, 
                          policies, audit schedules, and enabling AI-powered compliance workflows.
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

              {/* Step 1: Compliance Standards */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#EAB308]" />
                      Configure Compliance Standards
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {complianceStandards.map((standard) => (
                        <div key={standard.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{standard.name}</h4>
                              <Switch
                                checked={standard.enabled}
                                onCheckedChange={(checked) => updateStandard(standard.id, 'enabled', checked)}
                              />
                            </div>
                            {complianceStandards.length > 1 && (
                              <Button
                                onClick={() => removeStandard(standard.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Standard Name</Label>
                              <Input
                                value={standard.name}
                                onChange={(e) => updateStandard(standard.id, 'name', e.target.value)}
                                placeholder="e.g., WRAP Certification"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Category</Label>
                              <Select
                                value={standard.category}
                                onValueChange={(value) => updateStandard(standard.id, 'category', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Social">Social Compliance</SelectItem>
                                  <SelectItem value="Quality">Quality Management</SelectItem>
                                  <SelectItem value="Safety">Health & Safety</SelectItem>
                                  <SelectItem value="Environmental">Environmental</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Renewal Date</Label>
                              <Input
                                type="date"
                                value={standard.renewalDate}
                                onChange={(e) => updateStandard(standard.id, 'renewalDate', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addStandard}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Compliance Standard
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Policy Documents */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#EAB308]" />
                      Configure Policy Documents
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {policyDocuments.map((policy) => (
                        <div key={policy.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{policy.name}</h4>
                              <Switch
                                checked={policy.enabled}
                                onCheckedChange={(checked) => updatePolicy(policy.id, 'enabled', checked)}
                              />
                            </div>
                            {policyDocuments.length > 1 && (
                              <Button
                                onClick={() => removePolicy(policy.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Policy Name</Label>
                              <Input
                                value={policy.name}
                                onChange={(e) => updatePolicy(policy.id, 'name', e.target.value)}
                                placeholder="e.g., Code of Conduct"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Category</Label>
                              <Select
                                value={policy.category}
                                onValueChange={(value) => updatePolicy(policy.id, 'category', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Ethics">Ethics</SelectItem>
                                  <SelectItem value="Safety">Health & Safety</SelectItem>
                                  <SelectItem value="HR">Human Resources</SelectItem>
                                  <SelectItem value="Sustainability">Sustainability</SelectItem>
                                  <SelectItem value="General">General</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Last Updated</Label>
                              <Input
                                type="date"
                                value={policy.lastUpdated}
                                onChange={(e) => updatePolicy(policy.id, 'lastUpdated', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addPolicy}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Policy Document
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Audit Schedule */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-[#EAB308]" />
                      Configure Audit Schedule
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {auditSchedules.map((audit) => (
                        <div key={audit.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{audit.auditType}</h4>
                              <Switch
                                checked={audit.enabled}
                                onCheckedChange={(checked) => updateAudit(audit.id, 'enabled', checked)}
                              />
                            </div>
                            {auditSchedules.length > 1 && (
                              <Button
                                onClick={() => removeAudit(audit.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Audit Type</Label>
                              <Input
                                value={audit.auditType}
                                onChange={(e) => updateAudit(audit.id, 'auditType', e.target.value)}
                                placeholder="e.g., Internal Quality Audit"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Frequency</Label>
                              <Select
                                value={audit.frequency}
                                onValueChange={(value) => updateAudit(audit.id, 'frequency', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Monthly">Monthly</SelectItem>
                                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                                  <SelectItem value="Semi-Annual">Semi-Annual</SelectItem>
                                  <SelectItem value="Annual">Annual</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Next Audit Date</Label>
                              <Input
                                type="date"
                                value={audit.nextDate}
                                onChange={(e) => updateAudit(audit.id, 'nextDate', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addAudit}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Audit Schedule
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
                      Enable AI-Powered Compliance Workflows
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
              {currentStep === 0 && (
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="text-[#6F83A7] hover:text-white hover:bg-white/5"
                >
                  Skip Setup
                </Button>
              )}
              
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
