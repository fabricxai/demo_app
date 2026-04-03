import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { DetailDrawer } from '../DetailDrawer';
import { WorkflowStepper } from '../WorkflowStepper';
import { MarbimAIButton } from '../MarbimAIButton';
import { 
  Shield, AlertTriangle, CheckCircle2, Clock, Calendar, FileText,
  ChevronDown, Plus, Download, Filter, Upload, Zap, Sparkles,
  Building2, MapPin, TrendingUp, Target, Users, Eye, Edit, Search,
  GitBranch, History, CheckSquare, XCircle, AlertCircle, BookOpen,
  Clipboard, BarChart3, Globe, Leaf
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
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
} from 'recharts';

// Sample Data
const policiesData = [
  {
    id: 1,
    title: 'Child Labor Prevention Policy',
    category: 'Social',
    owner: 'HR Compliance',
    effectiveDate: '2024-01-15',
    reviewDate: '2025-01-15',
    status: 'Active',
    relatedStandards: 'WRAP, ILO, SMETA',
    coverage: 100,
  },
  {
    id: 2,
    title: 'Environmental Impact Management',
    category: 'Environment',
    owner: 'Sustainability Team',
    effectiveDate: '2024-03-20',
    reviewDate: '2024-12-20',
    status: 'Under Review',
    relatedStandards: 'ISO14001, ESPR',
    coverage: 92,
  },
  {
    id: 3,
    title: 'Workplace Health & Safety Protocol',
    category: 'Health & Safety',
    owner: 'Safety Officer',
    effectiveDate: '2024-02-10',
    reviewDate: '2025-02-10',
    status: 'Active',
    relatedStandards: 'OSHA, SMETA',
    coverage: 98,
  },
  {
    id: 4,
    title: 'Fair Wages & Working Hours',
    category: 'HR',
    owner: 'HR Compliance',
    effectiveDate: '2024-01-01',
    reviewDate: '2024-11-01',
    status: 'Expiring Soon',
    relatedStandards: 'ILO, Bangladesh Labor Act',
    coverage: 85,
  },
];

const auditsData = [
  {
    id: 1,
    factory: 'Dhaka Factory 1',
    auditType: 'SMETA 6.1',
    scope: 'Full Audit',
    auditor: 'SGS',
    date: '2024-11-15',
    buyer: 'H&M',
    status: 'Scheduled',
  },
  {
    id: 2,
    factory: 'Chittagong Factory 2',
    auditType: 'WRAP',
    scope: 'Social Compliance',
    auditor: 'Bureau Veritas',
    date: '2024-11-20',
    buyer: 'Zara',
    status: 'In Progress',
  },
  {
    id: 3,
    factory: 'Dhaka Factory 3',
    auditType: 'ISO 14001',
    scope: 'Environmental',
    auditor: 'Intertek',
    date: '2024-12-05',
    buyer: 'Nike',
    status: 'Scheduled',
  },
];

const findingsData = [
  {
    id: 'NC-2024-001',
    clause: 'SMETA 4.1.3',
    description: 'Incomplete working hours documentation for Line 5',
    severity: 'Major',
    assignedTo: 'HR Manager',
    dueDate: '2024-11-10',
    status: 'Open',
  },
  {
    id: 'NC-2024-002',
    clause: 'WRAP 12.2',
    description: 'Fire exit blocked on 2nd floor',
    severity: 'Critical',
    assignedTo: 'Safety Officer',
    dueDate: '2024-10-28',
    status: 'Overdue',
  },
  {
    id: 'NC-2024-003',
    clause: 'ISO14001 6.1.2',
    description: 'Waste segregation not properly implemented',
    severity: 'Minor',
    assignedTo: 'Sustainability Lead',
    dueDate: '2024-11-15',
    status: 'In Progress',
  },
];

const capaData = [
  {
    id: 'CAPA-2024-012',
    ncReference: 'NC-2024-002',
    action: 'Remove storage items blocking fire exit, install clear signage',
    owner: 'Safety Officer',
    dueDate: '2024-10-28',
    status: 'Verification Pending',
  },
  {
    id: 'CAPA-2024-013',
    ncReference: 'NC-2024-001',
    action: 'Implement digital attendance tracking system for all lines',
    owner: 'IT & HR Team',
    dueDate: '2024-11-10',
    status: 'In Progress',
  },
];

interface CompliancePolicyProps {
  initialSubPage?: string;
  onAskMarbim?: (prompt: string) => void;
  onNavigateToPage?: (page: string) => void;
}

