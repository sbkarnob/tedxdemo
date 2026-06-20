# TEDxUAP 2026 — Setup Guide

## Step 1: Supabase Database Setup

1. Go to [supabase.com](https://supabase.com) → your project
2. Click **SQL Editor** → **New Query**
3. Paste the contents of `supabase-setup.sql` and click **Run**

---

## Step 2: Create Admin User (Email Login)

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter:
   - Email: `tedx@uap-bd.edu` (or any email)
   - Password: (choose a strong password)
4. Click **Create User**

> ✅ This is the account you'll use to log into the Admin Panel

---

## Step 3: Configure `js/config.js`

Your config already has the correct Supabase URL and Key. No changes needed unless you create a new project.

```js
const CONFIG = {
  SUPABASE_URL: 'https://bylbwzucpdseufnlbbvt.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key-here',
  ...
};
```

---

## Step 4: Deploy to Vercel

### Option A: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option B: GitHub (Recommended)
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Framework: **Other** (static site)
5. Root directory: leave blank (or set to your folder)
6. Click **Deploy**

> `vercel.json` is already included — no extra config needed.

---

## Step 5: Update Supabase Auth Settings

After deploying to Vercel:

1. Go to **Supabase** → **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://your-project.vercel.app`
3. Add to **Redirect URLs**: `https://your-project.vercel.app/admin/reset-password`

This enables the "Forgot Password" email link to work correctly.

---

## Admin Panel Features

| Feature | URL |
|---------|-----|
| Login | `/admin/` |
| Dashboard | `/admin/dashboard.html` |
| Speakers | `/admin/speakers.html` |
| Organizers | `/admin/organizers.html` |
| Volunteers | `/admin/volunteers.html` |
| Sponsors | `/admin/sponsors.html` |
| Schedule | `/admin/schedule.html` |
| Messages | `/admin/messages.html` |
| Event Details | `/admin/event.html` |
| Settings | `/admin/settings.html` |
| Reset Password | `/admin/reset-password.html` |

---

## Login System (What Changed)

**Before:** Simple hardcoded password (`tedx2026`) stored in sessionStorage  
**After:** Full Supabase email + password authentication

- ✅ Email + password login
- ✅ "Forgot Password" → sends reset email
- ✅ Password reset page (`/admin/reset-password`)
- ✅ Session persists across page reloads
- ✅ Secure sign out clears Supabase session
