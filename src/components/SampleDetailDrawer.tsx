import { motion, AnimatePresence } from 'motion/react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { useState } from 'react';
import { 
  X, Edit2, Send, Copy, Download, BarChart3, 
  FileText, Clock, Calendar, DollarSign, CheckCircle,
  Target, AlertCircle, Eye, MessageSquare, Package,
  Sparkles, Settings, Trash2, User, Building2, Mail,
  Phone, Globe, MapPin, TrendingUp, Award, Layers,
  Shield, AlertTriangle, Plus, Factory, Beaker, Flask,
  Star, Activity, Archive, ExternalLink, Truck, Box,
  ClipboardCheck, Image as ImageIcon, ThumbsUp, ThumbsDown,
  PlayCircle, PauseCircle, XCircle, RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { MarbimAIButton } from './MarbimAIButton';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { CommunicationLogger } from './CommunicationLogger';

interface SampleDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sample: any;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
}

export function SampleDetailDrawer({ 
  isOpen, 
  onClose, 
  sample,
  onAskMarbim,
  onOpenAI
}: SampleDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Handler to send prompt to AI and close this drawer
  const handleAskMarbim = (prompt: string) => {
    if (onAskMarbim) {
      onAskMarbim(prompt);
    }
    if (onOpenAI) {
      onOpenAI();
    }
  };

  if (!sample) return null;

  // Calculate days elapsed
  const calculateDaysElapsed = (requestDate: string) => {
    const request = new Date(requestDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - request.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysElapsed = calculateDaysElapsed(sample.requestDate || '2024-10-01');

  // Mock data for sample details
  const qualityTestResults = [
    { test: 'GSM Weight', standard: '200 ±5', actual: '198', result: 'Pass', score: 95 },
    { test: 'Color Fastness', standard: 'Grade 4 min', actual: 'Grade 4-5', result: 'Pass', score: 100 },
    { test: 'Tensile Strength', standard: '≥180 N', actual: '192 N', result: 'Pass', score: 100 },
    { test: 'Shrinkage', standard: '≤3%', actual: '2.1%', result: 'Pass', score: 98 },
    { test: 'Pilling Resistance', standard: 'Grade 4', actual: 'Grade 3-4', result: 'Borderline', score: 85 },
    { test: 'Dimensional Stability', standard: '±2%', actual: '1.5%', result: 'Pass', score: 100 },
  ];

  const qualityMetricsData = [
    { category: 'Physical', score: 95 },
    { category: 'Chemical', score: 92 },
    { category: 'Color', score: 98 },
    { category: 'Durability', score: 88 },
    { category: 'Safety', score: 100 },
    { category: 'Compliance', score: 96 },
  ];

  const timelineData = [
    { stage: 'Request Sent', date: sample.requestDate || '2024-10-01', status: 'completed', duration: '0d', icon: Send },
    { stage: 'Sample Prepared', date: '2024-10-03', status: 'completed', duration: '2d', icon: Factory },
    { stage: 'In Transit', date: '2024-10-05', status: sample.status === 'In Transit' ? 'current' : 'completed', duration: '2d', icon: Truck },
    { stage: 'Received', date: sample.status === 'Received' || sample.status === 'Evaluated' ? '2024-10-08' : 'Pending', status: sample.status === 'Received' || sample.status === 'Evaluated' ? 'completed' : 'pending', duration: '3d', icon: Package },
    { stage: 'Quality Testing', date: sample.status === 'Evaluated' ? '2024-10-10' : 'Pending', status: sample.status === 'Evaluated' ? 'completed' : 'pending', duration: '2d', icon: Beaker },
    { stage: 'Evaluation Complete', date: sample.status === 'Evaluated' ? '2024-10-12' : 'Pending', status: sample.status === 'Evaluated' ? 'completed' : 'pending', duration: '2d', icon: CheckCircle },
  ];

  const materialSpecs = [
    { property: 'Material Type', value: sample.material || 'Cotton Fabric', icon: Package },
    { property: 'Weight (GSM)', value: '200', icon: BarChart3 },
    { property: 'Width', value: '58 inches', icon: Target },
    { property: 'Color', value: 'Navy Blue', icon: Eye },
    { property: 'Composition', value: '100% Cotton', icon: Layers },
    { property: 'Finish', value: 'Pre-washed', icon: Sparkles },
  ];

  const complianceChecks = [
    { standard: 'OEKO-TEX Standard 100', status: 'Certified', color: '#57ACAF' },
    { standard: 'REACH Compliance', status: 'Passed', color: '#57ACAF' },
    { standard: 'Azo-Free Dyes', status: 'Verified', color: '#57ACAF' },
    { standard: 'Lead Content Test', status: 'Passed', color: '#57ACAF' },
  ];

  const communications = [
    {
      timestamp: '2 hours ago',
      sender: `${sample.supplier || 'Supplier'} - Quality Team`,
      message: 'Test reports have been uploaded to the system. All parameters are within acceptable range.',
      type: 'message',
      sentiment: 'positive'
    },
    {
      timestamp: '1 day ago',
      sender: 'You - Procurement Team',
      message: 'Sample received. Initiating quality testing process. Expected completion in 2-3 days.',
      type: 'message',
      sentiment: 'neutral'
    },
    {
      timestamp: '3 days ago',
      sender: `${sample.supplier || 'Supplier'} - Logistics`,
      message: 'Sample dispatched via DHL Express. Tracking number: DHL1234567890.',
      type: 'message',
      sentiment: 'positive'
    },
  ];

  const documents = [
    { name: 'Test_Report_Physical.pdf', type: 'Test Report', uploadDate: '2024-10-12', size: '2.4 MB', status: 'Verified' },
    { name: 'Test_Report_Chemical.pdf', type: 'Test Report', uploadDate: '2024-10-12', size: '1.8 MB', status: 'Verified' },
    { name: 'Material_Specification.pdf', type: 'Specification', uploadDate: '2024-10-01', size: '856 KB', status: 'Active' },
    { name: 'Sample_Photos.zip', type: 'Images', uploadDate: '2024-10-08', size: '15.2 MB', status: 'Available' },
    { name: 'OEKO_TEX_Certificate.pdf', type: 'Certification', uploadDate: '2024-10-01', size: '1.2 MB', status: 'Valid' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Requested': return '#EAB308';
      case 'In Transit': return '#57ACAF';
      case 'Received': return '#6F83A7';
      case 'Evaluated': return '#57ACAF';
      default: return '#6F83A7';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Requested': return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'In Transit': return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      case 'Received': return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
      case 'Evaluated': return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      default: return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Medium': return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'Low': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
    }
  };

  const getTimelineStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#57ACAF';
      case 'current': return '#EAB308';
      case 'pending': return '#6F83A7';
      default: return '#6F83A7';
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'question': return AlertCircle;
      case 'message': return MessageSquare;
      default: return Mail;
    }
  };

  const getTestResultColor = (result: string) => {
    switch (result) {
      case 'Pass': return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      case 'Borderline': return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'Fail': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
    }
  };

  const overallQualityScore = Math.round(qualityTestResults.reduce((sum, test) => sum + test.score, 0) / qualityTestResults.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drawer - positioned below top bar */}
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
                      <Beaker className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl text-white">{sample.sampleId || 'Sample Request'}</h2>
                        <Badge className={getStatusBadge(sample.status)}>
                          {sample.status || 'Unknown'}
                        </Badge>
                        <Badge className={getPriorityColor(sample.priority)}>
                          {sample.priority || 'Medium'} Priority
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6F83A7]">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {sample.supplier || 'Unknown Supplier'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          {sample.material || 'Material'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Requested: {sample.requestDate || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Days Elapsed</div>
                      <div className="text-lg text-white">{daysElapsed}d</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Category</div>
                      <div className="text-lg text-white">{sample.category || 'Fabric'}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Est. Cost</div>
                      <div className="text-lg text-white">{sample.estimatedCost || '$125'}</div>
                    </div>
                    <div className={`px-3 py-2 rounded-lg ${sample.status === 'Evaluated' ? 'bg-[#57ACAF]/10 border-[#57ACAF]/20' : 'bg-[#EAB308]/10 border-[#EAB308]/20'}`}>
                      <div className={`text-xs ${sample.status === 'Evaluated' ? 'text-[#57ACAF]' : 'text-[#EAB308]'} mb-1`}>
                        {sample.status === 'Evaluated' ? 'Quality Score' : 'Status'}
                      </div>
                      <div className="text-lg text-white">
                        {sample.status === 'Evaluated' ? `${overallQualityScore}/100` : sample.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-start gap-2 ml-6">
                  {sample.status === 'Evaluated' && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white border-none hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                      onClick={() => toast.success('Sample approved for production')}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  )}
                  {sample.status === 'Received' && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black border-none hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 shadow-lg shadow-[#EAB308]/20"
                      onClick={() => toast.info('Starting quality testing')}
                    >
                      <Beaker className="w-4 h-4 mr-2" />
                      Start Testing
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    onClick={() => toast.info('Edit sample details')}
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
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'quality', label: 'Quality Assessment', icon: ClipboardCheck },
                  { id: 'timeline', label: 'Timeline', icon: Activity },
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
                          layoutId="activeSampleTab"
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
                    {/* Sample Information */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Sample Details</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Provide comprehensive analysis of sample ${sample.sampleId || 'request'} including quality expectations, supplier reliability, and potential issues.`)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Sample ID</div>
                              <div className="text-white">{sample.sampleId || 'Unknown'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <Building2 className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Supplier</div>
                              <div className="text-white">{sample.supplier || 'Unknown'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Material</div>
                              <div className="text-white">{sample.material || 'Unknown'}</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <Calendar className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Request Date</div>
                              <div className="text-white">{sample.requestDate || 'N/A'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <DollarSign className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Estimated Cost</div>
                              <div className="text-white">{sample.estimatedCost || '$125'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <Target className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Purpose</div>
                              <div className="text-white">Product Development</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Material Specifications */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Material Specifications</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Compare material specifications for ${sample.sampleId || 'this sample'} against industry standards and our quality requirements.`)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {materialSpecs.map((spec, index) => {
                          const Icon = spec.icon;
                          return (
                            <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                                  <Icon className="w-5 h-5 text-[#57ACAF]" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs text-[#6F83A7] mb-1">{spec.property}</div>
                                  <div className="text-white">{spec.value}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Visual Comparison */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <h3 className="text-white text-lg mb-4">Sample Images</h3>
                        <div className="space-y-3">
                          <div className="aspect-video rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-[#6F83A7]" />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="aspect-square rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all duration-180">
                                <ImageIcon className="w-6 h-6 text-[#6F83A7]" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white text-lg">Compliance Checks</h3>
                          <MarbimAIButton
                            onClick={() => handleAskMarbim(`Review compliance status for ${sample.sampleId || 'this sample'} and identify any potential compliance risks.`)}
                          />
                        </div>
                        <div className="space-y-3">
                          {complianceChecks.map((check, index) => (
                            <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-[#57ACAF]" />
                                  <span className="text-white text-sm">{check.standard}</span>
                                </div>
                                <Badge 
                                  className="text-xs"
                                  style={{
                                    backgroundColor: `${check.color}20`,
                                    color: check.color,
                                    borderColor: `${check.color}40`,
                                  }}
                                >
                                  {check.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Related Documents</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                          onClick={() => toast.info('Upload document dialog opened')}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {documents.map((doc, index) => (
                          <div key={index} className="group p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <FileText className="w-4 h-4 text-[#57ACAF]" />
                                <div className="flex-1">
                                  <div className="text-white text-sm">{doc.name}</div>
                                  <div className="flex items-center gap-2 text-xs text-[#6F83A7] mt-0.5">
                                    <span>{doc.type}</span>
                                    <span>•</span>
                                    <span>{doc.size}</span>
                                  </div>
                                </div>
                                <Badge className="text-xs bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
                                  {doc.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-180">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toast.info(`Viewing ${doc.name}`)}
                                  className="text-white/60 hover:text-white hover:bg-white/5 h-8 w-8 p-0"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toast.success(`Downloading ${doc.name}`)}
                                  className="text-white/60 hover:text-white hover:bg-white/5 h-8 w-8 p-0"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white mb-2">MARBIM AI Insights</h4>
                            <p className="text-sm text-[#6F83A7]">
                              Sample from {sample.supplier || 'supplier'} shows {sample.status === 'Evaluated' ? `strong quality performance with ${overallQualityScore}/100 score. Material specifications align with requirements.` : 'expected arrival in 2-3 days. Supplier has 95% on-time delivery rate for samples.'}
                            </p>
                          </div>
                        </div>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Generate comprehensive insights for sample ${sample.sampleId || 'request'} including quality predictions, supplier analysis, and recommendations.`)}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAskMarbim(`Compare ${sample.sampleId || 'this sample'} with similar samples from other suppliers.`)}
                          className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
                        >
                          <BarChart3 className="w-3 h-3 mr-2" />
                          Compare
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAskMarbim(`Predict quality and delivery outcomes for ${sample.sampleId || 'this sample'} based on supplier history.`)}
                          className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
                        >
                          <TrendingUp className="w-3 h-3 mr-2" />
                          Predict
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAskMarbim(`Recommend next steps for ${sample.sampleId || 'this sample'} based on current status and quality expectations.`)}
                          className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
                        >
                          <Target className="w-3 h-3 mr-2" />
                          Recommend
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quality Assessment Tab */}
                {activeTab === 'quality' && (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Quality Assessment Overview</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Analyze comprehensive quality test results for ${sample.sampleId || 'this sample'} and identify any concerns or areas of excellence.`)}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-5 rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20">
                          <div className="text-sm text-[#6F83A7] mb-2">Overall Score</div>
                          <div className="text-3xl text-white mb-2">{overallQualityScore}/100</div>
                          <Progress value={overallQualityScore} className="h-2" />
                        </div>
                        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-sm text-[#6F83A7] mb-2">Tests Passed</div>
                          <div className="text-3xl text-white mb-2">
                            {qualityTestResults.filter(t => t.result === 'Pass').length}/{qualityTestResults.length}
                          </div>
                          <div className="text-xs text-[#57ACAF]">
                            {Math.round((qualityTestResults.filter(t => t.result === 'Pass').length / qualityTestResults.length) * 100)}% pass rate
                          </div>
                        </div>
                        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-sm text-[#6F83A7] mb-2">Recommendation</div>
                          <div className="text-2xl text-white mb-2">
                            {overallQualityScore >= 95 ? 'Approve' : overallQualityScore >= 85 ? 'Review' : 'Reject'}
                          </div>
                          <div className="text-xs text-[#6F83A7]">Based on test results</div>
                        </div>
                      </div>

                      {/* Quality Radar Chart */}
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={qualityMetricsData}>
                          <PolarGrid stroke="#ffffff20" />
                          <PolarAngleAxis dataKey="category" stroke="#6F83A7" tick={{ fontSize: 12 }} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6F83A7" tick={{ fontSize: 10 }} />
                          <Radar name="Score" dataKey="score" stroke="#57ACAF" fill="#57ACAF" fillOpacity={0.3} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Detailed Test Results */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Test Results Detail</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Explain the significance of each quality test result for ${sample.sampleId || 'this sample'} and their impact on production suitability.`)}
                        />
                      </div>
                      <div className="space-y-3">
                        {qualityTestResults.map((test, index) => (
                          <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3 flex-1">
                                <ClipboardCheck className="w-5 h-5 text-[#57ACAF]" />
                                <div className="flex-1">
                                  <div className="text-white mb-1">{test.test}</div>
                                  <div className="text-xs text-[#6F83A7]">
                                    Standard: {test.standard} • Actual: {test.actual}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right mr-3">
                                  <div className="text-sm text-white">{test.score}/100</div>
                                  <Progress value={test.score} className="h-1.5 w-16" />
                                </div>
                                <Badge className={getTestResultColor(test.result)}>
                                  {test.result}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Quality Insights */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-2">Quality Analysis</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                              <span className="text-[#6F83A7]">Material meets physical property requirements with 95%+ compliance</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                              <span className="text-[#6F83A7]">Color fastness exceeds minimum standard (Grade 4-5 vs Grade 4)</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-[#EAB308] shrink-0 mt-0.5" />
                              <span className="text-[#6F83A7]">Pilling resistance is borderline - recommend supplier improvement before bulk order</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAskMarbim(`Generate detailed quality assessment report for ${sample.sampleId || 'this sample'} with recommendations for production approval.`)}
                        className="w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                      >
                        <Sparkles className="w-3 h-3 mr-2" />
                        Generate Quality Report
                      </Button>
                    </div>
                  </div>
                )}

                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                  <div className="space-y-6">
                    {/* Workflow Timeline */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Sample Request Workflow</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Analyze the timeline for ${sample.sampleId || 'this sample'} and identify any delays or efficiency improvements.`)}
                        />
                      </div>
                      <div className="space-y-4">
                        {timelineData.map((stage, index) => {
                          const Icon = stage.icon;
                          const isCompleted = stage.status === 'completed';
                          const isCurrent = stage.status === 'current';
                          const statusColor = getTimelineStatusColor(stage.status);
                          
                          return (
                            <div key={index} className="relative">
                              {/* Connector Line */}
                              {index < timelineData.length - 1 && (
                                <div 
                                  className="absolute left-5 top-12 w-0.5 h-12 -z-10"
                                  style={{
                                    background: isCompleted 
                                      ? '#57ACAF' 
                                      : 'linear-gradient(to bottom, #57ACAF 0%, #6F83A7 100%)'
                                  }}
                                />
                              )}
                              
                              <div className={`p-4 rounded-lg transition-all duration-180 ${
                                isCurrent 
                                  ? 'bg-[#EAB308]/10 border-[#EAB308]/30' 
                                  : 'bg-white/5 border-white/10'
                              } border`}>
                                <div className="flex items-center gap-4">
                                  <div 
                                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                    style={{
                                      backgroundColor: `${statusColor}20`,
                                    }}
                                  >
                                    <Icon className="w-5 h-5" style={{ color: statusColor }} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                      <span className="text-white">{stage.stage}</span>
                                      <Badge 
                                        className="text-xs"
                                        style={{
                                          backgroundColor: `${statusColor}20`,
                                          color: statusColor,
                                          borderColor: `${statusColor}40`,
                                        }}
                                      >
                                        {stage.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-[#6F83A7]">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {stage.date}
                                      </span>
                                      {stage.duration && (
                                        <>
                                          <span>•</span>
                                          <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {stage.duration}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  {isCompleted && (
                                    <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                                  )}
                                  {isCurrent && (
                                    <Activity className="w-5 h-5 text-[#EAB308] animate-pulse" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Timeline Analytics */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <h3 className="text-white text-lg mb-4">Duration Analysis</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-[#6F83A7]">Total Time Elapsed</span>
                              <span className="text-white">{daysElapsed} days</span>
                            </div>
                            <Progress value={(daysElapsed / 15) * 100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-[#6F83A7]">Expected Completion</span>
                              <span className="text-white">12-15 days</span>
                            </div>
                            <Progress value={80} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-[#6F83A7]">On-Time Performance</span>
                              <span className="text-[#57ACAF]">On Track</span>
                            </div>
                            <Progress value={95} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white text-lg">Key Milestones</h3>
                          <MarbimAIButton
                            onClick={() => handleAskMarbim(`Predict completion date and identify potential bottlenecks for ${sample.sampleId || 'this sample'}.`)}
                          />
                        </div>
                        <div className="space-y-3">
                          {[
                            { label: 'Request to Shipment', value: '4 days', status: 'completed' },
                            { label: 'Transit Time', value: '3 days', status: sample.status === 'In Transit' ? 'current' : 'completed' },
                            { label: 'Testing Duration', value: '2 days', status: sample.status === 'Evaluated' ? 'completed' : 'pending' },
                            { label: 'Total Lead Time', value: '9 days', status: 'estimated' },
                          ].map((milestone, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                              <span className="text-sm text-[#6F83A7]">{milestone.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-white">{milestone.value}</span>
                                {milestone.status === 'completed' && (
                                  <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                )}
                                {milestone.status === 'current' && (
                                  <Activity className="w-4 h-4 text-[#EAB308]" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Timeline Insights */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-2">Timeline Performance</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            Sample is progressing {daysElapsed <= 10 ? 'ahead of schedule' : 'on schedule'}. Supplier {sample.supplier || 'has'} historically delivers samples within 10-12 days. Expected quality testing completion in 2 business days.
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-xs text-[#6F83A7] mb-1">Avg Sample Time</div>
                              <div className="text-lg text-white">11 days</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-xs text-[#6F83A7] mb-1">Current Progress</div>
                              <div className="text-lg text-white">{Math.round((daysElapsed / 12) * 100)}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAskMarbim(`Optimize sample request process based on ${sample.sampleId || 'this'} timeline and identify efficiency improvements.`)}
                        className="w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                      >
                        <Sparkles className="w-3 h-3 mr-2" />
                        Optimize Process
                      </Button>
                    </div>
                  </div>
                )}

                {/* Communication Tab */}
                {activeTab === 'communication' && (
                  <div className="space-y-6">
                    {/* Communication History */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Communication History</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Analyze communication patterns for ${sample.sampleId || 'this sample'} and identify any concerns or delays.`)}
                        />
                      </div>
                      <div className="space-y-4">
                        {communications.map((comm, index) => {
                          const Icon = getMessageIcon(comm.type);
                          return (
                            <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-lg ${
                                  comm.sentiment === 'positive' ? 'bg-[#57ACAF]/10' :
                                  comm.sentiment === 'negative' ? 'bg-red-500/10' :
                                  'bg-[#6F83A7]/10'
                                } flex items-center justify-center shrink-0`}>
                                  <Icon className={`w-5 h-5 ${
                                    comm.sentiment === 'positive' ? 'text-[#57ACAF]' :
                                    comm.sentiment === 'negative' ? 'text-red-400' :
                                    'text-[#6F83A7]'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-white">{comm.sender}</span>
                                    <span className="text-xs text-[#6F83A7]">{comm.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-[#6F83A7]">{comm.message}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Communication Logger */}
                    <CommunicationLogger
                      entityType="sample"
                      entityId={sample.id || sample.sampleId || '0'}
                      entityName={sample.sampleId || 'Sample Request'}
                    />

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start h-auto p-4"
                        onClick={() => toast.info('Opening email composer')}
                      >
                        <Mail className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="text-sm">Send Email</div>
                          <div className="text-xs text-[#6F83A7]">Contact supplier</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start h-auto p-4"
                        onClick={() => toast.info('Requesting status update')}
                      >
                        <RefreshCw className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="text-sm">Request Update</div>
                          <div className="text-xs text-[#6F83A7]">Get latest status</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start h-auto p-4"
                        onClick={() => toast.info('Escalating issue')}
                      >
                        <AlertTriangle className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="text-sm">Escalate Issue</div>
                          <div className="text-xs text-[#6F83A7]">Report problem</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start h-auto p-4"
                        onClick={() => toast.info('Scheduling follow-up')}
                      >
                        <Calendar className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="text-sm">Schedule Follow-up</div>
                          <div className="text-xs text-[#6F83A7]">Set reminder</div>
                        </div>
                      </Button>
                    </div>

                    {/* AI Communication Insights */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-2">Communication Analytics</h4>
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-xs text-[#6F83A7] mb-1">Response Time</div>
                              <div className="text-lg text-white">3.2 hrs</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-xs text-[#6F83A7] mb-1">Messages</div>
                              <div className="text-lg text-white">12</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-xs text-[#6F83A7] mb-1">Sentiment</div>
                              <div className="text-lg text-white">Positive</div>
                            </div>
                          </div>
                          <p className="text-sm text-[#6F83A7]">
                            Communication is proactive and responsive. Supplier provides regular updates without prompting.
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAskMarbim(`Generate communication summary and action items for ${sample.sampleId || 'this sample'}.`)}
                        className="w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                      >
                        <Sparkles className="w-3 h-3 mr-2" />
                        Generate Summary
                      </Button>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
