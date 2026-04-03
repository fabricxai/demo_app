/**
 * Authentication utilities for FabricXAI
 * Handles user authentication with Supabase backend
 */

import { DEMO_ADMIN_CREDENTIALS } from '../config/demoAccounts';
import { projectId, publicAnonKey } from './supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1f923fcd`;

/** Local dev only: skip login and API session verification (never enable in production). */
export function isDevAuthBypass(): boolean {
  return (
    import.meta.env.DEV === true &&
    String(import.meta.env.VITE_DEV_AUTH_BYPASS || "").toLowerCase() === "true"
  );
}

function devBypassAuthSession(): AuthSession {
  return {
    user: {
      id: "dev-bypass-user",
      email: "dev-bypass@local",
      fullName: "Dev bypass",
      companyName: "FabricXAI (local)",
      companyId: "fabricxai-demo",
      role: "admin",
    },
    accessToken: "dev-bypass-token",
  };
}

let devBypassConsoleWarned = false;

export interface User {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  companyId: string;
  role: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}

export interface AuthError {
  error: string;
  hint?: string;
}

/**
 * Create demo users if they don't exist
 */
export async function ensureDemoUsersExist(): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/create-demo-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const result = await response.json();
    
    if (response.ok) {
      return { success: true, message: 'Demo users ready' };
    } else {
      return { success: false, message: result.error };
    }
  } catch (error) {
    console.error('Error creating demo users:', error);
    return { success: false, message: 'Failed to create demo users' };
  }
}

/**
 * Sign in with demo account
 */
export async function signInWithDemo(): Promise<{ success: true; session: AuthSession } | { success: false; error: AuthError }> {
  // First ensure demo users exist
  await ensureDemoUsersExist();
  
  return signIn({
    email: DEMO_ADMIN_CREDENTIALS.email,
    password: DEMO_ADMIN_CREDENTIALS.password,
  });
}

/**
 * Sign up a new user
 */
export async function signUp(data: {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  phone?: string;
  role?: string;
}): Promise<{ success: true; session: AuthSession } | { success: false; error: AuthError }> {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          error: result.error || 'Signup failed',
          hint: 'Please check your information and try again',
        },
      };
    }

    // Store session
    const session: AuthSession = {
      user: result.user,
      accessToken: result.session.access_token,
    };

    localStorage.setItem('fabricxai_session', JSON.stringify(session));

    return { success: true, session };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: {
        error: 'Network error. Please check your connection and try again.',
      },
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(data: {
  email: string;
  password: string;
}): Promise<{ success: true; session: AuthSession } | { success: false; error: AuthError }> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      // Provide more helpful error messages
      let errorMessage = result.error || 'Login failed';
      let hint = result.hint;
      
      // Check if it's an invalid credentials error
      if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('credential')) {
        errorMessage = 'Invalid email or password';
        hint = 'Please check your credentials or create a new account. You can also try Demo Mode.';
      }
      
      return {
        success: false,
        error: {
          error: errorMessage,
          hint: hint,
        },
      };
    }

    // Store session
    const session: AuthSession = {
      user: result.user,
      accessToken: result.session.access_token,
    };

    localStorage.setItem('fabricxai_session', JSON.stringify(session));

    return { success: true, session };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: {
        error: 'Network error. Please check your connection and try again.',
      },
    };
  }
}

/**
 * Sign out the current user
 */
export function signOut(): void {
  localStorage.removeItem('fabricxai_session');
}

/**
 * Get the current session from localStorage
 */
export function getSession(): AuthSession | null {
  if (isDevAuthBypass()) {
    return devBypassAuthSession();
  }
  try {
    const sessionStr = localStorage.getItem('fabricxai_session');
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr) as AuthSession;
    if (session?.user && session?.accessToken) {
      return session;
    }
    return null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/**
 * Verify session with the server
 */
export async function verifySession(): Promise<{ valid: boolean; user?: User }> {
  if (isDevAuthBypass()) {
    const s = devBypassAuthSession();
    if (!devBypassConsoleWarned) {
      devBypassConsoleWarned = true;
      console.warn(
        "[FabricXAI] VITE_DEV_AUTH_BYPASS=true — mock admin session (dev only; unset to use real login).",
      );
    }
    return { valid: true, user: s.user };
  }
  const session = getSession();
  if (!session) {
    return { valid: false };
  }

  try {
    const response = await fetch(`${API_URL}/auth/session`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      // Session is invalid, clear it
      signOut();
      return { valid: false };
    }

    const result = await response.json();
    return { valid: true, user: result.user };
  } catch (error) {
    console.error('Session verification error:', error);
    return { valid: false };
  }
}

/**
 * Create demo users (for development/testing)
 */
export async function createDemoUsers(): Promise<{ success: boolean; results?: any[] }> {
  try {
    const response = await fetch(`${API_URL}/auth/create-demo-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const result = await response.json();
    return { success: response.ok, results: result.results };
  } catch (error) {
    console.error('Create demo users error:', error);
    return { success: false };
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  return { valid: true };
}