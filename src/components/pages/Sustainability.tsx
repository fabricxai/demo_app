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
  Leaf, Droplets, Zap, Recycle, AlertTriangle, TrendingUp,
  ChevronDown, Plus, Download, Filter, Upload, Sparkles,
  Users, Shield, Award, FileText, QrCode, Package,
  BarChart3, Activity, Target, Calendar, Clock, CheckCircle,
  AlertCircle, Settings, Globe, Factory, Thermometer, Wind, Send
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
  LineChart as RechartsLine,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Dashboard Data
const dashboardSummary = [
  { label: 'CO₂e per piece', value: '2.8 kg', icon: Wind, color: '#57ACAF' },
  { label: 'Water Intensity', value: '45 L/kg', icon: Droplets, color: '#EAB308' },
  { label: 'Waste %', value: '8.5%', icon: Recycle, color: '#6F83A7' },
  { label: 'Open CAPAs', value: '3', icon: AlertTriangle, color: '#D0342C' },
];

const sustainabilityTrendsData = [
  { month: 'Jan', co2e: 3.2, water: 52, waste: 11.5, target_co2e: 3.0, target_water: 50, target_waste: 10 },
  { month: 'Feb', co2e: 3.1, water: 50, waste: 10.8, target_co2e: 3.0, target_water: 50, target_waste: 10 },
  { month: 'Mar', co2e: 2.9, water: 48, waste: 9.5, target_co2e: 3.0, target_water: 50, target_waste: 10 },
  { month: 'Apr', co2e: 2.8, water: 45, waste: 8.5, target_co2e: 3.0, target_water: 50, target_waste: 10 },
];

const yearOverYearData = [
  { metric: 'CO₂e', y2023: 3.5, y2024: 2.8 },
  { metric: 'Water', y2023: 58, y2024: 45 },
  { metric: 'Waste', y2023: 12.3, y2024: 8.5 },
  { metric: 'Energy', y2023: 0.32, y2024: 0.24 },
];

// Environmental Data
const energyData = [
  {
    id: 1,
    department: 'Cutting',
    kwhPerUnit: 0.15,
    energyIntensity: 0.18,
    renewablePercent: 15,
  },
  {
    id: 2,
    department: 'Sewing',
    kwhPerUnit: 0.22,
    energyIntensity: 0.28,
    renewablePercent: 15,
  },
  {
    id: 3,
    department: 'Dyeing',
    kwhPerUnit: 0.45,
    energyIntensity: 0.52,
    renewablePercent: 15,
  },
  {
    id: 4,
    department: 'Finishing',
    kwhPerUnit: 0.18,
    energyIntensity: 0.22,
    renewablePercent: 15,
  },
];

const waterData = [
  {
    id: 1,
    process: 'Dyeing',
    dailyUsage: 2500,
    weeklyUsage: 17500,
    threshold: 20000,
    status: 'Normal',
  },
  {
    id: 2,
    process: 'Washing',
    dailyUsage: 3200,
    weeklyUsage: 22400,
    threshold: 18000,
    status: 'High',
  },
  {
    id: 3,
    process: 'Canteen',
    dailyUsage: 450,
    weeklyUsage: 3150,
    threshold: 3500,
    status: 'Normal',
  },
];

const wasteData = [
  {
    id: 1,
    category: 'Fabric Offcuts',
    weight: 450,
    percentage: 45,
    recycled: 280,
  },
  {
    id: 2,
    category: 'Packaging',
    weight: 220,
    percentage: 22,
    recycled: 200,
  },
  {
    id: 3,
    category: 'Paper',
    weight: 180,
    percentage: 18,
    recycled: 170,
  },
  {
    id: 4,
    category: 'Plastic',
    weight: 150,
    percentage: 15,
    recycled: 90,
  },
];

// Social Data
const wagesHoursData = [
  {
    id: 1,
    line: 'Line 1',
    avgWage: 285,
    otHours: 45,
    compliance: 'Compliant',
  },
  {
    id: 2,
    line: 'Line 2',
    avgWage: 290,
    otHours: 52,
    compliance: 'Compliant',
  },
  {
    id: 3,
    line: 'Line 5',
    avgWage: 280,
    otHours: 62,
    compliance: 'At Risk',
  },
];

const grievancesData = [
  {
    id: 1,
    grievanceId: 'GRV-2024-1547',
    category: 'Wage Dispute',
    submittedDate: '2024-10-20',
    status: 'Resolved',
    resolutionTime: 6,
  },
  {
    id: 2,
    grievanceId: 'GRV-2024-1548',
    category: 'Safety Concern',
    submittedDate: '2024-10-22',
    status: 'In Progress',
    resolutionTime: 3,
  },
  {
    id: 3,
    grievanceId: 'GRV-2024-1549',
    category: 'Harassment',
    submittedDate: '2024-10-25',
    status: 'Pending',
    resolutionTime: 1,
  },
];

