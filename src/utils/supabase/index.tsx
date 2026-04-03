/**
 * FabricXAI Database Integration - Main Export File
 * Import everything you need from this single file
 */

// ============================================
// Database Operations
// ============================================

export { useDatabase } from './useDatabase';
export type { UseDatabaseReturn } from './useDatabase';

export {
  storeData,
  getData,
  getDataByModule,
  updateData,
  deleteData,
  batchStoreData,
  storeVectorDocument,
  searchVectorDatabase,
  getAIContextForModule,
  syncToVectorDatabase,
  deleteComplete,
  getCompanyAnalytics,
  getModuleAnalytics,
  batchStoreVectorDocuments,
} from './database';

// ============================================
// RBAC & Permissions
// ============================================

export {
  getCurrentSession,
  setSession,
  clearSession,
  hasModuleAccess,
  hasPermission,
  canPerformAction,
  getAccessibleModules,
  filterDataByAccess,
  addMetadata,
  getAuthHeaders,
  initializeDemoSession,
} from './rbac';

export type {
  UserRole,
  Permission,
  UserSession,
} from './rbac';

export {
  MODULE_PERMISSIONS,
  ROLE_PERMISSIONS,
} from './rbac';

// ============================================
// Vector Database
// ============================================

export {
  generateEmbedding,
  storeDocument,
  searchSimilar,
  deleteDocument,
  batchStoreDocuments,
  getAIContext,
} from './vector_store';

export type {
  VectorDocument,
  VectorSearchResult,
} from './vector_store';

export { useVectorStore } from './useVectorStore';
export type { UseVectorStoreReturn } from './useVectorStore';

// ============================================
// Configuration
// ============================================

export { projectId, publicAnonKey } from './info';

// ============================================
// Module Name Constants
// ============================================

export const MODULE_NAMES = {
  DASHBOARD: 'dashboard',
  APPROVE: 'approve',
  LEAD_MANAGEMENT: 'lead-management',
  BUYER_MANAGEMENT: 'buyer-management',
  RFQ_QUOTATION: 'rfq-quotation',
  COSTING: 'costing',
  PRODUCTION_PLANNING: 'production-planning',
  QUALITY_CONTROL: 'quality-control',
  MACHINE_MAINTENANCE: 'machine-maintenance',
  SUPPLIER_EVALUATION: 'supplier-evaluation',
  INVENTORY_MANAGEMENT: 'inventory-management',
  SHIPMENT: 'shipment',
  FINANCE: 'finance',
  COMPLIANCE_POLICY: 'compliance-policy',
  SUSTAINABILITY: 'sustainability',
  WORKFORCE_MANAGEMENT: 'workforce-management',
  ANALYTICS: 'analytics',
} as const;

export type ModuleName = typeof MODULE_NAMES[keyof typeof MODULE_NAMES];

// ============================================
// Utility Types
// ============================================

export interface DataRecord {
  id: string;
  data: Record<string, any>;
  companyId: string;
  ownerId: string;
  module: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

// ============================================
// Quick Start Example (commented out)
// ============================================

/*
QUICK START GUIDE:

1. Import the hook:
   import { useDatabase } from '../utils/supabase';

2. Use in your component:
   const db = useDatabase();

3. Store data:
   await db.store('record-id', data, 'module-name');

4. Get data:
   const data = await db.get('record-id');
   const allData = await db.getByModule('module-name');

5. Search with AI:
   const results = await db.searchVector(query, {
     module: 'module-name',
     limit: 10
   });

6. Check permissions:
   import { canPerformAction } from '../utils/supabase';
   if (canPerformAction('module-name', 'create')) {
     // User can create
   }

7. Get current session:
   import { getCurrentSession } from '../utils/supabase';
   const session = getCurrentSession();
   console.log(session.role, session.companyId);

For more details, see /guidelines/DatabaseIntegration.md
*/