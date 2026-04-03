import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { DetailDrawer } from '../DetailDrawer';
import { WorkflowStepper } from '../WorkflowStepper';
import { 
  DollarSign, TrendingUp, CreditCard, AlertCircle, Clock, Calendar, FileText,
  ChevronDown, Plus, Download, Filter, Upload, Zap, Sparkles,
  Building2, MapPin, Target, Users, Eye, Edit, Search,
  CheckCircle2, XCircle, AlertTriangle, BookOpen, Wallet,
  Clipboard, BarChart3, TrendingDown, Send, Receipt, Banknote,
  FileCheck, Shield, History, PiggyBank, ArrowDownUp, CircleDollarSign, Circle
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
  AreaChart,
  Area,
} from 'recharts';

// Sample Data for AR (Accounts Receivable)
const arInvoicesData = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    buyer: 'H&M',
    poReference: 'PO-HM-8821',
    amount: 45000,
    dueDate: '2024-11-15',
    status: 'Pending',
    daysOverdue: 0,
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-002',
    buyer: 'Zara',
    poReference: 'PO-ZR-4455',
    amount: 32000,
    dueDate: '2024-11-20',
    status: 'Overdue',
    daysOverdue: 5,
  },
  {
    id: 3,
    invoiceNumber: 'INV-2024-003',
    buyer: 'Gap',
    poReference: 'PO-GP-9912',
    amount: 28500,
    dueDate: '2024-11-25',
    status: 'Pending',
    daysOverdue: 0,
  },
  {
    id: 4,
    invoiceNumber: 'INV-2024-004',
    buyer: 'Nike',
    poReference: 'PO-NK-3377',
    amount: 52000,
    dueDate: '2024-11-10',
    status: 'Paid',
    daysOverdue: 0,
  },
];

// Sample Data for AP (Accounts Payable)
const apBillsData = [
  {
    id: 1,
    billNumber: 'BILL-S-1024',
    vendor: 'Fabric Supplier A',
    poReference: 'PO-FAB-2301',
    amount: 18000,
    dueDate: '2024-11-18',
    status: 'Pending Approval',
  },
  {
    id: 2,
    billNumber: 'BILL-S-1025',
    vendor: 'Trims Supplier B',
    poReference: 'PO-TRM-1145',
    amount: 5600,
    dueDate: '2024-11-22',
    status: 'Approved',
  },
  {
    id: 3,
    billNumber: 'BILL-S-1026',
    vendor: 'Freight Forwarder',
    poReference: 'PO-LOG-8832',
    amount: 12400,
    dueDate: '2024-11-15',
    status: 'Paid',
  },
];

// Sample Data for Order P&L
const orderPLData = [
  {
    id: 1,
    orderId: 'ORD-2024-501',
    buyer: 'H&M',
    fobValue: 85000,
    totalCost: 62000,
    marginPercent: 27.1,
    status: 'Shipped',
  },
  {
    id: 2,
    orderId: 'ORD-2024-502',
    buyer: 'Zara',
    fobValue: 72000,
    totalCost: 58000,
    marginPercent: 19.4,
    status: 'In Production',
  },
  {
    id: 3,
    orderId: 'ORD-2024-503',
    buyer: 'Gap',
    fobValue: 54000,
    totalCost: 39000,
    marginPercent: 27.8,
    status: 'Completed',
  },
];

// Sample Data for LC (Letter of Credit)
const lcData = [
  {
    id: 1,
    lcNumber: 'LC-2024-112',
    buyer: 'H&M',
    bankName: 'HSBC Bank',
    amount: 95000,
    openDate: '2024-10-15',
    expiryDate: '2024-12-15',
    status: 'Active',
    daysToExpiry: 20,
  },
  {
    id: 2,
    lcNumber: 'LC-2024-113',
    buyer: 'Zara',
    bankName: 'Standard Chartered',
    amount: 78000,
    openDate: '2024-10-20',
    expiryDate: '2024-11-30',
    status: 'Expiring Soon',
    daysToExpiry: 5,
  },
];

// Chart Data
const cashFlowData = [
  { month: 'Jan', inflow: 145000, outflow: 98000, balance: 47000 },
  { month: 'Feb', inflow: 152000, outflow: 102000, balance: 50000 },
  { month: 'Mar', inflow: 148000, outflow: 95000, balance: 53000 },
  { month: 'Apr', inflow: 161000, outflow: 108000, balance: 53000 },
  { month: 'May', inflow: 155000, outflow: 104000, balance: 51000 },
  { month: 'Jun', inflow: 167000, outflow: 112000, balance: 55000 },
];

const marginByBuyerData = [
  { buyer: 'H&M', margin: 27.1 },
  { buyer: 'Zara', margin: 19.4 },
  { buyer: 'Gap', margin: 27.8 },
  { buyer: 'Nike', margin: 32.5 },
  { buyer: 'Adidas', margin: 25.3 },
];

interface FinanceProps {
  initialSubPage?: string;
  onAskMarbim?: (prompt: string) => void;
  onNavigateToPage?: (page: string) => void;
}

