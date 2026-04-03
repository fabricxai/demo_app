import { useState } from 'react';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard, AIInsightItem } from '../AICard';
import { SmartTable, Column, StatusBadge } from '../SmartTable';
import { ContactDetailDrawer } from '../ContactDetailDrawer';
import { 
  Users, Building2, Mail, Phone, UserPlus, Filter,
  Download, TrendingUp, Globe, MapPin, ShoppingCart,
  DollarSign, Target, Sparkles, BarChart3, Activity,
  Search, Tag, Calendar, AlertCircle, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';

const contactsData = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    company: 'ABC Textiles Corp', 
    role: 'Procurement Manager', 
    type: 'Customer',
    email: 'sarah.j@abctextiles.com',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    status: 'Active',
    lastContact: '2 hours ago',
    tags: ['VIP', 'Enterprise'],
    totalOrders: 45,
    totalValue: '$450,000',
    notes: 'Prefers email communication. Large volume orders quarterly.',
    healthScore: 92,
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    company: 'Global Fabrics Ltd', 
    role: 'Supply Chain Director', 
    type: 'Supplier',
    email: 'mchen@globalfabrics.com',
    phone: '+86 138 0013 8000',
    location: 'Shanghai, China',
    status: 'Active',
    lastContact: '1 day ago',
    tags: ['Preferred Supplier', 'Organic'],
    totalOrders: 128,
    totalValue: '$1,200,000',
    notes: 'Reliable supplier for organic cotton. 30-day payment terms.',
    healthScore: 88,
  },
  { 
    id: 3, 
    name: 'Emma Williams', 
    company: 'Fashion Forward Inc', 
    role: 'Creative Director', 
    type: 'Customer',
    email: 'ewilliams@fashionforward.com',
    phone: '+44 20 7946 0958',
    location: 'London, UK',
    status: 'Active',
    lastContact: '3 days ago',
    tags: ['Sustainable', 'Premium'],
    totalOrders: 32,
    totalValue: '$280,000',
    notes: 'Focuses on sustainable materials. Seasonal orders.',
    healthScore: 85,
  },
  { 
    id: 4, 
    name: 'David Kumar', 
    company: 'Tech Textiles India', 
    role: 'Managing Director', 
    type: 'Supplier',
    email: 'dkumar@techtextiles.in',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    status: 'Active',
    lastContact: '1 week ago',
    tags: ['Performance Fabrics'],
    totalOrders: 89,
    totalValue: '$780,000',
    notes: 'Specializes in performance and technical fabrics.',
    healthScore: 78,
  },
  { 
    id: 5, 
    name: 'Lisa Anderson', 
    company: 'Retail Giant Co', 
    role: 'Buyer', 
    type: 'Customer',
    email: 'landerson@retailgiant.com',
    phone: '+1 555 123 4567',
    location: 'Chicago, USA',
    status: 'Inactive',
    lastContact: '3 months ago',
    tags: ['Retail'],
    totalOrders: 12,
    totalValue: '$95,000',
    notes: 'Last order was 4 months ago. Follow up needed.',
    healthScore: 45,
  },
  { 
    id: 6, 
    name: 'Ahmed Hassan', 
    company: 'Middle East Fabrics', 
    role: 'Owner', 
    type: 'Partner',
    email: 'ahassand@mefabrics.ae',
    phone: '+971 50 123 4567',
    location: 'Dubai, UAE',
    status: 'Active',
    lastContact: '5 days ago',
    tags: ['Distribution Partner'],
    totalOrders: 67,
    totalValue: '$620,000',
    notes: 'Distribution partner for Middle East region.',
    healthScore: 82,
  },
  { 
    id: 7, 
    name: 'Sophie Martinez', 
    company: 'EcoTextile Solutions', 
    role: 'Sustainability Officer', 
    type: 'Customer',
    email: 'smartinez@ecotextile.com',
    phone: '+34 91 123 4567',
    location: 'Madrid, Spain',
    status: 'Active',
    lastContact: '4 days ago',
    tags: ['Eco-Friendly', 'Premium'],
    totalOrders: 28,
    totalValue: '$310,000',
    notes: 'Strong focus on sustainable and eco-friendly materials.',
    healthScore: 90,
  },
  { 
    id: 8, 
    name: 'James Park', 
    company: 'Asia Pacific Sourcing', 
    role: 'Head of Procurement', 
    type: 'Supplier',
    email: 'jpark@apsourcing.com',
    phone: '+82 2 1234 5678',
    location: 'Seoul, South Korea',
    status: 'Active',
    lastContact: '2 days ago',
    tags: ['Tech Fabrics', 'Fast Delivery'],
    totalOrders: 95,
    totalValue: '$890,000',
    notes: 'Excellent for quick turnaround tech fabrics.',
    healthScore: 86,
  },
];

