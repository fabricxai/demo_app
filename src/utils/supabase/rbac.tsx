/**
 * RBAC (Role-Based Access Control) Utility for FabricXAI
 * Manages user roles, permissions, and data access across all 14 modules
 */

import { projectId, publicAnonKey } from './info';

// ============================================
// Role Definitions
// ============================================

export type UserRole = 
  | 'admin'           // Full access to all modules
  | 'manager'         // Module-level management access
  | 'sales'           // CRM, RFQ, Buyer Management
  | 'production'      // Production Planning, Quality Control, Machine Maintenance
  | 'finance'         // Finance, Costing
  | 'procurement'     // Supplier Evaluation, Inventory
  | 'compliance'      // Compliance & Policy, Sustainability
  | 'hr'              // Workforce Management
  | 'operations'      // Shipment, Inventory, Production
  | 'quality'         // Quality Control, Compliance
  | 'viewer';         // Read-only access

// ============================================
// Module Access Permissions
// ============================================

export const MODULE_PERMISSIONS: Record<string, UserRole[]> = {
  // CRM & Sales Modules
  'lead-management': ['admin', 'manager', 'sales', 'viewer'],
  'buyer-management': ['admin', 'manager', 'sales', 'viewer'],
  'rfq-quotation': ['admin', 'manager', 'sales', 'viewer'],
  
  // Production Modules
  'production-planning': ['admin', 'manager', 'production', 'operations', 'viewer'],
  'quality-control': ['admin', 'manager', 'production', 'quality', 'operations', 'viewer'],
  'machine-maintenance': ['admin', 'manager', 'production', 'operations', 'viewer'],
  
  // Supply Chain Modules
  'supplier-evaluation': ['admin', 'manager', 'procurement', 'operations', 'viewer'],
  'inventory-management': ['admin', 'manager', 'procurement', 'operations', 'viewer'],
  'shipment': ['admin', 'manager', 'operations', 'sales', 'viewer'],
  
  // Finance Modules
  'finance': ['admin', 'manager', 'finance', 'viewer'],
  'costing': ['admin', 'manager', 'finance', 'sales', 'viewer'],
  
  // Compliance & HR Modules
  'compliance-policy': ['admin', 'manager', 'compliance', 'quality', 'viewer'],
  'sustainability': ['admin', 'manager', 'compliance', 'viewer'],
  'workforce-management': ['admin', 'manager', 'hr', 'viewer'],
  
  // System Modules
  'approve': ['admin', 'manager'],
  'analytics': ['admin', 'manager', 'viewer'],
  'dashboard': ['admin', 'manager', 'sales', 'production', 'finance', 'procurement', 'compliance', 'hr', 'operations', 'quality', 'viewer'],
};

// ============================================
// Permission Types
// ============================================

export type Permission = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'admin': ['create', 'read', 'update', 'delete', 'approve', 'export'],
  'manager': ['create', 'read', 'update', 'delete', 'approve', 'export'],
  'sales': ['create', 'read', 'update', 'export'],
  'production': ['create', 'read', 'update', 'export'],
  'finance': ['create', 'read', 'update', 'export'],
  'procurement': ['create', 'read', 'update', 'export'],
  'compliance': ['create', 'read', 'update', 'export'],
  'hr': ['create', 'read', 'update', 'export'],
  'operations': ['create', 'read', 'update', 'export'],
  'quality': ['create', 'read', 'update', 'export'],
  'viewer': ['read', 'export'],
};

// ============================================
// User Session Management
// ============================================

export interface UserSession {
  userId: string;
  companyId: string;
  role: UserRole;
  email: string;
  name: string;
  modules: string[];
  permissions: Permission[];
  expiresAt: Date;
}

/**
 * Get current user session from storage
 */
