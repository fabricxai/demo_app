import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { MarbimAIButton } from '../MarbimAIButton';
import { CatalogPreviewDrawer } from '../CatalogPreviewDrawer';
import { AddProductDrawer } from '../AddProductDrawer';
import { 
  Building2, Globe, Award, Users, TrendingUp, Package, Image as ImageIcon,
  Upload, Download, Eye, Edit, Trash2, Plus, Search, Filter, Sparkles,
  CheckCircle2, Clock, AlertTriangle, FileText, Calendar, DollarSign,
  Target, BarChart3, Send, Share2, ExternalLink, Copy, Save, RefreshCw,
  Leaf, Shield, MapPin, Phone, Mail, Link as LinkIcon, Settings,
  Palette, Layout, Monitor, Smartphone, Code, Zap, TrendingDown,
  Star, Heart, MessageSquare, Tag, Layers, ShoppingCart, PieChart
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLine,
  Line,
  AreaChart,
  Area,
} from 'recharts';

interface CompanyProfileProps {
  initialSubPage?: string;
  onAskMarbim: (prompt: string) => void;
  isAIPanelOpen: boolean;
}

// Overview Data
const companyData = {
  name: 'Apex Garments Ltd.',
  logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
  registrationNo: 'REG-BD-2015-04523',
  establishmentYear: 2015,
  address: 'Plot 45, Gazipur Industrial Area, Dhaka, Bangladesh',
  phone: '+880 1712-345678',
  email: 'contact@apexgarments.com',
  website: 'apexgarments.stychx.com',
  about: 'Leading sustainable garment manufacturer specializing in organic cotton knits, denim, and eco-friendly woven apparel. WRAP and GOTS certified with 15+ years of excellence in ethical production.',
  mission: 'To deliver premium quality garments while maintaining the highest standards of environmental stewardship and worker welfare.',
  monthlyCapacity: 250000,
  productionLines: 12,
  totalMachines: 450,
  employees: 1200,
};

const keyPeople = [
  { role: 'Managing Director', name: 'Mohammed Rahman', email: 'm.rahman@apexgarments.com', phone: '+880 1711-111111' },
  { role: 'Merchandising Head', name: 'Fatima Khatun', email: 'f.khatun@apexgarments.com', phone: '+880 1722-222222' },
  { role: 'Production Head', name: 'Rahim Ahmed', email: 'r.ahmed@apexgarments.com', phone: '+880 1733-333333' },
  { role: 'Compliance Lead', name: 'Ayesha Begum', email: 'a.begum@apexgarments.com', phone: '+880 1744-444444' },
];

const certifications = [
  { name: 'WRAP', issueDate: '2023-01-15', expiryDate: '2025-01-15', status: 'Active', authority: 'WRAP Global' },
  { name: 'BSCI', issueDate: '2023-03-20', expiryDate: '2025-03-20', status: 'Active', authority: 'Amfori' },
  { name: 'GOTS', issueDate: '2022-11-10', expiryDate: '2024-11-10', status: 'Expiring Soon', authority: 'Control Union' },
  { name: 'Oeko-Tex Standard 100', issueDate: '2023-06-05', expiryDate: '2025-06-05', status: 'Active', authority: 'Oeko-Tex' },
  { name: 'Sedex', issueDate: '2023-02-28', expiryDate: '2025-02-28', status: 'Active', authority: 'Sedex Global' },
];

const sustainabilityMetrics = [
  { metric: 'CO₂e per Piece', value: '2.8 kg', trend: -12, benchmark: '3.2 kg' },
  { metric: 'Water Intensity', value: '45 L/piece', trend: -18, benchmark: '55 L/piece' },
  { metric: 'Renewable Energy', value: '35%', trend: 15, benchmark: '25%' },
  { metric: 'Waste Recycled', value: '78%', trend: 8, benchmark: '65%' },
];

const activeBuyers = [
  { name: 'Target USA', orders: 12, value: 850000, lastOrder: '2024-10-15', status: 'Active' },
  { name: 'H&M Europe', orders: 8, value: 620000, lastOrder: '2024-10-20', status: 'Active' },
  { name: 'Zara Spain', orders: 6, value: 480000, lastOrder: '2024-10-10', status: 'Active' },
  { name: 'Uniqlo Japan', orders: 5, value: 390000, lastOrder: '2024-09-28', status: 'Active' },
];

