import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { MarbimAIButton } from '../MarbimAIButton';
import { MachineDetailDrawer } from '../MachineDetailDrawer';
import { AddMachineDrawer } from '../AddMachineDrawer';
import { TaskDetailDrawer } from '../TaskDetailDrawer';
import { ScheduleMaintenanceDrawer } from '../ScheduleMaintenanceDrawer';
import { RepairDetailDrawer } from '../RepairDetailDrawer';
import { ModuleSetupBanner } from '../ModuleSetupBanner';
import { MachineMaintenanceSetup } from './MachineMaintenanceSetup';
import { 
  Settings, TrendingDown, Clock, AlertTriangle, Wrench, Calendar, 
  FileText, Activity, Plus, Download, Filter, Search, Zap,
  ThermometerSun, DollarSign, Package, CheckCircle2, XCircle, BarChart3,
  Users, Award, Shield, Target, TrendingUp, ArrowUpRight, ArrowDownRight,
  Sparkles, Send, MessageSquare, Eye, RefreshCw, Edit
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
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
} from 'recharts';

interface MachineMaintenanceProps {
  initialSubPage?: string;
  onAskMarbim: (prompt: string) => void;
  isAIPanelOpen: boolean;
}

// Dashboard Data
const dashboardSummary = [
  { label: 'Total Machines', value: 48, icon: Settings, color: '#57ACAF' },
  { label: 'Avg Downtime', value: '2.4h', icon: Clock, color: '#EAB308' },
  { label: 'Health Score', value: '87%', icon: Activity, color: '#57ACAF' },
  { label: 'Task Completion', value: '94%', icon: CheckCircle2, color: '#6F83A7' },
];

const downtimeTrendData = [
  { month: 'Jun', downtime: 3.2, target: 2.5 },
  { month: 'Jul', downtime: 2.8, target: 2.5 },
  { month: 'Aug', downtime: 2.6, target: 2.5 },
  { month: 'Sep', downtime: 2.3, target: 2.5 },
  { month: 'Oct', downtime: 2.4, target: 2.5 },
];

const maintenanceCostData = [
  { category: 'Preventive', cost: 12500, color: '#57ACAF' },
  { category: 'Corrective', cost: 8200, color: '#EAB308' },
  { category: 'Breakdown', cost: 15600, color: '#D0342C' },
  { category: 'Parts', cost: 9300, color: '#6F83A7' },
];

// Machine Directory Data
const allMachinesData = [
  {
    id: 'MCH-001',
    type: 'Sewing Machine',
    location: 'Line A - Station 3',
    brand: 'Juki',
    model: 'DDL-9000C',
    status: 'Active',
    uptime: 96.5,
    lastService: '2024-10-15',
    nextService: '2024-11-15',
    technician: 'John Smith',
    serviceInterval: '30 days',
    installDate: '2022-03-10',
    efficiency: 94,
    downtime: 1.2,
    temperature: '68°C',
    vibration: 'Normal',
    currentDraw: '7.8A',
    healthScore: 92,
    monthlyMaintCost: 320,
    ytdMaintCost: 4200,
    avgMaintCost: 420,
    riskLevel: 'Low'
  },
  {
    id: 'MCH-002',
    type: 'Cutting Machine',
    location: 'Line B - Station 1',
    brand: 'Eastman',
    model: 'CZD-3',
    status: 'Active',
    uptime: 98.2,
    lastService: '2024-10-20',
    nextService: '2024-11-20',
    technician: 'Sarah Johnson',
    serviceInterval: '30 days',
    installDate: '2021-08-15',
    efficiency: 97,
    downtime: 0.8,
    temperature: '72°C',
    vibration: 'Normal',
    currentDraw: '12.5A',
    healthScore: 95,
    monthlyMaintCost: 280,
    ytdMaintCost: 3800,
    avgMaintCost: 380,
    riskLevel: 'Low'
  },
  {
    id: 'MCH-003',
    type: 'Overlock Machine',
    location: 'Line A - Station 7',
    brand: 'Brother',
    model: 'S-7300A',
    status: 'Under Maintenance',
    uptime: 92.0,
    lastService: '2024-10-25',
    nextService: '2024-11-25',
    technician: 'Mike Chen',
    serviceInterval: '30 days',
    installDate: '2023-01-20',
    efficiency: 89,
    downtime: 3.5,
    temperature: '75°C',
    vibration: 'Elevated',
    currentDraw: '8.9A',
    healthScore: 78,
    monthlyMaintCost: 550,
    ytdMaintCost: 6800,
    avgMaintCost: 680,
    riskLevel: 'Medium'
  },
  {
    id: 'MCH-004',
    type: 'Buttonhole Machine',
    location: 'Line C - Station 5',
    brand: 'Juki',
    model: 'MEB-3200',
    status: 'Breakdown',
    uptime: 85.5,
    lastService: '2024-10-18',
    nextService: '2024-11-18',
    technician: 'David Lee',
    serviceInterval: '30 days',
    installDate: '2022-11-05',
    efficiency: 82,
    downtime: 6.2,
    temperature: '82°C',
    vibration: 'High',
    currentDraw: '11.2A',
    healthScore: 65,
    monthlyMaintCost: 720,
    ytdMaintCost: 8400,
    avgMaintCost: 840,
    riskLevel: 'High'
  },
  {
    id: 'MCH-005',
    type: 'Pressing Machine',
    location: 'Line B - Station 12',
    brand: 'Hashima',
    model: 'HP-450M',
    status: 'Active',
    uptime: 97.8,
    lastService: '2024-10-22',
    nextService: '2024-11-22',
    technician: 'Lisa Wong',
    serviceInterval: '30 days',
    installDate: '2021-05-12',
    efficiency: 95,
    downtime: 1.1,
    temperature: '78°C',
    vibration: 'Normal',
    currentDraw: '15.3A',
    healthScore: 91,
    monthlyMaintCost: 380,
    ytdMaintCost: 4900,
    avgMaintCost: 490,
    riskLevel: 'Low'
  },
];

const activeMachinesData = allMachinesData.filter(m => m.status === 'Active');
const maintenanceMachinesData = allMachinesData.filter(m => m.status === 'Under Maintenance');
const breakdownMachinesData = allMachinesData.filter(m => m.status === 'Breakdown');
const watchlistMachinesData = allMachinesData.filter(m => m.riskLevel === 'High' || m.riskLevel === 'Medium');

// Repair History Data
const repairHistoryData = [
  {
    id: 'REP-001',
    ticketNo: 'TKT-2024-001',
    machineId: 'MCH-003',
    machineType: 'Overlock Machine',
    location: 'Line B - Station 2',
    issueType: 'Mechanical Failure',
    description: 'Thread tension mechanism malfunctioning',
    reportedDate: '2024-11-18',
    reportedBy: 'Production Supervisor',
    repairStarted: '2024-11-18',
    repairCompleted: '2024-11-19',
    technician: 'John Smith',
    downtime: '16 hours',
    repairCost: 1250,
    partsReplaced: 'Tension Assembly, Spring Kit',
    status: 'Completed',
    severity: 'High',
    rootCause: 'Normal wear and tear',
    preventiveAction: 'Updated maintenance schedule'
  },
  {
    id: 'REP-002',
    ticketNo: 'TKT-2024-002',
    machineId: 'MCH-007',
    machineType: 'Button Attach Machine',
    location: 'Line D - Station 5',
    issueType: 'Electrical Failure',
    description: 'Control panel display not functioning',
    reportedDate: '2024-11-15',
    reportedBy: 'Line Operator',
    repairStarted: '2024-11-15',
    repairCompleted: '2024-11-15',
    technician: 'Sarah Johnson',
    downtime: '4 hours',
    repairCost: 680,
    partsReplaced: 'Display Module, Wiring Harness',
    status: 'Completed',
    severity: 'Medium',
    rootCause: 'Power surge damage',
    preventiveAction: 'Installed surge protector'
  },
  {
    id: 'REP-003',
    ticketNo: 'TKT-2024-003',
    machineId: 'MCH-001',
    machineType: 'Single Needle Machine',
    location: 'Line A - Station 1',
    issueType: 'Performance Issue',
    description: 'Inconsistent stitch length',
    reportedDate: '2024-11-12',
    reportedBy: 'QC Inspector',
    repairStarted: '2024-11-13',
    repairCompleted: '2024-11-13',
    technician: 'Mike Chen',
    downtime: '6 hours',
    repairCost: 420,
    partsReplaced: 'Feed Dog, Presser Foot',
    status: 'Completed',
    severity: 'Medium',
    rootCause: 'Improper calibration',
    preventiveAction: 'Enhanced QC protocol'
  },
  {
    id: 'REP-004',
    ticketNo: 'TKT-2024-004',
    machineId: 'MCH-005',
    machineType: 'Flatlock Machine',
    location: 'Line C - Station 3',
    issueType: 'Mechanical Failure',
    description: 'Frequent needle breakage',
    reportedDate: '2024-11-10',
    reportedBy: 'Production Manager',
    repairStarted: '2024-11-10',
    repairCompleted: '2024-11-11',
    technician: 'David Wilson',
    downtime: '22 hours',
    repairCost: 1580,
    partsReplaced: 'Needle Bar, Timing Belt, Bearing Set',
    status: 'Completed',
    severity: 'Critical',
    rootCause: 'Bearing failure',
    preventiveAction: 'Increased lubrication frequency'
  },
  {
    id: 'REP-005',
    ticketNo: 'TKT-2024-005',
    machineId: 'MCH-002',
    machineType: 'Overlock Machine',
    location: 'Line A - Station 4',
    issueType: 'Thread Management',
    description: 'Thread breaking during high-speed operation',
    reportedDate: '2024-11-08',
    reportedBy: 'Machine Operator',
    repairStarted: '2024-11-08',
    repairCompleted: '2024-11-08',
    technician: 'Emily Davis',
    downtime: '3 hours',
    repairCost: 280,
    partsReplaced: 'Thread Guide, Tension Disc',
    status: 'Completed',
    severity: 'Low',
    rootCause: 'Lint accumulation',
    preventiveAction: 'Daily cleaning routine'
  },
  {
    id: 'REP-006',
    ticketNo: 'TKT-2024-006',
    machineId: 'MCH-008',
    machineType: 'Cutting Machine',
    location: 'Cutting Section',
    issueType: 'Safety Issue',
    description: 'Emergency stop button not responding',
    reportedDate: '2024-11-05',
    reportedBy: 'Safety Officer',
    repairStarted: '2024-11-05',
    repairCompleted: '2024-11-06',
    technician: 'John Smith',
    downtime: '28 hours',
    repairCost: 2100,
    partsReplaced: 'Safety Switch Assembly, Control Circuit',
    status: 'Completed',
    severity: 'Critical',
    rootCause: 'Worn safety switch contacts',
    preventiveAction: 'Monthly safety system testing'
  },
  {
    id: 'REP-007',
    ticketNo: 'TKT-2024-007',
    machineId: 'MCH-006',
    machineType: 'Bartack Machine',
    location: 'Line C - Station 7',
    issueType: 'Mechanical Failure',
    description: 'Unusual noise from drive system',
    reportedDate: '2024-11-01',
    reportedBy: 'Technician',
    repairStarted: '2024-11-01',
    repairCompleted: '2024-11-02',
    technician: 'Sarah Johnson',
    downtime: '18 hours',
    repairCost: 1340,
    partsReplaced: 'Drive Belt, Pulley Assembly',
    status: 'Completed',
    severity: 'High',
    rootCause: 'Drive belt wear',
    preventiveAction: 'Quarterly alignment check'
  },
  {
    id: 'REP-008',
    ticketNo: 'TKT-2024-008',
    machineId: 'MCH-004',
    machineType: 'Buttonhole Machine',
    location: 'Line B - Station 6',
    issueType: 'Electrical Failure',
    description: 'Motor overheating',
    reportedDate: '2024-10-28',
    reportedBy: 'Line Supervisor',
    repairStarted: '2024-10-28',
    repairCompleted: '2024-10-29',
    technician: 'Mike Chen',
    downtime: '20 hours',
    repairCost: 1750,
    partsReplaced: 'Motor Assembly, Cooling Fan',
    status: 'Completed',
    severity: 'High',
    rootCause: 'Cooling fan failure',
    preventiveAction: 'Monthly temperature monitoring'
  }
];

