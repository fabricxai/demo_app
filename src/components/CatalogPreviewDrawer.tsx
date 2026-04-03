import { useState } from 'react';
import { fabricRightDrawerClass } from './fabric/drawerChrome';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Search, Filter, Grid3x3, List, Package, Star, TrendingUp, 
  Sparkles, Tag, Clock, Users, DollarSign, Layers, Eye, Share2,
  Download, Heart, ShoppingCart
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { MarbimAIButton } from './MarbimAIButton';

interface CatalogItem {
  id: string;
  styleId: string;
  name: string;
  category: string;
  fabric: string;
  buyer: string;
  moq: number;
  priceRange: string;
  status: string;
  image: string;
  description: string;
  sizes: string[];
  colorways: number;
  leadTime: string;
  lastUpdate: string;
}

interface CatalogPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  catalogItems: CatalogItem[];
  onAskMarbim: (prompt: string) => void;
}

export function CatalogPreviewDrawer({ 
  isOpen, 
  onClose, 
  catalogItems,
  onAskMarbim 
}: CatalogPreviewDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  // Get unique categories
  const categories = ['all', ...new Set(catalogItems.map(item => item.category))];

  // Filter items based on search and category
  const filteredItems = catalogItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.styleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatePresence>
      {isOpen && (
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
            className={fabricRightDrawerClass('max-w-[1200px]')}
          >
            {/* Header */}
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }} />

              <div className="relative px-8 py-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl text-white mb-1">Product Catalog Preview</h2>
                      <p className="text-sm text-[#6F83A7]">
                        Browse {catalogItems.length} style{catalogItems.length !== 1 ? 's' : ''} in your catalog
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => onAskMarbim(`Help me optimize my product catalog for better buyer engagement. Current catalog has ${catalogItems.length} items.`)}
                      className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 shadow-lg shadow-[#EAB308]/20"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Optimize Catalog
                    </Button>
                    <Button
                      onClick={onClose}
                      size="icon"
                      className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Total Styles</div>
                    <div className="text-lg text-white">{catalogItems.length}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Categories</div>
                    <div className="text-lg text-white">{categories.length - 1}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Active</div>
                    <div className="text-lg text-[#57ACAF]">{catalogItems.filter(i => i.status === 'Active').length}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Avg Colorways</div>
                    <div className="text-lg text-white">
                      {Math.round(catalogItems.reduce((sum, item) => sum + item.colorways, 0) / catalogItems.length)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="px-8 py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                  <Input
                    placeholder="Search by name, style ID, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#6F83A7]" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-[#182336]">
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
                  <Button
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`px-3 ${viewMode === 'grid' ? 'bg-[#57ACAF] text-white' : 'bg-transparent text-[#6F83A7] hover:bg-white/5'}`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`px-3 ${viewMode === 'list' ? 'bg-[#57ACAF] text-white' : 'bg-transparent text-[#6F83A7] hover:bg-white/5'}`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {(searchQuery || selectedCategory !== 'all') && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-[#6F83A7]">Active filters:</span>
                  {searchQuery && (
                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                      Search: {searchQuery}
                      <button onClick={() => setSearchQuery('')} className="ml-2 hover:text-white">×</button>
                    </Badge>
                  )}
                  {selectedCategory !== 'all' && (
                    <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory('all')} className="ml-2 hover:text-black">×</button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex gap-6 overflow-hidden">
              {/* Main Content */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-8 py-6">
                  {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <Package className="w-16 h-16 text-[#6F83A7] mb-4" />
                      <h3 className="text-lg text-white mb-2">No items found</h3>
                      <p className="text-sm text-[#6F83A7]">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    <>
                      {viewMode === 'grid' ? (
                        <div className="grid grid-cols-3 gap-6">
                          {filteredItems.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#57ACAF]/30 transition-all duration-300"
                            >
                              {/* Image */}
                              <div className="relative aspect-square overflow-hidden">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* Hover Actions */}
                                <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <Button 
                                    size="sm" 
                                    onClick={() => setSelectedItem(item)}
                                    className="flex-1 bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => onAskMarbim(`Analyze the market potential for this style: ${item.name} (${item.styleId}). Current MOQ: ${item.moq}, Price range: ${item.priceRange}`)}
                                    className="flex-1 bg-[#EAB308]/90 text-black hover:bg-[#EAB308]"
                                  >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    AI
                                  </Button>
                                </div>

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                  <Badge className="bg-[#57ACAF]/90 text-white border-0 backdrop-blur-sm">
                                    {item.status}
                                  </Badge>
                                </div>
                              </div>

                              {/* Info */}
                              <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20 text-xs mb-2">
                                      {item.category}
                                    </Badge>
                                    <h4 className="text-white font-medium mb-1 line-clamp-1">{item.name}</h4>
                                    <p className="text-xs text-[#6F83A7]">{item.styleId}</p>
                                  </div>
                                </div>

                                <p className="text-xs text-[#6F83A7] mb-3 line-clamp-2">{item.description}</p>

                                <div className="flex items-center gap-3 text-xs text-[#6F83A7]">
                                  <div className="flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    <span>{item.colorways} colors</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{item.leadTime}</span>
                                  </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                                  <span className="text-xs text-[#6F83A7]">MOQ: {item.moq.toLocaleString()}</span>
                                  <span className="text-sm text-white font-medium">{item.priceRange}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredItems.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="group flex gap-4 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#57ACAF]/30 transition-all duration-300"
                            >
                              {/* Image */}
                              <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <Badge className="absolute top-2 right-2 bg-[#57ACAF]/90 text-white border-0 backdrop-blur-sm text-xs">
                                  {item.status}
                                </Badge>
                              </div>

                              {/* Info */}
                              <div className="flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20 text-xs">
                                        {item.category}
                                      </Badge>
                                      <span className="text-xs text-[#6F83A7]">{item.styleId}</span>
                                    </div>
                                    <h4 className="text-white font-medium mb-1">{item.name}</h4>
                                  </div>
                                  <span className="text-white font-medium">{item.priceRange}</span>
                                </div>

                                <p className="text-sm text-[#6F83A7] mb-3 flex-1">{item.description}</p>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-xs text-[#6F83A7]">
                                    <div className="flex items-center gap-1">
                                      <Tag className="w-3 h-3" />
                                      <span>{item.colorways} colorways</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{item.leadTime}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      <span>MOQ: {item.moq.toLocaleString()}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Button 
                                      size="sm"
                                      onClick={() => setSelectedItem(item)}
                                      className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      View Details
                                    </Button>
                                    <Button 
                                      size="sm"
                                      onClick={() => onAskMarbim(`Analyze the market potential for this style: ${item.name} (${item.styleId}). Current MOQ: ${item.moq}, Price range: ${item.priceRange}`)}
                                      className="bg-[#EAB308] text-black hover:bg-[#EAB308]/90"
                                    >
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      AI Analysis
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </ScrollArea>
              </div>

              {/* AI Recommendations Sidebar */}
              <div className="w-80 border-l border-white/10 overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-br from-[#EAB308]/5 to-transparent">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-[#EAB308]" />
                    <h3 className="text-white font-medium">AI Insights</h3>
                  </div>
                  <p className="text-xs text-[#6F83A7]">Catalog optimization recommendations</p>
                </div>

                <ScrollArea className="flex-1 px-6 py-6">
                  <div className="space-y-4">
                    {/* Trending Styles */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                        </div>
                        <h4 className="text-white text-sm font-medium">Top Performers</h4>
                      </div>
                      <p className="text-xs text-[#6F83A7] mb-3">
                        Your {catalogItems[0]?.category || 'Knits'} category shows highest buyer interest
                      </p>
                      <MarbimAIButton
                        size="sm"
                        onClick={() => onAskMarbim(`Show me detailed analytics on which catalog categories and styles are generating the most buyer engagement and RFQs.`)}
                      >
                        Analyze Performance
                      </MarbimAIButton>
                    </div>

                    {/* Catalog Gaps */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                          <Layers className="w-4 h-4 text-[#EAB308]" />
                        </div>
                        <h4 className="text-white text-sm font-medium">Catalog Gaps</h4>
                      </div>
                      <p className="text-xs text-[#6F83A7] mb-3">
                        Consider expanding into trending categories to capture more market share
                      </p>
                      <MarbimAIButton
                        size="sm"
                        onClick={() => onAskMarbim(`Based on current market trends and my existing catalog of ${catalogItems.length} styles, what product categories should I add to attract more buyers?`)}
                      >
                        Find Opportunities
                      </MarbimAIButton>
                    </div>

                    {/* Pricing Optimization */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-[#6F83A7]" />
                        </div>
                        <h4 className="text-white text-sm font-medium">Pricing Strategy</h4>
                      </div>
                      <p className="text-xs text-[#6F83A7] mb-3">
                        Optimize your pricing strategy based on competitor analysis and market data
                      </p>
                      <MarbimAIButton
                        size="sm"
                        onClick={() => onAskMarbim(`Review my catalog pricing strategy. Are my MOQs and price ranges competitive? Suggest optimizations.`)}
                      >
                        Optimize Pricing
                      </MarbimAIButton>
                    </div>

                    {/* Buyer Targeting */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                          <Users className="w-4 h-4 text-[#57ACAF]" />
                        </div>
                        <h4 className="text-white text-sm font-medium">Buyer Targeting</h4>
                      </div>
                      <p className="text-xs text-[#6F83A7] mb-3">
                        Identify and target buyers actively searching for your product categories
                      </p>
                      <MarbimAIButton
                        size="sm"
                        onClick={() => onAskMarbim(`Based on my product catalog, which buyer segments and regions should I target for maximum conversion?`)}
                      >
                        Find Target Buyers
                      </MarbimAIButton>
                    </div>

                    {/* Catalog Enhancement */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                          <Star className="w-4 h-4 text-[#EAB308]" />
                        </div>
                        <h4 className="text-white text-sm font-medium">Content Quality</h4>
                      </div>
                      <p className="text-xs text-[#6F83A7] mb-3">
                        Improve product descriptions and images to increase buyer engagement
                      </p>
                      <MarbimAIButton
                        size="sm"
                        onClick={() => onAskMarbim(`Review my catalog content quality. Suggest improvements for product descriptions, images, and specifications to increase buyer interest.`)}
                      >
                        Enhance Content
                      </MarbimAIButton>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Quick Item Detail Modal */}
            <AnimatePresence>
              {selectedItem && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10 p-8"
                  onClick={() => setSelectedItem(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-3xl bg-gradient-to-br from-[#101725] to-[#182336] rounded-2xl border border-white/10 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex">
                      {/* Image */}
                      <div className="w-1/2">
                        <img 
                          src={selectedItem.image} 
                          alt={selectedItem.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="w-1/2 p-6 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                            {selectedItem.status}
                          </Badge>
                          <Button
                            size="icon"
                            onClick={() => setSelectedItem(null)}
                            className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <h3 className="text-xl text-white font-medium mb-1">{selectedItem.name}</h3>
                        <p className="text-sm text-[#6F83A7] mb-4">{selectedItem.styleId}</p>

                        <div className="flex-1 space-y-4 mb-6">
                          <div>
                            <label className="text-xs text-[#6F83A7] block mb-1">Description</label>
                            <p className="text-sm text-white">{selectedItem.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-[#6F83A7] block mb-1">Category</label>
                              <p className="text-sm text-white">{selectedItem.category}</p>
                            </div>
                            <div>
                              <label className="text-xs text-[#6F83A7] block mb-1">Fabric</label>
                              <p className="text-sm text-white">{selectedItem.fabric}</p>
                            </div>
                            <div>
                              <label className="text-xs text-[#6F83A7] block mb-1">MOQ</label>
                              <p className="text-sm text-white">{selectedItem.moq.toLocaleString()} pcs</p>
                            </div>
                            <div>
                              <label className="text-xs text-[#6F83A7] block mb-1">Price Range</label>
                              <p className="text-sm text-white">{selectedItem.priceRange}</p>
                            </div>
                            <div>
                              <label className="text-xs text-[#6F83A7] block mb-1">Lead Time</label>
                              <p className="text-sm text-white">{selectedItem.leadTime}</p>
                            </div>
                            <div>
                              <label className="text-xs text-[#6F83A7] block mb-1">Colorways</label>
                              <p className="text-sm text-white">{selectedItem.colorways} options</p>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-[#6F83A7] block mb-2">Available Sizes</label>
                            <div className="flex flex-wrap gap-2">
                              {selectedItem.sizes.map(size => (
                                <Badge key={size} className="bg-white/5 text-white border border-white/10">
                                  {size}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              onAskMarbim(`Analyze the market potential and provide detailed recommendations for: ${selectedItem.name} (${selectedItem.styleId}). Include competitive analysis, pricing strategy, and target buyer segments.`);
                              setSelectedItem(null);
                            }}
                            className="flex-1 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI Analysis
                          </Button>
                          <Button
                            className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