export function Finance({ initialSubPage = 'dashboard', onAskMarbim, onNavigateToPage }: FinanceProps) {
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
          title="AR Aging"
          value="$127K"
          change={-8.3}
          icon={CreditCard}
          trend="up"
        />
        <KPICard
          title="AP Aging"
          value="$86K"
          change={5.2}
          changeLabel="increase"
          icon={Wallet}
          trend="down"
        />
        <KPICard
          title="Cash Balance"
          value="$245K"
          change={12.5}
          icon={DollarSign}
          trend="up"
        />
        <KPICard
          title="Margin per Order"
          value="26.5%"
          change={3.1}
          icon={TrendingUp}
          trend="up"
        />
        <KPICard
          title="Forecast Accuracy"
          value="92%"
          change={4.0}
          icon={Target}
          trend="up"
        />
        <KPICard
          title="LC Utilization"
          value="78%"
          change={-2.5}
          changeLabel="vs last month"
          icon={Shield}
          trend="neutral"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1">Total AR</h4>
                  <p className="text-xs text-[#6F83A7]">Accounts Receivable</p>
                </div>
                <CreditCard className="w-8 h-8 text-[#57ACAF]" />
              </div>
              <div className="text-3xl text-white mb-2">$127,500</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6F83A7]">Overdue: 12%</span>
                <span className="text-[#57ACAF]">On Time: 88%</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1">Total AP</h4>
                  <p className="text-xs text-[#6F83A7]">Accounts Payable</p>
                </div>
                <Wallet className="w-8 h-8 text-[#EAB308]" />
              </div>
              <div className="text-3xl text-white mb-2">$86,000</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6F83A7]">Due This Week: $18K</span>
                <span className="text-[#EAB308]">Approved: $32K</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1">Cash on Hand</h4>
                  <p className="text-xs text-[#6F83A7]">Available Liquidity</p>
                </div>
                <DollarSign className="w-8 h-8 text-[#6F83A7]" />
              </div>
              <div className="text-3xl text-white mb-2">$245,000</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#57ACAF]">+12.5% from last month</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1">Average Margin</h4>
                  <p className="text-xs text-[#6F83A7]">Order Profitability</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#EAB308]" />
              </div>
              <div className="text-3xl text-white mb-2">26.5%</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#57ACAF]">Target: 25%</span>
                <span className="text-[#EAB308]">Above target</span>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-6">Margin by Buyer</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={marginByBuyerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="buyer" stroke="#6F83A7" />
                <YAxis stroke="#6F83A7" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0D1117', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="margin" fill="#57ACAF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-6">Cash Flow Projection (6 Months)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#6F83A7" />
                <YAxis stroke="#6F83A7" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0D1117', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Area type="monotone" dataKey="inflow" stackId="1" stroke="#57ACAF" fill="#57ACAF" fillOpacity={0.6} />
                <Area type="monotone" dataKey="outflow" stackId="2" stroke="#D0342C" fill="#D0342C" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - 1/3 width - AI Suggestions */}
        <div className="space-y-6">
          <AICard
            title="MARBIM Finance Insights"
            marbimPrompt="Provide detailed financial intelligence including cash flow analysis, accounts receivable collection priorities, and bill mismatch detection."
            onAskMarbim={onAskMarbim}
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Cash shortage expected in 10 days due to shipment delay.</div>
                    <Button size="sm" onClick={() => toast.warning('Opening cash flow forecast')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Top 3 buyers contributing to overdue AR.</div>
                    <Button size="sm" onClick={() => toast.info('Opening AR collection report')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Prioritize
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#6F83A7] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Review supplier bill #A102 — mismatch detected.</div>
                    <Button size="sm" onClick={() => toast.warning('Opening bill details')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Review
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

  // ACCOUNTS RECEIVABLE SUB-PAGE
  const renderAccountsReceivable = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Accounts Receivable (AR)</h2>
            <p className="text-sm text-[#6F83A7]">Manage buyer invoices and payment follow-ups</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
            <TabsList className="w-full grid grid-cols-5 bg-transparent gap-1.5 p-0 h-auto">
              <TabsTrigger 
                value="overview" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <BarChart3 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="invoices" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <FileText className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Invoices</span>
              </TabsTrigger>
              <TabsTrigger 
                value="collections" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Send className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Collections</span>
              </TabsTrigger>
              <TabsTrigger 
                value="disputes" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <AlertCircle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Disputes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai-insights" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">AI Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Total Receivable</h4>
                  <DollarSign className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">$127,500</div>
                <p className="text-xs text-[#6F83A7]">Outstanding payments</p>
              </div>
              <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Overdue %</h4>
                  <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
                </div>
                <div className="text-3xl text-white mb-1">12%</div>
                <p className="text-xs text-[#6F83A7]">$15,300 overdue</p>
              </div>
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Avg Collection Time</h4>
                  <Clock className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">42 days</div>
                <p className="text-xs text-[#6F83A7]">Target: 45 days</p>
              </div>
            </div>

            {/* Summary Table */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Buyer Payment Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm text-[#6F83A7]">Buyer</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6F83A7]">Invoice Count</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6F83A7]">Total Due</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6F83A7]">Last Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { buyer: 'H&M', count: 3, due: '$45,000', lastPayment: '2024-10-25' },
                      { buyer: 'Zara', count: 2, due: '$32,000', lastPayment: '2024-10-18' },
                      { buyer: 'Gap', count: 1, due: '$28,500', lastPayment: '2024-10-20' },
                      { buyer: 'Nike', count: 1, due: '$22,000', lastPayment: '2024-10-30' },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-white">{row.buyer}</td>
                        <td className="py-3 px-4 text-[#6F83A7]">{row.count}</td>
                        <td className="py-3 px-4 text-[#57ACAF]">{row.due}</td>
                        <td className="py-3 px-4 text-[#6F83A7]">{row.lastPayment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            {/* Workflow Progress */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#EAB308]" />
                    <span className="text-white">Invoice Workflow Progress</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                  <WorkflowStepper
                    steps={[
                      { label: 'Invoice Upload', status: 'completed' },
                      { label: 'AI OCR Processing', status: 'completed' },
                      { label: 'Match with Shipment', status: 'completed' },
                      { label: 'Validation', status: 'active' },
                      { label: 'Send to Buyer', status: 'pending' },
                    ]}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">All Invoices</h3>
              <SmartTable
                columns={[
                  { key: 'invoiceNumber', label: 'Invoice #', sortable: true },
                  { key: 'buyer', label: 'Buyer', sortable: true },
                  { key: 'poReference', label: 'PO/Shipment Ref', sortable: true },
                  { 
                    key: 'amount', 
                    label: 'Amount', 
                    sortable: true,
                    render: (value) => <span className="text-[#57ACAF]">${value.toLocaleString()}</span>
                  },
                  { key: 'dueDate', label: 'Due Date', sortable: true },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value) => (
                      <Badge className={`
                        ${value === 'Paid' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${value === 'Pending' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${value === 'Overdue' ? 'bg-[#D0342C]/20 text-[#D0342C]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                ]}
                data={arInvoicesData}
                onRowClick={handleRowClick}
                searchPlaceholder="Search invoices..."
              />
            </div>
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {['Pending', 'In Progress', 'Completed'].map((status) => (
                <div key={status} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <h4 className="text-white mb-3">{status}</h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="text-sm text-white mb-1">INV-2024-002</div>
                      <div className="text-xs text-[#6F83A7]">Zara • $32,000</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">AI-Generated Reminders</h3>
              <div className="space-y-3">
                {[
                  { buyer: 'Zara', invoice: 'INV-2024-002', amount: '$32,000', tone: 'Polite', status: 'Draft' },
                  { buyer: 'Gap', invoice: 'INV-2024-003', amount: '$28,500', tone: 'Formal', status: 'Sent' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white mb-1">{item.buyer} - {item.invoice}</h4>
                        <p className="text-sm text-[#6F83A7]">Amount: {item.amount}</p>
                      </div>
                      <Badge className="bg-[#EAB308]/20 text-[#EAB308]">{item.status}</Badge>
                    </div>
                    <p className="text-sm text-[#6F83A7] mb-3 italic">
                      "Dear {item.buyer}, we kindly remind you that invoice {item.invoice} for {item.amount} is now due. Please arrange payment at your earliest convenience."
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/10">
                        <Edit className="w-3 h-3 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" className="bg-[#57ACAF] hover:bg-[#57ACAF]/90">
                        <Send className="w-3 h-3 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Payment Disputes</h3>
              <SmartTable
                columns={[
                  { key: 'disputeId', label: 'Dispute ID', sortable: true },
                  { key: 'buyer', label: 'Buyer', sortable: true },
                  { 
                    key: 'amount', 
                    label: 'Amount', 
                    sortable: true,
                    render: (value) => <span className="text-[#D0342C]">${value}</span>
                  },
                  { key: 'rootCause', label: 'Root Cause', sortable: true },
                  { key: 'resolutionStage', label: 'Resolution Stage', sortable: true },
                ]}
                data={[
                  { disputeId: 'DIS-001', buyer: 'Zara', amount: '3,200', rootCause: 'Short Payment', resolutionStage: 'In Review' },
                  { disputeId: 'DIS-002', buyer: 'H&M', amount: '1,800', rootCause: 'Quantity Mismatch', resolutionStage: 'Resolved' },
                ]}
                searchPlaceholder="Search disputes..."
              />
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[#EAB308]" />
                <h3 className="text-white">Predictive Overdue Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">High Risk Invoices (Next 7 Days)</h4>
                  <ul className="space-y-2 text-sm text-[#6F83A7]">
                    <li>• INV-2024-002 (Zara) - 85% probability of delay</li>
                    <li>• INV-2024-005 (Gap) - 72% probability of delay</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Recommended Collection Order</h4>
                  <p className="text-sm text-[#6F83A7]">
                    MARBIM suggests prioritizing Zara ($32K) and Gap ($28.5K) based on payment history and cash flow needs.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // ACCOUNTS PAYABLE SUB-PAGE
  const renderAccountsPayable = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Accounts Payable (AP)</h2>
            <p className="text-sm text-[#6F83A7]">Automate vendor payments, verification, and approvals</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              New Bill
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
            <TabsList className="w-full grid grid-cols-5 bg-transparent gap-1.5 p-0 h-auto">
              <TabsTrigger 
                value="overview" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <BarChart3 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bills" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Receipt className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Bills</span>
              </TabsTrigger>
              <TabsTrigger 
                value="approvals" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <CheckCircle2 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Approvals</span>
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Banknote className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Payments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai-insights" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">AI Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Total Payables</h4>
                  <Wallet className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">$86,000</div>
                <p className="text-xs text-[#6F83A7]">Outstanding bills</p>
              </div>
              <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Due This Week</h4>
                  <Clock className="w-5 h-5 text-[#D0342C]" />
                </div>
                <div className="text-3xl text-white mb-1">$18,000</div>
                <p className="text-xs text-[#6F83A7]">2 bills due</p>
              </div>
              <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Overdue %</h4>
                  <AlertTriangle className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="text-3xl text-white mb-1">4%</div>
                <p className="text-xs text-[#6F83A7]">$3,440 overdue</p>
              </div>
            </div>

            {/* Chart: Payables by Category */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-6">Payables by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Fabric', value: 48000, color: '#EAB308' },
                      { name: 'Trims', value: 15600, color: '#57ACAF' },
                      { name: 'Freight', value: 22400, color: '#6F83A7' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {[
                      { color: '#EAB308' },
                      { color: '#57ACAF' },
                      { color: '#6F83A7' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EAB308]"></div>
                  <span className="text-xs text-[#6F83A7]">Fabric (56%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#57ACAF]"></div>
                  <span className="text-xs text-[#6F83A7]">Trims (18%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#6F83A7]"></div>
                  <span className="text-xs text-[#6F83A7]">Freight (26%)</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Bills Tab */}
          <TabsContent value="bills" className="space-y-6">
            {/* Workflow Progress */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-[#EAB308]" />
                    <span className="text-white">Bill Processing Workflow</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                  <WorkflowStepper
                    steps={[
                      { label: 'Bill Upload', status: 'completed' },
                      { label: 'AI Validation', status: 'completed' },
                      { label: '3-Way Match (PO+GRN)', status: 'active' },
                      { label: 'Approval', status: 'pending' },
                      { label: 'Payment Scheduled', status: 'pending' },
                    ]}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">All Bills</h3>
              <SmartTable
                columns={[
                  { key: 'billNumber', label: 'Bill #', sortable: true },
                  { key: 'vendor', label: 'Vendor', sortable: true },
                  { key: 'poReference', label: 'PO Ref', sortable: true },
                  { 
                    key: 'amount', 
                    label: 'Amount', 
                    sortable: true,
                    render: (value) => <span className="text-[#EAB308]">${value.toLocaleString()}</span>
                  },
                  { key: 'dueDate', label: 'Due Date', sortable: true },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value) => (
                      <Badge className={`
                        ${value === 'Paid' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${value === 'Approved' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${value === 'Pending Approval' ? 'bg-[#6F83A7]/20 text-[#6F83A7]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                ]}
                data={apBillsData}
                onRowClick={handleRowClick}
                searchPlaceholder="Search bills..."
              />
            </div>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Pending Approvals</h3>
              <div className="space-y-3">
                {[
                  { bill: 'BILL-S-1024', vendor: 'Fabric Supplier A', amount: '$18,000', reason: 'High-value invoice' },
                  { bill: 'BILL-S-1027', vendor: 'Dye House B', amount: '$22,500', reason: 'New vendor' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white mb-1">{item.bill}</h4>
                        <p className="text-sm text-[#6F83A7]">{item.vendor} • {item.amount}</p>
                        <p className="text-xs text-[#EAB308] mt-1">Requires approval: {item.reason}</p>
                      </div>
                      <Badge className="bg-[#EAB308]/20 text-[#EAB308]">Pending</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/10">
                        <XCircle className="w-3 h-3 mr-2" />
                        Reject
                      </Button>
                      <Button size="sm" className="bg-[#57ACAF] hover:bg-[#57ACAF]/90">
                        <CheckCircle2 className="w-3 h-3 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {['Scheduled', 'Completed', 'Failed', 'Deferred'].map((status) => (
                <div key={status} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <h4 className="text-white mb-3">{status}</h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="text-sm text-white mb-1">BILL-S-1025</div>
                      <div className="text-xs text-[#6F83A7]">$5,600</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Payment Schedule</h3>
              <div className="space-y-2">
                {[
                  { date: '2024-11-15', vendor: 'Freight Forwarder', amount: '$12,400', status: 'Due Today' },
                  { date: '2024-11-18', vendor: 'Fabric Supplier A', amount: '$18,000', status: 'Due in 3 days' },
                  { date: '2024-11-22', vendor: 'Trims Supplier B', amount: '$5,600', status: 'Due in 7 days' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-white mb-1">{item.vendor}</h4>
                      <p className="text-xs text-[#6F83A7]">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white mb-1">{item.amount}</div>
                      <Badge className="bg-[#EAB308]/20 text-[#EAB308] text-xs">{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[#EAB308]" />
                <h3 className="text-white">Payment Optimization Insights</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Duplicate Bill Detection</h4>
                  <p className="text-sm text-[#6F83A7]">
                    MARBIM detected potential duplicate: BILL-S-1024 matches 98% with BILL-S-0987 from last month.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Payment Priority Recommendation</h4>
                  <p className="text-sm text-[#6F83A7]">
                    Prioritize Fabric Supplier A payment to maintain credit terms and avoid delays in next order.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Cash Strain Prediction</h4>
                  <p className="text-sm text-[#6F83A7]">
                    Deferring Trims Supplier B payment by 5 days will ease cash strain without impacting vendor relationship.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // ORDER P&L SUB-PAGE
  const renderOrderPL = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Order P&L (Profit & Loss)</h2>
            <p className="text-sm text-[#6F83A7]">Order-level profitability with real-time costing integration</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Download className="w-4 h-4 mr-2" />
              Export P&L
            </Button>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
            <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
              <TabsTrigger 
                value="orders" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Clipboard className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Orders</span>
              </TabsTrigger>
              <TabsTrigger 
                value="margins" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <TrendingUp className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Margins</span>
              </TabsTrigger>
              <TabsTrigger 
                value="variance" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <BarChart3 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Variance</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai-insights" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">AI Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {/* Workflow Progress */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#EAB308]" />
                    <span className="text-white">P&L Analysis Workflow</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                  <WorkflowStepper
                    steps={[
                      { label: 'Order Completed', status: 'completed' },
                      { label: 'Fetch Cost Data', status: 'completed' },
                      { label: 'Match Invoice', status: 'completed' },
                      { label: 'Generate Margin Analysis', status: 'active' },
                      { label: 'Alert if Below Target', status: 'pending' },
                    ]}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Order Profitability</h3>
              <SmartTable
                columns={[
                  { key: 'orderId', label: 'Order ID', sortable: true },
                  { key: 'buyer', label: 'Buyer', sortable: true },
                  { 
                    key: 'fobValue', 
                    label: 'FOB Value', 
                    sortable: true,
                    render: (value) => <span className="text-[#57ACAF]">${value.toLocaleString()}</span>
                  },
                  { 
                    key: 'totalCost', 
                    label: 'Total Cost', 
                    sortable: true,
                    render: (value) => <span className="text-[#D0342C]">${value.toLocaleString()}</span>
                  },
                  { 
                    key: 'marginPercent', 
                    label: 'Margin %', 
                    sortable: true,
                    render: (value) => (
                      <span className={`${value >= 25 ? 'text-[#57ACAF]' : 'text-[#EAB308]'}`}>
                        {value.toFixed(1)}%
                      </span>
                    )
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value) => (
                      <Badge className={`
                        ${value === 'Completed' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${value === 'Shipped' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${value === 'In Production' ? 'bg-[#6F83A7]/20 text-[#6F83A7]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                ]}
                data={orderPLData}
                onRowClick={handleRowClick}
                searchPlaceholder="Search orders..."
              />
            </div>
          </TabsContent>

          {/* Margins Tab */}
          <TabsContent value="margins" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-white mb-4">Margin by Buyer</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={marginByBuyerData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="buyer" stroke="#6F83A7" />
                    <YAxis stroke="#6F83A7" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0D1117', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px'
                      }}
                    />
                    <Bar dataKey="margin" fill="#EAB308" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-white mb-4">Underperforming Styles</h3>
                <div className="space-y-3">
                  {[
                    { style: 'Style-A-2024', margin: 18.5, reason: 'High washing cost' },
                    { style: 'Style-B-2024', margin: 15.2, reason: 'Fabric wastage' },
                    { style: 'Style-C-2024', margin: 21.8, reason: 'Re-work costs' },
                  ].map((item, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white">{item.style}</h4>
                        <Badge className="bg-[#D0342C]/20 text-[#D0342C]">{item.margin}% margin</Badge>
                      </div>
                      <p className="text-sm text-[#6F83A7]">Issue: {item.reason}</p>
                      <Button size="sm" variant="outline" className="mt-2 border-white/10">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Variance Tab */}
          <TabsContent value="variance" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Cost Variance Analysis</h3>
              <div className="space-y-4">
                {[
                  { 
                    order: 'ORD-2024-501', 
                    estimated: 62000, 
                    actual: 65500, 
                    variance: 3500, 
                    explanation: 'Washing cost increased due to process repetition required for buyer approval.'
                  },
                  { 
                    order: 'ORD-2024-502', 
                    estimated: 58000, 
                    actual: 58000, 
                    variance: 0, 
                    explanation: 'Cost matched estimate perfectly.'
                  },
                  { 
                    order: 'ORD-2024-503', 
                    estimated: 39000, 
                    actual: 40200, 
                    variance: 1200, 
                    explanation: 'Trim cost variance due to supplier price increase.'
                  },
                ].map((item, index) => (
                  <div key={index} className="p-5 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white mb-2">{item.order}</h4>
                        <div className="flex gap-4 text-sm mb-2">
                          <span className="text-[#6F83A7]">Estimated: ${item.estimated.toLocaleString()}</span>
                          <span className="text-white">Actual: ${item.actual.toLocaleString()}</span>
                        </div>
                      </div>
                      <Badge className={`${item.variance > 0 ? 'bg-[#D0342C]/20 text-[#D0342C]' : 'bg-[#57ACAF]/20 text-[#57ACAF]'}`}>
                        {item.variance > 0 ? '+' : ''}{item.variance > 0 ? `$${item.variance.toLocaleString()}` : 'No variance'}
                      </Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-[#EAB308] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#6F83A7]">{item.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[#EAB308]" />
                <h3 className="text-white">Profitability Predictions</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Future Orders Risk Analysis</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    3 upcoming orders have projected margins below 20% due to rising fabric costs.
                  </p>
                  <ul className="space-y-1 text-sm text-[#6F83A7]">
                    <li>• ORD-2024-511 (Gap) - 18.2% margin</li>
                    <li>• ORD-2024-512 (Adidas) - 19.5% margin</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Risky Buyers Alert</h4>
                  <p className="text-sm text-[#6F83A7]">
                    MARBIM recommends price renegotiation with Zara (avg 19.4% margin) or cost reduction measures.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Cost Optimization Opportunity</h4>
                  <p className="text-sm text-[#6F83A7]">
                    Switching to Fabric Supplier C could increase margins by 2.1% on similar orders.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // CASH FLOW SUB-PAGE
  const renderCashFlow = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Cash Flow Management</h2>
            <p className="text-sm text-[#6F83A7]">30/60/90-day liquidity forecasting with predictive AI</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Run Forecast
            </Button>
          </div>
        </div>

        <Tabs defaultValue="forecast" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
            <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
              <TabsTrigger 
                value="forecast" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <TrendingUp className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Forecast</span>
              </TabsTrigger>
              <TabsTrigger 
                value="alerts" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <AlertCircle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Alerts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="scenarios" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Target className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">What-If Scenarios</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai-insights" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">AI Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            {/* Workflow Progress */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <ArrowDownUp className="w-5 h-5 text-[#EAB308]" />
                    <span className="text-white">Cash Flow Forecast Workflow</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                  <WorkflowStepper
                    steps={[
                      { label: 'Collect AR/AP Data', status: 'completed' },
                      { label: 'Shipment Delay Detected', status: 'completed' },
                      { label: 'AI Reproject Inflows', status: 'active' },
                      { label: 'Update Forecast', status: 'pending' },
                      { label: 'Recommend Action', status: 'pending' },
                    ]}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-6">Cash Balance Over Time (90 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#6F83A7" />
                  <YAxis stroke="#6F83A7" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0D1117', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
                    }}
                  />
                  <Line type="monotone" dataKey="inflow" stroke="#57ACAF" strokeWidth={2} dot={{ fill: '#57ACAF', r: 4 }} />
                  <Line type="monotone" dataKey="outflow" stroke="#D0342C" strokeWidth={2} dot={{ fill: '#D0342C', r: 4 }} />
                  <Line type="monotone" dataKey="balance" stroke="#EAB308" strokeWidth={3} dot={{ fill: '#EAB308', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#57ACAF]"></div>
                  <span className="text-xs text-[#6F83A7]">Inflow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#D0342C]"></div>
                  <span className="text-xs text-[#6F83A7]">Outflow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EAB308]"></div>
                  <span className="text-xs text-[#6F83A7]">Balance</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <h4 className="text-white mb-2">30-Day Forecast</h4>
                <div className="text-3xl text-white mb-1">$248K</div>
                <p className="text-xs text-[#6F83A7]">Expected inflow</p>
                <div className="mt-4">
                  <p className="text-xs text-[#D0342C]">Outflow: $182K</p>
                  <p className="text-xs text-[#57ACAF] mt-1">Net: +$66K</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <h4 className="text-white mb-2">60-Day Forecast</h4>
                <div className="text-3xl text-white mb-1">$512K</div>
                <p className="text-xs text-[#6F83A7]">Expected inflow</p>
                <div className="mt-4">
                  <p className="text-xs text-[#D0342C]">Outflow: $395K</p>
                  <p className="text-xs text-[#57ACAF] mt-1">Net: +$117K</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
                <h4 className="text-white mb-2">90-Day Forecast</h4>
                <div className="text-3xl text-white mb-1">$825K</div>
                <p className="text-xs text-[#6F83A7]">Expected inflow</p>
                <div className="mt-4">
                  <p className="text-xs text-[#D0342C]">Outflow: $628K</p>
                  <p className="text-xs text-[#57ACAF] mt-1">Net: +$197K</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">AI-Detected Risks</h3>
              <div className="space-y-3">
                {[
                  { 
                    type: 'Critical', 
                    title: 'Upcoming LC Maturity', 
                    description: 'LC-2024-113 matures in 5 days. $78,000 payment required.',
                    icon: Shield,
                  },
                  { 
                    type: 'Warning', 
                    title: 'Shipment Delay Impact', 
                    description: 'Shipment delay from H&M affects $45K inflow by 10 days.',
                    icon: AlertTriangle,
                  },
                  { 
                    type: 'Info', 
                    title: 'Seasonal Cash Strain', 
                    description: 'December typically shows 15% cash reduction. Plan ahead.',
                    icon: Calendar,
                  },
                ].map((alert, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    alert.type === 'Critical' ? 'bg-[#D0342C]/10 border-[#D0342C]/30' :
                    alert.type === 'Warning' ? 'bg-[#EAB308]/10 border-[#EAB308]/30' :
                    'bg-[#6F83A7]/10 border-[#6F83A7]/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <alert.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        alert.type === 'Critical' ? 'text-[#D0342C]' :
                        alert.type === 'Warning' ? 'text-[#EAB308]' :
                        'text-[#6F83A7]'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white">{alert.title}</h4>
                          <Badge className={`${
                            alert.type === 'Critical' ? 'bg-[#D0342C]/20 text-[#D0342C]' :
                            alert.type === 'Warning' ? 'bg-[#EAB308]/20 text-[#EAB308]' :
                            'bg-[#6F83A7]/20 text-[#6F83A7]'
                          }`}>
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#6F83A7]">{alert.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* What-If Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Scenario Simulations</h3>
              <div className="space-y-4">
                {[
                  { 
                    scenario: 'Shipment ETD delayed by 15 days',
                    impact: 'Cash balance drops to $185K (from $245K)',
                    recommendation: 'Defer Trims Supplier payment by 10 days',
                  },
                  { 
                    scenario: 'Supplier payment delayed by 7 days',
                    impact: 'Cash balance improves to $263K',
                    recommendation: 'No action needed, maintain vendor relationships',
                  },
                  { 
                    scenario: 'Exchange rate changes by 5%',
                    impact: 'LC costs increase by $3,900',
                    recommendation: 'Consider hedging for next quarter',
                  },
                ].map((item, index) => (
                  <div key={index} className="p-5 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-white mb-2">{item.scenario}</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <TrendingDown className="w-4 h-4 text-[#D0342C] mt-0.5" />
                        <p className="text-sm text-[#6F83A7]">Impact: {item.impact}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-[#EAB308] mt-0.5" />
                        <p className="text-sm text-[#6F83A7]">MARBIM: {item.recommendation}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="mt-3 border-white/10">
                      <BarChart3 className="w-3 h-3 mr-2" />
                      Run Full Analysis
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[#EAB308]" />
                <h3 className="text-white">Financial Health Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Overall Health: Strong</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    Cash reserves are healthy at $245K with positive 90-day projection. No immediate liquidity concerns detected.
                  </p>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-[#6F83A7] mt-2">Financial Health Score: 85/100</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Actionable Recommendations</h4>
                  <ul className="space-y-2 text-sm text-[#6F83A7]">
                    <li>• Consider short-term credit line of $50K to buffer against shipment delays</li>
                    <li>• Accelerate collection from Zara ($32K overdue) to improve 30-day position</li>
                    <li>• Optimize payment schedule to maintain minimum $200K balance</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // BANKING & LC SUB-PAGE
  const renderBankingLC = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Banking & LC (Letter of Credit)</h2>
            <p className="text-sm text-[#6F83A7]">Manage trade-related bank interactions and LC lifecycle</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Create LC
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
            <TabsList className="w-full grid grid-cols-5 bg-transparent gap-1.5 p-0 h-auto">
              <TabsTrigger 
                value="dashboard" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <BarChart3 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">LC Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <FileText className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Documents</span>
              </TabsTrigger>
              <TabsTrigger 
                value="milestones" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Target className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Milestones</span>
              </TabsTrigger>
              <TabsTrigger 
                value="fees" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <CircleDollarSign className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Fees & Charges</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai-insights" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">AI Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* LC Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Active LCs</h4>
                  <Shield className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">8</div>
                <p className="text-xs text-[#6F83A7]">Total value: $685K</p>
              </div>
              <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Expiring Soon</h4>
                  <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
                </div>
                <div className="text-3xl text-white mb-1">2</div>
                <p className="text-xs text-[#6F83A7]">Within 7 days</p>
              </div>
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">LC Utilization</h4>
                  <PiggyBank className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">78%</div>
                <p className="text-xs text-[#6F83A7]">$685K of $880K limit</p>
              </div>
            </div>

            {/* Workflow Progress */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#EAB308]" />
                    <span className="text-white">LC Workflow</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                  <WorkflowStepper
                    steps={[
                      { label: 'LC Opened', status: 'completed' },
                      { label: 'Shipment Completed', status: 'completed' },
                      { label: 'Documents Submitted', status: 'active' },
                      { label: 'Bank Negotiation', status: 'pending' },
                      { label: 'Maturity & Payment', status: 'pending' },
                    ]}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Active LCs</h3>
              <SmartTable
                columns={[
                  { key: 'lcNumber', label: 'LC Number', sortable: true },
                  { key: 'buyer', label: 'Buyer', sortable: true },
                  { key: 'bankName', label: 'Bank', sortable: true },
                  { 
                    key: 'amount', 
                    label: 'Amount', 
                    sortable: true,
                    render: (value) => <span className="text-[#57ACAF]">${value.toLocaleString()}</span>
                  },
                  { key: 'expiryDate', label: 'Expiry Date', sortable: true },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value) => (
                      <Badge className={`
                        ${value === 'Active' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${value === 'Expiring Soon' ? 'bg-[#D0342C]/20 text-[#D0342C]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                ]}
                data={lcData}
                onRowClick={handleRowClick}
                searchPlaceholder="Search LCs..."
              />
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {['LC Agreement', 'Amendments', 'Bank Correspondence'].map((docType) => (
                <div key={docType} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <h4 className="text-white mb-3">{docType}</h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white mb-1">LC-2024-112</div>
                        <div className="text-xs text-[#6F83A7]">H&M</div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">AI Document Validation</h3>
              <div className="space-y-3">
                {[
                  { doc: 'LC-2024-112 Agreement', status: 'Validated', issues: 0 },
                  { doc: 'LC-2024-113 Amendment', status: 'Issues Found', issues: 2 },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white">{item.doc}</h4>
                      <Badge className={`${
                        item.status === 'Validated' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : 'bg-[#EAB308]/20 text-[#EAB308]'
                      }`}>
                        {item.status}
                      </Badge>
                    </div>
                    {item.issues > 0 && (
                      <p className="text-sm text-[#EAB308]">
                        MARBIM detected {item.issues} clause{item.issues > 1 ? 's' : ''} requiring review
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-6">LC Timeline: LC-2024-112</h3>
              <div className="space-y-4">
                {[
                  { stage: 'LC Opened', date: '2024-10-15', status: 'completed' },
                  { stage: 'Shipment', date: '2024-11-01', status: 'completed' },
                  { stage: 'Negotiation', date: '2024-11-10', status: 'active' },
                  { stage: 'Maturity', date: '2024-12-15', status: 'pending' },
                  { stage: 'Payment', date: '2024-12-15', status: 'pending' },
                ].map((milestone, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      milestone.status === 'completed' ? 'bg-[#57ACAF]/20' :
                      milestone.status === 'active' ? 'bg-[#EAB308]/20' :
                      'bg-white/5'
                    }`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
                      ) : milestone.status === 'active' ? (
                        <Clock className="w-5 h-5 text-[#EAB308]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#6F83A7]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white">{milestone.stage}</h4>
                      <p className="text-xs text-[#6F83A7]">{milestone.date}</p>
                    </div>
                    <Badge className={`${
                      milestone.status === 'completed' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' :
                      milestone.status === 'active' ? 'bg-[#EAB308]/20 text-[#EAB308]' :
                      'bg-white/10 text-[#6F83A7]'
                    }`}>
                      {milestone.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Fees & Charges Tab */}
          <TabsContent value="fees" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Bank Service Charges</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm text-[#6F83A7]">LC Number</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6F83A7]">Bank</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6F83A7]">Opening Fee</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6F83A7]">Amendment Fee</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6F83A7]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { lc: 'LC-2024-112', bank: 'HSBC', opening: 475, amendment: 150, total: 625 },
                      { lc: 'LC-2024-113', bank: 'Standard Chartered', opening: 390, amendment: 120, total: 510 },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-white">{row.lc}</td>
                        <td className="py-3 px-4 text-[#6F83A7]">{row.bank}</td>
                        <td className="py-3 px-4 text-[#6F83A7]">${row.opening}</td>
                        <td className="py-3 px-4 text-[#6F83A7]">${row.amendment}</td>
                        <td className="py-3 px-4 text-[#EAB308]">${row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[#EAB308]" />
                <h3 className="text-white">LC Optimization Insights</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Expiry Alerts</h4>
                  <p className="text-sm text-[#6F83A7]">
                    LC-2024-113 expiring in 5 days. MARBIM has prepared reminder and documentation checklist.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Cost Optimization</h4>
                  <p className="text-sm text-[#6F83A7]">
                    Bank B offers 18% lower fees for similar LC services. Potential savings: $112 per LC.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Risk Assessment</h4>
                  <p className="text-sm text-[#6F83A7]">
                    All LCs are within safe limits. No concentration risk detected.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // MAIN RENDER LOGIC
  const renderContent = () => {
    if (subPage === 'accounts-receivable') {
      return renderAccountsReceivable();
    } else if (subPage === 'accounts-payable') {
      return renderAccountsPayable();
    } else if (subPage === 'order-pl') {
      return renderOrderPL();
    } else if (subPage === 'cash-flow') {
      return renderCashFlow();
    } else if (subPage === 'banking-lc') {
      return renderBankingLC();
    } else {
      return renderDashboard();
    }
  };

  return (
    <>
      <PageLayout
        breadcrumbs={[
          { label: 'Financial & Compliance' },
          { label: 'Finance' }
        ]}
        aiInsightsCount={5}
      >
        {renderContent()}
      </PageLayout>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedItem?.invoiceNumber || selectedItem?.billNumber || selectedItem?.orderId || selectedItem?.lcNumber || 'Details'}
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
            ),
          },
          {
            id: 'activity',
            label: 'Activity',
            icon: History,
            content: (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-sm text-white mb-1">Status Updated</div>
                  <div className="text-xs text-[#6F83A7]">2 hours ago</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-sm text-white mb-1">Created</div>
                  <div className="text-xs text-[#6F83A7]">1 day ago</div>
                </div>
              </div>
            ),
          },
          {
            id: 'documents',
            label: 'Documents',
            icon: FileCheck,
            content: (
              <div className="space-y-3">
                <Button variant="outline" className="w-full border-white/10">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
                <div className="text-sm text-[#6F83A7] text-center py-8">
                  No documents uploaded yet
                </div>
              </div>
            ),
          },
          {
            id: 'ai-analysis',
            label: 'AI Analysis',
            icon: Sparkles,
            content: (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-white">MARBIM Analysis</span>
                  </div>
                  <p className="text-sm text-[#6F83A7]">
                    AI-powered insights and recommendations will appear here.
                  </p>
                </div>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
