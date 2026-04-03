import { useState } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Wrench, Calendar, Clock, DollarSign, User, MapPin, AlertTriangle,
  CheckCircle2, FileText, Package, TrendingUp, Activity, Sparkles,
  Download, Edit, MessageSquare, ChevronRight, Settings, Shield,
  Target, BarChart3, Zap, Users
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface RepairDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  repair: any;
  onAskMarbim: (message: string) => void;
}

export function RepairDetailDrawer({ isOpen, onClose, repair, onAskMarbim }: RepairDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!repair) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: 'text-red-500' };
      case 'High':
        return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: 'text-orange-500' };
      case 'Medium':
        return { bg: 'bg-[#EAB308]/10', text: 'text-[#EAB308]', border: 'border-[#EAB308]/20', icon: 'text-[#EAB308]' };
      case 'Low':
        return { bg: 'bg-[#57ACAF]/10', text: 'text-[#57ACAF]', border: 'border-[#57ACAF]/20', icon: 'text-[#57ACAF]' };
      default:
        return { bg: 'bg-white/10', text: 'text-white', border: 'border-white/20', icon: 'text-white' };
    }
  };

  const severityColors = getSeverityColor(repair.severity);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'analysis', label: 'Root Cause', icon: Target },
    { id: 'actions', label: 'Actions', icon: CheckCircle2 }
  ];

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
                      <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-white text-xl">{repair.ticketNo}</h2>
                        <Badge className={`${severityColors.bg} ${severityColors.text} border ${severityColors.border}`}>
                          {repair.severity}
                        </Badge>
                        <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {repair.status}
                        </Badge>
                      </div>
                      <p className="text-[#6F83A7] text-sm mb-4">{repair.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Settings className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-white">{repair.machineId}</span>
                          <span className="text-[#6F83A7]">• {repair.machineType}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-white">{repair.location}</span>
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
                    <p className="text-xs text-[#6F83A7] mb-1">Downtime</p>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#EAB308]" />
                      <p className="text-white">{repair.downtime}</p>
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Repair Cost</p>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#6F83A7]" />
                      <p className="text-white">${repair.repairCost}</p>
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Technician</p>
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#57ACAF]" />
                      <p className="text-white text-sm">{repair.technician}</p>
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Issue Type</p>
                    <p className="text-white text-sm">{repair.issueType}</p>
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
                          layoutId="activeRepairTabIndicator"
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
                    {/* Issue Details Card */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className={`w-5 h-5 ${severityColors.icon}`} />
                        Issue Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Description</label>
                          <p className="text-white text-sm">{repair.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-[#6F83A7] mb-1 block">Reported Date</label>
                            <p className="text-white text-sm">{repair.reportedDate}</p>
                          </div>
                          <div>
                            <label className="text-xs text-[#6F83A7] mb-1 block">Reported By</label>
                            <p className="text-white text-sm">{repair.reportedBy}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Machine Information */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-[#57ACAF]" />
                        Machine Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Machine ID</label>
                          <p className="text-white text-sm font-medium">{repair.machineId}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Machine Type</label>
                          <p className="text-white text-sm">{repair.machineType}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Location</label>
                          <p className="text-white text-sm">{repair.location}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-1 block">Issue Type</label>
                          <Badge className="bg-white/5 text-white border border-white/10 text-xs">
                            {repair.issueType}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Parts Replaced */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#EAB308]" />
                        Parts Replaced
                      </h3>
                      <div className="space-y-2">
                        {repair.partsReplaced.split(', ').map((part: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                            <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                            <span className="text-white text-sm">{part}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#6F83A7]" />
                        Cost Analysis
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <span className="text-[#6F83A7] text-sm">Parts Cost</span>
                          <span className="text-white font-medium">${Math.round(repair.repairCost * 0.6)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <span className="text-[#6F83A7] text-sm">Labor Cost</span>
                          <span className="text-white font-medium">${Math.round(repair.repairCost * 0.3)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <span className="text-[#6F83A7] text-sm">Other Expenses</span>
                          <span className="text-white font-medium">${Math.round(repair.repairCost * 0.1)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                          <span className="text-white font-medium">Total Repair Cost</span>
                          <span className="text-[#57ACAF] font-medium text-lg">${repair.repairCost}</span>
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
                            AI Repair Analysis
                            <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                              MARBIM
                            </Badge>
                          </h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            This {repair.severity.toLowerCase()}-severity {repair.issueType.toLowerCase()} required {repair.downtime} of downtime. 
                            The repair cost of ${repair.repairCost} is {repair.repairCost > 1000 ? 'above' : 'within'} average for this machine type. 
                            {repair.severity === 'Critical' && ' Immediate preventive measures are recommended to avoid similar failures.'}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => onAskMarbim(`Provide detailed analysis of repair ${repair.ticketNo} including cost optimization opportunities, preventive maintenance recommendations, and risk assessment.`)}
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

                {activeTab === 'timeline' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#57ACAF]" />
                        Repair Timeline
                      </h3>
                      
                      {/* Timeline */}
                      <div className="relative space-y-6">
                        {/* Vertical Line */}
                        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#57ACAF] via-[#EAB308] to-[#57ACAF]" />
                        
                        {/* Issue Reported */}
                        <div className="relative pl-12">
                          <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-500/60 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <AlertTriangle className="w-4 h-4 text-white" />
                          </div>
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">Issue Reported</h4>
                              <span className="text-xs text-[#6F83A7]">{repair.reportedDate}</span>
                            </div>
                            <p className="text-sm text-[#6F83A7] mb-2">{repair.description}</p>
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-[#6F83A7]" />
                              <span className="text-xs text-[#6F83A7]">Reported by {repair.reportedBy}</span>
                            </div>
                          </div>
                        </div>

                        {/* Repair Started */}
                        <div className="relative pl-12">
                          <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                            <Wrench className="w-4 h-4 text-white" />
                          </div>
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">Repair Started</h4>
                              <span className="text-xs text-[#6F83A7]">{repair.repairStarted}</span>
                            </div>
                            <p className="text-sm text-[#6F83A7] mb-2">Technician assigned and repair work initiated</p>
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-[#6F83A7]" />
                              <span className="text-xs text-[#6F83A7]">Assigned to {repair.technician}</span>
                            </div>
                          </div>
                        </div>

                        {/* Diagnosis & Parts */}
                        <div className="relative pl-12">
                          <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#6F83A7] to-[#6F83A7]/60 flex items-center justify-center shadow-lg shadow-[#6F83A7]/20">
                            <Package className="w-4 h-4 text-white" />
                          </div>
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">Parts Replaced</h4>
                              <span className="text-xs text-[#6F83A7]">{repair.repairStarted}</span>
                            </div>
                            <p className="text-sm text-[#6F83A7] mb-2">Required components identified and replaced</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {repair.partsReplaced.split(', ').map((part: string, index: number) => (
                                <Badge key={index} className="bg-white/5 text-white border border-white/10 text-xs">
                                  {part}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Repair Completed */}
                        <div className="relative pl-12">
                          <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <div className="p-4 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">Repair Completed</h4>
                              <span className="text-xs text-[#57ACAF]">{repair.repairCompleted}</span>
                            </div>
                            <p className="text-sm text-[#6F83A7] mb-2">Machine tested and returned to operation</p>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div className="p-2 rounded bg-white/5">
                                <p className="text-xs text-[#6F83A7]">Total Downtime</p>
                                <p className="text-white font-medium">{repair.downtime}</p>
                              </div>
                              <div className="p-2 rounded bg-white/5">
                                <p className="text-xs text-[#6F83A7]">Total Cost</p>
                                <p className="text-white font-medium">${repair.repairCost}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <Clock className="w-5 h-5 text-[#EAB308] mb-3" />
                        <p className="text-2xl text-white mb-1">{repair.downtime}</p>
                        <p className="text-xs text-[#6F83A7]">Total Downtime</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <Zap className="w-5 h-5 text-[#57ACAF] mb-3" />
                        <p className="text-2xl text-white mb-1">
                          {Math.round((new Date(repair.repairCompleted).getTime() - new Date(repair.repairStarted).getTime()) / (1000 * 60 * 60))}h
                        </p>
                        <p className="text-xs text-[#6F83A7]">Repair Duration</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <TrendingUp className="w-5 h-5 text-[#6F83A7] mb-3" />
                        <p className="text-2xl text-white mb-1">
                          {Math.round((new Date(repair.repairStarted).getTime() - new Date(repair.reportedDate).getTime()) / (1000 * 60 * 60))}h
                        </p>
                        <p className="text-xs text-[#6F83A7]">Response Time</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'analysis' && (
                  <div className="space-y-6">
                    {/* Root Cause */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#EAB308]" />
                        Root Cause Analysis
                      </h3>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
                        <label className="text-xs text-[#6F83A7] mb-2 block">Identified Root Cause</label>
                        <p className="text-white">{repair.rootCause}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-2 block">Issue Category</label>
                          <Badge className={`${severityColors.bg} ${severityColors.text} border ${severityColors.border}`}>
                            {repair.issueType}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-xs text-[#6F83A7] mb-2 block">Severity Level</label>
                          <Badge className={`${severityColors.bg} ${severityColors.text} border ${severityColors.border}`}>
                            {repair.severity}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Contributing Factors */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                        Contributing Factors
                      </h3>
                      <div className="space-y-3">
                        {repair.issueType === 'Mechanical Failure' && (
                          <>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Wear and Tear</span>
                                <span className="text-[#EAB308] text-sm">High</span>
                              </div>
                              <Progress value={85} className="h-1.5" />
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Maintenance Schedule</span>
                                <span className="text-[#57ACAF] text-sm">Medium</span>
                              </div>
                              <Progress value={60} className="h-1.5" />
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Operating Conditions</span>
                                <span className="text-[#6F83A7] text-sm">Low</span>
                              </div>
                              <Progress value={35} className="h-1.5" />
                            </div>
                          </>
                        )}
                        {repair.issueType === 'Electrical Failure' && (
                          <>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Power Quality</span>
                                <span className="text-[#EAB308] text-sm">High</span>
                              </div>
                              <Progress value={90} className="h-1.5" />
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Component Age</span>
                                <span className="text-[#57ACAF] text-sm">Medium</span>
                              </div>
                              <Progress value={55} className="h-1.5" />
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Environmental Factors</span>
                                <span className="text-[#6F83A7] text-sm">Low</span>
                              </div>
                              <Progress value={30} className="h-1.5" />
                            </div>
                          </>
                        )}
                        {(repair.issueType === 'Performance Issue' || repair.issueType === 'Thread Management') && (
                          <>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Calibration Drift</span>
                                <span className="text-[#EAB308] text-sm">High</span>
                              </div>
                              <Progress value={75} className="h-1.5" />
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Maintenance Frequency</span>
                                <span className="text-[#57ACAF] text-sm">Medium</span>
                              </div>
                              <Progress value={50} className="h-1.5" />
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Operator Training</span>
                                <span className="text-[#6F83A7] text-sm">Low</span>
                              </div>
                              <Progress value={25} className="h-1.5" />
                            </div>
                          </>
                        )}
                        {repair.issueType === 'Safety Issue' && (
                          <>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Component Wear</span>
                                <span className="text-red-400 text-sm">Critical</span>
                              </div>
                              <Progress value={95} className="h-1.5" />
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Safety Inspection Gaps</span>
                                <span className="text-[#EAB308] text-sm">High</span>
                              </div>
                              <Progress value={70} className="h-1.5" />
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm">Usage Intensity</span>
                                <span className="text-[#57ACAF] text-sm">Medium</span>
                              </div>
                              <Progress value={45} className="h-1.5" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* AI Root Cause Analysis */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-2">MARBIM Root Cause Insights</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            Analysis of similar failures in the past 90 days shows a pattern. 
                            {repair.severity === 'Critical' && ' Critical attention required to prevent recurrence.'}
                            {repair.issueType === 'Mechanical Failure' && ' Mechanical stress indicators exceeded thresholds.'}
                            {repair.issueType === 'Electrical Failure' && ' Power quality monitoring recommended.'}
                            {' '}Implementing the preventive action below can reduce similar failures by up to 68%.
                          </p>
                          <Button
                            size="sm"
                            onClick={() => onAskMarbim(`Perform deep root cause analysis for ${repair.ticketNo}. Analyze historical patterns, identify preventive opportunities, and recommend process improvements.`)}
                            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
                          >
                            <Sparkles className="w-3 h-3 mr-2" />
                            Deep Analysis
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'actions' && (
                  <div className="space-y-6">
                    {/* Preventive Action Taken */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#57ACAF]" />
                        Preventive Action Taken
                      </h3>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white mb-3">{repair.preventiveAction}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Implemented
                          </Badge>
                          <span className="text-xs text-[#6F83A7]">Effective from {repair.repairCompleted}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommended Follow-up Actions */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#EAB308]" />
                        Recommended Follow-up Actions
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <CheckCircle2 className="w-5 h-5 text-[#57ACAF] mt-0.5" />
                          <div className="flex-1">
                            <p className="text-white text-sm mb-1">Schedule preventive maintenance check</p>
                            <p className="text-xs text-[#6F83A7]">Within 7 days</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <CheckCircle2 className="w-5 h-5 text-[#57ACAF] mt-0.5" />
                          <div className="flex-1">
                            <p className="text-white text-sm mb-1">Monitor machine performance metrics</p>
                            <p className="text-xs text-[#6F83A7]">Daily for 2 weeks</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <CheckCircle2 className="w-5 h-5 text-[#57ACAF] mt-0.5" />
                          <div className="flex-1">
                            <p className="text-white text-sm mb-1">Update maintenance schedule based on findings</p>
                            <p className="text-xs text-[#6F83A7]">Before next cycle</p>
                          </div>
                        </div>
                        {repair.severity === 'Critical' && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-white text-sm mb-1">Conduct safety audit for similar machines</p>
                              <p className="text-xs text-red-400">Urgent - Within 24 hours</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Knowledge Base Update */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#6F83A7]" />
                        Knowledge Base Update
                      </h3>
                      <p className="text-sm text-[#6F83A7] mb-4">
                        This repair has been documented in the maintenance knowledge base for future reference and training.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                          onClick={() => toast.info('Viewing repair documentation')}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Documentation
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                          onClick={() => toast.info('Creating training material')}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Create Training
                        </Button>
                      </div>
                    </div>

                    {/* Impact Assessment */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <Clock className="w-5 h-5 text-[#EAB308] mb-3" />
                        <p className="text-xs text-[#6F83A7] mb-1">Production Impact</p>
                        <p className="text-white font-medium">{repair.downtime} lost</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <DollarSign className="w-5 h-5 text-[#6F83A7] mb-3" />
                        <p className="text-xs text-[#6F83A7] mb-1">Financial Impact</p>
                        <p className="text-white font-medium">${repair.repairCost}</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <TrendingUp className="w-5 h-5 text-[#57ACAF] mb-3" />
                        <p className="text-xs text-[#6F83A7] mb-1">Prevention Success</p>
                        <p className="text-white font-medium">68% likely</p>
                      </div>
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
                      toast.success('Downloading repair report');
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
                      toast.info('Opening repair editor');
                    }}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                </div>
                <Button
                  onClick={() => onAskMarbim(`I need detailed insights about repair ${repair.ticketNo}. Analyze the root cause, cost optimization opportunities, and provide recommendations to prevent similar failures.`)}
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