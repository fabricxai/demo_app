# Troubleshooting Vercel Deployment Issues

This guide covers common issues you might encounter after deploying to Vercel and how to fix them.

## Common Issues and Solutions

### 1. 404 Error on Page Refresh or Direct URL Access

**Symptoms:**
- App works when navigating from home page
- Getting 404 errors when refreshing the page
- Direct URL access returns 404

**Cause:** Vite SPAs need all routes to serve `index.html` for client-side routing to work.

**Solution:** The `vercel.json` file includes rewrite rules to handle this. If you're still getting 404s:

1. Verify `vercel.json` exists in your project root with:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

2. Redeploy your project after adding/updating `vercel.json`

### 2. Blank Page / White Screen

**Symptoms:**
- Page loads but shows blank/white screen
- No errors in console
- Build succeeded

**Possible Causes & Solutions:**

#### A. Check Browser Console
Open browser DevTools (F12) and check:
- **Console tab** for JavaScript errors
- **Network tab** for failed resource loads

#### B. Base Path Issues
If your app is deployed to a subdirectory, update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/your-subdirectory/',
  // ... rest of config
});
```

#### C. Environment Variables Missing
Check if the app requires environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Ensure all required `VITE_*` variables are set
3. Redeploy after adding variables

### 3. CORS Errors

**Symptoms:**
- Console shows: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
- API calls failing

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Add your Vercel domain to **Allowed Origins**:
   - `https://your-project.vercel.app`
   - `https://*.vercel.app` (for preview deployments)
   - Your custom domain if applicable

### 4. Supabase Connection Errors

**Symptoms:**
- "Failed to connect to Supabase"
- API calls returning errors
- Authentication not working

**Solutions:**

#### A. Verify Environment Variables
Ensure these are set in Vercel (if using env vars):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

#### B. Check Supabase Project Status
1. Go to Supabase Dashboard
2. Verify project is active (not paused)
3. Check API status

#### C. Verify Hardcoded Values
If using hardcoded values in `src/utils/supabase/info.tsx`, ensure:
- `projectId` matches your Supabase project
- `publicAnonKey` is the correct anon key from Supabase Dashboard

### 5. Build Succeeds but Assets Not Loading

**Symptoms:**
- Build completes successfully
- Images, CSS, or JS files return 404
- Console shows failed resource loads

**Solutions:**

#### A. Check Output Directory
Verify `vercel.json` has correct output directory:
```json
{
  "outputDirectory": "build"
}
```

#### B. Check Asset Paths
Ensure `vite.config.ts` doesn't have incorrect base path:
```typescript
export default defineConfig({
  base: '/', // Should be '/' for root deployment
  // ...
});
```

#### C. Verify Build Output
1. Check Vercel build logs
2. Verify `build/` directory contains:
   - `index.html`
   - `assets/` folder with JS/CSS files

### 6. Environment Variables Not Working

**Symptoms:**
- `import.meta.env.VITE_*` returns `undefined`
- Environment-specific config not working

**Solutions:**

#### A. Verify Variable Names
- Must start with `VITE_` to be exposed to browser
- Case-sensitive

#### B. Set in Vercel Dashboard
1. Go to Project Settings → Environment Variables
2. Add variables for:
   - **Production**
   - **Preview** (for PR deployments)
   - **Development** (optional)

#### C. Redeploy After Adding Variables
Environment variables are only available after redeployment.

### 7. Slow Initial Load / Large Bundle Size

**Symptoms:**
- Warning: "Some chunks are larger than 500 kB"
- Slow page load times

**Solutions:**

#### A. Code Splitting
Consider implementing dynamic imports for large components:
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

#### B. Analyze Bundle
```bash
npm run build -- --analyze
```

#### C. Optimize Dependencies
- Remove unused dependencies
- Use tree-shaking friendly imports
- Consider replacing heavy libraries

### 8. API Routes Not Working

**Symptoms:**
- Frontend loads but API calls fail
- Edge Functions not responding

**Note:** Your Supabase Edge Functions must be deployed separately to Supabase, not Vercel.

**Solution:**
1. Deploy Edge Functions to Supabase:
```bash
supabase functions deploy make-server-1f923fcd
```

2. Set Edge Function environment variables in Supabase Dashboard

3. Verify function URLs in your code match deployed functions

### 9. Authentication Issues

**Symptoms:**
- Login/Signup not working
- Session not persisting
- Redirect loops

**Solutions:**

#### A. Check Supabase Auth Settings
1. Supabase Dashboard → Authentication → Settings
2. Verify:
   - Site URL matches your Vercel domain
   - Redirect URLs include your Vercel domain

#### B. Check CORS (see issue #3)

#### C. Verify Auth Flow
- Check browser console for errors
- Verify Supabase client initialization
- Check localStorage for auth tokens

### 10. Preview Deployments Not Working

**Symptoms:**
- Production works but preview deployments fail
- PR previews show errors

**Solutions:**

#### A. Environment Variables
Ensure preview environment has all required variables:
- Vercel Dashboard → Settings → Environment Variables
- Set variables for **Preview** environment

#### B. Different Supabase Project
If using different Supabase project for previews:
- Set preview-specific environment variables
- Update CORS to allow `*.vercel.app`

## Debugging Steps

### 1. Check Vercel Build Logs
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the failed deployment
3. Review build logs for errors

### 2. Check Browser Console
1. Open deployed site
2. Press F12 to open DevTools
3. Check:
   - **Console** tab for errors
   - **Network** tab for failed requests
   - **Application** tab for localStorage/sessionStorage

### 3. Test Locally
```bash
# Build locally
npm run build

# Serve build locally
npx serve build
```

If local build works but Vercel doesn't, it's likely a configuration issue.

### 4. Compare with Working Deployment
If you have a previous working deployment:
1. Compare `vercel.json` files
2. Compare environment variables
3. Check git diff for recent changes

## Getting Help

If you're still experiencing issues:

1. **Check Vercel Status**: https://www.vercel-status.com/
2. **Vercel Documentation**: https://vercel.com/docs
3. **Vercel Community**: https://github.com/vercel/vercel/discussions

## Quick Checklist

Before reporting an issue, verify:

- [ ] `vercel.json` exists with correct configuration
- [ ] Build succeeds in Vercel dashboard
- [ ] Environment variables are set for correct environments
- [ ] CORS is configured in Supabase
- [ ] Supabase project is active
- [ ] No console errors in browser
- [ ] Assets are loading (check Network tab)
- [ ] Routing works (SPA rewrite rules in place)

