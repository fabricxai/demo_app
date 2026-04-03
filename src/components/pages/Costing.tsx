import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { DetailDrawer, DetailDrawerData } from '../DetailDrawer';
import { WorkflowStepper } from '../WorkflowStepper';
import { MarbimAIButton } from '../MarbimAIButton';
import { ModuleSetupBanner } from '../ModuleSetupBanner';
import { CostingSetup } from './CostingSetup';
import { CostSheetDetailDrawer } from '../CostSheetDetailDrawer';
import { CreateCostSheetDrawer } from '../CreateCostSheetDrawer';
import { useDatabase, MODULE_NAMES, canPerformAction } from '../../utils/supabase';
import { 
  Calculator, TrendingDown, Target, AlertCircle, FileText, TrendingUp,
  Clock, ChevronDown, Plus, Download, Filter, Upload, Sparkles,
  Edit, DollarSign, Package, Layers, BarChart3, CheckCircle2,
  RefreshCw, Settings, Award, Activity, LineChart, PieChart,
  AlertTriangle, Eye, Zap, Users, BookOpen, Clipboard
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart as RechartsLine,
  Line,
  AreaChart,
  Area,
} from 'recharts';

// Dashboard Data
const dashboardSummary = [
  { label: 'Draft Cost Sheets', value: 12, icon: Edit, color: '#EAB308' },
  { label: 'Approved Cost Sheets', value: 38, icon: CheckCircle2, color: '#57ACAF' },
  { label: 'Pending Review', value: 8, icon: Clock, color: '#6F83A7' },
  { label: 'Low Margin Alert', value: 3, icon: AlertTriangle, color: '#D0342C' },
];

const costBreakdownData = [
  { category: 'Material', cost: 145000, percentage: 58, color: '#EAB308' },
  { category: 'Labor', cost: 70000, percentage: 28, color: '#57ACAF' },
  { category: 'Overheads', cost: 25000, percentage: 10, color: '#6F83A7' },
  { category: 'FX/Freight', cost: 10000, percentage: 4, color: '#9333EA' },
];

const marginTrendData = [
  { month: 'Jun', margin: 12.5, target: 15 },
  { month: 'Jul', margin: 13.2, target: 15 },
  { month: 'Aug', margin: 14.8, target: 15 },
  { month: 'Sep', margin: 13.5, target: 15 },
  { month: 'Oct', margin: 15.2, target: 15 },
];

// Cost Sheet List Data
const allCostSheetsData = [
  {
    id: 1,
    costSheetId: 'CS-2024-1847',
    buyer: 'H&M',
    style: 'T-Shirt Basic',
    marginPercent: 15.2,
    status: 'Approved',
    owner: 'Sarah M.',
    lastUpdated: '2024-10-25',
  },
  {
    id: 2,
    costSheetId: 'CS-2024-1848',
    buyer: 'Zara',
    style: 'Denim Jeans',
    marginPercent: 8.5,
    status: 'Draft',
    owner: 'John D.',
    lastUpdated: '2024-10-26',
  },
  {
    id: 3,
    costSheetId: 'CS-2024-1849',
    buyer: 'Gap',
    style: 'Polo Shirt',
    marginPercent: 18.3,
    status: 'Approved',
    owner: 'Lisa K.',
    lastUpdated: '2024-10-24',
  },
  {
    id: 4,
    costSheetId: 'CS-2024-1850',
    buyer: 'Nike',
    style: 'Activewear Set',
    marginPercent: 12.1,
    status: 'Submitted',
    owner: 'Mike R.',
    lastUpdated: '2024-10-23',
  },
  {
    id: 5,
    costSheetId: 'CS-2024-1851',
    buyer: 'ACME Fashion',
    style: 'Hoodies',
    marginPercent: 6.8,
    status: 'Rejected',
    owner: 'Sarah M.',
    lastUpdated: '2024-10-20',
  },
];

const draftsData = allCostSheetsData.filter(c => c.status === 'Draft');
const approvedData = allCostSheetsData.filter(c => c.status === 'Approved');

// Scenarios Data
const scenariosData = [
  {
    id: 1,
    scenario: 'Scenario A - Premium',
    material: 5.80,
    labor: 2.40,
    margin: 18,
    leadTime: 45,
    totalFOB: 11.25,
    status: 'Active',
  },
  {
    id: 2,
    scenario: 'Scenario B - Standard',
    material: 5.20,
    labor: 2.10,
    margin: 14,
    leadTime: 38,
    totalFOB: 9.85,
    status: 'Recommended',
  },
  {
    id: 3,
    scenario: 'Scenario C - Budget',
    material: 4.60,
    labor: 1.90,
    margin: 10,
    leadTime: 50,
    totalFOB: 8.90,
    status: 'Active',
  },
];

// Benchmarks Data
const historicalCostData = [
  {
    id: 1,
    style: 'T-Shirt Basic',
    buyer: 'H&M',
    avgCost: 8.50,
    margin: 15.2,
    volume: 50000,
    date: '2024-09',
  },
  {
    id: 2,
    style: 'Polo Shirt',
    buyer: 'Gap',
    avgCost: 12.30,
    margin: 18.3,
    volume: 30000,
    date: '2024-08',
  },
];

const commodityTrendsData = [
  { month: 'Jun', cotton: 1.85, polyester: 1.10, freight: 2.50 },
  { month: 'Jul', cotton: 1.88, polyester: 1.12, freight: 2.55 },
  { month: 'Aug', cotton: 1.92, polyester: 1.15, freight: 2.60 },
  { month: 'Sep', cotton: 1.95, polyester: 1.18, freight: 2.70 },
  { month: 'Oct', cotton: 2.00, polyester: 1.20, freight: 2.80 },
];

const vendorPerformanceData = [
  {
    id: 1,
    supplier: 'Fabric Co A',
    avgLeadTime: 12,
    priceStability: 92,
    qualityRating: 4.5,
    category: 'Fabric',
  },
  {
    id: 2,
    supplier: 'Trim Supplier B',
    avgLeadTime: 8,
    priceStability: 88,
    qualityRating: 4.2,
    category: 'Trims',
  },
  {
    id: 3,
    supplier: 'Button Mfg C',
    avgLeadTime: 10,
    priceStability: 95,
    qualityRating: 4.8,
    category: 'Accessories',
  },
];