export function CompliancePolicy({ initialSubPage = 'dashboard', onAskMarbim, onNavigateToPage }: CompliancePolicyProps) {
  const routeSubpage = useRouteSubpage('dashboard', initialSubPage);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [subPage, setSubPage] = useState(routeSubpage);

  useEffect(() => {
    setSubPage(routeSubpage);
  }, [routeSubpage]);

  const handleRowClick = (item: any) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  // DASHBOARD RENDER
  const renderDashboard = () => (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        <KPICard
          title="Audit Readiness"
          value="94%"
          change={3.2}
          icon={Shield}
          trend="up"
        />
        <KPICard
          title="Non-Conformities"
          value="12"
          change={-3}
          changeLabel="from last audit"
          icon={AlertTriangle}
          trend="up"
        />
        <KPICard
          title="Certificates Expiring"
          value="3"
          change={0}
          changeLabel="this month"
          icon={AlertCircle}
          trend="neutral"
        />
        <KPICard
          title="Read & Sign Complete"
          value="87%"
          change={5}
          icon={CheckSquare}
          trend="up"
        />
        <KPICard
          title="Policy Coverage"
          value="96%"
          change={2}
          icon={BookOpen}
          trend="up"
        />
        <KPICard
          title="CAPA Closure Rate"
          value="82%"
          change={8}
          icon={Target}
          trend="up"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Compliance Calendar */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EAB308]/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div>
                  <h3 className="text-white">Compliance Calendar</h3>
                  <p className="text-xs text-[#6F83A7]">Upcoming audits, renewals, and deadlines</p>
                </div>
              </div>
              <Button variant="outline" className="border-white/10">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { event: 'SMETA 6.1 Audit', location: 'Dhaka Factory 1', date: 'Nov 15, 2024', type: 'audit', color: '#EAB308' },
                { event: 'WRAP Certificate Renewal', location: 'All Facilities', date: 'Nov 20, 2024', type: 'certificate', color: '#57ACAF' },
                { event: 'Child Labor Policy Review', location: 'Corporate', date: 'Dec 01, 2024', type: 'policy', color: '#6F83A7' },
                { event: 'ISO 14001 Surveillance Audit', location: 'Chittagong Factory', date: 'Dec 05, 2024', type: 'audit', color: '#EAB308' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    {item.type === 'audit' && <Clipboard className="w-6 h-6" style={{ color: item.color }} />}
                    {item.type === 'certificate' && <Shield className="w-6 h-6" style={{ color: item.color }} />}
                    {item.type === 'policy' && <FileText className="w-6 h-6" style={{ color: item.color }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm mb-1">{item.event}</h4>
                    <p className="text-xs text-[#6F83A7]">{item.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white mb-1">{item.date}</div>
                    <Badge className="bg-white/10 text-[#6F83A7] text-xs">
                      {item.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Risk Heatmap */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EF4444]/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="text-white">AI Risk Heatmap</h3>
                  <p className="text-xs text-[#6F83A7]">Compliance risk by factory, buyer, and supplier</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { entity: 'Dhaka F1', risk: 'low', score: 92 },
                { entity: 'Chittagong F2', risk: 'medium', score: 78 },
                { entity: 'Dhaka F3', risk: 'low', score: 88 },
                { entity: 'Gazipur F4', risk: 'high', score: 62 },
                { entity: 'H&M Buyer', risk: 'low', score: 95 },
                { entity: 'Zara Buyer', risk: 'low', score: 90 },
                { entity: 'Nike Buyer', risk: 'medium', score: 75 },
                { entity: 'Gap Buyer', risk: 'medium', score: 80 },
                { entity: 'Supplier A', risk: 'low', score: 89 },
                { entity: 'Supplier B', risk: 'high', score: 65 },
                { entity: 'Supplier C', risk: 'medium', score: 72 },
                { entity: 'Supplier D', risk: 'low', score: 91 },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border cursor-pointer hover:scale-105 transition-transform ${
                    item.risk === 'low' ? 'bg-[#57ACAF]/10 border-[#57ACAF]/30' :
                    item.risk === 'medium' ? 'bg-[#EAB308]/10 border-[#EAB308]/30' :
                    'bg-[#EF4444]/10 border-[#EF4444]/30'
                  }`}
                >
                  <div className="text-xs text-white mb-1 truncate">{item.entity}</div>
                  <div className={`text-lg ${
                    item.risk === 'low' ? 'text-[#57ACAF]' :
                    item.risk === 'medium' ? 'text-[#EAB308]' :
                    'text-[#EF4444]'
                  }`}>{item.score}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#57ACAF]"></div>
                <span className="text-xs text-[#6F83A7]">Low Risk (85-100)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EAB308]"></div>
                <span className="text-xs text-[#6F83A7]">Medium Risk (70-84)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                <span className="text-xs text-[#6F83A7]">High Risk (&lt;70)</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}

        </div>

        {/* Right Column - 1/3 width - AI Suggestions */}
        <div className="space-y-6">
          <AICard
            title="MARBIM Compliance Insights"
            marbimPrompt="Provide detailed compliance intelligence including certificate expiration alerts, policy drafting requirements, and audit preparation recommendations."
            onAskMarbim={onAskMarbim}
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">You have 3 certificates expiring this month.</div>
                    <Button size="sm" onClick={() => toast.info('Opening certificate renewal list')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Draft child labor prevention policy aligned with WRAP.</div>
                    <Button size="sm" onClick={() => toast.success('Generating policy draft')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Generate Draft
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <CheckSquare className="w-4 h-4 text-[#6F83A7] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Prepare pre-audit checklist for buyer ABC.</div>
                    <Button size="sm" onClick={() => toast.success('Opening checklist generator')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Prepare Checklist
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AICard>
        </div>
      </div>
    </>
  );

  // POLICY LIBRARY RENDER
  const renderPolicyLibrary = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Policy Library</h2>
            <p className="text-sm text-[#6F83A7]">AI-driven document repository mapped to compliance standards</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              New Policy
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
                <BookOpen className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="controls" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <GitBranch className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Controls Map</span>
              </TabsTrigger>
              <TabsTrigger 
                value="version" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <History className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Version History</span>
              </TabsTrigger>
              <TabsTrigger 
                value="approval" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <CheckSquare className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Approval Workflow</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Coverage Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">HR Policies</h4>
                  <Users className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">12</div>
                <p className="text-xs text-[#6F83A7]">Active policies</p>
                <div className="mt-2">
                  <span className="text-xs text-[#57ACAF]">95% coverage</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Environment</h4>
                  <Leaf className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">8</div>
                <p className="text-xs text-[#6F83A7]">Active policies</p>
                <div className="mt-2">
                  <span className="text-xs text-[#57ACAF]">92% coverage</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Social</h4>
                  <Globe className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="text-3xl text-white mb-1">15</div>
                <p className="text-xs text-[#6F83A7]">Active policies</p>
                <div className="mt-2">
                  <span className="text-xs text-[#57ACAF]">98% coverage</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Health & Safety</h4>
                  <Shield className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">18</div>
                <p className="text-xs text-[#6F83A7]">Active policies</p>
                <div className="mt-2">
                  <span className="text-xs text-[#57ACAF]">100% coverage</span>
                </div>
              </div>
            </div>

            {/* AI Coverage Analysis */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
                <h3 className="text-white">AI Coverage Analysis</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-[#EAB308]" />
                    <h4 className="text-white text-sm">Coverage Gaps Identified</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-[#6F83A7]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#EAB308] mt-0.5">•</span>
                      <span>Missing: Water Stewardship Policy (required by Nike CoC)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#EAB308] mt-0.5">•</span>
                      <span>Incomplete: Chemical Management aligns only 78% with ZDHC</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                    <h4 className="text-white text-sm">AI Recommendations</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-[#6F83A7]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#57ACAF] mt-0.5">•</span>
                      <span>Generate Water Policy draft using WRAP template</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#57ACAF] mt-0.5">•</span>
                      <span>Update Chemical Management to match ZDHC v2.0 requirements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Policies Table */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-white">All Policies</h3>
              </div>
              <SmartTable
                columns={[
                  {
                    key: 'title',
                    label: 'Policy Title',
                    render: (value: string, row: any) => (
                      <div>
                        <div className="text-white">{value}</div>
                        <div className="text-xs text-[#6F83A7] mt-0.5">{row.category}</div>
                      </div>
                    ),
                  },
                  { key: 'owner', label: 'Owner' },
                  { key: 'effectiveDate', label: 'Effective Date' },
                  { key: 'reviewDate', label: 'Review Date' },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value: string) => (
                      <Badge className={`
                        ${value === 'Active' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${value === 'Under Review' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${value === 'Expiring Soon' ? 'bg-orange-500/20 text-orange-400' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                  { key: 'relatedStandards', label: 'Related Standards' },
                  {
                    key: 'coverage',
                    label: 'Coverage',
                    render: (value: number) => (
                      <div className="flex items-center gap-2">
                        <Progress value={value} className="h-1.5 w-20" />
                        <span className="text-white text-xs">{value}%</span>
                      </div>
                    ),
                  },
                ]}
                data={policiesData}
                onRowClick={handleRowClick}
              />
            </div>
          </TabsContent>

          {/* Controls Map Tab */}
          <TabsContent value="controls" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white mb-1">Policy Controls Mapping</h3>
                  <p className="text-xs text-[#6F83A7]">Visual matrix mapping policy clauses to controls and evidence</p>
                </div>
                <Button variant="outline" className="border-white/10">
                  <Download className="w-4 h-4 mr-2" />
                  Export Matrix
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    clause: '1.1 Child Labor Prevention',
                    control: 'Age verification at recruitment',
                    owner: 'HR Department',
                    evidenceType: 'Document',
                    evidenceLink: 'Age verification records',
                    status: 'Effective',
                  },
                  {
                    clause: '2.3 Working Hours Compliance',
                    control: 'Digital time tracking system',
                    owner: 'Operations',
                    evidenceType: 'System Log',
                    evidenceLink: 'Attendance database',
                    status: 'Effective',
                  },
                  {
                    clause: '3.2 Grievance Mechanism',
                    control: 'Anonymous complaint box + hotline',
                    owner: 'HR Compliance',
                    evidenceType: 'Process',
                    evidenceLink: 'Grievance log',
                    status: 'Needs Improvement',
                  },
                  {
                    clause: '4.1 Chemical Storage',
                    control: 'MSDS documentation + locked storage',
                    owner: 'Safety Officer',
                    evidenceType: 'Inspection',
                    evidenceLink: 'Monthly inspection reports',
                    status: 'Effective',
                  },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <div className="text-xs text-[#6F83A7] mb-1">Clause</div>
                        <div className="text-white text-sm">{item.clause}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs text-[#6F83A7] mb-1">Control</div>
                        <div className="text-white text-sm">{item.control}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6F83A7] mb-1">Owner</div>
                        <div className="text-white text-sm">{item.owner}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6F83A7] mb-1">Status</div>
                        <Badge className={`
                          ${item.status === 'Effective' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                          ${item.status === 'Needs Improvement' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        `}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/10">
                      <div>
                        <div className="text-xs text-[#6F83A7] mb-1">Evidence Type</div>
                        <div className="text-white text-sm">{item.evidenceType}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6F83A7] mb-1">Evidence Link</div>
                        <Button variant="link" className="h-auto p-0 text-[#57ACAF] text-sm">
                          {item.evidenceLink}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Control Insights */}
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#EAB308]" />
                    <h4 className="text-white text-sm">AI Control Analysis</h4>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze compliance control overlaps across all active standards (SMETA, WRAP, ISO, etc.), identify redundant controls that can be consolidated, calculate control effectiveness ratings based on audit history, and recommend optimization strategies to streamline compliance management."
                    onAskMarbim={onAskMarbim}
                    size="lg"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#6F83A7]">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#EAB308] mt-0.5 flex-shrink-0" />
                    <span>Overlapping controls detected between SMETA 2.1 and WRAP 3. Consider consolidation.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                    <span>Control effectiveness rating: 87% based on last 6 audit cycles.</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Version History Tab */}
          <TabsContent value="version" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white">Policy Version History</h3>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-white/10" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter by Policy
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    policy: 'Child Labor Prevention Policy',
                    version: 'v3.2',
                    date: '2024-10-15',
                    approver: 'Compliance Head',
                    changes: 'Updated age verification process, added ILO Convention references',
                    impact: 'Medium',
                  },
                  {
                    policy: 'Environmental Impact Management',
                    version: 'v2.1',
                    date: '2024-09-20',
                    approver: 'Sustainability Director',
                    changes: 'Aligned with ESPR requirements, added water stewardship clauses',
                    impact: 'High',
                  },
                  {
                    policy: 'Workplace Health & Safety Protocol',
                    version: 'v4.0',
                    date: '2024-08-10',
                    approver: 'Safety Officer',
                    changes: 'Fire safety protocol update, emergency evacuation procedures revised',
                    impact: 'Critical',
                  },
                ].map((item, index) => (
                  <div key={index} className="p-5 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white">{item.policy}</h4>
                          <Badge className="bg-[#57ACAF]/20 text-[#57ACAF]">{item.version}</Badge>
                          <Badge className={`
                            ${item.impact === 'Critical' ? 'bg-red-500/20 text-red-400' : ''}
                            ${item.impact === 'High' ? 'bg-orange-500/20 text-orange-400' : ''}
                            ${item.impact === 'Medium' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                          `}>
                            {item.impact} Impact
                          </Badge>
                        </div>
                        <p className="text-sm text-[#6F83A7] mb-3">{item.changes}</p>
                        <div className="flex items-center gap-4 text-xs text-[#6F83A7]">
                          <span>Updated: {item.date}</span>
                          <span>•</span>
                          <span>Approved by: {item.approver}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-white/10">
                        <Eye className="w-4 h-4 mr-2" />
                        View Diff
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Version Insights */}
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#EAB308]" />
                  <h4 className="text-white text-sm">AI Update Recommendations</h4>
                </div>
                <p className="text-xs text-[#6F83A7]">
                  SMETA updated from 6.1 → 6.2 on Oct 1, 2024. Recommend updating 5 related policies 
                  to align with new grievance mechanism requirements and working hours documentation standards.
                </p>
                <Button size="sm" className="mt-3 bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                  Review Recommended Updates
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Approval Workflow Tab */}
          <TabsContent value="approval" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-6">Approval Workflow</h3>

              <div className="space-y-6">
                {/* Workflow Diagram */}
                <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-white mb-4">Standard Approval Process</h4>
                  <div className="flex items-center justify-between">
                    {[
                      { step: 'Draft Policy', icon: Edit, status: 'completed' },
                      { step: 'AI Validation', icon: Sparkles, status: 'completed' },
                      { step: 'Compliance Review', icon: Shield, status: 'active' },
                      { step: 'Digital Approval', icon: CheckSquare, status: 'pending' },
                      { step: 'Published', icon: CheckCircle2, status: 'pending' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            item.status === 'completed' ? 'bg-[#57ACAF]/20 border-2 border-[#57ACAF]' :
                            item.status === 'active' ? 'bg-[#EAB308]/20 border-2 border-[#EAB308]' :
                            'bg-white/5 border-2 border-white/10'
                          }`}>
                            <item.icon className={`w-5 h-5 ${
                              item.status === 'completed' ? 'text-[#57ACAF]' :
                              item.status === 'active' ? 'text-[#EAB308]' :
                              'text-[#6F83A7]'
                            }`} />
                          </div>
                          <span className="text-xs text-[#6F83A7] mt-2 text-center max-w-[80px]">{item.step}</span>
                        </div>
                        {index < 4 && (
                          <div className={`w-16 h-0.5 mb-6 ${
                            item.status === 'completed' ? 'bg-[#57ACAF]' : 'bg-white/10'
                          }`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Approvals */}
                <div>
                  <h4 className="text-white mb-4">Pending Approvals</h4>
                  <div className="space-y-3">
                    {[
                      {
                        policy: 'Water Stewardship Policy',
                        submittedBy: 'Sustainability Team',
                        stage: 'Compliance Review',
                        dueDate: '2024-11-05',
                        aiValidation: 'Passed',
                      },
                      {
                        policy: 'Updated Grievance Mechanism',
                        submittedBy: 'HR Compliance',
                        stage: 'AI Validation',
                        dueDate: '2024-11-08',
                        aiValidation: 'In Progress',
                      },
                    ].map((item, index) => (
                      <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="text-white mb-1">{item.policy}</h5>
                            <div className="flex items-center gap-3 text-xs text-[#6F83A7]">
                              <span>Submitted by: {item.submittedBy}</span>
                              <span>•</span>
                              <span>Due: {item.dueDate}</span>
                            </div>
                          </div>
                          <Badge className="bg-[#EAB308]/20 text-[#EAB308]">{item.stage}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#6F83A7]">AI Validation:</span>
                            <Badge className={`text-xs ${
                              item.aiValidation === 'Passed' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' :
                              'bg-[#EAB308]/20 text-[#EAB308]'
                            }`}>
                              {item.aiValidation}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-white/10">
                              <Eye className="w-4 h-4 mr-2" />
                              Review
                            </Button>
                            <Button size="sm" className="bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white">
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Validation Summary */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#EAB308]" />
                    <h4 className="text-white text-sm">AI Validation Automation</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                      <span className="text-[#6F83A7]">Validates language for compliance gaps and ambiguities</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                      <span className="text-[#6F83A7]">Cross-references with buyer CoC requirements automatically</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                      <span className="text-[#6F83A7]">Notifies stakeholders when action is required</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // AUDITS RENDER
  const renderAudits = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Audit Management</h2>
            <p className="text-sm text-[#6F83A7]">Complete lifecycle management with AI-assisted workflows</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar View
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Audit
            </Button>
          </div>
        </div>

        <Tabs defaultValue="plan" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
            <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
              <TabsTrigger 
                value="plan" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Calendar className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Plan</span>
              </TabsTrigger>
              <TabsTrigger 
                value="checklists" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Clipboard className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Checklists</span>
              </TabsTrigger>
              <TabsTrigger 
                value="findings" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <AlertTriangle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Findings</span>
              </TabsTrigger>
              <TabsTrigger 
                value="capa" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Target className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">CAPA</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Plan Tab */}
          <TabsContent value="plan" className="space-y-6">
            {/* Audit Schedule Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Scheduled</h4>
                  <Calendar className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">5</div>
                <p className="text-xs text-[#6F83A7]">Next 30 days</p>
              </div>
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">In Progress</h4>
                  <Clock className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">2</div>
                <p className="text-xs text-[#6F83A7]">Active audits</p>
              </div>
              <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Completed</h4>
                  <CheckCircle2 className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="text-3xl text-white mb-1">18</div>
                <p className="text-xs text-[#6F83A7]">This year</p>
              </div>
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Overdue</h4>
                  <XCircle className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div className="text-3xl text-white mb-1">0</div>
                <p className="text-xs text-[#6F83A7]">No delays</p>
              </div>
            </div>

            {/* AI Scheduling Assistant */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
                <h3 className="text-white">AI Scheduling Suggestions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#EAB308] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white text-sm mb-1">Annual WRAP Audit Due</h4>
                      <p className="text-xs text-[#6F83A7] mb-3">
                        Dhaka Factory 1 requires annual WRAP audit. Last audit was 11 months ago. 
                        Suggest scheduling for Nov 15-17, 2024.
                      </p>
                      <Button size="sm" className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                        Auto-Schedule
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white text-sm mb-1">Risk-Based Schedule Optimization</h4>
                      <p className="text-xs text-[#6F83A7] mb-3">
                        Based on previous audit findings, recommend scheduling Gazipur Factory 4 
                        internal audit before external SMETA in Q1 2025.
                      </p>
                      <Button size="sm" variant="outline" className="border-white/10">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Schedule Table */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-white">Audit Schedule</h3>
              </div>
              <SmartTable
                columns={[
                  { key: 'factory', label: 'Factory' },
                  { key: 'auditType', label: 'Audit Type' },
                  { key: 'scope', label: 'Scope' },
                  { key: 'auditor', label: 'Auditor' },
                  { key: 'date', label: 'Date' },
                  { key: 'buyer', label: 'Buyer' },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value: string) => (
                      <Badge className={`
                        ${value === 'Scheduled' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${value === 'In Progress' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${value === 'Completed' ? 'bg-[#6F83A7]/20 text-[#6F83A7]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                ]}
                data={auditsData}
                onRowClick={handleRowClick}
              />
            </div>
          </TabsContent>

          {/* Checklists Tab */}
          <TabsContent value="checklists" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white mb-1">Dynamic Audit Checklists</h3>
                  <p className="text-xs text-[#6F83A7]">Import templates, customize questions, assign auditors</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-white/10">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Template
                  </Button>
                  <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Checklist
                  </Button>
                </div>
              </div>

              {/* AI Auto-Generation */}
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#EAB308]" />
                  <h4 className="text-white text-sm">AI Checklist Generation</h4>
                </div>
                <p className="text-xs text-[#6F83A7] mb-3">
                  Upload buyer Code of Conduct document to auto-generate customized audit checklist. 
                  AI will identify redundant questions between standards.
                </p>
                <Button size="sm" className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Buyer CoC
                </Button>
              </div>

              {/* Checklist Templates */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'SMETA 6.1 Full Audit', questions: 127, standard: 'SMETA', lastUsed: '2024-10-15' },
                  { name: 'WRAP 12 Principles', questions: 98, standard: 'WRAP', lastUsed: '2024-09-20' },
                  { name: 'ISO 14001 Environmental', questions: 85, standard: 'ISO', lastUsed: '2024-08-10' },
                  { name: 'BSCI Social Compliance', questions: 112, standard: 'BSCI', lastUsed: '2024-07-22' },
                  { name: 'H&M Code of Conduct', questions: 145, standard: 'Buyer', lastUsed: '2024-10-01' },
                  { name: 'Nike RSL Audit', questions: 67, standard: 'Buyer', lastUsed: '2024-09-15' },
                ].map((template, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-white text-sm mb-1">{template.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] text-xs">{template.standard}</Badge>
                          <span className="text-xs text-[#6F83A7]">{template.questions} questions</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-[#6F83A7] mb-3">Last used: {template.lastUsed}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/10 flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black flex-1">
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Findings Tab */}
          <TabsContent value="findings" className="space-y-6">
            {/* NC Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#EF4444]/10 to-transparent border border-[#EF4444]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Critical</h4>
                  <XCircle className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div className="text-3xl text-white mb-1">2</div>
                <p className="text-xs text-[#6F83A7]">Requires immediate action</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Major</h4>
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-3xl text-white mb-1">5</div>
                <p className="text-xs text-[#6F83A7]">Action within 30 days</p>
              </div>
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Minor</h4>
                  <AlertCircle className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">5</div>
                <p className="text-xs text-[#6F83A7]">Continuous improvement</p>
              </div>
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Closed</h4>
                  <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">28</div>
                <p className="text-xs text-[#6F83A7]">This quarter</p>
              </div>
            </div>

            {/* AI Root Cause Analysis */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
                <h3 className="text-white">AI Root Cause Analysis</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-white text-sm mb-2">Probable Root Causes Identified</h4>
                  <ul className="space-y-2 text-xs text-[#6F83A7]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#EAB308] mt-0.5">•</span>
                      <span>NC-2024-001: Inadequate digital tracking system for working hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#EF4444] mt-0.5">•</span>
                      <span>NC-2024-002: Storage area not properly designated in floor plan</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-white text-sm mb-2">Buyer Notification Required</h4>
                  <p className="text-xs text-[#6F83A7] mb-3">
                    Critical NC-2024-002 impacts active H&M orders. Draft buyer notification report auto-generated.
                  </p>
                  <Button size="sm" className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                    Review Draft Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Findings Table */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-white">Non-Conformities (NCs)</h3>
              </div>
              <SmartTable
                columns={[
                  { key: 'id', label: 'NC ID' },
                  { key: 'clause', label: 'Clause' },
                  { key: 'description', label: 'Description' },
                  {
                    key: 'severity',
                    label: 'Severity',
                    render: (value: string) => (
                      <Badge className={`
                        ${value === 'Critical' ? 'bg-[#EF4444]/20 text-[#EF4444]' : ''}
                        ${value === 'Major' ? 'bg-orange-500/20 text-orange-400' : ''}
                        ${value === 'Minor' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                  { key: 'assignedTo', label: 'Assigned To' },
                  { key: 'dueDate', label: 'Due Date' },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value: string) => (
                      <Badge className={`
                        ${value === 'Open' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${value === 'In Progress' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${value === 'Overdue' ? 'bg-[#EF4444]/20 text-[#EF4444]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                ]}
                data={findingsData}
                onRowClick={handleRowClick}
              />
            </div>
          </TabsContent>

          {/* CAPA Tab */}
          <TabsContent value="capa" className="space-y-6">
            {/* CAPA Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Total CAPAs</h4>
                  <Target className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">12</div>
                <p className="text-xs text-[#6F83A7]">Active actions</p>
              </div>
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">In Progress</h4>
                  <Clock className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">7</div>
                <p className="text-xs text-[#6F83A7]">Being addressed</p>
              </div>
              <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Pending Verification</h4>
                  <Eye className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="text-3xl text-white mb-1">3</div>
                <p className="text-xs text-[#6F83A7]">Awaiting review</p>
              </div>
              <div className="bg-gradient-to-br from-[#EF4444]/10 to-transparent border border-[#EF4444]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Overdue</h4>
                  <XCircle className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div className="text-3xl text-white mb-1">2</div>
                <p className="text-xs text-[#6F83A7]">Need attention</p>
              </div>
            </div>

            {/* AI CAPA Suggestions */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
                <h3 className="text-white">AI CAPA Prioritization & Reminders</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                    <h4 className="text-white text-sm">High Priority</h4>
                  </div>
                  <p className="text-xs text-[#6F83A7]">
                    CAPA-2024-012 (Fire exit blockage) is overdue by 2 days. Critical NC requires immediate closure.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#EAB308]" />
                    <h4 className="text-white text-sm">Due Soon</h4>
                  </div>
                  <p className="text-xs text-[#6F83A7]">
                    3 CAPAs due within next 7 days. Automated reminders sent to action owners.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                    <h4 className="text-white text-sm">Closure Rate</h4>
                  </div>
                  <p className="text-xs text-[#6F83A7]">
                    82% CAPA closure rate this quarter. +8% improvement from last quarter.
                  </p>
                </div>
              </div>
            </div>

            {/* CAPA Table */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white">Corrective & Preventive Actions</h3>
                <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Assign CAPA
                </Button>
              </div>
              <SmartTable
                columns={[
                  { key: 'id', label: 'CAPA ID' },
                  { key: 'ncReference', label: 'NC Reference' },
                  { key: 'action', label: 'Action Description' },
                  { key: 'owner', label: 'Owner' },
                  { key: 'dueDate', label: 'Due Date' },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value: string) => (
                      <Badge className={`
                        ${value === 'In Progress' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${value === 'Verification Pending' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${value === 'Overdue' ? 'bg-[#EF4444]/20 text-[#EF4444]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                ]}
                data={capaData}
                onRowClick={handleRowClick}
              />
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // REGULATORY MONITOR RENDER
  const renderRegulatoryMonitor = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Regulatory Monitor</h2>
            <p className="text-sm text-[#6F83A7]">Continuous monitoring of regional and buyer compliance frameworks</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="espr" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
            <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
              <TabsTrigger 
                value="espr" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Globe className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">ESPR</span>
              </TabsTrigger>
              <TabsTrigger 
                value="dpp" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <FileText className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Digital Product Passport</span>
              </TabsTrigger>
              <TabsTrigger 
                value="local" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <MapPin className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Local Labor & ESG</span>
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">AI Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ESPR Tab */}
          <TabsContent value="espr" className="space-y-6">
            {/* ESPR Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">DPP Readiness</h4>
                  <Globe className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">78%</div>
                <p className="text-xs text-[#6F83A7]">Overall compliance</p>
              </div>
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Product Categories</h4>
                  <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">12</div>
                <p className="text-xs text-[#6F83A7]">Under DPP scope</p>
              </div>
              <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Traceability Score</h4>
                  <GitBranch className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="text-3xl text-white mb-1">85%</div>
                <p className="text-xs text-[#6F83A7]">Material tracking</p>
              </div>
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Data Gaps</h4>
                  <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div className="text-3xl text-white mb-1">8</div>
                <p className="text-xs text-[#6F83A7]">Need attention</p>
              </div>
            </div>

            {/* Product Category Compliance */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-6">Product Category DPP Compliance</h3>
              <div className="space-y-4">
                {[
                  { category: 'T-Shirts', compliance: 92, traceability: 95, metadata: 88 },
                  { category: 'Denim Jeans', compliance: 85, traceability: 82, metadata: 88 },
                  { category: 'Hoodies', compliance: 78, traceability: 75, metadata: 80 },
                  { category: 'Polo Shirts', compliance: 88, traceability: 90, metadata: 85 },
                  { category: 'Jackets', compliance: 72, traceability: 68, metadata: 75 },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white">{item.category}</h4>
                      <Badge className={`
                        ${item.compliance >= 85 ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${item.compliance >= 70 && item.compliance < 85 ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${item.compliance < 70 ? 'bg-orange-500/20 text-orange-400' : ''}
                      `}>
                        {item.compliance}% Ready
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="text-[#6F83A7] mb-2">Traceability</div>
                        <Progress value={item.traceability} className="h-1.5 mb-1" />
                        <div className="text-white">{item.traceability}%</div>
                      </div>
                      <div>
                        <div className="text-[#6F83A7] mb-2">Metadata</div>
                        <Progress value={item.metadata} className="h-1.5 mb-1" />
                        <div className="text-white">{item.metadata}%</div>
                      </div>
                      <div>
                        <div className="text-[#6F83A7] mb-2">Overall</div>
                        <Progress value={item.compliance} className="h-1.5 mb-1" />
                        <div className="text-white">{item.compliance}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI ESPR Alert */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
                <h3 className="text-white">AI DPP Readiness Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <AlertCircle className="w-5 h-5 text-[#EAB308] mt-0.5 flex-shrink-0" />
                  <div className="flex items-start justify-between gap-3 flex-1">
                    <div className="flex-1">
                      <h4 className="text-white text-sm mb-1">Incomplete Material Metadata</h4>
                      <p className="text-xs text-[#6F83A7]">
                        Jackets category missing 25% of required sustainability metrics. 
                        Need: recycled content %, water usage data, chemical compliance.
                      </p>
                    </div>
                    <MarbimAIButton
                      marbimPrompt="Identify incomplete material metadata across all product categories, flag missing sustainability metrics (recycled content %, water usage, chemical compliance), prioritize data collection efforts, and recommend suppliers or sources to obtain missing information."
                      onAskMarbim={onAskMarbim}
                      size="lg"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <CheckCircle2 className="w-5 h-5 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                  <div className="flex items-start justify-between gap-3 flex-1">
                    <div className="flex-1">
                      <h4 className="text-white text-sm mb-1">Automated DPP Generation Available</h4>
                      <p className="text-xs text-[#6F83A7]">
                        AI can auto-generate DPP documentation for 8 product categories with 92%+ data completeness.
                      </p>
                    </div>
                    <MarbimAIButton
                      marbimPrompt="Identify all product categories with 90%+ data completeness eligible for automated Digital Product Passport (DPP) generation, analyze data quality and gaps, generate draft DPP documentation, and provide recommendations for remaining categories to reach automation threshold."
                      onAskMarbim={onAskMarbim}
                      size="lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* DPP Tab */}
          <TabsContent value="dpp" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white">Digital Product Passports</h3>
                <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate DPP
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    product: 'Organic Cotton T-Shirt', 
                    buyer: 'H&M', 
                    qrCode: 'DPP-2024-001',
                    sustainability: 95,
                    traceability: 98,
                    status: 'Active'
                  },
                  { 
                    product: 'Recycled Denim Jeans', 
                    buyer: 'Zara', 
                    qrCode: 'DPP-2024-002',
                    sustainability: 88,
                    traceability: 85,
                    status: 'Active'
                  },
                  { 
                    product: 'Performance Hoodie', 
                    buyer: 'Nike', 
                    qrCode: 'DPP-2024-003',
                    sustainability: 82,
                    traceability: 80,
                    status: 'Draft'
                  },
                  { 
                    product: 'Winter Jacket', 
                    buyer: 'Gap', 
                    qrCode: 'DPP-2024-004',
                    sustainability: 75,
                    traceability: 72,
                    status: 'Incomplete'
                  },
                ].map((item, index) => (
                  <div key={index} className="p-5 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-white mb-1">{item.product}</h4>
                        <p className="text-xs text-[#6F83A7]">Buyer: {item.buyer}</p>
                      </div>
                      <Badge className={`
                        ${item.status === 'Active' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${item.status === 'Draft' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${item.status === 'Incomplete' ? 'bg-orange-500/20 text-orange-400' : ''}
                      `}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#6F83A7]">Sustainability Score</span>
                          <span className="text-xs text-white">{item.sustainability}%</span>
                        </div>
                        <Progress value={item.sustainability} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#6F83A7]">Traceability</span>
                          <span className="text-xs text-white">{item.traceability}%</span>
                        </div>
                        <Progress value={item.traceability} className="h-1.5" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-xs text-[#6F83A7]">QR: {item.qrCode}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-white/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/10">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI DPP Generation */}
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#EAB308]" />
                  <h4 className="text-white text-sm">AI DPP Generation</h4>
                </div>
                <p className="text-xs text-[#6F83A7] mb-3">
                  Automatically generate Digital Product Passport documentation from internal traceability data. 
                  Validates exported data format for GS1 and EU schema compliance.
                </p>
                <Button size="sm" className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                  Auto-Generate Missing DPPs
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Local Labor & ESG Tab */}
          <TabsContent value="local" className="space-y-6">
            {/* Local Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Minimum Wage</h4>
                  <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-xl text-white mb-1">Compliant</div>
                <p className="text-xs text-[#6F83A7]">BDT 12,500/month</p>
              </div>
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Working Hours</h4>
                  <Clock className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-xl text-white mb-1">48h/week</div>
                <p className="text-xs text-[#6F83A7]">Avg this month</p>
              </div>
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Safety Audits</h4>
                  <Shield className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-xl text-white mb-1">Passed</div>
                <p className="text-xs text-[#6F83A7]">Last: Oct 15, 2024</p>
              </div>
              <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Grievances</h4>
                  <AlertCircle className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="text-xl text-white mb-1">3 Open</div>
                <p className="text-xs text-[#6F83A7]">In resolution</p>
              </div>
            </div>

            {/* Bangladesh Labor Act Compliance */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-6">Bangladesh Labor Act 2006 Compliance</h3>
              <div className="space-y-4">
                {[
                  { requirement: 'Minimum Wage Payment', status: 'Compliant', lastCheck: '2024-10-26', details: 'All workers paid above BDT 12,500' },
                  { requirement: 'Working Hours (48h/week)', status: 'Compliant', lastCheck: '2024-10-26', details: 'Avg 46.2 hours/week in October' },
                  { requirement: 'Leave Entitlements', status: 'Compliant', lastCheck: '2024-10-20', details: 'Annual, sick, and maternity leave tracked' },
                  { requirement: 'Overtime Compensation', status: 'Minor Gap', lastCheck: '2024-10-26', details: '2 instances of delayed OT payment (resolved)' },
                  { requirement: 'Workplace Safety Committee', status: 'Compliant', lastCheck: '2024-10-15', details: 'Monthly meetings documented' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white text-sm">{item.requirement}</h4>
                      <Badge className={`
                        ${item.status === 'Compliant' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${item.status === 'Minor Gap' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                      `}>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#6F83A7] mb-2">{item.details}</p>
                    <div className="text-xs text-[#6F83A7]">Last checked: {item.lastCheck}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Labor Anomaly Detection */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
                <h3 className="text-white">AI Labor Anomaly Detection</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <AlertTriangle className="w-5 h-5 text-[#EAB308] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white text-sm mb-1">Excess Overtime Detected</h4>
                    <p className="text-xs text-[#6F83A7] mb-2">
                      Production Line 3 logged 62 hours in week of Oct 14-20. Exceeds 60-hour limit. 
                      Investigate production planning.
                    </p>
                    <Button size="sm" className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                      Draft Corrective Notice
                    </Button>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <AlertCircle className="w-5 h-5 text-[#6F83A7] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white text-sm mb-1">Missing Documentation</h4>
                    <p className="text-xs text-[#6F83A7]">
                      18 new workers hired in October missing complete grievance mechanism orientation records.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grievance Log */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white">Grievance Mechanism Log</h3>
                <Button size="sm" className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Grievance
                </Button>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'GRV-2024-015', issue: 'Delayed salary payment', status: 'Resolved', date: '2024-10-20', resolution: 'Payment processed, apology issued' },
                  { id: 'GRV-2024-016', issue: 'Ventilation issue in Line 5', status: 'In Progress', date: '2024-10-22', resolution: 'HVAC maintenance scheduled' },
                  { id: 'GRV-2024-017', issue: 'Harassment complaint', status: 'Under Investigation', date: '2024-10-24', resolution: 'Committee review ongoing' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white text-sm mb-1">{item.id}</h4>
                        <p className="text-xs text-[#6F83A7]">{item.issue}</p>
                      </div>
                      <Badge className={`
                        ${item.status === 'Resolved' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${item.status === 'In Progress' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${item.status === 'Under Investigation' ? 'bg-orange-500/20 text-orange-400' : ''}
                      `}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-[#6F83A7] pt-2 border-t border-white/10">
                      {item.resolution} • Filed: {item.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-[#EAB308]" />
                <h3 className="text-white">MARBIM Aggregated Intelligence</h3>
              </div>

              <div className="space-y-6">
                {/* Alerts */}
                <div>
                  <h4 className="text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                    Critical Alerts
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-[#EF4444]/5 border border-[#EF4444]/20">
                      <div className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-[#EF4444] mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="text-white text-sm mb-1">Fire Exit Blockage (Critical NC)</h5>
                          <p className="text-xs text-[#6F83A7] mb-2">
                            CAPA-2024-012 overdue by 2 days. Immediate action required before WRAP audit on Nov 20.
                          </p>
                          <Button size="sm" className="bg-[#EF4444] hover:bg-[#EF4444]/90 text-white">
                            Take Action Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                    AI Recommendations
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-[#EAB308] mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="text-white text-sm mb-1">Pre-Audit Training Needed</h5>
                          <p className="text-xs text-[#6F83A7] mb-2">
                            Upcoming WRAP audit requires training for Line 2 workers on grievance mechanism and working hours documentation. 
                            Suggest scheduling 2-hour session by Nov 10.
                          </p>
                          <Button size="sm" className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                            Schedule Training
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-[#EAB308] mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="text-white text-sm mb-1">Supplier Certification Gap</h5>
                          <p className="text-xs text-[#6F83A7]">
                            Supplier ABC's BSCI certification expired on Oct 20. Material shipments may be impacted for H&M orders.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="text-white text-sm mb-1">HR Documentation Update</h5>
                          <p className="text-xs text-[#6F83A7]">
                            Re-train HR team on grievance documentation process. 3 recent grievances missing proper resolution timeline records.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Predictive Analytics */}
                <div>
                  <h4 className="text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                    Predictive Analytics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-[#57ACAF]" />
                        <h5 className="text-white text-sm">Audit Performance Forecast</h5>
                      </div>
                      <p className="text-xs text-[#6F83A7] mb-3">
                        Based on current compliance metrics, predicted SMETA audit score: 88-92% (Grade B). 
                        Address 3 minor NCs to reach Grade A.
                      </p>
                      <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={[
                          { metric: 'Labor', score: 92 },
                          { metric: 'H&S', score: 88 },
                          { metric: 'Env', score: 85 },
                          { metric: 'Ethics', score: 95 },
                        ]}>
                          <XAxis dataKey="metric" stroke="#6F83A7" style={{ fontSize: '10px' }} />
                          <YAxis stroke="#6F83A7" style={{ fontSize: '10px' }} />
                          <Bar dataKey="score" fill="#57ACAF" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-[#EAB308]" />
                        <h5 className="text-white text-sm">Compliance Trend</h5>
                      </div>
                      <p className="text-xs text-[#6F83A7] mb-3">
                        Overall compliance improving steadily. Projected to reach 96% audit readiness by end of Q4 2024.
                      </p>
                      <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={[
                          { month: 'Jul', score: 89 },
                          { month: 'Aug', score: 91 },
                          { month: 'Sep', score: 92 },
                          { month: 'Oct', score: 94 },
                          { month: 'Nov', score: 95 },
                          { month: 'Dec', score: 96 },
                        ]}>
                          <XAxis dataKey="month" stroke="#6F83A7" style={{ fontSize: '10px' }} />
                          <YAxis stroke="#6F83A7" style={{ fontSize: '10px' }} />
                          <Line type="monotone" dataKey="score" stroke="#EAB308" strokeWidth={2} dot={{ fill: '#EAB308' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // Get sub-page label for breadcrumbs
  const getSubPageLabel = () => {
    switch (subPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'policy-library':
        return 'Policy Library';
      case 'audits':
        return 'Audits';
      case 'regulatory-monitor':
        return 'Regulatory Monitor';
      default:
        return 'Dashboard';
    }
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Compliance & Policy' },
        { label: getSubPageLabel() },
      ]}
      aiInsightsCount={subPage === 'dashboard' ? 4 : 0}
    >
      {/* Render Sub Page Content */}
      {subPage === 'dashboard' && renderDashboard()}
      {subPage === 'policy-library' && renderPolicyLibrary()}
      {subPage === 'audits' && renderAudits()}
      {subPage === 'regulatory-monitor' && renderRegulatoryMonitor()}

      {/* Detail Drawer */}
      {selectedItem && (
        <DetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={selectedItem.title || selectedItem.factory || selectedItem.id || 'Details'}
          subtitle={selectedItem.category || selectedItem.auditType || ''}
          tabs={[
            {
              id: 'overview',
              label: 'Overview',
              content: (
                <div className="space-y-4">
                  <p className="text-sm text-[#6F83A7]">
                    Detailed information will be displayed here.
                  </p>
                </div>
              ),
            },
            {
              id: 'details',
              label: 'Details',
              content: (
                <div className="space-y-4">
                  <p className="text-sm text-[#6F83A7]">
                    Additional details and information.
                  </p>
                </div>
              ),
            },
          ]}
        />
      )}
    </PageLayout>
  );
}
