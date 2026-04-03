import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { DetailDrawer } from '../DetailDrawer';
import { WorkflowStepper } from '../WorkflowStepper';
import { ShipmentDetailDrawer } from '../ShipmentDetailDrawer';
import { 
  Truck, Ship, Plane, Package, CheckCircle2, AlertTriangle, Clock, Calendar, FileText,
  ChevronDown, Plus, Download, Filter, Upload, Sparkles, Target,
  MapPin, TrendingUp, Users, Eye, Edit, Search, Send, Globe,
  XCircle, BookOpen, Clipboard, BarChart3, FileCheck, History,
  Radio, Navigation, Anchor, Container, Map, Route, AlertCircle,
  MessageSquare, Mail, Phone, Star, Award, Shield, Zap, Activity
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

// Sample Data for Bookings
const bookingsData = [
  {
    id: 1,
    bookingId: 'BK-2024-001',
    buyer: 'H&M',
    mode: 'Ocean',
    forwarder: 'Maersk Logistics',
    pickupDate: '2024-11-20',
    status: 'Confirmed',
    destination: 'Rotterdam',
  },
  {
    id: 2,
    bookingId: 'BK-2024-002',
    buyer: 'Zara',
    mode: 'Air',
    forwarder: 'DHL Express',
    pickupDate: '2024-11-18',
    status: 'Pending Pickup',
    destination: 'Barcelona',
  },
  {
    id: 3,
    bookingId: 'BK-2024-003',
    buyer: 'Gap',
    mode: 'Ocean',
    forwarder: 'CMA CGM',
    pickupDate: '2024-11-22',
    status: 'Confirmed',
    destination: 'Los Angeles',
  },
];

// Sample Data for Ocean Shipments
const oceanShipmentsData = [
  {
    id: 1,
    containerNumber: 'ACME003',
    vessel: 'YM Shanghai',
    pol: 'Chittagong',
    pod: 'Rotterdam',
    eta: '2024-12-05',
    status: 'Delayed',
    delayDays: 2,
  },
  {
    id: 2,
    containerNumber: 'CONT442',
    vessel: 'MSC Isabella',
    pol: 'Dhaka',
    pod: 'Hamburg',
    eta: '2024-12-01',
    status: 'On Time',
    delayDays: 0,
  },
  {
    id: 3,
    containerNumber: 'GLOB789',
    vessel: 'Ever Given',
    pol: 'Chittagong',
    pod: 'Los Angeles',
    eta: '2024-12-10',
    status: 'On Time',
    delayDays: 0,
  },
];

// Sample Data for Air Shipments
const airShipmentsData = [
  {
    id: 1,
    awbNumber: 'AWB-7734521',
    airline: 'Emirates SkyCargo',
    departure: 'Dhaka',
    arrival: 'Barcelona',
    eta: '2024-11-19',
    status: 'In Transit',
  },
  {
    id: 2,
    awbNumber: 'AWB-8821456',
    airline: 'Qatar Airways Cargo',
    departure: 'Dhaka',
    arrival: 'New York',
    eta: '2024-11-21',
    status: 'Delayed',
  },
];

// Sample Data for Documents
const documentsData = [
  {
    id: 1,
    shipmentId: 'SHP-1092',
    buyer: 'H&M',
    documentType: 'Invoice Pack',
    status: 'Complete',
    lastUpdated: '2024-11-15',
  },
  {
    id: 2,
    shipmentId: 'SHP-1093',
    buyer: 'Zara',
    documentType: 'Invoice Pack',
    status: 'Missing GSP',
    lastUpdated: '2024-11-16',
  },
];

// Sample Data for Exceptions
const exceptionsData = [
  {
    id: 1,
    exceptionId: 'EXC-001',
    shipmentNumber: 'ACME003',
    issue: 'Port Congestion',
    date: '2024-11-14',
    responsibleParty: 'Port Authority',
    status: 'In Progress',
    impact: 'High',
  },
  {
    id: 2,
    exceptionId: 'EXC-002',
    shipmentNumber: 'AWB-8821456',
    issue: 'Weather Delay',
    date: '2024-11-15',
    responsibleParty: 'Airline',
    status: 'Resolved',
    impact: 'Medium',
  },
];

// Chart Data
const shipmentTrendData = [
  { month: 'Jun', ocean: 45, air: 12, road: 8 },
  { month: 'Jul', ocean: 52, air: 15, road: 10 },
  { month: 'Aug', ocean: 48, air: 18, road: 9 },
  { month: 'Sep', ocean: 61, air: 14, road: 11 },
  { month: 'Oct', ocean: 55, air: 20, road: 12 },
  { month: 'Nov', ocean: 58, air: 16, road: 10 },
];

const otifData = [
  { month: 'Jun', otif: 92 },
  { month: 'Jul', otif: 89 },
  { month: 'Aug', otif: 94 },
  { month: 'Sep', otif: 91 },
  { month: 'Oct', otif: 95 },
  { month: 'Nov', otif: 93 },
];

interface ShipmentProps {
  initialSubPage?: string;
  onAskMarbim?: (prompt: string) => void;
  onNavigateToPage?: (page: string) => void;
}

export function Shipment({ initialSubPage = 'dashboard', onAskMarbim, onNavigateToPage }: ShipmentProps) {
  const routeSubpage = useRouteSubpage('dashboard', initialSubPage);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [subPage, setSubPage] = useState(routeSubpage);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [shipmentDrawerOpen, setShipmentDrawerOpen] = useState(false);

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
          title="Shipments Scheduled"
          value="28"
          change={12}
          icon={Calendar}
          trend="up"
        />
        <KPICard
          title="In-Transit"
          value="45"
          change={-3}
          changeLabel="vs last week"
          icon={Truck}
          trend="neutral"
        />
        <KPICard
          title="Delivered"
          value="152"
          change={8}
          icon={CheckCircle2}
          trend="up"
        />
        <KPICard
          title="Exceptions"
          value="7"
          change={-15}
          changeLabel="reduction"
          icon={AlertTriangle}
          trend="up"
        />
        <KPICard
          title="OTIF Rate"
          value="93%"
          change={2.5}
          icon={Target}
          trend="up"
        />
        <KPICard
          title="Document Completion"
          value="96%"
          change={1.8}
          icon={FileCheck}
          trend="up"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1">Upcoming Shipments</h4>
                  <p className="text-xs text-[#6F83A7]">Next 7 days</p>
                </div>
                <Calendar className="w-8 h-8 text-[#EAB308]" />
              </div>
              <div className="text-3xl text-white mb-2">28</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6F83A7]">Ocean: 18</span>
                <span className="text-[#6F83A7]">Air: 8</span>
                <span className="text-[#6F83A7]">Road: 2</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1">In-Transit Shipments</h4>
                  <p className="text-xs text-[#6F83A7]">Live tracking active</p>
                </div>
                <Ship className="w-8 h-8 text-[#57ACAF]" />
              </div>
              <div className="text-3xl text-white mb-2">45</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#57ACAF]">On Time: 38</span>
                <span className="text-[#EAB308]">Delayed: 7</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1">Delivered</h4>
                  <p className="text-xs text-[#6F83A7]">This month</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-[#6F83A7]" />
              </div>
              <div className="text-3xl text-white mb-2">152</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#57ACAF]">93% OTIF rate</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1">Exception Count</h4>
                  <p className="text-xs text-[#6F83A7]">Active issues</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-[#D0342C]" />
              </div>
              <div className="text-3xl text-white mb-2">7</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6F83A7]">Port: 3 • Weather: 2 • Other: 2</span>
              </div>
            </div>
          </div>

          {/* Global Map View */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Global Shipment Tracking</h3>
            <div className="relative bg-[#0D1117] rounded-lg p-8 h-[300px] flex items-center justify-center border border-white/10">
              <Globe className="w-32 h-32 text-[#6F83A7] opacity-20 absolute" />
              <div className="relative z-10 text-center">
                <Map className="w-12 h-12 text-[#57ACAF] mx-auto mb-3" />
                <p className="text-[#6F83A7] mb-2">Live Shipment Map</p>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#57ACAF]"></div>
                    <span className="text-xs text-[#6F83A7]">On Time (38)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#EAB308]"></div>
                    <span className="text-xs text-[#6F83A7]">Delayed (5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#D0342C]"></div>
                    <span className="text-xs text-[#6F83A7]">Critical (2)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-6">Shipment Trends by Mode</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={shipmentTrendData}>
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
                  <Bar dataKey="ocean" fill="#57ACAF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="air" fill="#EAB308" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="road" fill="#6F83A7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-6">OTIF Performance (6 Months)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={otifData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#6F83A7" />
                  <YAxis stroke="#6F83A7" domain={[85, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0D1117', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
                    }}
                  />
                  <Line type="monotone" dataKey="otif" stroke="#57ACAF" strokeWidth={3} dot={{ fill: '#57ACAF', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Key Contacts */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Key Shipping Contacts</h3>
            <div className="space-y-3">
              {[
                { name: 'Maersk Logistics', role: 'Ocean Freight', phone: '+880 1711-234567', email: 'dhaka@maersk.com' },
                { name: 'DHL Express', role: 'Air Freight', phone: '+880 1722-345678', email: 'bd@dhl.com' },
                { name: 'CMA CGM', role: 'Ocean Freight', phone: '+880 1733-456789', email: 'bangladesh@cma-cgm.com' },
                { name: 'Customs Clearance BD', role: 'Customs Agent', phone: '+880 1744-567890', email: 'customs@ccbd.com' },
              ].map((contact, index) => (
                <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white text-sm mb-1">{contact.name}</h4>
                      <p className="text-xs text-[#6F83A7]">{contact.role}</p>
                    </div>
                    <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] text-xs">Active</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#6F83A7]">
                      <Phone className="w-3 h-3" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#6F83A7]">
                      <Mail className="w-3 h-3" />
                      <span>{contact.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <AICard
            title="MARBIM Shipment Insights"
            marbimPrompt="Provide detailed shipment intelligence including ETA delay analysis, freight consolidation opportunities, and buyer communication updates."
            onAskMarbim={onAskMarbim}
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">ETA delay detected on container #ACME003 due to port congestion.</div>
                    <Button size="sm" onClick={() => toast.warning('Opening shipment details')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Consolidate two partial air shipments to reduce freight cost.</div>
                    <Button size="sm" onClick={() => toast.success('Opening consolidation tool')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Consolidate
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-[#6F83A7] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Update Buyer X about delay of Vessel YM Shanghai.</div>
                    <Button size="sm" onClick={() => toast.info('Opening draft message')} className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black mt-2">
                      Send Update
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

  // BOOKING MANAGER SUB-PAGE
  const renderBookingManager = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Booking Manager</h2>
            <p className="text-sm text-[#6F83A7]">Create, manage, and schedule shipment bookings across all freight modes</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
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
                value="schedule" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Calendar className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Schedule</span>
              </TabsTrigger>
              <TabsTrigger 
                value="forwarders" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Users className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Forwarder Coordination</span>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Total Bookings</h4>
                  <Package className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">28</div>
                <p className="text-xs text-[#6F83A7]">Active bookings</p>
              </div>
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Confirmed</h4>
                  <CheckCircle2 className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">22</div>
                <p className="text-xs text-[#6F83A7]">Ready to ship</p>
              </div>
              <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Pending Pickup</h4>
                  <Clock className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="text-3xl text-white mb-1">5</div>
                <p className="text-xs text-[#6F83A7]">Awaiting collection</p>
              </div>
              <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Canceled</h4>
                  <XCircle className="w-5 h-5 text-[#D0342C]" />
                </div>
                <div className="text-3xl text-white mb-1">1</div>
                <p className="text-xs text-[#6F83A7]">This month</p>
              </div>
            </div>

            {/* Workflow Progress */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Ship className="w-5 h-5 text-[#EAB308]" />
                    <span className="text-white">Booking Workflow</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                  <WorkflowStepper
                    steps={[
                      { label: 'Booking Created', status: 'completed' },
                      { label: 'AI Confirms Schedule', status: 'completed' },
                      { label: 'Auto-Email to Forwarder', status: 'active' },
                      { label: 'Log Confirmation', status: 'pending' },
                      { label: 'Monitor Pickup', status: 'pending' },
                    ]}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">All Bookings</h3>
              <SmartTable
                columns={[
                  { key: 'bookingId', label: 'Booking ID', sortable: true },
                  { key: 'buyer', label: 'Buyer', sortable: true },
                  { 
                    key: 'mode', 
                    label: 'Mode', 
                    sortable: true,
                    render: (value) => (
                      <div className="flex items-center gap-2">
                        {value === 'Ocean' && <Ship className="w-4 h-4 text-[#57ACAF]" />}
                        {value === 'Air' && <Plane className="w-4 h-4 text-[#EAB308]" />}
                        {value === 'Road' && <Truck className="w-4 h-4 text-[#6F83A7]" />}
                        <span className="text-white">{value}</span>
                      </div>
                    )
                  },
                  { key: 'forwarder', label: 'Forwarder', sortable: true },
                  { key: 'pickupDate', label: 'Pickup Date', sortable: true },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value) => (
                      <Badge className={`
                        ${value === 'Confirmed' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${value === 'Pending Pickup' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${value === 'Canceled' ? 'bg-[#D0342C]/20 text-[#D0342C]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                ]}
                data={bookingsData}
                onRowClick={handleRowClick}
                searchPlaceholder="Search bookings..."
              />
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Upcoming Pickups - Calendar View</h3>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs text-[#6F83A7] py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => (
                  <div key={i} className="aspect-square bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                    <div className="text-xs text-white mb-1">{i + 1}</div>
                    {i === 19 && (
                      <div className="w-full h-1 bg-[#EAB308] rounded"></div>
                    )}
                    {i === 21 && (
                      <div className="w-full h-1 bg-[#57ACAF] rounded"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Pickup Schedule</h3>
              <div className="space-y-3">
                {[
                  { date: '2024-11-18', buyer: 'Zara', mode: 'Air', forwarder: 'DHL Express', destination: 'Barcelona' },
                  { date: '2024-11-20', buyer: 'H&M', mode: 'Ocean', forwarder: 'Maersk', destination: 'Rotterdam' },
                  { date: '2024-11-22', buyer: 'Gap', mode: 'Ocean', forwarder: 'CMA CGM', destination: 'Los Angeles' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xs text-[#6F83A7]">{new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                        <div className="text-xl text-white">{new Date(item.date).getDate()}</div>
                      </div>
                      <div>
                        <h4 className="text-white mb-1">{item.buyer}</h4>
                        <p className="text-xs text-[#6F83A7]">{item.forwarder} • {item.destination}</p>
                      </div>
                    </div>
                    <Badge className="bg-[#57ACAF]/20 text-[#57ACAF]">{item.mode}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Forwarders Tab */}
          <TabsContent value="forwarders" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Forwarder Performance Ranking</h3>
              <div className="space-y-3">
                {[
                  { name: 'Maersk Logistics', rating: 4.8, shipments: 45, otif: 96, reliability: 'Excellent' },
                  { name: 'DHL Express', rating: 4.6, shipments: 38, otif: 94, reliability: 'Excellent' },
                  { name: 'CMA CGM', rating: 4.3, shipments: 32, otif: 91, reliability: 'Good' },
                  { name: 'Kuehne + Nagel', rating: 4.1, shipments: 28, otif: 89, reliability: 'Good' },
                ].map((forwarder, index) => (
                  <div key={index} className="p-5 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white">{forwarder.name}</h4>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-[#EAB308] fill-[#EAB308]" />
                            <span className="text-sm text-white">{forwarder.rating}</span>
                          </div>
                        </div>
                        <div className="flex gap-6 text-xs text-[#6F83A7]">
                          <span>{forwarder.shipments} shipments</span>
                          <span>OTIF: {forwarder.otif}%</span>
                        </div>
                      </div>
                      <Badge className={`${
                        forwarder.reliability === 'Excellent' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : 'bg-[#EAB308]/20 text-[#EAB308]'
                      }`}>
                        {forwarder.reliability}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/10">
                        <Phone className="w-3 h-3 mr-2" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/10">
                        <Eye className="w-3 h-3 mr-2" />
                        View Details
                      </Button>
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
                <h3 className="text-white">Booking Optimization Insights</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Cost Savings Opportunity</h4>
                  <p className="text-sm text-[#6F83A7]">
                    You can save $1,200 if two Dhaka–Rotterdam shipments (BK-2024-001 and BK-2024-004) are combined into one container.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Freight Rate Prediction</h4>
                  <p className="text-sm text-[#6F83A7]">
                    Ocean freight rates expected to increase by 8-12% next quarter due to seasonal demand.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Mode Recommendation</h4>
                  <p className="text-sm text-[#6F83A7]">
                    For urgent Zara shipment, switch from ocean to air to meet buyer ETA. Additional cost: $450.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // LIVE TRACKING SUB-PAGE
  const renderLiveTracking = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Live Tracking</h2>
            <p className="text-sm text-[#6F83A7]">Real-time shipment tracking with AI-predicted ETAs</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Navigation className="w-4 h-4 mr-2" />
              Track New Shipment
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
                value="ocean" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Ship className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Ocean Shipments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="air" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Plane className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Air Shipments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="road" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Truck className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Road Shipments</span>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">In-Transit</h4>
                  <Activity className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">45</div>
                <p className="text-xs text-[#6F83A7]">Active shipments</p>
              </div>
              <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Delayed</h4>
                  <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
                </div>
                <div className="text-3xl text-white mb-1">7</div>
                <p className="text-xs text-[#6F83A7]">Require attention</p>
              </div>
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Delivered</h4>
                  <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">152</div>
                <p className="text-xs text-[#6F83A7]">This month</p>
              </div>
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Avg Transit Time</h4>
                  <Clock className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">18 days</div>
                <p className="text-xs text-[#6F83A7]">Ocean freight</p>
              </div>
            </div>

            {/* Global Map View */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Global Shipment Map</h3>
              <div className="relative bg-[#0D1117] rounded-lg p-8 h-[350px] flex items-center justify-center border border-white/10">
                <Globe className="w-40 h-40 text-[#6F83A7] opacity-20 absolute" />
                <div className="relative z-10 text-center">
                  <Map className="w-16 h-16 text-[#57ACAF] mx-auto mb-4" />
                  <p className="text-white mb-2">Live Container Tracking</p>
                  <p className="text-sm text-[#6F83A7] mb-4">45 shipments being tracked globally</p>
                  <div className="flex items-center justify-center gap-8 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#57ACAF] animate-pulse"></div>
                      <div>
                        <div className="text-xs text-[#6F83A7]">On Time</div>
                        <div className="text-sm text-white">38</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#EAB308] animate-pulse"></div>
                      <div>
                        <div className="text-xs text-[#6F83A7]">Delayed</div>
                        <div className="text-sm text-white">5</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#D0342C] animate-pulse"></div>
                      <div>
                        <div className="text-xs text-[#6F83A7]">Critical</div>
                        <div className="text-sm text-white">2</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Ocean Shipments Tab */}
          <TabsContent value="ocean" className="space-y-6">
            {/* Workflow Progress */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Ship className="w-5 h-5 text-[#EAB308]" />
                    <span className="text-white">Ocean Tracking Workflow</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                  <WorkflowStepper
                    steps={[
                      { label: 'Container Loaded', status: 'completed' },
                      { label: 'Vessel Departed', status: 'completed' },
                      { label: 'AI ETA Update', status: 'active' },
                      { label: 'Port Arrival', status: 'pending' },
                      { label: 'Delivery', status: 'pending' },
                    ]}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Ocean Shipments</h3>
              <SmartTable
                columns={[
                  { key: 'containerNumber', label: 'Container #', sortable: true },
                  { key: 'vessel', label: 'Vessel', sortable: true },
                  { key: 'pol', label: 'POL', sortable: true },
                  { key: 'pod', label: 'POD', sortable: true },
                  { key: 'eta', label: 'ETA', sortable: true },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value, row) => (
                      <div className="flex items-center gap-2">
                        <Badge className={`
                          ${value === 'On Time' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                          ${value === 'Delayed' ? 'bg-[#D0342C]/20 text-[#D0342C]' : ''}
                        `}>
                          {value}
                        </Badge>
                        {row.delayDays > 0 && (
                          <span className="text-xs text-[#D0342C]">+{row.delayDays}d</span>
                        )}
                      </div>
                    ),
                  },
                ]}
                data={oceanShipmentsData}
                onRowClick={(shipment) => {
                  setSelectedShipment(shipment);
                  setShipmentDrawerOpen(true);
                }}
                searchPlaceholder="Search containers..."
              />
            </div>
          </TabsContent>

          {/* Air Shipments Tab */}
          <TabsContent value="air" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Air Shipments</h3>
              <SmartTable
                columns={[
                  { key: 'awbNumber', label: 'AWB #', sortable: true },
                  { key: 'airline', label: 'Airline', sortable: true },
                  { key: 'departure', label: 'Departure', sortable: true },
                  { key: 'arrival', label: 'Arrival', sortable: true },
                  { key: 'eta', label: 'ETA', sortable: true },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value) => (
                      <Badge className={`
                        ${value === 'In Transit' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${value === 'Delayed' ? 'bg-[#D0342C]/20 text-[#D0342C]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                ]}
                data={airShipmentsData}
                onRowClick={handleRowClick}
                searchPlaceholder="Search AWB numbers..."
              />
            </div>
          </TabsContent>

          {/* Road Shipments Tab */}
          <TabsContent value="road" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">GPS-Enabled Truck Tracking</h3>
              <div className="space-y-3">
                {[
                  { truck: 'TRK-8821', route: 'Dhaka → Chittagong', status: 'On Route', progress: 65, eta: '2024-11-16 14:30' },
                  { truck: 'TRK-9012', route: 'Gazipur → Dhaka Port', status: 'On Route', progress: 40, eta: '2024-11-16 18:00' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white mb-1">{item.truck}</h4>
                        <p className="text-sm text-[#6F83A7]">{item.route}</p>
                      </div>
                      <Badge className="bg-[#57ACAF]/20 text-[#57ACAF]">{item.status}</Badge>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-[#6F83A7] mb-1">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                    <p className="text-xs text-[#6F83A7]">ETA: {item.eta}</p>
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
                <h3 className="text-white">Predictive ETA Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Delay Heatmap</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    Rotterdam port showing high congestion. 3 shipments may experience 2-3 day delays.
                  </p>
                  <div className="flex gap-2">
                    <Badge className="bg-[#D0342C]/20 text-[#D0342C]">Rotterdam</Badge>
                    <Badge className="bg-[#EAB308]/20 text-[#EAB308]">Hamburg</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">ETA Accuracy Score</h4>
                  <p className="text-sm text-[#6F83A7] mb-2">
                    Current AI prediction accuracy: 94.2% (based on 150 recent shipments)
                  </p>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Weather Impact Alert</h4>
                  <p className="text-sm text-[#6F83A7]">
                    Typhoon in Pacific may delay 2 shipments to Los Angeles by 4-6 days.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // DOCUMENT VAULT SUB-PAGE
  const renderDocumentVault = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Document Vault</h2>
            <p className="text-sm text-[#6F83A7]">Centralized auto-generated and verified document repository</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        <Tabs defaultValue="invoice-pack" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
            <TabsList className="w-full grid grid-cols-5 bg-transparent gap-1.5 p-0 h-auto">
              <TabsTrigger 
                value="invoice-pack" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <FileText className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Invoice Pack</span>
              </TabsTrigger>
              <TabsTrigger 
                value="templates" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <BookOpen className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Templates</span>
              </TabsTrigger>
              <TabsTrigger 
                value="verification" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <FileCheck className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Verification</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <History className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">History</span>
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

          {/* Invoice Pack Tab */}
          <TabsContent value="invoice-pack" className="space-y-6">
            {/* Workflow Progress */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#EAB308]" />
                    <span className="text-white">Document Generation Workflow</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                  <WorkflowStepper
                    steps={[
                      { label: 'Shipment Confirmed', status: 'completed' },
                      { label: 'AI Compiles Documents', status: 'completed' },
                      { label: 'Auto-Verification', status: 'active' },
                      { label: 'Upload Pack', status: 'pending' },
                      { label: 'Generate PDF Set', status: 'pending' },
                    ]}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Invoice Packs</h3>
              <SmartTable
                columns={[
                  { key: 'shipmentId', label: 'Shipment ID', sortable: true },
                  { key: 'buyer', label: 'Buyer', sortable: true },
                  { key: 'documentType', label: 'Document Type', sortable: true },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value) => (
                      <Badge className={`
                        ${value === 'Complete' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${value.includes('Missing') ? 'bg-[#D0342C]/20 text-[#D0342C]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                  { key: 'lastUpdated', label: 'Last Updated', sortable: true },
                ]}
                data={documentsData}
                onRowClick={handleRowClick}
                searchPlaceholder="Search documents..."
              />
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Document Checklist: SHP-1092</h3>
              <div className="space-y-2">
                {[
                  { name: 'Commercial Invoice', status: 'complete' },
                  { name: 'Packing List', status: 'complete' },
                  { name: 'Bill of Lading', status: 'complete' },
                  { name: 'Certificate of Origin', status: 'complete' },
                  { name: 'GSP Certificate', status: 'complete' },
                  { name: 'Airway Bill', status: 'n/a' },
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-white">{doc.name}</span>
                    {doc.status === 'complete' && <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />}
                    {doc.status === 'missing' && <XCircle className="w-5 h-5 text-[#D0342C]" />}
                    {doc.status === 'n/a' && <span className="text-xs text-[#6F83A7]">N/A</span>}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {['EU', 'US', 'Asia'].map((region) => (
                <div key={region} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h4 className="text-white mb-4">{region} Templates</h4>
                  <div className="space-y-2">
                    {['Commercial Invoice', 'Packing List', 'COO'].map((template, index) => (
                      <div key={index} className="p-3 rounded-lg bg-white/5 flex items-center justify-between">
                        <span className="text-sm text-white">{template}</span>
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">AI Template Selection</h3>
              <p className="text-sm text-[#6F83A7] mb-4">
                MARBIM automatically selects the correct document format based on destination and buyer requirements.
              </p>
              <div className="space-y-3">
                {[
                  { shipment: 'SHP-1092', buyer: 'H&M', destination: 'Rotterdam', template: 'EU - Standard' },
                  { shipment: 'SHP-1093', buyer: 'Gap', destination: 'Los Angeles', template: 'US - USMCA' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white mb-1">{item.shipment}</h4>
                        <p className="text-xs text-[#6F83A7]">{item.buyer} • {item.destination}</p>
                      </div>
                      <Badge className="bg-[#EAB308]/20 text-[#EAB308]">{item.template}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Document Verification Results</h3>
              <div className="space-y-3">
                {[
                  { 
                    shipment: 'SHP-1092', 
                    verified: true, 
                    issues: 0,
                    details: 'All documents verified successfully. PO#, quantity, weight, HS codes match.' 
                  },
                  { 
                    shipment: 'SHP-1093', 
                    verified: false, 
                    issues: 2,
                    details: 'Mismatch: Invoice quantity (5000 pcs) vs BL quantity (4800 pcs). Missing GSP certificate.' 
                  },
                ].map((item, index) => (
                  <div key={index} className={`p-5 rounded-lg border ${
                    item.verified ? 'bg-[#57ACAF]/10 border-[#57ACAF]/30' : 'bg-[#D0342C]/10 border-[#D0342C]/30'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white mb-1">{item.shipment}</h4>
                        <p className="text-sm text-[#6F83A7]">{item.details}</p>
                      </div>
                      <Badge className={`${
                        item.verified ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : 'bg-[#D0342C]/20 text-[#D0342C]'
                      }`}>
                        {item.verified ? 'Verified' : `${item.issues} Issues`}
                      </Badge>
                    </div>
                    {!item.verified && (
                      <Button size="sm" className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                        <Edit className="w-3 h-3 mr-2" />
                        Review & Fix
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Version History</h3>
              <div className="space-y-3">
                {[
                  { version: 'v3', date: '2024-11-15 14:30', approver: 'John Smith', action: 'Updated HS codes' },
                  { version: 'v2', date: '2024-11-14 09:15', approver: 'Sarah Jones', action: 'Corrected buyer address' },
                  { version: 'v1', date: '2024-11-13 16:45', approver: 'AI System', action: 'Initial generation' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-[#6F83A7]/20 text-[#6F83A7]">{item.version}</Badge>
                          <span className="text-white">{item.action}</span>
                        </div>
                        <p className="text-xs text-[#6F83A7]">By {item.approver} • {item.date}</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-white/10">
                        <Download className="w-3 h-3 mr-2" />
                        Download
                      </Button>
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
                <h3 className="text-white">Document Intelligence</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Missing Documents Alert</h4>
                  <p className="text-sm text-[#6F83A7]">
                    Shipment #1093 missing GSP certificate required for EU import. Auto-generated reminder sent to compliance team.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Mismatch Detection</h4>
                  <p className="text-sm text-[#6F83A7]">
                    Quantity mismatch detected between Invoice (5000 pcs) and BL (4800 pcs) for Shipment #1093.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Auto-Verification Success Rate</h4>
                  <p className="text-sm text-[#6F83A7] mb-2">
                    96% of documents verified automatically without manual intervention this month.
                  </p>
                  <Progress value={96} className="h-2" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // BUYER UPDATES SUB-PAGE
  const renderBuyerUpdates = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Buyer Updates</h2>
            <p className="text-sm text-[#6F83A7]">Proactive buyer communication for shipment status and delays</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <MessageSquare className="w-4 h-4 mr-2" />
              New Update
            </Button>
          </div>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
            <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
              <TabsTrigger 
                value="templates" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <BookOpen className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Templates</span>
              </TabsTrigger>
              <TabsTrigger 
                value="scheduled" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Calendar className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Scheduled Updates</span>
              </TabsTrigger>
              <TabsTrigger 
                value="logs" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <History className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Communication Logs</span>
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

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            {/* Workflow Progress */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-[#EAB308]" />
                    <span className="text-white">Buyer Update Workflow</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                  <WorkflowStepper
                    steps={[
                      { label: 'AI Detects ETA Delay', status: 'completed' },
                      { label: 'Generate Message', status: 'completed' },
                      { label: 'Send via Email API', status: 'active' },
                      { label: 'Log Communication', status: 'pending' },
                      { label: 'Track Response', status: 'pending' },
                    ]}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="grid grid-cols-3 gap-6">
              {[
                { type: 'Delay Notification', count: 3, color: '#D0342C' },
                { type: 'Dispatch Confirmation', count: 8, color: '#57ACAF' },
                { type: 'Delivery Confirmation', count: 12, color: '#EAB308' },
              ].map((template, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white">{template.type}</h4>
                    <Badge className="bg-[#6F83A7]/20 text-[#6F83A7]">{template.count}</Badge>
                  </div>
                  <p className="text-sm text-[#6F83A7] mb-4">
                    Auto-customized template using buyer tone and language preference.
                  </p>
                  <Button size="sm" variant="outline" className="w-full border-white/10">
                    <Eye className="w-3 h-3 mr-2" />
                    Preview Template
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">AI-Generated Draft: Delay Notification</h3>
              <div className="p-4 rounded-lg bg-[#0D1117] border border-white/10 mb-4">
                <p className="text-sm text-[#6F83A7] mb-3">
                  <span className="text-white">To:</span> procurement@hm.com
                </p>
                <p className="text-sm text-[#6F83A7] mb-3">
                  <span className="text-white">Subject:</span> Update on Shipment Delay - Container #ACME003
                </p>
                <div className="text-sm text-white space-y-2">
                  <p>Dear H&M Team,</p>
                  <p>
                    We want to update you on shipment Container #ACME003 (Vessel: YM Shanghai) heading to Rotterdam. 
                    Due to port congestion, we anticipate a 2-day delay from the original ETA of December 3rd.
                  </p>
                  <p>
                    New estimated arrival: <span className="text-[#EAB308]">December 5th, 2024</span>
                  </p>
                  <p>
                    We are closely monitoring the situation and will provide further updates as needed. 
                    Please let us know if you have any concerns.
                  </p>
                  <p>Best regards,<br/>Logistics Team</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-white/10">
                  <Edit className="w-3 h-3 mr-2" />
                  Edit
                </Button>
                <Button size="sm" className="bg-[#57ACAF] hover:bg-[#57ACAF]/90">
                  <Send className="w-3 h-3 mr-2" />
                  Send Now
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Scheduled Updates Tab */}
          <TabsContent value="scheduled" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Upcoming Automated Notifications</h3>
              <SmartTable
                columns={[
                  { key: 'buyer', label: 'Buyer', sortable: true },
                  { 
                    key: 'messageType', 
                    label: 'Message Type', 
                    sortable: true,
                    render: (value) => (
                      <Badge className={`
                        ${value === 'Delay' ? 'bg-[#D0342C]/20 text-[#D0342C]' : ''}
                        ${value === 'Dispatch' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                        ${value === 'Delivery' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                  { key: 'scheduledDate', label: 'Scheduled Date', sortable: true },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value) => (
                      <Badge className="bg-[#6F83A7]/20 text-[#6F83A7]">{value}</Badge>
                    ),
                  },
                ]}
                data={[
                  { buyer: 'H&M', messageType: 'Delay', scheduledDate: '2024-11-16', status: 'Pending' },
                  { buyer: 'Zara', messageType: 'Dispatch', scheduledDate: '2024-11-17', status: 'Pending' },
                  { buyer: 'Gap', messageType: 'Delivery', scheduledDate: '2024-11-18', status: 'Pending' },
                ]}
                searchPlaceholder="Search updates..."
              />
            </div>
          </TabsContent>

          {/* Communication Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Communication History</h3>
              <div className="space-y-3">
                {[
                  { 
                    date: '2024-11-15 10:30', 
                    buyer: 'H&M', 
                    channel: 'Email', 
                    content: 'Delay notification for Container #ACME003',
                    aiSource: 'Port congestion detection'
                  },
                  { 
                    date: '2024-11-14 14:20', 
                    buyer: 'Zara', 
                    channel: 'WhatsApp', 
                    content: 'Dispatch confirmation for AWB-7734521',
                    aiSource: 'Shipment tracking update'
                  },
                  { 
                    date: '2024-11-13 09:15', 
                    buyer: 'Gap', 
                    channel: 'Email', 
                    content: 'Delivery confirmation',
                    aiSource: 'Delivery scan detected'
                  },
                ].map((log, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white">{log.buyer}</h4>
                          <Badge className="bg-[#6F83A7]/20 text-[#6F83A7]">{log.channel}</Badge>
                        </div>
                        <p className="text-sm text-[#6F83A7] mb-1">{log.content}</p>
                        <p className="text-xs text-[#6F83A7]">AI Source: {log.aiSource}</p>
                      </div>
                      <span className="text-xs text-[#6F83A7]">{log.date}</span>
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
                <h3 className="text-white">Communication Intelligence</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Unanswered Communication Alert</h4>
                  <p className="text-sm text-[#6F83A7]">
                    ACME buyer not updated since Oct 14. Auto-draft prepared with shipment status summary.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Consolidated Report Ready</h4>
                  <p className="text-sm text-[#6F83A7]">
                    Prepare consolidated delivery report for next week covering 12 completed shipments.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Communication Trends</h4>
                  <p className="text-sm text-[#6F83A7] mb-2">
                    85% of buyer communications automated this month. Average response time: 2.3 hours.
                  </p>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // EXCEPTIONS SUB-PAGE
  const renderExceptions = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Exceptions Management</h2>
            <p className="text-sm text-[#6F83A7]">Track disruptions and mitigation workflows</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Log Exception
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
                value="incidents" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <AlertTriangle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Incident List</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mitigation" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Shield className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Mitigation Plan</span>
              </TabsTrigger>
              <TabsTrigger 
                value="buyer-impact" 
                className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
              >
                <Users className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
                <span className="text-xs">Buyer Impact</span>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Port Delay</h4>
                  <Anchor className="w-5 h-5 text-[#D0342C]" />
                </div>
                <div className="text-3xl text-white mb-1">3</div>
                <p className="text-xs text-[#6F83A7]">Active cases</p>
              </div>
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Customs Hold</h4>
                  <Shield className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-3xl text-white mb-1">2</div>
                <p className="text-xs text-[#6F83A7]">Pending clearance</p>
              </div>
              <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Weather Impact</h4>
                  <AlertCircle className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="text-3xl text-white mb-1">2</div>
                <p className="text-xs text-[#6F83A7]">Weather delays</p>
              </div>
              <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">Resolved</h4>
                  <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-3xl text-white mb-1">18</div>
                <p className="text-xs text-[#6F83A7]">This month</p>
              </div>
            </div>

            {/* Exception Heatmap */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">AI Exception Heatmap</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { zone: 'Rotterdam Port', frequency: 'high', count: 12 },
                  { zone: 'Hamburg Port', frequency: 'medium', count: 7 },
                  { zone: 'Los Angeles Port', frequency: 'low', count: 3 },
                  { zone: 'Barcelona Airport', frequency: 'low', count: 2 },
                  { zone: 'Maersk Line', frequency: 'medium', count: 8 },
                  { zone: 'DHL Express', frequency: 'low', count: 4 },
                  { zone: 'CMA CGM', frequency: 'high', count: 10 },
                  { zone: 'Kuehne + Nagel', frequency: 'low', count: 5 },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border cursor-pointer hover:scale-105 transition-transform ${
                      item.frequency === 'high' ? 'bg-[#D0342C]/10 border-[#D0342C]/30' :
                      item.frequency === 'medium' ? 'bg-[#EAB308]/10 border-[#EAB308]/30' :
                      'bg-[#57ACAF]/10 border-[#57ACAF]/30'
                    }`}
                  >
                    <div className="text-xs text-white mb-1 truncate">{item.zone}</div>
                    <div className={`text-lg ${
                      item.frequency === 'high' ? 'text-[#D0342C]' :
                      item.frequency === 'medium' ? 'text-[#EAB308]' :
                      'text-[#57ACAF]'
                    }`}>{item.count}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#D0342C]"></div>
                  <span className="text-xs text-[#6F83A7]">High Frequency (&gt;10)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EAB308]"></div>
                  <span className="text-xs text-[#6F83A7]">Medium (5-10)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#57ACAF]"></div>
                  <span className="text-xs text-[#6F83A7]">Low (&lt;5)</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Incident List Tab */}
          <TabsContent value="incidents" className="space-y-6">
            {/* Workflow Progress */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#EAB308]" />
                    <span className="text-white">Exception Workflow</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                  <WorkflowStepper
                    steps={[
                      { label: 'Disruption Detected', status: 'completed' },
                      { label: 'AI Categorizes Issue', status: 'completed' },
                      { label: 'Assign Coordinator', status: 'active' },
                      { label: 'Track Resolution', status: 'pending' },
                      { label: 'Verify Closure', status: 'pending' },
                    ]}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Active Exceptions</h3>
              <SmartTable
                columns={[
                  { key: 'exceptionId', label: 'Exception ID', sortable: true },
                  { key: 'shipmentNumber', label: 'Shipment #', sortable: true },
                  { key: 'issue', label: 'Issue', sortable: true },
                  { key: 'date', label: 'Date', sortable: true },
                  { key: 'responsibleParty', label: 'Responsible Party', sortable: true },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value) => (
                      <Badge className={`
                        ${value === 'In Progress' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${value === 'Resolved' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                  {
                    key: 'impact',
                    label: 'Impact',
                    render: (value) => (
                      <Badge className={`
                        ${value === 'High' ? 'bg-[#D0342C]/20 text-[#D0342C]' : ''}
                        ${value === 'Medium' ? 'bg-[#EAB308]/20 text-[#EAB308]' : ''}
                        ${value === 'Low' ? 'bg-[#6F83A7]/20 text-[#6F83A7]' : ''}
                      `}>
                        {value}
                      </Badge>
                    ),
                  },
                ]}
                data={exceptionsData}
                onRowClick={handleRowClick}
                searchPlaceholder="Search exceptions..."
              />
            </div>
          </TabsContent>

          {/* Mitigation Plan Tab */}
          <TabsContent value="mitigation" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Mitigation Plans</h3>
              <div className="space-y-4">
                {[
                  {
                    exception: 'EXC-001',
                    issue: 'Port Congestion - Rotterdam',
                    aiSuggestion: 'Re-route to Hamburg port or negotiate priority berthing',
                    assignedTo: 'Sarah Johnson',
                    progress: 60,
                    status: 'In Progress'
                  },
                  {
                    exception: 'EXC-002',
                    issue: 'Weather Delay - AWB-8821456',
                    aiSuggestion: 'Book alternative flight or delay non-urgent cargo',
                    assignedTo: 'Mike Chen',
                    progress: 100,
                    status: 'Resolved'
                  },
                ].map((plan, index) => (
                  <div key={index} className="p-5 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white">{plan.exception}</h4>
                          <Badge className={`${
                            plan.status === 'Resolved' ? 'bg-[#57ACAF]/20 text-[#57ACAF]' : 'bg-[#EAB308]/20 text-[#EAB308]'
                          }`}>
                            {plan.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#6F83A7] mb-2">{plan.issue}</p>
                        <div className="p-3 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20 mb-3">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-[#EAB308] mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-[#6F83A7]">AI Suggestion: {plan.aiSuggestion}</p>
                          </div>
                        </div>
                        <p className="text-xs text-[#6F83A7] mb-2">Assigned to: {plan.assignedTo}</p>
                        <Progress value={plan.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Buyer Impact Tab */}
          <TabsContent value="buyer-impact" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4">Impacted Buyers & Orders</h3>
              <div className="space-y-3">
                {[
                  { buyer: 'H&M', shipment: 'ACME003', delayDays: 2, compensation: 'None', drafted: true },
                  { buyer: 'Zara', shipment: 'AWB-8821456', delayDays: 1, compensation: 'Credit note', drafted: true },
                ].map((impact, index) => (
                  <div key={index} className="p-5 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white mb-1">{impact.buyer}</h4>
                        <p className="text-sm text-[#6F83A7] mb-2">
                          Shipment: {impact.shipment} • Delay: {impact.delayDays} day{impact.delayDays > 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-[#6F83A7]">Suggested compensation: {impact.compensation}</p>
                      </div>
                      <Badge className="bg-[#D0342C]/20 text-[#D0342C]">Delayed</Badge>
                    </div>
                    {impact.drafted && (
                      <div className="p-3 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
                        <p className="text-sm text-[#6F83A7] mb-2 italic">
                          "We sincerely apologize for the {impact.delayDays}-day delay on shipment {impact.shipment}. 
                          We are working to resolve this and will keep you updated."
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
                    )}
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
                <h3 className="text-white">Predictive Exception Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Recurring Issue Pattern</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    Rotterdam port shows consistent delays (3 incidents in 2 weeks). Consider alternative routing for future shipments.
                  </p>
                  <Button size="sm" variant="outline" className="border-white/10">
                    View Alternatives
                  </Button>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Vendor Performance Alert</h4>
                  <p className="text-sm text-[#6F83A7]">
                    CMA CGM has 40% higher exception rate compared to industry average. Review forwarder contract.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="text-white mb-2">Seasonal Prediction</h4>
                  <p className="text-sm text-[#6F83A7]">
                    Weather-related delays expected to increase by 25% in next 2 weeks (typhoon season).
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
    if (subPage === 'booking-manager') {
      return renderBookingManager();
    } else if (subPage === 'live-tracking') {
      return renderLiveTracking();
    } else if (subPage === 'document-vault') {
      return renderDocumentVault();
    } else if (subPage === 'buyer-updates') {
      return renderBuyerUpdates();
    } else if (subPage === 'exceptions') {
      return renderExceptions();
    } else {
      return renderDashboard();
    }
  };

  return (
    <>
      <PageLayout
        breadcrumbs={[
          { label: 'Production & Operations' },
          { label: 'Shipment' }
        ]}
        aiInsightsCount={5}
      >
        {renderContent()}
      </PageLayout>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedItem?.bookingId || selectedItem?.containerNumber || selectedItem?.awbNumber || selectedItem?.shipmentId || selectedItem?.exceptionId || 'Details'}
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
            id: 'tracking',
            label: 'Tracking',
            icon: Navigation,
            content: (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-sm text-white mb-1">Status Updated</div>
                  <div className="text-xs text-[#6F83A7]">2 hours ago</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-sm text-white mb-1">In Transit</div>
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
                    AI-powered tracking insights and ETA predictions will appear here.
                  </p>
                </div>
              </div>
            ),
          },
        ]}
      />

      {/* Shipment Detail Drawer */}
      {selectedShipment && (
        <ShipmentDetailDrawer
          isOpen={shipmentDrawerOpen}
          onClose={() => setShipmentDrawerOpen(false)}
          shipment={selectedShipment}
          onAskMarbim={onAskMarbim || (() => {})}
        />
      )}
    </>
  );
}
