# Vercel Deployment Guide

This guide will walk you through deploying the FabricXAI Garments Intelligent Platform to Vercel using GitHub integration.

## Prerequisites

1. **GitHub Account** - You need a GitHub account with the repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **Supabase Project** - Your Supabase project should be set up and running
4. **Node.js** - Version 18 or higher (for local testing)

## Step 1: Prepare Your Repository

### 1.1 Create .gitignore File

Before pushing to GitHub, ensure you have a `.gitignore` file to exclude unnecessary files:

- The project includes a `.gitignore` file that excludes:
  - `node_modules/` - Dependencies (should not be committed)
  - `build/` and `dist/` - Build outputs
  - `.env*` files - Environment variables (sensitive data)
  - IDE and OS-specific files
  - Logs and cache files

**Important**: Never commit `.env` files or sensitive keys to GitHub. Use Vercel's environment variables instead.

### 1.2 Push Your Code to GitHub

If you haven't already, initialize a git repository and push to GitHub:

```bash
# Initialize git (if not already done)
git init

# Verify .gitignore is in place
ls -la .gitignore  # Should show the file

# Add all files (respects .gitignore)
git add .

# Commit your changes
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 1.2 Verify Build Configuration

Ensure your `package.json` has the correct build script:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

The build output directory is configured in `vite.config.ts` as `build` (default for Vite).

**Important**: The project includes a `vercel.json` file that configures Vercel to use the `build` directory as the output directory. This ensures Vercel correctly finds your built files after the build process completes.

## Step 2: Set Up Vercel Project

### 2.1 Import Project from GitHub

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub account and authorize Vercel if needed
5. Find and select your repository: `fabricXai-Garments Intelligent Platform`
6. Click **"Import"**

### 2.2 Configure Project Settings

Vercel will auto-detect your project as a Vite project. Verify these settings:

- **Framework Preset**: Vite
- **Root Directory**: `./` (root of repository)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `build` (matches your vite.config.ts)
- **Install Command**: `npm install` (auto-detected)

### 2.3 Environment Variables

Before deploying, you need to configure environment variables. Click **"Environment Variables"** and add:

#### Required Environment Variables

The application now supports environment variables for production deployments. Set these in Vercel:

- `VITE_SUPABASE_URL` - Your Supabase project URL (Recommended)
  - Format: `https://YOUR_PROJECT_ID.supabase.co`
  - Example: `https://elznbletkunibhicbizb.supabase.co`
  - Found in: Supabase Dashboard → Settings → API → Project URL

- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key (Recommended)
  - Found in: Supabase Dashboard → Settings → API → `anon` `public` key
  - This is safe to expose in the frontend (it's designed to be public)

- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID (Optional)
  - Format: `YOUR_PROJECT_ID`
  - Only needed if you're not providing `VITE_SUPABASE_URL`
  - Found in: Supabase Dashboard → Settings → API → Project URL (extract the ID)

**Note**: The application will work without these environment variables (it falls back to hardcoded values), but **it's highly recommended to set them for production** to:
- Use different Supabase projects for different environments
- Keep credentials out of source code
- Easily switch between environments

#### How It Works

The application reads environment variables in this priority order:
1. **Environment variables** (if set) - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_PROJECT_ID`
2. **Hardcoded fallback values** (if environment variables are not set)

This ensures backward compatibility while enabling environment-based configuration.

### 2.4 Configure for All Environments

Make sure to add environment variables for:
- **Production** (default)
- **Preview** (for pull requests)
- **Development** (optional)

You can set the same values for all, or use different Supabase projects for different environments.

## Step 3: Deploy

### 3.1 Initial Deployment

1. Review all settings in the Vercel configuration page
2. Click **"Deploy"**
3. Vercel will:
   - Install dependencies (`npm install`)
   - Build your project (`npm run build`)
   - Deploy to a production URL

### 3.2 Monitor Deployment

- Watch the build logs in real-time
- The deployment will show a URL once complete (e.g., `your-project.vercel.app`)
- If there are errors, check the build logs

## Step 4: Post-Deployment Configuration

### 4.1 Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

### 4.2 Supabase Edge Functions

Your Supabase Edge Functions (in `src/supabase/functions/`) need to be deployed separately to Supabase, not Vercel:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy functions
supabase functions deploy make-server-1f923fcd
```

**Note**: Edge Functions require these environment variables in Supabase:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

Set these in: Supabase Dashboard → Edge Functions → Settings → Environment Variables

### 4.3 CORS Configuration

Ensure your Supabase project allows requests from your Vercel domain:

1. Go to Supabase Dashboard → Settings → API
2. Add your Vercel URL to allowed origins:
   - `https://your-project.vercel.app`
   - `https://your-custom-domain.com` (if using custom domain)

## Step 5: Continuous Deployment

### 5.1 Automatic Deployments

Once connected, Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request gets a preview deployment

### 5.2 Deployment Workflow

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Vercel automatically:
   - Detects the push
   - Builds the project
   - Deploys to production

### 5.3 Preview Deployments

- Every pull request gets a unique preview URL
- Test changes before merging
- Preview deployments use the same environment variables as production (unless configured differently)

## Step 6: Troubleshooting

### Build Failures

**Issue**: Build fails with dependency errors
- **Solution**: Ensure `package.json` has all required dependencies
- Check build logs for specific error messages

**Issue**: Build fails with TypeScript errors
- **Solution**: Fix TypeScript errors locally first
- Run `npm run build` locally to catch errors

**Issue**: Build succeeds but app doesn't load
- **Solution**: 
  - Check browser console for errors
  - Verify environment variables are set correctly
  - Check Supabase CORS settings

### Runtime Errors

**Issue**: Supabase connection fails
- **Solution**: 
  - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
  - Check Supabase project is active
  - Verify CORS settings allow your Vercel domain

**Issue**: API calls fail
- **Solution**: 
  - Ensure Supabase Edge Functions are deployed
  - Check Edge Function environment variables
  - Verify function URLs in your code match deployed functions

### Performance Issues

**Issue**: Slow page loads
- **Solution**: 
  - Enable Vercel's Edge Network (automatic)
  - Optimize images and assets
  - Check bundle size with `npm run build -- --analyze`

## Step 7: Environment-Specific Configuration

### Using Different Supabase Projects

You can use different Supabase projects for different environments:

1. Create separate Supabase projects for:
   - Development
   - Staging/Preview
   - Production

2. In Vercel, set environment variables per environment:
   - Production: Production Supabase credentials
   - Preview: Staging Supabase credentials
   - Development: Development Supabase credentials

### Environment Variable Management

Best practices:
- Never commit `.env` files to GitHub
- Use Vercel's environment variable interface
- Use different values for different environments when needed
- Document required environment variables in your README

## Step 8: Additional Vercel Features

### 8.1 Analytics

Enable Vercel Analytics:
1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. View traffic and performance metrics

### 8.2 Speed Insights

Enable Speed Insights:
1. Go to Project Settings → Speed Insights
2. Enable Core Web Vitals tracking
3. Monitor real user performance

### 8.3 Preview Comments

Enable Preview Comments on Pull Requests:
1. Install Vercel GitHub App
2. Preview deployments automatically comment on PRs
3. Share preview URLs with team members

## Step 9: Security Best Practices

1. **Environment Variables**: Never expose sensitive keys in code
2. **Supabase Keys**: Use `anon` key for frontend, never expose `service_role` key
3. **CORS**: Restrict CORS to only your Vercel domains
4. **Rate Limiting**: Configure rate limiting in Supabase if needed
5. **HTTPS**: Vercel automatically provides HTTPS (required)

## Step 10: Monitoring and Maintenance

### 10.1 Deployment History

- View all deployments in Vercel dashboard
- Rollback to previous deployments if needed
- View build logs for each deployment

### 10.2 Error Tracking

- Monitor runtime errors in Vercel dashboard
- Set up error notifications
- Use browser console for debugging

### 10.3 Performance Monitoring

- Use Vercel Analytics for performance metrics
- Monitor Core Web Vitals
- Optimize based on real user data

## Quick Reference

### Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and connected
- [ ] Environment variables configured
- [ ] Build settings verified
- [ ] Initial deployment successful
- [ ] Supabase Edge Functions deployed
- [ ] CORS configured in Supabase
- [ ] Custom domain configured (if needed)
- [ ] Tested production deployment
- [ ] Team members have access

### Useful Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Preview build locally
npm run build && npx serve build

# Check build output
ls -la build/
```

### Important URLs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **GitHub Repository**: Your repository URL
- **Production URL**: `https://your-project.vercel.app`

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Vite Documentation**: https://vitejs.dev
- **Supabase Documentation**: https://supabase.com/docs

## Notes

- Vercel automatically handles:
  - HTTPS certificates
  - CDN distribution
  - Automatic scaling
  - Build caching
  - Preview deployments

- Your Supabase Edge Functions must be deployed separately to Supabase, not Vercel
- Environment variables prefixed with `VITE_` are exposed to the browser
- Never commit sensitive keys to your repository

