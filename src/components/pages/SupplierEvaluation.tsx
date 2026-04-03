import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { MarbimAIButton } from '../MarbimAIButton';
import { ModuleSetupBanner } from '../ModuleSetupBanner';
import { SupplierDetailDrawer } from '../SupplierDetailDrawer';
import { SampleDetailDrawer } from '../SampleDetailDrawer';
import { SupplierRFQDetailDrawer } from '../SupplierRFQDetailDrawer';
import { BroadcastRFQDrawer } from '../BroadcastRFQDrawer';
import { QuoteComparisonDrawer } from '../QuoteComparisonDrawer';
import { AwardedRFQDetailDrawer } from '../AwardedRFQDetailDrawer';
import { RequestSampleDrawer } from '../RequestSampleDrawer';
import { AddSupplierDrawer } from '../AddSupplierDrawer';
import { SupplierEvaluationSetup } from './SupplierEvaluationSetup';
import { WorkflowStepper } from '../WorkflowStepper';
import { 
  Package, Clock, CheckCircle, AlertTriangle, FileText, TrendingUp,
  ChevronDown, Plus, Download, Filter, Upload, Sparkles,
  Edit, Users, Award, Activity, BarChart3, Shield,
  RefreshCw, Settings, Eye, Zap, BookOpen, Clipboard,
  Target, DollarSign, Truck, Send, MessageSquare, Star,
  MapPin, Globe, Calendar, XCircle, AlertCircle, ArrowUpRight, ArrowDownRight
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
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';

// Dashboard Data
const dashboardSummary = [
  { label: 'Active Suppliers', value: 48, icon: Users, color: '#57ACAF' },
  { label: 'Average Lead Time', value: '18d', icon: Clock, color: '#EAB308' },
  { label: 'Quality Score', value: '92%', icon: Award, color: '#57ACAF' },
  { label: 'Compliance Rate', value: '96%', icon: Shield, color: '#6F83A7' },
];

const spendBySupplierData = [
  { supplier: 'KnitTex', spend: 245000, color: '#57ACAF' },
  { supplier: 'GlobalFabrics', spend: 180000, color: '#EAB308' },
  { supplier: 'YarnPro', spend: 120000, color: '#6F83A7' },
  { supplier: 'TrimWorks', spend: 95000, color: '#9333EA' },
  { supplier: 'Others', spend: 160000, color: '#D0342C' },
];

const deliveryPerformanceData = [
  { month: 'Jun', onTime: 88, late: 12 },
  { month: 'Jul', onTime: 92, late: 8 },
  { month: 'Aug', onTime: 90, late: 10 },
  { month: 'Sep', onTime: 94, late: 6 },
  { month: 'Oct', onTime: 96, late: 4 },
];

const riskHeatmapData = [
  { supplier: 'KnitTex', quality: 95, delivery: 96, risk: 5 },
  { supplier: 'GlobalFabrics', quality: 92, delivery: 94, risk: 8 },
  { supplier: 'YarnPro', quality: 78, delivery: 72, risk: 35 },
  { supplier: 'ABC Trims', quality: 68, delivery: 65, risk: 48 },
];

// Supplier Directory Data
const allSuppliersData = [
  {
    id: 1,
    supplierName: 'KnitTex',
    category: 'Fabric',
    country: 'India',
    onTimeDelivery: 96,
    qualityScore: 95,
    leadTime: 14,
    complianceStatus: 'Certified',
    riskLevel: 'Low',
  },
  {
    id: 2,
    supplierName: 'GlobalFabrics',
    category: 'Fabric',
    country: 'Bangladesh',
    onTimeDelivery: 94,
    qualityScore: 92,
    leadTime: 18,
    complianceStatus: 'Certified',
    riskLevel: 'Low',
  },
  {
    id: 3,
    supplierName: 'YarnPro',
    category: 'Yarn',
    country: 'Pakistan',
    onTimeDelivery: 72,
    qualityScore: 78,
    leadTime: 28,
    complianceStatus: 'Pending Renewal',
    riskLevel: 'High',
  },
  {
    id: 4,
    supplierName: 'ABC Trims',
    category: 'Trims',
    country: 'China',
    onTimeDelivery: 65,
    qualityScore: 68,
    leadTime: 35,
    complianceStatus: 'Expired',
    riskLevel: 'High',
  },
  {
    id: 5,
    supplierName: 'TrimWorks',
    category: 'Trims',
    country: 'Vietnam',
    onTimeDelivery: 88,
    qualityScore: 85,
    leadTime: 20,
    complianceStatus: 'Certified',
    riskLevel: 'Medium',
  },
];

const certifiedSuppliersData = allSuppliersData.filter(s => s.complianceStatus === 'Certified');
const watchlistData = allSuppliersData.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Medium');
const blacklistData = [
  {
    id: 1,
    supplierName: 'BadQuality Co',
    category: 'Fabric',
    reason: 'Repeated quality failures',
    dateListed: '2024-08-15',
    evidence: 'QC Reports #45, #52, #58',
  },
];

// RFQ Board Data
const openRFQsData = [
  {
    id: 1,
    rfqId: 'RFQ-2024-5847',
    material: 'Cotton Fabric 200 GSM',
    quantity: 5000,
    buyersLinked: 'H&M',
    sentDate: '2024-10-25',
    status: 'Open',
  },
  {
    id: 2,
    rfqId: 'RFQ-2024-5848',
    material: 'Denim Fabric',
    quantity: 8000,
    buyersLinked: 'Zara',
    sentDate: '2024-10-24',
    status: 'Quotes Received',
  },
];

const awaitingQuotesData = [
  {
    id: 1,
    rfqId: 'RFQ-2024-5847',
    supplier: 'YarnPro',
    sentDate: '2024-10-25',
    dueDate: '2024-10-28',
    status: 'Pending',
  },
  {
    id: 2,
    rfqId: 'RFQ-2024-5847',
    supplier: 'GlobalFabrics',
    sentDate: '2024-10-25',
    dueDate: '2024-10-28',
    status: 'Overdue',
  },
];

const quoteComparisonData = [
  {
    id: 1,
    supplier: 'KnitTex',
    price: 5.80,
    moq: 1000,
    leadTime: 14,
    paymentTerms: 'Net 30',
    score: 95,
  },
  {
    id: 2,
    supplier: 'GlobalFabrics',
    price: 5.50,
    moq: 1500,
    leadTime: 18,
    paymentTerms: 'Net 45',
    score: 92,
  },
  {
    id: 3,
    supplier: 'YarnPro',
    price: 6.20,
    moq: 800,
    leadTime: 28,
    paymentTerms: 'Net 30',
    score: 75,
  },
];

// Detailed Quote Data for Comparison Drawer
const detailedQuotesData = [
  {
    id: '1',
    supplier: 'KnitTex',
    totalPrice: 29000,
    unitPrice: 5.80,
    leadTime: '14',
    qualityScore: 92,
    complianceScore: 95,
    sustainabilityScore: 88,
    paymentTerms: 'Net 30',
    warranty: '12 months',
    certifications: ['ISO 9001', 'GOTS', 'OEKO-TEX'],
    minimumOrder: 1000,
    location: 'Bangladesh',
    responseTime: '18h',
    aiScore: 95,
  },
  {
    id: '2',
    supplier: 'GlobalFabrics',
    totalPrice: 27500,
    unitPrice: 5.50,
    leadTime: '18',
    qualityScore: 89,
    complianceScore: 92,
    sustainabilityScore: 85,
    paymentTerms: 'Net 45',
    warranty: '6 months',
    certifications: ['ISO 9001', 'BSCI'],
    minimumOrder: 1500,
    location: 'India',
    responseTime: '24h',
    aiScore: 92,
  },
  {
    id: '3',
    supplier: 'YarnPro',
    totalPrice: 31000,
    unitPrice: 6.20,
    leadTime: '28',
    qualityScore: 78,
    complianceScore: 80,
    sustainabilityScore: 70,
    paymentTerms: 'Net 30',
    warranty: '3 months',
    certifications: ['ISO 9001'],
    minimumOrder: 800,
    location: 'Pakistan',
    responseTime: '36h',
    aiScore: 75,
  },
];

// Awarded RFQ Data
const awardedRFQData = {
  rfqId: 'RFQ-2024-5845',
  supplier: 'KnitTex',
  awardedDate: '2024-10-20',
  totalAmount: 29000,
  poNumber: 'PO-2024-1542',
  poStatus: 'Active',
  deliveryDate: '2024-11-15',
  deliveryStatus: 'On Track',
  paymentTerms: 'Net 30',
  items: [
    {
      description: 'Cotton Fabric 200 GSM - Navy Blue',
      quantity: 3000,
      unitPrice: 5.80,
      total: 17400,
    },
    {
      description: 'Cotton Fabric 200 GSM - White',
      quantity: 2000,
      unitPrice: 5.80,
      total: 11600,
    },
  ],
  contractTerms: {
    warranty: '12 months manufacturer warranty covering defects in materials and workmanship',
    qualityStandards: 'ISO 9001:2015 certified quality management. GOTS certified organic cotton. AQL 2.5 inspection standards.',
    deliveryTerms: 'FOB Chittagong Port. Partial shipments allowed. Delivery schedule: 50% at 2 weeks, remaining 50% at 4 weeks.',
    penalties: 'Late delivery penalty: 2% of order value per week up to maximum 10%. Quality defects beyond AQL: full replacement or credit.',
  },
  justification: {
    priceScore: 88,
    qualityScore: 92,
    deliveryScore: 95,
    overallScore: 95,
    reason: 'KnitTex offered the best overall value with competitive pricing, excellent quality certifications (GOTS, ISO 9001), and fastest delivery time of 14 days. Strong sustainability credentials and proven track record with 95% on-time delivery rate.',
  },
  contactPerson: {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@knittex.com',
    phone: '+880-1234-567890',
  },
  timeline: [
    {
      date: '2024-10-20',
      event: 'RFQ Awarded & PO Generated',
      status: 'completed' as const,
    },
    {
      date: '2024-10-22',
      event: 'Contract Signed & Production Started',
      status: 'completed' as const,
    },
    {
      date: '2024-10-28',
      event: 'Quality Inspection Scheduled',
      status: 'in-progress' as const,
    },
    {
      date: '2024-11-05',
      event: 'First Shipment (50%)',
      status: 'pending' as const,
    },
    {
      date: '2024-11-15',
      event: 'Final Delivery',
      status: 'pending' as const,
    },
  ],
};

// Samples Data
const sampleRequestsData = [
  {
    id: 1,
    sampleId: 'SMP-2024-1247',
    supplier: 'KnitTex',
    material: 'Cotton Jersey',
    requestedBy: 'Sarah M.',
    date: '2024-10-20',
    status: 'Received',
  },
  {
    id: 2,
    sampleId: 'SMP-2024-1248',
    supplier: 'GlobalFabrics',
    material: 'Denim',
    requestedBy: 'John D.',
    date: '2024-10-22',
    status: 'In Transit',
  },
  {
    id: 3,
    sampleId: 'SMP-2024-1249',
    supplier: 'YarnPro',
    material: 'Yarn - 30s',
    requestedBy: 'Lisa K.',
    date: '2024-10-24',
    status: 'Requested',
  },
];

const inTransitData = sampleRequestsData.filter(s => s.status === 'In Transit');
const receivedData = sampleRequestsData.filter(s => s.status === 'Received');

interface SupplierEvaluationProps {
  initialSubPage?: string;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
  onNavigateToPage?: (page: string) => void;
  isAIPanelOpen?: boolean;
}

export function SupplierEvaluation({ initialSubPage = 'dashboard', onAskMarbim, onOpenAI, onNavigateToPage, isAIPanelOpen }: SupplierEvaluationProps) {
  const routeSubpage = useRouteSubpage('dashboard', initialSubPage);
  const [currentView, setCurrentView] = useState<string>(routeSubpage);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [supplierDrawerOpen, setSupplierDrawerOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [sampleDrawerOpen, setSampleDrawerOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<any>(null);
  const [rfqDrawerOpen, setRfqDrawerOpen] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<any>(null);
  const [broadcastDrawerOpen, setBroadcastDrawerOpen] = useState(false);
  const [quoteComparisonDrawerOpen, setQuoteComparisonDrawerOpen] = useState(false);
  const [awardedRFQDrawerOpen, setAwardedRFQDrawerOpen] = useState(false);
  const [selectedAwardedRFQ, setSelectedAwardedRFQ] = useState<any>(null);
  const [requestSampleDrawerOpen, setRequestSampleDrawerOpen] = useState(false);
  const [addSupplierDrawerOpen, setAddSupplierDrawerOpen] = useState(false);
  const [setupWizardOpen, setSetupWizardOpen] = useState(false);
  const [showSetupBanner, setShowSetupBanner] = useState(true);

  useEffect(() => {
    setCurrentView(routeSubpage);
  }, [routeSubpage]);

  // Close all drawers when AI panel opens
  useEffect(() => {
    if (isAIPanelOpen) {
      setSupplierDrawerOpen(false);
      setSampleDrawerOpen(false);
      setRfqDrawerOpen(false);
      setBroadcastDrawerOpen(false);
      setRequestSampleDrawerOpen(false);
      setAddSupplierDrawerOpen(false);
      setSetupWizardOpen(false);
    }
  }, [isAIPanelOpen]);

  // All Suppliers Columns
  const allSuppliersColumns: Column[] = [
    { key: 'supplierName', label: 'Supplier Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'country', label: 'Country' },
    {
      key: 'onTimeDelivery',
      label: 'On-Time %',
      sortable: true,
      render: (value) => {
        const color = value >= 90 ? 'text-[#57ACAF]' : value >= 70 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
    {
      key: 'qualityScore',
      label: 'Quality Score',
      sortable: true,
      render: (value) => {
        const color = value >= 90 ? 'text-[#57ACAF]' : value >= 70 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}</span>;
      },
    },
    { key: 'leadTime', label: 'Lead Time', sortable: true, render: (value) => `${value} days` },
    {
      key: 'complianceStatus',
      label: 'Compliance',
      render: (value) => {
        const colors: any = {
          'Certified': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Pending Renewal': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Expired': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
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

  // Blacklist Columns
  const blacklistColumns: Column[] = [
    { key: 'supplierName', label: 'Supplier Name', sortable: true },
    { key: 'category', label: 'Category' },
    { key: 'reason', label: 'Reason' },
    { key: 'dateListed', label: 'Date Listed', sortable: true },
    { key: 'evidence', label: 'Evidence' },
  ];

  // Open RFQs Columns
  const openRFQsColumns: Column[] = [
    { key: 'rfqId', label: 'RFQ ID', sortable: true },
    { key: 'material', label: 'Material' },
    { key: 'quantity', label: 'Quantity', sortable: true, render: (value) => value.toLocaleString() },
    { key: 'buyersLinked', label: 'Buyers Linked' },
    { key: 'sentDate', label: 'Sent Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Open': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Quotes Received': 'bg-[#57ACAF]/10 text-[#57ACAF]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Quote Comparison Columns
  const quoteComparisonColumns: Column[] = [
    { key: 'supplier', label: 'Supplier', sortable: true },
    { key: 'price', label: 'Price', sortable: true, render: (value) => `$${value}` },
    { key: 'moq', label: 'MOQ', sortable: true, render: (value) => value.toLocaleString() },
    { key: 'leadTime', label: 'Lead Time', sortable: true, render: (value) => `${value} days` },
    { key: 'paymentTerms', label: 'Payment Terms' },
    {
      key: 'score',
      label: 'AI Score',
      sortable: true,
      render: (value) => {
        const color = value >= 90 ? 'text-[#57ACAF]' : value >= 75 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}</span>;
      },
    },
  ];

  // Sample Requests Columns
  const sampleRequestsColumns: Column[] = [
    { key: 'sampleId', label: 'Sample ID', sortable: true },
    { key: 'supplier', label: 'Supplier' },
    { key: 'material', label: 'Material' },
    { key: 'requestedBy', label: 'Requested By' },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Requested': 'bg-[#EAB308]/10 text-[#EAB308]',
          'In Transit': 'bg-[#6F83A7]/10 text-[#6F83A7]',
          'Received': 'bg-[#57ACAF]/10 text-[#57ACAF]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    
    // Check if this is an RFQ record
    if (record.rfqId) {
      // Enrich RFQ data with additional fields for the drawer
      const enrichedRFQ = {
        ...record,
        buyer: record.buyersLinked || record.buyer || 'TrendWear UK',
        dateReceived: record.sentDate || '2024-10-25',
        deadline: record.dueDate || '2024-11-15',
        timeLeft: '5 days',
        items: record.quantity ? `${record.quantity} yards` : '5,000 yards',
        estimatedValue: '$32,600',
        leadTime: '30 days',
        priority: 'High',
      };
      setSelectedRFQ(enrichedRFQ);
      setRfqDrawerOpen(true);
    } else if (record.sampleId) {
      // This is a sample record
      setSelectedSample(record);
      setSampleDrawerOpen(true);
    } else if (record.supplierName) {
      // This is a supplier record
      setSelectedSupplier(record);
      setSupplierDrawerOpen(true);
    }
  };

  const renderDashboard = () => (
    <>
      {/* Hero Section with Key Metrics */}
      <div className="relative bg-gradient-to-br from-[#57ACAF]/10 via-transparent to-[#EAB308]/10 border border-white/10 rounded-2xl p-8 mb-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl text-white mb-1">Supplier Network Overview</h2>
                  <p className="text-sm text-[#6F83A7]">Real-time performance metrics across your supplier ecosystem</p>
                </div>
              </div>
              
              {/* Quick Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Total Network</div>
                  <div className="text-2xl text-white mb-1">48</div>
                  <div className="flex items-center gap-1 text-xs text-[#57ACAF]">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+4 this quarter</span>
                  </div>
                </div>
                <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Total Spend</div>
                  <div className="text-2xl text-white mb-1">$800K</div>
                  <div className="flex items-center gap-1 text-xs text-[#EAB308]">
                    <TrendingUp className="w-3 h-3" />
                    <span>Q4 2024</span>
                  </div>
                </div>
                <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Certifications</div>
                  <div className="text-2xl text-white mb-1">38</div>
                  <div className="flex items-center gap-1 text-xs text-[#57ACAF]">
                    <Shield className="w-3 h-3" />
                    <span>79% coverage</span>
                  </div>
                </div>
                <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Active RFQs</div>
                  <div className="text-2xl text-white mb-1">12</div>
                  <div className="flex items-center gap-1 text-xs text-[#6F83A7]">
                    <FileText className="w-3 h-3" />
                    <span>In progress</span>
                  </div>
                </div>
              </div>
            </div>
            
            <MarbimAIButton
              onClick={() => {
                if (onAskMarbim) {
                  onAskMarbim('Provide comprehensive supplier network intelligence including performance rankings, risk analysis, spend optimization opportunities, and strategic recommendations.');
                }
              }}
            />
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setCurrentView('supplier-directory')}
              className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70"
            >
              <Users className="w-3.5 h-3.5 mr-2" />
              Supplier Directory
            </Button>
            <Button
              size="sm"
              onClick={() => setCurrentView('rfq-board')}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <FileText className="w-3.5 h-3.5 mr-2" />
              RFQ Board
            </Button>
            <Button
              size="sm"
              onClick={() => setCurrentView('samples')}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Package className="w-3.5 h-3.5 mr-2" />
              Sample Tracking
            </Button>
            <Button
              size="sm"
              onClick={() => toast.info('Opening compliance dashboard')}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Shield className="w-3.5 h-3.5 mr-2" />
              Compliance
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <KPICard
          title="Active Suppliers"
          value="48"
          change={8.3}
          changeLabel="vs last quarter"
          icon={Users}
          trend="up"
        />
        <KPICard
          title="Avg Lead Time"
          value="18 days"
          change={-12.5}
          changeLabel="improvement"
          icon={Clock}
          trend="up"
        />
        <KPICard
          title="Quality Score"
          value="92%"
          change={3.2}
          icon={Award}
          trend="up"
        />
        <KPICard
          title="Compliance Rate"
          value="96%"
          change={2.1}
          icon={Shield}
          trend="up"
        />
        <KPICard
          title="Cost Variance"
          value="+2.5%"
          change={-1.2}
          changeLabel="reduction"
          icon={DollarSign}
          trend="up"
        />
        <KPICard
          title="On-Time Delivery"
          value="94%"
          change={6.5}
          icon={Truck}
          trend="up"
        />
      </div>

      {/* Top Performing Suppliers */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-white mb-1">Top Performing Suppliers</h3>
            <p className="text-sm text-[#6F83A7]">Based on quality, delivery, and compliance scores</p>
          </div>
          <MarbimAIButton
            onClick={() => {
              if (onAskMarbim) {
                onAskMarbim('Analyze top performing suppliers and recommend strategic partnerships, preferred supplier agreements, and capacity expansion opportunities.');
              }
            }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allSuppliersData.filter(s => s.riskLevel === 'Low').slice(0, 3).map((supplier, index) => (
            <div 
              key={supplier.id}
              className="group p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#57ACAF]/30 transition-all duration-180 cursor-pointer"
              onClick={() => {
                setSelectedSupplier(supplier);
                setSupplierDrawerOpen(true);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    index === 0 ? 'bg-gradient-to-br from-[#EAB308]/20 to-[#EAB308]/10' :
                    index === 1 ? 'bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/10' :
                    'bg-gradient-to-br from-[#6F83A7]/20 to-[#6F83A7]/10'
                  }`}>
                    <Award className={`w-5 h-5 ${
                      index === 0 ? 'text-[#EAB308]' :
                      index === 1 ? 'text-[#57ACAF]' :
                      'text-[#6F83A7]'
                    }`} />
                  </div>
                  <div>
                    <div className="text-white mb-1">{supplier.supplierName}</div>
                    <div className="text-xs text-[#6F83A7]">{supplier.category} • {supplier.country}</div>
                  </div>
                </div>
                <Badge className={
                  index === 0 
                    ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20' 
                    : 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                }>
                  Rank #{index + 1}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-xs text-[#6F83A7] mb-1">Quality</div>
                  <div className="text-sm text-[#57ACAF]">{supplier.qualityScore}%</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-xs text-[#6F83A7] mb-1">Delivery</div>
                  <div className="text-sm text-[#57ACAF]">{supplier.onTimeDelivery}%</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-xs text-[#6F83A7] mb-1">Lead Time</div>
                  <div className="text-sm text-white">{supplier.leadTime}d</div>
                </div>
              </div>
              
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSupplier(supplier);
                  setSupplierDrawerOpen(true);
                }}
                className="w-full bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-180"
              >
                <Eye className="w-3.5 h-3.5 mr-2" />
                View Profile
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spend by Supplier Chart */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-white mb-1">Spend Distribution by Supplier</h3>
              <p className="text-sm text-[#6F83A7]">Q4 2024 procurement spend breakdown</p>
            </div>
            <div className="flex gap-2">
              <MarbimAIButton
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Analyze spend distribution patterns, identify concentration risks, and recommend supplier diversification strategies to optimize procurement.');
                  }
                }}
              />
              <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-[rgba(255,255,255,0)]">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={280}>
              <RechartsPie>
                <Pie
                  data={spendBySupplierData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ supplier, spend }) => `${supplier} $${(spend / 1000).toFixed(0)}K`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="spend"
                >
                  {spendBySupplierData.map((entry, index) => (
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
            <div className="space-y-2">
              {spendBySupplierData.map((item, index) => (
                <div key={index} className="p-3 rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-180 cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full group-hover:scale-125 transition-transform duration-180" style={{ backgroundColor: item.color }} />
                      <span className="text-white text-sm">{item.supplier}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-lg text-white">${(item.spend / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-[#6F83A7]">{((item.spend / 800000) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Supplier Intelligence</h4>
                  <p className="text-xs text-[#6F83A7] mb-4">
                    MARBIM analyzes supplier data in real-time
                  </p>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Generate comprehensive supplier intelligence report with top performers, risk alerts, and strategic recommendations.');
                  }
                }}
              />
            </div>
            
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-180 border border-white/10">
                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-2">Top-rated: KnitTex (95), GlobalFabrics (92)</div>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setCurrentView('supplier-directory');
                        toast.info('Filtering top suppliers');
                      }} 
                      className="bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white h-7 text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-180 border border-white/10">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#D0342C] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-2">High-risk: ABC Trims (expired cert), YarnPro (delays)</div>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setCurrentView('supplier-directory');
                        toast.warning('Opening risk assessment');
                      }} 
                      className="bg-[#D0342C] hover:bg-[#D0342C]/90 text-white h-7 text-xs"
                    >
                      Review Risks
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-180 border border-white/10">
                <div className="flex items-start gap-3">
                  <Target className="w-4 h-4 text-[#6F83A7] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-2">RFQ Match: 3 suppliers for knit order (92% score)</div>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setCurrentView('rfq-board');
                        toast.success('Opening supplier matches');
                      }} 
                      className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black h-7 text-xs"
                    >
                      View Matches
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-white mb-1">Delivery Performance Trend</h3>
              <p className="text-sm text-[#6F83A7]">Monthly on-time vs late deliveries</p>
            </div>
            <MarbimAIButton
              onClick={() => {
                if (onAskMarbim) {
                  onAskMarbim('Analyze delivery performance trends, predict future patterns, and recommend suppliers with consistent on-time delivery for critical orders.');
                }
              }}
            />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deliveryPerformanceData}>
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
              <Bar dataKey="onTime" fill="#57ACAF" radius={[8, 8, 0, 0]} name="On Time" stackId="a" />
              <Bar dataKey="late" fill="#D0342C" radius={[8, 8, 0, 0]} name="Late" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-white mb-1">Supplier Risk Matrix</h3>
              <p className="text-sm text-[#6F83A7]">Quality vs delivery performance analysis</p>
            </div>
            <MarbimAIButton
              onClick={() => {
                if (onAskMarbim) {
                  onAskMarbim('Perform comprehensive risk analysis across all suppliers and recommend mitigation strategies for high-risk suppliers.');
                }
              }}
            />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis type="number" dataKey="quality" name="Quality Score" stroke="#6F83A7" domain={[60, 100]} />
              <YAxis type="number" dataKey="delivery" name="Delivery Score" stroke="#6F83A7" domain={[60, 100]} />
              <ZAxis type="number" dataKey="risk" range={[100, 600]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter name="Suppliers" data={riskHeatmapData} fill="#EAB308">
                {riskHeatmapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.risk > 30 ? '#D0342C' : entry.risk > 15 ? '#EAB308' : '#57ACAF'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Alerts & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#D0342C]/10 to-[#D0342C]/5 border border-[#D0342C]/20 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-2">Critical Risk Alerts</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-sm text-white mb-1">ABC Trims: Sedex certification expired</div>
                    <div className="text-xs text-[#6F83A7]">Action required within 7 days</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-sm text-white mb-1">YarnPro: Consistent delivery delays (28d avg)</div>
                    <div className="text-xs text-[#6F83A7]">Consider alternative suppliers</div>
                  </div>
                </div>
              </div>
            </div>
            <MarbimAIButton
              onClick={() => {
                if (onAskMarbim) {
                  onAskMarbim('Generate detailed risk mitigation plans for all critical supplier alerts including alternative supplier recommendations and compliance recovery roadmaps.');
                }
              }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-2">Strategic Recommendations</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-sm text-white mb-1">Expand partnership with KnitTex</div>
                    <div className="text-xs text-[#6F83A7]">95% quality, 96% on-time delivery</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-sm text-white mb-1">Diversify spend to reduce concentration</div>
                    <div className="text-xs text-[#6F83A7]">Top supplier accounts for 30.6% of spend</div>
                  </div>
                </div>
              </div>
            </div>
            <MarbimAIButton
              onClick={() => {
                if (onAskMarbim) {
                  onAskMarbim('Develop strategic supplier development roadmap including preferred supplier programs, capacity expansion opportunities, and long-term partnership agreements.');
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderSupplierDirectory = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Supplier Directory</h2>
          <p className="text-sm text-[#6F83A7]">Comprehensive list of suppliers with performance indicators</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 bg-[rgba(255,255,255,0)]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            onClick={() => setAddSupplierDrawerOpen(true)}
            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all-suppliers" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-5 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="all-suppliers" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Users className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">All Suppliers</span>
            </TabsTrigger>
            <TabsTrigger 
              value="certified-suppliers" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Shield className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Certified Suppliers</span>
            </TabsTrigger>
            <TabsTrigger 
              value="watchlist" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Eye className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Watchlist</span>
            </TabsTrigger>
            <TabsTrigger 
              value="blacklist" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <XCircle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Blacklist</span>
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

        <TabsContent value="all-suppliers" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Total Suppliers</span>
                <Users className="w-4 h-4 text-[#57ACAF]" />
              </div>
              <div className="text-2xl text-white mb-1">{allSuppliersData.length}</div>
              <div className="text-xs text-[#57ACAF]">Active & Verified</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Avg Quality Score</span>
                <Award className="w-4 h-4 text-[#EAB308]" />
              </div>
              <div className="text-2xl text-white mb-1">86%</div>
              <div className="text-xs text-[#EAB308]">+3% this month</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Avg Lead Time</span>
                <Clock className="w-4 h-4 text-[#6F83A7]" />
              </div>
              <div className="text-2xl text-white mb-1">21 days</div>
              <div className="text-xs text-[#6F83A7]">Industry avg: 24d</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">High Risk</span>
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl text-red-400 mb-1">2</div>
              <div className="text-xs text-red-400">Requires attention</div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAskMarbim('Analyze all suppliers and generate comprehensive performance report including quality metrics, delivery reliability, pricing trends, and risk assessment.')}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <BarChart3 className="w-3 h-3 mr-2" />
                Performance Report
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAskMarbim('Recommend optimal supplier segmentation strategy based on capabilities, geographic distribution, and strategic value. Include diversification opportunities.')}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <Target className="w-3 h-3 mr-2" />
                Segmentation Analysis
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast.success('Exporting supplier database', {
                    description: 'Excel file will be downloaded shortly',
                  });
                }}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <Download className="w-3 h-3 mr-2" />
                Export All
              </Button>
            </div>
            <Button
              onClick={() => onAskMarbim('Identify gaps in current supplier pool and recommend new suppliers to add. Include capability analysis, geographic coverage, and competitive pricing considerations.')}
              className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Find New Suppliers
            </Button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">All Suppliers</h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                  {allSuppliersData.length} Total
                </Badge>
              </div>
            </div>
            <SmartTable
              columns={allSuppliersColumns}
              data={allSuppliersData}
              searchPlaceholder="Search suppliers..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-1">AI Risk Prediction</h4>
                <p className="text-sm text-[#6F83A7]">
                  MARBIM flags high-risk suppliers and predicts delay probability based on historical performance. 2 suppliers currently require immediate attention.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onAskMarbim('Provide detailed risk analysis for all suppliers. Include delivery reliability predictions, quality risk factors, financial health indicators, and recommended mitigation strategies.')}
              variant="outline"
              className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)] shrink-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Full Analysis
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="certified-suppliers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Total Certified</span>
                <Shield className="w-4 h-4 text-[#57ACAF]" />
              </div>
              <div className="text-2xl text-white mb-1">{certifiedSuppliersData.length}</div>
              <div className="text-xs text-[#57ACAF]">ISO 9001, GOTS, BSCI</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Expiring Soon</span>
                <Calendar className="w-4 h-4 text-[#EAB308]" />
              </div>
              <div className="text-2xl text-[#EAB308] mb-1">2</div>
              <div className="text-xs text-[#EAB308]">Next 30 days</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Valid Certifications</span>
                <CheckCircle className="w-4 h-4 text-[#6F83A7]" />
              </div>
              <div className="text-2xl text-white mb-1">96%</div>
              <div className="text-xs text-[#6F83A7]">Compliance rate</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Expired</span>
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl text-red-400 mb-1">1</div>
              <div className="text-xs text-red-400">Requires renewal</div>
            </div>
          </div>

          {/* Certificate Management Actions */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast.success('Certificate renewal reminders sent', {
                    description: 'Automated emails sent to 2 suppliers',
                  });
                }}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <Send className="w-3 h-3 mr-2" />
                Send Renewal Reminders
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAskMarbim('Generate comprehensive certification compliance report for all suppliers. Include expiration tracking, audit history, and recommendations for certificate gaps.')}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <FileText className="w-3 h-3 mr-2" />
                Compliance Report
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast.success('Certificate audit scheduled', {
                    description: 'Review meetings set up with suppliers',
                  });
                }}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <Calendar className="w-3 h-3 mr-2" />
                Schedule Audits
              </Button>
            </div>
            <Button
              onClick={() => onAskMarbim('Analyze certification requirements across all supplier categories. Identify gaps, recommend new certifications needed, and suggest suppliers for sustainability upgrades.')}
              className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Certificate Gap Analysis
            </Button>
          </div>

          {/* Expiring Certificates Alert */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">Certificates Expiring Soon</h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm">KnitTex - GOTS Certificate</span>
                        <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 text-xs">
                          Expires in 18 days
                        </Badge>
                      </div>
                      <div className="text-xs text-[#6F83A7]">Renewal process initiated</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm">GlobalFabrics - ISO 9001</span>
                        <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 text-xs">
                          Expires in 25 days
                        </Badge>
                      </div>
                      <div className="text-xs text-[#6F83A7]">Awaiting documentation</div>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onAskMarbim('Create detailed renewal action plan for expiring certificates. Include timeline, required documents, cost estimates, and alternative certification options.')}
                variant="outline"
                className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)] shrink-0"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Action Plan
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  toast.success('Urgent reminders sent to suppliers with expiring certificates');
                }}
                className="flex-1 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
              >
                <Send className="w-3 h-3 mr-2" />
                Send Urgent Reminders
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast.info('Opening certificate management dashboard');
                }}
                className="flex-1 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <Eye className="w-3 h-3 mr-2" />
                View All Certificates
              </Button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Certified Suppliers</h3>
              <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                {certifiedSuppliersData.length} Certified
              </Badge>
            </div>
            <SmartTable
              columns={allSuppliersColumns}
              data={certifiedSuppliersData}
              searchPlaceholder="Search certified suppliers..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-1">AI Certificate Monitoring</h4>
                <p className="text-sm text-[#6F83A7]">
                  MARBIM continuously monitors expiry dates, auto-sends renewal reminders at 90/60/30 days, and flags compliance gaps to prevent certification lapses.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onAskMarbim('Analyze certification trends and predict future compliance needs. Include recommendations for proactive certification strategies and risk mitigation.')}
              variant="outline"
              className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)] shrink-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Trend Analysis
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">On Watchlist</span>
                <Eye className="w-4 h-4 text-[#EAB308]" />
              </div>
              <div className="text-2xl text-[#EAB308] mb-1">{watchlistData.length}</div>
              <div className="text-xs text-[#EAB308]">Active monitoring</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">High Risk</span>
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl text-red-400 mb-1">2</div>
              <div className="text-xs text-red-400">Immediate action needed</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Under Review</span>
                <Activity className="w-4 h-4 text-[#6F83A7]" />
              </div>
              <div className="text-2xl text-white mb-1">1</div>
              <div className="text-xs text-[#6F83A7]">Audit in progress</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Improvements</span>
                <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
              </div>
              <div className="text-2xl text-white mb-1">1</div>
              <div className="text-xs text-[#57ACAF]">Showing progress</div>
            </div>
          </div>

          {/* Watchlist Management Actions */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast.success('Performance review meetings scheduled', {
                    description: 'Calendar invites sent to 3 suppliers',
                  });
                }}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <Calendar className="w-3 h-3 mr-2" />
                Schedule Reviews
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAskMarbim('Generate detailed watchlist report including root cause analysis, performance trends, corrective action plans, and supplier engagement strategies.')}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <FileText className="w-3 h-3 mr-2" />
                Generate Reports
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast.info('Opening performance improvement tracker');
                }}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <TrendingUp className="w-3 h-3 mr-2" />
                Track Improvements
              </Button>
            </div>
            <Button
              onClick={() => onAskMarbim('Recommend alternative suppliers to replace or diversify risk away from watchlist suppliers. Include capability matching, pricing comparison, and transition planning.')}
              className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 shadow-lg shadow-[#EAB308]/20"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Find Alternatives
            </Button>
          </div>

          {/* High Priority Watchlist Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white">YarnPro - Quality Issues</h4>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">High Risk</Badge>
                    </div>
                    <p className="text-sm text-[#6F83A7] mb-3">
                      3 quality failures in last 10 shipments. Defect rate increased from 2% to 8% over 3 months.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-white/5">
                        <div className="text-[#6F83A7] mb-1">On-Time Rate</div>
                        <div className="text-red-400">72%</div>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <div className="text-[#6F83A7] mb-1">Quality Score</div>
                        <div className="text-red-400">68/100</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onAskMarbim('Analyze YarnPro quality issues in depth. Identify root causes, quantify business impact, and recommend corrective actions or alternative sourcing strategies.')}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-[rgba(255,255,255,0)] shrink-0"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Analyze
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    toast.warning('Probation notice sent to YarnPro');
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-500/90 text-white"
                >
                  <AlertTriangle className="w-3 h-3 mr-2" />
                  Issue Probation
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.success('Audit scheduled for next week');
                  }}
                  className="flex-1 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  <Calendar className="w-3 h-3 mr-2" />
                  Schedule Audit
                </Button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white">ABC Trims - Delivery Delays</h4>
                      <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 text-xs">Medium Risk</Badge>
                    </div>
                    <p className="text-sm text-[#6F83A7] mb-3">
                      Consistent 5-7 day delays on shipments. Communication response time deteriorating.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-white/5">
                        <div className="text-[#6F83A7] mb-1">Avg Delay</div>
                        <div className="text-[#EAB308]">6.2 days</div>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <div className="text-[#6F83A7] mb-1">Response Time</div>
                        <div className="text-[#EAB308]">3.5 days</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onAskMarbim('Analyze ABC Trims delivery patterns and root causes of delays. Recommend improvement plan and assess feasibility of continued partnership.')}
                  variant="outline"
                  className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)] shrink-0"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Investigate
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    toast.info('Performance improvement plan initiated');
                  }}
                  className="flex-1 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                >
                  <Target className="w-3 h-3 mr-2" />
                  Improvement Plan
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.success('Meeting request sent to supplier');
                  }}
                  className="flex-1 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  <Users className="w-3 h-3 mr-2" />
                  Meet Supplier
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Suppliers on Watchlist</h3>
              <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30">
                {watchlistData.length} Monitored
              </Badge>
            </div>
            <SmartTable
              columns={allSuppliersColumns}
              data={watchlistData}
              searchPlaceholder="Search watchlist..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-1">AI Action Suggestions</h4>
                <p className="text-sm text-[#6F83A7]">
                  MARBIM continuously monitors watchlist suppliers and suggests specific actions: probation periods, performance improvement plans, audits, or alternative vendor recommendations based on severity and trends.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onAskMarbim('Provide comprehensive watchlist management strategy. Include escalation workflows, supplier engagement protocols, and predictive analysis of which suppliers can be rehabilitated vs replaced.')}
              variant="outline"
              className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)] shrink-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Strategy Guide
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="blacklist" className="space-y-6">
          {/* Blacklist Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Blacklisted</span>
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl text-red-400 mb-1">{blacklistData.length}</div>
              <div className="text-xs text-red-400">Permanently blocked</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Quality Failures</span>
                <AlertTriangle className="w-4 h-4 text-[#6F83A7]" />
              </div>
              <div className="text-2xl text-white mb-1">1</div>
              <div className="text-xs text-[#6F83A7]">Primary reason</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Under Appeal</span>
                <Activity className="w-4 h-4 text-[#6F83A7]" />
              </div>
              <div className="text-2xl text-white mb-1">0</div>
              <div className="text-xs text-[#6F83A7]">No active appeals</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6F83A7]">Est. Savings</span>
                <DollarSign className="w-4 h-4 text-[#57ACAF]" />
              </div>
              <div className="text-2xl text-white mb-1">$45K</div>
              <div className="text-xs text-[#57ACAF]">By avoiding bad suppliers</div>
            </div>
          </div>

          {/* Blacklist Management */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAskMarbim('Generate comprehensive blacklist audit report including detailed evidence, financial impact analysis, legal considerations, and recommendations for process improvements.')}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <FileText className="w-3 h-3 mr-2" />
                Audit Report
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast.info('Opening compliance documentation');
                }}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <Shield className="w-3 h-3 mr-2" />
                Compliance Docs
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast.success('System-wide block verification complete');
                }}
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <CheckCircle className="w-3 h-3 mr-2" />
                Verify Blocks
              </Button>
            </div>
            <Button
              onClick={() => onAskMarbim('Analyze patterns in blacklisted suppliers to create predictive model for early warning signs. Recommend screening criteria improvements to prevent future issues.')}
              className="bg-gradient-to-r from-red-500 to-red-500/80 text-white hover:from-red-500/90 hover:to-red-500/70 shadow-lg shadow-red-500/20"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Pattern Analysis
            </Button>
          </div>

          {/* Detailed Blacklist Card */}
          {blacklistData.map((supplier) => (
            <div key={supplier.id} className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white text-lg">{supplier.supplierName}</h4>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Blacklisted</Badge>
                      <Badge className="bg-[#6F83A7]/20 text-[#6F83A7] border-[#6F83A7]/30">{supplier.category}</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-xs text-[#6F83A7] mb-1">Blacklist Reason</div>
                        <div className="text-white">{supplier.reason}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-white/5">
                          <div className="text-xs text-[#6F83A7] mb-1">Date Listed</div>
                          <div className="text-white">{supplier.dateListed}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                          <div className="text-xs text-[#6F83A7] mb-1">Supporting Evidence</div>
                          <div className="text-white">{supplier.evidence}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onAskMarbim(`Provide comprehensive analysis of ${supplier.supplierName} blacklist case. Include detailed incident timeline, financial impact, legal considerations, and lessons learned for prevention.`)}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-[rgba(255,255,255,0)] shrink-0"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Case Details
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    toast.info('Opening detailed evidence documentation');
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-500/90 text-white"
                >
                  <FileText className="w-3 h-3 mr-2" />
                  View Evidence
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.success('Block status verified across all systems');
                  }}
                  className="flex-1 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  <Shield className="w-3 h-3 mr-2" />
                  Verify Block
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.info('Opening appeal process documentation');
                  }}
                  className="flex-1 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  <Activity className="w-3 h-3 mr-2" />
                  Appeal Process
                </Button>
              </div>
            </div>
          ))}

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Blacklisted Suppliers</h3>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {blacklistData.length} Blocked
              </Badge>
            </div>
            <SmartTable
              columns={blacklistColumns}
              data={blacklistData}
              searchPlaceholder="Search blacklist..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-1">AI Summary & Documentation</h4>
                <p className="text-sm text-[#6F83A7]">
                  MARBIM automatically generates comprehensive summary reports for the Compliance & Policy module with complete evidence documentation, incident timelines, financial impact analysis, and audit trail for legal protection.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onAskMarbim('Create executive summary of blacklist program effectiveness. Include cost avoidance metrics, process improvement recommendations, and best practices documentation.')}
              variant="outline"
              className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)] shrink-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Program Review
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* AI Executive Summary */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#EAB308]/10 via-[#EAB308]/5 to-transparent border border-[#EAB308]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EAB308]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                    <Sparkles className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-white text-xl mb-1">MARBIM Supplier Intelligence</h3>
                    <p className="text-sm text-[#6F83A7]">AI-powered analysis of supplier ecosystem health and opportunities</p>
                  </div>
                </div>
                <Button
                  onClick={() => onAskMarbim('Provide comprehensive supplier directory analysis including performance trends, risk assessment, optimization opportunities, capacity planning, and strategic sourcing recommendations.')}
                  className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 shadow-lg shadow-[#EAB308]/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Full Intelligence Report
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Top Performers</span>
                  </div>
                  <div className="text-2xl text-white mb-1">15</div>
                  <div className="text-xs text-[#57ACAF]">Excellence tier</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-[#6F83A7]">At Risk</span>
                  </div>
                  <div className="text-2xl text-red-400 mb-1">3</div>
                  <div className="text-xs text-red-400">Needs attention</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-xs text-[#6F83A7]">Improving</span>
                  </div>
                  <div className="text-2xl text-white mb-1">8</div>
                  <div className="text-xs text-[#EAB308]">Positive trend</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Savings Potential</span>
                  </div>
                  <div className="text-2xl text-white mb-1">$125K</div>
                  <div className="text-xs text-[#57ACAF]">Identified opportunities</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Alerts & Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Alerts */}
            <div className="space-y-4">
              <h3 className="text-white">Priority Alerts</h3>

              {/* Reliability Alert */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white">Reliability Deterioration</h4>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Critical</Badge>
                      </div>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        GlobalFabrics delayed 3 of last 10 shipments. On-time delivery rate dropped from 88% to 72% in Q4.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded bg-white/5">
                          <div className="text-[#6F83A7] mb-1">Current Rate</div>
                          <div className="text-red-400">72%</div>
                        </div>
                        <div className="p-2 rounded bg-white/5">
                          <div className="text-[#6F83A7] mb-1">Target Rate</div>
                          <div className="text-white">95%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAskMarbim('Analyze GlobalFabrics reliability decline. Identify root causes, quantify business impact, and recommend intervention strategy or alternative sourcing plan.')}
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-[rgba(255,255,255,0)] shrink-0"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Deep Dive
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      toast.warning('Performance review scheduled with GlobalFabrics');
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-500/90 text-white"
                  >
                    <Eye className="w-3 h-3 mr-2" />
                    Review Performance
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.info('Searching for backup suppliers');
                    }}
                    className="flex-1 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <Users className="w-3 h-3 mr-2" />
                    Find Backup
                  </Button>
                </div>
              </div>

              {/* Audit Overdue */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white">Compliance Audit Overdue</h4>
                        <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 text-xs">Action Needed</Badge>
                      </div>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        YarnPro annual compliance audit overdue since Sept 2024. Schedule renewal immediately to maintain certification status.
                      </p>
                      <div className="text-xs text-[#6F83A7]">
                        <div className="flex items-center justify-between py-1">
                          <span>Last Audit:</span>
                          <span className="text-white">Sept 2023</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span>Days Overdue:</span>
                          <span className="text-[#EAB308]">58 days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAskMarbim('Create urgent action plan for YarnPro audit scheduling. Include compliance risk assessment, audit preparation checklist, and backup plan if certification lapses.')}
                    variant="outline"
                    className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)] shrink-0"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Action Plan
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      toast.success('Audit scheduled for next week');
                    }}
                    className="flex-1 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                  >
                    <Calendar className="w-3 h-3 mr-2" />
                    Schedule Audit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.info('Escalation notice sent to management');
                    }}
                    className="flex-1 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <AlertCircle className="w-3 h-3 mr-2" />
                    Escalate
                  </Button>
                </div>
              </div>

              {/* Opportunity Alert */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white">Consolidation Opportunity</h4>
                        <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30 text-xs">Savings</Badge>
                      </div>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        Volume consolidation with KnitTex could save $24K annually. Strong performance and excess capacity identified.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded bg-white/5">
                          <div className="text-[#6F83A7] mb-1">Potential Savings</div>
                          <div className="text-[#57ACAF]">$24,000/year</div>
                        </div>
                        <div className="p-2 rounded bg-white/5">
                          <div className="text-[#6F83A7] mb-1">Volume Increase</div>
                          <div className="text-white">+35%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAskMarbim('Analyze volume consolidation opportunity with KnitTex. Include financial modeling, capacity assessment, risk analysis, and negotiation strategy for volume discounts.')}
                    variant="outline"
                    className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)] shrink-0"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Calculate
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      toast.success('Consolidation proposal prepared');
                    }}
                    className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70"
                  >
                    <Target className="w-3 h-3 mr-2" />
                    Build Proposal
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.info('Meeting scheduled with KnitTex');
                    }}
                    className="flex-1 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <Users className="w-3 h-3 mr-2" />
                    Negotiate
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Analytics */}
            <div className="space-y-4">
              <h3 className="text-white">Performance Analytics</h3>

              {/* Performance Distribution */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white">Supplier Performance Distribution</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAskMarbim('Analyze supplier performance distribution trends. Identify factors differentiating excellent vs poor performers and recommend strategies to elevate underperformers.')}
                    className="text-[#57ACAF] hover:bg-[#57ACAF]/10 h-7 px-2"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Insights
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { category: 'Excellent', count: 15, fill: '#57ACAF' },
                    { category: 'Good', count: 22, fill: '#6F83A7' },
                    { category: 'Average', count: 8, fill: '#EAB308' },
                    { category: 'Poor', count: 3, fill: '#D0342C' },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="category" stroke="#6F83A7" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#6F83A7" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D1117',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {[
                        { category: 'Excellent', count: 15, fill: '#57ACAF' },
                        { category: 'Good', count: 22, fill: '#6F83A7' },
                        { category: 'Average', count: 8, fill: '#EAB308' },
                        { category: 'Poor', count: 3, fill: '#D0342C' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Analysis */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white">Supplier Coverage by Category</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAskMarbim('Analyze supplier coverage across all categories. Identify gaps, concentration risks, and recommend diversification strategy.')}
                    className="text-[#57ACAF] hover:bg-[#57ACAF]/10 h-7 px-2"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Analyze
                  </Button>
                </div>
                <div className="space-y-3">
                  {[
                    { category: 'Fabric', suppliers: 18, capacity: 85, color: '#57ACAF' },
                    { category: 'Yarn', suppliers: 12, capacity: 72, color: '#EAB308' },
                    { category: 'Trims', suppliers: 15, capacity: 90, color: '#6F83A7' },
                    { category: 'Accessories', suppliers: 3, capacity: 45, color: '#D0342C' },
                  ].map((cat) => (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-white">{cat.category}</span>
                        <span className="text-[#6F83A7]">{cat.suppliers} suppliers • {cat.capacity}% capacity</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${cat.capacity}%`,
                            backgroundColor: cat.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Recommendations */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <h4 className="text-white mb-2">Strategic Recommendations</h4>
                    <p className="text-sm text-[#6F83A7]">AI-powered optimization opportunities</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                      <span className="text-[#6F83A7]">Add 2-3 accessory suppliers to reduce concentration risk</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                      <span className="text-[#6F83A7]">Consolidate fabric volume with top 3 performers for 12% savings</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                      <span className="text-[#6F83A7]">Move 'Average' performers to improvement programs</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onAskMarbim('Generate comprehensive strategic sourcing plan with detailed recommendations, implementation timeline, risk mitigation, and ROI projections.')}
                  className="w-full mt-4 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  Full Strategy Report
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderRFQBoard = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">RFQ Board</h2>
          <p className="text-sm text-[#6F83A7]">Broadcast RFQs and compare quotes with AI-driven insights</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
            onClick={() => setBroadcastDrawerOpen(true)}
          >
            <Send className="w-4 h-4 mr-2" />
            Broadcast RFQ
          </Button>
        </div>
      </div>

      <Tabs defaultValue="open-rfqs" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-5 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="open-rfqs" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <FileText className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Open RFQs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="awaiting-quotes" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Clock className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Awaiting Quotes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="quote-comparison" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <BarChart3 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Quote Comparison</span>
            </TabsTrigger>
            <TabsTrigger 
              value="awarded-rfqs" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <CheckCircle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Awarded RFQs</span>
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

        <TabsContent value="open-rfqs" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Open RFQs</h3>
            <SmartTable
              columns={openRFQsColumns}
              data={openRFQsData}
              searchPlaceholder="Search RFQs..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Supplier Matching</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM auto-matches suppliers by category and past performance for optimal RFQ distribution.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="awaiting-quotes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Pending Responses</div>
              <div className="text-3xl text-white">8</div>
            </div>
            <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Overdue</div>
              <div className="text-3xl text-[#D0342C]">2</div>
            </div>
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Avg Response Time</div>
              <div className="text-3xl text-white">2.5d</div>
            </div>
          </div>

          <div className="space-y-4">
            {awaitingQuotesData.map((item) => (
              <div key={item.id} className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-180 group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-white mb-1">{item.rfqId} - {item.supplier}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={item.status === 'Pending' ? 'bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30' : 'bg-[#D0342C]/20 text-[#D0342C] border-[#D0342C]/30'}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#6F83A7]">Sent: {item.sentDate}</div>
                    <div className="text-sm text-[#6F83A7]">Due: {item.dueDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedRFQ({
                        rfqId: item.rfqId,
                        title: 'Cotton Fabric 200 GSM',
                        buyer: 'H&M',
                        quantity: '5,000 yards',
                        targetPrice: '$5.50/yard',
                        deadline: item.dueDate,
                        status: item.status,
                        quotesReceived: 0,
                      });
                      setRfqDrawerOpen(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70"
                  >
                    <Eye className="w-3 h-3 mr-2" />
                    View RFQ
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.success('Reminder sent to ' + item.supplier, {
                        description: 'Follow-up email delivered',
                      });
                    }}
                    className={`flex-1 ${
                      item.status === 'Overdue'
                        ? 'border-[#D0342C]/30 text-[#D0342C] hover:bg-[#D0342C]/10'
                        : 'border-white/10 text-white hover:bg-white/5'
                    } bg-[rgba(255,255,255,0)]`}
                  >
                    <Send className="w-3 h-3 mr-2" />
                    Send Reminder
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.info('Deadline extended by 3 days');
                    }}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <Calendar className="w-3 h-3 mr-2" />
                    Extend
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Reminder System</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM sends polite reminders and prioritizes suppliers with historically faster responses.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quote-comparison" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white">Quote Comparison (RFQ-2024-5848)</h3>
              <p className="text-sm text-[#6F83A7]">{quoteComparisonData.length} quotes received</p>
            </div>
            <Button
              onClick={() => setQuoteComparisonDrawerOpen(true)}
              className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Detailed Comparison
            </Button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <SmartTable
              columns={quoteComparisonColumns}
              data={quoteComparisonData}
              searchPlaceholder="Search quotes..."
              onRowClick={() => setQuoteComparisonDrawerOpen(true)}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Ranking System</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM normalizes all quotes and ranks based on weighted parameters (Price 40%, Lead 30%, Quality 30%).
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="awarded-rfqs" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Awarded RFQs</h3>
            <div className="space-y-3">
              {[
                { rfqId: 'RFQ-2024-5845', supplier: 'KnitTex', amount: '$29,000', date: '2024-10-20', poLinked: 'PO-2024-1542', deliveryStatus: 'On Track', aiScore: 95 },
                { rfqId: 'RFQ-2024-5846', supplier: 'GlobalFabrics', amount: '$18,500', date: '2024-10-22', poLinked: 'PO-2024-1543', deliveryStatus: 'Delivered', aiScore: 92 },
              ].map((award, index) => (
                <div 
                  key={index} 
                  className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-180 cursor-pointer group"
                  onClick={() => {
                    setSelectedAwardedRFQ(awardedRFQData);
                    setAwardedRFQDrawerOpen(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-white mb-1">{award.rfqId} - {award.supplier}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">Awarded</Badge>
                        <Badge className="bg-[#6F83A7]/20 text-[#6F83A7] border-[#6F83A7]/30">
                          {award.deliveryStatus}
                        </Badge>
                        <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30">
                          AI Score: {award.aiScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl text-white mb-1">{award.amount}</div>
                      <div className="text-sm text-[#6F83A7]">{award.date}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="text-xs text-[#6F83A7] mb-1">PO Number</div>
                      <div className="text-white">{award.poLinked}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="text-xs text-[#6F83A7] mb-1">Supplier</div>
                      <div className="text-white">{award.supplier}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="text-xs text-[#6F83A7] mb-1">Status</div>
                      <div className="text-[#57ACAF]">{award.deliveryStatus}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAwardedRFQ(awardedRFQData);
                        setAwardedRFQDrawerOpen(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70"
                    >
                      <Eye className="w-3 h-3 mr-2" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Tracking delivery for ' + award.rfqId);
                      }}
                      className="flex-1 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    >
                      <Truck className="w-3 h-3 mr-2" />
                      Track Delivery
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Downloading PO ' + award.poLinked);
                      }}
                      className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Justification Logging</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM logs justification summary (cost, quality, delivery score) for audit trail.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* AI Executive Summary */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#EAB308]/10 via-[#EAB308]/5 to-transparent border border-[#EAB308]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EAB308]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                    <Sparkles className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-white text-xl mb-1">MARBIM AI Executive Summary</h3>
                    <p className="text-sm text-[#6F83A7]">Real-time intelligent analysis of RFQ performance and supplier dynamics</p>
                  </div>
                </div>
                <Button
                  onClick={() => onAskMarbim('Provide comprehensive RFQ board analysis including supplier performance trends, quote optimization opportunities, risk factors, and strategic recommendations for improving procurement efficiency.')}
                  className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 shadow-lg shadow-[#EAB308]/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Deep Analysis
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Active RFQs</span>
                  </div>
                  <div className="text-2xl text-white mb-1">12</div>
                  <div className="flex items-center gap-1 text-xs text-[#57ACAF]">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+3 this week</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-xs text-[#6F83A7]">Avg. Quote Value</span>
                  </div>
                  <div className="text-2xl text-white mb-1">$24.5K</div>
                  <div className="flex items-center gap-1 text-xs text-red-400">
                    <ArrowDownRight className="w-3 h-3" />
                    <span>-5% vs last month</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#6F83A7]" />
                    <span className="text-xs text-[#6F83A7]">Avg. Response Time</span>
                  </div>
                  <div className="text-2xl text-white mb-1">2.1 days</div>
                  <div className="flex items-center gap-1 text-xs text-[#57ACAF]">
                    <ArrowDownRight className="w-3 h-3" />
                    <span>15% faster</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Priority Recommendations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white">Priority Actions</h3>
                <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30">AI Powered</Badge>
              </div>

              {/* Best Value Award Recommendation */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 group hover:border-[#57ACAF]/40 transition-all duration-180">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-[#57ACAF]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white">Award RFQ-2024-5848 to KnitTex</h4>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">High Confidence</Badge>
                      </div>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        Best overall value with 95% AI score. Optimal balance of price ($5.80/unit), quality (92%), and fastest delivery (14 days).
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/60" style={{ width: '95%' }} />
                        </div>
                        <span className="text-xs text-[#57ACAF]">95%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="p-2 rounded bg-white/5">
                          <div className="text-[#6F83A7] mb-1">Price</div>
                          <div className="text-white">88/100</div>
                        </div>
                        <div className="p-2 rounded bg-white/5">
                          <div className="text-[#6F83A7] mb-1">Quality</div>
                          <div className="text-white">92/100</div>
                        </div>
                        <div className="p-2 rounded bg-white/5">
                          <div className="text-[#6F83A7] mb-1">Delivery</div>
                          <div className="text-white">95/100</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAskMarbim('Provide detailed justification for awarding RFQ-2024-5848 to KnitTex. Include comprehensive comparison with other suppliers, risk analysis, negotiation opportunities, and contract recommendations.')}
                    variant="outline"
                    className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)] shrink-0"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Analyze
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      toast.success('RFQ awarded to KnitTex', {
                        description: 'Purchase order generation initiated',
                      });
                    }}
                    className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70"
                  >
                    <CheckCircle className="w-3 h-3 mr-2" />
                    Award RFQ
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuoteComparisonDrawerOpen(true)}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    Compare All
                  </Button>
                </div>
              </div>

              {/* Price Variance Alert */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white">High Price Variance Detected</h4>
                        <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 text-xs">Action Needed</Badge>
                      </div>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        12.7% price spread across quotes for Denim Fabric RFQ. Market volatility or supplier pricing strategy mismatch detected.
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded bg-white/5">
                          <span className="text-[#6F83A7]">Lowest Quote</span>
                          <span className="text-[#57ACAF]">$5.50 (GlobalFabrics)</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-white/5">
                          <span className="text-[#6F83A7]">Highest Quote</span>
                          <span className="text-red-400">$6.20 (YarnPro)</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-white/5">
                          <span className="text-[#6F83A7]">Variance</span>
                          <span className="text-white">12.7%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAskMarbim('Analyze the 12.7% price variance for denim fabric quotes. Identify root causes (market conditions, supplier strategies, hidden costs), recommend negotiation tactics, and suggest optimal pricing strategy.')}
                    variant="outline"
                    className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)] shrink-0"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Investigate
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      toast.info('Negotiation strategy prepared');
                    }}
                    className="flex-1 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                  >
                    <Target className="w-3 h-3 mr-2" />
                    Negotiate Pricing
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.success('Market analysis report generated');
                    }}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <BarChart3 className="w-3 h-3 mr-2" />
                    Market Report
                  </Button>
                </div>
              </div>

              {/* Overdue Follow-ups */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white">2 Overdue Quote Responses</h4>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Urgent</Badge>
                      </div>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        GlobalFabrics and YarnPro have not responded to RFQ-2024-5847. Automated reminders recommended.
                      </p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[#6F83A7]">GlobalFabrics</span>
                          <span className="text-red-400">2 days overdue</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#6F83A7]">YarnPro</span>
                          <span className="text-red-400">1 day overdue</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAskMarbim('Draft personalized follow-up messages for GlobalFabrics and YarnPro regarding overdue RFQ responses. Include escalation strategy and alternative supplier recommendations if responses remain delayed.')}
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-[rgba(255,255,255,0)] shrink-0"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Draft
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      toast.success('Automated reminders sent to 2 suppliers');
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-500/90 text-white"
                  >
                    <Send className="w-3 h-3 mr-2" />
                    Send Reminders
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.info('Deadline extended by 3 days');
                    }}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <Calendar className="w-3 h-3 mr-2" />
                    Extend Deadline
                  </Button>
                </div>
              </div>
            </div>

            {/* Analytics & Insights */}
            <div className="space-y-4">
              <h3 className="text-white mb-2">Performance Analytics</h3>

              {/* Quote Response Time Trend */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white">Quote Response Time</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAskMarbim('Analyze quote response time patterns across all suppliers. Identify fast responders vs slow responders, correlations with quote quality, and recommendations for improving response rates.')}
                    className="text-[#57ACAF] hover:bg-[#57ACAF]/10 h-7 px-2"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Analyze
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { supplier: 'KnitTex', days: 1.2, fill: '#57ACAF' },
                    { supplier: 'GlobalFabrics', days: 2.5, fill: '#6F83A7' },
                    { supplier: 'YarnPro', days: 4.8, fill: '#D0342C' },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="supplier" stroke="#6F83A7" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#6F83A7" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D1117',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="days" radius={[8, 8, 0, 0]}>
                      {[
                        { supplier: 'KnitTex', days: 1.2, fill: '#57ACAF' },
                        { supplier: 'GlobalFabrics', days: 2.5, fill: '#6F83A7' },
                        { supplier: 'YarnPro', days: 4.8, fill: '#D0342C' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 p-3 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F83A7]">Average Response Time</span>
                    <span className="text-white">2.8 days</span>
                  </div>
                </div>
              </div>

              {/* Supplier Win Rate */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white">Supplier Win Rate (Last 30 Days)</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAskMarbim('Analyze supplier win rates and identify key success factors. Recommend strategies to optimize supplier pool and improve competitive dynamics.')}
                    className="text-[#57ACAF] hover:bg-[#57ACAF]/10 h-7 px-2"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Insights
                  </Button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'KnitTex', wins: 8, total: 12, color: '#57ACAF' },
                    { name: 'GlobalFabrics', wins: 5, total: 10, color: '#EAB308' },
                    { name: 'YarnPro', wins: 2, total: 8, color: '#6F83A7' },
                  ].map((supplier) => {
                    const winRate = Math.round((supplier.wins / supplier.total) * 100);
                    return (
                      <div key={supplier.name}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="text-white">{supplier.name}</span>
                          <span className="text-[#6F83A7]">{supplier.wins}/{supplier.total} ({winRate}%)</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${winRate}%`,
                              backgroundColor: supplier.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cost Savings Opportunities */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                      <DollarSign className="w-5 h-5 text-[#57ACAF]" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Potential Cost Savings</h4>
                      <p className="text-sm text-[#6F83A7]">AI-identified optimization opportunities</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAskMarbim('Provide detailed cost savings analysis across all active RFQs. Include negotiation strategies, volume consolidation opportunities, alternative supplier recommendations, and projected savings.')}
                    variant="outline"
                    className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)]"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Calculate
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-xs text-[#6F83A7] mb-1">Volume Consolidation</div>
                    <div className="text-xl text-[#57ACAF]">$4,200</div>
                    <div className="text-xs text-[#6F83A7] mt-1">3 RFQs eligible</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-xs text-[#6F83A7] mb-1">Price Negotiation</div>
                    <div className="text-xl text-[#57ACAF]">$2,800</div>
                    <div className="text-xs text-[#6F83A7] mt-1">5 opportunities</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-xs text-[#6F83A7] mb-1">Alternative Suppliers</div>
                    <div className="text-xl text-[#57ACAF]">$3,500</div>
                    <div className="text-xs text-[#6F83A7] mt-1">2 switches</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-xs text-[#6F83A7] mb-1">Total Potential</div>
                    <div className="text-xl text-[#EAB308]">$10,500</div>
                    <div className="text-xs text-[#57ACAF] mt-1">8.3% savings</div>
                  </div>
                </div>
              </div>

              {/* Quick AI Actions */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                <h4 className="text-white mb-4">Quick AI Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => onAskMarbim('Generate supplier performance report for all active suppliers including quality scores, delivery performance, pricing trends, and risk assessment.')}
                    variant="outline"
                    className="justify-start border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] h-auto py-3"
                  >
                    <FileText className="w-4 h-4 mr-2 shrink-0" />
                    <span className="text-xs">Performance Report</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onAskMarbim('Recommend optimal supplier pool diversification strategy based on category analysis, geographic distribution, and risk mitigation.')}
                    variant="outline"
                    className="justify-start border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] h-auto py-3"
                  >
                    <Users className="w-4 h-4 mr-2 shrink-0" />
                    <span className="text-xs">Optimize Pool</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onAskMarbim('Identify high-risk RFQs based on deadline pressure, price volatility, supplier reliability, and quality concerns. Recommend mitigation strategies.')}
                    variant="outline"
                    className="justify-start border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] h-auto py-3"
                  >
                    <Shield className="w-4 h-4 mr-2 shrink-0" />
                    <span className="text-xs">Risk Assessment</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onAskMarbim('Analyze historical RFQ patterns and predict optimal timing, pricing, and supplier selection strategies for upcoming procurement needs.')}
                    variant="outline"
                    className="justify-start border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] h-auto py-3"
                  >
                    <TrendingUp className="w-4 h-4 mr-2 shrink-0" />
                    <span className="text-xs">Forecast Trends</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderSamples = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Samples Tracking</h2>
          <p className="text-sm text-[#6F83A7]">Track material samples from request to evaluation</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 bg-[rgba(255,255,255,0.26)]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            onClick={() => setRequestSampleDrawerOpen(true)}
            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Request Sample
          </Button>
        </div>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-5 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="requests" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <FileText className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Requests</span>
            </TabsTrigger>
            <TabsTrigger 
              value="in-transit" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Truck className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">In Transit</span>
            </TabsTrigger>
            <TabsTrigger 
              value="received" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <CheckCircle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Received</span>
            </TabsTrigger>
            <TabsTrigger 
              value="buyer-feedback" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <MessageSquare className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Buyer Feedback</span>
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

        <TabsContent value="requests" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Sample Requests</h3>
              <MarbimAIButton
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Analyze sample request patterns, identify delays, and recommend priority samples for expedited processing based on buyer urgency and material criticality.');
                  }
                }}
              />
            </div>
            <SmartTable
              columns={sampleRequestsColumns}
              data={sampleRequestsData}
              searchPlaceholder="Search samples..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Smart Tracking</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    MARBIM automatically tracks courier information and predicts delivery dates based on historical shipping data, supplier location, and seasonal patterns. Reduces manual follow-up by 78%.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <Clock className="w-3 h-3 mr-1" />
                      5 active requests
                    </Badge>
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Avg delivery: 4.2 days
                    </Badge>
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      92% on-time
                    </Badge>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Predict delivery dates for all pending sample requests and flag high-risk shipments that may require supplier follow-up.');
                  }
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#57ACAF]/20">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Generate automated follow-up messages for pending sample requests based on urgency level and supplier response history.');
                  }
                }}
                className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)]"
              >
                <Send className="w-3 h-3 mr-2" />
                Auto Follow-ups
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Identify sample requests at risk of delay and recommend alternative suppliers or expedited shipping options.');
                  }
                }}
                className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)]"
              >
                <AlertTriangle className="w-3 h-3 mr-2" />
                Risk Analysis
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="in-transit" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Samples in Transit</h3>
              <MarbimAIButton
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Predict delivery delays for in-transit samples and recommend proactive supplier communication for high-priority shipments.');
                  }
                }}
              />
            </div>
            
            <div className="space-y-4">
              {inTransitData.map((sample) => (
                <div key={sample.id} className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#6F83A7]/30 transition-all duration-180 cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6F83A7]/20 to-[#6F83A7]/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-180">
                        <Truck className="w-5 h-5 text-[#6F83A7]" />
                      </div>
                      <div>
                        <div className="text-white mb-1">{sample.sampleId}</div>
                        <div className="text-sm text-[#6F83A7]">from {sample.supplier}</div>
                      </div>
                    </div>
                    <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20">
                      In Transit
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#6F83A7]">Shipping Progress</span>
                      <span className="text-white">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-[#6F83A7] mt-2">
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {sample.material}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Expected: Oct 28, 2024
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => toast.info('Tracking details opened')}
                      className="flex-1 bg-gradient-to-r from-[#6F83A7] to-[#6F83A7]/80 text-white hover:from-[#6F83A7]/90 hover:to-[#6F83A7]/70"
                    >
                      <MapPin className="w-3 h-3 mr-2" />
                      Track Shipment
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success('Reminder sent to ' + sample.supplier)}
                      className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    >
                      <Send className="w-3 h-3 mr-2" />
                      Remind
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Delay Detection System</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    MARBIM monitors real-time shipping data and flags delayed deliveries 2-3 days in advance. Automatic notifications are sent to procurement teams and suppliers with recommended actions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <Truck className="w-3 h-3 mr-1" />
                      8 shipments tracked
                    </Badge>
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      2 potential delays
                    </Badge>
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      85% accuracy
                    </Badge>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Analyze current transit times and predict which shipments are at risk of delay. Suggest alternative logistics options for critical samples.');
                  }
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#EAB308]/20">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Generate delivery delay alerts for samples in transit and create proactive communication templates for suppliers.');
                  }
                }}
                className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
              >
                <AlertTriangle className="w-3 h-3 mr-2" />
                Delay Alerts
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Optimize shipping routes and recommend carriers with best on-time performance for urgent sample deliveries.');
                  }
                }}
                className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
              >
                <TrendingUp className="w-3 h-3 mr-2" />
                Route Optimization
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="received" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Received Samples</h3>
              <MarbimAIButton
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Analyze quality inspection results for received samples and identify suppliers requiring immediate attention or quality improvement plans.');
                  }
                }}
              />
            </div>
            
            <div className="space-y-4">
              {receivedData.map((sample) => (
                <div key={sample.id} className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#57ACAF]/30 transition-all duration-180 cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-180">
                        <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                      </div>
                      <div>
                        <div className="text-white mb-1">{sample.sampleId}</div>
                        <div className="text-sm text-[#6F83A7]">from {sample.supplier}</div>
                      </div>
                    </div>
                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                      Received
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Material</div>
                      <div className="text-sm text-white">{sample.material}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Received</div>
                      <div className="text-sm text-white">Oct 24, 2024</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Inspector</div>
                      <div className="text-sm text-white">{sample.requestedBy}</div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Inspection Result: Pass
                      </span>
                      <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border border-[#57ACAF]/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Quality +5%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedSample(sample);
                        setSampleDrawerOpen(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70"
                    >
                      <Eye className="w-3 h-3 mr-2" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success('Quality report downloaded')}
                      className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    >
                      <Download className="w-3 h-3 mr-2" />
                      Report
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.info('Approval workflow initiated')}
                      className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)]"
                    >
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Quality Scoring Engine</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    MARBIM automatically analyzes inspection results, extracts pass/fail metrics, and updates supplier quality scores in real-time. Machine learning models identify quality patterns and predict future performance with 91% accuracy.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      12 samples inspected
                    </Badge>
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      88% pass rate
                    </Badge>
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <Star className="w-3 h-3 mr-1" />
                      4.2/5 avg quality
                    </Badge>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Generate comprehensive quality score analysis for all received samples and recommend supplier performance improvement initiatives.');
                  }
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#57ACAF]/20">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Identify quality trends across suppliers and flag materials consistently failing inspection criteria.');
                  }
                }}
                className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)]"
              >
                <BarChart3 className="w-3 h-3 mr-2" />
                Quality Trends
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Generate automated quality reports for buyer approval with inspection images, test results, and compliance certifications.');
                  }
                }}
                className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)]"
              >
                <FileText className="w-3 h-3 mr-2" />
                Auto Reports
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="buyer-feedback" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Buyer Feedback</h3>
              <MarbimAIButton
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Analyze buyer feedback sentiment and generate actionable insights for sample improvements, supplier coaching, and quality enhancement initiatives.');
                  }
                }}
              />
            </div>
            
            <div className="space-y-4">
              {[
                { sampleId: 'SMP-2024-1247', buyer: 'H&M', feedback: 'Excellent quality, approve for production', sentiment: 'Positive', date: 'Oct 26, 2024', rating: 5 },
                { sampleId: 'SMP-2024-1245', buyer: 'Zara', feedback: 'Color slightly off, request resubmit', sentiment: 'Neutral', date: 'Oct 25, 2024', rating: 3 },
              ].map((feedback, index) => (
                <div key={index} className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-180 group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-180 ${
                        feedback.sentiment === 'Positive' 
                          ? 'bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/10' 
                          : feedback.sentiment === 'Neutral'
                          ? 'bg-gradient-to-br from-[#EAB308]/20 to-[#EAB308]/10'
                          : 'bg-gradient-to-br from-[#D0342C]/20 to-[#D0342C]/10'
                      }`}>
                        <MessageSquare className={`w-5 h-5 ${
                          feedback.sentiment === 'Positive' 
                            ? 'text-[#57ACAF]' 
                            : feedback.sentiment === 'Neutral'
                            ? 'text-[#EAB308]'
                            : 'text-[#D0342C]'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white">{feedback.sampleId}</span>
                          <span className="text-white/40">•</span>
                          <span className="text-[#6F83A7]">{feedback.buyer}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < feedback.rating
                                    ? 'text-[#EAB308] fill-[#EAB308]'
                                    : 'text-[#6F83A7]/30'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-white/40">•</span>
                          <span className="text-xs text-[#6F83A7]">{feedback.date}</span>
                        </div>
                        <p className="text-sm text-[#6F83A7] italic mb-3">"{feedback.feedback}"</p>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            feedback.sentiment === 'Positive' 
                              ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20' 
                              : feedback.sentiment === 'Neutral' 
                              ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20' 
                              : 'bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20'
                          }>
                            {feedback.sentiment}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (onAskMarbim) {
                                onAskMarbim(`Analyze the feedback "${feedback.feedback}" from ${feedback.buyer} and suggest specific quality improvements for the supplier.`);
                              }
                            }}
                            className="text-[#57ACAF] hover:text-[#57ACAF] hover:bg-[#57ACAF]/10 h-6"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Analysis
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Sentiment Analysis Engine</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    MARBIM uses natural language processing to extract sentiment (positive/neutral/negative), quality notes, and actionable recommendations from buyer comments. Sentiment data automatically updates supplier performance dashboards and triggers quality improvement workflows.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      24 feedback analyzed
                    </Badge>
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      72% positive
                    </Badge>
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <Star className="w-3 h-3 mr-1" />
                      4.1/5 avg rating
                    </Badge>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Perform deep sentiment analysis on all buyer feedback and create a comprehensive report highlighting common themes, quality issues, and supplier strengths.');
                  }
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#6F83A7]/20">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Identify recurring negative feedback themes and generate supplier improvement action plans with specific quality targets.');
                  }
                }}
                className="border-[#6F83A7]/30 text-[#6F83A7] hover:bg-[#6F83A7]/10 bg-[rgba(255,255,255,0)]"
              >
                <Target className="w-3 h-3 mr-2" />
                Issue Patterns
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Generate automated buyer satisfaction reports with sentiment trends, quality metrics, and comparison across suppliers.');
                  }
                }}
                className="border-[#6F83A7]/30 text-[#6F83A7] hover:bg-[#6F83A7]/10 bg-[rgba(255,255,255,0)]"
              >
                <BarChart3 className="w-3 h-3 mr-2" />
                Satisfaction Report
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Alert Cards */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white mb-2">Delivery Delay Alert</h4>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        Fabric sample from YarnPro delayed by 2 days. Expected arrival: Oct 29. AI recommends proactive buyer notification.
                      </p>
                      <div className="flex gap-2">
                        <Badge className="bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          High Priority
                        </Badge>
                        <Badge className="bg-white/10 text-white border border-white/20">
                          SMP-2024-1249
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <MarbimAIButton
                    onClick={() => {
                      if (onAskMarbim) {
                        onAskMarbim('Analyze the delivery delay for SMP-2024-1249 from YarnPro and recommend corrective actions, including alternative suppliers if needed.');
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white mb-2">Quality Improvement Trend</h4>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        Trim quality improved +5% since last batch from KnitTex. Continue using this supplier for critical orders.
                      </p>
                      <div className="flex gap-2">
                        <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border border-[#57ACAF]/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Positive Trend
                        </Badge>
                        <Badge className="bg-white/10 text-white border border-white/20">
                          KnitTex
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <MarbimAIButton
                    onClick={() => {
                      if (onAskMarbim) {
                        onAskMarbim('Generate a detailed quality trend analysis for KnitTex including historical performance, improvement factors, and future reliability predictions.');
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5 text-[#6F83A7]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white mb-2">Sample Optimization</h4>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        3 sample requests can be consolidated to reduce shipping costs by 35% and delivery time by 2 days.
                      </p>
                      <div className="flex gap-2">
                        <Badge className="bg-[#6F83A7]/20 text-[#6F83A7] border border-[#6F83A7]/30">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Cost Savings
                        </Badge>
                        <Badge className="bg-white/10 text-white border border-white/20">
                          3 Samples
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <MarbimAIButton
                    onClick={() => {
                      if (onAskMarbim) {
                        onAskMarbim('Identify sample consolidation opportunities across all pending requests and calculate potential cost and time savings.');
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Analytics Cards */}
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">Sample Pass Rate by Supplier</h3>
                  <MarbimAIButton
                    onClick={() => {
                      if (onAskMarbim) {
                        onAskMarbim('Analyze sample pass rates across all suppliers and recommend quality improvement strategies for underperforming suppliers.');
                      }
                    }}
                  />
                </div>
                <div className="space-y-3">
                  {[
                    { supplier: 'KnitTex', passRate: 95, trend: 'up' },
                    { supplier: 'GlobalFabrics', passRate: 88, trend: 'stable' },
                    { supplier: 'YarnPro', passRate: 72, trend: 'down' },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white flex items-center gap-2">
                          {item.supplier}
                          {item.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-[#57ACAF]" />}
                          {item.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-[#D0342C]" />}
                        </span>
                        <span className={
                          item.passRate >= 90 ? 'text-[#57ACAF]' :
                          item.passRate >= 80 ? 'text-[#EAB308]' :
                          'text-[#D0342C]'
                        }>{item.passRate}%</span>
                      </div>
                      <Progress value={item.passRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">Delivery Performance</h3>
                  <MarbimAIButton
                    onClick={() => {
                      if (onAskMarbim) {
                        onAskMarbim('Analyze delivery performance metrics and identify suppliers with consistent on-time delivery for priority material categories.');
                      }
                    }}
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#6F83A7]">On-Time Delivery</span>
                      <span className="text-lg text-[#57ACAF]">92%</span>
                    </div>
                    <Progress value={92} className="h-1.5" />
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#6F83A7]">Avg Delay</span>
                      <span className="text-lg text-white">1.8 days</span>
                    </div>
                    <div className="text-xs text-[#6F83A7] mt-1">12% improvement vs last month</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#6F83A7]">Response Time</span>
                      <span className="text-lg text-white">4.2 days</span>
                    </div>
                    <div className="text-xs text-[#6F83A7] mt-1">Avg from request to shipment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Comprehensive AI Actions */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">MARBIM Sample Intelligence Hub</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    AI-powered insights across the entire sample lifecycle - from request optimization and delivery prediction to quality scoring and buyer sentiment analysis. MARBIM processes 1,200+ data points daily to improve sample management efficiency by 64%.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <Activity className="w-3 h-3 mr-1" />
                      1,247 samples analyzed
                    </Badge>
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      64% efficiency gain
                    </Badge>
                    <Badge className="bg-white/10 text-white border border-white/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      95% prediction accuracy
                    </Badge>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Generate a comprehensive sample management intelligence report covering request patterns, delivery performance, quality trends, buyer satisfaction, and optimization opportunities.');
                  }
                }}
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-[#EAB308]/20">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Predict sample request volume for next quarter based on historical patterns and upcoming buyer orders.');
                  }
                }}
                className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
              >
                <TrendingUp className="w-3 h-3 mr-2" />
                Forecast Demand
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Identify supplier reliability issues and recommend diversification strategies to reduce sample delivery risks.');
                  }
                }}
                className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
              >
                <Shield className="w-3 h-3 mr-2" />
                Risk Mitigation
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Calculate total cost savings opportunities through sample consolidation, shipping optimization, and supplier negotiation.');
                  }
                }}
                className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
              >
                <DollarSign className="w-3 h-3 mr-2" />
                Cost Optimization
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onAskMarbim) {
                    onAskMarbim('Generate best practice recommendations for sample management based on industry benchmarks and top-performing suppliers.');
                  }
                }}
                className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
              >
                <BookOpen className="w-3 h-3 mr-2" />
                Best Practices
              </Button>
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
      case 'supplier-directory':
        return renderSupplierDirectory();
      case 'rfq-board':
        return renderRFQBoard();
      case 'samples':
        return renderSamples();
      default:
        return renderDashboard();
    }
  };

  const getBreadcrumbs = () => {
    const baseBreadcrumbs = [
      { label: 'Supply Chain & Procurement' },
      { label: 'Supplier Evaluation' }
    ];

    const viewLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'supplier-directory': 'Supplier Directory',
      'rfq-board': 'RFQ Board',
      'samples': 'Samples',
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
        {showSetupBanner && currentView === 'dashboard' && (
          <ModuleSetupBanner
            moduleName="Supplier Evaluation"
            onSetupClick={() => setSetupWizardOpen(true)}
          />
        )}
        {renderContent()}
      </PageLayout>

      {/* Setup Wizard */}
      {setupWizardOpen && (
        <SupplierEvaluationSetup
          onComplete={() => {
            setSetupWizardOpen(false);
            setShowSetupBanner(false);
            toast.success('Supplier Evaluation module activated!');
          }}
          onClose={() => setSetupWizardOpen(false)}
          onAskMarbim={onAskMarbim}
        />
      )}

      {/* Supplier Detail Drawer */}
      <SupplierDetailDrawer
        isOpen={supplierDrawerOpen}
        onClose={() => {
          setSupplierDrawerOpen(false);
          setSelectedSupplier(null);
        }}
        supplier={selectedSupplier}
        onAskMarbim={onAskMarbim}
      />

      {/* Sample Detail Drawer */}
      <SampleDetailDrawer
        isOpen={sampleDrawerOpen}
        onClose={() => {
          setSampleDrawerOpen(false);
          setSelectedSample(null);
        }}
        sample={selectedSample}
        onAskMarbim={onAskMarbim}
      />

      {/* RFQ Detail Drawer */}
      <SupplierRFQDetailDrawer
        isOpen={rfqDrawerOpen}
        onClose={() => {
          setRfqDrawerOpen(false);
          setSelectedRFQ(null);
        }}
        rfq={selectedRFQ}
        onAskMarbim={onAskMarbim}
        onOpenAI={onOpenAI}
      />

      {/* Broadcast RFQ Drawer */}
      <BroadcastRFQDrawer
        isOpen={broadcastDrawerOpen}
        onClose={() => setBroadcastDrawerOpen(false)}
        onAskMarbim={onAskMarbim}
        onOpenAI={() => {
          setBroadcastDrawerOpen(false);
        }}
      />

      {/* Quote Comparison Drawer */}
      <QuoteComparisonDrawer
        isOpen={quoteComparisonDrawerOpen}
        onClose={() => setQuoteComparisonDrawerOpen(false)}
        rfqId="RFQ-2024-5848"
        quotes={detailedQuotesData}
        onAskMarbim={onAskMarbim}
      />

      {/* Awarded RFQ Detail Drawer */}
      <AwardedRFQDetailDrawer
        isOpen={awardedRFQDrawerOpen}
        onClose={() => setAwardedRFQDrawerOpen(false)}
        rfq={selectedAwardedRFQ}
        onAskMarbim={onAskMarbim}
      />

      {/* Request Sample Drawer */}
      <RequestSampleDrawer
        open={requestSampleDrawerOpen}
        onClose={() => setRequestSampleDrawerOpen(false)}
        onAskMarbim={onAskMarbim}
      />

      {/* Add Supplier Drawer */}
      <AddSupplierDrawer
        open={addSupplierDrawerOpen}
        onClose={() => setAddSupplierDrawerOpen(false)}
        onAskMarbim={onAskMarbim}
      />
    </>
  );
}