const columns: Column[] = [
  { 
    key: 'name', 
    label: 'Contact Name', 
    sortable: true,
    render: (value: string, row: any) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60">
          <AvatarFallback className="text-white text-xs">
            {value.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-white text-sm font-medium">{value}</p>
          <p className="text-[#6F83A7] text-xs">{row.role}</p>
        </div>
      </div>
    )
  },
  { 
    key: 'company', 
    label: 'Company', 
    sortable: true,
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-[#6F83A7]" />
        <span className="text-white text-sm">{value}</span>
      </div>
    )
  },
  { 
    key: 'type', 
    label: 'Type', 
    sortable: true,
    render: (value: string) => {
      const colors = {
        Customer: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
        Supplier: 'border-green-500/30 bg-green-500/10 text-green-400',
        Partner: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
      };
      return (
        <Badge variant="outline" className={colors[value as keyof typeof colors]}>
          {value}
        </Badge>
      );
    }
  },
  { 
    key: 'location', 
    label: 'Location', 
    sortable: true,
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#6F83A7]" />
        <span className="text-white text-sm">{value}</span>
      </div>
    )
  },
  { 
    key: 'totalValue', 
    label: 'Total Value', 
    sortable: true,
    render: (value: string) => (
      <span className="text-white font-medium">{value}</span>
    )
  },
  { 
    key: 'healthScore', 
    label: 'Health Score', 
    sortable: true,
    render: (value: number) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full ${
              value >= 80 ? 'bg-[#57ACAF]' : value >= 60 ? 'bg-[#EAB308]' : 'bg-red-500'
            }`}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${
          value >= 80 ? 'text-[#57ACAF]' : value >= 60 ? 'text-[#EAB308]' : 'text-red-400'
        }`}>
          {value}
        </span>
      </div>
    )
  },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true,
    render: (value: string) => <StatusBadge status={value} />
  },
];

const aiInsights: AIInsightItem[] = [
  {
    id: '1',
    type: 'recommendation',
    title: 'Re-engage Inactive Contacts',
    description: '5 high-value contacts have been inactive for 60+ days. AI suggests personalized outreach campaigns.',
    action: 'Start Campaign',
    priority: 'high',
  },
  {
    id: '2',
    type: 'insight',
    title: 'Supplier Diversification Opportunity',
    description: '80% of orders from 3 suppliers. Consider expanding supplier network to reduce risk.',
    action: 'Find Suppliers',
    priority: 'medium',
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'VIP Customer Anniversary',
    description: 'Sarah Johnson (ABC Textiles) celebrates 5 years partnership next week. Send appreciation gift.',
    action: 'Schedule Gift',
    priority: 'low',
  },
  {
    id: '4',
    type: 'warning',
    title: 'At-Risk Relationship Detected',
    description: 'Lisa Anderson engagement dropped 75%. Historical data shows 80% churn risk. Immediate action needed.',
    action: 'Review Now',
    priority: 'high',
  },
  {
    id: '5',
    type: 'insight',
    title: 'Cross-Sell Opportunity',
    description: 'Emma Williams orders sustainable cotton but may be interested in eco-friendly polyester alternatives.',
    action: 'Send Catalog',
    priority: 'medium',
  },
];

