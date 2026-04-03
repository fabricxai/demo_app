import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { MarbimAIButton } from '../MarbimAIButton';
import { InventoryManagementSetup } from './InventoryManagementSetup';
import { motion } from 'motion/react';
import { 
  Box, TrendingDown, Clock, AlertTriangle, Package, Calendar, 
  FileText, Activity, Plus, Download, Filter, Search, Zap,
  ThermometerSun, DollarSign, CheckCircle2, XCircle, BarChart3,
  Users, Award, Shield, Target, TrendingUp, ArrowUpRight, ArrowDownRight,
  Sparkles, Send, MessageSquare, Eye, RefreshCw, Edit, PackageSearch,
  ArrowDownUp, ClipboardList, Warehouse, MapPin, QrCode, Layers,
  ArrowRight, ArrowLeft, ShoppingCart, TrendingDownIcon, PackageOpen,
  FileSpreadsheet, BarChart, PieChart, Building2, Truck
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  BarChart as RechartsBar,
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
import { GarmentsModuleDataToolbar } from '../fabric/GarmentsModuleDataToolbar';
import { MARBIM_PROMPTS } from '../../config/garmentsIndustry';

interface InventoryManagementProps {
  initialSubPage?: string;
  onAskMarbim: (prompt: string) => void;
  isAIPanelOpen: boolean;
}

// Dashboard — CMT material & FG posture
const dashboardSummary = [
  { label: 'RM + trims book value', value: '$2.4M', icon: DollarSign, color: '#57ACAF' },
  { label: 'Styles clear to cut (4wk)', value: '94%', icon: CheckCircle2, color: '#EAB308' },
  { label: 'Shortages vs SO', value: '12', icon: AlertTriangle, color: '#D0342C' },
  { label: 'Inventory turns (annual)', value: '6.2x', icon: RefreshCw, color: '#6F83A7' },
];

const materialFlowData = [
  { month: 'Jun', inward: 145000, outward: 132000 },
  { month: 'Jul', inward: 168000, outward: 155000 },
  { month: 'Aug', inward: 152000, outward: 148000 },
  { month: 'Sep', inward: 178000, outward: 165000 },
  { month: 'Oct', inward: 162000, outward: 158000 },
];

const categoryStockData = [
  { category: 'Fabric', value: 42, color: '#57ACAF' },
  { category: 'Trims', value: 28, color: '#EAB308' },
  { category: 'Accessories', value: 18, color: '#6F83A7' },
  { category: 'Finished Goods', value: 12, color: '#D0342C' },
];

const consumptionForecastData = [
  { week: 'W40', actual: 32000, forecast: 31500 },
  { week: 'W41', actual: 35000, forecast: 34000 },
  { week: 'W42', actual: 31000, forecast: 33000 },
  { week: 'W43', actual: 38000, forecast: 36500 },
  { week: 'W44', actual: 0, forecast: 37000 },
  { week: 'W45', actual: 0, forecast: 38500 },
];

// Material Master Data
const materialMasterData = [
  {
    id: 'MAT-2024-001',
    materialId: 'FAB-CTN-200',
    category: 'Fabric',
    description: 'Cotton Fabric 200 GSM - White',
    unit: 'Yards',
    supplier: 'KnitTex Bangladesh',
    currentStock: 12500,
    reorderLevel: 5000,
    unitPrice: 5.80,
    status: 'In Stock',
    lastPurchaseDate: '2024-10-15',
    leadTime: '14 days',
    moq: 1000,
    location: 'WH-A / Zone-1 / Rack-03',
  },
  {
    id: 'MAT-2024-002',
    materialId: 'TRM-BTN-15',
    category: 'Trims',
    description: 'Plastic Button 15mm - Navy Blue',
    unit: 'Pieces',
    supplier: 'ButtonWorks Ltd',
    currentStock: 45000,
    reorderLevel: 20000,
    unitPrice: 0.12,
    status: 'In Stock',
    lastPurchaseDate: '2024-10-18',
    leadTime: '7 days',
    moq: 10000,
    location: 'WH-B / Zone-2 / Bin-12',
  },
  {
    id: 'MAT-2024-003',
    materialId: 'FAB-DNM-320',
    category: 'Fabric',
    description: 'Denim Fabric 320 GSM - Dark Blue',
    unit: 'Yards',
    supplier: 'GlobalFabrics India',
    currentStock: 3200,
    reorderLevel: 5000,
    unitPrice: 6.50,
    status: 'Low Stock',
    lastPurchaseDate: '2024-09-28',
    leadTime: '21 days',
    moq: 1500,
    location: 'WH-A / Zone-1 / Rack-08',
  },
  {
    id: 'MAT-2024-004',
    materialId: 'TRM-ZPR-05',
    category: 'Trims',
    description: 'Metal Zipper 5" - Black',
    unit: 'Pieces',
    supplier: 'ZipFast Co',
    currentStock: 8500,
    reorderLevel: 10000,
    unitPrice: 0.85,
    status: 'Low Stock',
    lastPurchaseDate: '2024-10-10',
    leadTime: '10 days',
    moq: 5000,
    location: 'WH-B / Zone-3 / Bin-07',
  },
  {
    id: 'MAT-2024-005',
    materialId: 'ACC-LBL-STD',
    category: 'Accessories',
    description: 'Woven Label - Brand Standard',
    unit: 'Pieces',
    supplier: 'LabelPro Bangladesh',
    currentStock: 25000,
    reorderLevel: 15000,
    unitPrice: 0.35,
    status: 'In Stock',
    lastPurchaseDate: '2024-10-22',
    leadTime: '14 days',
    moq: 10000,
    location: 'WH-B / Zone-2 / Bin-18',
  },
];

// Stock Ledger Data
const inwardEntriesData = [
  {
    id: 'GRN-2024-1243',
    date: '2024-10-28',
    materialId: 'FAB-CTN-200',
    description: 'Cotton Fabric 200 GSM - White',
    supplier: 'KnitTex Bangladesh',
    quantity: 5000,
    unit: 'Yards',
    unitPrice: 5.80,
    totalValue: 29000,
    poNumber: 'PO-2024-089',
    qcStatus: 'Accepted',
    receivedBy: 'John Smith',
  },
  {
    id: 'GRN-2024-1244',
    date: '2024-10-27',
    materialId: 'TRM-BTN-15',
    description: 'Plastic Button 15mm - Navy Blue',
    supplier: 'ButtonWorks Ltd',
    quantity: 50000,
    unit: 'Pieces',
    unitPrice: 0.12,
    totalValue: 6000,
    poNumber: 'PO-2024-092',
    qcStatus: 'Accepted',
    receivedBy: 'Sarah Johnson',
  },
];

const outwardEntriesData = [
  {
    id: 'ISS-2024-3421',
    date: '2024-10-28',
    materialId: 'FAB-CTN-200',
    description: 'Cotton Fabric 200 GSM - White',
    productionOrder: 'PRD-2024-567',
    quantity: 2500,
    unit: 'Yards',
    issuedTo: 'Line A - Cutting',
    issuedBy: 'Mike Wilson',
    purpose: 'Production',
  },
  {
    id: 'ISS-2024-3422',
    date: '2024-10-27',
    materialId: 'TRM-BTN-15',
    description: 'Plastic Button 15mm - Navy Blue',
    productionOrder: 'PRD-2024-568',
    quantity: 12000,
    unit: 'Pieces',
    issuedTo: 'Line B - Assembly',
    issuedBy: 'Lisa Brown',
    purpose: 'Production',
  },
];

// Warehouse Data
const warehouseData = [
  {
    id: 'WH-A',
    name: 'Warehouse A - Raw Materials',
    location: 'Building 1, Ground Floor',
    capacity: '50,000 sq ft',
    occupied: 68,
    zones: 4,
    bins: 120,
    temperature: '22°C',
    humidity: '45%',
    status: 'Active',
  },
  {
    id: 'WH-B',
    name: 'Warehouse B - Trims & Accessories',
    location: 'Building 2, First Floor',
    capacity: '25,000 sq ft',
    occupied: 72,
    zones: 3,
    bins: 85,
    temperature: '24°C',
    humidity: '48%',
    status: 'Active',
  },
  {
    id: 'WH-C',
    name: 'Warehouse C - Finished Goods',
    location: 'Building 3, Ground Floor',
    capacity: '35,000 sq ft',
    occupied: 58,
    zones: 2,
    bins: 60,
    temperature: '20°C',
    humidity: '50%',
    status: 'Active',
  },
];

// Material Requests Data
const materialRequestsData = [
  {
    id: 'REQ-2024-789',
    date: '2024-10-28',
    requestedBy: 'Production Manager',
    department: 'Line A',
    productionOrder: 'PRD-2024-570',
    materialId: 'FAB-CTN-200',
    description: 'Cotton Fabric 200 GSM - White',
    quantityRequested: 3000,
    unit: 'Yards',
    requiredDate: '2024-10-30',
    status: 'Pending',
    priority: 'High',
  },
  {
    id: 'REQ-2024-790',
    date: '2024-10-27',
    requestedBy: 'Sample Room',
    department: 'R&D',
    productionOrder: 'SMP-2024-045',
    materialId: 'FAB-DNM-320',
    description: 'Denim Fabric 320 GSM - Dark Blue',
    quantityRequested: 150,
    unit: 'Yards',
    requiredDate: '2024-10-29',
    status: 'Approved',
    priority: 'Medium',
  },
];

// Finished Goods Data
const finishedGoodsData = [
  {
    id: 'FG-2024-3421',
    styleNumber: 'STY-MNS-001',
    description: 'Men\'s Cotton T-Shirt - Navy',
    buyer: 'Target USA',
    orderNumber: 'ORD-2024-234',
    quantity: 5000,
    unit: 'Pieces',
    completedDate: '2024-10-25',
    packingStatus: 'Completed',
    shipmentDate: '2024-11-05',
    location: 'WH-C / Zone-1',
    cartons: 50,
    status: 'Ready to Ship',
  },
  {
    id: 'FG-2024-3422',
    styleNumber: 'STY-WMN-008',
    description: 'Women\'s Denim Jeans - Light Blue',
    buyer: 'H&M Europe',
    orderNumber: 'ORD-2024-245',
    quantity: 3000,
    unit: 'Pieces',
    completedDate: '2024-10-26',
    packingStatus: 'In Progress',
    shipmentDate: '2024-11-10',
    location: 'WH-C / Zone-2',
    cartons: 30,
    status: 'Packing',
  },
];

// Packing Materials Data
const packingMaterialsData = [
  {
    id: 'PCK-001',
    item: 'Carton Box - Large (24x18x12)',
    currentStock: 2500,
    reorderLevel: 1000,
    unit: 'Pieces',
    unitPrice: 2.50,
    supplier: 'PackPro Ltd',
    status: 'In Stock',
  },
  {
    id: 'PCK-002',
    item: 'Poly Bag - 12x18 (100 Gauge)',
    currentStock: 45000,
    reorderLevel: 20000,
    unit: 'Pieces',
    unitPrice: 0.08,
    supplier: 'PlasticWorks',
    status: 'In Stock',
  },
  {
    id: 'PCK-003',
    item: 'Packing Tape - 2" Brown',
    currentStock: 350,
    reorderLevel: 500,
    unit: 'Rolls',
    unitPrice: 1.20,
    supplier: 'Office Supplies Co',
    status: 'Low Stock',
  },
];

// Reorder & Forecasting Data
const reorderAlertsData = [
  {
    id: 'ROD-001',
    materialId: 'FAB-DNM-320',
    description: 'Denim Fabric 320 GSM - Dark Blue',
    currentStock: 3200,
    reorderLevel: 5000,
    deficit: 1800,
    avgConsumption: '450 yards/day',
    daysToStockout: 7,
    recommendedOrderQty: 5000,
    supplier: 'GlobalFabrics India',
    leadTime: '21 days',
    priority: 'Critical',
  },
  {
    id: 'ROD-002',
    materialId: 'TRM-ZPR-05',
    description: 'Metal Zipper 5" - Black',
    currentStock: 8500,
    reorderLevel: 10000,
    deficit: 1500,
    avgConsumption: '280 pcs/day',
    daysToStockout: 30,
    recommendedOrderQty: 10000,
    supplier: 'ZipFast Co',
    leadTime: '10 days',
    priority: 'Medium',
  },
];

const demandForecastData = [
  { month: 'Nov', fabric: 145000, trims: 85000, accessories: 42000 },
  { month: 'Dec', fabric: 168000, trims: 95000, accessories: 48000 },
  { month: 'Jan', fabric: 152000, trims: 88000, accessories: 45000 },
  { month: 'Feb', fabric: 178000, trims: 105000, accessories: 52000 },
];

export function InventoryManagement({ initialSubPage = 'dashboard', onAskMarbim, isAIPanelOpen }: InventoryManagementProps) {
  const routeSubpage = useRouteSubpage('dashboard', initialSubPage);
  const [currentView, setCurrentView] = useState(routeSubpage);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [materialDrawerOpen, setMaterialDrawerOpen] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    setCurrentView(routeSubpage);
  }, [routeSubpage]);

  // Close drawer when AI panel opens
  useEffect(() => {
    if (isAIPanelOpen) {
      setMaterialDrawerOpen(false);
    }
  }, [isAIPanelOpen]);

  // Material Master Columns
  const materialMasterColumns: Column[] = [
    { key: 'materialId', label: 'Material ID', sortable: true },
    { key: 'category', label: 'RM class', sortable: true },
    { key: 'description', label: 'Spec / construction' },
    { key: 'currentStock', label: 'On-hand', sortable: true },
    { key: 'unit', label: 'UoM' },
    { key: 'supplier', label: 'Mill / supplier' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <Badge 
          className={
            value === 'In Stock' 
              ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20' 
              : 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'
          }
        >
          {value}
        </Badge>
      )
    },
  ];

  // Inward Entries Columns
  const inwardEntriesColumns: Column[] = [
    { key: 'id', label: 'GRN No.', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'materialId', label: 'Material ID' },
    { key: 'description', label: 'Description' },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'totalValue', label: 'Value', sortable: true, render: (value: number) => `$${value.toLocaleString()}` },
    { 
      key: 'qcStatus', 
      label: 'QC Status',
      render: (value: string) => (
        <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
          {value}
        </Badge>
      )
    },
  ];

  // Outward Entries Columns
  const outwardEntriesColumns: Column[] = [
    { key: 'id', label: 'Issue No.', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'materialId', label: 'Material ID' },
    { key: 'description', label: 'Description' },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'issuedTo', label: 'Issued To' },
    { key: 'issuedBy', label: 'Issued By' },
  ];

  // Warehouse Columns
  const warehouseColumns: Column[] = [
    { key: 'id', label: 'Warehouse ID', sortable: true },
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'capacity', label: 'Capacity' },
    { 
      key: 'occupied', 
      label: 'Occupied',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Progress value={value} className="w-20 h-2" />
          <span className="text-sm text-white">{value}%</span>
        </div>
      )
    },
    { key: 'zones', label: 'Zones' },
    { key: 'bins', label: 'Bins' },
  ];

  // Material Requests Columns
  const materialRequestsColumns: Column[] = [
    { key: 'id', label: 'Request ID', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'materialId', label: 'Material ID' },
    { key: 'quantityRequested', label: 'Quantity', sortable: true },
    { key: 'requiredDate', label: 'Required By', sortable: true },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (value: string) => (
        <Badge 
          className={
            value === 'High' 
              ? 'bg-red-500/10 text-red-400 border-red-500/20' 
              : value === 'Medium'
              ? 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'
              : 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20'
          }
        >
          {value}
        </Badge>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <Badge 
          className={
            value === 'Approved' 
              ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20' 
              : 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'
          }
        >
          {value}
        </Badge>
      )
    },
  ];

  // Finished Goods Columns
  const finishedGoodsColumns: Column[] = [
    { key: 'id', label: 'FG ID', sortable: true },
    { key: 'styleNumber', label: 'Style No.' },
    { key: 'description', label: 'Description' },
    { key: 'buyer', label: 'Buyer' },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'shipmentDate', label: 'Ship Date', sortable: true },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <Badge 
          className={
            value === 'Ready to Ship' 
              ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20' 
              : 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'
          }
        >
          {value}
        </Badge>
      )
    },
  ];

  // Reorder Alerts Columns
  const reorderAlertsColumns: Column[] = [
    { key: 'materialId', label: 'Material ID', sortable: true },
    { key: 'description', label: 'Description' },
    { key: 'currentStock', label: 'Current Stock', sortable: true },
    { key: 'deficit', label: 'Deficit', sortable: true },
    { key: 'daysToStockout', label: 'Days to Stockout', sortable: true },
    { key: 'recommendedOrderQty', label: 'Recommended Qty', sortable: true },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (value: string) => (
        <Badge 
          className={
            value === 'Critical' 
              ? 'bg-red-500/10 text-red-400 border-red-500/20' 
              : 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'
          }
        >
          {value}
        </Badge>
      )
    },
  ];

  const handleRowClick = (record: any) => {
    setSelectedMaterial(record);
    setMaterialDrawerOpen(true);
  };

  const getBreadcrumbLabel = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'material-master':
        return 'Material Master';
      case 'stock-ledger':
        return 'Stock Ledger';
      case 'warehouse':
        return 'Warehouse & Location Management';
      case 'material-requests':
        return 'Material Requests & Issuance';
      case 'finished-goods':
        return 'Finished Goods & Packing Materials';
      case 'reorder-forecasting':
        return 'Reorder & Forecasting';
      default:
        return 'Dashboard';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Setup Banner */}
      {!isSetupComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#EAB308]/20 via-[#EAB308]/10 to-transparent border border-[#EAB308]/30 rounded-2xl p-6"
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="relative flex items-start justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20 shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl text-white mb-2">Set Up Your Inventory Management Module</h3>
                <p className="text-sm text-[#6F83A7] mb-4">
                  MARBIM can guide you through a quick 5-step setup to configure materials, reorder rules, warehouses, and AI-powered workflows. 
                  Get demand forecasting, smart reordering, and stockout prevention up and running in under 10 minutes.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setShowSetup(true)}
                    className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-lg shadow-[#EAB308]/20"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Let MARBIM Guide You
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#57ACAF]/10 via-transparent to-[#EAB308]/10 border border-white/10 rounded-2xl p-8 overflow-hidden">
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
                  <Box className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl text-white mb-1">Inventory Management Dashboard</h2>
                  <p className="text-sm text-[#6F83A7]">Real-time visibility into material flow, stock levels, and AI-powered demand forecasting</p>
                </div>
              </div>
            </div>
            
            <MarbimAIButton
              onClick={() => {
                onAskMarbim('Analyze current inventory health across all categories. Identify critical shortages, excess stock, and optimization opportunities. Include recommendations for reorder timing and quantities.');
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {dashboardSummary.map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-[#6F83A7]">{item.label}</p>
                    <p className="text-xl text-white">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Material Flow Chart */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-white mb-2">Material Flow (Inward vs Outward)</h3>
              <p className="text-sm text-[#6F83A7]">Monthly comparison of material receipts and consumption</p>
            </div>
            <MarbimAIButton
              onClick={() => {
                onAskMarbim('Analyze material flow trends for the past 5 months. Identify consumption patterns, peak periods, and recommend optimal procurement scheduling to minimize holding costs.');
              }}
            />
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <RechartsBar data={materialFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#6F83A7" />
              <YAxis stroke="#6F83A7" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#182336', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="inward" fill="#57ACAF" name="Inward" radius={[8, 8, 0, 0]} />
              <Bar dataKey="outward" fill="#EAB308" name="Outward" radius={[8, 8, 0, 0]} />
            </RechartsBar>
          </ResponsiveContainer>
        </div>

        {/* Category Stock Distribution */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-white mb-2">Category-wise Stock Distribution</h3>
              <p className="text-sm text-[#6F83A7]">Inventory breakdown by material category</p>
            </div>
            <MarbimAIButton
              onClick={() => {
                onAskMarbim('Analyze category-wise stock distribution. Identify if any category is over or under-stocked relative to production requirements. Recommend rebalancing strategies.');
              }}
            />
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <RechartsPie>
              <Pie
                data={categoryStockData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, value }) => `${category}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryStockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#182336', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Consumption vs Forecast */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-white mb-2">Consumption Trend vs AI Forecast</h3>
            <p className="text-sm text-[#6F83A7]">Historical consumption compared with AI-predicted demand</p>
          </div>
          <MarbimAIButton
            onClick={() => {
              onAskMarbim('Analyze consumption accuracy vs forecast. Identify variance patterns and recommend model improvements. Predict material requirements for next 6 weeks with confidence intervals.');
            }}
          />
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={consumptionForecastData}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#57ACAF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#57ACAF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="week" stroke="#6F83A7" />
            <YAxis stroke="#6F83A7" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#182336', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Area type="monotone" dataKey="actual" stroke="#57ACAF" fillOpacity={1} fill="url(#colorActual)" name="Actual" />
            <Area type="monotone" dataKey="forecast" stroke="#EAB308" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" name="Forecast" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights Card */}
      <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#EAB308]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">AI-Powered Inventory Insights</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-white mb-1"><span className="font-medium">Critical Shortage Alert:</span> Denim Fabric (FAB-DNM-320) will stockout in 7 days. Immediate procurement recommended.</p>
                      <p className="text-xs text-[#6F83A7]">Recommended order: 5,000 yards from GlobalFabrics India (21-day lead time)</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-[#57ACAF] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-white mb-1"><span className="font-medium">Excess Inventory:</span> 4 items aging beyond 90 days with $42,500 value at risk.</p>
                      <p className="text-xs text-[#6F83A7]">Recommend reallocation to upcoming orders or liquidation to free up working capital</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-[#EAB308] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-white mb-1"><span className="font-medium">Price Fluctuation Alert:</span> Cotton fabric prices increased 8% this month.</p>
                      <p className="text-xs text-[#6F83A7]">Consider bulk purchasing for Q1 2025 orders to lock current rates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onAskMarbim('Provide comprehensive inventory optimization strategy. Include reorder recommendations, excess stock liquidation plan, cost reduction opportunities, and risk mitigation for next quarter.')}
            variant="outline"
            className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)] shrink-0"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Deep Analysis
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMaterialMaster = () => (
    <Tabs defaultValue="all-materials" className="space-y-6">
      <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20">
        <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
          <TabsTrigger 
            value="all-materials" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Package className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">All Materials</span>
          </TabsTrigger>
          <TabsTrigger 
            value="fabric" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Layers className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Fabric</span>
          </TabsTrigger>
          <TabsTrigger 
            value="trims" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <PackageSearch className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Trims</span>
          </TabsTrigger>
          <TabsTrigger 
            value="accessories" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Award className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Accessories</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all-materials" className="space-y-6">
        <GarmentsModuleDataToolbar
          className="mb-2"
          title="Material master — fabrics, trims, packaging"
          subtitle="GSM, UoM, MOQ, and warehouse locations for cut-make-trim planning"
          onFilter={() => toast.info('Filter by RM class or supplier')}
          onExport={() => toast.success('Exporting BOM-linked materials…')}
          exportLabel="Export material list"
          onRefresh={() => toast.success('Registry refreshed')}
          onAskMarbim={onAskMarbim}
          askPrompt={MARBIM_PROMPTS.inventoryMaterials}
          primaryAction={{
            label: 'Add RM / trim',
            onClick: () => toast.success('Open new material wizard'),
            icon: Plus,
          }}
        />

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={materialMasterColumns}
            data={materialMasterData}
            searchPlaceholder="Search materials..."
            onRowClick={handleRowClick}
          />
        </div>
      </TabsContent>

      <TabsContent value="fabric" className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={materialMasterColumns}
            data={materialMasterData.filter(m => m.category === 'Fabric')}
            searchPlaceholder="Search fabrics..."
            onRowClick={handleRowClick}
          />
        </div>
      </TabsContent>

      <TabsContent value="trims" className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={materialMasterColumns}
            data={materialMasterData.filter(m => m.category === 'Trims')}
            searchPlaceholder="Search trims..."
            onRowClick={handleRowClick}
          />
        </div>
      </TabsContent>

      <TabsContent value="accessories" className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={materialMasterColumns}
            data={materialMasterData.filter(m => m.category === 'Accessories')}
            searchPlaceholder="Search accessories..."
            onRowClick={handleRowClick}
          />
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderStockLedger = () => (
    <Tabs defaultValue="inward-entries" className="space-y-6">
      <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20">
        <TabsList className="w-full grid grid-cols-3 bg-transparent gap-1.5 p-0 h-auto">
          <TabsTrigger 
            value="inward-entries" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <ArrowDownRight className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Inward Entries (GRN)</span>
          </TabsTrigger>
          <TabsTrigger 
            value="outward-entries" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <ArrowUpRight className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Outward Entries</span>
          </TabsTrigger>
          <TabsTrigger 
            value="stock-balance" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <BarChart3 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Stock Balance</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="inward-entries" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white mb-1">Goods Receipt Notes (GRN)</h3>
            <p className="text-sm text-[#6F83A7]">Material receipts from suppliers with QC status</p>
          </div>
          <MarbimAIButton
            onClick={() => {
              onAskMarbim('Analyze recent GRN records. Identify supplier delivery performance, QC rejection rates, and recommend supplier improvements or alternatives.');
            }}
          />
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={inwardEntriesColumns}
            data={inwardEntriesData}
            searchPlaceholder="Search GRN records..."
          />
        </div>
      </TabsContent>

      <TabsContent value="outward-entries" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white mb-1">Material Issue Records</h3>
            <p className="text-sm text-[#6F83A7]">Materials issued to production lines and departments</p>
          </div>
          <MarbimAIButton
            onClick={() => {
              onAskMarbim('Analyze material consumption patterns from issue records. Identify wastage, overuse trends, and recommend consumption optimization strategies.');
            }}
          />
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={outwardEntriesColumns}
            data={outwardEntriesData}
            searchPlaceholder="Search issue records..."
          />
        </div>
      </TabsContent>

      <TabsContent value="stock-balance" className="space-y-6">
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-2">Real-Time Stock Balance</h4>
                <p className="text-sm text-[#6F83A7]">
                  Current stock quantities and valuations across all materials with AI-powered anomaly detection.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onAskMarbim('Reconcile stock balance against expected levels from production plans. Identify discrepancies, potential theft, or data entry errors. Recommend corrective actions.')}
              className="bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white shrink-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Reconcile
            </Button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={materialMasterColumns}
            data={materialMasterData}
            searchPlaceholder="Search stock balance..."
          />
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderWarehouse = () => (
    <div className="space-y-6">
      {/* Warehouse Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warehouseData.map((warehouse, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-1">{warehouse.name}</h3>
                <p className="text-xs text-[#6F83A7]">{warehouse.location}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#6F83A7]">Occupancy</span>
                  <span className="text-sm text-white">{warehouse.occupied}%</span>
                </div>
                <Progress value={warehouse.occupied} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-[#6F83A7]">Capacity</p>
                  <p className="text-sm text-white">{warehouse.capacity}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-[#6F83A7]">Zones/Bins</p>
                  <p className="text-sm text-white">{warehouse.zones} / {warehouse.bins}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <ThermometerSun className="w-4 h-4 text-[#6F83A7]" />
                  <span className="text-xs text-white">{warehouse.temperature}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#6F83A7]" />
                  <span className="text-xs text-white">{warehouse.humidity}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Optimization */}
      <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#EAB308]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">AI Warehouse Optimization</h3>
              <p className="text-sm text-[#6F83A7] mb-4">
                MARBIM analyzes pick frequency, storage density, and material compatibility to optimize warehouse layout and reduce retrieval time by up to 35%.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Avg Pick Time</div>
                  <div className="text-xl text-white">2.4 min</div>
                  <div className="text-xs text-[#57ACAF]">↓ 28% vs last month</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Space Utilization</div>
                  <div className="text-xl text-white">66%</div>
                  <div className="text-xs text-[#EAB308]">Can fit 15% more</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Misplacement Rate</div>
                  <div className="text-xl text-white">0.8%</div>
                  <div className="text-xs text-[#57ACAF]">↓ 45% with QR codes</div>
                </div>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onAskMarbim('Generate comprehensive warehouse optimization plan. Include bin-level reorganization recommendations, high-velocity item placement strategy, and ROI analysis for automation investments.')}
            variant="outline"
            className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)] shrink-0"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Optimize Layout
          </Button>
        </div>
      </div>

      {/* Warehouse Details Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <SmartTable
          columns={warehouseColumns}
          data={warehouseData}
          searchPlaceholder="Search warehouses..."
        />
      </div>
    </div>
  );

  const renderMaterialRequests = () => (
    <Tabs defaultValue="pending-requests" className="space-y-6">
      <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20">
        <TabsList className="w-full grid grid-cols-3 bg-transparent gap-1.5 p-0 h-auto">
          <TabsTrigger 
            value="pending-requests" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Clock className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Pending Requests</span>
          </TabsTrigger>
          <TabsTrigger 
            value="approved" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <CheckCircle2 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Approved</span>
          </TabsTrigger>
          <TabsTrigger 
            value="issuance-log" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <FileSpreadsheet className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Issuance Log</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="pending-requests" className="space-y-6">
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-2">Automated Material Request Workflow</h4>
                <p className="text-sm text-[#6F83A7]">
                  Production orders automatically trigger material requests. AI validates stock availability and recommends substitutes for shortages.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onAskMarbim('Analyze pending material requests. Prioritize by production urgency, validate stock availability, and recommend approval/substitution actions for each request.')}
              className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black shrink-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Auto-Approve
            </Button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={materialRequestsColumns}
            data={materialRequestsData.filter(r => r.status === 'Pending')}
            searchPlaceholder="Search pending requests..."
          />
        </div>
      </TabsContent>

      <TabsContent value="approved" className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={materialRequestsColumns}
            data={materialRequestsData.filter(r => r.status === 'Approved')}
            searchPlaceholder="Search approved requests..."
          />
        </div>
      </TabsContent>

      <TabsContent value="issuance-log" className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={outwardEntriesColumns}
            data={outwardEntriesData}
            searchPlaceholder="Search issuance records..."
          />
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderFinishedGoods = () => (
    <Tabs defaultValue="finished-goods-inventory" className="space-y-6">
      <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20">
        <TabsList className="w-full grid grid-cols-3 bg-transparent gap-1.5 p-0 h-auto">
          <TabsTrigger 
            value="finished-goods-inventory" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Package className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Finished Goods</span>
          </TabsTrigger>
          <TabsTrigger 
            value="packing-materials" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <PackageOpen className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Packing Materials</span>
          </TabsTrigger>
          <TabsTrigger 
            value="dispatch-readiness" 
            className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
          >
            <Truck className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs">Dispatch Readiness</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="finished-goods-inventory" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white mb-1">Finished Goods Inventory</h3>
            <p className="text-sm text-[#6F83A7]">Post-production items ready for shipment by buyer and style</p>
          </div>
          <MarbimAIButton
            onClick={() => {
              onAskMarbim('Analyze finished goods inventory aging. Identify delayed shipments, optimize warehouse space allocation, and recommend dispatch prioritization based on buyer deadlines.');
            }}
          />
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={finishedGoodsColumns}
            data={finishedGoodsData}
            searchPlaceholder="Search finished goods..."
          />
        </div>
      </TabsContent>

      <TabsContent value="packing-materials" className="space-y-6">
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                <PackageOpen className="w-5 h-5 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-2">Packing Material Stock</h4>
                <p className="text-sm text-[#6F83A7]">
                  AI predicts packing material requirements based on shipment calendar to prevent packaging delays.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onAskMarbim('Predict packing material requirements for next 30 days based on shipment schedule. Identify potential shortages and generate procurement recommendations.')}
              className="bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white shrink-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Predict Needs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packingMaterialsData.map((item, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1">{item.item}</h4>
                  <p className="text-xs text-[#6F83A7]">{item.supplier}</p>
                </div>
                <Badge 
                  className={
                    item.status === 'In Stock'
                      ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20'
                      : 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'
                  }
                >
                  {item.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6F83A7]">Current Stock</span>
                  <span className="text-sm text-white">{item.currentStock.toLocaleString()} {item.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6F83A7]">Reorder Level</span>
                  <span className="text-sm text-white">{item.reorderLevel.toLocaleString()} {item.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6F83A7]">Unit Price</span>
                  <span className="text-sm text-white">${item.unitPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="dispatch-readiness" className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <Truck className="w-16 h-16 text-[#6F83A7] mx-auto mb-4" />
          <h3 className="text-white mb-2">Dispatch Readiness Tracker</h3>
          <p className="text-sm text-[#6F83A7]">Shipment preparation status coming soon</p>
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderReorderForecasting = () => (
    <div className="space-y-6">
      {/* Hero Section */}
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
                  <RefreshCw className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl text-white mb-1">AI-Powered Reorder & Forecasting</h2>
                  <p className="text-sm text-[#6F83A7]">Predictive analytics for demand forecasting and automated procurement recommendations</p>
                </div>
              </div>
            </div>
            
            <MarbimAIButton
              onClick={() => {
                onAskMarbim('Generate comprehensive 90-day demand forecast for all material categories. Include confidence intervals, seasonality adjustments, and risk mitigation strategies for supply chain disruptions.');
              }}
            />
          </div>
        </div>
      </div>

      {/* Reorder Alerts */}
      <Tabs defaultValue="critical-alerts" className="space-y-6">
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-3 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="critical-alerts" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <AlertTriangle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Critical Alerts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="demand-forecast" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <TrendingUp className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Demand Forecast</span>
            </TabsTrigger>
            <TabsTrigger 
              value="procurement-suggestions" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <ShoppingCart className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Procurement Suggestions</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="critical-alerts" className="space-y-6">
          <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">Critical Reorder Alerts</h4>
                  <p className="text-sm text-[#6F83A7]">
                    {reorderAlertsData.length} materials below reorder threshold. Immediate action required to prevent production delays.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onAskMarbim('Generate emergency procurement plan for all critical stock alerts. Prioritize by production impact, calculate expedite costs, and recommend supplier allocation strategy.')}
                className="bg-red-500 hover:bg-red-500/90 text-white shrink-0"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Emergency Plan
              </Button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <SmartTable
              columns={reorderAlertsColumns}
              data={reorderAlertsData}
              searchPlaceholder="Search reorder alerts..."
            />
          </div>
        </TabsContent>

        <TabsContent value="demand-forecast" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-white mb-2">4-Month Demand Forecast by Category</h3>
                <p className="text-sm text-[#6F83A7]">AI-predicted material consumption based on production schedule and historical trends</p>
              </div>
              <MarbimAIButton
                onClick={() => {
                  onAskMarbim('Explain the demand forecasting model. Include factors considered (seasonality, buyer orders, historical trends), accuracy metrics, and confidence intervals for predictions.');
                }}
              />
            </div>
            
            <ResponsiveContainer width="100%" height={350}>
              <RechartsBar data={demandForecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#6F83A7" />
                <YAxis stroke="#6F83A7" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#182336', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="fabric" fill="#57ACAF" name="Fabric" radius={[8, 8, 0, 0]} />
                <Bar dataKey="trims" fill="#EAB308" name="Trims" radius={[8, 8, 0, 0]} />
                <Bar dataKey="accessories" fill="#6F83A7" name="Accessories" radius={[8, 8, 0, 0]} />
              </RechartsBar>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="procurement-suggestions" className="space-y-6">
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-2">AI Procurement Recommendations</h3>
                  <p className="text-sm text-[#6F83A7] mb-4">
                    MARBIM automatically generates purchase requests when stock reaches reorder threshold. Finance pre-validates cost impact before PO creation.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Auto-Generated POs</div>
                      <div className="text-xl text-white">18</div>
                      <div className="text-xs text-[#57ACAF]">This month</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Cost Savings</div>
                      <div className="text-xl text-white">$24K</div>
                      <div className="text-xs text-[#57ACAF]">Bulk discounts secured</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Stockout Prevented</div>
                      <div className="text-xl text-white">12</div>
                      <div className="text-xs text-[#57ACAF]">Production delays avoided</div>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onAskMarbim('Review all AI-generated procurement suggestions for the next 30 days. Validate quantities, timing, and supplier selection. Recommend consolidation opportunities for better pricing.')}
                variant="outline"
                className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)] shrink-0"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Review All
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'material-master':
        return renderMaterialMaster();
      case 'stock-ledger':
        return renderStockLedger();
      case 'warehouse':
        return renderWarehouse();
      case 'material-requests':
        return renderMaterialRequests();
      case 'finished-goods':
        return renderFinishedGoods();
      case 'reorder-forecasting':
        return renderReorderForecasting();
      default:
        return renderDashboard();
    }
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Inventory Management' },
        { label: getBreadcrumbLabel() }
      ]}
      aiInsightsCount={3}
    >
      {renderContent()}
      
      {/* Setup Wizard */}
      {showSetup && (
        <InventoryManagementSetup
          onComplete={() => {
            setIsSetupComplete(true);
            setShowSetup(false);
            toast.success('Inventory Management module is now configured!');
          }}
          onClose={() => setShowSetup(false)}
          onAskMarbim={onAskMarbim}
        />
      )}
    </PageLayout>
  );
}
