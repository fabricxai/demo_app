import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Edit2, Share2, Zap, ExternalLink, FileText, TrendingUp, 
  AlertCircle, CheckCircle, Clock, User, Calendar, DollarSign,
  Package, Factory, Truck, Shield, Leaf, Upload, Download,
  MessageSquare, Phone, Mail, Link as LinkIcon, Star, Building2
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { FabricRightDrawerSurface } from './fabric/FabricRightDrawer';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MarbimAIButton } from './MarbimAIButton';
import { Progress } from './ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export interface DetailDrawerData {
  id: string;
  title: string;
  subtitle?: string;
  type?: string;
  score?: number;
  country?: string;
  countryCode?: string;
  logo?: string;
  status?: {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'error';
  };
  
  // Overview Tab Data
  overview: {
    keyAttributes: { label: string; value: string; icon?: ReactNode }[];
    metrics?: { label: string; value: string; change?: string; trend?: 'up' | 'down' }[];
    description?: string;
    relatedLinks?: { label: string; module: string; onClick: () => void }[];
    chart?: ReactNode;
  };
  
  // Interaction History Tab (optional)
  interactions?: {
    date: string;
    type: 'email' | 'call' | 'meeting' | 'system' | 'whatsapp';
    description: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
  }[];
  
  // Documents Tab (optional)
  documents?: {
    name: string;
    type: string;
    uploadDate: string;
    uploader: string;
    tag?: string;
    aiSummary?: string;
  }[];
  
  // AI Insights Tab Data
  aiInsights: {
    summary: string;
    recommendations: {
      title: string;
      description: string;
      action: string;
      onClick: () => void;
    }[];
    visualInsight?: ReactNode;
    references?: string[];
  };
}

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: DetailDrawerData | null;
  module?: string;
  subPage?: string;
  currentTab?: string;
  onNavigateToFullPage?: () => void;
  onAskMarbim?: (prompt: string) => void;
}