export function getCurrentSession(): UserSession | null {
  try {
    const sessionData = localStorage.getItem('fabricxai_session');
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    
    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Set user session
 */
export function setSession(session: UserSession): void {
  try {
    localStorage.setItem('fabricxai_session', JSON.stringify(session));
  } catch (error) {
    console.error('Error setting session:', error);
  }
}

/**
 * Clear user session
 */
export function clearSession(): void {
  try {
    localStorage.removeItem('fabricxai_session');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

// ============================================
// Permission Checks
// ============================================

/**
 * Check if user has access to a module
 */
export function hasModuleAccess(module: string, role?: UserRole): boolean {
  const session = getCurrentSession();
  const userRole = role || session?.role;
  
  if (!userRole) return false;
  
  const allowedRoles = MODULE_PERMISSIONS[module] || [];
  return allowedRoles.includes(userRole);
}

/**
 * Check if user has specific permission
 */
export function hasPermission(permission: Permission, role?: UserRole): boolean {
  const session = getCurrentSession();
  const userRole = role || session?.role;
  
  if (!userRole) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

/**
 * Check if user can perform action on module
 */
export function canPerformAction(module: string, action: Permission): boolean {
  const session = getCurrentSession();
  if (!session) return false;
  
  return hasModuleAccess(module, session.role) && hasPermission(action, session.role);
}

/**
 * Get accessible modules for user
 */
export function getAccessibleModules(role?: UserRole): string[] {
  const session = getCurrentSession();
  const userRole = role || session?.role;
  
  if (!userRole) return [];
  
  return Object.entries(MODULE_PERMISSIONS)
    .filter(([_, roles]) => roles.includes(userRole))
    .map(([module]) => module);
}

// ============================================
// Data Filtering
// ============================================

/**
 * Filter data based on user's company and role
 */
export function filterDataByAccess<T extends Record<string, any>>(
  data: T[],
  options: {
    companyField?: string;
    ownerField?: string;
    moduleField?: string;
  } = {}
): T[] {
  const session = getCurrentSession();
  if (!session) return [];
  
  const {
    companyField = 'companyId',
    ownerField = 'ownerId',
    moduleField = 'module',
  } = options;
  
  return data.filter(item => {
    // Always filter by company
    if (item[companyField] && item[companyField] !== session.companyId) {
      return false;
    }
    
    // Check module access if module field exists
    if (item[moduleField] && !hasModuleAccess(item[moduleField], session.role)) {
      return false;
    }
    
    // Viewers and non-managers can only see their own data in some modules
    if (session.role === 'viewer' && item[ownerField] && item[ownerField] !== session.userId) {
      return false;
    }
    
    return true;
  });
}

/**
 * Add company and owner metadata to data
 */
export function addMetadata<T extends Record<string, any>>(
  data: T,
  module?: string
): T & { companyId: string; ownerId: string; module?: string } {
  const session = getCurrentSession();
  if (!session) {
    throw new Error('No active session. Please log in.');
  }
  
  return {
    ...data,
    companyId: session.companyId,
    ownerId: session.userId,
    ...(module && { module }),
  };
}

// ============================================
// Server Integration
// ============================================

/**
 * Get authorization headers for API calls
 */
export function getAuthHeaders(): Record<string, string> {
  const session = getCurrentSession();
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    'X-User-Id': session?.userId || '',
    'X-Company-Id': session?.companyId || '',
    'X-User-Role': session?.role || '',
  };
}

/**
 * Validate request authorization on server
 */
export function validateRequestAuth(headers: Headers): {
  valid: boolean;
  userId?: string;
  companyId?: string;
  role?: UserRole;
  error?: string;
} {
  const userId = headers.get('X-User-Id');
  const companyId = headers.get('X-Company-Id');
  const role = headers.get('X-User-Role') as UserRole;
  
  if (!userId || !companyId || !role) {
    return {
      valid: false,
      error: 'Missing authentication headers',
    };
  }
  
  return {
    valid: true,
    userId,
    companyId,
    role,
  };
}

// ============================================
// Demo Session Initialization
// ============================================

/**
 * Initialize demo session for testing
 * In production, this would be replaced with actual auth
 */
export function initializeDemoSession(role: UserRole = 'admin'): void {
  const demoSession: UserSession = {
    userId: 'demo-user-001',
    companyId: 'fabricxai-demo',
    role,
    email: 'demo@fabricxai.com',
    name: 'Demo User',
    modules: getAccessibleModules(role),
    permissions: ROLE_PERMISSIONS[role],
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };
  
  setSession(demoSession);
}