// Maintenance Tasks Data
const allTasksData = [
  {
    id: 'TASK-001',
    machine: 'MCH-001',
    machineType: 'Sewing Machine',
    type: 'Preventive',
    task: 'Lubrication & Calibration',
    scheduled: '2024-11-15',
    technician: 'John Smith',
    status: 'Scheduled',
    priority: 'Medium',
    estimatedDuration: '2 hours',
    location: 'Line A'
  },
  {
    id: 'TASK-002',
    machine: 'MCH-004',
    machineType: 'Buttonhole Machine',
    type: 'Corrective',
    task: 'Motor Replacement',
    scheduled: '2024-10-28',
    technician: 'David Lee',
    status: 'In Progress',
    priority: 'High',
    estimatedDuration: '4 hours',
    location: 'Line C'
  },
  {
    id: 'TASK-003',
    machine: 'MCH-003',
    machineType: 'Overlock Machine',
    type: 'Preventive',
    task: 'Belt Tension Adjustment',
    scheduled: '2024-10-29',
    technician: 'Mike Chen',
    status: 'In Progress',
    priority: 'Medium',
    estimatedDuration: '1.5 hours',
    location: 'Line A'
  },
  {
    id: 'TASK-004',
    machine: 'MCH-002',
    machineType: 'Cutting Machine',
    type: 'Preventive',
    task: 'Blade Sharpening',
    scheduled: '2024-11-20',
    technician: 'Sarah Johnson',
    status: 'Scheduled',
    priority: 'Low',
    estimatedDuration: '1 hour',
    location: 'Line B'
  },
  {
    id: 'TASK-005',
    machine: 'MCH-005',
    machineType: 'Pressing Machine',
    type: 'Inspection',
    task: 'Thermal Inspection',
    scheduled: '2024-11-22',
    technician: 'Lisa Wong',
    status: 'Scheduled',
    priority: 'Medium',
    estimatedDuration: '45 mins',
    location: 'Line B'
  },
];

const scheduledTasksData = allTasksData.filter(t => t.status === 'Scheduled');
const inProgressTasksData = allTasksData.filter(t => t.status === 'In Progress');
const completedTasksData = [
  {
    id: 'TASK-006',
    machine: 'MCH-001',
    machineType: 'Sewing Machine',
    type: 'Preventive',
    task: 'Routine Maintenance',
    scheduled: '2024-10-15',
    completed: '2024-10-15',
    technician: 'John Smith',
    status: 'Completed',
    priority: 'Medium',
    duration: '1.5 hours',
    location: 'Line A'
  },
];

// Spare Parts Data
const allSparePartsData = [
  {
    id: 'PART-001',
    name: 'Drive Belt - Standard',
    category: 'Mechanical',
    stock: 12,
    reorderLevel: 5,
    status: 'In Stock',
    lastUsed: '2024-10-10',
    supplier: 'ABC Parts Co.',
    unitPrice: 25,
    leadTime: '7 days',
    usageRate: 3.5
  },
  {
    id: 'PART-002',
    name: 'Motor Bearing Set',
    category: 'Mechanical',
    stock: 8,
    reorderLevel: 3,
    status: 'In Stock',
    lastUsed: '2024-09-15',
    supplier: 'Industrial Supply Ltd.',
    unitPrice: 45,
    leadTime: '5 days',
    usageRate: 2.0
  },
  {
    id: 'PART-003',
    name: 'Needle Pack (100pc)',
    category: 'Consumable',
    stock: 3,
    reorderLevel: 5,
    status: 'Low Stock',
    lastUsed: '2024-10-26',
    supplier: 'Sewing Supplies Inc.',
    unitPrice: 18,
    leadTime: '3 days',
    usageRate: 8.5
  },
  {
    id: 'PART-004',
    name: 'Cooling Fan Assembly',
    category: 'Electrical',
    stock: 2,
    reorderLevel: 3,
    status: 'Low Stock',
    lastUsed: '2024-08-22',
    supplier: 'Tech Components Ltd.',
    unitPrice: 120,
    leadTime: '10 days',
    usageRate: 1.0
  },
  {
    id: 'PART-005',
    name: 'Thread Tension Spring',
    category: 'Mechanical',
    stock: 15,
    reorderLevel: 8,
    status: 'In Stock',
    lastUsed: '2024-10-25',
    supplier: 'ABC Parts Co.',
    unitPrice: 8,
    leadTime: '5 days',
    usageRate: 4.2
  },
];

const lowStockPartsData = allSparePartsData.filter(p => p.status === 'Low Stock');
const criticalPartsData = allSparePartsData.filter(p => p.stock <= 2);

// Columns
const allMachinesColumns: Column[] = [
  { key: 'id', label: 'Machine ID', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'brand', label: 'Brand', sortable: true },
  { 
    key: 'uptime', 
    label: 'Uptime %', 
    sortable: true,
    render: (value: number) => (
      <div className="flex items-center gap-2">
        <span className={value >= 95 ? 'text-[#57ACAF]' : value >= 90 ? 'text-[#EAB308]' : 'text-red-400'}>
          {value}%
        </span>
      </div>
    )
  },
  { key: 'nextService', label: 'Next Service', sortable: true },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true,
    render: (value: string) => {
      const colors: any = {
        'Active': 'bg-[#57ACAF]/10 text-[#57ACAF]',
        'Under Maintenance': 'bg-[#EAB308]/10 text-[#EAB308]',
        'Breakdown': 'bg-red-500/10 text-red-400',
      };
      return <Badge className={colors[value]}>{value}</Badge>;
    }
  },
];

const taskColumns: Column[] = [
  { key: 'id', label: 'Task ID', sortable: true },
  { key: 'machine', label: 'Machine', sortable: true },
  { key: 'task', label: 'Task Description', sortable: true },
  { key: 'scheduled', label: 'Scheduled Date', sortable: true },
  { key: 'technician', label: 'Technician', sortable: true },
  { 
    key: 'priority', 
    label: 'Priority', 
    sortable: true,
    render: (value: string) => {
      const colors: any = {
        'High': 'bg-red-500/10 text-red-400',
        'Medium': 'bg-[#EAB308]/10 text-[#EAB308]',
        'Low': 'bg-[#6F83A7]/10 text-[#6F83A7]',
      };
      return <Badge className={colors[value]}>{value}</Badge>;
    }
  },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true,
    render: (value: string) => {
      const colors: any = {
        'Scheduled': 'bg-[#6F83A7]/10 text-[#6F83A7]',
        'In Progress': 'bg-[#EAB308]/10 text-[#EAB308]',
        'Completed': 'bg-[#57ACAF]/10 text-[#57ACAF]',
      };
      return <Badge className={colors[value]}>{value}</Badge>;
    }
  },
];

const sparePartsColumns: Column[] = [
  { key: 'id', label: 'Part ID', sortable: true },
  { key: 'name', label: 'Part Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { 
    key: 'stock', 
    label: 'Stock', 
    sortable: true,
    render: (value: number, row: any) => (
      <div className="flex items-center gap-2">
        <span className={value <= row.reorderLevel ? 'text-red-400' : 'text-white'}>{value}</span>
        {value <= row.reorderLevel && (
          <AlertTriangle className="w-4 h-4 text-red-400" />
        )}
      </div>
    )
  },
  { key: 'supplier', label: 'Supplier', sortable: true },
  { key: 'unitPrice', label: 'Unit Price', sortable: true, render: (value: number) => `$${value}` },
  { key: 'leadTime', label: 'Lead Time', sortable: true },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true,
    render: (value: string) => (
      <Badge 
        className={
          value === 'Low Stock'
            ? 'bg-red-500/10 text-red-400'
            : 'bg-[#57ACAF]/10 text-[#57ACAF]'
        }
      >
        {value}
      </Badge>
    )
  },
];

