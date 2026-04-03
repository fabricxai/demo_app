/**
 * Database Integration Layer for FabricXAI
 * Provides unified interface for KV store and vector database with RBAC
 */

import { projectId, publicAnonKey } from './info';
import { getCurrentSession, addMetadata, filterDataByAccess, getAuthHeaders } from './rbac';
import * as vectorStore from './vector_store';

// ============================================
// LocalStorage Fallback for Development
// ============================================

const USE_LOCALSTORAGE_FALLBACK = true; // Set to false when Supabase functions are deployed

function getLocalStorageKey(module: string): string {
  const session = getCurrentSession();
  return `fabricxai_${session.companyId}_${module}`;
}

function storeInLocalStorage(key: string, data: any, module: string): void {
  const storageKey = getLocalStorageKey(module);
  const existingData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  existingData[key] = data;
  localStorage.setItem(storageKey, JSON.stringify(existingData));
}

function getFromLocalStorage(key: string, module: string): any {
  const storageKey = getLocalStorageKey(module);
  const existingData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  return existingData[key];
}

function getAllFromLocalStorage(module: string): any[] {
  const storageKey = getLocalStorageKey(module);
  const existingData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  return Object.values(existingData);
}

function deleteFromLocalStorage(key: string, module: string): void {
  const storageKey = getLocalStorageKey(module);
  const existingData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  delete existingData[key];
  localStorage.setItem(storageKey, JSON.stringify(existingData));
}

// ============================================
// Data Storage Interface
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
// KV Store Operations with RBAC
// ============================================

/**
 * Store data with automatic company/user metadata
 */
export async function storeData(
  key: string,
  data: any,
  module: string
): Promise<void> {
  try {
    const enrichedData = addMetadata({
      ...data,
      id: key,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, module);
    
    if (USE_LOCALSTORAGE_FALLBACK) {
      storeInLocalStorage(key, enrichedData, module);
    } else {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/data/store`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ key, data: enrichedData }),
        }
      );
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to store data: ${error}`);
      }
    }
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
}

/**
 * Get data by key with RBAC check
 */
export async function getData(key: string): Promise<any> {
  try {
    if (USE_LOCALSTORAGE_FALLBACK) {
      const session = getCurrentSession();
      const module = session.modules[0]; // Assuming the first module for simplicity
      return getFromLocalStorage(key, module);
    } else {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/data/get?key=${encodeURIComponent(key)}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get data: ${error}`);
      }
      
      const result = await response.json();
      return result.data;
    }
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  }
}

/**
 * Get data by module with RBAC filtering
 */
export async function getDataByModule(module: string): Promise<any[]> {
  try {
    if (USE_LOCALSTORAGE_FALLBACK) {
      return getAllFromLocalStorage(module);
    } else {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/data/by-module?module=${encodeURIComponent(module)}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get module data: ${error}`);
      }
      
      const result = await response.json();
      return result.data || [];
    }
  } catch (error) {
    console.error('Error getting module data:', error);
    throw error;
  }
}

/**
 * Update data with timestamp
 */
export async function updateData(
  key: string,
  data: any,
  module: string
): Promise<void> {
  try {
    const session = getCurrentSession();
    if (!session) {
      throw new Error('No active session');
    }
    
    const enrichedData = {
      ...data,
      id: key,
      updatedAt: new Date().toISOString(),
      updatedBy: session.userId,
    };
    
    if (USE_LOCALSTORAGE_FALLBACK) {
      storeInLocalStorage(key, enrichedData, module);
    } else {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/data/update`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ key, data: enrichedData }),
        }
      );
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to update data: ${error}`);
      }
    }
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}

/**
 * Delete data by key
 */
export async function deleteData(key: string, module?: string): Promise<void> {
  try {
    if (USE_LOCALSTORAGE_FALLBACK) {
      const session = getCurrentSession();
      // Try to determine module from the key if not provided
      const targetModule = module || session.modules[0];
      deleteFromLocalStorage(key, targetModule);
    } else {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/data/delete`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
          body: JSON.stringify({ key }),
        }
      );
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete data: ${error}`);
      }
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
}

// ============================================
// Vector Database with RBAC
// ============================================

/**
 * Store document in vector database with RBAC metadata
 */
export async function storeVectorDocument(
  id: string,
  content: string,
  module: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    const enrichedMetadata = addMetadata(metadata, module);
    
    await vectorStore.storeDocument({
      id,
      content,
      metadata: enrichedMetadata,
      module,
    });
  } catch (error) {
    console.error('Error storing vector document:', error);
    throw error;
  }
}

