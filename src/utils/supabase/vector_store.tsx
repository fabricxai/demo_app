/**
 * Vector Store Utility for FabricXAI
 * Provides embedding generation and vector similarity search capabilities
 */

import { projectId, publicAnonKey } from './info';

export interface VectorDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
  module?: string;
  timestamp?: Date;
}

export interface VectorSearchResult {
  id: string;
  content: string;
  metadata: Record<string, any>;
  similarity: number;
}

/**
 * Generate embeddings for text using the server endpoint
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/embeddings/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to generate embedding: ${error}`);
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    // Silently fail - return empty embedding for demo mode
    return [];
  }
}

/**
 * Store a document with its vector embedding
 */
export async function storeDocument(doc: VectorDocument): Promise<void> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/vectors/store`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(doc),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to store document: ${error}`);
    }
  } catch (error) {
    // Silently fail - storing is optional in demo mode
  }
}

/**
 * Search for similar documents using vector similarity
 */
export async function searchSimilar(
  query: string,
  options: {
    limit?: number;
    module?: string;
    threshold?: number;
  } = {}
): Promise<VectorSearchResult[]> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/vectors/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          query,
          limit: options.limit || 5,
          module: options.module,
          threshold: options.threshold || 0.7,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to search vectors: ${error}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    // Silently fail - return empty results for demo mode
    return [];
  }
}

/**
 * Delete a document by ID
 */
export async function deleteDocument(id: string): Promise<void> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/vectors/delete`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ id }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete document: ${error}`);
    }
  } catch (error) {
    // Silently fail - deletion is optional in demo mode
  }
}

/**
 * Batch store multiple documents
 */
export async function batchStoreDocuments(docs: VectorDocument[]): Promise<void> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd/vectors/batch-store`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ documents: docs }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to batch store documents: ${error}`);
    }
  } catch (error) {
    // Silently fail - batch storing is optional in demo mode
  }
}

/**
 * Get context for AI assistant based on query
 */
export async function getAIContext(
  query: string,
  module?: string
): Promise<string> {
  try {
    const results = await searchSimilar(query, {
      limit: 3,
      module,
      threshold: 0.6,
    });

    if (results.length === 0) {
      return '';
    }

    const context = results
      .map((result, index) => {
        const metadata = result.metadata;
        return `[Context ${index + 1} - Similarity: ${(result.similarity * 100).toFixed(1)}%]\n${result.content}\nMetadata: ${JSON.stringify(metadata)}`;
      })
      .join('\n\n');

    return context;
  } catch (error) {
    // Silently fail - return empty context for demo mode
    return '';
  }
}
