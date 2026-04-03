import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { DetailDrawer } from '../DetailDrawer';
import { WorkflowStepper } from '../WorkflowStepper';
import { MarbimAIButton } from '../MarbimAIButton';
import { useDatabase, MODULE_NAMES, canPerformAction } from '../../utils/supabase';
import { 
  ClipboardCheck, TrendingUp, AlertTriangle, CheckCircle2, Eye, Edit, Search,
  XCircle, ChevronDown, Plus, Download, Filter, Upload, Zap, Sparkles,
  Camera, FileText, Target, Users, Clock, Calendar, Image as ImageIcon,
  BarChart3, TrendingDown, Send, Microscope, Shield, BookOpen, Activity,
  AlertCircle, Settings, Wrench, FileCheck, RefreshCw, Ban, FileSearch,
  Package, Layers, Bug, GitBranch, Archive, Beaker, TestTube, FlaskConical,
  Factory
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

// Dashboard Data
const dashboardSummary = [
  { label: 'Inline Inspections', value: 245, icon: ClipboardCheck, color: '#57ACAF' },
  { label: 'Final Inspections', value: 48, icon: CheckCircle2, color: '#EAB308' },
  { label: 'Open CAPAs', value: 12, icon: AlertTriangle, color: '#D0342C' },
  { label: 'Lab Results Pending', value: 8, icon: Beaker, color: '#6F83A7' },
];

const topDefectsData = [
  { name: 'Broken Stitch', value: 45, color: '#D0342C' },
  { name: 'Shade Variation', value: 32, color: '#EAB308' },
  { name: 'Loose Thread', value: 28, color: '#57ACAF' },
  { name: 'Puckering', value: 21, color: '#6F83A7' },
  { name: 'Needle Mark', value: 18, color: '#9333EA' },
];

// Inline QC Data
const inlineInspectionsData = [
  {
    id: 1,
    inspectionId: 'IQC-2024-1847',
    line: 'Line 4',
    style: 'ST-5821',
    operator: 'John Smith',
    defectsFound: 8,
    status: 'Review Required',
    dhu: 3.2,
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    inspectionId: 'IQC-2024-1848',
    line: 'Line 2',
    style: 'ST-5823',
    operator: 'Maria Garcia',
    defectsFound: 2,
    status: 'Cleared',
    dhu: 0.8,
    timestamp: '11:15 AM',
  },
  {
    id: 3,
    inspectionId: 'IQC-2024-1849',
    line: 'Line 6',
    style: 'ST-5819',
    operator: 'David Lee',
    defectsFound: 12,
    status: 'Critical',
    dhu: 4.8,
    timestamp: '09:45 AM',
  },
  {
    id: 4,
    inspectionId: 'IQC-2024-1850',
    line: 'Line 1',
    style: 'ST-5824',
    operator: 'Lisa Wong',
    defectsFound: 5,
    status: 'Cleared',
    dhu: 2.0,
    timestamp: '12:00 PM',
  },
];

const defectsLogData = [
  {
    id: 1,
    defectId: 'DEF-7821',
    operation: 'Collar Attachment',
    type: 'Broken Stitch',
    severity: 'Major',
    inspector: 'Sarah M.',
    hasImage: true,
    timestamp: '10:32 AM',
  },
  {
    id: 2,
    defectId: 'DEF-7822',
    operation: 'Sleeve Hemming',
    type: 'Loose Thread',
    severity: 'Minor',
    inspector: 'Mike R.',
    hasImage: true,
    timestamp: '10:45 AM',
  },
  {
    id: 3,
    defectId: 'DEF-7823',
    operation: 'Back Seam',
    type: 'Puckering',
    severity: 'Critical',
    inspector: 'Sarah M.',
    hasImage: false,
    timestamp: '11:05 AM',
  },
];

// Final QC & AQL Data
const aqlPlanningData = [
  {
    id: 1,
    style: 'ST-5821',
    buyer: 'H&M',
    samplingPlan: 'Level II - General',
    unitsInspected: 125,
    acceptThreshold: 2.5,
    rejectThreshold: 6.5,
    status: 'In Progress',
  },
  {
    id: 2,
    style: 'ST-5823',
    buyer: 'Zara',
    samplingPlan: 'Level II - General',
    unitsInspected: 200,
    acceptThreshold: 3.5,
    rejectThreshold: 7.5,
    status: 'Completed',
  },
  {
    id: 3,
    style: 'ST-5819',
    buyer: 'Gap',
    samplingPlan: 'Level I - Reduced',
    unitsInspected: 80,
    acceptThreshold: 1.5,
    rejectThreshold: 4.5,
    status: 'Pending',
  },
];

const aqlResultsData = [
  {
    id: 1,
    lotNumber: 'LOT-2024-8821',
    sampleSize: 125,
    defectsFound: 3,
    result: 'Pass',
    inspector: 'Lisa K.',
    date: '2024-10-27',
  },
  {
    id: 2,
    lotNumber: 'LOT-2024-8822',
    sampleSize: 200,
    defectsFound: 8,
    result: 'Fail',
    inspector: 'John D.',
    date: '2024-10-26',
  },
  {
    id: 3,
    lotNumber: 'LOT-2024-8823',
    sampleSize: 80,
    defectsFound: 1,
    result: 'Pass',
    inspector: 'Sarah M.',
    date: '2024-10-25',
  },
];

// Lab Tests Data
const labSubmissionsData = [
  {
    id: 1,
    testId: 'LAB-2024-5521',
    buyer: 'H&M',
    style: 'ST-5821',
    labName: 'SGS Testing',
    submittedOn: '2024-10-20',
    expectedDate: '2024-11-03',
    status: 'Testing',
  },
  {
    id: 2,
    testId: 'LAB-2024-5522',
    buyer: 'Zara',
    style: 'ST-5823',
    labName: 'Intertek',
    submittedOn: '2024-10-18',
    expectedDate: '2024-11-01',
    status: 'Results Ready',
  },
  {
    id: 3,
    testId: 'LAB-2024-5523',
    buyer: 'Gap',
    style: 'ST-5819',
    labName: 'Bureau Veritas',
    submittedOn: '2024-10-22',
    expectedDate: '2024-11-05',
    status: 'Pending Approval',
  },
];

const labResultsData = [
  {
    id: 1,
    testId: 'LAB-2024-5518',
    testName: 'Colorfastness to Washing',
    buyer: 'H&M',
    result: 'Pass',
    value: '4-5',
    standard: 'ISO 105-C06',
    date: '2024-10-25',
  },
  {
    id: 2,
    testId: 'LAB-2024-5519',
    testName: 'Dimensional Stability',
    buyer: 'Zara',
    result: 'Fail',
    value: '-4.2%',
    standard: 'ISO 3759',
    date: '2024-10-24',
  },
  {
    id: 3,
    testId: 'LAB-2024-5520',
    testName: 'Tensile Strength',
    buyer: 'Nike',
    result: 'Pass',
    value: '420 N',
    standard: 'ASTM D5034',
    date: '2024-10-23',
  },
];

// CAPA Data
const capaOverviewData = {
  openCAPAs: 12,
  closedCAPAs: 156,
  overdueCAPAs: 3,
  avgClosureDays: 8.5,
};

const capaListData = [
  {
    id: 1,
    capaId: 'CAPA-2024-421',
    issue: 'Broken Stitch - Line 4',
    rootCause: 'Needle Wear',
    owner: 'Maintenance Dept.',
    dueDate: '2024-11-05',
    status: 'In Progress',
    priority: 'High',
  },
  {
    id: 2,
    capaId: 'CAPA-2024-422',
    issue: 'Shade Variation - Batch 2401',
    rootCause: 'Dye Lot Inconsistency',
    owner: 'Quality Team',
    dueDate: '2024-11-02',
    status: 'Overdue',
    priority: 'Critical',
  },
  {
    id: 3,
    capaId: 'CAPA-2024-423',
    issue: 'Puckering - Sleeve Seam',
    rootCause: 'Thread Tension',
    owner: 'Production Line 2',
    dueDate: '2024-11-08',
    status: 'Pending Review',
    priority: 'Medium',
  },
];

// Standards Data
const aqlStandardsData = [
  {
    id: 1,
    buyer: 'H&M',
    productType: 'Casual Shirts',
    samplingLevel: 'Level II',
    acceptCriteria: '2.5 AQL',
    rejectCriteria: '6.5 AQL',
    standard: 'ANSI/ASQ Z1.4',
  },
  {
    id: 2,
    buyer: 'Zara',
    productType: 'Denim',
    samplingLevel: 'Level II',
    acceptCriteria: '1.5 AQL',
    rejectCriteria: '4.0 AQL',
    standard: 'ISO 2859-1',
  },
  {
    id: 3,
    buyer: 'Nike',
    productType: 'Sportswear',
    samplingLevel: 'Level III',
    acceptCriteria: '1.0 AQL',
    rejectCriteria: '2.5 AQL',
    standard: 'ANSI/ASQ Z1.4',
  },
];

const testMethodsData = [
  {
    id: 1,
    testName: 'Colorfastness to Washing',
    standard: 'ISO 105-C06',
    category: 'Physical',
    lastUpdated: '2024-01-15',
    status: 'Active',
  },
  {
    id: 2,
    testName: 'Formaldehyde Content',
    standard: 'ISO 14184-1',
    category: 'Chemical',
    lastUpdated: '2024-03-20',
    status: 'Active',
  },
  {
    id: 3,
    testName: 'Seam Slippage',
    standard: 'ISO 13936-1',
    category: 'Performance',
    lastUpdated: '2023-11-10',
    status: 'Review Required',
  },
];

interface QualityControlProps {
  initialSubPage?: string;
  onAskMarbim?: (prompt: string) => void;
}

export function QualityControl({ initialSubPage = 'dashboard', onAskMarbim }: QualityControlProps) {
  const routeSubpage = useRouteSubpage('dashboard', initialSubPage);
  // Database hook
  const db = useDatabase();
  
  // UI State
  const [currentView, setCurrentView] = useState<string>(routeSubpage);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(true);
  
  // Database State
  const [inspections, setInspections] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [defects, setDefects] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed Data
  const passedInspections = inspections.filter(i => i.result === 'Pass');
  const failedInspections = inspections.filter(i => i.result === 'Fail');
  const avgDHU = inspections.length > 0
    ? Math.round(inspections.reduce((sum, i) => sum + parseFloat(i.dhu || 0), 0) / inspections.length)
    : 0;
  const avgAQL = audits.length > 0
    ? (audits.reduce((sum, a) => sum + parseFloat(a.aqlLevel || 0), 0) / audits.length).toFixed(1)
    : '0.0';

  const computedDashboardSummary = [
    { label: 'Inspections Passed', value: passedInspections.length, icon: CheckCircle2, color: '#57ACAF' },
    { label: 'Inspections Failed', value: failedInspections.length, icon: XCircle, color: '#D0342C' },
    { label: 'Avg. DHU', value: avgDHU, icon: TrendingUp, color: '#EAB308' },
    { label: 'Avg. AQL', value: avgAQL, icon: Target, color: '#57ACAF' },
  ];

  useEffect(() => {
    setCurrentView(routeSubpage);
  }, [routeSubpage]);

  // Load data from database on mount
  useEffect(() => {
    loadQualityData();
  }, []);

  // Database Operations
  async function loadQualityData() {
    try {
      setIsLoading(true);
      const data = await db.getByModule(MODULE_NAMES.QUALITY_CONTROL);
      
      const inspectionData = data.filter((item: any) => item.type === 'inline-inspection');
      const auditData = data.filter((item: any) => item.type === 'final-audit');
      const defectData = data.filter((item: any) => item.type === 'defect');
      const labData = data.filter((item: any) => item.type === 'lab-test');
      
      if (inspectionData.length === 0) {
        await seedInitialQualityData();
      } else {
        setInspections(inspectionData);
        setAudits(auditData);
        setDefects(defectData);
        setLabs(labData);
      }
    } catch (error) {
      console.error('Failed to load quality data:', error);
      toast.error('Failed to load quality data');
    } finally {
      setIsLoading(false);
    }
  }

  async function seedInitialQualityData() {
    const initialInspections = inlineInspectionsData.map(item => ({ ...item, type: 'inline-inspection' }));
    const initialAudits = aqlResultsData.map(item => ({ ...item, type: 'final-audit' }));
    const initialDefects = defectsLogData.map(item => ({ ...item, type: 'defect' }));
    const initialLabs = labResultsData.map(item => ({ ...item, type: 'lab-test' }));
    
    for (const inspection of initialInspections) {
      const id = `inspection-${inspection.id}-${Date.now()}`;
      await db.store(id, inspection, MODULE_NAMES.QUALITY_CONTROL);
    }
    
    for (const audit of initialAudits) {
      const id = `audit-${audit.id}-${Date.now()}`;
      await db.store(id, audit, MODULE_NAMES.QUALITY_CONTROL);
    }
    
    for (const defect of initialDefects) {
      const id = `defect-${defect.id}-${Date.now()}`;
      await db.store(id, defect, MODULE_NAMES.QUALITY_CONTROL);
    }
    
    for (const lab of initialLabs) {
      const id = `lab-${lab.id}-${Date.now()}`;
      await db.store(id, lab, MODULE_NAMES.QUALITY_CONTROL);
    }
    
    setInspections(initialInspections);
    setAudits(initialAudits);
    setDefects(initialDefects);
    setLabs(initialLabs);
  }

  async function handleRecordUpdated() {
    try {
      await loadQualityData();
      toast.success('Record updated successfully');
    } catch (error) {
      console.error('Failed to update record:', error);
      toast.error('Failed to update record');
    }
  }

  // Inline QC Columns
  const inlineInspectionsColumns: Column[] = [
    { key: 'inspectionId', label: 'Inspection ID', sortable: true },
    { key: 'line', label: 'Line', sortable: true },
    { key: 'style', label: 'Style', sortable: true },
    { key: 'operator', label: 'Operator' },
    { key: 'defectsFound', label: 'Defects Found', sortable: true },
    {
      key: 'dhu',
      label: 'DHU',
      sortable: true,
      render: (value) => {
        const color = value < 2 ? 'text-[#57ACAF]' : value < 4 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value.toFixed(1)}</span>;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Cleared': 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20',
          'Review Required': 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20',
          'Critical': 'bg-[#D0342C]/10 text-[#D0342C] border-[#D0342C]/20',
        };
        return <Badge className={`${colors[value]} border`}>{value}</Badge>;
      },
    },
    { key: 'timestamp', label: 'Time' },
  ];

  // Defects Log Columns
  const defectsLogColumns: Column[] = [
    { key: 'defectId', label: 'Defect ID', sortable: true },
    { key: 'operation', label: 'Operation' },
    { key: 'type', label: 'Type', sortable: true },
    {
      key: 'severity',
      label: 'Severity',
      render: (value) => {
        const colors: any = {
          'Minor': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Major': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Critical': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
    {
      key: 'hasImage',
      label: 'Image',
      render: (value) => value ? <Camera className="w-4 h-4 text-[#57ACAF]" /> : <span className="text-[#6F83A7]">—</span>,
    },
    { key: 'inspector', label: 'Inspector' },
    { key: 'timestamp', label: 'Time' },
  ];

  // AQL Planning Columns
  const aqlPlanningColumns: Column[] = [
    { key: 'style', label: 'Style', sortable: true },
    { key: 'buyer', label: 'Buyer', sortable: true },
    { key: 'samplingPlan', label: 'Sampling Plan' },
    { key: 'unitsInspected', label: 'Units Inspected', sortable: true },
    { key: 'acceptThreshold', label: 'Accept', render: (value) => `${value} AQL` },
    { key: 'rejectThreshold', label: 'Reject', render: (value) => `${value} AQL` },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Pending': 'bg-[#6F83A7]/10 text-[#6F83A7]',
          'In Progress': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Completed': 'bg-[#57ACAF]/10 text-[#57ACAF]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // AQL Results Columns
  const aqlResultsColumns: Column[] = [
    { key: 'lotNumber', label: 'Lot #', sortable: true },
    { key: 'sampleSize', label: 'Sample Size', sortable: true },
    { key: 'defectsFound', label: 'Defects Found', sortable: true },
    {
      key: 'result',
      label: 'Result',
      render: (value) => {
        const color = value === 'Pass' ? 'bg-[#57ACAF]/10 text-[#57ACAF]' : 'bg-[#D0342C]/10 text-[#D0342C]';
        return <Badge className={color}>{value}</Badge>;
      },
    },
    { key: 'inspector', label: 'Inspector' },
    { key: 'date', label: 'Date', sortable: true },
  ];

  // Lab Submissions Columns
  const labSubmissionsColumns: Column[] = [
    { key: 'testId', label: 'Test ID', sortable: true },
    { key: 'buyer', label: 'Buyer', sortable: true },
    { key: 'style', label: 'Style' },
    { key: 'labName', label: 'Lab Name' },
    { key: 'submittedOn', label: 'Submitted On', sortable: true },
    { key: 'expectedDate', label: 'Expected Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Testing': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Results Ready': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Pending Approval': 'bg-[#6F83A7]/10 text-[#6F83A7]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Lab Results Columns
  const labResultsColumns: Column[] = [
    { key: 'testId', label: 'Test ID', sortable: true },
    { key: 'testName', label: 'Test Name' },
    { key: 'buyer', label: 'Buyer' },
    {
      key: 'result',
      label: 'Result',
      render: (value) => {
        const color = value === 'Pass' ? 'bg-[#57ACAF]/10 text-[#57ACAF]' : 'bg-[#D0342C]/10 text-[#D0342C]';
        return <Badge className={color}>{value}</Badge>;
      },
    },
    { key: 'value', label: 'Value' },
    { key: 'standard', label: 'Standard' },
    { key: 'date', label: 'Date', sortable: true },
  ];

  // CAPA List Columns
  const capaListColumns: Column[] = [
    { key: 'capaId', label: 'CAPA ID', sortable: true },
    { key: 'issue', label: 'Issue' },
    { key: 'rootCause', label: 'Root Cause' },
    { key: 'owner', label: 'Owner' },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => {
        const colors: any = {
          'Low': 'bg-[#6F83A7]/10 text-[#6F83A7]',
          'Medium': 'bg-[#EAB308]/10 text-[#EAB308]',
          'High': 'bg-[#D0342C]/10 text-[#D0342C]',
          'Critical': 'bg-[#D0342C]/20 text-[#D0342C] border border-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Pending Review': 'bg-[#6F83A7]/10 text-[#6F83A7]',
          'In Progress': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Overdue': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // AQL Standards Columns
  const aqlStandardsColumns: Column[] = [
    { key: 'buyer', label: 'Buyer', sortable: true },
    { key: 'productType', label: 'Product Type' },
    { key: 'samplingLevel', label: 'Sampling Level' },
    { key: 'acceptCriteria', label: 'Accept Criteria' },
    { key: 'rejectCriteria', label: 'Reject Criteria' },
    { key: 'standard', label: 'Standard' },
  ];

  // Test Methods Columns
  const testMethodsColumns: Column[] = [
    { key: 'testName', label: 'Test Name', sortable: true },
    { key: 'standard', label: 'Standard', sortable: true },
    { key: 'category', label: 'Category' },
    { key: 'lastUpdated', label: 'Last Updated', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Active': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Review Required': 'bg-[#EAB308]/10 text-[#EAB308]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
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
          title="DHU"
          value="2.4"
          change={-12.5}
          changeLabel="improvement"
          icon={TrendingDown}
          trend="up"
        />
        <KPICard
          title="First-Pass Yield"
          value="94.8%"
          change={5.2}
          changeLabel="vs last week"
          icon={CheckCircle2}
          trend="up"
        />
        <KPICard
          title="Open CAPAs"
          value="12"
          change={-25.0}
          changeLabel="vs last month"
          icon={AlertTriangle}
          trend="up"
        />
        <KPICard
          title="Lab Results Pass %"
          value="96.5%"
          change={2.3}
          icon={Beaker}
          trend="up"
        />
        <KPICard
          title="Top Defect Type"
          value="Broken Stitch"
          icon={Bug}
          trend="neutral"
        />
        <KPICard
          title="Inline Rejection Rate"
          value="3.2%"
          change={-8.5}
          changeLabel="improvement"
          icon={XCircle}
          trend="up"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {computedDashboardSummary.map((item, index) => {
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

      {/* Chart and AI Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Defects Chart */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white">Top 5 Defects by Type</h3>
            <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topDefectsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
              <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#ffffff' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {topDefectsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Card */}
        <div className="space-y-4">
          <AICard
            title="MARBIM Quality Insights"
            marbimPrompt="Provide detailed quality intelligence including defect trend analysis, lab test scheduling recommendations, and buyer pack generation readiness."
            onAskMarbim={onAskMarbim}
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Broken Stitch defects trending upward in Line 4 — retraining recommended.</div>
                    <Button size="sm" onClick={() => toast.success('Opening Line 4 defect analysis')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <Beaker className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Lab test for Buyer X's shipment due for renewal in 3 days.</div>
                    <Button size="sm" onClick={() => toast.success('Opening test scheduling')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Schedule
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <FileCheck className="w-4 h-4 text-[#6F83A7] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Prepare Final Buyer Pack for PO #1243 — all tests cleared.</div>
                    <Button size="sm" onClick={() => toast.success('Generating buyer pack')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Generate
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

  const renderInlineQC = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Inline QC</h2>
          <p className="text-sm text-[#6F83A7]">Real-time inspection logging from production lines</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Plus className="w-4 h-4 mr-2" />
            New Inspection
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
              <BarChart3 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="defects-log" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Bug className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Defects Log</span>
            </TabsTrigger>
            <TabsTrigger 
              value="photos" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <ImageIcon className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Photos & Visual Evidence</span>
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

        <TabsContent value="overview" className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">Lines Inspected</h4>
                <Factory className="w-5 h-5 text-[#57ACAF]" />
              </div>
              <div className="text-3xl text-white mb-1">8</div>
              <p className="text-xs text-[#6F83A7]">Active production lines</p>
            </div>
            <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">Total Defects</h4>
                <Bug className="w-5 h-5 text-[#D0342C]" />
              </div>
              <div className="text-3xl text-white mb-1">27</div>
              <p className="text-xs text-[#6F83A7]">-15.5% vs yesterday</p>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">DHU</h4>
                <Activity className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div className="text-3xl text-white mb-1">2.4</div>
              <p className="text-xs text-[#6F83A7]">-12.5% improvement</p>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">Rejection %</h4>
                <XCircle className="w-5 h-5 text-[#6F83A7]" />
              </div>
              <div className="text-3xl text-white mb-1">3.2%</div>
              <p className="text-xs text-[#6F83A7]">-8.5% reduction</p>
            </div>
          </div>

          {/* Workflow Progress */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="w-5 h-5 text-[#EAB308]" />
                  <span className="text-white">Inspection Workflow Progress</span>
                </div>
                <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <WorkflowStepper
                  steps={[
                    { label: 'Inspection Logging', status: 'completed' },
                    { label: 'Defect Classification', status: 'completed' },
                    { label: 'AI Pattern Analysis', status: 'active' },
                    { label: 'Action Assignment', status: 'pending' },
                    { label: 'Verification', status: 'pending' },
                  ]}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Table */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Recent Inspections</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EAB308]"></div>
              </div>
            ) : (
              <SmartTable
                columns={inlineInspectionsColumns}
                data={inspections}
                searchPlaceholder="Search inspections..."
                onRowClick={handleRowClick}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="defects-log" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Defects Log</h3>
            <SmartTable
              columns={defectsLogColumns}
              data={defectsLogData}
              searchPlaceholder="Search defects..."
              onRowClick={handleRowClick}
            />
          </div>
          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI-Powered Defect Analysis</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM automatically categorizes and ranks defects by frequency and severity. Upload photos with visual tagging for computer vision-based defect detection.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze defect data from inline inspections to categorize defect types, rank by frequency and severity, identify patterns across batches and operators, and recommend targeted corrective actions."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group cursor-pointer hover:border-[#57ACAF]/50 transition-all">
                <Camera className="w-8 h-8 text-[#6F83A7] group-hover:text-[#57ACAF] transition-colors" />
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">Computer Vision Defect Detection</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM highlights defect zones using bounding boxes and suggests probable root causes based on visual analysis.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze uploaded defect images using computer vision to detect and highlight defect zones with bounding boxes, classify defect types, and suggest probable root causes based on visual patterns."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Defect Trend Analysis</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  { day: 'Mon', defects: 18 },
                  { day: 'Tue', defects: 22 },
                  { day: 'Wed', defects: 19 },
                  { day: 'Thu', defects: 27 },
                  { day: 'Fri', defects: 24 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="day" stroke="#6F83A7" />
                  <YAxis stroke="#6F83A7" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="defects" stroke="#D0342C" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="bg-[#D0342C]/10 border border-[#D0342C]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-[#D0342C] flex-shrink-0" />
                  <div className="text-white">High Defect Alert</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  High defect % in Line 6 detected. AI correlates with machine maintenance data.
                </p>
                <Button className="w-full bg-[#D0342C] hover:bg-[#D0342C]/90">
                  <Target className="w-4 h-4 mr-2" />
                  Assign CAPA
                </Button>
              </div>

              <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Users className="w-5 h-5 text-[#EAB308] flex-shrink-0" />
                  <div className="text-white">Suggested Action</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  MARBIM suggests operator retraining for Line 4 to reduce broken stitch defects.
                </p>
                <Button variant="outline" className="w-full border-[#EAB308]/30 text-[#EAB308]">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Training
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderFinalQC = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Final QC & AQL</h2>
          <p className="text-sm text-[#6F83A7]">Ensures shipment readiness through AQL sampling and report generation</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Plus className="w-4 h-4 mr-2" />
            New AQL Inspection
          </Button>
        </div>
      </div>

      <Tabs defaultValue="aql-planning" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="aql-planning" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Target className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">AQL Planning</span>
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <CheckCircle2 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Results Recording</span>
            </TabsTrigger>
            <TabsTrigger 
              value="buyer-pack" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <FileCheck className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Buyer Pack Generation</span>
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

        <TabsContent value="aql-planning" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">AQL Planning</h3>
            <SmartTable
              columns={aqlPlanningColumns}
              data={aqlPlanningData}
              searchPlaceholder="Search AQL plans..."
              onRowClick={handleRowClick}
            />
          </div>
          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI-Generated AQL Plans</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM auto-generates sample size and inspection scope based on order volume and buyer AQL standards.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Generate optimized AQL inspection plans based on order volumes, buyer-specific AQL standards, and historical defect rates. Calculate appropriate sample sizes and inspection scopes for maximum quality assurance efficiency."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Results Recording</h3>
            <SmartTable
              columns={aqlResultsColumns}
              data={aqlResultsData}
              searchPlaceholder="Search results..."
              onRowClick={handleRowClick}
            />
          </div>
        </TabsContent>

        <TabsContent value="buyer-pack" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Recent Buyer Packs</h3>
              <div className="space-y-3">
                {[
                  { po: 'PO-HM-8821', buyer: 'H&M', date: '2024-10-25', status: 'Generated' },
                  { po: 'PO-ZR-4455', buyer: 'Zara', date: '2024-10-24', status: 'Pending' },
                  { po: 'PO-GP-9912', buyer: 'Gap', date: '2024-10-23', status: 'Generated' },
                ].map((pack, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-white mb-1">{pack.po}</div>
                      <div className="text-sm text-[#6F83A7]">{pack.buyer} • {pack.date}</div>
                    </div>
                    <Badge className={pack.status === 'Generated' ? 'bg-[#57ACAF]/10 text-[#57ACAF]' : 'bg-[#EAB308]/10 text-[#EAB308]'}>
                      {pack.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-[#EAB308] flex-shrink-0" />
                <div>
                  <h3 className="text-white mb-2">AI-Powered Buyer Packs</h3>
                  <p className="text-sm text-[#6F83A7]">
                    MARBIM auto-generates buyer-ready PDF with inspection photos, summary, lab tests, and approval comments with branded formatting.
                  </p>
                </div>
              </div>
              <Button className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-[#0D1117]">
                <Plus className="w-4 h-4 mr-2" />
                Generate New Pack
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Pass/Fail Trends</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  { week: 'W1', pass: 92, fail: 8 },
                  { week: 'W2', pass: 94, fail: 6 },
                  { week: 'W3', pass: 91, fail: 9 },
                  { week: 'W4', pass: 96, fail: 4 },
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
                  <Line type="monotone" dataKey="pass" stroke="#57ACAF" strokeWidth={2} />
                  <Line type="monotone" dataKey="fail" stroke="#D0342C" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="bg-[#D0342C]/10 border border-[#D0342C]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#D0342C] flex-shrink-0" />
                  <div>
                    <div className="text-white mb-2">AQL Failure Alert</div>
                    <p className="text-sm text-[#6F83A7]">
                      Line 3 operators have repeated AQL failures. AI recommends immediate review.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                  <div>
                    <div className="text-white mb-2">Performance Improvement</div>
                    <p className="text-sm text-[#6F83A7]">
                      Pass rate improved by 5% this month. Keep up the good work!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderLabTests = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Lab Tests</h2>
          <p className="text-sm text-[#6F83A7]">Centralized tracking for all physical, chemical, and performance tests</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Upload className="w-4 h-4 mr-2" />
            Upload Lab Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="submissions" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="submissions" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Upload className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Submissions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <FlaskConical className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Results</span>
            </TabsTrigger>
            <TabsTrigger 
              value="expiry" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Clock className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Expiry & Renewal</span>
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

        <TabsContent value="submissions" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Lab Test Submissions</h3>
            <SmartTable
              columns={labSubmissionsColumns}
              data={labSubmissionsData}
              searchPlaceholder="Search submissions..."
              onRowClick={handleRowClick}
            />
          </div>
          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Test Tracking</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM tracks test pipeline, predicts delays, and alerts for missing data to ensure timely completion.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Monitor lab test pipeline status across all active tests, predict potential delays based on historical turnaround times, identify missing test data or documentation, and recommend actions to ensure timely completion."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Lab Test Results</h3>
            <SmartTable
              columns={labResultsColumns}
              data={labResultsData}
              searchPlaceholder="Search results..."
              onRowClick={handleRowClick}
            />
          </div>
        </TabsContent>

        <TabsContent value="expiry" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { test: 'Colorfastness Test', buyer: 'H&M', expiry: '2024-12-15', status: 'Active', daysLeft: 49 },
              { test: 'Formaldehyde Test', buyer: 'Zara', expiry: '2024-11-05', status: 'Expiring Soon', daysLeft: 9 },
              { test: 'Dimensional Stability', buyer: 'Gap', expiry: '2024-10-30', status: 'Expired', daysLeft: -3 },
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-white mb-1">{item.test}</div>
                    <div className="text-sm text-[#6F83A7]">{item.buyer}</div>
                  </div>
                  <Badge className={
                    item.status === 'Active' ? 'bg-[#57ACAF]/10 text-[#57ACAF]' :
                    item.status === 'Expiring Soon' ? 'bg-[#EAB308]/10 text-[#EAB308]' :
                    'bg-[#D0342C]/10 text-[#D0342C]'
                  }>
                    {item.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6F83A7]">Expiry Date</span>
                    <span className="text-white">{item.expiry}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6F83A7]">Days Left</span>
                    <span className={item.daysLeft < 0 ? 'text-[#D0342C]' : item.daysLeft < 15 ? 'text-[#EAB308]' : 'text-[#57ACAF]'}>
                      {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)} days ago` : `${item.daysLeft} days`}
                    </span>
                  </div>
                  {item.daysLeft < 15 && (
                    <Button className="w-full mt-3 bg-[#EAB308] hover:bg-[#EAB308]/90 text-[#0D1117]">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Schedule Retest
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Test Pass Rate by Category</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { category: 'Physical', pass: 95 },
                  { category: 'Chemical', pass: 98 },
                  { category: 'Performance', pass: 92 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="category" stroke="#6F83A7" />
                  <YAxis stroke="#6F83A7" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="pass" fill="#57ACAF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="bg-[#D0342C]/10 border border-[#D0342C]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#D0342C] flex-shrink-0" />
                  <div>
                    <div className="text-white mb-2">Recurring Test Failure</div>
                    <p className="text-sm text-[#6F83A7]">
                      Colorfastness below tolerance in 3 consecutive tests — review supplier dye lot.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#EAB308] flex-shrink-0" />
                  <div>
                    <div className="text-white mb-2">Upcoming Renewals</div>
                    <p className="text-sm text-[#6F83A7]">
                      5 tests expiring in the next 2 weeks. AI has generated renewal schedule.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderCAPA = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">CAPA</h2>
          <p className="text-sm text-[#6F83A7]">Tracks defect root causes and manages follow-up actions for continuous improvement</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Plus className="w-4 h-4 mr-2" />
            Assign CAPA
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
              value="root-cause" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <FileSearch className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Root Cause Analysis</span>
            </TabsTrigger>
            <TabsTrigger 
              value="corrective" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Wrench className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Corrective Actions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="preventive" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Shield className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Preventive Actions</span>
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

        <TabsContent value="overview" className="space-y-6">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">Open CAPAs</h4>
                <AlertTriangle className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div className="text-3xl text-white mb-1">{capaOverviewData.openCAPAs}</div>
              <p className="text-xs text-[#6F83A7]">Active issues</p>
            </div>
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">Closed CAPAs</h4>
                <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
              </div>
              <div className="text-3xl text-white mb-1">{capaOverviewData.closedCAPAs}</div>
              <p className="text-xs text-[#6F83A7]">Resolved</p>
            </div>
            <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">Overdue CAPAs</h4>
                <XCircle className="w-5 h-5 text-[#D0342C]" />
              </div>
              <div className="text-3xl text-white mb-1">{capaOverviewData.overdueCAPAs}</div>
              <p className="text-xs text-[#6F83A7]">Requires attention</p>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">Avg Closure Days</h4>
                <Clock className="w-5 h-5 text-[#6F83A7]" />
              </div>
              <div className="text-3xl text-white mb-1">{capaOverviewData.avgClosureDays}</div>
              <p className="text-xs text-[#6F83A7]">Target: 10 days</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Active CAPAs</h3>
            <SmartTable
              columns={capaListColumns}
              data={capaListData}
              searchPlaceholder="Search CAPAs..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI-Powered CAPA Prioritization</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM prioritizes CAPAs based on defect criticality and shipment deadlines, ensuring urgent issues are addressed first.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Prioritize Corrective and Preventive Actions (CAPAs) based on defect criticality levels, upcoming shipment deadlines, buyer impact severity, and resource availability. Identify urgent issues requiring immediate attention and recommend optimal action sequencing."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="root-cause" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { issue: 'Broken Stitch - Line 4', rootCause: 'Needle Wear', probability: 95, icon: Wrench },
              { issue: 'Shade Variation', rootCause: 'Dye Lot Inconsistency', probability: 88, icon: AlertTriangle },
              { issue: 'Puckering', rootCause: 'Thread Tension Issue', probability: 92, icon: Settings },
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EAB308]/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-[#EAB308]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white mb-2">{item.issue}</div>
                    <div className="text-sm text-[#6F83A7] mb-3">Root Cause: {item.rootCause}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-xs text-[#6F83A7]">AI Confidence</div>
                      <div className="flex-1">
                        <Progress value={item.probability} className="h-2" />
                      </div>
                      <div className="text-sm text-[#57ACAF]">{item.probability}%</div>
                    </div>
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
                  <div className="text-white mb-1">AI Root Cause Detection</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM suggests probable causes using pattern recognition from previous issues and historical data.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze current quality issues and detect probable root causes using pattern recognition from historical defect data, previous CAPA cases, production conditions, and supplier quality trends. Suggest root cause hypotheses and recommended investigation areas."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="corrective" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Corrective Actions</h3>
            <SmartTable
              columns={capaListColumns}
              data={capaListData.filter(c => c.status !== 'Pending Review')}
              searchPlaceholder="Search corrective actions..."
              onRowClick={handleRowClick}
            />
          </div>
        </TabsContent>

        <TabsContent value="preventive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { action: 'Implement Machine Maintenance Schedule', frequency: 'Every 15 days', owner: 'Maintenance' },
              { action: 'Operator Training Program', frequency: 'Monthly', owner: 'HR Department' },
              { action: 'Supplier Quality Audit', frequency: 'Quarterly', owner: 'Quality Team' },
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-white">{item.action}</div>
                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF]">Active</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6F83A7]">Frequency</span>
                    <span className="text-white">{item.frequency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6F83A7]">Owner</span>
                    <span className="text-white">{item.owner}</span>
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
                  <div className="text-white mb-1">AI-Recommended Preventive Actions</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM recommends preventive SOP modifications based on recurring patterns to prevent future defects.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze recurring quality defect patterns and recommend preventive Standard Operating Procedure (SOP) modifications, process improvements, training initiatives, and equipment adjustments to prevent future defects and improve overall production quality."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#D0342C]/10 border border-[#D0342C]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-[#D0342C] flex-shrink-0" />
                  <div className="text-white">Systemic Issue Detected</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Frequent needle breakage linked to untrained operators. AI suggests immediate training intervention.
                </p>
                <Button className="w-full bg-[#D0342C] hover:bg-[#D0342C]/90">
                  <Users className="w-4 h-4 mr-2" />
                  Schedule Training
                </Button>
              </div>

              <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Wrench className="w-5 h-5 text-[#EAB308] flex-shrink-0" />
                  <div className="text-white">Preventive Maintenance Due</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Implement preventive maintenance schedule every 15 days to reduce machine-related defects.
                </p>
                <Button variant="outline" className="w-full border-[#EAB308]/30 text-[#EAB308]">
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Schedule
                </Button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">CAPA Closure Rate</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={[
                  { month: 'Jul', rate: 85 },
                  { month: 'Aug', rate: 88 },
                  { month: 'Sep', rate: 91 },
                  { month: 'Oct', rate: 94 },
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
                  <Area type="monotone" dataKey="rate" stroke="#57ACAF" fill="#57ACAF" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderStandards = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Standards</h2>
          <p className="text-sm text-[#6F83A7]">Maintains buyer-specific AQL levels, test protocols, and visual defect guidelines</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Plus className="w-4 h-4 mr-2" />
            Add Standard
          </Button>
        </div>
      </div>

      <Tabs defaultValue="aql-standards" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="aql-standards" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Target className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">AQL Standards</span>
            </TabsTrigger>
            <TabsTrigger 
              value="test-methods" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Beaker className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Test Methods</span>
            </TabsTrigger>
            <TabsTrigger 
              value="visual-aids" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <ImageIcon className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Visual Aids</span>
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

        <TabsContent value="aql-standards" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">AQL Standards</h3>
            <SmartTable
              columns={aqlStandardsColumns}
              data={aqlStandardsData}
              searchPlaceholder="Search AQL standards..."
              onRowClick={handleRowClick}
            />
          </div>
          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Gap Detection</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM detects gaps or inconsistencies in buyer-specific AQL settings and suggests corrections.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Detect gaps and inconsistencies in buyer-specific AQL (Acceptable Quality Limit) settings across all active buyers. Compare current configurations against industry standards, buyer specifications, and historical performance data. Suggest corrections and standardization recommendations."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="test-methods" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Test Methods</h3>
            <SmartTable
              columns={testMethodsColumns}
              data={testMethodsData}
              searchPlaceholder="Search test methods..."
              onRowClick={handleRowClick}
            />
          </div>
          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <AlertCircle className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">Standards Update Alert</div>
                  <div className="text-sm text-[#6F83A7]">
                    Update wash test method for Buyer A per latest AATCC revision. MARBIM will notify you when standards change.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Monitor and track updates to industry testing standards (AATCC, ISO, ASTM, etc.), buyer-specific quality requirements, and compliance regulations. Alert on required test method changes, standard revisions, and necessary protocol updates across all active buyers."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="visual-aids" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Broken Stitch', 'Shade Variation', 'Puckering', 'Loose Thread',
              'Needle Mark', 'Stain', 'Hole/Tear', 'Sizing Issue'
            ].map((defect, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <div className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <Camera className="w-8 h-8 text-[#6F83A7]" />
                </div>
                <div className="text-sm text-white text-center">{defect}</div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Auto-Tagging</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM auto-tags uploaded defect images and suggests relevant training materials for operators.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Automatically analyze and tag uploaded defect images using computer vision to classify defect types, severity levels, and affected areas. Suggest relevant training materials, SOPs, and best practices for operators based on the identified defect patterns."
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
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#EAB308] flex-shrink-0" />
                  <div>
                    <div className="text-white mb-2">Missing Standards Detected</div>
                    <p className="text-sm text-[#6F83A7] mb-4">
                      AI suggests missing standards based on buyer audit feedback for 2 new buyers.
                    </p>
                    <Button variant="outline" className="border-[#EAB308]/30 text-[#EAB308]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Standards
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                  <div>
                    <div className="text-white mb-2">Standards Alignment</div>
                    <p className="text-sm text-[#6F83A7]">
                      New buyer onboarded successfully. AI has imported AQL and test templates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Standards Coverage</h3>
              <div className="space-y-4">
                {[
                  { buyer: 'H&M', coverage: 100, color: '#57ACAF' },
                  { buyer: 'Zara', coverage: 100, color: '#57ACAF' },
                  { buyer: 'Gap', coverage: 85, color: '#EAB308' },
                  { buyer: 'Nike', coverage: 75, color: '#D0342C' },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#6F83A7]">{item.buyer}</span>
                      <span className="text-white">{item.coverage}%</span>
                    </div>
                    <Progress value={item.coverage} className="h-2" />
                  </div>
                ))}
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
      case 'inline-qc':
        return renderInlineQC();
      case 'final-qc':
        return renderFinalQC();
      case 'lab-tests':
        return renderLabTests();
      case 'capa':
        return renderCAPA();
      case 'standards':
        return renderStandards();
      default:
        return renderDashboard();
    }
  };

  const getBreadcrumbs = () => {
    const baseBreadcrumbs = [
      { label: 'Production' },
      { label: 'Quality Control' }
    ];

    const viewLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'inline-qc': 'Inline QC',
      'final-qc': 'Final QC & AQL',
      'lab-tests': 'Lab Tests',
      'capa': 'CAPA',
      'standards': 'Standards',
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
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedRecord?.inspectionId || selectedRecord?.defectId || selectedRecord?.capaId || 'Details'}
        recordId={selectedRecord?.id}
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="space-y-3">
              {selectedRecord && Object.entries(selectedRecord).slice(0, 6).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#6F83A7] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-white">{String(value)}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[#6F83A7] mb-2">Additional Information</div>
              <div className="text-white">Full details would be displayed here with complete record information.</div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-6">
            <div className="space-y-3">
              {[
                { date: '2024-10-27 10:30', user: 'Sarah M.', action: 'Created inspection record' },
                { date: '2024-10-27 11:15', user: 'MARBIM AI', action: 'Analyzed defect patterns' },
                { date: '2024-10-27 12:00', user: 'John D.', action: 'Updated status' },
              ].map((entry, index) => (
                <div key={index} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white mb-1">{entry.action}</div>
                  <div className="text-xs text-[#6F83A7]">{entry.user} • {entry.date}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-4 mt-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[#6F83A7] mb-2">Communication History</div>
              <div className="text-white text-sm">No communications logged for this record yet.</div>
            </div>
          </TabsContent>
        </Tabs>
      </DetailDrawer>
    </>
  );
}
