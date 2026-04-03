import { motion, AnimatePresence } from 'motion/react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { useState, useRef } from 'react';
import { 
  X, Send, Users, FileText, MessageSquare, CheckCircle,
  Building2, Star, MapPin, Clock, Target, DollarSign,
  Calendar, Package, Shield, Award, TrendingUp, Sparkles,
  Search, Filter, AlertCircle, Eye, Plus, Minus, Edit2,
  Paperclip, Trash2, Copy, Zap, ChevronRight, Globe, Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { MarbimAIButton } from './MarbimAIButton';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Supplier {
  id: string;
  name: string;
  country: string;
  rating: number;
  leadTime: string;
  capacity: string;
  specialization: string[];
  pastPerformance: number;
  price: string;
  certifications: string[];
  responseRate: number;
  logo?: string;
}

interface RFQItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  specifications: string;
  urgency: 'high' | 'medium' | 'low';
}

interface BroadcastRFQDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rfqData?: any;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
}

export function BroadcastRFQDrawer({ 
  isOpen, 
  onClose, 
  rfqData,
  onAskMarbim,
  onOpenAI
}: BroadcastRFQDrawerProps) {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');
  const [customMessage, setCustomMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler to send prompt to AI and close this drawer
  const handleAskMarbim = (prompt: string) => {
    if (onAskMarbim) {
      onAskMarbim(prompt);
    }
    if (onOpenAI) {
      onOpenAI();
    }
  };

  // Mock supplier data
  const allSuppliers: Supplier[] = [
    {
      id: 'SUP001',
      name: 'Premium Textiles Ltd',
      country: 'Bangladesh',
      rating: 4.8,
      leadTime: '25-30 days',
      capacity: 'High (50K+ units/month)',
      specialization: ['Cotton', 'Blended Fabrics', 'Sustainable Materials'],
      pastPerformance: 96,
      price: '$$',
      certifications: ['OEKO-TEX', 'GOTS', 'ISO 9001'],
      responseRate: 95,
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=premium'
    },
    {
      id: 'SUP002',
      name: 'Global Fabric Solutions',
      country: 'China',
      rating: 4.6,
      leadTime: '20-25 days',
      capacity: 'Very High (100K+ units/month)',
      specialization: ['Polyester', 'Synthetic Blends', 'Technical Fabrics'],
      pastPerformance: 92,
      price: '$',
      certifications: ['ISO 9001', 'ISO 14001'],
      responseRate: 88,
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=global'
    },
    {
      id: 'SUP003',
      name: 'EcoTextile Manufacturing',
      country: 'India',
      rating: 4.9,
      leadTime: '30-35 days',
      capacity: 'Medium (30K+ units/month)',
      specialization: ['Organic Cotton', 'Hemp', 'Bamboo', 'Recycled Materials'],
      pastPerformance: 98,
      price: '$$$',
      certifications: ['GOTS', 'Fair Trade', 'OEKO-TEX', 'GRS'],
      responseRate: 97,
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=eco'
    },
    {
      id: 'SUP004',
      name: 'Rapid Fashion Supplies',
      country: 'Vietnam',
      rating: 4.4,
      leadTime: '15-20 days',
      capacity: 'High (60K+ units/month)',
      specialization: ['Quick Turnaround', 'Cotton', 'Polyester Blends'],
      pastPerformance: 89,
      price: '$$',
      certifications: ['ISO 9001', 'WRAP'],
      responseRate: 92,
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=rapid'
    },
    {
      id: 'SUP005',
      name: 'Luxury Fabric House',
      country: 'Italy',
      rating: 4.7,
      leadTime: '40-45 days',
      capacity: 'Low (10K+ units/month)',
      specialization: ['Silk', 'Wool', 'Premium Blends', 'Luxury Materials'],
      pastPerformance: 94,
      price: '$$$$',
      certifications: ['OEKO-TEX', 'Woolmark', 'ISO 9001'],
      responseRate: 90,
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=luxury'
    },
    {
      id: 'SUP006',
      name: 'TechFabric Innovations',
      country: 'South Korea',
      rating: 4.5,
      leadTime: '25-30 days',
      capacity: 'Medium (35K+ units/month)',
      specialization: ['Performance Fabrics', 'Waterproof', 'Breathable', 'Anti-Microbial'],
      pastPerformance: 91,
      price: '$$$',
      certifications: ['ISO 9001', 'Bluesign'],
      responseRate: 86,
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=tech'
    },
  ];

  // Mock RFQ items
  const rfqItems: RFQItem[] = [
    {
      id: 'ITEM001',
      name: 'Cotton Fabric - Premium Grade',
      quantity: 5000,
      unit: 'yards',
      specifications: '200 GSM, Premium Cotton Blend, OEKO-TEX certified',
      urgency: 'high'
    },
    {
      id: 'ITEM002',
      name: 'Polyester Blend - Standard',
      quantity: 3000,
      unit: 'yards',
      specifications: '150 GSM, Polyester/Cotton 65/35 blend',
      urgency: 'medium'
    },
    {
      id: 'ITEM003',
      name: 'Sustainable Hemp Fabric',
      quantity: 2000,
      unit: 'yards',
      specifications: '180 GSM, 100% Organic Hemp, GOTS certified',
      urgency: 'low'
    },
  ];

  // Filter suppliers based on search and filters
  const filteredSuppliers = allSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          supplier.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          supplier.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRating = filterRating === 'all' || 
                          (filterRating === '4.5+' && supplier.rating >= 4.5) ||
                          (filterRating === '4.0+' && supplier.rating >= 4.0);
    
    const matchesLocation = filterLocation === 'all' || supplier.country === filterLocation;
    
    return matchesSearch && matchesRating && matchesLocation;
  });

  // Toggle supplier selection
  const toggleSupplier = (supplierId: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId) 
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  // Toggle item selection
  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Select all/none
  const selectAllSuppliers = () => {
    setSelectedSuppliers(filteredSuppliers.map(s => s.id));
  };

  const deselectAllSuppliers = () => {
    setSelectedSuppliers([]);
  };

  const selectAllItems = () => {
    setSelectedItems(rfqItems.map(i => i.id));
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  // File handling
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) attached`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle broadcast
  const handleBroadcast = () => {
    if (selectedSuppliers.length === 0) {
      toast.error('Please select at least one supplier');
      return;
    }
    if (selectedItems.length === 0) {
      toast.error('Please select at least one RFQ item');
      return;
    }
    if (!deadline) {
      toast.error('Please set a response deadline');
      return;
    }

    toast.success(`RFQ broadcasted to ${selectedSuppliers.length} supplier(s)`);
    onClose();
  };

  // Get selected supplier objects
  const selectedSupplierObjects = allSuppliers.filter(s => selectedSuppliers.includes(s.id));
  const selectedItemObjects = rfqItems.filter(i => selectedItems.includes(i.id));

  // Calculate estimated response
  const avgResponseRate = selectedSupplierObjects.length > 0
    ? selectedSupplierObjects.reduce((sum, s) => sum + s.responseRate, 0) / selectedSupplierObjects.length
    : 0;

  const tabs = [
    { id: 'suppliers', label: 'Select Suppliers', icon: Users },
    { id: 'items', label: 'RFQ Items', icon: Package },
    { id: 'message', label: 'Customize Message', icon: MessageSquare },
    { id: 'review', label: 'Review & Send', icon: CheckCircle },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drawer */}
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                      <Send className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl text-white mb-1">Broadcast RFQ</h2>
                      <p className="text-sm text-[#6F83A7]">Send request for quotation to multiple suppliers</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Suppliers Selected</div>
                      <div className="text-lg text-white">{selectedSuppliers.length}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Items Selected</div>
                      <div className="text-lg text-white">{selectedItems.length}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Priority</div>
                      <div className="text-lg text-white capitalize">{priority}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                      <div className="text-xs text-[#57ACAF] mb-1">Avg Response Rate</div>
                      <div className="text-lg text-white">{avgResponseRate.toFixed(0)}%</div>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-[#6F83A7] hover:text-white hover:bg-white/10 ml-6 shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-8 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-180 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white shadow-lg shadow-[#57ACAF]/20'
                          : 'text-[#6F83A7] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-8 py-6">
                {/* Tab 1: Select Suppliers */}
                {activeTab === 'suppliers' && (
                <div className="space-y-6">
                  {/* AI Suggestions Card */}
                  <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white mb-2">AI-Powered Supplier Recommendations</h3>
                        <p className="text-sm text-[#6F83A7] mb-3">
                          Based on your RFQ requirements, past performance, and current capacity, MARBIM suggests prioritizing suppliers with sustainable certifications and high response rates.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">EcoTextile Manufacturing</Badge>
                          <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">Premium Textiles Ltd</Badge>
                          <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">TechFabric Innovations</Badge>
                        </div>
                      </div>
                    </div>
                    <MarbimAIButton
                      prompt="Analyze all suppliers and recommend the best matches for my current RFQ based on specifications, lead time requirements, budget constraints, and past performance history. Include reasons for each recommendation."
                      onClick={handleAskMarbim}
                      label="Get Smart Match"
                    />
                  </div>

                  {/* Search and Filters */}
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                      <Input
                        placeholder="Search suppliers by name, location, or specialization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                      />
                    </div>
                    <Select value={filterRating} onValueChange={setFilterRating}>
                      <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="4.5+">4.5+ Stars</SelectItem>
                        <SelectItem value="4.0+">4.0+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterLocation} onValueChange={setFilterLocation}>
                      <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                        <SelectItem value="China">China</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="Vietnam">Vietnam</SelectItem>
                        <SelectItem value="Italy">Italy</SelectItem>
                        <SelectItem value="South Korea">South Korea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bulk Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#6F83A7]">
                      {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''} available
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={selectAllSuppliers}
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        Select All
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={deselectAllSuppliers}
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  {/* Supplier Cards */}
                  <div className="space-y-3">
                    {filteredSuppliers.map((supplier) => (
                      <div
                        key={supplier.id}
                        onClick={() => toggleSupplier(supplier.id)}
                        className={`p-5 rounded-xl border cursor-pointer transition-all duration-180 ${
                          selectedSuppliers.includes(supplier.id)
                            ? 'bg-[#57ACAF]/10 border-[#57ACAF]/30 shadow-lg shadow-[#57ACAF]/5'
                            : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <div className="pt-1">
                            <Checkbox
                              checked={selectedSuppliers.includes(supplier.id)}
                              onCheckedChange={() => toggleSupplier(supplier.id)}
                              className="border-white/20 data-[state=checked]:bg-[#57ACAF] data-[state=checked]:border-[#57ACAF]"
                            />
                          </div>

                          {/* Logo */}
                          <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                            {supplier.logo ? (
                              <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-6 h-6 text-[#6F83A7]" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-white mb-1">{supplier.name}</h3>
                                <div className="flex items-center gap-3 text-sm text-[#6F83A7]">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {supplier.country}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
                                    {supplier.rating}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {supplier.leadTime}
                                  </span>
                                </div>
                              </div>
                              <Badge className="bg-white/10 text-white border-white/20">
                                {supplier.price}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="text-xs">
                                <span className="text-[#6F83A7]">Capacity: </span>
                                <span className="text-white">{supplier.capacity}</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-[#6F83A7]">Response Rate: </span>
                                <span className="text-white">{supplier.responseRate}%</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-[#6F83A7]">Performance: </span>
                                <span className="text-white">{supplier.pastPerformance}%</span>
                              </div>
                            </div>

                            {/* Specializations */}
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {supplier.specialization.map((spec, idx) => (
                                <Badge key={idx} className="bg-[#6F83A7]/20 text-[#6F83A7] border-[#6F83A7]/30 text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>

                            {/* Certifications */}
                            <div className="flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5 text-[#57ACAF]" />
                              <span className="text-xs text-[#6F83A7]">
                                {supplier.certifications.join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: RFQ Items */}
              {activeTab === 'items' && (
                <div className="space-y-6">
                  {/* AI Configuration Card */}
                  <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white mb-2">Optimize RFQ Configuration</h3>
                        <p className="text-sm text-[#6F83A7]">
                          MARBIM can help set optimal quantities, adjust specifications for better quotes, and suggest deadline adjustments based on supplier lead times.
                        </p>
                      </div>
                    </div>
                    <MarbimAIButton
                      prompt="Review my RFQ items and suggest optimizations for quantities, specifications, and deadlines to maximize response quality and competitiveness. Consider market trends and supplier capabilities."
                      onClick={handleAskMarbim}
                      label="Optimize Items"
                    />
                  </div>

                  {/* RFQ Configuration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Response Deadline</label>
                      <Input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#6F83A7] mb-2">Priority Level</label>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="low">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Bulk Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#6F83A7]">
                      Select items to include in broadcast
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={selectAllItems}
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        Select All
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={deselectAllItems}
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  {/* Item Cards */}
                  <div className="space-y-3">
                    {rfqItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`p-5 rounded-xl border cursor-pointer transition-all duration-180 ${
                          selectedItems.includes(item.id)
                            ? 'bg-[#57ACAF]/10 border-[#57ACAF]/30 shadow-lg shadow-[#57ACAF]/5'
                            : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="pt-1">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => toggleItem(item.id)}
                              className="border-white/20 data-[state=checked]:bg-[#57ACAF] data-[state=checked]:border-[#57ACAF]"
                            />
                          </div>

                          <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-[#6F83A7]" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-white mb-1">{item.name}</h3>
                                <p className="text-sm text-[#6F83A7]">{item.specifications}</p>
                              </div>
                              <Badge className={
                                item.urgency === 'high' 
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                  : item.urgency === 'medium'
                                  ? 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'
                                  : 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20'
                              }>
                                {item.urgency.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-[#6F83A7]">
                                Quantity: <span className="text-white">{item.quantity.toLocaleString()} {item.unit}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Customize Message */}
              {activeTab === 'message' && (
                <div className="space-y-6">
                  {/* AI Message Generation */}
                  <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white mb-2">AI-Generated Message Templates</h3>
                        <p className="text-sm text-[#6F83A7] mb-3">
                          Let MARBIM craft a professional, persuasive message that highlights your requirements and encourages quick, competitive responses.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 bg-[rgba(255,255,255,0)]"
                            onClick={() => {
                              setCustomMessage('Dear Supplier,\n\nWe are seeking quotations for premium textile materials as detailed below. We value quality, competitive pricing, and reliable delivery timelines.\n\nPlease provide your best quote including:\n- Unit pricing with volume discounts\n- Lead time for production and delivery\n- Quality certifications and compliance documentation\n- Payment terms\n\nWe look forward to establishing a long-term partnership.\n\nBest regards');
                              toast.success('Formal template applied');
                            }}
                          >
                            Use Formal
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 bg-[rgba(255,255,255,0)]"
                            onClick={() => {
                              setCustomMessage('Hi there,\n\nLooking for quotes on some textile materials. Quick turnaround appreciated!\n\nNeed pricing, lead times, and any volume discounts you can offer.\n\nThanks!');
                              toast.success('Casual template applied');
                            }}
                          >
                            Use Casual
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 bg-[rgba(255,255,255,0)]"
                            onClick={() => {
                              setCustomMessage('URGENT RFQ\n\nImmediate quotation required for textile materials. Priority consideration for fast response times and competitive pricing.\n\nDeadline: ' + deadline + '\n\nQuick response appreciated.');
                              toast.success('Urgent template applied');
                            }}
                          >
                            Use Urgent
                          </Button>
                        </div>
                      </div>
                    </div>
                    <MarbimAIButton
                      prompt="Generate a professional RFQ message that will maximize response rates and quality quotes. Include all necessary details, set the right tone, and emphasize our key requirements and value proposition."
                      onClick={handleAskMarbim}
                      label="Generate Message"
                    />
                  </div>

                  {/* Message Editor */}
                  <div>
                    <label className="block text-sm text-[#6F83A7] mb-2">Custom Message to Suppliers</label>
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Enter your message to suppliers... (optional)"
                      rows={12}
                      className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] resize-none"
                    />
                    <p className="text-xs text-[#6F83A7] mt-2">
                      This message will be included with the RFQ details. Leave blank to use default template.
                    </p>
                  </div>

                  {/* File Attachments */}
                  <div>
                    <label className="block text-sm text-[#6F83A7] mb-2">Attachments</label>
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
                      onClick={handleAttachClick}
                      className="w-full border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] border-dashed"
                    >
                      <Paperclip className="w-4 h-4 mr-2" />
                      Attach Files (Specs, Drawings, etc.)
                    </Button>

                    {attachedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {attachedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-180"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-[#57ACAF] shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{file.name}</p>
                                <p className="text-xs text-[#6F83A7]">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveFile(index)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Review & Send */}
              {activeTab === 'review' && (
                <div className="space-y-6">
                  {/* AI Final Check */}
                  <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white mb-2">Pre-Broadcast Quality Check</h3>
                        <p className="text-sm text-[#6F83A7]">
                          MARBIM will review your RFQ for completeness, optimal configuration, and potential issues before sending to suppliers.
                        </p>
                      </div>
                    </div>
                    <MarbimAIButton
                      prompt="Perform a comprehensive quality check on my RFQ broadcast. Review supplier selection, item specifications, message clarity, deadline feasibility, and identify any potential issues or improvements before sending."
                      onClick={handleAskMarbim}
                      label="Quality Check"
                    />
                  </div>

                  {/* Broadcast Summary */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                    <h3 className="text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#57ACAF]" />
                      Broadcast Summary
                    </h3>

                    <div className="space-y-4">
                      {/* Suppliers */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-sm text-[#6F83A7]">Recipients ({selectedSupplierObjects.length})</span>
                        </div>
                        {selectedSupplierObjects.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedSupplierObjects.map((supplier) => (
                              <Badge key={supplier.id} className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                                {supplier.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-red-400">⚠️ No suppliers selected</p>
                        )}
                      </div>

                      {/* Items */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-sm text-[#6F83A7]">Items ({selectedItemObjects.length})</span>
                        </div>
                        {selectedItemObjects.length > 0 ? (
                          <div className="space-y-2">
                            {selectedItemObjects.map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-sm text-white">{item.name}</span>
                                <span className="text-sm text-[#6F83A7]">{item.quantity.toLocaleString()} {item.unit}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-red-400">⚠️ No items selected</p>
                        )}
                      </div>

                      {/* Configuration */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-sm text-[#6F83A7]">Configuration</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-[#6F83A7] mb-1">Deadline</div>
                            <div className="text-sm text-white">{deadline || 'Not set'}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-[#6F83A7] mb-1">Priority</div>
                            <div className="text-sm text-white capitalize">{priority}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-[#6F83A7] mb-1">Attachments</div>
                            <div className="text-sm text-white">{attachedFiles.length} file(s)</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-[#6F83A7] mb-1">Custom Message</div>
                            <div className="text-sm text-white">{customMessage ? 'Yes' : 'Default'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expected Response Analytics */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                    <h3 className="text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#EAB308]" />
                      Expected Response Analytics
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[#6F83A7]">Estimated Response Rate</span>
                          <span className="text-sm text-white">{avgResponseRate.toFixed(0)}%</span>
                        </div>
                        <Progress value={avgResponseRate} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-white/5 text-center">
                          <div className="text-xs text-[#6F83A7] mb-1">Expected Quotes</div>
                          <div className="text-xl text-white">
                            {Math.round(selectedSuppliers.length * (avgResponseRate / 100))}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 text-center">
                          <div className="text-xs text-[#6F83A7] mb-1">Avg Response Time</div>
                          <div className="text-xl text-white">2-3d</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 text-center">
                          <div className="text-xs text-[#6F83A7] mb-1">Competitive Quotes</div>
                          <div className="text-xl text-white">
                            {Math.round(selectedSuppliers.length * (avgResponseRate / 100) * 0.7)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Validation Messages */}
                  {(selectedSuppliers.length === 0 || selectedItems.length === 0 || !deadline) && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-red-400 mb-1">Required Information Missing</h4>
                        <ul className="text-sm text-red-300 space-y-1">
                          {selectedSuppliers.length === 0 && <li>• Select at least one supplier</li>}
                          {selectedItems.length === 0 && <li>• Select at least one RFQ item</li>}
                          {!deadline && <li>• Set a response deadline</li>}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
                {activeTab !== 'review' && (
                  <>
                    <span>{selectedSuppliers.length} supplier(s), {selectedItems.length} item(s) selected</span>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  Cancel
                </Button>
                
                {activeTab !== 'review' ? (
                  <Button
                    onClick={() => {
                      const currentIndex = tabs.findIndex(t => t.id === activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1].id);
                      }
                    }}
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleBroadcast}
                    disabled={selectedSuppliers.length === 0 || selectedItems.length === 0 || !deadline}
                    className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 shadow-lg shadow-[#EAB308]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Broadcast to {selectedSuppliers.length} Supplier(s)
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
