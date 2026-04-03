import { motion, AnimatePresence } from 'motion/react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { useState } from 'react';
import { 
  X, Edit2, Play, Pause, Send, Copy, Download, BarChart3, 
  Users, Mail, MousePointer, TrendingUp, Calendar, Clock,
  Target, Zap, AlertCircle, CheckCircle, Eye, MessageSquare,
  Globe, MapPin, Award, Sparkles, RefreshCw, Settings, Trash2
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
} from 'recharts';

interface CampaignDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: any;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
}

export function CampaignDetailDrawer({ 
  isOpen, 
  onClose, 
  campaign,
  onAskMarbim,
  onOpenAI
}: CampaignDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreating, setIsCreating] = useState(false);

  // Form state for new campaigns
  const [formData, setFormData] = useState({
    name: '',
    audience: '',
    description: '',
    sendWindow: '',
  });

  // Handler to send prompt to AI and close this drawer
  const handleAskMarbim = (prompt: string) => {
    if (onAskMarbim) {
      onAskMarbim(prompt);
    }
    if (onOpenAI) {
      onOpenAI();
    }
  };

  // Handle creating a new campaign
  const handleCreateCampaign = () => {
    if (!formData.name || !formData.audience) {
      toast.error('Please fill in campaign name and audience');
      return;
    }

    // TODO: Save to database
    toast.success('Campaign created successfully!');
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      audience: '',
      description: '',
      sendWindow: '',
    });
    setIsCreating(false);
  };

  // Check if we're creating a new campaign
  const isNewCampaign = !campaign;

  if (!isOpen) return null;

  // Mock data for campaign details
  const campaignStats = {
    sent: 2847,
    delivered: 2735,
    opened: 1864,
    clicked: 658,
    replied: 428,
    converted: 356,
    bounced: 112,
    unsubscribed: 24,
  };

  const engagementOverTime = [
    { day: 'Day 1', opens: 420, clicks: 145, replies: 85 },
    { day: 'Day 2', opens: 385, clicks: 132, replies: 78 },
    { day: 'Day 3', opens: 298, clicks: 98, replies: 62 },
    { day: 'Day 4', opens: 245, clicks: 85, replies: 54 },
    { day: 'Day 5', opens: 312, clicks: 108, replies: 68 },
    { day: 'Day 6', opens: 204, clicks: 90, replies: 81 },
  ];

  const audienceSegments = [
    { name: 'High-Value Buyers', count: 842, color: '#EAB308' },
    { name: 'Mid-Market', count: 1245, color: '#57ACAF' },
    { name: 'Small Business', count: 760, color: '#6F83A7' },
  ];

  const topPerformingEmails = [
    { subject: 'Exclusive Fabric Collection 2024', openRate: 74, ctr: 28, replies: 142 },
    { subject: 'Limited Time Offer: 15% Off', openRate: 68, ctr: 24, replies: 118 },
    { subject: 'New Sustainable Materials', openRate: 71, ctr: 26, replies: 128 },
  ];

  const recentActivities = [
    { 
      timestamp: '2 hours ago', 
      type: 'reply',
      contact: 'John Smith - TrendWear UK',
      message: 'Interested in the sustainable fabrics. Can we schedule a call?',
      sentiment: 'positive'
    },
    { 
      timestamp: '4 hours ago', 
      type: 'click',
      contact: 'Emma Wilson - Fashion Global',
      message: 'Clicked on pricing page link',
      sentiment: 'neutral'
    },
    { 
      timestamp: '6 hours ago', 
      type: 'open',
      contact: 'Sophie Martin - EcoFashion EU',
      message: 'Opened email: Exclusive Fabric Collection 2024',
      sentiment: 'neutral'
    },
    { 
      timestamp: '8 hours ago', 
      type: 'reply',
      contact: 'Michael Chen - Urban Wear',
      message: 'Thanks for reaching out. Please send catalog.',
      sentiment: 'positive'
    },
  ];

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'reply': return MessageSquare;
      case 'click': return MousePointer;
      case 'open': return Eye;
      default: return Mail;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return '#57ACAF';
      case 'negative': return '#D0342C';
      default: return '#6F83A7';
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
            className={fabricRightDrawerClass('max-w-[900px]', 'overflow-hidden')}
          >
            {/* Check if creating new or viewing existing */}
            {isNewCampaign ? (
              // Creation Form
              <>
                {/* Header */}
                <div className="relative px-8 py-6 border-b border-white/10 bg-gradient-to-r from-[#EAB308]/5 via-transparent to-[#57ACAF]/5">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      backgroundSize: '32px 32px'
                    }} />
                  </div>

                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                        <Send className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h2 className="text-2xl text-white">Create New Campaign</h2>
                        <p className="text-sm text-[#6F83A7]">Set up automated outreach with AI assistance</p>
                      </div>
                    </div>
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

                {/* Creation Form Content */}
                <ScrollArea className="flex-1 custom-scrollbar">
                  <div className="px-8 py-6 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-[#6F83A7] mb-2 block">Campaign Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-[#6F83A7] focus:outline-none focus:border-[#EAB308]/50"
                          placeholder="e.g., EU Fashion Outreach Q1 2024"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-[#6F83A7] mb-2 block">Target Audience *</label>
                        <input
                          type="text"
                          value={formData.audience}
                          onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-[#6F83A7] focus:outline-none focus:border-[#EAB308]/50"
                          placeholder="e.g., EU Buyers, High-Value Leads"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-[#6F83A7] mb-2 block">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-[#6F83A7] focus:outline-none focus:border-[#EAB308]/50 resize-none"
                          placeholder="Describe the campaign goals and strategy..."
                        />
                      </div>

                      <div>
                        <label className="text-sm text-[#6F83A7] mb-2 block">Send Window</label>
                        <input
                          type="text"
                          value={formData.sendWindow}
                          onChange={(e) => setFormData({ ...formData, sendWindow: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-[#6F83A7] focus:outline-none focus:border-[#EAB308]/50"
                          placeholder="e.g., 2024-10-20 - 2024-11-20"
                        />
                      </div>
                    </div>

                    {/* AI Suggestion Card */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white mb-2">AI Campaign Tips</div>
                          <div className="text-sm text-[#6F83A7] leading-relaxed">
                            • Target specific segments for better conversion rates<br />
                            • Schedule sends during business hours (9 AM - 5 PM local time)<br />
                            • Use personalized subject lines to increase open rates by 26%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleCreateCampaign}
                        className="flex-1 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-lg shadow-[#EAB308]/20"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Create Campaign
                      </Button>
                      <Button
                        onClick={onClose}
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </>
            ) : (
              // Existing Campaign Detail View
              <>
            {/* Header */}
            <div className="relative px-8 py-6 border-b border-white/10 bg-gradient-to-r from-[#EAB308]/5 via-transparent to-[#57ACAF]/5">
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
                      <Send className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl text-white">{campaign.name}</h2>
                        <Badge className={
                          campaign.status === 'Active' 
                            ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20' 
                            : 'bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20'
                        }>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6F83A7]">
                        <span className="flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" />
                          {campaign.campaignId}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {campaign.sendWindow}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Sent</div>
                      <div className="text-lg text-white">{campaignStats.sent.toLocaleString()}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Open Rate</div>
                      <div className="text-lg text-white">{((campaignStats.opened / campaignStats.sent) * 100).toFixed(1)}%</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">CTR</div>
                      <div className="text-lg text-white">{((campaignStats.clicked / campaignStats.sent) * 100).toFixed(1)}%</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
                      <div className="text-xs text-[#EAB308] mb-1">Conversion</div>
                      <div className="text-lg text-white">{campaign.conversionRate}%</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-start gap-2 ml-6">
                  {campaign.status === 'Active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      onClick={() => toast.success('Campaign paused')}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {campaign.status === 'Completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5"
                      onClick={() => toast.success('Duplicating campaign')}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    onClick={() => toast.info('Edit campaign')}
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

            {/* Sleek Tabs Navigation - Consistent with DetailDrawer */}
            <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center px-8 gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'performance', label: 'Performance', icon: TrendingUp },
                  { id: 'audience', label: 'Audience', icon: Users },
                  { id: 'activity', label: 'Activity', icon: MessageSquare },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative px-5 py-3.5 text-sm transition-all duration-300 flex items-center gap-2
                        ${activeTab === tab.id 
                          ? 'text-[#EAB308]' 
                          : 'text-[#6F83A7] hover:text-white'
                        }
                      `}
                    >
                      {/* Tab Icon & Label */}
                      <Icon className="w-4 h-4" />
                      <span className="relative z-10">{tab.label}</span>
                      
                      {/* Active Tab Indicator */}
                      {activeTab === tab.id && (
                        <>
                          {/* Glow Effect */}
                          <motion.div
                            layoutId="campaignTabGlow"
                            className="absolute inset-0 bg-gradient-to-b from-[#EAB308]/20 to-transparent rounded-t-lg"
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                          />
                          {/* Bottom Border */}
                          <motion.div
                            layoutId="campaignTabIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#EAB308] via-[#F59E0B] to-[#EAB308]"
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                          />
                          {/* Shimmer Effect */}
                          <motion.div
                            layoutId="campaignTabShimmer"
                            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                          />
                        </>
                      )}
                      
                      {/* Hover Effect for Inactive Tabs */}
                      {activeTab !== tab.id && (
                        <div className="absolute inset-0 bg-white/0 hover:bg-white/5 rounded-t-lg transition-colors duration-200" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full custom-scrollbar">
                <div className="px-8 py-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Campaign Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-1">Delivered</div>
                            <div className="text-3xl text-white">{campaignStats.delivered.toLocaleString()}</div>
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                          </div>
                        </div>
                        <Progress 
                          value={(campaignStats.delivered / campaignStats.sent) * 100} 
                          className="h-1.5"
                        />
                        <div className="text-xs text-[#6F83A7] mt-2">
                          {((campaignStats.delivered / campaignStats.sent) * 100).toFixed(1)}% delivery rate
                        </div>
                      </div>

                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-1">Opened</div>
                            <div className="text-3xl text-white">{campaignStats.opened.toLocaleString()}</div>
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/10 flex items-center justify-center">
                            <Eye className="w-5 h-5 text-[#EAB308]" />
                          </div>
                        </div>
                        <Progress 
                          value={(campaignStats.opened / campaignStats.delivered) * 100} 
                          className="h-1.5"
                        />
                        <div className="text-xs text-[#6F83A7] mt-2">
                          {((campaignStats.opened / campaignStats.delivered) * 100).toFixed(1)}% open rate
                        </div>
                      </div>

                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-1">Clicked</div>
                            <div className="text-3xl text-white">{campaignStats.clicked.toLocaleString()}</div>
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/10 flex items-center justify-center">
                            <MousePointer className="w-5 h-5 text-[#6F83A7]" />
                          </div>
                        </div>
                        <Progress 
                          value={(campaignStats.clicked / campaignStats.opened) * 100} 
                          className="h-1.5"
                        />
                        <div className="text-xs text-[#6F83A7] mt-2">
                          {((campaignStats.clicked / campaignStats.opened) * 100).toFixed(1)}% click-through rate
                        </div>
                      </div>

                      <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-sm text-[#EAB308] mb-1">Converted</div>
                            <div className="text-3xl text-white">{campaignStats.converted.toLocaleString()}</div>
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                            <Target className="w-5 h-5 text-[#EAB308]" />
                          </div>
                        </div>
                        <Progress 
                          value={(campaignStats.converted / campaignStats.sent) * 100} 
                          className="h-1.5"
                        />
                        <div className="text-xs text-[#EAB308] mt-2">
                          {campaign.conversionRate}% conversion rate
                        </div>
                      </div>
                    </div>

                    {/* Engagement Over Time Chart */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white">Engagement Over Time</h3>
                        <MarbimAIButton
                          prompt={`Analyze the engagement trends over time for the "${campaign.name}" campaign (ID: ${campaign.campaignId}). Current metrics: ${campaignStats.sent.toLocaleString()} sent, ${((campaignStats.opened / campaignStats.sent) * 100).toFixed(1)}% open rate, ${((campaignStats.clicked / campaignStats.sent) * 100).toFixed(1)}% CTR, ${campaign.conversionRate}% conversion rate. The data shows ${engagementOverTime.length} days of activity with opens ranging from ${Math.min(...engagementOverTime.map(d => d.opens))} to ${Math.max(...engagementOverTime.map(d => d.opens))}. What patterns indicate success? What days showed drop-off? What specific optimizations should we implement to improve engagement trajectory?`}
                          onAskMarbim={handleAskMarbim}
                        />
                      </div>
                      <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={engagementOverTime}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis dataKey="day" stroke="#6F83A7" />
                          <YAxis stroke="#6F83A7" />
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: '#1a1f2e', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px'
                            }}
                          />
                          <Line type="monotone" dataKey="opens" stroke="#57ACAF" strokeWidth={2} />
                          <Line type="monotone" dataKey="clicks" stroke="#EAB308" strokeWidth={2} />
                          <Line type="monotone" dataKey="replies" stroke="#6F83A7" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="flex items-center justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#57ACAF]" />
                          <span className="text-sm text-[#6F83A7]">Opens</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#EAB308]" />
                          <span className="text-sm text-[#6F83A7]">Clicks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#6F83A7]" />
                          <span className="text-sm text-[#6F83A7]">Replies</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights Card */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3 justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white mb-2">AI Campaign Insights</div>
                            <div className="text-sm text-[#6F83A7] leading-relaxed">
                              This campaign is performing <span className="text-[#57ACAF]">above average</span> with a {campaign.conversionRate}% conversion rate. 
                              Peak engagement occurs <span className="text-[#EAB308]">2-4 hours after send</span>. Consider A/B testing subject lines to improve open rates by an estimated 8-12%.
                            </div>
                          </div>
                        </div>
                        <MarbimAIButton
                          prompt={`Provide comprehensive insights and actionable optimization recommendations for the "${campaign.name}" campaign. Campaign Details: Status=${campaign.status}, Target Audience=${campaign.audience}, Send Window=${campaign.sendWindow}. Current Performance: ${campaignStats.sent.toLocaleString()} emails sent, ${campaignStats.delivered.toLocaleString()} delivered (${((campaignStats.delivered / campaignStats.sent) * 100).toFixed(1)}%), ${campaignStats.opened.toLocaleString()} opened (${((campaignStats.opened / campaignStats.sent) * 100).toFixed(1)}%), ${campaignStats.clicked.toLocaleString()} clicked (${((campaignStats.clicked / campaignStats.sent) * 100).toFixed(1)}%), ${campaignStats.converted.toLocaleString()} converted (${campaign.conversionRate}%). Negative metrics: ${campaignStats.bounced} bounced, ${campaignStats.unsubscribed} unsubscribed. Based on this complete performance data, what specific optimizations would improve conversion rate, reduce bounce/unsubscribe rates, and maximize ROI? Include A/B testing suggestions, timing optimization, content improvements, and audience segmentation strategies.`}
                          onAskMarbim={handleAskMarbim}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white">Top Performing Emails</h3>
                        <MarbimAIButton
                          prompt={`Analyze the top performing emails in the "${campaign.name}" campaign and explain what makes them successful. Email #1: "${topPerformingEmails[0].subject}" - ${topPerformingEmails[0].openRate}% open rate, ${topPerformingEmails[0].ctr}% CTR, ${topPerformingEmails[0].replies} replies. Email #2: "${topPerformingEmails[1].subject}" - ${topPerformingEmails[1].openRate}% open rate, ${topPerformingEmails[1].ctr}% CTR, ${topPerformingEmails[1].replies} replies. Email #3: "${topPerformingEmails[2].subject}" - ${topPerformingEmails[2].openRate}% open rate, ${topPerformingEmails[2].ctr}% CTR, ${topPerformingEmails[2].replies} replies. What specific elements (subject line structure, value proposition, timing, call-to-action) make these emails outperform others? Provide concrete, actionable recommendations for improving future campaign emails based on these winning patterns.`}
                          onAskMarbim={handleAskMarbim}
                        />
                      </div>
                      <div className="space-y-3">
                        {topPerformingEmails.map((email, index) => (
                          <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="text-white mb-1">{email.subject}</div>
                                <div className="text-xs text-[#6F83A7]">{email.replies} replies</div>
                              </div>
                              <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                                #{index + 1}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs text-[#6F83A7] mb-1">Open Rate</div>
                                <div className="flex items-center gap-2">
                                  <Progress value={email.openRate} className="h-1.5 flex-1" />
                                  <span className="text-sm text-white">{email.openRate}%</span>
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-[#6F83A7] mb-1">Click Rate</div>
                                <div className="flex items-center gap-2">
                                  <Progress value={email.ctr} className="h-1.5 flex-1" />
                                  <span className="text-sm text-white">{email.ctr}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Negative Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-1">Bounced</div>
                            <div className="text-2xl text-white">{campaignStats.bounced}</div>
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-[#D0342C]/10 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-[#D0342C]" />
                          </div>
                        </div>
                        <div className="text-xs text-[#6F83A7]">
                          {((campaignStats.bounced / campaignStats.sent) * 100).toFixed(2)}% bounce rate
                        </div>
                      </div>

                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-1">Unsubscribed</div>
                            <div className="text-2xl text-white">{campaignStats.unsubscribed}</div>
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/10 flex items-center justify-center">
                            <X className="w-5 h-5 text-[#6F83A7]" />
                          </div>
                        </div>
                        <div className="text-xs text-[#6F83A7]">
                          {((campaignStats.unsubscribed / campaignStats.sent) * 100).toFixed(2)}% unsubscribe rate
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Audience Tab */}
                {activeTab === 'audience' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-white mb-1">Audience Segments</h3>
                          <p className="text-sm text-[#6F83A7]">{campaign.audience}</p>
                        </div>
                        <MarbimAIButton
                          prompt={`Analyze the performance of audience segments in the "${campaign.name}" campaign targeting ${campaign.audience}. Segment breakdown: ${audienceSegments[0].name} (${audienceSegments[0].count.toLocaleString()} contacts), ${audienceSegments[1].name} (${audienceSegments[1].count.toLocaleString()} contacts), ${audienceSegments[2].name} (${audienceSegments[2].count.toLocaleString()} contacts). Total audience: ${audienceSegments.reduce((sum, seg) => sum + seg.count, 0).toLocaleString()} contacts. Based on the distribution and campaign performance metrics (${campaign.conversionRate}% overall conversion, ${((campaignStats.opened / campaignStats.sent) * 100).toFixed(1)}% open rate), which segments are performing best? Which should we prioritize for future campaigns? Should we adjust our targeting strategy, create segment-specific messaging, or reallocate budget across segments?`}
                          onAskMarbim={handleAskMarbim}
                        />
                      </div>

                      <div className="flex items-center justify-center mb-6">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={audienceSegments}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              dataKey="count"
                              label
                            >
                              {audienceSegments.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip 
                              contentStyle={{ 
                                backgroundColor: '#1a1f2e', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-3">
                        {audienceSegments.map((segment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: segment.color }}
                              />
                              <span className="text-white">{segment.name}</span>
                            </div>
                            <div className="text-[#6F83A7]">
                              {segment.count.toLocaleString()} contacts
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="text-sm text-[#6F83A7] mb-2">Total Audience</div>
                        <div className="text-2xl text-white mb-1">{campaignStats.sent.toLocaleString()}</div>
                        <div className="text-xs text-[#57ACAF]">100% coverage</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="text-sm text-[#6F83A7] mb-2">Engaged</div>
                        <div className="text-2xl text-white mb-1">{campaignStats.opened.toLocaleString()}</div>
                        <div className="text-xs text-[#EAB308]">{((campaignStats.opened / campaignStats.sent) * 100).toFixed(1)}% engaged</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="text-sm text-[#6F83A7] mb-2">Active</div>
                        <div className="text-2xl text-white mb-1">{campaignStats.clicked.toLocaleString()}</div>
                        <div className="text-xs text-[#6F83A7]">{((campaignStats.clicked / campaignStats.sent) * 100).toFixed(1)}% active</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white">Recent Activity</h3>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                          onClick={() => toast.info('Refreshing activity feed')}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {recentActivities.map((activity, index) => {
                          const Icon = getActivityIcon(activity.type);
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ 
                                    backgroundColor: `${getSentimentColor(activity.sentiment)}15`,
                                    borderColor: `${getSentimentColor(activity.sentiment)}30`,
                                    borderWidth: '1px'
                                  }}
                                >
                                  <Icon 
                                    className="w-5 h-5" 
                                    style={{ color: getSentimentColor(activity.sentiment) }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-1">
                                    <span className="text-white">{activity.contact}</span>
                                    <span className="text-xs text-[#6F83A7]">{activity.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-[#6F83A7]">{activity.message}</p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                      <div className="flex items-start gap-3 justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-5 h-5 text-[#57ACAF]" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white mb-2">AI Next Best Action</div>
                            <div className="text-sm text-[#6F83A7] leading-relaxed">
                              {campaignStats.replied} leads have replied and are waiting for follow-up. 
                              MARBIM recommends prioritizing the <span className="text-[#EAB308]">15 high-intent leads</span> for immediate response to maximize conversion potential.
                            </div>
                          </div>
                        </div>
                        <MarbimAIButton
                          prompt={`Provide strategic next best actions for the "${campaign.name}" campaign (ID: ${campaign.campaignId}) to maximize conversion rate and ROI. Current Situation: ${campaignStats.replied.toLocaleString()} leads have replied (${((campaignStats.replied / campaignStats.sent) * 100).toFixed(1)}% reply rate), ${campaignStats.converted.toLocaleString()} have converted (${campaign.conversionRate}% conversion rate), ${campaignStats.clicked.toLocaleString()} clicked links but haven't replied. Recent Activity Summary: ${recentActivities.filter(a => a.type === 'reply').length} recent replies (${recentActivities.filter(a => a.sentiment === 'positive').length} positive sentiment), ${recentActivities.filter(a => a.type === 'click').length} link clicks, ${recentActivities.filter(a => a.type === 'open').length} email opens. Campaign Status: ${campaign.status}. What are the top 5 immediate actions to take? Should we: (1) prioritize follow-up with high-intent leads, (2) re-engage clicked-but-no-reply contacts, (3) adjust campaign timing/frequency, (4) modify messaging for specific segments, or (5) implement automated nurture sequences? Provide specific, prioritized recommendations with expected impact on conversion rate.`}
                          onAskMarbim={handleAskMarbim}
                        />
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </ScrollArea>
            </div>
            </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}