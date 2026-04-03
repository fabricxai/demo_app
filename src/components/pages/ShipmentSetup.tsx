import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, FileSpreadsheet, CheckCircle, ArrowRight, ArrowLeft, 
  Loader2, X, Brain, Sparkles, AlertTriangle, TrendingUp,
  Shield, Target, BarChart3, FileText, Plus, Trash2, Settings, Zap, Clock,
  Bell, List, Truck, Package, MapPin, Ship, Plane, Calendar,
  DollarSign, Globe, Users, CheckSquare, AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Switch } from '../ui/switch';

interface ShipmentSetupProps {
  onComplete: () => void;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
}

interface Carrier {
  id: string;
  name: string;
  type: string;
  trackingUrl: string;
  enabled: boolean;
}

interface ShipmentRoute {
  id: string;
  origin: string;
  destination: string;
  avgTransitDays: number;
  enabled: boolean;
}

interface CustomsRequirement {
  id: string;
  country: string;
  documentType: string;
  required: boolean;
  enabled: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'tracking' | 'documentation' | 'customs' | 'optimization';
  enabled: boolean;
}

export function ShipmentSetup({ onComplete, onClose, onAskMarbim }: ShipmentSetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const [carriers, setCarriers] = useState<Carrier[]>([
    { id: '1', name: 'DHL Express', type: 'Air', trackingUrl: 'https://dhl.com/track', enabled: true },
    { id: '2', name: 'Maersk Line', type: 'Sea', trackingUrl: 'https://maersk.com/track', enabled: true },
    { id: '3', name: 'FedEx International', type: 'Air', trackingUrl: 'https://fedex.com/track', enabled: true },
  ]);
  
  const [shipmentRoutes, setShipmentRoutes] = useState<ShipmentRoute[]>([
    { id: '1', origin: 'Dhaka, Bangladesh', destination: 'Los Angeles, USA', avgTransitDays: 30, enabled: true },
    { id: '2', origin: 'Dhaka, Bangladesh', destination: 'Hamburg, Germany', avgTransitDays: 35, enabled: true },
    { id: '3', origin: 'Dhaka, Bangladesh', destination: 'Shanghai, China', avgTransitDays: 15, enabled: true },
  ]);
  
  const [customsRequirements, setCustomsRequirements] = useState<CustomsRequirement[]>([
    { id: '1', country: 'USA', documentType: 'Commercial Invoice', required: true, enabled: true },
    { id: '2', country: 'USA', documentType: 'Packing List', required: true, enabled: true },
    { id: '3', country: 'EU', documentType: 'EUR.1 Certificate', required: true, enabled: true },
    { id: '4', country: 'EU', documentType: 'Bill of Lading', required: true, enabled: true },
  ]);
  
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([
    { 
      id: '1', 
      name: 'Real-Time Shipment Tracking', 
      description: 'Automatic tracking updates from all carriers with ETA predictions',
      category: 'tracking',
      enabled: true 
    },
    { 
      id: '2', 
      name: 'Smart Document Generation', 
      description: 'AI generates commercial invoices, packing lists, and bills of lading automatically',
      category: 'documentation',
      enabled: true 
    },
    { 
      id: '3', 
      name: 'Customs Clearance Assistant', 
      description: 'MARBIM prepares customs documents and flags potential compliance issues',
      category: 'customs',
      enabled: true 
    },
    { 
      id: '4', 
      name: 'Delay Prediction AI', 
      description: 'Predict shipment delays based on weather, carrier performance, and port congestion',
      category: 'tracking',
      enabled: true 
    },
    { 
      id: '5', 
      name: 'Route Optimization', 
      description: 'AI recommends fastest and most cost-effective shipping routes',
      category: 'optimization',
      enabled: true 
    },
    { 
      id: '6', 
      name: 'Automated Notifications', 
      description: 'Send shipment status updates to buyers and internal teams automatically',
      category: 'tracking',
      enabled: true 
    },
    { 
      id: '7', 
      name: 'Freight Cost Analysis', 
      description: 'Track freight costs per route and carrier with AI-powered savings recommendations',
      category: 'optimization',
      enabled: true 
    },
    { 
      id: '8', 
      name: 'Compliance Checker', 
      description: 'Validate export documents against country-specific regulations',
      category: 'customs',
      enabled: true 
    },
    { 
      id: '9', 
      name: 'Container Load Planning', 
      description: 'AI optimizes container packing for maximum space utilization',
      category: 'optimization',
      enabled: true 
    },
    { 
      id: '10', 
      name: 'Shipment Analytics Dashboard', 
      description: 'Real-time visibility into on-time delivery rates, delays, and freight costs',
      category: 'tracking',
      enabled: true 
    },
  ]);

  const steps = [
    { number: 0, title: 'Welcome', icon: Sparkles, color: '#57ACAF', desc: 'Module overview' },
    { number: 1, title: 'Carriers', icon: Truck, color: '#EAB308', desc: 'Logistics partners' },
    { number: 2, title: 'Routes', icon: MapPin, color: '#57ACAF', desc: 'Shipping lanes' },
    { number: 3, title: 'Customs', icon: FileText, color: '#EAB308', desc: 'Export docs' },
    { number: 4, title: 'Automation', icon: Zap, color: '#57ACAF', desc: 'Configure workflows' },
  ];

  const features = [
    { 
      id: 'real-time-tracking', 
      title: 'Real-Time Tracking', 
      desc: 'Live shipment visibility across all carriers and routes',
      icon: Truck 
    },
    { 
      id: 'smart-documentation', 
      title: 'Smart Documentation', 
      desc: 'AI generates all export documents automatically',
      icon: FileText 
    },
    { 
      id: 'customs-automation', 
      title: 'Customs Automation', 
      desc: 'Streamline customs clearance with AI compliance checks',
      icon: Shield 
    },
    { 
      id: 'delay-prediction', 
      title: 'Delay Prediction', 
      desc: 'Predict and prevent shipment delays with AI',
      icon: Bell 
    },
    { 
      id: 'route-optimization', 
      title: 'Route Optimization', 
      desc: 'Find fastest and most cost-effective shipping routes',
      icon: Globe 
    },
    { 
      id: 'freight-analytics', 
      title: 'Freight Analytics', 
      desc: 'Track costs, on-time rates, and carrier performance',
      icon: BarChart3 
    },
  ];

  const getMarbimMessage = (step: number) => {
    const messages = [
      "Welcome! I'm MARBIM, your AI assistant for setting up the Shipment Module. This module provides real-time tracking, smart documentation, customs automation, and route optimization to ensure on-time delivery. Let's build your intelligent logistics system!",
      "Let's configure your shipping carriers. Add logistics partners (DHL, Maersk, FedEx) with tracking URLs so we can provide real-time shipment visibility to your team and buyers.",
      "Now let's set up your shipping routes. Define origin-destination pairs and average transit times so AI can predict ETAs and optimize route selection.",
      "Let's configure customs and export documentation. Define country-specific requirements so MARBIM can auto-generate compliant documents and flag issues before they cause delays.",
      "Finally, let's enable AI-powered shipment workflows! From real-time tracking to smart documentation, delay prediction, and route optimization - I'll help you achieve 100% on-time delivery!"
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
    toast.success('🎉 Shipment module configured successfully!');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const updateCarrier = (id: string, field: keyof Carrier, value: any) => {
    setCarriers(prev => prev.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const addCarrier = () => {
    setCarriers(prev => [...prev, {
      id: Date.now().toString(),
      name: 'New Carrier',
      type: 'Air',
      trackingUrl: 'https://',
      enabled: true
    }]);
  };

  const removeCarrier = (id: string) => {
    if (carriers.length > 1) {
      setCarriers(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateRoute = (id: string, field: keyof ShipmentRoute, value: any) => {
    setShipmentRoutes(prev => prev.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const addRoute = () => {
    setShipmentRoutes(prev => [...prev, {
      id: Date.now().toString(),
      origin: 'Dhaka, Bangladesh',
      destination: 'New York, USA',
      avgTransitDays: 30,
      enabled: true
    }]);
  };

  const removeRoute = (id: string) => {
    if (shipmentRoutes.length > 1) {
      setShipmentRoutes(prev => prev.filter(r => r.id !== id));
    }
  };

  const updateCustoms = (id: string, field: keyof CustomsRequirement, value: any) => {
    setCustomsRequirements(prev => prev.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const addCustoms = () => {
    setCustomsRequirements(prev => [...prev, {
      id: Date.now().toString(),
      country: 'USA',
      documentType: 'New Document',
      required: true,
      enabled: true
    }]);
  };

  const removeCustoms = (id: string) => {
    if (customsRequirements.length > 1) {
      setCustomsRequirements(prev => prev.filter(c => c.id !== id));
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
      case 'tracking': return Truck;
      case 'documentation': return FileText;
      case 'customs': return Shield;
      case 'optimization': return TrendingUp;
      default: return Zap;
    }
  };

  const getWorkflowColor = (category: string) => {
    switch (category) {
      case 'tracking': return '#57ACAF';
      case 'documentation': return '#EAB308';
      case 'customs': return '#D0342C';
      case 'optimization': return '#6F83A7';
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
              Shipment Module Setup
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Configure Your Smart Logistics System
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
                            <Truck className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-center text-white mb-3">
                        Shipment Module
                      </h2>
                      <p className="text-center text-[#6F83A7] text-lg mb-6 max-w-2xl mx-auto">
                        Build an intelligent logistics system with real-time tracking, smart documentation, 
                        customs automation, and AI-powered route optimization for 100% on-time delivery.
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Truck className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Live Tracking</h3>
                          <p className="text-xs text-[#6F83A7]">Real-time visibility</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <FileText className="w-8 h-8 text-[#EAB308] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Smart Docs</h3>
                          <p className="text-xs text-[#6F83A7]">AI generation</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                          <Globe className="w-8 h-8 text-[#57ACAF] mx-auto mb-2" />
                          <h3 className="text-white font-medium mb-1">Route Optimization</h3>
                          <p className="text-xs text-[#6F83A7]">Cost & speed</p>
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
                          Complete setup in just 5-10 minutes. MARBIM will guide you through configuring carriers, 
                          shipping routes, customs requirements, and enabling AI-powered logistics workflows.
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

              {/* Step 1: Carriers */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#EAB308]" />
                      Configure Shipping Carriers
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {carriers.map((carrier) => (
                        <div key={carrier.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{carrier.name}</h4>
                              <Switch
                                checked={carrier.enabled}
                                onCheckedChange={(checked) => updateCarrier(carrier.id, 'enabled', checked)}
                              />
                            </div>
                            {carriers.length > 1 && (
                              <Button
                                onClick={() => removeCarrier(carrier.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Carrier Name</Label>
                              <Input
                                value={carrier.name}
                                onChange={(e) => updateCarrier(carrier.id, 'name', e.target.value)}
                                placeholder="e.g., DHL Express"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Type</Label>
                              <Select
                                value={carrier.type}
                                onValueChange={(value) => updateCarrier(carrier.id, 'type', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Air">Air Freight</SelectItem>
                                  <SelectItem value="Sea">Sea Freight</SelectItem>
                                  <SelectItem value="Express">Express Courier</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Tracking URL</Label>
                              <Input
                                value={carrier.trackingUrl}
                                onChange={(e) => updateCarrier(carrier.id, 'trackingUrl', e.target.value)}
                                placeholder="https://"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addCarrier}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Carrier
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Routes */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#EAB308]" />
                      Configure Shipping Routes
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {shipmentRoutes.map((route) => (
                        <div key={route.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{route.origin} → {route.destination}</h4>
                              <Switch
                                checked={route.enabled}
                                onCheckedChange={(checked) => updateRoute(route.id, 'enabled', checked)}
                              />
                            </div>
                            {shipmentRoutes.length > 1 && (
                              <Button
                                onClick={() => removeRoute(route.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Origin</Label>
                              <Input
                                value={route.origin}
                                onChange={(e) => updateRoute(route.id, 'origin', e.target.value)}
                                placeholder="e.g., Dhaka, Bangladesh"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Destination</Label>
                              <Input
                                value={route.destination}
                                onChange={(e) => updateRoute(route.id, 'destination', e.target.value)}
                                placeholder="e.g., New York, USA"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Avg Transit Days</Label>
                              <Input
                                type="number"
                                value={route.avgTransitDays}
                                onChange={(e) => updateRoute(route.id, 'avgTransitDays', parseInt(e.target.value))}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addRoute}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Route
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Customs */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#EAB308]" />
                      Configure Customs Requirements
                    </h3>
                    
                    <div className="space-y-4 mb-4">
                      {customsRequirements.map((customs) => (
                        <div key={customs.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{customs.country} - {customs.documentType}</h4>
                              <Switch
                                checked={customs.enabled}
                                onCheckedChange={(checked) => updateCustoms(customs.id, 'enabled', checked)}
                              />
                            </div>
                            {customsRequirements.length > 1 && (
                              <Button
                                onClick={() => removeCustoms(customs.id)}
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
                              <Label className="text-[#6F83A7] mb-2 block">Country</Label>
                              <Select
                                value={customs.country}
                                onValueChange={(value) => updateCustoms(customs.id, 'country', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USA">USA</SelectItem>
                                  <SelectItem value="EU">EU</SelectItem>
                                  <SelectItem value="UK">UK</SelectItem>
                                  <SelectItem value="Canada">Canada</SelectItem>
                                  <SelectItem value="China">China</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Document Type</Label>
                              <Input
                                value={customs.documentType}
                                onChange={(e) => updateCustoms(customs.id, 'documentType', e.target.value)}
                                placeholder="e.g., Commercial Invoice"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] mb-2 block">Required</Label>
                              <Select
                                value={customs.required.toString()}
                                onValueChange={(value) => updateCustoms(customs.id, 'required', value === 'true')}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Yes</SelectItem>
                                  <SelectItem value="false">Optional</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={addCustoms}
                      variant="outline"
                      className="w-full border-dashed border-white/20 text-[#6F83A7] hover:text-white hover:border-[#57ACAF]/50 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Customs Requirement
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
                      Enable AI-Powered Shipment Workflows
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
