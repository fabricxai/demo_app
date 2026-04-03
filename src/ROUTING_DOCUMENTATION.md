# fabricXai Routing Structure

## Overview
The application now uses React Router v7 with category-based URL structure for better organization and role-based access control.

## URL Structure

### Authentication Routes
- `/login` - Login page with demo request option
- `/demo-request` - Demo request submission form
- `/signup` - Company signup (step 1)
- `/profile-setup` - Profile setup (step 2)

### Core Application Routes
All routes below are protected and require authentication.

- `/` - Dashboard (Home)
- `/approve` - Approvals page (admin, manager, finance)
- `/notifications` - Notifications center
- `/profile` - User profile page
- `/settings` - Settings page
- `/agent-mode` - Agent Mode dashboard

### CRM Module (`/crm`)
- `/crm/leads` - Lead Management (admin, manager, sales)
  - `/crm/leads/dashboard`
  - `/crm/leads/campaigns`
  - `/crm/leads/lead-inbox`
  - `/crm/leads/directory`
  - `/crm/leads/analytics`

- `/crm/buyers` - Buyer Management (admin, manager, sales)
  - `/crm/buyers/dashboard`
  - `/crm/buyers/buyer-directory`
  - `/crm/buyers/feedback-issues`

### Sales Module (`/sales`)
- `/sales/rfq` - RFQ & Quotation (admin, manager, sales)
  - `/sales/rfq/dashboard`
  - `/sales/rfq/rfq-inbox`
  - `/sales/rfq/quotation-builder`
  - `/sales/rfq/clarification-tracker`

### Finance Module (`/finance`)
- `/finance/costing` - Costing (admin, manager, finance)
  - `/finance/costing/dashboard`
  - `/finance/costing/cost-sheet-list`
  - `/finance/costing/scenarios`
  - `/finance/costing/benchmarks`

- `/finance/accounting` - Accounting (admin, manager, finance)
  - `/finance/accounting/dashboard`
  - `/finance/accounting/accounts-receivable`
  - `/finance/accounting/accounts-payable`
  - `/finance/accounting/order-pl`
  - `/finance/accounting/cash-flow`
  - `/finance/accounting/banking-lc`

### Operations Module (`/operations`)
- `/operations/production` - Production Planning (admin, manager, production, operations)
  - `/operations/production/dashboard`
  - `/operations/production/master-plan`
  - `/operations/production/line-allocation`
  - `/operations/production/ta-calendar`
  - `/operations/production/materials-shortages`
  - `/operations/production/risk-ai`

- `/operations/inventory` - Inventory Management (admin, manager, operations, procurement)
  - `/operations/inventory/dashboard`
  - `/operations/inventory/material-master`
  - `/operations/inventory/stock-ledger`
  - `/operations/inventory/warehouse`
  - `/operations/inventory/material-requests`
  - `/operations/inventory/finished-goods`
  - `/operations/inventory/reorder-forecasting`

- `/operations/shipment` - Shipment (admin, manager, operations)
  - `/operations/shipment/dashboard`
  - `/operations/shipment/booking-manager`
  - `/operations/shipment/live-tracking`
  - `/operations/shipment/document-vault`
  - `/operations/shipment/buyer-updates`
  - `/operations/shipment/exceptions`

### Quality Module (`/quality`)
- `/quality/qc` - Quality Control (admin, manager, quality)
  - `/quality/qc/dashboard`
  - `/quality/qc/inline-qc`
  - `/quality/qc/final-qc`
  - `/quality/qc/lab-tests`
  - `/quality/qc/capa`
  - `/quality/qc/standards`

- `/quality/compliance` - Compliance & Policy (admin, manager, quality, compliance)
  - `/quality/compliance/dashboard`
  - `/quality/compliance/policy-library`
  - `/quality/compliance/audits`
  - `/quality/compliance/regulatory-monitor`