// Helper function to generate DetailDrawerData for Cost Sheets
const generateCostSheetDrawerData = (costSheet: any, subPage: string, onAskMarbim?: (prompt: string) => void): DetailDrawerData => {
  // Calculate detailed cost breakdown
  const materialCost = 5.80;
  const laborCost = 2.40;
  const overheadsCost = 0.85;
  const freightCost = 0.35;
  const totalCost = materialCost + laborCost + overheadsCost + freightCost;
  const sellingPrice = totalCost / (1 - costSheet.marginPercent / 100);
  const marginAmount = sellingPrice - totalCost;

  return {
    id: costSheet.id.toString(),
    title: costSheet.costSheetId,
    subtitle: `${costSheet.buyer} • ${costSheet.style}`,
    type: costSheet.style,
    status: {
      label: costSheet.status,
      variant: costSheet.status === 'Approved' ? 'success' : 
               costSheet.status === 'Rejected' ? 'error' :
               costSheet.status === 'Submitted' ? 'default' : 'warning'
    },
    overview: {
      keyAttributes: [
        { label: 'Cost Sheet ID', value: costSheet.costSheetId, icon: <FileText className="w-4 h-4" /> },
        { label: 'Buyer', value: costSheet.buyer, icon: <Users className="w-4 h-4" /> },
        { label: 'Style', value: costSheet.style, icon: <Package className="w-4 h-4" /> },
        { label: 'Margin %', value: `${costSheet.marginPercent}%`, icon: <TrendingUp className="w-4 h-4" /> },
        { label: 'Total FOB', value: `$${sellingPrice.toFixed(2)}`, icon: <DollarSign className="w-4 h-4" /> },
        { label: 'Owner', value: costSheet.owner, icon: <Users className="w-4 h-4" /> },
        { label: 'Last Updated', value: costSheet.lastUpdated, icon: <Clock className="w-4 h-4" /> },
      ],
      metrics: [
        { label: 'Material Cost', value: `$${materialCost.toFixed(2)}`, change: `${((materialCost/totalCost)*100).toFixed(0)}%`, trend: 'down' as const },
        { label: 'Labor Cost', value: `$${laborCost.toFixed(2)}`, change: `${((laborCost/totalCost)*100).toFixed(0)}%`, trend: 'up' as const },
        { label: 'Total Cost', value: `$${totalCost.toFixed(2)}`, change: `Margin: $${marginAmount.toFixed(2)}`, trend: 'up' as const },
      ],
      description: `Cost sheet ${costSheet.costSheetId} for ${costSheet.style} style for ${costSheet.buyer}. Current margin is ${costSheet.marginPercent}% with total FOB of $${sellingPrice.toFixed(2)}. Status: ${costSheet.status}. Last updated on ${costSheet.lastUpdated} by ${costSheet.owner}.`,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <RechartsPie>
            <Pie
              data={[
                { name: 'Material', value: materialCost, color: '#EAB308' },
                { name: 'Labor', value: laborCost, color: '#57ACAF' },
                { name: 'Overheads', value: overheadsCost, color: '#6F83A7' },
                { name: 'Freight', value: freightCost, color: '#9333EA' },
                { name: 'Margin', value: marginAmount, color: '#10B981' },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              label={(entry) => `${entry.name}: $${entry.value.toFixed(2)}`}
            >
              {[
                { color: '#EAB308' },
                { color: '#57ACAF' },
                { color: '#6F83A7' },
                { color: '#9333EA' },
                { color: '#10B981' },
              ].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0D1117', border: '1px solid #ffffff20' }}
              formatter={(value: any) => `$${value.toFixed(2)}`}
            />
          </RechartsPie>
        </ResponsiveContainer>
      ),
    },
    interactions: [
      { date: '2024-10-26', type: 'email', description: `Approved cost sheet with ${costSheet.marginPercent}% margin`, sentiment: 'positive' },
      { date: '2024-10-25', type: 'call', description: 'Discussed material sourcing options with procurement team', sentiment: 'neutral' },
      { date: '2024-10-24', type: 'meeting', description: 'Pricing review meeting with finance and merchandising', sentiment: 'positive' },
      { date: '2024-10-23', type: 'email', description: 'Received updated fabric costs from supplier', sentiment: 'neutral' },
      { date: '2024-10-22', type: 'system', description: 'Cost sheet created and assigned to ' + costSheet.owner, sentiment: 'neutral' },
    ],
    documents: [
      { name: 'Cost_Sheet_Detailed.xlsx', type: 'Costing', uploadDate: costSheet.lastUpdated, uploader: costSheet.owner, tag: 'Latest', aiSummary: `Complete cost breakdown with material ($${materialCost}), labor ($${laborCost}), overheads ($${overheadsCost}), and freight ($${freightCost}). Total FOB: $${sellingPrice.toFixed(2)} with ${costSheet.marginPercent}% margin.` },
      { name: 'Tech_Pack_' + costSheet.style.replace(/\s+/g, '_') + '.pdf', type: 'Technical', uploadDate: costSheet.lastUpdated, uploader: costSheet.owner, aiSummary: `Detailed technical specifications for ${costSheet.style} including construction, measurements, and quality standards.` },
      { name: 'Material_BOM.xlsx', type: 'BOM', uploadDate: costSheet.lastUpdated, uploader: costSheet.owner, tag: 'Verified', aiSummary: 'Bill of materials with fabric, trims, accessories, and packaging components with quantities and unit costs.' },
      { name: 'Buyer_Approval_Email.pdf', type: 'Approval', uploadDate: costSheet.lastUpdated, uploader: 'System', aiSummary: costSheet.status === 'Approved' ? `${costSheet.buyer} approved cost sheet on ${costSheet.lastUpdated}. Order confirmed for production.` : `Pending approval from ${costSheet.buyer} buyer team.` },
      { name: 'Competitor_Analysis.xlsx', type: 'Analysis', uploadDate: costSheet.lastUpdated, uploader: costSheet.owner, aiSummary: 'Market pricing analysis for similar styles. Current pricing is competitive within industry standards.' },
    ],
    aiInsights: {
      summary: `Cost sheet ${costSheet.costSheetId} shows ${costSheet.marginPercent >= 15 ? 'healthy' : costSheet.marginPercent >= 10 ? 'acceptable' : 'low'} margin of ${costSheet.marginPercent}%. ${costSheet.status === 'Approved' ? 'Approved and ready for production.' : costSheet.status === 'Rejected' ? 'Rejected - requires revision.' : 'Pending review and approval.'}`,
      recommendations: [
        {
          title: costSheet.marginPercent < 12 ? 'Margin Optimization Required' : 'Maintain Competitive Pricing',
          description: costSheet.marginPercent < 12 
            ? `Current margin of ${costSheet.marginPercent}% is below target. Consider material substitution or labor efficiency improvements to achieve 15% margin.`
            : `Current margin of ${costSheet.marginPercent}% is ${costSheet.marginPercent >= 15 ? 'excellent' : 'good'}. Monitor commodity prices for sustained profitability.`,
          action: 'Optimize Costs',
          onClick: () => onAskMarbim?.(`How can we optimize costs for ${costSheet.costSheetId} to improve margin from ${costSheet.marginPercent}%?`)
        },
        {
          title: 'Material Cost Analysis',
          description: `Material costs represent ${((materialCost/totalCost)*100).toFixed(0)}% of total cost. Review alternative fabric suppliers for potential 5-8% cost reduction.`,
          action: 'View Alternatives',
          onClick: () => onAskMarbim?.(`Show alternative material suppliers for ${costSheet.style} with better pricing`)
        },
        {
          title: 'Production Planning',
          description: costSheet.status === 'Approved' 
            ? `Cost sheet approved. Allocate to production line with ${costSheet.style} expertise for optimal efficiency.`
            : `Expedite approval process. Current lead time: ${Math.floor(Math.random() * 3) + 1} days to production.`,
          action: 'Plan Production',
          onClick: () => onAskMarbim?.(`Create production plan for ${costSheet.costSheetId}`)
        },
      ],
      visualInsight: (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#6F83A7]">Margin Health</span>
              <span className="text-white">{costSheet.marginPercent}%</span>
            </div>
            <Progress value={Math.min((costSheet.marginPercent / 20) * 100, 100)} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#6F83A7]">Cost Competitiveness</span>
              <span className="text-white">{costSheet.marginPercent >= 12 ? '85%' : '72%'}</span>
            </div>
            <Progress value={costSheet.marginPercent >= 12 ? 85 : 72} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Material %</div>
              <div className="text-white">{((materialCost/totalCost)*100).toFixed(0)}%</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Labor %</div>
              <div className="text-white">{((laborCost/totalCost)*100).toFixed(0)}%</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#6F83A7]">Approval Status</span>
              <Badge className={
                costSheet.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                costSheet.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                costSheet.status === 'Submitted' ? 'bg-blue-500/20 text-blue-400' :
                'bg-yellow-500/20 text-yellow-400'
              }>
                {costSheet.status}
              </Badge>
            </div>
          </div>
        </div>
      ),
      references: [
        'Material Cost Benchmarks Q4 2024',
        'Labor Rate Analysis Oct 2024',
        `${costSheet.buyer} Historical Pricing`,
        'Commodity Price Trends',
        'Competitor Pricing Analysis'
      ]
    }
  };
};

interface CostingProps {
  initialSubPage?: string;
  onAskMarbim?: (prompt: string) => void;
}

export function Costing({ initialSubPage = 'dashboard', onAskMarbim }: CostingProps) {
  const routeSubpage = useRouteSubpage('dashboard', initialSubPage);
  // Database hook
  const db = useDatabase();
  
  // UI State
  const [currentView, setCurrentView] = useState<string>(routeSubpage);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DetailDrawerData | null>(null);
  const [costSheetDrawerOpen, setCostSheetDrawerOpen] = useState(false);
  const [selectedCostSheet, setSelectedCostSheet] = useState<any>(null);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [showModuleSetup, setShowModuleSetup] = useState(false);
  const [setupWizardOpen, setSetupWizardOpen] = useState(false);
  const [showSetupBanner, setShowSetupBanner] = useState(true);
  
  // Database State
  const [costSheets, setCostSheets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed Data
  const draftCostSheets = costSheets.filter(cs => cs.status === 'Draft');
  const approvedCostSheets = costSheets.filter(cs => cs.status === 'Approved');
  const pendingReview = costSheets.filter(cs => cs.status === 'Pending Review');
  const avgMargin = costSheets.length > 0
    ? Math.round(costSheets.reduce((sum, cs) => sum + parseFloat(cs.marginPercentage || 0), 0) / costSheets.length)
    : 0;

  const computedDashboardSummary = [
    { label: 'Draft Cost Sheets', value: draftCostSheets.length, icon: Edit, color: '#EAB308' },
    { label: 'Approved Cost Sheets', value: approvedCostSheets.length, icon: CheckCircle2, color: '#57ACAF' },
    { label: 'Pending Review', value: pendingReview.length, icon: Clock, color: '#6F83A7' },
    { label: 'Avg. Margin', value: `${avgMargin}%`, icon: Target, color: '#57ACAF' },
  ];

  useEffect(() => {
    setCurrentView(routeSubpage);
  }, [routeSubpage]);

  // Load data from database on mount
  useEffect(() => {
    loadCostSheets();
  }, []);

  // Database Operations
  async function loadCostSheets() {
    try {
      setIsLoading(true);
      const data = await db.getByModule(MODULE_NAMES.COSTING);
      
      if (data.length === 0) {
        await seedInitialCostSheets();
      } else {
        setCostSheets(data);
      }
    } catch (error) {
      console.error('Failed to load cost sheets:', error);
      toast.error('Failed to load cost sheets');
    } finally {
      setIsLoading(false);
    }
  }

  async function seedInitialCostSheets() {
    const initialCostSheets = allCostSheetsData.map(cs => ({
      ...cs,
      type: 'costSheet',
    }));
    
    for (const costSheet of initialCostSheets) {
      const id = `costsheet-${costSheet.id}-${Date.now()}`;
      await db.store(id, costSheet, MODULE_NAMES.COSTING);
    }
    
    setCostSheets(initialCostSheets);
  }

  async function handleCostSheetUpdated(updatedCostSheet: any) {
    try {
      await loadCostSheets();
      toast.success('Cost sheet updated successfully');
    } catch (error) {
      console.error('Failed to update cost sheet:', error);
      toast.error('Failed to update cost sheet');
    }
  }

  async function handleCostSheetCreated(newCostSheet: any) {
    try {
      await loadCostSheets();
      toast.success('Cost sheet created successfully');
      setCreateDrawerOpen(false);
    } catch (error) {
      console.error('Failed to create cost sheet:', error);
      toast.error('Failed to create cost sheet');
    }
  }

  // All Cost Sheets Columns
  const allCostSheetsColumns: Column[] = [
    { key: 'costSheetId', label: 'Cost Sheet ID', sortable: true },
    { key: 'buyer', label: 'Buyer', sortable: true },
    { key: 'style', label: 'Style' },
    {
      key: 'marginPercent',
      label: 'Margin %',
      sortable: true,
      render: (value) => {
        const color = value >= 15 ? 'text-[#57ACAF]' : value >= 10 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Draft': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Submitted': 'bg-[#6F83A7]/10 text-[#6F83A7]',
          'Approved': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Rejected': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
    { key: 'owner', label: 'Owner' },
    { key: 'lastUpdated', label: 'Last Updated', sortable: true },
  ];

  // Scenarios Columns
  const scenariosColumns: Column[] = [
    { key: 'scenario', label: 'Scenario', sortable: true },
    { key: 'material', label: 'Material', sortable: true, render: (value) => `$${value}` },
    { key: 'labor', label: 'Labor', sortable: true, render: (value) => `$${value}` },
    { key: 'margin', label: 'Margin %', sortable: true, render: (value) => `${value}%` },
    { key: 'leadTime', label: 'Lead Time', sortable: true, render: (value) => `${value} days` },
    { key: 'totalFOB', label: 'Total FOB', sortable: true, render: (value) => `$${value}` },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Active': 'bg-[#6F83A7]/10 text-[#6F83A7]',
          'Recommended': 'bg-[#EAB308]/10 text-[#EAB308]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Historical Cost Columns
  const historicalCostColumns: Column[] = [
    { key: 'style', label: 'Style', sortable: true },
    { key: 'buyer', label: 'Buyer' },
    { key: 'avgCost', label: 'Avg Cost', sortable: true, render: (value) => `$${value}` },
    { key: 'margin', label: 'Margin %', sortable: true, render: (value) => `${value}%` },
    { key: 'volume', label: 'Volume', sortable: true, render: (value) => value.toLocaleString() },
    { key: 'date', label: 'Date', sortable: true },
  ];

  // Vendor Performance Columns
  const vendorPerformanceColumns: Column[] = [
    { key: 'supplier', label: 'Supplier', sortable: true },
    { key: 'category', label: 'Category' },
    { key: 'avgLeadTime', label: 'Avg Lead Time', sortable: true, render: (value) => `${value} days` },
    {
      key: 'priceStability',
      label: 'Price Stability',
      sortable: true,
      render: (value) => {
        const color = value >= 90 ? 'text-[#57ACAF]' : 'text-[#EAB308]';
        return <span className={color}>{value}%</span>;
      },
    },
    {
      key: 'qualityRating',
      label: 'Quality Rating',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <span className="text-[#EAB308]">★</span>
          <span className="text-white">{value}</span>
        </div>
      ),
    },
  ];

  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    // Generate appropriate drawer data based on record type
    if (record.costSheetId) {
      // This is a cost sheet record - open the new CostSheetDetailDrawer
      setSelectedCostSheet(record);
      setCostSheetDrawerOpen(true);
    } else {
      setDrawerData(null);
      setDrawerOpen(true);
    }
  };

  const renderDashboard = () => (
    <>
      {/* Module Setup Banner */}
      {showSetupBanner && (
        <ModuleSetupBanner 
          moduleName="Costing"
          onSetupClick={() => setSetupWizardOpen(true)}
        />
      )}

      {/* Hero Banner with Executive Summary */}
      <div className="bg-gradient-to-br from-[#57ACAF]/10 via-[#EAB308]/5 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(87,172,175,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/30">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl mb-2">Costing Intelligence Hub</h2>
                <p className="text-[#6F83A7] text-sm max-w-2xl">
                  Real-time visibility into cost sheet performance, margin analysis, and vendor optimization. 
                  Track cost trends, identify savings opportunities, and leverage AI insights for strategic decision-making.
                </p>
              </div>
            </div>
            <MarbimAIButton
              marbimPrompt="Provide a comprehensive executive summary of the costing operations including: 1) Overall cost performance and margin health (current 15.2% vs 15% target), 2) Critical cost sheets requiring immediate attention (3 low-margin alerts, 8 pending review), 3) Cost optimization opportunities and vendor savings potential, 4) Material cost trends and commodity price impacts, 5) Margin improvement drivers and risk factors, 6) Vendor performance analysis and sourcing recommendations, 7) Forecast for next quarter based on current trends and commodity outlook."
              onAskMarbim={onAskMarbim}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Active Cost Sheets</span>
              </div>
              <div className="text-2xl text-white mb-1">58</div>
              <div className="text-xs text-[#57ACAF]">+8 this week</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs text-[#6F83A7]">Avg Margin</span>
              </div>
              <div className="text-2xl text-white mb-1">15.2%</div>
              <div className="text-xs text-[#57ACAF]">+1.3% vs target</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Cost Reduction</span>
              </div>
              <div className="text-2xl text-white mb-1">3.2%</div>
              <div className="text-xs text-[#57ACAF]">YTD savings</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs text-[#6F83A7]">Avg Unit Cost</span>
              </div>
              <div className="text-2xl text-white mb-1">$8.50</div>
              <div className="text-xs text-[#57ACAF]">-3.2% reduction</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#D0342C]" />
                <span className="text-xs text-[#6F83A7]">Low Margin Alert</span>
              </div>
              <div className="text-2xl text-white mb-1">3</div>
              <div className="text-xs text-[#D0342C]">Needs attention</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <KPICard
          title="Draft Cost Sheets"
          value="12"
          change={20.0}
          changeLabel="vs last month"
          icon={Edit}
          trend="up"
        />
        <KPICard
          title="Approved Cost Sheets"
          value="38"
          change={15.5}
          icon={CheckCircle2}
          trend="up"
        />
        <KPICard
          title="Pending Review"
          value="8"
          change={-12.5}
          changeLabel="reduction"
          icon={Clock}
          trend="up"
        />
        <KPICard
          title="Avg Margin %"
          value="15.2%"
          change={1.3}
          changeLabel="vs 15% target"
          icon={Target}
          trend="up"
        />
        <KPICard
          title="Material Cost Index"
          value="102.5"
          change={2.5}
          changeLabel="commodity increase"
          icon={TrendingUp}
          trend="down"
        />
        <KPICard
          title="Vendor Price Updates"
          value="5"
          change={0}
          changeLabel="this week"
          icon={RefreshCw}
          trend="neutral"
        />
      </div>

      {/* Cost Status Summary */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#57ACAF]" />
              Cost Sheet Status Distribution
            </h3>
            <p className="text-sm text-[#6F83A7]">
              Real-time view of cost sheets across different stages
            </p>
          </div>
          <MarbimAIButton
            marbimPrompt="Analyze the cost sheet pipeline distribution and provide insights on: 1) Bottlenecks causing delays in approvals or reviews, 2) Cost sheets at risk of missing deadlines or targets, 3) Opportunities to fast-track high-priority items, 4) Resource allocation recommendations across workflow stages, 5) Historical patterns and forecast for next week's pipeline, 6) Process optimization suggestions to reduce cycle time."
            onAskMarbim={onAskMarbim}
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {computedDashboardSummary.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => toast.info(`Viewing ${item.label}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: item.color }} />
                  </div>
                  <div className="text-4xl" style={{ color: item.color }}>{item.value}</div>
                </div>
                <div className="text-[#6F83A7] mb-3">{item.label}</div>
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F83A7]">View Details</span>
                    <ChevronDown className="w-4 h-4 text-[#6F83A7] opacity-0 group-hover:opacity-100 transition-opacity rotate-[-90deg]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost Breakdown and Margin Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Breakdown Chart */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#57ACAF]" />
                Cost Breakdown Analysis
              </h3>
              <p className="text-sm text-[#6F83A7]">Current month cost structure distribution</p>
            </div>
            <div className="flex gap-2">
              <MarbimAIButton
                marbimPrompt="Analyze the current cost breakdown and provide insights on: 1) Cost category distribution: Material 58% ($145K), Labor 28% ($70K), Overheads 10% ($25K), FX/Freight 4% ($10K), 2) Historical comparison of cost structure shifts over last 6 months, 3) Optimization opportunities in each category (e.g., material substitution, labor efficiency, freight consolidation), 4) Benchmark against industry standards for similar products, 5) Risk factors affecting cost stability (commodity volatility, labor market, currency fluctuations), 6) Recommendations to improve overall cost efficiency and margin, 7) Projected cost structure for next quarter based on current trends."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
              <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-transparent hover:bg-white/5">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={280}>
              <RechartsPie>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="cost"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1117',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                  formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`}
                />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="space-y-3">
              {costBreakdownData.map((item, index) => (
                <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-white text-sm">{item.category}</span>
                    </div>
                    <span className="text-[#6F83A7] text-xs">{item.percentage}%</span>
                  </div>
                  <div className="text-white text-lg">${(item.cost / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-[#6F83A7] mt-1">${(item.cost / 58).toFixed(2)} per unit</div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Total Cost</span>
                  <span className="text-white text-xl">$250K</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Strategic Insights */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div>
                  <h4 className="text-white mb-1">AI Cost Optimization</h4>
                  <p className="text-xs text-[#6F83A7]">Intelligent savings recommendations</p>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Provide detailed cost optimization recommendations including: 1) Vendor consolidation opportunities to negotiate better pricing, 2) Material substitution options maintaining quality while reducing cost, 3) Fabric yield improvement strategies to reduce waste, 4) Labor efficiency initiatives based on production data analysis, 5) Freight and logistics optimization through consolidation, 6) Volume-based pricing opportunities with suppliers, 7) Currency hedging strategies for FX cost stability, 8) Quantified savings potential for each recommendation with implementation timeline."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Vendor Optimization</div>
                    <div className="text-xs text-[#6F83A7] mb-2">
                      Switch to Vendor X for trims: <span className="text-[#57ACAF]">-4% cost savings</span>
                    </div>
                    <Button size="sm" onClick={() => toast.info('Opening vendor comparison')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                      Review Options
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Yield Variance Alert</div>
                    <div className="text-xs text-[#6F83A7] mb-2">
                      Fabric yield +3% vs marker plan — potential waste issue
                    </div>
                    <Button size="sm" onClick={() => toast.warning('Opening yield analysis')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                      Analyze
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Quick Win Opportunity</div>
                    <div className="text-xs text-[#6F83A7] mb-2">
                      Consolidate shipments: <span className="text-[#57ACAF]">$12K/month freight savings</span>
                    </div>
                    <Button size="sm" onClick={() => toast.success('Opening logistics plan')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                      Implement
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Margin Trend and Commodity Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Margin vs Target Trend */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                Margin vs Target Performance
              </h3>
              <p className="text-sm text-[#6F83A7]">5-month margin trend analysis</p>
            </div>
            <MarbimAIButton
              marbimPrompt="Analyze margin performance trends over the last 5 months. Data: Jun: 12.5% (below target), Jul: 13.2%, Aug: 14.8%, Sep: 13.5%, Oct: 15.2% (above target). Target: 15%. Key observations: October achieved target for first time, strong upward trajectory (+21.6% improvement vs June), September dip due to commodity spike. Provide: 1) Detailed trend analysis with acceleration/deceleration factors, 2) Drivers of October success (material cost reductions, labor efficiency, volume discounts), 3) September dip root cause analysis and mitigation strategies, 4) Sustainability assessment of current 15.2% margin, 5) Forecast for next 3 months based on current trends and commodity outlook, 6) Risk factors that could impact margin maintenance, 7) Recommendations to consistently exceed 15% target."
              onAskMarbim={onAskMarbim}
              size="sm"
            />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RechartsLine data={marginTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
              <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} domain={[10, 18]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#ffffff' }}
                formatter={(value: any, name: string) => {
                  if (name === 'Actual Margin') return [`${value}%`, 'Actual'];
                  if (name === 'Target') return [`${value}%`, 'Target'];
                  return [value, name];
                }}
              />
              <Line type="monotone" dataKey="margin" stroke="#57ACAF" strokeWidth={3} name="Actual Margin" dot={{ fill: '#57ACAF', r: 5 }} />
              <Line type="monotone" dataKey="target" stroke="#EAB308" strokeWidth={2} strokeDasharray="5 5" name="Target" />
            </RechartsLine>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
              <div className="text-xs text-[#6F83A7] mb-1">Current</div>
              <div className="text-lg text-[#57ACAF]">15.2%</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
              <div className="text-xs text-[#6F83A7] mb-1">Target</div>
              <div className="text-lg text-[#EAB308]">15.0%</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
              <div className="text-xs text-[#6F83A7] mb-1">5M Improvement</div>
              <div className="text-lg text-white">+21.6%</div>
            </div>
          </div>
        </div>

        {/* Commodity Price Trends */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#EAB308]" />
                Commodity Price Trends
              </h3>
              <p className="text-sm text-[#6F83A7]">Key material cost movements</p>
            </div>
            <MarbimAIButton
              marbimPrompt="Analyze commodity price trends affecting our cost structure. Data: Cotton: $1.85/lb (Jun) → $2.00/lb (Oct) = +8.1% increase, Polyester: $1.10/lb → $1.20/lb = +9.1%, Freight: $2.50/unit → $2.80/unit = +12.0%. Overall material cost inflation: ~9%. Market factors: Global cotton supply constraints, oil price volatility affecting polyester, shipping capacity tightness. Provide: 1) Detailed trend analysis with contributing factors for each commodity, 2) Price forecast for next 3-6 months based on market intelligence, 3) Impact quantification on our cost structure and margins, 4) Hedging strategies and procurement recommendations, 5) Alternative material options to mitigate cost pressures, 6) Volume commitment opportunities for better pricing, 7) Risk management strategies for volatile commodities."
              onAskMarbim={onAskMarbim}
              size="sm"
            />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RechartsLine data={commodityTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
              <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
                formatter={(value: any) => `$${value}`}
              />
              <Line type="monotone" dataKey="cotton" stroke="#EAB308" strokeWidth={2} name="Cotton $/lb" />
              <Line type="monotone" dataKey="polyester" stroke="#57ACAF" strokeWidth={2} name="Polyester $/lb" />
              <Line type="monotone" dataKey="freight" stroke="#6F83A7" strokeWidth={2} name="Freight $/unit" />
            </RechartsLine>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20 text-center">
              <div className="text-xs text-[#6F83A7] mb-1">Cotton</div>
              <div className="text-sm text-[#EAB308]">+8.1% ↑</div>
            </div>
            <div className="p-3 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20 text-center">
              <div className="text-xs text-[#6F83A7] mb-1">Polyester</div>
              <div className="text-sm text-[#57ACAF]">+9.1% ↑</div>
            </div>
            <div className="p-3 rounded-lg bg-[#6F83A7]/10 border border-[#6F83A7]/20 text-center">
              <div className="text-xs text-[#6F83A7] mb-1">Freight</div>
              <div className="text-sm text-white">+12.0% ↑</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Action Items */}
      <div className="bg-gradient-to-br from-[#D0342C]/10 to-[#D0342C]/5 border border-[#D0342C]/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
              Critical Cost Sheet Action Items
            </h3>
            <p className="text-sm text-[#6F83A7]">
              Cost sheets and approvals requiring immediate attention
            </p>
          </div>
          <MarbimAIButton
            marbimPrompt="Analyze critical action items and provide intervention strategies. Current issues: 3 low-margin cost sheets (all &lt;10% margin - below acceptable threshold), 8 cost sheets pending review for &gt;5 days (approval bottleneck), 5 vendor price updates pending validation. Impact: Potential revenue at risk $145K from low-margin items, quote delays affecting 8 RFQs, pricing uncertainty for 12 active cost sheets. Provide: 1) Prioritized action plan for low-margin cost sheets (material substitution, volume negotiation, design simplification), 2) Approval process acceleration strategies to clear 8-item backlog, 3) Vendor price update validation workflow and prioritization, 4) Escalation recommendations for high-value critical items, 5) Process improvements to prevent similar backlogs, 6) Resource allocation for urgent interventions, 7) Communication templates for stakeholder alignment."
            onAskMarbim={onAskMarbim}
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#D0342C]/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-[#D0342C]" />
              </div>
              <div className="text-white">Low Margin Alerts</div>
            </div>
            <div className="text-3xl text-[#D0342C] mb-2">3</div>
            <div className="text-xs text-[#6F83A7] mb-3">Cost sheets below 10% margin threshold</div>
            <Button 
              size="sm" 
              className="w-full bg-[#D0342C] hover:bg-[#D0342C]/90 text-white"
              onClick={() => toast.error('Opening low-margin cost sheets')}
            >
              Review Now
            </Button>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#EAB308]" />
              </div>
              <div className="text-white">Pending Approvals</div>
            </div>
            <div className="text-3xl text-[#EAB308] mb-2">8</div>
            <div className="text-xs text-[#6F83A7] mb-3">Awaiting review &gt;5 days</div>
            <Button 
              size="sm" 
              variant="outline"
              className="w-full border-[#EAB308]/40 text-[#EAB308] bg-transparent hover:bg-[#EAB308]/10"
              onClick={() => toast.info('Opening pending approvals')}
            >
              Fast Track
            </Button>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-[#57ACAF]" />
              </div>
              <div className="text-white">Price Updates</div>
            </div>
            <div className="text-3xl text-[#57ACAF] mb-2">5</div>
            <div className="text-xs text-[#6F83A7] mb-3">Vendor updates to validate</div>
            <Button 
              size="sm" 
              variant="outline"
              className="w-full border-[#57ACAF]/40 text-[#57ACAF] bg-transparent hover:bg-[#57ACAF]/10"
              onClick={() => toast.success('Opening vendor updates')}
            >
              Validate
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  const renderCostSheetList = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Cost Sheet List</h2>
          <p className="text-sm text-[#6F83A7]">Centralized view of all cost sheets with version tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
            onClick={() => setCreateDrawerOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Cost Sheet
          </Button>
        </div>
      </div>

      <Tabs key={`cost-sheet-list-${currentView}`} defaultValue="all-cost-sheets" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="all-cost-sheets" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <FileText className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">All Cost Sheets</span>
            </TabsTrigger>
            <TabsTrigger 
              value="drafts" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Edit className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Drafts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="approved" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <CheckCircle2 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Approved</span>
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

        <TabsContent value="all-cost-sheets" className="space-y-6">
          {/* Workflow Progress */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#EAB308]" />
                  <span className="text-white">Cost Sheet Workflow</span>
                </div>
                <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <WorkflowStepper
                  steps={[
                    { label: 'Draft Creation', status: 'completed' },
                    { label: 'AI Autofill', status: 'completed' },
                    { label: 'Manager Review', status: 'active' },
                    { label: 'Approval', status: 'pending' },
                    { label: 'Quote Linkage', status: 'pending' },
                  ]}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">All Cost Sheets</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EAB308]"></div>
              </div>
            ) : (
              <SmartTable
                columns={allCostSheetsColumns}
                data={costSheets}
                searchPlaceholder="Search cost sheets..."
                onRowClick={handleRowClick}
              />
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Risk Detection</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM highlights high-margin and low-margin cost sheets and predicts potential risk based on cost fluctuations.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze cost sheets to identify high-margin and low-margin risks, and predict potential cost fluctuation impacts on profitability."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-6">
          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <Edit className="w-5 h-5 text-[#EAB308]" />
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze all 12 draft cost sheets and provide completion status, estimated time to finalize each draft, and prioritization recommendations based on urgency and business impact."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="text-[#6F83A7] mb-2">Total Drafts</div>
              <div className="text-3xl text-white mb-1">12</div>
              <div className="text-xs text-[#6F83A7]">3 updated today</div>
            </div>
            <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-[#D0342C]" />
                </div>
                <MarbimAIButton
                  marbimPrompt="Identify the 3 draft cost sheets with missing critical information. For each draft, specify: 1) Which fields are incomplete (materials, labor, overhead, etc.), 2) Recommended values based on similar styles and historical data, 3) Sources to obtain missing data, 4) Impact of leaving fields incomplete on accuracy."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="text-[#6F83A7] mb-2">Missing Info</div>
              <div className="text-3xl text-[#D0342C] mb-1">3</div>
              <div className="text-xs text-[#6F83A7]">Requires attention</div>
            </div>
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <MarbimAIButton
                  marbimPrompt="Review the 9 draft cost sheets marked as ready to submit. Validate completeness, accuracy of cost calculations, margin reasonableness, and competitive positioning. Flag any issues before submission and suggest final optimizations."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="text-[#6F83A7] mb-2">Ready to Submit</div>
              <div className="text-3xl text-[#57ACAF] mb-1">9</div>
              <div className="text-xs text-[#6F83A7]">Validation passed</div>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <MarbimAIButton
                  marbimPrompt="Identify drafts that have been stagnant for more than 7 days. For each stagnant draft: 1) Identify the responsible user/team, 2) Determine blockers preventing completion, 3) Suggest actions to accelerate progress, 4) Estimate business impact of delays."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="text-[#6F83A7] mb-2">Stagnant Drafts</div>
              <div className="text-3xl text-white mb-1">4</div>
              <div className="text-xs text-[#6F83A7]">&gt;7 days old</div>
            </div>
          </div>

          {/* Draft Progress Tracker */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#EAB308]" />
                Draft Completion Progress
              </h3>
              <MarbimAIButton
                marbimPrompt="Analyze draft completion patterns: 1) Average time from draft creation to submission, 2) Common bottlenecks causing delays, 3) Users/teams with highest draft completion rates, 4) Recommendations to improve overall draft-to-submission conversion rate and reduce cycle time."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-[#6F83A7]">Overall Completion</span>
                  <span className="text-white">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl text-white mb-1">6.2</div>
                  <div className="text-xs text-[#6F83A7]">Avg Days to Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-[#57ACAF] mb-1">85%</div>
                  <div className="text-xs text-[#6F83A7]">Field Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-[#EAB308] mb-1">9/12</div>
                  <div className="text-xs text-[#6F83A7]">Conversion Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Bulk Auto-Complete</h4>
                    <p className="text-sm text-[#6F83A7]">Use AI to fill missing fields across all drafts automatically</p>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="For all 12 draft cost sheets with missing information, use historical data, similar product costs, and current market rates to intelligently auto-complete: 1) Missing material quantities and costs, 2) Labor time and rate estimates, 3) Overhead allocations, 4) Freight cost approximations. Provide confidence scores for each auto-filled value."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <Button className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                <Sparkles className="w-4 h-4 mr-2" />
                Auto-Complete All Drafts
              </Button>
            </div>

            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Validate Ready Drafts</h4>
                    <p className="text-sm text-[#6F83A7]">AI-powered pre-submission validation checks</p>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Run comprehensive validation on the 9 drafts marked as ready to submit: 1) Mathematical accuracy of all calculations (total cost, FOB, margin %), 2) Reasonableness checks (material quantities, labor time, rates vs industry benchmarks), 3) Margin health assessment (compare to buyer-specific and company targets), 4) Competitive positioning analysis, 5) Flag any anomalies or outliers requiring human review before submission."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full border-[#57ACAF]/40 text-[#57ACAF] bg-transparent hover:bg-[#57ACAF]/10"
                onClick={() => toast.info('Running AI validation on 9 ready drafts...')}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Validate & Submit
              </Button>
            </div>
          </div>

          {/* Drafts Table */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Draft Cost Sheets</h3>
              <MarbimAIButton
                marbimPrompt="Analyze all draft cost sheets in the table below and provide: 1) Completion status breakdown by buyer and style category, 2) Most common missing fields, 3) Recommended prioritization order based on buyer importance and deadline urgency, 4) Estimated effort hours to complete each draft."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <SmartTable
              columns={allCostSheetsColumns}
              data={draftsData}
              searchPlaceholder="Search drafts..."
              onRowClick={handleRowClick}
            />
          </div>

          {/* AI Insight Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start gap-3 justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div>
                  <div className="text-white mb-2">AI Auto-Completion Intelligence</div>
                  <div className="text-sm text-[#6F83A7] mb-3">
                    MARBIM detects missing materials or cost fields and suggests completions from past data, similar styles, and current market rates. Auto-complete confidence scores help you identify which values may need manual review.
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Material Suggestions
                    </Badge>
                    <Badge variant="outline" className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30">
                      <Users className="w-3 h-3 mr-1" />
                      Labor Estimates
                    </Badge>
                    <Badge variant="outline" className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Cost Benchmarks
                    </Badge>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Detect missing materials or cost fields in draft cost sheets and suggest accurate completions based on: 1) Historical cost data from similar products, 2) Current material market rates and supplier pricing, 3) Standard labor time estimates from time-and-motion studies, 4) Overhead and freight allocation rules. Include confidence scores (High/Medium/Low) for each suggestion."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-6">
          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze all 38 approved cost sheets: 1) Breakdown by buyer, style category, and season, 2) Average approval time from submission, 3) Approval rate trends over time, 4) Comparison of approved margins vs company targets by buyer tier."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="text-[#6F83A7] mb-2">Total Approved</div>
              <div className="text-3xl text-white mb-1">38</div>
              <div className="text-xs text-[#6F83A7]">5 approved today</div>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#EAB308]" />
                </div>
                <MarbimAIButton
                  marbimPrompt="Identify the 15 approved cost sheets that are actively linked to open RFQs. For each: 1) RFQ reference number and buyer, 2) Quote deadline and submission status, 3) Competitive positioning vs market rates, 4) Win probability assessment based on price competitiveness and buyer relationship."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="text-[#6F83A7] mb-2">Linked to RFQs</div>
              <div className="text-3xl text-[#EAB308] mb-1">15</div>
              <div className="text-xs text-[#6F83A7]">Active quotes</div>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze the 12 approved cost sheets that are converted to order confirmations: 1) Average time from approval to order confirmation, 2) Order value distribution and total revenue, 3) Actual margins achieved vs planned margins in cost sheets, 4) Success factors contributing to order conversion, 5) Learnings to apply to pending cost sheets."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="text-[#6F83A7] mb-2">Order Confirmed</div>
              <div className="text-3xl text-white mb-1">12</div>
              <div className="text-xs text-[#6F83A7]">Converted to OCs</div>
            </div>
            <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-[#D0342C]" />
                </div>
                <MarbimAIButton
                  marbimPrompt="Identify the 6 approved cost sheets that require updates due to cost changes: 1) Specific cost drivers that changed (material price, labor rate, freight, etc.), 2) Magnitude of cost variance ($ and %), 3) Impact on margin and FOB price, 4) Urgency of re-approval based on linked RFQs/OCs, 5) Recommended revision strategy (absorb, pass through, renegotiate)."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="text-[#6F83A7] mb-2">Needs Update</div>
              <div className="text-3xl text-[#D0342C] mb-1">6</div>
              <div className="text-xs text-[#6F83A7]">Cost changes detected</div>
            </div>
          </div>

          {/* Approval Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                  Approval Rate by Buyer
                </h3>
                <MarbimAIButton
                  marbimPrompt="Analyze approval rates across buyers: 1) Which buyers have the highest/lowest cost sheet approval rates, 2) Common reasons for rejections by buyer, 3) Average time to approval by buyer tier, 4) Strategies to improve approval rates for specific buyers."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">H&M</span>
                  <span className="text-[#57ACAF]">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Zara</span>
                  <span className="text-[#57ACAF]">88%</span>
                </div>
                <Progress value={88} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Gap</span>
                  <span className="text-[#EAB308]">78%</span>
                </div>
                <Progress value={78} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Nike</span>
                  <span className="text-[#D0342C]">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#EAB308]" />
                  Margin Health Distribution
                </h3>
                <MarbimAIButton
                  marbimPrompt="Analyze margin health across approved cost sheets: 1) Distribution of margins (high >20%, healthy 15-20%, acceptable 10-15%, low <10%), 2) Margin trends by product category and buyer, 3) Impact of material/labor cost changes on margin health, 4) Recommendations to improve low-margin approved sheets."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie
                    data={[
                      { name: 'High (>20%)', value: 8, fill: '#57ACAF' },
                      { name: 'Healthy (15-20%)', value: 18, fill: '#EAB308' },
                      { name: 'Acceptable (10-15%)', value: 9, fill: '#6F83A7' },
                      { name: 'Low (<10%)', value: 3, fill: '#D0342C' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Linkage & Traceability */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white flex items-center gap-2">
                <Clipboard className="w-5 h-5 text-[#57ACAF]" />
                Cost Sheet Linkage & Traceability
              </h3>
              <MarbimAIButton
                marbimPrompt="Provide comprehensive traceability analysis: 1) Mapping of approved cost sheets to RFQs, quotes, and order confirmations, 2) Orphaned cost sheets without downstream linkages, 3) Cost sheet versions and revision history by order/RFQ, 4) Audit trail completeness assessment, 5) Recommendations to improve end-to-end traceability."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                <div className="text-2xl text-[#57ACAF] mb-1">15</div>
                <div className="text-xs text-[#6F83A7]">Linked to RFQs</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                <div className="text-2xl text-[#EAB308] mb-1">12</div>
                <div className="text-xs text-[#6F83A7]">Linked to OCs</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                <div className="text-2xl text-white mb-1">11</div>
                <div className="text-xs text-[#6F83A7]">Not Linked Yet</div>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white"
              onClick={() => toast.success('Opening linkage management...')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Manage Linkages
            </Button>
          </div>

          {/* Approved Table */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Approved Cost Sheets</h3>
              <MarbimAIButton
                marbimPrompt="Analyze approved cost sheets in detail: 1) Total value of orders confirmed from approved sheets, 2) Average margin achieved vs target by buyer, 3) Top performing cost sheets (high margin + high volume), 4) Cost sheets at risk of becoming obsolete due to market changes, 5) Opportunities to reuse approved sheets for new RFQs/styles."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <SmartTable
              columns={allCostSheetsColumns}
              data={approvedData}
              searchPlaceholder="Search approved..."
              onRowClick={handleRowClick}
            />
          </div>

          {/* AI Insight Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div>
                  <div className="text-white mb-2">AI-Powered Linkage & Traceability</div>
                  <div className="text-sm text-[#6F83A7] mb-3">
                    MARBIM automatically links approved cost sheets to relevant RFQs, quotes, and order confirmations for complete traceability. AI analyzes buyer, style, timing, and contextual data to suggest optimal linkages, ensuring accurate audit trails and enabling end-to-end order tracking.
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/30">
                      <FileText className="w-3 h-3 mr-1" />
                      RFQ Linking
                    </Badge>
                    <Badge variant="outline" className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/30">
                      <Package className="w-3 h-3 mr-1" />
                      OC Mapping
                    </Badge>
                    <Badge variant="outline" className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/30">
                      <Activity className="w-3 h-3 mr-1" />
                      Version Control
                    </Badge>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Link approved cost sheets to relevant RFQs and order confirmations for complete traceability: 1) Intelligent matching based on buyer, style number, quantity, and timing, 2) Multi-version tracking for cost sheet revisions linked to same order, 3) Audit trail generation for compliance, 4) Orphaned cost sheet identification and suggested linkage, 5) Cross-reference validation to ensure data consistency across systems."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* AI Insights Header */}
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
            <div className="flex items-start gap-4 justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-[#EAB308]" />
                </div>
                <div>
                  <h3 className="text-white text-xl mb-2">MARBIM Cost Intelligence Dashboard</h3>
                  <p className="text-sm text-[#6F83A7]">
                    AI-powered insights, predictive analytics, and optimization recommendations across all cost sheets
                  </p>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Provide comprehensive AI-powered cost intelligence report covering: 1) Overall cost sheet health assessment (approval rates, margin distribution, completion velocity), 2) Predictive analytics on material cost trends and impact on margins, 3) Buyer-specific cost optimization opportunities, 4) Process bottlenecks and improvement recommendations, 5) Competitive positioning analysis, 6) Risk alerts and proactive mitigation strategies."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>

          {/* Key Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Margin Variance Alert */}
            <div className="bg-gradient-to-br from-[#D0342C]/10 to-[#D0342C]/5 border border-[#D0342C]/20 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Margin Variance Alert</h4>
                    <p className="text-sm text-[#6F83A7]">
                      Margin variance driven by labor rate increase in Line 4 (15% increase). Immediate review recommended for 8 affected cost sheets.
                    </p>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze the margin variance caused by Line 4 labor rate increase: 1) List all 8 affected cost sheets with before/after margin comparison, 2) Quantify margin erosion in $ and %, 3) Mitigation strategies (absorb, pass through to buyer, material substitution, process optimization), 4) Impact on competitiveness for each RFQ, 5) Recommended actions prioritized by urgency and business impact."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="text-xs text-[#6F83A7] mb-1">Affected Sheets</div>
                  <div className="text-xl text-white">8</div>
                </div>
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="text-xs text-[#6F83A7] mb-1">Margin Impact</div>
                  <div className="text-xl text-[#D0342C]">-2.3%</div>
                </div>
              </div>
              <Button className="w-full bg-[#D0342C] hover:bg-[#D0342C]/90" onClick={() => toast.error('Opening affected cost sheets...')}>
                <Eye className="w-4 h-4 mr-2" />
                Review Details
              </Button>
            </div>

            {/* Cost Reduction Opportunity */}
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Cost Reduction Opportunity</h4>
                    <p className="text-sm text-[#6F83A7]">
                      Recommended vendor switch for cotton fabric could save 3% on material costs without quality compromise.
                    </p>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Detail the cost reduction opportunity from vendor switch: 1) Current supplier vs recommended supplier comparison (price, quality, lead time, reliability), 2) Specific cost sheets that would benefit from this switch, 3) Estimated annual savings ($ and %), 4) Risk assessment (supply continuity, quality consistency, buyer approval requirements), 5) Implementation plan and timeline, 6) Additional material cost optimization opportunities."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="text-xs text-[#6F83A7] mb-1">Potential Savings</div>
                  <div className="text-xl text-[#57ACAF]">$18K/mo</div>
                </div>
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="text-xs text-[#6F83A7] mb-1">Affected Orders</div>
                  <div className="text-xl text-white">14</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-[#57ACAF]/40 text-[#57ACAF] bg-transparent hover:bg-[#57ACAF]/10"
                onClick={() => toast.success('Opening vendor comparison analysis...')}
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                View Analysis
              </Button>
            </div>

            {/* Pricing Benchmark */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Competitive Pricing Benchmark</h4>
                    <p className="text-sm text-[#6F83A7]">
                      Your FOB prices are 7% below market average for t-shirts, indicating strong competitive positioning.
                    </p>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Provide comprehensive competitive pricing analysis: 1) Benchmark your FOB prices vs market averages by product category (t-shirts, pants, jackets, etc.), 2) Buyer-specific pricing competitiveness assessment, 3) Margin optimization opportunities where you have pricing power, 4) Products where you're at risk due to high pricing, 5) Recommended pricing strategy adjustments, 6) Market share implications of current pricing strategy."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">T-Shirts</span>
                  <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">-7% vs Market</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Pants</span>
                  <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">-4% vs Market</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Jackets</span>
                  <Badge className="bg-[#D0342C]/20 text-[#D0342C] border-[#D0342C]/30">+3% vs Market</Badge>
                </div>
              </div>
              <Button 
                className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
                onClick={() => toast.info('Opening pricing benchmarks...')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Full Report
              </Button>
            </div>

            {/* Process Optimization */}
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center shrink-0">
                    <Settings className="w-5 h-5 text-[#6F83A7]" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Process Bottleneck Detection</h4>
                    <p className="text-sm text-[#6F83A7]">
                      Average approval time is 8.5 days, 40% longer than industry benchmark. AI suggests workflow improvements.
                    </p>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze cost sheet approval process bottlenecks: 1) Breakdown of approval cycle time by stage (draft completion, review, manager approval, final sign-off), 2) Comparison vs industry benchmarks, 3) Identify specific approval stages causing delays, 4) Root cause analysis (resource constraints, unclear criteria, system limitations), 5) Concrete process improvement recommendations to reduce cycle time by 40%, 6) Expected impact on quote turnaround time and win rate."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="text-xs text-[#6F83A7] mb-1">Current Avg</div>
                  <div className="text-xl text-white">8.5 days</div>
                </div>
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="text-xs text-[#6F83A7] mb-1">Target</div>
                  <div className="text-xl text-[#57ACAF]">5.0 days</div>
                </div>
              </div>
              <Button 
                variant="outline"
                className="w-full border-[#6F83A7]/40 text-[#6F83A7] bg-transparent hover:bg-[#6F83A7]/10"
                onClick={() => toast.info('Opening process analysis...')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Optimize Workflow
              </Button>
            </div>
          </div>

          {/* Status Distribution Chart */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#57ACAF]" />
                Cost Sheet Status Distribution
              </h3>
              <MarbimAIButton
                marbimPrompt="Analyze cost sheet status distribution and trends: 1) Historical trend of draft/submitted/approved/rejected counts over past 6 months, 2) Seasonal patterns in cost sheet volumes, 3) Rejection rate analysis by buyer and product category, 4) Velocity metrics (time in each status), 5) Forecasted cost sheet volumes for next quarter, 6) Resource planning recommendations based on projected workload."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { status: 'Draft', count: 12 },
                { status: 'Submitted', count: 8 },
                { status: 'Approved', count: 38 },
                { status: 'Rejected', count: 2 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="status" stroke="#6F83A7" />
                <YAxis stroke="#6F83A7" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1117',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#57ACAF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Material Cost Trends */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-[#EAB308]" />
                Material Cost Trend Analysis
              </h3>
              <MarbimAIButton
                marbimPrompt="Provide predictive analysis on material cost trends: 1) Historical cotton, polyester, and freight cost trends over 12 months, 2) Forecasted costs for next 3-6 months based on market indicators, 3) Impact on current cost sheets and margins, 4) Hedging or sourcing strategies to mitigate cost increases, 5) Scenario planning (best/worst/likely cases), 6) Recommended timing for price adjustments to buyers."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsLine data={[
                { month: 'Jun', cotton: 1.82, polyester: 0.95, freight: 0.42 },
                { month: 'Jul', cotton: 1.88, polyester: 0.98, freight: 0.44 },
                { month: 'Aug', cotton: 1.95, polyester: 1.02, freight: 0.46 },
                { month: 'Sep', cotton: 1.92, polyester: 1.05, freight: 0.48 },
                { month: 'Oct', cotton: 1.97, polyester: 1.08, freight: 0.47 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#6F83A7" />
                <YAxis stroke="#6F83A7" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1117',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                  formatter={(value: any) => `$${value}`}
                />
                <Line type="monotone" dataKey="cotton" stroke="#EAB308" strokeWidth={2} name="Cotton $/lb" />
                <Line type="monotone" dataKey="polyester" stroke="#57ACAF" strokeWidth={2} name="Polyester $/lb" />
                <Line type="monotone" dataKey="freight" stroke="#6F83A7" strokeWidth={2} name="Freight $/unit" />
              </RechartsLine>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20 text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Cotton</div>
                <div className="text-sm text-[#EAB308]">+8.1% ↑</div>
              </div>
              <div className="p-3 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20 text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Polyester</div>
                <div className="text-sm text-[#57ACAF]">+9.1% ↑</div>
              </div>
              <div className="p-3 rounded-lg bg-[#6F83A7]/10 border border-[#6F83A7]/20 text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Freight</div>
                <div className="text-sm text-white">+12.0% ↑</div>
              </div>
            </div>
          </div>

          {/* Predictive Analytics */}
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
            <div className="flex items-start gap-3 justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-[#EAB308]" />
                </div>
                <div>
                  <h4 className="text-white text-lg mb-2">MARBIM Predictive Cost Analytics</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    Advanced AI algorithms analyze historical patterns, market trends, and business data to predict future cost fluctuations, identify optimization opportunities, and provide proactive recommendations. MARBIM continuously learns from your data to improve prediction accuracy.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Badge variant="outline" className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30 justify-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Cost Forecasting
                    </Badge>
                    <Badge variant="outline" className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30 justify-center">
                      <Target className="w-3 h-3 mr-1" />
                      Margin Optimization
                    </Badge>
                    <Badge variant="outline" className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30 justify-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Risk Detection
                    </Badge>
                    <Badge variant="outline" className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30 justify-center">
                      <Award className="w-3 h-3 mr-1" />
                      Best Practices
                    </Badge>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Activate comprehensive predictive cost analytics: 1) Machine learning-based cost forecasting for materials, labor, and overhead over next 6 months, 2) Anomaly detection to flag unusual cost patterns requiring investigation, 3) Optimization recommendations ranked by ROI potential, 4) Risk scoring for each cost sheet based on market volatility and business factors, 5) Automated alerts for critical cost changes requiring immediate action, 6) Benchmarking against industry best practices with gap analysis and improvement roadmap."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderScenarios = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Cost Scenarios</h2>
          <p className="text-sm text-[#6F83A7]">Simulate and compare multiple pricing options</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Plus className="w-4 h-4 mr-2" />
            New Scenario
          </Button>
        </div>
      </div>

      <Tabs key={`scenarios-${currentView}`} defaultValue="scenario-builder" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="scenario-builder" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Layers className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Scenario Builder</span>
            </TabsTrigger>
            <TabsTrigger 
              value="scenario-comparison" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <BarChart3 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Scenario Comparison</span>
            </TabsTrigger>
            <TabsTrigger 
              value="approvals" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <CheckCircle2 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Approvals</span>
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

        <TabsContent value="scenario-builder" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Cost Scenarios</h3>
            <SmartTable
              columns={scenariosColumns}
              data={scenariosData}
              searchPlaceholder="Search scenarios..."
              onRowClick={handleRowClick}
            />
          </div>

          <AICard
            title="AI Impact Calculation"
            marbimPrompt="Analyze the impact of material, labor, and lead time variations on profitability for the current cost scenarios. Provide detailed insights on how each factor affects the bottom line and suggest optimization strategies."
            onAskMarbim={onAskMarbim}
          >
            <div className="text-sm text-[#6F83A7]">
              MARBIM calculates impact of material/labor/lead time variation on profitability automatically.
            </div>
          </AICard>
        </TabsContent>

        <TabsContent value="scenario-comparison" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-white mb-6">Scenario Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[#6F83A7] py-3 px-4">Component</th>
                    <th className="text-left text-white py-3 px-4">Scenario A</th>
                    <th className="text-left text-white py-3 px-4">Scenario B</th>
                    <th className="text-left text-white py-3 px-4">Scenario C</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 text-[#6F83A7]">Material</td>
                    <td className="py-3 px-4 text-white">$5.80</td>
                    <td className="py-3 px-4 text-[#57ACAF]">$5.20 ✓</td>
                    <td className="py-3 px-4 text-white">$4.60</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 text-[#6F83A7]">Labor</td>
                    <td className="py-3 px-4 text-white">$2.40</td>
                    <td className="py-3 px-4 text-[#57ACAF]">$2.10 ✓</td>
                    <td className="py-3 px-4 text-white">$1.90</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 text-[#6F83A7]">Margin %</td>
                    <td className="py-3 px-4 text-white">18%</td>
                    <td className="py-3 px-4 text-[#57ACAF]">14% ✓</td>
                    <td className="py-3 px-4 text-white">10%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 text-[#6F83A7]">Lead Time</td>
                    <td className="py-3 px-4 text-white">45 days</td>
                    <td className="py-3 px-4 text-[#57ACAF]">38 days ✓</td>
                    <td className="py-3 px-4 text-white">50 days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-[#6F83A7]">Total FOB</td>
                    <td className="py-3 px-4 text-white">$11.25</td>
                    <td className="py-3 px-4 text-[#57ACAF]">$9.85 ✓</td>
                    <td className="py-3 px-4 text-white">$8.90</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Recommendation</div>
                  <div className="text-sm text-[#6F83A7]">
                    Scenario B yields 14% margin — optimal based on cost vs delivery balance and buyer acceptance patterns.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze all costing scenarios and recommend the optimal option based on margin, cost structure, delivery balance, and historical buyer acceptance patterns."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          {/* Workflow Progress */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#EAB308]" />
                  <span className="text-white">Approval Workflow</span>
                </div>
                <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <WorkflowStepper
                  steps={[
                    { label: 'Cost Analyst', status: 'completed' },
                    { label: 'Manager Review', status: 'completed' },
                    { label: 'Director Approval', status: 'active' },
                    { label: 'Quote Generation', status: 'pending' },
                  ]}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { approver: 'Cost Analyst', status: 'Approved', date: '2024-10-25', notes: 'All scenarios validated' },
              { approver: 'Manager', status: 'Approved', date: '2024-10-26', notes: 'Scenario B recommended' },
              { approver: 'Director', status: 'Pending', date: 'Awaiting', notes: '-' },
            ].map((approval, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white">{approval.approver}</div>
                  <Badge className={approval.status === 'Approved' ? 'bg-[#57ACAF]/10 text-[#57ACAF]' : 'bg-[#EAB308]/10 text-[#EAB308]'}>
                    {approval.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6F83A7]">Date</span>
                    <span className="text-white">{approval.date}</span>
                  </div>
                  <div>
                    <div className="text-[#6F83A7] mb-1">Notes</div>
                    <div className="text-white">{approval.notes}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Policy Validation</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM ensures approvals align with margin policy and triggers escalation for low-margin cases.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Validate cost sheet approvals against margin policy and automatically trigger escalation for low-margin cases requiring senior approval."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Target className="w-5 h-5 text-[#EAB308] flex-shrink-0" />
                  <div className="text-white">Optimal Scenario</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Scenario B yields 14% margin — optimal based on buyer's past acceptance band and market conditions.
                </p>
              </div>

              <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Clock className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                  <div className="text-white">Lead Time Optimization</div>
                </div>
                <p className="text-sm text-[#6F83A7]">
                  Lead time extension by 3 days could reduce freight cost by $0.05/unit without impacting delivery.
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Margin by Scenario</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={scenariosData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="scenario" stroke="#6F83A7" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#6F83A7" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="margin" fill="#57ACAF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderBenchmarks = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Cost Benchmarks</h2>
          <p className="text-sm text-[#6F83A7]">Historical analysis and commodity trends for optimization</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs key={`benchmarks-${currentView}`} defaultValue="historical-cost-sheets" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="historical-cost-sheets" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <BookOpen className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Historical Cost Sheets</span>
            </TabsTrigger>
            <TabsTrigger 
              value="commodity-trends" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <LineChart className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Commodity Trends</span>
            </TabsTrigger>
            <TabsTrigger 
              value="vendor-performance" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Award className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Vendor Performance</span>
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

        <TabsContent value="historical-cost-sheets" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                  +12%
                </Badge>
              </div>
              <p className="text-xs text-[#6F83A7] mb-1">Total Records</p>
              <p className="text-2xl text-white">2,847</p>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#EAB308]" />
                </div>
                <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                  Avg
                </Badge>
              </div>
              <p className="text-xs text-[#6F83A7] mb-1">Avg Cost/Unit</p>
              <p className="text-2xl text-white">$9.85</p>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20">
                  +2.1%
                </Badge>
              </div>
              <p className="text-xs text-[#6F83A7] mb-1">Avg Margin</p>
              <p className="text-2xl text-white">16.2%</p>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-[#6F83A7] mb-1">Product Types</p>
              <p className="text-2xl text-white">127</p>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Button 
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter by Buyer
              </Button>
              <Button 
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter by Category
              </Button>
              <Button 
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <Filter className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <MarbimAIButton
                onClick={() => onAskMarbim('Analyze historical cost data trends across all product categories. Identify cost increase patterns, margin erosion risks, and recommend optimization strategies based on similar styles and buyer segments.')}
                size="sm"
              >
                Analyze Trends
              </MarbimAIButton>
              <Button className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Historical Cost Table */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-white mb-1">Historical Cost Analysis</h3>
                  <p className="text-xs text-[#6F83A7]">Complete cost history across all products and buyers</p>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={() => onAskMarbim('Compare historical cost sheets for similar product types and identify which buyers consistently get better pricing. Provide recommendations for margin improvement.')}
                className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90"
              >
                <Sparkles className="w-3 h-3 mr-2" />
                Compare Costs
              </Button>
            </div>
            <SmartTable
              columns={historicalCostColumns}
              data={historicalCostData}
              searchPlaceholder="Search historical costs..."
              onRowClick={handleRowClick}
            />
          </div>

          {/* AI Insights Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-start gap-3 justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Cost Trend Analysis</div>
                    <div className="text-sm text-[#6F83A7]">
                      Material costs increased 8.3% over last 6 months. Labor costs stable at +1.2%. Recommend reviewing supplier contracts.
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => onAskMarbim('Analyze historical material usage trends and identify cost-saving opportunities by detecting patterns, price fluctuations, and alternative material options across the last 12 months of cost sheets.')}
                size="sm"
                className="w-full"
              >
                Deep Dive Analysis
              </MarbimAIButton>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-start gap-3 justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Margin Optimization</div>
                    <div className="text-sm text-[#6F83A7]">
                      T-shirt styles show 12-18% margin variation across buyers. H&M and Gap styles underperforming vs. target margins.
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => onAskMarbim('Identify cost sheets with margin below target and suggest specific cost optimization actions: material alternatives, process improvements, or pricing adjustments.')}
                size="sm"
                className="w-full"
              >
                Find Opportunities
              </MarbimAIButton>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
              <div className="flex items-start gap-3 justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-[#6F83A7]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Buyer Pricing Patterns</div>
                    <div className="text-sm text-[#6F83A7]">
                      Target USA consistently achieves best margins (16.8% avg). Zara shows highest volume but lower margins (12.3% avg).
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => onAskMarbim('Analyze buyer-specific pricing patterns and cost structures. Which buyers offer best margins? What cost levers drive profitability differences?')}
                size="sm"
                className="w-full"
              >
                Buyer Analysis
              </MarbimAIButton>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-start gap-3 justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Predictive Cost Model</div>
                    <div className="text-sm text-[#6F83A7]">
                      Based on 2,847 historical records, AI can estimate new style costs with 94% accuracy. Try it on your next RFQ.
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => onAskMarbim('Use historical cost data to build a predictive cost model. For a new men\'s polo shirt RFQ from H&M with 50,000 pcs order, estimate material costs, labor costs, and recommended margin.')}
                size="sm"
                className="w-full"
              >
                Predict New Cost
              </MarbimAIButton>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="commodity-trends" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#D0342C]" />
                </div>
                <Badge className="bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20">
                  ↑ Rising
                </Badge>
              </div>
              <p className="text-xs text-[#6F83A7] mb-1">Cotton Price</p>
              <p className="text-2xl text-white">$2.00/lb</p>
              <p className="text-xs text-[#D0342C] mt-2">+8.1% vs last month</p>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#D0342C]" />
                </div>
                <Badge className="bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20">
                  ↑ Rising
                </Badge>
              </div>
              <p className="text-xs text-[#6F83A7] mb-1">Polyester Price</p>
              <p className="text-2xl text-white">$1.20/lb</p>
              <p className="text-xs text-[#D0342C] mt-2">+9.1% vs last month</p>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                  Stable
                </Badge>
              </div>
              <p className="text-xs text-[#6F83A7] mb-1">Freight Cost</p>
              <p className="text-2xl text-white">$2.80/kg</p>
              <p className="text-xs text-[#57ACAF] mt-2">+1.8% vs last month</p>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#EAB308]" />
                </div>
                <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                  3 Active
                </Badge>
              </div>
              <p className="text-xs text-[#6F83A7] mb-1">Price Alerts</p>
              <p className="text-2xl text-white">3</p>
            </div>
          </div>

          {/* Chart and Actions */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center">
                  <LineChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white mb-1">Commodity Price Trends (6 Months)</h3>
                  <p className="text-xs text-[#6F83A7]">Live market data updated daily</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Refresh Data
                </Button>
                <MarbimAIButton
                  onClick={() => onAskMarbim('Analyze commodity price trends for cotton, polyester, and freight. Provide 3-month forecast and recommend procurement strategies: bulk buying timing, contract negotiations, or alternative materials.')}
                  size="sm"
                >
                  Forecast Trends
                </MarbimAIButton>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <RechartsLine data={commodityTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#6F83A7" />
                <YAxis stroke="#6F83A7" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1117',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                />
                <Line type="monotone" dataKey="cotton" stroke="#EAB308" strokeWidth={2} name="Cotton ($/lb)" />
                <Line type="monotone" dataKey="polyester" stroke="#57ACAF" strokeWidth={2} name="Polyester ($/lb)" />
                <Line type="monotone" dataKey="freight" stroke="#9333EA" strokeWidth={2} name="Freight ($/kg)" />
              </RechartsLine>
            </ResponsiveContainer>
          </div>

          {/* Commodity Cards with AI */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { name: 'Cotton', price: '$2.00/lb', change: '+8.1%', forecast: '+3-5%', icon: Package, color: '#EAB308', status: 'Rising' },
              { name: 'Polyester', price: '$1.20/lb', change: '+9.1%', forecast: '+4-6%', icon: Layers, color: '#57ACAF', status: 'Rising' },
              { name: 'Freight', price: '$2.80/kg', change: '+1.8%', forecast: 'Stable', icon: Activity, color: '#6F83A7', status: 'Stable' },
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}33` }}>
                        <IconComponent className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <div className="text-white font-medium">{item.name}</div>
                    </div>
                    <Badge className={item.status === 'Rising' ? 'bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20' : 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6F83A7]">Current Price</span>
                      <span className="text-white">{item.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6F83A7]">30-Day Change</span>
                      <span className={item.status === 'Rising' ? 'text-[#D0342C]' : 'text-[#57ACAF]'}>{item.change}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6F83A7]">90-Day Forecast</span>
                      <span className={item.status === 'Rising' ? 'text-[#D0342C]' : 'text-[#57ACAF]'}>{item.forecast}</span>
                    </div>
                  </div>
                  <MarbimAIButton
                    onClick={() => onAskMarbim(`${item.name} prices ${item.status.toLowerCase()} at ${item.change}. Analyze impact on cost sheets and recommend procurement strategy.`)}
                    size="sm"
                    className="w-full"
                  >
                    AI Strategy
                  </MarbimAIButton>
                </div>
              );
            })}
          </div>

          {/* Price Alerts */}
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div>
                  <h3 className="text-white mb-1">Active Price Alerts</h3>
                  <p className="text-xs text-[#6F83A7]">3 commodities require immediate attention</p>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => onAskMarbim('Review all active price alerts and provide comprehensive procurement strategy. Prioritize by cost impact and suggest immediate actions.')}
                size="sm"
              >
                Strategy Review
              </MarbimAIButton>
            </div>
            <div className="space-y-3">
              {[
                { level: 'Critical', type: 'Cotton Price Surge', msg: 'Expected 3% increase next month. Review long-term contracts and consider early bulk booking for Q1 2025 orders.', color: 'D0342C' },
                { level: 'Warning', type: 'Polyester Volatility', msg: 'Polyester showing 9% upward trend. Consider blended alternatives or negotiate fixed-price contracts with suppliers.', color: 'EAB308' },
                { level: 'Info', type: 'Dye Chemical Price Watch', msg: 'Reactive dyes increasing 5% due to supply chain constraints. Monitor impact on dark color garments.', color: '6F83A7' },
              ].map((alert, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`bg-[#${alert.color}]/10 text-[#${alert.color}] border border-[#${alert.color}]/20`}>{alert.level}</Badge>
                        <span className="text-white text-sm">{alert.type}</span>
                      </div>
                      <p className="text-xs text-[#6F83A7]">{alert.msg}</p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => onAskMarbim(`${alert.type}: ${alert.msg} Provide detailed action plan.`)}
                      className="ml-4 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 shrink-0"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      {alert.level === 'Critical' ? 'Act Now' : 'Review'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vendor-performance" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">Active</Badge>
              </div>
              <p className="text-xs text-[#6F83A7] mb-1">Total Vendors</p>
              <p className="text-2xl text-white">47</p>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#EAB308]" />
                </div>
                <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">Top Tier</Badge>
              </div>
              <p className="text-xs text-[#6F83A7] mb-1">Avg Quality Score</p>
              <p className="text-2xl text-white">4.5★</p>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20">Excellent</Badge>
              </div>
              <p className="text-xs text-[#6F83A7] mb-1">Price Stability</p>
              <p className="text-2xl text-white">91%</p>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">On-Time</Badge>
              </div>
              <p className="text-xs text-[#6F83A7] mb-1">Avg Lead Time</p>
              <p className="text-2xl text-white">10 days</p>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]">
                <Filter className="w-4 h-4 mr-2" />
                Filter by Category
              </Button>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]">
                <Filter className="w-4 h-4 mr-2" />
                Quality Score
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <MarbimAIButton
                onClick={() => onAskMarbim('Perform comprehensive vendor performance analysis. Identify top performers, flag underperformers, and recommend vendor consolidation or diversification strategies.')}
                size="sm"
              >
                Vendor Scorecard
              </MarbimAIButton>
              <Button className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Vendor Table */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white mb-1">Vendor Performance Analysis</h3>
                  <p className="text-xs text-[#6F83A7]">Cost reliability, quality ratings, and delivery performance</p>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={() => onAskMarbim('Compare vendor performance metrics and identify opportunities for cost savings through vendor consolidation or switching to higher-performing suppliers.')}
                className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90"
              >
                <Sparkles className="w-3 h-3 mr-2" />
                Compare Vendors
              </Button>
            </div>
            <SmartTable
              columns={vendorPerformanceColumns}
              data={vendorPerformanceData}
              searchPlaceholder="Search vendors..."
              onRowClick={handleRowClick}
            />
          </div>

          {/* AI Insights Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-start gap-3 justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Top Performing Vendor</div>
                    <div className="text-sm text-[#6F83A7]">
                      Fabric Co A maintains 92% price stability with 4.5★ quality rating. Consider increasing allocation.
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => onAskMarbim('Deep dive into Fabric Co A performance. Should we increase allocation? What are the risks and benefits of greater reliance on this vendor?')}
                size="sm"
                className="w-full"
              >
                Detailed Analysis
              </MarbimAIButton>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-start gap-3 justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Cost Optimization Alert</div>
                    <div className="text-sm text-[#6F83A7]">
                      Trim Supplier B showing 12% price inconsistency. Alternative vendors offer 4-6% better rates.
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => onAskMarbim('Analyze Trim Supplier B pricing volatility. Recommend alternative suppliers and calculate potential annual savings from switching.')}
                size="sm"
                className="w-full"
              >
                Find Alternatives
              </MarbimAIButton>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
              <div className="flex items-start gap-3 justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-[#6F83A7]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Vendor Diversification</div>
                    <div className="text-sm text-[#6F83A7]">
                      68% of fabric spend concentrated with 2 suppliers. AI recommends diversification to reduce risk.
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => onAskMarbim('Analyze vendor concentration risk across all material categories. Recommend optimal diversification strategy while maintaining quality and cost targets.')}
                size="sm"
                className="w-full"
              >
                Diversification Plan
              </MarbimAIButton>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-start gap-3 justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Contract Renewal Intelligence</div>
                    <div className="text-sm text-[#6F83A7]">
                      3 major supplier contracts expire in Q1 2025. AI analyzes market rates and negotiation leverage points.
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => onAskMarbim('Review upcoming supplier contract renewals. Provide market rate benchmarks, negotiation strategies, and recommend lock-in periods based on commodity trends.')}
                size="sm"
                className="w-full"
              >
                Renewal Strategy
              </MarbimAIButton>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* Hero Card */}
          <div className="relative bg-gradient-to-br from-[#EAB308]/10 via-transparent to-[#57ACAF]/10 border border-white/10 rounded-2xl p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }} />
            </div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                    <Sparkles className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-white mb-1">AI-Powered Cost Intelligence</h2>
                    <p className="text-sm text-[#6F83A7]">Real-time insights and recommendations for cost optimization</p>
                  </div>
                </div>
                <MarbimAIButton
                  onClick={() => onAskMarbim('Provide comprehensive cost optimization strategy covering: 1) Material cost reduction opportunities, 2) Vendor consolidation benefits, 3) Commodity hedging recommendations, 4) Process efficiency improvements, 5) Margin enhancement tactics.')}
                  size="lg"
                >
                  Full Strategy Report
                </MarbimAIButton>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Savings Identified', value: '$84K', icon: TrendingUp, color: '#57ACAF' },
                  { label: 'AI Recommendations', value: '12', icon: Sparkles, color: '#EAB308' },
                  { label: 'Margin Improvements', value: '+2.4%', icon: Target, color: '#6F83A7' },
                  { label: 'Actions Required', value: '5', icon: Zap, color: '#57ACAF' },
                ].map((stat, idx) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}33` }}>
                          <IconComponent className="w-5 h-5" style={{ color: stat.color }} />
                        </div>
                        <div>
                          <p className="text-xs text-[#6F83A7]">{stat.label}</p>
                          <p className="text-xl text-white">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Primary Insights */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-2">Procurement Strategy Optimization</h3>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    AI forecasts cotton price increase of 3-5% over next 90 days. Recommend early bulk booking for Q1 2025 orders to lock current rates.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6F83A7]">Potential Savings</span>
                      <span className="text-white">$32,000</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6F83A7]">Risk Level</span>
                      <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">Low</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => onAskMarbim('Create detailed procurement strategy for cotton bulk booking. Include: quantity recommendations, timing, supplier selection criteria, contract terms, and financial impact analysis.')}
                size="sm"
                className="w-full"
              >
                Generate Plan
              </MarbimAIButton>
            </div>

            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-[#57ACAF]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-2">Vendor Consolidation Opportunity</h3>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    Analysis shows Fabric Co A offers 92% price consistency. Increasing allocation by 25% could reduce costs by 4-6% through volume discounts.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6F83A7]">Annual Savings</span>
                      <span className="text-white">$28,000</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6F83A7]">Risk Level</span>
                      <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">Medium</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => onAskMarbim('Analyze vendor consolidation strategy. What are risks of increased dependence on Fabric Co A? Should we maintain backup suppliers? Create risk mitigation plan.')}
                size="sm"
                className="w-full"
              >
                Risk Analysis
              </MarbimAIButton>
            </div>
          </div>

          {/* Cost Opportunities */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center">
                  <Clipboard className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-white mb-1">Cost Optimization Opportunities</h3>
                  <p className="text-xs text-[#6F83A7]">AI-identified savings across materials, vendors, and processes</p>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => onAskMarbim('Prioritize all cost optimization opportunities by ROI and implementation difficulty. Create action plan with timeline and ownership assignments.')}
                size="sm"
              >
                Prioritize Actions
              </MarbimAIButton>
            </div>
            <div className="space-y-3">
              {[
                { opportunity: 'Switch trim supplier', saving: '$12,000', pct: '4%', impact: 'Low Risk', effort: 'Easy' },
                { opportunity: 'Bulk fabric purchase for Q1', saving: '$32,000', pct: '6%', impact: 'Medium Risk', effort: 'Moderate' },
                { opportunity: 'Optimize marker planning', saving: '$18,000', pct: '3%', impact: 'No Risk', effort: 'Easy' },
                { opportunity: 'Negotiate volume discounts', saving: '$22,000', pct: '5%', impact: 'Low Risk', effort: 'Moderate' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm">{item.opportunity}</span>
                        <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">{item.impact}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs mt-2">
                        <div>
                          <span className="text-[#6F83A7] block">Savings</span>
                          <span className="text-white">{item.saving}</span>
                        </div>
                        <div>
                          <span className="text-[#6F83A7] block">Impact</span>
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">{item.pct}</Badge>
                        </div>
                        <div>
                          <span className="text-[#6F83A7] block">Effort</span>
                          <span className="text-white">{item.effort}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <MarbimAIButton
                    onClick={() => onAskMarbim(`Provide detailed implementation plan for: "${item.opportunity}". Include steps, risks, mitigation strategies, and expected timeline.`)}
                    size="sm"
                    className="w-full"
                  >
                    Implementation Plan
                  </MarbimAIButton>
                </div>
              ))}
            </div>
          </div>

          {/* Additional AI Cards */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { title: 'Margin Health Monitor', desc: '3 cost sheets below target margin. AI recommends specific actions for each.', icon: BarChart3, color: '#6F83A7', prompt: 'Identify all cost sheets with margins below target. For each, suggest 2-3 specific optimization actions.' },
              { title: 'Predictive Costing', desc: 'AI estimates new style costs with 94% accuracy based on historical data.', icon: Sparkles, color: '#EAB308', prompt: 'For my next RFQ (men\'s polo shirt, H&M, 50K pcs), use historical data to predict material costs, labor costs, and recommended margin.' },
              { title: 'Competitive Benchmarking', desc: 'Compare your costs against industry benchmarks and competitors.', icon: Target, color: '#57ACAF', prompt: 'Compare our material and labor costs against industry benchmarks for similar garment types. Where are we competitive?' },
            ].map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <div key={idx} className="p-5 rounded-xl" style={{ background: `linear-gradient(to bottom right, ${card.color}1A, ${card.color}0D)`, border: `1px solid ${card.color}33` }}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${card.color}33` }}>
                      <IconComponent className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                    <div>
                      <h4 className="text-white mb-1 text-sm">{card.title}</h4>
                      <p className="text-xs text-[#6F83A7]">{card.desc}</p>
                    </div>
                  </div>
                  <MarbimAIButton
                    onClick={() => onAskMarbim(card.prompt)}
                    size="sm"
                    className="w-full"
                  >
                    {idx === 0 ? 'Fix Margins' : idx === 1 ? 'Predict Cost' : 'Benchmark'}
                  </MarbimAIButton>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'cost-sheet-list':
        return renderCostSheetList();
      case 'scenarios':
        return renderScenarios();
      case 'benchmarks':
        return renderBenchmarks();
      default:
        return renderDashboard();
    }
  };

  const getBreadcrumbs = () => {
    const baseBreadcrumbs = [
      { label: 'Production & Supply Chain' },
      { label: 'Costing' }
    ];

    const viewLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'cost-sheet-list': 'Cost Sheet List',
      'scenarios': 'Scenarios',
      'benchmarks': 'Benchmarks',
    };

    if (currentView !== 'dashboard') {
      baseBreadcrumbs.push({ label: viewLabels[currentView] });
    }

    return baseBreadcrumbs;
  };

  return (
    <>
      <PageLayout
        breadcrumbs={getBreadcrumbs()}
        aiInsightsCount={5}
      >
        {renderContent()}
      </PageLayout>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setDrawerData(null);
        }}
        data={drawerData}
        module="Costing Sheet"
        subPage={currentView}
      />

      {/* Setup Wizard */}
      {setupWizardOpen && (
        <CostingSetup
          onComplete={() => {
            setSetupWizardOpen(false);
            setShowSetupBanner(false);
            toast.success('Costing module activated!');
          }}
          onClose={() => setSetupWizardOpen(false)}
          onAskMarbim={onAskMarbim}
        />
      )}

      {/* Cost Sheet Detail Drawer */}
      <CostSheetDetailDrawer
        isOpen={costSheetDrawerOpen}
        onClose={() => {
          setCostSheetDrawerOpen(false);
          setSelectedCostSheet(null);
        }}
        costSheet={selectedCostSheet}
        onCostSheetUpdated={handleCostSheetUpdated}
        onAskMarbim={onAskMarbim}
      />

      {/* Create Cost Sheet Drawer */}
      <CreateCostSheetDrawer
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onCostSheetCreated={handleCostSheetCreated}
        onAskMarbim={onAskMarbim}
      />
    </>
  );
}
