import { motion, AnimatePresence } from 'motion/react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { useState } from 'react';
import { 
  X, Edit2, Send, Copy, Download, BarChart3, 
  FileText, Clock, Calendar, DollarSign, CheckCircle,
  Target, AlertCircle, Eye, MessageSquare, Package,
  Sparkles, Settings, Trash2, User, Building2, Mail,
  Phone, Globe, MapPin, TrendingUp, Award, Layers,
  Shield, AlertTriangle, Plus, Factory, Users, Truck,
  Star, Activity, Archive, ExternalLink
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

interface SupplierDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: any;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
}

export function SupplierDetailDrawer({ 
  isOpen, 
  onClose, 
  supplier,
  onAskMarbim,
  onOpenAI
}: SupplierDetailDrawerProps) {
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

  if (!supplier) return null;

  // Mock data for supplier details
  const deliveryPerformanceData = [
    { month: 'Jan', onTime: 92, late: 8 },
    { month: 'Feb', onTime: 88, late: 12 },
    { month: 'Mar', onTime: 95, late: 5 },
    { month: 'Apr', onTime: 90, late: 10 },
    { month: 'May', onTime: 94, late: 6 },
    { month: 'Jun', onTime: 96, late: 4 },
  ];

  const qualityMetricsData = [
    { category: 'Material', score: supplier.qualityScore || 85 },
    { category: 'Workmanship', score: 90 },
    { category: 'Packaging', score: 88 },
    { category: 'Documentation', score: 92 },
    { category: 'Communication', score: 87 },
    { category: 'Compliance', score: 95 },
  ];

  const orderVolumeData = [
    { month: 'Jan', volume: 45000, value: 225000 },
    { month: 'Feb', volume: 52000, value: 260000 },
    { month: 'Mar', volume: 48000, value: 240000 },
    { month: 'Apr', volume: 58000, value: 290000 },
    { month: 'May', volume: 55000, value: 275000 },
    { month: 'Jun', volume: 62000, value: 310000 },
  ];

  const certifications = [
    { name: 'ISO 9001:2015', issueDate: '2023-01-15', expiryDate: '2026-01-14', status: 'Valid', color: '#57ACAF' },
    { name: 'GOTS', issueDate: '2023-06-20', expiryDate: '2024-06-19', status: 'Valid', color: '#57ACAF' },
    { name: 'OEKO-TEX Standard 100', issueDate: '2023-03-10', expiryDate: '2025-03-09', status: 'Valid', color: '#57ACAF' },
    { name: 'BSCI Audit', issueDate: '2023-09-05', expiryDate: '2024-09-04', status: 'Expiring Soon', color: '#EAB308' },
  ];

  const recentOrders = [
    { id: 'PO-2024-1245', date: '2024-10-20', material: 'Cotton Fabric 200 GSM', quantity: '5,000 yards', value: '$25,000', status: 'Delivered', onTime: true },
    { id: 'PO-2024-1198', date: '2024-10-15', material: 'Polyester Blend', quantity: '3,500 yards', value: '$17,500', status: 'In Transit', onTime: true },
    { id: 'PO-2024-1156', date: '2024-10-08', material: 'Denim Fabric', quantity: '4,200 yards', value: '$29,400', status: 'Delivered', onTime: false },
    { id: 'PO-2024-1089', date: '2024-09-28', material: 'Jersey Knit', quantity: '6,000 yards', value: '$36,000', status: 'Delivered', onTime: true },
  ];

  const communications = [
    {
      timestamp: '2 hours ago',
      sender: `${supplier.supplierName || 'Supplier'} - Contact Person`,
      message: 'Thank you for your recent order. We have started production and will ship by next week.',
      type: 'message',
      sentiment: 'positive'
    },
    {
      timestamp: '1 day ago',
      sender: 'You - Procurement Team',
      message: 'Can you confirm the delivery date for PO-2024-1198? Our production schedule depends on it.',
      type: 'question',
      sentiment: 'neutral'
    },
    {
      timestamp: '3 days ago',
      sender: `${supplier.supplierName || 'Supplier'} - Sales Manager`,
      message: 'We have received your payment for the last order. Thank you for your continued partnership.',
      type: 'message',
      sentiment: 'positive'
    },
  ];

  const documents = [
    { name: 'GOTS_Certificate.pdf', type: 'Certification', uploadDate: '2024-06-15', size: '2.4 MB', status: 'Verified' },
    { name: 'Quality_Audit_Report_2024.pdf', type: 'Audit Report', uploadDate: '2024-08-20', size: '5.1 MB', status: 'Reviewed' },
    { name: 'WRAP_Certificate.pdf', type: 'Certification', uploadDate: '2024-03-10', size: '1.8 MB', status: 'Verified' },
    { name: 'Product_Catalog_2024.pdf', type: 'Catalog', uploadDate: '2024-09-01', size: '12.3 MB', status: 'Active' },
    { name: 'Factory_Inspection_Report.pdf', type: 'Compliance', uploadDate: '2024-07-15', size: '3.7 MB', status: 'Approved' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Valid': return '#57ACAF';
      case 'Expiring Soon': return '#EAB308';
      case 'Expired': return '#D0342C';
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

  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'Low': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Medium': return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'High': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
    }
  };

  const getComplianceColor = (status?: string) => {
    switch (status) {
      case 'Certified': return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      case 'Pending Renewal': return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      default: return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
    }
  };

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
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl text-white">{supplier.supplierName || 'Unknown Supplier'}</h2>
                        <Badge className={getComplianceColor(supplier.complianceStatus)}>
                          {supplier.complianceStatus || 'Unknown'}
                        </Badge>
                        <Badge className={getRiskColor(supplier.riskLevel)}>
                          {supplier.riskLevel || 'Unknown'} Risk
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6F83A7]">
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          {supplier.category || 'General'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" />
                          {supplier.country || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Lead Time: {supplier.leadTime || 'N/A'} days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Quality Score</div>
                      <div className="text-lg text-white">{supplier.qualityScore || 'N/A'}/100</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">On-Time Rate</div>
                      <div className="text-lg text-white">{supplier.onTimeDelivery || 0}%</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Monthly Spend</div>
                      <div className="text-lg text-white">$45K</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                      <div className="text-xs text-[#57ACAF] mb-1">Active Orders</div>
                      <div className="text-lg text-white">8</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-start gap-2 ml-6">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white border-none hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                    onClick={() => toast.success('New order initiated')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Order
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    onClick={() => toast.info('Edit supplier details')}
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
                  { id: 'performance', label: 'Performance', icon: Activity },
                  { id: 'documents', label: 'Documents', icon: FileText },
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
                          layoutId="activeTab"
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
                    {/* Supplier Information */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Supplier Information</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Provide comprehensive analysis of ${supplier.supplierName || 'this supplier'} including strengths, weaknesses, opportunities, and risk factors.`)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <Building2 className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Company Name</div>
                              <div className="text-white">{supplier.supplierName || 'Unknown'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Category</div>
                              <div className="text-white">{supplier.category || 'General'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <MapPin className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Location</div>
                              <div className="text-white">{supplier.country || 'Unknown'}</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <Phone className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Contact</div>
                              <div className="text-white">+1 (555) 123-4567</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <Mail className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Email</div>
                              <div className="text-white">contact@{(supplier.supplierName || 'supplier').toLowerCase().replace(/\s+/g, '')}.com</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <Globe className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Website</div>
                              <div className="text-[#57ACAF] hover:text-[#57ACAF]/80 cursor-pointer">www.{(supplier.supplierName || 'supplier').toLowerCase().replace(/\s+/g, '')}.com</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-white text-lg">Key Metrics</h3>
                          <MarbimAIButton
                            onClick={() => handleAskMarbim(`Analyze performance trends for ${supplier.supplierName || 'this supplier'} and predict future performance based on historical data.`)}
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-[#6F83A7]">Overall Quality Score</span>
                              <span className="text-white">{supplier.qualityScore || 0}/100</span>
                            </div>
                            <Progress value={supplier.qualityScore || 0} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-[#6F83A7]">On-Time Delivery Rate</span>
                              <span className="text-white">{supplier.onTimeDelivery || 0}%</span>
                            </div>
                            <Progress value={supplier.onTimeDelivery || 0} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-[#6F83A7]">Compliance Score</span>
                              <span className="text-white">95%</span>
                            </div>
                            <Progress value={95} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-[#6F83A7]">Responsiveness</span>
                              <span className="text-white">88%</span>
                            </div>
                            <Progress value={88} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <h3 className="text-white text-lg mb-5">Certifications</h3>
                        <div className="space-y-3">
                          {certifications.slice(0, 4).map((cert, index) => (
                            <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-[#57ACAF]" />
                                  <span className="text-white text-sm">{cert.name}</span>
                                </div>
                                <Badge 
                                  className="text-xs"
                                  style={{
                                    backgroundColor: `${cert.color}20`,
                                    color: cert.color,
                                    borderColor: `${cert.color}40`,
                                  }}
                                >
                                  {cert.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-[#6F83A7] mt-1">
                                Expires: {cert.expiryDate}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Recent Orders</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Analyze order patterns and volume trends with ${supplier.supplierName || 'this supplier'}. Identify opportunities for consolidation or optimization.`)}
                        />
                      </div>
                      <div className="space-y-3">
                        {recentOrders.map((order) => (
                          <div key={order.id} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180 cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Package className="w-5 h-5 text-[#57ACAF]" />
                                <div>
                                  <div className="text-white">{order.id}</div>
                                  <div className="text-xs text-[#6F83A7]">{order.date}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={order.status === 'Delivered' ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20' : 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'}>
                                  {order.status}
                                </Badge>
                                {order.onTime && (
                                  <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                )}
                                {!order.onTime && (
                                  <AlertTriangle className="w-4 h-4 text-[#EAB308]" />
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-xs text-[#6F83A7] mb-1">Material</div>
                                <div className="text-white">{order.material}</div>
                              </div>
                              <div>
                                <div className="text-xs text-[#6F83A7] mb-1">Quantity</div>
                                <div className="text-white">{order.quantity}</div>
                              </div>
                              <div>
                                <div className="text-xs text-[#6F83A7] mb-1">Value</div>
                                <div className="text-white">{order.value}</div>
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
                              {supplier.supplierName || 'This supplier'} demonstrates {supplier.riskLevel?.toLowerCase() || 'standard'} risk profile with strong performance in quality ({supplier.qualityScore || 'N/A'}/100) and delivery ({supplier.onTimeDelivery || 0}%). Recommend increasing order allocation by 15% based on consistent performance.
                            </p>
                          </div>
                        </div>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Generate comprehensive strategic recommendations for partnership with ${supplier.supplierName || 'this supplier'} including risk mitigation, optimization opportunities, and growth potential.`)}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAskMarbim(`What is the optimal order volume allocation for ${supplier.supplierName || 'this supplier'} based on capacity and performance?`)}
                          className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
                        >
                          <Target className="w-3 h-3 mr-2" />
                          Optimize Volume
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAskMarbim(`Analyze pricing trends and recommend negotiation strategy for ${supplier.supplierName || 'this supplier'}.`)}
                          className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
                        >
                          <DollarSign className="w-3 h-3 mr-2" />
                          Price Analysis
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAskMarbim(`Identify potential risks and recommend mitigation strategies for ${supplier.supplierName || 'this supplier'}.`)}
                          className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
                        >
                          <Shield className="w-3 h-3 mr-2" />
                          Risk Assessment
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    {/* Delivery Performance Chart */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Delivery Performance Trends</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Analyze delivery performance trends for ${supplier.supplierName || 'this supplier'} and predict future reliability based on historical data.`)}
                        />
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={deliveryPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis dataKey="month" stroke="#6F83A7" />
                          <YAxis stroke="#6F83A7" />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#0D1117', border: '1px solid #ffffff20', borderRadius: '12px' }} />
                          <Line type="monotone" dataKey="onTime" stroke="#57ACAF" strokeWidth={2} name="On Time" />
                          <Line type="monotone" dataKey="late" stroke="#D0342C" strokeWidth={2} name="Late" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Quality Metrics Radar */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-white text-lg">Quality Assessment</h3>
                          <MarbimAIButton
                            onClick={() => handleAskMarbim(`Provide detailed quality analysis for ${supplier.supplierName || 'this supplier'} across all assessment categories.`)}
                          />
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                          <RadarChart data={qualityMetricsData}>
                            <PolarGrid stroke="#ffffff20" />
                            <PolarAngleAxis dataKey="category" stroke="#6F83A7" tick={{ fontSize: 11 }} />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6F83A7" tick={{ fontSize: 10 }} />
                            <Radar name="Score" dataKey="score" stroke="#57ACAF" fill="#57ACAF" fillOpacity={0.3} strokeWidth={2} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-white text-lg">Order Volume Trends</h3>
                          <MarbimAIButton
                            onClick={() => handleAskMarbim(`Analyze order volume and value trends with ${supplier.supplierName || 'this supplier'}. Forecast next quarter demand.`)}
                          />
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                          <BarChart data={orderVolumeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="month" stroke="#6F83A7" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#6F83A7" tick={{ fontSize: 10 }} />
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#0D1117', border: '1px solid #ffffff20', borderRadius: '12px' }}
                              formatter={(value: any) => typeof value === 'number' ? `${value.toLocaleString()}` : value}
                            />
                            <Bar dataKey="volume" fill="#57ACAF" radius={[8, 8, 0, 0]} name="Volume (yards)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Performance Scorecard */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Performance Scorecard</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Generate comprehensive performance scorecard for ${supplier.supplierName || 'this supplier'} with benchmarking against industry standards.`)}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Quality', score: supplier.qualityScore || 85, target: 90, icon: Award },
                          { label: 'Delivery', score: supplier.onTimeDelivery || 92, target: 95, icon: Truck },
                          { label: 'Communication', score: 88, target: 90, icon: MessageSquare },
                          { label: 'Pricing', score: 82, target: 85, icon: DollarSign },
                          { label: 'Compliance', score: 95, target: 95, icon: Shield },
                          { label: 'Innovation', score: 78, target: 80, icon: Sparkles },
                        ].map((metric, index) => {
                          const Icon = metric.icon;
                          const isAboveTarget = metric.score >= metric.target;
                          return (
                            <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-lg ${isAboveTarget ? 'bg-[#57ACAF]/10' : 'bg-[#EAB308]/10'} flex items-center justify-center`}>
                                  <Icon className={`w-5 h-5 ${isAboveTarget ? 'text-[#57ACAF]' : 'text-[#EAB308]'}`} />
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs text-[#6F83A7] mb-1">{metric.label}</div>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-xl text-white">{metric.score}</span>
                                    <span className="text-xs text-[#6F83A7]">/ {metric.target}</span>
                                  </div>
                                </div>
                              </div>
                              <Progress value={(metric.score / metric.target) * 100} className="h-1.5" />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Performance Alerts */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-2">Performance Insights</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                              <span className="text-[#6F83A7]">Quality score improved by 5% over last quarter</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                              <span className="text-[#6F83A7]">On-time delivery rate above industry average (92% vs 88%)</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-[#EAB308] shrink-0 mt-0.5" />
                              <span className="text-[#6F83A7]">Response time increased to 4.2 hours (target: 3 hours)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAskMarbim(`Create action plan to improve underperforming metrics for ${supplier.supplierName || 'this supplier'}. Include specific recommendations and timelines.`)}
                        className="w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                      >
                        <Sparkles className="w-3 h-3 mr-2" />
                        Generate Improvement Plan
                      </Button>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Document Library</h3>
                        <div className="flex items-center gap-2">
                          <MarbimAIButton
                            onClick={() => handleAskMarbim(`Analyze all documents for ${supplier.supplierName || 'this supplier'} and identify any missing compliance documentation or upcoming renewals.`)}
                          />
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                            onClick={() => toast.success('Upload document dialog opened')}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {documents.map((doc, index) => (
                          <div key={index} className="group p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                                  <FileText className="w-5 h-5 text-[#57ACAF]" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-white mb-1">{doc.name}</div>
                                  <div className="flex items-center gap-3 text-xs text-[#6F83A7]">
                                    <span>{doc.type}</span>
                                    <span>•</span>
                                    <span>{doc.uploadDate}</span>
                                    <span>•</span>
                                    <span>{doc.size}</span>
                                  </div>
                                </div>
                                <Badge className={
                                  doc.status === 'Verified' || doc.status === 'Approved' || doc.status === 'Active'
                                    ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20'
                                    : 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20'
                                }>
                                  {doc.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-180">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toast.info(`Viewing ${doc.name}`)}
                                  className="text-white/60 hover:text-white hover:bg-white/5"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toast.success(`Downloading ${doc.name}`)}
                                  className="text-white/60 hover:text-white hover:bg-white/5"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleAskMarbim(`Summarize the key points from ${doc.name} for ${supplier.supplierName || 'this supplier'}.`)}
                                  className="text-white/60 hover:text-white hover:bg-white/5"
                                >
                                  <Sparkles className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications Detail */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Certifications & Compliance</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Review all certifications for ${supplier.supplierName || 'this supplier'} and identify any compliance gaps or upcoming renewals.`)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {certifications.map((cert, index) => (
                          <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                                <Shield className="w-5 h-5 text-[#57ACAF]" />
                              </div>
                              <div className="flex-1">
                                <div className="text-white mb-1">{cert.name}</div>
                                <Badge 
                                  className="text-xs"
                                  style={{
                                    backgroundColor: `${cert.color}20`,
                                    color: cert.color,
                                    borderColor: `${cert.color}40`,
                                  }}
                                >
                                  {cert.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-1 text-xs text-[#6F83A7]">
                              <div className="flex justify-between">
                                <span>Issue Date:</span>
                                <span className="text-white">{cert.issueDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Expiry Date:</span>
                                <span className="text-white">{cert.expiryDate}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full mt-3 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                              onClick={() => toast.info(`Viewing ${cert.name} certificate`)}
                            >
                              <ExternalLink className="w-3 h-3 mr-2" />
                              View Certificate
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Document Insights */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-2">Document Intelligence</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            MARBIM has analyzed all supplier documents and identified key compliance status and upcoming actions.
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-[#EAB308] shrink-0 mt-0.5" />
                              <span className="text-[#6F83A7]">BSCI Audit certificate expires in 2 months - schedule renewal</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                              <span className="text-[#6F83A7]">All quality certifications are valid and up to date</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                              <span className="text-[#6F83A7]">Product catalog updated with latest specifications</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAskMarbim(`Generate complete compliance report for ${supplier.supplierName || 'this supplier'} including all certifications, audits, and required actions.`)}
                        className="w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                      >
                        <Sparkles className="w-3 h-3 mr-2" />
                        Generate Compliance Report
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
                          onClick={() => handleAskMarbim(`Analyze communication patterns with ${supplier.supplierName || 'this supplier'} and identify potential issues or improvement opportunities.`)}
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
                      entityType="supplier"
                      entityId={supplier.id || '0'}
                      entityName={supplier.supplierName || 'Supplier'}
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
                          <div className="text-xs text-[#6F83A7]">Compose new message</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start h-auto p-4"
                        onClick={() => toast.info('Scheduling meeting')}
                      >
                        <Calendar className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="text-sm">Schedule Meeting</div>
                          <div className="text-xs text-[#6F83A7]">Set up call or visit</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start h-auto p-4"
                        onClick={() => toast.info('Initiating WhatsApp chat')}
                      >
                        <MessageSquare className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="text-sm">WhatsApp Chat</div>
                          <div className="text-xs text-[#6F83A7]">Quick message</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start h-auto p-4"
                        onClick={() => toast.info('Placing phone call')}
                      >
                        <Phone className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="text-sm">Phone Call</div>
                          <div className="text-xs text-[#6F83A7]">Direct contact</div>
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
                              <div className="text-xs text-[#6F83A7] mb-1">Avg Response Time</div>
                              <div className="text-lg text-white">4.2 hrs</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-xs text-[#6F83A7] mb-1">Sentiment Score</div>
                              <div className="text-lg text-white">92%</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-xs text-[#6F83A7] mb-1">Total Messages</div>
                              <div className="text-lg text-white">247</div>
                            </div>
                          </div>
                          <p className="text-sm text-[#6F83A7]">
                            Communication quality is strong with positive sentiment. Response time is within acceptable range but could be improved.
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAskMarbim(`Analyze all communications with ${supplier.supplierName || 'this supplier'} and identify patterns, issues, or opportunities for improved collaboration.`)}
                        className="w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                      >
                        <Sparkles className="w-3 h-3 mr-2" />
                        Deep Communication Analysis
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
