import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout } from './components/layouts/MainLayout';
import { ProtectedRoute } from './components/layouts/ProtectedRoute';
import { AuthLayout } from './components/layouts/AuthLayout';

// Auth Pages
import { LoginPage } from './components/pages/LoginPage';
import { DemoRequestPage } from './components/pages/DemoRequestPage';
import { CompanySignup } from './components/pages/CompanySignup';
import { CompanyProfileSetup } from './components/pages/CompanyProfileSetup';

// Core Pages
import { Dashboard } from './components/pages/Dashboard';
import { Approve } from './components/pages/Approve';
import { Notifications } from './components/pages/Notifications';
import { Profile } from './components/pages/Profile';
import { Settings } from './components/pages/Settings';
import { AgentModeDashboard } from './components/pages/AgentModeDashboard';

// CRM Module
import { LeadManagement } from './components/pages/LeadManagement';
import { BuyerManagement } from './components/pages/BuyerManagement';
import { Contacts } from './components/pages/Contacts';

// Sales Module
import { RFQQuotation } from './components/pages/RFQQuotation';

// Finance Module
import { Costing } from './components/pages/Costing';
import { Finance } from './components/pages/Finance';

// Operations Module
import { ProductionPlanning } from './components/pages/ProductionPlanning';
import { InventoryManagement } from './components/pages/InventoryManagement';
import { Shipment } from './components/pages/Shipment';

// Quality Module
import { QualityControl } from './components/pages/QualityControl';
import { CompliancePolicy } from './components/pages/CompliancePolicy';

// Resources Module
import { MachineMaintenance } from './components/pages/MachineMaintenance';
import { SupplierEvaluation } from './components/pages/SupplierEvaluation';
import { WorkforceManagement } from './components/pages/WorkforceManagement';

// Sustainability Module
import { Sustainability } from './components/pages/Sustainability';

// Module Setup
import { ModuleSetup } from './components/pages/ModuleSetup';
import { ModuleRouter } from './components/pages/modules/ModuleRouter';

// Analytics
import { Analytics } from './components/pages/Analytics';

// Company
import { CompanyProfile } from './components/pages/CompanyProfile';

// Legal
import { PrivacyPolicy } from './components/pages/PrivacyPolicy';
import { TermsOfService } from './components/pages/TermsOfService';

