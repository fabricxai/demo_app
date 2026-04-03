import { useState } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, DollarSign, Layers, Calculator, TrendingUp, Package, Clock, 
  Sparkles, Target, AlertCircle, Award, Activity, BarChart3, 
  CheckCircle2, FileText, Shield, RefreshCw, Edit, Save, Copy, Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { MarbimAIButton } from './MarbimAIButton';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface QuoteScenarioDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  scenario: any;
  onAskMarbim?: (prompt: string) => void;
}

export function QuoteScenarioDetailDrawer({ 
  open, 
  onClose, 
  scenario,
  onAskMarbim 
}: QuoteScenarioDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('pricing');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    margin: scenario?.margin || 12,
    fob: scenario?.fob || 5.85,
    leadTime: scenario?.leadTime || 35,
    fabricChoice: scenario?.fabricChoice || 'Standard Cotton',
    moq: 1000,
    paymentTerms: 'LC at sight',
    incoterms: 'FOB Shanghai',
    validityDays: 30,
  });

  const tabs = [
    { id: 'pricing', label: 'Pricing Details', icon: DollarSign },
    { id: 'breakdown', label: 'Cost Breakdown', icon: Calculator },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const costBreakdownData = [
    { category: 'Fabric', cost: 2.85, percentage: 48.7 },
    { category: 'Trims', cost: 0.45, percentage: 7.7 },
    { category: 'Labor', cost: 1.25, percentage: 21.4 },
    { category: 'Overhead', cost: 0.60, percentage: 10.3 },
    { category: 'Profit', cost: 0.70, percentage: 11.9 },
  ];

  const winProbabilityData = [
    { margin: 8, probability: 85 },
    { margin: 12, probability: 72 },
    { margin: 15, probability: 58 },
    { margin: 18, probability: 42 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recommended':
        return 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20';
      case 'Active':
        return 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20';
      default:
        return 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
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
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
              </div>

              <div className="relative px-8 py-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                      <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl text-white">{scenario?.scenario || 'Quote Scenario'}</h2>
                        <Badge className={`border ${getStatusColor(scenario?.status)}`}>
                          {scenario?.status || 'Active'}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#6F83A7]">
                        Configure pricing, margins, and strategy parameters for this scenario
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[#6F83A7]" />
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Margin</div>
                    <div className="text-lg text-white">{formData.margin}%</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">FOB Price</div>
                    <div className="text-lg text-white">${formData.fob}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Lead Time</div>
                    <div className="text-lg text-white">{formData.leadTime} days</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Win Probability</div>
                    <div className="text-lg text-[#57ACAF]">72%</div>
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
                      
                      {/* Animated underline with Motion */}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeQuoteScenarioTab"
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
                {/* Pricing Details Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    {/* Edit Mode Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white mb-1">Pricing & Strategy Configuration</h3>
                        <p className="text-sm text-[#6F83A7]">Define key parameters for this quote scenario</p>
                      </div>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20"
                              onClick={handleSave}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                            onClick={() => setIsEditing(true)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Scenario
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Core Pricing Parameters */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-white mb-1 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#57ACAF]" />
                            Core Pricing Parameters
                          </h4>
                          <p className="text-sm text-[#6F83A7]">Primary cost and margin configuration</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze and optimize pricing parameters for this quote scenario. Current settings: Margin ${formData.margin}%, FOB $${formData.fob}, Lead Time ${formData.leadTime} days, Fabric ${formData.fabricChoice}. Provide: 1) Pricing optimization recommendations based on market data, 2) Margin sensitivity analysis, 3) FOB price benchmarking vs competitors, 4) Lead time impact on buyer acceptance, 5) Fabric choice cost-benefit analysis, 6) Win probability prediction at current settings, 7) Alternative pricing strategies, 8) Risk assessment for current configuration.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Margin % */}
                        <div className="space-y-2">
                          <Label htmlFor="margin" className="text-white">
                            Margin %
                            <span className="text-[#6F83A7] ml-2 text-xs">Target profitability</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="margin"
                              type="number"
                              value={formData.margin}
                              onChange={(e) => setFormData({ ...formData, margin: parseFloat(e.target.value) })}
                              disabled={!isEditing}
                              className="bg-white/5 border-white/10 text-white pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F83A7] text-sm">%</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#6F83A7]">Industry avg: 10-15%</span>
                            <span className={formData.margin >= 10 && formData.margin <= 15 ? 'text-[#57ACAF]' : 'text-[#EAB308]'}>
                              {formData.margin >= 10 && formData.margin <= 15 ? '✓ Optimal' : '⚠ Outside range'}
                            </span>
                          </div>
                        </div>

                        {/* FOB Price */}
                        <div className="space-y-2">
                          <Label htmlFor="fob" className="text-white">
                            FOB Price (USD)
                            <span className="text-[#6F83A7] ml-2 text-xs">Per unit</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="fob"
                              type="number"
                              step="0.01"
                              value={formData.fob}
                              onChange={(e) => setFormData({ ...formData, fob: parseFloat(e.target.value) })}
                              disabled={!isEditing}
                              className="bg-white/5 border-white/10 text-white pl-8"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F83A7] text-sm">$</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#6F83A7]">Market range: $5.50-6.30</span>
                            <span className="text-[#57ACAF]">✓ Competitive</span>
                          </div>
                        </div>

                        {/* Lead Time */}
                        <div className="space-y-2">
                          <Label htmlFor="leadTime" className="text-white">
                            Lead Time
                            <span className="text-[#6F83A7] ml-2 text-xs">Production + shipping</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="leadTime"
                              type="number"
                              value={formData.leadTime}
                              onChange={(e) => setFormData({ ...formData, leadTime: parseInt(e.target.value) })}
                              disabled={!isEditing}
                              className="bg-white/5 border-white/10 text-white pr-16"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F83A7] text-sm">days</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#6F83A7]">Buyer preference: 30-40 days</span>
                            <span className="text-[#57ACAF]">✓ Fast</span>
                          </div>
                        </div>

                        {/* Fabric Choice */}
                        <div className="space-y-2">
                          <Label htmlFor="fabric" className="text-white">
                            Fabric Choice
                            <span className="text-[#6F83A7] ml-2 text-xs">Material specification</span>
                          </Label>
                          <Select
                            value={formData.fabricChoice}
                            onValueChange={(value) => setFormData({ ...formData, fabricChoice: value })}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Organic Cotton">Organic Cotton (+$0.40)</SelectItem>
                              <SelectItem value="Standard Cotton">Standard Cotton (Baseline)</SelectItem>
                              <SelectItem value="Blended Cotton">Blended Cotton (-$0.35)</SelectItem>
                              <SelectItem value="Recycled Polyester">Recycled Polyester (+$0.25)</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="text-xs text-[#6F83A7]">
                            Impact: {formData.fabricChoice === 'Organic Cotton' ? 'Premium positioning, sustainability appeal' : 
                                     formData.fabricChoice === 'Standard Cotton' ? 'Buyer preference, balanced cost' : 
                                     formData.fabricChoice === 'Blended Cotton' ? 'Cost-effective, slight quality trade-off' :
                                     'Eco-friendly, moderate premium'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Business Terms */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-white mb-1 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#EAB308]" />
                            Business Terms & Conditions
                          </h4>
                          <p className="text-sm text-[#6F83A7]">Commercial and operational parameters</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Review business terms for this quote scenario. Current terms: MOQ ${formData.moq} units, Payment ${formData.paymentTerms}, Incoterms ${formData.incoterms}, Validity ${formData.validityDays} days. Provide: 1) MOQ optimization based on production efficiency, 2) Payment terms competitiveness and risk assessment, 3) Incoterms appropriateness for buyer location, 4) Quote validity period optimization, 5) Alternative term structures, 6) Risk mitigation strategies, 7) Buyer preference alignment, 8) Negotiation flexibility recommendations.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* MOQ */}
                        <div className="space-y-2">
                          <Label htmlFor="moq" className="text-white">
                            Minimum Order Quantity (MOQ)
                          </Label>
                          <div className="relative">
                            <Input
                              id="moq"
                              type="number"
                              value={formData.moq}
                              onChange={(e) => setFormData({ ...formData, moq: parseInt(e.target.value) })}
                              disabled={!isEditing}
                              className="bg-white/5 border-white/10 text-white pr-16"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F83A7] text-sm">units</span>
                          </div>
                        </div>

                        {/* Payment Terms */}
                        <div className="space-y-2">
                          <Label htmlFor="payment" className="text-white">
                            Payment Terms
                          </Label>
                          <Select
                            value={formData.paymentTerms}
                            onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="LC at sight">LC at sight</SelectItem>
                              <SelectItem value="30% advance, 70% before shipment">30% advance, 70% before shipment</SelectItem>
                              <SelectItem value="Net 30">Net 30</SelectItem>
                              <SelectItem value="Net 60">Net 60</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Incoterms */}
                        <div className="space-y-2">
                          <Label htmlFor="incoterms" className="text-white">
                            Incoterms
                          </Label>
                          <Select
                            value={formData.incoterms}
                            onValueChange={(value) => setFormData({ ...formData, incoterms: value })}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FOB Shanghai">FOB Shanghai</SelectItem>
                              <SelectItem value="CIF Destination">CIF Destination</SelectItem>
                              <SelectItem value="EXW Factory">EXW Factory</SelectItem>
                              <SelectItem value="FCA Shanghai">FCA Shanghai</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Quote Validity */}
                        <div className="space-y-2">
                          <Label htmlFor="validity" className="text-white">
                            Quote Validity
                          </Label>
                          <div className="relative">
                            <Input
                              id="validity"
                              type="number"
                              value={formData.validityDays}
                              onChange={(e) => setFormData({ ...formData, validityDays: parseInt(e.target.value) })}
                              disabled={!isEditing}
                              className="bg-white/5 border-white/10 text-white pr-16"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F83A7] text-sm">days</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Impact Preview */}
                    <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-5">
                      <h4 className="text-white mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#57ACAF]" />
                        Quick Impact Preview
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Est. Win Probability</div>
                          <div className="text-xl text-[#57ACAF]">72%</div>
                          <div className="text-xs text-[#6F83A7] mt-1">Based on current parameters</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Expected Value</div>
                          <div className="text-xl text-white">$33.0K</div>
                          <div className="text-xs text-[#57ACAF] mt-1">+24% vs Scenario A</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Competitiveness</div>
                          <div className="text-xl text-[#EAB308]">Strong</div>
                          <div className="text-xs text-[#6F83A7] mt-1">Mid-range positioning</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cost Breakdown Tab */}
                {activeTab === 'breakdown' && (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white mb-1">Detailed Cost Structure</h3>
                        <p className="text-sm text-[#6F83A7]">Complete breakdown of manufacturing and operational costs</p>
                      </div>
                      <MarbimAIButton
                        marbimPrompt={`Analyze detailed cost structure for this quote scenario. Cost breakdown: Fabric $2.85 (48.7%), Trims $0.45 (7.7%), Labor $1.25 (21.4%), Overhead $0.60 (10.3%), Profit $0.70 (11.9%). Total FOB: $${formData.fob}, Margin: ${formData.margin}%. Provide: 1) Cost component analysis and optimization opportunities, 2) Fabric cost reduction strategies without quality compromise, 3) Labor efficiency improvements, 4) Overhead allocation review, 5) Profit margin assessment vs industry standards, 6) Cost variance risk factors, 7) Alternative sourcing or process options, 8) Cost benchmarking vs competitors.`}
                        onAskMarbim={onAskMarbim}
                        size="sm"
                      />
                    </div>

                    {/* Cost Components Table */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h4 className="text-white mb-4">Cost Components Breakdown</h4>
                      <div className="space-y-3">
                        {costBreakdownData.map((item, index) => (
                          <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white">{item.category}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-[#57ACAF]">${item.cost.toFixed(2)}</span>
                                <span className="text-[#6F83A7] text-sm">{item.percentage}%</span>
                              </div>
                            </div>
                            <Progress value={item.percentage * 2} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-white font-medium">Total FOB Price</span>
                        <span className="text-xl text-[#57ACAF]">${formData.fob}</span>
                      </div>
                    </div>

                    {/* Cost Distribution Pie Chart */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-white mb-1">Cost Distribution</h4>
                          <p className="text-sm text-[#6F83A7]">Visual breakdown of cost components</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Analyze cost distribution patterns and optimization. Fabric dominates at 48.7% (highest cost driver), Labor at 21.4% (second largest), Overhead 10.3%, Trims 7.7%, Profit margin 11.9%. Industry benchmarks: Fabric 45-50%, Labor 18-25%, Overhead 8-12%, Trims 5-10%, Profit 10-15%. Provide: 1) Cost distribution health assessment, 2) High-cost component optimization strategies, 3) Rebalancing opportunities for improved competitiveness, 4) Labor efficiency benchmarking, 5) Overhead reduction tactics, 6) Fabric sourcing alternatives, 7) Profit margin protection strategies, 8) Long-term cost structure sustainability.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={costBreakdownData}
                            dataKey="percentage"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ category, percentage }) => `${category}: ${percentage}%`}
                          >
                            {costBreakdownData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={['#57ACAF', '#EAB308', '#6F83A7', '#9333EA', '#D0342C'][index]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#0D1117',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                            }}
                            formatter={(value: any) => [`${value}%`, 'Percentage']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Cost Variance Alerts */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-2">Cost Variance Alert</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            Fabric cost increased 2% since last calculation. Total impact: +$0.10 per unit, reducing margin from {formData.margin}% to {(formData.margin - 1.7).toFixed(1)}% if not adjusted.
                          </p>
                          <Button size="sm" variant="outline" className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]">
                            <RefreshCw className="w-3 h-3 mr-2" />
                            Recalculate with Updated Costs
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analysis Tab */}
                {activeTab === 'analysis' && (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white mb-1">Scenario Performance Analysis</h3>
                        <p className="text-sm text-[#6F83A7]">Win probability, competitive positioning, and strategic insights</p>
                      </div>
                      <MarbimAIButton
                        marbimPrompt={`Provide comprehensive scenario performance analysis. Current scenario: ${formData.margin}% margin, $${formData.fob} FOB, ${formData.leadTime}d lead time, ${formData.fabricChoice}. Win probability: 72%, Expected value: $33.0K. Provide: 1) Win probability validation and confidence assessment, 2) Competitive positioning vs market alternatives, 3) Buyer acceptance likelihood based on historical patterns, 4) Risk-adjusted return analysis, 5) Sensitivity analysis for key parameters, 6) Strategic fit with business objectives, 7) Long-term implications of scenario choice, 8) Optimization recommendations for maximum expected value.`}
                        onAskMarbim={onAskMarbim}
                        size="sm"
                      />
                    </div>

                    {/* Win Probability Chart */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-white mb-1 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                            Win Probability by Margin
                          </h4>
                          <p className="text-sm text-[#6F83A7]">Impact of margin on conversion likelihood</p>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={winProbabilityData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis 
                            dataKey="margin" 
                            stroke="#6F83A7"
                            tick={{ fill: '#6F83A7' }}
                            label={{ value: 'Margin %', position: 'insideBottom', offset: -5, fill: '#6F83A7' }}
                          />
                          <YAxis 
                            stroke="#6F83A7"
                            tick={{ fill: '#6F83A7' }}
                            label={{ value: 'Win Probability %', angle: -90, position: 'insideLeft', fill: '#6F83A7' }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0D1117',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                            }}
                            formatter={(value: any) => [`${value}%`, 'Win Probability']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="probability" 
                            stroke="#57ACAF" 
                            strokeWidth={3}
                            dot={{ fill: '#57ACAF', r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="mt-4 p-3 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20">
                        <div className="text-xs text-[#57ACAF] mb-1">Current Position</div>
                        <div className="text-sm text-white">At {formData.margin}% margin, win probability is 72% (optimal sweet spot)</div>
                      </div>
                    </div>

                    {/* Competitive Positioning */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-white mb-1 flex items-center gap-2">
                              <Award className="w-5 h-5 text-[#EAB308]" />
                              Market Position
                            </h4>
                            <p className="text-sm text-[#6F83A7]">Competitive landscape</p>
                          </div>
                          <MarbimAIButton
                            marbimPrompt={`Analyze competitive market positioning for this scenario. Our FOB: $${formData.fob} (mid-range), Market range: $5.50-6.30. Competitors: Low-cost leader at $5.50-5.70, Quality leader at $6.00-6.30, Similar players at $5.75-5.95. Our positioning: Balanced value, quality reputation, relationship strength. Provide: 1) Competitive advantages and unique value propositions, 2) Vulnerability assessment vs competitors, 3) Price positioning strategy validation, 4) Differentiation opportunities beyond price, 5) Win/loss analysis against specific competitors, 6) Buyer switching cost considerations, 7) Strategic positioning recommendations, 8) Long-term competitive sustainability.`}
                            onAskMarbim={onAskMarbim}
                            size="sm"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white">Price Positioning</span>
                              <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                                Mid-Range
                              </Badge>
                            </div>
                            <div className="text-xs text-[#6F83A7]">
                              15% below premium, 6% above low-cost
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="text-xs text-[#6F83A7] mb-2">Est. Competitors</div>
                            <div className="text-lg text-white">4-5 bidders</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="text-xs text-[#6F83A7] mb-2">Our Advantage</div>
                            <div className="text-sm text-[#57ACAF]">3-year relationship, quality track record</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-white mb-1 flex items-center gap-2">
                              <Shield className="w-5 h-5 text-[#D0342C]" />
                              Risk Assessment
                            </h4>
                            <p className="text-sm text-[#6F83A7]">Scenario risk profile</p>
                          </div>
                          <MarbimAIButton
                            marbimPrompt={`Conduct risk assessment for this quote scenario. Risk categories: Win Risk (28% loss probability), Margin Risk (cost volatility, currency), Production Risk (${formData.leadTime}d lead time commitment, capacity), Material Risk (fabric cost +2%, supply chain). Overall risk: Moderate. Provide: 1) Detailed risk scoring and impact analysis, 2) Probability and severity for each risk type, 3) Risk mitigation strategies and contingencies, 4) Early warning indicators to monitor, 5) Risk tolerance evaluation, 6) Alternative scenarios with different risk profiles, 7) Insurance or hedging recommendations, 8) Escalation triggers and response protocols.`}
                            onAskMarbim={onAskMarbim}
                            size="sm"
                          />
                        </div>
                        <div className="space-y-3">
                          {[
                            { risk: 'Win Risk', level: 'Moderate', score: 28, color: '#EAB308' },
                            { risk: 'Margin Risk', level: 'Low', score: 15, color: '#57ACAF' },
                            { risk: 'Production Risk', level: 'Moderate', score: 32, color: '#EAB308' },
                            { risk: 'Material Risk', level: 'Medium', score: 38, color: '#D0342C' },
                          ].map((item, index) => (
                            <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white">{item.risk}</span>
                                <Badge className="border-none" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                                  {item.level}
                                </Badge>
                              </div>
                              <Progress value={item.score} className="h-1.5" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Buyer Alignment */}
                    <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-[#57ACAF]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-2">Buyer Preference Alignment</h4>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            This scenario strongly aligns with buyer's historical preferences: 10-15% margin acceptance (✓ Current: {formData.margin}%), 30-40 day lead time preference (✓ Current: {formData.leadTime}d), quality-focused with moderate price sensitivity.
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-2 rounded-lg bg-white/5">
                              <div className="text-xs text-[#6F83A7]">Margin Fit</div>
                              <div className="text-sm text-[#57ACAF]">✓ Strong</div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/5">
                              <div className="text-xs text-[#6F83A7]">Lead Time Fit</div>
                              <div className="text-sm text-[#57ACAF]">✓ Excellent</div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/5">
                              <div className="text-xs text-[#6F83A7]">Historical Win Rate</div>
                              <div className="text-sm text-white">74%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Insights Tab */}
                {activeTab === 'ai-insights' && (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white mb-1">MARBIM AI Strategic Insights</h3>
                        <p className="text-sm text-[#6F83A7]">AI-powered recommendations and decision intelligence</p>
                      </div>
                    </div>

                    {/* Master Recommendation */}
                    <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-6 h-6 text-[#57ACAF]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white text-lg mb-2">AI Scenario Recommendation</h4>
                            <p className="text-sm text-[#6F83A7] mb-4">
                              This scenario is <span className="text-[#57ACAF]">highly recommended</span> with 87% AI confidence. It maximizes expected value ($33.0K), achieves strong win probability (72%), and demonstrates excellent alignment with buyer's historical preferences and market positioning.
                            </p>
                            <div className="grid grid-cols-4 gap-3">
                              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                                <div className="text-xs text-[#6F83A7] mb-1">Recommendation</div>
                                <div className="text-sm text-[#57ACAF]">Strong Buy</div>
                              </div>
                              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                                <div className="text-xs text-[#6F83A7] mb-1">AI Confidence</div>
                                <div className="text-sm text-white">87%</div>
                              </div>
                              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                                <div className="text-xs text-[#6F83A7] mb-1">Expected Value</div>
                                <div className="text-sm text-white">$33.0K</div>
                              </div>
                              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                                <div className="text-xs text-[#6F83A7] mb-1">Risk Level</div>
                                <div className="text-sm text-[#EAB308]">Moderate</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Provide executive decision recommendation for this quote scenario. Complete analysis: ${formData.margin}% margin (optimal range), $${formData.fob} FOB (competitive positioning), ${formData.leadTime}d lead time (fast turnaround advantage), ${formData.fabricChoice} (buyer preference). Win probability: 72% (high confidence), Expected value: $33.0K (highest among scenarios), Risk profile: Moderate (manageable with mitigation). Buyer alignment: Strong (historical 10-15% margin acceptance, 30-40d lead time preference, 74% historical win rate). Competitive positioning: Mid-range with quality differentiation. RECOMMENDATION: Proceed with this scenario. Provide: 1) Executive summary for C-level decision, 2) Detailed rationale with supporting data, 3) Key success factors and execution requirements, 4) Risk mitigation strategies, 5) Post-submission monitoring plan, 6) Contingency scenarios if quote doesn't convert, 7) Long-term strategic implications, 8) Success metrics and KPIs to track.`}
                          onAskMarbim={onAskMarbim}
                          size="lg"
                        />
                      </div>
                    </div>

                    {/* Key Success Factors */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-white mb-1 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
                            Key Success Factors
                          </h4>
                          <p className="text-sm text-[#6F83A7]">Critical elements for winning this quote</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Identify and prioritize success factors for this scenario. Critical factors: Price Competitiveness (mid-range positioning ✓), Lead Time (35d fast turnaround ✓), Quality Track Record (3-year relationship ✓), Relationship Strength (74% historical win rate ✓), Responsive Communication (timely quote submission ✓). All factors aligned. Provide: 1) Success factor importance weighting and scoring, 2) How this scenario addresses each factor, 3) Gaps and mitigation strategies, 4) Buyer decision criteria mapping, 5) Winning playbook based on success factors, 6) Post-submission engagement tactics, 7) Success metrics to monitor, 8) Competitive advantages to emphasize in presentation.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="space-y-2">
                        {[
                          { factor: 'Competitive Pricing', status: '✓', impact: 'High', color: '#57ACAF' },
                          { factor: 'Fast Lead Time', status: '✓', impact: 'High', color: '#57ACAF' },
                          { factor: 'Quality Track Record', status: '✓', impact: 'Medium', color: '#57ACAF' },
                          { factor: 'Relationship Strength', status: '✓', impact: 'Medium', color: '#57ACAF' },
                          { factor: 'Responsive Communication', status: '✓', impact: 'High', color: '#57ACAF' },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-sm text-white">{item.factor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-white/10 text-[#6F83A7] border border-white/20 text-xs">
                                {item.impact}
                              </Badge>
                              <span className="text-[#57ACAF]">{item.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Optimization Recommendations */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-white mb-1 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-[#EAB308]" />
                            AI Optimization Opportunities
                          </h4>
                          <p className="text-sm text-[#6F83A7]">Potential enhancements to improve competitiveness</p>
                        </div>
                        <MarbimAIButton
                          marbimPrompt={`Identify optimization opportunities for this scenario. Current configuration strong but potential improvements: 1) Fabric cost reduction (2% increase detected, alternative sourcing?), 2) Lead time acceleration (can we go to 30 days for premium positioning?), 3) Payment terms flexibility (offer multiple options?), 4) Sustainability positioning (emphasize fabric choice environmental benefits), 5) Value-add services (QC, documentation, expedited shipping). Provide: 1) Detailed optimization recommendations with impact assessment, 2) Cost-benefit analysis for each opportunity, 3) Implementation feasibility and timeline, 4) Risk assessment for optimization changes, 5) Prioritization based on buyer value perception, 6) Quick wins vs long-term improvements, 7) Competitive differentiation through optimization, 8) Expected impact on win probability and expected value.`}
                          onAskMarbim={onAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="space-y-3">
                        {[
                          {
                            opportunity: 'Alternative Fabric Sourcing',
                            impact: 'Medium',
                            effort: 'Low',
                            value: 'Cost reduction $0.15/unit, margin improvement +2.5%',
                          },
                          {
                            opportunity: 'Lead Time Acceleration',
                            impact: 'High',
                            effort: 'Medium',
                            value: 'Win probability increase +8%, premium positioning',
                          },
                          {
                            opportunity: 'Flexible Payment Terms',
                            impact: 'Medium',
                            effort: 'Low',
                            value: 'Buyer convenience, competitive advantage',
                          },
                        ].map((item, index) => (
                          <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white">{item.opportunity}</span>
                              <div className="flex gap-2">
                                <Badge className={`text-xs border ${
                                  item.impact === 'High' ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20' :
                                  'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'
                                }`}>
                                  {item.impact} Impact
                                </Badge>
                                <Badge className="bg-white/10 text-[#6F83A7] border border-white/20 text-xs">
                                  {item.effort} Effort
                                </Badge>
                              </div>
                            </div>
                            <div className="text-xs text-[#6F83A7]">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strategic Action Plan */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                          <Activity className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-2">Next Steps & Action Plan</h4>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-[#57ACAF]">1</span>
                              </div>
                              <div className="text-sm text-[#6F83A7]">Update material costs with latest fabric pricing (+2% adjustment)</div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-[#57ACAF]">2</span>
                              </div>
                              <div className="text-sm text-[#6F83A7]">Obtain Director approval (currently in progress, ETA: Oct 27)</div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-[#57ACAF]">3</span>
                              </div>
                              <div className="text-sm text-[#6F83A7]">Submit quote to buyer within 24 hours of approval</div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-[#57ACAF]">4</span>
                              </div>
                              <div className="text-sm text-[#6F83A7]">Prepare follow-up strategy and buyer engagement plan</div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-[#57ACAF]">5</span>
                              </div>
                              <div className="text-sm text-[#6F83A7]">Monitor buyer engagement signals (quote opens, inquiries)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 px-8 py-4 bg-white/5">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  onClick={onClose}
                >
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate Scenario
                  </Button>
                  <Button className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Use This Scenario
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
