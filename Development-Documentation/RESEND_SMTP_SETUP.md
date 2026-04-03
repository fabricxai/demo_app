# Resend SMTP Setup for fabricxai.com

## Why Resend?

✅ **Free Tier:** 3,000 emails/month (perfect for most apps)  
✅ **Developer-Friendly:** Modern API, great documentation  
✅ **Easy Setup:** Simple domain verification  
✅ **Great Deliverability:** Excellent inbox placement  
✅ **Beautiful Dashboard:** Clean, intuitive interface  

## Step-by-Step Setup

### Step 1: Create Resend Account

1. Go to https://resend.com
2. Click **"Sign Up"** (top right)
3. Sign up with your email
4. Verify your email address

### Step 2: Add and Verify Domain

1. **Go to Domains**
   - In Resend dashboard, click **"Domains"** in left sidebar
   - Click **"Add Domain"** button

2. **Enter Your Domain**
   - Enter: `fabricxai.com`
   - Click **"Add"**

3. **Add DNS Records**
   - Resend will show you DNS records to add
   - You need to add these to your domain's DNS:
     - **SPF Record** (TXT)
     - **DKIM Records** (CNAME)
     - **DMARC Record** (TXT) - Optional but recommended

4. **Add Records to Your Domain**
   - Go to your domain registrar (where you bought fabricxai.com)
   - Or your DNS provider (Cloudflare, Route53, etc.)
   - Add the DNS records Resend provides
   - Wait for DNS propagation (usually 5-15 minutes)

5. **Verify Domain**
   - Go back to Resend dashboard
   - Click **"Verify"** on your domain
   - Wait for verification (green checkmark)

### Step 3: Get SMTP Credentials

1. **Get API Key**
   - Go to **"API Keys"** in left sidebar
   - Click **"Create API Key"**
   - Name it: "Supabase SMTP"
   - Copy the API key (you'll use this as SMTP password)

2. **SMTP Settings**
   - Host: `smtp.resend.com`
   - Port: `587` (TLS - recommended) or `465` (SSL)
   - Username: `resend` (literally the word "resend")
   - Password: Your Resend API key (from step above)

### Step 4: Configure in Supabase

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/elznbletkunibhicbizb
   - Click **"Authentication"** → **"Settings"**
   - Scroll to **"SMTP Settings"** section

2. **Enable Custom SMTP**
   - Toggle **"Enable Custom SMTP"** to ON

3. **Enter SMTP Details**
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 587
   SMTP User: resend
   SMTP Password: [Paste your Resend API Key here]
   Sender Email: noreply@fabricxai.com
   Sender Name: FabricXAI
   ```

4. **Test Connection**
   - Click **"Test SMTP Connection"** or **"Send Test Email"**
   - Check your email inbox
   - You should receive a test email from `noreply@fabricxai.com`

5. **Save Settings**
   - Click **"Save"** or **"Update"**

## Complete Resend Configuration

### In Resend Dashboard:
- **Domain:** `fabricxai.com` (verified)
- **API Key:** Created and copied

### In Supabase Dashboard:
```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Password: [Your Resend API Key]
Sender Email: noreply@fabricxai.com
Sender Name: FabricXAI
Enable SMTP: ✅ ON
```

## DNS Records Example

When you add your domain to Resend, you'll get DNS records like these:

### SPF Record (TXT):
```
Name: @ (or fabricxai.com)
Value: v=spf1 include:resend.com ~all
TTL: 3600
```

### DKIM Records (CNAME):
```
Name: resend._domainkey
Value: [Resend-provided value]
TTL: 3600
```

### DMARC Record (TXT) - Optional:
```
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@fabricxai.com
TTL: 3600
```

**Note:** Resend will provide exact values - use those, not the examples above.

## Testing

### Test 1: SMTP Connection Test
1. In Supabase, click "Test SMTP Connection"
2. Should show "Connection successful"
3. Check your email for test message

### Test 2: Signup Flow
1. Go to https://platform.fabricxai.com
2. Sign up with a test email
3. Check email inbox
4. Email should be from `noreply@fabricxai.com`
5. Click verification link
6. Should work correctly

### Test 3: Password Reset
1. Go to login page
2. Click "Forgot password?"
3. Enter email
4. Check email inbox
5. Email should be from `noreply@fabricxai.com`
6. Click reset link
7. Should work correctly

## Resend Dashboard Features

After setup, you can:
- **View Email Logs:** See all sent emails
- **Monitor Deliverability:** Check delivery rates
- **View Analytics:** Open rates, click rates (if tracking enabled)
- **Manage API Keys:** Create/revoke keys
- **Domain Settings:** Manage DNS records

## Pricing

### Free Tier:
- **3,000 emails/month** (free forever)
- Perfect for development and small apps

### Paid Plans:
- **Pro:** $20/month for 50,000 emails
- **Business:** Custom pricing for high volume

## Troubleshooting

### Issue: "Domain verification failed"

**Solutions:**
- ✅ Check DNS records are added correctly
- ✅ Wait 15-30 minutes for DNS propagation
- ✅ Verify records match exactly (no typos)
- ✅ Check TTL values are reasonable (3600 is good)

### Issue: "SMTP authentication failed"

**Solutions:**
- ✅ Verify username is exactly `resend` (lowercase)
- ✅ Check API key is correct (no extra spaces)
- ✅ Ensure API key has sending permissions
- ✅ Try regenerating API key if needed

### Issue: "Emails not being delivered"

**Solutions:**
- ✅ Check Resend dashboard → Logs for errors
- ✅ Verify domain is fully verified (not pending)
- ✅ Check spam folder
- ✅ Verify sender email is from verified domain
- ✅ Check if you've exceeded free tier (3,000/month)

## Advantages of Resend

✅ **Modern API:** RESTful API, great documentation  
✅ **Developer Experience:** Clean dashboard, easy to use  
✅ **Reliability:** Excellent uptime and deliverability  
✅ **Transparency:** Clear logging and analytics  
✅ **Support:** Good documentation and support  

## Next Steps

1. ✅ Set up Resend account
2. ✅ Verify `fabricxai.com` domain
3. ✅ Get API key
4. ✅ Configure in Supabase
5. ✅ Test email sending
6. ✅ Customize email templates in Supabase

## Support

- **Resend Docs:** https://resend.com/docs
- **Resend Dashboard:** https://resend.com/emails (view logs)
- **Resend Support:** Available in dashboard

## Quick Reference

**Resend SMTP Settings:**
```
Host: smtp.resend.com
Port: 587
User: resend
Password: [Your API Key]
From: noreply@fabricxai.com
```

**Direct Links:**
- Resend Dashboard: https://resend.com/emails
- Add Domain: https://resend.com/domains
- API Keys: https://resend.com/api-keys

