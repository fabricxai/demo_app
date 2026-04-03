# Supabase SMTP Configuration for fabricxai.com

This guide will help you configure custom SMTP settings in Supabase so that authentication emails (signup verification, password reset, etc.) are sent from your `@fabricxai.com` email domain.

## Overview

By default, Supabase sends emails from their own domain. By configuring custom SMTP, you can:
- Send emails from `noreply@fabricxai.com` or `support@fabricxai.com`
- Improve email deliverability
- Brand your authentication emails
- Use your own email infrastructure

## Prerequisites

Before configuring SMTP, you need:

1. **An SMTP server** - Options:
   - **Resend** (Recommended for developers - Free tier: 3,000 emails/month, excellent DX)
   - **SendGrid** (Free tier: 100 emails/day)
   - **Mailgun** (Free tier: 5,000 emails/month)
   - **Amazon SES** (Pay-as-you-go, very cheap)
   - **Postmark** (Paid, excellent deliverability)
   - **Your own email server** (if you have one)

2. **Email domain configured** - Your domain `fabricxai.com` should be verified with the SMTP provider

3. **SMTP credentials** - You'll need:
   - SMTP Host
   - SMTP Port
   - SMTP Username
   - SMTP Password
   - From Email Address

## Step 1: Choose an SMTP Provider

### Recommended: SendGrid (Easiest to Set Up)

**Why SendGrid?**
- Free tier: 100 emails/day (perfect for development)
- Easy setup
- Good deliverability
- Simple API

**Setup Steps:**
1. Go to https://sendgrid.com
2. Sign up for free account
3. Verify your domain `fabricxai.com`
4. Get SMTP credentials

### Alternative: Mailgun

**Why Mailgun?**
- Free tier: 5,000 emails/month
- Good for higher volume
- Easy domain verification

**Setup Steps:**
1. Go to https://www.mailgun.com
2. Sign up for free account
3. Add and verify domain `fabricxai.com`
4. Get SMTP credentials

## Step 2: Set Up Your SMTP Provider

### Option A: Resend Setup (Recommended for Developers)

**Why Resend?**
- Free tier: 3,000 emails/month
- Excellent developer experience
- Modern API and dashboard
- Great deliverability
- Easy domain verification
- Built for developers

**Setup Steps:**

1. **Create Resend Account**
   - Go to https://resend.com
   - Sign up (free tier: 3,000 emails/month)
   - Complete email verification

2. **Add and Verify Domain**
   - Go to Domains → Add Domain
   - Enter: `fabricxai.com`
   - Add DNS records (SPF, DKIM, DMARC) to your domain
   - Wait for verification (usually takes a few minutes)

