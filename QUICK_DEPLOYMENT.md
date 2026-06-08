# BasketBook Mobile - Quick Deployment (5 Minutes)

## 🚀 Deploy to Netlify (Easiest)

### Step 1: Create GitHub Repository

```powershell
cd C:\Users\hp\Downloads\BasketBook-source\artifacts\mobile

# Initialize git
git init
git add .
git commit -m "Initial commit: BasketBook mobile app"

# Go to https://github.com/new and create a repository
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/basketbook-mobile.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Netlify (2 clicks!)

1. Go to **https://app.netlify.com**
2. Click **"New site from Git"**
3. Click **GitHub** → Authorize → Select your repo
4. ✅ **Done!** Your app is deploying

**Your URL**: `https://your-site-name.netlify.app`

---

## 🚀 Deploy to Vercel (Best Performance)

### Step 1: Create GitHub Repository

Same as Netlify Step 1 above.

### Step 2: Connect to Vercel

#### Option A: One-Click Deployment

1. Go to **https://vercel.com/new**
2. Click **Continue with GitHub** → Authorize → Select repo
3. Configure:
   - **Framework**: React
   - **Build Command**: `npm install --legacy-peer-deps && npm run build:web`
   - **Output Directory**: `dist`
4. Click **Deploy**

#### Option B: Using CLI

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

**Your URL**: `https://basketbook-mobile.vercel.app`

---

## 📋 Pre-Deployment Checklist

Before pushing, verify everything works:

```powershell
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Check for errors
npm run typecheck

# 3. Build locally
npm run build:web

# 4. Test the build
npx serve dist
# Open browser and test the app
```

---

## ✅ After Deployment

### Test Your Live App

- [ ] Open deployed URL in browser
- [ ] Test Shop screen - add items to cart
- [ ] Test Basket screen - view total, checkout
- [ ] Test History screen - verify purchase saved
- [ ] Open Console (F12) - no errors?
- [ ] Test on mobile device

### Share Your App

```
Check the deployment status:
- Netlify: https://app.netlify.com/sites/YOUR_SITE
- Vercel: https://vercel.com/YOUR_USERNAME/basketbook-mobile
```

---

## 🔄 Continuous Deployment (Auto-Deploy on Push)

Both platforms automatically deploy when you push to `main`:

```powershell
# Make changes locally
# ...edit files...

# Push to GitHub
git add .
git commit -m "Feature: Add discount code support"
git push origin main

# ✅ Deployment starts automatically!
# Watch in: Netlify or Vercel dashboard
```

---

## 🆘 Quick Troubleshooting

### Build Fails: "expo not found"
✅ **Fix**: Netlify/Vercel already has build script in `netlify.toml`/`vercel.json`

### Blank Page After Deploy
✅ **Fix**: Check browser console (F12)
- If 404: Check redirects in config file
- If module error: npm install --legacy-peer-deps and rebuild

### Cart Data Lost
✅ **Fix**: AsyncStorage works on web - check browser DevTools → Application → Local Storage

### Very Slow Loading
✅ **Fix**: 
- First load takes 30-60s (cold start)
- Check network in DevTools
- Enable caching headers (already done in config)

---

## 📊 Monitor Your Deployment

### Netlify Dashboard
- **Deploys**: https://app.netlify.com/sites/YOUR_SITE/deploys
- **Analytics**: Track visitors and performance
- **Logs**: Real-time build and runtime logs

### Vercel Dashboard
- **Deployments**: https://vercel.com/YOUR_USERNAME/basketbook-mobile
- **Analytics**: Core Web Vitals and usage stats
- **Functions**: Serverless API endpoints (if added)

---

## 🎁 Free Add-ons

### Domain Name
- Netlify: Free `.netlify.app` domain
- Vercel: Free `.vercel.app` domain
- Custom domain: $1-15/year on registrar

### SSL Certificate
- Both platforms: **Free HTTPS** (automatic)

### Bandwidth
- Netlify: 100 GB/month free
- Vercel: 100 GB/month free

### Build Time
- Netlify: 300 minutes/month free
- Vercel: Unlimited free builds

---

## 📱 Share Your App

```
Live links to share:
- Netlify: https://basketbook-mobile.netlify.app
- Vercel: https://basketbook-mobile.vercel.app

QR Code: Scan on phone to open
Social Media: "Just deployed my shopping app! Check it out: [URL]"
```

---

## 🔐 Next: Add Backend API

Once deployed, you can add backend:

1. **Create API endpoints** in `api/` directory
2. **Connect database** (Firebase, MongoDB, PostgreSQL)
3. **Authentication** (Auth0, Supabase, Firebase Auth)
4. **Payments** (Stripe, Razorpay)

See `DEPLOYMENT_GUIDE.md` for details.

---

## 🎉 You're Live!

Congratulations! Your BasketBook app is now deployed and accessible worldwide.

**Next steps**:
1. Test on mobile device
2. Share with friends
3. Gather feedback
4. Add more features
5. Scale up as needed

---

**Questions?** Check the full `DEPLOYMENT_GUIDE.md` file.

**Created**: June 8, 2026
