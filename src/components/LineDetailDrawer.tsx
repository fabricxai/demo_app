import { useState } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { X, Grid, Users, TrendingUp, Calendar, CheckCircle, AlertTriangle, Activity, Target, Clock, Award, Zap, Settings, BarChart3, Wrench, PlayCircle, PauseCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { MarbimAIButton } from './MarbimAIButton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

interface Operator {
  id: string;
  name: string;
  role: string;
  efficiency: number;
  attendance: string;
  skills: string[];
  experience: string;
}

interface CurrentOrder {
  orderId: string;
  style: string;
  quantity: number;
  completed: number;
  dueDate: string;
  status: string;
}

interface LineData {
  id: string;
  name: string;
  efficiency: number;
  load: number;
  operators: number;
  skillMatch: number;
  wip: number;
  status: string;
  capacity: number;
  currentOrders: CurrentOrder[];
  operatorList: Operator[];
  supervisor: string;
  shift: string;
  location: string;
  machineCount: number;
  maintenanceStatus: string;
}

interface LineDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lineData: LineData | null;
  onAskMarbim: (prompt: string) => void;
}

export function LineDetailDrawer({ isOpen, onClose, lineData, onAskMarbim }: LineDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!lineData) return null;

  // Mock performance data
  const performanceData = [
    { time: '08:00', efficiency: 78, target: 85, output: 45 },
    { time: '09:00', efficiency: 82, target: 85, output: 52 },
    { time: '10:00', efficiency: 88, target: 85, output: 58 },
    { time: '11:00', efficiency: 85, target: 85, output: 55 },
    { time: '12:00', efficiency: 80, target: 85, output: 48 },
    { time: '13:00', efficiency: 83, target: 85, output: 51 },
    { time: '14:00', efficiency: 87, target: 85, output: 56 },
    { time: '15:00', efficiency: 89, target: 85, output: 59 },
  ];

  const downtimeData = [
    { reason: 'Machine Breakdown', minutes: 45, percentage: 35 },
    { reason: 'Material Shortage', minutes: 32, percentage: 25 },
    { reason: 'Quality Issues', minutes: 28, percentage: 22 },
    { reason: 'Setup/Changeover', minutes: 23, percentage: 18 },
  ];

  const weeklyEfficiency = [
    { day: 'Mon', efficiency: 84, target: 85 },
    { day: 'Tue', efficiency: 87, target: 85 },
    { day: 'Wed', efficiency: 82, target: 85 },
    { day: 'Thu', efficiency: 88, target: 85 },
    { day: 'Fri', efficiency: 85, target: 85 },
    { day: 'Sat', efficiency: 83, target: 85 },
  ];

  const scheduleData = [
    { orderId: 'PO-2024-0156', style: 'MNS-POLO-BL-M', startDate: '2024-01-15', endDate: '2024-01-18', progress: 65, status: 'In Progress' },
    { orderId: 'PO-2024-0162', style: 'WMN-BLOUSE-WH-S', startDate: '2024-01-18', endDate: '2024-01-22', progress: 0, status: 'Scheduled' },
    { orderId: 'PO-2024-0148', style: 'KID-SHIRT-RD-L', startDate: '2024-01-12', endDate: '2024-01-15', progress: 100, status: 'Completed' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Grid },
    { id: 'operators', label: 'Operators', icon: Users },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'running':
      case 'completed':
        return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      case 'idle':
      case 'scheduled':
        return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'maintenance':
      case 'in progress':
        return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
      default:
        return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
    }
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
              {/* Background pattern */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative px-8 py-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 shadow-lg shadow-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                      <Grid className="w-6 h-6 text-white" />
                    </div>

                    {/* Title and meta */}
                    <div>
                      <h2 className="text-white mb-2">{lineData.name}</h2>
                      <div className="flex items-center gap-3 text-sm text-[#6F83A7]">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          Supervisor: {lineData.supervisor}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {lineData.shift}
                        </span>
                        <span>•</span>
                        <Badge className={`${getStatusColor(lineData.status)} border`}>
                          {lineData.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Close button */}
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="text-[#6F83A7] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Efficiency</div>
                    <div className="text-lg text-white flex items-center gap-2">
                      {lineData.efficiency}%
                      {lineData.efficiency >= 85 ? (
                        <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#EAB308]" />
                      )}
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Line Load</div>
                    <div className="text-lg text-white">{lineData.load}%</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Operators</div>
                    <div className="text-lg text-white">{lineData.operators}/{lineData.capacity}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">WIP</div>
                    <div className="text-lg text-white">{lineData.wip} pcs</div>
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
                      
                      {/* Animated underline */}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeLineDrawerTab"
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
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Line Configuration */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-[#57ACAF]" />
                            Line Configuration
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Current line setup and capacity details</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze ${lineData.name} configuration: ${lineData.operators} operators, ${lineData.machineCount} machines, ${lineData.capacity} capacity, ${lineData.efficiency}% efficiency. Suggest optimal configuration.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Location</span>
                            <span className="text-sm text-white">{lineData.location}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Machine Count</span>
                            <span className="text-sm text-white">{lineData.machineCount} units</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Daily Capacity</span>
                            <span className="text-sm text-white">{lineData.capacity * 8} pcs/day</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Current Shift</span>
                            <span className="text-sm text-white">{lineData.shift}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Maintenance Status</span>
                            <Badge className={`${getStatusColor(lineData.maintenanceStatus)} border`}>
                              {lineData.maintenanceStatus}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Skill Match</span>
                            <span className="text-sm text-white">{lineData.skillMatch}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Orders */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#57ACAF]" />
                            Current Orders
                          </h3>
                          <p className="text-sm text-[#6F83A7]">{lineData.currentOrders.length} active production orders</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Review current orders on ${lineData.name}: ${lineData.currentOrders.map(o => `${o.orderId} (${o.quantity} units, ${Math.round(o.completed/o.quantity*100)}% complete)`).join(', ')}. Identify bottlenecks and recommend prioritization.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-3">
                        {lineData.currentOrders.map((order) => (
                          <div key={order.orderId} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="text-white mb-1">{order.orderId}</div>
                                <div className="text-sm text-[#6F83A7]">{order.style}</div>
                              </div>
                              <Badge className={`${getStatusColor(order.status)} border`}>
                                {order.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                              <div>
                                <div className="text-[#6F83A7] mb-1">Quantity</div>
                                <div className="text-white">{order.quantity} pcs</div>
                              </div>
                              <div>
                                <div className="text-[#6F83A7] mb-1">Completed</div>
                                <div className="text-white">{order.completed} pcs</div>
                              </div>
                              <div>
                                <div className="text-[#6F83A7] mb-1">Due Date</div>
                                <div className="text-white">{order.dueDate}</div>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-[#6F83A7]">Progress</span>
                                <span className="text-white">{Math.round((order.completed / order.quantity) * 100)}%</span>
                              </div>
                              <Progress 
                                value={(order.completed / order.quantity) * 100} 
                                className="h-2 bg-white/5"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Capacity Utilization */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Target className="w-5 h-5 text-[#57ACAF]" />
                            Capacity Utilization
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Current vs target capacity analysis</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze ${lineData.name} capacity utilization: ${lineData.load}% loaded, ${lineData.operators}/${lineData.capacity} operators. Recommend optimization strategies for better capacity utilization.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div>
                              <div className="text-xs text-[#6F83A7]">Current Load</div>
                              <div className="text-2xl text-white">{lineData.load}%</div>
                            </div>
                          </div>
                          <Progress value={lineData.load} className="h-2 bg-white/10" />
                        </div>

                        <div className="p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                              <Target className="w-5 h-5 text-[#EAB308]" />
                            </div>
                            <div>
                              <div className="text-xs text-[#6F83A7]">Target Load</div>
                              <div className="text-2xl text-white">85%</div>
                            </div>
                          </div>
                          <Progress value={85} className="h-2 bg-white/10" />
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-1">AI Line Optimization</h3>
                          <p className="text-sm text-[#6F83A7]">Intelligent recommendations for this production line</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-white">
                              Line efficiency is above target. Consider increasing load by 10% to optimize capacity utilization.
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-[#EAB308] mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-white">
                              Skill match at {lineData.skillMatch}% - recommend operator training in advanced sewing techniques.
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-white">
                              Schedule preventive maintenance during next off-shift to maintain optimal performance.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Operators Tab */}
                {activeTab === 'operators' && (
                  <div className="space-y-6">
                    {/* Operator Overview */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#57ACAF]" />
                            Operator Assignment
                          </h3>
                          <p className="text-sm text-[#6F83A7]">{lineData.operators} operators currently assigned</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze operator assignments on ${lineData.name}: ${lineData.operatorList.map(o => `${o.name} (${o.role}, ${o.efficiency}% efficiency, ${o.experience} exp)`).join(', ')}. Recommend optimal team composition.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-3">
                        {lineData.operatorList.map((operator) => (
                          <div key={operator.id} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="text-white mb-1">{operator.name}</div>
                                <div className="text-sm text-[#6F83A7]">{operator.role}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${operator.attendance === 'Present' ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20' : 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20'} border`}>
                                  {operator.attendance}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <div className="text-xs text-[#6F83A7] mb-1">Efficiency</div>
                                <div className="flex items-center gap-2">
                                  <Progress value={operator.efficiency} className="flex-1 h-2 bg-white/5" />
                                  <span className="text-sm text-white">{operator.efficiency}%</span>
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-[#6F83A7] mb-1">Experience</div>
                                <div className="text-sm text-white">{operator.experience}</div>
                              </div>
                            </div>

                            <div>
                              <div className="text-xs text-[#6F83A7] mb-2">Skills</div>
                              <div className="flex flex-wrap gap-2">
                                {operator.skills.map((skill, idx) => (
                                  <Badge key={idx} className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skill Matrix */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Award className="w-5 h-5 text-[#57ACAF]" />
                            Team Skill Matrix
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Overall skill coverage and gaps analysis</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze skill matrix for ${lineData.name}: identify skill gaps, training needs, and cross-training opportunities to improve overall skill match (currently ${lineData.skillMatch}%).`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-3">
                        {['Sewing', 'Finishing', 'Quality Check', 'Machine Setup', 'Pattern Making'].map((skill, idx) => {
                          const coverage = [95, 88, 92, 78, 65][idx];
                          return (
                            <div key={skill} className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white">{skill}</span>
                                <span className="text-sm text-[#6F83A7]">{coverage}% coverage</span>
                              </div>
                              <Progress value={coverage} className="h-2 bg-white/5" />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Training Recommendations */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div>
                          <h3 className="text-white mb-1">AI Training Recommendations</h3>
                          <p className="text-sm text-[#6F83A7]">Suggested training programs to improve team performance</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          Priority: Pattern Making training for 3 operators to increase skill coverage from 65% to 85%
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          Cross-train finishers in quality inspection to improve flexibility and reduce bottlenecks
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          Advanced machine setup workshop for operators to reduce changeover time by 25%
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    {/* Real-time Performance */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                            Today's Performance
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Hourly efficiency and output tracking</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze today's performance trend for ${lineData.name}: hourly efficiency data shows variations. Identify root causes of dips and recommend corrective actions.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis 
                              dataKey="time" 
                              stroke="#6F83A7"
                              style={{ fontSize: '12px' }}
                            />
                            <YAxis 
                              stroke="#6F83A7"
                              style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#1a2332',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="efficiency" 
                              stroke="#57ACAF" 
                              strokeWidth={2}
                              dot={{ fill: '#57ACAF', r: 4 }}
                              name="Efficiency %"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="target" 
                              stroke="#EAB308" 
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              dot={false}
                              name="Target %"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Weekly Trend */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                            Weekly Efficiency Trend
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Last 6 days performance comparison</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze weekly efficiency trend for ${lineData.name}: identify patterns, day-of-week effects, and recommend strategies to maintain consistent high performance.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={weeklyEfficiency}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis 
                              dataKey="day" 
                              stroke="#6F83A7"
                              style={{ fontSize: '12px' }}
                            />
                            <YAxis 
                              stroke="#6F83A7"
                              style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#1a2332',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff'
                              }}
                            />
                            <Bar dataKey="efficiency" fill="#57ACAF" radius={[8, 8, 0, 0]} name="Actual %" />
                            <Bar dataKey="target" fill="#EAB308" radius={[8, 8, 0, 0]} opacity={0.5} name="Target %" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Downtime Analysis */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-[#EAB308]" />
                            Downtime Analysis
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Today's production losses by category</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze downtime breakdown for ${lineData.name}: ${downtimeData.map(d => `${d.reason} (${d.minutes}min)`).join(', ')}. Recommend targeted interventions to reduce each category.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-3">
                        {downtimeData.map((item) => (
                          <div key={item.reason} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white">{item.reason}</span>
                              <span className="text-sm text-[#6F83A7]">{item.minutes} min</span>
                            </div>
                            <Progress value={item.percentage} className="h-2 bg-white/5" />
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-[#EAB308]" />
                          <div className="text-sm text-white">
                            Total downtime today: <span className="font-medium">{downtimeData.reduce((acc, item) => acc + item.minutes, 0)} minutes</span> - Potential output loss: ~65 pieces
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quality Metrics */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                            Quality Metrics
                          </h3>
                          <p className="text-sm text-[#6F83A7]">First pass yield and defect rates</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze quality metrics for ${lineData.name}: correlate quality data with efficiency, identify defect patterns, and recommend quality improvement initiatives.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 text-center">
                          <div className="text-xs text-[#6F83A7] mb-2">First Pass Yield</div>
                          <div className="text-3xl text-white mb-1">96.5%</div>
                          <div className="text-xs text-[#57ACAF]">+2.3% vs avg</div>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 text-center">
                          <div className="text-xs text-[#6F83A7] mb-2">Defect Rate</div>
                          <div className="text-3xl text-white mb-1">3.5%</div>
                          <div className="text-xs text-[#EAB308]">-1.1% vs avg</div>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 text-center">
                          <div className="text-xs text-[#6F83A7] mb-2">Rework Rate</div>
                          <div className="text-3xl text-white mb-1">2.8%</div>
                          <div className="text-xs text-[#57ACAF]">-0.5% vs avg</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                  <div className="space-y-6">
                    {/* Production Schedule */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#57ACAF]" />
                            Production Schedule
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Upcoming orders and timeline</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Review production schedule for ${lineData.name}: ${scheduleData.map(s => `${s.orderId} (${s.startDate} to ${s.endDate}, ${s.progress}% complete)`).join(', ')}. Optimize sequencing and identify capacity gaps.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-3">
                        {scheduleData.map((schedule) => (
                          <div key={schedule.orderId} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="text-white mb-1">{schedule.orderId}</div>
                                <div className="text-sm text-[#6F83A7]">{schedule.style}</div>
                              </div>
                              <Badge className={`${getStatusColor(schedule.status)} border`}>
                                {schedule.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                              <div>
                                <div className="text-[#6F83A7] mb-1">Start Date</div>
                                <div className="text-white">{schedule.startDate}</div>
                              </div>
                              <div>
                                <div className="text-[#6F83A7] mb-1">End Date</div>
                                <div className="text-white">{schedule.endDate}</div>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-[#6F83A7]">Progress</span>
                                <span className="text-white">{schedule.progress}%</span>
                              </div>
                              <Progress value={schedule.progress} className="h-2 bg-white/5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Maintenance Schedule */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Wrench className="w-5 h-5 text-[#57ACAF]" />
                            Maintenance Schedule
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Upcoming preventive maintenance windows</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Review maintenance schedule for ${lineData.name}: current status is ${lineData.maintenanceStatus}. Recommend optimal maintenance timing to minimize production impact.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-white mb-1">Machine Line Calibration</div>
                              <div className="text-sm text-[#6F83A7]">Scheduled: Jan 20, 2024 - 6:00 PM</div>
                            </div>
                            <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                              Upcoming
                            </Badge>
                          </div>
                          <div className="text-sm text-[#6F83A7]">Duration: 2 hours | Impact: Minimal</div>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-white mb-1">Electrical System Check</div>
                              <div className="text-sm text-[#6F83A7]">Scheduled: Jan 27, 2024 - 7:00 AM</div>
                            </div>
                            <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20">
                              Planned
                            </Badge>
                          </div>
                          <div className="text-sm text-[#6F83A7]">Duration: 1 hour | Impact: None (Pre-shift)</div>
                        </div>
                      </div>
                    </div>

                    {/* Shift Planning */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#57ACAF]" />
                            Shift Planning
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Weekly shift allocation and coverage</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Optimize shift planning for ${lineData.name}: current shift is ${lineData.shift}. Analyze operator availability, order deadlines, and recommend optimal shift allocation for next week.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-3">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
                          <div key={day} className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white">{day}</span>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                                  Morning: {25 + (idx % 3)} ops
                                </Badge>
                                <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                                  Evening: {18 + (idx % 4)} ops
                                </Badge>
                              </div>
                            </div>
                            <div className="text-xs text-[#6F83A7]">Coverage: 95% | Capacity: {85 + (idx % 5)}%</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Schedule Optimization */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div>
                          <h3 className="text-white mb-1">AI Schedule Optimization</h3>
                          <p className="text-sm text-[#6F83A7]">Intelligent scheduling recommendations</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          Recommend shifting PO-2024-0162 start date to Jan 19 to allow 1-day buffer after current order completion
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          Schedule preventive maintenance on Jan 21 during low-volume period to minimize impact
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          Increase Saturday shift staffing by 3 operators to meet upcoming deadline for PO-2024-0162
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
