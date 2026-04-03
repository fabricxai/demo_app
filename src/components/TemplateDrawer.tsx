import { motion } from 'motion/react';
import { cn } from './ui/utils';
import { fabricSheetChromeClass } from './fabric/drawerChrome';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import {
  FileText, Mail, Eye, Clock, Settings, Copy, Edit, Trash2,
  BarChart2, X, Sparkles, Zap, Send, TrendingUp, MessageSquare,
  AlertTriangle, CheckCircle, Plus
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  LineChart as RechartsLine,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { MarbimAIButton } from './MarbimAIButton';

interface TemplateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: any;
  drawerAction: 'preview' | 'edit' | 'use';
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAskMarbim?: (prompt: string) => void;
}

export function TemplateDrawer({
  open,
  onOpenChange,
  selectedTemplate,
  drawerAction,
  activeTab,
  onTabChange,
  onAskMarbim,
}: TemplateDrawerProps) {
  if (!selectedTemplate) return null;

  // Safe clipboard copy function
  const copyToClipboard = async (text: string, successMessage: string) => {
    try {
      // Try using the Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast.success(successMessage);
      } else {
        // Fallback for browsers that don't support Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success(successMessage);
        } catch (err) {
          toast.error('Failed to copy to clipboard');
        }
        textArea.remove();
      }
    } catch (err) {
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success(successMessage);
      } catch (fallbackErr) {
        toast.error('Failed to copy to clipboard');
      }
      textArea.remove();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          'w-full sm:max-w-3xl bg-gradient-to-br from-[#101725] to-[#182336] border-l border-white/10 overflow-y-auto p-0',
          fabricSheetChromeClass(),
        )}
      >
        <>
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 text-[#6F83A7] hover:text-white hover:bg-white/10 shrink-0 backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Premium Header with Glassmorphism */}
          <div className="relative px-8 pt-8 pb-6 border-b border-white/10 backdrop-blur-xl">
            {/* Background Gradient Orb */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#57ACAF]/5 rounded-full blur-3xl -z-10" />
            
            <div className="flex items-start gap-5 mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/40 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#57ACAF]/30 to-[#57ACAF]/10 border border-[#57ACAF]/40 backdrop-blur-sm">
                  <FileText className="w-8 h-8 text-[#57ACAF]" />
                </div>
              </div>
              
              <div className="flex-1">
                <SheetTitle className="text-white text-3xl mb-3 tracking-tight">
                  {selectedTemplate.name}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  {drawerAction === 'preview' ? 'Preview email template' : drawerAction === 'edit' ? 'Edit email template' : 'Use email template'}
                </SheetDescription>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#57ACAF]/20 to-[#57ACAF]/10 border border-[#57ACAF]/40 backdrop-blur-sm">
                    <span className="text-[#57ACAF] text-sm">
                      <Mail className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
                      {selectedTemplate.subject}
                    </span>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-[#6F83A7] text-sm">
                      Used {selectedTemplate.uses} times
                    </span>
                  </div>
                  <Badge 
                    className={`
                      ${selectedTemplate.variant === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}
                      ${selectedTemplate.variant === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}
                    `}
                  >
                    {selectedTemplate.performance}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-4 backdrop-blur-sm hover:border-[#57ACAF]/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#57ACAF]/0 to-[#57ACAF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="text-[#6F83A7] text-xs uppercase tracking-wider mb-1">Open Rate</div>
                  <div className="text-white text-2xl">68%</div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-4 backdrop-blur-sm hover:border-[#EAB308]/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EAB308]/0 to-[#EAB308]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="text-[#6F83A7] text-xs uppercase tracking-wider mb-1">Reply Rate</div>
                  <div className="text-white text-2xl">42%</div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-4 backdrop-blur-sm hover:border-[#6F83A7]/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6F83A7]/0 to-[#6F83A7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="text-[#6F83A7] text-xs uppercase tracking-wider mb-1">Conversion</div>
                  <div className="text-white text-2xl">28%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Accent Line with Gradient */}
          <div className="relative h-1 bg-gradient-to-r from-transparent via-[#57ACAF] to-transparent">
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

          {/* Sleek Tabs Navigation */}
          <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
            <div className="flex items-center px-8 gap-1">
              {[
                { id: 'preview', label: 'Preview', icon: Eye },
                { id: 'analytics', label: 'Analytics', icon: BarChart2 },
                { id: 'history', label: 'History', icon: Clock },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    relative px-4 py-3 text-xs transition-all duration-300 flex items-center gap-2
                    ${activeTab === tab.id 
                      ? 'text-[#57ACAF]' 
                      : 'text-[#6F83A7] hover:text-white'
                    }
                  `}
                >
                  {/* Tab Icon & Label */}
                  <tab.icon className="w-4 h-4" />
                  <span className="relative z-10">{tab.label}</span>
                  
                  {/* Active Tab Indicator */}
                  {activeTab === tab.id && (
                    <>
                      {/* Glow Effect */}
                      <motion.div
                        layoutId="templateTabGlow"
                        className="absolute inset-0 bg-gradient-to-b from-[#57ACAF]/20 to-transparent rounded-t-lg"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      />
                      {/* Bottom Border */}
                      <motion.div
                        layoutId="templateTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#57ACAF] via-[#57ACAF]/80 to-[#57ACAF]"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      />
                      {/* Shimmer Effect */}
                      <motion.div
                        layoutId="templateTabShimmer"
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

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* Preview Tab */}
            {activeTab === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-8 space-y-6"
              >
                {/* Email Preview Card */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden backdrop-blur-sm">
                  {/* Email Header */}
                  <div className="bg-white/5 border-b border-white/10 px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[#6F83A7] text-sm">Subject</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(selectedTemplate.subject, 'Subject copied to clipboard')}
                        className="h-7 text-[#6F83A7] hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Copy
                      </Button>
                    </div>
                    <div className="text-white text-lg">{selectedTemplate.subject}</div>
                  </div>

                  {/* Email Body Preview */}
                  <div className="p-6 space-y-4">
                    <div className="text-[#6F83A7] text-sm mb-4">Email Body</div>
                    <div className="text-white space-y-4 leading-relaxed">
                      <p>Dear [Lead Name],</p>
                      <p>
                        I hope this message finds you well. I'm reaching out to introduce our premium fabric collection 
                        that has been specifically designed for {selectedTemplate.name === 'Product Introduction' ? 'fashion-forward brands like yours' : 
                        selectedTemplate.name === 'Follow-up After Meeting' ? 'innovative companies seeking quality materials' : 
                        'businesses looking to elevate their product line'}.
                      </p>
                      <p>
                        Our latest collection features sustainable materials with exceptional quality, competitive pricing, 
                        and fast turnaround times. We've helped over 500+ brands achieve their production goals with our 
                        reliable supply chain and dedicated support team.
                      </p>
                      <p>
                        I'd love to schedule a brief call to discuss how we can support your upcoming projects. 
                        Would you be available for a 15-minute conversation this week?
                      </p>
                      <p>Best regards,<br />[Your Name]<br />[Your Company]</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                      {drawerAction === 'use' && (
                        <Button
                          onClick={() => {
                            toast.success('Template applied to new message');
                            onOpenChange(false);
                          }}
                          className="flex-1 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-lg shadow-[#EAB308]/20"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Use This Template
                        </Button>
                      )}
                      {drawerAction === 'edit' && (
                        <Button
                          onClick={() => toast.info('Opening template editor...')}
                          className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Template
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          const fullEmail = `Subject: ${selectedTemplate.subject}\n\nDear [Lead Name],\n\nI hope this message finds you well. I'm reaching out to introduce our premium fabric collection that has been specifically designed for ${selectedTemplate.name === 'Product Introduction' ? 'fashion-forward brands like yours' : selectedTemplate.name === 'Follow-up After Meeting' ? 'innovative companies seeking quality materials' : 'businesses looking to elevate their product line'}.\n\nOur latest collection features sustainable materials with exceptional quality, competitive pricing, and fast turnaround times. We've helped over 500+ brands achieve their production goals with our reliable supply chain and dedicated support team.\n\nI'd love to schedule a brief call to discuss how we can support your upcoming projects. Would you be available for a 15-minute conversation this week?\n\nBest regards,\n[Your Name]\n[Your Company]`;
                          copyToClipboard(fullEmail, 'Email content copied');
                        }}
                        className="border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy All
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toast.info('Sending test email...')}
                        className="border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Test Send
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Template Variables */}
                <div className="rounded-2xl bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 p-6 backdrop-blur-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-white mb-2">Dynamic Variables</h4>
                      <p className="text-sm text-[#6F83A7] mb-4">
                        These placeholders will be automatically replaced with lead data
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {['[Lead Name]', '[Company]', '[Industry]', '[Location]', '[Product Interest]', '[Last Interaction]'].map((variable, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                            <code className="text-[#57ACAF] text-sm">{variable}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-8 space-y-6"
              >
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#57ACAF]/20 via-[#57ACAF]/10 to-transparent border border-[#57ACAF]/30 p-6 backdrop-blur-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#57ACAF]/10 rounded-full blur-2xl" />
                    <div className="relative">
                      <div className="text-[#57ACAF] text-xs uppercase tracking-wider mb-2">Total Sends</div>
                      <div className="text-white text-4xl mb-2">{selectedTemplate.uses}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">+18% vs avg</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAB308]/20 via-[#EAB308]/10 to-transparent border border-[#EAB308]/30 p-6 backdrop-blur-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAB308]/10 rounded-full blur-2xl" />
                    <div className="relative">
                      <div className="text-[#EAB308] text-xs uppercase tracking-wider mb-2">Replies</div>
                      <div className="text-white text-4xl mb-2">59</div>
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="w-4 h-4 text-[#EAB308]" />
                        <span className="text-[#6F83A7]">42% reply rate</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 backdrop-blur-sm">
                  <h4 className="text-white mb-4">Performance Over Time</h4>
                  <ResponsiveContainer width="100%" height={240}>
                    <RechartsLine data={[
                      { week: 'W1', opens: 65, replies: 38, conversions: 12 },
                      { week: 'W2', opens: 72, replies: 45, conversions: 18 },
                      { week: 'W3', opens: 68, replies: 42, conversions: 15 },
                      { week: 'W4', opens: 75, replies: 48, conversions: 22 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="week" stroke="#6F83A7" />
                      <YAxis stroke="#6F83A7" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0D1117',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                        }}
                      />
                      <Line type="monotone" dataKey="opens" stroke="#57ACAF" strokeWidth={2} dot={{ fill: '#57ACAF' }} />
                      <Line type="monotone" dataKey="replies" stroke="#EAB308" strokeWidth={2} dot={{ fill: '#EAB308' }} />
                      <Line type="monotone" dataKey="conversions" stroke="#9333EA" strokeWidth={2} dot={{ fill: '#9333EA' }} />
                    </RechartsLine>
                  </ResponsiveContainer>
                </div>

                {/* AI Insights */}
                {onAskMarbim && (
                  <div className="rounded-2xl bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 p-5 backdrop-blur-sm">
                    <div className="flex items-start gap-3 justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <Sparkles className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-white mb-2">Template Optimization AI</div>
                          <p className="text-sm text-[#6F83A7]">
                            Get AI-powered suggestions to improve open rates, reply rates, and conversions
                          </p>
                        </div>
                      </div>
                    </div>
                    <MarbimAIButton
                      marbimPrompt={`Analyze the "${selectedTemplate.name}" email template performance and provide: 1) What's working well 2) Areas for improvement 3) Subject line alternatives 4) Body copy suggestions 5) Best send times 6) Audience segmentation recommendations`}
                      onAskMarbim={onAskMarbim}
                      size="lg"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-8 space-y-6"
              >
                <div className="space-y-4">
                  {[
                    { date: '2024-10-25', action: 'Sent to 12 leads', user: 'Sarah M.', result: '8 opens, 3 replies' },
                    { date: '2024-10-22', action: 'Sent to 8 leads', user: 'John D.', result: '6 opens, 2 replies' },
                    { date: '2024-10-18', action: 'Template edited', user: 'Sarah M.', result: 'Subject line updated' },
                    { date: '2024-10-15', action: 'Sent to 15 leads', user: 'Mike R.', result: '10 opens, 4 replies' },
                    { date: '2024-10-12', action: 'Template created', user: 'Sarah M.', result: 'Initial version' },
                  ].map((entry, idx) => (
                    <div key={idx} className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-5 backdrop-blur-sm hover:border-[#57ACAF]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#57ACAF]/0 to-[#57ACAF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#57ACAF]/10 border border-[#57ACAF]/30 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[#57ACAF]" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-white mb-1">{entry.action}</div>
                              <div className="text-sm text-[#6F83A7]">{entry.result}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-[#6F83A7] mb-1">{entry.date}</div>
                              <div className="text-xs text-[#6F83A7]">by {entry.user}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-8 space-y-6"
              >
                {/* Template Name */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 backdrop-blur-sm">
                  <h4 className="text-white mb-4">Template Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Template Name</label>
                      <Input
                        defaultValue={selectedTemplate.name}
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]/50 focus:border-[#57ACAF]"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Subject Line</label>
                      <Input
                        defaultValue={selectedTemplate.subject}
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]/50 focus:border-[#57ACAF]"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Description</label>
                      <Textarea
                        placeholder="Add a description for this template..."
                        rows={3}
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]/50 focus:border-[#57ACAF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Template Category */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 backdrop-blur-sm">
                  <h4 className="text-white mb-4">Categorization</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {['Cold Outreach', 'Follow-up', 'Introduction', 'Sample Request', 'Meeting', 'Proposal'].map((cat, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant={cat === 'Introduction' ? 'default' : 'outline'}
                            className={cat === 'Introduction' ? 
                              'bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30 hover:bg-[#57ACAF]/30' : 
                              'border-white/10 text-[#6F83A7] hover:text-white hover:bg-white/5'
                            }
                          >
                            {cat}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {['Premium', 'Urgent', 'Personal', 'Professional'].map((tag, idx) => (
                          <Badge key={idx} className="bg-white/5 text-[#6F83A7] border-white/10">
                            {tag}
                            <X className="w-3 h-3 ml-1.5 cursor-pointer hover:text-white" />
                          </Badge>
                        ))}
                        <Button size="sm" variant="ghost" className="h-6 text-[#57ACAF]">
                          <Plus className="w-3 h-3 mr-1" />
                          Add Tag
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 p-6 backdrop-blur-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-white mb-2">Danger Zone</h4>
                      <p className="text-sm text-[#6F83A7] mb-4">
                        These actions are permanent and cannot be undone
                      </p>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => toast.success('Template duplicated')}
                          className="border-white/20 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate Template
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            toast.error('Template deleted');
                            onOpenChange(false);
                          }}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/40"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => {
                      toast.success('Template settings saved');
                      onOpenChange(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </>
      </SheetContent>
    </Sheet>
  );
}