export function MachineMaintenance({ initialSubPage = 'dashboard', onAskMarbim, isAIPanelOpen }: MachineMaintenanceProps) {
  const routeSubpage = useRouteSubpage('dashboard', initialSubPage);
  const [currentView, setCurrentView] = useState(routeSubpage);
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [machineDrawerOpen, setMachineDrawerOpen] = useState(false);
  const [addMachineDrawerOpen, setAddMachineDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [repairDrawerOpen, setRepairDrawerOpen] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [isModuleSetup, setIsModuleSetup] = useState(false);
  
  // Track active tabs for each view
  const [machineDirectoryTab, setMachineDirectoryTab] = useState('all-machines');
  const [maintenancePlannerTab, setMaintenancePlannerTab] = useState('scheduled-tasks');
  const [breakdownsTab, setBreakdownsTab] = useState('active-breakdowns');
  const [sparePartsTab, setSparePartsTab] = useState('all-parts');

  useEffect(() => {
    setCurrentView(routeSubpage);
  }, [routeSubpage]);

  // Close drawer when AI panel opens
  useEffect(() => {
    if (isAIPanelOpen) {
      setMachineDrawerOpen(false);
      setAddMachineDrawerOpen(false);
      setTaskDrawerOpen(false);
      setScheduleDrawerOpen(false);
    }
  }, [isAIPanelOpen]);

  const handleRowClick = (record: any) => {
    if (record.id && record.id.startsWith('MCH-')) {
      setSelectedMachine(record);
      setMachineDrawerOpen(true);
    } else if (record.id && record.id.startsWith('TASK-')) {
      setSelectedTask(record);
      setTaskDrawerOpen(true);
    }
  };

  const handleMachineAdded = () => {
    toast.success('Machine added successfully! Refreshing directory...');
    // In a real app, this would reload the machine data
    setAddMachineDrawerOpen(false);
  };

  const renderDashboard = () => (
    <>
      {/* Hero Banner with Executive Summary */}
      <div className="bg-gradient-to-br from-[#57ACAF]/10 via-[#EAB308]/5 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(87,172,175,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/30">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl mb-2">Machine Maintenance Intelligence</h2>
                <p className="text-[#6F83A7] text-sm max-w-2xl">
                  Real-time equipment health monitoring, predictive maintenance insights, and AI-driven optimization.
                  Track machine performance, prevent downtime, and maximize operational efficiency across your entire fleet.
                </p>
              </div>
            </div>
            <MarbimAIButton
              onClick={() => {
                onAskMarbim('Provide a comprehensive executive summary of machine maintenance operations including: 1) Overall fleet health assessment and performance trends, 2) Critical machines requiring immediate attention with failure risk analysis, 3) Predictive maintenance recommendations and optimal scheduling, 4) Cost optimization opportunities and spare parts inventory status, 5) Downtime patterns and root cause analysis, 6) Strategic initiatives to improve equipment reliability, 7) Forecast for next quarter maintenance needs and budget requirements.');
              }}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Total Fleet</span>
              </div>
              <div className="text-2xl text-white mb-1">{allMachinesData.length}</div>
              <div className="text-xs text-[#57ACAF]">{activeMachinesData.length} operational</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs text-[#6F83A7]">Avg Health Score</span>
              </div>
              <div className="text-2xl text-white mb-1">87%</div>
              <div className="text-xs text-[#57ACAF]">+3% vs target</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Avg Downtime</span>
              </div>
              <div className="text-2xl text-white mb-1">2.4h</div>
              <div className="text-xs text-[#57ACAF]">-0.4h vs target</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#D0342C]" />
                <span className="text-xs text-[#6F83A7]">Critical Alerts</span>
              </div>
              <div className="text-2xl text-white mb-1">{breakdownMachinesData.length}</div>
              <div className="text-xs text-[#D0342C]">Immediate action</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Task Completion</span>
              </div>
              <div className="text-2xl text-white mb-1">94%</div>
              <div className="text-xs text-[#57ACAF]">On track</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex gap-6">
        {/* Left Column - Charts & Data */}
        <div className="flex-1 space-y-6">
          {/* Machine Downtime Trend */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-white mb-1">Machine Downtime Trend</h3>
                <p className="text-sm text-[#6F83A7]">Monthly downtime hours vs target baseline</p>
              </div>
              <MarbimAIButton
                onClick={() => {
                  onAskMarbim('Analyze machine downtime trends over the past 6 months. Identify root causes, seasonal patterns, critical machines contributing to downtime, and recommend specific strategies to reduce unplanned downtime by at least 20%.');
                }}
              />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <RechartsLine data={downtimeTrendData}>
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
                <Line 
                  type="monotone" 
                  dataKey="downtime" 
                  stroke="#EAB308" 
                  strokeWidth={3}
                  dot={{ fill: '#EAB308', r: 4 }}
                  name="Actual Downtime (hours)"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#6F83A7" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                  name="Target"
                />
              </RechartsLine>
            </ResponsiveContainer>
          </div>

          {/* Maintenance Cost Breakdown */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-white mb-1">Maintenance Cost Breakdown</h3>
                <p className="text-sm text-[#6F83A7]">Distribution by maintenance category</p>
              </div>
              <MarbimAIButton
                onClick={() => {
                  onAskMarbim('Analyze maintenance cost distribution across preventive, corrective, breakdown, and parts categories. Identify cost optimization opportunities, recommend optimal preventive-to-corrective maintenance ratio, and suggest strategies to reduce breakdown costs.');
                }}
              />
            </div>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={280}>
                <RechartsPie>
                  <Pie
                    data={maintenanceCostData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="cost"
                    label={(entry) => `$${(entry.cost / 1000).toFixed(1)}K`}
                  >
                    {maintenanceCostData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1f2e', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
              
              <div className="flex-1 space-y-3">
                {maintenanceCostData.map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-white">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white">${(item.cost / 1000).toFixed(1)}K</div>
                      <div className="text-xs text-[#6F83A7]">
                        {Math.round((item.cost / maintenanceCostData.reduce((sum, i) => sum + i.cost, 0)) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6F83A7]">Total Monthly Cost</span>
                    <span className="text-lg text-white">
                      ${(maintenanceCostData.reduce((sum, i) => sum + i.cost, 0) / 1000).toFixed(1)}K
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Alerts & Recommended Actions */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-white mb-1">Critical Alerts & Recommended Actions</h3>
                <p className="text-sm text-[#6F83A7]">AI-prioritized maintenance tasks requiring attention</p>
              </div>
              <MarbimAIButton
                onClick={() => {
                  onAskMarbim('Review all critical machine alerts and provide prioritized action plan with risk assessment, estimated downtime impact, repair costs, and recommended execution timeline.');
                }}
              />
            </div>
            
            <div className="space-y-3">
              {/* Breakdown Alert */}
              {breakdownMachinesData.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 hover:border-red-500/30 transition-all duration-180">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{breakdownMachinesData[0].id} Critical Motor Failure</span>
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Urgent</Badge>
                      </div>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        Overheating detected. Immediate shutdown required to prevent catastrophic damage.
                        Estimated repair cost: $3,200 | Downtime impact: 8-12 hours
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setCurrentView('machine-directory');
                            toast.warning('Opening machine details');
                          }} 
                          className="bg-red-500 hover:bg-red-500/90 text-white"
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            onAskMarbim(`Provide detailed analysis of ${breakdownMachinesData[0].id} motor failure including: root cause, repair vs replace decision, cost-benefit analysis, temporary workarounds, and supplier recommendations for replacement parts.`);
                          }}
                          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                        >
                          <Sparkles className="w-3 h-3 mr-2" />
                          Ask MARBIM
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Predictive Alert */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 hover:border-[#EAB308]/30 transition-all duration-180">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">MCH-003 Predicted Belt Failure</span>
                      <Badge className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20">Preventive</Badge>
                    </div>
                    <p className="text-sm text-[#6F83A7] mb-3">
                      AI predicts belt replacement needed in 7 days (92% confidence). Vibration patterns indicate wear.
                      Estimated cost: $450 | Downtime: 2-3 hours
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setCurrentView('maintenance-planner');
                          toast.success('Scheduling preventive maintenance');
                        }} 
                        className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
                      >
                        Schedule Service
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setCurrentView('spare-parts');
                        }}
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        <Package className="w-3 h-3 mr-2" />
                        Check Parts
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory Alert */}
              {lowStockPartsData.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20 hover:border-[#6F83A7]/30 transition-all duration-180">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-[#6F83A7]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Low Stock Alert: Critical Parts</span>
                        <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20">Inventory</Badge>
                      </div>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        {lowStockPartsData.length} critical spare parts below reorder threshold. Lead time: 14 days. Order now to prevent stockouts.
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setCurrentView('spare-parts');
                            toast.info('Opening spare parts inventory');
                          }} 
                          className="bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white"
                        >
                          Order Parts
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column - AI Insights & Recommendations */}
        <div className="w-[380px] space-y-6">
          
          {/* AI Predictive Insights */}
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div>
                  <h3 className="text-white mb-1">AI Predictive Insights</h3>
                  <p className="text-xs text-[#EAB308]">Machine learning analysis</p>
                </div>
              </div>
              <MarbimAIButton
                variant="icon"
                onClick={() => {
                  onAskMarbim('Generate comprehensive predictive maintenance report with machine health forecasts, failure probability analysis for all equipment, and strategic maintenance scheduling recommendations to optimize uptime.');
                }}
              />
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                  <span className="text-xs text-[#6F83A7]">Health Trend</span>
                </div>
                <p className="text-sm text-white">
                  Overall fleet health improving by 3% month-over-month due to proactive maintenance
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-[#EAB308]" />
                  <span className="text-xs text-[#6F83A7]">Optimization</span>
                </div>
                <p className="text-sm text-white">
                  Shifting to preventive maintenance could reduce costs by 18% annually
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#57ACAF]" />
                  <span className="text-xs text-[#6F83A7]">Efficiency Gain</span>
                </div>
                <p className="text-sm text-white">
                  Predictive scheduling reduced unplanned downtime by 24% vs last quarter
                </p>
              </div>
            </div>
          </div>

          {/* Performance Scorecard */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white mb-1">Performance Scorecard</h3>
                <p className="text-xs text-[#6F83A7]">Key maintenance KPIs</p>
              </div>
              <MarbimAIButton
                variant="icon"
                onClick={() => {
                  onAskMarbim('Analyze performance scorecard metrics and provide detailed recommendations to improve each KPI with specific action items and expected impact.');
                }}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#6F83A7]">MTBF</span>
                  <span className="text-white">450h</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="text-xs text-[#57ACAF] mt-1">+15% vs target (390h)</div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#6F83A7]">MTTR</span>
                  <span className="text-white">3.2h</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="text-xs text-[#57ACAF] mt-1">Target: 3.0h</div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#6F83A7]">OEE</span>
                  <span className="text-white">82%</span>
                </div>
                <Progress value={82} className="h-2" />
                <div className="text-xs text-[#57ACAF] mt-1">Industry: 85%</div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#6F83A7]">Preventive Ratio</span>
                  <span className="text-white">68%</span>
                </div>
                <Progress value={68} className="h-2" />
                <div className="text-xs text-[#EAB308] mt-1">Target: 75%</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                onClick={() => setCurrentView('machine-directory')}
                className="w-full justify-start bg-gradient-to-r from-[#57ACAF]/20 to-transparent border border-[#57ACAF]/30 text-white hover:from-[#57ACAF]/30"
              >
                <Settings className="w-4 h-4 mr-2" />
                View All Machines
              </Button>
              <Button
                onClick={() => setCurrentView('maintenance-planner')}
                className="w-full justify-start bg-gradient-to-r from-[#EAB308]/20 to-transparent border border-[#EAB308]/30 text-white hover:from-[#EAB308]/30"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Maintenance
              </Button>
              <Button
                onClick={() => setCurrentView('spare-parts')}
                className="w-full justify-start bg-gradient-to-r from-[#6F83A7]/20 to-transparent border border-[#6F83A7]/30 text-white hover:from-[#6F83A7]/30"
              >
                <Package className="w-4 h-4 mr-2" />
                Manage Parts Inventory
              </Button>
              <Button
                onClick={() => {
                  onAskMarbim('Generate a detailed maintenance optimization report with cost-saving recommendations, schedule improvements, and strategic equipment replacement planning.');
                }}
                className="w-full justify-start bg-gradient-to-r from-white/10 to-transparent border border-white/10 text-white hover:from-white/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Report
              </Button>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white mb-1">Top Performing Machines</h3>
                <p className="text-xs text-[#6F83A7]">Highest uptime this month</p>
              </div>
              <Award className="w-5 h-5 text-[#EAB308]" />
            </div>
            <div className="space-y-3">
              {allMachinesData
                .filter(m => m.status === 'Active')
                .sort((a, b) => b.uptime - a.uptime)
                .slice(0, 3)
                .map((machine, index) => (
                  <div 
                    key={machine.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/10"
                    onClick={() => {
                      setSelectedMachine(machine);
                      setMachineDrawerOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        index === 0 ? 'bg-[#EAB308]/20' : 'bg-[#57ACAF]/20'
                      }`}>
                        <span className={index === 0 ? 'text-[#EAB308]' : 'text-[#57ACAF]'}>
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-white">{machine.id}</div>
                        <div className="text-xs text-[#6F83A7]">{machine.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">{machine.uptime}%</div>
                      <div className="text-xs text-[#57ACAF]">Uptime</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );

  const renderMachineDirectory = () => (
    <Tabs 
      defaultValue="all-machines" 
      value={machineDirectoryTab}
      onValueChange={setMachineDirectoryTab}
      className="space-y-6"
    >
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white text-lg">Machine Directory</h3>
          <p className="text-sm text-[#6F83A7]">Manage your equipment fleet and track machine health</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            onClick={() => setAddMachineDrawerOpen(true)}
            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Machine
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20">
        <TabsList className="w-full grid grid-cols-5 bg-transparent gap-1.5 p-0 h-auto">
          <TabsTrigger 
            value="all-machines" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Settings className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">All Machines</span>
          </TabsTrigger>
          <TabsTrigger 
            value="active-machines" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <CheckCircle2 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Active</span>
          </TabsTrigger>
          <TabsTrigger 
            value="maintenance" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Wrench className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Under Maintenance</span>
          </TabsTrigger>
          <TabsTrigger 
            value="watchlist" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Eye className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Watchlist</span>
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

      <TabsContent value="all-machines" className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6F83A7]">Total Machines</span>
              <Settings className="w-4 h-4 text-[#57ACAF]" />
            </div>
            <div className="text-2xl text-white mb-1">{allMachinesData.length}</div>
            <div className="text-xs text-[#57ACAF]">Across all lines</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6F83A7]">Avg Health Score</span>
              <Activity className="w-4 h-4 text-[#EAB308]" />
            </div>
            <div className="text-2xl text-white mb-1">87%</div>
            <div className="text-xs text-[#EAB308]">+2% this month</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6F83A7]">Avg Downtime</span>
              <Clock className="w-4 h-4 text-[#6F83A7]" />
            </div>
            <div className="text-2xl text-white mb-1">2.4h</div>
            <div className="text-xs text-[#6F83A7]">Per machine/month</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6F83A7]">High Risk</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl text-red-400 mb-1">{watchlistMachinesData.length}</div>
            <div className="text-xs text-red-400">Requires attention</div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAskMarbim('Analyze all machines and generate comprehensive fleet health report including uptime metrics, maintenance efficiency, cost analysis, and risk assessment.')}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <BarChart3 className="w-3 h-3 mr-2" />
              Fleet Health Report
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAskMarbim('Recommend optimal machine allocation strategy across production lines. Include capacity utilization analysis and efficiency optimization opportunities.')}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Target className="w-3 h-3 mr-2" />
              Allocation Analysis
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success('Exporting machine database', {
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
            onClick={() => onAskMarbim('Identify equipment gaps and recommend new machine acquisitions. Include ROI analysis, capacity planning, and technology upgrade opportunities.')}
            className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
          >
            <Sparkles className="w-3 h-3 mr-2" />
            Equipment Planning
          </Button>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">All Machines</h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                {allMachinesData.length} Total
              </Badge>
            </div>
          </div>
          <SmartTable
            columns={allMachinesColumns}
            data={allMachinesData}
            searchPlaceholder="Search machines..."
            onRowClick={handleRowClick}
          />
        </div>

        <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#57ACAF]" />
            </div>
            <div className="flex-1">
              <h4 className="text-white mb-1">AI Health Monitoring</h4>
              <p className="text-sm text-[#6F83A7]">
                MARBIM continuously monitors all machines using IoT sensor data and predicts potential failures before they occur. {watchlistMachinesData.length} machines currently require attention based on anomaly detection.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onAskMarbim('Provide detailed health analysis for all machines. Include IoT sensor trends, anomaly detection results, failure probability scores, and recommended preventive actions.')}
            variant="outline"
            className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)] shrink-0"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Full Analysis
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="active-machines" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6F83A7]">Active Machines</span>
              <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
            </div>
            <div className="text-2xl text-white mb-1">{activeMachinesData.length}</div>
            <div className="text-xs text-[#57ACAF]">Operational status</div>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6F83A7]">Avg Uptime</span>
              <TrendingUp className="w-4 h-4 text-[#EAB308]" />
            </div>
            <div className="text-2xl text-white mb-1">96.2%</div>
            <div className="text-xs text-[#EAB308]">Above target</div>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6F83A7]">Avg Efficiency</span>
              <Zap className="w-4 h-4 text-[#6F83A7]" />
            </div>
            <div className="text-2xl text-white mb-1">94%</div>
            <div className="text-xs text-[#6F83A7]">Performance rate</div>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6F83A7]">Next Service</span>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl text-white mb-1">5 days</div>
            <div className="text-xs text-[#6F83A7]">Average time</div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">Active Machines</h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                {activeMachinesData.length} Operational
              </Badge>
            </div>
          </div>
          <SmartTable
            columns={allMachinesColumns}
            data={activeMachinesData}
            searchPlaceholder="Search active machines..."
            onRowClick={handleRowClick}
          />
        </div>
      </TabsContent>

      <TabsContent value="maintenance" className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">Machines Under Maintenance</h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30">
                {maintenanceMachinesData.length} In Service
              </Badge>
            </div>
          </div>
          <SmartTable
            columns={allMachinesColumns}
            data={maintenanceMachinesData}
            searchPlaceholder="Search maintenance queue..."
            onRowClick={handleRowClick}
          />
        </div>
      </TabsContent>

      <TabsContent value="watchlist" className="space-y-6">
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-2">Risk Monitoring Watchlist</h4>
                <p className="text-sm text-[#6F83A7]">
                  {watchlistMachinesData.length} machines flagged as high or medium risk based on performance degradation, elevated sensor readings, or predicted failure probability.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onAskMarbim('Generate detailed risk assessment for all watchlist machines. Include failure probability analysis, recommended interventions, and priority rankings.')}
              className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black shrink-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Risk Analysis
            </Button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={allMachinesColumns}
            data={watchlistMachinesData}
            searchPlaceholder="Search watchlist..."
            onRowClick={handleRowClick}
          />
        </div>
      </TabsContent>

      <TabsContent value="ai-insights" className="space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-[#EAB308]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-2">MARBIM Fleet Intelligence Center</h3>
                <p className="text-sm text-[#6F83A7]">
                  Advanced AI analyzes {allMachinesData.length} machines across your entire fleet using real-time IoT sensor data, maintenance history, and production patterns. 
                  Predictive models forecast {breakdownMachinesData.length + 3} potential issues in the next 30 days with actionable recommendations.
                </p>
              </div>
            </div>
            <MarbimAIButton
              onClick={() => {
                onAskMarbim('Provide comprehensive AI fleet intelligence report including: 1) Predictive maintenance forecasts for next 90 days with failure probability scores, 2) Equipment optimization recommendations to improve OEE by 5-10%, 3) Cost reduction opportunities through preventive maintenance scheduling, 4) Strategic equipment planning and replacement roadmap, 5) Energy efficiency improvements, 6) Spare parts optimization analysis.');
              }}
              size="lg"
            />
          </div>

          {/* Key AI Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Prediction Accuracy</span>
              </div>
              <div className="text-2xl text-white mb-1">94.2%</div>
              <div className="text-xs text-[#57ACAF]">Last 90 days</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs text-[#6F83A7]">Cost Saved YTD</span>
              </div>
              <div className="text-2xl text-white mb-1">$45.2K</div>
              <div className="text-xs text-[#EAB308]">Preventive maintenance</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Downtime Reduced</span>
              </div>
              <div className="text-2xl text-white mb-1">-24%</div>
              <div className="text-xs text-[#57ACAF]">vs last quarter</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#D0342C]" />
                <span className="text-xs text-[#6F83A7]">Active Alerts</span>
              </div>
              <div className="text-2xl text-white mb-1">{breakdownMachinesData.length + 3}</div>
              <div className="text-xs text-[#D0342C]">Requires attention</div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Predictive Failure Analysis */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Failure Probability Forecast</h4>
                    <p className="text-xs text-[#6F83A7]">AI-predicted maintenance needs (next 30 days)</p>
                  </div>
                </div>
                <MarbimAIButton
                  variant="icon"
                  onClick={() => {
                    onAskMarbim('Provide detailed failure probability analysis for all flagged machines. Include root cause assessment, recommended interventions, parts needed, estimated costs, and optimal scheduling to minimize production impact.');
                  }}
                />
              </div>
              
              <div className="space-y-3">
                {/* Critical - High Probability */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">MCH-004 Motor Overheating</span>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6F83A7]">Failure Probability</span>
                          <span className="text-red-400 font-medium">95%</span>
                        </div>
                        <Progress value={95} className="h-1.5 bg-white/5" />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#6F83A7]">Predicted in 2-4 days</span>
                          <span className="text-white">$3,200 repair cost</span>
                        </div>
                        <p className="text-xs text-[#6F83A7] pt-1">
                          Temperature sensors show 15% above threshold. Vibration patterns indicate bearing wear. Immediate shutdown recommended.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* High - Moderate Probability */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Activity className="w-4 h-4 text-[#EAB308]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">MCH-003 Belt Replacement</span>
                        <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30">High</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6F83A7]">Failure Probability</span>
                          <span className="text-[#EAB308] font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-1.5 bg-white/5" />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#6F83A7]">Predicted in 7-10 days</span>
                          <span className="text-white">$450 parts cost</span>
                        </div>
                        <p className="text-xs text-[#6F83A7] pt-1">
                          Belt tension degradation detected. Schedule during next planned downtime to avoid emergency repair.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medium */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Settings className="w-4 h-4 text-[#6F83A7]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">MCH-007 Calibration Drift</span>
                        <Badge className="bg-[#6F83A7]/20 text-[#6F83A7] border-[#6F83A7]/30">Medium</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6F83A7]">Failure Probability</span>
                          <span className="text-[#6F83A7] font-medium">45%</span>
                        </div>
                        <Progress value={45} className="h-1.5 bg-white/5" />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#6F83A7]">Predicted in 18-21 days</span>
                          <span className="text-white">$180 calibration</span>
                        </div>
                        <p className="text-xs text-[#6F83A7] pt-1">
                          Output precision declining. Schedule calibration service to maintain quality standards.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Optimization Insights */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Cost Optimization Opportunities</h4>
                    <p className="text-xs text-[#6F83A7]">AI-identified savings potential</p>
                  </div>
                </div>
                <MarbimAIButton
                  variant="icon"
                  onClick={() => {
                    onAskMarbim('Analyze all cost optimization opportunities across fleet. Provide detailed breakdown of savings potential, implementation steps, ROI calculations, and prioritized action plan.');
                  }}
                />
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 hover:border-[#57ACAF]/30 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-[#57ACAF]" />
                      <span className="text-white font-medium">Preventive Maintenance Shift</span>
                    </div>
                    <span className="text-[#57ACAF] font-medium">$18.5K/yr</span>
                  </div>
                  <p className="text-sm text-[#6F83A7] mb-2">
                    Increase preventive maintenance ratio from 68% to 80% to reduce costly emergency repairs
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30 text-xs">High Impact</Badge>
                    <span className="text-xs text-[#6F83A7]">Implementation: 2 weeks</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 hover:border-[#57ACAF]/30 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#57ACAF]" />
                      <span className="text-white font-medium">Energy Efficiency Upgrades</span>
                    </div>
                    <span className="text-[#57ACAF] font-medium">$12.3K/yr</span>
                  </div>
                  <p className="text-sm text-[#6F83A7] mb-2">
                    Optimize idle time on Lines A & B to reduce energy consumption by 15%
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 text-xs">Medium Impact</Badge>
                    <span className="text-xs text-[#6F83A7]">ROI: 8 months</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 hover:border-[#57ACAF]/30 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#57ACAF]" />
                      <span className="text-white font-medium">Spare Parts Consolidation</span>
                    </div>
                    <span className="text-[#57ACAF] font-medium">$8.7K/yr</span>
                  </div>
                  <p className="text-sm text-[#6F83A7] mb-2">
                    Consolidate supplier orders and optimize inventory levels to reduce holding costs
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#6F83A7]/20 text-[#6F83A7] border-[#6F83A7]/30 text-xs">Quick Win</Badge>
                    <span className="text-xs text-[#6F83A7]">Immediate savings</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Total Annual Savings Potential</span>
                  <span className="text-xl text-[#57ACAF] font-medium">$39.5K</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Equipment Health Scorecard */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Fleet Health Scorecard</h4>
                    <p className="text-xs text-[#6F83A7]">Real-time predictive health monitoring</p>
                  </div>
                </div>
                <MarbimAIButton
                  variant="icon"
                  onClick={() => {
                    onAskMarbim('Analyze fleet health trends and provide detailed assessment of each machine\'s health trajectory. Include anomaly detection results, sensor data analysis, and recommended preventive actions.');
                  }}
                />
              </div>

              <div className="space-y-3">
                {allMachinesData.slice(0, 8).map((machine) => (
                  <div 
                    key={machine.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedMachine(machine);
                      setMachineDrawerOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-2 h-2 rounded-full ${
                        machine.healthScore >= 90 ? 'bg-[#57ACAF]' : 
                        machine.healthScore >= 75 ? 'bg-[#EAB308]' : 
                        'bg-red-400'
                      }`} />
                      <div>
                        <div className="text-sm text-white">{machine.id}</div>
                        <div className="text-xs text-[#6F83A7]">{machine.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          machine.healthScore >= 90 ? 'text-[#57ACAF]' : 
                          machine.healthScore >= 75 ? 'text-[#EAB308]' : 
                          'text-red-400'
                        }`}>
                          {machine.healthScore}%
                        </div>
                        <div className="text-xs text-[#6F83A7]">{machine.uptime}% uptime</div>
                      </div>
                      <Progress value={machine.healthScore} className="w-16 h-1.5" />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setMachineDirectoryTab('all-machines')}
                variant="outline"
                className="w-full mt-4 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                View All {allMachinesData.length} Machines
              </Button>
            </div>

            {/* Performance Optimization Recommendations */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Performance Optimization</h4>
                    <p className="text-xs text-[#6F83A7]">AI-powered efficiency recommendations</p>
                  </div>
                </div>
                <MarbimAIButton
                  variant="icon"
                  onClick={() => {
                    onAskMarbim('Provide comprehensive performance optimization strategy including OEE improvement tactics, bottleneck analysis, capacity utilization optimization, and machine allocation recommendations.');
                  }}
                />
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-sm text-white font-medium">OEE Improvement Potential</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#6F83A7]">Current OEE</span>
                    <span className="text-white">82%</span>
                  </div>
                  <Progress value={82} className="h-2 mb-2" />
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#6F83A7]">Potential OEE</span>
                    <span className="text-[#57ACAF]">89%</span>
                  </div>
                  <Progress value={89} className="h-2 mb-3" />
                  <p className="text-xs text-[#6F83A7]">
                    Implementing recommended optimizations could increase OEE by 7 percentage points
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-sm text-white font-medium">Capacity Utilization</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6F83A7]">Line A</span>
                      <span className="text-white">94%</span>
                    </div>
                    <Progress value={94} className="h-1.5" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6F83A7]">Line B</span>
                      <span className="text-white">87%</span>
                    </div>
                    <Progress value={87} className="h-1.5" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6F83A7]">Line C</span>
                      <span className="text-[#EAB308]">76%</span>
                    </div>
                    <Progress value={76} className="h-1.5" />
                  </div>
                  <p className="text-xs text-[#6F83A7] mt-3">
                    Rebalance Line C allocation to improve overall throughput
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#6F83A7]" />
                    <span className="text-sm text-white font-medium">Schedule Optimization</span>
                  </div>
                  <p className="text-xs text-[#6F83A7] mb-3">
                    Batch 6 maintenance tasks during weekend shift to minimize production impact
                  </p>
                  <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30 text-xs">
                    Saves 18 hours downtime
                  </Badge>
                </div>
              </div>
            </div>

            {/* Strategic Equipment Planning */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#6F83A7]" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Strategic Planning</h4>
                    <p className="text-xs text-[#6F83A7]">Long-term equipment roadmap</p>
                  </div>
                </div>
                <MarbimAIButton
                  variant="icon"
                  onClick={() => {
                    onAskMarbim('Develop comprehensive 3-year equipment strategy including replacement planning, technology upgrades, capacity expansion recommendations, and detailed ROI analysis for each initiative.');
                  }}
                />
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">Equipment Replacement Queue</span>
                    <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30">4 machines</Badge>
                  </div>
                  <p className="text-xs text-[#6F83A7]">
                    MCH-001, MCH-012, MCH-024, MCH-031 approaching end-of-life
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">Technology Upgrades</span>
                    <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">ROI 18mo</Badge>
                  </div>
                  <p className="text-xs text-[#6F83A7]">
                    IoT sensor retrofit for 12 legacy machines recommended
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">Capacity Expansion</span>
                    <Badge className="bg-[#6F83A7]/20 text-[#6F83A7] border-[#6F83A7]/30">Q2 2025</Badge>
                  </div>
                  <p className="text-xs text-[#6F83A7]">
                    3 additional cutting machines needed to support growth projections
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-gradient-to-r from-[#57ACAF]/10 via-[#EAB308]/10 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white mb-1">Ready for Deeper Insights?</h4>
                <p className="text-sm text-[#6F83A7]">
                  Ask MARBIM anything about your fleet performance, optimization strategies, or long-term planning
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                onAskMarbim('I need strategic guidance on fleet management. Please analyze: 1) Top 3 priorities for improving fleet efficiency this quarter, 2) Equipment investments with highest ROI, 3) Risk mitigation strategy for high-probability failure predictions, 4) Maintenance team resource allocation optimization, 5) Benchmark comparison vs industry standards.');
              }}
              className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ask MARBIM
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderMaintenancePlanner = () => (
    <Tabs 
      defaultValue="scheduled-tasks" 
      value={maintenancePlannerTab}
      onValueChange={setMaintenancePlannerTab}
      className="space-y-6"
    >
      <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20">
        <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
          <TabsTrigger 
            value="scheduled-tasks" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Calendar className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Scheduled</span>
          </TabsTrigger>
          <TabsTrigger 
            value="in-progress" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Activity className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">In Progress</span>
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <CheckCircle2 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Completed</span>
          </TabsTrigger>
          <TabsTrigger 
            value="calendar-view" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Eye className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Calendar View</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="scheduled-tasks" className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAskMarbim('Analyze maintenance schedule and suggest optimal timing to minimize production disruption. Include line utilization patterns and peak hours analysis.')}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Target className="w-3 h-3 mr-2" />
              Optimize Schedule
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success('Generating maintenance calendar');
              }}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Download className="w-3 h-3 mr-2" />
              Export Calendar
            </Button>
          </div>
          <Button
            onClick={() => setScheduleDrawerOpen(true)}
            className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
          >
            <Plus className="w-3 h-3 mr-2" />
            Schedule Maintenance
          </Button>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={taskColumns}
            data={scheduledTasksData}
            onRowClick={handleRowClick}
            searchPlaceholder="Search scheduled tasks..."
          />
        </div>
      </TabsContent>

      <TabsContent value="in-progress" className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={taskColumns}
            data={inProgressTasksData}
            onRowClick={handleRowClick}
            searchPlaceholder="Search active tasks..."
          />
        </div>
      </TabsContent>

      <TabsContent value="completed" className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={taskColumns}
            data={completedTasksData}
            onRowClick={handleRowClick}
            searchPlaceholder="Search completed tasks..."
          />
        </div>
      </TabsContent>

      <TabsContent value="calendar-view" className="space-y-6">
        {/* Calendar Controls */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success('Moving to previous month');
              }}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              Previous
            </Button>
            <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <span className="text-white font-medium">December 2024</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success('Moving to next month');
              }}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              Next
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAskMarbim('Analyze the maintenance calendar for December and identify potential scheduling conflicts, resource bottlenecks, and optimization opportunities.')}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              AI Analysis
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success('Exporting calendar to PDF');
              }}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Download className="w-3 h-3 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => setScheduleDrawerOpen(true)}
              className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
            >
              <Plus className="w-3 h-3 mr-2" />
              Schedule Task
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-5 gap-3">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EAB308]"></div>
            <span className="text-xs text-[#6F83A7]">Preventive</span>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
            <span className="text-xs text-[#6F83A7]">Repair</span>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#57ACAF]"></div>
            <span className="text-xs text-[#6F83A7]">Inspection</span>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
            <span className="text-xs text-[#6F83A7]">Calibration</span>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
            <span className="text-xs text-[#6F83A7]">Cleaning</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          {/* Calendar Header - Days of Week */}
          <div className="grid grid-cols-7 bg-gradient-to-r from-white/10 via-white/5 to-white/10 border-b border-white/10">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <div key={day} className="p-4 text-center">
                <span className="text-sm text-[#6F83A7] font-medium">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Body - Dates */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {/* Week 1 */}
            {/* Nov 26-30 (previous month) */}
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 bg-white/[0.02]">
              <span className="text-xs text-[#6F83A7]/50">26</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 bg-white/[0.02]">
              <span className="text-xs text-[#6F83A7]/50">27</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 bg-white/[0.02]">
              <span className="text-xs text-[#6F83A7]/50">28</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 bg-white/[0.02]">
              <span className="text-xs text-[#6F83A7]/50">29</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 bg-white/[0.02]">
              <span className="text-xs text-[#6F83A7]/50">30</span>
            </div>
            {/* Dec 1-2 */}
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">1</span>
            </div>
            <div className="min-h-[140px] p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">2</span>
              <div className="mt-2 space-y-1">
                <div 
                  onClick={() => {
                    setSelectedTask(scheduledTasksData[0]);
                    setTaskDrawerOpen(true);
                  }}
                  className="p-1.5 rounded bg-[#EAB308]/10 border-l-2 border-[#EAB308] hover:bg-[#EAB308]/20 transition-colors cursor-pointer"
                >
                  <p className="text-[10px] text-white truncate">MCH-001 PM</p>
                  <p className="text-[9px] text-[#6F83A7]">8:00 AM</p>
                </div>
              </div>
            </div>

            {/* Week 2 */}
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">3</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">4</span>
              <div className="mt-2 space-y-1">
                <div 
                  onClick={() => {
                    setSelectedTask(scheduledTasksData[1]);
                    setTaskDrawerOpen(true);
                  }}
                  className="p-1.5 rounded bg-[#EF4444]/10 border-l-2 border-[#EF4444] hover:bg-[#EF4444]/20 transition-colors cursor-pointer"
                >
                  <p className="text-[10px] text-white truncate">MCH-003 Repair</p>
                  <p className="text-[9px] text-[#6F83A7]">10:00 AM</p>
                </div>
              </div>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">5</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">6</span>
              <div className="mt-2 space-y-1">
                <div 
                  onClick={() => {
                    setSelectedTask(scheduledTasksData[2]);
                    setTaskDrawerOpen(true);
                  }}
                  className="p-1.5 rounded bg-[#57ACAF]/10 border-l-2 border-[#57ACAF] hover:bg-[#57ACAF]/20 transition-colors cursor-pointer"
                >
                  <p className="text-[10px] text-white truncate">Line A Inspect</p>
                  <p className="text-[9px] text-[#6F83A7]">2:00 PM</p>
                </div>
              </div>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">7</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">8</span>
            </div>
            <div className="min-h-[140px] p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">9</span>
              <div className="mt-2 space-y-1">
                <div 
                  onClick={() => {
                    setSelectedTask(scheduledTasksData[3]);
                    setTaskDrawerOpen(true);
                  }}
                  className="p-1.5 rounded bg-[#8B5CF6]/10 border-l-2 border-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition-colors cursor-pointer"
                >
                  <p className="text-[10px] text-white truncate">MCH-002 Calib</p>
                  <p className="text-[9px] text-[#6F83A7]">9:00 AM</p>
                </div>
              </div>
            </div>

            {/* Week 3 */}
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">10</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">11</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">12</span>
              <div className="mt-2 space-y-1">
                <div 
                  onClick={() => {
                    setSelectedTask(scheduledTasksData[4]);
                    setTaskDrawerOpen(true);
                  }}
                  className="p-1.5 rounded bg-[#F59E0B]/10 border-l-2 border-[#F59E0B] hover:bg-[#F59E0B]/20 transition-colors cursor-pointer"
                >
                  <p className="text-[10px] text-white truncate">Deep Cleaning</p>
                  <p className="text-[9px] text-[#6F83A7]">6:00 PM</p>
                </div>
              </div>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">13</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">14</span>
              <div className="mt-2 space-y-1">
                <div className="p-1.5 rounded bg-[#EAB308]/10 border-l-2 border-[#EAB308] hover:bg-[#EAB308]/20 transition-colors cursor-pointer">
                  <p className="text-[10px] text-white truncate">MCH-005 PM</p>
                  <p className="text-[9px] text-[#6F83A7]">8:00 AM</p>
                </div>
                <div className="p-1.5 rounded bg-[#57ACAF]/10 border-l-2 border-[#57ACAF] hover:bg-[#57ACAF]/20 transition-colors cursor-pointer">
                  <p className="text-[10px] text-white truncate">Safety Check</p>
                  <p className="text-[9px] text-[#6F83A7]">3:00 PM</p>
                </div>
              </div>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">15</span>
            </div>
            <div className="min-h-[140px] p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">16</span>
            </div>

            {/* Week 4 */}
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">17</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">18</span>
              <div className="mt-2 space-y-1">
                <div className="p-1.5 rounded bg-[#EF4444]/10 border-l-2 border-[#EF4444] hover:bg-[#EF4444]/20 transition-colors cursor-pointer">
                  <p className="text-[10px] text-white truncate">MCH-007 Repair</p>
                  <p className="text-[9px] text-[#6F83A7]">11:00 AM</p>
                </div>
              </div>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">19</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">20</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">21</span>
              <div className="mt-2 space-y-1">
                <div className="p-1.5 rounded bg-[#8B5CF6]/10 border-l-2 border-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition-colors cursor-pointer">
                  <p className="text-[10px] text-white truncate">Calibration</p>
                  <p className="text-[9px] text-[#6F83A7]">1:00 PM</p>
                </div>
              </div>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">22</span>
            </div>
            <div className="min-h-[140px] p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">23</span>
              <div className="mt-2 space-y-1">
                <div className="p-1.5 rounded bg-[#EAB308]/10 border-l-2 border-[#EAB308] hover:bg-[#EAB308]/20 transition-colors cursor-pointer">
                  <p className="text-[10px] text-white truncate">MCH-008 PM</p>
                  <p className="text-[9px] text-[#6F83A7]">7:00 AM</p>
                </div>
              </div>
            </div>

            {/* Week 5 */}
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">24</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">25</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">26</span>
              <div className="mt-2 space-y-1">
                <div className="p-1.5 rounded bg-[#57ACAF]/10 border-l-2 border-[#57ACAF] hover:bg-[#57ACAF]/20 transition-colors cursor-pointer">
                  <p className="text-[10px] text-white truncate">Full Inspection</p>
                  <p className="text-[9px] text-[#6F83A7]">9:00 AM</p>
                </div>
              </div>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">27</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">28</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">29</span>
            </div>
            <div className="min-h-[140px] p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">30</span>
              <div className="mt-2 space-y-1">
                <div className="p-1.5 rounded bg-[#F59E0B]/10 border-l-2 border-[#F59E0B] hover:bg-[#F59E0B]/20 transition-colors cursor-pointer">
                  <p className="text-[10px] text-white truncate">Year-End Clean</p>
                  <p className="text-[9px] text-[#6F83A7]">5:00 PM</p>
                </div>
              </div>
            </div>

            {/* Week 6 */}
            <div className="min-h-[140px] p-3 border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <span className="text-xs text-white font-medium">31</span>
            </div>
            {/* Jan 1-6 (next month) */}
            <div className="min-h-[140px] p-3 border-r border-white/5 bg-white/[0.02]">
              <span className="text-xs text-[#6F83A7]/50">1</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-white/5 bg-white/[0.02]">
              <span className="text-xs text-[#6F83A7]/50">2</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-white/5 bg-white/[0.02]">
              <span className="text-xs text-[#6F83A7]/50">3</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-white/5 bg-white/[0.02]">
              <span className="text-xs text-[#6F83A7]/50">4</span>
            </div>
            <div className="min-h-[140px] p-3 border-r border-white/5 bg-white/[0.02]">
              <span className="text-xs text-[#6F83A7]/50">5</span>
            </div>
            <div className="min-h-[140px] p-3 border-white/5 bg-white/[0.02]">
              <span className="text-xs text-[#6F83A7]/50">6</span>
            </div>
          </div>
        </div>

        {/* Calendar Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-5 h-5 text-[#57ACAF]" />
              <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                December
              </Badge>
            </div>
            <p className="text-2xl text-white mb-1">18</p>
            <p className="text-xs text-[#6F83A7]">Total Tasks Scheduled</p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-5 h-5 text-[#EAB308]" />
              <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                Avg
              </Badge>
            </div>
            <p className="text-2xl text-white mb-1">3.2h</p>
            <p className="text-xs text-[#6F83A7]">Average Task Duration</p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-[#6F83A7]" />
              <Badge className="bg-white/10 text-white border border-white/20 text-xs">
                Active
              </Badge>
            </div>
            <p className="text-2xl text-white mb-1">5</p>
            <p className="text-xs text-[#6F83A7]">Technicians Assigned</p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-5 h-5 text-[#57ACAF]" />
              <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                On Track
              </Badge>
            </div>
            <p className="text-2xl text-white mb-1">94%</p>
            <p className="text-xs text-[#6F83A7]">Schedule Adherence</p>
          </div>
        </div>

        {/* AI Insights */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#EAB308]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-white">Calendar Optimization Insights</h4>
                <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                  AI Analysis
                </Badge>
              </div>
              <p className="text-sm text-[#6F83A7] mb-3">
                December shows a well-balanced maintenance schedule. However, December 14th has 2 overlapping tasks that might strain resources. 
                Consider moving the Safety Check to December 15th to optimize technician allocation.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Optimal utilization: 87%
                </Badge>
                <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  1 potential conflict
                </Badge>
                <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Weekend slots available
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderBreakdowns = () => (
    <Tabs 
      defaultValue="active-breakdowns" 
      value={breakdownsTab}
      onValueChange={setBreakdownsTab}
      className="space-y-6"
    >
      <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20">
        <TabsList className="w-full grid grid-cols-3 bg-transparent gap-1.5 p-0 h-auto">
          <TabsTrigger 
            value="active-breakdowns" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <AlertTriangle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Active Breakdowns</span>
          </TabsTrigger>
          <TabsTrigger 
            value="repair-history" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Wrench className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Repair History</span>
          </TabsTrigger>
          <TabsTrigger 
            value="root-cause" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Root Cause Analysis</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="active-breakdowns" className="space-y-6">
        <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-2">Critical Machine Failures</h4>
                <p className="text-sm text-[#6F83A7]">
                  {breakdownMachinesData.length} machine(s) currently experiencing breakdowns requiring immediate repair.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onAskMarbim('Analyze all active breakdowns and recommend emergency repair prioritization. Include impact assessment, estimated repair time, and resource allocation.')}
              className="bg-red-500 hover:bg-red-500/90 text-white shrink-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI Triage
            </Button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={allMachinesColumns}
            data={breakdownMachinesData}
            searchPlaceholder="Search active breakdowns..."
            onRowClick={handleRowClick}
          />
        </div>
      </TabsContent>

      <TabsContent value="repair-history" className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <Wrench className="w-5 h-5 text-[#57ACAF]" />
              <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                Total
              </Badge>
            </div>
            <p className="text-2xl text-white mb-1">{repairHistoryData.length}</p>
            <p className="text-xs text-[#6F83A7]">Repairs Completed</p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-5 h-5 text-[#EAB308]" />
              <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                Avg
              </Badge>
            </div>
            <p className="text-2xl text-white mb-1">12.6h</p>
            <p className="text-xs text-[#6F83A7]">Average Downtime</p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-5 h-5 text-[#6F83A7]" />
              <Badge className="bg-white/10 text-white border border-white/20 text-xs">
                Total
              </Badge>
            </div>
            <p className="text-2xl text-white mb-1">$9.6K</p>
            <p className="text-xs text-[#6F83A7]">Total Repair Cost</p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
              <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                Rate
              </Badge>
            </div>
            <p className="text-2xl text-white mb-1">94%</p>
            <p className="text-xs text-[#6F83A7]">First-Time Fix Rate</p>
          </div>
        </div>

        {/* AI Insights */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#EAB308]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-white">Repair Trend Analysis</h4>
                <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                  AI Insights
                </Badge>
              </div>
              <p className="text-sm text-[#6F83A7] mb-3">
                Mechanical failures account for 50% of all repairs. MCH-003 (Overlock) has the highest repair frequency. 
                Critical severity repairs cost 2.3x more than medium severity. Preventive actions reduced repeat failures by 68%.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  4 mechanical failures
                </Badge>
                <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Peak: Monday mornings
                </Badge>
                <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                  <Target className="w-3 h-3 mr-1" />
                  68% prevention success
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Actions Bar */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success('Filtering by date range');
              }}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Calendar className="w-3 h-3 mr-2" />
              Last 30 Days
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success('Filtering by severity');
              }}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Filter className="w-3 h-3 mr-2" />
              All Severity
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success('Filtering by machine');
              }}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Settings className="w-3 h-3 mr-2" />
              All Machines
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAskMarbim('Analyze repair history patterns and provide recommendations to reduce breakdown frequency, minimize downtime, and optimize maintenance schedules based on failure trends.')}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              AI Analysis
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success('Exporting repair history to Excel');
              }}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Download className="w-3 h-3 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Repair History Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={[
              {
                key: 'ticketNo',
                label: 'Ticket #',
                sortable: true,
                render: (value, record) => (
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{value}</span>
                    {record.severity === 'Critical' && (
                      <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs">
                        Critical
                      </Badge>
                    )}
                    {record.severity === 'High' && (
                      <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs">
                        High
                      </Badge>
                    )}
                    {record.severity === 'Medium' && (
                      <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                        Medium
                      </Badge>
                    )}
                    {record.severity === 'Low' && (
                      <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                        Low
                      </Badge>
                    )}
                  </div>
                )
              },
              {
                key: 'machineId',
                label: 'Machine',
                sortable: true,
                render: (value, record) => (
                  <div>
                    <p className="text-white font-medium">{value}</p>
                    <p className="text-xs text-[#6F83A7]">{record.machineType}</p>
                  </div>
                )
              },
              {
                key: 'issueType',
                label: 'Issue Type',
                sortable: true,
                render: (value) => (
                  <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                    {value}
                  </Badge>
                )
              },
              {
                key: 'description',
                label: 'Description',
                render: (value) => (
                  <p className="text-sm text-[#6F83A7] max-w-xs truncate">{value}</p>
                )
              },
              {
                key: 'technician',
                label: 'Technician',
                sortable: true,
                render: (value) => (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center">
                      <span className="text-white text-xs">{value.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <span className="text-white text-sm">{value}</span>
                  </div>
                )
              },
              {
                key: 'downtime',
                label: 'Downtime',
                sortable: true,
                render: (value) => (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#EAB308]" />
                    <span className="text-white text-sm">{value}</span>
                  </div>
                )
              },
              {
                key: 'repairCost',
                label: 'Cost',
                sortable: true,
                render: (value) => (
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#6F83A7]" />
                    <span className="text-white text-sm">${value}</span>
                  </div>
                )
              },
              {
                key: 'repairCompleted',
                label: 'Completed',
                sortable: true,
                render: (value) => (
                  <div>
                    <p className="text-white text-sm">{value}</p>
                  </div>
                )
              },
              {
                key: 'status',
                label: 'Status',
                render: (value) => (
                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {value}
                  </Badge>
                )
              }
            ]}
            data={repairHistoryData}
            searchPlaceholder="Search repair history..."
            onRowClick={(record) => {
              setSelectedRepair(record);
              setRepairDrawerOpen(true);
            }}
          />
        </div>

        {/* Bottom Insights Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <h4 className="text-white text-sm mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#57ACAF]" />
              Top Issues
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6F83A7]">Mechanical Failure</span>
                <Badge className="bg-white/5 text-white border border-white/10 text-xs">4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6F83A7]">Electrical Failure</span>
                <Badge className="bg-white/5 text-white border border-white/10 text-xs">2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6F83A7]">Performance Issue</span>
                <Badge className="bg-white/5 text-white border border-white/10 text-xs">2</Badge>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <h4 className="text-white text-sm mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#57ACAF]" />
              Technician Performance
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6F83A7]">John Smith</span>
                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">2 repairs</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6F83A7]">Sarah Johnson</span>
                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">2 repairs</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6F83A7]">Mike Chen</span>
                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">2 repairs</Badge>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <h4 className="text-white text-sm mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#57ACAF]" />
              Parts Frequently Replaced
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6F83A7]">Tension Assembly</span>
                <Badge className="bg-white/5 text-white border border-white/10 text-xs">2x</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6F83A7]">Motor Assembly</span>
                <Badge className="bg-white/5 text-white border border-white/10 text-xs">1x</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6F83A7]">Drive Belt</span>
                <Badge className="bg-white/5 text-white border border-white/10 text-xs">1x</Badge>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="root-cause" className="space-y-6">
        {/* AI Root Cause Analysis Header */}
        <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-[#EAB308]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-2">AI Root Cause Analysis</h3>
                <p className="text-sm text-[#6F83A7]">
                  MARBIM analyzes breakdown patterns across 127 historical incidents to identify root causes and prevent recurring failures.
                </p>
              </div>
            </div>
            <MarbimAIButton
              onClick={() => {
                onAskMarbim('Perform comprehensive root cause analysis for all machine breakdowns. Identify common failure patterns, recommend preventive measures, and suggest process improvements.');
              }}
            />
          </div>

          {/* Analysis Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-[#6F83A7] mb-1">Total Incidents Analyzed</p>
              <p className="text-xl text-white">127</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-[#6F83A7] mb-1">Patterns Identified</p>
              <p className="text-xl text-white">8</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-[#6F83A7] mb-1">Preventable Rate</p>
              <p className="text-xl text-white">67%</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-[#6F83A7] mb-1">Avg Resolution Time</p>
              <p className="text-xl text-white">4.2h</p>
            </div>
          </div>
        </div>

        {/* Top Contributing Factors */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#EAB308]" />
              Top Contributing Factors
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Preventive Maintenance Overdue</span>
                  <span className="text-sm text-[#EAB308]">32%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/60" style={{ width: '32%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Component Age/Wear</span>
                  <span className="text-sm text-[#EAB308]">24%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/60" style={{ width: '24%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Operator Error</span>
                  <span className="text-sm text-red-400">18%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-red-400" style={{ width: '18%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Environmental Factors</span>
                  <span className="text-sm text-[#6F83A7]">12%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#6F83A7] to-[#6F83A7]/60" style={{ width: '12%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Power Quality Issues</span>
                  <span className="text-sm text-[#6F83A7]">8%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#6F83A7] to-[#6F83A7]/60" style={{ width: '8%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Other</span>
                  <span className="text-sm text-[#6F83A7]">6%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#6F83A7] to-[#6F83A7]/60" style={{ width: '6%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Most Affected Systems */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#57ACAF]" />
              Most Affected Systems
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Motor Assembly</p>
                    <p className="text-xs text-[#6F83A7]">42 incidents</p>
                  </div>
                </div>
                <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs">
                  Critical
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Electrical System</p>
                    <p className="text-xs text-[#6F83A7]">28 incidents</p>
                  </div>
                </div>
                <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                  High
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#6F83A7]" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Hydraulic System</p>
                    <p className="text-xs text-[#6F83A7]">19 incidents</p>
                  </div>
                </div>
                <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20 text-xs">
                  Medium
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-[#6F83A7]" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Transmission</p>
                    <p className="text-xs text-[#6F83A7]">15 incidents</p>
                  </div>
                </div>
                <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20 text-xs">
                  Medium
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Cooling System</p>
                    <p className="text-xs text-[#6F83A7]">11 incidents</p>
                  </div>
                </div>
                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                  Low
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Recurring Failure Patterns */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
          <h3 className="text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#EAB308]" />
            Recurring Failure Patterns Detected
          </h3>
          <div className="space-y-4">
            {/* Pattern 1 */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white">Motor Overheating Cycle</h4>
                      <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs">
                        18 occurrences
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6F83A7] mb-3">
                      Pattern shows motor failures occurring after 800-850 operating hours when preventive maintenance is delayed beyond scheduled interval. Temperature sensors indicate gradual increase in operating temperature before failure.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-xs text-[#6F83A7] mb-1">Avg Hours to Failure</p>
                        <p className="text-sm text-white">824h</p>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-xs text-[#6F83A7] mb-1">Financial Impact</p>
                        <p className="text-sm text-white">$12,400</p>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-xs text-[#6F83A7] mb-1">Downtime</p>
                        <p className="text-sm text-white">86h</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10">
                <Button
                  size="sm"
                  onClick={() => onAskMarbim('Analyze the motor overheating failure pattern in detail. Provide specific recommendations for preventive maintenance scheduling, temperature monitoring thresholds, and maintenance procedures to prevent this recurring issue.')}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-[rgba(255,255,255,0)]"
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  Detailed Analysis
                </Button>
              </div>
            </div>

            {/* Pattern 2 */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-[#EAB308]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white">Electrical Component Degradation</h4>
                      <Badge className="bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30 text-xs">
                        12 occurrences
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6F83A7] mb-3">
                      Power quality fluctuations and voltage spikes correlated with electrical component failures. Pattern shows higher failure rate during monsoon season (June-Sept) and in production floor areas with older wiring infrastructure.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-xs text-[#6F83A7] mb-1">Seasonal Risk</p>
                        <p className="text-sm text-white">Jun-Sep</p>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-xs text-[#6F83A7] mb-1">Financial Impact</p>
                        <p className="text-sm text-white">$8,200</p>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-xs text-[#6F83A7] mb-1">Downtime</p>
                        <p className="text-sm text-white">48h</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10">
                <Button
                  size="sm"
                  onClick={() => onAskMarbim('Analyze the electrical component degradation pattern. Recommend power quality monitoring solutions, voltage stabilization equipment, and preventive replacement schedules for at-risk components.')}
                  variant="outline"
                  className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  Detailed Analysis
                </Button>
              </div>
            </div>

            {/* Pattern 3 */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-[#6F83A7]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white">Operator-Related Issues</h4>
                      <Badge className="bg-[#6F83A7]/20 text-[#6F83A7] border border-[#6F83A7]/30 text-xs">
                        9 occurrences
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6F83A7] mb-3">
                      Analysis reveals correlation between machine mishandling and specific shifts with newer operators. Common issues include improper startup procedures, incorrect parameter settings, and missed pre-operation checks.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-xs text-[#6F83A7] mb-1">Training Gap</p>
                        <p className="text-sm text-white">High</p>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-xs text-[#6F83A7] mb-1">Financial Impact</p>
                        <p className="text-sm text-white">$5,600</p>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-xs text-[#6F83A7] mb-1">Downtime</p>
                        <p className="text-sm text-white">32h</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10">
                <Button
                  size="sm"
                  onClick={() => onAskMarbim('Analyze operator-related failure patterns. Recommend training program improvements, certification requirements, digital work instruction systems, and operational safety protocols.')}
                  variant="outline"
                  className="border-[#6F83A7]/30 text-[#6F83A7] hover:bg-[#6F83A7]/10 bg-[rgba(255,255,255,0)]"
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  Detailed Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Machine-Specific Risk Analysis */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
          <h3 className="text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
            Machine-Specific Risk Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">MCH-003 - Overlock Machine</span>
                  <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs">
                    High Risk
                  </Badge>
                </div>
                <p className="text-xs text-[#6F83A7] mb-2">8 breakdowns in 6 months • Last PM overdue by 12 days</p>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-red-400" style={{ width: '85%' }}></div>
                </div>
              </div>
              <span className="text-xl text-red-400">85%</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">MCH-012 - Cutting Machine</span>
                  <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                    Medium Risk
                  </Badge>
                </div>
                <p className="text-xs text-[#6F83A7] mb-2">5 breakdowns in 6 months • Motor replacement recommended</p>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/60" style={{ width: '62%' }}></div>
                </div>
              </div>
              <span className="text-xl text-[#EAB308]">62%</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">MCH-007 - Flatbed Machine</span>
                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                    Low Risk
                  </Badge>
                </div>
                <p className="text-xs text-[#6F83A7] mb-2">1 breakdown in 6 months • Regular maintenance on schedule</p>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/60" style={{ width: '18%' }}></div>
                </div>
              </div>
              <span className="text-xl text-[#57ACAF]">18%</span>
            </div>
          </div>
        </div>

        {/* Preventive Action Recommendations */}
        <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-6">
          <h3 className="text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
            AI-Recommended Preventive Actions
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm mb-1">Implement Predictive Maintenance Schedule</h4>
                <p className="text-xs text-[#6F83A7] mb-2">
                  Replace reactive maintenance with condition-based scheduling for motor assemblies. Expected reduction: 32% in motor failures.
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                    Est. Savings: $18K/year
                  </Badge>
                  <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                    ROI: 240%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm mb-1">Install Power Quality Monitoring</h4>
                <p className="text-xs text-[#6F83A7] mb-2">
                  Deploy voltage monitoring on critical machines to detect power quality issues before component damage occurs.
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                    Est. Savings: $12K/year
                  </Badge>
                  <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                    Implementation: 2 weeks
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm mb-1">Enhanced Operator Training Program</h4>
                <p className="text-xs text-[#6F83A7] mb-2">
                  Implement certification program for machine operators with focus on proper startup procedures and troubleshooting.
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                    Est. Reduction: 18% fewer incidents
                  </Badge>
                  <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                    Duration: 3 months
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm mb-1">Critical Spare Parts Inventory Optimization</h4>
                <p className="text-xs text-[#6F83A7] mb-2">
                  Stock motor assemblies, electrical components, and hydraulic parts based on failure frequency analysis.
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                    Downtime Reduction: 35%
                  </Badge>
                  <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                    Investment: $8.5K
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <Button
              onClick={() => onAskMarbim('Create a detailed implementation plan for all recommended preventive actions including timeline, resource requirements, cost analysis, and expected ROI with monitoring KPIs.')}
              className="w-full bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Implementation Plan
            </Button>
          </div>
        </div>

        {/* Cost Impact Analysis */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-red-400" />
              <h4 className="text-white">Total Cost Impact</h4>
            </div>
            <p className="text-3xl text-white mb-1">$78,400</p>
            <p className="text-xs text-[#6F83A7]">Last 6 months</p>
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6F83A7]">Parts</span>
                <span className="text-white">$34K</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-[#6F83A7]">Labor</span>
                <span className="text-white">$18K</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-[#6F83A7]">Lost Production</span>
                <span className="text-white">$26K</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-[#EAB308]" />
              <h4 className="text-white">Total Downtime</h4>
            </div>
            <p className="text-3xl text-white mb-1">284h</p>
            <p className="text-xs text-[#6F83A7]">Last 6 months</p>
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6F83A7]">Avg per incident</span>
                <span className="text-white">4.2h</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-[#6F83A7]">Longest</span>
                <span className="text-white">18h</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-[#6F83A7]">Production loss</span>
                <span className="text-white">1,420 units</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
              <h4 className="text-white">Potential Savings</h4>
            </div>
            <p className="text-3xl text-white mb-1">$52K</p>
            <p className="text-xs text-[#6F83A7]">With recommended actions</p>
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6F83A7]">Preventable failures</span>
                <span className="text-white">67%</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-[#6F83A7]">ROI timeline</span>
                <span className="text-white">8 months</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-[#6F83A7]">Annual benefit</span>
                <span className="text-white">$104K</span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderAIPredictive = () => (
    <div className="space-y-6">
      <div className="relative bg-gradient-to-br from-[#EAB308]/10 via-transparent to-[#57ACAF]/10 border border-white/10 rounded-2xl p-8 overflow-hidden">
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
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                  <Activity className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl text-white mb-1">AI Predictive Maintenance</h2>
                  <p className="text-sm text-[#6F83A7]">Machine learning-powered failure prediction and maintenance optimization</p>
                </div>
              </div>
            </div>
            
            <MarbimAIButton
              onClick={() => {
                onAskMarbim('Generate comprehensive predictive maintenance forecast for all machines. Include failure probability analysis, optimal maintenance scheduling, cost-benefit analysis, and ROI projections.');
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-white">High Risk Machines</h3>
              <p className="text-xs text-[#6F83A7]">Next 7 days</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white">MCH-003</span>
                <Badge className="bg-red-500/20 text-red-400 text-xs">92%</Badge>
              </div>
              <p className="text-xs text-[#6F83A7]">Belt failure predicted in 7 days</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#EAB308]" />
            </div>
            <div>
              <h3 className="text-white">Recommended Actions</h3>
              <p className="text-xs text-[#6F83A7]">Next 30 days</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
              <div className="text-sm text-white mb-1">Schedule 4 preventive tasks</div>
              <p className="text-xs text-[#6F83A7]">Estimated cost savings: $2,400</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#57ACAF]" />
            </div>
            <div>
              <h3 className="text-white">Cost Optimization</h3>
              <p className="text-xs text-[#6F83A7]">Potential savings</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
              <div className="text-sm text-white mb-1">Predictive vs Reactive</div>
              <p className="text-xs text-[#6F83A7]">Save up to $8,200/month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#EAB308]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Machine Learning Insights</h3>
              <p className="text-sm text-[#6F83A7] mb-4">
                Our AI analyzes over 50 parameters including vibration patterns, temperature trends, power consumption, and historical maintenance data to predict failures with 89% accuracy.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Prediction Accuracy</div>
                  <div className="text-xl text-white">89%</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Prevented Breakdowns</div>
                  <div className="text-xl text-white">23</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Cost Avoided</div>
                  <div className="text-xl text-white">$45K</div>
                </div>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onAskMarbim('Explain the machine learning models used for predictive maintenance. Include model performance metrics, training data sources, and confidence intervals for predictions.')}
            variant="outline"
            className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)] shrink-0"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Model Details
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSpareParts = () => (
    <Tabs 
      defaultValue="all-parts" 
      value={sparePartsTab}
      onValueChange={setSparePartsTab}
      className="space-y-6"
    >
      <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20">
        <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
          <TabsTrigger 
            value="all-parts" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Package className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">All Parts</span>
          </TabsTrigger>
          <TabsTrigger 
            value="low-stock" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <AlertTriangle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Low Stock</span>
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Send className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Purchase Orders</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ai-forecast" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">AI Forecast</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all-parts" className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAskMarbim('Analyze spare parts inventory and suggest optimal stock levels. Include usage patterns, lead time analysis, and cost optimization recommendations.')}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <BarChart3 className="w-3 h-3 mr-2" />
              Inventory Analysis
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success('Exporting inventory report');
              }}
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Download className="w-3 h-3 mr-2" />
              Export All
            </Button>
          </div>
          <Button
            onClick={() => {
              toast.success('Opening parts request form');
            }}
            className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
          >
            <Plus className="w-3 h-3 mr-2" />
            Request Parts
          </Button>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={sparePartsColumns}
            data={allSparePartsData}
            searchPlaceholder="Search spare parts..."
          />
        </div>

        <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#57ACAF]" />
            </div>
            <div className="flex-1">
              <h4 className="text-white mb-1">AI Inventory Optimization</h4>
              <p className="text-sm text-[#6F83A7]">
                MARBIM predicts parts usage based on machine maintenance schedules and historical consumption patterns. Automatic reorder suggestions ensure optimal stock levels.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onAskMarbim('Generate predictive inventory forecast for the next 90 days. Include usage predictions, recommended reorder quantities, and cost projections.')}
            variant="outline"
            className="border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)] shrink-0"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Full Forecast
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="low-stock" className="space-y-6">
        <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-2">Critical Stock Alerts</h4>
                <p className="text-sm text-[#6F83A7]">
                  {lowStockPartsData.length} parts are below reorder threshold and require immediate procurement action to avoid production delays.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => {
                toast.success('Creating bulk purchase request');
              }}
              className="bg-red-500 hover:bg-red-500/90 text-white shrink-0"
            >
              <Send className="w-3 h-3 mr-1" />
              Bulk Order
            </Button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={sparePartsColumns}
            data={lowStockPartsData}
            searchPlaceholder="Search low stock parts..."
          />
        </div>
      </TabsContent>

      <TabsContent value="orders" className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <Send className="w-16 h-16 text-[#6F83A7] mx-auto mb-4" />
          <h3 className="text-white mb-2">Purchase Orders</h3>
          <p className="text-sm text-[#6F83A7]">Purchase order management coming soon</p>
        </div>
      </TabsContent>

      <TabsContent value="ai-forecast" className="space-y-6">
        <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-[#EAB308]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-2">AI Predictive Inventory Forecast</h3>
                <p className="text-sm text-[#6F83A7]">
                  MARBIM analyzes maintenance schedules, usage patterns, and machine health to predict spare parts needs for the next 90 days.
                </p>
              </div>
            </div>
            <MarbimAIButton
              onClick={() => {
                onAskMarbim('Generate comprehensive 90-day inventory forecast with confidence intervals, recommended safety stock levels, supplier lead time considerations, and cost projections.');
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h4 className="text-white mb-3">Next 30 Days</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Drive Belts</span>
                  <span className="text-white">~8 units</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Needles</span>
                  <span className="text-white">~12 packs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Bearings</span>
                  <span className="text-white">~3 sets</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h4 className="text-white mb-3">Next 60 Days</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Cooling Fans</span>
                  <span className="text-white">~2 units</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Motors</span>
                  <span className="text-white">~1 unit</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Springs</span>
                  <span className="text-white">~15 units</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h4 className="text-white mb-3">Next 90 Days</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Total Cost</span>
                  <span className="text-white">$4,200</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Critical Parts</span>
                  <span className="text-white">5 items</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6F83A7]">Confidence</span>
                  <span className="text-[#57ACAF]">89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'machine-directory':
        return renderMachineDirectory();
      case 'maintenance-planner':
        return renderMaintenancePlanner();
      case 'breakdowns':
        return renderBreakdowns();
      case 'spare-parts':
        return renderSpareParts();
      case 'ai-predictive':
        return renderAIPredictive();
      default:
        return renderDashboard();
    }
  };

  const getTabLabel = (view: string, tabValue: string) => {
    const tabLabels: Record<string, Record<string, string>> = {
      'machine-directory': {
        'all-machines': 'All Machines',
        'active-machines': 'Active',
        'maintenance': 'Under Maintenance',
        'watchlist': 'Watchlist',
        'ai-insights': 'AI Insights'
      },
      'maintenance-planner': {
        'scheduled-tasks': 'Scheduled',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'calendar-view': 'Calendar View'
      },
      'breakdowns': {
        'active-breakdowns': 'Active Breakdowns',
        'repair-history': 'Repair History',
        'root-cause': 'Root Cause Analysis'
      },
      'spare-parts': {
        'all-parts': 'All Parts',
        'low-stock': 'Low Stock',
        'ordered': 'Ordered',
        'ai-forecast': 'AI Forecast'
      }
    };
    return tabLabels[view]?.[tabValue] || '';
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: 'Machine Maintenance' }];
    
    switch (currentView) {
      case 'dashboard':
        breadcrumbs.push({ label: 'Dashboard' });
        break;
      case 'machine-directory':
        breadcrumbs.push({ label: 'Machine Directory' });
        breadcrumbs.push({ label: getTabLabel('machine-directory', machineDirectoryTab) });
        break;
      case 'maintenance-planner':
        breadcrumbs.push({ label: 'Maintenance Planner' });
        breadcrumbs.push({ label: getTabLabel('maintenance-planner', maintenancePlannerTab) });
        break;
      case 'breakdowns':
        breadcrumbs.push({ label: 'Breakdown & Repairs' });
        breadcrumbs.push({ label: getTabLabel('breakdowns', breakdownsTab) });
        break;
      case 'spare-parts':
        breadcrumbs.push({ label: 'Spare Parts & Inventory' });
        breadcrumbs.push({ label: getTabLabel('spare-parts', sparePartsTab) });
        break;
      case 'ai-predictive':
        breadcrumbs.push({ label: 'AI Predictive Maintenance' });
        break;
      default:
        breadcrumbs.push({ label: 'Dashboard' });
    }
    
    return breadcrumbs;
  };

  return (
    <>
      {showSetupWizard && (
        <MachineMaintenanceSetup
          onComplete={() => {
            setShowSetupWizard(false);
            setIsModuleSetup(true);
            toast.success('Machine Maintenance module configured successfully!');
          }}
          onClose={() => setShowSetupWizard(false)}
          onAskMarbim={onAskMarbim}
        />
      )}

      {!showSetupWizard && (
        <PageLayout
          breadcrumbs={getBreadcrumbs()}
          aiInsightsCount={3}
        >
          {!isModuleSetup && currentView === 'dashboard' && (
            <ModuleSetupBanner
              moduleName="Machine Maintenance"
              onSetupClick={() => setShowSetupWizard(true)}
            />
          )}
          {renderContent()}

          {/* Machine Detail Drawer */}
          {selectedMachine && (
            <MachineDetailDrawer
              isOpen={machineDrawerOpen}
              onClose={() => setMachineDrawerOpen(false)}
              machine={selectedMachine}
            />
          )}

          {/* Task Detail Drawer */}
          {selectedTask && (
            <TaskDetailDrawer
              isOpen={taskDrawerOpen}
              onClose={() => setTaskDrawerOpen(false)}
              task={selectedTask}
            />
          )}

          {/* Schedule Maintenance Drawer */}
          <ScheduleMaintenanceDrawer
            isOpen={scheduleDrawerOpen}
            onClose={() => setScheduleDrawerOpen(false)}
            onAskMarbim={onAskMarbim}
          />

          {/* Repair Detail Drawer */}
          {selectedRepair && (
            <RepairDetailDrawer
              isOpen={repairDrawerOpen}
              onClose={() => setRepairDrawerOpen(false)}
              repair={selectedRepair}
              onAskMarbim={onAskMarbim}
            />
          )}

          {/* Add Machine Drawer */}
          <AddMachineDrawer
            isOpen={addMachineDrawerOpen}
            onClose={() => setAddMachineDrawerOpen(false)}
            onMachineAdded={handleMachineAdded}
          />
        </PageLayout>
      )}
    </>
  );
}