const safetyIncidentsData = [
  {
    id: 1,
    incidentId: 'INC-2024-0847',
    location: 'Pressing Section',
    type: 'Near-miss',
    date: '2024-10-24',
    severity: 'Low',
  },
  {
    id: 2,
    incidentId: 'INC-2024-0848',
    location: 'Cutting Department',
    type: 'Minor Injury',
    date: '2024-10-26',
    severity: 'Medium',
  },
];

// Governance Data
const complianceMetricsData = [
  {
    id: 1,
    standard: 'WRAP',
    department: 'All',
    compliance: 94,
    lastAudit: '2024-09-15',
    nextAudit: '2025-03-15',
  },
  {
    id: 2,
    standard: 'Sedex 6.1',
    department: 'All',
    compliance: 92,
    lastAudit: '2024-08-10',
    nextAudit: '2025-02-10',
  },
  {
    id: 3,
    standard: 'GOTS',
    department: 'Production',
    compliance: 88,
    lastAudit: '2024-07-20',
    nextAudit: '2025-01-20',
  },
];

const governanceScorecardData = [
  { category: 'Environmental', score: 88 },
  { category: 'Social', score: 92 },
  { category: 'Governance', score: 85 },
  { category: 'Ethics', score: 95 },
  { category: 'Transparency', score: 90 },
];

// Waste & Materials Data
const cuttingWasteData = [
  {
    id: 1,
    styleId: 'K103',
    cuttingYield: 82,
    wastePercent: 18,
    scrapWeight: 125,
  },
  {
    id: 2,
    styleId: 'K105',
    cuttingYield: 88,
    wastePercent: 12,
    scrapWeight: 85,
  },
  {
    id: 3,
    styleId: 'K108',
    cuttingYield: 85,
    wastePercent: 15,
    scrapWeight: 102,
  },
];

const sustainableMaterialsData = [
  {
    id: 1,
    material: 'Organic Cotton',
    usage: 2500,
    percentage: 35,
    co2eSaved: 450,
  },
  {
    id: 2,
    material: 'Recycled Polyester',
    usage: 1800,
    percentage: 25,
    co2eSaved: 320,
  },
  {
    id: 3,
    material: 'Conventional Cotton',
    usage: 2900,
    percentage: 40,
    co2eSaved: 0,
  },
];

// DPP Data
const traceabilityData = [
  {
    id: 1,
    orderId: 'ORD-1124',
    product: 'T-Shirt Basic',
    traceability: 92,
    missingLinks: 'Trim supplier cert',
  },
  {
    id: 2,
    orderId: 'ORD-1203',
    product: 'Denim Jeans',
    traceability: 88,
    missingLinks: 'Transport emissions',
  },
  {
    id: 3,
    orderId: 'ORD-K205',
    product: 'Polo Shirt',
    traceability: 96,
    missingLinks: 'None',
  },
];

interface SustainabilityProps {
  initialSubPage?: string;
  onAskMarbim?: (prompt: string) => void;
  onNavigateToPage?: (page: string) => void;
}