export function DetailDrawer({ 
  isOpen, 
  onClose, 
  data,
  module = 'General',
  subPage = 'Dashboard',
  currentTab,
  onNavigateToFullPage,
  onAskMarbim,
}: DetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Handler to send prompt to AI and close this drawer
  const handleAskMarbim = (prompt: string) => {
    if (onAskMarbim) {
      onAskMarbim(prompt);
      onClose();
    }
  };

  if (!data) return null;

  const getStatusIcon = () => {
    switch (data.status?.variant) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 border-green-500/30';
      case 'negative': return 'text-red-400 border-red-500/30';
      default: return 'text-[#6F83A7] border-[#6F83A7]/30';
    }
  };

  // Determine which tabs to show
  const tabs = [
    { id: 'overview', label: 'Overview', show: true },
    { id: 'interactions', label: 'Interaction History', show: !!data.interactions },
    { id: 'documents', label: 'Documents', show: !!data.documents },
    { id: 'ai-insights', label: 'AI Insights', show: true },
  ].filter(tab => tab.show);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drawer */}
          <FabricRightDrawerSurface maxWidth="max-w-[480px]" className="overflow-hidden">
            {/* Sleek Modern Header */}
            <div className="relative border-b border-white/10 bg-gradient-to-br from-[#101725] via-[#182336] to-[#101725] overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_#EAB308_0%,_transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_#57ACAF_0%,_transparent_50%)]" />
              </div>

              {/* Close Button - Top Right */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-[#6F83A7] hover:text-white hover:bg-white/10 shrink-0 backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="relative p-6 pb-5">
                {/* Main Header Row */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Logo/Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-lg">
                      {data.logo ? (
                        <img 
                          src={data.logo} 
                          alt={data.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-7 h-7 text-[#57ACAF]" />
                      )}
                    </div>
                    {/* Score Badge Overlay */}
                    {data.score !== undefined && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                        className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#EAB308] to-[#F59E0B] shadow-lg"
                      >
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-black fill-black" />
                          <span className="text-xs text-black">{data.score}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex-1 min-w-0 pr-12">
                    {/* Title Row */}
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl text-white truncate flex-1">{data.title}</h2>
                      
                      {/* Country Flag with Tooltip */}
                      {data.countryCode && (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="shrink-0 w-8 h-8 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg cursor-pointer"
                              >
                                <img
                                  src={`https://flagcdn.com/w40/${data.countryCode.toLowerCase()}.png`}
                                  srcSet={`https://flagcdn.com/w80/${data.countryCode.toLowerCase()}.png 2x`}
                                  alt={data.country || data.countryCode}
                                  className="w-full h-full object-cover"
                                />
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent 
                              side="left" 
                              className="bg-[#0D1117] border-white/20 text-white shadow-xl"
                            >
                              <p className="text-sm">{data.country || data.countryCode}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>

                    {/* Type & Subtitle Row */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {data.type && (
                        <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30 text-xs">
                          {data.type}
                        </Badge>
                      )}
                      {data.status && (
                        <Badge 
                          className={`
                            text-xs gap-1.5
                            ${data.status.variant === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                            ${data.status.variant === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}
                            ${data.status.variant === 'error' ? 'bg-red-500/20 text-red-400 border-red-500/30' : ''}
                            ${data.status.variant === 'default' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                          `}
                        >
                          {getStatusIcon()}
                          {data.status.label}
                        </Badge>
                      )}
                    </div>

                    {/* Subtitle */}
                    {data.subtitle && (
                      <p className="text-sm text-[#6F83A7] mb-2">
                        {data.subtitle}
                      </p>
                    )}

                    {/* Breadcrumb */}
                    <p className="text-xs text-[#6F83A7]/60">
                      {module} → {subPage}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-2" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#EAB308] text-black shadow-lg shadow-[#EAB308]/30"
                  >
                    <Zap className="w-3.5 h-3.5 mr-2" />
                    Quick Action
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onNavigateToFullPage}
                    className="text-[#6F83A7] hover:text-white hover:bg-white/5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-2" />
                    Full Page
                  </Button>
                </div>
              </div>

              {/* Accent Line with Gradient */}
              <div className="relative h-1 bg-gradient-to-r from-transparent via-[#EAB308] to-transparent">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </div>
            </div>

            {/* Sleek Tabs Navigation */}
            <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center px-6 gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative px-4 py-3 text-xs transition-all duration-300
                      ${activeTab === tab.id 
                        ? 'text-[#EAB308]' 
                        : 'text-[#6F83A7] hover:text-white'
                      }
                    `}
                  >
                    {/* Tab Label */}
                    <span className="relative z-10">{tab.label}</span>
                    
                    {/* Active Tab Indicator */}
                    {activeTab === tab.id && (
                      <>
                        {/* Glow Effect */}
                        <motion.div
                          layoutId="tabGlow"
                          className="absolute inset-0 bg-gradient-to-b from-[#EAB308]/20 to-transparent rounded-t-lg"
                          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        />
                        {/* Bottom Border */}
                        <motion.div
                          layoutId="tabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#EAB308] via-[#F59E0B] to-[#EAB308]"
                          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        />
                        {/* Shimmer Effect */}
                        <motion.div
                          layoutId="tabShimmer"
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
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 space-y-6"
                >
                  {/* Key Attributes */}
                  <div>
                    <h3 className="text-sm text-[#6F83A7] mb-3">Key Information</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {data.overview.keyAttributes.map((attr, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#57ACAF]/30 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {attr.icon && (
                              <div className="text-[#57ACAF]">{attr.icon}</div>
                            )}
                            <span className="text-xs text-[#6F83A7]">{attr.label}</span>
                          </div>
                          <div className="text-sm text-white">{attr.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  {data.overview.metrics && data.overview.metrics.length > 0 && (
                    <div>
                      <h3 className="text-sm text-[#6F83A7] mb-3">Performance Metrics</h3>
                      <div className="space-y-2">
                        {data.overview.metrics.map((metric, index) => (
                          <div 
                            key={index}
                            className="p-3 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[#6F83A7]">{metric.label}</span>
                              {metric.change && (
                                <Badge 
                                  variant="outline"
                                  className={`text-xs ${
                                    metric.trend === 'up' 
                                      ? 'text-green-400 border-green-500/30' 
                                      : 'text-red-400 border-red-500/30'
                                  }`}
                                >
                                  <TrendingUp className={`w-3 h-3 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                                  {metric.change}
                                </Badge>
                              )}
                            </div>
                            <div className="text-lg text-white mt-1">{metric.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {data.overview.description && (
                    <div>
                      <h3 className="text-sm text-[#6F83A7] mb-3">Summary</h3>
                      <p className="text-sm text-white/80 leading-relaxed p-4 rounded-xl bg-white/5 border border-white/10">
                        {data.overview.description}
                      </p>
                    </div>
                  )}

                  {/* Related Links */}
                  {data.overview.relatedLinks && data.overview.relatedLinks.length > 0 && (
                    <div>
                      <h3 className="text-sm text-[#6F83A7] mb-3">Quick Access</h3>
                      <div className="flex flex-wrap gap-2">
                        {data.overview.relatedLinks.map((link, index) => (
                          <button
                            key={index}
                            onClick={link.onClick}
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10 hover:border-[#57ACAF]/50 transition-all flex items-center gap-2"
                          >
                            <LinkIcon className="w-3 h-3" />
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chart */}
                  {data.overview.chart && (
                    <div>
                      <h3 className="text-sm text-[#6F83A7] mb-3">Trend Analysis</h3>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        {data.overview.chart}
                      </div>
                    </div>
                  )}

                  {/* AI Context Note */}
                  <MarbimAIButton
                    prompt={`Analyze details for ${data.title} in ${module} module`}
                    label="Get AI Analysis"
                    onAskMarbim={handleAskMarbim}
                  />
                </motion.div>
              )}

              {/* Interaction History Tab */}
              {activeTab === 'interactions' && data.interactions && (
                <motion.div
                  key="interactions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm text-[#6F83A7]">Timeline</h3>
                      <MarbimAIButton
                        prompt={`Summarize interaction history for ${data.title}`}
                        label="Summarize"
                        size="sm"
                        onAskMarbim={handleAskMarbim}
                      />
                    </div>

                    {data.interactions.map((interaction, index) => (
                      <div 
                        key={index}
                        className="relative pl-8 pb-4 border-l-2 border-white/10 last:border-l-0 last:pb-0"
                      >
                        {/* Timeline Dot */}
                        <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-[#57ACAF] border-2 border-[#0D1117] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>

                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#57ACAF]/30 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="text-[#57ACAF]">
                                {getInteractionIcon(interaction.type)}
                              </div>
                              <span className="text-xs text-[#6F83A7] capitalize">
                                {interaction.type}
                              </span>
                            </div>
                            <span className="text-xs text-[#6F83A7]">
                              {interaction.date}
                            </span>
                          </div>
                          <p className="text-sm text-white/80 mb-2">
                            {interaction.description}
                          </p>
                          {interaction.sentiment && (
                            <Badge 
                              variant="outline"
                              className={`text-xs ${getSentimentColor(interaction.sentiment)}`}
                            >
                              {interaction.sentiment} tone
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && data.documents && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm text-[#6F83A7]">Attached Files</h3>
                      <Button
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      >
                        <Upload className="w-3.5 h-3.5 mr-2" />
                        Upload
                      </Button>
                    </div>

                    {data.documents.map((doc, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#57ACAF]/50 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText className="w-5 h-5 text-[#57ACAF] shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white truncate">{doc.name}</div>
                              <div className="text-xs text-[#6F83A7]">
                                {doc.type} • {doc.uploadDate} • {doc.uploader}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[#6F83A7] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>

                        {doc.tag && (
                          <Badge className="mb-2 bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30">
                            {doc.tag}
                          </Badge>
                        )}

                        {doc.aiSummary && (
                          <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-[#EAB308]/10 to-[#57ACAF]/10 border border-[#EAB308]/20">
                            <div className="text-xs text-[#EAB308] mb-1 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              AI Summary
                            </div>
                            <p className="text-xs text-white/80">{doc.aiSummary}</p>
                          </div>
                        )}
                      </div>
                    ))}

                    <MarbimAIButton
                      prompt={`Analyze all documents for ${data.title}`}
                      label="AI Document Analysis"
                    />
                  </div>
                </motion.div>
              )}

              {/* AI Insights Tab */}
              {activeTab === 'ai-insights' && (
                <motion.div
                  key="ai-insights"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  <div className="space-y-6">
                    {/* AI Summary */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#EAB308]/20 to-[#57ACAF]/20 border border-[#EAB308]/30">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EAB308]/30 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-[#EAB308]" />
                        </div>
                        <h3 className="text-sm text-[#EAB308]">AI Analysis</h3>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed">
                        {data.aiInsights.summary}
                      </p>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h3 className="text-sm text-[#6F83A7] mb-3">Recommended Actions</h3>
                      <div className="space-y-3">
                        {data.aiInsights.recommendations.map((rec, index) => (
                          <div 
                            key={index}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#EAB308]/30 transition-all"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-sm text-white">{rec.title}</h4>
                            </div>
                            <p className="text-xs text-[#6F83A7] mb-3">
                              {rec.description}
                            </p>
                            <Button
                              size="sm"
                              onClick={rec.onClick}
                              className="bg-gradient-to-r from-[#EAB308] to-[#57ACAF] hover:from-[#F59E0B] hover:to-[#57ACAF] text-black"
                            >
                              <Zap className="w-3.5 h-3.5 mr-2" />
                              {rec.action}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visual Insight */}
                    {data.aiInsights.visualInsight && (
                      <div>
                        <h3 className="text-sm text-[#6F83A7] mb-3">Predictive Analysis</h3>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          {data.aiInsights.visualInsight}
                        </div>
                      </div>
                    )}

                    {/* References */}
                    {data.aiInsights.references && data.aiInsights.references.length > 0 && (
                      <div>
                        <h3 className="text-sm text-[#6F83A7] mb-3">Data Sources</h3>
                        <div className="space-y-1">
                          {data.aiInsights.references.map((ref, index) => (
                            <div 
                              key={index}
                              className="text-xs text-[#6F83A7] flex items-center gap-2"
                            >
                              <div className="w-1 h-1 rounded-full bg-[#57ACAF]" />
                              {ref}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Assistant CTA */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-white mb-1">Need deeper insights?</div>
                          <div className="text-xs text-[#6F83A7]">
                            Ask MARBIM for detailed analysis
                          </div>
                        </div>
                        <MarbimAIButton
                          prompt={`Provide detailed analysis for ${data.title} in ${module} module`}
                          label="Ask AI"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </FabricRightDrawerSurface>
        </>
      )}
    </AnimatePresence>
  );
}
