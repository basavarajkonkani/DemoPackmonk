# Netlify Deployment Setup - Packmonk

This guide explains how to deploy both the Admin Panel and Buyer App to Netlify.

## Overview

You have **two separate applications**:
- **Admin Web**: React + Vite app (in `admin-web/` folder)
- **Buyer App**: React Native / Expo web app (in root folder)

Both need to be deployed to **separate Netlify sites**.

## Deployment Steps

### 1. Deploy Admin Panel

#### Option A: Connect via GitHub (Recommended)

1. Go to [Netlify](https://netlify.com) and sign in
2. Click **"New site from Git"**
3. Select **GitHub** and authorize
4. Choose your repository: `basavarajkonkani/DemoPackmonk`
5. Configure build settings:
   - **Build command**: `cd admin-web && npm install && npm run build`
   - **Publish directory**: `admin-web/dist`
   - **Node version**: 20
6. Click **Deploy site**

**Your Admin URL will be**: `https://[site-name].netlify.app`

#### Option B: Manual Deploy (if git push fails)

```bash
cd admin-web
npm install
npm run build
# Then drag the 'dist' folder to Netlify's drop zone
```

---

### 2. Deploy Buyer App

#### Option A: Connect via GitHub

1. In Netlify, click **"New site from Git"** again
2. Select the same repository
3. Configure build settings:
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 20
   - **Base directory**: (leave empty)
4. Click **Deploy site**

**Your Buyer App URL will be**: `https://[buyer-site-name].netlify.app`

#### Option B: Manual Deploy

```bash
# In root directory
npm install
npm run build:web
# Then drag the 'dist' folder to Netlify's drop zone
```

---

### 3. Environment Variables Setup

For each site, set environment variables in Netlify UI:

**Admin Panel** (`Site settings → Environment`):
```
VITE_API_URL=https://your-backend-api.com
VITE_BUYER_APP_URL=https://[buyer-site-name].netlify.app
```

**Buyer App** (`Site settings → Environment`):
```
VITE_API_URL=https://your-backend-api.com
VITE_ADMIN_APP_URL=https://[admin-site-name].netlify.app
```

---

## Troubleshooting

### Build Fails: "Cannot find module"

**Solution**: Check `package.json` has all dependencies installed
```bash
npm install
npm run build
```

### SPA Routes Not Working (404 errors)

**Solution**: Netlify redirects are already configured in `netlify.toml`

### Both Sites Show Same App

**Solution**: Make sure each site is connected to the correct build directory:
- Admin: `admin-web/dist`
- Buyer: `dist`

---

## Local Development

Run both apps locally:

```bash
# Terminal 1 - Admin Panel
cd admin-web
npm run dev

# Terminal 2 - Buyer App (at http://localhost:5173 or http://localhost:3000)
npm run web
```

---

## Deployment Links Reference

After deployment, you'll have:

| App | URL | Build From |
|-----|-----|-----------|
| Admin Panel | `https://packmonk-admin.netlify.app` | `admin-web/dist` |
| Buyer App | `https://packmonk-buyer.netlify.app` | `dist` |

---

## Next Steps

1. Push this code to GitHub (main branch)
2. Create two Netlify sites as described above
3. Share both URLs with your team
4. Configure API endpoints if needed

For support: Check Netlify docs at https://docs.netlify.com/