/**
 * Search vector database with RBAC filtering
 */
export async function searchVectorDatabase(
  query: string,
  options: {
    module?: string;
    limit?: number;
    threshold?: number;
  } = {}
): Promise<any[]> {
  try {
    const session = getCurrentSession();
    if (!session) {
      throw new Error('No active session');
    }
    
    const results = await vectorStore.searchSimilar(query, options);
    
    // Filter results by company and access
    const filteredResults = results.filter(result => {
      if (!result.metadata) return false;
      
      // Check company access
      if (result.metadata.companyId !== session.companyId) {
        return false;
      }
      
      // Check module access (already handled by module parameter, but double check)
      if (result.metadata.module && !session.modules.includes(result.metadata.module)) {
        return false;
      }
      
      return true;
    });
    
    return filteredResults;
  } catch (error) {
    console.error('Error searching vector database:', error);
    throw error;
  }
}

/**
 * Get AI context with RBAC filtering
 */
export async function getAIContextForModule(
  query: string,
  module: string
): Promise<string> {
  try {
    const results = await searchVectorDatabase(query, {
      module,
      limit: 3,
      threshold: 0.6,
    });
    
    if (results.length === 0) {
      return '';
    }
    
    const context = results
      .map((result, index) => {
        return `[Context ${index + 1} - Similarity: ${(result.similarity * 100).toFixed(1)}%]\n${result.content}`;
      })
      .join('\n\n');
    
    return context;
  } catch (error) {
    console.error('Error getting AI context:', error);
    return '';
  }
}

// ============================================
// Batch Operations
// ============================================

/**
 * Batch store data records
 */
export async function batchStoreData(
  records: Array<{ key: string; data: any }>,
  module: string
): Promise<void> {
  try {
    const session = getCurrentSession();
    if (!session) {
      throw new Error('No active session');
    }
    
    const enrichedRecords = records.map(record => ({
      key: record.key,
      data: addMetadata({
        ...record.data,
        id: record.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, module),
    }));
    
    if (USE_LOCALSTORAGE_FALLBACK) {
      enrichedRecords.forEach(record => storeInLocalStorage(record.key, record.data, module));
    } else {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/data/batch-store`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ records: enrichedRecords }),
        }
      );
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to batch store data: ${error}`);
      }
    }
  } catch (error) {
    console.error('Error batch storing data:', error);
    throw error;
  }
}

/**
 * Batch store vector documents
 */
export async function batchStoreVectorDocuments(
  documents: Array<{ id: string; content: string; metadata?: Record<string, any> }>,
  module: string
): Promise<void> {
  try {
    const enrichedDocs = documents.map(doc => ({
      ...doc,
      metadata: addMetadata(doc.metadata || {}, module),
      module,
    }));
    
    await vectorStore.batchStoreDocuments(enrichedDocs);
  } catch (error) {
    console.error('Error batch storing vector documents:', error);
    throw error;
  }
}

// ============================================
// Analytics & Reporting
// ============================================

/**
 * Get company-wide analytics data
 */
export async function getCompanyAnalytics(): Promise<any> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/analytics/company`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get analytics: ${error}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error getting company analytics:', error);
    throw error;
  }
}

/**
 * Get module-specific analytics
 */
export async function getModuleAnalytics(module: string): Promise<any> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/analytics/module?module=${encodeURIComponent(module)}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get module analytics: ${error}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error getting module analytics:', error);
    throw error;
  }
}

// ============================================
// Data Synchronization
// ============================================

/**
 * Sync data between KV store and vector database
 * Useful for keeping searchable content in sync
 */
export async function syncToVectorDatabase(
  key: string,
  searchableContent: string,
  module: string
): Promise<void> {
  try {
    const data = await getData(key);
    
    if (!data) {
      throw new Error(`Data not found for key: ${key}`);
    }
    
    await storeVectorDocument(
      key,
      searchableContent,
      module,
      {
        dataKey: key,
        syncedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Error syncing to vector database:', error);
    throw error;
  }
}

/**
 * Delete from both KV store and vector database
 */
export async function deleteComplete(key: string): Promise<void> {
  try {
    await Promise.all([
      deleteData(key),
      vectorStore.deleteDocument(key),
    ]);
  } catch (error) {
    console.error('Error in complete deletion:', error);
    throw error;
  }
}