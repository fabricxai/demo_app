import { useState, useRef } from 'react';
import { fabricRightDrawerClassWithZ } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Upload, Image as ImageIcon, Package, DollarSign, Sparkles,
  FileText, Tag, Layers, Calendar, TrendingUp, CheckCircle2,
  AlertTriangle, Trash2, Plus, Clock, Target, BarChart3,
  Palette, Ruler, Shield, Leaf, Globe, Users, ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { useDatabase, MODULE_NAMES } from '../utils/supabase';

interface AddProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ProductFormData {
  // Details Tab
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  description: string;
  tags: string[];
  
  // Specifications Tab
  materials: Array<{ material: string; percentage: string }>;
  colors: string[];
  sizes: string[];
  weight: string;
  dimensions: string;
  certifications: string[];
  
  // Pricing Tab
  basePrice: string;
  moq: string;
  leadTime: string;
  bulkPricing: Array<{ quantity: string; price: string }>;
  currency: string;
  
  // Media Tab
  images: File[];
}

export function AddProductDrawer({ isOpen, onClose, onSuccess }: AddProductDrawerProps) {
  const db = useDatabase();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    category: '',
    subcategory: '',
    description: '',
    tags: [],
    materials: [{ material: '', percentage: '' }],
    colors: [],
    sizes: [],
    weight: '',
    dimensions: '',
    certifications: [],
    basePrice: '',
    moq: '',
    leadTime: '',
    bulkPricing: [{ quantity: '', price: '' }],
    currency: 'USD',
    images: []
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [currentSize, setCurrentSize] = useState('');
  const [currentCertification, setCurrentCertification] = useState('');

  const tabs = [
    { id: 'details', label: 'Product Details', icon: Package },
    { id: 'specifications', label: 'Specifications', icon: Layers },
    { id: 'pricing', label: 'Pricing & MOQ', icon: DollarSign },
    { id: 'media', label: 'Media & Images', icon: ImageIcon },
  ];

  const categories = [
    'T-Shirts', 'Polo Shirts', 'Dress Shirts', 'Pants', 'Jeans',
    'Dresses', 'Skirts', 'Jackets', 'Sweaters', 'Activewear',
    'Underwear', 'Sleepwear', 'Outerwear', 'Accessories'
  ];

  const commonMaterials = [
    'Cotton', 'Polyester', 'Spandex', 'Nylon', 'Rayon',
    'Linen', 'Wool', 'Silk', 'Viscose', 'Elastane'
  ];

  const commonCertifications = [
    'OEKO-TEX Standard 100', 'GOTS', 'BCI Cotton', 'Fair Trade',
    'ISO 9001', 'WRAP', 'BSCI', 'Sedex', 'Organic Cotton'
  ];

  // AI-Powered Description Generation
  const generateAIDescription = async () => {
    if (!formData.name || !formData.category) {
      toast.error('Please enter product name and category first');
      return;
    }
    
    setAiGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const materials = formData.materials
        .filter(m => m.material)
        .map(m => `${m.percentage}% ${m.material}`)
        .join(', ');
      
      const generatedDesc = `Premium ${formData.category.toLowerCase()} crafted from ${materials || 'high-quality materials'}. Designed for comfort and durability, this ${formData.name.toLowerCase()} features excellent breathability and a modern fit. Ideal for both casual and semi-formal occasions. ${formData.colors.length > 0 ? `Available in ${formData.colors.join(', ')}.` : ''} Perfect for export-quality garment requirements.`;
      
      setFormData(prev => ({ ...prev, description: generatedDesc }));
      setAiGenerating(false);
      toast.success('AI description generated!');
    }, 1500);
  };

  // Auto-generate SKU
  const generateSKU = () => {
    const prefix = formData.category.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const sku = `${prefix}-${random}`;
    setFormData(prev => ({ ...prev, sku }));
    toast.success('SKU generated!');
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    toast.success(`${files.length} image(s) uploaded`);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle array additions
  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, currentTag] }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addColor = () => {
    if (currentColor && !formData.colors.includes(currentColor)) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, currentColor] }));
      setCurrentColor('');
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }));
  };

  const addSize = () => {
    if (currentSize && !formData.sizes.includes(currentSize)) {
      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, currentSize] }));
      setCurrentSize('');
    }
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }));
  };

  const addCertification = () => {
    if (currentCertification && !formData.certifications.includes(currentCertification)) {
      setFormData(prev => ({ ...prev, certifications: [...prev.certifications, currentCertification] }));
      setCurrentCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    setFormData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c !== cert) }));
  };

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { material: '', percentage: '' }]
    }));
  };

  const updateMaterial = (index: number, field: 'material' | 'percentage', value: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.map((m, i) => 
        i === index ? { ...m, [field]: value } : m
      )
    }));
  };

  const removeMaterial = (index: number) => {
    if (formData.materials.length > 1) {
      setFormData(prev => ({
        ...prev,
        materials: prev.materials.filter((_, i) => i !== index)
      }));
    }
  };

  const addBulkPricing = () => {
    setFormData(prev => ({
      ...prev,
      bulkPricing: [...prev.bulkPricing, { quantity: '', price: '' }]
    }));
  };

  const updateBulkPricing = (index: number, field: 'quantity' | 'price', value: string) => {
    setFormData(prev => ({
      ...prev,
      bulkPricing: prev.bulkPricing.map((bp, i) => 
        i === index ? { ...bp, [field]: value } : bp
      )
    }));
  };

  const removeBulkPricing = (index: number) => {
    if (formData.bulkPricing.length > 1) {
      setFormData(prev => ({
        ...prev,
        bulkPricing: prev.bulkPricing.filter((_, i) => i !== index)
      }));
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.category || !formData.sku) {
      toast.error('Please fill in all required fields');
      setActiveTab('details');
      return;
    }

    if (!formData.basePrice || !formData.moq || !formData.leadTime) {
      toast.error('Please complete pricing information');
      setActiveTab('pricing');
      return;
    }

    setLoading(true);

    try {
      const productId = `product-${Date.now()}`;
      
      const productData = {
        id: productId,
        ...formData,
        // Convert File objects to base64 or URLs for storage
        images: formData.images.map((file, idx) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          // In production, upload to storage and save URL
          placeholder: `product-image-${idx}`
        })),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store in database
      await db.store(productId, productData, MODULE_NAMES.INVENTORY_MANAGEMENT);

      // Store in vector DB for AI search
      const searchableContent = `${formData.name} ${formData.category} ${formData.subcategory} ${formData.description} ${formData.tags.join(' ')} ${formData.materials.map(m => m.material).join(' ')} ${formData.certifications.join(' ')}`;
      await db.storeVector(productId, searchableContent, MODULE_NAMES.INVENTORY_MANAGEMENT);

      toast.success('Product added successfully!');
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      subcategory: '',
      description: '',
      tags: [],
      materials: [{ material: '', percentage: '' }],
      colors: [],
      sizes: [],
      weight: '',
      dimensions: '',
      certifications: [],
      basePrice: '',
      moq: '',
      leadTime: '',
      bulkPricing: [{ quantity: '', price: '' }],
      currency: 'USD',
      images: []
    });
    setActiveTab('details');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] pointer-events-auto"
        onClick={handleClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={fabricRightDrawerClassWithZ('max-w-[1000px]', 'z-[101]', 'pointer-events-auto')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5 p-8">
          <div className="absolute inset-0 opacity-5" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
          
          <div className="relative flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 shadow-lg shadow-[#57ACAF]/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Add New Product</h2>
                <p className="text-[#6F83A7]">Create a new product for your catalog</p>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="relative grid grid-cols-4 gap-3">
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7]">Progress</div>
              <div className="text-lg text-white">
                {activeTab === 'details' && '1/4'}
                {activeTab === 'specifications' && '2/4'}
                {activeTab === 'pricing' && '3/4'}
                {activeTab === 'media' && '4/4'}
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7]">Images</div>
              <div className="text-lg text-white">{formData.images.length}/10</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7]">Materials</div>
              <div className="text-lg text-white">{formData.materials.filter(m => m.material).length}</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-[#6F83A7]">AI Assists</div>
              <div className="text-lg text-white">8</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center px-8 gap-1">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative px-5 py-3.5 text-sm transition-all duration-300 flex items-center gap-2
                    ${activeTab === tab.id ? 'text-[#57ACAF]' : 'text-[#6F83A7] hover:text-white'}
                  `}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="relative z-10">{tab.label}</span>
                  
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeProductTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"
                      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-8 py-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* AI Insight Card */}
                <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-2">AI-Powered Product Setup</h3>
                      <p className="text-[#6F83A7] text-sm mb-3">
                        MARBIM can auto-generate product descriptions, suggest SKUs, and recommend categories based on your inputs.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={generateAIDescription}
                          disabled={aiGenerating || !formData.name}
                          size="sm"
                          className="bg-[#EAB308]/20 text-[#EAB308] hover:bg-[#EAB308]/30 border border-[#EAB308]/30 relative z-50"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {aiGenerating ? 'Generating...' : 'Generate Description'}
                        </Button>
                        <Button
                          onClick={generateSKU}
                          disabled={!formData.category}
                          size="sm"
                          className="bg-[#57ACAF]/20 text-[#57ACAF] hover:bg-[#57ACAF]/30 border border-[#57ACAF]/30 relative z-50"
                        >
                          <Target className="w-3 h-3 mr-1" />
                          Generate SKU
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 space-y-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#57ACAF]" />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-[#6F83A7]">Product Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Premium Cotton T-Shirt"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-[#6F83A7]">SKU *</label>
                      <Input
                        value={formData.sku}
                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder="e.g., TSH-ABC123"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-[#6F83A7]">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm [&>option]:bg-[#182336] [&>option]:text-white"
                      >
                        <option value="" className="bg-[#182336] text-white">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat} className="bg-[#182336] text-white">{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-[#6F83A7]">Subcategory</label>
                      <Input
                        value={formData.subcategory}
                        onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                        placeholder="e.g., Crew Neck, V-Neck"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[#6F83A7]">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed product description..."
                      rows={4}
                      className="bg-white/5 border-white/10 text-white resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-sm text-[#6F83A7]">Tags</label>
                    <div className="flex gap-2">
                      <Input
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add tags (e.g., eco-friendly, premium)"
                        className="bg-white/5 border-white/10 text-white flex-1"
                      />
                      <Button
                        onClick={addTag}
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map(tag => (
                          <Badge
                            key={tag}
                            className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 flex items-center gap-1"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                            <button onClick={() => removeTag(tag)}>
                              <X className="w-3 h-3 hover:text-white" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Materials */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#57ACAF]" />
                      Material Composition
                    </h3>
                    <Button
                      onClick={addMaterial}
                      size="sm"
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Material
                    </Button>
                  </div>

                  {formData.materials.map((material, idx) => (
                    <div key={idx} className="flex gap-3">
                      <select
                        value={material.material}
                        onChange={(e) => updateMaterial(idx, 'material', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                      >
                        <option value="">Select material</option>
                        {commonMaterials.map(mat => (
                          <option key={mat} value={mat}>{mat}</option>
                        ))}
                      </select>
                      <Input
                        type="number"
                        value={material.percentage}
                        onChange={(e) => updateMaterial(idx, 'percentage', e.target.value)}
                        placeholder="%"
                        className="w-20 bg-white/5 border-white/10 text-white"
                      />
                      {formData.materials.length > 1 && (
                        <Button
                          onClick={() => removeMaterial(idx)}
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Colors & Sizes */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#57ACAF]" />
                      Available Colors
                    </h3>
                    <div className="flex gap-2">
                      <Input
                        value={currentColor}
                        onChange={(e) => setCurrentColor(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                        placeholder="e.g., Navy Blue"
                        className="bg-white/5 border-white/10 text-white flex-1"
                      />
                      <Button
                        onClick={addColor}
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.colors.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.colors.map(color => (
                          <Badge
                            key={color}
                            className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 flex items-center gap-1"
                          >
                            {color}
                            <button onClick={() => removeColor(color)}>
                              <X className="w-3 h-3 hover:text-white" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-[#57ACAF]" />
                      Available Sizes
                    </h3>
                    <div className="flex gap-2">
                      <Input
                        value={currentSize}
                        onChange={(e) => setCurrentSize(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                        placeholder="e.g., S, M, L, XL"
                        className="bg-white/5 border-white/10 text-white flex-1"
                      />
                      <Button
                        onClick={addSize}
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.sizes.map(size => (
                          <Badge
                            key={size}
                            className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 flex items-center gap-1"
                          >
                            {size}
                            <button onClick={() => removeSize(size)}>
                              <X className="w-3 h-3 hover:text-white" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Physical Properties */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 space-y-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[#57ACAF]" />
                    Physical Properties
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-[#6F83A7]">Weight (per piece)</label>
                      <Input
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        placeholder="e.g., 200g"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-[#6F83A7]">Dimensions</label>
                      <Input
                        value={formData.dimensions}
                        onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                        placeholder="e.g., 70cm x 50cm"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 space-y-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#57ACAF]" />
                    Certifications & Compliance
                  </h3>
                  <div className="flex gap-2">
                    <select
                      value={currentCertification}
                      onChange={(e) => setCurrentCertification(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    >
                      <option value="">Select certification</option>
                      {commonCertifications.map(cert => (
                        <option key={cert} value={cert}>{cert}</option>
                      ))}
                    </select>
                    <Button
                      onClick={addCertification}
                      size="sm"
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.certifications.map(cert => (
                        <Badge
                          key={cert}
                          className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 flex items-center gap-1"
                        >
                          <Shield className="w-3 h-3" />
                          {cert}
                          <button onClick={() => removeCertification(cert)}>
                            <X className="w-3 h-3 hover:text-white" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* AI Pricing Insight */}
                <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-[#EAB308]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-2">Smart Pricing Recommendations</h3>
                      <p className="text-[#6F83A7] text-sm mb-3">
                        Based on similar {formData.category} products, MARBIM suggests:
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Market Average</div>
                          <div className="text-lg text-white font-medium">$8.50</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Premium Range</div>
                          <div className="text-lg text-white font-medium">$12-15</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Optimal MOQ</div>
                          <div className="text-lg text-white font-medium">500 pcs</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Base Pricing */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 space-y-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#57ACAF]" />
                    Base Pricing
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-[#6F83A7]">Base Price *</label>
                      <div className="flex gap-2">
                        <select
                          value={formData.currency}
                          onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-20 px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.basePrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
                          placeholder="0.00"
                          className="flex-1 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-[#6F83A7]">MOQ (pieces) *</label>
                      <Input
                        type="number"
                        value={formData.moq}
                        onChange={(e) => setFormData(prev => ({ ...prev, moq: e.target.value }))}
                        placeholder="e.g., 500"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-[#6F83A7]">Lead Time (days) *</label>
                      <Input
                        type="number"
                        value={formData.leadTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, leadTime: e.target.value }))}
                        placeholder="e.g., 30"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Bulk Pricing Tiers */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#57ACAF]" />
                      Bulk Pricing Tiers
                    </h3>
                    <Button
                      onClick={addBulkPricing}
                      size="sm"
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Tier
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formData.bulkPricing.map((tier, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs text-[#6F83A7]">Quantity (from)</label>
                          <Input
                            type="number"
                            value={tier.quantity}
                            onChange={(e) => updateBulkPricing(idx, 'quantity', e.target.value)}
                            placeholder="e.g., 1000"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-xs text-[#6F83A7]">Price per piece</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={tier.price}
                            onChange={(e) => updateBulkPricing(idx, 'price', e.target.value)}
                            placeholder="0.00"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        {formData.bulkPricing.length > 1 && (
                          <Button
                            onClick={() => removeBulkPricing(idx)}
                            size="sm"
                            variant="outline"
                            className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] mt-5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Summary */}
                {formData.basePrice && formData.moq && (
                  <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-5">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                      Pricing Summary
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-[#6F83A7] mb-1">Base Revenue (MOQ)</div>
                        <div className="text-xl text-white font-medium">
                          {formData.currency} {(parseFloat(formData.basePrice) * parseFloat(formData.moq)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6F83A7] mb-1">Margin Potential</div>
                        <div className="text-xl text-white font-medium">35-40%</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6F83A7] mb-1">Competitiveness</div>
                        <div className="flex items-center gap-2">
                          <div className="text-xl text-[#57ACAF] font-medium">High</div>
                          <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Upload Area */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 space-y-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#57ACAF]" />
                    Product Images
                  </h3>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/20 rounded-xl p-12 hover:border-[#57ACAF]/50 hover:bg-[#57ACAF]/5 transition-all group"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-[#57ACAF]" />
                      </div>
                      <div className="text-center">
                        <div className="text-white font-medium mb-1">Upload Product Images</div>
                        <div className="text-[#6F83A7] text-sm">
                          Click to browse or drag and drop images here
                        </div>
                        <div className="text-[#6F83A7] text-xs mt-2">
                          Maximum 10 images • PNG, JPG up to 5MB each
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Uploaded Images */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {formData.images.map((file, idx) => (
                        <div
                          key={idx}
                          className="relative group bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all"
                        >
                          <div className="aspect-square bg-white/5 rounded-lg mb-2 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-[#6F83A7]" />
                          </div>
                          <div className="text-white text-xs truncate mb-1">{file.name}</div>
                          <div className="text-[#6F83A7] text-xs">
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                          
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>

                          {idx === 0 && (
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-[#EAB308]/80 text-black border-0 text-xs">
                                Primary
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Image Analysis */}
                {formData.images.length > 0 && (
                  <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-2">AI Image Analysis</h3>
                        <p className="text-[#6F83A7] text-sm mb-3">
                          MARBIM analyzed your product images and detected:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="text-xs text-[#6F83A7] mb-1">Image Quality</div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                              <span className="text-sm text-white">Excellent</span>
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="text-xs text-[#6F83A7] mb-1">Background</div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                              <span className="text-sm text-white">Clean</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </ScrollArea>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 p-6 bg-gradient-to-t from-white/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
              <Clock className="w-4 h-4" />
              Auto-saved
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleClose}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                Cancel
              </Button>
              
              {activeTab !== 'media' && (
                <Button
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1].id);
                    }
                  }}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
              
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                    </motion.div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Add Product
                  </>
                )}
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
