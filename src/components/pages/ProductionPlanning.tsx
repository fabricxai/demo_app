import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { DetailDrawer, DetailDrawerData } from '../DetailDrawer';
import { ProductionOrderDetailDrawer } from '../ProductionOrderDetailDrawer';
import { LineDetailDrawer } from '../LineDetailDrawer';
import { StyleDetailDrawer } from '../StyleDetailDrawer';
import { WorkflowStepper } from '../WorkflowStepper';
import { MarbimAIButton } from '../MarbimAIButton';
import { ModuleSetupBanner } from '../ModuleSetupBanner';
import { ProductionPlanningSetup } from './ProductionPlanningSetup';
import { useDatabase, MODULE_NAMES, canPerformAction } from '../../utils/supabase';
import { 
  Factory, Clock, CheckCircle, AlertTriangle, FileText, TrendingUp,
  ChevronDown, Plus, Download, Filter, Upload, Sparkles,
  Edit, Users, Award, Activity, BarChart3, Settings,
  RefreshCw, Eye, Zap, BookOpen, Clipboard, Calendar,
  Target, DollarSign, Truck, Send, MessageSquare, Package,
  Layers, Grid, Play, Pause, AlertCircle, MapPin, Cpu, LineChart,
  XCircle, Calculator
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
} from 'recharts';

// Dashboard Data
const dashboardSummary = [
  { label: 'Orders On-Time %', value: '94%', icon: CheckCircle, color: '#57ACAF' },
  { label: 'Line Efficiency %', value: '88%', icon: Activity, color: '#EAB308' },
  { label: 'WIP by Stage', value: '452', icon: Package, color: '#6F83A7' },
  { label: 'Material Readiness', value: '92%', icon: Target, color: '#57ACAF' },
];

const capacityHeatmapData = [
  { line: 'Line 1', efficiency: 92, load: 95, utilization: 87 },
  { line: 'Line 2', efficiency: 88, load: 85, utilization: 75 },
  { line: 'Line 3', efficiency: 78, load: 98, utilization: 76 },
  { line: 'Line 4', efficiency: 95, load: 72, utilization: 68 },
  { line: 'Line 5', efficiency: 85, load: 88, utilization: 75 },
  { line: 'Line 6', efficiency: 90, load: 65, utilization: 59 },
];

const lineEfficiencyTrendData = [
  { week: 'W1', efficiency: 82, target: 85 },
  { week: 'W2', efficiency: 85, target: 85 },
  { week: 'W3', efficiency: 87, target: 85 },
  { week: 'W4', efficiency: 88, target: 85 },
];

const wipProgressData = [
  { stage: 'Cutting', count: 120 },
  { stage: 'Sewing', count: 185 },
  { stage: 'Washing', count: 45 },
  { stage: 'Finishing', count: 68 },
  { stage: 'Packing', count: 34 },
];

// Master Plan Data
const masterPlanData = [
  {
    id: 1,
    orderId: 'ORD-1124',
    buyer: 'H&M',
    style: 'T-Shirt Basic',
    quantity: 5000,
    startDate: '2024-10-20',
    plannedEndDate: '2024-11-05',
    status: 'In Progress',
  },
  {
    id: 2,
    orderId: 'ORD-1203',
    buyer: 'Zara',
    style: 'Denim Jeans',
    quantity: 3000,
    startDate: '2024-10-22',
    plannedEndDate: '2024-11-08',
    status: 'Planned',
  },
  {
    id: 3,
    orderId: 'ORD-1198',
    buyer: 'Gap',
    style: 'Polo Shirt',
    quantity: 4500,
    startDate: '2024-10-25',
    plannedEndDate: '2024-11-12',
    status: 'In Progress',
  },
];

// Line Allocation Data
const lineAllocationData = [
  {
    id: 1,
    lineNumber: 'Line 1',
    name: 'Production Line 1',
    orderAssigned: 'ORD-1124',
    efficiency: 92,
    load: 95,
    operators: 25,
    capacity: 28,
    skillMatch: 95,
    wip: 450,
    status: 'Active',
    supervisor: 'Sarah Johnson',
    shift: 'Morning (7 AM - 3 PM)',
    location: 'Floor A - Section 1',
    machineCount: 32,
    maintenanceStatus: 'Good',
    currentOrders: [
      { orderId: 'PO-2024-0156', style: 'T-Shirt Basic', quantity: 5000, completed: 3250, dueDate: '2024-11-05', status: 'In Progress' },
      { orderId: 'PO-2024-0148', style: 'Polo Shirt', quantity: 2500, completed: 2500, dueDate: '2024-10-28', status: 'Completed' },
    ],
    operatorList: [
      { id: 'OP-001', name: 'Maria Garcia', role: 'Senior Operator', efficiency: 95, attendance: 'Present', skills: ['Sewing', 'Finishing', 'Quality Check'], experience: '8 years' },
      { id: 'OP-002', name: 'John Smith', role: 'Operator', efficiency: 88, attendance: 'Present', skills: ['Sewing', 'Hemming'], experience: '4 years' },
      { id: 'OP-003', name: 'Aisha Patel', role: 'Quality Inspector', efficiency: 92, attendance: 'Present', skills: ['Quality Check', 'Pattern Making'], experience: '6 years' },
      { id: 'OP-004', name: 'Carlos Rodriguez', role: 'Operator', efficiency: 85, attendance: 'Present', skills: ['Sewing', 'Machine Setup'], experience: '3 years' },
    ],
  },
  {
    id: 2,
    lineNumber: 'Line 2',
    name: 'Production Line 2',
    orderAssigned: 'ORD-1203',
    efficiency: 88,
    load: 85,
    operators: 22,
    capacity: 26,
    skillMatch: 88,
    wip: 320,
    status: 'Active',
    supervisor: 'Michael Chen',
    shift: 'Morning (7 AM - 3 PM)',
    location: 'Floor A - Section 2',
    machineCount: 28,
    maintenanceStatus: 'Good',
    currentOrders: [
      { orderId: 'PO-2024-0162', style: 'Denim Jeans', quantity: 3000, completed: 1200, dueDate: '2024-11-08', status: 'In Progress' },
    ],
    operatorList: [
      { id: 'OP-005', name: 'Lisa Wong', role: 'Senior Operator', efficiency: 90, attendance: 'Present', skills: ['Sewing', 'Finishing'], experience: '7 years' },
      { id: 'OP-006', name: 'Ahmed Hassan', role: 'Operator', efficiency: 86, attendance: 'Present', skills: ['Sewing', 'Hemming'], experience: '5 years' },
      { id: 'OP-007', name: 'Elena Popov', role: 'Operator', efficiency: 88, attendance: 'Present', skills: ['Sewing', 'Quality Check'], experience: '4 years' },
    ],
  },
  {
    id: 3,
    lineNumber: 'Line 3',
    name: 'Production Line 3',
    orderAssigned: 'ORD-1198',
    efficiency: 78,
    load: 98,
    operators: 20,
    capacity: 24,
    skillMatch: 72,
    wip: 280,
    status: 'Active',
    supervisor: 'David Lee',
    shift: 'Evening (3 PM - 11 PM)',
    location: 'Floor B - Section 1',
    machineCount: 26,
    maintenanceStatus: 'Scheduled',
    currentOrders: [
      { orderId: 'PO-2024-0145', style: 'Summer Dress', quantity: 4500, completed: 3600, dueDate: '2024-11-12', status: 'In Progress' },
    ],
    operatorList: [
      { id: 'OP-008', name: 'Nina Kovac', role: 'Operator', efficiency: 82, attendance: 'Present', skills: ['Sewing', 'Finishing'], experience: '3 years' },
      { id: 'OP-009', name: 'James Park', role: 'Operator', efficiency: 75, attendance: 'Present', skills: ['Sewing'], experience: '2 years' },
      { id: 'OP-010', name: 'Fatima Al-Rashid', role: 'Quality Inspector', efficiency: 85, attendance: 'Present', skills: ['Quality Check', 'Pattern Making'], experience: '5 years' },
    ],
  },
  {
    id: 4,
    lineNumber: 'Line 6',
    name: 'Production Line 6',
    orderAssigned: 'Unassigned',
    efficiency: 90,
    load: 65,
    operators: 24,
    capacity: 28,
    skillMatch: 0,
    wip: 0,
    status: 'Idle',
    supervisor: 'Jennifer Martinez',
    shift: 'Morning (7 AM - 3 PM)',
    location: 'Floor C - Section 1',
    machineCount: 30,
    maintenanceStatus: 'Good',
    currentOrders: [],
    operatorList: [
      { id: 'OP-011', name: 'Robert Kim', role: 'Senior Operator', efficiency: 93, attendance: 'Present', skills: ['Sewing', 'Finishing', 'Machine Setup'], experience: '9 years' },
      { id: 'OP-012', name: 'Sofia Ramirez', role: 'Operator', efficiency: 87, attendance: 'Present', skills: ['Sewing', 'Hemming'], experience: '4 years' },
      { id: 'OP-013', name: 'Yuki Tanaka', role: 'Operator', efficiency: 90, attendance: 'Present', skills: ['Sewing', 'Quality Check'], experience: '6 years' },
    ],
  },
];

