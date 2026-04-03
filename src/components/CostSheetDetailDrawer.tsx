import { motion, AnimatePresence } from 'motion/react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { useState } from 'react';
import { 
  X, Edit2, Send, Copy, Download, BarChart3, 
  FileText, Clock, Calendar, DollarSign, CheckCircle,
  Target, AlertCircle, Eye, MessageSquare, Package,
  Sparkles, Settings, Trash2, User, Building2, Mail,
  Phone, Globe, MapPin, TrendingUp, Award, Layers,
  Shield, AlertTriangle, Plus, Factory, Users, Truck,
  Star, Activity, Archive, ExternalLink, Calculator,
  TrendingDown, PieChart, History, Zap, Scissors,
  RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { MarbimAIButton } from './MarbimAIButton';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

interface CostSheetDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  costSheet: any;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
}

export function CostSheetDetailDrawer({ 
  isOpen, 
  onClose, 
  costSheet,
  onAskMarbim,
  onOpenAI
}: CostSheetDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Handler to send prompt to AI and close this drawer
  const handleAskMarbim = (prompt: string) => {
    if (onAskMarbim) {
      onAskMarbim(prompt);
    }
    if (onOpenAI) {
      onOpenAI();
    }
  };

  if (!costSheet) return null;

  // Calculate detailed cost breakdown
  const materialCost = 5.80;
  const laborCost = 2.40;
  const overheadsCost = 0.85;
  const freightCost = 0.35;
  const totalCost = materialCost + laborCost + overheadsCost + freightCost;
  const sellingPrice = totalCost / (1 - costSheet.marginPercent / 100);
  const marginAmount = sellingPrice - totalCost;

  // Mock data for charts
  const costBreakdownData = [
    { name: 'Material', value: materialCost, color: '#EAB308', percentage: ((materialCost/totalCost)*100).toFixed(1) },
    { name: 'Labor', value: laborCost, color: '#57ACAF', percentage: ((laborCost/totalCost)*100).toFixed(1) },
    { name: 'Overheads', value: overheadsCost, color: '#6F83A7', percentage: ((overheadsCost/totalCost)*100).toFixed(1) },
    { name: 'Freight', value: freightCost, color: '#9333EA', percentage: ((freightCost/totalCost)*100).toFixed(1) },
    { name: 'Margin', value: marginAmount, color: '#10B981', percentage: costSheet.marginPercent.toFixed(1) },
  ];

  const costHistoryData = [
    { month: 'Jun', material: 5.60, labor: 2.30, total: 9.15 },
    { month: 'Jul', material: 5.65, labor: 2.35, total: 9.25 },
    { month: 'Aug', material: 5.75, labor: 2.38, total: 9.35 },
    { month: 'Sep', material: 5.78, labor: 2.40, total: 9.38 },
    { month: 'Oct', material: 5.80, labor: 2.40, total: 9.40 },
  ];

  const profitScenarios = [
    { scenario: 'Current', margin: costSheet.marginPercent, profit: marginAmount.toFixed(2), fob: sellingPrice.toFixed(2) },
    { scenario: 'Optimized (-8%)', margin: costSheet.marginPercent + 3, profit: (marginAmount * 1.25).toFixed(2), fob: (sellingPrice * 0.92).toFixed(2) },
    { scenario: 'Budget (-15%)', margin: costSheet.marginPercent - 2, profit: (marginAmount * 0.85).toFixed(2), fob: (sellingPrice * 0.85).toFixed(2) },
  ];

  const materialBreakdown = [
    { item: 'Main Fabric', quantity: '1.8 yards', unitCost: '$2.50', totalCost: '$4.50', supplier: 'Fabric Co A' },
    { item: 'Trims & Labels', quantity: '1 set', unitCost: '$0.45', totalCost: '$0.45', supplier: 'Trim Supplier B' },
    { item: 'Buttons/Zippers', quantity: '5 pcs', unitCost: '$0.12', totalCost: '$0.60', supplier: 'Button Mfg C' },
    { item: 'Packaging', quantity: '1 unit', unitCost: '$0.25', totalCost: '$0.25', supplier: 'Pack Solutions' },
  ];

  const laborBreakdown = [
    { operation: 'Cutting', minutes: 8, rate: '$0.18/min', cost: '$1.44' },
    { operation: 'Sewing', minutes: 35, rate: '$0.015/min', cost: '$0.53' },
    { operation: 'Finishing', minutes: 12, rate: '$0.025/min', cost: '$0.30' },
    { operation: 'QC & Packing', minutes: 5, rate: '$0.026/min', cost: '$0.13' },
  ];

  const historyEvents = [
    { date: '2024-10-26', action: 'Approved by Finance', user: 'Sarah M.', note: `Margin ${costSheet.marginPercent}% approved for production` },
    { date: '2024-10-25', action: 'Cost Review', user: 'John D.', note: 'Reviewed material costs and labor rates' },
    { date: '2024-10-24', action: 'Updated BOM', user: 'Sarah M.', note: 'Updated bill of materials with new fabric specs' },
    { date: '2024-10-23', action: 'Created', user: 'Mike R.', note: `Initial cost sheet created for ${costSheet.style}` },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      case 'Draft': return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'Submitted': return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
      case 'Rejected': return 'bg-[#D0342C]/10 text-[#D0342C] border-[#D0342C]/20';
      default: return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
    }
  };

  const getMarginHealthColor = (margin: number) => {
    if (margin >= 15) return '#57ACAF';
    if (margin >= 10) return '#EAB308';
    return '#D0342C';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drawer - positioned below top bar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={fabricRightDrawerClass('max-w-[1000px]', 'overflow-hidden')}
          >
            {/* Header */}
            <div className="relative px-8 py-6 border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }} />
              </div>

              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl text-white">{costSheet.costSheetId}</h2>
                        <Badge className={getStatusColor(costSheet.status)}>
                          {costSheet.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6F83A7]">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {costSheet.buyer}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          {costSheet.style}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Updated: {costSheet.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Total FOB</div>
                      <div className="text-lg text-white">${sellingPrice.toFixed(2)}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Total Cost</div>
                      <div className="text-lg text-white">${totalCost.toFixed(2)}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Margin</div>
                      <div className="text-lg" style={{ color: getMarginHealthColor(costSheet.marginPercent) }}>
                        {costSheet.marginPercent}%
                      </div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                      <div className="text-xs text-[#57ACAF] mb-1">Profit/Unit</div>
                      <div className="text-lg text-white">${marginAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-start gap-2 ml-6">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white border-none hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                    onClick={() => toast.success('Creating quote from cost sheet')}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Create Quote
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    onClick={() => toast.info('Edit cost sheet')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                    className="text-white/60 hover:text-white hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sleek Tabs Navigation */}
            <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center px-8 gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'breakdown', label: 'Cost Breakdown', icon: PieChart },
                  { id: 'profit', label: 'Profit Analysis', icon: TrendingUp },
                  { id: 'history', label: 'History', icon: History },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative px-5 py-3.5 text-sm transition-all duration-300 flex items-center gap-2
                        ${activeTab === tab.id 
                          ? 'text-[#57ACAF]' 
                          : 'text-[#6F83A7] hover:text-white'
                        }
                      `}
                    >
                      {/* Tab Icon & Label */}
                      <Icon className="w-4 h-4" />
                      <span className="relative z-10">{tab.label}</span>

                      {/* Active Indicator */}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeCostSheetTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"
                          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-8 py-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Cost Sheet Summary */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Cost Sheet Summary</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Provide comprehensive analysis of cost sheet ${costSheet.costSheetId} for ${costSheet.buyer} ${costSheet.style}. Include pricing strategy, margin optimization opportunities, competitive positioning, and risk assessment.`)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Cost Sheet ID</div>
                              <div className="text-white">{costSheet.costSheetId}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <Building2 className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Buyer</div>
                              <div className="text-white">{costSheet.buyer}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Style</div>
                              <div className="text-white">{costSheet.style}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <User className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Owner</div>
                              <div className="text-white">{costSheet.owner}</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <DollarSign className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Total FOB Price</div>
                              <div className="text-white text-xl">${sellingPrice.toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#EAB308]/10 flex items-center justify-center shrink-0">
                              <Calculator className="w-5 h-5 text-[#EAB308]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Total Cost</div>
                              <div className="text-white text-xl">${totalCost.toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center shrink-0">
                              <TrendingUp className="w-5 h-5 text-[#10B981]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Margin</div>
                              <div className="text-white text-xl">
                                {costSheet.marginPercent}% <span className="text-sm text-[#6F83A7]">(${marginAmount.toFixed(2)})</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/10 flex items-center justify-center shrink-0">
                              <Clock className="w-5 h-5 text-[#6F83A7]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7] mb-1">Last Updated</div>
                              <div className="text-white">{costSheet.lastUpdated}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cost Visualization */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white">Cost Distribution</h3>
                          <MarbimAIButton
                            onClick={() => handleAskMarbim(`Analyze the cost distribution for ${costSheet.costSheetId}. Identify opportunities to optimize material costs (${((materialCost/totalCost)*100).toFixed(0)}%) and labor costs (${((laborCost/totalCost)*100).toFixed(0)}%) while maintaining quality.`)}
                            size="sm"
                          />
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                          <RechartsPie>
                            <Pie
                              data={costBreakdownData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              dataKey="value"
                              label={(entry) => `${entry.name}: ${entry.percentage}%`}
                            >
                              {costBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              contentStyle={{ backgroundColor: '#0D1117', border: '1px solid #ffffff20' }}
                              formatter={(value: any) => `$${Number(value).toFixed(2)}`}
                            />
                          </RechartsPie>
                        </ResponsiveContainer>
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white">Margin Health</h3>
                          <MarbimAIButton
                            onClick={() => handleAskMarbim(`Evaluate margin health for ${costSheet.costSheetId}. Current margin is ${costSheet.marginPercent}%. Recommend strategies to improve profitability and competitive positioning.`)}
                            size="sm"
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-[#6F83A7]">Current Margin</span>
                              <span className="text-white" style={{ color: getMarginHealthColor(costSheet.marginPercent) }}>
                                {costSheet.marginPercent}%
                              </span>
                            </div>
                            <Progress 
                              value={Math.min((costSheet.marginPercent / 20) * 100, 100)} 
                              className="h-2"
                              style={{ 
                                // @ts-ignore
                                '--progress-background': getMarginHealthColor(costSheet.marginPercent) 
                              }}
                            />
                            <div className="flex justify-between text-xs text-[#6F83A7] mt-1">
                              <span>0%</span>
                              <span>Target: 15%</span>
                              <span>20%</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-xs text-[#6F83A7] mb-1">Material %</div>
                              <div className="text-white">{((materialCost/totalCost)*100).toFixed(0)}%</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-xs text-[#6F83A7] mb-1">Labor %</div>
                              <div className="text-white">{((laborCost/totalCost)*100).toFixed(0)}%</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-xs text-[#6F83A7] mb-1">Overheads %</div>
                              <div className="text-white">{((overheadsCost/totalCost)*100).toFixed(0)}%</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-xs text-[#6F83A7] mb-1">Freight %</div>
                              <div className="text-white">{((freightCost/totalCost)*100).toFixed(0)}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">AI Recommendation</h3>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            {costSheet.marginPercent >= 15 
                              ? `Excellent margin of ${costSheet.marginPercent}%. This cost sheet is well-positioned. Monitor commodity prices to maintain profitability.`
                              : costSheet.marginPercent >= 10
                              ? `Acceptable margin of ${costSheet.marginPercent}%. Consider material substitution or labor efficiency improvements to reach 15% target.`
                              : `Low margin of ${costSheet.marginPercent}% requires immediate attention. Recommend cost optimization review and buyer negotiation.`
                            }
                          </p>
                        </div>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Generate detailed cost optimization recommendations for ${costSheet.costSheetId}. Include: 1) Alternative material sourcing options with cost savings, 2) Labor efficiency improvements, 3) Overhead reduction strategies, 4) Freight optimization, 5) Pricing negotiation tactics with ${costSheet.buyer}, 6) Risk mitigation plans.`)}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <Button 
                          variant="outline" 
                          className="border-[#EAB308]/30 text-white hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0.02)]"
                          onClick={() => handleAskMarbim(`Find alternative material suppliers for ${costSheet.style} that could reduce material cost from $${materialCost} while maintaining quality standards.`)}
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Material Alternatives
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-[#EAB308]/30 text-white hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
                          onClick={() => handleAskMarbim(`Suggest labor efficiency improvements for ${costSheet.style} production to reduce labor cost from $${laborCost}.`)}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Labor Optimization
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-[#EAB308]/30 text-white hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0.05)]"
                          onClick={() => handleAskMarbim(`Provide pricing negotiation strategy with ${costSheet.buyer} to improve margin from ${costSheet.marginPercent}% to target 15%.`)}
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Price Strategy
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cost Breakdown Tab */}
                {activeTab === 'breakdown' && (
                  <div className="space-y-6">
                    {/* Material Breakdown */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Material Breakdown</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Analyze material breakdown for ${costSheet.costSheetId}. Identify cost reduction opportunities through alternative suppliers, bulk purchasing, or material substitution while maintaining quality.`)}
                        />
                      </div>
                      <div className="overflow-hidden rounded-lg border border-white/10">
                        <table className="w-full">
                          <thead className="bg-white/5">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">Item</th>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">Quantity</th>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">Unit Cost</th>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">Total</th>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">Supplier</th>
                            </tr>
                          </thead>
                          <tbody>
                            {materialBreakdown.map((item, index) => (
                              <tr key={index} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 text-white text-sm">{item.item}</td>
                                <td className="px-4 py-3 text-[#6F83A7] text-sm">{item.quantity}</td>
                                <td className="px-4 py-3 text-white text-sm">{item.unitCost}</td>
                                <td className="px-4 py-3 text-[#57ACAF] text-sm">{item.totalCost}</td>
                                <td className="px-4 py-3 text-[#6F83A7] text-sm">{item.supplier}</td>
                              </tr>
                            ))}
                            <tr className="border-t-2 border-white/20 bg-white/5">
                              <td colSpan={3} className="px-4 py-3 text-white font-medium">Total Material Cost</td>
                              <td className="px-4 py-3 text-[#57ACAF] font-medium text-lg">${materialCost.toFixed(2)}</td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Labor Breakdown */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Labor Breakdown</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Analyze labor breakdown for ${costSheet.style}. Suggest efficiency improvements, workflow optimization, and automation opportunities to reduce labor cost from $${laborCost}.`)}
                        />
                      </div>
                      <div className="overflow-hidden rounded-lg border border-white/10">
                        <table className="w-full">
                          <thead className="bg-white/5">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">Operation</th>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">Time (min)</th>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">Rate</th>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {laborBreakdown.map((item, index) => (
                              <tr key={index} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 text-white text-sm">{item.operation}</td>
                                <td className="px-4 py-3 text-[#6F83A7] text-sm">{item.minutes}</td>
                                <td className="px-4 py-3 text-[#6F83A7] text-sm">{item.rate}</td>
                                <td className="px-4 py-3 text-[#57ACAF] text-sm">{item.cost}</td>
                              </tr>
                            ))}
                            <tr className="border-t-2 border-white/20 bg-white/5">
                              <td colSpan={3} className="px-4 py-3 text-white font-medium">Total Labor Cost</td>
                              <td className="px-4 py-3 text-[#57ACAF] font-medium text-lg">${laborCost.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Other Costs */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white">Overheads</h3>
                          <MarbimAIButton
                            onClick={() => handleAskMarbim(`Analyze overhead costs ($${overheadsCost}) for ${costSheet.costSheetId} and suggest reduction strategies.`)}
                            size="sm"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                            <span className="text-sm text-[#6F83A7]">Factory Overhead</span>
                            <span className="text-white">$0.45</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                            <span className="text-sm text-[#6F83A7]">Administrative</span>
                            <span className="text-white">$0.25</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                            <span className="text-sm text-[#6F83A7]">Utilities & Others</span>
                            <span className="text-white">$0.15</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-white/10 border border-white/20">
                            <span className="text-white font-medium">Total</span>
                            <span className="text-[#57ACAF] text-lg font-medium">${overheadsCost.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white">Freight & Logistics</h3>
                          <MarbimAIButton
                            onClick={() => handleAskMarbim(`Analyze freight and logistics costs ($${freightCost}) and suggest optimization strategies including shipping routes and carrier options.`)}
                            size="sm"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                            <span className="text-sm text-[#6F83A7]">Domestic Transport</span>
                            <span className="text-white">$0.15</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                            <span className="text-sm text-[#6F83A7]">International Freight</span>
                            <span className="text-white">$0.20</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-white/10 border border-white/20">
                            <span className="text-white font-medium">Total</span>
                            <span className="text-[#57ACAF] text-lg font-medium">${freightCost.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profit Analysis Tab */}
                {activeTab === 'profit' && (
                  <div className="space-y-6">
                    {/* Profit Scenarios */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Profit Scenarios</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Generate detailed profit scenarios for ${costSheet.costSheetId}. Compare current pricing vs optimized pricing vs budget pricing. Include volume impact analysis and competitive positioning.`)}
                        />
                      </div>
                      <div className="overflow-hidden rounded-lg border border-white/10">
                        <table className="w-full">
                          <thead className="bg-white/5">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">Scenario</th>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">Margin %</th>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">Profit/Unit</th>
                              <th className="px-4 py-3 text-left text-xs text-[#6F83A7]">FOB Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {profitScenarios.map((scenario, index) => (
                              <tr key={index} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 text-white text-sm">{scenario.scenario}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span style={{ color: getMarginHealthColor(scenario.margin) }}>
                                    {scenario.margin.toFixed(1)}%
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-[#57ACAF] text-sm">${scenario.profit}</td>
                                <td className="px-4 py-3 text-white text-sm">${scenario.fob}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Cost Trend Analysis */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Cost Trend (Last 5 Months)</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Analyze cost trends for ${costSheet.style}. Identify factors driving cost increases, forecast future costs, and recommend hedging strategies.`)}
                        />
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={costHistoryData}>
                          <defs>
                            <linearGradient id="colorMaterial" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorLabor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#57ACAF" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#57ACAF" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6F83A7" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6F83A7" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis dataKey="month" stroke="#6F83A7" />
                          <YAxis stroke="#6F83A7" />
                          <RechartsTooltip
                            contentStyle={{ backgroundColor: '#0D1117', border: '1px solid #ffffff20' }}
                            formatter={(value: any) => `$${value.toFixed(2)}`}
                          />
                          <Area type="monotone" dataKey="material" stroke="#EAB308" fillOpacity={1} fill="url(#colorMaterial)" />
                          <Area type="monotone" dataKey="labor" stroke="#57ACAF" fillOpacity={1} fill="url(#colorLabor)" />
                          <Area type="monotone" dataKey="total" stroke="#6F83A7" fillOpacity={1} fill="url(#colorTotal)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Competitive Analysis */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <Target className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">Competitive Position</h3>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            Based on market analysis, your FOB price of ${sellingPrice.toFixed(2)} is {costSheet.marginPercent >= 15 ? 'competitively positioned' : 'slightly below market average'}. 
                            Industry average margin for {costSheet.style} is 14-16%.
                          </p>
                        </div>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Provide comprehensive competitive analysis for ${costSheet.style} style. Compare our FOB price ($${sellingPrice.toFixed(2)}) and margin (${costSheet.marginPercent}%) against market benchmarks. Include pricing strategy recommendations for ${costSheet.buyer}.`)}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Our Price</div>
                          <div className="text-white text-xl">${sellingPrice.toFixed(2)}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Market Average</div>
                          <div className="text-white text-xl">$10.25</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Position</div>
                          <div className="text-[#57ACAF] text-xl">
                            {((sellingPrice - 10.25) / 10.25 * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  <div className="space-y-6">
                    {/* Timeline */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Cost Sheet Timeline</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Analyze the timeline and evolution of cost sheet ${costSheet.costSheetId}. Identify patterns, approval bottlenecks, and process improvement opportunities.`)}
                        />
                      </div>
                      <div className="space-y-4">
                        {historyEvents.map((event, index) => (
                          <div key={index} className="flex gap-4 relative">
                            {index !== historyEvents.length - 1 && (
                              <div className="absolute left-[11px] top-[32px] bottom-[-16px] w-px bg-white/10" />
                            )}
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shrink-0 relative z-10">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                            <div className="flex-1 pb-6">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="text-white font-medium mb-1">{event.action}</div>
                                  <div className="text-sm text-[#6F83A7]">{event.note}</div>
                                </div>
                                <div className="text-xs text-[#6F83A7] shrink-0 ml-4">{event.date}</div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <User className="w-3 h-3 text-[#57ACAF]" />
                                <span className="text-xs text-[#6F83A7]">{event.user}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Revision History */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Revision History</h3>
                        <MarbimAIButton
                          onClick={() => handleAskMarbim(`Analyze revision history for ${costSheet.costSheetId}. Identify key changes in material costs, labor rates, and margin adjustments. Explain factors driving these revisions.`)}
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
                                v3.0 (Current)
                              </Badge>
                              <span className="text-white">Material cost update</span>
                            </div>
                            <span className="text-xs text-[#6F83A7]">{costSheet.lastUpdated}</span>
                          </div>
                          <div className="text-sm text-[#6F83A7]">
                            Updated fabric cost from $5.65 to $5.80 (+2.7%) due to commodity price increase
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20">
                                v2.0
                              </Badge>
                              <span className="text-white">Labor rate adjustment</span>
                            </div>
                            <span className="text-xs text-[#6F83A7]">2024-10-20</span>
                          </div>
                          <div className="text-sm text-[#6F83A7]">
                            Adjusted labor cost from $2.30 to $2.40 to reflect new minimum wage requirements
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20">
                                v1.0
                              </Badge>
                              <span className="text-white">Initial version</span>
                            </div>
                            <span className="text-xs text-[#6F83A7]">2024-10-15</span>
                          </div>
                          <div className="text-sm text-[#6F83A7]">
                            First cost sheet created with preliminary material and labor estimates
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Related Documents */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white text-lg">Related Documents</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                          onClick={() => toast.info('Upload document')}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Document
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: 'Cost_Sheet_Detailed.xlsx', type: 'Costing', date: costSheet.lastUpdated, size: '245 KB' },
                          { name: `Tech_Pack_${costSheet.style.replace(/\s+/g, '_')}.pdf`, type: 'Technical', date: costSheet.lastUpdated, size: '1.2 MB' },
                          { name: 'Material_BOM.xlsx', type: 'BOM', date: costSheet.lastUpdated, size: '156 KB' },
                          { name: 'Buyer_Approval_Email.pdf', type: 'Approval', date: costSheet.lastUpdated, size: '89 KB' },
                        ].map((doc, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm truncate">{doc.name}</div>
                              <div className="flex items-center gap-2 text-xs text-[#6F83A7]">
                                <span>{doc.type}</span>
                                <span>•</span>
                                <span>{doc.size}</span>
                                <span>•</span>
                                <span>{doc.date}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.success('Downloading ' + doc.name);
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
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
