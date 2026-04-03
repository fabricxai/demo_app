import { useState, useRef } from 'react';
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
  Package,
  Users,
  Calendar,
  FileText,
  Upload,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Layers,
  Ruler,
  Palette,
  Tag,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';

interface RequestSampleDrawerProps {
  open: boolean;
  onClose: () => void;
  onAskMarbim?: (prompt: string) => void;
}

export function RequestSampleDrawer({ open, onClose, onAskMarbim }: RequestSampleDrawerProps) {
  const [formData, setFormData] = useState({
    supplier: '',
    sampleType: '',
    material: '',
    fabricType: '',
    color: '',
    gsm: '',
    quantity: '',
    width: '',
    construction: '',
    finish: '',
    priority: 'medium',
    requiredDate: '',
    purpose: '',
    notes: '',
    referenceNumber: '',
  });

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) attached`);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    toast.info('File removed');
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.supplier || !formData.sampleType || !formData.material) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Submit logic here
    toast.success('Sample request submitted successfully');
    onClose();
  };

  const handleAIRecommendation = () => {
    if (onAskMarbim) {
      onAskMarbim(
        `Based on the sample request for ${formData.material} from ${formData.supplier}, recommend the best suppliers with similar materials, suggest optimal sample quantities, and predict lead times.`
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

              <div className="relative flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl text-white mb-1">Request Sample</h2>
                    <p className="text-sm text-[#6F83A7]">Submit a new material sample request to suppliers</p>
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
                  <div className="text-xs text-[#6F83A7] mb-1">Avg Lead Time</div>
                  <div className="text-lg text-white">7-14 days</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Active Samples</div>
                  <div className="text-lg text-white">38</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Success Rate</div>
                  <div className="text-lg text-[#57ACAF]">94%</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Pending Approval</div>
                  <div className="text-lg text-[#EAB308]">5</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-6 py-6">
                <div className="space-y-6">
                {/* AI Recommendation Card */}
                <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white mb-1">MARBIM Smart Recommendations</h4>
                        <p className="text-xs text-[#6F83A7]">
                          Get AI-powered supplier suggestions based on your requirements
                        </p>
                      </div>
                    </div>
                    <MarbimAIButton onClick={handleAIRecommendation} />
                  </div>
                  {formData.material && formData.supplier && (
                    <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                        <div className="text-sm text-white">
                          Based on your selection, 3 similar suppliers available with avg 10-day delivery
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Supplier & Basic Information */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-[#57ACAF]" />
                    <h3 className="text-white">Supplier & Basic Information</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#6F83A7]">
                        Supplier <span className="text-[#D0342C]">*</span>
                      </Label>
                      <Select value={formData.supplier} onValueChange={(value) => setFormData({ ...formData, supplier: value })}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="knittex">KnitTex</SelectItem>
                          <SelectItem value="globalfabrics">GlobalFabrics</SelectItem>
                          <SelectItem value="yarnpro">YarnPro</SelectItem>
                          <SelectItem value="trimworks">TrimWorks</SelectItem>
                          <SelectItem value="abctrims">ABC Trims</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6F83A7]">
                        Sample Type <span className="text-[#D0342C]">*</span>
                      </Label>
                      <Select value={formData.sampleType} onValueChange={(value) => setFormData({ ...formData, sampleType: value })}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fabric">Fabric</SelectItem>
                          <SelectItem value="trim">Trim</SelectItem>
                          <SelectItem value="yarn">Yarn</SelectItem>
                          <SelectItem value="accessory">Accessory</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6F83A7]">
                        Material/Product Name <span className="text-[#D0342C]">*</span>
                      </Label>
                      <Input
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        placeholder="e.g., Cotton Jersey, Polyester Yarn"
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6F83A7]">Reference Number</Label>
                      <Input
                        value={formData.referenceNumber}
                        onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                        placeholder="e.g., PO-2024-1234"
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>
                  </div>
                </div>

                {/* Material Specifications */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-[#57ACAF]" />
                    <h3 className="text-white">Material Specifications</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#6F83A7] flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Fabric Type
                      </Label>
                      <Input
                        value={formData.fabricType}
                        onChange={(e) => setFormData({ ...formData, fabricType: e.target.value })}
                        placeholder="e.g., Knit, Woven, Non-woven"
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6F83A7] flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Color/Shade
                      </Label>
                      <Input
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="e.g., Navy Blue, RAL 5005"
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6F83A7] flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        GSM (Grams per Square Meter)
                      </Label>
                      <Input
                        value={formData.gsm}
                        onChange={(e) => setFormData({ ...formData, gsm: e.target.value })}
                        placeholder="e.g., 180"
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6F83A7] flex items-center gap-2">
                        <Ruler className="w-4 h-4" />
                        Width (inches)
                      </Label>
                      <Input
                        value={formData.width}
                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                        placeholder="e.g., 60"
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[#6F83A7]">Construction</Label>
                      <Input
                        value={formData.construction}
                        onChange={(e) => setFormData({ ...formData, construction: e.target.value })}
                        placeholder="e.g., Single Jersey, 30s Combed Cotton"
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[#6F83A7]">Finish/Treatment</Label>
                      <Input
                        value={formData.finish}
                        onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                        placeholder="e.g., Enzyme Wash, Anti-Pilling, Moisture Wicking"
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-[#57ACAF]" />
                    <h3 className="text-white">Request Details</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#6F83A7]">Sample Quantity</Label>
                      <Input
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="e.g., 5 meters, 10 yards"
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6F83A7]">
                        Required By Date <span className="text-[#D0342C]">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={formData.requiredDate}
                        onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6F83A7]">Priority Level</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#6F83A7]" />
                              Low Priority
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#EAB308]" />
                              Medium Priority
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#D0342C]" />
                              High Priority
                            </div>
                          </SelectItem>
                          <SelectItem value="urgent">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#D0342C]" />
                              Urgent
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6F83A7]">Purpose</Label>
                      <Select value={formData.purpose} onValueChange={(value) => setFormData({ ...formData, purpose: value })}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">Product Development</SelectItem>
                          <SelectItem value="testing">Quality Testing</SelectItem>
                          <SelectItem value="buyer-approval">Buyer Approval</SelectItem>
                          <SelectItem value="production-trial">Production Trial</SelectItem>
                          <SelectItem value="color-matching">Color Matching</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[#6F83A7]">Additional Notes</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Provide any specific requirements, instructions, or reference details..."
                        rows={4}
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* File Attachments */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Attachments</h3>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="*/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {attachedFiles.length > 0 ? (
                    <div className="space-y-2">
                      {attachedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="group flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText className="w-4 h-4 text-[#57ACAF] shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white truncate">{file.name}</div>
                              <div className="text-xs text-[#6F83A7]">
                                {(file.size / 1024).toFixed(1)} KB
                              </div>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D0342C] hover:bg-[#D0342C]/10 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-white/10 rounded-lg">
                      <Upload className="w-8 h-8 text-[#6F83A7] mx-auto mb-2" />
                      <p className="text-sm text-[#6F83A7]">
                        Attach reference images, tech packs, or specifications
                      </p>
                    </div>
                  )}
                </div>

                {/* Important Notice */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                  <AlertCircle className="w-5 h-5 text-[#57ACAF] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Sample Request Guidelines</div>
                    <div className="text-xs text-[#6F83A7]">
                      • Ensure all required specifications are provided for accurate sampling
                      <br />
                      • Standard lead time is 7-14 days depending on supplier and material type
                      <br />
                      • Include reference images or tech packs for complex requirements
                      <br />• High priority requests will be escalated to suppliers immediately
                    </div>
                  </div>
                </div>
              </div>
              </ScrollArea>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-6 bg-gradient-to-r from-white/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#6F83A7]">
                  <Clock className="w-4 h-4" />
                  <span>Request will be sent to supplier within 2 hours</span>
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
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
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
