import { motion, AnimatePresence } from 'motion/react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { useState } from 'react';
import { 
  X, Mail, Phone, MapPin, Building2, Briefcase, 
  Calendar, DollarSign, Package, TrendingUp, 
  MessageSquare, FileText, History, Star, 
  User, Globe, Clock, ShoppingCart, Award,
  Sparkles, BarChart3, Activity, Target, Eye,
  Send, Edit2, Trash2, Heart, Users, CheckCircle,
  AlertCircle, Tag, Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MarbimAIButton } from './MarbimAIButton';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

interface ContactDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contact: any;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
}

export function ContactDetailDrawer({ 
  isOpen, 
  onClose, 
  contact,
  onAskMarbim,
  onOpenAI
}: ContactDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [note, setNote] = useState('');
  const [showNoteBox, setShowNoteBox] = useState(false);

  const handleAskMarbim = (prompt: string) => {
    if (onAskMarbim) {
      onAskMarbim(prompt);
    }
    if (onOpenAI) {
      onOpenAI();
    }
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    toast.success('Note added successfully');
    setNote('');
    setShowNoteBox(false);
  };

  const handleSendEmail = () => {
    toast.success('Opening email composer...');
  };

  const handleCall = () => {
    toast.success('Initiating call...');
  };

  if (!contact) return null;

  // Mock data for contact analytics
  const activityTimeline = [
    { id: 1, type: 'email', action: 'Email sent - Q4 Product Catalog', date: '2 hours ago', icon: Mail, sentiment: 'positive' },
    { id: 2, type: 'call', action: 'Phone call - 15 min discussion', date: '3 days ago', icon: Phone, sentiment: 'positive' },
    { id: 3, type: 'order', action: 'Order #ORD-2845 delivered', date: '1 week ago', icon: Package, sentiment: 'positive' },
    { id: 4, type: 'meeting', action: 'Quarterly business review meeting', date: '2 weeks ago', icon: Users, sentiment: 'neutral' },
    { id: 5, type: 'email', action: 'Price negotiation email', date: '3 weeks ago', icon: Mail, sentiment: 'neutral' },
  ];

  const orderHistory = [
    { id: 'ORD-2845', date: 'Oct 15, 2024', amount: '$45,000', items: 12, status: 'Delivered', margin: 18.5 },
    { id: 'ORD-2723', date: 'Sep 28, 2024', amount: '$32,000', items: 8, status: 'In Progress', margin: 16.2 },
    { id: 'ORD-2698', date: 'Sep 10, 2024', amount: '$28,000', items: 10, status: 'Delivered', margin: 19.8 },
    { id: 'ORD-2645', date: 'Aug 22, 2024', amount: '$38,000', items: 15, status: 'Delivered', margin: 17.5 },
  ];

  const engagementData = [
    { month: 'Jul', emails: 8, calls: 3, meetings: 1, orders: 2 },
    { month: 'Aug', emails: 12, calls: 5, meetings: 2, orders: 3 },
    { month: 'Sep', emails: 10, calls: 4, meetings: 1, orders: 2 },
    { month: 'Oct', emails: 15, calls: 6, meetings: 2, orders: 4 },
  ];

  const notes = [
    { id: 1, text: contact.notes, date: 'Oct 20, 2024', author: 'You' },
    { id: 2, text: 'Discussed sustainable material options for spring collection', date: 'Sep 15, 2024', author: 'Sarah M.' },
    { id: 3, text: 'Prefers 30-day payment terms, negotiated 5% volume discount', date: 'Aug 10, 2024', author: 'Mike R.' },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Customer': return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' };
      case 'Supplier': return { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' };
      case 'Partner': return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' };
      default: return { bg: 'bg-[#6F83A7]/10', border: 'border-[#6F83A7]/20', text: 'text-[#6F83A7]' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return { bg: 'bg-[#57ACAF]/10', border: 'border-[#57ACAF]/20', text: 'text-[#57ACAF]' };
      case 'Inactive': return { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' };
      default: return { bg: 'bg-[#6F83A7]/10', border: 'border-[#6F83A7]/20', text: 'text-[#6F83A7]' };
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'activity', label: 'Activity', icon: History },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Contact Info Card */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#57ACAF]" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-[#6F83A7] mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-[#6F83A7] mb-1">Company</p>
                    <p className="text-sm text-white">{contact.company}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-[#6F83A7] mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-[#6F83A7] mb-1">Role</p>
                    <p className="text-sm text-white">{contact.role}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#6F83A7] mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-[#6F83A7] mb-1">Email</p>
                    <p className="text-sm text-white">{contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#6F83A7] mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-[#6F83A7] mb-1">Phone</p>
                    <p className="text-sm text-white">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#6F83A7] mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-[#6F83A7] mb-1">Location</p>
                    <p className="text-sm text-white">{contact.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Metrics */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#57ACAF]" />
                Business Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Total Orders</span>
                  </div>
                  <p className="text-2xl font-medium text-white">{contact.totalOrders}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-xs text-[#6F83A7]">Total Value</span>
                  </div>
                  <p className="text-2xl font-medium text-white">{contact.totalValue}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Last Contact</span>
                  </div>
                  <p className="text-sm font-medium text-white">{contact.lastContact}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Avg Margin</span>
                  </div>
                  <p className="text-2xl font-medium text-white">18.2%</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#57ACAF]" />
                Tags & Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag: string, index: number) => (
                  <Badge 
                    key={index}
                    className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#57ACAF]" />
                Recent Notes
              </h3>
              <div className="space-y-3 mb-4">
                {notes.slice(0, 2).map((n) => (
                  <div key={n.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">{n.author}</span>
                      <span className="text-xs text-[#6F83A7]">{n.date}</span>
                    </div>
                    <p className="text-sm text-white">{n.text}</p>
                  </div>
                ))}
              </div>
              {showNoteBox ? (
                <div className="space-y-3">
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddNote}
                      className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white"
                    >
                      Save Note
                    </Button>
                    <Button
                      onClick={() => {
                        setShowNoteBox(false);
                        setNote('');
                      }}
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowNoteBox(true)}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              )}
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6">
            {/* Engagement Chart */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#57ACAF]" />
                Engagement Trends
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#6F83A7" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6F83A7" style={{ fontSize: '12px' }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#182336',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Line type="monotone" dataKey="emails" stroke="#57ACAF" strokeWidth={2} />
                    <Line type="monotone" dataKey="calls" stroke="#EAB308" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#57ACAF]" />
                  <span className="text-xs text-[#6F83A7]">Emails</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#EAB308]" />
                  <span className="text-xs text-[#6F83A7]">Calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#3B82F6]" />
                  <span className="text-xs text-[#6F83A7]">Orders</span>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-6 flex items-center gap-2">
                <History className="w-4 h-4 text-[#57ACAF]" />
                Activity Timeline
              </h3>
              <div className="space-y-4">
                {activityTimeline.map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="relative">
                      {idx < activityTimeline.length - 1 && (
                        <div className="absolute left-5 top-12 w-px h-10 bg-white/10" />
                      )}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-[#57ACAF]" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm text-white mb-1">{activity.action}</p>
                          <span className="text-xs text-[#6F83A7]">{activity.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-[#57ACAF]" />
                  <span className="text-xs text-[#6F83A7]">Total Orders</span>
                </div>
                <p className="text-2xl font-medium text-white">{contact.totalOrders}</p>
              </div>
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-[#EAB308]" />
                  <span className="text-xs text-[#6F83A7]">Total Value</span>
                </div>
                <p className="text-2xl font-medium text-white">{contact.totalValue}</p>
              </div>
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                  <span className="text-xs text-[#6F83A7]">Avg Order</span>
                </div>
                <p className="text-2xl font-medium text-white">$35.8K</p>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#57ACAF]" />
                Recent Orders
              </h3>
              <div className="space-y-3">
                {orderHistory.map((order) => (
                  <div key={order.id} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-sm font-medium">{order.id}</span>
                          <Badge className={
                            order.status === 'Delivered' 
                              ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20' 
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#6F83A7] mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {order.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {order.items} items
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {order.margin}% margin
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-white">{order.amount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'insights':
        return (
          <div className="space-y-6">
            {/* AI Relationship Score */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">Relationship Health Score</h3>
                  <p className="text-sm text-[#6F83A7]">MARBIM's AI-powered assessment</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#6F83A7]">Overall Health</span>
                  <span className="text-2xl font-medium text-[#57ACAF]">92/100</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#57ACAF] to-[#EAB308]" style={{ width: '92%' }} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                  <span className="text-sm text-[#6F83A7]">Strong engagement - 45% above average</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                  <span className="text-sm text-[#6F83A7]">Consistent order frequency - every 6 weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                  <span className="text-sm text-[#6F83A7]">Excellent payment history - 100% on-time</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#EAB308]/20">
                <Button
                  onClick={() => handleAskMarbim(`Provide detailed relationship analysis for ${contact.name}`)}
                  className="w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Full Analysis
                </Button>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#57ACAF]" />
                AI Recommendations
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                  <div className="flex items-start gap-3 mb-2">
                    <Zap className="w-5 h-5 text-[#57ACAF] mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium mb-1">Upsell Opportunity</h4>
                      <p className="text-xs text-[#6F83A7]">
                        Contact typically orders in Q1. Reach out now with spring collection samples - 78% success probability.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
                  <div className="flex items-start gap-3 mb-2">
                    <Award className="w-5 h-5 text-[#EAB308] mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium mb-1">Loyalty Reward</h4>
                      <p className="text-xs text-[#6F83A7]">
                        5-year partnership milestone approaching. Consider special discount or gift to strengthen relationship.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-[#6F83A7] mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium mb-1">Communication Preference</h4>
                      <p className="text-xs text-[#6F83A7]">
                        Prefers email over calls (85% email response rate vs 40% call pickup). Adjust outreach strategy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ask MARBIM */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6 relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EAB308]/20 to-transparent rounded-full blur-3xl -z-0" />
              
              <div className="relative z-10">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">Ask MARBIM AI</h3>
                    <p className="text-sm text-[#6F83A7]">Get instant insights about this contact</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Button
                    onClick={() => handleAskMarbim(`What's the best time to reach out to ${contact.name}?`)}
                    className="w-full justify-start bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#57ACAF]/30 transition-all duration-300 group h-auto py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center mr-3 group-hover:bg-[#57ACAF]/30 transition-all">
                      <Clock className="w-4 h-4 text-[#57ACAF]" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-white">Best Time to Contact</p>
                      <p className="text-xs text-[#6F83A7]">AI-powered optimal outreach timing</p>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleAskMarbim(`Suggest upsell products for ${contact.name}`)}
                    className="w-full justify-start bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#EAB308]/30 transition-all duration-300 group h-auto py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center mr-3 group-hover:bg-[#EAB308]/30 transition-all">
                      <TrendingUp className="w-4 h-4 text-[#EAB308]" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-white">Upsell Opportunities</p>
                      <p className="text-xs text-[#6F83A7]">Product recommendations based on history</p>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleAskMarbim(`Analyze ordering patterns for ${contact.name}`)}
                    className="w-full justify-start bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#57ACAF]/30 transition-all duration-300 group h-auto py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center mr-3 group-hover:bg-[#57ACAF]/30 transition-all">
                      <BarChart3 className="w-4 h-4 text-[#57ACAF]" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-white">Ordering Patterns</p>
                      <p className="text-xs text-[#6F83A7]">Behavioral analysis and trends</p>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleAskMarbim(`Draft a personalized email for ${contact.name}`)}
                    className="w-full justify-start bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#57ACAF]/30 transition-all duration-300 group h-auto py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3 group-hover:bg-purple-500/30 transition-all">
                      <Mail className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-white">Draft Email</p>
                      <p className="text-xs text-[#6F83A7]">AI-generated personalized message</p>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleAskMarbim(`Predict churn risk for ${contact.name}`)}
                    className="w-full justify-start bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-red-500/30 transition-all duration-300 group h-auto py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center mr-3 group-hover:bg-red-500/30 transition-all">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-white">Churn Risk Analysis</p>
                      <p className="text-xs text-[#6F83A7]">Retention probability assessment</p>
                    </div>
                  </Button>
                </div>

                {/* Custom question button */}
                <div className="mt-4 pt-4 border-t border-[#EAB308]/20">
                  <Button
                    onClick={() => {
                      if (onOpenAI) onOpenAI();
                      toast.info('Opening AI Assistant for custom questions...');
                    }}
                    className="w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black font-medium shadow-lg shadow-[#EAB308]/20"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask Custom Question
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={fabricRightDrawerClass('max-w-[900px]')}
          >
            {/* Header */}
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-5" />
              
              <div className="relative px-8 py-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 shadow-lg shadow-[#57ACAF]/20">
                      <AvatarFallback className="text-white text-lg">
                        {contact.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-xl font-medium text-white mb-2">{contact.name}</h2>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getTypeColor(contact.type).bg} ${getTypeColor(contact.type).border} ${getTypeColor(contact.type).text} border`}>
                          {contact.type}
                        </Badge>
                        <Badge className={`${getStatusColor(contact.status).bg} ${getStatusColor(contact.status).border} ${getStatusColor(contact.status).text} border`}>
                          {contact.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-[#6F83A7] hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Company</p>
                    <p className="text-sm text-white truncate">{contact.company}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Orders</p>
                    <p className="text-lg text-white font-medium">{contact.totalOrders}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Total Value</p>
                    <p className="text-sm text-white font-medium">{contact.totalValue}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Last Contact</p>
                    <p className="text-xs text-white">{contact.lastContact}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center px-8 gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative px-5 py-3.5 text-sm transition-all duration-300 flex items-center gap-2
                        ${activeTab === tab.id ? 'text-[#57ACAF]' : 'text-[#6F83A7] hover:text-white'}
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="relative z-10">{tab.label}</span>
                      
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeContactTab"
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
                {renderTabContent()}
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 p-6 bg-gradient-to-b from-transparent to-white/[0.02]">
              <div className="flex gap-3">
                <Button
                  onClick={handleSendEmail}
                  className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20 py-6"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Email
                </Button>
                <Button
                  onClick={handleCall}
                  variant="outline"
                  className="flex-1 border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 py-6 bg-[rgba(255,255,255,0)]"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}