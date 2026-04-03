import { useState } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Ship, Anchor, MapPin, Calendar, Clock, Package, FileText,
  CheckCircle2, AlertTriangle, Activity, Sparkles, Download, Edit,
  Navigation, Container, Route, Globe, Users, Phone, Mail,
  TrendingUp, AlertCircle, Shield, Target, BarChart3, Zap,
  FileCheck, History, MessageSquare, Star, Award
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface ShipmentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: any;
  onAskMarbim: (message: string) => void;
}

export function ShipmentDetailDrawer({ isOpen, onClose, shipment, onAskMarbim }: ShipmentDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!shipment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time':
        return { bg: 'bg-[#57ACAF]/10', text: 'text-[#57ACAF]', border: 'border-[#57ACAF]/20', icon: 'text-[#57ACAF]' };
      case 'Delayed':
        return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: 'text-red-500' };
      case 'In Transit':
        return { bg: 'bg-[#EAB308]/10', text: 'text-[#EAB308]', border: 'border-[#EAB308]/20', icon: 'text-[#EAB308]' };
      case 'Arrived':
        return { bg: 'bg-[#57ACAF]/10', text: 'text-[#57ACAF]', border: 'border-[#57ACAF]/20', icon: 'text-[#57ACAF]' };
      default:
        return { bg: 'bg-white/10', text: 'text-white', border: 'border-white/20', icon: 'text-white' };
    }
  };

  const statusColors = getStatusColor(shipment.status);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'route', label: 'Route & Timeline', icon: Navigation },
    { id: 'documents', label: 'Documents', icon: FileCheck },
    { id: 'updates', label: 'Updates', icon: MessageSquare }
  ];

  // Calculate journey progress
  const calculateProgress = () => {
    if (shipment.status === 'Arrived') return 100;
    if (shipment.status === 'In Transit') return 60;
    return 30;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={fabricRightDrawerClass('max-w-[1000px]')}
          >
            {/* Header */}
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(87,172,175,0.05),transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(234,179,8,0.05),transparent_50%)]" />
              
              <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20`}>
                      <Ship className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-white text-xl">{shipment.containerNumber}</h2>
                        <Badge className={`${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                          {shipment.status}
                        </Badge>
                        {shipment.delayDays > 0 && (
                          <Badge className="bg-red-500/10 text-red-400 border border-red-500/20">
                            +{shipment.delayDays}d Delay
                          </Badge>
                        )}
                      </div>
                      <p className="text-[#6F83A7] text-sm mb-4">Ocean Freight • {shipment.vessel}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-white">{shipment.pol}</span>
                          <span className="text-[#6F83A7]">→</span>
                          <span className="text-white">{shipment.pod}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-white">ETA: {shipment.eta}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-[#6F83A7] hover:text-white hover:bg-white/5 shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Journey Progress</p>
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-[#57ACAF]" />
                      <p className="text-white">{calculateProgress()}%</p>
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Transit Time</p>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#EAB308]" />
                      <p className="text-white">{shipment.transitDays || '21'} days</p>
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Container Type</p>
                    <div className="flex items-center gap-1.5">
                      <Container className="w-4 h-4 text-[#6F83A7]" />
                      <p className="text-white text-sm">{shipment.containerType || '40ft HC'}</p>
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Weight</p>
                    <p className="text-white text-sm">{shipment.weight || '18,500'} kg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center px-8 gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative px-5 py-3.5 text-sm transition-all duration-300 flex items-center gap-2
                        ${activeTab === tab.id ? 'text-[#57ACAF]' : 'text-[#6F83A7] hover:text-white'}
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="relative z-10">{tab.label}</span>
                      
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeShipmentTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"
                          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-8 py-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Shipment Details Card */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Container className="w-5 h-5 text-[#57ACAF]" />
                        Shipment Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Container Number</label>
                          <p className="text-white text-sm font-medium">{shipment.containerNumber}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Booking Reference</label>
                          <p className="text-white text-sm">{shipment.bookingRef || 'BKG-2024-' + shipment.containerNumber.slice(-4)}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Container Type</label>
                          <p className="text-white text-sm">{shipment.containerType || '40ft High Cube'}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Seal Number</label>
                          <p className="text-white text-sm">{shipment.sealNumber || 'SL' + Math.random().toString().slice(2, 9)}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Gross Weight</label>
                          <p className="text-white text-sm">{shipment.weight || '18,500'} kg</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">CBM</label>
                          <p className="text-white text-sm">{shipment.cbm || '67.2'} m³</p>
                        </div>
                      </div>
                    </div>

                    {/* Vessel Information */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Ship className="w-5 h-5 text-[#57ACAF]" />
                        Vessel Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Vessel Name</label>
                          <p className="text-white text-sm font-medium">{shipment.vessel}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Voyage Number</label>
                          <p className="text-white text-sm">{shipment.voyage || 'V' + Math.random().toString().slice(2, 7)}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Carrier</label>
                          <p className="text-white text-sm">{shipment.carrier || 'Maersk Line'}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">IMO Number</label>
                          <p className="text-white text-sm">{shipment.imo || 'IMO' + Math.random().toString().slice(2, 9)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Route Information */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Route className="w-5 h-5 text-[#EAB308]" />
                        Route Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <label className="text-xs text-[#6F83A7] mb-1 block">Port of Loading (POL)</label>
                            <p className="text-white text-sm font-medium">{shipment.pol}</p>
                            <p className="text-xs text-[#6F83A7]">{shipment.polDate || 'Dec 1, 2024'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-0.5 bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"></div>
                            <Ship className="w-4 h-4 text-[#57ACAF]" />
                            <div className="w-8 h-0.5 bg-gradient-to-r from-[#EAB308] to-[#57ACAF]"></div>
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-[#6F83A7] mb-1 block">Port of Discharge (POD)</label>
                            <p className="text-white text-sm font-medium">{shipment.pod}</p>
                            <p className="text-xs text-[#6F83A7]">{shipment.eta}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-[#6F83A7] mb-1 block">Transit Time</label>
                            <p className="text-white text-sm">{shipment.transitDays || '21'} days</p>
                          </div>
                          <div>
                            <label className="text-xs text-[#6F83A7] mb-1 block">Distance</label>
                            <p className="text-white text-sm">{shipment.distance || '8,420'} nautical miles</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cargo Information */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#EAB308]" />
                        Cargo Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Commodity</label>
                          <p className="text-white text-sm">{shipment.commodity || 'Textile Products - Finished Garments'}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs text-[#6F83A7] mb-1 block">Total Packages</label>
                            <p className="text-white text-sm">{shipment.packages || '1,240'} cartons</p>
                          </div>
                          <div>
                            <label className="text-xs text-[#6F83A7] mb-1 block">HS Code</label>
                            <p className="text-white text-sm">{shipment.hsCode || '6203.42.40'}</p>
                          </div>
                          <div>
                            <label className="text-xs text-[#6F83A7] mb-1 block">Declared Value</label>
                            <p className="text-white text-sm">${shipment.value || '145,000'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Tracking */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#57ACAF]" />
                        Current Status
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6F83A7]">Journey Progress</span>
                            <span className="text-sm text-white">{calculateProgress()}%</span>
                          </div>
                          <Progress value={calculateProgress()} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-[#6F83A7] mb-1">Current Location</p>
                            <p className="text-white text-sm">{shipment.currentLocation || 'At Sea - Indian Ocean'}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-[#6F83A7] mb-1">Last Update</p>
                            <p className="text-white text-sm">{shipment.lastUpdate || '2 hours ago'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-2 flex items-center gap-2">
                            AI Shipment Analysis
                            <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                              MARBIM
                            </Badge>
                          </h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            {shipment.status === 'Delayed' 
                              ? `This shipment is delayed by ${shipment.delayDays} days. Weather conditions and port congestion detected. Recommend notifying buyers and exploring expedited customs clearance options.`
                              : `Shipment is on schedule with ${100 - calculateProgress()}% journey remaining. No significant risks detected. ETA confidence: 95%. Continue monitoring for weather updates.`
                            }
                          </p>
                          <Button
                            size="sm"
                            onClick={() => onAskMarbim(`Provide detailed analysis of shipment ${shipment.containerNumber} including delivery predictions, risk assessment, and recommendations for optimal customs clearance.`)}
                            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
                          >
                            <Sparkles className="w-3 h-3 mr-2" />
                            Get Detailed Analysis
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'route' && (
                  <div className="space-y-6">
                    {/* Route Map Placeholder */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#57ACAF]" />
                        Route Visualization
                      </h3>
                      <div className="aspect-video rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-[#EAB308]/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                        <div className="relative z-10 text-center">
                          <Navigation className="w-12 h-12 text-[#57ACAF] mx-auto mb-3" />
                          <p className="text-white mb-1">Interactive Route Map</p>
                          <p className="text-xs text-[#6F83A7]">{shipment.pol} → {shipment.pod}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-6 flex items-center gap-2">
                        <History className="w-5 h-5 text-[#57ACAF]" />
                        Shipment Timeline
                      </h3>
                      
                      <div className="relative space-y-6">
                        {/* Vertical Line */}
                        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#57ACAF] via-[#EAB308] to-[#57ACAF]" />
                        
                        {/* Booking Confirmed */}
                        <div className="relative pl-12">
                          <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">Booking Confirmed</h4>
                              <span className="text-xs text-[#6F83A7]">{shipment.bookingDate || 'Nov 20, 2024'}</span>
                            </div>
                            <p className="text-sm text-[#6F83A7]">Container booking confirmed with carrier</p>
                          </div>
                        </div>

                        {/* Cargo Loaded */}
                        <div className="relative pl-12">
                          <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                            <Package className="w-4 h-4 text-white" />
                          </div>
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">Cargo Loaded</h4>
                              <span className="text-xs text-[#6F83A7]">{shipment.polDate || 'Dec 1, 2024'}</span>
                            </div>
                            <p className="text-sm text-[#6F83A7]">Container loaded at {shipment.pol}</p>
                          </div>
                        </div>

                        {/* Departed POL */}
                        <div className="relative pl-12">
                          <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                            <Ship className="w-4 h-4 text-white" />
                          </div>
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">Departed from POL</h4>
                              <span className="text-xs text-[#6F83A7]">{shipment.departureDate || 'Dec 2, 2024'}</span>
                            </div>
                            <p className="text-sm text-[#6F83A7]">Vessel departed from port • Voyage {shipment.voyage || 'V24352'}</p>
                          </div>
                        </div>

                        {/* In Transit */}
                        <div className="relative pl-12">
                          <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20 animate-pulse">
                            <Navigation className="w-4 h-4 text-white" />
                          </div>
                          <div className="p-4 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">In Transit</h4>
                              <span className="text-xs text-[#EAB308]">Current</span>
                            </div>
                            <p className="text-sm text-[#6F83A7] mb-2">Vessel at sea • {shipment.currentLocation || 'Indian Ocean'}</p>
                            <div className="flex items-center gap-2">
                              <Progress value={calculateProgress()} className="h-1.5 flex-1" />
                              <span className="text-xs text-white">{calculateProgress()}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Expected Arrival */}
                        <div className="relative pl-12">
                          <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                            <Anchor className="w-4 h-4 text-white" />
                          </div>
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10 opacity-60">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">Expected Arrival at POD</h4>
                              <span className="text-xs text-[#6F83A7]">{shipment.eta}</span>
                            </div>
                            <p className="text-sm text-[#6F83A7]">Estimated arrival at {shipment.pod}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Port Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <Anchor className="w-5 h-5 text-[#57ACAF] mb-3" />
                        <p className="text-xs text-[#6F83A7] mb-1">Port of Loading</p>
                        <p className="text-white font-medium mb-2">{shipment.pol}</p>
                        <p className="text-xs text-[#6F83A7]">Departed: {shipment.departureDate || 'Dec 2, 2024'}</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <Anchor className="w-5 h-5 text-[#EAB308] mb-3" />
                        <p className="text-xs text-[#6F83A7] mb-1">Port of Discharge</p>
                        <p className="text-white font-medium mb-2">{shipment.pod}</p>
                        <p className="text-xs text-[#6F83A7]">ETA: {shipment.eta}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    {/* Document List */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-[#57ACAF]" />
                        Shipping Documents
                      </h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Bill of Lading (B/L)', status: 'Available', date: 'Dec 2, 2024', icon: FileText },
                          { name: 'Commercial Invoice', status: 'Available', date: 'Dec 1, 2024', icon: FileText },
                          { name: 'Packing List', status: 'Available', date: 'Dec 1, 2024', icon: FileText },
                          { name: 'Certificate of Origin', status: 'Available', date: 'Nov 30, 2024', icon: FileCheck },
                          { name: 'Insurance Certificate', status: 'Available', date: 'Nov 29, 2024', icon: Shield },
                          { name: 'Customs Declaration', status: 'Pending', date: 'TBD', icon: FileText },
                        ].map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group cursor-pointer">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/10 flex items-center justify-center">
                                <doc.icon className="w-5 h-5 text-[#57ACAF]" />
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-[#6F83A7]">{doc.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${doc.status === 'Available' ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20' : 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20'} text-xs`}>
                                {doc.status}
                              </Badge>
                              {doc.status === 'Available' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => toast.success(`Downloading ${doc.name}`)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customs Status */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#EAB308]" />
                        Customs & Compliance
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <span className="text-sm text-[#6F83A7]">Export Customs Clearance</span>
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Cleared
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <span className="text-sm text-[#6F83A7]">Import Customs Status</span>
                          <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Awaiting Arrival
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <span className="text-sm text-[#6F83A7]">Duty & Tax Payment</span>
                          <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                            Pending
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* AI Document Insights */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-2">MARBIM Document Insights</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            All critical shipping documents are available. Recommend preparing customs clearance documents in advance to expedite port clearance. Estimated duty: $8,700.
                          </p>
                          <Button
                            size="sm"
                            onClick={() => onAskMarbim(`Help me prepare customs clearance documents for ${shipment.containerNumber}. What are the requirements and estimated duties?`)}
                            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
                          >
                            <Sparkles className="w-3 h-3 mr-2" />
                            Customs Guidance
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'updates' && (
                  <div className="space-y-6">
                    {/* Communication History */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#57ACAF]" />
                        Communication History
                      </h3>
                      <div className="space-y-3">
                        {[
                          { type: 'update', message: 'Vessel departed from port on schedule', time: '2 hours ago', icon: Ship },
                          { type: 'alert', message: 'Weather advisory: Moderate seas expected', time: '5 hours ago', icon: AlertTriangle },
                          { type: 'update', message: 'Container loaded successfully', time: '1 day ago', icon: CheckCircle2 },
                          { type: 'message', message: 'Carrier confirmed booking details', time: '3 days ago', icon: Mail },
                        ].map((update, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              update.type === 'alert' ? 'bg-[#EAB308]/20' : 'bg-[#57ACAF]/20'
                            }`}>
                              <update.icon className={`w-4 h-4 ${
                                update.type === 'alert' ? 'text-[#EAB308]' : 'text-[#57ACAF]'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-white text-sm mb-1">{update.message}</p>
                              <p className="text-xs text-[#6F83A7]">{update.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Carrier Contact */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#57ACAF]" />
                        Carrier Contact
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Carrier</label>
                          <p className="text-white text-sm font-medium">{shipment.carrier || 'Maersk Line'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            variant="outline"
                            className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start"
                            onClick={() => toast.info('Opening email client')}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Email Carrier
                          </Button>
                          <Button
                            variant="outline"
                            className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start"
                            onClick={() => toast.info('Calling carrier')}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Support
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Performance Rating */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#EAB308]" />
                        Carrier Performance
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6F83A7]">On-Time Delivery Rate</span>
                            <span className="text-white text-sm font-medium">94%</span>
                          </div>
                          <Progress value={94} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6F83A7]">Service Quality</span>
                            <span className="text-white text-sm font-medium">4.6/5.0</span>
                          </div>
                          <Progress value={92} className="h-1.5" />
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'text-[#EAB308] fill-[#EAB308]' : 'text-[#6F83A7]'}`} />
                          ))}
                          <span className="text-sm text-[#6F83A7] ml-2">Based on 127 shipments</span>
                        </div>
                      </div>
                    </div>

                    {/* Send Message */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                      <h4 className="text-white mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Send Update Request
                      </h4>
                      <Button
                        className="w-full bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70"
                        onClick={() => toast.success('Message sent to carrier')}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Request Status Update
                      </Button>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 p-6 bg-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.success('Downloading shipment report');
                    }}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.info('Opening tracking portal');
                    }}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Track Live
                  </Button>
                </div>
                <Button
                  onClick={() => onAskMarbim(`I need detailed insights about shipment ${shipment.containerNumber}. Analyze delivery timeline, potential delays, customs requirements, and provide optimization recommendations.`)}
                  className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ask MARBIM
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
