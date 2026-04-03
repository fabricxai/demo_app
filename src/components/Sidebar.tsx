import { 
  Users, TrendingUp, Package, DollarSign, Leaf, Settings as SettingsIcon,
  FileText, Calculator, Factory, ClipboardCheck, Truck, ChevronLeft, ChevronRight,
  LogOut, User, CheckCircle, Contact, Shield, ChevronDown, ChevronUp,
  BarChart3, Send, Mail, FolderOpen, BookOpen, Clipboard, Globe, Sparkles,
  CreditCard, Wallet, CircleDollarSign, PiggyBank, Receipt, Ship, Navigation,
  AlertTriangle, MessageSquare, Calendar, Layers, Award, Recycle, Wrench, Activity,
  Box, ArrowDownUp, ClipboardList, PackageSearch, RefreshCw, Building2, Image,
  Home
} from 'lucide-react';
import { cn } from './ui/utils';
import { useState } from 'react';
import { fabricxaiLogoDark } from '../config/branding';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationGroups = [
  {
    title: 'CRM & Sales',
    items: [
      { 
        id: 'crm/leads', 
        label: 'Lead Management', 
        icon: Users,
        subPages: [
          { id: 'modules/lead-management/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'crm/leads/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'crm/leads/campaigns', label: 'Campaigns', icon: Send },
          { id: 'crm/leads/lead-inbox', label: 'Lead Inbox', icon: Mail },
          { id: 'crm/leads/directory', label: 'Directory', icon: FolderOpen },
          { id: 'crm/leads/analytics', label: 'Analytics', icon: TrendingUp },
        ]
      },
      { 
        id: 'crm/buyers', 
        label: 'Buyer Management', 
        icon: TrendingUp,
        subPages: [
          { id: 'modules/buyer-management/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'crm/buyers/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'crm/buyers/buyer-directory', label: 'Buyer Directory', icon: Users },
          { id: 'crm/buyers/feedback-issues', label: 'Feedback & Issues', icon: MessageSquare },
        ]
      },
      { 
        id: 'sales/rfq', 
        label: 'RFQ & Quotation', 
        icon: FileText,
        subPages: [
          { id: 'modules/rfq-quotation/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'sales/rfq/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'sales/rfq/rfq-inbox', label: 'RFQ Inbox', icon: FileText },
          { id: 'sales/rfq/quotation-builder', label: 'Quotation Builder', icon: Calculator },
          { id: 'sales/rfq/clarification-tracker', label: 'Clarification Tracker', icon: MessageSquare },
        ]
      },
    ]
  },
  {
    title: 'Finance',
    items: [
      { 
        id: 'finance/costing', 
        label: 'Costing', 
        icon: Calculator,
        subPages: [
          { id: 'modules/costing/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'finance/costing/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'finance/costing/cost-sheet-list', label: 'Cost Sheet List', icon: FileText },
          { id: 'finance/costing/scenarios', label: 'Scenarios', icon: Layers },
          { id: 'finance/costing/benchmarks', label: 'Benchmarks', icon: Award },
        ]
      },
      { 
        id: 'finance/accounting', 
        label: 'Accounting', 
        icon: DollarSign,
        subPages: [
          { id: 'modules/finance/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'finance/accounting/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'finance/accounting/accounts-receivable', label: 'Accounts Receivable', icon: CreditCard },
          { id: 'finance/accounting/accounts-payable', label: 'Accounts Payable', icon: Wallet },
          { id: 'finance/accounting/order-pl', label: 'Order P&L', icon: CircleDollarSign },
          { id: 'finance/accounting/cash-flow', label: 'Cash Flow', icon: PiggyBank },
          { id: 'finance/accounting/banking-lc', label: 'Banking & LC', icon: Receipt },
        ]
      },
    ]
  },
  {
    title: 'Operations',
    items: [
      { 
        id: 'operations/production', 
        label: 'Production Planning', 
        icon: Factory,
        subPages: [
          { id: 'modules/production-planning/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'operations/production/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'operations/production/master-plan', label: 'Master Plan', icon: Calendar },
          { id: 'operations/production/line-allocation', label: 'Line Allocation', icon: Layers },
          { id: 'operations/production/ta-calendar', label: 'T&A Calendar', icon: Calendar },
          { id: 'operations/production/materials-shortages', label: 'Materials & Shortages', icon: AlertTriangle },
          { id: 'operations/production/risk-ai', label: 'Risk & AI', icon: Sparkles },
        ]
      },
      { 
        id: 'operations/inventory', 
        label: 'Inventory Management', 
        icon: Box,
        subPages: [
          { id: 'modules/inventory-management/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'operations/inventory/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'operations/inventory/material-master', label: 'Material Master', icon: ClipboardList },
          { id: 'operations/inventory/stock-ledger', label: 'Stock Ledger', icon: BookOpen },
          { id: 'operations/inventory/warehouse', label: 'Warehouse', icon: Building2 },
          { id: 'operations/inventory/material-requests', label: 'Material Requests', icon: ArrowDownUp },
          { id: 'operations/inventory/finished-goods', label: 'Finished Goods', icon: PackageSearch },
          { id: 'operations/inventory/reorder-forecasting', label: 'Reorder & Forecasting', icon: RefreshCw },
        ]
      },
      { 
        id: 'operations/shipment', 
        label: 'Shipment', 
        icon: Truck,
        subPages: [
          { id: 'modules/shipment/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'operations/shipment/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'operations/shipment/booking-manager', label: 'Booking Manager', icon: Clipboard },
          { id: 'operations/shipment/live-tracking', label: 'Live Tracking', icon: Navigation },
          { id: 'operations/shipment/document-vault', label: 'Document Vault', icon: FileText },
          { id: 'operations/shipment/buyer-updates', label: 'Buyer Updates', icon: MessageSquare },
          { id: 'operations/shipment/exceptions', label: 'Exceptions', icon: AlertTriangle },
        ]
      },
    ]
  },
  {
    title: 'Quality & Compliance',
    items: [
      { 
        id: 'quality/qc', 
        label: 'Quality Control', 
        icon: ClipboardCheck,
        subPages: [
          { id: 'modules/quality-control/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'quality/qc/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'quality/qc/inline-qc', label: 'Inline QC', icon: Activity },
          { id: 'quality/qc/final-qc', label: 'Final QC', icon: CheckCircle },
          { id: 'quality/qc/lab-tests', label: 'Lab Tests', icon: ClipboardCheck },
          { id: 'quality/qc/capa', label: 'CAPA', icon: AlertTriangle },
          { id: 'quality/qc/standards', label: 'Standards', icon: Award },
        ]
      },
      { 
        id: 'quality/compliance', 
        label: 'Compliance & Policy', 
        icon: Shield,
        subPages: [
          { id: 'modules/compliance-policy/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'quality/compliance/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'quality/compliance/policy-library', label: 'Policy Library', icon: BookOpen },
          { id: 'quality/compliance/audits', label: 'Audits', icon: ClipboardCheck },
          { id: 'quality/compliance/regulatory-monitor', label: 'Regulatory Monitor', icon: AlertTriangle },
        ]
      },
    ]
  },
  {
    title: 'Resources',
    items: [
      { 
        id: 'resources/suppliers', 
        label: 'Supplier Evaluation', 
        icon: Package,
        subPages: [
          { id: 'modules/supplier-evaluation/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'resources/suppliers/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'resources/suppliers/supplier-directory', label: 'Supplier Directory', icon: Users },
          { id: 'resources/suppliers/rfq-board', label: 'RFQ Board', icon: Send },
          { id: 'resources/suppliers/samples', label: 'Samples', icon: Package },
        ]
      },
      { 
        id: 'resources/machines', 
        label: 'Machine Maintenance', 
        icon: Wrench,
        subPages: [
          { id: 'modules/machine-maintenance/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'resources/machines/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'resources/machines/machine-directory', label: 'Machine Directory', icon: Factory },
          { id: 'resources/machines/maintenance-planner', label: 'Maintenance Planner', icon: Calendar },
          { id: 'resources/machines/breakdowns', label: 'Breakdowns', icon: AlertTriangle },
          { id: 'resources/machines/spare-parts', label: 'Spare Parts', icon: Package },
          { id: 'resources/machines/ai-predictive', label: 'AI Predictive', icon: Sparkles },
        ]
      },
      { 
        id: 'resources/workforce', 
        label: 'Workforce Management', 
        icon: Users,
        subPages: [
          { id: 'modules/workforce-management/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'resources/workforce/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'resources/workforce/roster-profiles', label: 'Roster & Profiles', icon: Users },
          { id: 'resources/workforce/attendance-leave', label: 'Attendance & Leave', icon: Calendar },
          { id: 'resources/workforce/skill-matrix', label: 'Skill Matrix', icon: Award },
          { id: 'resources/workforce/training-assessments', label: 'Training & Assessments', icon: BookOpen },
          { id: 'resources/workforce/welfare-safety', label: 'Welfare & Safety', icon: Shield },
        ]
      },
    ]
  },
  {
    title: 'Sustainability',
    items: [
      { 
        id: 'sustainability', 
        label: 'Sustainability', 
        icon: Leaf,
        subPages: [
          { id: 'modules/sustainability/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'sustainability/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'sustainability/environmental', label: 'Environmental', icon: Leaf },
          { id: 'sustainability/social', label: 'Social', icon: Users },
          { id: 'sustainability/governance', label: 'Governance', icon: Shield },
          { id: 'sustainability/waste-materials', label: 'Waste & Materials', icon: Recycle },
          { id: 'sustainability/footprint-dpp', label: 'Footprint & DPP', icon: Globe },
        ]
      },
    ]
  },
];

