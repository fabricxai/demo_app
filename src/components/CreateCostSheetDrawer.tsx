import { useState } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MarbimAIButton } from './MarbimAIButton';
import {
  X,
  Calculator,
  Building2,
  Package,
  DollarSign,
  Scissors,
  Users,
  Truck,
  Sparkles,
  Plus,
  Minus,
  TrendingUp,
  Zap,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface CreateCostSheetDrawerProps {
  open: boolean;
  onClose: () => void;
  onAskMarbim?: (prompt: string) => void;
}

interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  unitCost: string;
}

interface LaborItem {
  id: string;
  operation: string;
  minutes: string;
  rate: string;
}

export function CreateCostSheetDrawer({ open, onClose, onAskMarbim }: CreateCostSheetDrawerProps) {
  const [formData, setFormData] = useState({
    buyer: '',
    styleName: '',
    styleNumber: '',
    season: '',
    quantity: '',
    targetMargin: '15',
    overheadCost: '',
    freightCost: '',
    description: '',
  });

  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([
    { id: '1', name: '', quantity: '', unit: 'yards', unitCost: '' },
  ]);

  const [laborItems, setLaborItems] = useState<LaborItem[]>([
    { id: '1', operation: '', minutes: '', rate: '' },
  ]);

  const addMaterialItem = () => {
    setMaterialItems([...materialItems, {
      id: Date.now().toString(),
      name: '',
      quantity: '',
      unit: 'yards',
      unitCost: '',
    }]);
  };

  const removeMaterialItem = (id: string) => {
    if (materialItems.length > 1) {
      setMaterialItems(materialItems.filter(item => item.id !== id));
    }
  };

  const updateMaterialItem = (id: string, field: keyof MaterialItem, value: string) => {
    setMaterialItems(materialItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addLaborItem = () => {
    setLaborItems([...laborItems, {
      id: Date.now().toString(),
      operation: '',
      minutes: '',
      rate: '',
    }]);
  };

  const removeLaborItem = (id: string) => {
    if (laborItems.length > 1) {
      setLaborItems(laborItems.filter(item => item.id !== id));
    }
  };

  const updateLaborItem = (id: string, field: keyof LaborItem, value: string) => {
    setLaborItems(laborItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Calculate totals
  const calculateMaterialTotal = () => {
    return materialItems.reduce((total, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const cost = parseFloat(item.unitCost) || 0;
      return total + (qty * cost);
    }, 0);
  };

  const calculateLaborTotal = () => {
    return laborItems.reduce((total, item) => {
      const minutes = parseFloat(item.minutes) || 0;
      const rate = parseFloat(item.rate) || 0;
      return total + (minutes * rate);
    }, 0);
  };

  const calculateTotalCost = () => {
    const material = calculateMaterialTotal();
    const labor = calculateLaborTotal();
    const overhead = parseFloat(formData.overheadCost) || 0;
    const freight = parseFloat(formData.freightCost) || 0;
    return material + labor + overhead + freight;
  };

  const calculateFOB = () => {
    const totalCost = calculateTotalCost();
    const margin = parseFloat(formData.targetMargin) || 0;
    if (margin >= 100) return 0;
    return totalCost / (1 - margin / 100);
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.buyer || !formData.styleName || !formData.styleNumber) {
      toast.error('Please fill in all required fields (Buyer, Style Name, Style Number)');
      return;
    }

    const totalCost = calculateTotalCost();
    const fobPrice = calculateFOB();

    // Submit logic here
    toast.success(
      <div>
        <div className="font-medium">Cost Sheet Created Successfully!</div>
        <div className="text-sm text-gray-400 mt-1">
          Total Cost: ${totalCost.toFixed(2)} | FOB: ${fobPrice.toFixed(2)} | Margin: {formData.targetMargin}%
        </div>
      </div>
    );
    onClose();
  };

  const handleAIAutofill = () => {
    if (onAskMarbim) {
      onAskMarbim(
        `I'm creating a cost sheet for ${formData.buyer || 'a buyer'} for style "${formData.styleName || 'a garment'}". Please suggest: 1) Typical material components and quantities for this style, 2) Labor operations and standard time estimates, 3) Overhead and freight cost percentages, 4) Competitive pricing benchmarks, 5) Target margin recommendations based on buyer and style type.`
      );
    }
  };

  const handleMaterialSuggestions = () => {
    if (onAskMarbim) {
      onAskMarbim(
        `For a ${formData.styleName || 'garment'} style, suggest complete bill of materials including: 1) Main fabric type and consumption, 2) Lining/interlining requirements, 3) Trims (buttons, zippers, labels), 4) Packaging materials, 5) Current market prices for each component.`
      );
    }
  };

  const handleLaborSuggestions = () => {
    if (onAskMarbim) {
      onAskMarbim(
        `For a ${formData.styleName || 'garment'} style, suggest labor breakdown including: 1) All manufacturing operations (cutting, sewing, finishing, QC), 2) Standard allowed minutes (SAM) for each operation, 3) Labor rates per minute/hour, 4) Total labor cost estimate.`
      );
    }
  };

  const handleMarginRecommendation = () => {
    if (onAskMarbim) {
      onAskMarbim(
        `For buyer ${formData.buyer || 'this buyer'} and style ${formData.styleName || 'this style'}, recommend: 1) Optimal margin percentage based on buyer tier and market positioning, 2) Competitive FOB pricing range, 3) Volume-based pricing strategies, 4) Risk factors affecting margin.`
      );
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
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5 p-6">
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

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl mb-1">Create Cost Sheet</h2>
                    <p className="text-sm text-[#6F83A7]">
                      Build a comprehensive cost sheet with AI-powered suggestions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MarbimAIButton
                    onClick={handleAIAutofill}
                    size="sm"
                  />
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

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-6 py-6">
                <div className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#57ACAF]" />
                        Basic Information
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="buyer" className="text-[#6F83A7]">
                          Buyer <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Select
                          value={formData.buyer}
                          onValueChange={(value) => setFormData({ ...formData, buyer: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select buyer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="H&M">H&M</SelectItem>
                            <SelectItem value="Zara">Zara</SelectItem>
                            <SelectItem value="Gap">Gap</SelectItem>
                            <SelectItem value="Nike">Nike</SelectItem>
                            <SelectItem value="Adidas">Adidas</SelectItem>
                            <SelectItem value="Uniqlo">Uniqlo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="season" className="text-[#6F83A7]">Season</Label>
                        <Select
                          value={formData.season}
                          onValueChange={(value) => setFormData({ ...formData, season: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select season" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                            <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                            <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                            <SelectItem value="Winter 2025">Winter 2025</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="styleName" className="text-[#6F83A7]">
                          Style Name <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          id="styleName"
                          value={formData.styleName}
                          onChange={(e) => setFormData({ ...formData, styleName: e.target.value })}
                          placeholder="e.g., Basic T-Shirt"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="styleNumber" className="text-[#6F83A7]">
                          Style Number <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          id="styleNumber"
                          value={formData.styleNumber}
                          onChange={(e) => setFormData({ ...formData, styleNumber: e.target.value })}
                          placeholder="e.g., ST-2024-001"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity" className="text-[#6F83A7]">Order Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          placeholder="e.g., 5000"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="targetMargin" className="text-[#6F83A7]">
                          Target Margin (%)
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="targetMargin"
                            type="number"
                            value={formData.targetMargin}
                            onChange={(e) => setFormData({ ...formData, targetMargin: e.target.value })}
                            placeholder="15"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                          <MarbimAIButton
                            onClick={handleMarginRecommendation}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="description" className="text-[#6F83A7]">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of the style..."
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]"
                      />
                    </div>
                  </div>

                  {/* Material Costs Section */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-[#EAB308]" />
                        Material Costs
                      </h3>
                      <div className="flex items-center gap-2">
                        <MarbimAIButton
                          onClick={handleMaterialSuggestions}
                          size="sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={addMaterialItem}
                          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Material
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {materialItems.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="col-span-4 space-y-2">
                            <Label className="text-xs text-[#6F83A7]">Material Name</Label>
                            <Input
                              value={item.name}
                              onChange={(e) => updateMaterialItem(item.id, 'name', e.target.value)}
                              placeholder="e.g., Cotton Fabric"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9"
                            />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <Label className="text-xs text-[#6F83A7]">Quantity</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => updateMaterialItem(item.id, 'quantity', e.target.value)}
                              placeholder="1.5"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9"
                            />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <Label className="text-xs text-[#6F83A7]">Unit</Label>
                            <Select
                              value={item.unit}
                              onValueChange={(value) => updateMaterialItem(item.id, 'unit', value)}
                            >
                              <SelectTrigger className="bg-white/5 border-white/10 text-white h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yards">Yards</SelectItem>
                                <SelectItem value="meters">Meters</SelectItem>
                                <SelectItem value="pcs">Pieces</SelectItem>
                                <SelectItem value="kg">Kilograms</SelectItem>
                                <SelectItem value="set">Set</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2 space-y-2">
                            <Label className="text-xs text-[#6F83A7]">Unit Cost ($)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.unitCost}
                              onChange={(e) => updateMaterialItem(item.id, 'unitCost', e.target.value)}
                              placeholder="2.50"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9"
                            />
                          </div>
                          <div className="col-span-2 flex items-center justify-between">
                            <div className="text-sm text-white">
                              ${((parseFloat(item.quantity) || 0) * (parseFloat(item.unitCost) || 0)).toFixed(2)}
                            </div>
                            {materialItems.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeMaterialItem(item.id)}
                                className="h-9 w-9 p-0 text-white/60 hover:text-white hover:bg-white/5"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20 flex items-center justify-between">
                      <span className="text-white font-medium">Total Material Cost</span>
                      <span className="text-[#EAB308] text-lg font-medium">${calculateMaterialTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Labor Costs Section */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#57ACAF]" />
                        Labor Costs
                      </h3>
                      <div className="flex items-center gap-2">
                        <MarbimAIButton
                          onClick={handleLaborSuggestions}
                          size="sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={addLaborItem}
                          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Operation
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {laborItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="col-span-5 space-y-2">
                            <Label className="text-xs text-[#6F83A7]">Operation</Label>
                            <Input
                              value={item.operation}
                              onChange={(e) => updateLaborItem(item.id, 'operation', e.target.value)}
                              placeholder="e.g., Cutting"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9"
                            />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <Label className="text-xs text-[#6F83A7]">Time (min)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.minutes}
                              onChange={(e) => updateLaborItem(item.id, 'minutes', e.target.value)}
                              placeholder="8"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9"
                            />
                          </div>
                          <div className="col-span-3 space-y-2">
                            <Label className="text-xs text-[#6F83A7]">Rate ($/min)</Label>
                            <Input
                              type="number"
                              step="0.001"
                              value={item.rate}
                              onChange={(e) => updateLaborItem(item.id, 'rate', e.target.value)}
                              placeholder="0.18"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9"
                            />
                          </div>
                          <div className="col-span-2 flex items-center justify-between">
                            <div className="text-sm text-white">
                              ${((parseFloat(item.minutes) || 0) * (parseFloat(item.rate) || 0)).toFixed(2)}
                            </div>
                            {laborItems.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeLaborItem(item.id)}
                                className="h-9 w-9 p-0 text-white/60 hover:text-white hover:bg-white/5"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20 flex items-center justify-between">
                      <span className="text-white font-medium">Total Labor Cost</span>
                      <span className="text-[#57ACAF] text-lg font-medium">${calculateLaborTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Other Costs Section */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                    <h3 className="text-white mb-4 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#6F83A7]" />
                      Other Costs
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="overheadCost" className="text-[#6F83A7]">
                          Overhead Cost ($)
                        </Label>
                        <Input
                          id="overheadCost"
                          type="number"
                          step="0.01"
                          value={formData.overheadCost}
                          onChange={(e) => setFormData({ ...formData, overheadCost: e.target.value })}
                          placeholder="0.85"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="freightCost" className="text-[#6F83A7]">
                          Freight Cost ($)
                        </Label>
                        <Input
                          id="freightCost"
                          type="number"
                          step="0.01"
                          value={formData.freightCost}
                          onChange={(e) => setFormData({ ...formData, freightCost: e.target.value })}
                          placeholder="0.35"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white mb-2">Cost Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-[#6F83A7]">Material Cost</span>
                            <span className="text-white">${calculateMaterialTotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[#6F83A7]">Labor Cost</span>
                            <span className="text-white">${calculateLaborTotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[#6F83A7]">Overhead Cost</span>
                            <span className="text-white">${(parseFloat(formData.overheadCost) || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[#6F83A7]">Freight Cost</span>
                            <span className="text-white">${(parseFloat(formData.freightCost) || 0).toFixed(2)}</span>
                          </div>
                          <div className="h-px bg-white/20 my-2" />
                          <div className="flex justify-between">
                            <span className="text-white font-medium">Total Cost</span>
                            <span className="text-white font-medium text-lg">${calculateTotalCost().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6F83A7]">Target Margin</span>
                            <span className="text-[#EAB308]">{formData.targetMargin}%</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-[#57ACAF]/20 border border-[#57ACAF]/30 mt-2">
                            <span className="text-white font-medium">FOB Price</span>
                            <span className="text-[#57ACAF] text-xl font-medium">${calculateFOB().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 p-6 bg-gradient-to-r from-white/5 via-transparent to-white/5">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  Cancel
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => toast.info('Saving as draft...')}
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white border-none hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Create Cost Sheet
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
