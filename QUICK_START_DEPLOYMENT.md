# Quick Start: Deploy to Netlify in 5 Minutes

## What You Have

✅ **Admin Panel** - React + Vite app in `admin-web/`  
✅ **Buyer App** - React Native/Expo web app in root  
✅ **GitHub** - Already set up at https://github.com/basavarajkonkani/DemoPackmonk  

## What You Need to Do

### Step 1: Create Two Netlify Sites (5 mins)

1. Go to [Netlify](https://app.netlify.com)
2. Sign in with GitHub
3. Click **"New site from Git"**
4. Select your repository

**For Admin Panel:**
- Build command: `cd admin-web && npm install && npm run build`
- Publish directory: `admin-web/dist`
- Deploy → Wait ~2-3 minutes ✅

**For Buyer App:**
- Build command: `npm install && npm run build`  
- Publish directory: `dist`
- Deploy → Wait ~2-3 minutes ✅

### Step 2: You'll Get Two Links

After deployment completes:
- **Admin**: `https://[name].netlify.app` ← Share this with admins
- **Buyer**: `https://[other-name].netlify.app` ← Share this with customers

## That's It! 🎉

Both apps are now live and working independently, exactly like locally:
- Admin can manage products, orders, inventory
- Buyers can browse and shop
- Both connect to your backend API

---

## Files Added to Help

- `netlify.toml` - Admin panel deployment config ✅
- `netlify-buyer.toml` - Buyer app deployment config (reference) ✅
- `DEPLOYMENT_SETUP.md` - Full detailed instructions
- `DEPLOYMENT_LINKS.md` - Tracking your URLs
- `QUICK_START_DEPLOYMENT.md` - This file!

---

## Actual Production URLs (Update These)

Once deployed, update here:

```
Admin Panel URL: https://packmonk-admin.netlify.app
Buyer App URL: https://packmonk-buyer.netlify.app
Backend API: https://your-api.com
```

---

## Need to Make Changes?

1. Edit code locally
2. Test: `npm run dev` (admin) or `npm run web` (buyer)
3. Push to GitHub: `git push origin main`
4. Netlify auto-deploys! ✅

---

## Troubleshooting (1-2 mins)

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm install` then `npm run build` locally first |
| Pages show 404 | netlify.toml redirects should fix it - wait for re-deploy |
| Wrong app showing | Verify correct publish directory in Netlify settings |
| API not working | Set environment variables in Netlify Site Settings |

---

**Ready to deploy?** Go to https://app.netlify.com and start! 🚀
