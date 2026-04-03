import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const app = new Hono();

// Get Supabase URL for internal API calls
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

// Create Supabase clients
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-User-Id", "X-Company-Id", "X-User-Role"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============================================
// Middleware for RBAC Validation
// ============================================

interface AuthContext {
  userId: string;
  companyId: string;
  role: string;
}

function validateAuth(c: any): AuthContext | null {
  const userId = c.req.header('X-User-Id');
  const companyId = c.req.header('X-Company-Id');
  const role = c.req.header('X-User-Role');
  
  if (!userId || !companyId || !role) {
    return null;
  }
  
  return { userId, companyId, role };
}

// ============================================
// Authentication Endpoints
// ============================================

/**
 * Sign up a new user
 * Creates user in Supabase Auth and stores profile in KV store
 */
app.post("/make-server-1f923fcd/auth/signup", async (c) => {
  try {
    const { email, password, fullName, companyName, phone, role } = await c.req.json();
    
    if (!email || !password || !fullName || !companyName) {
      return c.json({ error: 'Email, password, full name, and company name are required' }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since email server not configured
      user_metadata: {
        full_name: fullName,
        company_name: companyName,
        phone: phone || '',
        role: role || 'manager',
      },
    });

    if (authError) {
      console.error('Signup auth error:', authError);
      return c.json({ error: authError.message || 'Failed to create user' }, 400);
    }

    // Generate company ID from company name
    const companyId = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString(36);

    // Store user profile in KV store
    const userProfile = {
      userId: authData.user.id,
      email,
      fullName,
      companyName,
      companyId,
      phone: phone || '',
      role: role || 'manager',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${authData.user.id}`, userProfile);
    await kv.set(`company:${companyId}`, {
      id: companyId,
      name: companyName,
      ownerId: authData.user.id,
      createdAt: new Date().toISOString(),
    });

    // Sign in the user to get access token
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (sessionError) {
      console.error('Signup session error:', sessionError);
      return c.json({ error: 'User created but failed to sign in. Please try logging in.' }, 400);
    }

    return c.json({
      success: true,
      user: {
        id: authData.user.id,
        email,
        fullName,
        companyName,
        companyId,
        role: role || 'manager',
      },
      session: {
        access_token: sessionData.session?.access_token,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: error.message || 'Signup failed' }, 500);
  }
});

/**
 * Sign in an existing user
 */
app.post("/make-server-1f923fcd/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Sign in with Supabase Auth
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (sessionError) {
      console.error('Login error:', sessionError);
      // Return more helpful error message
      return c.json({ 
        error: 'Invalid email or password. Please check your credentials or sign up for a new account.',
        hint: 'Try using Demo Mode or create a new account.'
      }, 401);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user:${sessionData.user.id}`);

    if (!userProfile) {
      // Fallback: create profile from user metadata if it doesn't exist
      const metadata = sessionData.user.user_metadata;
      const companyId = (metadata.company_name || 'demo-company').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString(36);
      
      const newProfile = {
        userId: sessionData.user.id,
        email: sessionData.user.email,
        fullName: metadata.full_name || 'User',
        companyName: metadata.company_name || 'Demo Company',
        companyId,
        phone: metadata.phone || '',
        role: metadata.role || 'manager',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`user:${sessionData.user.id}`, newProfile);

      return c.json({
        success: true,
        user: {
          id: sessionData.user.id,
          email: newProfile.email,
          fullName: newProfile.fullName,
          companyName: newProfile.companyName,
          companyId: newProfile.companyId,
          role: newProfile.role,
        },
        session: {
          access_token: sessionData.session?.access_token,
        },
      });
    }

    return c.json({
      success: true,
      user: {
        id: userProfile.userId,
        email: userProfile.email,
        fullName: userProfile.fullName,
        companyName: userProfile.companyName,
        companyId: userProfile.companyId,
        role: userProfile.role,
      },
      session: {
        access_token: sessionData.session?.access_token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: error.message || 'Login failed' }, 500);
  }
});

/**
 * Get current user session
 */
app.get("/make-server-1f923fcd/auth/session", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const token = authHeader.substring(7);

    // Verify token and get user
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    // Get user profile
    const userProfile = await kv.get(`user:${userData.user.id}`);

    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({
      success: true,
      user: {
        id: userProfile.userId,
        email: userProfile.email,
        fullName: userProfile.fullName,
        companyName: userProfile.companyName,
        companyId: userProfile.companyId,
        role: userProfile.role,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return c.json({ error: error.message || 'Session check failed' }, 500);
  }
});

/**
 * Create demo users for testing
 * This endpoint creates predefined demo accounts
 */
app.post("/make-server-1f923fcd/auth/create-demo-users", async (c) => {
  try {
    const demoUsers = [
      {
        email: 'admin@fabricxai.com',
        password: 'admin123',
        fullName: 'Admin User',
        companyName: 'FabricXAI Demo Corp',
        role: 'admin',
        phone: '+1-555-0101',
      },
      {
        email: 'manager@fabricxai.com',
        password: 'manager123',
        fullName: 'Production Manager',
        companyName: 'FabricXAI Demo Corp',
        role: 'manager',
        phone: '+1-555-0102',
      },
      {
        email: 'sales@fabricxai.com',
        password: 'sales123',
        fullName: 'Sales Executive',
        companyName: 'FabricXAI Demo Corp',
        role: 'sales',
        phone: '+1-555-0103',
      },
    ];

    const results = [];

    for (const user of demoUsers) {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
        const userExists = existingUser?.users?.some(u => u.email === user.email);

        if (userExists) {
          results.push({ email: user.email, status: 'already_exists' });
          continue;
        }

        // Create user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.fullName,
            company_name: user.companyName,
            phone: user.phone,
            role: user.role,
          },
        });

        if (authError) {
          results.push({ email: user.email, status: 'error', error: authError.message });
          continue;
        }

        // Store profile
        const companyId = 'fabricxai-demo-corp';
        const userProfile = {
          userId: authData.user.id,
          email: user.email,
          fullName: user.fullName,
          companyName: user.companyName,
          companyId,
          phone: user.phone,
          role: user.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await kv.set(`user:${authData.user.id}`, userProfile);
        results.push({ email: user.email, status: 'created', userId: authData.user.id });
      } catch (error) {
        results.push({ email: user.email, status: 'error', error: error.message });
      }
    }

    // Create demo company
    await kv.set(`company:fabricxai-demo-corp`, {
      id: 'fabricxai-demo-corp',
      name: 'FabricXAI Demo Corp',
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, results });
  } catch (error) {
    console.error('Create demo users error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Health check endpoint
app.get("/make-server-1f923fcd/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// Demo Request Endpoints
// ============================================

/**
 * Submit a demo request
 * Stores lead information for sales team
 */
app.post("/make-server-1f923fcd/demo-requests/submit", async (c) => {
  try {
    const demoData = await c.req.json();
    
    if (!demoData.fullName || !demoData.email || !demoData.companyName) {
      return c.json({ error: 'Full name, email, and company name are required' }, 400);
    }

    // Generate unique request ID
    const requestId = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store demo request
    const demoRequest = {
      id: requestId,
      ...demoData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`demo-request:${requestId}`, demoRequest);
    
    // Also store in a list for easy retrieval by sales team
    const requestsList = await kv.get('demo-requests:list') || { requests: [] };
    requestsList.requests.unshift(requestId); // Add to beginning
    await kv.set('demo-requests:list', requestsList);

    console.log('Demo request submitted:', {
      id: requestId,
      email: demoData.email,
      company: demoData.companyName,
    });

    return c.json({ 
      success: true, 
      requestId,
      message: 'Demo request submitted successfully' 
    });
  } catch (error) {
    console.error('Demo request submission error:', error);
    return c.json({ error: error.message || 'Failed to submit demo request' }, 500);
  }
});

/**
 * Get all demo requests (for sales team)
 */
app.get("/make-server-1f923fcd/demo-requests/list", async (c) => {
  try {
    const auth = validateAuth(c);
    if (!auth || (auth.role !== 'admin' && auth.role !== 'sales')) {
      return c.json({ error: 'Unauthorized - Admin or Sales role required' }, 403);
    }

    const requestsList = await kv.get('demo-requests:list') || { requests: [] };
    const requests = [];

    // Fetch each request
    for (const requestId of requestsList.requests) {
      const request = await kv.get(`demo-request:${requestId}`);
      if (request) {
        requests.push(request);
      }
    }

    return c.json({ requests });
  } catch (error) {
    console.error('Error fetching demo requests:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Update demo request status
 */
app.put("/make-server-1f923fcd/demo-requests/update-status", async (c) => {
  try {
    const auth = validateAuth(c);
    if (!auth || (auth.role !== 'admin' && auth.role !== 'sales')) {
      return c.json({ error: 'Unauthorized - Admin or Sales role required' }, 403);
    }

    const { requestId, status, notes } = await c.req.json();
    
    if (!requestId || !status) {
      return c.json({ error: 'Request ID and status are required' }, 400);
    }

    const request = await kv.get(`demo-request:${requestId}`);
    if (!request) {
      return c.json({ error: 'Demo request not found' }, 404);
    }

    // Update status
    request.status = status;
    request.salesNotes = notes || request.salesNotes;
    request.updatedAt = new Date().toISOString();
    request.updatedBy = auth.userId;

    await kv.set(`demo-request:${requestId}`, request);

    return c.json({ success: true, request });
  } catch (error) {
    console.error('Error updating demo request:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// Data Storage Endpoints with RBAC
// ============================================

/**
 * Store data with company isolation
 */
app.post("/make-server-1f923fcd/data/store", async (c) => {
  try {
    const auth = validateAuth(c);
    if (!auth) {
      return c.json({ error: 'Unauthorized - Missing auth headers' }, 401);
    }
    
    const { key, data } = await c.req.json();
    
    if (!key || !data) {
      return c.json({ error: 'Key and data are required' }, 400);
    }
    
    // Ensure data has company ID
    const enrichedData = {
      ...data,
      companyId: auth.companyId,
      ownerId: auth.userId,
    };
    
    // Store with company-prefixed key for isolation
    const companyKey = `${auth.companyId}:${key}`;
    await kv.set(companyKey, enrichedData);
    
    return c.json({ success: true, key: companyKey });
  } catch (error) {
    console.error('Error in data/store:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get data with RBAC check
 */
app.get("/make-server-1f923fcd/data/get", async (c) => {
  try {
    const auth = validateAuth(c);
    if (!auth) {
      return c.json({ error: 'Unauthorized - Missing auth headers' }, 401);
    }
    
    const key = c.req.query('key');
    if (!key) {
      return c.json({ error: 'Key is required' }, 400);
    }
    
    // Try with company prefix first
    let companyKey = key;
    if (!key.startsWith(auth.companyId)) {
      companyKey = `${auth.companyId}:${key}`;
    }
    
    const data = await kv.get(companyKey);
    
    if (!data) {
      return c.json({ error: 'Data not found' }, 404);
    }
    
    // Verify company access
    if (data.companyId && data.companyId !== auth.companyId) {
      return c.json({ error: 'Access denied' }, 403);
    }
    
    return c.json({ data });
  } catch (error) {
    console.error('Error in data/get:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get all data for a module with company filtering
 */
app.get("/make-server-1f923fcd/data/by-module", async (c) => {
  try {
    const auth = validateAuth(c);
    if (!auth) {
      return c.json({ error: 'Unauthorized - Missing auth headers' }, 401);
    }
    
    const module = c.req.query('module');
    if (!module) {
      return c.json({ error: 'Module is required' }, 400);
    }
    
    // Get all keys with company prefix
    const prefix = `${auth.companyId}:`;
    const allData = await kv.getByPrefix(prefix);
    
    // Filter by module
    const moduleData = allData.filter((item: any) => item.module === module);
    
    return c.json({ data: moduleData });
  } catch (error) {
    console.error('Error in data/by-module:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Update data with RBAC check
 */
app.put("/make-server-1f923fcd/data/update", async (c) => {
  try {
    const auth = validateAuth(c);
    if (!auth) {
      return c.json({ error: 'Unauthorized - Missing auth headers' }, 401);
    }
    
    const { key, data } = await c.req.json();
    
    if (!key || !data) {
      return c.json({ error: 'Key and data are required' }, 400);
    }
    
    // Try with company prefix first
    let companyKey = key;
    if (!key.startsWith(auth.companyId)) {
      companyKey = `${auth.companyId}:${key}`;
    }
    
    // Get existing data to verify ownership
    const existing = await kv.get(companyKey);
    
    if (!existing) {
      return c.json({ error: 'Data not found' }, 404);
    }
    
    // Verify company access
    if (existing.companyId && existing.companyId !== auth.companyId) {
      return c.json({ error: 'Access denied' }, 403);
    }
    
    // Update data preserving company info
    const updatedData = {
      ...existing,
      ...data,
      companyId: auth.companyId,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.userId,
    };
    
    await kv.set(companyKey, updatedData);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error in data/update:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Delete data with RBAC check
 */
app.delete("/make-server-1f923fcd/data/delete", async (c) => {
  try {
    const auth = validateAuth(c);
    if (!auth) {
      return c.json({ error: 'Unauthorized - Missing auth headers' }, 401);
    }
    
    const { key } = await c.req.json();
    
    if (!key) {
      return c.json({ error: 'Key is required' }, 400);
    }
    
    // Try with company prefix first
    let companyKey = key;
    if (!key.startsWith(auth.companyId)) {
      companyKey = `${auth.companyId}:${key}`;
    }
    
    // Get existing data to verify ownership
    const existing = await kv.get(companyKey);
    
    if (!existing) {
      return c.json({ error: 'Data not found' }, 404);
    }
    
    // Verify company access
    if (existing.companyId && existing.companyId !== auth.companyId) {
      return c.json({ error: 'Access denied' }, 403);
    }
    
    await kv.del(companyKey);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error in data/delete:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Batch store data
 */
app.post("/make-server-1f923fcd/data/batch-store", async (c) => {
  try {
    const auth = validateAuth(c);
    if (!auth) {
      return c.json({ error: 'Unauthorized - Missing auth headers' }, 401);
    }
    
    const { records } = await c.req.json();
    
    if (!Array.isArray(records)) {
      return c.json({ error: 'Records array is required' }, 400);
    }
    
    const results = [];
    for (const record of records) {
      try {
        const companyKey = `${auth.companyId}:${record.key}`;
        const enrichedData = {
          ...record.data,
          companyId: auth.companyId,
          ownerId: auth.userId,
        };
        
        await kv.set(companyKey, enrichedData);
        results.push({ key: companyKey, success: true });
      } catch (error) {
        console.error(`Error storing record ${record.key}:`, error);
        results.push({ key: record.key, success: false, error: error.message });
      }
    }
    
    return c.json({ results });
  } catch (error) {
    console.error('Error in data/batch-store:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// Analytics Endpoints
// ============================================

/**
 * Get company-wide analytics
 */
app.get("/make-server-1f923fcd/analytics/company", async (c) => {
  try {
    const auth = validateAuth(c);
    if (!auth) {
      return c.json({ error: 'Unauthorized - Missing auth headers' }, 401);
    }
    
    // Get all company data
    const prefix = `${auth.companyId}:`;
    const allData = await kv.getByPrefix(prefix);
    
    // Calculate analytics
    const analytics = {
      totalRecords: allData.length,
      moduleBreakdown: {} as Record<string, number>,
      recentActivity: [] as any[],
    };
    
    // Group by module
    allData.forEach((item: any) => {
      if (item.module) {
        analytics.moduleBreakdown[item.module] = (analytics.moduleBreakdown[item.module] || 0) + 1;
      }
    });
    
    // Get recent activity (last 10 items)
    analytics.recentActivity = allData
      .filter((item: any) => item.updatedAt)
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);
    
    return c.json({ data: analytics });
  } catch (error) {
    console.error('Error in analytics/company:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get module-specific analytics
 */
app.get("/make-server-1f923fcd/analytics/module", async (c) => {
  try {
    const auth = validateAuth(c);
    if (!auth) {
      return c.json({ error: 'Unauthorized - Missing auth headers' }, 401);
    }
    
    const module = c.req.query('module');
    if (!module) {
      return c.json({ error: 'Module is required' }, 400);
    }
    
    // Get all company data for module
    const prefix = `${auth.companyId}:`;
    const allData = await kv.getByPrefix(prefix);
    const moduleData = allData.filter((item: any) => item.module === module);
    
    const analytics = {
      totalRecords: moduleData.length,
      recentActivity: moduleData
        .filter((item: any) => item.updatedAt)
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 10),
    };
    
    return c.json({ data: analytics });
  } catch (error) {
    console.error('Error in analytics/module:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// Vector Database Endpoints
// ============================================

/**
 * Generate embeddings using a simple hash-based algorithm
 * Note: For production, integrate with OpenAI or similar embedding service
 */
app.post("/make-server-1f923fcd/embeddings/generate", async (c) => {
  try {
    const { text } = await c.req.json();
    
    if (!text || typeof text !== 'string') {
      return c.json({ error: 'Text is required' }, 400);
    }

    // Generate a simple hash-based embedding for demo purposes
    // This provides consistent embeddings for semantic similarity search
    const embedding = generateSimpleEmbedding(text);
    
    return c.json({ embedding });
  } catch (error) {
    console.error('Error in embeddings/generate:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Store a document with vector embedding
 */
app.post("/make-server-1f923fcd/vectors/store", async (c) => {
  try {
    const { id, content, metadata, module, embedding } = await c.req.json();
    
    if (!id || !content) {
      return c.json({ error: 'ID and content are required' }, 400);
    }

    let vectorEmbedding = embedding;
    
    // Generate embedding if not provided
    if (!vectorEmbedding) {
      const embeddingResponse = await fetch(`${supabaseUrl}/functions/v1/make-server-1f923fcd/embeddings/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ text: content }),
      });
      
      const embeddingData = await embeddingResponse.json();
      vectorEmbedding = embeddingData.embedding;
    }

    // Store in KV store with vector data
    const documentData = {
      id,
      content,
      metadata: metadata || {},
      module: module || 'general',
      embedding: vectorEmbedding,
      timestamp: new Date().toISOString(),
    };

    await kv.set(`vector:${id}`, documentData);
    
    // Also store in a module-specific index
    if (module) {
      const moduleKey = `vector_index:${module}`;
      const moduleIndex = await kv.get(moduleKey) || { ids: [] };
      if (!moduleIndex.ids.includes(id)) {
        moduleIndex.ids.push(id);
        await kv.set(moduleKey, moduleIndex);
      }
    }

    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error in vectors/store:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Search for similar documents using vector similarity
 */
app.post("/make-server-1f923fcd/vectors/search", async (c) => {
  try {
    const { query, limit = 5, module, threshold = 0.7 } = await c.req.json();
    
    if (!query) {
      return c.json({ error: 'Query is required' }, 400);
    }

    // Generate embedding for the query
    const embeddingResponse = await fetch(`${supabaseUrl}/functions/v1/make-server-1f923fcd/embeddings/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ text: query }),
    });
    
    const { embedding: queryEmbedding } = await embeddingResponse.json();

    // Get all vector documents (or filter by module)
    let documentIds: string[] = [];
    
    if (module) {
      const moduleIndex = await kv.get(`vector_index:${module}`);
      documentIds = moduleIndex?.ids || [];
    } else {
      // Get all vector keys
      const allKeys = await kv.getByPrefix('vector:');
      documentIds = allKeys.map((doc: any) => doc.id);
    }

    // Calculate similarities
    const results = [];
    for (const docId of documentIds) {
      const doc = await kv.get(`vector:${docId}`);
      if (!doc || !doc.embedding) continue;

      const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
      
      if (similarity >= threshold) {
        results.push({
          id: doc.id,
          content: doc.content,
          metadata: doc.metadata,
          similarity,
        });
      }
    }

    // Sort by similarity and limit
    results.sort((a, b) => b.similarity - a.similarity);
    const limitedResults = results.slice(0, limit);

    return c.json({ results: limitedResults });
  } catch (error) {
    console.error('Error in vectors/search:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Delete a vector document
 */
app.delete("/make-server-1f923fcd/vectors/delete", async (c) => {
  try {
    const { id } = await c.req.json();
    
    if (!id) {
      return c.json({ error: 'ID is required' }, 400);
    }

    // Get the document to find its module
    const doc = await kv.get(`vector:${id}`);
    
    // Delete from vector store
    await kv.del(`vector:${id}`);
    
    // Remove from module index
    if (doc && doc.module) {
      const moduleKey = `vector_index:${doc.module}`;
      const moduleIndex = await kv.get(moduleKey);
      if (moduleIndex && moduleIndex.ids) {
        moduleIndex.ids = moduleIndex.ids.filter((docId: string) => docId !== id);
        await kv.set(moduleKey, moduleIndex);
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error in vectors/delete:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Batch store multiple documents
 */
app.post("/make-server-1f923fcd/vectors/batch-store", async (c) => {
  try {
    const { documents } = await c.req.json();
    
    if (!Array.isArray(documents)) {
      return c.json({ error: 'Documents array is required' }, 400);
    }

    const results = [];
    for (const doc of documents) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/make-server-1f923fcd/vectors/store`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify(doc),
        });
        
        const result = await response.json();
        results.push(result);
      } catch (error) {
        console.error(`Error storing document ${doc.id}:`, error);
        results.push({ id: doc.id, error: error.message });
      }
    }

    return c.json({ results });
  } catch (error) {
    console.error('Error in vectors/batch-store:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// Utility Functions
// ============================================

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * Generate a simple embedding for demo purposes
 * Uses a combination of character-based hashing and n-gram features
 * In production, use OpenAI, Cohere, or similar embedding service
 */
function generateSimpleEmbedding(text: string): number[] {
  const dimension = 384; // Common embedding dimension
  const embedding = new Array(dimension).fill(0);
  
  // Normalize text
  const normalizedText = text.toLowerCase().trim();
  
  // Character-based features
  for (let i = 0; i < normalizedText.length; i++) {
    const charCode = normalizedText.charCodeAt(i);
    const index = (charCode * (i + 1)) % dimension;
    embedding[index] += Math.sin(charCode / 100) * (1 - i / normalizedText.length);
  }
  
  // Word-based features
  const words = normalizedText.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let wordHash = 0;
    for (let j = 0; j < word.length; j++) {
      wordHash = ((wordHash << 5) - wordHash) + word.charCodeAt(j);
      wordHash = wordHash & wordHash; // Convert to 32bit integer
    }
    const index = Math.abs(wordHash) % dimension;
    embedding[index] += Math.cos(i / words.length) * 0.5;
  }
  
  // Bigram features for semantic similarity
  for (let i = 0; i < normalizedText.length - 1; i++) {
    const bigram = normalizedText.charCodeAt(i) * 256 + normalizedText.charCodeAt(i + 1);
    const index = bigram % dimension;
    embedding[index] += 0.3;
  }
  
  // Normalize to unit vector
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => (norm > 0 ? val / norm : 0));
}

Deno.serve(app.fetch);