const styleAllocationData = [
  {
    id: 1,
    styleId: 'STY-2024-001',
    name: 'T-Shirt Basic',
    operationCount: 12,
    requiredSkills: 'Sewing, Hemming',
    assignedLine: 'Line 1',
    progress: 65,
    complexity: 'Low',
    totalQuantity: 5000,
    completedQuantity: 3250,
    orderId: 'ORD-1124',
    buyer: 'H&M',
    dueDate: '2024-11-05',
    status: 'In Progress',
    operations: [
      { id: 'OP-001', name: 'Fabric Inspection', sequence: 1, timeStandard: 0.5, skillLevel: 'Basic', machineType: 'Manual', status: 'Completed' },
      { id: 'OP-002', name: 'Pattern Layout', sequence: 2, timeStandard: 2.0, skillLevel: 'Advanced', machineType: 'CAD System', status: 'Completed' },
      { id: 'OP-003', name: 'Cutting', sequence: 3, timeStandard: 3.5, skillLevel: 'Intermediate', machineType: 'Auto Cutter', status: 'Completed' },
      { id: 'OP-004', name: 'Shoulder Join', sequence: 4, timeStandard: 1.2, skillLevel: 'Intermediate', machineType: 'Overlock', status: 'In Progress' },
      { id: 'OP-005', name: 'Side Seam', sequence: 5, timeStandard: 1.5, skillLevel: 'Basic', machineType: 'Lock Stitch', status: 'In Progress' },
      { id: 'OP-006', name: 'Sleeve Attach', sequence: 6, timeStandard: 2.0, skillLevel: 'Intermediate', machineType: 'Lock Stitch', status: 'In Progress' },
      { id: 'OP-007', name: 'Collar Attach', sequence: 7, timeStandard: 2.5, skillLevel: 'Advanced', machineType: 'Special Machine', status: 'Pending' },
      { id: 'OP-008', name: 'Hemming', sequence: 8, timeStandard: 1.8, skillLevel: 'Basic', machineType: 'Hemming Machine', status: 'Pending' },
      { id: 'OP-009', name: 'Button Attach', sequence: 9, timeStandard: 1.0, skillLevel: 'Basic', machineType: 'Button Machine', status: 'Pending' },
      { id: 'OP-010', name: 'Quality Check', sequence: 10, timeStandard: 1.5, skillLevel: 'Advanced', machineType: 'Manual', status: 'Pending' },
      { id: 'OP-011', name: 'Pressing', sequence: 11, timeStandard: 1.2, skillLevel: 'Basic', machineType: 'Steam Press', status: 'Pending' },
      { id: 'OP-012', name: 'Packing', sequence: 12, timeStandard: 0.8, skillLevel: 'Basic', machineType: 'Manual', status: 'Pending' },
    ],
    lineAssignments: [
      { lineId: 'L1', lineName: 'Production Line 1', assignedDate: '2024-10-20', quantity: 5000, completed: 3250, efficiency: 92, status: 'Active' },
    ],
    qualityMetrics: {
      defectRate: 2.8,
      firstPassYield: 96.5,
      reworkRate: 2.1,
    },
  },
  {
    id: 2,
    styleId: 'STY-2024-002',
    name: 'Denim Jeans',
    operationCount: 18,
    requiredSkills: 'Sewing, Finishing, Washing',
    assignedLine: 'Line 2',
    progress: 45,
    complexity: 'High',
    totalQuantity: 3000,
    completedQuantity: 1350,
    orderId: 'ORD-1203',
    buyer: 'Zara',
    dueDate: '2024-11-08',
    status: 'In Progress',
    operations: [
      { id: 'OP-101', name: 'Denim Inspection', sequence: 1, timeStandard: 1.0, skillLevel: 'Intermediate', machineType: 'Manual', status: 'Completed' },
      { id: 'OP-102', name: 'Pattern Layout', sequence: 2, timeStandard: 2.5, skillLevel: 'Advanced', machineType: 'CAD System', status: 'Completed' },
      { id: 'OP-103', name: 'Cutting', sequence: 3, timeStandard: 4.0, skillLevel: 'Advanced', machineType: 'Auto Cutter', status: 'Completed' },
      { id: 'OP-104', name: 'Pocket Attach', sequence: 4, timeStandard: 3.5, skillLevel: 'Advanced', machineType: 'Special Machine', status: 'In Progress' },
      { id: 'OP-105', name: 'Front Rise Join', sequence: 5, timeStandard: 2.0, skillLevel: 'Intermediate', machineType: 'Lock Stitch', status: 'In Progress' },
      { id: 'OP-106', name: 'Back Rise Join', sequence: 6, timeStandard: 2.0, skillLevel: 'Intermediate', machineType: 'Lock Stitch', status: 'Pending' },
      { id: 'OP-107', name: 'Inseam', sequence: 7, timeStandard: 2.5, skillLevel: 'Intermediate', machineType: 'Chain Stitch', status: 'Pending' },
      { id: 'OP-108', name: 'Outseam', sequence: 8, timeStandard: 2.5, skillLevel: 'Intermediate', machineType: 'Lock Stitch', status: 'Pending' },
      { id: 'OP-109', name: 'Waistband Attach', sequence: 9, timeStandard: 3.0, skillLevel: 'Advanced', machineType: 'Special Machine', status: 'Pending' },
      { id: 'OP-110', name: 'Zipper Attach', sequence: 10, timeStandard: 2.8, skillLevel: 'Advanced', machineType: 'Special Machine', status: 'Pending' },
      { id: 'OP-111', name: 'Button Attach', sequence: 11, timeStandard: 1.2, skillLevel: 'Basic', machineType: 'Button Machine', status: 'Pending' },
      { id: 'OP-112', name: 'Bartack', sequence: 12, timeStandard: 1.5, skillLevel: 'Intermediate', machineType: 'Bartack Machine', status: 'Pending' },
      { id: 'OP-113', name: 'Belt Loop', sequence: 13, timeStandard: 2.0, skillLevel: 'Intermediate', machineType: 'Special Machine', status: 'Pending' },
      { id: 'OP-114', name: 'Hemming', sequence: 14, timeStandard: 2.2, skillLevel: 'Intermediate', machineType: 'Chain Stitch', status: 'Pending' },
      { id: 'OP-115', name: 'Washing', sequence: 15, timeStandard: 45.0, skillLevel: 'Advanced', machineType: 'Industrial Washer', status: 'Pending' },
      { id: 'OP-116', name: 'Finishing & Ironing', sequence: 16, timeStandard: 3.5, skillLevel: 'Intermediate', machineType: 'Steam Press', status: 'Pending' },
      { id: 'OP-117', name: 'Quality Inspection', sequence: 17, timeStandard: 2.0, skillLevel: 'Advanced', machineType: 'Manual', status: 'Pending' },
      { id: 'OP-118', name: 'Packing', sequence: 18, timeStandard: 1.0, skillLevel: 'Basic', machineType: 'Manual', status: 'Pending' },
    ],
    lineAssignments: [
      { lineId: 'L2', lineName: 'Production Line 2', assignedDate: '2024-10-22', quantity: 3000, completed: 1350, efficiency: 88, status: 'Active' },
    ],
    qualityMetrics: {
      defectRate: 3.5,
      firstPassYield: 94.2,
      reworkRate: 3.2,
    },
  },
];

// T&A Calendar Data
const milestonesData = [
  {
    id: 1,
    orderId: 'ORD-1124',
    milestone: 'Fabric Arrival',
    plannedDate: '2024-10-18',
    actualDate: '2024-10-18',
    status: 'Completed',
  },
  {
    id: 2,
    orderId: 'ORD-1124',
    milestone: 'Cutting Start',
    plannedDate: '2024-10-20',
    actualDate: '2024-10-20',
    status: 'Completed',
  },
  {
    id: 3,
    orderId: 'ORD-1124',
    milestone: 'Sewing Start',
    plannedDate: '2024-10-23',
    actualDate: '2024-10-25',
    status: 'Delayed',
  },
  {
    id: 4,
    orderId: 'ORD-1124',
    milestone: 'Finishing',
    plannedDate: '2024-11-01',
    actualDate: '-',
    status: 'Pending',
  },
];

// Materials & Shortages Data
const materialStatusData = [
  {
    id: 1,
    materialCode: 'FAB-2024-5847',
    supplier: 'KnitTex',
    eta: '2024-10-28',
    requiredQty: 5000,
    availableQty: 5000,
    shortfall: 0,
  },
  {
    id: 2,
    materialCode: 'TRIM-2024-1547',
    supplier: 'TrimWorks',
    eta: '2024-10-30',
    requiredQty: 3000,
    availableQty: 2500,
    shortfall: 500,
  },
  {
    id: 3,
    materialCode: 'BTN-2024-8547',
    supplier: 'Button Co',
    eta: '2024-11-02',
    requiredQty: 1500,
    availableQty: 800,
    shortfall: 700,
  },
];

const shortagesData = materialStatusData.filter(m => m.shortfall > 0);

// Risk & AI Data
const delayPredictionsData = [
  {
    id: 1,
    orderId: 'ORD-K320',
    buyer: 'H&M',
    predictedDelay: '2 days',
    riskLevel: 'Medium',
    probability: '65%',
  },
  {
    id: 2,
    orderId: 'ORD-1124',
    buyer: 'Zara',
    predictedDelay: '1 day',
    riskLevel: 'Low',
    probability: '35%',
  },
];

