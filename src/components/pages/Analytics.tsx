import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { DetailDrawer } from '../DetailDrawer';
import { WorkflowStepper } from '../WorkflowStepper';
import { 
  BarChart3, TrendingUp, TrendingDown, Target, AlertCircle, Clock, Calendar, FileText,
  ChevronDown, Plus, Download, Filter, Share2, Zap, Sparkles,
  Users, Eye, Edit, Search, CheckCircle2, XCircle, AlertTriangle,
  Activity, Layers, Network, Percent, DollarSign, Factory, Truck,
  Leaf, Shield, UserCheck, LineChart as LineChartIcon, PieChart as PieChartIcon,
  Send, Mail, FileBarChart, FileSpreadsheet, Settings, PlayCircle,
  Gauge, TrendingUpDown, Lightbulb, Brain, Workflow, GitBranch, Package, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';

// Sample Data for Reports
const reportsData = [
  {
    id: 1,
    name: 'OTIF Performance Report',
    category: 'Standard',
    type: 'PDF',
    lastGenerated: '2024-11-20',
    frequency: 'Weekly',
    status: 'Active',
    recipients: 5,
  },
  {
    id: 2,
    name: 'Supplier Scorecard Q3',
    category: 'Custom',
    type: 'Excel',
    lastGenerated: '2024-11-18',
    frequency: 'Quarterly',
    status: 'Active',
    recipients: 3,
  },
  {
    id: 3,
    name: 'Margin Analysis by Buyer',
    category: 'Standard',
    type: 'PDF',
    lastGenerated: '2024-11-22',
    frequency: 'Monthly',
    status: 'Active',
    recipients: 8,
  },
  {
    id: 4,
    name: 'DHU Trend Report',
    category: 'Standard',
    type: 'PDF',
    lastGenerated: '2024-11-21',
    frequency: 'Daily',
    status: 'Active',
    recipients: 12,
  },
  {
    id: 5,
    name: 'ESG Compliance Summary',
    category: 'Custom',
    type: 'PDF',
    lastGenerated: '2024-11-19',
    frequency: 'Monthly',
    status: 'Scheduled',
    recipients: 4,
  },
];

// Sample Data for Scheduled Reports
const scheduledReportsData = [
  {
    id: 1,
    reportName: 'Board Monthly Pack',
    schedule: 'Monthly - 1st of month',
    nextRun: '2024-12-01',
    recipients: 'Directors (12)',
    status: 'Active',
  },
  {
    id: 2,
    reportName: 'Daily Production Summary',
    schedule: 'Daily - 8:00 AM',
    nextRun: '2024-11-23',
    recipients: 'Production Team (45)',
    status: 'Active',
  },
  {
    id: 3,
    reportName: 'Weekly OTIF Dashboard',
    schedule: 'Weekly - Monday',
    nextRun: '2024-11-25',
    recipients: 'Management (8)',
    status: 'Active',
  },
  {
    id: 4,
    reportName: 'Buyer ESG Report',
    schedule: 'Quarterly',
    nextRun: '2025-01-01',
    recipients: 'External Buyers (6)',
    status: 'Paused',
  },
];

// Chart Data
const kpiTrendData = [
  { month: 'Jul', otif: 92, margin: 15.2, defects: 2.8, efficiency: 87 },
  { month: 'Aug', otif: 88, margin: 14.8, defects: 3.2, efficiency: 85 },
  { month: 'Sep', otif: 91, margin: 13.9, defects: 3.5, efficiency: 84 },
  { month: 'Oct', otif: 94, margin: 14.5, defects: 2.9, efficiency: 88 },
  { month: 'Nov', otif: 95, margin: 15.8, defects: 2.4, efficiency: 90 },
];

const rootCauseData = [
  { factor: 'Fabric Wastage', impact: 45, confidence: 85 },
  { factor: 'Washing Cycles', impact: 25, confidence: 78 },
  { factor: 'Overtime Cost', impact: 15, confidence: 92 },
  { factor: 'Energy Cost', impact: 10, confidence: 88 },
  { factor: 'Others', impact: 5, confidence: 65 },
];

const correlationData = [
  { metric: 'Efficiency vs Cost', correlation: 0.82, trend: 'Positive' },
  { metric: 'DHU vs Rework', correlation: 0.94, trend: 'Positive' },
  { metric: 'Lead Time vs OTIF', correlation: -0.76, trend: 'Negative' },
  { metric: 'Waste vs Margin', correlation: -0.68, trend: 'Negative' },
];

const COLORS = ['#EAB308', '#57ACAF', '#6F83A7', '#F59E0B', '#10B981'];

interface AnalyticsProps {
  initialSubPage?: string;
  onAskMarbim?: (prompt: string) => void;
}

export function Analytics({ initialSubPage = 'role-dashboards', onAskMarbim }: AnalyticsProps) {
  const routeSubpage = useRouteSubpage('role-dashboards', initialSubPage);
  const [subPage, setSubPage] = useState(routeSubpage);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    setSubPage(routeSubpage);
  }, [routeSubpage]);

  const handleRowClick = (item: any) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  // DASHBOARD (ROLE DASHBOARDS) RENDER
  const renderDashboard = () => (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        <KPICard
          title="OTIF %"
          value="95.2%"
          change={3.8}
          icon={Target}
          trend="up"
        />
        <KPICard
          title="Margin vs Cost"
          value="15.8%"
          change={1.2}
          icon={Percent}
          trend="up"
        />
        <KPICard
          title="Efficiency %"
          value="90.3%"
          change={2.1}
          icon={Activity}
          trend="up"
        />
        <KPICard
          title="Defect Rate"
          value="2.4%"
          change={-0.5}
          icon={AlertCircle}
          trend="up"
        />
        <KPICard
          title="ESG Compliance"
          value="94.5%"
          change={-1.5}
          icon={Leaf}
          trend="down"
        />
        <KPICard
          title="Reports Generated"
          value="127"
          change={8.5}
          icon={FileText}
          trend="up"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Role Dashboard Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'sales', name: 'Sales', icon: TrendingUp, color: '#EAB308' },
              { id: 'sourcing', name: 'Sourcing', icon: Package, color: '#57ACAF' },
              { id: 'production', name: 'Production', icon: Factory, color: '#6F83A7' },
              { id: 'qc', name: 'QC', icon: CheckCircle2, color: '#EAB308' },
              { id: 'logistics', name: 'Logistics', icon: Truck, color: '#57ACAF' },
              { id: 'finance', name: 'Finance', icon: DollarSign, color: '#EAB308' },
              { id: 'esg', name: 'ESG', icon: Leaf, color: '#57ACAF' },
            ].map((dashboard) => {
              const Icon = dashboard.icon;
              return (
                <button
                  key={dashboard.id}
                  className="p-4 rounded-xl border border-white/10 bg-[#1a1f2e] hover:border-[#57ACAF]/30 transition-all duration-180"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-white/5"
                    style={{ borderColor: dashboard.color, borderWidth: '1px' }}>
                    <Icon className="w-5 h-5" style={{ color: dashboard.color }} />
                  </div>
                  <p className="text-sm text-[#6F83A7]">{dashboard.name}</p>
                </button>
              );
            }).slice(0, 4)}
          </div>

          {/* KPI Trends Chart */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4 flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-[#EAB308]" />
              KPI Trends - Last 5 Months
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kpiTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#6F83A7" />
                <YAxis stroke="#6F83A7" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1f2e', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="otif" stroke="#EAB308" strokeWidth={2} name="OTIF %" />
                <Line type="monotone" dataKey="margin" stroke="#57ACAF" strokeWidth={2} name="Margin %" />
                <Line type="monotone" dataKey="efficiency" stroke="#6F83A7" strokeWidth={2} name="Efficiency %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Performance by Department */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
              Performance by Department
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { dept: 'Sales', score: 92 },
                { dept: 'Sourcing', score: 88 },
                { dept: 'Production', score: 85 },
                { dept: 'QC', score: 94 },
                { dept: 'Logistics', score: 90 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="dept" stroke="#6F83A7" />
                <YAxis stroke="#6F83A7" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1f2e', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="score" fill="#EAB308" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - 1/3 width - AI Insights Sidebar */}
        <div className="space-y-6">
          <AICard
            title="MARBIM Analytics Insights"
            marbimPrompt="Provide detailed analytics intelligence including margin analysis, supplier defect trends, production line optimization, and OTIF performance improvements."
            onAskMarbim={onAskMarbim}
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Margin dipped 3% in Q3 due to higher fabric wastage and longer washing cycles.</div>
                    <Button size="sm" onClick={() => toast.warning('Opening margin analysis')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Analyze
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Supplier KnitEx BD shows increasing defect trend — consider audit.</div>
                    <Button size="sm" onClick={() => toast.warning('Opening supplier audit report')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Review
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-4 h-4 text-[#6F83A7] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Recommending rescheduling low-efficiency lines to improve output by 5%.</div>
                    <Button size="sm" onClick={() => toast.success('Opening reallocation plan')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Optimize
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AICard>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <h4 className="text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#EAB308]" />
              Quick Stats
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#6F83A7] text-sm">Reports Generated</span>
                <span className="text-white">127</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6F83A7] text-sm">Active Schedules</span>
                <span className="text-white">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6F83A7] text-sm">Stakeholder Views</span>
                <span className="text-white">2,451</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // EXPLAINERS SUB-PAGE
  const renderExplainers = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">AI Explainers</h2>
            <p className="text-sm text-[#6F83A7]">Root-cause analysis, correlations, and what-if scenarios</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <PlayCircle className="w-4 h-4 mr-2" />
              Run Analysis
            </Button>
          </div>
        </div>

        <Tabs defaultValue="root-cause" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
            <TabsList className="w-full grid grid-cols-3 bg-transparent gap-1.5 p-0 h-auto">
              <TabsTrigger 
                value="root-cause" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <GitBranch className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Root-Cause</span>
              </TabsTrigger>
              <TabsTrigger 
                value="correlation" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Network className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Correlation</span>
              </TabsTrigger>
              <TabsTrigger 
                value="what-if" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Layers className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">What-If</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Root-Cause Tab */}
          <TabsContent value="root-cause" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-[#EAB308]" />
                    Root Cause Analysis: Margin Drop
                  </h3>
                  <Select defaultValue="margin">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="margin">Margin %</SelectItem>
                      <SelectItem value="efficiency">Efficiency %</SelectItem>
                      <SelectItem value="defects">Defects Rate</SelectItem>
                      <SelectItem value="otif">OTIF %</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rootCauseData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis type="number" stroke="#6F83A7" />
                    <YAxis dataKey="factor" type="category" stroke="#6F83A7" width={120} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1f2e', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="impact" fill="#EAB308" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-6 p-4 rounded-xl bg-[#EAB308]/5 border border-[#EAB308]/20">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-[#EAB308] mt-0.5" />
                    <div>
                      <h4 className="text-white mb-2">AI Analysis</h4>
                      <p className="text-sm text-[#6F83A7] leading-relaxed">
                        Margin decreased by 3% in Q3. Primary causes: <strong className="text-white">Fabric wastage increased 45%</strong> (confidence 85%) 
                        due to new marker layouts, and <strong className="text-white">washing cycles extended 25%</strong> (confidence 78%) 
                        due to quality requirements. Recommend optimizing cutting patterns and reviewing washing protocols.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <AICard
                  title="Contributing Factors"
                  insights={[
                    {
                      text: "Fabric wastage: +5% in cutting department",
                      severity: 'warning',
                      prompt: "Analyze cutting waste details"
                    },
                    {
                      text: "Utility costs: +7% due to extended washing",
                      severity: 'alert',
                      prompt: "Show utility cost breakdown"
                    },
                    {
                      text: "Overtime: +15% on finishing lines",
                      severity: 'info',
                      prompt: "Review overtime allocation"
                    },
                  ]}
                />

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <h4 className="text-white mb-4">Confidence Levels</h4>
                  {rootCauseData.map((item) => (
                    <div key={item.factor} className="mb-3 last:mb-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#6F83A7]">{item.factor}</span>
                        <span className="text-white">{item.confidence}%</span>
                      </div>
                      <Progress value={item.confidence} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Correlation Tab */}
          <TabsContent value="correlation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-white mb-6 flex items-center gap-2">
                  <Network className="w-5 h-5 text-[#57ACAF]" />
                  KPI Correlation Matrix
                </h3>

                <div className="space-y-4">
                  {correlationData.map((item) => (
                    <div key={item.metric} className="p-4 rounded-xl bg-[#252b3b] border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white">{item.metric}</span>
                        <Badge variant={item.trend === 'Positive' ? 'default' : 'secondary'}>
                          {item.trend}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Progress value={Math.abs(item.correlation) * 100} className="h-2" />
                        </div>
                        <span className={`text-sm font-medium ${item.correlation > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {item.correlation > 0 ? '+' : ''}{item.correlation.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <AICard
                title="Correlation Insights"
                insights={[
                  {
                    text: "Strong correlation (0.94) between DHU and rework rate detected.",
                    severity: 'info',
                    prompt: "Analyze DHU-rework relationship"
                  },
                  {
                    text: "Efficiency improvements directly reduce production cost by 82%.",
                    severity: 'success',
                    prompt: "Show efficiency impact simulation"
                  },
                  {
                    text: "Lead-time reduction shows -0.76 correlation with OTIF delays.",
                    severity: 'warning',
                    prompt: "Generate lead-time optimization plan"
                  },
                ]}
              />
            </div>
          </TabsContent>

          {/* What-If Tab */}
          <TabsContent value="what-if" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-white mb-6 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#EAB308]" />
                    Scenario Planning
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Efficiency Change (%)</label>
                      <Input type="number" defaultValue="5" className="bg-[#252b3b] text-[rgb(10,10,10)]" />
                    </div>
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Fabric Cost Change (%)</label>
                      <Input type="number" defaultValue="-3" className="bg-[#252b3b]" />
                    </div>
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Lead Time (days)</label>
                      <Input type="number" defaultValue="-2" className="bg-[#252b3b]" />
                    </div>
                    <div>
                      <label className="text-sm text-[#6F83A7] mb-2 block">Rework Rate (%)</label>
                      <Input type="number" defaultValue="-1" className="bg-[#252b3b]" />
                    </div>
                  </div>

                  <Button className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Run Simulation
                  </Button>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-white mb-4">Predicted Impact</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#252b3b] border border-white/5 text-center">
                      <div className="text-2xl text-[#EAB308] mb-1">+$47K</div>
                      <div className="text-xs text-[#6F83A7]">Monthly Margin</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#252b3b] border border-white/5 text-center">
                      <div className="text-2xl text-[#57ACAF] mb-1">+4.5%</div>
                      <div className="text-xs text-[#6F83A7]">OTIF Improvement</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#252b3b] border border-white/5 text-center">
                      <div className="text-2xl text-green-400 mb-1">-8%</div>
                      <div className="text-xs text-[#6F83A7]">Cost Reduction</div>
                    </div>
                  </div>
                </div>
              </div>

              <AICard
                title="AI Recommendations"
                insights={[
                  {
                    text: "Lead-time reduction by 2 days could improve OTIF by 4.5%.",
                    severity: 'success',
                    prompt: "Generate lead-time action plan"
                  },
                  {
                    text: "Reducing rework rate by 1% adds $12K monthly margin.",
                    severity: 'info',
                    prompt: "Show rework reduction strategies"
                  },
                  {
                    text: "5% efficiency gain yields 8% total cost reduction.",
                    severity: 'info',
                    prompt: "Create efficiency improvement roadmap"
                  },
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // REPORTS LIBRARY SUB-PAGE
  const renderReportsLibrary = () => {
    const reportColumns: Column[] = [
      { 
        key: 'name', 
        label: 'Report Name',
        render: (value, row) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#EAB308]" />
            </div>
            <div>
              <div className="text-white">{value}</div>
              <div className="text-xs text-[#6F83A7]">{row.type}</div>
            </div>
          </div>
        )
      },
      { 
        key: 'category', 
        label: 'Category',
        render: (value) => (
          <Badge variant={value === 'Standard' ? 'default' : 'secondary'}>
            {value}
          </Badge>
        )
      },
      { key: 'lastGenerated', label: 'Last Generated' },
      { key: 'frequency', label: 'Frequency' },
      { 
        key: 'recipients', 
        label: 'Recipients',
        render: (value) => (
          <div className="flex items-center gap-1.5 text-[#6F83A7]">
            <Users className="w-3.5 h-3.5" />
            <span>{value}</span>
          </div>
        )
      },
      { 
        key: 'status', 
        label: 'Status',
        render: (value) => (
          <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
            {value}
          </Badge>
        )
      },
    ];

    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Reports Library</h2>
            <p className="text-sm text-[#6F83A7]">Standard, custom, and shared reports</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="standard" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
            <TabsList className="w-full grid grid-cols-3 bg-transparent gap-1.5 p-0 h-auto">
              <TabsTrigger 
                value="standard" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <FileText className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Standard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="custom" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <FileBarChart className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Custom</span>
              </TabsTrigger>
              <TabsTrigger 
                value="shared" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Share2 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Shared</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Standard Reports Tab */}
          <TabsContent value="standard" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <SmartTable
                data={reportsData.filter(r => r.category === 'Standard')}
                columns={reportColumns}
                onRowClick={handleRowClick}
                searchPlaceholder="Search reports..."
              />
            </div>
          </TabsContent>

          {/* Custom Reports Tab */}
          <TabsContent value="custom" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <SmartTable
                data={reportsData.filter(r => r.category === 'Custom')}
                columns={reportColumns}
                onRowClick={handleRowClick}
                searchPlaceholder="Search custom reports..."
              />
            </div>

            <AICard
              title="Custom Report Suggestions"
              insights={[
                {
                  text: "Would you like to add Energy Intensity vs Production Efficiency correlation?",
                  severity: 'info',
                  prompt: "Create energy-efficiency report"
                },
                {
                  text: "Buyer-specific ESG report template available for external sharing.",
                  severity: 'success',
                  prompt: "Generate buyer ESG report"
                },
              ]}
            />
          </TabsContent>

          {/* Shared Reports Tab */}
          <TabsContent value="shared" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <SmartTable
                data={reportsData.slice(0, 3)}
                columns={reportColumns}
                onRowClick={handleRowClick}
                searchPlaceholder="Search shared reports..."
              />
            </div>

            <AICard
              title="Sharing Insights"
              insights={[
                {
                  text: "Top 3 reports accessed by management: OTIF, Margin Trend, Supplier Reliability.",
                  severity: 'info',
                  prompt: "Show report access analytics"
                },
                {
                  text: "External stakeholder engagement increased 24% this month.",
                  severity: 'success',
                  prompt: "Generate engagement report"
                },
              ]}
            />
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // SCHEDULED REPORTS SUB-PAGE
  const renderScheduledReports = () => {
    const scheduledColumns: Column[] = [
      { 
        key: 'reportName', 
        label: 'Report Name',
        render: (value) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#57ACAF]" />
            </div>
            <span className="text-white">{value}</span>
          </div>
        )
      },
      { key: 'schedule', label: 'Schedule' },
      { key: 'nextRun', label: 'Next Run' },
      { key: 'recipients', label: 'Recipients' },
      { 
        key: 'status', 
        label: 'Status',
        render: (value) => (
          <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
            {value}
          </Badge>
        )
      },
    ];

    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Scheduled Reports</h2>
            <p className="text-sm text-[#6F83A7]">Automated report generation and distribution</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Eye className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              New Schedule
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
            <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
              <TabsTrigger 
                value="overview" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Clock className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="schedules" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Calendar className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Schedules</span>
              </TabsTrigger>
              <TabsTrigger 
                value="recipients" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Users className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Recipients</span>
              </TabsTrigger>
              <TabsTrigger 
                value="delivery" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Send className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Delivery</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Active</h4>
                  <Clock className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">18</div>
                <p className="text-xs text-[#6F83A7]">Schedules</p>
              </div>
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Sent Today</h4>
                  <Send className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">342</div>
                <p className="text-xs text-[#6F83A7]">Reports</p>
              </div>
              <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Delivery Rate</h4>
                  <CheckCircle2 className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="text-3xl text-white mb-1">98.5%</div>
                <p className="text-xs text-[#6F83A7]">Success</p>
              </div>
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Recipients</h4>
                  <Users className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">156</div>
                <p className="text-xs text-[#6F83A7]">Total</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#57ACAF]" />
                Upcoming Runs (Next 7 Days)
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Daily Production Summary', time: 'Tomorrow, 8:00 AM', status: 'Scheduled' },
                  { name: 'Weekly OTIF Dashboard', time: 'Nov 25, 9:00 AM', status: 'Scheduled' },
                  { name: 'Board Monthly Pack', time: 'Dec 1, 7:00 AM', status: 'Scheduled' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#EAB308] mt-2" />
                      <div>
                        <div className="text-white text-sm">{item.name}</div>
                        <div className="text-xs text-[#6F83A7]">{item.time}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <SmartTable
                data={scheduledReportsData}
                columns={scheduledColumns}
                onRowClick={handleRowClick}
                searchPlaceholder="Search schedules..."
              />
            </div>
          </TabsContent>

          {/* Recipients Tab */}
          <TabsContent value="recipients" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Recipient Groups</h3>
              <div className="space-y-2">
                {[
                  { name: 'Directors', count: 12, type: 'Internal' },
                  { name: 'Production Team', count: 45, type: 'Internal' },
                  { name: 'Management', count: 8, type: 'Internal' },
                  { name: 'External Buyers', count: 6, type: 'External' },
                ].map((group, index) => (
                  <div key={index} className="p-3 rounded-lg bg-[#1a1f2e] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EAB308]/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#EAB308]" />
                      </div>
                      <div>
                        <div className="text-white text-sm">{group.name}</div>
                        <div className="text-xs text-[#6F83A7]">{group.count} members • {group.type}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Recent Deliveries</h3>
              <div className="space-y-2">
                {[
                  { report: 'Daily Production Summary', sent: 'Nov 22, 09:00 AM', status: 'Delivered', opens: '9/12' },
                  { report: 'Weekly OTIF Dashboard', sent: 'Nov 18, 09:00 AM', status: 'Delivered', opens: '7/8' },
                  { report: 'Board Monthly Pack', sent: 'Nov 1, 07:00 AM', status: 'Delivered', opens: '12/12' },
                ].map((delivery, index) => (
                  <div key={index} className="p-3 rounded-lg bg-[#1a1f2e] border border-white/5">
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm">{delivery.report}</span>
                      <Badge variant="outline">{delivery.status}</Badge>
                    </div>
                    <div className="flex justify-between text-xs text-[#6F83A7]">
                      <span>{delivery.sent}</span>
                      <span>Opened: {delivery.opens}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AICard
              title="Delivery Insights"
              insights={[
                {
                  text: "Board report opened by 9 of 12 stakeholders.",
                  severity: 'success',
                  prompt: "Show board report analytics"
                },
                {
                  text: "Buyer ESG report bounced — invalid recipient email.",
                  severity: 'alert',
                  prompt: "Review recipient list"
                },
                {
                  text: "Daily production summary has 100% delivery rate.",
                  severity: 'info',
                  prompt: "View delivery tracker"
                },
              ]}
            />
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // MAIN RENDER LOGIC
  const renderContent = () => {
    if (subPage === 'role-dashboards' || subPage === 'dashboard') {
      return renderDashboard();
    } else if (subPage === 'explainers') {
      return renderExplainers();
    } else if (subPage === 'reports-library') {
      return renderReportsLibrary();
    } else if (subPage === 'scheduled-reports') {
      return renderScheduledReports();
    } else {
      return renderDashboard();
    }
  };

  // Get breadcrumb label based on current sub-page
  const getBreadcrumbs = () => {
    const baseBreadcrumbs = [
      { label: 'Analytics & Insights' },
      { label: 'Analytics & Reporting' }
    ];

    const subPageLabels: { [key: string]: string } = {
      'role-dashboards': 'Role Dashboards',
      'dashboard': 'Role Dashboards',
      'explainers': 'Explainers',
      'reports-library': 'Reports Library',
      'scheduled-reports': 'Scheduled Reports',
    };

    const subPageLabel = subPageLabels[subPage];
    if (subPageLabel) {
      return [...baseBreadcrumbs, { label: subPageLabel }];
    }

    return baseBreadcrumbs;
  };

  return (
    <>
      <PageLayout
        breadcrumbs={getBreadcrumbs()}
        aiInsightsCount={12}
      >
        {renderContent()}
      </PageLayout>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedItem?.name || selectedItem?.reportName || 'Details'}
        tabs={[
          {
            id: 'overview',
            label: 'Overview',
            icon: FileText,
            content: (
              <div className="space-y-4">
                <div>
                  <h4 className="text-white mb-2">Details</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(selectedItem || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-[#6F83A7] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-white">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          },
          {
            id: 'metrics',
            label: 'Metrics',
            icon: BarChart3,
            content: (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#1a1f2e] border border-white/10">
                  <h4 className="text-white mb-3">Included Metrics</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">OTIF %</Badge>
                    <Badge variant="outline">Margin</Badge>
                    <Badge variant="outline">Efficiency</Badge>
                    <Badge variant="outline">DHU</Badge>
                    <Badge variant="outline">Lead Time</Badge>
                  </div>
                </div>
              </div>
            )
          },
          {
            id: 'recipients',
            label: 'Recipients',
            icon: Users,
            content: (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-[#1a1f2e] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAB308]/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#EAB308]" />
                    </div>
                    <div>
                      <div className="text-white text-sm">Directors Group</div>
                      <div className="text-xs text-[#6F83A7]">12 members</div>
                    </div>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </div>
            )
          },
          {
            id: 'history',
            label: 'History',
            icon: Clock,
            content: (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-[#1a1f2e] border border-white/5">
                  <div className="flex justify-between mb-2">
                    <span className="text-white text-sm">Nov 22, 2024 - 09:00 AM</span>
                    <Badge variant="outline">Delivered</Badge>
                  </div>
                  <p className="text-xs text-[#6F83A7]">Sent to 12 recipients • 9 opened</p>
                </div>
              </div>
            )
          },
        ]}
      />
    </>
  );
}
