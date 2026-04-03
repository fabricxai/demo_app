import { useState } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MessageSquare, User, Building2, Mail, Phone, MapPin, 
  Calendar, Tag, Clock, Send, ThumbsUp, ThumbsDown, Minus,
  Sparkles, TrendingUp, AlertCircle, CheckCircle2, Target,
  Activity, BarChart3, Zap, ArrowRight, FileText, Link as LinkIcon,
  ExternalLink, ChevronRight, Globe, Linkedin, MessageCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { MarbimAIButton } from './MarbimAIButton';

interface ConversationMessage {
  id: number;
  sender: 'buyer' | 'team';
  senderName: string;
  message: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  aiAnalysis?: string;
}

interface ConversationDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  conversation: {
    id: number;
    contactName: string;
    company: string;
    channel: string;
    lastMessage: string;
    timestamp: string;
    status: string;
    intent: string;
    email?: string;
    phone?: string;
    location?: string;
    tags?: string[];
    totalMessages?: number;
    firstContact?: string;
    responseTime?: string;
    engagementScore?: number;
  };
  onAskMarbim?: (prompt: string) => void;
}

export function ConversationDetailDrawer({ 
  open, 
  onClose, 
  conversation,
  onAskMarbim 
}: ConversationDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Guard clause: don't render if conversation is null
  if (!conversation) {
    return null;
  }

  // Mock conversation thread data
  const conversationThread: ConversationMessage[] = [
    {
      id: 1,
      sender: 'buyer',
      senderName: conversation.contactName,
      message: 'Hi, I came across your company profile and I\'m interested in learning more about your organic cotton fabrics.',
      timestamp: '3 days ago',
      sentiment: 'positive',
      aiAnalysis: 'Initial interest signal - Product inquiry'
    },
    {
      id: 2,
      sender: 'team',
      senderName: 'Sarah Mitchell',
      message: 'Thank you for reaching out! We specialize in GOTS-certified organic cotton. I\'d be happy to send you our latest catalog and samples.',
      timestamp: '2 days ago',
      sentiment: 'positive'
    },
    {
      id: 3,
      sender: 'buyer',
      senderName: conversation.contactName,
      message: conversation.lastMessage,
      timestamp: conversation.timestamp,
      sentiment: 'positive',
      aiAnalysis: 'Strong buying signal - Requesting samples indicates high purchase intent'
    }
  ];

  // Mock activity timeline
  const activityTimeline = [
    {
      id: 1,
      type: 'message',
      channel: 'Email',
      action: 'Sent initial inquiry',
      timestamp: '3 days ago',
      details: 'Interested in organic cotton fabrics'
    },
    {
      id: 2,
      type: 'message',
      channel: 'Email',
      action: 'Reply sent by Sarah Mitchell',
      timestamp: '2 days ago',
      details: 'Offered catalog and samples'
    },
    {
      id: 3,
      type: 'action',
      channel: 'Email',
      action: 'Catalog opened',
      timestamp: '2 days ago',
      details: 'Viewed 8 pages, spent 4m 32s'
    },
    {
      id: 4,
      type: 'message',
      channel: conversation.channel,
      action: 'New reply received',
      timestamp: conversation.timestamp,
      details: conversation.lastMessage
    }
  ];

  // AI Insights
  const aiInsights = [
    {
      id: 1,
      title: 'High Purchase Intent Detected',
      description: 'Request for fabric samples indicates 85% likelihood of RFQ within 7 days',
      type: 'opportunity',
      confidence: 85,
      action: 'Send sample request form'
    },
    {
      id: 2,
      title: 'Optimal Response Time',
      description: 'Respond within 2 hours to maximize conversion probability (current window)',
      type: 'urgent',
      confidence: 92,
      action: 'Draft quick response'
    },
    {
      id: 3,
      title: 'Suggested Next Steps',
      description: 'Send personalized sample pack + pricing sheet for organic cotton range',
      type: 'recommendation',
      confidence: 78,
      action: 'View template'
    },
    {
      id: 4,
      title: 'Similar Lead Pattern Match',
      description: '3 similar conversations converted to RFQs worth avg $125K in past 90 days',
      type: 'insight',
      confidence: 88,
      action: 'View similar leads'
    }
  ];

  const handleAskMarbim = (prompt: string) => {
    if (onAskMarbim) {
      onAskMarbim(prompt);
    } else {
      toast.info('AI Assistant: ' + prompt);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: MessageSquare },
    { id: 'thread', label: 'Full Thread', icon: Activity },
    { id: 'contact', label: 'Contact Details', icon: User },
    { id: 'ai-analysis', label: 'AI Analysis', icon: Sparkles }
  ];

  const channelIcons: Record<string, any> = {
    'Email': Mail,
    'WhatsApp': MessageCircle,
    'LinkedIn': Linkedin,
    'Phone': Phone
  };

  const ChannelIcon = channelIcons[conversation.channel] || Mail;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={fabricRightDrawerClass('max-w-[1000px]')}
          >
            {/* Header */}
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }} />
              </div>

              <div className="relative px-8 py-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Channel Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20 flex-shrink-0">
                      <ChannelIcon className="w-6 h-6 text-white" />
                    </div>

                    {/* Title & Company */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-white text-xl truncate">{conversation.contactName}</h2>
                        <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                          {conversation.channel}
                        </Badge>
                        <Badge className={
                          conversation.intent === 'RFQ' ? 'bg-[#9333EA]/10 text-[#9333EA] border border-[#9333EA]/20' :
                          conversation.intent === 'Interest' ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20' :
                          conversation.intent === 'Info Request' ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20' :
                          'bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20'
                        }>
                          {conversation.intent}
                        </Badge>
                      </div>
                      <p className="text-[#6F83A7] flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {conversation.company}
                      </p>
                    </div>
                  </div>

                  {/* Close Button */}
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="text-[#6F83A7] hover:text-white hover:bg-white/5 flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Messages</div>
                    <div className="text-lg text-white">{conversation.totalMessages || 3}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">First Contact</div>
                    <div className="text-lg text-white">{conversation.firstContact || '3 days ago'}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Response Time</div>
                    <div className="text-lg text-white">{conversation.responseTime || '4.2h'}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Engagement</div>
                    <div className="text-lg text-[#57ACAF]">{conversation.engagementScore || 85}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center px-8 gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative px-5 py-3.5 text-sm transition-all duration-300 flex items-center gap-2
                      ${activeTab === tab.id ? 'text-[#57ACAF]' : 'text-[#6F83A7] hover:text-white'}
                    `}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="relative z-10">{tab.label}</span>
                    
                    {/* Animated underline */}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeConversationTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-8 py-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Recent Message Preview */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-[#57ACAF]" />
                          Latest Message
                        </h3>
                        <span className="text-xs text-[#6F83A7]">{conversation.timestamp}</span>
                      </div>
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 text-white">
                            {conversation.contactName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-white mb-1">{conversation.contactName}</div>
                          <div className="text-[#6F83A7] text-sm leading-relaxed">
                            "{conversation.lastMessage}"
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Analysis Badge */}
                      <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-[#EAB308] mb-1">AI Analysis</div>
                            <div className="text-sm text-white">Strong buying signal - Requesting samples indicates high purchase intent</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#EAB308]" />
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          className="w-full justify-start bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                          onClick={() => toast.success('Opening reply composer...')}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Reply Now
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                          onClick={() => handleAskMarbim('Draft a personalized response for this conversation')}
                        >
                          <Sparkles className="w-4 h-4 mr-2 text-[#EAB308]" />
                          AI Draft Reply
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                          onClick={() => toast.info('Creating RFQ from conversation...')}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Create RFQ
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                          onClick={() => toast.info('Scheduling follow-up...')}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule Follow-up
                        </Button>
                      </div>
                    </div>

                    {/* Contact Summary */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-[#57ACAF]" />
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-[#6F83A7] text-sm">{conversation.email || 'john.smith@trendwear.uk'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-[#6F83A7] text-sm">{conversation.phone || '+44 20 7123 4567'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-[#6F83A7] text-sm">{conversation.location || 'London, United Kingdom'}</span>
                        </div>
                        {conversation.tags && conversation.tags.length > 0 && (
                          <div className="flex items-start gap-3 pt-2">
                            <Tag className="w-4 h-4 text-[#6F83A7] mt-1" />
                            <div className="flex flex-wrap gap-2">
                              {conversation.tags.map((tag, idx) => (
                                <Badge key={idx} className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Recommendation Card */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-1">MARBIM Recommendation</h3>
                          <p className="text-sm text-[#6F83A7]">
                            Based on conversation analysis and similar lead patterns
                          </p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt="Analyze this conversation and provide detailed recommendations for next steps"
                          onAskMarbim={onAskMarbim}
                        />
                      </div>
                      <div className="bg-[#EAB308]/10 rounded-lg p-4 border border-[#EAB308]/20">
                        <div className="text-white mb-2">
                          <CheckCircle2 className="w-4 h-4 inline mr-2 text-[#EAB308]" />
                          Send personalized sample pack within 2 hours
                        </div>
                        <p className="text-sm text-[#6F83A7] mb-3">
                          Include GOTS-certified organic cotton samples (3-5 varieties) + pricing sheet for bulk orders. Similar leads converted at 85% rate with this approach.
                        </p>
                        <Button
                          size="sm"
                          className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
                          onClick={() => handleAskMarbim('Help me prepare a sample pack proposal for this lead')}
                        >
                          Prepare Sample Proposal
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Full Thread Tab */}
                {activeTab === 'thread' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#57ACAF]" />
                        Conversation Thread
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                        onClick={() => toast.info('Exporting conversation...')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    {/* Thread Messages */}
                    <div className="space-y-4">
                      {conversationThread.map((msg) => (
                        <div key={msg.id} className={`
                          bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5
                          ${msg.sender === 'team' ? 'ml-8' : ''}
                        `}>
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className={
                                msg.sender === 'buyer' 
                                  ? "bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 text-white"
                                  : "bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 text-black"
                              }>
                                {msg.senderName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white">{msg.senderName}</span>
                                {msg.sender === 'buyer' && (
                                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                                    Buyer
                                  </Badge>
                                )}
                                {msg.sender === 'team' && (
                                  <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                                    Team
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-[#6F83A7]">{msg.timestamp}</p>
                            </div>
                            {msg.sentiment && (
                              <div className="flex gap-1">
                                {msg.sentiment === 'positive' && <ThumbsUp className="w-4 h-4 text-[#57ACAF]" />}
                                {msg.sentiment === 'neutral' && <Minus className="w-4 h-4 text-[#6F83A7]" />}
                                {msg.sentiment === 'negative' && <ThumbsDown className="w-4 h-4 text-[#D0342C]" />}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-white mb-3 leading-relaxed">
                            {msg.message}
                          </div>

                          {msg.aiAnalysis && (
                            <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-xs text-[#EAB308] mb-1">AI Analysis</div>
                                  <div className="text-sm text-white">{msg.aiAnalysis}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Reply Box */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Send className="w-4 h-4 text-[#57ACAF]" />
                        <span className="text-white">Quick Reply</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3 min-h-[100px] text-[#6F83A7] text-sm">
                        Type your message here...
                      </div>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                          onClick={() => handleAskMarbim('Generate a professional response to this conversation')}
                        >
                          <Sparkles className="w-4 h-4 mr-2 text-[#EAB308]" />
                          AI Generate
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70"
                          onClick={() => toast.success('Reply sent!')}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Details Tab */}
                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    {/* Contact Profile */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start gap-4 mb-6">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 text-white text-xl">
                            {conversation.contactName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-white text-xl mb-1">{conversation.contactName}</h3>
                          <p className="text-[#6F83A7] mb-3">{conversation.company}</p>
                          <div className="flex flex-wrap gap-2">
                            {(conversation.tags || ['VIP', 'High Intent']).map((tag, idx) => (
                              <Badge key={idx} className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-[#6F83A7] mb-1">Email</div>
                          <div className="text-white flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#57ACAF]" />
                            <span className="text-sm">{conversation.email || 'john.smith@trendwear.uk'}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-[#6F83A7] mb-1">Phone</div>
                          <div className="text-white flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#57ACAF]" />
                            <span className="text-sm">{conversation.phone || '+44 20 7123 4567'}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-[#6F83A7] mb-1">Location</div>
                          <div className="text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#57ACAF]" />
                            <span className="text-sm">{conversation.location || 'London, UK'}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-[#6F83A7] mb-1">Company Website</div>
                          <div className="text-white flex items-center gap-2">
                            <Globe className="w-4 h-4 text-[#57ACAF]" />
                            <span className="text-sm">www.trendwear.uk</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Metrics */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#57ACAF]" />
                        Engagement Metrics
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <div className="text-xs text-[#6F83A7] mb-1">Total Messages</div>
                          <div className="text-2xl text-white">{conversation.totalMessages || 3}</div>
                          <div className="text-xs text-[#57ACAF] flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" />
                            Active
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <div className="text-xs text-[#6F83A7] mb-1">Engagement Score</div>
                          <div className="text-2xl text-[#57ACAF]">{conversation.engagementScore || 85}%</div>
                          <div className="text-xs text-[#57ACAF] flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" />
                            High
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <div className="text-xs text-[#6F83A7] mb-1">Avg Response</div>
                          <div className="text-2xl text-white">{conversation.responseTime || '4.2h'}</div>
                          <div className="text-xs text-[#57ACAF] flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" />
                            Fast
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#57ACAF]" />
                        Activity Timeline
                      </h3>
                      <div className="space-y-3">
                        {activityTimeline.map((activity, idx) => (
                          <div key={activity.id} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#57ACAF] mt-2 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white text-sm">{activity.action}</span>
                                <span className="text-xs text-[#6F83A7]">{activity.timestamp}</span>
                              </div>
                              <div className="text-xs text-[#6F83A7] mb-1">{activity.details}</div>
                              <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                                {activity.channel}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#57ACAF]" />
                        Internal Notes
                      </h3>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3 min-h-[80px] text-[#6F83A7] text-sm">
                        Add notes about this contact...
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                        onClick={() => toast.success('Note saved')}
                      >
                        Save Note
                      </Button>
                    </div>
                  </div>
                )}

                {/* AI Analysis Tab */}
                {activeTab === 'ai-analysis' && (
                  <div className="space-y-6">
                    {/* Intent Analysis */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white flex items-center gap-2">
                          <Target className="w-4 h-4 text-[#57ACAF]" />
                          Intent Analysis
                        </h3>
                        <MarbimAIButton
                          marbimPrompt="Explain how you analyze conversation intent and what signals you look for"
                          onAskMarbim={onAskMarbim}
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                          <span className="text-white">Purchase Intent</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/60" style={{width: '85%'}} />
                            </div>
                            <span className="text-[#57ACAF] text-sm font-medium">85%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                          <span className="text-white">Urgency Level</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/60" style={{width: '72%'}} />
                            </div>
                            <span className="text-[#EAB308] text-sm font-medium">72%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                          <span className="text-white">Sentiment Score</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/60" style={{width: '92%'}} />
                            </div>
                            <span className="text-[#57ACAF] text-sm font-medium">92%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="space-y-3">
                      {aiInsights.map((insight) => (
                        <div key={insight.id} className={`
                          bg-gradient-to-br border rounded-xl p-5
                          ${insight.type === 'urgent' ? 'from-[#D0342C]/10 to-[#D0342C]/5 border-[#D0342C]/20' :
                            insight.type === 'opportunity' ? 'from-[#57ACAF]/10 to-[#57ACAF]/5 border-[#57ACAF]/20' :
                            insight.type === 'recommendation' ? 'from-[#EAB308]/10 to-[#EAB308]/5 border-[#EAB308]/20' :
                            'from-white/5 to-white/[0.02] border-white/10'}
                        `}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                                ${insight.type === 'urgent' ? 'bg-[#D0342C]/20' :
                                  insight.type === 'opportunity' ? 'bg-[#57ACAF]/20' :
                                  insight.type === 'recommendation' ? 'bg-[#EAB308]/20' :
                                  'bg-white/10'}
                              `}>
                                {insight.type === 'urgent' && <AlertCircle className="w-5 h-5 text-[#D0342C]" />}
                                {insight.type === 'opportunity' && <TrendingUp className="w-5 h-5 text-[#57ACAF]" />}
                                {insight.type === 'recommendation' && <Sparkles className="w-5 h-5 text-[#EAB308]" />}
                                {insight.type === 'insight' && <BarChart3 className="w-5 h-5 text-white" />}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white mb-1">{insight.title}</h4>
                                <p className="text-sm text-[#6F83A7] mb-2">{insight.description}</p>
                                <div className="flex items-center gap-2">
                                  <Badge className={`text-xs
                                    ${insight.type === 'urgent' ? 'bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20' :
                                      insight.type === 'opportunity' ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20' :
                                      insight.type === 'recommendation' ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20' :
                                      'bg-white/10 text-white border border-white/20'}
                                  `}>
                                    {insight.confidence}% Confidence
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                            onClick={() => toast.info(`Action: ${insight.action}`)}
                          >
                            {insight.action}
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Similar Conversations */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white flex items-center gap-2">
                          <LinkIcon className="w-4 h-4 text-[#57ACAF]" />
                          Similar Successful Conversations
                        </h3>
                        <MarbimAIButton
                          marbimPrompt="Show me details about similar conversations that converted successfully"
                          onAskMarbim={onAskMarbim}
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                          <div>
                            <div className="text-white mb-1">Fashion Brand from UK</div>
                            <div className="text-xs text-[#6F83A7]">Converted to $125K RFQ in 5 days</div>
                          </div>
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                            92% Match
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                          <div>
                            <div className="text-white mb-1">European Retailer</div>
                            <div className="text-xs text-[#6F83A7]">Converted to $98K RFQ in 7 days</div>
                          </div>
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                            88% Match
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                          <div>
                            <div className="text-white mb-1">Sustainable Fashion Co</div>
                            <div className="text-xs text-[#6F83A7]">Converted to $142K RFQ in 4 days</div>
                          </div>
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                            85% Match
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 px-8 py-4 bg-gradient-to-r from-white/5 to-transparent">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  onClick={onClose}
                >
                  Close
                </Button>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    onClick={() => handleAskMarbim('Help me create an RFQ from this conversation')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create RFQ
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                    onClick={() => toast.success('Opening reply composer...')}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
