# Your Supabase Configuration for platform.fabricxai.com

## Quick Setup Guide

### Step 1: Go to Supabase Dashboard

1. Navigate to: https://supabase.com/dashboard/project/elznbletkunibhicbizb/auth/url-configuration
2. Or go to: Authentication → Settings (or URL Configuration)

### Step 2: Set Site URL

**Enter this exactly:**
```
https://platform.fabricxai.com
```

### Step 3: Add Redirect URLs

**Add these URLs one by one (click "Add URL" for each):**

1. `https://platform.fabricxai.com/auth/callback`
2. `https://platform.fabricxai.com/**`
3. `https://YOUR-VERCEL-PROJECT.vercel.app/auth/callback` *(replace with your actual Vercel project name)*
4. `https://YOUR-VERCEL-PROJECT.vercel.app/**` *(replace with your actual Vercel project name)*
5. `https://*.vercel.app/auth/callback`
6. `http://localhost:3000/auth/callback` *(for local development)*
7. `http://localhost:3000/**` *(for local development)*

**Important:** 
- Click "Save" after adding each URL
- Replace `YOUR-VERCEL-PROJECT` with your actual Vercel project name
- You can find your Vercel project name in Vercel Dashboard → Your Project → Settings → General

## Complete Configuration Summary

### Site URL:
```
https://platform.fabricxai.com
```

### Redirect URLs (Minimum Required):
```
https://platform.fabricxai.com/auth/callback
https://platform.fabricxai.com/**
https://*.vercel.app/auth/callback
```

### Redirect URLs (Recommended - Full List):
```
https://platform.fabricxai.com/auth/callback
https://platform.fabricxai.com/**
https://YOUR-VERCEL-PROJECT.vercel.app/auth/callback
https://YOUR-VERCEL-PROJECT.vercel.app/**
https://*.vercel.app/auth/callback
http://localhost:3000/auth/callback
http://localhost:3000/**
```

## How to Find Your Vercel Project Name

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Look at the URL or project settings
4. It will be something like: `fabricxai-garments-intelligent-platform` or similar
5. Your full Vercel domain will be: `https://YOUR-PROJECT-NAME.vercel.app`

## Testing After Configuration

1. **Test Custom Domain:**
   - Go to: https://platform.fabricxai.com
   - Try signing up
   - Check if email verification redirect works

2. **Test Vercel Domain:**
   - Go to your Vercel project URL
   - Try signing up
   - Should also work (for preview deployments)

3. **Test Local Development:**
   - Run: `npm run dev`
   - Go to: http://localhost:3000
   - Try signing up
   - Should work for local testing

## Common Issues

### "Redirect URL mismatch" error

**Check:**
- ✅ Site URL is exactly: `https://platform.fabricxai.com` (no trailing slash)
- ✅ Redirect URLs include: `https://platform.fabricxai.com/auth/callback`
- ✅ All URLs use `https://` (not `http://`) for production
- ✅ No typos in the domain name

### Authentication works on Vercel but not custom domain

**Check:**
- ✅ DNS is properly configured in Vercel
- ✅ SSL certificate is active (should be automatic in Vercel)
- ✅ Custom domain URLs are added to Redirect URLs in Supabase

## Quick Copy-Paste URLs

Copy these directly into Supabase:

**Site URL:**
```
https://platform.fabricxai.com
```

**Redirect URLs (copy one at a time):**
```
https://platform.fabricxai.com/auth/callback
https://platform.fabricxai.com/**
https://*.vercel.app/auth/callback
```

*(Add your specific Vercel domain URLs after checking your Vercel dashboard)*

## Need Help?

If you encounter issues:
1. Check Supabase Dashboard → Authentication → Logs for errors
2. Check browser console for authentication errors
3. Verify DNS configuration in Vercel Dashboard → Your Project → Settings → Domains

