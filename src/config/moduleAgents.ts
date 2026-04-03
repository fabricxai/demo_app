/**
 * Module context per ERP area — garment manufacturing modules.
 * Used for headers, FabricXAI context, and consistent UX.
 */

export interface ModuleAgentConfig {
  /** Human module title */
  moduleTitle: string;
  /** One-line value prop */
  tagline: string;
  /** Key used by AIAssistantPanel `moduleConfig` */
  aiModuleKey: string;
  accent: string;
}

const defaultAgent: ModuleAgentConfig = {
  moduleTitle: 'Workspace',
  tagline: 'AI-native ERP for garment manufacturing',
  aiModuleKey: 'dashboard',
  accent: '#57ACAF',
};

const byPathPrefix: { prefix: string; config: ModuleAgentConfig }[] = [
  { prefix: 'approve', config: { moduleTitle: 'Approvals', tagline: 'Route and clear exceptions fast', aiModuleKey: 'dashboard', accent: '#EAB308' } },
  { prefix: 'notifications', config: { moduleTitle: 'Notifications', tagline: 'Stay on top of what matters', aiModuleKey: 'dashboard', accent: '#6F83A7' } },
  { prefix: 'profile', config: { moduleTitle: 'Profile', tagline: 'Your identity in the platform', aiModuleKey: 'settings', accent: '#6F83A7' } },
  { prefix: 'settings', config: { moduleTitle: 'Settings', tagline: 'Workspace and integrations', aiModuleKey: 'settings', accent: '#6F83A7' } },
  { prefix: 'agent-mode', config: { moduleTitle: 'Agent mode', tagline: 'Orchestrate autonomous workflows', aiModuleKey: 'dashboard', accent: '#57ACAF' } },
  { prefix: 'crm/leads', config: { moduleTitle: 'Lead management', tagline: 'Qualify, nurture, and convert', aiModuleKey: 'lead-management', accent: '#57ACAF' } },
  { prefix: 'crm/buyers', config: { moduleTitle: 'Buyer management', tagline: 'Relationships, compliance, and growth', aiModuleKey: 'buyer-management', accent: '#6F83A7' } },
  { prefix: 'sales/rfq', config: { moduleTitle: 'RFQ & quotation', tagline: 'From RFQ to winning quote', aiModuleKey: 'rfq-quotation', accent: '#EAB308' } },
  { prefix: 'finance/costing', config: { moduleTitle: 'Costing', tagline: 'Margins and scenarios you can trust', aiModuleKey: 'costing', accent: '#EAB308' } },
  { prefix: 'finance/accounting', config: { moduleTitle: 'Finance & accounting', tagline: 'Cash, LC, and close', aiModuleKey: 'finance', accent: '#EAB308' } },
  { prefix: 'operations/production', config: { moduleTitle: 'Production planning', tagline: 'Capacity, orders, and line balance', aiModuleKey: 'production-planning', accent: '#57ACAF' } },
  { prefix: 'operations/inventory', config: { moduleTitle: 'Inventory', tagline: 'Materials and WIP visibility', aiModuleKey: 'inventory-management', accent: '#57ACAF' } },
  { prefix: 'operations/shipment', config: { moduleTitle: 'Logistics & shipping', tagline: 'Bookings, docs, and OTIF', aiModuleKey: 'shipment', accent: '#6F83A7' } },
  { prefix: 'quality/qc', config: { moduleTitle: 'Quality control', tagline: 'Inspections and defect intelligence', aiModuleKey: 'quality-control', accent: '#57ACAF' } },
  { prefix: 'quality/compliance', config: { moduleTitle: 'Compliance & policy', tagline: 'Audits, certs, and CAPA', aiModuleKey: 'compliance-policy', accent: '#6F83A7' } },
  { prefix: 'resources/machines', config: { moduleTitle: 'Machine maintenance', tagline: 'Uptime and preventive care', aiModuleKey: 'machine-maintenance', accent: '#57ACAF' } },
  { prefix: 'resources/suppliers', config: { moduleTitle: 'Supplier evaluation', tagline: 'Scorecards and sourcing', aiModuleKey: 'supplier-evaluation', accent: '#57ACAF' } },
  { prefix: 'resources/workforce', config: { moduleTitle: 'Workforce', tagline: 'Shifts, skills, and attendance', aiModuleKey: 'workforce-management', accent: '#6F83A7' } },
  { prefix: 'sustainability', config: { moduleTitle: 'Sustainability', tagline: 'ESG, DPP, and traceability', aiModuleKey: 'sustainability', accent: '#57ACAF' } },
  { prefix: 'analytics', config: { moduleTitle: 'Analytics', tagline: 'Role dashboards and deep dives', aiModuleKey: 'analytics', accent: '#EAB308' } },
  { prefix: 'company', config: { moduleTitle: 'Company profile', tagline: 'Org, sites, and branding', aiModuleKey: 'dashboard', accent: '#6F83A7' } },
  { prefix: 'modules', config: { moduleTitle: 'Module setup', tagline: 'Configure each fabric of your ERP', aiModuleKey: 'settings', accent: '#57ACAF' } },
  { prefix: 'privacy-policy', config: { moduleTitle: 'Privacy', tagline: 'How we handle your data', aiModuleKey: 'dashboard', accent: '#6F83A7' } },
  { prefix: 'terms-of-service', config: { moduleTitle: 'Terms', tagline: 'Terms of use', aiModuleKey: 'dashboard', accent: '#6F83A7' } },
];

function normalizePath(pathname: string) {
  return pathname.replace(/^\/+/, '').replace(/\/$/, '') || '';
}

/**
 * Resolve module context + AI module key from the browser path (matches React Router paths).
 */
export function resolveModuleFromPath(pathname: string): ModuleAgentConfig {
  const path = normalizePath(pathname);
  if (!path) {
    return {
      moduleTitle: 'Command center',
      tagline: 'Garment manufacturing intelligence',
      aiModuleKey: 'dashboard',
      accent: '#57ACAF',
    };
  }

  const sorted = [...byPathPrefix].sort((a, b) => b.prefix.length - a.prefix.length);
  for (const { prefix, config } of sorted) {
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      return config;
    }
  }

  return defaultAgent;
}

export function getAiModuleKeyForPath(pathname: string): string {
  return resolveModuleFromPath(pathname).aiModuleKey;
}
