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
  UserCheck, UserCog, Briefcase, GraduationCap, Timer, ClipboardCheck,
  TrendingUpIcon, Smile, BadgeCheck, FileCheck, ClockIcon
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

interface WorkforceManagementSetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  employeeId: string;
}

interface Department {
  id: string;
  name: string;
  headCount: number;
  manager: string;
  enabled: boolean;
}

interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
  enabled: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'attendance' | 'performance' | 'training' | 'compliance';
  enabled: boolean;
}

export function WorkforceManagementSetup({ onComplete, onClose, onAskMarbim }: WorkforceManagementSetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Step 1 - Welcome & Overview
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Step 2 - Import Employees
  const [uploadMethod, setUploadMethod] = useState<'pdf' | 'excel' | 'manual' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualEmployees, setManualEmployees] = useState<Employee[]>([
    { id: '1', name: '', department: '', role: '', employeeId: '' }
  ]);
  const [importedEmployees, setImportedEmployees] = useState<number>(0);
  
  // Step 3 - Departments & Structure
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Cutting', headCount: 25, manager: '', enabled: true },
    { id: '2', name: 'Sewing', headCount: 120, manager: '', enabled: true },
    { id: '3', name: 'Finishing', headCount: 40, manager: '', enabled: true },
    { id: '4', name: 'Quality Control', headCount: 30, manager: '', enabled: true },
    { id: '5', name: 'Packing', headCount: 20, manager: '', enabled: true },
  ]);
  
  // Step 4 - Skills & Training
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([
    { id: '1', name: 'Sewing Operations', skills: ['Single Needle', 'Overlock', 'Flatlock', 'Button Attach'], enabled: true },
    { id: '2', name: 'Quality Inspection', skills: ['Fabric Inspection', 'Garment Inspection', 'Measurement Check'], enabled: true },
    { id: '3', name: 'Machine Operation', skills: ['Cutting Machine', 'Fusing Machine', 'Pressing'], enabled: true },
  ]);
  const [trainingFrequency, setTrainingFrequency] = useState('monthly');
  
  // Step 5 - Automated Workflows
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([
    { 
      id: '1', 
      name: 'Smart Attendance Tracking', 
      description: 'Automated attendance monitoring with biometric integration and anomaly detection',
      category: 'attendance',
      enabled: true 
    },
    { 
      id: '2', 
      name: 'Leave Request Automation', 
      description: 'AI-powered leave approval based on team capacity and workload',
      category: 'attendance',
      enabled: true 
    },
    { 
      id: '3', 
      name: 'Overtime Alert System', 
      description: 'Automatic alerts when employees exceed overtime thresholds',
      category: 'attendance',
      enabled: true 
    },
    { 
      id: '4', 
      name: 'Performance Analytics', 
      description: 'Real-time tracking of productivity, efficiency, and quality metrics per worker',
      category: 'performance',
      enabled: true 
    },
    { 
      id: '5', 
      name: 'KPI Dashboard', 
      description: 'Individual and team performance dashboards with AI insights',
      category: 'performance',
      enabled: true 
    },
    { 
      id: '6', 
      name: 'Low Performance Alerts', 
      description: 'Early warning system for underperforming workers with coaching suggestions',
      category: 'performance',
      enabled: true 
    },
    { 
      id: '7', 
      name: 'Skill Gap Analysis', 
      description: 'AI identifies skill gaps and recommends targeted training programs',
      category: 'training',
      enabled: true 
    },
    { 
      id: '8', 
      name: 'Training Scheduler', 
      description: 'Automatically schedules training sessions based on production schedules',
      category: 'training',
      enabled: true 
    },
    { 
      id: '9', 
      name: 'Compliance Monitoring', 
      description: 'Track labor law compliance, certifications, and safety training',
      category: 'compliance',
      enabled: true 
    },
    { 
      id: '10', 
      name: 'Employee Satisfaction Pulse', 
      description: 'Regular sentiment analysis and early detection of morale issues',
      category: 'performance',
      enabled: true 
    },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'Import Staff', icon: Upload, color: '#EAB308', desc: 'Employee data' },
    { number: 2, title: 'Departments', icon: Building2, color: '#57ACAF', desc: 'Org structure' },
    { number: 3, title: 'Skills', icon: GraduationCap, color: '#EAB308', desc: 'Training setup' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'attendance-tracking', 
      title: 'Smart Attendance', 
      desc: 'Automated attendance tracking with biometric integration and analytics',
      icon: ClipboardCheck 
    },
    { 
      id: 'performance-management', 
      title: 'Performance Analytics', 
      desc: 'Real-time productivity tracking and AI-powered performance insights',
      icon: TrendingUp 
    },
    { 
      id: 'skills-training', 
      title: 'Skills & Training', 
      desc: 'Track certifications, identify skill gaps, and schedule training',
      icon: GraduationCap 
    },
    { 
      id: 'leave-management', 
      title: 'Leave Management', 
      desc: 'Intelligent leave request system with capacity-aware approvals',
      icon: Calendar 
    },
    { 
      id: 'compliance', 
      title: 'Labor Compliance', 
      desc: 'Monitor labor laws, safety regulations, and certification status',
      icon: Shield 
    },
    { 
      id: 'engagement', 
      title: 'Employee Engagement', 
      desc: 'Satisfaction surveys, sentiment analysis, and retention insights',
      icon: Heart 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up the Workforce Management Module. This module helps you track attendance, manage performance, develop skills, and keep your team engaged. Let's build your people management system!",
      "Let's import your employee data. You can upload HR records (PDF), Excel files, or enter employee information manually. I'll help you organize your workforce directory.",
      "Now let's structure your departments. Define your organizational hierarchy, set headcounts, assign managers, and establish reporting lines. This powers smart resource allocation.",
      "Let's configure your skills matrix and training programs. Define skill categories, track certifications, identify gaps, and schedule training. Build a highly skilled workforce.",
      "Finally, let's automate your HR workflows! From attendance tracking to performance analytics, skill gap analysis, and compliance monitoring - I'll help you manage your most valuable asset: your people!"
    ];
    return messages[step] || '';
  };

  const handleNext = async () => {
    if (currentStep === 2 && uploadMethod === 'manual' && manualEmployees.some(e => !e.name)) {
      toast.error('Please fill in employee names');
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
    toast.success('🎉 Workforce Management module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      if (uploadMethod === 'pdf') {
        setImportedEmployees(Math.floor(Math.random() * 50) + 150);
        toast.success(`AI extracting employee data from PDF...`);
      } else {
        setImportedEmployees(Math.floor(Math.random() * 100) + 200);
        toast.success(`Processing ${file.name}...`);
      }
    }
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addManualEmployee = () => {
    setManualEmployees(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      department: '',
      role: '',
      employeeId: ''
    }]);
  };

  const removeManualEmployee = (id: string) => {
    if (manualEmployees.length > 1) {
      setManualEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const updateManualEmployee = (id: string, field: keyof Employee, value: string) => {
    setManualEmployees(prev => prev.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const updateDepartment = (id: string, field: keyof Department, value: number | boolean | string) => {
    setDepartments(prev => prev.map(d =>
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  const addDepartment = () => {
    setDepartments(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Department',
      headCount: 10,
      manager: '',
      enabled: true
    }]);
  };

  const removeDepartment = (id: string) => {
    if (departments.length > 1) {
      setDepartments(prev => prev.filter(d => d.id !== id));
    }
  };

  const updateSkillCategory = (id: string, field: keyof SkillCategory, value: any) => {
    setSkillCategories(prev => prev.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const addSkillCategory = () => {
    setSkillCategories(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Category',
      skills: [],
      enabled: true
    }]);
  };

  const removeSkillCategory = (id: string) => {
    if (skillCategories.length > 1) {
      setSkillCategories(prev => prev.filter(c => c.id !== id));
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
      case 'attendance': return ClipboardCheck;
      case 'performance': return TrendingUp;
      case 'training': return GraduationCap;
      case 'compliance': return Shield;
      default: return Zap;
    }
  };

  const getWorkflowColor = (category: string) => {
    switch (category) {
      case 'attendance': return '#57ACAF';
      case 'performance': return '#EAB308';
      case 'training': return '#6F83A7';
      case 'compliance': return '#D0342C';
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
              Workforce Management Module Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your People Management System
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
                            <Users className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-center text-white mb-3">
                        Workforce Management Module
                      </h2>
                      <p className="text-center text-[#6F83A7] text-lg mb-6 max-w-2xl mx-auto">
                        Build a comprehensive people management system with AI-powered attendance tracking, 
                        performance analytics, skills development, and employee engagement tools.
                      </p>

                      {/* Key Benefits */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <ClipboardCheck className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Smart Attendance</h3>
                          <p className="text-xs text-[#6F83A7]">Automated tracking</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <TrendingUp className="w-8 h-8 text-[#EAB308] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Performance Analytics</h3>
                          <p className="text-xs text-[#6F83A7]">Real-time insights</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <GraduationCap className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Skills Development</h3>
                          <p className="text-xs text-[#6F83A7]">Training programs</p>
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
                          Complete setup in just 5-10 minutes. MARBIM will guide you through importing employees, 
                          structuring departments, configuring skills matrices, and enabling smart HR automation.
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

              {/* Step 1: Import Employees */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[#EAB308]" />
                      Choose Import Method
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { id: 'pdf', icon: FilePlus, title: 'Upload PDF', desc: 'AI extracts employee data', highlight: true },
                        { id: 'excel', icon: FileSpreadsheet, title: 'Upload Excel', desc: 'Import from HR system' },
                        { id: 'manual', icon: List, title: 'Add Manually', desc: 'Enter employee details' },
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
                              <h4 className="text-white font-medium mb-1">AI-Powered Employee Extraction</h4>
                              <p className="text-sm text-[#6F83A7]">
                                MARBIM will extract employee names, IDs, departments, roles, contact info, 
                                and employment dates from your HR records.
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
                            or drag and drop your employee records PDF here
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
                              <span className="text-white font-medium">AI extracting employee data...</span>
                            </div>
                            <p className="text-sm text-[#6F83A7] mb-2">
                              Found {importedEmployees} employees
                            </p>
                            <Progress value={100} className="h-2" />
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
                              Detected {importedEmployees} employees in your file
                            </p>
                            <Progress value={100} className="h-2" />
                          </motion.div>
                        )}

                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <h4 className="text-white font-medium mb-3 text-sm">Recommended Columns:</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {['Employee ID', 'Full Name', 'Department', 'Role/Position', 'Email', 'Phone'].map((col) => (
                              <div key={col} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF]" />
                                <span className="text-[#6F83A7]">{col}</span>
                              </div>
                            ))}
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
                        {manualEmployees.map((employee, index) => (
                          <div
                            key={employee.id}
                            className="bg-white/5 border border-white/10 rounded-xl p-5"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-white font-medium">Employee #{index + 1}</h4>
                              {manualEmployees.length > 1 && (
                                <Button
                                  onClick={() => removeManualEmployee(employee.id)}
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
                                <Label className="text-[#6F83A7] mb-2 block">Full Name *</Label>
                                <Input
                                  value={employee.name}
                                  onChange={(e) => updateManualEmployee(employee.id, 'name', e.target.value)}
                                  placeholder="e.g., John Doe"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Employee ID</Label>
                                <Input
                                  value={employee.employeeId}
                                  onChange={(e) => updateManualEmployee(employee.id, 'employeeId', e.target.value)}
                                  placeholder="e.g., EMP-001"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Department</Label>
                                <Input
                                  value={employee.department}
                                  onChange={(e) => updateManualEmployee(employee.id, 'department', e.target.value)}
                                  placeholder="e.g., Sewing"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block">Role/Position</Label>
                                <Input
                                  value={employee.role}
                                  onChange={(e) => updateManualEmployee(employee.id, 'role', e.target.value)}
                                  placeholder="e.g., Operator"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          onClick={addManualEmployee}
                          variant="outline"
                          className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Employee
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Departments */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#57ACAF]" />
                      Configure Departments & Organization
                    </h3>

                    <div className="space-y-3 mb-6">
                      {departments.map((dept) => (
                        <div
                          key={dept.id}
                          className={`
                            bg-white/5 border border-white/10 rounded-xl p-5 transition-all
                            ${dept.enabled ? 'opacity-100' : 'opacity-50'}
                          `}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <Switch
                              checked={dept.enabled}
                              onCheckedChange={() => updateDepartment(dept.id, 'enabled', !dept.enabled)}
                            />
                            <div className="flex-1">
                              <Input
                                value={dept.name}
                                onChange={(e) => updateDepartment(dept.id, 'name', e.target.value)}
                                className="bg-white/5 border-white/10 text-white font-medium"
                                placeholder="Department name"
                              />
                            </div>
                            {departments.length > 1 && (
                              <Button
                                onClick={() => removeDepartment(dept.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          {dept.enabled && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block text-sm">Head Count</Label>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-[#57ACAF]" />
                                  <Input
                                    type="number"
                                    value={dept.headCount}
                                    onChange={(e) => updateDepartment(dept.id, 'headCount', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 text-white"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-[#6F83A7] mb-2 block text-sm">Manager/Supervisor</Label>
                                <Input
                                  value={dept.manager}
                                  onChange={(e) => updateDepartment(dept.id, 'manager', e.target.value)}
                                  placeholder="e.g., Sarah Johnson"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addDepartment}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Department
                    </Button>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-5">
                    <h4 className="text-white font-medium mb-3">Organization Summary</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-3xl font-bold text-white mb-1">
                          {departments.filter(d => d.enabled).reduce((sum, d) => sum + d.headCount, 0)}
                        </div>
                        <div className="text-sm text-[#6F83A7]">Total Employees</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-3xl font-bold text-white mb-1">
                          {departments.filter(d => d.enabled).length}
                        </div>
                        <div className="text-sm text-[#6F83A7]">Active Departments</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Skills & Training */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#EAB308]" />
                      Configure Skills & Training Programs
                    </h3>

                    <div className="space-y-4 mb-6">
                      {skillCategories.map((category) => (
                        <div
                          key={category.id}
                          className={`
                            bg-white/5 border border-white/10 rounded-xl p-5 transition-all
                            ${category.enabled ? 'opacity-100' : 'opacity-50'}
                          `}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <Switch
                              checked={category.enabled}
                              onCheckedChange={() => updateSkillCategory(category.id, 'enabled', !category.enabled)}
                            />
                            <div className="flex-1">
                              <Input
                                value={category.name}
                                onChange={(e) => updateSkillCategory(category.id, 'name', e.target.value)}
                                className="bg-white/5 border-white/10 text-white font-medium"
                                placeholder="Category name"
                              />
                            </div>
                            {skillCategories.length > 1 && (
                              <Button
                                onClick={() => removeSkillCategory(category.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          {category.enabled && (
                            <div className="flex flex-wrap gap-2">
                              {category.skills.map((skill, idx) => (
                                <Badge 
                                  key={idx}
                                  className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {category.skills.length === 0 && (
                                <span className="text-xs text-[#6F83A7]">No skills defined yet</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addSkillCategory}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5 mb-6"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill Category
                    </Button>

                    {/* Training Frequency */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                      <Label className="text-white mb-3 block">Training Frequency</Label>
                      <Select value={trainingFrequency} onValueChange={setTrainingFrequency}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[#6F83A7] mt-2">
                        How often should MARBIM schedule skills training sessions?
                      </p>
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
                      Automated HR Workflows
                    </h3>
                    
                    {/* Category Summary */}
                    <div className="grid grid-cols-4 gap-2 mb-6 bg-white/5 p-1 rounded-lg">
                      {[
                        { id: 'all', label: 'All', count: automationWorkflows.length },
                        { id: 'attendance', label: 'Attendance', count: automationWorkflows.filter(w => w.category === 'attendance').length },
                        { id: 'performance', label: 'Performance', count: automationWorkflows.filter(w => w.category === 'performance').length },
                        { id: 'training', label: 'Training', count: automationWorkflows.filter(w => w.category === 'training').length },
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
                          <h4 className="text-white font-medium mb-2">MARBIM HR Intelligence</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            With these workflows enabled, MARBIM will automatically track attendance, monitor performance, 
                            identify skill gaps, and ensure compliance. Build a high-performing, engaged workforce.
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <ClipboardCheck className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">Auto Attendance</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Effortless tracking</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-sm text-white">Performance Insights</span>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Real-time analytics</p>
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
                      Your workforce management system is configured. Click "Complete Setup" to activate 
                      smart HR automation and start building a high-performing, engaged team.
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {uploadedFile ? importedEmployees : manualEmployees.length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Employees</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {departments.filter(d => d.enabled).length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Departments</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white mb-1">
                          {skillCategories.filter(c => c.enabled).length}
                        </div>
                        <div className="text-xs text-[#6F83A7]">Skill Categories</div>
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