// Catalog Data
const catalogData = [
  {
    id: 'STY-2024-001',
    styleId: 'MNS-KNT-001',
    name: 'Men\'s Organic Cotton Polo',
    category: 'Knits',
    fabric: '180 GSM Organic Cotton',
    buyer: 'Target USA',
    moq: 1000,
    priceRange: '$8-$11',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
    description: 'Classic polo shirt made from 100% GOTS certified organic cotton with recycled polyester buttons.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colorways: 6,
    leadTime: '45 days',
    lastUpdate: '2024-10-25',
  },
  {
    id: 'STY-2024-002',
    styleId: 'WMN-DNM-008',
    name: 'Women\'s Slim Fit Denim Jeans',
    category: 'Denim',
    fabric: '320 GSM Stretch Denim',
    buyer: 'H&M Europe',
    moq: 1500,
    priceRange: '$12-$16',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    description: 'Sustainable stretch denim jeans with water-saving wash technology and recycled cotton blend.',
    sizes: ['24', '26', '28', '30', '32', '34'],
    colorways: 4,
    leadTime: '60 days',
    lastUpdate: '2024-10-22',
  },
  {
    id: 'STY-2024-003',
    styleId: 'UNI-WVN-015',
    name: 'Unisex Cotton Twill Jacket',
    category: 'Woven',
    fabric: '240 GSM Cotton Twill',
    buyer: 'Zara Spain',
    moq: 800,
    priceRange: '$18-$24',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    description: 'Durable cotton twill jacket with eco-friendly dyes and metal-free tanned leather details.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colorways: 5,
    leadTime: '50 days',
    lastUpdate: '2024-10-18',
  },
  {
    id: 'STY-2024-004',
    styleId: 'KDS-KNT-022',
    name: 'Kids\' Cotton T-Shirt - Graphic',
    category: 'Knits',
    fabric: '160 GSM Single Jersey',
    buyer: 'Uniqlo Japan',
    moq: 2000,
    priceRange: '$5-$7',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop',
    description: 'Soft cotton jersey t-shirt with water-based prints, perfect for children\'s sensitive skin.',
    sizes: ['2Y', '4Y', '6Y', '8Y', '10Y', '12Y'],
    colorways: 8,
    leadTime: '35 days',
    lastUpdate: '2024-10-20',
  },
];

// Website Templates
const websiteTemplates = [
  {
    id: 'TPL-001',
    name: 'Modern Minimal',
    description: 'Clean, contemporary design with bold typography and whitespace',
    preview: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
    suitable: 'Modern brands, tech-forward factories',
    features: ['Parallax scrolling', 'Animated product grid', 'Video hero section'],
  },
  {
    id: 'TPL-002',
    name: 'Sustainable Earth',
    description: 'Eco-friendly aesthetic with natural colors and organic shapes',
    preview: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
    suitable: 'GOTS certified, sustainability-focused companies',
    features: ['ESG metrics dashboard', 'Certification badges', 'Carbon footprint calculator'],
  },
  {
    id: 'TPL-003',
    name: 'Denim Classic',
    description: 'Industrial, rugged design inspired by denim heritage',
    preview: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop',
    suitable: 'Denim manufacturers, heritage brands',
    features: ['Texture-rich design', 'Manufacturing timeline', 'Production floor gallery'],
  },
  {
    id: 'TPL-004',
    name: 'Tech Professional',
    description: 'Data-driven layout showcasing capacity and technology',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    suitable: 'Large-scale manufacturers, B2B focused',
    features: ['Live capacity dashboard', 'API documentation', 'Interactive factory tour'],
  },
];

// Analytics Data
const websiteAnalytics = [
  { month: 'Jun', visitors: 1240, leads: 18, quotes: 5 },
  { month: 'Jul', visitors: 1580, leads: 24, quotes: 8 },
  { month: 'Aug', visitors: 1820, leads: 31, quotes: 12 },
  { month: 'Sep', visitors: 2150, leads: 38, quotes: 15 },
  { month: 'Oct', visitors: 2480, leads: 45, quotes: 18 },
];

const buyerEngagementData = [
  { category: 'Knits', engagement: 78, color: '#57ACAF' },
  { category: 'Denim', engagement: 92, color: '#EAB308' },
  { category: 'Woven', engagement: 65, color: '#6F83A7' },
  { category: 'Outerwear', engagement: 54, color: '#D0342C' },
];

