import { useState } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MarbimAIButton } from './MarbimAIButton';
import {
  X,
  Layers,
  DollarSign,
  Clock,
  Target,
  Sparkles,
  CheckCircle,
  Info,
  TrendingUp,
  Package,
  Calendar,
  FileText,
  Calculator,
  ShoppingCart,
  Truck,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';

interface CreateScenarioDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (scenarioData: any) => void;
  onAskMarbim?: (prompt: string) => void;
  rfqs?: Array<{ id: string; rfqId: string; buyer: string; productType: string }>;
}

export function CreateScenarioDrawer({ open, onClose, onSubmit, onAskMarbim, rfqs = [] }: CreateScenarioDrawerProps) {
  const [formData, setFormData] = useState({
    scenarioName: '',
    rfqId: '',
    rfqReference: '',
    buyerName: '',
    productType: '',
    targetMargin: '',
    fobPrice: '',
    leadTime: '',
    fabricChoice: '',
    moq: '',
    paymentTerms: '',
    incoterms: 'FOB',
    portOfLoading: '',
    notes: '',
    pricingApproach: '',
  });

  const handleRFQChange = (value: string) => {
    const selectedRFQ = rfqs.find(r => r.id === value);
    if (selectedRFQ) {
      setFormData({
        ...formData,
        rfqId: value,
        rfqReference: selectedRFQ.rfqId,
        buyerName: selectedRFQ.buyer,
        productType: selectedRFQ.productType,
      });
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.scenarioName || !formData.rfqId || !formData.targetMargin || !formData.fobPrice || !formData.leadTime) {
      toast.error('Please fill in all required fields (Scenario Name, RFQ, Margin, FOB Price, Lead Time)');
      return;
    }

    // Validate numeric fields
    const margin = parseFloat(formData.targetMargin);
    const fob = parseFloat(formData.fobPrice);
    const leadTime = parseInt(formData.leadTime);

    if (isNaN(margin) || margin < 0 || margin > 100) {
      toast.error('Please enter a valid margin percentage (0-100)');
      return;
    }

    if (isNaN(fob) || fob <= 0) {
      toast.error('Please enter a valid FOB price');
      return;
    }

    if (isNaN(leadTime) || leadTime <= 0) {
      toast.error('Please enter a valid lead time in days');
      return;
    }

    // Determine status based on margin
    let status = 'Active';
    if (margin >= 15) {
      status = 'Premium';
    } else if (margin >= 10 && margin < 15) {
      status = 'Recommended';
    } else if (margin < 8) {
      status = 'Budget';
    }

    // Calculate estimated cost from FOB and margin
    const estimatedCost = fob / (1 + margin / 100);

    // Create scenario data object
    const scenarioData = {
      id: Date.now(),
      scenario: formData.scenarioName,
      rfqId: formData.rfqReference,
      buyer: formData.buyerName,
      productType: formData.productType,
      margin: margin,
      fob: fob,
      leadTime: leadTime,
      fabricChoice: formData.fabricChoice || 'Standard Cotton',
      status: status,
      moq: formData.moq || 'N/A',
      paymentTerms: formData.paymentTerms || '30% Advance, 70% Before Shipment',
      incoterms: formData.incoterms,
      portOfLoading: formData.portOfLoading || 'Not specified',
      pricingApproach: formData.pricingApproach || 'Standard',
      notes: formData.notes,
      estimatedCost: estimatedCost.toFixed(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
    };

    // Call onSubmit callback if provided
    if (onSubmit) {
      onSubmit(scenarioData);
    }

    toast.success('Quote scenario created successfully');
    onClose();
    
    // Reset form
    setFormData({
      scenarioName: '',
      rfqId: '',
      rfqReference: '',
      buyerName: '',
      productType: '',
      targetMargin: '',
      fobPrice: '',
      leadTime: '',
      fabricChoice: '',
      moq: '',
      paymentTerms: '',
      incoterms: 'FOB',
      portOfLoading: '',
      notes: '',
      pricingApproach: '',
    });
  };

  const handleAIRecommendation = () => {
    if (onAskMarbim) {
      const prompt = formData.rfqReference && formData.buyerName
        ? `For RFQ ${formData.rfqReference} from ${formData.buyerName} (${formData.productType}), recommend optimal pricing scenarios. Current inputs: ${formData.targetMargin ? `${formData.targetMargin}% margin` : 'no margin set'}, ${formData.fobPrice ? `$${formData.fobPrice} FOB` : 'no price set'}, ${formData.leadTime ? `${formData.leadTime} days lead time` : 'no lead time set'}. Provide: 1) Competitive pricing analysis based on buyer's historical orders, 2) Optimal margin recommendations (conservative, balanced, premium scenarios), 3) Lead time competitiveness vs market standards, 4) Fabric selection impact on pricing and buyer perception, 5) Payment terms that maximize cash flow, 6) Win probability estimation for different price points, 7) Risk assessment and mitigation strategies.`
        : `Provide general recommendations for creating competitive quote scenarios. Include: 1) Industry standard margin ranges for garment manufacturing, 2) Typical lead time expectations by product type, 3) Common fabric choices and their cost implications, 4) Standard payment terms and trade practices, 5) Pricing strategies (cost-plus vs value-based), 6) How to balance competitiveness with profitability.`;
      onAskMarbim(prompt);
    }
  };

  const fabricOptions = [
    'Organic Cotton',
    'Standard Cotton',
    'Blended Cotton',
    'Polyester',
    'Cotton-Poly Blend',
    'Linen',
    'Bamboo',
    'Recycled Polyester',
    'Modal',
    'Viscose',
    'Spandex Blend',
  ];

  const pricingApproaches = [
    'Standard Cost-Plus',
    'Competitive Pricing',
    'Value-Based Pricing',
    'Premium Positioning',
    'Market Penetration',
    'Loss Leader',
  ];

  const paymentTermsOptions = [
    '30% Advance, 70% Before Shipment',
    '50% Advance, 50% Before Shipment',
    '100% Advance',
    'Net 30',
    'Net 60',
    'Letter of Credit (LC)',
    'Documentary Collection',
  ];

  const incotermsOptions = ['FOB', 'CIF', 'CFR', 'EXW', 'DDP', 'DAP'];

  // Calculate estimated win probability based on margin
  const getWinProbability = (margin: string) => {
    const m = parseFloat(margin);
    if (isNaN(m)) return null;
    
    if (m >= 18) return { value: '58%', color: '#EAB308', label: 'Moderate' };
    if (m >= 12) return { value: '72%', color: '#57ACAF', label: 'High' };
    if (m >= 8) return { value: '65%', color: '#57ACAF', label: 'Good' };
    return { value: '45%', color: '#D0342C', label: 'Low' };
  };

  const winProb = getWinProbability(formData.targetMargin);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={fabricRightDrawerClass('max-w-[900px]')}
          >
            {/* Header */}
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#EAB308]/5 via-transparent to-[#57ACAF]/5 p-6">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                  }}
                />
              </div>

              <div className="relative flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                    <Layers className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-xl text-white mb-1">Create Quote Scenario</h2>
                    <p className="text-sm text-[#6F83A7]">Build a new pricing and margin scenario for comparison</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-[#6F83A7] hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="relative grid grid-cols-4 gap-3">
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Active Scenarios</div>
                  <div className="text-lg text-white">3</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Avg Margin</div>
                  <div className="text-lg text-[#57ACAF]">12.7%</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Avg Win Rate</div>
                  <div className="text-lg text-white">65%</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">This Month</div>
                  <div className="text-lg text-white">8</div>
                </div>
              </div>
            </div>

            {/* Content with Scroll */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-8 py-6">
                <div className="space-y-6">
                  {/* AI Recommendation Card */}
                  <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-1">MARBIM Pricing Intelligence</h4>
                          <p className="text-xs text-[#6F83A7]">
                            Get AI-powered recommendations for optimal pricing, margin targets, lead times, and win probability analysis
                          </p>
                        </div>
                      </div>
                      <MarbimAIButton onClick={handleAIRecommendation} />
                    </div>
                    {formData.rfqReference && formData.buyerName && (
                      <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                          <div className="text-sm text-white">
                            AI will analyze pricing for {formData.rfqReference} from {formData.buyerName}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Basic Information */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-[#EAB308]" />
                      <h3 className="text-white">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">
                          Scenario Name <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          value={formData.scenarioName}
                          onChange={(e) => setFormData({ ...formData, scenarioName: e.target.value })}
                          placeholder="e.g., Scenario A - Premium or Competitive Pricing Option"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">
                          Select RFQ <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Select
                          value={formData.rfqId}
                          onValueChange={handleRFQChange}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Choose an RFQ to build scenario for" />
                          </SelectTrigger>
                          <SelectContent>
                            {rfqs.length > 0 ? (
                              rfqs.map(rfq => (
                                <SelectItem key={rfq.id} value={rfq.id}>
                                  {rfq.rfqId} - {rfq.buyer} ({rfq.productType})
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-rfqs" disabled>No RFQs available</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.rfqReference && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-[#6F83A7]">Buyer</Label>
                            <Input
                              value={formData.buyerName}
                              disabled
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-[#6F83A7]">Product Type</Label>
                            <Input
                              value={formData.productType}
                              disabled
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Margin */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Pricing & Margin</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">
                          Target Margin (%) <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={formData.targetMargin}
                          onChange={(e) => setFormData({ ...formData, targetMargin: e.target.value })}
                          placeholder="e.g., 12"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                        {winProb && (
                          <div className="flex items-center gap-2 mt-2">
                            <TrendingUp className="w-4 h-4" style={{ color: winProb.color }} />
                            <span className="text-xs" style={{ color: winProb.color }}>
                              Est. Win Probability: {winProb.value} ({winProb.label})
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">
                          FOB Price (USD) <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fobPrice}
                          onChange={(e) => setFormData({ ...formData, fobPrice: e.target.value })}
                          placeholder="e.g., 5.85"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Pricing Approach</Label>
                        <Select
                          value={formData.pricingApproach}
                          onValueChange={(value) => setFormData({ ...formData, pricingApproach: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select approach" />
                          </SelectTrigger>
                          <SelectContent>
                            {pricingApproaches.map(approach => (
                              <SelectItem key={approach} value={approach}>{approach}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">MOQ (Minimum Order Quantity)</Label>
                        <Input
                          value={formData.moq}
                          onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                          placeholder="e.g., 500 units"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Production & Delivery */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-[#EAB308]" />
                      <h3 className="text-white">Production & Delivery</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">
                          Lead Time (Days) <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          value={formData.leadTime}
                          onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                          placeholder="e.g., 35"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Fabric Choice</Label>
                        <Select
                          value={formData.fabricChoice}
                          onValueChange={(value) => setFormData({ ...formData, fabricChoice: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select fabric" />
                          </SelectTrigger>
                          <SelectContent>
                            {fabricOptions.map(fabric => (
                              <SelectItem key={fabric} value={fabric}>{fabric}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Incoterms</Label>
                        <Select
                          value={formData.incoterms}
                          onValueChange={(value) => setFormData({ ...formData, incoterms: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select incoterms" />
                          </SelectTrigger>
                          <SelectContent>
                            {incotermsOptions.map(term => (
                              <SelectItem key={term} value={term}>{term}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Port of Loading</Label>
                        <Input
                          value={formData.portOfLoading}
                          onChange={(e) => setFormData({ ...formData, portOfLoading: e.target.value })}
                          placeholder="e.g., Shanghai, China"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Terms */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Payment Terms</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Payment Terms</Label>
                        <Select
                          value={formData.paymentTerms}
                          onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentTermsOptions.map(term => (
                              <SelectItem key={term} value={term}>{term}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-[#6F83A7]" />
                      <h3 className="text-white">Additional Notes</h3>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6F83A7]">Internal Notes</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Add any additional notes, considerations, or special conditions for this scenario..."
                        rows={4}
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] resize-none"
                      />
                    </div>
                  </div>

                  {/* Information Note */}
                  <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-[#57ACAF] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-white text-sm mb-1">Scenario Management</h4>
                        <p className="text-xs text-[#6F83A7]">
                          Once created, you can compare this scenario with others, analyze win probabilities, 
                          and make data-driven decisions. The system will automatically calculate cost estimates 
                          and provide AI-powered insights.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 p-6 bg-gradient-to-t from-black/20 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
                  <Info className="w-4 h-4" />
                  <span>Fields marked with * are required</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 shadow-lg shadow-[#EAB308]/20"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    Create Scenario
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