// Helper function to generate DetailDrawerData for Production Orders
const generateProductionOrderDrawerData = (order: any, subPage: string, onAskMarbim?: (prompt: string) => void): DetailDrawerData => {
  return {
    id: order.id.toString(),
    title: order.orderId,
    subtitle: `${order.buyer} • ${order.style}`,
    type: order.style,
    status: {
      label: order.status,
      variant: order.status === 'In Progress' ? 'default' : 
               order.status === 'Planned' ? 'warning' : 'success'
    },
    overview: {
      keyAttributes: [
        { label: 'Order ID', value: order.orderId, icon: <FileText className="w-4 h-4" /> },
        { label: 'Buyer', value: order.buyer || 'N/A', icon: <Users className="w-4 h-4" /> },
        { label: 'Style', value: order.style || 'N/A', icon: <Package className="w-4 h-4" /> },
        { label: 'Quantity', value: order.quantity ? order.quantity.toLocaleString() : 'N/A', icon: <Layers className="w-4 h-4" /> },
        { label: 'Start Date', value: order.startDate || 'N/A', icon: <Calendar className="w-4 h-4" /> },
        { label: 'End Date', value: order.plannedEndDate || 'N/A', icon: <Clock className="w-4 h-4" /> },
        { label: 'Status', value: order.status || 'N/A', icon: <Activity className="w-4 h-4" /> },
      ],
      metrics: [
        { label: 'Production Progress', value: order.status === 'In Progress' ? '45%' : '0%', trend: 'up' as const },
        { label: 'Line Efficiency', value: '88%', change: '+2%', trend: 'up' as const },
        { label: 'Days to Deadline', value: '12', trend: 'down' as const },
      ],
      description: `Production order ${order.orderId} for ${order.buyer || 'unknown buyer'} manufacturing ${order.quantity ? order.quantity.toLocaleString() : 'unknown quantity'} units of ${order.style || 'unknown style'}. Production ${order.status ? order.status.toLowerCase() : 'status pending'} from ${order.startDate || 'TBD'} to ${order.plannedEndDate || 'TBD'}.`,
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={wipProgressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="stage" stroke="#6F83A7" />
            <YAxis stroke="#6F83A7" />
            <Tooltip contentStyle={{ backgroundColor: '#0D1117', border: '1px solid #ffffff20' }} />
            <Bar dataKey="count" fill="#57ACAF" />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    interactions: [
      { date: '2024-10-26', type: 'system', description: `Production started for ${order.quantity || 'N/A'} units`, sentiment: 'positive' },
      { date: '2024-10-25', type: 'meeting', description: 'Production planning meeting with line supervisors', sentiment: 'positive' },
      { date: '2024-10-24', type: 'email', description: 'Material availability confirmed from warehouse', sentiment: 'positive' },
      { date: '2024-10-23', type: 'call', description: 'Buyer discussed quality requirements and inspection schedule', sentiment: 'neutral' },
    ],
    documents: [
      { name: 'Production_Order_' + order.orderId + '.pdf', type: 'Order', uploadDate: order.startDate || 'N/A', uploader: 'System', aiSummary: `Complete production order for ${order.quantity || 'N/A'} units of ${order.style || 'N/A'} for ${order.buyer || 'N/A'}. Includes timeline, quality specs, and packaging requirements.` },
      { name: 'Tech_Pack_' + (order.style || 'Unknown').replace(/\s+/g, '_') + '.pdf', type: 'Technical', uploadDate: order.startDate || 'N/A', uploader: 'Planning Team', aiSummary: 'Detailed technical specifications with construction, measurements, and quality standards.' },
      { name: 'Material_BOM.xlsx', type: 'BOM', uploadDate: order.startDate || 'N/A', uploader: 'Planning Team', tag: 'Latest', aiSummary: 'Complete bill of materials with fabric, trims, and accessories. All materials confirmed in stock.' },
      { name: 'Line_Allocation_Plan.xlsx', type: 'Planning', uploadDate: order.startDate || 'N/A', uploader: 'Production Manager', aiSummary: `Allocated to Line 1 with 25 operators. Expected efficiency: 88%. Target completion: ${order.plannedEndDate || 'TBD'}.` },
    ],
    aiInsights: {
      summary: `Production order ${order.orderId} is ${order.status ? order.status.toLowerCase() : 'in progress'} with ${order.status === 'In Progress' ? '45% completion' : 'planning phase'}. On-time delivery probability: 92%. No material shortages detected.`,
      recommendations: [
        {
          title: 'Line Optimization',
          description: `Current line efficiency at 88%. Increase to 92% by optimizing operator skill matching for ${order.style} operations.`,
          action: 'Optimize Line',
          onClick: () => onAskMarbim?.(`How can we optimize line efficiency for ${order.orderId}?`)
        },
        {
          title: 'Material Monitoring',
          description: 'All materials available. Schedule pre-production meeting 2 days before cutting to verify quality.',
          action: 'Schedule Meeting',
          onClick: () => onAskMarbim?.(`Schedule pre-production meeting for ${order.orderId}`)
        },
        {
          title: 'Quality Planning',
          description: `Set up inline inspection checkpoints for ${order.style}. ${order.buyer} requires AQL 2.5 inspection.`,
          action: 'Setup QC',
          onClick: () => onAskMarbim?.(`Create quality control plan for ${order.orderId}`)
        },
      ],
      visualInsight: (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#6F83A7]">Production Progress</span>
              <span className="text-white">{order.status === 'In Progress' ? '45%' : '0%'}</span>
            </div>
            <Progress value={order.status === 'In Progress' ? 45 : 0} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#6F83A7]">Line Efficiency</span>
              <span className="text-white">88%</span>
            </div>
            <Progress value={88} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#6F83A7]">On-Time Probability</span>
              <span className="text-white">92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">WIP Units</div>
              <div className="text-white">{order.status === 'In Progress' ? '2,250' : '0'}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Completed</div>
              <div className="text-white">{order.status === 'In Progress' ? '2,250' : '0'}</div>
            </div>
          </div>
        </div>
      ),
      references: [
        'Production Capacity Analysis',
        'Line Efficiency Reports',
        `${order.buyer} Quality Standards`,
        'Material Inventory Status',
        'SMV and Time Study Data'
      ]
    }
  };
};

interface ProductionPlanningProps {
  initialSubPage?: string;
  onAskMarbim?: (prompt: string) => void;
}

export function ProductionPlanning({ initialSubPage = 'dashboard', onAskMarbim }: ProductionPlanningProps) {
  const routeSubpage = useRouteSubpage('dashboard', initialSubPage);
  // Database hook
  const db = useDatabase();
  
  // UI State
  const [currentView, setCurrentView] = useState<string>(routeSubpage);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DetailDrawerData | null>(null);
  const [productionOrderDrawerOpen, setProductionOrderDrawerOpen] = useState(false);
  const [selectedProductionOrder, setSelectedProductionOrder] = useState<any>(null);
  const [lineDrawerOpen, setLineDrawerOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState<any>(null);
  const [styleDrawerOpen, setStyleDrawerOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [showModuleSetup, setShowModuleSetup] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [isModuleSetup, setIsModuleSetup] = useState(false);
  
  // Database State
  const [orders, setOrders] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [styles, setStyles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed Data
  const activeOrders = orders.filter(o => o.status === 'In Progress');
  const completedOrders = orders.filter(o => o.status === 'Completed');
  const delayedOrders = orders.filter(o => o.status === 'Delayed' || o.onTimeStatus === 'At Risk');
  const avgEfficiency = lines.length > 0
    ? Math.round(lines.reduce((sum, l) => sum + parseFloat(l.efficiency || 0), 0) / lines.length)
    : 0;

  const computedDashboardSummary = [
    { label: 'Active Orders', value: activeOrders.length, icon: Factory, color: '#EAB308' },
    { label: 'Completed', value: completedOrders.length, icon: CheckCircle, color: '#57ACAF' },
    { label: 'Delayed', value: delayedOrders.length, icon: AlertTriangle, color: '#D0342C' },
    { label: 'Avg. Efficiency', value: `${avgEfficiency}%`, icon: TrendingUp, color: '#57ACAF' },
  ];

  useEffect(() => {
    setCurrentView(routeSubpage);
  }, [routeSubpage]);

  // Load data from database on mount
  useEffect(() => {
    loadProductionData();
  }, []);

  // Database Operations
  async function loadProductionData() {
    try {
      setIsLoading(true);
      const data = await db.getByModule(MODULE_NAMES.PRODUCTION_PLANNING);
      
      const orderData = data.filter((item: any) => item.type === 'order');
      const lineData = data.filter((item: any) => item.type === 'line');
      const styleData = data.filter((item: any) => item.type === 'style');
      
      if (orderData.length === 0) {
        await seedInitialProductionData();
      } else {
        setOrders(orderData);
        setLines(lineData);
        setStyles(styleData);
      }
    } catch (error) {
      console.error('Failed to load production data:', error);
      toast.error('Failed to load production data');
    } finally {
      setIsLoading(false);
    }
  }

  async function seedInitialProductionData() {
    const initialOrders = masterPlanData.map(order => ({ ...order, type: 'order' }));
    const initialLines = lineAllocationData.map(line => ({ ...line, type: 'line' }));
    const initialStyles = styleAllocationData.map(style => ({ ...style, type: 'style' }));
    
    for (const order of initialOrders) {
      const id = `order-${order.id}-${Date.now()}`;
      await db.store(id, order, MODULE_NAMES.PRODUCTION_PLANNING);
    }
    
    for (const line of initialLines) {
      const id = `line-${line.id}-${Date.now()}`;
      await db.store(id, line, MODULE_NAMES.PRODUCTION_PLANNING);
    }
    
    for (const style of initialStyles) {
      const id = `style-${style.id}-${Date.now()}`;
      await db.store(id, style, MODULE_NAMES.PRODUCTION_PLANNING);
    }
    
    setOrders(initialOrders);
    setLines(initialLines);
    setStyles(initialStyles);
  }

  async function handleOrderUpdated() {
    try {
      await loadProductionData();
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Failed to update order:', error);
      toast.error('Failed to update order');
    }
  }

  async function handleLineUpdated() {
    try {
      await loadProductionData();
      toast.success('Line updated successfully');
    } catch (error) {
      console.error('Failed to update line:', error);
      toast.error('Failed to update line');
    }
  }

  async function handleStyleUpdated() {
    try {
      await loadProductionData();
      toast.success('Style updated successfully');
    } catch (error) {
      console.error('Failed to update style:', error);
      toast.error('Failed to update style');
    }
  }

  // Master Plan Columns
  const masterPlanColumns: Column[] = [
    { key: 'orderId', label: 'Order ID', sortable: true },
    { key: 'buyer', label: 'Buyer' },
    { key: 'style', label: 'Style' },
    { key: 'quantity', label: 'Quantity', sortable: true, render: (value) => value.toLocaleString() },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'plannedEndDate', label: 'Planned End Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Planned': 'bg-[#6F83A7]/10 text-[#6F83A7]',
          'In Progress': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Completed': 'bg-[#57ACAF]/10 text-[#57ACAF]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Line Allocation Columns
  const lineAllocationColumns: Column[] = [
    { key: 'lineNumber', label: 'Line #', sortable: true },
    { key: 'orderAssigned', label: 'Order Assigned' },
    {
      key: 'efficiency',
      label: 'Efficiency %',
      sortable: true,
      render: (value) => {
        const color = value >= 90 ? 'text-[#57ACAF]' : value >= 80 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
    {
      key: 'load',
      label: 'Load %',
      sortable: true,
      render: (value) => {
        const color = value >= 85 ? 'text-[#EAB308]' : value >= 70 ? 'text-[#57ACAF]' : 'text-[#6F83A7]';
        return <span className={color}>{value}%</span>;
      },
    },
    { key: 'operators', label: 'Operators', sortable: true },
    {
      key: 'skillMatch',
      label: 'Skill Match %',
      sortable: true,
      render: (value) => {
        const color = value >= 90 ? 'text-[#57ACAF]' : value >= 70 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
    { key: 'wip', label: 'WIP', sortable: true, render: (value) => value.toLocaleString() },
  ];

  // Style Allocation Columns
  const styleAllocationColumns: Column[] = [
    { key: 'styleId', label: 'Style ID', sortable: true },
    { key: 'operationCount', label: 'Operations', sortable: true },
    { key: 'requiredSkills', label: 'Required Skills' },
    { key: 'assignedLine', label: 'Assigned Line' },
    {
      key: 'progress',
      label: 'Progress %',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Progress value={value} className="flex-1 h-2" />
          <span className="text-sm w-12">{value}%</span>
        </div>
      ),
    },
  ];

  // Milestones Columns
  const milestonesColumns: Column[] = [
    { key: 'orderId', label: 'Order ID', sortable: true },
    { key: 'milestone', label: 'Milestone' },
    { key: 'plannedDate', label: 'Planned Date', sortable: true },
    { key: 'actualDate', label: 'Actual Date' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Completed': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Pending': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Delayed': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Material Status Columns
  const materialStatusColumns: Column[] = [
    { key: 'materialCode', label: 'Material Code', sortable: true },
    { key: 'supplier', label: 'Supplier' },
    { key: 'eta', label: 'ETA', sortable: true },
    { key: 'requiredQty', label: 'Required Qty', sortable: true, render: (value) => value.toLocaleString() },
    { key: 'availableQty', label: 'Available Qty', sortable: true, render: (value) => value.toLocaleString() },
    {
      key: 'shortfall',
      label: 'Shortfall',
      sortable: true,
      render: (value) => {
        const color = value > 0 ? 'text-[#D0342C]' : 'text-[#57ACAF]';
        return <span className={color}>{value.toLocaleString()}</span>;
      },
    },
  ];

  // Delay Predictions Columns
  const delayPredictionsColumns: Column[] = [
    { key: 'orderId', label: 'Order ID', sortable: true },
    { key: 'buyer', label: 'Buyer' },
    { key: 'predictedDelay', label: 'Predicted Delay' },
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
    { key: 'probability', label: 'Probability', sortable: true },
  ];

  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    // Check if this is a production line record
    if (record.lineNumber && record.name && record.supervisor) {
      // This is a production line - use the line detail drawer
      setSelectedLine(record);
      setLineDrawerOpen(true);
    } else if (record.styleId && record.operations && record.complexity) {
      // This is a style record - use the style detail drawer
      setSelectedStyle(record);
      setStyleDrawerOpen(true);
    } else if (record.orderId && record.buyer && record.style) {
      // This is a production order - use the new modern drawer
      setSelectedProductionOrder(record);
      setProductionOrderDrawerOpen(true);
    } else if (record.orderId) {
      // Other order types - use the legacy drawer
      setDrawerData(generateProductionOrderDrawerData(record, currentView, onAskMarbim));
      setDrawerOpen(true);
    } else {
      setDrawerData(null);
      setDrawerOpen(true);
    }
  };

  const renderDashboard = () => (
    <>
      {/* Module Setup Banner */}
      <ModuleSetupBanner 
        moduleName="Production Planning"
        onSetupClick={() => setShowModuleSetup(true)}
      />

      {/* Hero Banner with Executive Summary */}
      <div className="bg-gradient-to-br from-[#57ACAF]/10 via-[#EAB308]/5 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(87,172,175,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/30">
                <Factory className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl mb-2">Production Intelligence Hub</h2>
                <p className="text-[#6F83A7] text-sm max-w-2xl">
                  Real-time visibility into production operations, capacity optimization, and delivery performance. 
                  Track line efficiency, manage WIP flow, and leverage AI-powered insights for on-time delivery excellence.
                </p>
              </div>
            </div>
            <MarbimAIButton
              marbimPrompt="Provide a comprehensive executive summary of production operations including: 1) Overall production health (94% on-time delivery, 88% line efficiency), 2) Critical orders requiring immediate attention and bottleneck analysis, 3) Capacity optimization opportunities across 6 production lines, 4) WIP flow analysis with 452 units across stages (Cutting: 120, Sewing: 185, Washing: 45, Finishing: 68, Packing: 34), 5) Material readiness status (92%) and shortage mitigation strategies, 6) Line reallocation recommendations for throughput improvement, 7) Downtime reduction initiatives (currently 3.2h, -42% reduction), 8) Forecast for next week based on current capacity utilization (78%) and efficiency trends."
              onAskMarbim={onAskMarbim}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">On-Time Delivery</span>
              </div>
              <div className="text-2xl text-white mb-1">94%</div>
              <div className="text-xs text-[#57ACAF]">+5.2% improvement</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs text-[#6F83A7]">Line Efficiency</span>
              </div>
              <div className="text-2xl text-white mb-1">88%</div>
              <div className="text-xs text-[#57ACAF]">+3.5% vs target</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-[#6F83A7]" />
                <span className="text-xs text-[#6F83A7]">Total WIP Units</span>
              </div>
              <div className="text-2xl text-white mb-1">452</div>
              <div className="text-xs text-[#EAB308]">Across 5 stages</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Capacity Utilization</span>
              </div>
              <div className="text-2xl text-white mb-1">78%</div>
              <div className="text-xs text-[#57ACAF]">+6.5% increase</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#D0342C]" />
                <span className="text-xs text-[#6F83A7]">Downtime Hours</span>
              </div>
              <div className="text-2xl text-white mb-1">3.2h</div>
              <div className="text-xs text-[#57ACAF]">-42% reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <KPICard
          title="Orders On-Time %"
          value="94%"
          change={5.2}
          changeLabel="improvement"
          icon={CheckCircle}
          trend="up"
        />
        <KPICard
          title="Line Efficiency %"
          value="88%"
          change={3.5}
          icon={Activity}
          trend="up"
        />
        <KPICard
          title="WIP by Stage"
          value="452"
          change={8.3}
          changeLabel="vs target"
          icon={Package}
          trend="neutral"
        />
        <KPICard
          title="Material Readiness"
          value="92%"
          change={2.1}
          icon={Target}
          trend="up"
        />
        <KPICard
          title="Downtime Hours"
          value="3.2h"
          change={-42.0}
          changeLabel="reduction"
          icon={Clock}
          trend="up"
        />
        <KPICard
          title="Capacity Utilization"
          value="78%"
          change={6.5}
          icon={BarChart3}
          trend="up"
        />
      </div>

      {/* Production Status Summary */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white mb-2 flex items-center gap-2">
              <Grid className="w-5 h-5 text-[#57ACAF]" />
              Production Status Overview
            </h3>
            <p className="text-sm text-[#6F83A7]">
              Real-time view of production metrics across key areas
            </p>
          </div>
          <MarbimAIButton
            marbimPrompt="Analyze the production status distribution and provide insights on: 1) Bottlenecks causing delays in production stages, 2) Orders at risk of missing delivery deadlines, 3) Line reallocation opportunities to balance capacity, 4) Material shortage impact on production flow, 5) Historical patterns and forecast for next week's production, 6) Process optimization suggestions to improve throughput and reduce downtime."
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

      {/* Capacity Analysis and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capacity Heatmap */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#57ACAF]" />
                Capacity Utilization by Line
              </h3>
              <p className="text-sm text-[#6F83A7]">Live monitoring of production line performance</p>
            </div>
            <div className="flex gap-2">
              <MarbimAIButton
                marbimPrompt="Analyze the capacity utilization across all production lines and provide insights on: 1) Line-by-line performance comparison (Line 1: 87% utilization/92% efficiency, Line 2: 75%/88%, Line 3: 76%/78%, Line 4: 68%/95%, Line 5: 75%/85%, Line 6: 59%/90%), 2) Underutilized lines (Line 4 at 68%, Line 6 at 59%) and reallocation opportunities, 3) High-load lines (Line 3 at 98% load) at risk of bottlenecks, 4) Optimal order-to-line assignments to balance capacity, 5) Skill matching recommendations to improve efficiency, 6) Preventive measures to avoid capacity constraints, 7) Forecast for next week's capacity needs based on order pipeline."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
              <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-transparent hover:bg-white/5">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {capacityHeatmapData.map((line, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white">{line.line}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-[#6F83A7]">Efficiency: <span className="text-white">{line.efficiency}%</span></span>
                    <span className="text-[#6F83A7]">Load: <span className="text-white">{line.load}%</span></span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={line.utilization} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F83A7]">Utilization</span>
                    <Badge className={
                      line.utilization >= 80 ? 'bg-[#57ACAF]/10 text-[#57ACAF]' :
                      line.utilization >= 60 ? 'bg-[#EAB308]/10 text-[#EAB308]' :
                      'bg-[#D0342C]/10 text-[#D0342C]'
                    }>
                      {line.utilization}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
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
                  <h4 className="text-white mb-1">AI Production Optimization</h4>
                  <p className="text-xs text-[#6F83A7]">Intelligent efficiency recommendations</p>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Provide detailed production optimization recommendations including: 1) Bottleneck resolution strategies for Sewing stage with 2-day delay risk on Order #1124, 2) Order reallocation analysis for moving Order #1203 to Line 6 for 8% throughput improvement, 3) Material shortage mitigation for trim issues affecting parallel scheduling, 4) Line efficiency improvement tactics to raise from 88% to target 92%, 5) WIP flow optimization across stages to reduce cycle time, 6) Downtime reduction initiatives beyond current -42% achievement, 7) Capacity balancing recommendations for underutilized lines, 8) Quantified impact and implementation timeline for each recommendation."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#D0342C] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Sewing Bottleneck Alert</div>
                    <div className="text-xs text-[#6F83A7] mb-2">
                      2-day delay risk on Order #1124 — <span className="text-[#D0342C]">Immediate action required</span>
                    </div>
                    <Button size="sm" onClick={() => toast.warning('Opening bottleneck analysis')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                      Analyze & Fix
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Line Reallocation Opportunity</div>
                    <div className="text-xs text-[#6F83A7] mb-2">
                      Move Order #1203 to Line 6: <span className="text-[#57ACAF]">+8% throughput boost</span>
                    </div>
                    <Button size="sm" onClick={() => toast.success('Reallocating order')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                      Reallocate Now
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Material Shortage Mitigation</div>
                    <div className="text-xs text-[#6F83A7] mb-2">
                      Parallel schedule Orders #1198 & #1203 to optimize trim usage
                    </div>
                    <Button size="sm" onClick={() => toast.info('Opening scheduler')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                      Schedule
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div>
                  <h4 className="text-white mb-1">Performance Tracking</h4>
                  <p className="text-xs text-[#6F83A7]">Key efficiency metrics</p>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze production performance trends including: 1) Line efficiency progression from 82% (W1) to 88% (W4) against 85% target, 2) WIP stage distribution patterns and flow bottlenecks, 3) On-time delivery improvement from 5.2% increase, 4) Capacity utilization growth trajectory (+6.5%), 5) Downtime reduction success factors (-42%), 6) Predictive analysis for next 4 weeks based on current trends, 7) Risk factors that could impact continued improvement."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#6F83A7]">Efficiency Trend</span>
                  <span className="text-white text-sm">88%</span>
                </div>
                <Progress value={88} className="h-2" />
                <div className="text-xs text-[#57ACAF] mt-2">+6% vs Week 1 • Above target</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#6F83A7]">On-Time Delivery</span>
                  <span className="text-white text-sm">94%</span>
                </div>
                <Progress value={94} className="h-2" />
                <div className="text-xs text-[#57ACAF] mt-2">+5.2% improvement</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#6F83A7]">Material Readiness</span>
                  <span className="text-white text-sm">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                <div className="text-xs text-[#57ACAF] mt-2">+2.1% increase</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Trends Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Efficiency Trend */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-[#57ACAF]" />
                Line Efficiency vs Target
              </h3>
              <p className="text-sm text-[#6F83A7]">4-week efficiency trend analysis</p>
            </div>
            <div className="flex gap-2">
              <MarbimAIButton
                marbimPrompt="Analyze the line efficiency trend over the past 4 weeks and provide insights on: 1) Performance progression from 82% to 88%, consistently beating the 85% target since Week 2, 2) Key drivers behind the 6% improvement, 3) Comparison against industry benchmarks, 4) Sustainability of current trend based on capacity constraints, 5) Recommendations to push efficiency toward 92% target, 6) Risk factors that could cause regression, 7) Forecast for next 4 weeks with confidence intervals."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
              <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-transparent hover:bg-white/5">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsLine data={lineEfficiencyTrendData}>
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
              <Line type="monotone" dataKey="efficiency" stroke="#57ACAF" strokeWidth={2} name="Actual" />
              <Line type="monotone" dataKey="target" stroke="#EAB308" strokeWidth={2} strokeDasharray="5 5" name="Target" />
            </RechartsLine>
          </ResponsiveContainer>
        </div>

        {/* WIP Progress */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#57ACAF]" />
                WIP by Stage
              </h3>
              <p className="text-sm text-[#6F83A7]">Current work-in-progress distribution</p>
            </div>
            <MarbimAIButton
              marbimPrompt="Analyze the WIP distribution across production stages and provide insights on: 1) Stage-wise breakdown (Cutting: 120, Sewing: 185, Washing: 45, Finishing: 68, Packing: 34), 2) Bottleneck identification in Sewing with highest WIP accumulation, 3) Flow optimization recommendations to balance stages, 4) Cycle time reduction opportunities, 5) Impact on delivery timelines, 6) Historical comparison and trends."
              onAskMarbim={onAskMarbim}
              size="sm"
            />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={wipProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="stage" stroke="#6F83A7" tick={{ fontSize: 11 }} />
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
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6F83A7]">Total WIP Units</span>
              <span className="text-white text-xl">452</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderMasterPlan = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Master Plan (Gantt)</h2>
          <p className="text-sm text-[#6F83A7]">Visual scheduler showing all active orders and task progress</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
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
              <Grid className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="what-if-scenarios" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Layers className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">What-If Scenarios</span>
            </TabsTrigger>
            <TabsTrigger 
              value="approvals-changes" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <CheckCircle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Approvals & Changes</span>
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
          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-[#57ACAF]/10 via-[#EAB308]/5 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(87,172,175,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/30">
                    <Grid className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl mb-2">Master Production Plan Overview</h2>
                    <p className="text-[#6F83A7] text-sm max-w-2xl">
                      Complete visibility into active production orders with Gantt timeline visualization. 
                      Track order progress, monitor milestone completion, and manage production flow across all stages.
                    </p>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Provide comprehensive master plan analysis including: 1) Overall production schedule health across 3 active orders (ORD-1124 In Progress 65%, ORD-1203 Planned, ORD-1198 In Progress 45%), 2) Critical path analysis and milestone tracking for each order, 3) Completion date predictions based on current progress and WIP status (Cutting: 120, Sewing: 185 bottleneck, Washing: 45, Finishing: 68, Packing: 34), 4) Resource allocation effectiveness across production lines, 5) Material readiness impact on schedule adherence (92% ready, trim shortage risk), 6) Recommendations for schedule optimization and bottleneck resolution, 7) Risk assessment for on-time delivery (current 94% on-time rate), 8) Forecast for next 2 weeks based on current velocity and capacity."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Active Orders</span>
                  </div>
                  <div className="text-2xl text-white mb-1">3</div>
                  <div className="text-xs text-[#57ACAF]">12,500 units total</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-xs text-[#6F83A7]">Avg Progress</span>
                  </div>
                  <div className="text-2xl text-white mb-1">55%</div>
                  <div className="text-xs text-[#57ACAF]">On schedule</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#6F83A7]" />
                    <span className="text-xs text-[#6F83A7]">Timeline</span>
                  </div>
                  <div className="text-2xl text-white mb-1">18d</div>
                  <div className="text-xs text-[#EAB308]">Avg remaining</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Milestones Hit</span>
                  </div>
                  <div className="text-2xl text-white mb-1">8/12</div>
                  <div className="text-xs text-[#57ACAF]">67% completion</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-[#D0342C]" />
                    <span className="text-xs text-[#6F83A7]">At Risk</span>
                  </div>
                  <div className="text-2xl text-white mb-1">1</div>
                  <div className="text-xs text-[#D0342C]">Delayed milestone</div>
                </div>
              </div>
            </div>
          </div>

          {/* Production Flow & Order Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Orders & Workflow */}
            <div className="lg:col-span-2 space-y-6">
              {/* Workflow Progress */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <Grid className="w-5 h-5 text-[#57ACAF]" />
                      Production Flow Status
                    </h3>
                    <p className="text-sm text-[#6F83A7]">Current stage progression across all active orders</p>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze the production flow across all stages and provide insights on: 1) Current stage completion status (Cutting: Complete, Sewing: Active with bottleneck, Washing/Finishing/Packing/Dispatch: Pending), 2) Bottleneck identification in Sewing stage with 185 WIP units causing 2-day delay risk, 3) Flow optimization recommendations to accelerate stage transitions, 4) Resource reallocation opportunities to balance workload, 5) Predicted completion timeline for each stage based on current velocity, 6) Risk mitigation strategies for pending stages."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <WorkflowStepper
                    steps={[
                      { label: 'Cutting', status: 'completed' },
                      { label: 'Sewing', status: 'active' },
                      { label: 'Washing', status: 'pending' },
                      { label: 'Finishing', status: 'pending' },
                      { label: 'Packing', status: 'pending' },
                      { label: 'Dispatch', status: 'pending' },
                    ]}
                  />
                </div>
              </div>

              {/* Active Orders Table */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#57ACAF]" />
                      Gantt View - Active Orders
                    </h3>
                    <p className="text-sm text-[#6F83A7]">Timeline and status of all production orders</p>
                  </div>
                  <div className="flex gap-2">
                    <MarbimAIButton
                      marbimPrompt="Analyze the active production orders and provide insights on: 1) Order-by-order status analysis (ORD-1124 H&M T-Shirt 5K units In Progress 65%, ORD-1203 Zara Denim 3K units Planned, ORD-1198 Gap Polo 4.5K units In Progress 45%), 2) Timeline adherence and predicted completion dates based on current progress, 3) Critical orders requiring immediate attention, 4) Resource allocation recommendations across orders, 5) Material readiness for each order, 6) Sequencing optimization to maximize throughput, 7) Risk assessment for on-time delivery."
                      onAskMarbim={onAskMarbim}
                      size="sm"
                    />
                    <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-transparent hover:bg-white/5">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EAB308]"></div>
                  </div>
                ) : (
                  <SmartTable
                    columns={masterPlanColumns}
                    data={orders}
                    searchPlaceholder="Search orders..."
                    onRowClick={handleRowClick}
                  />
                )}
              </div>
            </div>

            {/* Right Column - AI Insights */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">AI Completion Prediction</h4>
                      <p className="text-xs text-[#6F83A7]">Intelligent delivery forecasting</p>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Predict completion date deviations for all active production orders including: 1) Real-time WIP analysis (452 units across 5 stages with Sewing bottleneck at 185 units), 2) Material availability impact on timeline (92% readiness, trim shortage risk), 3) Historical delay patterns and seasonal factors, 4) Line efficiency trends (current 88%, target 92%), 5) Order-specific risk factors (ORD-1124 2-day delay risk), 6) Probabilistic completion forecasts with confidence intervals, 7) Recommended corrective actions to maintain on-time delivery (current 94% rate)."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <div className="flex items-start gap-3">
                      <Target className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-white mb-1">ORD-1124 Completion Forecast</div>
                        <div className="text-xs text-[#6F83A7] mb-2">
                          Expected: Nov 5 • <span className="text-[#D0342C]">Risk: 2-day delay</span>
                        </div>
                        <div className="text-xs text-[#6F83A7]">
                          Confidence: 78% • Based on sewing bottleneck
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-white mb-1">ORD-1203 On Track</div>
                        <div className="text-xs text-[#6F83A7] mb-2">
                          Expected: Nov 8 • <span className="text-[#57ACAF]">On schedule</span>
                        </div>
                        <div className="text-xs text-[#6F83A7]">
                          Confidence: 92% • Material ready
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <div className="flex items-start gap-3">
                      <Activity className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-white mb-1">ORD-1198 Progress Update</div>
                        <div className="text-xs text-[#6F83A7] mb-2">
                          Expected: Nov 12 • <span className="text-[#EAB308]">Monitor closely</span>
                        </div>
                        <div className="text-xs text-[#6F83A7]">
                          Confidence: 85% • 45% complete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-[#57ACAF]" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Critical Actions</h4>
                      <p className="text-xs text-[#6F83A7]">Immediate interventions required</p>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Identify critical actions needed to maintain production schedule including: 1) Immediate bottleneck resolution in Sewing stage (185 WIP units), 2) Resource reallocation recommendations, 3) Material shortage mitigation for trim delays, 4) Order prioritization based on delivery urgency and profitability, 5) Contingency planning for at-risk orders, 6) Timeline recovery strategies with cost-benefit analysis."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">Sewing Bottleneck</span>
                      <Badge className="bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20">Urgent</Badge>
                    </div>
                    <div className="text-sm text-white mb-2">Address 185 WIP units in sewing</div>
                    <Button size="sm" className="w-full bg-[#D0342C] hover:bg-[#D0342C]/90">
                      Resolve Now
                    </Button>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">Material Check</span>
                      <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">Medium</Badge>
                    </div>
                    <div className="text-sm text-white mb-2">Verify trim availability for ORD-1203</div>
                    <Button size="sm" className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                      Check Status
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="what-if-scenarios" className="space-y-6">
          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-[#EAB308]/10 via-[#57ACAF]/5 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(87,172,175,0.1),transparent_50%)]" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/30">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl mb-2">What-If Scenario Planning</h2>
                    <p className="text-[#6F83A7] text-sm max-w-2xl">
                      Simulate alternative production strategies and analyze their impact on delivery, cost, and resource utilization. 
                      Model overtime, reallocation, shift changes, and capacity adjustments with AI-powered outcome predictions.
                    </p>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Provide comprehensive scenario planning analysis including: 1) Evaluation of proposed scenarios (Overtime: -1.5 days/$1,200, Reallocation: +8% throughput/neutral cost, Shift Extension: +12% capacity/$2,500), 2) Cost-benefit analysis for each scenario with ROI calculations, 3) Risk assessment and success probability for each option, 4) Resource availability and feasibility analysis, 5) Impact on worker fatigue and quality metrics, 6) Optimal scenario recommendation based on current constraints and priorities, 7) Hybrid scenario combinations for maximum efficiency, 8) Implementation timeline and change management considerations."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Active Scenarios</span>
                  </div>
                  <div className="text-2xl text-white mb-1">5</div>
                  <div className="text-xs text-[#57ACAF]">Under evaluation</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-xs text-[#6F83A7]">Potential Gain</span>
                  </div>
                  <div className="text-2xl text-white mb-1">+12%</div>
                  <div className="text-xs text-[#57ACAF]">Capacity boost</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Time Savings</span>
                  </div>
                  <div className="text-2xl text-white mb-1">-1.5d</div>
                  <div className="text-xs text-[#57ACAF]">Best scenario</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-xs text-[#6F83A7]">Cost Impact</span>
                  </div>
                  <div className="text-2xl text-white mb-1">$3.7K</div>
                  <div className="text-xs text-[#EAB308]">Total investment</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Success Rate</span>
                  </div>
                  <div className="text-2xl text-white mb-1">87%</div>
                  <div className="text-xs text-[#57ACAF]">Avg probability</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Comparison & Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Scenarios */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Scenario Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6 hover:border-[#57ACAF]/40 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-[#6F83A7] text-sm">Scenario A</div>
                    <Clock className="w-5 h-5 text-[#57ACAF] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-white mb-1">Rush Order</div>
                  <div className="text-3xl text-[#57ACAF] mb-3">-1.5 days</div>
                  <div className="text-sm text-[#6F83A7] mb-3">With overtime (2 hrs/day)</div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6F83A7]">Cost Impact</span>
                      <span className="text-white">+$1,200</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6 hover:border-[#EAB308]/40 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-[#6F83A7] text-sm">Scenario B</div>
                    <RefreshCw className="w-5 h-5 text-[#EAB308] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-white mb-1">Reallocation</div>
                  <div className="text-3xl text-[#EAB308] mb-3">+8%</div>
                  <div className="text-sm text-[#6F83A7] mb-3">Throughput improvement</div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6F83A7]">Cost Impact</span>
                      <span className="text-[#57ACAF]">Neutral</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6 hover:border-[#6F83A7]/40 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-[#6F83A7] text-sm">Scenario C</div>
                    <Users className="w-5 h-5 text-[#6F83A7] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-white mb-1">Shift Extension</div>
                  <div className="text-3xl text-[#6F83A7] mb-3">+12%</div>
                  <div className="text-sm text-[#6F83A7] mb-3">Capacity increase</div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6F83A7]">Cost Impact</span>
                      <span className="text-white">+$2,500</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Scenario Simulation */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <Play className="w-5 h-5 text-[#57ACAF]" />
                      Scenario Simulation Engine
                    </h3>
                    <p className="text-sm text-[#6F83A7]">Model and compare production strategy alternatives</p>
                  </div>
                  <div className="flex gap-2">
                    <MarbimAIButton
                      marbimPrompt="Analyze all simulation scenarios in detail including: 1) Overtime (2 hrs/day): Delivery -1.5 days with $1,200 cost, impact on worker fatigue and quality, feasibility analysis, 2) Line Reallocation: +8% throughput improvement, neutral cost, implementation complexity, resource availability, 3) Shift Extension: +12% capacity boost with $2,500 cost, worker availability, training requirements, 4) Comparative ROI analysis across all scenarios, 5) Risk assessment and probability of success, 6) Hybrid scenario recommendations combining elements, 7) Implementation timelines and change management, 8) Long-term sustainability of each approach."
                      onAskMarbim={onAskMarbim}
                      size="sm"
                    />
                    <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-transparent hover:bg-white/5">
                      <Plus className="w-4 h-4 mr-2" />
                      New Scenario
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { scenario: 'Overtime (2 hrs/day)', impact: 'Delivery: -1.5 days', cost: '+$1,200', probability: 92, icon: Clock, color: '#57ACAF' },
                    { scenario: 'Line Reallocation', impact: 'Throughput: +8%', cost: 'Neutral', probability: 85, icon: RefreshCw, color: '#EAB308' },
                    { scenario: 'Shift Extension', impact: 'Capacity: +12%', cost: '+$2,500', probability: 78, icon: Users, color: '#6F83A7' },
                    { scenario: 'Material Pre-Order', impact: 'Lead Time: -2 days', cost: '+$800', probability: 88, icon: Package, color: '#57ACAF' },
                    { scenario: 'Parallel Production', impact: 'Efficiency: +6%', cost: '+$400', probability: 90, icon: Layers, color: '#EAB308' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                        <div className="flex items-start gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: `${item.color}20` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: item.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-white">{item.scenario}</span>
                              <Button size="sm" className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                                <Play className="w-3 h-3 mr-2" />
                                Simulate
                              </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <span className="text-xs text-[#6F83A7]">Impact</span>
                                <div className="text-sm text-white">{item.impact}</div>
                              </div>
                              <div>
                                <span className="text-xs text-[#6F83A7]">Cost</span>
                                <div className="text-sm text-white">{item.cost}</div>
                              </div>
                              <div>
                                <span className="text-xs text-[#6F83A7]">Success Rate</span>
                                <div className="text-sm" style={{ color: item.color }}>{item.probability}%</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#6F83A7]">Probability</span>
                                <span className="text-white">{item.probability}%</span>
                              </div>
                              <Progress value={item.probability} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - AI Insights */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">AI Scenario Optimizer</h4>
                      <p className="text-xs text-[#6F83A7]">Intelligent strategy recommendations</p>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Optimize production scenarios with AI analysis including: 1) Recommended optimal scenario based on current constraints (capacity, budget, timeline urgency), 2) Hybrid scenario combinations for maximum benefit, 3) Trade-off analysis between cost, time, and quality, 4) Risk mitigation strategies for each scenario, 5) Implementation roadmap with phase-wise execution, 6) Expected ROI and payback period, 7) Sensitivity analysis for key variables (worker availability, material delays, machine downtime)."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <div className="flex items-start gap-3">
                      <Target className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-white mb-1">Recommended Strategy</div>
                        <div className="text-xs text-[#6F83A7] mb-2">
                          Combine Line Reallocation (+8%) with Material Pre-Order (-2 days)
                        </div>
                        <div className="text-xs">
                          <span className="text-[#6F83A7]">ROI:</span> <span className="text-[#57ACAF]">185%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-white mb-1">Risk Alert</div>
                        <div className="text-xs text-[#6F83A7] mb-2">
                          Overtime scenario may impact quality in week 3+
                        </div>
                        <div className="text-xs">
                          <span className="text-[#6F83A7]">Mitigation:</span> <span className="text-white">Rotate shifts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <div className="flex items-start gap-3">
                      <Zap className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-white mb-1">Quick Win</div>
                        <div className="text-xs text-[#6F83A7] mb-2">
                          Parallel Production: Low cost, high probability (90%)
                        </div>
                        <Button size="sm" className="w-full bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white">
                          Implement
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Impact Comparison</h4>
                      <p className="text-xs text-[#6F83A7]">Cross-scenario analysis</p>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Compare all scenarios across key metrics including: 1) Cost efficiency ranking and total investment required, 2) Time savings comparison and delivery impact, 3) Capacity utilization improvements, 4) Quality and worker satisfaction considerations, 5) Implementation complexity and resource requirements, 6) Risk profiles and success probabilities, 7) Long-term strategic alignment with business goals."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">Best for Speed</span>
                      <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">Overtime</Badge>
                    </div>
                    <div className="text-sm text-white">-1.5 days delivery time</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">Best for Cost</span>
                      <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">Reallocation</Badge>
                    </div>
                    <div className="text-sm text-white">Neutral cost impact</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">Best for Capacity</span>
                      <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20">Shift Extension</Badge>
                    </div>
                    <div className="text-sm text-white">+12% capacity boost</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="approvals-changes" className="space-y-6">
          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-[#57ACAF]/10 via-[#EAB308]/5 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(87,172,175,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/30">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl mb-2">Approvals & Plan Changes</h2>
                    <p className="text-[#6F83A7] text-sm max-w-2xl">
                      Manage production plan modifications, approve resource reallocations, and track change requests. 
                      AI-powered risk assessment and automated proposal drafting for schedule adjustments.
                    </p>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Provide comprehensive approval management analysis including: 1) Overview of pending approvals (1 reallocation request, 1 overtime approval) and approved changes, 2) Risk impact assessment for each pending change (resource availability, cost implications, timeline adjustments), 3) Approval recommendations based on priority, urgency, and business impact, 4) Automated proposal drafting for rescheduling delayed orders with risk calculations, 5) Change history analysis and patterns, 6) Resource constraint validation for proposed changes, 7) Stakeholder notification requirements, 8) Implementation timeline for approved changes."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-xs text-[#6F83A7]">Pending Approval</span>
                  </div>
                  <div className="text-2xl text-white mb-1">3</div>
                  <div className="text-xs text-[#EAB308]">Needs review</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Approved Today</span>
                  </div>
                  <div className="text-2xl text-white mb-1">5</div>
                  <div className="text-xs text-[#57ACAF]">Implemented</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-[#D0342C]" />
                    <span className="text-xs text-[#6F83A7]">Rejected</span>
                  </div>
                  <div className="text-2xl text-white mb-1">1</div>
                  <div className="text-xs text-[#D0342C]">This week</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#6F83A7]" />
                    <span className="text-xs text-[#6F83A7]">Avg Response</span>
                  </div>
                  <div className="text-2xl text-white mb-1">4.2h</div>
                  <div className="text-xs text-[#57ACAF]">Fast turnaround</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Success Rate</span>
                  </div>
                  <div className="text-2xl text-white mb-1">92%</div>
                  <div className="text-xs text-[#57ACAF]">Implementation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Queue & Change Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Approval Queue */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pending Approvals */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-[#EAB308]" />
                      Pending Approvals
                    </h3>
                    <p className="text-sm text-[#6F83A7]">Change requests requiring management review</p>
                  </div>
                  <div className="flex gap-2">
                    <MarbimAIButton
                      marbimPrompt="Analyze pending approvals and provide recommendations including: 1) Priority ranking based on business impact and urgency, 2) Risk assessment for each change request (Reallocation: medium complexity, high impact; Overtime: low complexity, medium cost), 3) Resource availability validation, 4) Cost-benefit analysis with ROI projections, 5) Timeline impact on delivery commitments, 6) Approval or rejection recommendations with detailed justification, 7) Alternative solutions if rejection is recommended."
                      onAskMarbim={onAskMarbim}
                      size="sm"
                    />
                    <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-transparent hover:bg-white/5">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { 
                      change: 'Reallocation: ORD-1203 to Line 6', 
                      requester: 'John D.', 
                      date: '2024-10-26', 
                      status: 'Pending',
                      impact: '+8% throughput',
                      risk: 'Medium',
                      icon: RefreshCw,
                      color: '#EAB308'
                    },
                    { 
                      change: 'Overtime approval for ORD-1124', 
                      requester: 'Sarah M.', 
                      date: '2024-10-26', 
                      status: 'Pending',
                      impact: '-1.5 days delivery',
                      risk: 'Low',
                      icon: Clock,
                      color: '#57ACAF'
                    },
                    { 
                      change: 'Material pre-order for ORD-1198', 
                      requester: 'Mike R.', 
                      date: '2024-10-26', 
                      status: 'Pending',
                      impact: 'Secure supply',
                      risk: 'Low',
                      icon: Package,
                      color: '#57ACAF'
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                        <div className="flex items-start gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: `${item.color}20` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: item.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-white">{item.change}</div>
                              <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                                {item.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <span className="text-xs text-[#6F83A7]">Requested By</span>
                                <div className="text-sm text-white">{item.requester}</div>
                              </div>
                              <div>
                                <span className="text-xs text-[#6F83A7]">Date</span>
                                <div className="text-sm text-white">{item.date}</div>
                              </div>
                              <div>
                                <span className="text-xs text-[#6F83A7]">Risk Level</span>
                                <div className="text-sm" style={{ color: item.color }}>{item.risk}</div>
                              </div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10 mb-3">
                              <div className="text-xs text-[#6F83A7] mb-1">Expected Impact</div>
                              <div className="text-sm text-white">{item.impact}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1 bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white">
                                <CheckCircle className="w-3 h-3 mr-2" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]">
                                <XCircle className="w-3 h-3 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Changes */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#57ACAF]" />
                      Recent Change History
                    </h3>
                    <p className="text-sm text-[#6F83A7]">Approved and implemented changes</p>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze recent change history including: 1) Pattern analysis of approved vs rejected changes, 2) Success rate of implemented changes (92%), 3) Common change types and their outcomes, 4) Average approval time (4.2 hours) and optimization opportunities, 5) Impact correlation between predicted and actual results, 6) Lessons learned for future change management, 7) Recommendations for process improvement."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="space-y-3">
                  {[
                    { change: 'Overtime approval for ORD-1124', requester: 'Sarah M.', date: '2024-10-25', status: 'Approved', result: 'Successful' },
                    { change: 'Shift extension for Line 3', requester: 'Mike R.', date: '2024-10-24', status: 'Approved', result: 'In Progress' },
                    { change: 'Order reprioritization', requester: 'Lisa K.', date: '2024-10-23', status: 'Rejected', result: 'N/A' },
                    { change: 'Material fast-track ORD-1203', requester: 'John D.', date: '2024-10-23', status: 'Approved', result: 'Successful' },
                  ].map((item, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white text-sm">{item.change}</div>
                        <div className="flex gap-2">
                          <Badge className={
                            item.status === 'Approved' 
                              ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20' 
                              : 'bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20'
                          }>
                            {item.status}
                          </Badge>
                          {item.result !== 'N/A' && (
                            <Badge className={
                              item.result === 'Successful' 
                                ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20' 
                                : 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20'
                            }>
                              {item.result}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#6F83A7]">
                        <span>By: {item.requester}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - AI Insights */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">AI Proposal Drafting</h4>
                      <p className="text-xs text-[#6F83A7]">Automated change proposals</p>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Draft comprehensive rescheduling proposals for delayed orders including: 1) Detailed analysis of ORD-1124 2-day delay risk with root cause (sewing bottleneck with 185 WIP units), 2) Proposed mitigation strategies (overtime, reallocation, parallel processing), 3) Risk impact calculations: cost implications (+$1,200 overtime or $0 reallocation), labor requirements (5 additional operators or reassignment), lead time adjustments (-1.5 days with overtime), 4) Resource availability validation, 5) Alternative scenarios with pros/cons, 6) Implementation timeline and change management plan, 7) Success probability and contingency planning."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-white mb-1">Auto-Draft Proposal</div>
                        <div className="text-xs text-[#6F83A7] mb-2">
                          Generate rescheduling plan with risk analysis
                        </div>
                        <Button size="sm" className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                          Generate Now
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <div className="flex items-start gap-3">
                      <Calculator className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-white mb-1">Impact Calculator</div>
                        <div className="text-xs text-[#6F83A7] mb-2">
                          Cost: $1,200 • Labor: +5 ops • Time: -1.5d
                        </div>
                        <div className="text-xs">
                          <span className="text-[#6F83A7]">ROI:</span> <span className="text-[#57ACAF]">235%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-[#57ACAF]" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Approval Insights</h4>
                      <p className="text-xs text-[#6F83A7]">Decision support metrics</p>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Provide approval decision support including: 1) Success probability for each pending change based on historical data, 2) Resource constraint validation, 3) Stakeholder impact analysis, 4) Timeline sensitivity assessment, 5) Alternative recommendation if rejection is advised, 6) Risk scoring matrix, 7) Approval workflow optimization suggestions."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">High Priority</span>
                      <Badge className="bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20">Urgent</Badge>
                    </div>
                    <div className="text-sm text-white mb-1">ORD-1203 Reallocation</div>
                    <div className="text-xs text-[#6F83A7]">Approval recommended: +8% throughput</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">Review Queue</span>
                      <span className="text-white text-sm">3 items</span>
                    </div>
                    <div className="text-xs text-[#6F83A7]">Avg response time: 4.2 hours</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">Success Rate</span>
                      <span className="text-[#57ACAF] text-sm">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-[#EAB308]/10 via-[#57ACAF]/5 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(87,172,175,0.1),transparent_50%)]" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/30">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl mb-2">AI-Powered Production Intelligence</h2>
                    <p className="text-[#6F83A7] text-sm max-w-2xl">
                      Advanced AI recommendations for production optimization, resource reallocation, and efficiency improvements. 
                      Real-time insights with predictive analytics and automated decision support.
                    </p>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Provide comprehensive AI-driven production intelligence including: 1) Master plan optimization impact analysis (On-Time: 89%→94%, Efficiency: 85%→88%, Utilization: 72%→78%), 2) Critical resource reallocation recommendations for fabric delay (1.8-day shift, reallocate to Line 5), 3) Parallel processing opportunities (Styles K102/K108 parallel sewing: -12% idle hours), 4) Bottleneck resolution strategies for sewing stage (185 WIP units), 5) Predictive maintenance alerts and capacity planning, 6) Cost optimization opportunities with quantified savings, 7) Long-term efficiency improvement roadmap, 8) Success probability scoring for all recommendations."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-xs text-[#6F83A7]">AI Recommendations</span>
                  </div>
                  <div className="text-2xl text-white mb-1">12</div>
                  <div className="text-xs text-[#57ACAF]">Active insights</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Efficiency Gain</span>
                  </div>
                  <div className="text-2xl text-white mb-1">+3%</div>
                  <div className="text-xs text-[#57ACAF]">With AI optimization</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-xs text-[#6F83A7]">On-Time Impact</span>
                  </div>
                  <div className="text-2xl text-white mb-1">+5%</div>
                  <div className="text-xs text-[#57ACAF]">Delivery improvement</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-[#57ACAF]" />
                    <span className="text-xs text-[#6F83A7]">Cost Savings</span>
                  </div>
                  <div className="text-2xl text-white mb-1">$8.5K</div>
                  <div className="text-xs text-[#57ACAF]">Potential monthly</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-xs text-[#6F83A7]">Utilization Boost</span>
                  </div>
                  <div className="text-2xl text-white mb-1">+6%</div>
                  <div className="text-xs text-[#57ACAF]">Capacity optimization</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations & Impact Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - AI Recommendations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Critical Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#D0342C]/10 to-[#D0342C]/5 border border-[#D0342C]/20 rounded-2xl p-6 hover:border-[#D0342C]/40 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-[#D0342C]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
                      </div>
                      <div>
                        <div className="text-white mb-1">Resource Reallocation</div>
                        <Badge className="bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20">Urgent</Badge>
                      </div>
                    </div>
                    <MarbimAIButton
                      marbimPrompt="Analyze resource reallocation opportunity including: 1) Fabric delay root cause and 1.8-day average shift impact, 2) Detailed Line 5 reallocation plan with capacity analysis, 3) Throughput optimization calculations, 4) Risk assessment and success probability, 5) Implementation timeline and resource requirements, 6) Alternative scenarios if Line 5 unavailable, 7) Cost-benefit analysis and ROI projections."
                      onAskMarbim={onAskMarbim}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-[#6F83A7] mb-4">
                    Fabric delay causes 1.8-day average shift — reallocate resources to Line 5 for optimal throughput.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6F83A7]">Impact</span>
                      <span className="text-white">+12% throughput</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6F83A7]">Success Probability</span>
                      <span className="text-[#57ACAF]">88%</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#D0342C] hover:bg-[#D0342C]/90 text-white">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reallocate Now
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-6 hover:border-[#57ACAF]/40 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Layers className="w-5 h-5 text-[#57ACAF]" />
                      </div>
                      <div>
                        <div className="text-white mb-1">Parallel Processing</div>
                        <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">Recommended</Badge>
                      </div>
                    </div>
                    <MarbimAIButton
                      marbimPrompt="Analyze parallel processing opportunity including: 1) Detailed analysis of Styles K102 and K108 parallel sewing feasibility, 2) Idle time reduction calculation (-12% idle hours), 3) Resource availability and operator skill requirements, 4) Equipment capacity validation, 5) Quality control considerations, 6) Timeline impact on both styles, 7) Implementation plan with phase-wise rollout."
                      onAskMarbim={onAskMarbim}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-[#6F83A7] mb-4">
                    Parallel sewing for Styles #K102 and #K108 reduces idle hours by 12%.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6F83A7]">Time Savings</span>
                      <span className="text-white">-12% idle hours</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6F83A7]">Success Probability</span>
                      <span className="text-[#57ACAF]">92%</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Implement
                  </Button>
                </div>
              </div>

              {/* AI Optimization Impact */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                      Plan Optimization Impact Analysis
                    </h3>
                    <p className="text-sm text-[#6F83A7]">Before vs After AI implementation comparison</p>
                  </div>
                  <div className="flex gap-2">
                    <MarbimAIButton
                      marbimPrompt="Provide detailed optimization impact analysis including: 1) On-Time Delivery improvement from 89% to 94% (+5%) with contributing factors, 2) Efficiency enhancement from 85% to 88% (+3%) through line optimization and bottleneck resolution, 3) Utilization boost from 72% to 78% (+6%) via capacity balancing, 4) Cost savings breakdown and ROI analysis, 5) Quality metrics impact assessment, 6) Worker satisfaction and fatigue considerations, 7) Sustainability of improvements and long-term projections, 8) Risk factors and mitigation strategies for maintaining gains."
                      onAskMarbim={onAskMarbim}
                      size="sm"
                    />
                    <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-transparent hover:bg-white/5">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[
                      { metric: 'On-Time', before: 89, after: 94 },
                      { metric: 'Efficiency', before: 85, after: 88 },
                      { metric: 'Utilization', before: 72, after: 78 },
                    ]}>
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
                      <Bar dataKey="before" fill="#6F83A7" radius={[8, 8, 0, 0]} name="Before" />
                      <Bar dataKey="after" fill="#57ACAF" radius={[8, 8, 0, 0]} name="After AI" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="space-y-4">
                    {[
                      { metric: 'On-Time Delivery', before: 89, after: 94, improvement: '+5%', color: '#57ACAF' },
                      { metric: 'Line Efficiency', before: 85, after: 88, improvement: '+3%', color: '#EAB308' },
                      { metric: 'Capacity Utilization', before: 72, after: 78, improvement: '+6%', color: '#6F83A7' },
                    ].map((item, index) => (
                      <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white">{item.metric}</span>
                          <Badge 
                            className="border" 
                            style={{ 
                              backgroundColor: `${item.color}10`, 
                              color: item.color, 
                              borderColor: `${item.color}40` 
                            }}
                          >
                            {item.improvement}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                          <div>
                            <div className="text-xs text-[#6F83A7]">Before</div>
                            <div className="text-lg text-white">{item.before}%</div>
                          </div>
                          <div className="flex-1">
                            <Progress value={item.after} className="h-2" />
                          </div>
                          <div>
                            <div className="text-xs text-[#6F83A7]">After</div>
                            <div className="text-lg" style={{ color: item.color }}>{item.after}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional AI Recommendations */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#EAB308]" />
                      Additional AI Recommendations
                    </h3>
                    <p className="text-sm text-[#6F83A7]">More optimization opportunities</p>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Provide additional AI recommendations including: 1) Material pre-ordering optimization to reduce lead time delays, 2) Shift scheduling improvements for better capacity coverage, 3) Quality checkpoint automation opportunities, 4) Predictive maintenance scheduling for equipment, 5) Cross-training recommendations for skill gap coverage, 6) Inventory level optimization to prevent stockouts, 7) Vendor consolidation opportunities for cost reduction."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Material Pre-Order', impact: '-2 days lead time', probability: 88, icon: Package, color: '#57ACAF' },
                    { title: 'Shift Optimization', impact: '+10% coverage', probability: 85, icon: Clock, color: '#EAB308' },
                    { title: 'Quality Automation', impact: '-15% inspection time', probability: 92, icon: CheckCircle, color: '#57ACAF' },
                    { title: 'Predictive Maintenance', impact: '-30% downtime', probability: 78, icon: Settings, color: '#6F83A7' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group cursor-pointer">
                        <div className="flex items-start gap-3 mb-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: `${item.color}20` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: item.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-white mb-1">{item.title}</div>
                            <div className="text-xs text-[#6F83A7]">{item.impact}</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#6F83A7]">Success Rate</span>
                            <span style={{ color: item.color }}>{item.probability}%</span>
                          </div>
                          <Progress value={item.probability} className="h-1.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - AI Performance & Insights */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">AI Performance</h4>
                      <p className="text-xs text-[#6F83A7]">Recommendation success rate</p>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze AI performance metrics including: 1) Overall recommendation accuracy and success rate (89%), 2) Impact of implemented vs ignored recommendations, 3) Cost savings achieved through AI optimization ($8.5K monthly potential), 4) Time savings from automated decision support, 5) Quality improvements attributed to AI insights, 6) User adoption rate and satisfaction, 7) Areas for AI model improvement and fine-tuning."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">Accuracy Rate</span>
                      <span className="text-white text-sm">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                    <div className="text-xs text-[#57ACAF] mt-2">Consistently improving</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">Implementation Rate</span>
                      <span className="text-white text-sm">76%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                    <div className="text-xs text-[#6F83A7] mt-2">9 of 12 recommendations</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-2">Monthly Impact</div>
                    <div className="text-2xl text-[#57ACAF] mb-1">$8.5K</div>
                    <div className="text-xs text-[#6F83A7]">Potential savings</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Trending Insights</h4>
                      <p className="text-xs text-[#6F83A7]">Latest AI discoveries</p>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Provide trending insights including: 1) Emerging patterns in production data, 2) Seasonal trends and their impact on planning, 3) New optimization opportunities discovered, 4) Benchmark comparisons with industry standards, 5) Predictive alerts for upcoming bottlenecks, 6) Machine learning model updates and improvements."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-white mb-1">Efficiency Pattern</div>
                        <div className="text-xs text-[#6F83A7]">
                          Tuesday-Thursday show +8% higher efficiency
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-white mb-1">Peak Hours</div>
                        <div className="text-xs text-[#6F83A7]">
                          9-11 AM optimal for critical operations
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <div className="flex items-start gap-3">
                      <Target className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-white mb-1">Style Affinity</div>
                        <div className="text-xs text-[#6F83A7]">
                          T-shirts + Polos: +12% line efficiency
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderTACalendar = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">T&A Calendar (Time & Action)</h2>
          <p className="text-sm text-[#6F83A7]">Track all milestones from fabric arrival to shipment</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="milestones" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="milestones" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Target className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Milestones</span>
            </TabsTrigger>
            <TabsTrigger 
              value="dependencies" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Layers className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Dependencies</span>
            </TabsTrigger>
            <TabsTrigger 
              value="approvals" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <CheckCircle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
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

        <TabsContent value="milestones" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Milestone Tracker</h3>
            <SmartTable
              columns={milestonesColumns}
              data={milestonesData}
              searchPlaceholder="Search milestones..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Slippage Prediction</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM predicts milestone slippage and suggests preventive actions to keep schedule on track.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-6">Dependency Flow (ORD-1124)</h3>
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <WorkflowStepper
                steps={[
                  { label: 'Cutting', status: 'completed' },
                  { label: 'Sewing', status: 'active' },
                  { label: 'Washing', status: 'pending' },
                  { label: 'Finishing', status: 'pending' },
                  { label: 'Shipment', status: 'pending' },
                ]}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3">
              <Layers className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Auto-Update</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM auto-updates dependent milestones when one activity changes to maintain accuracy.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <div className="space-y-4">
            {[
              { milestone: 'Finishing Delay - ORD-1124', impact: '+1.5 days shipment', requester: 'Sarah M.', status: 'Pending' },
              { milestone: 'Expedite Batch #2201', impact: 'Start 2 days early', requester: 'John D.', status: 'Approved' },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white">{item.milestone}</div>
                  <Badge className={item.status === 'Pending' ? 'bg-[#EAB308]/10 text-[#EAB308]' : 'bg-[#57ACAF]/10 text-[#57ACAF]'}>
                    {item.status}
                  </Badge>
                </div>
                <div className="text-sm text-[#6F83A7] mb-2">Impact: {item.impact}</div>
                <div className="text-sm text-[#6F83A7]">Requested by: {item.requester}</div>
                {item.status === 'Pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 bg-[#57ACAF] hover:bg-[#57ACAF]/90">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-white/10">
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI T&A Revision</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM drafts revised T&A sheet and buyer communication notes automatically.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#D0342C]/10 border border-[#D0342C]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-[#D0342C] flex-shrink-0" />
                  <div className="text-white">Milestone Delay</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Finishing milestone delayed — downstream shipment ETA revised by +1.5 days.
                </p>
                <Button className="w-full bg-[#D0342C] hover:bg-[#D0342C]/90">
                  <Calendar className="w-4 h-4 mr-2" />
                  Update Calendar
                </Button>
              </div>

              <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Zap className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                  <div className="text-white">Parallel Processing</div>
                </div>
                <p className="text-sm text-[#6F83A7]">
                  Parallel process suggestion: start finishing for Batch #2201 ahead of schedule.
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Milestone Completion Rate</h3>
              <div className="space-y-4">
                {[
                  { milestone: 'On Time', percentage: 85, color: '#57ACAF' },
                  { milestone: 'Delayed', percentage: 12, color: '#EAB308' },
                  { milestone: 'Critical', percentage: 3, color: '#D0342C' },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white">{item.milestone}</span>
                      <span style={{ color: item.color }}>{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderMaterialsShortages = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Materials & Shortages</h2>
          <p className="text-sm text-[#6F83A7]">Monitor material readiness and detect shortages</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Send className="w-4 h-4 mr-2" />
            Expedite Material
          </Button>
        </div>
      </div>

      <Tabs defaultValue="material-status" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="material-status" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Package className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Material Status</span>
            </TabsTrigger>
            <TabsTrigger 
              value="shortages" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <AlertTriangle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Shortages</span>
            </TabsTrigger>
            <TabsTrigger 
              value="expedite-requests" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Zap className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Expedite Requests</span>
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

        <TabsContent value="material-status" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Material Status</h3>
            <SmartTable
              columns={materialStatusColumns}
              data={materialStatusData}
              searchPlaceholder="Search materials..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Gap Detection</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM detects material gaps and prioritizes expedite actions automatically.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shortages" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">High Risk</div>
              <div className="text-3xl text-[#D0342C]">1</div>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Medium Risk</div>
              <div className="text-3xl text-[#EAB308]">1</div>
            </div>
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Total Shortages</div>
              <div className="text-3xl text-white">2</div>
            </div>
          </div>

          <div className="space-y-4">
            {shortagesData.map((material) => (
              <div key={material.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white">{material.materialCode}</div>
                  <Badge className={
                    material.shortfall >= 500 ? 'bg-[#D0342C]/10 text-[#D0342C]' :
                    'bg-[#EAB308]/10 text-[#EAB308]'
                  }>
                    {material.shortfall >= 500 ? 'High Risk' : 'Medium Risk'}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-[#6F83A7]">Shortfall:</span>
                    <div className="text-[#D0342C]">{material.shortfall.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-[#6F83A7]">Supplier:</span>
                    <div className="text-white">{material.supplier}</div>
                  </div>
                  <div>
                    <span className="text-[#6F83A7]">ETA:</span>
                    <div className="text-white">{material.eta}</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full border-[#D0342C]/30 text-[#D0342C]">
                  <Send className="w-3 h-3 mr-2" />
                  Expedite Now
                </Button>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Alternative Suggestions</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM suggests alternate suppliers or substitute materials to prevent delays.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="expedite-requests" className="space-y-6">
          <div className="space-y-4">
            {[
              { material: 'TRIM-2024-1547', supplier: 'TrimWorks', requester: 'Sarah M.', date: '2024-10-26', status: 'In Progress' },
              { material: 'BTN-2024-8547', supplier: 'Button Co', requester: 'John D.', date: '2024-10-25', status: 'Completed' },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white">{item.material} - {item.supplier}</div>
                  <Badge className={item.status === 'In Progress' ? 'bg-[#EAB308]/10 text-[#EAB308]' : 'bg-[#57ACAF]/10 text-[#57ACAF]'}>
                    {item.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-[#6F83A7]">
                  <span>Requested by: {item.requester}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Email Automation</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM auto-generates supplier expedite emails and updates timeline automatically.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#D0342C]/10 border border-[#D0342C]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-[#D0342C] flex-shrink-0" />
                  <div className="text-white">Material Delay Impact</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Fabric A (180 GSM) delayed by 2 days — adjust sewing start date to Oct 27.
                </p>
                <Button className="w-full bg-[#D0342C] hover:bg-[#D0342C]/90">
                  <Calendar className="w-4 h-4 mr-2" />
                  Update Schedule
                </Button>
              </div>

              <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <RefreshCw className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                  <div className="text-white">Alternative Available</div>
                </div>
                <p className="text-sm text-[#6F83A7]">
                  Trim Z replacement available from Supplier Y — 10% faster delivery.
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Material Readiness by Category</h3>
              <div className="space-y-4">
                {[
                  { category: 'Fabric', readiness: 95 },
                  { category: 'Trims', readiness: 78 },
                  { category: 'Buttons', readiness: 82 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white">{item.category}</span>
                      <span className="text-[#57ACAF]">{item.readiness}%</span>
                    </div>
                    <Progress value={item.readiness} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderRiskAI = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Risk & AI Analytics</h2>
          <p className="text-sm text-[#6F83A7]">Predictive analytics, alerts, and simulation tools</p>
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

      <Tabs defaultValue="delay-predictions" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="delay-predictions" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <AlertCircle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Delay Predictions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="root-causes" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Target className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Root Causes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="alternative-options" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Layers className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Alternative Options</span>
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

        <TabsContent value="delay-predictions" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Delay Forecast</h3>
            <SmartTable
              columns={delayPredictionsColumns}
              data={delayPredictionsData}
              searchPlaceholder="Search predictions..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Time-Series Prediction</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM uses time-series prediction models to estimate late delivery risk probability.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="root-causes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { cause: 'Material Delay', count: 8, percentage: 42 },
              { cause: 'Machine Breakdown', count: 3, percentage: 16 },
              { cause: 'Skill Gap', count: 5, percentage: 26 },
              { cause: 'Labor Shortage', count: 3, percentage: 16 },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white">{item.cause}</span>
                  <Badge className="bg-[#EAB308]/10 text-[#EAB308]">{item.count} cases</Badge>
                </div>
                <Progress value={item.percentage} className="h-2 mb-2" />
                <div className="text-xs text-[#6F83A7]">{item.percentage}% of total delays</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Pattern Recognition</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM maps recurring patterns to upstream causes (e.g., same supplier or operation).
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alternative-options" className="space-y-6">
          <div className="space-y-4">
            {[
              { option: 'Overtime (2 hrs/day for 3 days)', time: '-1.5 days', cost: '+$1,200', feasibility: 'High' },
              { option: 'Parallel Line Assignment', time: '-1 day', cost: 'Neutral', feasibility: 'Medium' },
              { option: 'Outsourcing (500 units)', time: '-2 days', cost: '+$2,500', feasibility: 'Low' },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white">{item.option}</div>
                  <Badge className={
                    item.feasibility === 'High' ? 'bg-[#57ACAF]/10 text-[#57ACAF]' :
                    item.feasibility === 'Medium' ? 'bg-[#EAB308]/10 text-[#EAB308]' :
                    'bg-[#D0342C]/10 text-[#D0342C]'
                  }>
                    {item.feasibility} Feasibility
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#6F83A7]">Time Impact:</span>
                    <div className="text-[#57ACAF]">{item.time}</div>
                  </div>
                  <div>
                    <span className="text-[#6F83A7]">Cost Impact:</span>
                    <div className="text-white">{item.cost}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3">
              <Layers className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI Trade-off Calculation</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM calculates cost vs. time trade-off for each alternative option automatically.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#D0342C]/10 border border-[#D0342C]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-[#D0342C] flex-shrink-0" />
                  <div className="text-white">Predicted Delay Alert</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Predicted delay for Order #K320 — caused by low operator availability in sewing line.
                </p>
                <Button className="w-full bg-[#D0342C] hover:bg-[#D0342C]/90">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>

              <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Zap className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                  <div className="text-white">Proposed Solution</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  2-hour overtime/day for next 3 days = on-time completion with minimal cost impact.
                </p>
                <Button variant="outline" className="w-full border-[#57ACAF]/30 text-[#57ACAF]">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Solution
                </Button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Risk Level Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { level: 'Low', count: 28 },
                  { level: 'Medium', count: 12 },
                  { level: 'High', count: 3 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="level" stroke="#6F83A7" />
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
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderLineAllocation = () => (
    <>
      {/* Hero Banner with Executive Summary */}
      <div className="bg-gradient-to-br from-[#57ACAF]/10 via-[#EAB308]/5 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(87,172,175,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/30">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl mb-2">Line Allocation Intelligence</h2>
                <p className="text-[#6F83A7] text-sm max-w-2xl">
                  AI-powered line allocation and skill matching system. Optimize production line assignments, balance operator workload, 
                  and maximize efficiency through intelligent resource allocation and real-time skill proficiency analysis.
                </p>
              </div>
            </div>
            <MarbimAIButton
              marbimPrompt="Provide comprehensive line allocation analysis including: 1) Overall line utilization across 6 production lines (Line 1: 92% efficiency/95% load, Line 2: 88%/85%, Line 3: 78%/98%, Line 4: 95%/72%, Line 5: 85%/88%, Line 6: 90%/65% unassigned), 2) Operator skill matching effectiveness (Line 1: 95%, Line 2: 88%, Line 3: 72% skill mismatch requiring attention), 3) Load balancing recommendations to optimize capacity (Line 3 overloaded at 98%, Line 6 idle at 65%), 4) WIP distribution and bottleneck analysis (Line 1: 450 units, Line 2: 320, Line 3: 280), 5) Style-to-line matching optimization considering operation count and required skills, 6) Skill gap identification and cross-training recommendations for underperforming lines, 7) Reallocation scenarios for throughput improvement (+8-12% potential), 8) Predictive analysis for next week based on current order pipeline and line capacity."
              onAskMarbim={onAskMarbim}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Avg Line Efficiency</span>
              </div>
              <div className="text-2xl text-white mb-1">88%</div>
              <div className="text-xs text-[#57ACAF]">+4.2% improvement</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs text-[#6F83A7]">Skill Match Rate</span>
              </div>
              <div className="text-2xl text-white mb-1">85%</div>
              <div className="text-xs text-[#57ACAF]">+6.8% vs baseline</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[#6F83A7]" />
                <span className="text-xs text-[#6F83A7]">Active Operators</span>
              </div>
              <div className="text-2xl text-white mb-1">111</div>
              <div className="text-xs text-[#EAB308]">Across 6 lines</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Load Balance</span>
              </div>
              <div className="text-2xl text-white mb-1">82%</div>
              <div className="text-xs text-[#57ACAF]">Well distributed</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#D0342C]" />
                <span className="text-xs text-[#6F83A7]">Skill Gaps</span>
              </div>
              <div className="text-2xl text-white mb-1">3</div>
              <div className="text-xs text-[#D0342C]">Need training</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs defaultValue="by-line" className="space-y-6">
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="by-line" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Grid className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">By Line</span>
            </TabsTrigger>
            <TabsTrigger 
              value="by-style" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Package className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">By Style</span>
            </TabsTrigger>
            <TabsTrigger 
              value="skill-matrix" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Award className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Skill Matrix</span>
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

        {/* By Line Tab - Content will go here - Creating shortened version due to length */}
        <TabsContent value="by-line" className="space-y-6">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white mb-2 flex items-center gap-2">
                  <Grid className="w-5 h-5 text-[#57ACAF]" />
                  Production Line Overview
                </h3>
                <p className="text-sm text-[#6F83A7]">Real-time line performance and allocation status</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze line-by-line allocation including efficiency, load, operators, skill match, and WIP for optimization opportunities."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EAB308]"></div>
              </div>
            ) : (
              <SmartTable
                columns={lineAllocationColumns}
                data={lines}
                searchPlaceholder="Search lines..."
                onRowClick={handleRowClick}
              />
            )}
          </div>
        </TabsContent>

        {/* Other tabs similarly structured */}
        <TabsContent value="by-style" className="space-y-6">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white mb-2 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#57ACAF]" />
                  Style-Based Allocation
                </h3>
                <p className="text-sm text-[#6F83A7]">Production progress by style with line assignments</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze style allocation patterns, operation complexity impact, and optimization opportunities."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <SmartTable
              columns={styleAllocationColumns}
              data={styleAllocationData}
              searchPlaceholder="Search styles..."
              onRowClick={handleRowClick}
            />
          </div>
        </TabsContent>

        <TabsContent value="skill-matrix" className="space-y-6">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#57ACAF]" />
                  Operator Skill Proficiency Matrix
                </h3>
                <p className="text-sm text-[#6F83A7]">Multi-skill proficiency across key operations</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze skill proficiency matrix, identify gaps, and recommend training and reassignment strategies."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[#6F83A7] py-3 px-4">Operator</th>
                    <th className="text-center text-[#6F83A7] py-3 px-4">Cutting</th>
                    <th className="text-center text-[#6F83A7] py-3 px-4">Sewing</th>
                    <th className="text-center text-[#6F83A7] py-3 px-4">Hemming</th>
                    <th className="text-center text-[#6F83A7] py-3 px-4">Finishing</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { name: 'Operator 1', cutting: 95, sewing: 88, hemming: 92, finishing: 78 },
                    { name: 'Operator 2', cutting: 82, sewing: 95, hemming: 85, finishing: 90 },
                    { name: 'Operator 3', cutting: 75, sewing: 72, hemming: 68, finishing: 82 },
                  ].map((op, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-3 px-4 text-white">{op.name}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={op.cutting >= 90 ? 'bg-[#57ACAF]/10 text-[#57ACAF]' : 'bg-[#EAB308]/10 text-[#EAB308]'}>
                          {op.cutting}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={op.sewing >= 90 ? 'bg-[#57ACAF]/10 text-[#57ACAF]' : 'bg-[#EAB308]/10 text-[#EAB308]'}>
                          {op.sewing}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={op.hemming >= 90 ? 'bg-[#57ACAF]/10 text-[#57ACAF]' : 'bg-[#EAB308]/10 text-[#EAB308]'}>
                          {op.hemming}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={op.finishing >= 90 ? 'bg-[#57ACAF]/10 text-[#57ACAF]' : 'bg-[#EAB308]/10 text-[#EAB308]'}>
                          {op.finishing}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                  AI Optimization Opportunities
                </h3>
                <p className="text-sm text-[#6F83A7]">Comprehensive improvement recommendations</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Provide comprehensive AI optimization strategy with prioritized recommendations, implementation roadmap, and expected impact analysis."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Order Reallocation: +8% throughput',
                'Line 3 Training: +7% efficiency',
                'Operator Reassignment: Better skill match',
                'Load Balancing: Optimize capacity',
              ].map((insight, index) => (
                <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-[#57ACAF]" />
                    <span className="text-white text-sm">{insight}</span>
                  </div>
                </div>
              ))}
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
      case 'master-plan':
        return renderMasterPlan();
      case 'line-allocation':
        return renderLineAllocation();
      case 'ta-calendar':
        return renderTACalendar();
      case 'materials-shortages':
        return renderMaterialsShortages();
      case 'risk-ai':
        return renderRiskAI();
      default:
        return renderDashboard();
    }
  };

  const getBreadcrumbs = () => {
    const baseBreadcrumbs = [
      { label: 'Production & Supply Chain' },
      { label: 'Production Planning' }
    ];

    const viewLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'master-plan': 'Master Plan (Gantt)',
      'line-allocation': 'Line Allocation',
      'ta-calendar': 'T&A Calendar',
      'materials-shortages': 'Materials & Shortages',
      'risk-ai': 'Risk & AI',
    };

    if (currentView !== 'dashboard') {
      baseBreadcrumbs.push({ label: viewLabels[currentView] });
    }

    return baseBreadcrumbs;
  };

  return (
    <>
      {showSetupWizard && (
        <ProductionPlanningSetup
          onComplete={() => {
            setShowSetupWizard(false);
            setIsModuleSetup(true);
            toast.success('Production Planning module configured successfully!');
          }}
          onClose={() => setShowSetupWizard(false)}
          onAskMarbim={onAskMarbim || (() => {})}
        />
      )}

      {!showSetupWizard && (
        <>
          <PageLayout
            breadcrumbs={getBreadcrumbs()}
            aiInsightsCount={6}
          >
            {!isModuleSetup && currentView === 'dashboard' && (
              <ModuleSetupBanner
                moduleName="Production Planning"
                onSetupClick={() => setShowSetupWizard(true)}
              />
            )}
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
            module="Production Planning"
            subPage={currentView}
          />

          {/* Production Order Detail Drawer */}
          <ProductionOrderDetailDrawer
            isOpen={productionOrderDrawerOpen}
            onClose={() => {
              setProductionOrderDrawerOpen(false);
              setSelectedProductionOrder(null);
            }}
            orderData={selectedProductionOrder}
            onOrderUpdated={handleOrderUpdated}
            onAskMarbim={onAskMarbim}
          />

          {/* Line Detail Drawer */}
          <LineDetailDrawer
            isOpen={lineDrawerOpen}
            onClose={() => {
              setLineDrawerOpen(false);
              setSelectedLine(null);
            }}
            lineData={selectedLine}
            onLineUpdated={handleLineUpdated}
            onAskMarbim={onAskMarbim}
          />

          {/* Style Detail Drawer */}
          <StyleDetailDrawer
            isOpen={styleDrawerOpen}
            onClose={() => {
              setStyleDrawerOpen(false);
              setSelectedStyle(null);
            }}
            styleData={selectedStyle}
            onStyleUpdated={handleStyleUpdated}
            onAskMarbim={onAskMarbim}
          />
        </>
      )}
    </>
  );
}
