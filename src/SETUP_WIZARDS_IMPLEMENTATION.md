# Setup Wizards Implementation Guide

## ✅ Completed Setup Wizards (9)
1. **Lead Management** - LeadManagementSetup.tsx
2. **RFQ & Quotation** - RFQQuotationSetup.tsx
3. **Costing** - CostingSetup.tsx
4. **Production Planning** - ProductionPlanningSetup.tsx
5. **Workforce Management** - WorkforceManagementSetup.tsx
6. **Machine Maintenance** - MachineMaintenanceSetup.tsx
7. **Buyer Management** - BuyerManagementSetup.tsx
8. **Supplier Evaluation** - SupplierEvaluationSetup.tsx
9. **Company Profile** - CompanyProfileSetup.tsx

## 🔄 In Progress (2)
1. **Inventory Management** - InventoryManagementSetup.tsx ✅ CREATED
2. **Quality Control** - QualityControlSetup.tsx ✅ CREATED

## 📋 Remaining Setup Wizards Needed (4)

### 1. Shipment Module Setup
**File**: `/components/pages/ShipmentSetup.tsx`
**Steps**:
- Step 0: Welcome & Overview
- Step 1: Import Shipments (PDF/Excel/Manual)
- Step 2: Carrier Setup (DHL, FedEx, Maersk, etc.)
- Step 3: Documentation Templates (Invoice, Packing List, BL)
- Step 4: Automation Workflows (Tracking alerts, customs clearance, delivery confirmation)

**Key Features**:
- Real-time shipment tracking
- Auto-document generation
- Customs compliance AI
- Delivery prediction
- Multi-carrier integration
- Container optimization

### 2. Finance Module Setup
**File**: `/components/pages/FinanceSetup.tsx`
**Steps**:
- Step 0: Welcome & Overview
- Step 1: Import Transactions (Bank statements, invoices)
- Step 2: Chart of Accounts (Revenue, expenses, assets, liabilities)
- Step 3: Payment Terms (Net 30, Net 60, LC, advance payment)
- Step 4: Automation Workflows (Invoice generation, payment reminders, cash flow forecasting)

**Key Features**:
- AI cash flow forecasting
- Auto invoice generation
- Payment tracking
- Profit margin analysis
- Bank reconciliation
- Financial dashboards

### 3. Compliance & Policy Module Setup
**File**: `/components/pages/CompliancePolicySetup.tsx`
**Steps**:
- Step 0: Welcome & Overview  
- Step 1: Import Certifications (ISO, WRAP, BSCI, Oeko-Tex)
- Step 2: Policy Documents (Code of Conduct, Safety, Labor)
- Step 3: Audit Schedules (Internal, external, buyer audits)
- Step 4: Automation Workflows (Expiry alerts, audit preparation, compliance scoring)

**Key Features**:
- Certificate expiry tracking
- Audit management
- Compliance scoring
- Policy version control
- Training tracking
- Non-conformance management

### 4. Sustainability Module Setup
**File**: `/components/pages/SustainabilitySetup.tsx`
**Steps**:
- Step 0: Welcome & Overview
- Step 1: Baseline Metrics (Energy, water, waste, emissions)
- Step 2: Sustainability Goals (Carbon neutral by 2030, zero waste, etc.)
- Step 3: Green Certifications (LEED, GOTS, Cradle to Cradle)
- Step 4: Automation Workflows (Carbon footprint tracking, ESG reporting, supplier sustainability scoring)

**Key Features**:
- Carbon footprint calculator
- ESG reporting automation
- Green supplier scoring
- Water/energy consumption tracking
- Waste reduction analytics
- Sustainability dashboards

## Integration Steps for Each Module

### Step 1: Add Setup State to Module
```typescript
const [isSetupComplete, setIsSetupComplete] = useState(false);
const [showSetup, setShowSetup] = useState(false);
```

### Step 2: Add Setup Wizard Import
```typescript
import { [ModuleName]Setup } from './[ModuleName]Setup';
```

### Step 3: Add Setup Banner (if setup not complete)
```typescript
{!isSetupComplete && currentView === 'dashboard' && (
  <motion.div className="mb-6 ...">
    {/* Setup banner content */}
    <Button onClick={() => setShowSetup(true)}>
      Let MARBIM Guide You
    </Button>
  </motion.div>
)}
```

### Step 4: Add Setup Wizard Component
```typescript
{showSetup && (
  <[ModuleName]Setup
    onComplete={() => {
      setIsSetupComplete(true);
      setShowSetup(false);
    }}
    onClose={() => setShowSetup(false)}
    onAskMarbim={onAskMarbim}
  />
)}
```

## Common Setup Wizard Pattern

All setup wizards follow this structure:

### State Management
- `currentStep` - 0-indexed (0 = Welcome, 1-4 = Configuration steps)
- `isProcessing` - Loading state during transitions
- `completedSteps` - Array of completed step numbers
- `selectedFeatures` - Features selected on welcome screen

### Step Progression
- **Step 0**: Welcome screen with module overview, key features, benefits
- **Steps 1-3**: Configuration steps (import data, configure settings, define rules)
- **Step 4**: Automation workflows (AI-powered features to enable)

### Step Numbers Fixed
All wizards now use 0-indexed step numbers (0-4) matching currentStep state:
```typescript
const steps = [
  { number: 0, title: 'Welcome', ... },
  { number: 1, title: 'Step 1', ... },
  { number: 2, title: 'Step 2', ... },
  { number: 3, title: 'Step 3', ... },
  { number: 4, title: 'Automation', ... },
];
```

### Styling Standards
- Background: Navy gradient (#101725 → #182336)
- Accents: Aqua (#57ACAF), Yellow (#EAB308)
- Progress indicators with gradient fill
- MARBIM message card on each step (except Welcome)
- Animated transitions between steps
- Responsive feature cards on Welcome screen

## Files Modified
- `/components/pages/WorkforceManagementSetup.tsx` - Fixed step numbers
- `/components/pages/MachineMaintenanceSetup.tsx` - Fixed step numbers
- `/components/pages/ProductionPlanningSetup.tsx` - Fixed step numbers
- `/components/pages/CompanyProfileSetup.tsx` - Fixed step numbers
- `/components/pages/SupplierEvaluationSetup.tsx` - Fixed step numbers
- `/components/pages/BuyerManagementSetup.tsx` - Fixed step numbers
- `/components/pages/LeadManagementSetup.tsx` - Fixed step numbers
- `/components/pages/RFQQuotationSetup.tsx` - Fixed step numbers
- `/components/pages/CostingSetup.tsx` - Fixed step numbers

## Next Steps

To complete the remaining 4 modules:

1. Create setup wizard components for:
   - Shipment
   - Finance  
   - Compliance & Policy
   - Sustainability

2. Integrate setup wizards into module dashboards:
   - Add setup state management
   - Add setup banner with MARBIM call-to-action
   - Add "Let MARBIM Guide You" button click handler
   - Conditionally render setup wizard

3. Test each setup flow:
   - Verify Welcome screen displays
   - Test step navigation
   - Verify completion handler
   - Check data persistence

## Status Summary

✅ **9 modules with setup wizards** (fully functional)
🔄 **2 modules created** (Inventory, Quality Control - need integration)
📋 **4 modules remaining** (Shipment, Finance, Compliance, Sustainability)

**Total Progress**: 11/15 modules (73% complete)
