/**
 * Pre-seeded demo users (must match Edge Function `create-demo-users` in
 * `src/supabase/functions/server/index.tsx`). Temporary for pilot / live demo;
 * hide the login panel with VITE_SHOW_DEMO_CREDENTIALS=false when you retire these.
 */
export const DEMO_ACCOUNTS = [
  {
    label: 'Admin',
    email: 'admin@fabricxai.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    label: 'Manager',
    email: 'manager@fabricxai.com',
    password: 'manager123',
    role: 'manager',
  },
  {
    label: 'Sales',
    email: 'sales@fabricxai.com',
    password: 'sales123',
    role: 'sales',
  },
] as const;

/** Used by `signInWithDemo()` — keep in sync with DEMO_ACCOUNTS[0]. */
export const DEMO_ADMIN_CREDENTIALS = {
  email: DEMO_ACCOUNTS[0].email,
  password: DEMO_ACCOUNTS[0].password,
} as const;

/**
 * Show the “Demo credentials” block on the login screen when:
 * - VITE_SHOW_DEMO_CREDENTIALS=true (e.g. Vercel during a demo window), or
 * - running the Vite dev server (DEV), unless explicitly disabled with
 *   VITE_SHOW_DEMO_CREDENTIALS=false.
 */
export function showDemoCredentialsPanel(): boolean {
  const flag = String(import.meta.env.VITE_SHOW_DEMO_CREDENTIALS ?? '').toLowerCase();
  if (flag === 'false') return false;
  if (flag === 'true') return true;
  return import.meta.env.DEV === true;
}
