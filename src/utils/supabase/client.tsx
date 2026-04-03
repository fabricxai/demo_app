/**
 * Supabase Client for Frontend
 * 
 * This creates a Supabase client instance for use in React components.
 * It uses the configuration from info.tsx which supports environment variables.
 */

import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey } from './info';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Get the current Supabase authentication session
 */
export async function getSupabaseSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}