export function Sustainability({ initialSubPage = 'dashboard', onAskMarbim, onNavigateToPage }: SustainabilityProps) {
  const routeSubpage = useRouteSubpage('dashboard', initialSubPage);
  const [currentView, setCurrentView] = useState<string>(routeSubpage);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setCurrentView(routeSubpage);
  }, [routeSubpage]);

  // Energy Columns
  const energyColumns: Column[] = [
    { key: 'department', label: 'Department', sortable: true },
    {
      key: 'kwhPerUnit',
      label: 'kWh per Unit',
      sortable: true,
      render: (value) => <span className="text-white">{value.toFixed(2)}</span>,
    },
    {
      key: 'energyIntensity',
      label: 'Energy Intensity',
      sortable: true,
      render: (value) => <span className="text-[#EAB308]">{value.toFixed(2)}</span>,
    },
    {
      key: 'renewablePercent',
      label: 'Renewable %',
      sortable: true,
      render: (value) => <span className="text-[#57ACAF]">{value}%</span>,
    },
  ];

  // Water Columns
  const waterColumns: Column[] = [
    { key: 'process', label: 'Process', sortable: true },
    {
      key: 'dailyUsage',
      label: 'Daily Usage (L)',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'weeklyUsage',
      label: 'Weekly Usage (L)',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'threshold',
      label: 'Threshold (L)',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Normal': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'High': 'bg-[#D0342C]/10 text-[#D0342C]',
          'Critical': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Waste Columns
  const wasteColumns: Column[] = [
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'weight',
      label: 'Weight (kg)',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'percentage',
      label: 'Percentage',
      sortable: true,
      render: (value) => `${value}%`,
    },
    {
      key: 'recycled',
      label: 'Recycled (kg)',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
  ];

  // Wages & Hours Columns
  const wagesHoursColumns: Column[] = [
    { key: 'line', label: 'Line', sortable: true },
    {
      key: 'avgWage',
      label: 'Avg Wage ($)',
      sortable: true,
      render: (value) => `$${value}`,
    },
    {
      key: 'otHours',
      label: 'OT Hours',
      sortable: true,
      render: (value) => {
        const color = value > 60 ? 'text-[#D0342C]' : 'text-white';
        return <span className={color}>{value}h</span>;
      },
    },
    {
      key: 'compliance',
      label: 'Compliance',
      render: (value) => {
        const colors: any = {
          'Compliant': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'At Risk': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Grievances Columns
  const grievancesColumns: Column[] = [
    { key: 'grievanceId', label: 'Grievance ID', sortable: true },
    { key: 'category', label: 'Category' },
    { key: 'submittedDate', label: 'Submitted Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Pending': 'bg-[#EAB308]/10 text-[#EAB308]',
          'In Progress': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Resolved': 'bg-[#6F83A7]/10 text-[#6F83A7]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
    {
      key: 'resolutionTime',
      label: 'Days',
      sortable: true,
      render: (value) => `${value}d`,
    },
  ];

  // Safety Incidents Columns
  const safetyIncidentsColumns: Column[] = [
    { key: 'incidentId', label: 'Incident ID', sortable: true },
    { key: 'location', label: 'Location' },
    { key: 'type', label: 'Type' },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'severity',
      label: 'Severity',
      render: (value) => {
        const colors: any = {
          'Low': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Medium': 'bg-[#EAB308]/10 text-[#EAB308]',
          'High': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Compliance Metrics Columns
  const complianceMetricsColumns: Column[] = [
    { key: 'standard', label: 'Standard', sortable: true },
    { key: 'department', label: 'Department' },
    {
      key: 'compliance',
      label: 'Compliance %',
      sortable: true,
      render: (value) => {
        const color = value >= 90 ? 'text-[#57ACAF]' : value >= 80 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
    { key: 'lastAudit', label: 'Last Audit', sortable: true },
    { key: 'nextAudit', label: 'Next Audit', sortable: true },
  ];

  // Cutting Waste Columns
  const cuttingWasteColumns: Column[] = [
    { key: 'styleId', label: 'Style ID', sortable: true },
    {
      key: 'cuttingYield',
      label: 'Cutting Yield %',
      sortable: true,
      render: (value) => {
        const color = value >= 85 ? 'text-[#57ACAF]' : 'text-[#EAB308]';
        return <span className={color}>{value}%</span>;
      },
    },
    {
      key: 'wastePercent',
      label: 'Waste %',
      sortable: true,
      render: (value) => `${value}%`,
    },
    {
      key: 'scrapWeight',
      label: 'Scrap Weight (kg)',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
  ];

  // Sustainable Materials Columns
  const sustainableMaterialsColumns: Column[] = [
    { key: 'material', label: 'Material', sortable: true },
    {
      key: 'usage',
      label: 'Usage (kg)',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'percentage',
      label: 'Percentage',
      sortable: true,
      render: (value) => `${value}%`,
    },
    {
      key: 'co2eSaved',
      label: 'CO₂e Saved (kg)',
      sortable: true,
      render: (value) => <span className="text-[#57ACAF]">{value.toLocaleString()}</span>,
    },
  ];

  // Traceability Columns
  const traceabilityColumns: Column[] = [
    { key: 'orderId', label: 'Order ID', sortable: true },
    { key: 'product', label: 'Product' },
    {
      key: 'traceability',
      label: 'Traceability %',
      sortable: true,
      render: (value) => {
        const color = value >= 90 ? 'text-[#57ACAF]' : 'text-[#EAB308]';
        return <span className={color}>{value}%</span>;
      },
    },
    { key: 'missingLinks', label: 'Missing Links' },
  ];

  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    setDrawerOpen(true);
  };

  const renderDashboard = () => (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <KPICard
          title="CO₂e per piece"
          value="2.8 kg"
          change={-12.5}
          changeLabel="vs last month"
          icon={Wind}
          trend="up"
        />
        <KPICard
          title="Water Intensity"
          value="45 L/kg"
          change={-8.3}
          icon={Droplets}
          trend="up"
        />
        <KPICard
          title="Energy Intensity"
          value="0.24 kWh"
          change={-15.2}
          icon={Zap}
          trend="up"
        />
        <KPICard
          title="Waste %"
          value="8.5%"
          change={-18.5}
          changeLabel="reduction"
          icon={Recycle}
          trend="up"
        />
        <KPICard
          title="Open CAPAs"
          value="3"
          change={-50.0}
          icon={AlertTriangle}
          trend="up"
        />
        <KPICard
          title="ESG Audit Readiness"
          value="92%"
          change={5.2}
          icon={CheckCircle}
          trend="up"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardSummary.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div className="text-3xl" style={{ color: item.color }}>{item.value}</div>
              </div>
              <div className="text-[#6F83A7]">{item.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts and AI Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sustainability Trends */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white">Sustainability Trends vs Targets</h3>
            <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLine data={sustainabilityTrendsData}>
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
              <Line type="monotone" dataKey="co2e" stroke="#57ACAF" strokeWidth={2} name="CO₂e" />
              <Line type="monotone" dataKey="water" stroke="#EAB308" strokeWidth={2} name="Water" />
              <Line type="monotone" dataKey="waste" stroke="#6F83A7" strokeWidth={2} name="Waste" />
              <Line type="monotone" dataKey="target_co2e" stroke="#57ACAF" strokeWidth={1} strokeDasharray="5 5" name="Target CO₂e" />
            </RechartsLine>
          </ResponsiveContainer>
        </div>

        {/* AI Card */}
        <div className="space-y-4">
          <AICard
            title="MARBIM Sustainability Insights"
            marbimPrompt="Provide detailed sustainability intelligence including environmental impact analysis, resource tracking recommendations, and ESG report generation guidance."
            onAskMarbim={onAskMarbim}
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <Droplets className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Areas of biggest impact: dyeing process and fabric waste.</div>
                    <Button size="sm" onClick={() => toast.info('Opening impact analysis')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Analyze
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <Thermometer className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Recommend installing water flow meter on Line 3 for precise tracking.</div>
                    <Button size="sm" onClick={() => toast.success('Creating installation task')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Install
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-[#6F83A7] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Generate ESG report for Buyer ACME (Q4 2025) based on Sedex + WRAP.</div>
                    <Button size="sm" onClick={() => toast.success('Generating ESG report')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AICard>
        </div>
      </div>

      {/* Year-over-Year Improvement */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-white mb-6">Year-over-Year Improvement</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearOverYearData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="metric" stroke="#6F83A7" />
            <YAxis stroke="#6F83A7" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0D1117',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
            />
            <Bar dataKey="y2023" fill="#6F83A7" radius={[8, 8, 0, 0]} name="2023" />
            <Bar dataKey="y2024" fill="#57ACAF" radius={[8, 8, 0, 0]} name="2024" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );

  const renderEnvironmental = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Environmental Metrics</h2>
          <p className="text-sm text-[#6F83A7]">Track energy, water, and waste through IoT sensors</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Upload className="w-4 h-4 mr-2" />
            Upload ESG Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="energy" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="energy" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Zap className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Energy</span>
            </TabsTrigger>
            <TabsTrigger 
              value="water" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Droplets className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Water</span>
            </TabsTrigger>
            <TabsTrigger 
              value="waste" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Recycle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Waste</span>
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

        <TabsContent value="energy" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Energy Consumption by Department</h3>
            <SmartTable
              columns={energyColumns}
              data={energyData}
              searchPlaceholder="Search departments..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">AI Energy Optimization</div>
                  <div className="text-sm text-[#6F83A7]">
                    Boiler energy use 12% above baseline — recommend recalibration for optimal efficiency.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze energy consumption patterns across all facilities, identify equipment operating above baseline efficiency (especially boilers and high-energy systems), calculate potential savings from recalibration and optimization, and generate detailed recommendations for energy reduction strategies."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="water" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Water Usage Monitoring</h3>
            <SmartTable
              columns={waterColumns}
              data={waterData}
              searchPlaceholder="Search processes..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#D0342C]/10 border border-[#D0342C]/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#D0342C] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">High Water Usage Alert</div>
                  <div className="text-sm text-[#6F83A7]">
                    High water use detected in washing unit — possible valve leakage. Immediate inspection recommended.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze water consumption patterns across all production units, identify abnormal spikes or sustained high usage (especially in washing units), diagnose potential causes like valve leakage or process inefficiencies, and prioritize immediate inspection and maintenance actions with estimated water savings."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="waste" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Waste Tracking</h3>
            <SmartTable
              columns={wasteColumns}
              data={wasteData}
              searchPlaceholder="Search waste categories..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Recycle className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">AI Waste Reduction</div>
                  <div className="text-sm text-[#6F83A7]">
                    Fabric offcuts could be repurposed for accessories — potential saving of 3% waste.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze fabric waste patterns and offcut inventory across all production lines, identify repurposing opportunities for accessories or secondary products, calculate potential waste reduction percentages and cost savings, and recommend implementation strategies for circular manufacturing."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                  <div className="text-white">Energy Performance</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Energy intensity 0.24 kWh/unit — 8% better than last month and exceeding targets.
                </p>
                <Button variant="outline" className="w-full border-[#57ACAF]/30 text-[#57ACAF]">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>

              <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Target className="w-5 h-5 text-[#EAB308] flex-shrink-0" />
                  <div className="text-white">CO₂e Reduction Path</div>
                </div>
                <p className="text-sm text-[#6F83A7]">
                  Target CO₂e reduction achievable if dryer operation optimized by 10%.
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Environmental Impact</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={[
                  { metric: 'Energy', current: 88, target: 90 },
                  { metric: 'Water', current: 85, target: 90 },
                  { metric: 'Waste', current: 92, target: 90 },
                  { metric: 'Emissions', current: 87, target: 90 },
                  { metric: 'Recycling', current: 78, target: 90 },
                ]}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="metric" stroke="#6F83A7" />
                  <PolarRadiusAxis stroke="#6F83A7" />
                  <Radar name="Current" dataKey="current" stroke="#57ACAF" fill="#57ACAF" fillOpacity={0.6} />
                  <Radar name="Target" dataKey="target" stroke="#EAB308" fill="#EAB308" fillOpacity={0.3} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderSocial = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Social Compliance</h2>
          <p className="text-sm text-[#6F83A7]">Monitor workforce well-being, wages, and safety</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Plus className="w-4 h-4 mr-2" />
            Create CAPA
          </Button>
        </div>
      </div>

      <Tabs defaultValue="wages-hours" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="wages-hours" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Users className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Wages & Hours</span>
            </TabsTrigger>
            <TabsTrigger 
              value="grievances" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <AlertCircle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Grievances</span>
            </TabsTrigger>
            <TabsTrigger 
              value="safety-incidents" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Shield className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Safety & Incidents</span>
            </TabsTrigger>
            <TabsTrigger 
              value="training-welfare" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Award className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Training & Welfare</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="wages-hours" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Wages & Working Hours</h3>
            <SmartTable
              columns={wagesHoursColumns}
              data={wagesHoursData}
              searchPlaceholder="Search lines..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#D0342C]/10 border border-[#D0342C]/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#D0342C] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">Overtime Alert</div>
                  <div className="text-sm text-[#6F83A7]">
                    Line 5 exceeding 60-hour weekly limit — recommend shift rotation to ensure compliance.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze working hours across all production lines, identify teams exceeding 60-hour weekly limits or overtime compliance thresholds, recommend shift rotation strategies to balance workload, and suggest preventive measures to maintain labor compliance and worker wellbeing."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="grievances" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Resolved</div>
              <div className="text-3xl text-[#57ACAF]">1</div>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">In Progress</div>
              <div className="text-3xl text-[#EAB308]">1</div>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Pending</div>
              <div className="text-3xl text-white">1</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Grievance Tracker</h3>
            <SmartTable
              columns={grievancesColumns}
              data={grievancesData}
              searchPlaceholder="Search grievances..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">Resolution Time Improvement</div>
                  <div className="text-sm text-[#6F83A7]">
                    Average grievance resolution time reduced from 12 to 8 days this quarter.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze grievance resolution trends across all facilities and quarters, identify factors contributing to improved resolution times (from 12 to 8 days), benchmark against industry standards, and recommend best practices to maintain or further accelerate resolution efficiency."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="safety-incidents" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Safety Incidents Log</h3>
            <SmartTable
              columns={safetyIncidentsColumns}
              data={safetyIncidentsData}
              searchPlaceholder="Search incidents..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">AI Risk Prediction</div>
                  <div className="text-sm text-[#6F83A7]">
                    Accident risk higher near Pressing Section — increase inspection frequency.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze workplace safety data and accident patterns across all production areas, predict high-risk zones (especially Pressing Section and similar equipment), calculate risk scores based on historical incidents, and recommend targeted inspection schedules and preventive safety measures."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="training-welfare" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Training Completion Status</h3>
            <div className="space-y-4">
              {[
                { module: 'Health & Safety', completed: 95, total: 100 },
                { module: 'Fire Drill', completed: 88, total: 100 },
                { module: 'Ethics & Conduct', completed: 100, total: 100 },
              ].map((training, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white">{training.module}</span>
                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF]">
                      {training.completed}/{training.total}
                    </Badge>
                  </div>
                  <Progress value={(training.completed / training.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">Training Recommendation</div>
                <div className="text-sm text-[#6F83A7]">
                  95% workers completed H&S module — remaining 5% scheduled for retraining.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderGovernance = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Governance & Ethics</h2>
          <p className="text-sm text-[#6F83A7]">Track ethical, legal, and policy adherence</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Download className="w-4 h-4 mr-2" />
            Run Emission Audit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="compliance-metrics" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-3 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="compliance-metrics" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <CheckCircle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Compliance Metrics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ethics-conduct" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Shield className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Ethics & Conduct</span>
            </TabsTrigger>
            <TabsTrigger 
              value="governance-scorecard" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Award className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Governance Scorecard</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="compliance-metrics" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Compliance Status</h3>
            <SmartTable
              columns={complianceMetricsColumns}
              data={complianceMetricsData}
              searchPlaceholder="Search standards..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">Upcoming Audit</div>
                  <div className="text-sm text-[#6F83A7]">
                    Next WRAP audit due in 23 days — draft checklist prepared by MARBIM.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Review the complete WRAP audit checklist and current compliance status, identify any gaps or areas requiring immediate attention before the audit in 23 days, generate a prioritized action plan with timelines, and recommend documentation and evidence preparation strategies to ensure audit readiness."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ethics-conduct" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Acknowledged</div>
              <div className="text-3xl text-[#57ACAF]">98%</div>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Pending Sign-off</div>
              <div className="text-3xl text-[#EAB308]">2%</div>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Violations</div>
              <div className="text-3xl text-white">0</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Policy Acknowledgment Status</h3>
            <div className="space-y-3">
              {[
                { policy: 'Code of Conduct', acknowledged: 100, pending: 0 },
                { policy: 'Anti-Harassment Policy', acknowledged: 98, pending: 2 },
                { policy: 'Data Privacy Policy', acknowledged: 95, pending: 5 },
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">{item.policy}</span>
                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF]">
                      {item.acknowledged}% Complete
                    </Badge>
                  </div>
                  <Progress value={item.acknowledged} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">AI Policy Tracking</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM flags missing sign-offs and tracks acknowledgment automatically.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze all sustainability and compliance policies requiring employee acknowledgment, identify missing sign-offs and unacknowledged documents across all departments, track acknowledgment rates and trends, send automated reminders to pending employees, and generate a compliance dashboard showing policy coverage and gaps."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="governance-scorecard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-6">ESG Readiness Index</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={governanceScorecardData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="category" stroke="#6F83A7" />
                  <PolarRadiusAxis stroke="#6F83A7" />
                  <Radar name="Score" dataKey="score" stroke="#57ACAF" fill="#57ACAF" fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {governanceScorecardData.map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">{item.category}</span>
                    <span className="text-[#57ACAF]">{item.score}%</span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">AI Benchmarking</div>
                  <div className="text-sm text-[#6F83A7]">
                    Factory 94% aligned with Sedex 6.1. Benchmarked against Higg Index and CSRD standards.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Conduct comprehensive benchmarking analysis comparing factory performance (currently 94% aligned with Sedex 6.1) against multiple sustainability frameworks including Higg Index, CSRD standards, and industry peers. Identify specific gaps preventing 100% alignment, recommend targeted improvement initiatives, and generate a roadmap to achieve excellence across all benchmarking criteria."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderWasteMaterials = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Waste & Materials</h2>
          <p className="text-sm text-[#6F83A7]">Manage cutting waste, recycling, and sustainable materials</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Upload className="w-4 h-4 mr-2" />
            Upload Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="cutting-waste" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="cutting-waste" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Recycle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Cutting Waste</span>
            </TabsTrigger>
            <TabsTrigger 
              value="recycling-reuse" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Leaf className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Recycling & Reuse</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sustainable-materials" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Globe className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Sustainable Materials</span>
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

        <TabsContent value="cutting-waste" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Cutting Waste Analysis</h3>
            <SmartTable
              columns={cuttingWasteColumns}
              data={cuttingWasteData}
              searchPlaceholder="Search styles..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">Cutting Efficiency Alert</div>
                  <div className="text-sm text-[#6F83A7]">
                    Cutting efficiency for Style K103 dropped 4% — check marker layout optimization.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze cutting efficiency trends for Style K103 and identify root causes for the 4% drop. Review current marker layout configurations, compare with historical optimal layouts, calculate fabric utilization rates, and recommend marker layout optimizations to restore efficiency and minimize fabric waste."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recycling-reuse" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Recycled (kg)</div>
              <div className="text-3xl text-[#57ACAF]">740</div>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Recycling Rate</div>
              <div className="text-3xl text-[#EAB308]">74%</div>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Vendor Partners</div>
              <div className="text-3xl text-white">3</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Recycling Program Status</h3>
            <div className="space-y-3">
              {[
                { category: 'Fabric Offcuts', recycled: 280, total: 450, vendor: 'EcoRecycle Ltd' },
                { category: 'Packaging', recycled: 200, total: 220, vendor: 'GreenCycle Inc' },
                { category: 'Paper', recycled: 170, total: 180, vendor: 'RecyclePro' },
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">{item.category}</span>
                    <span className="text-sm text-[#6F83A7]">{item.vendor}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#6F83A7]">{item.recycled} / {item.total} kg</span>
                    <span className="text-[#57ACAF]">{((item.recycled / item.total) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(item.recycled / item.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">AI Recycling Suggestion</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM suggests partnership with certified recycling vendor for 15% cost reduction.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Research and evaluate certified recycling vendors for textile waste management, analyze potential cost savings (targeting 15% reduction), compare vendor capabilities and certifications, calculate ROI and environmental impact, and generate a partnership proposal with implementation timeline and contract terms."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sustainable-materials" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Sustainable Materials Usage</h3>
            <SmartTable
              columns={sustainableMaterialsColumns}
              data={sustainableMaterialsData}
              searchPlaceholder="Search materials..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">AI Material Substitution</div>
                  <div className="text-sm text-[#6F83A7]">
                    Switching 20% of cotton to recycled cotton reduces CO₂e by 5.2% — Supplier X offers 8% cheaper alternative.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze material substitution opportunities across all products, evaluate switching 20% of cotton to recycled cotton alternatives, calculate environmental impact (CO₂e reduction of 5.2%), compare supplier pricing (Supplier X 8% cheaper), assess quality and certification standards, and generate a phased implementation plan with cost-benefit analysis."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                  <div className="text-white">Waste Reduction</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Overall cutting waste decreased by 7% MoM through optimized marker layouts.
                </p>
                <Button variant="outline" className="w-full border-[#57ACAF]/30 text-[#57ACAF]">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analysis
                </Button>
              </div>

              <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Package className="w-5 h-5 text-[#EAB308] flex-shrink-0" />
                  <div className="text-white">Material Efficiency</div>
                </div>
                <p className="text-sm text-[#6F83A7]">
                  Sustainable materials now account for 60% of total usage, up from 45% last quarter.
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Waste Reduction Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={[
                  { month: 'Jan', waste: 11.5 },
                  { month: 'Feb', waste: 10.8 },
                  { month: 'Mar', waste: 9.5 },
                  { month: 'Apr', waste: 8.5 },
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
                  />
                  <Area type="monotone" dataKey="waste" stroke="#57ACAF" fill="#57ACAF" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderFootprintDPP = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Footprint & DPP</h2>
          <p className="text-sm text-[#6F83A7]">Product-level sustainability footprint and Digital Product Passport</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <QrCode className="w-4 h-4 mr-2" />
            Generate DPP
          </Button>
        </div>
      </div>

      <Tabs defaultValue="footprint-calculator" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="footprint-calculator" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Activity className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Footprint Calculator</span>
            </TabsTrigger>
            <TabsTrigger 
              value="traceability" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Target className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Traceability</span>
            </TabsTrigger>
            <TabsTrigger 
              value="dpp-generator" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <QrCode className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">DPP Generator</span>
            </TabsTrigger>
            <TabsTrigger 
              value="buyer-packs" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <FileText className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Buyer Packs</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="footprint-calculator" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">CO₂e per piece</div>
              <div className="text-3xl text-white">2.8 kg</div>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Energy Intensity</div>
              <div className="text-3xl text-white">0.24 kWh</div>
            </div>
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Water Footprint</div>
              <div className="text-3xl text-white">45 L</div>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Transport CO₂e</div>
              <div className="text-3xl text-white">0.5 kg</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Footprint Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { stage: 'Material', co2e: 1.2 },
                { stage: 'Energy', co2e: 0.8 },
                { stage: 'Water', co2e: 0.3 },
                { stage: 'Transport', co2e: 0.5 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="stage" stroke="#6F83A7" />
                <YAxis stroke="#6F83A7" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1117',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="co2e" fill="#57ACAF" radius={[8, 8, 0, 0]} name="CO₂e (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">AI Data Auto-fill</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM auto-fills data from BOM, IoT sensors, and inventory modules for accurate calculations.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Configure automated data integration for footprint and DPP calculations by connecting BOM data, IoT sensor readings, and inventory module information. Verify data accuracy, identify gaps or inconsistencies, set up validation rules, and generate a comprehensive data quality report with recommendations for improving calculation accuracy."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="traceability" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Product Traceability</h3>
            <SmartTable
              columns={traceabilityColumns}
              data={traceabilityData}
              searchPlaceholder="Search products..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">AI Data Integrity Check</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM verifies data integrity and flags missing traceability links automatically.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Run comprehensive data integrity verification across all footprint and DPP records. Identify missing traceability links, validate data completeness, check for inconsistencies between modules, flag potential errors or anomalies, and generate a detailed integrity report with prioritized remediation steps and data quality scores."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dpp-generator" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">DPPs Generated</div>
              <div className="text-3xl text-white">128</div>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">ESPR Compliant</div>
              <div className="text-3xl text-[#57ACAF]">100%</div>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Avg Generation Time</div>
              <div className="text-3xl text-white">2.5 min</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Generate New DPP</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#6F83A7] mb-2 block">Select Product</label>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  ORD-K205 - Polo Shirt
                </div>
              </div>
              <div>
                <label className="text-sm text-[#6F83A7] mb-2 block">Compliance Framework</label>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  EU ESPR + GS1
                </div>
              </div>
              <Button className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                <QrCode className="w-4 h-4 mr-2" />
                Generate DPP with QR Code
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <QrCode className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="flex-1">
                  <div className="text-white mb-1">AI DPP Compliance</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM ensures compliance with EU ESPR and buyer-specific DPP schema automatically.
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Validate Digital Product Passport (DPP) compliance with EU ESPR requirements and buyer-specific schema standards. Review all DPP data fields for completeness, verify mandatory information, check schema validation rules, identify non-compliance issues, and generate a compliance audit report with recommendations for meeting regulatory and buyer requirements."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="buyer-packs" className="space-y-6">
          <div className="space-y-4">
            {[
              { buyer: 'ACME Corp', standard: 'GOTS + WRAP', status: 'Ready', generated: '2024-10-25' },
              { buyer: 'TrendWear', standard: 'Sedex 6.1', status: 'In Progress', generated: '-' },
              { buyer: 'Fashion Global', standard: 'Higg Index', status: 'Ready', generated: '2024-10-24' },
            ].map((pack, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white">{pack.buyer}</div>
                  <Badge className={pack.status === 'Ready' ? 'bg-[#57ACAF]/10 text-[#57ACAF]' : 'bg-[#EAB308]/10 text-[#EAB308]'}>
                    {pack.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-[#6F83A7]">Standard: {pack.standard}</span>
                  <span className="text-[#6F83A7]">Generated: {pack.generated}</span>
                </div>
                {pack.status === 'Ready' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-white/10">
                      <Download className="w-3 h-3 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" className="flex-1 bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                      <Send className="w-3 h-3 mr-2" />
                      Notify Buyer
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Pack Compilation</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM auto-compiles GOTS/WRAP reports with certificates, BOM, and footprint data for selected buyers.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'environmental':
        return renderEnvironmental();
      case 'social':
        return renderSocial();
      case 'governance':
        return renderGovernance();
      case 'waste-materials':
        return renderWasteMaterials();
      case 'footprint-dpp':
        return renderFootprintDPP();
      default:
        return renderDashboard();
    }
  };

  const getBreadcrumbs = () => {
    const baseBreadcrumbs = [
      { label: 'Compliance & Operations' },
      { label: 'Sustainability' }
    ];

    const viewLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'environmental': 'Environmental',
      'social': 'Social',
      'governance': 'Governance',
      'waste-materials': 'Waste & Materials',
      'footprint-dpp': 'Footprint & DPP',
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
        aiInsightsCount={6}
      >
        {renderContent()}
      </PageLayout>

      {/* Detail Drawer */}
      <DetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedRecord?.department || selectedRecord?.process || selectedRecord?.category || 'Details'}
        recordId={selectedRecord?.id}
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="space-y-3">
              {selectedRecord && Object.entries(selectedRecord).slice(0, 8).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#6F83A7] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-white">{String(value)}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4 mt-6">
            <div className="space-y-3">
              {[
                { metric: 'Energy Efficiency', value: '88%', trend: '+5%' },
                { metric: 'Water Conservation', value: '92%', trend: '+8%' },
                { metric: 'Waste Reduction', value: '85%', trend: '+12%' },
              ].map((item, index) => (
                <div key={index} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">{item.metric}</span>
                    <span className="text-[#57ACAF]">{item.trend}</span>
                  </div>
                  <div className="text-2xl text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4 mt-6">
            <div className="space-y-3">
              {[
                { standard: 'WRAP', compliance: 94, status: 'Compliant' },
                { standard: 'GOTS', compliance: 88, status: 'Compliant' },
                { standard: 'Sedex', compliance: 92, status: 'Compliant' },
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">{item.standard}</span>
                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF]">{item.status}</Badge>
                  </div>
                  <Progress value={item.compliance} className="h-2 mb-2" />
                  <div className="text-xs text-[#6F83A7]">{item.compliance}% Compliant</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-4 mt-6">
            <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
              <div className="text-white mb-2">Performance Analysis</div>
              <div className="text-sm text-[#6F83A7] mb-3">
                Operating 8% above efficiency target with consistent improvement trend.
              </div>
              <div className="flex items-center gap-3">
                <Progress value={88} className="flex-1 h-2" />
                <span className="text-[#57ACAF]">88%</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-white mb-2">Recommendation</div>
              <div className="text-sm text-[#6F83A7]">
                Continue current practices and consider sharing best practices across other departments.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
              <div className="text-white mb-2">Next Steps</div>
              <div className="text-sm text-[#6F83A7] mb-3">
                Install additional IoT sensors for real-time monitoring and optimization.
              </div>
              <Button size="sm" className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                Create Task
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DetailDrawer>
    </>
  );
}
