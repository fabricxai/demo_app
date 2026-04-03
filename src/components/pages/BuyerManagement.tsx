import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { DetailDrawer, DetailDrawerData } from '../DetailDrawer';
import { BuyerDetailDrawer } from '../BuyerDetailDrawer';
import { IssueDetailDrawer } from '../IssueDetailDrawer';
import { FeedbackDetailDrawer } from '../FeedbackDetailDrawer';
import { AddBuyerDrawer } from '../AddBuyerDrawer';
import { LogIssueDrawer } from '../LogIssueDrawer';
import { WorkflowStepper } from '../WorkflowStepper';
import { MarbimAIButton } from '../MarbimAIButton';
import { ModuleSetupBanner } from '../ModuleSetupBanner';
import { BuyerManagementIntro } from './BuyerManagementIntro';
import { BuyerManagementSetup } from './BuyerManagementSetup';
import { useDatabase, MODULE_NAMES, canPerformAction } from '../../utils/supabase';
import { 
  Users, TrendingUp, AlertTriangle, CheckCircle2, Eye, Edit, Search,
  Clock, ChevronDown, Plus, Download, Filter, Upload, Sparkles, Target,
  MapPin, DollarSign, FileText, Phone, Mail, Calendar, MessageSquare,
  XCircle, BookOpen, Clipboard, BarChart3, Shield, History, Globe,
  ThumbsUp, ThumbsDown, Minus, Award, CreditCard, Activity, Map,
  Building2, UserCheck, AlertCircle, TrendingDown, Star, Settings,
  Send, FileCheck, Layers, Package, Heart, UserPlus, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { GarmentsModuleDataToolbar } from '../fabric/GarmentsModuleDataToolbar';
import { MARBIM_PROMPTS } from '../../config/garmentsIndustry';

// Dashboard — apparel account health
const dashboardSummary = [
  { label: 'Strategic accounts (A)', value: 12, score: 94, color: '#57ACAF' },
  { label: 'Growth accounts (B)', value: 28, score: 78, color: '#EAB308' },
  { label: 'Transactional (C)', value: 45, score: 62, color: '#6F83A7' },
  { label: 'OTIF / quality watch', value: 8, score: 45, color: '#D0342C' },
];

const revenueByBuyerData = [
  { buyer: 'H&M', revenue: 850000, color: '#57ACAF' },
  { buyer: 'Zara', revenue: 720000, color: '#EAB308' },
  { buyer: 'Gap', revenue: 620000, color: '#6F83A7' },
  { buyer: 'Nike', revenue: 580000, color: '#9333EA' },
  { buyer: 'Others', revenue: 430000, color: '#D0342C' },
];

const sentimentTrendData = [
  { month: 'Jun', positive: 75, neutral: 20, negative: 5 },
  { month: 'Jul', positive: 78, neutral: 18, negative: 4 },
  { month: 'Aug', positive: 82, neutral: 15, negative: 3 },
  { month: 'Sep', positive: 80, neutral: 16, negative: 4 },
  { month: 'Oct', positive: 85, neutral: 12, negative: 3 },
];

// Buyer Directory Data
const allBuyersData = [
  {
    id: 1,
    buyerName: 'H&M',
    tier: 'A',
    country: 'Sweden',
    healthScore: 94,
    revenueYTD: 850000,
    arDays: 28,
    lastContacted: '2024-10-25',
    status: 'Active',
    contact: 'Maria Garcia',
    categoryMix: 'Ladies knit · basics',
    incoterms: 'FOB Chittagong',
  },
  {
    id: 2,
    buyerName: 'Zara',
    tier: 'A',
    country: 'Spain',
    healthScore: 92,
    revenueYTD: 720000,
    arDays: 25,
    lastContacted: '2024-10-26',
    status: 'Active',
    contact: 'Carlos Rodriguez',
    categoryMix: 'Fast fashion · multi-category',
    incoterms: 'FCA Dhaka',
  },
  {
    id: 3,
    buyerName: 'Gap',
    tier: 'B',
    country: 'USA',
    healthScore: 78,
    revenueYTD: 620000,
    arDays: 35,
    lastContacted: '2024-10-20',
    status: 'Active',
    contact: 'John Smith',
    categoryMix: 'Denim · fleece',
    incoterms: 'FOB Chittagong',
  },
  {
    id: 4,
    buyerName: 'Nike',
    tier: 'A',
    country: 'USA',
    healthScore: 88,
    revenueYTD: 580000,
    arDays: 30,
    lastContacted: '2024-10-24',
    status: 'Active',
    contact: 'Sarah Johnson',
    categoryMix: 'Activewear · performance knit',
    incoterms: 'DAP warehouse',
  },
  {
    id: 5,
    buyerName: 'ACME Fashion',
    tier: 'C',
    country: 'UK',
    healthScore: 45,
    revenueYTD: 180000,
    arDays: 58,
    lastContacted: '2024-09-15',
    status: 'Watch',
    contact: 'David Lee',
    categoryMix: 'Promo wear',
    incoterms: 'EXW',
  },
];

// Feedback & Issues Data
const feedbackSurveysData = [
  {
    id: 1,
    buyer: 'H&M',
    date: '2024-10-20',
    type: 'Post-Shipment',
    csat: 9,
    nps: 9,
    sentiment: 'Positive',
    feedback: 'Excellent quality and on-time delivery',
  },
  {
    id: 2,
    buyer: 'Zara',
    date: '2024-10-18',
    type: 'Quarterly',
    csat: 8,
    nps: 8,
    sentiment: 'Positive',
    feedback: 'Good communication, minor delays',
  },
  {
    id: 3,
    buyer: 'Gap',
    date: '2024-10-15',
    type: 'Post-Shipment',
    csat: 6,
    nps: 5,
    sentiment: 'Neutral',
    feedback: 'Quality acceptable but response time slow',
  },
  {
    id: 4,
    buyer: 'ACME Fashion',
    date: '2024-10-10',
    type: 'Quarterly',
    csat: 4,
    nps: 3,
    sentiment: 'Negative',
    feedback: 'Multiple quality issues, delayed responses',
  },
];

const openIssuesData = [
  {
    id: 1,
    issueId: 'ISS-2024-421',
    buyer: 'Gap',
    category: 'Quality',
    severity: 'High',
    owner: 'Quality Team',
    status: 'In Progress',
    targetDate: '2024-11-05',
  },
  {
    id: 2,
    issueId: 'ISS-2024-422',
    buyer: 'ACME Fashion',
    category: 'Delivery',
    severity: 'Critical',
    owner: 'Logistics',
    status: 'Escalated',
    targetDate: '2024-11-02',
  },
  {
    id: 3,
    issueId: 'ISS-2024-423',
    buyer: 'Zara',
    category: 'Communication',
    severity: 'Medium',
    owner: 'Merchandising',
    status: 'Pending',
    targetDate: '2024-11-08',
  },
];

interface BuyerManagementProps {
  initialSubPage?: string;
  onAskMarbim?: (prompt: string) => void;
  onNavigateToPage?: (page: string) => void;
  isAIPanelOpen?: boolean;
}

export function BuyerManagement({ initialSubPage = 'dashboard', onAskMarbim, onNavigateToPage, isAIPanelOpen }: BuyerManagementProps) {
  const routeSubpage = useRouteSubpage('dashboard', initialSubPage);
  // Database hook
  const db = useDatabase();
  
  // UI State
  const [currentView, setCurrentView] = useState<string>(routeSubpage);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DetailDrawerData | null>(null);
  const [buyerDrawerOpen, setBuyerDrawerOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [issueDrawerOpen, setIssueDrawerOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [feedbackDrawerOpen, setFeedbackDrawerOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [showModuleSetup, setShowModuleSetup] = useState(false);
  const [setupWizardOpen, setSetupWizardOpen] = useState(false);
  const [showSetupBanner, setShowSetupBanner] = useState(true);
  const [addBuyerDrawerOpen, setAddBuyerDrawerOpen] = useState(false);
  const [logIssueDrawerOpen, setLogIssueDrawerOpen] = useState(false);
  
  // Database State
  const [buyers, setBuyers] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed Data
  const tierABuyers = buyers.filter(b => b.tier === 'A');
  const tierBBuyers = buyers.filter(b => b.tier === 'B');
  const tierCBuyers = buyers.filter(b => b.tier === 'C');
  const atRiskBuyers = buyers.filter(b => b.healthScore < 50);
  
  const computedDashboardSummary = [
    { label: 'Tier A Buyers', value: tierABuyers.length, score: 94, color: '#57ACAF' },
    { label: 'Tier B Buyers', value: tierBBuyers.length, score: 78, color: '#EAB308' },
    { label: 'Tier C Buyers', value: tierCBuyers.length, score: 62, color: '#6F83A7' },
    { label: 'At Risk', value: atRiskBuyers.length, score: 45, color: '#D0342C' },
  ];

  useEffect(() => {
    setCurrentView(routeSubpage);
  }, [routeSubpage]);

  // Close all drawers when AI panel opens
  useEffect(() => {
    if (isAIPanelOpen) {
      setDrawerOpen(false);
      setBuyerDrawerOpen(false);
      setIssueDrawerOpen(false);
      setFeedbackDrawerOpen(false);
      setAddBuyerDrawerOpen(false);
      setLogIssueDrawerOpen(false);
    }
  }, [isAIPanelOpen]);

  // Load data from database on mount
  useEffect(() => {
    loadBuyers();
    loadIssues();
    loadFeedback();
  }, []);

  // Database Operations
  async function loadBuyers() {
    try {
      setIsLoading(true);
      const data = await db.getByModule(MODULE_NAMES.BUYER_MANAGEMENT);
      const buyersData = data.filter((item: any) => item.type === 'buyer');
      
      // If no data exists, seed with initial data
      if (buyersData.length === 0) {
        await seedInitialBuyers();
      } else {
        setBuyers(buyersData);
      }
    } catch (error) {
      console.error('Failed to load buyers:', error);
      toast.error('Failed to load buyers');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadIssues() {
    try {
      const data = await db.getByModule(MODULE_NAMES.BUYER_MANAGEMENT);
      const issuesData = data.filter((item: any) => item.type === 'issue');
      
      if (issuesData.length === 0) {
        await seedInitialIssues();
      } else {
        setIssues(issuesData);
      }
    } catch (error) {
      console.error('Failed to load issues:', error);
    }
  }

  async function loadFeedback() {
    try {
      const data = await db.getByModule(MODULE_NAMES.BUYER_MANAGEMENT);
      const feedbackData = data.filter((item: any) => item.type === 'feedback');
      
      if (feedbackData.length === 0) {
        await seedInitialFeedback();
      } else {
        setFeedback(feedbackData);
      }
    } catch (error) {
      console.error('Failed to load feedback:', error);
    }
  }

  async function handleLogIssue(issueData: any) {
    try {
      // Store in database
      await db.store(issueData.id, { ...issueData, type: 'issue' }, MODULE_NAMES.BUYER_MANAGEMENT);
      
      // Store in vector DB for AI search
      const searchableContent = `
        Issue: ${issueData.issueTitle}
        Buyer: ${issueData.buyerName}
        Category: ${issueData.category}
        Severity: ${issueData.severity}
        Priority: ${issueData.priority}
        Description: ${issueData.description}
        Suggested Action: ${issueData.suggestedAction}
      `.trim();
      
      await db.storeVector(issueData.id, searchableContent, MODULE_NAMES.BUYER_MANAGEMENT);
      
      // Reload issues to show the new one
      await loadIssues();
      
      toast.success('Issue logged successfully');
    } catch (error) {
      console.error('Failed to log issue:', error);
      toast.error('Failed to log issue');
    }
  }

  async function seedInitialBuyers() {
    const initialBuyers = allBuyersData.map(buyer => ({
      ...buyer,
      type: 'buyer',
    }));
    
    for (const buyer of initialBuyers) {
      const id = `buyer-${buyer.id}-${Date.now()}`;
      await db.store(id, buyer, MODULE_NAMES.BUYER_MANAGEMENT);
      
      // Store in vector DB for AI search
      const searchableContent = `${buyer.buyerName} ${buyer.country} ${buyer.tier} ${buyer.contact} ${buyer.status}`;
      await db.storeVector(id, searchableContent, MODULE_NAMES.BUYER_MANAGEMENT, buyer);
    }
    
    setBuyers(initialBuyers);
  }

  async function seedInitialIssues() {
    const initialIssues = openIssuesData.map(issue => ({
      ...issue,
      type: 'issue',
    }));
    
    for (const issue of initialIssues) {
      const id = `issue-${issue.id}-${Date.now()}`;
      await db.store(id, issue, MODULE_NAMES.BUYER_MANAGEMENT);
    }
    
    setIssues(initialIssues);
  }

  async function seedInitialFeedback() {
    const initialFeedback = [
      {
        id: 1,
        feedbackId: 'FB-2024-001',
        buyer: 'H&M',
        sentiment: 'Positive',
        category: 'Quality',
        rating: 5,
        date: '2024-10-25',
        type: 'feedback',
      },
      {
        id: 2,
        feedbackId: 'FB-2024-002',
        buyer: 'Zara',
        sentiment: 'Neutral',
        category: 'Delivery',
        rating: 3,
        date: '2024-10-24',
        type: 'feedback',
      },
    ];
    
    for (const fb of initialFeedback) {
      const id = `feedback-${fb.id}-${Date.now()}`;
      await db.store(id, fb, MODULE_NAMES.BUYER_MANAGEMENT);
    }
    
    setFeedback(initialFeedback);
  }

  async function handleBuyerAdded(newBuyer: any) {
    try {
      const id = `buyer-${Date.now()}`;
      const buyerData = {
        ...newBuyer,
        id: Date.now(),
        type: 'buyer',
      };
      await db.store(id, buyerData, MODULE_NAMES.BUYER_MANAGEMENT);
      
      // Store in vector DB
      const searchableContent = `${buyerData.buyerName} ${buyerData.country} ${buyerData.tier} ${buyerData.contact}`;
      await db.storeVector(id, searchableContent, MODULE_NAMES.BUYER_MANAGEMENT, buyerData);
      
      toast.success('Buyer added successfully');
      loadBuyers();
    } catch (error) {
      console.error('Failed to add buyer:', error);
      toast.error('Failed to add buyer');
    }
  }

  // Helper function to get country code from country name
  const getCountryCode = (country: string): string => {
    const countryCodeMap: Record<string, string> = {
      'United Kingdom': 'GB',
      'USA': 'US',
      'Canada': 'CA',
      'Germany': 'DE',
      'France': 'FR',
      'Italy': 'IT',
      'Spain': 'ES',
      'Netherlands': 'NL',
      'Belgium': 'BE',
      'China': 'CN',
      'India': 'IN',
      'Japan': 'JP',
      'South Korea': 'KR',
      'Australia': 'AU',
    };
    return countryCodeMap[country] || 'US';
  };

  // All Buyers Columns
  const allBuyersColumns: Column[] = [
    { key: 'buyerName', label: 'Buyer / brand', sortable: true },
    {
      key: 'categoryMix',
      label: 'Category mix',
      render: (v) => v || '—',
    },
    {
      key: 'incoterms',
      label: 'Primary incoterm',
      render: (v) => v || '—',
    },
    { 
      key: 'tier', 
      label: 'Account tier',
      render: (value) => {
        const colors: any = {
          'A': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'B': 'bg-[#EAB308]/10 text-[#EAB308]',
          'C': 'bg-[#6F83A7]/10 text-[#6F83A7]',
        };
        return <Badge className={colors[value]}>Tier {value}</Badge>;
      },
    },
    { key: 'country', label: 'Country', sortable: true },
    {
      key: 'healthScore',
      label: 'Health Score',
      sortable: true,
      render: (value) => {
        const color = value >= 80 ? 'text-[#57ACAF]' : value >= 60 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}</span>;
      },
    },
    { 
      key: 'revenueYTD', 
      label: 'Shipment value (YTD)', 
      sortable: true,
      render: (value) => <span className="text-[#57ACAF]">${(value / 1000).toFixed(0)}K</span>
    },
    { key: 'arDays', label: 'AR Days', sortable: true },
    { key: 'lastContacted', label: 'Last Contacted', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Active': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Watch': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Critical': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Feedback Surveys Columns
  const feedbackSurveysColumns: Column[] = [
    { key: 'buyer', label: 'Buyer', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'type', label: 'Type' },
    { key: 'csat', label: 'CSAT', sortable: true, render: (value) => `${value}/10` },
    { key: 'nps', label: 'NPS', sortable: true, render: (value) => `${value}/10` },
    {
      key: 'sentiment',
      label: 'Sentiment',
      render: (value) => {
        const colors: any = {
          'Positive': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Neutral': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Negative': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Open Issues Columns
  const openIssuesColumns: Column[] = [
    { key: 'issueId', label: 'Issue ID', sortable: true },
    { key: 'buyer', label: 'Buyer', sortable: true },
    { key: 'category', label: 'Category' },
    {
      key: 'severity',
      label: 'Severity',
      render: (value) => {
        const colors: any = {
          'Low': 'bg-[#6F83A7]/10 text-[#6F83A7]',
          'Medium': 'bg-[#EAB308]/10 text-[#EAB308]',
          'High': 'bg-[#D0342C]/10 text-[#D0342C]',
          'Critical': 'bg-[#D0342C]/20 text-[#D0342C] border border-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
    { key: 'owner', label: 'Owner' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Pending': 'bg-[#6F83A7]/10 text-[#6F83A7]',
          'In Progress': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Escalated': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
    { key: 'targetDate', label: 'Target Date', sortable: true },
  ];

  // Generate drawer data based on sub-page context
  const generateDrawerData = (record: any, subPage: string): DetailDrawerData => {
    const baseData: DetailDrawerData = {
      id: record.id || record.buyerId || 'N/A',
      title: record.buyerName || record.buyer || record.name || 'Unknown',
      subtitle: record.country || 'Unknown Location',
      type: 'Buyer',
      score: record.tier === 'A' ? 95 : record.tier === 'B' ? 85 : 70,
      country: record.country || undefined,
      countryCode: record.country ? getCountryCode(record.country) : undefined,
      logo: undefined,
      status: {
        label: record.tier || record.status || 'Active',
        variant: record.tier === 'A' ? 'success' : record.tier === 'B' ? 'warning' : 'default'
      },
      overview: {
        keyAttributes: [
          { label: 'Buyer ID', value: record.id || 'N/A', icon: <Building2 className="w-4 h-4" /> },
          { label: 'Tier', value: record.tier || 'N/A', icon: <Star className="w-4 h-4" /> },
          { label: 'Country', value: record.country || 'N/A', icon: <Globe className="w-4 h-4" /> },
          { label: 'Total Orders', value: record.ordersCount || 'N/A', icon: <Package className="w-4 h-4" /> },
          { label: 'Credit Limit', value: record.creditLimit || 'N/A', icon: <CreditCard className="w-4 h-4" /> },
          { label: 'Payment Terms', value: record.paymentTerms || 'N/A', icon: <DollarSign className="w-4 h-4" /> },
        ],
        metrics: [
          { label: 'YTD Revenue', value: record.ytdRevenue || '$0', change: '+15%', trend: 'up' },
          { label: 'Avg Order Value', value: record.avgOrderValue || '$0', change: '+8%', trend: 'up' },
          { label: 'On-Time Delivery', value: record.otdRate || '95%', change: '-2%', trend: 'down' },
        ],
        description: `${record.buyerName || 'This buyer'} is a ${record.tier || 'valued'}-tier client with ${record.ordersCount || 0} completed orders. They specialize in ${record.productCategories || 'textile products'} and maintain ${record.complianceStatus || 'good'} compliance status.`,
        relatedLinks: [
          { label: 'View Orders', module: 'Production', onClick: () => toast.info('Opening orders...') },
          { label: 'Compliance Docs', module: 'Compliance', onClick: () => toast.info('Opening compliance...') },
        ],
      },
      interactions: [
        { date: 'Nov 18, 2024', type: 'email', description: 'Sent Q1 2025 pricing sheet', sentiment: 'positive' },
        { date: 'Nov 10, 2024', type: 'call', description: 'Discussed new product line requirements', sentiment: 'positive' },
        { date: 'Nov 5, 2024', type: 'meeting', description: 'Quarterly business review meeting', sentiment: 'neutral' },
        { date: 'Oct 28, 2024', type: 'system', description: 'Payment received for Invoice #10234', sentiment: 'positive' },
      ],
      documents: [
        { 
          name: 'Contract_2025.pdf', 
          type: 'PDF', 
          uploadDate: 'Jan 1, 2025', 
          uploader: 'Legal Team',
          tag: 'Contract',
          aiSummary: 'Annual contract for 2025. Volume commitment: 500K units. Payment terms: Net 60.'
        },
        { 
          name: 'Compliance_Certificate_BSCI.pdf', 
          type: 'PDF', 
          uploadDate: 'Dec 15, 2024', 
          uploader: 'Compliance Team',
          tag: 'Certificate',
          aiSummary: 'BSCI compliance certificate valid until Dec 2025. All audit points passed.'
        },
      ],
      aiInsights: {
        summary: `${record.buyerName || 'This buyer'} shows strong partnership potential with ${record.ytdRevenue || 'significant'} YTD revenue. Payment history is excellent with ${record.paymentScore || '95%'} on-time payment rate. Recent order velocity has increased by 15% this quarter, indicating growing business relationship.`,
        recommendations: [
          {
            title: 'Offer Volume Discount',
            description: 'Based on order history, buyer qualifies for 5% volume discount on orders >50K units.',
            action: 'Generate Proposal',
            onClick: () => toast.success('Creating volume discount proposal...')
          },
          {
            title: 'Schedule Business Review',
            description: 'Q4 business review is due. Schedule to discuss 2025 expansion plans.',
            action: 'Schedule Meeting',
            onClick: () => toast.success('Opening calendar...')
          },
        ],
        references: [
          'Order history: 45 orders, $2.3M total value',
          'Payment analytics: 100% on-time payment last 12 months',
          'Market intelligence: Buyer expanding to new regions',
        ]
      }
    };

    // Customize based on sub-page
    switch (subPage) {
      case 'buyer-directory':
        baseData.title = `Buyer: ${record.buyerName || record.buyer || 'Unknown'}`;
        baseData.aiInsights.summary = `${record.buyerName} shows strong partnership with ${record.ytdRevenue || 'significant'} YTD revenue. Excellent payment history.`;
        break;
      
      case 'feedback-issues':
        baseData.title = `Feedback: ${record.buyerName || 'Buyer'}`;
        baseData.overview.keyAttributes.push(
          { label: 'Issue Count', value: record.issueCount || '0', icon: <AlertTriangle className="w-4 h-4" /> }
        );
        baseData.aiInsights.summary = `Analysis of feedback patterns for ${record.buyerName}. Recent satisfaction score trending positive.`;
        break;
      
      default:
        baseData.title = `Buyer: ${record.buyerName || record.buyer || 'Unknown'}`;
    }
    
    return baseData;
  };

  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    
    // Check if clicking on an issue (has issueId property)
    if (record.issueId) {
      setSelectedIssue(record);
      setIssueDrawerOpen(true);
    }
    // Check if clicking on feedback (has sentiment and csat/nps properties)
    else if (record.sentiment && (record.csat !== undefined || record.nps !== undefined)) {
      setSelectedFeedback(record);
      setFeedbackDrawerOpen(true);
    }
    // Use BuyerDetailDrawer for buyer-directory
    else if (currentView === 'buyer-directory') {
      setSelectedBuyer(record);
      setBuyerDrawerOpen(true);
    } 
    // Use generic DetailDrawer for other views
    else {
      const detailData = generateDrawerData(record, currentView);
      setDrawerData(detailData);
      setDrawerOpen(true);
    }
  };

  const renderDashboard = () => (
    <>
      {/* Module Setup Banner */}
      {showSetupBanner && (
        <ModuleSetupBanner
          moduleName="Buyer Management"
          onSetupClick={() => setSetupWizardOpen(true)}
        />
      )}

      {/* Hero Banner with Executive Summary */}
      <div className="bg-gradient-to-br from-[#57ACAF]/10 via-[#EAB308]/5 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(87,172,175,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/30">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl mb-2">Buyer Relationship Intelligence</h2>
                <p className="text-[#6F83A7] text-sm max-w-2xl">
                  Comprehensive dashboard providing real-time insights into buyer health, engagement patterns, 
                  revenue performance, and relationship risk factors across your entire buyer portfolio.
                </p>
              </div>
            </div>
            <MarbimAIButton
              marbimPrompt="Provide a comprehensive executive summary of the current buyer portfolio including: 1) Overall portfolio health assessment, 2) Top revenue-generating buyers and their growth trends, 3) Buyers at risk of churn with early warning signals, 4) Key opportunities for revenue expansion, 5) Critical action items requiring immediate attention, 6) Comparative analysis vs. last quarter."
              onAskMarbim={onAskMarbim}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Total Buyers</span>
              </div>
              <div className="text-2xl text-white mb-1">93</div>
              <div className="text-xs text-[#57ACAF]">+7 new this quarter</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs text-[#6F83A7]">Portfolio Value</span>
              </div>
              <div className="text-2xl text-white mb-1">$3.2M</div>
              <div className="text-xs text-[#57ACAF]">+18% vs LY</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Avg Health Score</span>
              </div>
              <div className="text-2xl text-white mb-1">82%</div>
              <div className="text-xs text-[#57ACAF]">+3.5% improvement</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Satisfaction</span>
              </div>
              <div className="text-2xl text-white mb-1">8.4/10</div>
              <div className="text-xs text-[#57ACAF]">+0.6 pts</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#D0342C]" />
                <span className="text-xs text-[#6F83A7]">At-Risk Buyers</span>
              </div>
              <div className="text-2xl text-white mb-1">8</div>
              <div className="text-xs text-[#D0342C]">Needs attention</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <KPICard
          title="Buyer Health Score"
          value="82%"
          change={3.5}
          changeLabel="vs last quarter"
          icon={Heart}
          trend="up"
        />
        <KPICard
          title="Active Orders"
          value="156"
          change={12.1}
          changeLabel="vs last month"
          icon={Package}
          trend="up"
        />
        <KPICard
          title="Open Issues"
          value="8"
          change={-25.0}
          changeLabel="reduction"
          icon={AlertTriangle}
          trend="up"
        />
        <KPICard
          title="Avg Response Time"
          value="4.2h"
          change={-18.5}
          changeLabel="improvement"
          icon={Clock}
          trend="up"
        />
        <KPICard
          title="AR Status"
          value="32 days"
          change={-5.2}
          icon={CreditCard}
          trend="up"
        />
        <KPICard
          title="Renewal Risk"
          value="3 buyers"
          icon={AlertCircle}
          trend="neutral"
        />
      </div>

      {/* Buyer Tier Distribution */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#57ACAF]" />
              Buyer Portfolio by Tier
            </h3>
            <p className="text-sm text-[#6F83A7]">
              Segmented view of buyer distribution with health scores and engagement metrics
            </p>
          </div>
          <MarbimAIButton
            marbimPrompt="Analyze buyer tier distribution and provide insights on: 1) Opportunities to promote Tier B buyers to Tier A status, 2) Risk factors for Tier A buyers that might cause tier downgrade, 3) Strategies to improve health scores for Tier C buyers, 4) Revenue optimization tactics for each tier segment, 5) Recommended resource allocation across tiers."
            onAskMarbim={onAskMarbim}
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {dashboardSummary.map((item, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 cursor-pointer group"
              onClick={() => toast.info(`Viewing ${item.label} details`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Users className="w-7 h-7" style={{ color: item.color }} />
                </div>
                <div className="text-4xl" style={{ color: item.color }}>{item.value}</div>
              </div>
              <div className="text-[#6F83A7] mb-3">{item.label}</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">Avg Health</span>
                  <span className="text-white">{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-2" />
              </div>
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6F83A7]">View Details</span>
                  <ChevronRight className="w-4 h-4 text-[#6F83A7] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Analytics and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Buyer Chart */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                Revenue Distribution (YTD)
              </h3>
              <p className="text-sm text-[#6F83A7]">Top revenue-generating buyers and their contribution</p>
            </div>
            <div className="flex gap-2">
              <MarbimAIButton
                marbimPrompt="Analyze YTD revenue distribution across buyers. Identify: 1) Revenue concentration risk (over-dependence on top buyers), 2) Growth opportunities with mid-tier buyers, 3) Buyers with declining revenue and root causes, 4) Seasonal patterns and forecast for next quarter, 5) Recommended actions to diversify revenue base."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
              <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-transparent hover:bg-white/5">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={revenueByBuyerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="buyer" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
              <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#ffffff' }}
                formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                {revenueByBuyerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Total Revenue</div>
                <div className="text-lg text-white">$3.2M</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Avg Order Value</div>
                <div className="text-lg text-white">$20.5K</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Top 5 Contribution</div>
                <div className="text-lg text-white">68%</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Strategic Insights */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div>
                <h3 className="text-white mb-1">AI Strategic Insights</h3>
                <p className="text-xs text-[#6F83A7]">Actionable intelligence for buyer management</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 group cursor-pointer">
                <div className="flex items-start gap-3">
                  <Target className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-2">Upsell Opportunity Detected</div>
                    <div className="text-xs text-[#6F83A7] mb-2">
                      H&M, Zara, and Gap show 30%+ order frequency increase. Prime candidates for volume discount programs.
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black text-xs h-7"
                        onClick={() => toast.info('Opening upsell strategy')}
                      >
                        View Strategy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 group cursor-pointer">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#D0342C] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-2">Churn Risk Alert</div>
                    <div className="text-xs text-[#6F83A7] mb-2">
                      ACME Fashion showing 40% engagement decline. Immediate intervention recommended.
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-[#D0342C] hover:bg-[#D0342C]/90 text-white text-xs h-7"
                        onClick={() => toast.warning('Opening retention plan')}
                      >
                        Take Action
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 group cursor-pointer">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-2">Response Time Optimization</div>
                    <div className="text-xs text-[#6F83A7] mb-2">
                      Inquiry response time increased to 4.2h. Workflow automation could reduce by 60%.
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black text-xs h-7"
                        onClick={() => toast.info('Analyzing workflow')}
                      >
                        Optimize
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                <h4 className="text-white text-sm">Growth Forecast</h4>
              </div>
              <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs">Q4 2024</Badge>
            </div>
            <div className="text-2xl text-white mb-2">+24% Revenue</div>
            <p className="text-xs text-[#6F83A7] mb-3">
              Based on current trends and pipeline analysis
            </p>
            <MarbimAIButton
              marbimPrompt="Generate detailed Q4 revenue forecast based on: 1) Current buyer order patterns, 2) Historical seasonal trends, 3) Pipeline opportunities, 4) Market conditions, 5) Risk-adjusted probability. Include scenario analysis (best case, expected, worst case) and key assumptions."
              onAskMarbim={onAskMarbim}
              size="sm"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Buyer Sentiment and Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#57ACAF]" />
                Sentiment Trend Analysis
              </h3>
              <p className="text-sm text-[#6F83A7]">Buyer satisfaction evolution over time</p>
            </div>
            <MarbimAIButton
              marbimPrompt="Analyze buyer sentiment trends over the last 5 months. Identify: 1) Factors driving positive sentiment increase, 2) Any emerging negative patterns, 3) Correlation between sentiment and order volume, 4) Buyers with sentiment decline requiring attention, 5) Best practices from high-satisfaction relationships."
              onAskMarbim={onAskMarbim}
              size="sm"
            />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={sentimentTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#6F83A7" />
              <YAxis stroke="#6F83A7" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
              />
              <Area type="monotone" dataKey="positive" stackId="1" stroke="#57ACAF" fill="#57ACAF" fillOpacity={0.6} />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="#EAB308" fill="#EAB308" fillOpacity={0.6} />
              <Area type="monotone" dataKey="negative" stackId="1" stroke="#D0342C" fill="#D0342C" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Positive (85%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EAB308]" />
                <span className="text-xs text-[#6F83A7]">Neutral (12%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#D0342C]" />
                <span className="text-xs text-[#6F83A7]">Negative (3%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Heatmap */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#57ACAF]" />
                Engagement Metrics
              </h3>
              <p className="text-sm text-[#6F83A7]">Communication frequency and response quality</p>
            </div>
            <MarbimAIButton
              marbimPrompt="Analyze buyer engagement patterns including: 1) Communication frequency trends, 2) Response time analysis by buyer tier, 3) Engagement quality indicators, 4) Correlation between engagement and business outcomes, 5) Recommendations to improve engagement with low-touch buyers."
              onAskMarbim={onAskMarbim}
              size="sm"
            />
          </div>

          <div className="space-y-4">
            {[
              { category: 'Email Responses', value: 94, change: '+5%', color: '#57ACAF', icon: Mail },
              { category: 'Meeting Attendance', value: 87, change: '+3%', color: '#EAB308', icon: Calendar },
              { category: 'Portal Activity', value: 78, change: '-2%', color: '#6F83A7', icon: Globe },
              { category: 'Feedback Participation', value: 72, change: '+8%', color: '#57ACAF', icon: MessageSquare },
            ].map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${metric.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: metric.color }} />
                      </div>
                      <div>
                        <div className="text-white text-sm">{metric.category}</div>
                        <div className="text-xs text-[#6F83A7]">Last 30 days</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-lg">{metric.value}%</div>
                      <div 
                        className={`text-xs ${metric.change.startsWith('+') ? 'text-[#57ACAF]' : 'text-[#D0342C]'}`}
                      >
                        {metric.change}
                      </div>
                    </div>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Critical Action Items */}
      <div className="bg-gradient-to-br from-[#D0342C]/10 to-[#D0342C]/5 border border-[#D0342C]/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#D0342C]/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-[#D0342C]" />
            </div>
            <div>
              <h3 className="text-white mb-2">Critical Action Items</h3>
              <p className="text-sm text-[#6F83A7]">
                Priority tasks requiring immediate attention to maintain buyer relationships
              </p>
            </div>
          </div>
          <MarbimAIButton
            marbimPrompt="Generate prioritized action plan for critical buyer management tasks. Include: 1) High-risk buyers requiring intervention, 2) Overdue follow-ups and communications, 3) Contract renewals due within 30 days, 4) Unresolved issues impacting satisfaction, 5) Recommended escalation paths and resource allocation. Prioritize by business impact and urgency."
            onAskMarbim={onAskMarbim}
            size="lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#D0342C]/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-[#D0342C]" />
              </div>
              <div className="flex-1">
                <div className="text-white text-sm mb-1">8 Buyers At Risk</div>
                <div className="text-xs text-[#6F83A7]">Churn probability {'>'} 40%</div>
              </div>
            </div>
            <Button 
              size="sm" 
              className="w-full bg-[#D0342C] hover:bg-[#D0342C]/90 text-white"
              onClick={() => toast.warning('Opening at-risk buyers')}
            >
              View & Act
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-[#EAB308]" />
              </div>
              <div className="flex-1">
                <div className="text-white text-sm mb-1">12 Overdue Follow-ups</div>
                <div className="text-xs text-[#6F83A7]">Pending {'>'} 5 days</div>
              </div>
            </div>
            <Button 
              size="sm" 
              className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
              onClick={() => toast.info('Opening follow-up queue')}
            >
              Review Queue
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-4 h-4 text-[#57ACAF]" />
              </div>
              <div className="flex-1">
                <div className="text-white text-sm mb-1">5 Contract Renewals</div>
                <div className="text-xs text-[#6F83A7]">Due within 30 days</div>
              </div>
            </div>
            <Button 
              size="sm" 
              className="w-full bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white"
              onClick={() => toast.info('Opening renewal pipeline')}
            >
              Start Process
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  const renderBuyerDirectory = () => (
    <>
      <GarmentsModuleDataToolbar
        className="mb-6"
        title="Buyer directory — apparel accounts"
        subtitle="Brands, retailers, and traders with tier, shipment value, incoterms, and category mix"
        onFilter={() => toast.info('Filter by season, category, or incoterm')}
        onExport={() => toast.success('Preparing buyer export…')}
        exportLabel="Export account list"
        onRefresh={() => toast.success('Directory refreshed')}
        onAskMarbim={onAskMarbim}
        askPrompt={MARBIM_PROMPTS.buyerDirectory}
        primaryAction={{
          label: 'Add buyer account',
          onClick: () => setAddBuyerDrawerOpen(true),
          icon: Plus,
        }}
      />

      <Tabs key={`buyer-directory-${currentView}`} defaultValue="all-buyers" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="all-buyers" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Users className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">All Buyers</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tiered-view" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Layers className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Tiered View</span>
            </TabsTrigger>
            <TabsTrigger 
              value="buyer-map" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Map className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Buyer Map</span>
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

        <TabsContent value="all-buyers" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">All buyer accounts</h3>
            <SmartTable
              columns={allBuyersColumns}
              data={buyers}
              searchPlaceholder="Search brand, category, incoterm, country…"
              onRowClick={handleRowClick}
            />
          </div>
          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Buyer Intelligence</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM flags inactive buyers and suggests reactivation campaigns based on engagement patterns.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze inactive buyers and suggest personalized reactivation campaigns based on historical engagement patterns, order history, and buyer preferences."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tiered-view" className="space-y-6">
          {/* Tier Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-none">Elite</Badge>
              </div>
              <div className="text-2xl text-white mb-1">12</div>
              <div className="text-sm text-[#6F83A7]">Tier A Buyers</div>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#6F83A7]">YTD Revenue</span>
                <span className="text-sm text-[#57ACAF]">$2.15M</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#EAB308]" />
                </div>
                <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-none">Growing</Badge>
              </div>
              <div className="text-2xl text-white mb-1">28</div>
              <div className="text-sm text-[#6F83A7]">Tier B Buyers</div>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#6F83A7]">YTD Revenue</span>
                <span className="text-sm text-[#EAB308]">$1.32M</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <Badge className="bg-[#6F83A7]/20 text-[#6F83A7] border-none">Standard</Badge>
              </div>
              <div className="text-2xl text-white mb-1">45</div>
              <div className="text-sm text-[#6F83A7]">Tier C Buyers</div>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#6F83A7]">YTD Revenue</span>
                <span className="text-sm text-[#6F83A7]">$810K</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl text-white mb-1">5</div>
              <div className="text-sm text-[#6F83A7]">Promotion Candidates</div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10"
                  onClick={() => toast.info('Opening tier promotion review')}
                >
                  Review
                </Button>
              </div>
            </div>
          </div>

          {/* Tiered Buyer Lists */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier A */}
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                    <Award className="w-4 h-4 text-[#57ACAF]" />
                  </div>
                  <h3 className="text-white">Tier A Buyers</h3>
                </div>
                <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-none">12</Badge>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mb-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10"
                  onClick={() => toast.success('Exporting Tier A buyer list')}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10"
                  onClick={() => toast.info('Opening bulk contact form')}
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Contact
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {allBuyersData.filter(b => b.tier === 'A').map((buyer, index) => (
                  <div 
                    key={index} 
                    className="group p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#57ACAF]/30 transition-all cursor-pointer"
                    onClick={() => handleRowClick(buyer)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white text-sm">{buyer.buyerName}</div>
                          <div className="text-xs text-[#6F83A7] flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {buyer.country}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-sm text-[#57ACAF] font-medium">{buyer.healthScore}</div>
                        <div className="text-xs text-[#6F83A7]">${(buyer.revenueYTD / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 h-7 text-xs text-[#57ACAF] hover:bg-[#57ACAF]/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Contacting ${buyer.buyerName}`);
                        }}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 h-7 text-xs text-[#57ACAF] hover:bg-[#57ACAF]/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Emailing ${buyer.buyerName}`);
                        }}
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier B */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-[#EAB308]" />
                  </div>
                  <h3 className="text-white">Tier B Buyers</h3>
                </div>
                <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-none">28</Badge>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mb-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10"
                  onClick={() => toast.success('Exporting Tier B buyer list')}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10"
                  onClick={() => toast.info('Viewing promotion candidates')}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Promote
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {allBuyersData.filter(b => b.tier === 'B').map((buyer, index) => (
                  <div 
                    key={index} 
                    className="group p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#EAB308]/30 transition-all cursor-pointer"
                    onClick={() => handleRowClick(buyer)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-black" />
                        </div>
                        <div>
                          <div className="text-white text-sm">{buyer.buyerName}</div>
                          <div className="text-xs text-[#6F83A7] flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {buyer.country}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-sm text-[#EAB308] font-medium">{buyer.healthScore}</div>
                        <div className="text-xs text-[#6F83A7]">${(buyer.revenueYTD / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 h-7 text-xs text-[#EAB308] hover:bg-[#EAB308]/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Viewing ${buyer.buyerName} analytics`);
                        }}
                      >
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Stats
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 h-7 text-xs text-[#EAB308] hover:bg-[#EAB308]/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`Promoting ${buyer.buyerName} to Tier A`);
                        }}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Promote
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier C */}
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#6F83A7]" />
                  </div>
                  <h3 className="text-white">Tier C Buyers</h3>
                </div>
                <Badge className="bg-[#6F83A7]/20 text-[#6F83A7] border-none">45</Badge>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mb-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-[#6F83A7]/30 text-[#6F83A7] hover:bg-[#6F83A7]/10"
                  onClick={() => toast.success('Exporting Tier C buyer list')}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-[#6F83A7]/30 text-[#6F83A7] hover:bg-[#6F83A7]/10"
                  onClick={() => toast.info('Creating engagement campaign')}
                >
                  <Send className="w-3 h-3 mr-1" />
                  Engage
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {allBuyersData.filter(b => b.tier === 'C').map((buyer, index) => (
                  <div 
                    key={index} 
                    className="group p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#6F83A7]/30 transition-all cursor-pointer"
                    onClick={() => handleRowClick(buyer)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6F83A7] to-[#6F83A7]/60 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white text-sm">{buyer.buyerName}</div>
                          <div className="text-xs text-[#6F83A7] flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {buyer.country}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-sm text-[#6F83A7] font-medium">{buyer.healthScore}</div>
                        <div className="text-xs text-[#6F83A7]">${(buyer.revenueYTD / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 h-7 text-xs text-[#6F83A7] hover:bg-[#6F83A7]/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Scheduling review with ${buyer.buyerName}`);
                        }}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Review
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 h-7 text-xs text-[#6F83A7] hover:bg-[#6F83A7]/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Creating campaign for ${buyer.buyerName}`);
                        }}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Campaign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">AI Tier Management</div>
                    <div className="text-sm text-[#6F83A7]">
                      MARBIM automatically reassigns tiers when volume or performance thresholds change, ensuring accurate buyer segmentation.
                    </div>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze buyer tier assignments and recommend automatic tier changes based on volume, performance metrics, and threshold criteria. Include specific buyers ready for promotion or demotion."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Promotion Opportunities</div>
                    <div className="text-sm text-[#6F83A7]">
                      Identify high-potential Tier B and C buyers ready for tier advancement based on recent performance trends.
                    </div>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Identify buyers close to tier promotion thresholds and provide detailed performance analysis including revenue trends, order frequency, and payment reliability metrics."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="buyer-map" className="space-y-6">
          {/* Regional Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-sm text-[#6F83A7]">Total Countries</div>
              </div>
              <div className="text-3xl text-white mb-1">28</div>
              <div className="text-xs text-[#6F83A7]">Across 5 continents</div>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-[#EAB308]" />
                <div className="text-sm text-[#6F83A7]">Top Region</div>
              </div>
              <div className="text-xl text-white mb-1">Europe</div>
              <div className="text-xs text-[#6F83A7]">35 buyers, $2.2M revenue</div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-white" />
                <div className="text-sm text-[#6F83A7]">Fastest Growing</div>
              </div>
              <div className="text-xl text-white mb-1">Asia Pacific</div>
              <div className="text-xs text-[#57ACAF]">+24% YoY growth</div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-white" />
                <div className="text-sm text-[#6F83A7]">Expansion Potential</div>
              </div>
              <div className="text-xl text-white mb-1">Latin America</div>
              <div className="text-xs text-[#EAB308]">Low penetration, high demand</div>
            </div>
          </div>

          {/* Interactive Map Placeholder */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Global Buyer Distribution</h3>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-white/10 text-[#6F83A7] hover:bg-white/5"
                  onClick={() => toast.info('Filtering by revenue')}
                >
                  <Filter className="w-3 h-3 mr-1" />
                  Filter
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-white/10 text-[#6F83A7] hover:bg-white/5"
                  onClick={() => toast.success('Exporting map data')}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            <div className="aspect-video rounded-xl bg-gradient-to-br from-[#57ACAF]/5 via-[#EAB308]/5 to-[#6F83A7]/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-20 h-20 text-[#6F83A7]/50 mx-auto mb-4" />
                  <div className="text-white mb-2">Interactive World Map</div>
                  <div className="text-sm text-[#6F83A7] mb-4">Click regions to view buyer details</div>
                </div>
              </div>
              
              {/* Interactive Hotspots */}
              <div className="absolute top-1/4 left-1/4 group cursor-pointer">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-[#57ACAF] animate-pulse" />
                  <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-[#57ACAF]/30 animate-ping" />
                  <div className="hidden group-hover:block absolute top-6 left-0 bg-[#0D1117] border border-white/20 rounded-lg p-3 shadow-xl z-10 whitespace-nowrap">
                    <div className="text-white text-sm mb-1">North America</div>
                    <div className="text-xs text-[#6F83A7]">28 buyers • $1.8M</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/3 right-1/3 group cursor-pointer">
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-[#EAB308] animate-pulse" />
                  <div className="absolute -top-2.5 -left-2.5 w-10 h-10 rounded-full bg-[#EAB308]/30 animate-ping" />
                  <div className="hidden group-hover:block absolute top-6 left-0 bg-[#0D1117] border border-white/20 rounded-lg p-3 shadow-xl z-10 whitespace-nowrap">
                    <div className="text-white text-sm mb-1">Europe</div>
                    <div className="text-xs text-[#6F83A7]">35 buyers • $2.2M</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-1/3 right-1/4 group cursor-pointer">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-[#6F83A7] animate-pulse" />
                  <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-[#6F83A7]/30 animate-ping" />
                  <div className="hidden group-hover:block absolute top-6 left-0 bg-[#0D1117] border border-white/20 rounded-lg p-3 shadow-xl z-10 whitespace-nowrap">
                    <div className="text-white text-sm mb-1">Asia Pacific</div>
                    <div className="text-xs text-[#6F83A7]">22 buyers • $1.1M</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { 
                region: 'North America', 
                buyers: 28, 
                revenue: '$1.8M', 
                health: 85,
                color: '#57ACAF',
                countries: ['USA (18)', 'Canada (6)', 'Mexico (4)'],
                topBuyer: 'Nike',
                growth: '+12%'
              },
              { 
                region: 'Europe', 
                buyers: 35, 
                revenue: '$2.2M', 
                health: 88,
                color: '#EAB308',
                countries: ['UK (12)', 'Germany (8)', 'Spain (7)', 'Others (8)'],
                topBuyer: 'Zara',
                growth: '+18%'
              },
              { 
                region: 'Asia Pacific', 
                buyers: 22, 
                revenue: '$1.1M', 
                health: 78,
                color: '#6F83A7',
                countries: ['Japan (8)', 'Australia (6)', 'South Korea (5)', 'Others (3)'],
                topBuyer: 'Uniqlo',
                growth: '+24%'
              },
            ].map((region, index) => (
              <div key={index} className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
                {/* Region Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${region.color}20` }}
                    >
                      <Globe className="w-5 h-5" style={{ color: region.color }} />
                    </div>
                    <div>
                      <div className="text-white">{region.region}</div>
                      <div className="text-xs text-[#6F83A7]">{region.buyers} buyers</div>
                    </div>
                  </div>
                  <Badge 
                    className="border-none" 
                    style={{ 
                      backgroundColor: `${region.color}20`,
                      color: region.color
                    }}
                  >
                    {region.growth}
                  </Badge>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Revenue</div>
                    <div className="text-white">{region.revenue}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Top Buyer</div>
                    <div className="text-white text-sm">{region.topBuyer}</div>
                  </div>
                </div>

                {/* Health Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#6F83A7]">Avg Health Score</span>
                    <span className="text-sm text-white">{region.health}%</span>
                  </div>
                  <Progress value={region.health} className="h-2" />
                </div>

                {/* Country Breakdown */}
                <div className="mb-4">
                  <div className="text-xs text-[#6F83A7] mb-2">Top Countries</div>
                  <div className="space-y-1">
                    {region.countries.map((country, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-white">
                          <MapPin className="w-3 h-3 text-[#6F83A7]" />
                          {country}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-white/10 text-[#6F83A7] hover:bg-white/5"
                    onClick={() => toast.info(`Viewing ${region.region} buyers`)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-white/10 text-[#6F83A7] hover:bg-white/5"
                    onClick={() => toast.success(`Exporting ${region.region} data`)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Country-Level Insights */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Buyers by Country</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { country: 'USA', count: 18, flag: '🇺🇸' },
                { country: 'UK', count: 12, flag: '🇬🇧' },
                { country: 'Germany', count: 8, flag: '🇩🇪' },
                { country: 'Japan', count: 8, flag: '🇯🇵' },
                { country: 'Spain', count: 7, flag: '🇪🇸' },
                { country: 'Canada', count: 6, flag: '🇨🇦' },
                { country: 'Australia', count: 6, flag: '🇦🇺' },
                { country: 'S. Korea', count: 5, flag: '🇰🇷' },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#57ACAF]/30 transition-all cursor-pointer group"
                  onClick={() => toast.info(`Viewing buyers in ${item.country}`)}
                >
                  <div className="text-2xl mb-2">{item.flag}</div>
                  <div className="text-white text-sm mb-1">{item.country}</div>
                  <div className="text-xs text-[#6F83A7]">{item.count} buyers</div>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="w-full h-6 text-xs text-[#57ACAF]">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Regional Performance Analysis</div>
                    <div className="text-sm text-[#6F83A7]">
                      MARBIM analyzes regional engagement patterns, delivery SLAs, and identifies underperforming markets for targeted improvement.
                    </div>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze regional buyer performance including engagement rates, delivery SLAs, payment terms, and identify regions with low performance or growth opportunities."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Geographic Expansion Opportunities</div>
                    <div className="text-sm text-[#6F83A7]">
                      Identify untapped markets and recommend geographic expansion strategies based on industry trends and competitor analysis.
                    </div>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Recommend geographic expansion opportunities by analyzing market potential, competitor presence, buyer demand signals, and identifying high-value untapped regions."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* Top-Level AI Summary */}
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#EAB308]/30">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-2">MARBIM Buyer Intelligence Summary</h3>
                <p className="text-sm text-[#6F83A7]">
                  AI-powered insights across your buyer portfolio including tier optimization, engagement patterns, 
                  churn risk assessment, and strategic growth opportunities.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-[#6F83A7] mb-1">Promotion Ready</div>
                <div className="text-2xl text-[#57ACAF]">5</div>
                <div className="text-xs text-[#6F83A7]">Tier B → A</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-[#6F83A7] mb-1">Churn Risk</div>
                <div className="text-2xl text-[#D0342C]">3</div>
                <div className="text-xs text-[#6F83A7]">High priority</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-[#6F83A7] mb-1">Inactive Buyers</div>
                <div className="text-2xl text-[#EAB308]">8</div>
                <div className="text-xs text-[#6F83A7]">{'>'}60 days</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-[#6F83A7] mb-1">Upsell Opportunities</div>
                <div className="text-2xl text-[#57ACAF]">12</div>
                <div className="text-xs text-[#6F83A7]">Ready to engage</div>
              </div>
            </div>
          </div>

          {/* AI Insight Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tier Promotion Candidates */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Tier Promotion Candidates</div>
                    <p className="text-sm text-[#6F83A7]">
                      Top Tier-B buyers approaching Tier-A thresholds
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {[
                  { buyer: 'Gap', progress: 88, revenue: '$615K', score: 92 },
                  { buyer: 'Target', progress: 85, revenue: '$598K', score: 89 },
                  { buyer: 'Walmart', progress: 82, revenue: '$582K', score: 87 },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="group p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#57ACAF]/30 transition-all cursor-pointer"
                    onClick={() => toast.info(`Viewing ${item.buyer} promotion analysis`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#57ACAF]" />
                        <span className="text-white text-sm">{item.buyer}</span>
                      </div>
                      <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs">
                        {item.progress}% to Tier A
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[#6F83A7]">Revenue: {item.revenue}</span>
                      <span className="text-[#6F83A7]">Score: {item.score}</span>
                    </div>
                    <Progress value={item.progress} className="h-1.5 mb-2" />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10 h-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`Promoting ${item.buyer} to Tier A`);
                        }}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Promote Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#6F83A7]">
                      Get detailed promotion analysis and recommendations
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Provide detailed tier promotion analysis for buyers approaching Tier A threshold, including specific metrics they need to improve and recommended actions."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Churn Risk Analysis */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Churn Risk Assessment</div>
                    <p className="text-sm text-[#6F83A7]">
                      Buyers showing declining engagement or payment issues
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {[
                  { buyer: 'ACME Fashion', risk: 'High', reason: 'No orders in 45 days', action: 'Call immediately' },
                  { buyer: 'Style Co.', risk: 'Medium', reason: 'Payment delays', action: 'Schedule review' },
                  { buyer: 'Fashion Hub', risk: 'Medium', reason: 'Reduced order size', action: 'Send survey' },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="group p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D0342C]/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-[#D0342C]" />
                        <span className="text-white text-sm">{item.buyer}</span>
                      </div>
                      <Badge className={`border-none text-xs ${
                        item.risk === 'High' 
                          ? 'bg-[#D0342C]/10 text-[#D0342C]' 
                          : 'bg-[#EAB308]/10 text-[#EAB308]'
                      }`}>
                        {item.risk} Risk
                      </Badge>
                    </div>
                    <div className="text-xs text-[#6F83A7] mb-2">{item.reason}</div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full border-[#D0342C]/30 text-[#D0342C] hover:bg-[#D0342C]/10 h-7"
                      onClick={() => toast.warning(`Action: ${item.action} for ${item.buyer}`)}
                    >
                      {item.action}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-[#D0342C] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#6F83A7]">
                      Get churn prevention strategies and retention playbooks
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze buyers at risk of churning and provide detailed retention strategies including personalized outreach campaigns, incentive programs, and relationship-building actions."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Inactive Buyers Alert */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Inactive Buyers</div>
                    <p className="text-sm text-[#6F83A7]">
                      Buyers with no activity for {'>'}60 days
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Europe</div>
                  <div className="text-xl text-[#EAB308]">4</div>
                  <div className="text-xs text-[#6F83A7]">inactive buyers</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">North America</div>
                  <div className="text-xl text-[#EAB308]">3</div>
                  <div className="text-xs text-[#6F83A7]">inactive buyers</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <Button 
                  variant="outline" 
                  className="w-full border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10"
                  onClick={() => toast.info('Opening campaign builder for inactive buyers')}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Generate Reactivation Campaign
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-white/10 text-[#6F83A7] hover:bg-white/5"
                  onClick={() => toast.info('Viewing inactive buyer list')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Full List
                </Button>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#6F83A7]">
                      Create personalized reengagement campaigns
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze inactive buyers and create personalized reactivation campaigns with customized messaging, incentives, and timing based on their historical preferences and engagement patterns."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Buyer Engagement Score */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Engagement Score Trends</div>
                    <p className="text-sm text-[#6F83A7]">
                      Real-time buyer health and engagement metrics
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {allBuyersData.slice(0, 5).map((buyer, index) => (
                  <div 
                    key={index}
                    className="group cursor-pointer"
                    onClick={() => handleRowClick(buyer)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          buyer.healthScore >= 80 ? 'bg-[#57ACAF]' :
                          buyer.healthScore >= 60 ? 'bg-[#EAB308]' :
                          'bg-[#D0342C]'
                        }`} />
                        <span className="text-[#6F83A7] text-sm group-hover:text-white transition-colors">
                          {buyer.buyerName}
                        </span>
                      </div>
                      <span className={`text-sm ${
                        buyer.healthScore >= 80 ? 'text-[#57ACAF]' :
                        buyer.healthScore >= 60 ? 'text-[#EAB308]' :
                        'text-[#D0342C]'
                      }`}>
                        {buyer.healthScore}%
                      </span>
                    </div>
                    <Progress value={buyer.healthScore} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#6F83A7]">
                      Analyze engagement trends and recommend improvements
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze buyer engagement score trends, identify factors causing score changes, and recommend specific actions to improve engagement for low-scoring buyers."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Upsell Opportunities */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Upsell Opportunities</div>
                    <p className="text-sm text-[#6F83A7]">
                      High-potential buyers ready for expanded offerings
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                {[
                  { buyer: 'H&M', opportunity: 'Premium fabric line', potential: '$120K', probability: 85 },
                  { buyer: 'Zara', opportunity: 'Sustainable collection', potential: '$95K', probability: 78 },
                  { buyer: 'Nike', opportunity: 'Technical sportswear', potential: '$85K', probability: 72 },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white text-sm">{item.buyer}</div>
                      <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs">
                        {item.probability}% likely
                      </Badge>
                    </div>
                    <div className="text-xs text-[#6F83A7] mb-2">{item.opportunity}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#EAB308]">Potential: {item.potential}</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 text-xs text-[#57ACAF] hover:bg-[#57ACAF]/10"
                        onClick={() => toast.info(`Creating proposal for ${item.buyer}`)}
                      >
                        Create Proposal
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#6F83A7]">
                      Discover cross-sell and upsell opportunities
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Identify upsell and cross-sell opportunities across the buyer portfolio, analyzing purchase patterns, product affinity, and recommending specific offerings with revenue potential estimates."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Payment Pattern Analysis */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-[#6F83A7]" />
                  </div>
                  <div>
                    <div className="text-white mb-1">Payment Pattern Analysis</div>
                    <p className="text-sm text-[#6F83A7]">
                      Cash flow insights and payment behavior trends
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="p-3 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#6F83A7]">On-Time Payers</span>
                    <span className="text-sm text-[#57ACAF]">72 buyers</span>
                  </div>
                  <Progress value={85} className="h-1.5" />
                </div>
                <div className="p-3 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#6F83A7]">Occasionally Late</span>
                    <span className="text-sm text-[#EAB308]">10 buyers</span>
                  </div>
                  <Progress value={12} className="h-1.5" />
                </div>
                <div className="p-3 rounded-lg bg-[#D0342C]/10 border border-[#D0342C]/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#6F83A7]">Requires Attention</span>
                    <span className="text-sm text-[#D0342C]">3 buyers</span>
                  </div>
                  <Progress value={3} className="h-1.5" />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-[#6F83A7] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#6F83A7]">
                      Optimize payment terms and credit policies
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze payment patterns across buyers, identify late payment trends, recommend credit policy adjustments, and suggest payment term optimizations to improve cash flow."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Insights Banner */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#57ACAF]/30">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white mb-2">Comprehensive Buyer Intelligence Report</div>
                  <div className="text-sm text-[#6F83A7] mb-3">
                    Generate a complete AI-powered analysis covering portfolio health, growth opportunities, risk mitigation strategies, 
                    regional expansion recommendations, and personalized action plans for each buyer segment.
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/10 text-white border-none">Portfolio Analysis</Badge>
                    <Badge className="bg-white/10 text-white border-none">Growth Strategy</Badge>
                    <Badge className="bg-white/10 text-white border-none">Risk Assessment</Badge>
                    <Badge className="bg-white/10 text-white border-none">Action Plans</Badge>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Generate a comprehensive buyer intelligence report including: 1) Overall portfolio health analysis, 2) Tier-specific growth strategies, 3) Regional expansion opportunities, 4) Churn risk mitigation plans, 5) Upsell/cross-sell recommendations, 6) Payment optimization strategies, 7) Engagement improvement tactics, and 8) Specific action items for each buyer segment."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderFeedbackIssues = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Feedback & Issues</h2>
          <p className="text-sm text-[#6F83A7]">Central hub for buyer satisfaction and issue management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
            onClick={() => setLogIssueDrawerOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Issue
          </Button>
        </div>
      </div>

      <Tabs key={`feedback-issues-${currentView}`} defaultValue="feedback-surveys" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="feedback-surveys" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Star className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Feedback Surveys</span>
            </TabsTrigger>
            <TabsTrigger 
              value="open-issues" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <AlertTriangle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Open Issues</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sentiment-analysis" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Activity className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Sentiment Analysis</span>
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

        <TabsContent value="feedback-surveys" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">Avg CSAT</h4>
                <ThumbsUp className="w-5 h-5 text-[#57ACAF]" />
              </div>
              <div className="text-3xl text-white mb-1">8.2/10</div>
              <p className="text-xs text-[#6F83A7]">+0.5 vs last quarter</p>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">Avg NPS</h4>
                <Award className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div className="text-3xl text-white mb-1">7.8/10</div>
              <p className="text-xs text-[#6F83A7]">+0.3 vs last quarter</p>
            </div>
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">Response Rate</h4>
                <Users className="w-5 h-5 text-[#57ACAF]" />
              </div>
              <div className="text-3xl text-white mb-1">78%</div>
              <p className="text-xs text-[#6F83A7]">24 of 31 buyers</p>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white">Surveys Sent</h4>
                <Send className="w-5 h-5 text-[#6F83A7]" />
              </div>
              <div className="text-3xl text-white mb-1">31</div>
              <p className="text-xs text-[#6F83A7]">This month</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Recent Feedback</h3>
            <SmartTable
              columns={feedbackSurveysColumns}
              data={feedbackSurveysData}
              searchPlaceholder="Search feedback..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Sentiment Categorization</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM categorizes sentiment and identifies trends such as delays, quality issues, and communication gaps.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze buyer feedback sentiment and identify emerging trends in delays, quality issues, and communication gaps with actionable insights."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="open-issues" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Critical</div>
              <div className="text-3xl text-[#D0342C]">2</div>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">High</div>
              <div className="text-3xl text-[#EAB308]">3</div>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Medium</div>
              <div className="text-3xl text-white">5</div>
            </div>
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Resolved (30d)</div>
              <div className="text-3xl text-[#57ACAF]">28</div>
            </div>
          </div>

          {/* Workflow Progress */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#EAB308]" />
                  <span className="text-white">Issue Resolution Workflow</span>
                </div>
                <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <WorkflowStepper
                  steps={[
                    { label: 'Issue Logged', status: 'completed' },
                    { label: 'AI Categorization', status: 'completed' },
                    { label: 'Owner Assignment', status: 'active' },
                    { label: 'Resolution', status: 'pending' },
                    { label: 'Buyer Verification', status: 'pending' },
                  ]}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Open Issues</h3>
            <SmartTable
              columns={openIssuesColumns}
              data={issues}
              searchPlaceholder="Search issues..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Auto-Categorization</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM auto-categorizes issue types and assigns responsible department based on historical patterns.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze buyer issues and automatically categorize them by type, then assign to appropriate departments based on historical resolution patterns."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sentiment-analysis" className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <ThumbsUp className="w-5 h-5 text-[#57ACAF]" />
                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs">+12%</Badge>
              </div>
              <div className="text-[#6F83A7] text-sm mb-1">Positive Sentiment</div>
              <div className="text-2xl text-white">78%</div>
              <Progress value={78} className="h-1 mt-2" />
            </div>
            
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <Minus className="w-5 h-5 text-[#EAB308]" />
                <Badge className="bg-[#EAB308]/10 text-[#EAB308] border-none text-xs">Stable</Badge>
              </div>
              <div className="text-[#6F83A7] text-sm mb-1">Neutral Sentiment</div>
              <div className="text-2xl text-white">18%</div>
              <Progress value={18} className="h-1 mt-2" />
            </div>
            
            <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <ThumbsDown className="w-5 h-5 text-[#D0342C]" />
                <Badge className="bg-[#D0342C]/10 text-[#D0342C] border-none text-xs">-3%</Badge>
              </div>
              <div className="text-[#6F83A7] text-sm mb-1">Negative Sentiment</div>
              <div className="text-2xl text-white">4%</div>
              <Progress value={4} className="h-1 mt-2" />
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 text-[#6F83A7]" />
                <Badge className="bg-white/10 text-white border-none text-xs">90 days</Badge>
              </div>
              <div className="text-[#6F83A7] text-sm mb-1">Total Feedback</div>
              <div className="text-2xl text-white">1,247</div>
              <div className="text-xs text-[#6F83A7] mt-1">Avg 13.9/day</div>
            </div>
          </div>

          {/* Sentiment Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                  Sentiment Distribution (90 Days)
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Positive', value: 78, color: '#57ACAF' },
                      { name: 'Neutral', value: 18, color: '#EAB308' },
                      { name: 'Negative', value: 4, color: '#D0342C' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Positive', value: 78, color: '#57ACAF' },
                      { name: 'Neutral', value: 18, color: '#EAB308' },
                      { name: 'Negative', value: 4, color: '#D0342C' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="pt-4 border-t border-white/10 mt-4">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#6F83A7]">
                      Analyze sentiment distribution patterns and trends
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze the sentiment distribution of buyer feedback over the past 90 days. Identify key drivers of positive sentiment, causes of negative feedback, and recommend strategies to improve overall buyer satisfaction from current 78% positive to 85%+."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#EAB308]" />
                  Sentiment Trend (6 Months)
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={sentimentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#6F83A7" />
                  <YAxis stroke="#6F83A7" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="positive" stroke="#57ACAF" strokeWidth={2} />
                  <Line type="monotone" dataKey="negative" stroke="#D0342C" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="pt-4 border-t border-white/10 mt-4">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#6F83A7]">
                      Identify trend patterns and predict future sentiment
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze buyer sentiment trends over the past 6 months. Identify the key events or actions that caused sentiment changes, correlate with business events (quality improvements, delivery delays, etc.), and predict sentiment trajectory for the next quarter."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Sentiment Drivers */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#57ACAF]" />
                Key Sentiment Drivers
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Top Positive Drivers */}
              <div className="space-y-3">
                <div className="text-sm text-[#6F83A7] mb-3">Top Positive Drivers</div>
                {[
                  { topic: 'Lead Time Reduction', count: 342, sentiment: 92 },
                  { topic: 'Quality Consistency', count: 298, sentiment: 89 },
                  { topic: 'Communication Speed', count: 267, sentiment: 86 },
                  { topic: 'Pricing Transparency', count: 234, sentiment: 84 },
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20 hover:bg-[#57ACAF]/10 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">{item.topic}</span>
                      <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs">
                        {item.sentiment}%
                      </Badge>
                    </div>
                    <div className="text-xs text-[#6F83A7]">{item.count} mentions</div>
                    <Progress value={item.sentiment} className="h-1 mt-2" />
                  </div>
                ))}
              </div>

              {/* Top Concerns */}
              <div className="space-y-3">
                <div className="text-sm text-[#6F83A7] mb-3">Top Concerns</div>
                {[
                  { topic: 'Fabric Color Variation', count: 89, sentiment: 32 },
                  { topic: 'Sample Lead Time', count: 67, sentiment: 41 },
                  { topic: 'MOQ Flexibility', count: 54, sentiment: 48 },
                  { topic: 'Shipment Delays', count: 43, sentiment: 38 },
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-[#D0342C]/5 border border-[#D0342C]/20 hover:bg-[#D0342C]/10 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">{item.topic}</span>
                      <Badge className="bg-[#D0342C]/10 text-[#D0342C] border-none text-xs">
                        {item.sentiment}%
                      </Badge>
                    </div>
                    <div className="text-xs text-[#6F83A7]">{item.count} mentions</div>
                    <Progress value={item.sentiment} className="h-1 mt-2" />
                  </div>
                ))}
              </div>

              {/* Emerging Topics */}
              <div className="space-y-3">
                <div className="text-sm text-[#6F83A7] mb-3">Emerging Topics</div>
                {[
                  { topic: 'Sustainability Cert', count: 156, trend: '+45%', sentiment: 'positive' },
                  { topic: 'Digital Sampling', count: 134, trend: '+38%', sentiment: 'positive' },
                  { topic: 'AI-Powered QC', count: 98, trend: '+52%', sentiment: 'positive' },
                  { topic: 'Supply Chain Visibility', count: 87, trend: '+29%', sentiment: 'neutral' },
                ].map((item, index) => (
                  <div key={index} className={`p-3 rounded-lg border transition-all ${
                    item.sentiment === 'positive' 
                      ? 'bg-[#57ACAF]/5 border-[#57ACAF]/20 hover:bg-[#57ACAF]/10'
                      : 'bg-[#EAB308]/5 border-[#EAB308]/20 hover:bg-[#EAB308]/10'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">{item.topic}</span>
                      <Badge className={`border-none text-xs ${
                        item.sentiment === 'positive'
                          ? 'bg-[#57ACAF]/10 text-[#57ACAF]'
                          : 'bg-[#EAB308]/10 text-[#EAB308]'
                      }`}>
                        {item.trend}
                      </Badge>
                    </div>
                    <div className="text-xs text-[#6F83A7]">{item.count} mentions</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 mt-4">
              <div className="flex items-start gap-2 justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#6F83A7]">
                    Identify sentiment drivers and recommend improvement actions
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze all sentiment drivers including positive aspects (lead time reduction, quality consistency) and concerns (fabric color variation, sample lead time). Recommend specific actions to amplify positive drivers, address top concerns, and capitalize on emerging topics like sustainability and digital sampling."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Buyer-Specific Sentiment Analysis */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#EAB308]" />
                Buyer-Specific Sentiment Overview
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-sm text-[#6F83A7] py-3 px-4">Buyer</th>
                    <th className="text-left text-sm text-[#6F83A7] py-3 px-4">Current Sentiment</th>
                    <th className="text-left text-sm text-[#6F83A7] py-3 px-4">Trend (30d)</th>
                    <th className="text-left text-sm text-[#6F83A7] py-3 px-4">Key Topics</th>
                    <th className="text-left text-sm text-[#6F83A7] py-3 px-4">Action Required</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { 
                      buyer: 'H&M', 
                      sentiment: 92, 
                      trend: '+8%', 
                      trendDirection: 'up',
                      topics: ['Quality', 'Lead Time'],
                      action: 'None',
                      actionColor: 'green'
                    },
                    { 
                      buyer: 'Gap', 
                      sentiment: 78, 
                      trend: '-5%', 
                      trendDirection: 'down',
                      topics: ['Color Variance', 'Communication'],
                      action: 'Quality Review',
                      actionColor: 'yellow'
                    },
                    { 
                      buyer: 'Zara', 
                      sentiment: 85, 
                      trend: '+3%', 
                      trendDirection: 'up',
                      topics: ['Pricing', 'Delivery'],
                      action: 'None',
                      actionColor: 'green'
                    },
                    { 
                      buyer: 'Nike', 
                      sentiment: 45, 
                      trend: '-12%', 
                      trendDirection: 'down',
                      topics: ['Quality Issues', 'Delays'],
                      action: 'Urgent Review',
                      actionColor: 'red'
                    },
                    { 
                      buyer: 'Uniqlo', 
                      sentiment: 88, 
                      trend: '+6%', 
                      trendDirection: 'up',
                      topics: ['Innovation', 'Support'],
                      action: 'None',
                      actionColor: 'green'
                    },
                  ].map((buyer, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-all">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-white text-sm">{buyer.buyer}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[100px]">
                            <Progress value={buyer.sentiment} className="h-1.5" />
                          </div>
                          <span className={`text-sm ${
                            buyer.sentiment >= 80 ? 'text-[#57ACAF]' :
                            buyer.sentiment >= 60 ? 'text-[#EAB308]' :
                            'text-[#D0342C]'
                          }`}>{buyer.sentiment}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`border-none text-xs ${
                          buyer.trendDirection === 'up'
                            ? 'bg-[#57ACAF]/10 text-[#57ACAF]'
                            : 'bg-[#D0342C]/10 text-[#D0342C]'
                        }`}>
                          {buyer.trend}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {buyer.topics.map((topic, idx) => (
                            <Badge key={idx} className="bg-white/10 text-white border-none text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`border-none text-xs ${
                          buyer.actionColor === 'green' ? 'bg-[#57ACAF]/10 text-[#57ACAF]' :
                          buyer.actionColor === 'yellow' ? 'bg-[#EAB308]/10 text-[#EAB308]' :
                          'bg-[#D0342C]/10 text-[#D0342C]'
                        }`}>
                          {buyer.action}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-white/10 mt-4">
              <div className="flex items-start gap-2 justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#6F83A7]">
                    Generate buyer-specific sentiment reports and action plans
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="For each buyer in the sentiment analysis table, generate a detailed sentiment report including: 1) Current sentiment score and trend analysis, 2) Key topics driving sentiment (positive and negative), 3) Specific action recommendations to improve satisfaction, 4) Predicted sentiment trajectory, 5) Risk assessment for account retention. Prioritize urgent cases like Nike (45% sentiment, -12% trend)."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Alert Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                  <ThumbsUp className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div>
                  <div className="text-white mb-2">Positive Trend Detected</div>
                  <p className="text-sm text-[#6F83A7]">
                    Overall sentiment improved 12% after lead time reduction implemented in August. 
                    342 buyers specifically mentioned faster delivery as a key satisfaction driver.
                  </p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#6F83A7]">
                      Analyze positive trend drivers and amplification strategies
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze the 12% improvement in buyer sentiment after lead time reduction. Identify: 1) Which buyer segments benefited most, 2) Specific operational changes that drove improvement, 3) How to amplify this success across all buyers, 4) Additional quick wins to maintain momentum, 5) Communication strategy to highlight improvements."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
                </div>
                <div>
                  <div className="text-white mb-2">Negative Spike Alert</div>
                  <p className="text-sm text-[#6F83A7]">
                    Nike reported 3 quality issues this month with fabric color variation. 
                    Sentiment dropped from 57% to 45% — production audit and corrective action required.
                  </p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-[#D0342C] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#6F83A7]">
                      Generate crisis response plan and recovery strategy
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Create urgent action plan for Nike sentiment crisis (dropped from 57% to 45% due to 3 quality issues): 1) Immediate containment actions, 2) Root cause investigation scope, 3) Buyer communication strategy and apology approach, 4) Quality improvement roadmap, 5) Compensation/concession recommendations, 6) Timeline to restore sentiment to 70%+, 7) Prevention measures for similar buyers."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Prediction & Recommendations */}
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#EAB308]/30">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <div className="text-white mb-2">AI-Powered Sentiment Intelligence</div>
                <p className="text-sm text-[#6F83A7] mb-3">
                  MARBIM continuously analyzes buyer feedback across all channels (emails, calls, surveys, issues) 
                  to detect sentiment shifts in real-time, predict future trends, and recommend proactive interventions 
                  before buyers become dissatisfied.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Predicted Sentiment (Next Quarter)</div>
                    <div className="text-xl text-white">82%</div>
                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs mt-1">+4% projected</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">At-Risk Buyers</div>
                    <div className="text-xl text-white">2</div>
                    <Badge className="bg-[#D0342C]/10 text-[#D0342C] border-none text-xs mt-1">Requires action</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Improvement Opportunities</div>
                    <div className="text-xl text-white">7</div>
                    <Badge className="bg-[#EAB308]/10 text-[#EAB308] border-none text-xs mt-1">Quick wins available</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-start gap-2 justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#6F83A7]">
                    Generate comprehensive sentiment intelligence report with predictions and action plan
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Generate comprehensive buyer sentiment intelligence report: 1) Overall sentiment health assessment (current 78%, target 85%), 2) Detailed trend analysis with causation mapping, 3) Buyer-by-buyer risk scoring and intervention priorities, 4) Sentiment prediction for next 3 months with confidence intervals, 5) Top 10 actionable recommendations ranked by impact, 6) Resource allocation plan for sentiment improvement initiatives, 7) KPIs and monitoring strategy, 8) Early warning system configuration for future sentiment drops."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* AI-Powered Alerts & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Critical Alert */}
            <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
                </div>
                <div className="flex-1">
                  <div className="text-white mb-1 text-sm">Critical Quality Alert</div>
                  <Badge className="bg-[#D0342C]/10 text-[#D0342C] border-none text-xs">Immediate Action</Badge>
                </div>
              </div>
              <p className="text-sm text-[#6F83A7] mb-3">
                Nike reported 3 quality issues with fabric color variation. Sentiment dropped 12% in 2 weeks.
              </p>
              <div className="text-xs text-[#6F83A7] mb-3">AI Recommendation: Production audit + quality review meeting</div>
              <Button 
                className="w-full bg-[#D0342C] hover:bg-[#D0342C]/90 text-white"
                onClick={() => toast.info('Assigning production audit')}
              >
                <Target className="w-4 h-4 mr-2" />
                Assign Audit
              </Button>
            </div>

            {/* Warning */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <div className="text-white mb-1 text-sm">Delayed Response Risk</div>
                  <Badge className="bg-[#EAB308]/10 text-[#EAB308] border-none text-xs">Action Needed</Badge>
                </div>
              </div>
              <p className="text-sm text-[#6F83A7] mb-3">
                Gap has 2 open issues pending for 5+ days. Response SLA breach imminent.
              </p>
              <div className="text-xs text-[#6F83A7] mb-3">AI Recommendation: Expedite resolution + send status update</div>
              <Button 
                variant="outline"
                className="w-full border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10"
                onClick={() => toast.info('Prioritizing issues')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Update
              </Button>
            </div>

            {/* Positive Insight */}
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="flex-1">
                  <div className="text-white mb-1 text-sm">Improvement Opportunity</div>
                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs">Quick Win</Badge>
                </div>
              </div>
              <p className="text-sm text-[#6F83A7] mb-3">
                Lead time reduction improved sentiment by 12%. Apply same approach to sampling.
              </p>
              <div className="text-xs text-[#6F83A7] mb-3">AI Recommendation: Replicate success in sample production workflow</div>
              <Button 
                variant="outline"
                className="w-full border-[#57ACAF]/30 text-[#57ACAF] hover:bg-[#57ACAF]/10"
                onClick={() => toast.info('Creating action plan')}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Create Plan
              </Button>
            </div>
          </div>

          {/* Predictive Intelligence */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#EAB308]" />
                Predictive Intelligence Dashboard
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#D0342C]" />
                  <span className="text-xs text-[#6F83A7]">At-Risk Buyers</span>
                </div>
                <div className="text-2xl text-white mb-1">2</div>
                <div className="text-xs text-[#D0342C]">Requires immediate intervention</div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#EAB308]" />
                  <span className="text-xs text-[#6F83A7]">Issue Velocity</span>
                </div>
                <div className="text-2xl text-white mb-1">+23%</div>
                <div className="text-xs text-[#EAB308]">vs. last month</div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                  <span className="text-xs text-[#6F83A7]">Sentiment Forecast</span>
                </div>
                <div className="text-2xl text-white mb-1">82%</div>
                <div className="text-xs text-[#57ACAF]">Next quarter projection</div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#6F83A7]" />
                  <span className="text-xs text-[#6F83A7]">AI Confidence</span>
                </div>
                <div className="text-2xl text-white mb-1">94%</div>
                <div className="text-xs text-[#6F83A7]">Prediction accuracy</div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-start gap-2 justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#6F83A7]">
                    Generate detailed predictive analysis with risk assessment
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze buyer feedback and issue patterns to predict: 1) Which buyers are at risk of churning in the next 30/60/90 days with risk scores, 2) Likely issue categories and volumes for next quarter, 3) Sentiment trajectory for each major buyer, 4) Proactive intervention recommendations, 5) Resource allocation needs for issue resolution."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Issue Pattern Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issue Clustering */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#57ACAF]" />
                  Issue Pattern Clusters
                </h3>
              </div>

              <div className="space-y-3 mb-4">
                {[
                  { 
                    cluster: 'Quality Control Issues', 
                    count: 15, 
                    buyers: ['Nike', 'Gap', 'Zara'], 
                    trend: '+30%',
                    severity: 'high'
                  },
                  { 
                    cluster: 'Communication Delays', 
                    count: 8, 
                    buyers: ['H&M', 'Uniqlo'], 
                    trend: '-12%',
                    severity: 'medium'
                  },
                  { 
                    cluster: 'Sample Lead Time', 
                    count: 12, 
                    buyers: ['Gap', 'Forever 21'], 
                    trend: '+8%',
                    severity: 'medium'
                  },
                  { 
                    cluster: 'Pricing Concerns', 
                    count: 5, 
                    buyers: ['Walmart'], 
                    trend: 'Stable',
                    severity: 'low'
                  },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer ${
                      item.severity === 'high' 
                        ? 'bg-[#D0342C]/5 border-[#D0342C]/20 hover:bg-[#D0342C]/10'
                        : item.severity === 'medium'
                        ? 'bg-[#EAB308]/5 border-[#EAB308]/20 hover:bg-[#EAB308]/10'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">{item.cluster}</span>
                      <Badge className={`border-none text-xs ${
                        item.severity === 'high' 
                          ? 'bg-[#D0342C]/10 text-[#D0342C]'
                          : item.severity === 'medium'
                          ? 'bg-[#EAB308]/10 text-[#EAB308]'
                          : 'bg-white/10 text-white'
                      }`}>
                        {item.count} issues
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {item.buyers.slice(0, 2).map((buyer, idx) => (
                          <Badge key={idx} className="bg-white/10 text-white border-none text-xs">
                            {buyer}
                          </Badge>
                        ))}
                        {item.buyers.length > 2 && (
                          <Badge className="bg-white/10 text-white border-none text-xs">
                            +{item.buyers.length - 2}
                          </Badge>
                        )}
                      </div>
                      <span className={`text-xs ${
                        item.trend.includes('+') && !item.trend.includes('-')
                          ? 'text-[#D0342C]'
                          : item.trend.includes('-')
                          ? 'text-[#57ACAF]'
                          : 'text-[#6F83A7]'
                      }`}>
                        {item.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#6F83A7]">
                      Identify issue patterns and root causes
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze all buyer issues to identify pattern clusters: 1) Group similar issues by root cause, 2) Identify which buyers are affected by each cluster, 3) Determine if issues are systemic or buyer-specific, 4) Calculate trend direction for each cluster, 5) Recommend targeted solutions for top 3 issue clusters, 6) Estimate impact of resolving each cluster on overall satisfaction."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Resolution Effectiveness */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#EAB308]" />
                  Resolution Performance
                </h3>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { month: 'Jul', resolved: 24, pending: 6, avgTime: 3.2 },
                  { month: 'Aug', resolved: 28, pending: 5, avgTime: 2.8 },
                  { month: 'Sep', resolved: 32, pending: 4, avgTime: 2.5 },
                  { month: 'Oct', resolved: 28, pending: 8, avgTime: 3.8 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#6F83A7" />
                  <YAxis stroke="#6F83A7" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="resolved" fill="#57ACAF" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="pending" fill="#D0342C" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20">
                  <div className="text-xs text-[#6F83A7] mb-1">Avg Resolution</div>
                  <div className="text-lg text-white">3.1 days</div>
                </div>
                <div className="p-3 rounded-lg bg-[#EAB308]/5 border border-[#EAB308]/20">
                  <div className="text-xs text-[#6F83A7] mb-1">Success Rate</div>
                  <div className="text-lg text-white">89%</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Reopen Rate</div>
                  <div className="text-lg text-white">8%</div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 mt-4">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#6F83A7]">
                      Optimize resolution strategies and reduce cycle time
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze issue resolution performance metrics: 1) Identify bottlenecks causing delays (current avg 3.1 days), 2) Compare resolution time by issue category and owner, 3) Analyze the 8% reopen rate - why are issues recurring?, 4) Recommend process improvements to reduce resolution time to <2 days, 5) Suggest preventive measures to improve 89% success rate to 95%+."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buyer Risk Scoring */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#D0342C]" />
                Buyer Risk Assessment Matrix
              </h3>
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-sm text-[#6F83A7] py-3 px-4">Buyer</th>
                    <th className="text-left text-sm text-[#6F83A7] py-3 px-4">Risk Score</th>
                    <th className="text-left text-sm text-[#6F83A7] py-3 px-4">Risk Factors</th>
                    <th className="text-left text-sm text-[#6F83A7] py-3 px-4">Open Issues</th>
                    <th className="text-left text-sm text-[#6F83A7] py-3 px-4">Sentiment Trend</th>
                    <th className="text-left text-sm text-[#6F83A7] py-3 px-4">Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      buyer: 'Nike',
                      riskScore: 87,
                      riskLevel: 'high',
                      factors: ['Quality Issues', 'Sentiment Drop', 'SLA Breach'],
                      openIssues: 3,
                      sentimentTrend: -12,
                      action: 'Escalate to Senior Management'
                    },
                    {
                      buyer: 'Gap',
                      riskScore: 62,
                      riskLevel: 'medium',
                      factors: ['Response Delays', 'Communication Gap'],
                      openIssues: 2,
                      sentimentTrend: -5,
                      action: 'Immediate Status Update'
                    },
                    {
                      buyer: 'Zara',
                      riskScore: 28,
                      riskLevel: 'low',
                      factors: ['Minor Delays'],
                      openIssues: 1,
                      sentimentTrend: +3,
                      action: 'Monitor'
                    },
                    {
                      buyer: 'H&M',
                      riskScore: 15,
                      riskLevel: 'low',
                      factors: [],
                      openIssues: 0,
                      sentimentTrend: +8,
                      action: 'Maintain Relationship'
                    },
                    {
                      buyer: 'Uniqlo',
                      riskScore: 22,
                      riskLevel: 'low',
                      factors: ['Sample Timeline'],
                      openIssues: 1,
                      sentimentTrend: +6,
                      action: 'Expedite Samples'
                    },
                  ].map((buyer, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-all">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-white text-sm">{buyer.buyer}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[80px]">
                            <Progress value={buyer.riskScore} className="h-1.5" />
                          </div>
                          <span className={`text-sm ${
                            buyer.riskLevel === 'high' ? 'text-[#D0342C]' :
                            buyer.riskLevel === 'medium' ? 'text-[#EAB308]' :
                            'text-[#57ACAF]'
                          }`}>{buyer.riskScore}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {buyer.factors.length > 0 ? buyer.factors.slice(0, 2).map((factor, idx) => (
                            <Badge key={idx} className={`border-none text-xs ${
                              buyer.riskLevel === 'high' ? 'bg-[#D0342C]/10 text-[#D0342C]' :
                              buyer.riskLevel === 'medium' ? 'bg-[#EAB308]/10 text-[#EAB308]' :
                              'bg-white/10 text-white'
                            }`}>
                              {factor}
                            </Badge>
                          )) : (
                            <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none text-xs">None</Badge>
                          )}
                          {buyer.factors.length > 2 && (
                            <Badge className="bg-white/10 text-white border-none text-xs">
                              +{buyer.factors.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`border-none text-xs ${
                          buyer.openIssues > 2 ? 'bg-[#D0342C]/10 text-[#D0342C]' :
                          buyer.openIssues > 0 ? 'bg-[#EAB308]/10 text-[#EAB308]' :
                          'bg-[#57ACAF]/10 text-[#57ACAF]'
                        }`}>
                          {buyer.openIssues}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {buyer.sentimentTrend > 0 ? (
                            <TrendingUp className="w-3 h-3 text-[#57ACAF]" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-[#D0342C]" />
                          )}
                          <span className={`text-sm ${
                            buyer.sentimentTrend > 0 ? 'text-[#57ACAF]' : 'text-[#D0342C]'
                          }`}>
                            {buyer.sentimentTrend > 0 ? '+' : ''}{buyer.sentimentTrend}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white text-xs">{buyer.action}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-start gap-2 justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <Sparkles className="w-4 h-4 text-[#D0342C] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#6F83A7]">
                    Generate comprehensive risk assessment with intervention roadmap
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Create comprehensive buyer risk assessment: 1) Calculate detailed risk scores for all buyers based on issue history, sentiment trends, SLA compliance, and communication patterns, 2) Identify early warning signals for churn risk, 3) Prioritize buyers requiring immediate intervention (Nike risk score 87, Gap 62), 4) Create tailored intervention plans for high-risk buyers, 5) Recommend preventive strategies for medium-risk buyers, 6) Suggest relationship enhancement tactics for low-risk buyers."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Proactive Recommendations Engine */}
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#EAB308]/30">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <div className="text-white mb-2">Proactive Action Recommendations</div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  MARBIM analyzes all buyer feedback, issues, and sentiment data to provide proactive, 
                  prioritized recommendations that prevent problems before they escalate and improve 
                  overall buyer satisfaction.
                </p>
                
                <div className="space-y-3">
                  {[
                    {
                      priority: 'Critical',
                      action: 'Schedule Nike Quality Review Meeting',
                      impact: 'High',
                      description: 'Address 3 quality issues before sentiment drops further',
                      timeline: 'Today',
                      color: 'red'
                    },
                    {
                      priority: 'High',
                      action: 'Send Status Updates to Gap',
                      impact: 'Medium',
                      description: 'Prevent SLA breach on 2 pending issues',
                      timeline: 'Within 24h',
                      color: 'orange'
                    },
                    {
                      priority: 'Medium',
                      action: 'Replicate Lead Time Success',
                      impact: 'High',
                      description: 'Apply 12% sentiment improvement to sampling workflow',
                      timeline: 'This week',
                      color: 'yellow'
                    },
                    {
                      priority: 'Medium',
                      action: 'Launch Fabric QC Initiative',
                      impact: 'High',
                      description: 'Address recurring color variation issues (15 instances)',
                      timeline: 'Next week',
                      color: 'yellow'
                    },
                    {
                      priority: 'Low',
                      action: 'Celebrate H&M Partnership Success',
                      impact: 'Medium',
                      description: 'Strengthen relationship with top-performing buyer (92% sentiment)',
                      timeline: 'This month',
                      color: 'green'
                    },
                  ].map((rec, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border transition-all hover:scale-[1.01] ${
                        rec.color === 'red' 
                          ? 'bg-[#D0342C]/5 border-[#D0342C]/20'
                          : rec.color === 'orange'
                          ? 'bg-[#EAB308]/5 border-[#EAB308]/20'
                          : rec.color === 'yellow'
                          ? 'bg-[#EAB308]/5 border-[#EAB308]/20'
                          : 'bg-[#57ACAF]/5 border-[#57ACAF]/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`border-none text-xs ${
                            rec.color === 'red' 
                              ? 'bg-[#D0342C]/10 text-[#D0342C]'
                              : rec.color === 'orange' || rec.color === 'yellow'
                              ? 'bg-[#EAB308]/10 text-[#EAB308]'
                              : 'bg-[#57ACAF]/10 text-[#57ACAF]'
                          }`}>
                            {rec.priority}
                          </Badge>
                          <span className="text-white text-sm">{rec.action}</span>
                        </div>
                        <Badge className="bg-white/10 text-white border-none text-xs">
                          {rec.impact} Impact
                        </Badge>
                      </div>
                      <div className="text-xs text-[#6F83A7] mb-2">{rec.description}</div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-[#6F83A7]" />
                        <span className="text-xs text-[#6F83A7]">{rec.timeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-start gap-2 justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#6F83A7]">
                    Generate comprehensive action plan with resource allocation and timeline
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Generate comprehensive proactive action plan based on all buyer feedback and issue intelligence: 1) Prioritize all recommended actions by urgency and impact, 2) Create detailed execution plans for top 10 actions with step-by-step tasks, 3) Assign resource requirements and ownership, 4) Build timeline with milestones and dependencies, 5) Define success metrics for each action, 6) Estimate ROI in terms of sentiment improvement and issue reduction, 7) Create contingency plans for high-priority items, 8) Set up monitoring and tracking system."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'buyer-directory':
        return renderBuyerDirectory();
      case 'feedback-issues':
        return renderFeedbackIssues();
      default:
        return renderDashboard();
    }
  };

  const getBreadcrumbs = () => {
    const baseBreadcrumbs = [
      { label: 'CRM & Sales' },
      { label: 'Buyer Management' }
    ];

    const viewLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'buyer-directory': 'Buyer Directory',
      'feedback-issues': 'Feedback & Issues',
    };

    if (currentView !== 'dashboard') {
      baseBreadcrumbs.push({ label: viewLabels[currentView] });
    }

    return baseBreadcrumbs;
  };

  // Show intro page if setup button clicked
  if (showModuleSetup) {
    return (
      <BuyerManagementIntro
        onNavigate={(page) => {
          setShowModuleSetup(false);
          if (onNavigateToPage) {
            onNavigateToPage(page);
          }
        }}
        onAskMarbim={(prompt) => {
          if (onAskMarbim) {
            onAskMarbim(prompt);
          }
        }}
      />
    );
  }

  return (
    <>
      <PageLayout
        breadcrumbs={getBreadcrumbs()}
        aiInsightsCount={5}
      >
        {renderContent()}
      </PageLayout>

      {/* Setup Wizard */}
      {setupWizardOpen && (
        <BuyerManagementSetup
          onComplete={() => {
            setSetupWizardOpen(false);
            setShowSetupBanner(false);
            toast.success('Buyer Management module activated!');
          }}
          onClose={() => setSetupWizardOpen(false)}
          onAskMarbim={onAskMarbim}
        />
      )}

      {/* Buyer Detail Drawer - Premium Design */}
      <BuyerDetailDrawer
        isOpen={buyerDrawerOpen}
        onClose={() => setBuyerDrawerOpen(false)}
        buyer={selectedBuyer}
        onAskMarbim={onAskMarbim}
        onOpenAI={() => setBuyerDrawerOpen(false)}
      />

      {/* Issue Detail Drawer - Premium Design with AI Integration */}
      <IssueDetailDrawer
        isOpen={issueDrawerOpen}
        onClose={() => setIssueDrawerOpen(false)}
        issue={selectedIssue}
        onAskMarbim={onAskMarbim}
      />

      {/* Feedback Detail Drawer - Premium Design with AI Integration */}
      <FeedbackDetailDrawer
        isOpen={feedbackDrawerOpen}
        onClose={() => setFeedbackDrawerOpen(false)}
        feedback={selectedFeedback}
        onAskMarbim={onAskMarbim}
      />

      {/* Add Buyer Drawer - Comprehensive Onboarding Form */}
      <AddBuyerDrawer
        open={addBuyerDrawerOpen}
        onClose={() => setAddBuyerDrawerOpen(false)}
        onBuyerAdded={handleBuyerAdded}
        onAskMarbim={onAskMarbim}
      />

      {/* Log Issue Drawer - Issue Reporting Form */}
      <LogIssueDrawer
        open={logIssueDrawerOpen}
        onClose={() => setLogIssueDrawerOpen(false)}
        onSubmit={handleLogIssue}
        onAskMarbim={onAskMarbim}
        buyers={buyers}
      />

      {/* Detail Drawer - Universal Design (for other views) */}
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={drawerData}
        module="Buyer Management"
        subPage={currentView}
        onNavigateToFullPage={() => {
          if (drawerData && onNavigateToPage) {
            onNavigateToPage(`buyer-management/${currentView}/detail/${drawerData.id}`);
            setDrawerOpen(false);
          }
        }}
      />
      
      {/* Old Drawer - To be removed later
      <DetailDrawer
        open={false}
        onClose={() => setDrawerOpen(false)}
        title={selectedRecord?.buyerName || selectedRecord?.buyer || 'Details'}
        recordId={selectedRecord?.id}
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="interaction">Interaction</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="space-y-3">
              {selectedRecord && Object.entries(selectedRecord).slice(0, 6).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#6F83A7] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-white">{String(value)}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interaction" className="space-y-4 mt-6">
            <div className="space-y-3">
              {[
                { date: '2024-10-25', channel: 'Email', summary: 'Invoice sent for PO #5821' },
                { date: '2024-10-20', channel: 'Call', summary: 'Discussed new product line' },
                { date: '2024-10-15', channel: 'Meeting', summary: 'Quarterly business review' },
              ].map((entry, index) => (
                <div key={index} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF]">{entry.channel}</Badge>
                    <span className="text-xs text-[#6F83A7]">{entry.date}</span>
                  </div>
                  <div className="text-sm text-white">{entry.summary}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-6">
            <div className="space-y-3">
              {[
                { name: 'WRAP_Certificate.pdf', date: '2024-10-01', expiry: '2025-10-01' },
                { name: 'Contract_2024.pdf', date: '2024-01-15', expiry: 'N/A' },
                { name: 'Credit_Application.pdf', date: '2023-12-20', expiry: 'N/A' },
              ].map((doc, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white mb-2">{doc.name}</div>
                  <div className="flex items-center justify-between text-xs text-[#6F83A7]">
                    <span>Uploaded: {doc.date}</span>
                    {doc.expiry !== 'N/A' && <span>Expires: {doc.expiry}</span>}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-4 mt-6">
            <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
              <div className="text-white mb-2">Health Score Analysis</div>
              <div className="text-sm text-[#6F83A7] mb-3">
                Buyer health is trending positive based on payment behavior and order consistency.
              </div>
              <Progress value={selectedRecord?.healthScore || 82} className="h-2" />
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-white mb-2">Churn Risk</div>
              <Badge className="bg-[#57ACAF]/10 text-[#57ACAF]">Low Risk</Badge>
            </div>
          </TabsContent>
        </Tabs>
      </DetailDrawer>

      {/* New Detail Drawer - Universal Design */}
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={drawerData}
        module="Buyer Management"
        subPage={currentView}
      />
    </>
  );
}
