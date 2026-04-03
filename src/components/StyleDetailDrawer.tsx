import { useState } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Layers, Grid, TrendingUp, Clock, CheckCircle, AlertTriangle, Activity, Target, Award, Zap, Settings, BarChart3, Users, Calendar } from 'lucide-react';
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

interface Operation {
  id: string;
  name: string;
  sequence: number;
  timeStandard: number; // in minutes
  skillLevel: string;
  machineType: string;
  status: string;
}

interface LineAssignment {
  lineId: string;
  lineName: string;
  assignedDate: string;
  quantity: number;
  completed: number;
  efficiency: number;
  status: string;
}

interface StyleData {
  id: number;
  styleId: string;
  name: string;
  operationCount: number;
  requiredSkills: string;
  assignedLine: string;
  progress: number;
  complexity: string;
  totalQuantity: number;
  completedQuantity: number;
  orderId: string;
  buyer: string;
  dueDate: string;
  status: string;
  operations: Operation[];
  lineAssignments: LineAssignment[];
  qualityMetrics: {
    defectRate: number;
    firstPassYield: number;
    reworkRate: number;
  };
}

interface StyleDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  styleData: StyleData | null;
  onAskMarbim: (prompt: string) => void;
}

export function StyleDetailDrawer({ isOpen, onClose, styleData, onAskMarbim }: StyleDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!styleData) return null;

  // Mock data for charts
  const progressByOperation = [
    { operation: 'Cutting', planned: 100, actual: 100, efficiency: 98 },
    { operation: 'Sewing', planned: 100, actual: 82, efficiency: 92 },
    { operation: 'Finishing', planned: 100, actual: 65, efficiency: 88 },
    { operation: 'Inspection', planned: 100, actual: 65, efficiency: 95 },
    { operation: 'Packing', planned: 100, actual: 58, efficiency: 90 },
  ];

  const dailyOutput = [
    { date: 'Jan 10', target: 250, actual: 235 },
    { date: 'Jan 11', target: 250, actual: 268 },
    { date: 'Jan 12', target: 250, actual: 245 },
    { date: 'Jan 13', target: 250, actual: 272 },
    { date: 'Jan 14', target: 250, actual: 258 },
    { date: 'Jan 15', target: 250, actual: 240 },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'operations', label: 'Operations', icon: Layers },
    { id: 'lines', label: 'Lines', icon: Grid },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'running':
      case 'completed':
        return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      case 'pending':
      case 'scheduled':
        return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'delayed':
      case 'at risk':
        return 'bg-[#D0342C]/10 text-[#D0342C] border-[#D0342C]/20';
      default:
        return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'low':
        return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      case 'medium':
        return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'high':
        return 'bg-[#D0342C]/10 text-[#D0342C] border-[#D0342C]/20';
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
                      <Package className="w-6 h-6 text-white" />
                    </div>

                    {/* Title and meta */}
                    <div>
                      <h2 className="text-white mb-2">{styleData.name}</h2>
                      <div className="flex items-center gap-3 text-sm text-[#6F83A7]">
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-4 h-4" />
                          Order: {styleData.orderId}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          Buyer: {styleData.buyer}
                        </span>
                        <span>•</span>
                        <Badge className={`${getStatusColor(styleData.status)} border`}>
                          {styleData.status}
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
                    <div className="text-xs text-[#6F83A7] mb-1">Progress</div>
                    <div className="text-lg text-white flex items-center gap-2">
                      {styleData.progress}%
                      <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Complexity</div>
                    <div className="text-lg text-white">
                      <Badge className={`${getComplexityColor(styleData.complexity)} border`}>
                        {styleData.complexity}
                      </Badge>
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Operations</div>
                    <div className="text-lg text-white">{styleData.operationCount}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Completed</div>
                    <div className="text-lg text-white">{styleData.completedQuantity}/{styleData.totalQuantity}</div>
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
                          layoutId="activeStyleDrawerTab"
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
                    {/* Style Details */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Package className="w-5 h-5 text-[#57ACAF]" />
                            Style Information
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Production details and requirements</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze style ${styleData.styleId}: ${styleData.operationCount} operations, ${styleData.complexity} complexity, ${styleData.progress}% complete. Identify bottlenecks and optimization opportunities.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Style ID</span>
                            <span className="text-sm text-white">{styleData.styleId}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Order ID</span>
                            <span className="text-sm text-white">{styleData.orderId}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Buyer</span>
                            <span className="text-sm text-white">{styleData.buyer}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Complexity Level</span>
                            <Badge className={`${getComplexityColor(styleData.complexity)} border`}>
                              {styleData.complexity}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Total Quantity</span>
                            <span className="text-sm text-white">{styleData.totalQuantity.toLocaleString()} pcs</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Completed</span>
                            <span className="text-sm text-white">{styleData.completedQuantity.toLocaleString()} pcs</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Due Date</span>
                            <span className="text-sm text-white">{styleData.dueDate}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm text-[#6F83A7]">Operation Count</span>
                            <span className="text-sm text-white">{styleData.operationCount} operations</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skill Requirements */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Award className="w-5 h-5 text-[#57ACAF]" />
                            Required Skills
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Skills needed for production</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze skill requirements for ${styleData.styleId}: ${styleData.requiredSkills}. Compare with available workforce and recommend optimal operator assignments.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {styleData.requiredSkills.split(', ').map((skill, idx) => (
                          <Badge key={idx} className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 px-3 py-1.5">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Production Status */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#57ACAF]" />
                            Production Status
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Current production progress and timeline</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Review production status for ${styleData.styleId}: ${styleData.progress}% complete, ${styleData.completedQuantity}/${styleData.totalQuantity} pieces. Analyze on-time delivery probability.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6F83A7]">Overall Progress</span>
                            <span className="text-sm text-white">{styleData.progress}%</span>
                          </div>
                          <Progress value={styleData.progress} className="h-3 bg-white/5" />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 text-center">
                            <div className="text-xs text-[#6F83A7] mb-1">Assigned Line</div>
                            <div className="text-sm text-white">{styleData.assignedLine}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 text-center">
                            <div className="text-xs text-[#6F83A7] mb-1">Status</div>
                            <div className="text-sm text-white">{styleData.status}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 text-center">
                            <div className="text-xs text-[#6F83A7] mb-1">Days to Due</div>
                            <div className="text-sm text-white">12 days</div>
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
                          <p className="text-sm text-[#6F83A7]">Current quality performance indicators</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze quality metrics for ${styleData.styleId}: ${styleData.qualityMetrics.firstPassYield}% first pass yield, ${styleData.qualityMetrics.defectRate}% defect rate. Recommend quality improvements.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 text-center">
                          <div className="text-xs text-[#6F83A7] mb-2">First Pass Yield</div>
                          <div className="text-3xl text-white mb-1">{styleData.qualityMetrics.firstPassYield}%</div>
                          <div className="text-xs text-[#57ACAF]">Target: 95%</div>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 text-center">
                          <div className="text-xs text-[#6F83A7] mb-2">Defect Rate</div>
                          <div className="text-3xl text-white mb-1">{styleData.qualityMetrics.defectRate}%</div>
                          <div className="text-xs text-[#EAB308]">Target: {'<'}2%</div>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 text-center">
                          <div className="text-xs text-[#6F83A7] mb-2">Rework Rate</div>
                          <div className="text-3xl text-white mb-1">{styleData.qualityMetrics.reworkRate}%</div>
                          <div className="text-xs text-[#57ACAF]">Target: {'<'}3%</div>
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
                          <h3 className="text-white mb-1">AI Style Optimization</h3>
                          <p className="text-sm text-[#6F83A7]">Intelligent recommendations for this style</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-white">
                              Production pace is on track. Maintain current allocation to meet {styleData.dueDate} deadline.
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-[#EAB308] mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-white">
                              Defect rate at {styleData.qualityMetrics.defectRate}% - implement additional quality checkpoints in sewing operations.
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-white">
                              Consider cross-training 2 operators in finishing techniques to improve throughput bottleneck.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Operations Tab */}
                {activeTab === 'operations' && (
                  <div className="space-y-6">
                    {/* Operation Breakdown */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-[#57ACAF]" />
                            Operation Sequence
                          </h3>
                          <p className="text-sm text-[#6F83A7]">{styleData.operations.length} sequential operations</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze operation sequence for ${styleData.styleId}: ${styleData.operations.map(o => `${o.name} (${o.timeStandard}min, ${o.skillLevel})`).join(', ')}. Identify bottlenecks and optimization opportunities.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-3">
                        {styleData.operations.map((operation) => (
                          <div key={operation.id} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-sm text-[#57ACAF]">{operation.sequence}</span>
                                </div>
                                <div>
                                  <div className="text-white mb-1">{operation.name}</div>
                                  <div className="text-xs text-[#6F83A7]">{operation.machineType}</div>
                                </div>
                              </div>
                              <Badge className={`${getStatusColor(operation.status)} border`}>
                                {operation.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div>
                                <div className="text-[#6F83A7] mb-1">Time Standard</div>
                                <div className="text-white">{operation.timeStandard} min</div>
                              </div>
                              <div>
                                <div className="text-[#6F83A7] mb-1">Skill Level</div>
                                <div className="text-white">{operation.skillLevel}</div>
                              </div>
                              <div>
                                <div className="text-[#6F83A7] mb-1">Machine Type</div>
                                <div className="text-white">{operation.machineType}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operation Performance */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                            Progress by Operation
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Completion status and efficiency</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze operation-wise progress for ${styleData.styleId}: identify slowest operations, efficiency gaps, and recommend resource reallocation.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={progressByOperation}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis 
                              dataKey="operation" 
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
                            <Bar dataKey="planned" fill="#6F83A7" radius={[8, 8, 0, 0]} opacity={0.5} name="Planned %" />
                            <Bar dataKey="actual" fill="#57ACAF" radius={[8, 8, 0, 0]} name="Actual %" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Critical Path Analysis */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div>
                          <h3 className="text-white mb-1">AI Critical Path Analysis</h3>
                          <p className="text-sm text-[#6F83A7]">Bottleneck identification and recommendations</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          <strong>Bottleneck:</strong> Sewing operation is 18% behind schedule. Consider adding 2 more operators or running overtime shift.
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          <strong>Efficiency Gap:</strong> Finishing operation efficiency at 88% vs 95% target. Investigate machine calibration and operator training needs.
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          <strong>Risk:</strong> Current pace requires maintaining 95% efficiency through completion to meet deadline. Buffer time minimal.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lines Tab */}
                {activeTab === 'lines' && (
                  <div className="space-y-6">
                    {/* Line Assignments */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Grid className="w-5 h-5 text-[#57ACAF]" />
                            Line Assignment History
                          </h3>
                          <p className="text-sm text-[#6F83A7]">{styleData.lineAssignments.length} line assignments</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Review line assignments for ${styleData.styleId}: ${styleData.lineAssignments.map(l => `${l.lineName} (${Math.round(l.completed/l.quantity*100)}% complete, ${l.efficiency}% eff)`).join(', ')}. Optimize allocation strategy.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-3">
                        {styleData.lineAssignments.map((assignment) => (
                          <div key={assignment.lineId} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="text-white mb-1">{assignment.lineName}</div>
                                <div className="text-sm text-[#6F83A7]">Assigned: {assignment.assignedDate}</div>
                              </div>
                              <Badge className={`${getStatusColor(assignment.status)} border`}>
                                {assignment.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                              <div>
                                <div className="text-[#6F83A7] mb-1">Quantity</div>
                                <div className="text-white">{assignment.quantity.toLocaleString()} pcs</div>
                              </div>
                              <div>
                                <div className="text-[#6F83A7] mb-1">Completed</div>
                                <div className="text-white">{assignment.completed.toLocaleString()} pcs</div>
                              </div>
                              <div>
                                <div className="text-[#6F83A7] mb-1">Efficiency</div>
                                <div className="text-white">{assignment.efficiency}%</div>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-[#6F83A7]">Progress</span>
                                <span className="text-white">{Math.round((assignment.completed / assignment.quantity) * 100)}%</span>
                              </div>
                              <Progress 
                                value={(assignment.completed / assignment.quantity) * 100} 
                                className="h-2 bg-white/5"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Line Performance Comparison */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                            Line Performance Comparison
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Efficiency comparison across assigned lines</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Compare line performance for ${styleData.styleId}: analyze which lines are most efficient for this style complexity and recommend future allocations.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-3">
                        {styleData.lineAssignments.map((assignment, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white">{assignment.lineName}</span>
                              <span className="text-sm text-[#6F83A7]">{assignment.efficiency}% efficiency</span>
                            </div>
                            <Progress value={assignment.efficiency} className="h-2 bg-white/5" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Line Recommendations */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <Grid className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div>
                          <h3 className="text-white mb-1">AI Line Allocation</h3>
                          <p className="text-sm text-[#6F83A7]">Intelligent line assignment recommendations</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          Line 1 consistently performs 8% above average for this style complexity - prioritize for future allocations
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          Consider splitting remaining quantity: 60% to Line 1 (high efficiency), 40% to Line 2 (capacity available)
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          Line 3 operators need skill upgrade in finishing techniques before assigning similar styles
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Tab */}
                {activeTab === 'progress' && (
                  <div className="space-y-6">
                    {/* Daily Output Tracking */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                            Daily Output Trend
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Last 6 days production output</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze daily output trend for ${styleData.styleId}: identify patterns, predict completion date, and recommend pace adjustments.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={dailyOutput}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis 
                              dataKey="date" 
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
                              dataKey="target" 
                              stroke="#EAB308" 
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              dot={false}
                              name="Target"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="actual" 
                              stroke="#57ACAF" 
                              strokeWidth={2}
                              dot={{ fill: '#57ACAF', r: 4 }}
                              name="Actual"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white mb-1 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#57ACAF]" />
                            Production Milestones
                          </h3>
                          <p className="text-sm text-[#6F83A7]">Key milestone tracking</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Review milestone status for ${styleData.styleId}: identify delays, assess impact on delivery date, and recommend corrective actions.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-3">
                        {['Cutting Complete', 'Sewing 50%', 'Sewing Complete', 'Finishing Complete', 'Final Inspection'].map((milestone, idx) => {
                          const status = idx < 2 ? 'Completed' : idx === 2 ? 'In Progress' : 'Pending';
                          const date = idx < 2 ? ['Jan 08', 'Jan 12'][idx] : idx === 2 ? 'Jan 18 (Est.)' : ['Jan 22 (Est.)', 'Jan 25 (Est.)'][idx - 3];
                          return (
                            <div key={milestone} className="p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {status === 'Completed' ? (
                                    <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                                  ) : status === 'In Progress' ? (
                                    <Activity className="w-5 h-5 text-[#EAB308]" />
                                  ) : (
                                    <Clock className="w-5 h-5 text-[#6F83A7]" />
                                  )}
                                  <div>
                                    <div className="text-white mb-1">{milestone}</div>
                                    <div className="text-sm text-[#6F83A7]">{date}</div>
                                  </div>
                                </div>
                                <Badge className={`${getStatusColor(status)} border`}>
                                  {status}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Completion Forecast */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div>
                          <h3 className="text-white mb-1">AI Completion Forecast</h3>
                          <p className="text-sm text-[#6F83A7]">Predictive delivery analysis</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6F83A7]">Projected Completion</span>
                            <span className="text-sm text-white">Jan 26, 2024</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#6F83A7]">Due Date</span>
                            <span className="text-sm text-white">{styleData.dueDate}</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          <strong>Confidence: 87%</strong> - Based on current pace, 87% probability of on-time delivery. Maintain current efficiency and operator allocation.
                        </div>

                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
                          <strong>Risk Factor:</strong> Any efficiency drop below 85% or unplanned downtime exceeding 4 hours will impact delivery date.
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
