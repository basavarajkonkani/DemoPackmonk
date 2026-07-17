# Deployment Links - Packmonk

## Current Setup (Before Deployment)

### Local Development
- **Admin Panel**: http://localhost:5173
- **Buyer App**: http://localhost:5173 or http://localhost:19000 (Expo)

---

## After Netlify Deployment

### Production URLs (Update as needed)

**Admin Panel Site**
- GitHub: https://github.com/basavarajkonkani/DemoPackmonk
- Deploy from: `admin-web/` folder
- Build command: `cd admin-web && npm install && npm run build`
- Publish directory: `admin-web/dist`
- URL: `https://packmonk-admin.netlify.app` (or your custom domain)

**Buyer App Site**
- GitHub: https://github.com/basavarajkonkani/DemoPackmonk
- Deploy from: root folder
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- URL: `https://packmonk-buyer.netlify.app` (or your custom domain)

---

## How They Work Together

1. **Admin Panel** (`admin-web/` folder)
   - Dashboard, orders, customers, inventory management
   - Manages products and pricing
   - View analytics

2. **Buyer App** (root folder)
   - Customer-facing shopping interface
   - Browse products, add to cart, checkout
   - User authentication

3. **Shared Backend**
   - Both apps connect to the same API
   - Configured via environment variables

---

## Step-by-Step Deployment Instructions

### Prerequisites
- GitHub account (already linked)
- Netlify account (free at netlify.com)
- Code pushed to GitHub

### Deploy Admin Panel

1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Select GitHub → basavarajkonkani/DemoPackmonk
4. Set these build settings:
   - **Build command**: `cd admin-web && npm install && npm run build`
   - **Publish directory**: `admin-web/dist`
5. Click "Deploy"
6. Wait for build to complete
7. Your admin URL: `https://[auto-generated-name].netlify.app`

### Deploy Buyer App

1. Click "New site from Git" again in Netlify
2. Select the same repository
3. Set these build settings:
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
4. Click "Deploy"
5. Wait for build to complete
6. Your buyer URL: `https://[auto-generated-name].netlify.app`

---

## Verification Checklist

- [ ] Admin panel deploys successfully
- [ ] Buyer app deploys successfully
- [ ] Admin panel routes work (no 404 errors)
- [ ] Buyer app routes work (no 404 errors)
- [ ] Both apps can make API calls
- [ ] Mobile responsiveness looks good
- [ ] Admin can access all features
- [ ] Buyer can browse and add items to cart

---

## Troubleshooting

**Q: Build fails with "Cannot find module"**
A: Check package.json dependencies, run `npm install` locally first

**Q: Getting 404 on page refresh**
A: SPA redirects should be automatic, verify netlify.toml is correct

**Q: Admin and buyer showing same content**
A: Ensure each Netlify site points to different build directories

**Q: Environment variables not working**
A: Set them in Netlify Site Settings → Environment

---

Keep this file updated with your actual deployment URLs once live!
