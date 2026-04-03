# Supabase Dashboard Setup Guide

This guide will help you find and configure the authentication settings in your Supabase Dashboard.

## Step 1: Access Your Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Sign In"** (top right)
3. Sign in with your account
4. Select your project from the dashboard

## Step 2: Navigate to Authentication Settings

### Option A: Using the Sidebar Menu

1. In your project dashboard, look at the **left sidebar**
2. Click on **"Authentication"** (it has a key icon 🔑)
3. You'll see several sub-sections:
   - Users
   - Policies
   - Providers
   - **Settings** ← Click this
   - Email Templates
   - URL Configuration

### Option B: Direct URL

If you know your project reference ID, you can go directly to:
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/url-configuration
```

Replace `YOUR_PROJECT_ID` with your actual project ID (e.g., `elznbletkunibhicbizb`)

## Step 3: Configure Site URL and Redirect URLs

Once you're in **Authentication → Settings** (or **URL Configuration**):

### Site URL

1. Find the **"Site URL"** field
2. Set it based on your environment:

   **For Development:**
   ```
   http://localhost:3000
   ```

   **For Production with Custom Domain:**
   ```
   https://your-custom-domain.com
   ```
   Example: `https://app.fabricxai.com` or `https://fabricxai.com`

   **For Production without Custom Domain (Vercel default):**
   ```
   https://your-project.vercel.app
   ```

   **Important:** If you have a custom domain, use the custom domain as the Site URL, not the Vercel domain.

### Redirect URLs

1. Scroll down to **"Redirect URLs"** section
2. Click **"Add URL"** or the **"+"** button
3. Add these URLs (one at a time):

   **For Development:**
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```

   **For Production with Custom Domain:**
   
   Add your custom domain URLs:
   ```
   https://your-custom-domain.com/auth/callback
   https://your-custom-domain.com/**
   ```
   Example: `https://app.fabricxai.com/auth/callback` and `https://app.fabricxai.com/**`

   **Also add Vercel domain** (for preview deployments and fallback):
   ```
   https://your-project.vercel.app/auth/callback
   https://your-project.vercel.app/**
   https://*.vercel.app/auth/callback
   ```

   **For Production without Custom Domain:**
   ```
   https://your-project.vercel.app/auth/callback
   https://your-project.vercel.app/**
   https://*.vercel.app/auth/callback
   ```

   **Note:** 
   - The `**` wildcard allows all paths under that domain
   - If you have a custom domain, add BOTH custom domain AND Vercel domain URLs
   - This ensures preview deployments (PR previews) also work

4. Click **"Save"** after adding each URL

## Step 4: Configure SMTP Settings (Optional but Recommended)

To send emails from your own domain (e.g., `noreply@fabricxai.com`), configure custom SMTP:

1. In **Authentication → Settings**, scroll to **"SMTP Settings"** section
2. Toggle **"Enable Custom SMTP"** to ON
3. Enter your SMTP provider details:
   - **SMTP Host** (e.g., `smtp.sendgrid.net`)
   - **SMTP Port** (usually `587` for TLS)
   - **SMTP Username** and **Password**
   - **Sender Email** (e.g., `noreply@fabricxai.com`)
   - **Sender Name** (e.g., `FabricXAI`)
4. Click **"Test SMTP Connection"** to verify
5. Click **"Save"**

**See `SUPABASE_SMTP_CONFIGURATION.md` for detailed SMTP setup guide.**

## Step 5: Configure Email Templates

1. In the left sidebar under **Authentication**, click **"Email Templates"**
2. You'll see several templates:
   - **Confirm signup** - Email sent when user signs up
   - **Magic Link** - For passwordless login
   - **Change Email Address** - When user changes email
   - **Reset Password** - Password reset email
   - **Invite user** - When inviting team members

3. Click on **"Confirm signup"** to customize the verification email
4. You can customize:
   - Subject line
   - Email body (HTML)
   - Use variables like `{{ .ConfirmationURL }}`, `{{ .Email }}`, etc.

5. Click **"Save"** when done

## Step 5: Email Settings (Optional)

1. Still in **Authentication**, click **"Settings"**
2. Scroll to **"Email Auth"** section
3. Configure:
   - **Enable email confirmations**: Toggle ON/OFF
     - If ON: Users must verify email before login
     - If OFF: Users can login immediately after signup
   - **Secure email change**: Toggle ON/OFF
   - **Double confirm email changes**: Toggle ON/OFF

## Visual Guide

### Navigation Path:

```
Supabase Dashboard
└── Your Project
    └── Authentication (left sidebar)
        ├── Users
        ├── Policies
        ├── Providers
        ├── Settings ← Site URL & Redirect URLs here
        ├── Email Templates ← Customize emails here
        └── URL Configuration (sometimes shown separately)
```

## Quick Reference: Settings Locations

| Setting | Location | Path |
|---------|----------|------|
| Site URL | Authentication → Settings | Scroll to "Site URL" section |
| Redirect URLs | Authentication → Settings | Scroll to "Redirect URLs" section |
| Email Templates | Authentication → Email Templates | Click template to edit |
| Email Confirmation | Authentication → Settings | "Email Auth" section |

## Common Issues

### "I don't see Authentication in the sidebar"

- Make sure you're in the correct project
- Check if you have the right permissions (you need to be a project owner or have admin access)
- Try refreshing the page

### "I can't find Settings under Authentication"

- Some Supabase versions show it as **"URL Configuration"** instead
- Look for **"Configuration"** or **"Auth Settings"**
- It might be under **"Providers"** → **"Email"** → **"Settings"**

### "Redirect URL not working"

- Make sure the URL exactly matches (including `http://` vs `https://`)
- Check for trailing slashes
- For localhost, use `http://localhost:3000` (not `https://`)
- For production, use `https://` (not `http://`)

## Alternative: Using Supabase CLI

If you prefer command line, you can also configure these via Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# The settings are managed through the dashboard, but you can view them via CLI
supabase projects list
```

## Screenshot Locations (What to Look For)

1. **Site URL Field**: Usually at the top of the Settings page, labeled "Site URL"
2. **Redirect URLs**: Below Site URL, with an "Add URL" button
3. **Email Templates**: Separate page with a list of templates on the left, editor on the right

## Still Can't Find It?

If you're still having trouble:

1. **Check your Supabase version**: Newer versions might have different UI
2. **Try the search**: Use Ctrl+F (Cmd+F on Mac) to search for "Site URL" or "Redirect"
3. **Check the URL**: The settings might be at:
   - `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/url-configuration`
   - `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/settings`

4. **Contact Support**: If you have a specific Supabase plan, you can contact their support

## For Your Specific Project

Based on your project ID (`elznbletkunibhicbizb`), your direct links would be:

- **Settings**: https://supabase.com/dashboard/project/elznbletkunibhicbizb/auth/url-configuration
- **Email Templates**: https://supabase.com/dashboard/project/elznbletkunibhicbizb/auth/templates

**Note**: You need to be logged in and have access to this project for these links to work.

