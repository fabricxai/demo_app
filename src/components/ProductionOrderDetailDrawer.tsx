import { useState } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion } from 'motion/react';
import { 
  X, Calendar, Clock, Package, Users, TrendingUp, AlertTriangle,
  Activity, Layers, Target, CheckCircle, Factory, Zap, FileText,
  Settings, BarChart3, Download, Sparkles, Edit
} from 'lucide-react';
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
  LineChart as RechartsLine,
  Line,
} from 'recharts';

interface ProductionOrderDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
  onAskMarbim?: (prompt: string) => void;
}

export function ProductionOrderDetailDrawer({ 
  isOpen, 
  onClose, 
  orderData,
  onAskMarbim = () => {}
}: ProductionOrderDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !orderData) return null;

  // Mock data for visualization
  const wipByStageData = [
    { stage: 'Cutting', units: 120, target: 150 },
    { stage: 'Sewing', units: 185, target: 200 },
    { stage: 'Washing', units: 45, target: 100 },
    { stage: 'Finishing', units: 68, target: 100 },
    { stage: 'Packing', units: 34, target: 80 },
  ];

  const progressTimelineData = [
    { week: 'W1', planned: 20, actual: 18 },
    { week: 'W2', planned: 40, actual: 42 },
    { week: 'W3', planned: 60, actual: 58 },
    { week: 'W4', planned: 80, actual: 65 },
  ];

  const qualityMetricsData = [
    { checkpoint: 'Cutting', passed: 98, failed: 2 },
    { checkpoint: 'Sewing', passed: 95, failed: 5 },
    { checkpoint: 'Finishing', passed: 97, failed: 3 },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'production', label: 'Production Status', icon: Factory },
    { id: 'quality', label: 'Quality & Timeline', icon: CheckCircle },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className={fabricRightDrawerClass('max-w-[1000px]')}
    >
      {/* Header */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div className="relative p-8">
          {/* Title Row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20 flex-shrink-0">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-white text-2xl">{orderData.orderId}</h2>
                  <Badge className={
                    orderData.status === 'In Progress' 
                      ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20'
                      : orderData.status === 'Completed'
                      ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                      : 'bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20'
                  }>
                    {orderData.status}
                  </Badge>
                </div>
                <p className="text-[#6F83A7] text-sm">
                  {orderData.buyer} • {orderData.style} • {orderData.quantity.toLocaleString()} units
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-180 text-[#6F83A7] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Progress</div>
              <div className="text-lg text-white">
                {orderData.status === 'In Progress' ? '65%' : orderData.status === 'Completed' ? '100%' : '0%'}
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Line Efficiency</div>
              <div className="text-lg text-white">88%</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Days to Deadline</div>
              <div className="text-lg text-white">12</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7] mb-1">Quality Score</div>
              <div className="text-lg text-[#57ACAF]">96%</div>
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
                    layoutId="activeProductionOrderTab"
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
              {/* Order Details Card */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#57ACAF]" />
                      Order Information
                    </h3>
                    <p className="text-sm text-[#6F83A7]">Complete production order details</p>
                  </div>
                  <MarbimAIButton
                    marbimPrompt={`Analyze production order ${orderData.orderId} including: 1) Order details (${orderData.buyer} ${orderData.style}, ${orderData.quantity} units, ${orderData.startDate} to ${orderData.plannedEndDate}), 2) Current production status and progress (65% complete), 3) Resource allocation and line efficiency (88%), 4) Material readiness and supply chain status, 5) Quality metrics and compliance, 6) Timeline adherence and delay risks, 7) Cost tracking vs budget, 8) Recommendations for optimization and risk mitigation.`}
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-[#57ACAF]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[#6F83A7] mb-1">Order ID</div>
                        <div className="text-white">{orderData.orderId}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EAB308]/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[#6F83A7] mb-1">Buyer</div>
                        <div className="text-white">{orderData.buyer}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/10 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-[#6F83A7]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[#6F83A7] mb-1">Style</div>
                        <div className="text-white">{orderData.style}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center flex-shrink-0">
                        <Layers className="w-5 h-5 text-[#57ACAF]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[#6F83A7] mb-1">Quantity</div>
                        <div className="text-white">{orderData.quantity.toLocaleString()} units</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EAB308]/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[#6F83A7] mb-1">Start Date</div>
                        <div className="text-white">{orderData.startDate}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-[#6F83A7]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[#6F83A7] mb-1">Planned End Date</div>
                        <div className="text-white">{orderData.plannedEndDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-[#6F83A7]">Production Progress</div>
                      <div className="text-xl text-white">65%</div>
                    </div>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="text-xs text-[#57ACAF] mt-2">+12% this week</div>
                </div>
                <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-[#6F83A7]">Line Efficiency</div>
                      <div className="text-xl text-white">88%</div>
                    </div>
                  </div>
                  <Progress value={88} className="h-2" />
                  <div className="text-xs text-[#57ACAF] mt-2">+2% improvement</div>
                </div>
                <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-[#6F83A7]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-[#6F83A7]">Days to Deadline</div>
                      <div className="text-xl text-white">12</div>
                    </div>
                  </div>
                  <div className="text-xs text-[#6F83A7] mt-2">On track for delivery</div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                <h4 className="text-white mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#57ACAF]" />
                  Order Summary
                </h4>
                <p className="text-[#6F83A7] text-sm leading-relaxed">
                  Production order {orderData.orderId} for {orderData.buyer} manufacturing {orderData.quantity.toLocaleString()} units of {orderData.style}. 
                  Production {orderData.status.toLowerCase()} from {orderData.startDate} to {orderData.plannedEndDate}. Current progress at 65% with line efficiency of 88%. 
                  Quality score maintained at 96% with all checkpoints passing. On track for on-time delivery.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'production' && (
            <div className="space-y-6">
              {/* WIP by Stage */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <Factory className="w-5 h-5 text-[#57ACAF]" />
                      WIP by Production Stage
                    </h3>
                    <p className="text-sm text-[#6F83A7]">Work-in-progress distribution across stages</p>
                  </div>
                  <MarbimAIButton
                    marbimPrompt={`Analyze WIP distribution for order ${orderData.orderId} including: 1) Stage-wise breakdown (Cutting: 120/150, Sewing: 185/200 bottleneck, Washing: 45/100, Finishing: 68/100, Packing: 34/80), 2) Bottleneck identification in Sewing stage, 3) Flow optimization recommendations, 4) Resource reallocation suggestions, 5) Timeline impact analysis, 6) Capacity balancing strategies to improve throughput.`}
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={wipByStageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="stage" stroke="#6F83A7" />
                    <YAxis stroke="#6F83A7" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D1117',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="units" fill="#57ACAF" radius={[8, 8, 0, 0]} name="Current WIP" />
                    <Bar dataKey="target" fill="#6F83A7" radius={[8, 8, 0, 0]} name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Production Lines */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#EAB308]" />
                      Assigned Production Lines
                    </h3>
                    <p className="text-sm text-[#6F83A7]">Lines allocated to this order</p>
                  </div>
                  <MarbimAIButton
                    marbimPrompt={`Analyze line allocation for order ${orderData.orderId} including: 1) Current line assignments and utilization, 2) Efficiency metrics per line (Line 1: 92%, Line 2: 88%), 3) Operator skill match and capacity, 4) Reallocation opportunities for better throughput, 5) Predicted completion based on current allocation, 6) Cost-benefit analysis of alternative assignments.`}
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="space-y-3">
                  {[
                    { line: 'Line 1', efficiency: 92, operators: 25, wip: 450, status: 'Active' },
                    { line: 'Line 2', efficiency: 88, operators: 22, wip: 320, status: 'Active' },
                  ].map((line, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center">
                            <Factory className="w-5 h-5 text-[#57ACAF]" />
                          </div>
                          <div>
                            <div className="text-white">{line.line}</div>
                            <div className="text-xs text-[#6F83A7]">{line.operators} operators</div>
                          </div>
                        </div>
                        <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                          {line.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-[#6F83A7]">Efficiency</div>
                          <div className="text-white">{line.efficiency}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-[#6F83A7]">WIP Units</div>
                          <div className="text-white">{line.wip}</div>
                        </div>
                        <div>
                          <div className="text-xs text-[#6F83A7]">Utilization</div>
                          <div className="text-[#57ACAF]">{line.efficiency}%</div>
                        </div>
                      </div>
                      <Progress value={line.efficiency} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Alerts */}
              <div className="bg-gradient-to-br from-[#D0342C]/10 to-[#D0342C]/5 border border-[#D0342C]/20 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-[#D0342C] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-white mb-1">Sewing Bottleneck Alert</div>
                    <div className="text-sm text-[#6F83A7] mb-3">
                      185 WIP units in sewing stage - 2-day delay risk identified. Immediate action required.
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-[#D0342C] hover:bg-[#D0342C]/90 text-white">
                        <Zap className="w-3 h-3 mr-2" />
                        Resolve Bottleneck
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="space-y-6">
              {/* Progress Timeline */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                      Progress Timeline
                    </h3>
                    <p className="text-sm text-[#6F83A7]">Planned vs actual progress tracking</p>
                  </div>
                  <MarbimAIButton
                    marbimPrompt={`Analyze progress timeline for order ${orderData.orderId} including: 1) Planned vs actual progress comparison over 4 weeks, 2) Variance analysis and trend identification, 3) Delay factors and root causes, 4) Acceleration opportunities to recover timeline, 5) Resource optimization for improved velocity, 6) Forecast for remaining weeks based on current trends.`}
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <RechartsLine data={progressTimelineData}>
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
                    <Line type="monotone" dataKey="planned" stroke="#6F83A7" strokeWidth={2} strokeDasharray="5 5" name="Planned" />
                    <Line type="monotone" dataKey="actual" stroke="#57ACAF" strokeWidth={2} name="Actual" />
                  </RechartsLine>
                </ResponsiveContainer>
              </div>

              {/* Quality Checkpoints */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                      Quality Checkpoints
                    </h3>
                    <p className="text-sm text-[#6F83A7]">Pass/fail rates by stage</p>
                  </div>
                  <MarbimAIButton
                    marbimPrompt={`Analyze quality metrics for order ${orderData.orderId} including: 1) Checkpoint-wise pass/fail rates (Cutting: 98/2%, Sewing: 95/5%, Finishing: 97/3%), 2) Overall quality score of 96%, 3) Defect pattern analysis and common failure modes, 4) Root cause analysis for quality issues, 5) Corrective action recommendations, 6) Quality improvement initiatives for next batch.`}
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={qualityMetricsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis type="number" stroke="#6F83A7" />
                    <YAxis type="category" dataKey="checkpoint" stroke="#6F83A7" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D1117',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="passed" fill="#57ACAF" radius={[0, 8, 8, 0]} stackId="a" name="Passed" />
                    <Bar dataKey="failed" fill="#D0342C" radius={[0, 8, 8, 0]} stackId="a" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Milestone Status */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#EAB308]" />
                      Production Milestones
                    </h3>
                    <p className="text-sm text-[#6F83A7]">Key milestone tracking</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-transparent hover:bg-white/5">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="space-y-3">
                  {[
                    { milestone: 'Fabric Arrival', planned: '2024-10-18', actual: '2024-10-18', status: 'Completed' },
                    { milestone: 'Cutting Start', planned: '2024-10-20', actual: '2024-10-20', status: 'Completed' },
                    { milestone: 'Sewing Start', planned: '2024-10-23', actual: '2024-10-25', status: 'Delayed' },
                    { milestone: 'Finishing', planned: '2024-11-01', actual: '-', status: 'Pending' },
                  ].map((item, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white">{item.milestone}</div>
                        <Badge className={
                          item.status === 'Completed' 
                            ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                            : item.status === 'Delayed'
                            ? 'bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20'
                            : 'bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-[#6F83A7]">Planned</div>
                          <div className="text-white">{item.planned}</div>
                        </div>
                        <div>
                          <div className="text-xs text-[#6F83A7]">Actual</div>
                          <div className="text-white">{item.actual}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* AI Recommendations */}
              <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">AI Production Recommendations</h4>
                      <p className="text-xs text-[#6F83A7]">Intelligent optimization suggestions</p>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt={`Provide comprehensive AI recommendations for order ${orderData.orderId} including: 1) Bottleneck resolution strategies for Sewing stage (185 WIP units, 2-day delay risk), 2) Resource reallocation analysis for improved throughput, 3) Timeline recovery plan to meet ${orderData.plannedEndDate} deadline, 4) Quality optimization initiatives to maintain 96% score, 5) Cost reduction opportunities without compromising delivery, 6) Risk mitigation for identified delays, 7) Material expediting recommendations, 8) Quantified impact and implementation roadmap for each recommendation.`}
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 group">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#D0342C] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-white mb-2">Critical: Resolve Sewing Bottleneck</div>
                        <div className="text-sm text-[#6F83A7] mb-3">
                          185 WIP units causing 2-day delay risk. Recommend: Add 5 operators or extend shift by 2 hours/day for 3 days.
                        </div>
                        <div className="flex items-center gap-4 text-xs mb-3">
                          <div>
                            <span className="text-[#6F83A7]">Impact:</span> <span className="text-[#57ACAF]">-2 days</span>
                          </div>
                          <div>
                            <span className="text-[#6F83A7]">Cost:</span> <span className="text-white">$1,200</span>
                          </div>
                          <div>
                            <span className="text-[#6F83A7]">Success Rate:</span> <span className="text-[#57ACAF]">92%</span>
                          </div>
                        </div>
                        <Button size="sm" className="bg-[#D0342C] hover:bg-[#D0342C]/90 text-white">
                          Implement Solution
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 group">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-white mb-2">Optimize Line Allocation</div>
                        <div className="text-sm text-[#6F83A7] mb-3">
                          Move 20% of WIP from Line 1 to Line 6 for better load balancing. Expected +8% throughput improvement.
                        </div>
                        <div className="flex items-center gap-4 text-xs mb-3">
                          <div>
                            <span className="text-[#6F83A7]">Impact:</span> <span className="text-[#57ACAF]">+8%</span>
                          </div>
                          <div>
                            <span className="text-[#6F83A7]">Cost:</span> <span className="text-[#57ACAF]">Neutral</span>
                          </div>
                          <div>
                            <span className="text-[#6F83A7]">Success Rate:</span> <span className="text-[#57ACAF]">85%</span>
                          </div>
                        </div>
                        <Button size="sm" className="bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white">
                          Review Allocation
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 group">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-white mb-2">Material Pre-Order for Next Batch</div>
                        <div className="text-sm text-[#6F83A7] mb-3">
                          Based on consumption patterns, pre-order trim materials 3 days early to prevent delays in next production batch.
                        </div>
                        <div className="flex items-center gap-4 text-xs mb-3">
                          <div>
                            <span className="text-[#6F83A7]">Impact:</span> <span className="text-[#57ACAF]">-2 days lead time</span>
                          </div>
                          <div>
                            <span className="text-[#6F83A7]">Cost:</span> <span className="text-white">$0</span>
                          </div>
                          <div>
                            <span className="text-[#6F83A7]">Success Rate:</span> <span className="text-[#57ACAF]">95%</span>
                          </div>
                        </div>
                        <Button size="sm" className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                          Create Pre-Order
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Prediction */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-2 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                      Completion Forecast
                    </h3>
                    <p className="text-sm text-[#6F83A7]">AI-powered delivery prediction</p>
                  </div>
                  <MarbimAIButton
                    marbimPrompt={`Predict completion date for order ${orderData.orderId} including: 1) Current progress analysis (65% complete, 12 days to deadline), 2) Bottleneck impact assessment (Sewing: 2-day delay risk), 3) Resource availability constraints, 4) Historical velocity trends, 5) Probabilistic completion forecasts with confidence intervals, 6) Risk factors that could impact timeline, 7) Recommended corrective actions to ensure on-time delivery.`}
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white">Optimistic Scenario</div>
                      <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">92% confidence</Badge>
                    </div>
                    <div className="text-2xl text-[#57ACAF] mb-2">{orderData.plannedEndDate}</div>
                    <div className="text-sm text-[#6F83A7]">If bottleneck resolved within 2 days</div>
                  </div>
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white">Most Likely Scenario</div>
                      <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">78% confidence</Badge>
                    </div>
                    <div className="text-2xl text-[#EAB308] mb-2">Nov 14, 2024</div>
                    <div className="text-sm text-[#6F83A7]">With current resource allocation</div>
                  </div>
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white">Pessimistic Scenario</div>
                      <Badge className="bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20">15% risk</Badge>
                    </div>
                    <div className="text-2xl text-[#D0342C] mb-2">Nov 16, 2024</div>
                    <div className="text-sm text-[#6F83A7]">If material delays occur</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-white/10 p-6 bg-gradient-to-r from-white/5 to-transparent">
        <div className="flex items-center justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
          >
            Close
          </Button>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20">
              <Edit className="w-4 h-4 mr-2" />
              Edit Order
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