export const router = createBrowserRouter([
  // Auth Routes (No Layout)
  {
    path: "/login",
    element: <AuthLayout><LoginPage /></AuthLayout>,
  },
  {
    path: "/demo-request",
    element: <AuthLayout><DemoRequestPage /></AuthLayout>,
  },
  {
    path: "/signup",
    element: <AuthLayout><CompanySignup /></AuthLayout>,
  },
  {
    path: "/profile-setup",
    element: <AuthLayout><CompanyProfileSetup /></AuthLayout>,
  },
  
  // Main App Routes (With Layout & Protection)
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Home
      {
        index: true,
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      
      // Core Pages
      {
        path: "approve",
        element: <ProtectedRoute roles={['admin', 'manager', 'finance']}><Approve /></ProtectedRoute>,
      },
      {
        path: "contacts",
        element: <ProtectedRoute><Contacts /></ProtectedRoute>,
      },
      {
        path: "notifications",
        element: <ProtectedRoute><Notifications /></ProtectedRoute>,
      },
      {
        path: "profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: "settings",
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
      },
      {
        path: "agent-mode",
        element: <ProtectedRoute><AgentModeDashboard /></ProtectedRoute>,
      },
      
      // CRM Module
      {
        path: "crm/leads",
        element: <ProtectedRoute roles={['admin', 'manager', 'sales']}><LeadManagement initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "crm/leads/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'sales']}><LeadManagement /></ProtectedRoute>,
      },
      {
        path: "crm/buyers",
        element: <ProtectedRoute roles={['admin', 'manager', 'sales']}><BuyerManagement initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "crm/buyers/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'sales']}><BuyerManagement /></ProtectedRoute>,
      },
      
      // Sales Module
      {
        path: "sales/rfq",
        element: <ProtectedRoute roles={['admin', 'manager', 'sales']}><RFQQuotation initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "sales/rfq/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'sales']}><RFQQuotation /></ProtectedRoute>,
      },
      
      // Finance Module
      {
        path: "finance/costing",
        element: <ProtectedRoute roles={['admin', 'manager', 'finance']}><Costing initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "finance/costing/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'finance']}><Costing /></ProtectedRoute>,
      },
      {
        path: "finance/accounting",
        element: <ProtectedRoute roles={['admin', 'manager', 'finance']}><Finance initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "finance/accounting/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'finance']}><Finance /></ProtectedRoute>,
      },
      
      // Operations Module
      {
        path: "operations/production",
        element: <ProtectedRoute roles={['admin', 'manager', 'production', 'operations']}><ProductionPlanning initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "operations/production/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'production', 'operations']}><ProductionPlanning /></ProtectedRoute>,
      },
      {
        path: "operations/inventory",
        element: <ProtectedRoute roles={['admin', 'manager', 'operations', 'procurement']}><InventoryManagement initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "operations/inventory/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'operations', 'procurement']}><InventoryManagement /></ProtectedRoute>,
      },
      {
        path: "operations/shipment",
        element: <ProtectedRoute roles={['admin', 'manager', 'operations']}><Shipment initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "operations/shipment/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'operations']}><Shipment /></ProtectedRoute>,
      },
      
      // Quality Module
      {
        path: "quality/qc",
        element: <ProtectedRoute roles={['admin', 'manager', 'quality']}><QualityControl initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "quality/qc/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'quality']}><QualityControl /></ProtectedRoute>,
      },
      {
        path: "quality/compliance",
        element: <ProtectedRoute roles={['admin', 'manager', 'quality', 'compliance']}><CompliancePolicy initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "quality/compliance/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'quality', 'compliance']}><CompliancePolicy /></ProtectedRoute>,
      },
      
      // Resources Module
      {
        path: "resources/machines",
        element: <ProtectedRoute roles={['admin', 'manager', 'operations']}><MachineMaintenance initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "resources/machines/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'operations']}><MachineMaintenance /></ProtectedRoute>,
      },
      {
        path: "resources/suppliers",
        element: <ProtectedRoute roles={['admin', 'manager', 'procurement']}><SupplierEvaluation initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "resources/suppliers/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'procurement']}><SupplierEvaluation /></ProtectedRoute>,
      },
      {
        path: "resources/workforce",
        element: <ProtectedRoute roles={['admin', 'manager', 'hr']}><WorkforceManagement initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "resources/workforce/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'hr']}><WorkforceManagement /></ProtectedRoute>,
      },
      
      // Sustainability Module
      {
        path: "sustainability",
        element: <ProtectedRoute roles={['admin', 'manager', 'compliance']}><Sustainability initialSubPage="dashboard" /></ProtectedRoute>,
      },
      {
        path: "sustainability/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager', 'compliance']}><Sustainability /></ProtectedRoute>,
      },
      
      // Analytics
      {
        path: "analytics",
        element: <ProtectedRoute><Analytics initialSubPage="role-dashboards" /></ProtectedRoute>,
      },
      {
        path: "analytics/:subpage",
        element: <ProtectedRoute><Analytics /></ProtectedRoute>,
      },
      
      // Company Profile
      {
        path: "company",
        element: <ProtectedRoute roles={['admin', 'manager']}><CompanyProfile initialSubPage="overview" /></ProtectedRoute>,
      },
      {
        path: "company/:subpage",
        element: <ProtectedRoute roles={['admin', 'manager']}><CompanyProfile /></ProtectedRoute>,
      },
      
      // Module Setup
      {
        path: "modules",
        element: <ProtectedRoute roles={['admin']}><ModuleSetup /></ProtectedRoute>,
      },
      {
        path: "modules/:moduleId/:page",
        element: <ProtectedRoute roles={['admin']}><ModuleRouter /></ProtectedRoute>,
      },
      
      // Legal
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms-of-service",
        element: <TermsOfService />,
      },
      
      // Catch all - 404
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
