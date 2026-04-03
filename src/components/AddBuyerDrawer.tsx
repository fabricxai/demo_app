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
  CreditCard,
  Star,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface AddBuyerDrawerProps {
  open: boolean;
  onClose: () => void;
  onAskMarbim?: (prompt: string) => void;
}

export function AddBuyerDrawer({ open, onClose, onAskMarbim }: AddBuyerDrawerProps) {
  const [formData, setFormData] = useState({
    buyerName: '',
    tier: '',
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
    creditLimit: '',
    orderFrequency: '',
    contactPerson: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    companySize: '',
    annualRevenue: '',
    preferredCommunication: '',
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
    if (!formData.buyerName || !formData.tier || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Submit logic here
    toast.success('Buyer added successfully');
    onClose();
  };

  const handleAIRecommendation = () => {
    if (onAskMarbim) {
      onAskMarbim(
        `Based on the buyer information for ${formData.buyerName} (${formData.tier} tier) in ${formData.country}, recommend optimal engagement strategies, suggest credit limit and payment terms, provide relationship management best practices, and create a customized onboarding plan.`
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

  const productCategories = [
    'T-Shirts',
    'Dresses',
    'Pants & Trousers',
    'Jackets & Outerwear',
    'Activewear',
    'Denim',
    'Knitwear',
    'Intimates',
    'Accessories',
    'Home Textiles',
  ];

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
                    <h2 className="text-xl text-white mb-1">Add New Buyer</h2>
                    <p className="text-sm text-[#6F83A7]">Onboard a new buyer to your portfolio</p>
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
                  <div className="text-xs text-[#6F83A7] mb-1">Total Buyers</div>
                  <div className="text-lg text-white">93</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Tier A</div>
                  <div className="text-lg text-[#57ACAF]">12</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Avg Health</div>
                  <div className="text-lg text-white">82%</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">YTD Revenue</div>
                  <div className="text-lg text-white">$3.2M</div>
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
                            Get AI-powered recommendations for buyer onboarding, engagement strategies, and credit terms
                          </p>
                        </div>
                      </div>
                      <MarbimAIButton onClick={handleAIRecommendation} />
                    </div>
                    {formData.buyerName && formData.tier && (
                      <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                          <div className="text-sm text-white">
                            AI will generate customized engagement plan for {formData.tier}-tier buyer
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
                          Buyer Name <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          value={formData.buyerName}
                          onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                          placeholder="e.g., H&M International"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">
                          Tier Classification <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select tier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Tier A - Strategic Partner</SelectItem>
                            <SelectItem value="B">Tier B - Regular Client</SelectItem>
                            <SelectItem value="C">Tier C - Emerging Buyer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Company Size</Label>
                        <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small (1-50 employees)</SelectItem>
                            <SelectItem value="medium">Medium (51-500 employees)</SelectItem>
                            <SelectItem value="large">Large (501-5000 employees)</SelectItem>
                            <SelectItem value="enterprise">Enterprise (5000+ employees)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">Business Description</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Brief description of the buyer's business..."
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] min-h-[80px]"
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
                          placeholder="buyer@company.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Phone Number</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Country</Label>
                        <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USA">United States</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Spain">Spain</SelectItem>
                            <SelectItem value="Sweden">Sweden</SelectItem>
                            <SelectItem value="Netherlands">Netherlands</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="Japan">Japan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">City</Label>
                        <Input
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g., New York"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">Street Address</Label>
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="123 Main Street"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Website</Label>
                        <Input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://www.company.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Preferred Communication</Label>
                        <Select value={formData.preferredCommunication} onValueChange={(value) => setFormData({ ...formData, preferredCommunication: value })}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="video">Video Call</SelectItem>
                            <SelectItem value="in-person">In-Person</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Primary Contact Person */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <UserCheck className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Primary Contact Person</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Full Name</Label>
                        <Input
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          placeholder="e.g., John Smith"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Job Title</Label>
                        <Input
                          value={formData.contactTitle}
                          onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                          placeholder="e.g., Procurement Manager"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Contact Email</Label>
                        <Input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          placeholder="john.smith@company.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Contact Phone</Label>
                        <Input
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Terms */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Business Terms</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Payment Terms</Label>
                        <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select terms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="net-30">Net 30</SelectItem>
                            <SelectItem value="net-45">Net 45</SelectItem>
                            <SelectItem value="net-60">Net 60</SelectItem>
                            <SelectItem value="net-90">Net 90</SelectItem>
                            <SelectItem value="advance">Advance Payment</SelectItem>
                            <SelectItem value="cod">Cash on Delivery</SelectItem>
                            <SelectItem value="lc">Letter of Credit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Credit Limit</Label>
                        <Input
                          value={formData.creditLimit}
                          onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                          placeholder="e.g., $500,000"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Expected Order Frequency</Label>
                        <Select value={formData.orderFrequency} onValueChange={(value) => setFormData({ ...formData, orderFrequency: value })}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="seasonal">Seasonal</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Annual Revenue Estimate</Label>
                        <Input
                          value={formData.annualRevenue}
                          onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                          placeholder="e.g., $1,200,000"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Categories */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Product Categories of Interest</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {productCategories.map((category) => (
                        <Badge
                          key={category}
                          className={`cursor-pointer transition-all ${
                            formData.productCategories.includes(category)
                              ? 'bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/40'
                              : 'bg-white/5 text-[#6F83A7] border-white/10 hover:bg-white/10'
                          }`}
                          onClick={() => toggleProductCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Legal & Compliance */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Legal & Compliance</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Tax ID / VAT Number</Label>
                        <Input
                          value={formData.taxId}
                          onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                          placeholder="e.g., 12-3456789"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Business License Number</Label>
                        <Input
                          value={formData.businessLicense}
                          onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                          placeholder="License number"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Attachments */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Document Attachments</h3>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="file"
                        multiple
                        accept="*/*"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      <Button
                        variant="outline"
                        className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Documents (Contracts, Certificates, etc.)
                      </Button>

                      {attachedFiles.length > 0 && (
                        <div className="space-y-2">
                          {attachedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-180"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-[#57ACAF]" />
                                <div>
                                  <div className="text-sm text-white">{file.name}</div>
                                  <div className="text-xs text-[#6F83A7]">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="opacity-0 group-hover:opacity-100 text-[#D0342C] hover:bg-[#D0342C]/10 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-[#6F83A7]">
                        Upload buyer agreements, compliance certificates, or any relevant documentation
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 p-6 bg-gradient-to-r from-white/5 via-transparent to-white/5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
                  <AlertCircle className="w-4 h-4" />
                  <span>Fields marked with * are required</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-white/10 text-white hover:bg-white/5 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Add Buyer
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
