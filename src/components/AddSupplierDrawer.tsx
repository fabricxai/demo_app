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
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Upload,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Shield,
  Award,
  Package,
  DollarSign,
  Truck,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

interface AddSupplierDrawerProps {
  open: boolean;
  onClose: () => void;
  onAskMarbim?: (prompt: string) => void;
}

export function AddSupplierDrawer({ open, onClose, onAskMarbim }: AddSupplierDrawerProps) {
  const [formData, setFormData] = useState({
    supplierName: '',
    category: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    website: '',
    taxId: '',
    businessLicense: '',
    productCategories: [] as string[],
    paymentTerms: '',
    minimumOrderQty: '',
    leadTime: '',
    certifications: [] as string[],
    contactPerson: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
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
    if (!formData.supplierName || !formData.category || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Submit logic here
    toast.success('Supplier added successfully');
    onClose();
  };

  const handleAIRecommendation = () => {
    if (onAskMarbim) {
      onAskMarbim(
        `Based on the supplier information for ${formData.supplierName} in ${formData.category} category, recommend optimal evaluation criteria, suggest competitive pricing benchmarks, and provide compliance checklist.`
      );
    }
  };

  const toggleProductCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  const toggleCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
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
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl text-white mb-1">Add New Supplier</h2>
                    <p className="text-sm text-[#6F83A7]">Register a new supplier in your directory</p>
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
                  <div className="text-xs text-[#6F83A7] mb-1">Total Suppliers</div>
                  <div className="text-lg text-white">127</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Active</div>
                  <div className="text-lg text-[#57ACAF]">98</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Avg Rating</div>
                  <div className="text-lg text-white">4.6</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Categories</div>
                  <div className="text-lg text-white">12</div>
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
                          <h4 className="text-white mb-1">MARBIM Smart Insights</h4>
                          <p className="text-xs text-[#6F83A7]">
                            Get AI-powered recommendations for supplier evaluation criteria and compliance requirements
                          </p>
                        </div>
                      </div>
                      <MarbimAIButton onClick={handleAIRecommendation} />
                    </div>
                    {formData.supplierName && formData.category && (
                      <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                          <div className="text-sm text-white">
                            AI will generate customized evaluation criteria for {formData.category} suppliers
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Basic Information */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">
                          Supplier Name <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          value={formData.supplierName}
                          onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                          placeholder="e.g., GlobalFabrics Inc."
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">
                          Category <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fabric">Fabric Supplier</SelectItem>
                            <SelectItem value="trim">Trim Supplier</SelectItem>
                            <SelectItem value="yarn">Yarn Supplier</SelectItem>
                            <SelectItem value="accessory">Accessory Supplier</SelectItem>
                            <SelectItem value="button">Button & Zipper</SelectItem>
                            <SelectItem value="packaging">Packaging</SelectItem>
                            <SelectItem value="dyeing">Dyeing & Printing</SelectItem>
                            <SelectItem value="embroidery">Embroidery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">
                          Country <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bangladesh">Bangladesh</SelectItem>
                            <SelectItem value="china">China</SelectItem>
                            <SelectItem value="india">India</SelectItem>
                            <SelectItem value="vietnam">Vietnam</SelectItem>
                            <SelectItem value="turkey">Turkey</SelectItem>
                            <SelectItem value="pakistan">Pakistan</SelectItem>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="italy">Italy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">City</Label>
                        <Input
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g., Dhaka"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Address</Label>
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Street address"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Contact Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">
                          Email Address <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="supplier@example.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Phone Number</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+880 123 456 7890"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">Website</Label>
                        <Input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://www.example.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Contact Person</Label>
                        <Input
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          placeholder="John Doe"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Contact Title</Label>
                        <Input
                          value={formData.contactTitle}
                          onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                          placeholder="Sales Manager"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Contact Email</Label>
                        <Input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          placeholder="john.doe@example.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Contact Phone</Label>
                        <Input
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          placeholder="+880 123 456 7890"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Business Details</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Tax ID / VAT Number</Label>
                        <Input
                          value={formData.taxId}
                          onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                          placeholder="e.g., 123456789"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Business License Number</Label>
                        <Input
                          value={formData.businessLicense}
                          onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                          placeholder="e.g., BL-2024-001"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Payment Terms</Label>
                        <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="net30">Net 30</SelectItem>
                            <SelectItem value="net60">Net 60</SelectItem>
                            <SelectItem value="net90">Net 90</SelectItem>
                            <SelectItem value="advance">Advance Payment</SelectItem>
                            <SelectItem value="cod">Cash on Delivery</SelectItem>
                            <SelectItem value="lc">Letter of Credit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Minimum Order Quantity</Label>
                        <Input
                          value={formData.minimumOrderQty}
                          onChange={(e) => setFormData({ ...formData, minimumOrderQty: e.target.value })}
                          placeholder="e.g., 1000 units"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Lead Time (days)</Label>
                        <Input
                          type="number"
                          value={formData.leadTime}
                          onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                          placeholder="e.g., 30"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Categories */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Product Categories</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['Cotton', 'Polyester', 'Denim', 'Silk', 'Linen', 'Wool', 'Spandex', 'Nylon', 'Rayon', 'Viscose', 'Buttons', 'Zippers'].map((category) => (
                        <Badge
                          key={category}
                          onClick={() => toggleProductCategory(category)}
                          className={`cursor-pointer transition-all duration-180 ${
                            formData.productCategories.includes(category)
                              ? 'bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30 hover:bg-[#57ACAF]/30'
                              : 'bg-white/5 text-[#6F83A7] border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {formData.productCategories.includes(category) && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Certifications & Standards</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['ISO 9001', 'ISO 14001', 'OEKO-TEX', 'GOTS', 'BSCI', 'WRAP', 'SA8000', 'BCI', 'Fairtrade'].map((cert) => (
                        <Badge
                          key={cert}
                          onClick={() => toggleCertification(cert)}
                          className={`cursor-pointer transition-all duration-180 ${
                            formData.certifications.includes(cert)
                              ? 'bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 hover:bg-[#EAB308]/30'
                              : 'bg-white/5 text-[#6F83A7] border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {formData.certifications.includes(cert) && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Description & Notes</h3>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#6F83A7]">Supplier Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide details about the supplier's capabilities, specialties, or any additional notes..."
                        rows={5}
                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] resize-none"
                      />
                    </div>
                  </div>

                  {/* File Attachments */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#57ACAF]" />
                        <h3 className="text-white">Documents & Attachments</h3>
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
                          Attach business licenses, certificates, or company profile documents
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Important Notice */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                    <AlertCircle className="w-5 h-5 text-[#57ACAF] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-white mb-1">Supplier Onboarding Guidelines</div>
                      <div className="text-xs text-[#6F83A7]">
                        • Verify all business licenses and certifications before approval
                        <br />
                        • Conduct initial quality and compliance assessment within 30 days
                        <br />
                        • Request sample materials for evaluation before placing orders
                        <br />• Schedule supplier audit for high-value partnerships
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
                  <Shield className="w-4 h-4" />
                  <span>Supplier will be added to pending approval list</span>
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
                    <Plus className="w-4 h-4 mr-2" />
                    Add Supplier
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
