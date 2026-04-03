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
  Target,
  UserPlus,
  Briefcase,
  DollarSign,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';

interface AddLeadDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (leadData: any) => void;
  onAskMarbim?: (prompt: string) => void;
}

export function AddLeadDrawer({ open, onClose, onSubmit, onAskMarbim }: AddLeadDrawerProps) {
  const [formData, setFormData] = useState({
    leadName: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    website: '',
    jobTitle: '',
    industry: '',
    source: '',
    productInterest: [] as string[],
    estimatedOrderValue: '',
    estimatedQuantity: '',
    targetDeliveryDate: '',
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
    if (!formData.leadName || !formData.company || !formData.email) {
      toast.error('Please fill in all required fields (Name, Company, Email)');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Create lead data object
    const leadData = {
      ...formData,
      id: `lead-${Date.now()}`,
      status: 'New',
      score: calculateInitialScore(),
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      attachments: attachedFiles.map(f => f.name),
    };

    // Call onSubmit callback if provided
    if (onSubmit) {
      onSubmit(leadData);
    }

    toast.success('Lead added successfully');
    onClose();
    
    // Reset form
    setFormData({
      leadName: '',
      company: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      address: '',
      website: '',
      jobTitle: '',
      industry: '',
      source: '',
      productInterest: [],
      estimatedOrderValue: '',
      estimatedQuantity: '',
      targetDeliveryDate: '',
      description: '',
      companySize: '',
      annualRevenue: '',
      preferredCommunication: '',
    });
    setAttachedFiles([]);
  };

  const calculateInitialScore = () => {
    let score = 50; // Base score
    
    // Increase score based on filled fields
    if (formData.website) score += 10;
    if (formData.industry) score += 5;
    if (formData.estimatedOrderValue) score += 15;
    if (formData.productInterest.length > 0) score += 10;
    if (formData.source === 'Referral' || formData.source === 'LinkedIn') score += 10;
    
    return Math.min(score, 100);
  };

  const handleAIRecommendation = () => {
    if (onAskMarbim) {
      onAskMarbim(
        `Based on the lead information for ${formData.leadName} from ${formData.company} in ${formData.country} (${formData.industry} industry), recommend optimal engagement strategies, suggest initial outreach approach, provide lead scoring insights, and create a customized follow-up plan. Consider their product interest: ${formData.productInterest.join(', ')}.`
      );
    }
  };

  const toggleProductInterest = (product: string) => {
    setFormData(prev => ({
      ...prev,
      productInterest: prev.productInterest.includes(product)
        ? prev.productInterest.filter(p => p !== product)
        : [...prev.productInterest, product]
    }));
  };

  const productTypes = [
    'T-Shirts',
    'Polo Shirts',
    'Dresses',
    'Pants & Trousers',
    'Jackets & Outerwear',
    'Activewear',
    'Denim',
    'Knitwear',
    'Intimates',
    'Accessories',
    'Home Textiles',
    'Uniforms',
  ];

  const leadSources = [
    'LinkedIn',
    'Website Form',
    'Referral',
    'Trade Show',
    'Cold Email',
    'Phone Call',
    'Partner',
    'Advertisement',
    'Social Media',
    'Other',
  ];

  const industries = [
    'Fashion Retail',
    'E-commerce',
    'Wholesale Distribution',
    'Corporate Uniforms',
    'Sports & Activewear',
    'Hospitality',
    'Healthcare',
    'Manufacturing',
    'Other',
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
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl text-white mb-1">Add New Lead</h2>
                    <p className="text-sm text-[#6F83A7]">Capture a new potential customer</p>
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
                  <div className="text-xs text-[#6F83A7] mb-1">Total Leads</div>
                  <div className="text-lg text-white">127</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">This Month</div>
                  <div className="text-lg text-[#57ACAF]">48</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Conversion</div>
                  <div className="text-lg text-white">32%</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Avg Score</div>
                  <div className="text-lg text-white">78</div>
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
                            Get AI-powered recommendations for lead qualification, engagement strategies, and conversion tactics
                          </p>
                        </div>
                      </div>
                      <MarbimAIButton onClick={handleAIRecommendation} />
                    </div>
                    {formData.leadName && formData.company && (
                      <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#57ACAF] shrink-0 mt-0.5" />
                          <div className="text-sm text-white">
                            AI will generate customized engagement plan for {formData.leadName} from {formData.company}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Contact Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">
                          Contact Name <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          value={formData.leadName}
                          onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                          placeholder="e.g., John Smith"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">
                          Job Title
                        </Label>
                        <Input
                          value={formData.jobTitle}
                          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                          placeholder="e.g., Purchasing Manager"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">
                          Email <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john.smith@company.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">
                          Phone
                        </Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1-555-123-4567"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">
                          Preferred Communication
                        </Label>
                        <Select
                          value={formData.preferredCommunication}
                          onValueChange={(value) => setFormData({ ...formData, preferredCommunication: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select preferred communication method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="video-call">Video Call</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Company Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">
                          Company Name <span className="text-[#D0342C]">*</span>
                        </Label>
                        <Input
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g., Fashion Retailers Inc."
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Industry</Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(value) => setFormData({ ...formData, industry: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map(industry => (
                              <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Company Size</Label>
                        <Select
                          value={formData.companySize}
                          onValueChange={(value) => setFormData({ ...formData, companySize: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                            <SelectItem value="501+">501+ employees</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Label className="text-[#6F83A7]">Annual Revenue</Label>
                        <Select
                          value={formData.annualRevenue}
                          onValueChange={(value) => setFormData({ ...formData, annualRevenue: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-500k">$0 - $500K</SelectItem>
                            <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                            <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                            <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                            <SelectItem value="10m+">$10M+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Country</Label>
                        <Input
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          placeholder="e.g., United States"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
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

                  {/* Lead Source & Qualification */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Lead Source & Qualification</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Lead Source</Label>
                        <Select
                          value={formData.source}
                          onValueChange={(value) => setFormData({ ...formData, source: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="How did they find us?" />
                          </SelectTrigger>
                          <SelectContent>
                            {leadSources.map(source => (
                              <SelectItem key={source} value={source}>{source}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Estimated Order Value</Label>
                        <Input
                          value={formData.estimatedOrderValue}
                          onChange={(e) => setFormData({ ...formData, estimatedOrderValue: e.target.value })}
                          placeholder="e.g., $50,000"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Estimated Quantity</Label>
                        <Input
                          value={formData.estimatedQuantity}
                          onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                          placeholder="e.g., 5,000 units"
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6F83A7]">Target Delivery Date</Label>
                        <Input
                          type="date"
                          value={formData.targetDeliveryDate}
                          onChange={(e) => setFormData({ ...formData, targetDeliveryDate: e.target.value })}
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">Product Interest</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {productTypes.map(product => (
                            <Badge
                              key={product}
                              variant="outline"
                              className={`cursor-pointer transition-all duration-200 ${
                                formData.productInterest.includes(product)
                                  ? 'bg-[#57ACAF]/20 border-[#57ACAF] text-[#57ACAF]'
                                  : 'border-white/10 text-[#6F83A7] hover:border-white/30'
                              }`}
                              onClick={() => toggleProductInterest(product)}
                            >
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label className="text-[#6F83A7]">Additional Notes</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Any additional information about this lead..."
                          rows={4}
                          className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Attachments */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-[#57ACAF]" />
                      <h3 className="text-white">Attachments</h3>
                    </div>

                    <div className="space-y-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="*/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      <Button
                        variant="outline"
                        className="w-full border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Files (Business cards, brochures, etc.)
                      </Button>

                      {attachedFiles.length > 0 && (
                        <div className="space-y-2">
                          {attachedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-180"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <FileText className="w-4 h-4 text-[#57ACAF] shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm text-white truncate">{file.name}</p>
                                  <p className="text-xs text-[#6F83A7]">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-[#D0342C] hover:text-[#D0342C] hover:bg-[#D0342C]/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 p-6 bg-gradient-to-t from-black/20 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
                  <AlertCircle className="w-4 h-4" />
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
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Lead
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
