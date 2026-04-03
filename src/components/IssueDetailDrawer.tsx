import { useState } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, AlertTriangle, Clock, User, Calendar, FileText, MessageSquare,
  CheckCircle2, TrendingUp, Send, Edit, Trash2, Upload, Download,
  Phone, Mail, Package, DollarSign, Eye, History, Target, Sparkles,
  AlertCircle, XCircle, ArrowRight, Building2, Users, BarChart3,
  Shield, Zap, ChevronRight, ExternalLink, Link2, Paperclip, Image as ImageIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MarbimAIButton } from './MarbimAIButton';
import { CommunicationLogger } from './CommunicationLogger';
import { WorkflowStepper } from './WorkflowStepper';
import { toast } from 'sonner';

interface IssueDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  issue: any;
  onAskMarbim?: (prompt: string) => void;
}

export function IssueDetailDrawer({ isOpen, onClose, issue, onAskMarbim }: IssueDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  if (!issue) return null;

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return { bg: '#D0342C', light: 'rgba(208, 52, 44, 0.1)', border: 'rgba(208, 52, 44, 0.2)' };
      case 'high': return { bg: '#EAB308', light: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.2)' };
      case 'medium': return { bg: '#6F83A7', light: 'rgba(111, 131, 167, 0.1)', border: 'rgba(111, 131, 167, 0.2)' };
      case 'low': return { bg: '#57ACAF', light: 'rgba(87, 172, 175, 0.1)', border: 'rgba(87, 172, 175, 0.2)' };
      default: return { bg: '#6F83A7', light: 'rgba(111, 131, 167, 0.1)', border: 'rgba(111, 131, 167, 0.2)' };
    }
  };

  const severityColor = getSeverityColor(issue.severity);

  // Mock data for comprehensive display
  const issueTimeline = [
    { date: '2024-10-29 14:30', user: 'System', action: 'Issue created', type: 'created' },
    { date: '2024-10-29 14:32', user: 'MARBIM AI', action: 'Auto-categorized as Quality issue', type: 'ai' },
    { date: '2024-10-29 14:35', user: 'Sarah Johnson', action: 'Assigned to Quality Team', type: 'assignment' },
    { date: '2024-10-29 15:20', user: 'Quality Team', action: 'Status changed to In Progress', type: 'status' },
    { date: '2024-10-29 16:45', user: 'John Smith', action: 'Added inspection report', type: 'document' },
  ];

  const relatedIssues = [
    { id: 'ISS-2024-315', title: 'Similar fabric defect', status: 'Resolved', similarity: 92 },
    { id: 'ISS-2024-289', title: 'Quality control failure', status: 'Resolved', similarity: 78 },
    { id: 'ISS-2024-198', title: 'Buyer complaint - same supplier', status: 'Closed', similarity: 65 },
  ];

  const impactMetrics = {
    affectedOrders: 3,
    totalValue: '$85,000',
    buyersImpacted: 2,
    estimatedDelay: '5 days',
    financialImpact: '$12,500',
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments([...attachments, ...filesArray]);
      toast.success(`${filesArray.length} file(s) added`);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      toast.success('Comment added successfully');
      setNewComment('');
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
            <div className="relative border-b border-white/10 bg-gradient-to-r from-white/5 via-transparent to-white/5">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }} />
              </div>

              <div className="relative px-8 py-6">
                {/* Top Row */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                      style={{ 
                        background: `linear-gradient(135deg, ${severityColor.bg} 0%, ${severityColor.bg}99 100%)`,
                        boxShadow: `0 8px 16px ${severityColor.bg}33`
                      }}
                    >
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>

                    {/* Title & Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-white text-xl">{issue.issueId}</h2>
                        <Badge 
                          className="border-none"
                          style={{ 
                            backgroundColor: severityColor.light,
                            color: severityColor.bg,
                            borderColor: severityColor.border
                          }}
                        >
                          {issue.severity}
                        </Badge>
                        <Badge className="bg-[#EAB308]/10 text-[#EAB308] border-none">
                          {issue.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6F83A7]">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {issue.buyer}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Target: {issue.targetDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {issue.owner}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-[#6F83A7] hover:text-white hover:bg-white/10 rounded-xl flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-5 gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Category</div>
                    <div className="text-sm text-white">{issue.category}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Age</div>
                    <div className="text-sm text-white">3 days</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">SLA Status</div>
                    <div className="text-sm text-[#EAB308]">2 days left</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Updates</div>
                    <div className="text-sm text-white">5</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Attachments</div>
                    <div className="text-sm text-white">3</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-8 pt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-2 shadow-lg shadow-black/20">
                  <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
                    <TabsTrigger 
                      value="overview"
                      className="relative flex items-center justify-center gap-2.5 py-3 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-xs">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="resolution"
                      className="relative flex items-center justify-center gap-2.5 py-3 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs">Resolution</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="communications"
                      className="relative flex items-center justify-center gap-2.5 py-3 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs">Communications</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="ai-insights"
                      className="relative flex items-center justify-center gap-2.5 py-3 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs">AI Insights</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-[calc(100vh-420px)]">
                    <div className="px-1 pb-6">
                      {/* Overview Tab */}
                      <TabsContent value="overview" className="space-y-6 mt-0">
                        {/* Issue Description */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <h3 className="text-white mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#57ACAF]" />
                            Issue Description
                          </h3>
                          <p className="text-[#6F83A7] text-sm leading-relaxed">
                            Quality defects detected in fabric shipment batch #QC-2024-421. Multiple rolls showing color 
                            inconsistency and thread tension issues. Buyer has flagged this as critical priority due to 
                            upcoming production deadline. Immediate inspection and remediation required.
                          </p>
                        </div>

                        {/* Impact Analysis */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-white flex items-center gap-2">
                              <Target className="w-5 h-5 text-[#D0342C]" />
                              Impact Analysis
                            </h3>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="w-4 h-4 text-[#EAB308]" />
                                <span className="text-xs text-[#6F83A7]">Affected Orders</span>
                              </div>
                              <div className="text-xl text-white">{impactMetrics.affectedOrders}</div>
                              <div className="text-xs text-[#6F83A7] mt-1">Total Value: {impactMetrics.totalValue}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-xs text-[#6F83A7]">Buyers Impacted</span>
                              </div>
                              <div className="text-xl text-white">{impactMetrics.buyersImpacted}</div>
                              <div className="text-xs text-[#6F83A7] mt-1">Gap, Zara</div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-[#EAB308]" />
                                <span className="text-xs text-[#6F83A7]">Estimated Delay</span>
                              </div>
                              <div className="text-xl text-white">{impactMetrics.estimatedDelay}</div>
                              <div className="text-xs text-[#D0342C] mt-1">Urgent attention needed</div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-[#D0342C]" />
                                <span className="text-xs text-[#6F83A7]">Financial Impact</span>
                              </div>
                              <div className="text-xl text-white">{impactMetrics.financialImpact}</div>
                              <div className="text-xs text-[#6F83A7] mt-1">Estimated loss</div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/10">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#D0342C] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Get AI-powered impact mitigation strategies
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Analyze the impact of issue ${issue.issueId} affecting ${impactMetrics.affectedOrders} orders worth ${impactMetrics.totalValue}. Provide mitigation strategies to minimize the ${impactMetrics.estimatedDelay} delay and reduce the ${impactMetrics.financialImpact} financial impact.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <h3 className="text-white mb-4 flex items-center gap-2">
                            <History className="w-5 h-5 text-[#57ACAF]" />
                            Issue Timeline
                          </h3>
                          <div className="space-y-3">
                            {issueTimeline.map((entry, index) => (
                              <div key={index} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    entry.type === 'ai' ? 'bg-[#EAB308]/20' :
                                    entry.type === 'created' ? 'bg-[#57ACAF]/20' :
                                    entry.type === 'status' ? 'bg-[#6F83A7]/20' :
                                    'bg-white/10'
                                  }`}>
                                    {entry.type === 'ai' ? <Sparkles className="w-4 h-4 text-[#EAB308]" /> :
                                     entry.type === 'created' ? <AlertCircle className="w-4 h-4 text-[#57ACAF]" /> :
                                     entry.type === 'assignment' ? <User className="w-4 h-4 text-white" /> :
                                     entry.type === 'status' ? <CheckCircle2 className="w-4 h-4 text-[#6F83A7]" /> :
                                     <FileText className="w-4 h-4 text-white" />}
                                  </div>
                                  {index < issueTimeline.length - 1 && (
                                    <div className="w-px h-8 bg-white/10" />
                                  )}
                                </div>
                                <div className="flex-1 pb-4">
                                  <div className="text-white text-sm mb-1">{entry.action}</div>
                                  <div className="text-xs text-[#6F83A7]">{entry.user} • {entry.date}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Related Issues */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-white flex items-center gap-2">
                              <Link2 className="w-5 h-5 text-[#57ACAF]" />
                              Related Issues
                            </h3>
                          </div>
                          
                          <div className="space-y-2">
                            {relatedIssues.map((related, index) => (
                              <div 
                                key={index}
                                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                                onClick={() => toast.info(`Opening ${related.id}`)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white text-sm">{related.id}</span>
                                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs">
                                      {related.status}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-[#6F83A7]">{related.similarity}% similar</span>
                                    <ExternalLink className="w-3 h-3 text-[#6F83A7] opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                                <div className="text-xs text-[#6F83A7]">{related.title}</div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-white/10 mt-4">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Find more similar issues and learn from past resolutions
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Find all similar issues to ${issue.issueId} in the category "${issue.category}" and analyze common resolution patterns to recommend the fastest solution path.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Resolution Tab */}
                      <TabsContent value="resolution" className="space-y-6 mt-0">
                        {/* Resolution Workflow */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <h3 className="text-white mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
                            Resolution Workflow
                          </h3>
                          <WorkflowStepper
                            steps={[
                              { label: 'Issue Logged', status: 'completed' },
                              { label: 'AI Categorization', status: 'completed' },
                              { label: 'Owner Assignment', status: 'completed' },
                              { label: 'Investigation', status: 'active' },
                              { label: 'Resolution', status: 'pending' },
                              { label: 'Buyer Verification', status: 'pending' },
                              { label: 'Closed', status: 'pending' },
                            ]}
                          />

                          <div className="pt-4 border-t border-white/10 mt-4">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Predict resolution time and get next steps
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Predict the resolution time for ${issue.issueId} based on current workflow stage and historical data for ${issue.category} issues with ${issue.severity} severity. Recommend next steps to accelerate resolution.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action Plan */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <h3 className="text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-[#EAB308]" />
                            Action Plan
                          </h3>
                          
                          <div className="space-y-3 mb-4">
                            {[
                              { task: 'Conduct physical inspection of affected fabric rolls', status: 'In Progress', assignee: 'Quality Team' },
                              { task: 'Contact supplier for replacement commitment', status: 'Pending', assignee: 'Procurement' },
                              { task: 'Notify buyers of potential delay', status: 'Pending', assignee: 'Merchandising' },
                              { task: 'Prepare compensation proposal', status: 'Pending', assignee: 'Finance' },
                            ].map((action, index) => (
                              <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-white text-sm flex-1">{action.task}</span>
                                  <Badge className={`border-none text-xs ${
                                    action.status === 'In Progress' 
                                      ? 'bg-[#EAB308]/10 text-[#EAB308]'
                                      : 'bg-[#6F83A7]/10 text-[#6F83A7]'
                                  }`}>
                                    {action.status}
                                  </Badge>
                                </div>
                                <div className="text-xs text-[#6F83A7]">Assigned to: {action.assignee}</div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-white/10">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Generate comprehensive action plan with priorities
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Generate a detailed action plan for resolving ${issue.issueId}, including task priorities, resource allocation, timeline estimates, and escalation procedures for this ${issue.severity} severity ${issue.category} issue.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Add Comment */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <h3 className="text-white mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-[#57ACAF]" />
                            Add Update
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <Label className="text-[#6F83A7] text-sm mb-2 block">Update Description</Label>
                              <Textarea
                                placeholder="Describe the actions taken or findings..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] min-h-[100px]"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-[#6F83A7] text-sm mb-2 block">Attachments</Label>
                              <div className="space-y-2">
                                <input
                                  type="file"
                                  multiple
                                  accept="*/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                  id="issue-file-upload"
                                />
                                <Button
                                  variant="outline"
                                  className="w-full border-white/10 text-[#6F83A7] hover:bg-white/5"
                                  onClick={() => document.getElementById('issue-file-upload')?.click()}
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload Files
                                </Button>
                                
                                {attachments.length > 0 && (
                                  <div className="space-y-2">
                                    {attachments.map((file, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-2">
                                          <Paperclip className="w-4 h-4 text-[#57ACAF]" />
                                          <span className="text-sm text-white">{file.name}</span>
                                          <span className="text-xs text-[#6F83A7]">
                                            ({(file.size / 1024).toFixed(1)} KB)
                                          </span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                                          className="text-[#D0342C] hover:bg-[#D0342C]/10"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <Button
                              onClick={handleAddComment}
                              className="w-full bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Post Update
                            </Button>
                          </div>
                        </div>

                        {/* Change Status/Assignment */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <h3 className="text-white mb-4 flex items-center gap-2">
                            <Edit className="w-5 h-5 text-[#6F83A7]" />
                            Update Issue Details
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-[#6F83A7] text-sm mb-2 block">Status</Label>
                              <Select defaultValue={issue.status}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Escalated">Escalated</SelectItem>
                                  <SelectItem value="Resolved">Resolved</SelectItem>
                                  <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] text-sm mb-2 block">Assigned To</Label>
                              <Select defaultValue={issue.owner}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Quality Team">Quality Team</SelectItem>
                                  <SelectItem value="Logistics">Logistics</SelectItem>
                                  <SelectItem value="Merchandising">Merchandising</SelectItem>
                                  <SelectItem value="Finance">Finance</SelectItem>
                                  <SelectItem value="Production">Production</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] text-sm mb-2 block">Priority</Label>
                              <Select defaultValue={issue.severity}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Low">Low</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="High">High</SelectItem>
                                  <SelectItem value="Critical">Critical</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-[#6F83A7] text-sm mb-2 block">Target Date</Label>
                              <Input
                                type="date"
                                defaultValue={issue.targetDate}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                          <Button
                            className="w-full mt-4 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                            onClick={() => toast.success('Issue details updated')}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </TabsContent>

                      {/* Communications Tab */}
                      <TabsContent value="communications" className="space-y-6 mt-0">
                        {/* Communication Overview */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-white flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-[#57ACAF]" />
                              Communication Summary
                            </h3>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-3 mb-4">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <Mail className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-xs text-[#6F83A7]">Emails</span>
                              </div>
                              <div className="text-lg text-white">12</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <Phone className="w-4 h-4 text-[#EAB308]" />
                                <span className="text-xs text-[#6F83A7]">Calls</span>
                              </div>
                              <div className="text-lg text-white">5</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <MessageSquare className="w-4 h-4 text-[#6F83A7]" />
                                <span className="text-xs text-[#6F83A7]">Messages</span>
                              </div>
                              <div className="text-lg text-white">28</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <Users className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-xs text-[#6F83A7]">Stakeholders</span>
                              </div>
                              <div className="text-lg text-white">8</div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/10">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Analyze communication effectiveness and stakeholder engagement
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Analyze all communication history for ${issue.issueId} including emails, calls, and messages. Evaluate stakeholder engagement levels, response times, and communication effectiveness. Identify any gaps or stakeholders requiring follow-up.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Stakeholder Status */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-white flex items-center gap-2">
                              <Users className="w-5 h-5 text-[#57ACAF]" />
                              Stakeholder Engagement
                            </h3>
                          </div>

                          <div className="space-y-3 mb-4">
                            {[
                              { name: 'Gap Inc.', role: 'Buyer', lastContact: '2 hours ago', status: 'Active', sentiment: 'Concerned' },
                              { name: 'Quality Team', role: 'Internal', lastContact: '4 hours ago', status: 'Active', sentiment: 'Responsive' },
                              { name: 'Fabric Supplier', role: 'Supplier', lastContact: '1 day ago', status: 'Pending', sentiment: 'Defensive' },
                              { name: 'Logistics Partner', role: 'Vendor', lastContact: '6 hours ago', status: 'Active', sentiment: 'Cooperative' },
                            ].map((stakeholder, index) => (
                              <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center">
                                      <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <div className="text-white text-sm">{stakeholder.name}</div>
                                      <div className="text-xs text-[#6F83A7]">{stakeholder.role}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={`border-none text-xs ${
                                      stakeholder.status === 'Active'
                                        ? 'bg-[#57ACAF]/10 text-[#57ACAF]'
                                        : 'bg-[#EAB308]/10 text-[#EAB308]'
                                    }`}>
                                      {stakeholder.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[#6F83A7]">Last contact: {stakeholder.lastContact}</span>
                                  <span className={`${
                                    stakeholder.sentiment === 'Concerned' || stakeholder.sentiment === 'Defensive'
                                      ? 'text-[#EAB308]'
                                      : 'text-[#57ACAF]'
                                  }`}>
                                    {stakeholder.sentiment}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-white/10">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Get personalized engagement strategy for each stakeholder
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Create personalized engagement strategies for each stakeholder involved in ${issue.issueId}. Consider their role, current sentiment, communication history, and interests. Recommend optimal communication frequency, channels, and key messages for each stakeholder.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Communication Timeline */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <h3 className="text-white mb-4 flex items-center gap-2">
                            <History className="w-5 h-5 text-[#57ACAF]" />
                            Communication Timeline
                          </h3>

                          <div className="space-y-3">
                            {[
                              {
                                type: 'email',
                                subject: 'Issue escalation notification',
                                from: 'Quality Manager',
                                to: 'Gap Inc.',
                                time: '2 hours ago',
                                status: 'Read'
                              },
                              {
                                type: 'call',
                                subject: 'Discussion on replacement timeline',
                                from: 'Procurement Team',
                                to: 'Fabric Supplier',
                                time: '4 hours ago',
                                status: 'Completed'
                              },
                              {
                                type: 'message',
                                subject: 'Quality inspection report shared',
                                from: 'Quality Team',
                                to: 'Internal Team',
                                time: '6 hours ago',
                                status: 'Delivered'
                              },
                              {
                                type: 'email',
                                subject: 'Initial issue notification',
                                from: 'System',
                                to: 'All Stakeholders',
                                time: '1 day ago',
                                status: 'Read'
                              },
                            ].map((comm, index) => (
                              <div key={index} className="flex gap-3 group cursor-pointer hover:bg-white/5 p-3 rounded-lg transition-all">
                                <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    comm.type === 'email' ? 'bg-[#57ACAF]/20' :
                                    comm.type === 'call' ? 'bg-[#EAB308]/20' :
                                    'bg-[#6F83A7]/20'
                                  }`}>
                                    {comm.type === 'email' ? <Mail className="w-4 h-4 text-[#57ACAF]" /> :
                                     comm.type === 'call' ? <Phone className="w-4 h-4 text-[#EAB308]" /> :
                                     <MessageSquare className="w-4 h-4 text-[#6F83A7]" />}
                                  </div>
                                  {index < 3 && (
                                    <div className="w-px h-8 bg-white/10" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-white text-sm">{comm.subject}</span>
                                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs">
                                      {comm.status}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-[#6F83A7]">
                                    {comm.from} → {comm.to} • {comm.time}
                                  </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-[#6F83A7] opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-white/10 mt-4">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Summarize all communications and extract key insights
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Provide a comprehensive summary of all communications related to ${issue.issueId}. Extract key decisions, commitments made, action items assigned, and sentiment trends. Highlight any discrepancies or unresolved questions from the communication history.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Quick Communication Actions */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <h3 className="text-white mb-4 flex items-center gap-2">
                            <Send className="w-5 h-5 text-[#EAB308]" />
                            Quick Actions
                          </h3>

                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 justify-start bg-[rgba(255,255,255,0)]"
                              onClick={() => toast.info('Composing email to buyer')}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Email Buyer
                            </Button>
                            <Button
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 justify-start bg-[rgba(255,255,255,0)]"
                              onClick={() => toast.info('Scheduling call')}
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Schedule Call
                            </Button>
                            <Button
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 justify-start bg-[rgba(255,255,255,0)]"
                              onClick={() => toast.info('Sending internal update')}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Internal Update
                            </Button>
                            <Button
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 justify-start bg-[rgba(255,255,255,0)]"
                              onClick={() => toast.info('Notifying supplier')}
                            >
                              <Building2 className="w-4 h-4 mr-2" />
                              Contact Supplier
                            </Button>
                          </div>
                        </div>

                        {/* AI Communication Recommendations */}
                        <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-[#EAB308]" />
                              </div>
                              <div>
                                <h3 className="text-white mb-1">AI Communication Insights</h3>
                                <p className="text-sm text-[#6F83A7]">
                                  Intelligent recommendations for stakeholder communication
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-start gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-white text-sm mb-1">Urgent: Follow up with Fabric Supplier</div>
                                  <div className="text-xs text-[#6F83A7]">
                                    No response in 24 hours. Recommended action: Phone call to confirm replacement timeline.
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-start gap-2 mb-2">
                                <CheckCircle2 className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-white text-sm mb-1">Send proactive update to Gap Inc.</div>
                                  <div className="text-xs text-[#6F83A7]">
                                    Buyer showing concern. Recommended: Daily progress updates to maintain confidence.
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-start gap-2 mb-2">
                                <Users className="w-4 h-4 text-[#6F83A7] flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-white text-sm mb-1">Coordinate internal team meeting</div>
                                  <div className="text-xs text-[#6F83A7]">
                                    Quality, Procurement, and Merchandising teams should align on action plan.
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/10">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Generate complete communication plan with priorities and timelines
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Create a comprehensive communication plan for ${issue.issueId} including: 1) Priority stakeholder list with engagement frequency, 2) Key messages for each stakeholder group, 3) Optimal communication channels and timing, 4) Escalation triggers, 5) Template emails and talking points, 6) Success metrics for stakeholder satisfaction.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Communication Performance */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-white flex items-center gap-2">
                              <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                              Communication Effectiveness
                            </h3>
                          </div>

                          <div className="space-y-4 mb-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-[#6F83A7]">Response Rate</span>
                                <span className="text-white text-sm">87%</span>
                              </div>
                              <Progress value={87} className="h-2" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-[#6F83A7]">Avg Response Time</span>
                                <span className="text-white text-sm">4.2 hours</span>
                              </div>
                              <Progress value={75} className="h-2" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-[#6F83A7]">Stakeholder Satisfaction</span>
                                <span className="text-white text-sm">6.8/10</span>
                              </div>
                              <Progress value={68} className="h-2" />
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/10">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Get recommendations to improve communication effectiveness
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Analyze communication effectiveness for ${issue.issueId} and provide specific recommendations to improve response rates, reduce response time, and increase stakeholder satisfaction. Include best practices from similar high-performing issue resolutions.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* AI Insights Tab */}
                      <TabsContent value="ai-insights" className="space-y-6 mt-0">
                        {/* Root Cause Analysis */}
                        <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                                <Target className="w-5 h-5 text-[#EAB308]" />
                              </div>
                              <div>
                                <h3 className="text-white mb-1">Root Cause Analysis</h3>
                                <p className="text-sm text-[#6F83A7]">
                                  AI-powered investigation into the underlying causes
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-white text-sm mb-2">Probable Root Cause</div>
                              <div className="text-xs text-[#6F83A7] mb-3">
                                Based on pattern analysis of similar issues, the root cause is likely inadequate 
                                quality control at supplier facility during dyeing process.
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-[#EAB308]/10 text-[#EAB308] border-none text-xs">
                                  87% confidence
                                </Badge>
                                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs">
                                  12 similar cases
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/10">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Get detailed root cause analysis with evidence
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Perform comprehensive root cause analysis for ${issue.issueId}. Analyze all contributing factors including supplier quality processes, material specifications, inspection protocols, and historical patterns. Provide evidence-based conclusions and preventive recommendations.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Preventive Actions */}
                        <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-[#57ACAF]" />
                              </div>
                              <div>
                                <h3 className="text-white mb-1">Preventive Recommendations</h3>
                                <p className="text-sm text-[#6F83A7]">
                                  Actions to prevent similar issues in the future
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {[
                              { action: 'Implement stricter pre-shipment inspection protocols', impact: 'High' },
                              { action: 'Add dyeing consistency checks to supplier audit checklist', impact: 'High' },
                              { action: 'Require fabric samples for approval before bulk production', impact: 'Medium' },
                              { action: 'Set up automated color matching verification system', impact: 'Medium' },
                            ].map((item, index) => (
                              <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between">
                                  <span className="text-white text-sm flex-1">{item.action}</span>
                                  <Badge className={`border-none text-xs ${
                                    item.impact === 'High'
                                      ? 'bg-[#57ACAF]/10 text-[#57ACAF]'
                                      : 'bg-[#EAB308]/10 text-[#EAB308]'
                                  }`}>
                                    {item.impact} Impact
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-white/10">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Generate comprehensive prevention strategy
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Based on ${issue.issueId} and historical ${issue.category} issues, create a comprehensive prevention strategy including process improvements, policy changes, training requirements, and quality checkpoints to eliminate recurrence.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Communication Templates */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-[#6F83A7]" />
                              </div>
                              <div>
                                <h3 className="text-white mb-1">Communication Templates</h3>
                                <p className="text-sm text-[#6F83A7]">
                                  AI-generated templates for buyer communications
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 justify-start bg-[rgba(255,255,255,0)]"
                              onClick={() => toast.info('Generating issue notification email')}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Issue Notification
                            </Button>
                            <Button
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 justify-start bg-[rgba(255,255,255,0)]"
                              onClick={() => toast.info('Generating status update email')}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Status Update
                            </Button>
                            <Button
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 justify-start bg-[rgba(255,255,255,0)]"
                              onClick={() => toast.info('Generating resolution email')}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Resolution Notice
                            </Button>
                            <Button
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 justify-start bg-[rgba(255,255,255,0)]"
                              onClick={() => toast.info('Generating apology email')}
                            >
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Apology Letter
                            </Button>
                          </div>

                          <div className="pt-3 border-t border-white/10 mt-4">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#6F83A7] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Generate personalized buyer communication
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Generate a professional, empathetic email to ${issue.buyer} regarding ${issue.issueId}. Include issue summary, current status, resolution timeline, compensation if applicable, and next steps. Tone should be apologetic yet confident in resolution.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Escalation Recommendation */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-5 h-5 text-[#D0342C]" />
                              </div>
                              <div>
                                <h3 className="text-white mb-1">Escalation Analysis</h3>
                                <p className="text-sm text-[#6F83A7]">
                                  Should this issue be escalated to management?
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-white text-sm">Escalation Recommended</span>
                              <Badge className="bg-[#D0342C]/10 text-[#D0342C] border-none">
                                Yes
                              </Badge>
                            </div>
                            <div className="text-xs text-[#6F83A7] mb-3">
                              Based on severity, financial impact, and SLA status, this issue should be escalated 
                              to senior management for oversight and resource allocation.
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-white/10 text-white border-none text-xs">High Severity</Badge>
                              <Badge className="bg-white/10 text-white border-none text-xs">Large Financial Impact</Badge>
                              <Badge className="bg-white/10 text-white border-none text-xs">Multiple Buyers</Badge>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/10">
                            <div className="flex items-start gap-2 justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <Sparkles className="w-4 h-4 text-[#D0342C] flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-[#6F83A7]">
                                  Get escalation playbook and stakeholder communication plan
                                </div>
                              </div>
                              <MarbimAIButton
                                marbimPrompt={`Create an escalation playbook for ${issue.issueId} including stakeholder notification sequence, executive summary, resource requirements, and contingency plans. Include recommended escalation path and communication templates for senior management.`}
                                onAskMarbim={onAskMarbim}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Comprehensive AI Report */}
                        <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
                          <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#EAB308]/30">
                                <Sparkles className="w-6 h-6 text-black" />
                              </div>
                              <div>
                                <div className="text-white mb-2">Complete Issue Intelligence Report</div>
                                <div className="text-sm text-[#6F83A7] mb-3">
                                  Generate a comprehensive AI-powered analysis covering root cause, resolution strategy, 
                                  impact mitigation, preventive actions, and stakeholder communication plans.
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge className="bg-white/10 text-white border-none text-xs">Root Cause</Badge>
                                  <Badge className="bg-white/10 text-white border-none text-xs">Resolution Path</Badge>
                                  <Badge className="bg-white/10 text-white border-none text-xs">Prevention Strategy</Badge>
                                  <Badge className="bg-white/10 text-white border-none text-xs">Communication Plan</Badge>
                                </div>
                              </div>
                            </div>
                            <MarbimAIButton
                              marbimPrompt={`Generate comprehensive intelligence report for ${issue.issueId}: 1) Root cause analysis with evidence, 2) Detailed resolution strategy with timeline, 3) Impact mitigation plan for affected orders and buyers, 4) Preventive action recommendations, 5) Escalation playbook if needed, 6) Buyer communication templates, 7) Resource allocation plan, 8) Success metrics and monitoring strategy.`}
                              onAskMarbim={onAskMarbim}
                              size="lg"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </div>
                  </ScrollArea>
                </div>
              </Tabs>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 p-6 bg-gradient-to-r from-white/5 via-transparent to-white/5">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  onClick={() => toast.info('Escalating issue')}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Escalate
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  onClick={() => toast.info('Reassigning issue')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Reassign
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                  onClick={() => toast.success('Issue marked as resolved')}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Resolved
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
