import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, FileSpreadsheet, CheckCircle, ArrowRight, ArrowLeft, 
  Loader2, X, Brain, Sparkles, AlertTriangle, TrendingUp,
  Shield, Target, BarChart3, FileText, Plus, Trash2, Settings, Zap, Clock,
  Bell, List, Leaf, Droplet, Zap as Energy, Recycle, Sun,
  TreePine, Wind, Globe, Award, Package, Factory
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Switch } from '../ui/switch';

interface SustainabilitySetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface EnvironmentalMetric {
  id: string;
  name: string;
  unit: string;
  target: number;
  enabled: boolean;
}

interface WasteCategory {
  id: string;
  name: string;
  recyclingRate: number;
  disposalMethod: string;
  enabled: boolean;
}

interface SustainableMaterial {
  id: string;
  name: string;
  category: string;
  certifications: string;
  enabled: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'tracking' | 'reporting' | 'optimization' | 'certification';
  enabled: boolean;
}

export function SustainabilitySetup({ onComplete, onClose, onAskMarbim }: SustainabilitySetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const [environmentalMetrics, setEnvironmentalMetrics] = useState<EnvironmentalMetric[]>([
    { id: '1', name: 'Carbon Emissions', unit: 'kg CO2', target: 100000, enabled: true },
    { id: '2', name: 'Water Consumption', unit: 'Liters', target: 500000, enabled: true },
    { id: '3', name: 'Energy Usage', unit: 'kWh', target: 150000, enabled: true },
    { id: '4', name: 'Renewable Energy %', unit: '%', target: 30, enabled: true },
  ]);
  
  const [wasteCategories, setWasteCategories] = useState<WasteCategory[]>([
    { id: '1', name: 'Fabric Scraps', recyclingRate: 80, disposalMethod: 'Recycling Partner', enabled: true },
    { id: '2', name: 'Plastic Packaging', recyclingRate: 100, disposalMethod: 'Local Recycler', enabled: true },
    { id: '3', name: 'Chemical Waste', recyclingRate: 0, disposalMethod: 'Licensed Disposal', enabled: true },
  ]);
  
  const [sustainableMaterials, setSustainableMaterials] = useState<SustainableMaterial[]>([
    { id: '1', name: 'Organic Cotton', category: 'Natural Fiber', certifications: 'GOTS', enabled: true },
    { id: '2', name: 'Recycled Polyester', category: 'Synthetic', certifications: 'GRS', enabled: true },
    { id: '3', name: 'Bamboo Fabric', category: 'Natural Fiber', certifications: 'FSC', enabled: true },
  ]);
  
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([
    { 
      id: '1', 
      name: 'Carbon Footprint Calculator', 
      description: 'Automatically calculate carbon emissions from production, energy, and transportation',
      category: 'tracking',
      enabled: true 
    },
    { 
      id: '2', 
      name: 'Water & Energy Monitoring', 
      description: 'Track consumption in real-time and identify opportunities for reduction',
      category: 'tracking',
      enabled: true 
    },
    { 
      id: '3', 
      name: 'Waste Tracking Dashboard', 
      description: 'Monitor waste generation and recycling rates across all categories',
      category: 'tracking',
      enabled: true 
    },
    { 
      id: '4', 
      name: 'Sustainable Materials Tracker', 
      description: 'Track % of sustainable materials used in production',
      category: 'tracking',
      enabled: true 
    },
    { 
      id: '5', 
      name: 'ESG Report Generator', 
      description: 'Auto-generate Environmental, Social, Governance reports for buyers',
      category: 'reporting',
      enabled: true 
    },
    { 
      id: '6', 
      name: 'Sustainability Goal Tracker', 
      description: 'Set and track progress toward carbon neutrality and waste reduction goals',
      category: 'optimization',
      enabled: true 
    },
    { 
      id: '7', 
      name: 'Energy Optimization AI', 
      description: 'MARBIM recommends energy-saving opportunities based on usage patterns',
      category: 'optimization',
      enabled: true 
    },
    { 
      id: '8', 
      name: 'Circular Economy Planner', 
      description: 'Identify opportunities for material recycling and waste-to-value',
      category: 'optimization',
      enabled: true 
    },
    { 
      id: '9', 
      name: 'Green Certification Helper', 
      description: 'Prepare documentation for LEED, BREEAM, and other green certifications',
      category: 'certification',
      enabled: true 
    },
    { 
      id: '10', 
      name: 'Supplier Sustainability Scoring', 
      description: 'Evaluate and score suppliers based on environmental practices',
      category: 'reporting',
      enabled: true 
    },
  ]);

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'Metrics', icon: BarChart3, color: '#EAB308', desc: 'Environmental KPIs' },
    { number: 2, title: 'Waste', icon: Recycle, color: '#57ACAF', desc: 'Waste management' },
    { number: 3, title: 'Materials', icon: Leaf, color: '#EAB308', desc: 'Sustainable sourcing' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'carbon-tracking', 
      title: 'Carbon Footprint', 
      desc: 'Track and reduce CO2 emissions across operations',
      icon: Globe 
    },
    { 
      id: 'resource-monitoring', 
      title: 'Resource Monitoring', 
      desc: 'Monitor water and energy consumption in real-time',
      icon: Droplet 
    },
    { 
      id: 'waste-management', 
      title: 'Waste Management', 
      desc: 'Track recycling rates and waste-to-landfill',
      icon: Recycle 
    },
    { 
      id: 'sustainable-materials', 
      title: 'Sustainable Materials', 
      desc: 'Track % of organic, recycled, and certified materials',
      icon: Leaf 
    },
    { 
      id: 'esg-reporting', 
      title: 'ESG Reporting', 
      desc: 'Auto-generate sustainability reports for buyers',
      icon: FileText 
    },
    { 
      id: 'circular-economy', 
      title: 'Circular Economy', 
      desc: 'Material recycling and waste-to-value initiatives',
      icon: TreePine 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up the Sustainability Module. This module helps you track carbon emissions, water/energy consumption, waste management, and sustainable materials to achieve your ESG goals. Let's build your green factory!",
      "Let's configure your environmental metrics. Define targets for carbon emissions, water usage, energy consumption, and renewable energy % so we can track your progress toward sustainability goals.",
      "Now let's set up waste management. Define waste categories (fabric scraps, packaging, chemicals) with recycling rates and disposal methods so we can minimize landfill waste.",
      "Let's configure sustainable materials tracking. Add organic, recycled, and certified materials so MARBIM can track the % of sustainable materials used in production.",
      "Finally, let's enable AI-powered sustainability workflows! From carbon tracking to ESG reporting, energy optimization, and circular economy planning - I'll help you achieve carbon neutrality!"
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
    toast.success('🎉 Sustainability module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const updateMetric = (id: string, field: keyof EnvironmentalMetric, value: any) => {
    setEnvironmentalMetrics(prev => prev.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const addMetric = () => {
    setEnvironmentalMetrics(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Metric',
      unit: 'unit',
      target: 0,
      enabled: true
    }]);
  };

  const removeMetric = (id: string) => {
    if (environmentalMetrics.length > 1) {
      setEnvironmentalMetrics(prev => prev.filter(m => m.id !== id));
    }
  };

  const updateWaste = (id: string, field: keyof WasteCategory, value: any) => {
    setWasteCategories(prev => prev.map(w =>
      w.id === id ? { ...w, [field]: value } : w
    ));
  };

  const addWaste = () => {
    setWasteCategories(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Category',
      recyclingRate: 0,
      disposalMethod: 'Landfill',
      enabled: true
    }]);
  };

  const removeWaste = (id: string) => {
    if (wasteCategories.length > 1) {
      setWasteCategories(prev => prev.filter(w => w.id !== id));
    }
  };

  const updateMaterial = (id: string, field: keyof SustainableMaterial, value: any) => {
    setSustainableMaterials(prev => prev.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const addMaterial = () => {
    setSustainableMaterials(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Material',
      category: 'Natural Fiber',
      certifications: 'None',
      enabled: true
    }]);
  };

  const removeMaterial = (id: string) => {
    if (sustainableMaterials.length > 1) {
      setSustainableMaterials(prev => prev.filter(m => m.id !== id));
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
      case 'tracking': return BarChart3;
      case 'reporting': return FileText;
      case 'optimization': return TrendingUp;
      case 'certification': return Award;
      default: return Zap;
    }
  };

  const getWorkflowColor = (category: string) => {
    switch (category) {
      case 'tracking': return '#57ACAF';
      case 'reporting': return '#EAB308';
      case 'optimization': return '#6F83A7';
      case 'certification': return '#D0342C';
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
              Sustainability Module Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your Green Factory System
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
                            <Leaf className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-center text-white mb-3">
                        Sustainability Module
                      </h2>
                      <p className="text-center text-[#6F83A7] text-lg mb-6 max-w-2xl mx-auto">
                        Build a green factory with carbon footprint tracking, water/energy monitoring, 
                        waste management, and sustainable materials sourcing to achieve your ESG goals.
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Globe className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Carbon Tracking</h3>
                          <p className="text-xs text-[#6F83A7]">Measure & reduce</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Recycle className="w-8 h-8 text-[#EAB308] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Waste Management</h3>
                          <p className="text-xs text-[#6F83A7]">Recycling goals</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Leaf className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Green Materials</h3>
                          <p className="text-xs text-[#6F83A7]">Sustainable sourcing</p>
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
                          Complete setup in just 5-10 minutes. MARBIM will guide you through configuring environmental metrics, 
                          waste management, sustainable materials, and enabling AI-powered green workflows.
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

              {/* Step 1: Environmental Metrics */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#EAB308]" />
                      Configure Environmental Metrics
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {environmentalMetrics.map((metric) => (
                        <div key={metric.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{metric.name}</h4>
                              <Switch
                                checked={metric.enabled}
                                onCheckedChange={(checked) => updateMetric(metric.id, 'enabled', checked)}
                              />
                            </div>
                            {environmentalMetrics.length > 1 && (
                              <Button
                                onClick={() => removeMetric(metric.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Metric Name</Label>
                              <Input
                                value={metric.name}
                                onChange={(e) => updateMetric(metric.id, 'name', e.target.value)}
                                placeholder="e.g., Carbon Emissions"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Unit</Label>
                              <Input
                                value={metric.unit}
                                onChange={(e) => updateMetric(metric.id, 'unit', e.target.value)}
                                placeholder="e.g., kg CO2"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Annual Target</Label>
                              <Input
                                type="number"
                                value={metric.target}
                                onChange={(e) => updateMetric(metric.id, 'target', parseInt(e.target.value))}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addMetric}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Environmental Metric
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Waste Categories */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Recycle className="w-5 h-5 text-[#EAB308]" />
                      Configure Waste Management
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {wasteCategories.map((waste) => (
                        <div key={waste.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{waste.name}</h4>
                              <Switch
                                checked={waste.enabled}
                                onCheckedChange={(checked) => updateWaste(waste.id, 'enabled', checked)}
                              />
                            </div>
                            {wasteCategories.length > 1 && (
                              <Button
                                onClick={() => removeWaste(waste.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Waste Category</Label>
                              <Input
                                value={waste.name}
                                onChange={(e) => updateWaste(waste.id, 'name', e.target.value)}
                                placeholder="e.g., Fabric Scraps"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Recycling Rate (%)</Label>
                              <Input
                                type="number"
                                value={waste.recyclingRate}
                                onChange={(e) => updateWaste(waste.id, 'recyclingRate', parseInt(e.target.value))}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Disposal Method</Label>
                              <Input
                                value={waste.disposalMethod}
                                onChange={(e) => updateWaste(waste.id, 'disposalMethod', e.target.value)}
                                placeholder="e.g., Recycling Partner"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addWaste}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Waste Category
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Sustainable Materials */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-[#EAB308]" />
                      Configure Sustainable Materials
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {sustainableMaterials.map((material) => (
                        <div key={material.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{material.name}</h4>
                              <Switch
                                checked={material.enabled}
                                onCheckedChange={(checked) => updateMaterial(material.id, 'enabled', checked)}
                              />
                            </div>
                            {sustainableMaterials.length > 1 && (
                              <Button
                                onClick={() => removeMaterial(material.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Material Name</Label>
                              <Input
                                value={material.name}
                                onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                                placeholder="e.g., Organic Cotton"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Category</Label>
                              <Select
                                value={material.category}
                                onValueChange={(value) => updateMaterial(material.id, 'category', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Natural Fiber">Natural Fiber</SelectItem>
                                  <SelectItem value="Synthetic">Synthetic</SelectItem>
                                  <SelectItem value="Blended">Blended</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Certifications</Label>
                              <Input
                                value={material.certifications}
                                onChange={(e) => updateMaterial(material.id, 'certifications', e.target.value)}
                                placeholder="e.g., GOTS, GRS"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addMaterial}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Sustainable Material
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
                      Enable AI-Powered Sustainability Workflows
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