export function Contacts() {
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('all');
  const [aiInsightsOpen, setAiInsightsOpen] = useState(true);

  const handleRowClick = (row: any) => {
    setSelectedContact(row);
    setDrawerOpen(true);
  };

  const handleAskMarbim = (prompt: string) => {
    toast.success('Opening AI Assistant...');
    console.log('AI Prompt:', prompt);
  };

  const handleOpenAI = () => {
    // Open AI panel
  };

  // Filter data based on active view
  const getFilteredData = () => {
    switch (activeView) {
      case 'customers':
        return contactsData.filter(c => c.type === 'Customer');
      case 'suppliers':
        return contactsData.filter(c => c.type === 'Supplier');
      case 'partners':
        return contactsData.filter(c => c.type === 'Partner');
      case 'active':
        return contactsData.filter(c => c.status === 'Active');
      case 'inactive':
        return contactsData.filter(c => c.status === 'Inactive');
      case 'vip':
        return contactsData.filter(c => c.tags.includes('VIP') || c.tags.includes('Enterprise') || c.tags.includes('Premium'));
      default:
        return contactsData;
    }
  };

  const totalContacts = contactsData.length;
  const activeContacts = contactsData.filter(c => c.status === 'Active').length;
  const customers = contactsData.filter(c => c.type === 'Customer').length;
  const suppliers = contactsData.filter(c => c.type === 'Supplier').length;
  const partners = contactsData.filter(c => c.type === 'Partner').length;
  const inactiveCount = contactsData.filter(c => c.status === 'Inactive').length;
  const avgHealthScore = Math.round(contactsData.reduce((sum, c) => sum + c.healthScore, 0) / contactsData.length);
  const totalValue = contactsData.reduce((sum, c) => {
    const value = parseFloat(c.totalValue.replace(/[$,]/g, ''));
    return isNaN(value) ? sum : sum + value;
  }, 0);

  return (
    <PageLayout
      breadcrumbs={[{ label: 'Contacts' }]}
      aiInsightsCount={aiInsights.length}
    >


      {/* Quick Stats Banner */}
      <div className="mb-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-medium text-lg mb-1">Contact Overview</h3>
            <p className="text-sm text-[#6F83A7]">Manage and analyze your business relationships</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              onClick={() => toast.info('Advanced filters coming soon')}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
              onClick={() => toast.info('Export functionality coming soon')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs text-[#6F83A7]">Customers</span>
            </div>
            <p className="text-xl font-medium text-white">{customers}</p>
            <p className="text-xs text-[#6F83A7] mt-1">{Math.round((customers/totalContacts)*100)}% of total</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-xs text-[#6F83A7]">Suppliers</span>
            </div>
            <p className="text-xl font-medium text-white">{suppliers}</p>
            <p className="text-xs text-[#6F83A7] mt-1">{Math.round((suppliers/totalContacts)*100)}% of total</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Globe className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-xs text-[#6F83A7]">Partners</span>
            </div>
            <p className="text-xl font-medium text-white">{partners}</p>
            <p className="text-xs text-[#6F83A7] mt-1">{Math.round((partners/totalContacts)*100)}% of total</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-xs text-[#6F83A7]">At Risk</span>
            </div>
            <p className="text-xl font-medium text-white">{contactsData.filter(c => c.healthScore < 60).length}</p>
            <p className="text-xs text-[#6F83A7] mt-1">Need attention</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#EAB308]" />
              </div>
              <span className="text-xs text-[#6F83A7]">Locations</span>
            </div>
            <p className="text-xl font-medium text-white">{new Set(contactsData.map(c => c.location.split(',')[1]?.trim())).size}</p>
            <p className="text-xs text-[#6F83A7] mt-1">Countries</p>
          </div>
        </div>
      </div>

      {/* AI-Powered Insights - Collapsible */}
      <Collapsible open={aiInsightsOpen} onOpenChange={setAiInsightsOpen} className="mb-6">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl hover:bg-[#EAB308]/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-medium">AI-Powered Insights</h3>
                <p className="text-xs text-[#6F83A7]">{aiInsights.length} insights available</p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-[#6F83A7] transition-transform duration-300 ${aiInsightsOpen ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4">
            <AICard
              title=""
              insights={aiInsights}
              onActionClick={(id) => {
                const insight = aiInsights.find(i => i.id === id);
                if (insight) {
                  handleAskMarbim(`Tell me more about: ${insight.title}`);
                }
              }}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Main Content Grid */}
      <div className="space-y-6">
          {/* Filter Tabs */}
          <Tabs defaultValue="all" value={activeView} onValueChange={setActiveView} className="w-full">
            <div className="w-full min-w-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20">
              <TabsList className="grid w-full min-w-0 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 bg-transparent border-0 p-0 h-auto [&_[data-slot=tabs-trigger]]:flex-none [&_[data-slot=tabs-trigger]]:w-full">
                <TabsTrigger 
                  value="all" 
                  className="inline-flex flex-row py-3.5 px-3 sm:px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <Users className="w-4 h-4 mr-2 shrink-0 group-data-[state=active]:scale-110 transition-transform" />
                  All ({totalContacts})
                </TabsTrigger>
                <TabsTrigger 
                  value="customers"
                  className="inline-flex flex-row py-3.5 px-3 sm:px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <ShoppingCart className="w-4 h-4 mr-2 shrink-0 group-data-[state=active]:scale-110 transition-transform" />
                  Customers
                </TabsTrigger>
                <TabsTrigger 
                  value="suppliers"
                  className="inline-flex flex-row py-3.5 px-3 sm:px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <Building2 className="w-4 h-4 mr-2 shrink-0 group-data-[state=active]:scale-110 transition-transform" />
                  Suppliers
                </TabsTrigger>
                <TabsTrigger 
                  value="partners"
                  className="inline-flex flex-row py-3.5 px-3 sm:px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <Globe className="w-4 h-4 mr-2 shrink-0 group-data-[state=active]:scale-110 transition-transform" />
                  Partners
                </TabsTrigger>
                <TabsTrigger 
                  value="active"
                  className="inline-flex flex-row py-3.5 px-3 sm:px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <Activity className="w-4 h-4 mr-2 shrink-0 group-data-[state=active]:scale-110 transition-transform" />
                  Active
                </TabsTrigger>
                <TabsTrigger 
                  value="vip"
                  className="inline-flex flex-row py-3.5 px-3 sm:px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <Target className="w-4 h-4 mr-2 shrink-0 group-data-[state=active]:scale-110 transition-transform" />
                  VIP
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          <SmartTable
            title="Contacts"
            data={getFilteredData()}
            columns={columns}
            onRowClick={handleRowClick}
            searchPlaceholder="Search contacts by name, company, or email..."
            actions={
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                  onClick={() => toast.info('Bulk actions coming soon')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Selected
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-lg shadow-[#EAB308]/20"
                  onClick={() => toast.info('Add contact form coming soon')}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            }
          />
      </div>

      {/* Detail Drawer */}
      {selectedContact && (
        <ContactDetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          contact={selectedContact}
          onAskMarbim={handleAskMarbim}
          onOpenAI={handleOpenAI}
        />
      )}
    </PageLayout>
  );
}