3. **Get SMTP Credentials**
   - Go to Settings → SMTP
   - Or go to API Keys → Create API Key
   - Copy your API key (you'll use this as SMTP password)

4. **Get SMTP Settings**
   - Host: `smtp.resend.com`
   - Port: `587` (TLS) or `465` (SSL)
   - Username: `resend` (literally the word "resend")
   - Password: Your Resend API key
   - From Email: `noreply@fabricxai.com` or `support@fabricxai.com`

**Resend SMTP Configuration:**
```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Password: [Your Resend API Key]
From Email: noreply@fabricxai.com
From Name: FabricXAI
```

### Option B: SendGrid Setup

1. **Create SendGrid Account**
   - Go to https://sendgrid.com
   - Sign up (free tier available)
   - Complete email verification

2. **Verify Your Domain**
   - Go to Settings → Sender Authentication
   - Click "Authenticate Your Domain"
   - Select "fabricxai.com"
   - Add DNS records (TXT, CNAME) to your domain
   - Wait for verification (can take up to 48 hours)

3. **Create API Key for SMTP**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name it: "Supabase SMTP"
   - Select "Full Access" or "Mail Send" permissions
   - Copy the API key (you'll use this as SMTP password)

4. **Get SMTP Settings**
   - Host: `smtp.sendgrid.net`
   - Port: `587` (TLS) or `465` (SSL)
   - Username: `apikey` (literally the word "apikey")
   - Password: Your SendGrid API key
   - From Email: `noreply@fabricxai.com` or `support@fabricxai.com`

### Option B: Mailgun Setup

1. **Create Mailgun Account**
   - Go to https://www.mailgun.com
   - Sign up (free tier: 5,000 emails/month)

2. **Add Domain**
   - Go to Sending → Domains
   - Click "Add New Domain"
   - Enter: `fabricxai.com`
   - Add DNS records (TXT, CNAME, MX)
   - Wait for verification

3. **Get SMTP Settings**
   - Go to Sending → Domain Settings → SMTP credentials
   - Host: `smtp.mailgun.org`
   - Port: `587` (TLS) or `465` (SSL)
   - Username: Your Mailgun SMTP username
   - Password: Your Mailgun SMTP password
   - From Email: `noreply@fabricxai.com`

### Option C: Amazon SES Setup

1. **Create AWS Account**
   - Go to https://aws.amazon.com/ses
   - Sign up for AWS account

2. **Verify Domain**
   - Go to SES Console → Verified identities
   - Click "Create identity"
   - Select "Domain"
   - Enter: `fabricxai.com`
   - Add DNS records
   - Wait for verification

3. **Get SMTP Settings**
   - Go to SES Console → SMTP settings
   - Click "Create SMTP credentials"
   - Host: `email-smtp.REGION.amazonaws.com` (e.g., `email-smtp.us-east-1.amazonaws.com`)
   - Port: `587` (TLS) or `465` (SSL)
   - Username: Your SES SMTP username
   - Password: Your SES SMTP password
   - From Email: `noreply@fabricxai.com`

## Step 3: Configure SMTP in Supabase

### Navigation Path

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/elznbletkunibhicbizb
2. Click **"Authentication"** in left sidebar
3. Click **"Settings"** (or look for "Email" or "SMTP Settings")
4. Scroll to **"SMTP Settings"** section

### SMTP Configuration Fields

Fill in the following fields:

#### For Resend:
```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Password: [Your Resend API Key]
Sender Email: noreply@fabricxai.com
Sender Name: FabricXAI
Enable SMTP: Toggle ON
```

#### For SendGrid:
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [Your SendGrid API Key]
Sender Email: noreply@fabricxai.com
Sender Name: FabricXAI
Enable SMTP: Toggle ON
```

#### For Mailgun:
```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP User: [Your Mailgun SMTP Username]
SMTP Password: [Your Mailgun SMTP Password]
Sender Email: noreply@fabricxai.com
Sender Name: FabricXAI
Enable SMTP: Toggle ON
```

#### For Amazon SES:
```
SMTP Host: email-smtp.us-east-1.amazonaws.com (or your region)
SMTP Port: 587
SMTP User: [Your SES SMTP Username]
SMTP Password: [Your SES SMTP Password]
Sender Email: noreply@fabricxai.com
Sender Name: FabricXAI
Enable SMTP: Toggle ON
```

### Step-by-Step Configuration

1. **Enable Custom SMTP**
   - Find "SMTP Settings" section
   - Toggle "Enable Custom SMTP" to ON

2. **Enter SMTP Host**
   - Enter your SMTP host (e.g., `smtp.sendgrid.net`)

3. **Enter SMTP Port**
   - Use `587` for TLS (recommended)
   - Or `465` for SSL

4. **Enter SMTP Username**
   - For SendGrid: `apikey`
   - For others: Your provider's SMTP username

5. **Enter SMTP Password**
   - Your SMTP provider's password/API key

6. **Enter Sender Email**
   - `noreply@fabricxai.com` (must be from your verified domain)
   - Or `support@fabricxai.com`
   - Or `hello@fabricxai.com`

7. **Enter Sender Name**
   - `FabricXAI` or `FabricXAI Platform`

8. **Test Connection**
   - Click "Test SMTP Connection" or "Send Test Email"
   - Check your email inbox for test email

9. **Save Settings**
   - Click "Save" or "Update"

## Step 4: Customize Email Templates

After SMTP is configured, customize your email templates:

1. Go to **Authentication → Email Templates**
2. Click on each template to customize:

### Confirm Signup Template

**Subject:**
```
Verify your FabricXAI account
```

**Body (HTML):**
```html
<h2>Welcome to FabricXAI!</h2>
<p>Thank you for signing up for FabricXAI Garments Intelligent Platform.</p>
<p>Please verify your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Verify Email Address</a></p>
<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't create an account, please ignore this email.</p>
<p>Best regards,<br>The FabricXAI Team</p>
```

### Reset Password Template

**Subject:**
```
Reset your FabricXAI password
```

**Body (HTML):**
```html
<h2>Password Reset Request</h2>
<p>You requested to reset your password for your FabricXAI account.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request a password reset, please ignore this email.</p>
<p>Best regards,<br>The FabricXAI Team</p>
```

## Step 5: Test Your Configuration

### Test Email Verification

1. Go to your app: https://platform.fabricxai.com
2. Try to sign up with a test email
3. Check your email inbox
4. Verify the email is from `noreply@fabricxai.com`
5. Click the verification link
6. Confirm it works

### Test Password Reset

1. Go to login page
2. Click "Forgot password?"
3. Enter your email
4. Check your email inbox
5. Verify the email is from `noreply@fabricxai.com`
6. Click the reset link
7. Confirm it works

## Common SMTP Providers Quick Reference

### Resend (Recommended)
- **Host:** `smtp.resend.com`
- **Port:** `587` (TLS) or `465` (SSL)
- **Username:** `resend`
- **Password:** Your Resend API Key
- **Free Tier:** 3,000 emails/month
- **Website:** https://resend.com
- **Best For:** Developers, modern apps, great DX

### SendGrid
- **Host:** `smtp.sendgrid.net`
- **Port:** `587` (TLS) or `465` (SSL)
- **Username:** `apikey`
- **Password:** Your SendGrid API Key
- **Free Tier:** 100 emails/day
- **Website:** https://sendgrid.com

### Mailgun
- **Host:** `smtp.mailgun.org`
- **Port:** `587` (TLS) or `465` (SSL)
- **Username:** Your Mailgun SMTP username
- **Password:** Your Mailgun SMTP password
- **Free Tier:** 5,000 emails/month
- **Website:** https://www.mailgun.com

### Amazon SES
- **Host:** `email-smtp.REGION.amazonaws.com`
- **Port:** `587` (TLS) or `465` (SSL)
- **Username:** Your SES SMTP username
- **Password:** Your SES SMTP password
- **Pricing:** $0.10 per 1,000 emails
- **Website:** https://aws.amazon.com/ses

### Postmark
- **Host:** `smtp.postmarkapp.com`
- **Port:** `587` (TLS)
- **Username:** Your Postmark Server API Token
- **Password:** Your Postmark Server API Token
- **Pricing:** Paid (excellent deliverability)
- **Website:** https://postmarkapp.com

## Troubleshooting

### Issue: "SMTP connection failed"

**Solutions:**
- ✅ Verify SMTP credentials are correct
- ✅ Check if port 587 is not blocked by firewall
- ✅ Try port 465 (SSL) instead of 587 (TLS)
- ✅ Verify domain is verified with SMTP provider
- ✅ Check SMTP provider's status page

### Issue: "Emails not being delivered"

**Solutions:**
- ✅ Check spam folder
- ✅ Verify domain DNS records are correct
- ✅ Check SMTP provider's sending logs
- ✅ Verify sender email is from verified domain
- ✅ Check if you've exceeded free tier limits

### Issue: "Test email works but real emails don't"

**Solutions:**
- ✅ Check if domain is fully verified (not just pending)
- ✅ Verify SPF, DKIM, and DMARC records
- ✅ Check SMTP provider's sending limits
- ✅ Review SMTP provider's logs for errors

## DNS Records Required

For most SMTP providers, you'll need to add these DNS records to `fabricxai.com`:

### SendGrid:
- **TXT Record:** For domain verification
- **CNAME Records:** For tracking and authentication

### Mailgun:
- **TXT Record:** For domain verification
- **CNAME Records:** For tracking
- **MX Records:** For receiving emails (optional)

### Amazon SES:
- **TXT Record:** For domain verification
- **CNAME Records:** For DKIM authentication

## Security Best Practices

1. **Use Strong SMTP Passwords**: Use API keys, not regular passwords
2. **Rotate Credentials**: Change SMTP passwords periodically
3. **Monitor Usage**: Check SMTP provider dashboard for unusual activity
4. **Use TLS**: Always use port 587 (TLS) or 465 (SSL), never plain text
5. **Verify Domain**: Always verify your domain with SMTP provider

## Cost Considerations

### Free Options:
- **SendGrid:** 100 emails/day (free forever)
- **Mailgun:** 5,000 emails/month (free for 3 months, then paid)

### Paid Options:
- **Amazon SES:** ~$0.10 per 1,000 emails (very cheap)
- **Postmark:** $15/month for 10,000 emails (best deliverability)

### Recommendation:
- **Start with Resend** (free 3,000/month, best developer experience)
- **Use SendGrid** if you need more free emails (100/day)
- **Upgrade to Amazon SES** if you need very high volume (very cheap)
- **Use Postmark** if deliverability is critical (paid but excellent)

## Next Steps After Configuration

1. ✅ Test email verification flow
2. ✅ Test password reset flow
3. ✅ Customize email templates with your branding
4. ✅ Monitor email delivery rates
5. ✅ Set up email analytics (if available)

## Support

If you encounter issues:
1. Check Supabase Dashboard → Authentication → Logs
2. Check your SMTP provider's dashboard for sending logs
3. Verify DNS records are correct
4. Test SMTP connection in Supabase dashboard
5. Contact your SMTP provider's support if needed