function pathKeyFromLocation(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, '');
}

export function Sidebar({ currentPage, onNavigate, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathKey = pathKeyFromLocation(currentPage);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemActive = (itemId: string, subPages?: any[]) => {
    if (pathKey === itemId) return true;
    if (subPages) {
      return subPages.some((sub) => pathKey === sub.id);
    }
    return false;
  };

  return (
    <div 
      className={cn(
        "bg-[#0D1117] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'border-b border-white/5 shrink-0 flex',
          isCollapsed
            ? 'min-h-16 flex-col items-center justify-center gap-1 px-2 py-2'
            : 'h-16 items-center justify-between px-6'
        )}
      >
        {isCollapsed ? (
          <>
            <img
              src={fabricxaiLogoDark}
              alt="FabricXAI"
              className="h-5 w-auto max-w-[56px] object-contain object-center"
            />
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#6F83A7]" />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={fabricxaiLogoDark}
                alt="FabricXAI"
                className="h-8 w-auto max-w-[148px] object-contain object-left"
              />
            </div>
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#6F83A7]" />
            </button>
          </>
        )}
      </div>

      {/* Dashboard Link */}
      <div className="px-3 py-4 border-b border-white/5 space-y-1">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-180",
            pathKey === ''
              ? "bg-[#EAB308]/10 text-[#EAB308] border-b-2 border-[#EAB308]"
              : "text-[#6F83A7] hover:bg-white/5 hover:text-white",
            isCollapsed && "justify-center px-2"
          )}
          title="Home"
          aria-label="Home"
        >
          <Home className="w-5 h-5 flex-shrink-0" strokeWidth={pathKey === '' ? 2.25 : 2} />
          {!isCollapsed && <span>Home</span>}
        </button>
        <button
          type="button"
          onClick={() => onNavigate('approve')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-180",
            pathKey === 'approve'
              ? "bg-[#EAB308]/10 text-[#EAB308] border-b-2 border-[#EAB308]"
              : "text-[#6F83A7] hover:bg-white/5 hover:text-white",
            isCollapsed && "justify-center px-2"
          )}
          title="Approve"
          aria-label="Approve"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" strokeWidth={pathKey === 'approve' ? 2.25 : 2} />
          {!isCollapsed && <span>Approve</span>}
        </button>
        <button
          type="button"
          onClick={() => onNavigate('contacts')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-180",
            pathKey === 'contacts'
              ? "bg-[#EAB308]/10 text-[#EAB308] border-b-2 border-[#EAB308]"
              : "text-[#6F83A7] hover:bg-white/5 hover:text-white",
            isCollapsed && "justify-center px-2"
          )}
          title="Contacts"
          aria-label="Contacts"
        >
          <Contact className="w-5 h-5 flex-shrink-0" strokeWidth={pathKey === 'contacts' ? 2.25 : 2} />
          {!isCollapsed && <span>Contacts</span>}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            {!isCollapsed && (
              <h3 className="px-3 mb-2 text-xs text-[#6F83A7] uppercase tracking-wide">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const hasSubPages = item.subPages && item.subPages.length > 0;
                const isExpanded = expandedItems.includes(item.id);
                const isActive = isItemActive(item.id, item.subPages);
                
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        if (hasSubPages && !isCollapsed) {
                          toggleExpand(item.id);
                        } else if (hasSubPages && isCollapsed) {
                          // Navigate to first sub-page when collapsed
                          onNavigate(item.subPages[0].id);
                        } else {
                          onNavigate(item.id);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-180",
                        isActive
                          ? "bg-[#EAB308]/10 text-[#EAB308] border-b-2 border-[#EAB308]" 
                          : "text-[#6F83A7] hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="text-left flex-1">{item.label}</span>
                          {hasSubPages && (
                            isExpanded ? (
                              <ChevronUp className="w-4 h-4 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 flex-shrink-0" />
                            )
                          )}
                        </>
                      )}
                    </button>
                    
                    {/* Sub Pages */}
                    {hasSubPages && !isCollapsed && isExpanded && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subPages.map((subPage: any) => {
                          const SubIcon = subPage.icon;
                          return (
                            <button
                              key={subPage.id}
                              onClick={() => onNavigate(subPage.id)}
                              className={cn(
                                "group relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 overflow-hidden",
                                pathKey === subPage.id
                                  ? "bg-gradient-to-r from-[#EAB308]/15 to-[#EAB308]/5 text-[#EAB308] shadow-lg shadow-[#EAB308]/10" 
                                  : "text-[#6F83A7] hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:text-white hover:shadow-md"
                              )}
                            >
                              {/* Active State Glow Effect */}
                              {pathKey === subPage.id && (
                                <div className="absolute inset-0 bg-gradient-to-r from-[#EAB308]/20 via-transparent to-transparent animate-pulse" />
                              )}
                              
                              {/* Active State Left Border Accent */}
                              {pathKey === subPage.id && (
                                <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-[#EAB308] to-[#EAB308]/50 rounded-r-full" />
                              )}
                              
                              {/* Icon with Animation */}
                              <SubIcon 
                                className={cn(
                                  "w-4 h-4 flex-shrink-0 transition-all duration-300",
                                  pathKey === subPage.id 
                                    ? "scale-110 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" 
                                    : "group-hover:scale-110 group-hover:rotate-6"
                                )}
                              />
                              
                              {/* Label */}
                              <span className={cn(
                                "text-left relative z-10 transition-all duration-300",
                                pathKey === subPage.id ? "font-medium" : "group-hover:translate-x-0.5"
                              )}>
                                {subPage.label}
                              </span>
                              
                              {/* Hover Shimmer Effect */}
                              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Company & Settings */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <button
          onClick={() => onNavigate('company')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-180",
            pathKey === 'company' || pathKey.startsWith('company/')
              ? "bg-[#EAB308]/10 text-[#EAB308]" 
              : "text-[#6F83A7] hover:bg-white/5 hover:text-white"
          )}
        >
          <Building2 className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Company Profile</span>}
        </button>
        
        <button
          onClick={() => onNavigate('settings')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-180",
            pathKey === 'settings' 
              ? "bg-[#EAB308]/10 text-[#EAB308]" 
              : "text-[#6F83A7] hover:bg-white/5 hover:text-white"
          )}
        >
          <SettingsIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {!isCollapsed && (
          <div className="relative pt-8 pb-4 px-4 rounded-2xl bg-gradient-to-br from-[#3A4A6B]/60 to-[#2A3A5A]/60 border border-white/10">
            {/* Avatar positioned at top center, overlapping the edge */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A5A7B] to-[#3A4A6B] border-4 border-[#101725] flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-[#A0AEC0]" />
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center mt-2">
              <div className="text-sm text-[#A0B5D0] mb-1">User name</div>
              <div className="text-white mb-3">Designation</div>
            </div>

            {/* Logout icon button */}
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/20 hover:border-[#EF4444]/40 transition-all duration-200 group">
              <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs">Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}