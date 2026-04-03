# Supabase Configuration for Custom Domain in Vercel

## Overview

When you have a custom domain configured in Vercel, you need to configure Supabase to recognize both your custom domain and your Vercel domain for authentication redirects.

## Your Configuration

You have:
- **Custom Domain**: `https://platform.fabricxai.com`
- **Vercel Domain**: `https://your-project.vercel.app` (check your Vercel dashboard for exact name)

## Configuration Steps

### 1. Site URL in Supabase

**Set to your custom domain:**

```
https://platform.fabricxai.com
```

**Why?** This is your primary production domain, so it should be the Site URL.

### 2. Redirect URLs in Supabase

**Add ALL of these URLs:**

#### Custom Domain URLs (Required):
```
https://platform.fabricxai.com/auth/callback
https://platform.fabricxai.com/**
```

#### Vercel Domain URLs (Required for preview deployments):
```
https://your-project.vercel.app/auth/callback
https://your-project.vercel.app/**
https://*.vercel.app/auth/callback
```
*(Replace `your-project` with your actual Vercel project name)*

#### Development URL (Optional but recommended):
```
http://localhost:3000/auth/callback
http://localhost:3000/**
```

## Your Complete Configuration

### Site URL:
```
https://platform.fabricxai.com
```

### Redirect URLs (add all):
```
https://platform.fabricxai.com/auth/callback
https://platform.fabricxai.com/**
https://your-project.vercel.app/auth/callback
https://your-project.vercel.app/**
https://*.vercel.app/auth/callback
http://localhost:3000/auth/callback
http://localhost:3000/**
```

**Note:** Replace `your-project` with your actual Vercel project name (you can find it in your Vercel dashboard).

## Why Both Domains?

1. **Custom Domain**: Your main production site
2. **Vercel Domain**: 
   - Preview deployments (PR previews)
   - Fallback if custom domain has issues
   - Testing before DNS propagation

## Multiple Custom Domains

If you have multiple custom domains (e.g., `app.fabricxai.com` and `www.fabricxai.com`):

### Site URL:
Use your primary domain:
```
https://app.fabricxai.com
```

### Redirect URLs:
Add all domains:
```
https://app.fabricxai.com/auth/callback
https://app.fabricxai.com/**
https://www.fabricxai.com/auth/callback
https://www.fabricxai.com/**
https://fabricxai-platform.vercel.app/auth/callback
https://fabricxai-platform.vercel.app/**
https://*.vercel.app/auth/callback
```

## Step-by-Step Instructions

1. **Go to Supabase Dashboard**
   - Navigate to: Authentication → Settings (or URL Configuration)

2. **Set Site URL**
   - Enter: `https://platform.fabricxai.com`
   - Click "Save"

3. **Add Redirect URLs**
   - Click "Add URL" button
   - Add each URL one by one:
     - `https://platform.fabricxai.com/auth/callback`
     - `https://platform.fabricxai.com/**`
     - `https://your-project.vercel.app/auth/callback` (replace with your actual Vercel domain)
     - `https://your-project.vercel.app/**` (replace with your actual Vercel domain)
     - `https://*.vercel.app/auth/callback`
   - Click "Save" after each addition

4. **Verify**
   - Make sure all URLs are listed
   - Test authentication from both domains

## Testing

### Test Custom Domain:
1. Go to `https://your-custom-domain.com`
2. Try to sign up or log in
3. Check if redirect works after email verification

### Test Vercel Domain:
1. Go to `https://your-project.vercel.app`
2. Try to sign up or log in
3. Should also work (for preview deployments)

## Common Issues

### Issue: "Redirect URL mismatch" error

**Solution:**
- Make sure the exact URL is in the Redirect URLs list
- Check for trailing slashes (should match exactly)
- Verify `https://` vs `http://` (production must use `https://`)

### Issue: Works on Vercel domain but not custom domain

**Solution:**
- Verify custom domain URLs are added to Redirect URLs
- Check DNS configuration in Vercel
- Ensure SSL certificate is active for custom domain

### Issue: Preview deployments don't work

**Solution:**
- Add `https://*.vercel.app/auth/callback` to Redirect URLs
- This wildcard covers all preview deployment URLs

## Security Notes

✅ **HTTPS Required**: All production URLs must use `https://`  
✅ **Wildcard Support**: `**` allows all paths under the domain  
✅ **No Trailing Slash**: Don't add trailing slashes to callback URLs  
✅ **Exact Match**: URLs must match exactly (case-sensitive for domain)  

## Quick Reference

| Environment | Site URL | Redirect URLs |
|------------|----------|--------------|
| **Development** | `http://localhost:3000` | `http://localhost:3000/auth/callback`<br>`http://localhost:3000/**` |
| **Production (Custom Domain)** | `https://app.fabricxai.com` | `https://app.fabricxai.com/auth/callback`<br>`https://app.fabricxai.com/**`<br>`https://project.vercel.app/auth/callback`<br>`https://project.vercel.app/**`<br>`https://*.vercel.app/auth/callback` |
| **Production (Vercel Only)** | `https://project.vercel.app` | `https://project.vercel.app/auth/callback`<br>`https://project.vercel.app/**`<br>`https://*.vercel.app/auth/callback` |

## After Configuration

1. **Test Signup**: Create a new account and verify email
2. **Test Login**: Log in with existing account
3. **Test Password Reset**: Request password reset
4. **Test Both Domains**: Verify both custom and Vercel domains work

## Need Help?

If authentication still doesn't work:
1. Check browser console for errors
2. Check Supabase Dashboard → Authentication → Logs
3. Verify DNS is properly configured in Vercel
4. Ensure SSL certificate is active

