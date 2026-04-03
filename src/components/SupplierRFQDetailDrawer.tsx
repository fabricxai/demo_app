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
  Info, ChevronRight, Upload, ThumbsUp, ThumbsDown, Truck
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface SupplierRFQDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rfq: any;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
}

export function SupplierRFQDetailDrawer({ 
  isOpen, 
  onClose, 
  rfq,
  onAskMarbim,
  onOpenAI
}: SupplierRFQDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');
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

  // Mock data for Supplier RFQ details (materials)
  const rfqTimeline = [
    { stage: 'RFQ Created', date: rfq.sentDate || '2024-10-25', status: 'completed', icon: FileText },
    { stage: 'Sent to Suppliers', date: '2024-10-25', status: 'completed', icon: Send },
    { stage: 'Quotes Received', date: '2024-10-27', status: 'current', icon: Eye },
    { stage: 'Evaluation', date: '2024-10-28', status: 'pending', icon: BarChart3 },
    { stage: 'Negotiation', date: '2024-10-29', status: 'pending', icon: MessageSquare },
    { stage: 'Award Decision', date: '2024-10-30', status: 'pending', icon: Award },
  ];

  const specifications = [
    { category: 'Material Type', requirement: 'Premium Cotton Fabric - 100% Organic', status: 'verified', icon: Package, compliance: '100%' },
    { category: 'Quality Grade', requirement: 'Grade A+, 200 GSM, Combed Cotton', status: 'verified', icon: Shield, compliance: '100%' },
    { category: 'Quantity Required', requirement: '50,000 yards (minimum order)', status: 'verified', icon: BarChart3, compliance: '100%' },
    { category: 'Delivery Schedule', requirement: 'FOB Shanghai, 3 shipments over 60 days', status: 'pending', icon: Calendar, compliance: '95%' },
    { category: 'Certifications', requirement: 'GOTS, OEKO-TEX Standard 100, ISO 9001', status: 'verified', icon: Award, compliance: '100%' },
    { category: 'Testing Requirements', requirement: 'Shrinkage ≤3%, Color fastness Grade 4+', status: 'pending', icon: FileCheck, compliance: '90%' },
  ];

  const quotedSuppliers = [
    { 
      supplier: 'Premium Textiles Ltd', 
      price: 4.50, 
      leadTime: 30, 
      quality: 95, 
      reliability: 92,
      certCompliance: 100,
      totalScore: 94,
      status: 'Best Value',
      highlight: true 
    },
    { 
      supplier: 'Global Fabrics Inc', 
      price: 4.20, 
      leadTime: 45, 
      quality: 88, 
      reliability: 85,
      certCompliance: 95,
      totalScore: 87,
      status: 'Lowest Price' 
    },
    { 
      supplier: 'Elite Materials Co', 
      price: 4.85, 
      leadTime: 25, 
      quality: 98, 
      reliability: 96,
      certCompliance: 100,
      totalScore: 92,
      status: 'Premium Quality' 
    },
  ];

  const communications = [
    {
      id: 1,
      timestamp: '3 hours ago',
      sender: 'Premium Textiles Ltd',
      message: 'We can meet your 200 GSM specification with ±2% tolerance. Sample swatches will be shipped tomorrow via DHL.',
      type: 'reply',
      sentiment: 'positive',
      priority: 'high'
    },
    {
      id: 2,
      timestamp: '1 day ago',
      sender: 'You - Procurement Team',
      message: 'RFQ for 50,000 yards organic cotton fabric sent to 5 pre-qualified suppliers. Deadline: Oct 28th.',
      type: 'message',
      sentiment: 'neutral',
      priority: 'normal'
    },
    {
      id: 3,
      timestamp: '1 day ago',
      sender: 'Global Fabrics Inc',
      message: 'Acknowledged RFQ. We have similar material in stock. Will submit competitive quote by tomorrow EOD.',
      type: 'reply',
      sentiment: 'positive',
      priority: 'normal'
    },
  ];

  const evaluationCriteria = [
    { criterion: 'Price Competitiveness', weight: 30, premiumScore: 85, globalScore: 95, eliteScore: 75 },
    { criterion: 'Quality & Specifications', weight: 25, premiumScore: 95, globalScore: 88, eliteScore: 98 },
    { criterion: 'Lead Time & Delivery', weight: 20, premiumScore: 90, globalScore: 75, eliteScore: 95 },
    { criterion: 'Reliability & Track Record', weight: 15, premiumScore: 92, globalScore: 85, eliteScore: 96 },
    { criterion: 'Certifications & Compliance', weight: 10, premiumScore: 100, globalScore: 95, eliteScore: 100 },
  ];

  const supplierComparison = [
    { 
      category: 'Overall Score', 
      premium: 94, 
      global: 87, 
      elite: 92 
    },
    { 
      category: 'Price', 
      premium: 85, 
      global: 95, 
      elite: 75 
    },
    { 
      category: 'Quality', 
      premium: 95, 
      global: 88, 
      elite: 98 
    },
    { 
      category: 'Delivery', 
      premium: 90, 
      global: 75, 
      elite: 95 
    },
    { 
      category: 'Reliability', 
      premium: 92, 
      global: 85, 
      elite: 96 
    },
    { 
      category: 'Compliance', 
      premium: 100, 
      global: 95, 
      elite: 100 
    },
  ];

  const costAnalysis = [
    { 
      supplier: 'Premium Textiles', 
      material: 225000, 
      shipping: 12500, 
      duties: 8750, 
      total: 246250 
    },
    { 
      supplier: 'Global Fabrics', 
      material: 210000, 
      shipping: 15000, 
      duties: 8200, 
      total: 233200 
    },
    { 
      supplier: 'Elite Materials', 
      material: 242500, 
      shipping: 10000, 
      duties: 9450, 
      total: 261950 
    },
  ];

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
            className={fabricRightDrawerClass('max-w-[1000px]')}
          >
            {/* Header */}
            <div className="relative px-8 py-6 border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5 flex-shrink-0">
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl text-white">{rfq.rfqId}</h2>
                        <Badge className={
                          rfq.status === 'Open'
                            ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20' 
                            : rfq.status === 'Evaluating'
                            ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                            : rfq.status === 'Awarded'
                            ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                            : rfq.status === 'Closed'
                            ? 'bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20'
                            : 'bg-white/10 text-white border border-white/20'
                        }>
                          {rfq.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6F83A7]">
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          {rfq.material || 'Organic Cotton Fabric'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {rfq.suppliersInvited || 5} Suppliers
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Sent: {rfq.sentDate || '2024-10-25'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Quantity</div>
                      <div className="text-lg text-white">50K yds</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Quotes Received</div>
                      <div className="text-lg text-[#57ACAF]">3 of 5</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Best Price</div>
                      <div className="text-lg text-white">$4.20/yd</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
                      <div className="text-xs text-[#EAB308] mb-1">Days to Deadline</div>
                      <div className="text-lg text-white">2</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-start gap-2 ml-6">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white border-none hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                    onClick={() => toast.success('Award decision saved')}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Award RFQ
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

            {/* Sleek Tabs Navigation */}
            <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center px-8 gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'quotes', label: 'Supplier Quotes', icon: FileText },
                  { id: 'evaluation', label: 'Evaluation', icon: Target },
                  { id: 'communication', label: 'Communication', icon: MessageSquare },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative px-5 py-3.5 text-sm transition-all duration-300 flex items-center gap-2
                        ${activeTab === tab.id 
                          ? 'text-[#57ACAF]' 
                          : 'text-[#6F83A7] hover:text-white'
                        }
                      `}
                    >
                      {/* Tab Icon & Label */}
                      <Icon className="w-4 h-4" />
                      <span className="relative z-10">{tab.label}</span>

                      {/* Active Indicator */}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeSupplierRFQTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"
                          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-8 py-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                        {/* AI Strategic Overview */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-[#EAB308]" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white mb-2">AI Procurement Intelligence</h4>
                                <p className="text-sm text-[#6F83A7] leading-relaxed mb-3">
                                  Received <span className="text-[#57ACAF]">3 competitive quotes</span> from 5 invited suppliers. 
                                  <span className="text-[#EAB308]"> Premium Textiles Ltd</span> offers the best overall value (94/100 score) 
                                  with balanced pricing, quality, and delivery. Price range: $4.20-$4.85/yard. 
                                  Recommend <span className="text-[#57ACAF]">awarding to Premium Textiles</span> for optimal TCO.
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-[#6F83A7] mb-1">Recommended Supplier</div>
                                    <div className="text-sm text-white">Premium Textiles</div>
                                  </div>
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-[#6F83A7] mb-1">Est. Savings</div>
                                    <div className="text-sm text-[#57ACAF]">$15.7K vs Budget</div>
                                  </div>
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-[#6F83A7] mb-1">Confidence</div>
                                    <div className="text-sm text-[#57ACAF]">High (94%)</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Provide comprehensive procurement analysis for Material RFQ ${rfq.rfqId}. Material: Organic Cotton Fabric, 50,000 yards. Suppliers invited: 5, Quotes received: 3 (Premium Textiles $4.50, Global Fabrics $4.20, Elite Materials $4.85). Best overall score: Premium Textiles (94/100). Provide: 1) Detailed supplier comparison across all criteria (price, quality, delivery, reliability, compliance), 2) Total cost of ownership analysis including hidden costs, 3) Risk assessment for each supplier option, 4) Award recommendation with justification, 5) Negotiation strategies for final pricing, 6) Alternative sourcing options if quotes are unsatisfactory, 7) Long-term supplier relationship strategy, 8) Market intelligence on material pricing trends.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                        </div>

                        {/* RFQ Timeline & Material Specs */}
                        <div className="grid grid-cols-2 gap-6">
                          {/* RFQ Timeline */}
                          <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                            <div className="flex items-start justify-between mb-5">
                              <div>
                                <h3 className="text-white mb-1 flex items-center gap-2">
                                  <History className="w-5 h-5 text-[#57ACAF]" />
                                  RFQ Process Timeline
                                </h3>
                                <p className="text-sm text-[#6F83A7]">Supplier quotation workflow</p>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Analyze RFQ procurement timeline for ${rfq.rfqId}. Current stage: Quotes Received. Stages completed: 2 of 6. Created/sent: ${rfq.sentDate}. Deadline: 2 days remaining. Quotes received: 3 of 5 invited suppliers (60% response rate). Provide: 1) Timeline efficiency and on-track assessment, 2) Response rate analysis and follow-up recommendations, 3) Risk assessment for deadline compliance, 4) Accelerated evaluation strategies if needed, 5) Supplier engagement tactics for non-responders.`}
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

                          {/* Material Specifications */}
                          <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                            <div className="flex items-start justify-between mb-5">
                              <div>
                                <h3 className="text-white mb-1 flex items-center gap-2">
                                  <Layers className="w-5 h-5 text-[#57ACAF]" />
                                  Material Specifications
                                </h3>
                                <p className="text-sm text-[#6F83A7]">Required specifications & compliance</p>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Analyze material specification compliance for RFQ ${rfq.rfqId}. Material: Organic Cotton Fabric - 100% Organic, Grade A+, 200 GSM. Required certifications: GOTS, OEKO-TEX Standard 100, ISO 9001. Testing requirements: Shrinkage ≤3%, Color fastness Grade 4+. Quantity: 50,000 yards. Provide: 1) Specification clarity and completeness assessment, 2) Supplier compliance verification recommendations, 3) Testing and quality assurance protocols, 4) Risk areas and mitigation strategies, 5) Alternative specification options if needed.`}
                                onAskMarbim={handleAskMarbim}
                                size="sm"
                              />
                            </div>
                            <div className="space-y-3">
                              {specifications.slice(0, 6).map((spec, index) => {
                                const Icon = spec.icon;
                                return (
                                  <div key={index} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-180 border border-white/10">
                                    <div className="flex items-start gap-3">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        spec.status === 'verified' 
                                          ? 'bg-[#57ACAF]/10' 
                                          : 'bg-[#EAB308]/10'
                                      }`}>
                                        <Icon className={`w-4 h-4 ${
                                          spec.status === 'verified' ? 'text-[#57ACAF]' : 'text-[#EAB308]'
                                        }`} />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                          <div className="text-sm text-white">{spec.category}</div>
                                          <Badge className={
                                            spec.status === 'verified'
                                              ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs'
                                              : 'bg-[#EAB308]/10 text-[#EAB308] border-none text-xs'
                                          }>
                                            {spec.compliance}
                                          </Badge>
                                        </div>
                                        <div className="text-xs text-[#6F83A7]">{spec.requirement}</div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Quote Summary Cards */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h3 className="text-white mb-1 flex items-center gap-2">
                                <FileCheck className="w-5 h-5 text-[#57ACAF]" />
                                Supplier Quote Summary
                              </h3>
                              <p className="text-sm text-[#6F83A7]">3 quotes received from 5 invited suppliers</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Analyze supplier quote summary for Material RFQ ${rfq.rfqId}. Quotes received: 3 of 5 invited (60% response rate). Price range: $4.20-$4.85/yard (15% spread). Best value: Premium Textiles (94/100 overall score). Lowest price: Global Fabrics ($4.20/yard, 87/100 score). Premium quality: Elite Materials (98/100 quality, $4.85/yard). Provide: 1) Response rate analysis and implications, 2) Price competitiveness assessment vs market benchmarks, 3) Quality-price trade-off analysis, 4) Recommended supplier with detailed justification, 5) Negotiation leverage and tactics, 6) Risk mitigation for non-responsive suppliers.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            {quotedSuppliers.map((supplier, index) => (
                              <div 
                                key={index}
                                className={`p-5 rounded-xl border transition-all duration-180 ${
                                  supplier.highlight
                                    ? 'bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border-[#EAB308]/30 ring-2 ring-[#EAB308]/20'
                                    : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-white/20'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="text-sm text-white">{supplier.supplier}</div>
                                  {supplier.highlight && (
                                    <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-none text-xs">
                                      <Award className="w-3 h-3 mr-1" />
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <div className="text-xs text-[#6F83A7] mb-1">Unit Price</div>
                                    <div className="text-2xl text-white">${supplier.price}</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="p-2 rounded-lg bg-white/5">
                                      <div className="text-xs text-[#6F83A7] mb-0.5">Lead Time</div>
                                      <div className="text-sm text-white">{supplier.leadTime}d</div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-white/5">
                                      <div className="text-xs text-[#6F83A7] mb-0.5">Score</div>
                                      <div className="text-sm text-[#57ACAF]">{supplier.totalScore}/100</div>
                                    </div>
                                  </div>
                                  <Badge className={
                                    supplier.status === 'Best Value'
                                      ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-none w-full justify-center'
                                      : supplier.status === 'Lowest Price'
                                      ? 'bg-[#EAB308]/10 text-[#EAB308] border-none w-full justify-center'
                                      : 'bg-[#6F83A7]/10 text-[#6F83A7] border-none w-full justify-center'
                                  }>
                                    {supplier.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                  </div>
                )}

                {/* Supplier Quotes Tab */}
                {activeTab === 'quotes' && (
                  <div className="space-y-6">
                        {/* Detailed Quote Comparison */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h3 className="text-white mb-1">Detailed Quote Comparison</h3>
                              <p className="text-sm text-[#6F83A7]">Side-by-side analysis of all submitted quotes</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Provide detailed quote comparison analysis for Material RFQ ${rfq.rfqId}. Suppliers: Premium Textiles ($4.50, 94/100), Global Fabrics ($4.20, 87/100), Elite Materials ($4.85, 92/100). Evaluation across: price, quality (88-98), delivery (75-95), reliability (85-96), compliance (95-100). Provide: 1) Comprehensive line-by-line comparison, 2) Total cost of ownership calculation for each, 3) Hidden costs and risk factors, 4) Quality-price trade-off analysis, 5) Optimal supplier recommendation with scenario analysis, 6) Negotiation opportunities with each supplier.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>

                          {/* Comparison Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-white/10">
                                  <th className="text-left py-3 px-4 text-sm text-[#6F83A7]">Criteria</th>
                                  {quotedSuppliers.map((supplier, idx) => (
                                    <th key={idx} className={`text-center py-3 px-4 text-sm ${supplier.highlight ? 'text-[#EAB308]' : 'text-white'}`}>
                                      {supplier.supplier.split(' ')[0]}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-white/10">
                                  <td className="py-3 px-4 text-sm text-white">Unit Price (per yard)</td>
                                  {quotedSuppliers.map((supplier, idx) => (
                                    <td key={idx} className="text-center py-3 px-4 text-sm text-white">${supplier.price}</td>
                                  ))}
                                </tr>
                                <tr className="border-b border-white/10">
                                  <td className="py-3 px-4 text-sm text-white">Lead Time (days)</td>
                                  {quotedSuppliers.map((supplier, idx) => (
                                    <td key={idx} className="text-center py-3 px-4 text-sm text-white">{supplier.leadTime}</td>
                                  ))}
                                </tr>
                                <tr className="border-b border-white/10">
                                  <td className="py-3 px-4 text-sm text-white">Quality Score</td>
                                  {quotedSuppliers.map((supplier, idx) => (
                                    <td key={idx} className="text-center py-3 px-4 text-sm text-[#57ACAF]">{supplier.quality}/100</td>
                                  ))}
                                </tr>
                                <tr className="border-b border-white/10">
                                  <td className="py-3 px-4 text-sm text-white">Reliability Score</td>
                                  {quotedSuppliers.map((supplier, idx) => (
                                    <td key={idx} className="text-center py-3 px-4 text-sm text-[#57ACAF]">{supplier.reliability}/100</td>
                                  ))}
                                </tr>
                                <tr className="border-b border-white/10">
                                  <td className="py-3 px-4 text-sm text-white">Cert. Compliance</td>
                                  {quotedSuppliers.map((supplier, idx) => (
                                    <td key={idx} className="text-center py-3 px-4 text-sm text-[#57ACAF]">{supplier.certCompliance}%</td>
                                  ))}
                                </tr>
                                <tr className="bg-white/5">
                                  <td className="py-3 px-4 text-sm text-white">Overall Score</td>
                                  {quotedSuppliers.map((supplier, idx) => (
                                    <td key={idx} className={`text-center py-3 px-4 text-lg ${supplier.highlight ? 'text-[#EAB308]' : 'text-white'}`}>
                                      {supplier.totalScore}/100
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Cost Breakdown Analysis */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                            <div className="flex items-start justify-between mb-5">
                              <div>
                                <h3 className="text-white mb-1 flex items-center gap-2">
                                  <DollarSign className="w-5 h-5 text-[#57ACAF]" />
                                  Total Cost Analysis
                                </h3>
                                <p className="text-sm text-[#6F83A7]">TCO including all costs</p>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Analyze total cost of ownership for Material RFQ ${rfq.rfqId} quotes. Premium Textiles: $246K total ($225K material + $12.5K shipping + $8.75K duties), Global Fabrics: $233K total ($210K material + $15K shipping + $8.2K duties), Elite Materials: $262K total ($242.5K material + $10K shipping + $9.45K duties). Provide: 1) Detailed TCO breakdown and comparison, 2) Hidden cost identification, 3) Payment terms impact analysis, 4) Currency risk assessment, 5) Long-term cost projection, 6) Cost-benefit optimization recommendations.`}
                                onAskMarbim={handleAskMarbim}
                                size="sm"
                              />
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                              <BarChart data={costAnalysis}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis 
                                  dataKey="supplier" 
                                  stroke="#6F83A7" 
                                  tick={{ fill: '#6F83A7', fontSize: 11 }}
                                  tickFormatter={(value) => value.split(' ')[0]}
                                />
                                <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                                <RechartsTooltip
                                  contentStyle={{
                                    backgroundColor: '#0D1117',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                  }}
                                  formatter={(value: any) => `$${(value / 1000).toFixed(1)}K`}
                                />
                                <Bar dataKey="material" stackId="a" fill="#57ACAF" />
                                <Bar dataKey="shipping" stackId="a" fill="#EAB308" />
                                <Bar dataKey="duties" stackId="a" fill="#6F83A7" />
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="mt-4 grid grid-cols-3 gap-2">
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded bg-[#57ACAF]" />
                                <span className="text-[#6F83A7]">Material</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded bg-[#EAB308]" />
                                <span className="text-[#6F83A7]">Shipping</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded bg-[#6F83A7]" />
                                <span className="text-[#6F83A7]">Duties</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                            <div className="flex items-start justify-between mb-5">
                              <div>
                                <h3 className="text-white mb-1 flex items-center gap-2">
                                  <Target className="w-5 h-5 text-[#57ACAF]" />
                                  Supplier Performance Radar
                                </h3>
                                <p className="text-sm text-[#6F83A7]">Multi-dimensional comparison</p>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Analyze multi-dimensional supplier performance for Material RFQ ${rfq.rfqId}. Dimensions: Price (Premium: 85, Global: 95, Elite: 75), Quality (Premium: 95, Global: 88, Elite: 98), Delivery (Premium: 90, Global: 75, Elite: 95), Reliability (Premium: 92, Global: 85, Elite: 96), Compliance (Premium: 100, Global: 95, Elite: 100). Provide: 1) Strengths and weaknesses analysis for each supplier, 2) Best-fit scenario analysis by priority, 3) Balanced scorecard recommendations, 4) Strategic sourcing strategy, 5) Risk-adjusted supplier selection.`}
                                onAskMarbim={handleAskMarbim}
                                size="sm"
                              />
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                              <RadarChart data={supplierComparison.slice(1)}>
                                <PolarGrid stroke="#ffffff20" />
                                <PolarAngleAxis dataKey="category" stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 11 }} />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 10 }} />
                                <Radar name="Premium" dataKey="premium" stroke="#EAB308" fill="#EAB308" fillOpacity={0.3} />
                                <Radar name="Global" dataKey="global" stroke="#57ACAF" fill="#57ACAF" fillOpacity={0.2} />
                                <Radar name="Elite" dataKey="elite" stroke="#6F83A7" fill="#6F83A7" fillOpacity={0.2} />
                                <RechartsTooltip
                                  contentStyle={{
                                    backgroundColor: '#0D1117',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                  }}
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                            <div className="mt-4 grid grid-cols-3 gap-2">
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded bg-[#EAB308]" />
                                <span className="text-[#6F83A7]">Premium</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded bg-[#57ACAF]" />
                                <span className="text-[#6F83A7]">Global</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded bg-[#6F83A7]" />
                                <span className="text-[#6F83A7]">Elite</span>
                              </div>
                            </div>
                          </div>
                        </div>
                  </div>
                )}

                {/* Evaluation Tab */}
                {activeTab === 'evaluation' && (
                  <div className="space-y-6">
                        {/* AI Evaluation Recommendation */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-[#EAB308]" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white mb-2">AI Award Recommendation</h4>
                                <p className="text-sm text-[#6F83A7] leading-relaxed mb-3">
                                  Based on weighted scoring across 5 evaluation criteria, <span className="text-[#EAB308]">Premium Textiles Ltd</span> is the optimal choice 
                                  with a composite score of <span className="text-[#57ACAF]">94/100</span>. They excel in quality-price balance, delivery reliability, 
                                  and full compliance. Estimated savings: <span className="text-[#57ACAF]">$15.7K vs budget</span>.
                                </p>
                                <div className="grid grid-cols-4 gap-3">
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-[#6F83A7] mb-1">Overall Score</div>
                                    <div className="text-lg text-[#EAB308]">94/100</div>
                                  </div>
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-[#6F83A7] mb-1">Cost Savings</div>
                                    <div className="text-lg text-[#57ACAF]">$15.7K</div>
                                  </div>
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-[#6F83A7] mb-1">Risk Level</div>
                                    <div className="text-lg text-white">Low</div>
                                  </div>
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-[#6F83A7] mb-1">Confidence</div>
                                    <div className="text-lg text-[#57ACAF]">High</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Provide comprehensive award recommendation for Material RFQ ${rfq.rfqId}. Recommended supplier: Premium Textiles Ltd (94/100 overall score). Evaluation criteria: Price (30% weight, 85/100), Quality (25% weight, 95/100), Delivery (20% weight, 90/100), Reliability (15% weight, 92/100), Compliance (10% weight, 100/100). Alternatives: Global Fabrics (87/100, lowest price), Elite Materials (92/100, premium quality). Provide: 1) Detailed award justification with evidence, 2) Risk assessment and mitigation strategies, 3) Contract negotiation recommendations, 4) Performance KPIs and monitoring plan, 5) Contingency planning for supply disruptions, 6) Long-term strategic relationship roadmap, 7) Executive summary for approval.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                        </div>

                        {/* Weighted Evaluation Criteria */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h3 className="text-white mb-1">Weighted Evaluation Scorecard</h3>
                              <p className="text-sm text-[#6F83A7]">Supplier performance across key criteria</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Analyze weighted evaluation scorecard for Material RFQ ${rfq.rfqId}. Criteria weights: Price (30%), Quality (25%), Lead Time (20%), Reliability (15%), Compliance (10%). Scores: Premium (85, 95, 90, 92, 100), Global (95, 88, 75, 85, 95), Elite (75, 98, 95, 96, 100). Provide: 1) Scoring methodology validation, 2) Weight appropriateness for this procurement, 3) Alternative weight scenarios and outcomes, 4) Bias identification and correction, 5) Sensitivity analysis on weighting changes.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                          <div className="space-y-4">
                            {evaluationCriteria.map((criteria, index) => (
                              <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <div className="text-sm text-white mb-1">{criteria.criterion}</div>
                                    <div className="text-xs text-[#6F83A7]">Weight: {criteria.weight}%</div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5">
                                    <div className="text-xs text-[#6F83A7] mb-1">Premium Textiles</div>
                                    <div className="flex items-center gap-2">
                                      <Progress value={criteria.premiumScore} className="h-2 flex-1" />
                                      <div className="text-sm text-white w-10 text-right">{criteria.premiumScore}</div>
                                    </div>
                                  </div>
                                  <div className="p-2 rounded-lg bg-white/5">
                                    <div className="text-xs text-[#6F83A7] mb-1">Global Fabrics</div>
                                    <div className="flex items-center gap-2">
                                      <Progress value={criteria.globalScore} className="h-2 flex-1" />
                                      <div className="text-sm text-white w-10 text-right">{criteria.globalScore}</div>
                                    </div>
                                  </div>
                                  <div className="p-2 rounded-lg bg-white/5">
                                    <div className="text-xs text-[#6F83A7] mb-1">Elite Materials</div>
                                    <div className="flex items-center gap-2">
                                      <Progress value={criteria.eliteScore} className="h-2 flex-1" />
                                      <div className="text-sm text-white w-10 text-right">{criteria.eliteScore}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Decision Matrix */}
                        <div className="grid grid-cols-3 gap-4">
                          {quotedSuppliers.map((supplier, index) => (
                            <div 
                              key={index}
                              className={`p-6 rounded-xl border ${
                                supplier.highlight
                                  ? 'bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border-[#57ACAF]/30 ring-2 ring-[#57ACAF]/20'
                                  : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-white">{supplier.supplier.split(' ')[0]} {supplier.supplier.split(' ')[1]}</div>
                                {supplier.highlight && (
                                  <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-none text-xs">
                                    <Award className="w-3 h-3 mr-1" />
                                    Award
                                  </Badge>
                                )}
                              </div>
                              <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-white/5">
                                  <div className="text-xs text-[#6F83A7] mb-1">Overall Score</div>
                                  <div className="text-3xl text-white">{supplier.totalScore}</div>
                                  <div className="text-xs text-[#6F83A7]">/100</div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#6F83A7]">Price</span>
                                    <span className="text-white">${supplier.price}/yd</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#6F83A7]">Quality</span>
                                    <span className="text-[#57ACAF]">{supplier.quality}/100</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#6F83A7]">Lead Time</span>
                                    <span className="text-white">{supplier.leadTime} days</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#6F83A7]">Reliability</span>
                                    <span className="text-[#57ACAF]">{supplier.reliability}/100</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#6F83A7]">Compliance</span>
                                    <span className="text-[#57ACAF]">{supplier.certCompliance}%</span>
                                  </div>
                                </div>
                                {supplier.highlight && (
                                  <Button 
                                    size="sm" 
                                    className="w-full bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white"
                                    onClick={() => toast.success(`Awarded to ${supplier.supplier}`)}
                                  >
                                    <Award className="w-3 h-3 mr-2" />
                                    Award Contract
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                  </div>
                )}

                {/* Communication Tab */}
                {activeTab === 'communication' && (
                  <div className="space-y-6">
                        {/* Communication History */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h3 className="text-white mb-1 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-[#57ACAF]" />
                                Supplier Communication Log
                              </h3>
                              <p className="text-sm text-[#6F83A7]">All correspondence related to this RFQ</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Analyze supplier communication history for Material RFQ ${rfq.rfqId}. Communications: 3 total (1 from Premium Textiles - positive/high priority, 1 outbound RFQ broadcast, 1 from Global Fabrics - positive acknowledgment). Response rate: 60% (3 of 5). Provide: 1) Communication effectiveness assessment, 2) Supplier engagement analysis, 3) Response quality and sentiment trends, 4) Follow-up recommendations for non-responders, 5) Relationship health indicators, 6) Best practices for future RFQs.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                          <div className="space-y-4">
                            {communications.map((comm) => (
                              <div 
                                key={comm.id} 
                                className={`p-5 rounded-xl border transition-all duration-180 hover:bg-white/10 ${
                                  comm.priority === 'high' 
                                    ? 'bg-[#EAB308]/5 border-[#EAB308]/20' 
                                    : 'bg-white/5 border-white/10'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-start gap-3 flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                                      comm.type === 'reply' ? 'bg-[#57ACAF]/10 text-[#57ACAF]' : 'bg-[#6F83A7]/10 text-[#6F83A7]'
                                    }`}>
                                      {comm.sender.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <div className="text-sm text-white">{comm.sender}</div>
                                        <Badge className={
                                          comm.sentiment === 'positive' 
                                            ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs'
                                            : 'bg-[#6F83A7]/10 text-[#6F83A7] border-none text-xs'
                                        }>
                                          {comm.sentiment}
                                        </Badge>
                                        {comm.priority === 'high' && (
                                          <Badge className="bg-[#EAB308]/10 text-[#EAB308] border-none text-xs">
                                            High Priority
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-sm text-[#6F83A7] mb-2">{comm.message}</div>
                                      <div className="flex items-center gap-4 text-xs text-[#6F83A7]">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {comm.timestamp}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <MessageSquare className="w-3 h-3" />
                                          {comm.type}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Reply Section */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-white mb-1">Send Message to Suppliers</h4>
                              <p className="text-sm text-[#6F83A7]">Communicate with one or all suppliers</p>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Draft professional supplier communication for Material RFQ ${rfq.rfqId}. Context: 3 quotes received from 5 invited suppliers, 2 non-responsive. Possible messages: 1) Follow-up to non-responsive suppliers (reminder of deadline), 2) Clarification request to quoted suppliers, 3) Award notification to selected supplier, 4) Regret notification to unselected suppliers. Provide message templates for each scenario with appropriate tone and content.`}
                              onAskMarbim={handleAskMarbim}
                              size="sm"
                            />
                          </div>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Type your message to suppliers..."
                              className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] resize-none"
                            />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  multiple
                                  accept="*/*"
                                  className="hidden"
                                  onChange={handleFileSelect}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                                  onClick={handleAttachClick}
                                >
                                  <Paperclip className="w-4 h-4 mr-2" />
                                  Attach Files
                                </Button>
                                {attachedFiles.length > 0 && (
                                  <div className="text-xs text-[#6F83A7]">
                                    {attachedFiles.length} file(s) attached
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                                >
                                  Save Draft
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white"
                                  onClick={() => toast.success('Message sent to suppliers')}
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Send Message
                                </Button>
                              </div>
                            </div>

                            {/* Attached Files Display */}
                            {attachedFiles.length > 0 && (
                              <div className="space-y-2">
                                {attachedFiles.map((file, index) => (
                                  <div 
                                    key={index} 
                                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-180"
                                  >
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
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white hover:bg-white/5"
                                      onClick={() => handleRemoveFile(index)}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="*/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </>
      )}
    </AnimatePresence>
  );
}
