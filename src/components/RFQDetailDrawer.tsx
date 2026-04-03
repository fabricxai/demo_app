import { motion, AnimatePresence } from 'motion/react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { useState, useRef } from 'react';
import { 
  X, Edit2, Send, Copy, Download, BarChart3, 
  FileText, Clock, Calendar, DollarSign, CheckCircle,
  Target, AlertCircle, Eye, MessageSquare, Package,
  Sparkles, Settings, Trash2, User, Building2, Mail,
  Phone, Globe, MapPin, TrendingUp, Award, Layers,
  Shield, AlertTriangle, Plus, Minus, Save, Paperclip,
  FileCheck, Zap, History, Users, Calculator, TrendingDown,
  Info, ChevronRight, Upload, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MarbimAIButton } from './MarbimAIButton';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

interface RFQDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rfq: any;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
}

export function RFQDetailDrawer({ 
  isOpen, 
  onClose, 
  rfq,
  onAskMarbim,
  onOpenAI
}: RFQDetailDrawerProps) {
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, item: 'Cotton Fabric - Premium Grade', quantity: 5000, unit: 'yards', unitPrice: 4.25, total: 21250 },
    { id: 2, item: 'Polyester Blend - Standard', quantity: 3000, unit: 'yards', unitPrice: 3.50, total: 10500 },
    { id: 3, item: 'Shipping & Handling', quantity: 1, unit: 'lot', unitPrice: 850, total: 850 },
  ]);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler to send prompt to AI and close this drawer
  const handleAskMarbim = (prompt: string) => {
    if (onAskMarbim) {
      onAskMarbim(prompt);
    }
    if (onOpenAI) {
      onOpenAI();
    }
  };

  // File attachment handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) attached`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!rfq) return null;

  // Mock data for RFQ details
  const rfqTimeline = [
    { stage: 'RFQ Received', date: rfq.receivedDate || '2024-10-25', status: 'completed', icon: FileText },
    { stage: 'Initial Review', date: '2024-10-25', status: 'completed', icon: Eye },
    { stage: 'Clarification Sent', date: '2024-10-26', status: 'completed', icon: MessageSquare },
    { stage: 'Costing Analysis', date: '2024-10-27', status: 'current', icon: Calculator },
    { stage: 'Quote Preparation', date: '2024-10-28', status: 'pending', icon: FileCheck },
    { stage: 'Quote Submission', date: '2024-10-29', status: 'pending', icon: Send },
  ];

  const specifications = [
    { category: 'Material', requirement: 'Premium Cotton Blend, 200 GSM', status: 'verified', icon: Package, compliance: '100%' },
    { category: 'Quality', requirement: 'ISO 9001 Certified, AQL 2.5', status: 'verified', icon: Shield, compliance: '100%' },
    { category: 'Quantity', requirement: '5,000 yards minimum order', status: 'verified', icon: BarChart3, compliance: '100%' },
    { category: 'Delivery', requirement: 'FOB Shanghai, 30 days', status: 'pending', icon: Calendar, compliance: '95%' },
    { category: 'Compliance', requirement: 'OEKO-TEX Standard 100', status: 'verified', icon: Award, compliance: '100%' },
    { category: 'Packaging', requirement: 'Individual rolls, waterproof', status: 'pending', icon: Package, compliance: '90%' },
  ];

  const competitorAnalysis = [
    { supplier: 'Competitor A', price: 4.50, leadTime: 35, quality: 'High', winProb: 25 },
    { supplier: 'Competitor B', price: 4.20, leadTime: 45, quality: 'Medium', winProb: 20 },
    { supplier: 'Your Quote', price: 4.25, leadTime: 30, quality: 'High', highlight: true, winProb: 55 },
  ];

  const communications = [
    {
      id: 1,
      timestamp: '2 hours ago',
      sender: 'John Smith - Buyer',
      message: 'Can you confirm the fabric weight tolerance? We need ±5% maximum.',
      type: 'question',
      sentiment: 'neutral',
      priority: 'high'
    },
    {
      id: 2,
      timestamp: '5 hours ago',
      sender: 'Sarah Chen - You',
      message: 'Thank you for the RFQ. We\'re reviewing specifications and will have a quote ready by EOD.',
      type: 'reply',
      sentiment: 'positive',
      priority: 'normal'
    },
    {
      id: 3,
      timestamp: '1 day ago',
      sender: 'John Smith - Buyer',
      message: 'Attached are the detailed technical specifications and quality requirements for this order.',
      type: 'message',
      sentiment: 'neutral',
      priority: 'normal'
    },
  ];

  const costingBreakdown = [
    { category: 'Raw Materials', amount: 18500, percentage: 57, subItems: [
      { name: 'Cotton Fabric', amount: 12500 },
      { name: 'Polyester Blend', amount: 6000 }
    ]},
    { category: 'Direct Labor', amount: 4200, percentage: 13, subItems: [
      { name: 'Production Staff', amount: 3200 },
      { name: 'Quality Control', amount: 1000 }
    ]},
    { category: 'Manufacturing Overhead', amount: 3800, percentage: 12, subItems: [
      { name: 'Factory Costs', amount: 2300 },
      { name: 'Equipment', amount: 1500 }
    ]},
    { category: 'Logistics', amount: 2500, percentage: 8, subItems: [
      { name: 'Shipping', amount: 1800 },
      { name: 'Handling', amount: 700 }
    ]},
    { category: 'Profit Margin', amount: 3200, percentage: 10, subItems: [] },
  ];

  const totalCost = costingBreakdown.reduce((sum, item) => sum + item.amount, 0);

  const pricingScenarios = [
    { 
      name: 'Aggressive', 
      unitPrice: 4.15, 
      margin: 8, 
      winProb: 75, 
      risk: 'High',
      description: 'Lowest pricing to maximize win probability'
    },
    { 
      name: 'Competitive', 
      unitPrice: 4.25, 
      margin: 12, 
      winProb: 68, 
      risk: 'Medium',
      description: 'Balanced approach with healthy margins',
      recommended: true
    },
    { 
      name: 'Premium', 
      unitPrice: 4.45, 
      margin: 18, 
      winProb: 45, 
      risk: 'Low',
      description: 'Higher margins with value-added services'
    },
  ];

  const historicalData = [
    { month: 'Jul', quotes: 12, won: 8, rate: 67 },
    { month: 'Aug', quotes: 15, won: 11, rate: 73 },
    { month: 'Sep', quotes: 18, won: 13, rate: 72 },
    { month: 'Oct', quotes: 14, won: 10, rate: 71 },
  ];

  const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const addQuoteItem = () => {
    setQuoteItems([...quoteItems, {
      id: quoteItems.length + 1,
      item: 'New Item',
      quantity: 0,
      unit: 'yards',
      unitPrice: 0,
      total: 0
    }]);
  };

  const removeQuoteItem = (id: number) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id));
  };

  const updateQuoteItem = (id: number, field: string, value: any) => {
    setQuoteItems(quoteItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={fabricRightDrawerClass('max-w-[1000px]', 'overflow-hidden')}
          >
            {/* Header */}
            <div className="relative px-8 py-6 border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }} />
              </div>

              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl text-white">{rfq.rfqId}</h2>
                        <Badge className={
                          rfq.status === 'Needs Clarification'
                            ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20' 
                            : rfq.status === 'Ready for Costing'
                            ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                            : rfq.status === 'Quoted'
                            ? 'bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20'
                            : rfq.status === 'Closed - Won'
                            ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                            : 'bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20'
                        }>
                          {rfq.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6F83A7]">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {rfq.buyer}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          {rfq.productType}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Received: {rfq.receivedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Est. Value</div>
                      <div className="text-lg text-white">$32.6K</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Target Margin</div>
                      <div className="text-lg text-white">12%</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Win Probability</div>
                      <div className="text-lg text-[#57ACAF]">68%</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
                      <div className="text-xs text-[#EAB308] mb-1">Days Active</div>
                      <div className="text-lg text-white">3</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-start gap-2 ml-6">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white border-none hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                    onClick={() => toast.success('Quote submitted')}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Quote
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    onClick={() => toast.info('Edit RFQ details')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                    className="text-white/60 hover:text-white hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Premium Tabs Navigation */}
            <div className="px-8 pt-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-4 gap-1.5 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20 mb-6">
                  <TabsTrigger 
                    value="overview"
                    className="py-3.5 px-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl flex items-center justify-center gap-2 group"
                  >
                    <BarChart3 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="costing"
                    className="py-3.5 px-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl flex items-center justify-center gap-2 group"
                  >
                    <Calculator className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                    <span>Costing Details</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="requirements"
                    className="py-3.5 px-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl flex items-center justify-center gap-2 group"
                  >
                    <Layers className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                    <span>Requirements</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="communication"
                    className="py-3.5 px-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl flex items-center justify-center gap-2 group"
                  >
                    <MessageSquare className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                    <span>Communication</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tab Content with proper scroll handling */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-[calc(100vh-380px)]">
                    <div className="pr-6 pb-6">
                      {/* Overview Tab */}
                      <TabsContent value="overview" className="mt-0 space-y-6">
                        {/* AI Strategic Overview */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-[#EAB308]" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white mb-2">AI Strategic Overview</h4>
                                <p className="text-sm text-[#6F83A7] leading-relaxed mb-3">
                                  This RFQ has a <span className="text-[#57ACAF]">68% win probability</span> based on historical performance with {rfq.buyer}. 
                                  Buyer typically values <span className="text-[#EAB308]">quality and lead time</span> over price. 
                                  Recommend competitive pricing at $4.25/unit with <span className="text-[#57ACAF]">12% margin</span> to maximize win rate.
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-[#6F83A7] mb-1">Key Success Factor</div>
                                    <div className="text-sm text-white">Lead Time</div>
                                  </div>
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-[#6F83A7] mb-1">Competitive Edge</div>
                                    <div className="text-sm text-white">Quality</div>
                                  </div>
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-[#6F83A7] mb-1">Risk Level</div>
                                    <div className="text-sm text-[#57ACAF]">Low</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Provide comprehensive strategic analysis for RFQ ${rfq.rfqId} from ${rfq.buyer}. Buyer profile: ${rfq.productType} specialist. Current status: ${rfq.status}. Received: ${rfq.receivedDate}. Provide: 1) Detailed buyer behavior analysis and historical preferences, 2) Win probability factors and optimization strategies, 3) Pricing recommendations with margin analysis, 4) Competitive positioning vs market alternatives, 5) Risk assessment and mitigation tactics, 6) Timeline optimization to meet deadline, 7) Value proposition differentiation strategies, 8) Recommended next actions with priorities.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                        </div>

                        {/* RFQ Timeline & Buyer Info */}
                        <div className="grid grid-cols-2 gap-6">
                          {/* RFQ Timeline */}
                          <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                            <div className="flex items-start justify-between mb-5">
                              <div>
                                <h3 className="text-white mb-1 flex items-center gap-2">
                                  <History className="w-5 h-5 text-[#57ACAF]" />
                                  RFQ Timeline
                                </h3>
                                <p className="text-sm text-[#6F83A7]">Progress through quote workflow</p>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Analyze RFQ workflow timeline for ${rfq.rfqId}. Current stage: Costing Analysis. Stages completed: ${rfqTimeline.filter(s => s.status === 'completed').length} of ${rfqTimeline.length}. Received: ${rfq.receivedDate}. Provide: 1) Timeline efficiency analysis, 2) Bottleneck identification, 3) Risk assessment for deadline compliance, 4) Resource optimization recommendations, 5) Accelerated completion strategies if needed.`}
                                onAskMarbim={handleAskMarbim}
                                size="sm"
                              />
                            </div>
                            <div className="space-y-4">
                              {rfqTimeline.map((stage, index) => {
                                const Icon = stage.icon;
                                return (
                                  <div key={index} className="relative flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 z-10 ${
                                      stage.status === 'completed' 
                                        ? 'bg-[#57ACAF]/20 border border-[#57ACAF]/40' 
                                        : stage.status === 'current'
                                        ? 'bg-[#EAB308]/20 border border-[#EAB308]/40'
                                        : 'bg-white/5 border border-white/10'
                                    }`}>
                                      {stage.status === 'completed' ? (
                                        <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                      ) : stage.status === 'current' ? (
                                        <Icon className="w-4 h-4 text-[#EAB308]" />
                                      ) : (
                                        <Icon className="w-4 h-4 text-white/30" />
                                      )}
                                    </div>
                                    {index < rfqTimeline.length - 1 && (
                                      <div className="absolute left-4 top-8 w-px h-8 bg-white/10" />
                                    )}
                                    <div className="flex-1 pt-0.5">
                                      <div className={`text-sm ${
                                        stage.status === 'current' ? 'text-white' : 'text-[#6F83A7]'
                                      }`}>
                                        {stage.stage}
                                      </div>
                                      <div className="text-xs text-[#6F83A7]">{stage.date}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Buyer Information */}
                          <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                            <div className="flex items-start justify-between mb-5">
                              <div>
                                <h3 className="text-white mb-1 flex items-center gap-2">
                                  <Building2 className="w-5 h-5 text-[#57ACAF]" />
                                  Buyer Information
                                </h3>
                                <p className="text-sm text-[#6F83A7]">Contact details and preferences</p>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Analyze buyer profile for ${rfq.buyer}. Product focus: ${rfq.productType}. Provide: 1) Historical order patterns and volume trends, 2) Quality standards and compliance requirements, 3) Payment behavior and credit history, 4) Communication preferences and response times, 5) Price sensitivity analysis, 6) Strategic relationship recommendations, 7) Win strategy optimization for this buyer.`}
                                onAskMarbim={handleAskMarbim}
                                size="sm"
                              />
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-180">
                                <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center flex-shrink-0">
                                  <Building2 className="w-4 h-4 text-[#57ACAF]" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs text-[#6F83A7]">Company</div>
                                  <div className="text-sm text-white">{rfq.buyer}</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-180">
                                <div className="w-8 h-8 rounded-lg bg-[#EAB308]/10 flex items-center justify-center flex-shrink-0">
                                  <User className="w-4 h-4 text-[#EAB308]" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs text-[#6F83A7]">Contact Person</div>
                                  <div className="text-sm text-white">John Smith - Procurement Manager</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-180">
                                <div className="w-8 h-8 rounded-lg bg-[#6F83A7]/10 flex items-center justify-center flex-shrink-0">
                                  <Mail className="w-4 h-4 text-[#6F83A7]" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs text-[#6F83A7]">Email</div>
                                  <div className="text-sm text-white">john.smith@{rfq.buyer.toLowerCase().replace(' ', '')}.com</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-180">
                                <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center flex-shrink-0">
                                  <Phone className="w-4 h-4 text-[#57ACAF]" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs text-[#6F83A7]">Phone</div>
                                  <div className="text-sm text-white">+1 (555) 123-4567</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Historical Performance */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h3 className="text-white mb-1 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                                Historical Win Rate with {rfq.buyer}
                              </h3>
                              <p className="text-sm text-[#6F83A7]">Quote performance trends over last 4 months</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Analyze historical quote performance with ${rfq.buyer}. Last 4 months data: ${historicalData.map(m => `${m.month}: ${m.won}/${m.quotes} quotes won (${m.rate}%)`).join(', ')}. Overall trend: ${historicalData[historicalData.length-1].rate > historicalData[0].rate ? 'improving' : 'declining'}. Provide: 1) Win rate trend analysis and drivers, 2) Seasonal patterns or anomalies, 3) Factors contributing to wins/losses, 4) Comparison to company average, 5) Strategic recommendations to improve future win rate, 6) Optimal pricing and timing strategies for this buyer.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                          <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={historicalData}>
                              <defs>
                                <linearGradient id="winRateGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#57ACAF" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#57ACAF" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                              <XAxis dataKey="month" stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                              <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                              <RechartsTooltip
                                contentStyle={{
                                  backgroundColor: '#0D1117',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '12px',
                                }}
                                labelStyle={{ color: '#ffffff' }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="rate" 
                                stroke="#57ACAF" 
                                strokeWidth={2}
                                fill="url(#winRateGradient)" 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
                            <div className="text-center">
                              <div className="text-xs text-[#6F83A7] mb-1">Total Quotes</div>
                              <div className="text-lg text-white">{historicalData.reduce((sum, m) => sum + m.quotes, 0)}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-[#6F83A7] mb-1">Total Won</div>
                              <div className="text-lg text-[#57ACAF]">{historicalData.reduce((sum, m) => sum + m.won, 0)}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-[#6F83A7] mb-1">Avg Win Rate</div>
                              <div className="text-lg text-white">
                                {Math.round(historicalData.reduce((sum, m) => sum + m.rate, 0) / historicalData.length)}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-[#6F83A7] mb-1">Trend</div>
                              <div className="text-lg text-[#57ACAF] flex items-center justify-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                +4%
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-4">
                          <Button
                            variant="outline"
                            className="h-auto py-4 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 flex flex-col items-start gap-2"
                            onClick={() => toast.info('Opening costing calculator')}
                          >
                            <Calculator className="w-5 h-5 text-[#57ACAF]" />
                            <div className="text-left">
                              <div className="text-white">Calculate Costing</div>
                              <div className="text-xs text-[#6F83A7]">Build detailed quote</div>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            className="h-auto py-4 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 flex flex-col items-start gap-2"
                            onClick={() => toast.info('Opening buyer history')}
                          >
                            <Users className="w-5 h-5 text-[#EAB308]" />
                            <div className="text-left">
                              <div className="text-white">Buyer History</div>
                              <div className="text-xs text-[#6F83A7]">View past orders</div>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            className="h-auto py-4 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 flex flex-col items-start gap-2"
                            onClick={() => toast.success('Sending clarification request')}
                          >
                            <MessageSquare className="w-5 h-5 text-[#6F83A7]" />
                            <div className="text-left">
                              <div className="text-white">Send Clarification</div>
                              <div className="text-xs text-[#6F83A7]">Request info</div>
                            </div>
                          </Button>
                        </div>
                      </TabsContent>

                      {/* Costing Details Tab */}
                      <TabsContent value="costing" className="mt-0 space-y-6">
                        {/* Pricing Scenarios */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h3 className="text-white mb-1 flex items-center gap-2">
                                <Target className="w-5 h-5 text-[#57ACAF]" />
                                Pricing Scenario Analysis
                              </h3>
                              <p className="text-sm text-[#6F83A7]">Strategic pricing options with win probability assessment</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Analyze pricing scenarios for RFQ ${rfq.rfqId}. Scenarios: ${pricingScenarios.map(s => `${s.name}: $${s.unitPrice}/unit, ${s.margin}% margin, ${s.winProb}% win probability, ${s.risk} risk - ${s.description}`).join(' | ')}. Recommended: ${pricingScenarios.find(s => s.recommended)?.name}. Buyer: ${rfq.buyer}. Product: ${rfq.productType}. Provide: 1) Deep analysis of each scenario's viability, 2) Market positioning for each price point, 3) Risk-reward assessment, 4) Buyer response prediction for each scenario, 5) Optimal scenario selection with justification, 6) Negotiation strategy and fallback positions, 7) Value-add opportunities to justify premium pricing.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            {pricingScenarios.map((scenario, index) => (
                              <div 
                                key={index}
                                className={`p-5 rounded-xl border transition-all duration-180 cursor-pointer hover:scale-105 ${
                                  scenario.recommended
                                    ? 'bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border-[#EAB308]/30 shadow-lg shadow-[#EAB308]/10'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                                onClick={() => toast.info(`Selected ${scenario.name} scenario`)}
                              >
                                {scenario.recommended && (
                                  <Badge className="mb-3 bg-[#EAB308] text-black border-none">
                                    <Award className="w-3 h-3 mr-1" />
                                    Recommended
                                  </Badge>
                                )}
                                <div className="text-lg text-white mb-1">{scenario.name}</div>
                                <div className="text-3xl text-[#57ACAF] mb-3">${scenario.unitPrice}</div>
                                <div className="space-y-2 mb-4">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#6F83A7]">Margin</span>
                                    <span className="text-white">{scenario.margin}%</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#6F83A7]">Win Probability</span>
                                    <span className="text-[#57ACAF]">{scenario.winProb}%</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#6F83A7]">Risk Level</span>
                                    <Badge className={`${
                                      scenario.risk === 'High' ? 'bg-[#D0342C]/10 text-[#D0342C]' :
                                      scenario.risk === 'Medium' ? 'bg-[#EAB308]/10 text-[#EAB308]' :
                                      'bg-[#57ACAF]/10 text-[#57ACAF]'
                                    } border-none`}>
                                      {scenario.risk}
                                    </Badge>
                                  </div>
                                </div>
                                <Progress value={scenario.winProb} className="h-2 mb-3" />
                                <p className="text-xs text-[#6F83A7]">{scenario.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Detailed Cost Breakdown */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h3 className="text-white mb-1 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-[#57ACAF]" />
                                Detailed Cost Breakdown
                              </h3>
                              <p className="text-sm text-[#6F83A7]">Complete costing analysis with sub-item details</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Analyze detailed cost structure for RFQ ${rfq.rfqId}. Total cost: $${totalCost.toLocaleString()}. Breakdown: ${costingBreakdown.map(c => `${c.category}: $${c.amount.toLocaleString()} (${c.percentage}%)${c.subItems.length > 0 ? ' - ' + c.subItems.map(s => `${s.name}: $${s.amount.toLocaleString()}`).join(', ') : ''}`).join(' | ')}. Provide: 1) Cost competitiveness analysis vs industry benchmarks, 2) Optimization opportunities for each category, 3) Risk areas with high cost volatility, 4) Make vs buy analysis for key components, 5) Economies of scale opportunities, 6) Margin improvement strategies without compromising quality, 7) Cost reduction roadmap with timeline.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                          <div className="space-y-4">
                            {costingBreakdown.map((item, index) => (
                              <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="text-white mb-1">{item.category}</div>
                                    <div className="flex items-center gap-3 text-sm">
                                      <span className="text-[#6F83A7]">{item.percentage}% of total</span>
                                      <div className="w-32">
                                        <Progress value={item.percentage * 100 / Math.max(...costingBreakdown.map(c => c.percentage))} className="h-1" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-2xl text-[#57ACAF]">${item.amount.toLocaleString()}</div>
                                </div>
                                {item.subItems.length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                                    {item.subItems.map((subItem, subIndex) => (
                                      <div key={subIndex} className="flex items-center justify-between text-sm">
                                        <span className="text-[#6F83A7]">{subItem.name}</span>
                                        <span className="text-white">${subItem.amount.toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                            <div className="p-4 rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                              <div className="flex items-center justify-between">
                                <span className="text-white">Total Estimated Cost</span>
                                <span className="text-2xl text-[#57ACAF]">${totalCost.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Competitive Pricing Analysis */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h3 className="text-white mb-1 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                                Competitive Pricing Landscape
                              </h3>
                              <p className="text-sm text-[#6F83A7]">Market positioning vs competitors</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Analyze competitive landscape for RFQ ${rfq.rfqId}. Competitors: ${competitorAnalysis.map(c => `${c.supplier}: $${c.price}/unit, ${c.leadTime} days, ${c.quality} quality, ${c.winProb}% win probability${c.highlight ? ' (OUR QUOTE)' : ''}`).join(' | ')}. Provide: 1) Detailed competitive positioning matrix, 2) Price-quality-speed trade-off analysis, 3) Competitive advantages and differentiation points, 4) Threats from each competitor, 5) Strategic pricing recommendations to beat competition, 6) Non-price value propositions to emphasize, 7) Win strategy against each specific competitor.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={competitorAnalysis}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                              <XAxis dataKey="supplier" stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                              <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                              <RechartsTooltip
                                contentStyle={{
                                  backgroundColor: '#0D1117',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '12px',
                                }}
                                labelStyle={{ color: '#ffffff' }}
                                formatter={(value: any, name: string) => {
                                  if (name === 'winProb') return [`${value}%`, 'Win Probability'];
                                  if (name === 'price') return [`$${value}`, 'Price/Unit'];
                                  return [value, name];
                                }}
                              />
                              <Bar dataKey="winProb" radius={[8, 8, 0, 0]}>
                                {competitorAnalysis.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.highlight ? '#EAB308' : '#57ACAF'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            {competitorAnalysis.map((comp, index) => (
                              <div 
                                key={index}
                                className={`p-4 rounded-lg border ${
                                  comp.highlight
                                    ? 'bg-[#EAB308]/10 border-[#EAB308]/20'
                                    : 'bg-white/5 border-white/10'
                                }`}
                              >
                                <div className={`text-sm mb-2 ${comp.highlight ? 'text-[#EAB308]' : 'text-white'}`}>
                                  {comp.supplier}
                                  {comp.highlight && <Badge className="ml-2 bg-[#EAB308] text-black border-none text-xs">You</Badge>}
                                </div>
                                <div className="space-y-1 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-[#6F83A7]">Price</span>
                                    <span className="text-white">${comp.price}/unit</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[#6F83A7]">Lead Time</span>
                                    <span className="text-white">{comp.leadTime} days</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[#6F83A7]">Quality</span>
                                    <span className="text-white">{comp.quality}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cost Optimization Insights */}
                        <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                              <Zap className="w-5 h-5 text-[#EAB308]" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white mb-2">Cost Optimization Opportunities</h4>
                              <div className="space-y-2">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="text-sm text-white mb-1">Bulk Material Purchase Discount</div>
                                      <div className="text-xs text-[#6F83A7]">Potential savings: $1,200 (3.8%)</div>
                                    </div>
                                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none">High Impact</Badge>
                                  </div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="text-sm text-white mb-1">Optimize Shipping Route</div>
                                      <div className="text-xs text-[#6F83A7]">Potential savings: $350 (1.1%)</div>
                                    </div>
                                    <Badge className="bg-[#EAB308]/10 text-[#EAB308] border-none">Medium Impact</Badge>
                                  </div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="text-sm text-white mb-1">Streamline QC Process</div>
                                      <div className="text-xs text-[#6F83A7]">Potential savings: $280 (0.9%)</div>
                                    </div>
                                    <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border-none">Low Impact</Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Requirements Tab */}
                      <TabsContent value="requirements" className="mt-0 space-y-6">
                        {/* Technical Specifications */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h3 className="text-white mb-1 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-[#57ACAF]" />
                                Technical Specifications
                              </h3>
                              <p className="text-sm text-[#6F83A7]">Detailed requirements and compliance status</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Analyze technical specifications for RFQ ${rfq.rfqId}. Requirements: ${specifications.map(s => `${s.category}: ${s.requirement} - Status: ${s.status}, Compliance: ${s.compliance}`).join(' | ')}. Provide: 1) Comprehensive compliance gap analysis for each requirement, 2) Risk assessment for pending specifications, 3) Recommended certifications or documentation needed, 4) Cost implications of meeting each specification, 5) Quality assurance measures required, 6) Timeline to achieve full compliance, 7) Alternative approaches if any specs cannot be met, 8) Competitive advantages from specification excellence.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                          <div className="space-y-3">
                            {specifications.map((spec, index) => {
                              const Icon = spec.icon;
                              return (
                                <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180">
                                  <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center flex-shrink-0">
                                      <Icon className="w-5 h-5 text-[#57ACAF]" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="text-white">{spec.category}</div>
                                        <div className="flex items-center gap-2">
                                          <Badge className={
                                            spec.status === 'verified'
                                              ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                                              : 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20'
                                          }>
                                            {spec.status}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="text-sm text-[#6F83A7] mb-3">{spec.requirement}</div>
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                          <Progress value={parseInt(spec.compliance)} className="h-2" />
                                        </div>
                                        <span className="text-xs text-[#57ACAF]">{spec.compliance} compliant</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Compliance Checklist */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h3 className="text-white mb-1 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[#57ACAF]" />
                                Compliance & Quality Checklist
                              </h3>
                              <p className="text-sm text-[#6F83A7]">Required certifications and quality standards</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Analyze compliance requirements for RFQ ${rfq.rfqId} from ${rfq.buyer}. Product: ${rfq.productType}. Standards mentioned: ISO 9001, OEKO-TEX Standard 100, AQL 2.5. Provide: 1) Complete compliance checklist with all applicable standards, 2) Current certification status and gaps, 3) Timeline and cost to obtain missing certifications, 4) Risk assessment for non-compliance, 5) Competitive advantages from compliance excellence, 6) Documentation requirements for proof of compliance, 7) Ongoing monitoring and audit requirements.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                          <div className="space-y-3">
                            {[
                              { item: 'ISO 9001 Quality Management Certification', status: 'completed', date: 'Valid until 2025-12-31' },
                              { item: 'OEKO-TEX Standard 100 Certificate', status: 'completed', date: 'Valid until 2025-06-30' },
                              { item: 'AQL 2.5 Inspection Report', status: 'pending', date: 'Required before shipment' },
                              { item: 'Material Safety Data Sheet (MSDS)', status: 'completed', date: 'Up to date' },
                              { item: 'Country of Origin Documentation', status: 'completed', date: 'Verified' },
                              { item: 'Third-party Lab Test Reports', status: 'pending', date: 'In progress' },
                            ].map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  item.status === 'completed'
                                    ? 'bg-[#57ACAF]/20 border border-[#57ACAF]/40'
                                    : 'bg-[#EAB308]/20 border border-[#EAB308]/40'
                                }`}>
                                  {item.status === 'completed' ? (
                                    <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-[#EAB308]" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm text-white mb-0.5">{item.item}</div>
                                  <div className="text-xs text-[#6F83A7]">{item.date}</div>
                                </div>
                                {item.status === 'completed' ? (
                                  <Button size="sm" variant="outline" className="border-white/10 text-[#57ACAF] bg-transparent hover:bg-white/5">
                                    <Download className="w-3 h-3 mr-1" />
                                    Download
                                  </Button>
                                ) : (
                                  <Button size="sm" variant="outline" className="border-white/10 text-[#EAB308] bg-transparent hover:bg-white/5">
                                    <Upload className="w-3 h-3 mr-1" />
                                    Upload
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quality Assurance Plan */}
                        <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                              <Award className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white mb-2">Quality Assurance Plan</h4>
                              <p className="text-sm text-[#6F83A7] mb-4">
                                Comprehensive QA strategy to meet buyer requirements with AQL 2.5 standard and ISO 9001 compliance.
                                Includes in-line inspection, final audit, and third-party verification before shipment.
                              </p>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                  <div className="text-xs text-[#6F83A7] mb-1">Inspection Points</div>
                                  <div className="text-lg text-white">5</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                  <div className="text-xs text-[#6F83A7] mb-1">QC Team Size</div>
                                  <div className="text-lg text-white">8 members</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                  <div className="text-xs text-[#6F83A7] mb-1">Defect Rate Target</div>
                                  <div className="text-lg text-[#57ACAF]">{'<'}0.5%</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Communication Tab */}
                      <TabsContent value="communication" className="mt-0 space-y-6">
                        {/* Communication Timeline */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h3 className="text-white mb-1 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-[#57ACAF]" />
                                Communication History
                              </h3>
                              <p className="text-sm text-[#6F83A7]">All interactions and correspondence with buyer</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Analyze communication history for RFQ ${rfq.rfqId} with ${rfq.buyer}. Messages: ${communications.map(c => `${c.timestamp} - ${c.sender}: "${c.message}" (${c.sentiment} sentiment, ${c.priority} priority)`).join(' | ')}. Provide: 1) Communication sentiment analysis and buyer engagement level, 2) Key concerns or questions raised by buyer, 3) Response time analysis and recommendations for improvement, 4) Topics requiring follow-up or clarification, 5) Relationship health indicators, 6) Recommended communication strategy for closing this RFQ, 7) Template responses for common questions.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                          <div className="space-y-4">
                            {communications.map((comm) => {
                              const isFromBuyer = comm.sender.includes('Buyer');
                              return (
                                <div 
                                  key={comm.id}
                                  className={`p-4 rounded-lg border ${
                                    isFromBuyer 
                                      ? 'bg-[#57ACAF]/5 border-[#57ACAF]/20 ml-0 mr-8'
                                      : 'bg-[#EAB308]/5 border-[#EAB308]/20 ml-8 mr-0'
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        isFromBuyer ? 'bg-[#57ACAF]/20' : 'bg-[#EAB308]/20'
                                      }`}>
                                        <User className={`w-4 h-4 ${isFromBuyer ? 'text-[#57ACAF]' : 'text-[#EAB308]'}`} />
                                      </div>
                                      <div>
                                        <div className="text-sm text-white">{comm.sender}</div>
                                        <div className="text-xs text-[#6F83A7]">{comm.timestamp}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {comm.priority === 'high' && (
                                        <Badge className="bg-[#D0342C]/10 text-[#D0342C] border-none text-xs">
                                          <AlertCircle className="w-3 h-3 mr-1" />
                                          High Priority
                                        </Badge>
                                      )}
                                      {comm.sentiment === 'positive' ? (
                                        <ThumbsUp className="w-4 h-4 text-[#57ACAF]" />
                                      ) : comm.sentiment === 'negative' ? (
                                        <ThumbsDown className="w-4 h-4 text-[#D0342C]" />
                                      ) : (
                                        <Info className="w-4 h-4 text-[#6F83A7]" />
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-white leading-relaxed">{comm.message}</p>
                                  {comm.priority === 'high' && (
                                    <div className="mt-3 pt-3 border-t border-white/10">
                                      <Button size="sm" className="bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white">
                                        <MessageSquare className="w-3 h-3 mr-2" />
                                        Reply Now
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Send New Message */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-white mb-1 flex items-center gap-2">
                                <Send className="w-5 h-5 text-[#57ACAF]" />
                                Send Message
                              </h3>
                              <p className="text-sm text-[#6F83A7]">Compose new communication to buyer</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Draft a professional message for ${rfq.buyer} regarding RFQ ${rfq.rfqId}. Context: ${rfq.status} status, ${rfq.productType} order. Recent communication: ${communications[0]?.message}. Provide: 1) Well-crafted message addressing buyer concerns, 2) Tone recommendations (formal/friendly/urgent), 3) Key points to emphasize, 4) Call-to-action suggestions, 5) Follow-up strategy if no response.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-[#6F83A7] mb-2 block">Subject</label>
                              <Input 
                                placeholder="Enter message subject..."
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-[#6F83A7] mb-2 block">Message</label>
                              <Textarea 
                                placeholder="Type your message here..."
                                rows={6}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                              />
                            </div>
                            
                            {/* File Attachments */}
                            <div>
                              <label className="text-sm text-[#6F83A7] mb-2 block">Attachments</label>
                              <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="*/*"
                                onChange={handleFileSelect}
                                className="hidden"
                              />
                              {attachedFiles.length > 0 && (
                                <div className="space-y-2 mb-3">
                                  {attachedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-180">
                                      <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-[#57ACAF]" />
                                        <div>
                                          <div className="text-sm text-white">{file.name}</div>
                                          <div className="text-xs text-[#6F83A7]">{formatFileSize(file.size)}</div>
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleRemoveFile(index)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D0342C] hover:bg-[#D0342C]/10"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <Button
                                variant="outline"
                                className="w-full border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                                onClick={handleAttachClick}
                              >
                                <Paperclip className="w-4 h-4 mr-2" />
                                Attach Files
                              </Button>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                                onClick={() => toast.success('Message sent to buyer')}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                              </Button>
                              <Button
                                variant="outline"
                                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                                onClick={() => toast.info('Draft saved')}
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save Draft
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Communication Insights */}
                        <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-5 h-5 text-[#EAB308]" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white mb-2">Communication Insights</h4>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2 text-sm">
                                  <ChevronRight className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                                  <div>
                                    <span className="text-white">Buyer response time:</span>
                                    <span className="text-[#57ACAF] ml-1">avg 4.2 hours (excellent engagement)</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                  <ChevronRight className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                                  <div>
                                    <span className="text-white">1 high-priority question pending:</span>
                                    <span className="text-[#EAB308] ml-1">Fabric weight tolerance clarification</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                  <ChevronRight className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                                  <div>
                                    <span className="text-white">Overall sentiment:</span>
                                    <span className="text-[#57ACAF] ml-1">Positive (buyer is engaged and responsive)</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </div>
                  </ScrollArea>
                </div>
              </Tabs>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
