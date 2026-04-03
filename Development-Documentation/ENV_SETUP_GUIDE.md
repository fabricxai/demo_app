# Environment Variables Setup Guide

This guide explains how to set up environment variables for the FabricXAI Garments Intelligent Platform.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your values** in `.env.local`

3. **Never commit** `.env.local` to git (it's already in `.gitignore`)

## Current Configuration

### Hardcoded Configuration (Current)

The application currently uses **hardcoded Supabase credentials** in:
- `src/utils/supabase/info.tsx`

This means the app will work out of the box without environment variables, but you won't be able to easily switch between different Supabase projects for different environments.

### Environment Variable Configuration (Optional)

If you want to use environment variables instead (recommended for production), you'll need to:

1. Update `src/utils/supabase/info.tsx` to read from environment variables
2. Set the variables in your deployment platform (Vercel, etc.)

## Environment Variables

### Frontend Variables (Vite)

These variables are used by the React frontend application. They must be prefixed with `VITE_` to be accessible in the browser.

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Optional* | `https://elznbletkunibhicbizb.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Optional* | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | Optional | `elznbletkunibhicbizb` |

*Currently optional because values are hardcoded. Required if you update the code to use env vars.

### Where to Find Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. You'll find:
   - **Project URL**: Use this for `VITE_SUPABASE_URL`
   - **anon public key**: Use this for `VITE_SUPABASE_ANON_KEY`
   - **Project ID**: Use this for `VITE_SUPABASE_PROJECT_ID`

## Setup by Environment

### Local Development

1. Create `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. The app will use values from `.env.local` if you've updated the code to read from environment variables, otherwise it uses hardcoded values.

### Vercel Deployment

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

2. Add the following variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. Set them for all environments:
   - **Production**
   - **Preview** (for pull requests)
   - **Development** (optional)

4. Redeploy after adding variables

### Supabase Edge Functions

**Important**: Edge Functions run on Supabase, not Vercel. Set these in Supabase Dashboard:

1. Go to Supabase Dashboard → **Edge Functions** → **Settings** → **Environment Variables**

2. Add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)
   - `SUPABASE_ANON_KEY`

3. Deploy your functions:
   ```bash
   supabase functions deploy make-server-1f923fcd
   ```

## Migrating from Hardcoded to Environment Variables

If you want to switch from hardcoded values to environment variables:

### Step 1: Update `src/utils/supabase/info.tsx`

Replace:
```typescript
export const projectId = "elznbletkunibhicbizb"
export const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

With:
```typescript
export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "elznbletkunibhicbizb"
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Or construct URL from project ID
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`
```

### Step 2: Set Environment Variables

- **Local**: Add to `.env.local`
- **Vercel**: Add to Vercel Dashboard
- **Other platforms**: Follow their environment variable setup

### Step 3: Test

1. Test locally with `.env.local`
2. Deploy to Vercel with environment variables set
3. Verify the app works correctly

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`

2. **Use different projects for different environments:**
   - Development: Dev Supabase project
   - Staging: Staging Supabase project
   - Production: Production Supabase project

3. **Never expose service role key:**
   - `SUPABASE_SERVICE_ROLE_KEY` should ONLY be used in Supabase Edge Functions
   - Never use it in frontend code
   - Never commit it to git

4. **Anon key is safe for frontend:**
   - The `anon` key is designed to be public
   - It's safe to expose in frontend code
   - Row Level Security (RLS) protects your data

5. **Use Vercel's environment variable interface:**
   - Don't hardcode values in code
   - Use Vercel's secure environment variable storage

## Troubleshooting

### Variables Not Working

1. **Check variable names:**
   - Must start with `VITE_` for frontend
   - Case-sensitive

2. **Restart dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

3. **Check file location:**
   - `.env.local` should be in project root
   - Same directory as `package.json`

4. **Verify values:**
   ```typescript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   ```

### Variables Not Available in Production

1. **Check Vercel Dashboard:**
   - Verify variables are set
   - Check they're set for correct environment (Production/Preview)

2. **Redeploy:**
   - Environment variables require redeployment
   - Push a new commit or trigger redeploy

### CORS Errors

If you get CORS errors after setting up:

1. Go to Supabase Dashboard → **Settings** → **API**
2. Add your domain to **Allowed Origins**:
   - `http://localhost:3000` (for local dev)
   - `https://your-project.vercel.app` (for Vercel)

## File Structure

```
project-root/
├── .env.example          # Template (safe to commit)
├── .env.local            # Your local values (DO NOT COMMIT)
├── .gitignore            # Already ignores .env.local
└── src/
    └── utils/
        └── supabase/
            └── info.tsx  # Currently hardcoded, can be updated
```

## Example `.env.local`

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://elznbletkunibhicbizb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsem5ibGV0a3VuaWJoaWNiaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDM3NjYsImV4cCI6MjA3NzIxOTc2Nn0.4HppRI5vcRf2zxjMKBPYghjVL0aYDCniniaDpqOTnvI
VITE_SUPABASE_PROJECT_ID=elznbletkunibhicbizb
```

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

