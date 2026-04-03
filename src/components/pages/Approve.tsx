import { useState } from 'react';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard, AIInsightItem } from '../AICard';
import { SmartTable, Column, StatusBadge } from '../SmartTable';
import { ApprovalDetailDrawer } from '../ApprovalDetailDrawer';
import { 
  CheckCircle, Clock, AlertTriangle, XCircle, Filter, 
  Download, TrendingUp, TrendingDown, DollarSign, FileText,
  Users, Calendar, Target, Sparkles, BarChart3, Award,
  Eye, MessageSquare, Shield, Activity, Building2, ChevronDown,
  RefreshCw, Zap, Send, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

const approvalsData = [
  { 
    id: 1, 
    title: 'Purchase Order #PO-2845', 
    type: 'Purchase Order', 
    amount: '$45,000', 
    status: 'Pending',
    requestedBy: 'Sarah M.',
    department: 'Procurement',
    submittedDate: '2024-10-24',
    priority: 'High',
    description: 'Raw material procurement for Q4 production',
    details: 'Organic cotton fabric - 5000 yards, Premium denim - 3000 yards',
    approvalChain: 'Manager → Director → CFO',
    daysWaiting: 2,
    aiScore: 85,
  },
  { 
    id: 2, 
    title: 'Budget Allocation Q1 2025', 
    type: 'Budget', 
    amount: '$250,000', 
    status: 'Pending',
    requestedBy: 'Mike R.',
    department: 'Finance',
    submittedDate: '2024-10-23',
    priority: 'Medium',
    description: 'Marketing and sales budget for Q1 2025',
    details: 'Digital marketing: $150K, Events: $60K, Sales tools: $40K',
    approvalChain: 'Department Head → CFO → CEO',
    daysWaiting: 3,
    aiScore: 72,
  },
  { 
    id: 3, 
    title: 'Supplier Contract - ABC Textiles', 
    type: 'Contract', 
    amount: '$180,000', 
    status: 'Approved',
    requestedBy: 'Lisa K.',
    department: 'Supply Chain',
    submittedDate: '2024-10-20',
    priority: 'High',
    description: 'Annual supplier contract renewal',
    details: '12-month agreement with 5% volume discount and 30-day payment terms',
    approvalChain: 'Procurement → Legal → CFO',
    approvedBy: 'John D.',
    approvedDate: '2024-10-22',
    daysWaiting: 0,
    aiScore: 92,
  },
  { 
    id: 4, 
    title: 'Employee Leave Request - David Chen', 
    type: 'Leave', 
    amount: 'N/A', 
    status: 'Pending',
    requestedBy: 'David Chen',
    department: 'Production',
    submittedDate: '2024-10-25',
    priority: 'Low',
    description: 'Annual leave for 10 days',
    details: 'Leave dates: Nov 15-24, 2024. Backup: Tom Wilson',
    approvalChain: 'Team Lead → HR',
    daysWaiting: 1,
    aiScore: 95,
  },
  { 
    id: 5, 
    title: 'Quality Exception - Batch #QE-102', 
    type: 'Quality Exception', 
    amount: '$8,500', 
    status: 'Rejected',
    requestedBy: 'Emma W.',
    department: 'Quality Control',
    submittedDate: '2024-10-21',
    priority: 'High',
    description: 'Request to approve fabric with minor defects',
    details: 'Batch contains 2% defects, below 5% threshold but requires approval',
    approvalChain: 'QC Manager → Production Director',
    rejectedBy: 'Alice R.',
    rejectedDate: '2024-10-22',
    rejectionReason: 'Does not meet customer quality standards',
    daysWaiting: 0,
    aiScore: 45,
  },
  { 
    id: 6, 
    title: 'Equipment Purchase - Cutting Machine', 
    type: 'Capital Expenditure', 
    amount: '$125,000', 
    status: 'Pending',
    requestedBy: 'Tom L.',
    department: 'Production',
    submittedDate: '2024-10-22',
    priority: 'Medium',
    description: 'New automated cutting machine for increased efficiency',
    details: 'ROI expected in 18 months, 40% productivity increase',
    approvalChain: 'Production Manager → COO → CFO',
    daysWaiting: 4,
    aiScore: 78,
  },
  { 
    id: 7, 
    title: 'Marketing Campaign - Holiday Season', 
    type: 'Marketing', 
    amount: '$65,000', 
    status: 'Approved',
    requestedBy: 'Nina P.',
    department: 'Marketing',
    submittedDate: '2024-10-18',
    priority: 'High',
    description: 'Holiday season marketing campaign across digital channels',
    details: 'Social media ads, influencer partnerships, email campaigns',
    approvalChain: 'Marketing Director → CMO',
    approvedBy: 'Steve M.',
    approvedDate: '2024-10-19',
    daysWaiting: 0,
    aiScore: 88,
  },
];

const columns: Column[] = [
  { key: 'title', label: 'Request Title', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'requestedBy', label: 'Requested By', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { 
    key: 'amount', 
    label: 'Amount', 
    sortable: true,
    render: (value: string) => (
      <span className="font-medium text-white">{value}</span>
    )
  },
  { 
    key: 'daysWaiting', 
    label: 'Days Waiting', 
    sortable: true,
    render: (value: number, row: any) => {
      if (row.status !== 'Pending') return <span className="text-[#6F83A7]">-</span>;
      return (
        <Badge 
          variant="outline" 
          className={
            value >= 3 
              ? 'border-red-500/30 bg-red-500/10 text-red-400' 
              : value >= 2
              ? 'border-[#EAB308]/30 bg-[#EAB308]/10 text-[#EAB308]'
              : 'border-[#57ACAF]/30 bg-[#57ACAF]/10 text-[#57ACAF]'
          }
        >
          {value}d
        </Badge>
      );
    }
  },
  { 
    key: 'priority', 
    label: 'Priority', 
    sortable: true,
    render: (value: string) => {
      const colors = {
        High: 'border-red-500/30 bg-red-500/10 text-red-400',
        Medium: 'border-[#EAB308]/30 bg-[#EAB308]/10 text-[#EAB308]',
        Low: 'border-[#57ACAF]/30 bg-[#57ACAF]/10 text-[#57ACAF]',
      };
      return (
        <Badge variant="outline" className={colors[value as keyof typeof colors] || colors.Low}>
          {value}
        </Badge>
      );
    }
  },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true,
    render: (value: string) => <StatusBadge status={value} />
  },
];

const aiInsights: AIInsightItem[] = [
  {
    id: '1',
    type: 'recommendation',
    title: 'Urgent: PO-2845 Requires Immediate Attention',
    description: 'Purchase order exceeds standard approval time. Auto-approve recommended based on historical patterns.',
    action: 'Review & Approve',
    priority: 'high',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Budget Allocation Pattern Detected',
    description: 'Q1 budget 15% higher than historical average. Consider reviewing allocation strategy.',
    action: 'View Details',
    priority: 'medium',
  },
  {
    id: '3',
    type: 'insight',
    title: 'Approval Bottleneck Identified',
    description: 'CFO approval taking 3.2x longer than average. Consider delegating authority for <$50K requests.',
    action: 'Optimize Workflow',
    priority: 'low',
  },
  {
    id: '4',
    type: 'recommendation',
    title: 'Auto-Approval Opportunity',
    description: 'Leave Request - David Chen meets all criteria for auto-approval. Save 1.5 days processing time.',
    action: 'Enable Auto-Approve',
    priority: 'medium',
  },
  {
    id: '5',
    type: 'insight',
    title: 'Approval Rate Improvement',
    description: 'Procurement approvals up 22% this month. Equipment purchase requests show strong ROI justification.',
    action: 'View Trends',
    priority: 'low',
  },
];

export function Approve() {
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('all');

  const handleRowClick = (row: any) => {
    setSelectedApproval(row);
    setDrawerOpen(true);
  };

  const handleAskMarbim = (prompt: string) => {
    toast.success('Opening AI Assistant...');
    console.log('AI Prompt:', prompt);
  };

  const handleOpenAI = () => {
    // Open AI panel
  };

  // Filter data based on active view
  const getFilteredData = () => {
    switch (activeView) {
      case 'pending':
        return approvalsData.filter(a => a.status === 'Pending');
      case 'approved':
        return approvalsData.filter(a => a.status === 'Approved');
      case 'rejected':
        return approvalsData.filter(a => a.status === 'Rejected');
      case 'urgent':
        return approvalsData.filter(a => a.status === 'Pending' && (a.priority === 'High' || a.daysWaiting >= 3));
      default:
        return approvalsData;
    }
  };

  const pendingCount = approvalsData.filter(a => a.status === 'Pending').length;
  const approvedCount = approvalsData.filter(a => a.status === 'Approved').length;
  const rejectedCount = approvalsData.filter(a => a.status === 'Rejected').length;
  const urgentCount = approvalsData.filter(a => a.status === 'Pending' && (a.priority === 'High' || a.daysWaiting >= 3)).length;
  
  const avgApprovalTime = 2.4;
  const rejectionRate = 8.5;
  const totalPendingAmount = approvalsData
    .filter(a => a.status === 'Pending')
    .reduce((sum, a) => {
      const amount = parseFloat(a.amount.replace(/[$,]/g, ''));
      return isNaN(amount) ? sum : sum + amount;
    }, 0);

  return (
    <PageLayout
      breadcrumbs={[{ label: 'Approve' }]}
      aiInsightsCount={aiInsights.length}
    >
      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Pending Approvals"
          value={pendingCount.toString()}
          change={-8.3}
          icon={Clock}
          trend="down"
          subtitle={`$${(totalPendingAmount / 1000).toFixed(0)}K total value`}
        />
        <KPICard
          title="Urgent Requests"
          value={urgentCount.toString()}
          change={-15.2}
          icon={AlertTriangle}
          trend="down"
          subtitle={`${urgentCount} require immediate action`}
        />
        <KPICard
          title="Avg. Approval Time"
          value={`${avgApprovalTime} days`}
          change={-12.5}
          icon={TrendingDown}
          trend="down"
          subtitle="Target: <2 days"
        />
        <KPICard
          title="Approval Rate"
          value={`${(100 - rejectionRate).toFixed(1)}%`}
          change={3.2}
          icon={CheckCircle}
          trend="up"
          subtitle={`${rejectedCount} rejected this week`}
        />
      </div>

      {/* AI Quick Actions Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => {
            setActiveView('urgent');
            toast.success('Showing urgent approvals');
          }}
          className="group relative overflow-hidden bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-6 hover:from-red-500/15 hover:to-red-500/10 transition-all duration-300 text-left"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-500/60 flex items-center justify-center shadow-lg shadow-red-500/30">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {urgentCount} items
            </Badge>
          </div>
          <h3 className="text-white font-medium mb-2">Urgent Approvals</h3>
          <p className="text-sm text-[#6F83A7] mb-3">
            {urgentCount} requests need immediate attention
          </p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-400">
                {approvalsData.filter(a => a.daysWaiting >= 3).length} overdue
              </span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#6F83A7]" />
              <span className="text-[#6F83A7]">
                ${(approvalsData
                  .filter(a => a.status === 'Pending' && (a.priority === 'High' || a.daysWaiting >= 3))
                  .reduce((sum, a) => {
                    const amount = parseFloat(a.amount.replace(/[$,]/g, ''));
                    return isNaN(amount) ? sum : sum + amount;
                  }, 0) / 1000).toFixed(0)}K value
              </span>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            const highValueApprovals = approvalsData.filter(a => {
              const amount = parseFloat(a.amount.replace(/[$,]/g, ''));
              return a.status === 'Pending' && !isNaN(amount) && amount >= 100000;
            });
            if (highValueApprovals.length > 0) {
              toast.success(`Showing ${highValueApprovals.length} high-value approvals`);
            }
          }}
          className="group relative overflow-hidden bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6 hover:from-[#EAB308]/15 hover:to-[#EAB308]/10 transition-all duration-300 text-left"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/30">
              <DollarSign className="w-6 h-6 text-black" />
            </div>
            <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30">
              {approvalsData.filter(a => {
                const amount = parseFloat(a.amount.replace(/[$,]/g, ''));
                return a.status === 'Pending' && !isNaN(amount) && amount >= 100000;
              }).length} items
            </Badge>
          </div>
          <h3 className="text-white font-medium mb-2">High-Value Requests</h3>
          <p className="text-sm text-[#6F83A7] mb-3">
            Approvals over $100K threshold
          </p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
              <span className="text-[#EAB308]">
                AI Score: {Math.round(
                  approvalsData
                    .filter(a => {
                      const amount = parseFloat(a.amount.replace(/[$,]/g, ''));
                      return a.status === 'Pending' && !isNaN(amount) && amount >= 100000;
                    })
                    .reduce((sum, a) => sum + a.aiScore, 0) /
                    approvalsData.filter(a => {
                      const amount = parseFloat(a.amount.replace(/[$,]/g, ''));
                      return a.status === 'Pending' && !isNaN(amount) && amount >= 100000;
                    }).length || 0
                )}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#6F83A7]" />
              <span className="text-[#6F83A7]">Capital expense</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleAskMarbim('Analyze my approval patterns and suggest workflow optimizations')}
          className="group relative overflow-hidden bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-6 hover:from-[#57ACAF]/15 hover:to-[#57ACAF]/10 transition-all duration-300 text-left"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="w-2 h-2 rounded-full bg-[#57ACAF] animate-pulse"></div>
          </div>
          <h3 className="text-white font-medium mb-2">AI Recommendations</h3>
          <p className="text-sm text-[#6F83A7] mb-3">
            {aiInsights.filter(i => i.priority === 'high').length} high-priority insights available
          </p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-[#57ACAF]" />
              <span className="text-[#57ACAF]">92% accuracy</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#6F83A7]" />
              <span className="text-[#6F83A7]">Save 1.5 days</span>
            </div>
          </div>
        </button>
      </div>

      {/* Main Content - Full Width */}
      <div className="space-y-6">
          {/* Tabs for filtering */}
          <Tabs defaultValue="all" value={activeView} onValueChange={setActiveView}>
            <div className="bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20 mb-6">
              <TabsList className="w-full bg-transparent border-0 p-0 h-auto grid grid-cols-5 gap-1.5">
                <TabsTrigger 
                  value="all" 
                  className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <FileText className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
                  All ({approvalsData.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="pending"
                  className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <Clock className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="urgent"
                  className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <AlertTriangle className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
                  Urgent ({urgentCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="approved"
                  className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <CheckCircle className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
                  Approved ({approvedCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="rejected"
                  className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <XCircle className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
                  Rejected ({rejectedCount})
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          <SmartTable
            title="Approval Requests"
            data={getFilteredData()}
            columns={columns}
            onRowClick={handleRowClick}
            searchPlaceholder="Search approval requests..."
            actions={
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  onClick={() => toast.info('Exporting data...')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-lg shadow-[#EAB308]/20"
                  onClick={() => handleAskMarbim('Show me approval recommendations for pending requests')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Insights
                </Button>
              </div>
            }
          />
      </div>

      {/* Detail Drawer */}
      {selectedApproval && (
        <ApprovalDetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          approval={selectedApproval}
          onAskMarbim={handleAskMarbim}
          onOpenAI={handleOpenAI}
        />
      )}
    </PageLayout>
  );
}