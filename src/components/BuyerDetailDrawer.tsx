import { motion, AnimatePresence } from 'motion/react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { useState } from 'react';
import { 
  X, Edit2, Send, Copy, Download, BarChart3, 
  FileText, Clock, Calendar, DollarSign, CheckCircle,
  Target, AlertCircle, Eye, MessageSquare, Package,
  Sparkles, Settings, Trash2, User, Building2, Mail,
  Phone, Globe, MapPin, TrendingUp, Award, Layers,
  Shield, AlertTriangle, Plus, Users, Truck,
  Star, Activity, Archive, ExternalLink, CreditCard,
  ShoppingCart, TrendingDown, UserCheck, Heart,
  FileCheck, ThumbsUp, ThumbsDown, History, Trophy,
  Upload
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
  AreaChart,
  Area,
} from 'recharts';
import { CommunicationLogger } from './CommunicationLogger';

interface BuyerDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  buyer: any;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
}

export function BuyerDetailDrawer({ 
  isOpen, 
  onClose, 
  buyer,
  onAskMarbim,
  onOpenAI
}: BuyerDetailDrawerProps) {
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

  if (!buyer) return null;

  // Mock data for buyer details
  const orderHistoryData = [
    { month: 'Jan', orders: 12, value: 145000 },
    { month: 'Feb', orders: 15, value: 178000 },
    { month: 'Mar', orders: 18, value: 210000 },
    { month: 'Apr', orders: 16, value: 192000 },
    { month: 'May', orders: 20, value: 245000 },
    { month: 'Jun', orders: 22, value: 268000 },
  ];

  const paymentPerformanceData = [
    { month: 'Jan', onTime: 95, late: 5 },
    { month: 'Feb', onTime: 92, late: 8 },
    { month: 'Mar', onTime: 98, late: 2 },
    { month: 'Apr', onTime: 94, late: 6 },
    { month: 'May', onTime: 96, late: 4 },
    { month: 'Jun', onTime: 100, late: 0 },
  ];

  const satisfactionMetricsData = [
    { category: 'Product Quality', score: buyer.satisfaction || 92 },
    { category: 'Delivery Time', score: 88 },
    { category: 'Communication', score: 94 },
    { category: 'Pricing', score: 85 },
    { category: 'Service', score: 90 },
    { category: 'Innovation', score: 87 },
  ];

  const productCategoryData = [
    { name: 'T-Shirts', value: 35, color: '#57ACAF' },
    { name: 'Dresses', value: 25, color: '#EAB308' },
    { name: 'Pants', value: 20, color: '#6F83A7' },
    { name: 'Jackets', value: 15, color: '#D0342C' },
    { name: 'Others', value: 5, color: '#8B5CF6' },
  ];

  const recentOrders = [
    { id: 'ORD-2024-1567', date: '2024-10-25', product: 'Cotton T-Shirts', quantity: '5,000 pcs', value: '$45,000', status: 'In Production', onTime: true },
    { id: 'ORD-2024-1523', date: '2024-10-20', product: 'Denim Jeans', quantity: '3,500 pcs', value: '$52,500', status: 'Shipped', onTime: true },
    { id: 'ORD-2024-1489', date: '2024-10-15', product: 'Summer Dresses', quantity: '2,800 pcs', value: '$39,200', status: 'Delivered', onTime: false },
    { id: 'ORD-2024-1432', date: '2024-10-08', product: 'Hoodies', quantity: '4,200 pcs', value: '$58,800', status: 'Delivered', onTime: true },
  ];

  const communications = [
    {
      timestamp: '3 hours ago',
      sender: `${buyer.buyerName || 'Buyer'} - Purchasing Manager`,
      message: 'Please confirm the delivery date for order ORD-2024-1567. We need it by next week for our seasonal launch.',
      type: 'question',
      sentiment: 'neutral'
    },
    {
      timestamp: '1 day ago',
      sender: 'You - Sales Team',
      message: 'Thank you for your order. Production has started and we will ship as scheduled.',
      type: 'message',
      sentiment: 'positive'
    },
    {
      timestamp: '3 days ago',
      sender: `${buyer.buyerName || 'Buyer'} - CEO`,
      message: 'We are very satisfied with the quality of recent shipments. Looking forward to expanding our partnership.',
      type: 'message',
      sentiment: 'positive'
    },
  ];

  const documents = [
    { name: 'Purchase_Contract_2024.pdf', type: 'Contract', uploadDate: '2024-01-15', size: '3.2 MB', status: 'Active' },
    { name: 'Credit_Agreement.pdf', type: 'Financial', uploadDate: '2024-02-20', size: '1.8 MB', status: 'Approved' },
    { name: 'Quality_Specifications.pdf', type: 'Technical', uploadDate: '2024-03-10', size: '2.5 MB', status: 'Current' },
    { name: 'NDA_Agreement.pdf', type: 'Legal', uploadDate: '2024-01-01', size: '1.2 MB', status: 'Active' },
    { name: 'Product_Catalog_Request.pdf', type: 'Sales', uploadDate: '2024-09-15', size: '8.4 MB', status: 'Processed' },
  ];

  const issuesHistory = [
    { id: 'ISS-245', date: '2024-09-15', issue: 'Delayed shipment for ORD-2024-1432', status: 'Resolved', resolution: 'Compensated with 5% discount on next order' },
    { id: 'ISS-238', date: '2024-08-20', issue: 'Quality concern on fabric weight', status: 'Resolved', resolution: 'Replacement provided within 3 days' },
    { id: 'ISS-221', date: '2024-07-10', issue: 'Incorrect sizing in sample batch', status: 'Resolved', resolution: 'New samples sent and approved' },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'active':
      case 'approved':
      case 'current':
      case 'resolved':
        return '#57ACAF';
      case 'in production':
      case 'shipped':
      case 'in transit':
      case 'processed':
        return '#EAB308';
      case 'cancelled':
      case 'delayed':
        return '#D0342C';
      default:
        return '#6F83A7';
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'question': return AlertCircle;
      case 'message': return MessageSquare;
      default: return Mail;
    }
  };

  const getTierColor = (tier?: string) => {
    switch (tier?.toUpperCase()) {
      case 'A': return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      case 'B': return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'C': return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
      default: return 'bg-white/10 text-white border-white/20';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'excellent': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'good': return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      case 'fair': return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'poor': return 'bg-red-500/10 text-red-400 border-red-500/20';
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
                    <div>
                      <h2 className="text-xl text-white mb-1">{buyer.buyerName || 'Buyer Details'}</h2>
                      <div className="flex items-center gap-2">
                        <Badge className={getTierColor(buyer.tier)}>
                          Tier {buyer.tier || 'A'}
                        </Badge>
                        <Badge className={getPaymentStatusColor(buyer.paymentStatus)}>
                          {buyer.paymentStatus || 'Excellent'}
                        </Badge>
                        {buyer.country && (
                          <div className="flex items-center gap-1 text-xs text-[#6F83A7]">
                            <MapPin className="w-3 h-3" />
                            {buyer.country}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Lifetime Value</div>
                      <div className="text-lg text-white">${buyer.lifetimeValue || '1.2M'}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Total Orders</div>
                      <div className="text-lg text-[#57ACAF]">{buyer.totalOrders || 124}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Satisfaction</div>
                      <div className="text-lg text-white">{buyer.satisfaction || 92}%</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Credit Limit</div>
                      <div className="text-lg text-white">${buyer.creditLimit || '500K'}</div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-[#6F83A7] hover:text-white hover:bg-white/10 shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="relative flex items-center gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20 ml-auto"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  New Order
                </Button>
              </div>
            </div>

            {/* Sleek Tabs Navigation */}
            <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center px-8 gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'orders', label: 'Orders', icon: ShoppingCart },
                  { id: 'communications', label: 'Communications', icon: MessageSquare },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
                          layoutId="activeBuyerTab"
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
                    {/* AI Insights Card */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white mb-1">MARBIM AI Insights</h4>
                            <p className="text-sm text-[#6F83A7] mb-3">
                              {buyer.buyerName || 'This buyer'} shows excellent payment performance with 96% on-time payments. Consider offering extended credit terms to strengthen relationship.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Growth Opportunity
                              </Badge>
                              <Badge className="bg-green-500/10 text-green-400 border border-green-500/20">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Low Risk
                              </Badge>
                              <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                                <Star className="w-3 h-3 mr-1" />
                                Premium Buyer
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <MarbimAIButton 
                          onClick={() => handleAskMarbim(`Provide detailed analysis of buyer ${buyer.buyerName}, including growth opportunities, risk assessment, and strategic recommendations for relationship management.`)}
                        />
                      </div>
                    </div>

                    {/* Buyer Information */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Building2 className="w-5 h-5 text-[#57ACAF]" />
                          <h3 className="text-white">Company Information</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-[#6F83A7]">Company Name</span>
                            <span className="text-white">{buyer.buyerName || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-[#6F83A7]">Industry</span>
                            <span className="text-white">{buyer.industry || 'Fashion Retail'}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-[#6F83A7]">Country</span>
                            <span className="text-white">{buyer.country || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-[#6F83A7]">City</span>
                            <span className="text-white">{buyer.city || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-[#6F83A7]">Relationship Since</span>
                            <span className="text-white">{buyer.relationshipSince || '2020'}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-[#6F83A7]">Business Type</span>
                            <span className="text-white">{buyer.businessType || 'Retailer'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <User className="w-5 h-5 text-[#57ACAF]" />
                          <h3 className="text-white">Contact Information</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-[#57ACAF] mt-1" />
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Email</div>
                              <div className="text-sm text-white">{buyer.email || 'contact@buyer.com'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-[#57ACAF] mt-1" />
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Phone</div>
                              <div className="text-sm text-white">{buyer.phone || '+1 (555) 123-4567'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Globe className="w-4 h-4 text-[#57ACAF] mt-1" />
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Website</div>
                              <div className="text-sm text-white break-all">{buyer.website || 'www.buyer.com'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-[#57ACAF] mt-1" />
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Address</div>
                              <div className="text-sm text-white">{buyer.address || '123 Business St, Suite 100'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Overview */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-[#57ACAF]" />
                          <h3 className="text-white">Financial Overview</h3>
                        </div>
                        <MarbimAIButton 
                          onClick={() => handleAskMarbim(`Analyze the financial health and payment patterns of ${buyer.buyerName}. Recommend credit limit adjustments and payment term optimizations.`)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-[#6F83A7]">Credit Limit</div>
                            <DollarSign className="w-4 h-4 text-[#57ACAF]" />
                          </div>
                          <div className="text-2xl text-white mb-1">${buyer.creditLimit || '500K'}</div>
                          <div className="text-xs text-[#6F83A7]">Outstanding: ${buyer.outstanding || '120K'}</div>
                          <Progress value={24} className="mt-2 h-1.5" />
                        </div>
                        
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-[#6F83A7]">Payment Terms</div>
                            <Clock className="w-4 h-4 text-[#EAB308]" />
                          </div>
                          <div className="text-2xl text-white mb-1">{buyer.paymentTerms || 'Net 60'}</div>
                          <div className="text-xs text-[#6F83A7]">Avg. Days: {buyer.avgPaymentDays || '58'}</div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-[#6F83A7]">Payment Score</div>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </div>
                          <div className="text-2xl text-white mb-1">{buyer.paymentScore || '96'}/100</div>
                          <div className="text-xs text-green-400">Excellent</div>
                        </div>
                      </div>

                      {/* Payment Performance Chart */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={paymentPerformanceData}>
                            <defs>
                              <linearGradient id="onTimeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#57ACAF" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#57ACAF" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="month" stroke="#6F83A7" />
                            <YAxis stroke="#6F83A7" />
                            <RechartsTooltip 
                              contentStyle={{ 
                                backgroundColor: '#182336', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px'
                              }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="onTime" 
                              stroke="#57ACAF" 
                              fillOpacity={1} 
                              fill="url(#onTimeGradient)" 
                              strokeWidth={2}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="late" 
                              stroke="#D0342C" 
                              fillOpacity={0.3} 
                              fill="#D0342C" 
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Product Categories */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-[#57ACAF]" />
                          <h3 className="text-white">Product Categories</h3>
                        </div>
                        <MarbimAIButton 
                          onClick={() => handleAskMarbim(`Analyze product category preferences for ${buyer.buyerName}. Suggest new product categories or opportunities for cross-selling based on their order history.`)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={productCategoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {productCategoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{ 
                                  backgroundColor: '#182336', 
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '8px'
                                }} 
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="space-y-3">
                          {productCategoryData.map((category, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: category.color }}
                                />
                                <span className="text-white">{category.name}</span>
                              </div>
                              <span className="text-[#6F83A7]">{category.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Issues & Feedback */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-[#EAB308]" />
                          <h3 className="text-white">Issues & Resolution History</h3>
                        </div>
                        <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                          {issuesHistory.length} Total Issues
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {issuesHistory.map((issue, index) => (
                          <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm text-white">{issue.id}</span>
                                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                                    {issue.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-[#6F83A7] mb-2">{issue.issue}</div>
                                <div className="text-xs text-white bg-white/5 p-2 rounded">
                                  <strong>Resolution:</strong> {issue.resolution}
                                </div>
                              </div>
                              <div className="text-xs text-[#6F83A7] ml-4">{issue.date}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    {/* AI Insights */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white mb-1">Order Pattern Analysis</h4>
                            <p className="text-sm text-[#6F83A7]">
                              Order volume has increased by 35% over the last 6 months. Peak ordering occurs in Q1 and Q3, aligned with seasonal fashion cycles.
                            </p>
                          </div>
                        </div>
                        <MarbimAIButton 
                          onClick={() => handleAskMarbim(`Analyze order patterns and trends for ${buyer.buyerName}. Predict upcoming order volumes and recommend inventory preparation strategies.`)}
                        />
                      </div>
                    </div>

                    {/* Order History Chart */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                        <h3 className="text-white">Order Volume Trend</h3>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={orderHistoryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="month" stroke="#6F83A7" />
                            <YAxis yAxisId="left" stroke="#6F83A7" />
                            <YAxis yAxisId="right" orientation="right" stroke="#6F83A7" />
                            <RechartsTooltip 
                              contentStyle={{ 
                                backgroundColor: '#182336', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px'
                              }} 
                            />
                            <Bar yAxisId="left" dataKey="orders" fill="#57ACAF" radius={[8, 8, 0, 0]} />
                            <Bar yAxisId="right" dataKey="value" fill="#EAB308" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <ShoppingCart className="w-5 h-5 text-[#57ACAF]" />
                        <h3 className="text-white">Recent Orders</h3>
                      </div>
                      <div className="space-y-3">
                        {recentOrders.map((order, index) => (
                          <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-white">{order.id}</span>
                                  <Badge style={{ 
                                    backgroundColor: `${getStatusColor(order.status)}15`,
                                    color: getStatusColor(order.status),
                                    borderColor: `${getStatusColor(order.status)}30`
                                  }} className="border">
                                    {order.status}
                                  </Badge>
                                  {order.onTime && (
                                    <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                  )}
                                </div>
                                <div className="text-sm text-[#6F83A7]">{order.product}</div>
                              </div>
                              <div className="text-xs text-[#6F83A7] text-right">
                                <div>{order.date}</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-4">
                                <div>
                                  <span className="text-[#6F83A7]">Qty: </span>
                                  <span className="text-white">{order.quantity}</span>
                                </div>
                                <div>
                                  <span className="text-[#6F83A7]">Value: </span>
                                  <span className="text-white">{order.value}</span>
                                </div>
                              </div>
                              <Button size="sm" variant="ghost" className="text-[#57ACAF] hover:bg-[#57ACAF]/10">
                                <Eye className="w-4 h-4 mr-1" />
                                Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Communications Tab */}
                {activeTab === 'communications' && (
                  <div className="space-y-6">
                    {/* AI Insights */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white mb-1">Communication Sentiment Analysis</h4>
                            <p className="text-sm text-[#6F83A7]">
                              Overall sentiment: <strong className="text-[#57ACAF]">Positive</strong>. Recent interactions show high satisfaction with product quality and delivery timelines.
                            </p>
                          </div>
                        </div>
                        <MarbimAIButton 
                          onClick={() => handleAskMarbim(`Analyze communication history with ${buyer.buyerName}. Identify sentiment trends, key concerns, and opportunities for improved engagement.`)}
                        />
                      </div>
                    </div>

                    {/* Communication Logger */}
                    <CommunicationLogger 
                      communications={communications}
                      onAskMarbim={onAskMarbim ? (prompt) => handleAskMarbim(prompt) : undefined}
                      entityName={buyer.buyerName || 'Buyer'}
                    />

                    {/* Documents */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#57ACAF]" />
                          <h3 className="text-white">Documents & Contracts</h3>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {documents.map((doc, index) => (
                          <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180 group">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <FileText className="w-5 h-5 text-[#57ACAF] shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-white mb-1">{doc.name}</div>
                                  <div className="flex items-center gap-4 text-xs text-[#6F83A7]">
                                    <span>{doc.type}</span>
                                    <span>•</span>
                                    <span>{doc.size}</span>
                                    <span>•</span>
                                    <span>{doc.uploadDate}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge style={{ 
                                  backgroundColor: `${getStatusColor(doc.status)}15`,
                                  color: getStatusColor(doc.status),
                                  borderColor: `${getStatusColor(doc.status)}30`
                                }} className="border">
                                  {doc.status}
                                </Badge>
                                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-[#57ACAF] hover:bg-[#57ACAF]/10">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    {/* AI Insights */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white mb-1">Performance Analytics</h4>
                            <p className="text-sm text-[#6F83A7]">
                              {buyer.buyerName || 'This buyer'} ranks in the top 10% of all buyers by satisfaction score and payment reliability. Consider VIP status upgrade.
                            </p>
                          </div>
                        </div>
                        <MarbimAIButton 
                          onClick={() => handleAskMarbim(`Generate comprehensive performance analytics for ${buyer.buyerName}. Include satisfaction trends, payment patterns, order volume analysis, and strategic growth recommendations.`)}
                        />
                      </div>
                    </div>

                    {/* Satisfaction Metrics Radar */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Target className="w-5 h-5 text-[#57ACAF]" />
                        <h3 className="text-white">Satisfaction Metrics</h3>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={satisfactionMetricsData}>
                            <PolarGrid stroke="#ffffff20" />
                            <PolarAngleAxis dataKey="category" stroke="#6F83A7" />
                            <PolarRadiusAxis stroke="#6F83A7" />
                            <Radar 
                              name="Score" 
                              dataKey="score" 
                              stroke="#57ACAF" 
                              fill="#57ACAF" 
                              fillOpacity={0.3} 
                              strokeWidth={2}
                            />
                            <RechartsTooltip 
                              contentStyle={{ 
                                backgroundColor: '#182336', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px'
                              }} 
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Key Performance Indicators */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Activity className="w-5 h-5 text-[#57ACAF]" />
                          <h3 className="text-white">Engagement Metrics</h3>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-[#6F83A7]">Order Frequency</span>
                              <span className="text-white">High</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-[#6F83A7]">Response Time</span>
                              <span className="text-white">Excellent</span>
                            </div>
                            <Progress value={92} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-[#6F83A7]">Communication Quality</span>
                              <span className="text-white">Very Good</span>
                            </div>
                            <Progress value={88} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Award className="w-5 h-5 text-[#EAB308]" />
                          <h3 className="text-white">Achievements & Milestones</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                            <Star className="w-5 h-5 text-[#57ACAF] shrink-0" />
                            <div>
                              <div className="text-sm text-white mb-1">Top Tier Buyer</div>
                              <div className="text-xs text-[#6F83A7]">Achieved Tier A status in Q2 2024</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
                            <Trophy className="w-5 h-5 text-[#EAB308] shrink-0" />
                            <div>
                              <div className="text-sm text-white mb-1">1 Million Milestone</div>
                              <div className="text-xs text-[#6F83A7]">Lifetime value exceeded $1M</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                            <div>
                              <div className="text-sm text-white mb-1">Perfect Payment Record</div>
                              <div className="text-xs text-[#6F83A7]">100% on-time payments (June 2024)</div>
                            </div>
                          </div>
                        </div>
                      </div>
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