export function CompanyProfile({ initialSubPage = 'overview', onAskMarbim, isAIPanelOpen }: CompanyProfileProps) {
  const routeSubpage = useRouteSubpage('overview', initialSubPage);
  const [currentView, setCurrentView] = useState(routeSubpage);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [websitePublished, setWebsitePublished] = useState(true);
  const [catalogPreviewOpen, setCatalogPreviewOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  useEffect(() => {
    setCurrentView(routeSubpage);
  }, [routeSubpage]);

  // Catalog Columns
  const catalogColumns: Column[] = [
    { key: 'styleId', label: 'Style ID', sortable: true },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'fabric', label: 'Fabric' },
    { key: 'moq', label: 'MOQ', sortable: true },
    { key: 'priceRange', label: 'Price Range' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
          {value}
        </Badge>
      )
    },
  ];

  const getBreadcrumbLabel = () => {
    switch (currentView) {
      case 'overview':
        return 'Company Overview';
      case 'catalog':
        return 'Product Catalog';
      case 'website-builder':
        return 'Website Builder (StychX)';
      case 'ai-insights':
        return 'AI Insights';
      default:
        return 'Company Overview';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#57ACAF]/10 via-transparent to-[#EAB308]/10 border border-white/10 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6 flex-1">
              <img 
                src={companyData.logo} 
                alt={companyData.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl text-white">{companyData.name}</h2>
                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">{companyData.about}</p>
                <div className="flex items-center gap-4 text-sm text-[#6F83A7]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{companyData.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span>{companyData.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <span>{companyData.email}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MarbimAIButton
                onClick={() => {
                  onAskMarbim('Generate a compelling 150-word company profile summary for buyers, highlighting our sustainability credentials, production capacity, and key certifications. Make it professional and buyer-focused.');
                }}
              />
              <Button
                size="sm"
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div>
                  <p className="text-xs text-[#6F83A7]">Monthly Capacity</p>
                  <p className="text-xl text-white">{companyData.monthlyCapacity.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div>
                  <p className="text-xs text-[#6F83A7]">Production Lines</p>
                  <p className="text-xl text-white">{companyData.productionLines}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div>
                  <p className="text-xs text-[#6F83A7]">Total Machines</p>
                  <p className="text-xl text-white">{companyData.totalMachines}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div>
                  <p className="text-xs text-[#6F83A7]">Employees</p>
                  <p className="text-xl text-white">{companyData.employees}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key People */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white mb-1">Key People</h3>
            <p className="text-sm text-[#6F83A7]">Leadership team and department heads</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Person
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {keyPeople.map((person, index) => (
            <div key={index} className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center text-white">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-0.5">{person.name}</h4>
                  <p className="text-xs text-[#6F83A7] mb-2">{person.role}</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#6F83A7]">
                      <Mail className="w-3 h-3" />
                      <span>{person.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#6F83A7]">
                      <Phone className="w-3 h-3" />
                      <span>{person.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-white mb-1">Certifications & Compliance</h3>
              <p className="text-sm text-[#6F83A7]">Industry standards and audit compliance</p>
            </div>
          </div>
          <MarbimAIButton
            onClick={() => {
              onAskMarbim('Analyze certification portfolio. Identify which certifications are expiring soon, recommend renewals timing, and suggest additional certifications that could increase buyer appeal for EU and US markets.');
            }}
          />
        </div>

        <div className="grid grid-cols-5 gap-4">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#57ACAF]/20 flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-[#57ACAF]" />
              </div>
              <h4 className="text-white mb-2">{cert.name}</h4>
              <Badge 
                className={
                  cert.status === 'Active'
                    ? 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20'
                    : 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'
                }
              >
                {cert.status}
              </Badge>
              <p className="text-xs text-[#6F83A7] mt-2">Expires: {cert.expiryDate}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainability Metrics */}
      <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6 text-[#57ACAF]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Sustainability Performance</h3>
              <p className="text-sm text-[#6F83A7]">ESG metrics benchmarked against industry standards</p>
            </div>
          </div>
          <MarbimAIButton
            onClick={() => {
              onAskMarbim('Generate comprehensive sustainability report for buyer presentation. Include our ESG performance vs industry benchmarks, highlight achievements, and recommend areas for improvement to meet EU sustainability regulations.');
            }}
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {sustainabilityMetrics.map((metric, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <p className="text-xs text-[#6F83A7] mb-2">{metric.metric}</p>
              <p className="text-2xl text-white mb-1">{metric.value}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {metric.trend > 0 ? (
                    <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-[#57ACAF]" />
                  )}
                  <span className="text-xs text-[#57ACAF]">{Math.abs(metric.trend)}%</span>
                </div>
                <span className="text-xs text-[#6F83A7]">vs {metric.benchmark}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Buyers */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white mb-1">Active Buyers</h3>
            <p className="text-sm text-[#6F83A7]">Recent orders and buyer relationships</p>
          </div>
          <Button
            size="sm"
            onClick={() => onAskMarbim('Analyze buyer portfolio health. Identify revenue concentration risk, recommend diversification strategies, and suggest new buyer targets based on our production capabilities.')}
            className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            AI Analysis
          </Button>
        </div>

        <div className="space-y-3">
          {activeBuyers.map((buyer, index) => (
            <div key={index} className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#EAB308]" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">{buyer.name}</h4>
                    <p className="text-xs text-[#6F83A7]">Last order: {buyer.lastOrder}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-[#6F83A7]">Total Orders</p>
                    <p className="text-white">{buyer.orders}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#6F83A7]">Total Value</p>
                    <p className="text-white">${buyer.value.toLocaleString()}</p>
                  </div>
                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
                    {buyer.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#EAB308]/10 via-transparent to-[#57ACAF]/10 border border-white/10 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                  <Package className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl text-white mb-1">Product Catalog Management</h2>
                  <p className="text-sm text-[#6F83A7]">Digital catalog synced with your website and buyer portals</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MarbimAIButton
                onClick={() => {
                  onAskMarbim('Analyze catalog performance by category and buyer segment. Identify top-performing styles, recommend pricing adjustments, and suggest new product opportunities based on market trends.');
                }}
              />
              <Button
                onClick={() => setIsAddProductOpen(true)}
                size="sm"
                className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Product
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div>
                  <p className="text-xs text-[#6F83A7]">Total Styles</p>
                  <p className="text-xl text-white">{catalogData.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div>
                  <p className="text-xs text-[#6F83A7]">Categories</p>
                  <p className="text-xl text-white">4</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div>
                  <p className="text-xs text-[#6F83A7]">With Images</p>
                  <p className="text-xl text-white">{catalogData.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div>
                  <p className="text-xs text-[#6F83A7]">Active</p>
                  <p className="text-xl text-white">{catalogData.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {catalogData.map((product) => (
          <div key={product.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge className="bg-[#57ACAF]/90 text-white border-0 backdrop-blur-sm">
                  {product.category}
                </Badge>
                <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm">
                  {product.status}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  size="sm" 
                  className="flex-1 bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30"
                  onClick={() => setCatalogPreviewOpen(true)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                <Button size="sm" className="flex-1 bg-[#57ACAF] text-white hover:bg-[#57ACAF]/90">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white mb-1">{product.name}</h3>
                  <p className="text-sm text-[#6F83A7]">{product.styleId}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAskMarbim(`Generate a compelling 100-word buyer-facing description for ${product.name}. Highlight sustainability features, fabric quality, and suitability for ${product.buyer}. Make it professional and sales-focused.`)}
                  className="text-[#EAB308] hover:text-[#EAB308] hover:bg-[#EAB308]/10"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-sm text-[#6F83A7] mb-4">{product.description}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-[#6F83A7]">Fabric</p>
                  <p className="text-sm text-white">{product.fabric}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-[#6F83A7]">Buyer</p>
                  <p className="text-sm text-white">{product.buyer}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-[#6F83A7]">MOQ</p>
                  <p className="text-sm text-white">{product.moq.toLocaleString()} pcs</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-[#6F83A7]">Price Range</p>
                  <p className="text-sm text-white">{product.priceRange}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-4 text-xs text-[#6F83A7]">
                  <span>{product.colorways} colors</span>
                  <span>•</span>
                  <span>{product.sizes.length} sizes</span>
                  <span>•</span>
                  <span>{product.leadTime}</span>
                </div>
                <Button size="sm" variant="ghost" className="text-[#57ACAF] hover:text-[#57ACAF] hover:bg-[#57ACAF]/10">
                  <Share2 className="w-3 h-3 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Catalog Optimization */}
      <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#EAB308]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">AI Catalog Optimization</h3>
              <p className="text-sm text-[#6F83A7] mb-4">
                MARBIM analyzes your catalog performance and recommends improvements for better buyer engagement
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">SEO Score</div>
                  <div className="text-xl text-white">78/100</div>
                  <div className="text-xs text-[#EAB308]">↑ 12 points this month</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Avg. Engagement</div>
                  <div className="text-xl text-white">4.2 min</div>
                  <div className="text-xs text-[#57ACAF]">↑ 18% vs last month</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Lead Conversion</div>
                  <div className="text-xl text-white">12.5%</div>
                  <div className="text-xs text-[#57ACAF]">Above benchmark</div>
                </div>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onAskMarbim('Provide comprehensive catalog optimization recommendations. Include: 1) Missing product information, 2) SEO improvements for descriptions, 3) Pricing competitiveness analysis, 4) Image quality assessment, 5) Buyer segment matching suggestions.')}
            variant="outline"
            className="border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)] shrink-0"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Full Audit
          </Button>
        </div>
      </div>
    </div>
  );

  const renderWebsiteBuilder = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#57ACAF]/10 via-transparent to-[#EAB308]/10 border border-white/10 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl text-white mb-1">StychX Website Builder</h2>
                  <p className="text-sm text-[#6F83A7]">AI-powered website generation with live catalog sync</p>
                </div>
              </div>
            </div>
            
            <MarbimAIButton
              onClick={() => {
                onAskMarbim('Generate a complete modern homepage for our website highlighting eco-friendly production, WRAP certification, and production capacity. Include compelling copy for hero section, about us, and sustainability sections.');
              }}
            />
          </div>

          {websitePublished && (
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#57ACAF]" />
                  <div>
                    <p className="text-white mb-0.5">Website is live!</p>
                    <a 
                      href={`https://${companyData.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-[#57ACAF] hover:underline flex items-center gap-1"
                    >
                      {companyData.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Sync Catalog
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white mb-1">Choose Your Template</h3>
            <p className="text-sm text-[#6F83A7]">Professional designs optimized for RMG industry</p>
          </div>
          <Button
            size="sm"
            onClick={() => onAskMarbim('Recommend the best website template for our company profile. Consider our sustainability focus, product mix (knits, denim, woven), and target buyers (Target USA, H&M, Zara). Explain why each template suits our brand positioning.')}
            className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            AI Recommend
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {websiteTemplates.map((template) => (
            <div 
              key={template.id}
              className={`bg-gradient-to-br from-white/5 to-white/[0.02] border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#57ACAF]/50 ${
                selectedTemplate === template.id ? 'border-[#57ACAF]' : 'border-white/10'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={template.preview} 
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                {selectedTemplate === template.id && (
                  <div className="absolute inset-0 bg-[#57ACAF]/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#57ACAF] flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h4 className="text-white mb-2">{template.name}</h4>
                <p className="text-sm text-[#6F83A7] mb-3">{template.description}</p>
                
                <div className="mb-3">
                  <p className="text-xs text-[#6F83A7] mb-1">Best for:</p>
                  <p className="text-xs text-white">{template.suitable}</p>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <Badge key={index} className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20 text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedTemplate && (
          <div className="mt-6 flex items-center justify-between p-4 bg-gradient-to-r from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
              <p className="text-white">Template selected: <span className="text-[#57ACAF]">{websiteTemplates.find(t => t.id === selectedTemplate)?.name}</span></p>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90"
              onClick={() => {
                toast.success('Website build started! MARBIM is generating your site...');
              }}
            >
              <Zap className="w-3 h-3 mr-1" />
              Build Website
            </Button>
          </div>
        )}
      </div>

      {/* AI Content Generation */}
      <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#EAB308]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">AI Content Generator</h3>
              <p className="text-sm text-[#6F83A7] mb-4">
                MARBIM writes professional website copy tailored to your brand and target buyers
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAskMarbim('Write a compelling About Us page for our website. Highlight our 15+ years experience, sustainability achievements (GOTS, WRAP certified), modern infrastructure (12 production lines, 450 machines), and commitment to ethical manufacturing. Make it warm yet professional, target EU and US buyers.')}
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  About Us Page
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAskMarbim('Generate Vision & Mission statements that emphasize our sustainability leadership, quality excellence, and ethical production values. Make it inspirational and aligned with global brand expectations.')}
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Vision & Mission
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAskMarbim('Create a detailed Sustainability page showcasing our ESG performance: CO2 reduction (12%), water efficiency (18% improvement), renewable energy (35%), waste recycling (78%). Include our certifications and commitment to circular economy.')}
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start"
                >
                  <Leaf className="w-4 h-4 mr-2" />
                  Sustainability Page
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAskMarbim('Write SEO-optimized meta descriptions and title tags for homepage, about page, product catalog, and sustainability page. Target keywords: sustainable garment manufacturer, GOTS certified factory, ethical clothing production, Bangladesh RMG.')}
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] justify-start"
                >
                  <Code className="w-4 h-4 mr-2" />
                  SEO Meta Tags
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Website Features */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center mb-4">
            <RefreshCw className="w-6 h-6 text-[#57ACAF]" />
          </div>
          <h3 className="text-white mb-2">Auto Catalog Sync</h3>
          <p className="text-sm text-[#6F83A7] mb-4">
            Product catalog updates automatically sync to website via API webhook
          </p>
          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
            Live
          </Badge>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-[#EAB308]" />
          </div>
          <h3 className="text-white mb-2">Certification Badges</h3>
          <p className="text-sm text-[#6F83A7] mb-4">
            Display WRAP, BSCI, GOTS, and other certifications with expiry tracking
          </p>
          <Badge className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20">
            Active
          </Badge>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-[#6F83A7]/20 flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-[#6F83A7]" />
          </div>
          <h3 className="text-white mb-2">SEO Optimization</h3>
          <p className="text-sm text-[#6F83A7] mb-4">
            Auto-generated meta titles, keywords, and OpenGraph tags for search visibility
          </p>
          <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20">
            Enabled
          </Badge>
        </div>
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#EAB308]/10 via-transparent to-[#57ACAF]/10 border border-white/10 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                  <Sparkles className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl text-white mb-1">AI Insights & Analytics</h2>
                  <p className="text-sm text-[#6F83A7]">Digital presence performance and optimization recommendations</p>
                </div>
              </div>
            </div>
            
            <MarbimAIButton
              onClick={() => {
                onAskMarbim('Provide comprehensive digital presence analysis. Include: 1) Website performance metrics, 2) Buyer engagement patterns, 3) SEO health score with improvement areas, 4) Catalog optimization opportunities, 5) Competitive positioning, 6) Actionable recommendations for next 30 days.');
              }}
            />
          </div>
        </div>
      </div>

      {/* Website Analytics */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-white mb-2">Website Performance</h3>
            <p className="text-sm text-[#6F83A7]">Traffic, engagement, and lead generation metrics</p>
          </div>
          <MarbimAIButton
            onClick={() => {
              onAskMarbim('Analyze website traffic trends and conversion funnel. Identify drop-off points, recommend content improvements, and suggest marketing strategies to increase quote requests from qualified buyers.');
            }}
          />
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={websiteAnalytics}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#57ACAF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#57ACAF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="month" stroke="#6F83A7" />
            <YAxis stroke="#6F83A7" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#182336', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Area type="monotone" dataKey="visitors" stroke="#57ACAF" fillOpacity={1} fill="url(#colorVisitors)" name="Visitors" />
            <Area type="monotone" dataKey="leads" stroke="#EAB308" fillOpacity={1} fill="url(#colorLeads)" name="Leads" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Buyer Engagement Score */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-white mb-2">Buyer Engagement by Category</h3>
              <p className="text-sm text-[#6F83A7]">Catalog performance metrics</p>
            </div>
            <MarbimAIButton
              onClick={() => {
                onAskMarbim('Analyze category engagement patterns. Recommend which product categories to expand, which to optimize, and identify underperforming styles that need better descriptions or imagery.');
              }}
            />
          </div>
          
          <div className="space-y-4">
            {buyerEngagementData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">{item.category}</span>
                  <span className="text-sm text-[#6F83A7]">{item.engagement}% engagement</span>
                </div>
                <Progress value={item.engagement} className="h-2" style={{ backgroundColor: `${item.color}40` }} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-[#57ACAF]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Digital Presence Score</h3>
              <p className="text-sm text-[#6F83A7]">Overall online visibility and effectiveness</p>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-5xl text-white mb-2">84/100</div>
            <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
              Excellent
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-sm text-white">SEO Health</span>
              <span className="text-sm text-[#57ACAF]">78/100</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-sm text-white">Content Quality</span>
              <span className="text-sm text-[#57ACAF]">92/100</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-sm text-white">Visual Appeal</span>
              <span className="text-sm text-[#57ACAF]">88/100</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-sm text-white">Mobile Optimization</span>
              <span className="text-sm text-[#EAB308]">72/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#EAB308]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">MARBIM Recommendations</h3>
              <p className="text-sm text-[#6F83A7] mb-4">Actionable insights to improve your digital presence</p>
              
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-[#57ACAF] mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-white mb-1"><span className="font-medium">High Priority:</span> Your denim catalog gets 92% engagement from EU buyers. Consider adding multi-currency pricing (EUR, GBP) to increase quote conversion.</p>
                      <Button
                        size="sm"
                        onClick={() => onAskMarbim('Generate implementation plan for adding multi-currency pricing to our website and catalog. Include technical requirements, buyer UX flow, and conversion rate impact projections.')}
                        className="mt-2 bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Get Action Plan
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#EAB308] mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-white mb-1"><span className="font-medium">Action Required:</span> GOTS certificate expires in 45 days. Update certification to maintain website badge and buyer trust.</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Schedule Renewal
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-[#EAB308] mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-white mb-1"><span className="font-medium">Opportunity:</span> Upload video tour of production floor. Factories with video content see 45% higher buyer engagement and trust scores.</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload Video
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-2">
                    <Leaf className="w-5 h-5 text-[#57ACAF] mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-white mb-1"><span className="font-medium">SEO Boost:</span> Add detailed sustainability page with carbon footprint data. This keyword cluster has 3,200 monthly searches from potential buyers.</p>
                      <Button
                        size="sm"
                        onClick={() => onAskMarbim('Create comprehensive SEO-optimized sustainability page content. Include our ESG metrics, certifications, environmental initiatives, social compliance, and governance framework. Target keywords: sustainable garment manufacturer, carbon neutral clothing production, ethical factory Bangladesh.')}
                        className="mt-2 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Generate Content
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability Highlights */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white mb-1">Sustainability Highlights</h3>
            <p className="text-sm text-[#6F83A7]">ESG performance vs regional benchmark</p>
          </div>
          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20">
            Top 15% in Bangladesh
          </Badge>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {sustainabilityMetrics.map((metric, index) => (
            <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <p className="text-xs text-[#6F83A7] mb-2">{metric.metric}</p>
              <p className="text-2xl text-white mb-2">{metric.value}</p>
              <div className="flex items-center gap-1">
                {metric.trend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-[#57ACAF]" />
                )}
                <span className="text-xs text-[#57ACAF]">{Math.abs(metric.trend)}% improvement</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'catalog':
        return renderCatalog();
      case 'website-builder':
        return renderWebsiteBuilder();
      case 'ai-insights':
        return renderAIInsights();
      default:
        return renderOverview();
    }
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Company' },
        { label: getBreadcrumbLabel() }
      ]}
      aiInsightsCount={3}
    >
      <Tabs defaultValue="overview" value={currentView} onValueChange={setCurrentView} className="space-y-6">
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="overview" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Building2 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="catalog" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Package className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Catalog</span>
            </TabsTrigger>
            <TabsTrigger 
              value="website-builder" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Globe className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Website Builder (StychX)</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">AI Insights</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>
        
        <TabsContent value="catalog">
          {renderCatalog()}
        </TabsContent>
        
        <TabsContent value="website-builder">
          {renderWebsiteBuilder()}
        </TabsContent>
        
        <TabsContent value="ai-insights">
          {renderAIInsights()}
        </TabsContent>
      </Tabs>

      {/* Catalog Preview Drawer */}
      <CatalogPreviewDrawer
        isOpen={catalogPreviewOpen}
        onClose={() => setCatalogPreviewOpen(false)}
        catalogItems={catalogData}
        onAskMarbim={onAskMarbim}
      />

      {/* Add Product Drawer */}
      <AddProductDrawer
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSuccess={() => {
          // Refresh catalog data in production
          toast.success('Product added to catalog!');
        }}
      />
    </PageLayout>
  );
}