### Resources Module (`/resources`)
- `/resources/suppliers` - Supplier Evaluation (admin, manager, procurement)
  - `/resources/suppliers/dashboard`
  - `/resources/suppliers/supplier-directory`
  - `/resources/suppliers/rfq-board`
  - `/resources/suppliers/samples`

- `/resources/machines` - Machine Maintenance (admin, manager, operations)
  - `/resources/machines/dashboard`
  - `/resources/machines/machine-directory`
  - `/resources/machines/maintenance-planner`
  - `/resources/machines/breakdowns`
  - `/resources/machines/spare-parts`
  - `/resources/machines/ai-predictive`

- `/resources/workforce` - Workforce Management (admin, manager, hr)
  - `/resources/workforce/dashboard`
  - `/resources/workforce/roster-profiles`
  - `/resources/workforce/attendance-leave`
  - `/resources/workforce/skill-matrix`
  - `/resources/workforce/training-assessments`
  - `/resources/workforce/welfare-safety`

### Sustainability Module (`/sustainability`)
- `/sustainability` - Sustainability (admin, manager, compliance)
  - `/sustainability/dashboard`
  - `/sustainability/environmental`
  - `/sustainability/social`
  - `/sustainability/governance`
  - `/sustainability/waste-materials`
  - `/sustainability/footprint-dpp`

### Other Routes
- `/analytics` - Analytics (all roles)
  - `/analytics/role-dashboards`
  - `/analytics/explainers`
  - `/analytics/reports-library`
  - `/analytics/scheduled-reports`

- `/company` - Company Profile (admin, manager)
  - `/company/overview`
  - `/company/catalog`
  - `/company/website-builder`
  - `/company/ai-insights`

- `/modules` - Module Setup (admin only)
  - `/modules/:moduleId/:page` - Module onboarding

### Legal Routes
- `/privacy-policy` - Privacy Policy
- `/terms-of-service` - Terms of Service

## Role-Based Access Control

### User Roles
- **admin** - Full access to all modules
- **manager** - Module management access
- **sales** - CRM, RFQ, Buyer modules
- **production** - Production, QC, Machine modules
- **finance** - Finance, Costing modules
- **procurement** - Supplier, Inventory modules
- **compliance** - Compliance, Sustainability modules
- **hr** - Workforce Management
- **operations** - Shipment, Inventory, Production
- **quality** - Quality Control, Compliance
- **viewer** - Read-only access to all modules

### Protected Routes
All routes except login/signup require authentication. Specific modules require specific roles as noted in the routes above.

## Navigation Components

### MainLayout
- Wraps all authenticated pages
- Includes Sidebar, TopBar, and Footer
- Manages AI Panel state
- Handles demo session timer
- Provides routing context

### ProtectedRoute
- Validates user session
- Checks role-based permissions
- Redirects unauthorized users
- Used as wrapper for all protected routes

### Sidebar
- Updated with category-based navigation
- Collapsible design
- Sub-page expansion
- Active state highlighting
- Role-aware menu items

### TopBar
- Home, Approvals, Settings, Notifications buttons
- Quick actions contextual to current module
- Portals and Marketplace dropdowns
- Demo session timer
- Profile dropdown with logout

## Migration Notes

### Changes from Old System
1. **State-based routing → React Router**
   - Old: `onNavigate(setCurrentPage)` with state
   - New: `navigate('/path')` with React Router

2. **Flat URLs → Category-based URLs**
   - Old: `/lead-management/dashboard`
   - New: `/crm/leads/dashboard`

3. **Manual protection → ProtectedRoute component**
   - Old: Manual checks in render methods
   - New: Declarative route protection

4. **Single App.tsx → Modular layout**
   - Old: All logic in App.tsx (614 lines)
   - New: Clean separation with MainLayout

### Sidebar Updates
All sidebar navigation IDs updated to use category-based paths matching the router configuration.

### Component Props
Module components receive `initialSubPage` prop for internal tab management while router handles navigation.

## Future Enhancements
1. Add breadcrumb generation from route params
2. Implement route-based analytics
3. Add lazy loading for module pages
4. Create route guards for specific features
5. Add route transition animations
