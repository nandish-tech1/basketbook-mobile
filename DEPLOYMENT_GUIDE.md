# BasketBook Mobile - Deployment Guide (Netlify & Vercel)

## Overview

BasketBook is a React Native Expo web app that can be deployed to both **Netlify** and **Vercel**. Both platforms offer free hosting with easy deployment workflows.

---

## 🚀 Option 1: Deploy to Netlify

### Prerequisites
- GitHub account with your repository pushed
- Netlify account (free at https://netlify.com)
- Basic Git knowledge

### Step 1: Push Code to GitHub

```powershell
# Navigate to your project
cd C:\Users\hp\Downloads\BasketBook-source\artifacts\mobile

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial BasketBook mobile app"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/basketbook-mobile.git
git branch -M main
git push -u origin main
```

### Step 2: Create Build Script for Netlify

Create `./.netlify/build-scripts/build.sh` (or `build.cmd` for Windows):

```bash
#!/bin/bash
set -e

echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Building Expo web app..."
npm run build

echo "Build complete!"
```

### Step 3: Update package.json Build Scripts

Edit `package.json` to add a build command for web:

```json
{
  "scripts": {
    "dev": "expo start --localhost",
    "build": "expo export -p web",
    "build:web": "expo export -p web --output-dir=dist",
    "serve": "node server/serve.js",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  }
}
```

### Step 4: Create netlify.toml

Create a `netlify.toml` file in your project root:

```toml
# netlify.toml
[build]
  command = "npm install --legacy-peer-deps && npm run build:web"
  publish = "dist"
  functions = "api"

[dev]
  command = "npm run dev"
  port = 3000

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Step 5: Connect to Netlify

1. Go to https://app.netlify.com
2. Click **"New site from Git"**
3. Select **GitHub**
4. Authorize Netlify to access your repositories
5. Choose your `basketbook-mobile` repository
6. Click **Deploy**

### Step 6: Configure Environment Variables (Optional)

In Netlify dashboard:
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add any environment variables needed:
   ```
   EXPO_PUBLIC_API_URL=https://your-api.com
   NODE_ENV=production
   ```

### Step 7: Verify Deployment

- Your app will be live at: `https://your-site-name.netlify.app`
- Automatic deployments trigger on every push to `main` branch

---

## 🚀 Option 2: Deploy to Vercel

### Prerequisites
- GitHub account with your repository pushed
- Vercel account (free at https://vercel.com)

### Step 1: Push Code to GitHub

Same as Netlify Step 1 above.

### Step 2: Create vercel.json

Create a `vercel.json` file in your project root:

```json
{
  "buildCommand": "npm install --legacy-peer-deps && npm run build:web",
  "outputDirectory": "dist",
  "framework": "react",
  "nodeVersion": "20.x",
  "env": {
    "NODE_ENV": "production"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Step 3: Update package.json (if not done)

Make sure your `package.json` has the build command:

```json
{
  "scripts": {
    "dev": "expo start --localhost",
    "build": "expo export -p web",
    "build:web": "expo export -p web --output-dir=dist",
    "serve": "node server/serve.js",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  }
}
```

### Step 4: Connect to Vercel

#### Option A: Using Vercel CLI

```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd C:\Users\hp\Downloads\BasketBook-source\artifacts\mobile
vercel
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Click **Continue with GitHub**
3. Authorize and select your repository
4. Configure project:
   - **Framework Preset**: React
   - **Build Command**: `npm install --legacy-peer-deps && npm run build:web`
   - **Output Directory**: `dist`
5. Click **Deploy**

### Step 5: Set Environment Variables

In Vercel dashboard:
1. Go to your project
2. **Settings** → **Environment Variables**
3. Add variables:
   ```
   EXPO_PUBLIC_API_URL=https://your-api.com
   NODE_ENV=production
   ```

### Step 6: Verify Deployment

- Your app will be live at: `https://your-project-name.vercel.app`
- Preview links for pull requests
- Automatic production deployments on push to main

---

## 📦 Comparison: Netlify vs Vercel

| Feature | Netlify | Vercel |
|---------|---------|--------|
| **Free Tier** | 100 GB/month | 100 GB/month |
| **Build Time** | 300 minutes/month free | Unlimited |
| **Deployment Preview** | Yes | Yes (better) |
| **CDN** | Global | Global (Faster) |
| **Serverless Functions** | Yes (limited) | Yes (better support) |
| **Analytics** | Basic | Advanced |
| **Best For** | General websites | Next.js apps |

**Recommendation**: **Vercel** for better performance, **Netlify** for simplicity.

---

## 🔧 Advanced: Adding a Backend API

If you need to add API endpoints, create `api/` directory:

### Netlify Functions (`.netlify/functions/`)

```javascript
// .netlify/functions/api.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Netlify Function",
    }),
  };
};
```

### Vercel Serverless Functions (`api/`)

```javascript
// api/products.js
export default async (req, res) => {
  const products = [
    { id: "1", name: "Apples", price: 180 },
    { id: "2", name: "Bananas", price: 50 },
  ];
  
  return res.status(200).json(products);
};
```

---

## 🚦 Deployment Checklist

Before deploying, ensure:

### Code Quality
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] All dependencies installed: `npm install --legacy-peer-deps`
- [ ] `.gitignore` includes `node_modules/`, `.env`, `dist/`
- [ ] Environment variables configured

### Build Configuration
- [ ] `package.json` has `build:web` script
- [ ] `netlify.toml` or `vercel.json` configured
- [ ] Redirects configured for SPA routing
- [ ] Cache headers set for assets

### Testing
- [ ] Run locally: `npm run dev` → Press `w` for web
- [ ] Test in production: Open deployed URL
- [ ] Check console for errors
- [ ] Test all features (Add to cart, checkout, history)

### Performance
- [ ] Test build size: `npm run build:web`
- [ ] Check Lighthouse score
- [ ] Verify images load properly
- [ ] Test on slow network (Chrome DevTools)

---

## 🐛 Troubleshooting Deployments

### Issue 1: Build Fails - "expo not found"

**Solution**:
```json
{
  "buildCommand": "npm install --legacy-peer-deps && npm run build:web"
}
```

### Issue 2: "React Native modules not supported"

**Solution**: Use web-safe modules only. React Native modules (Platform, NativeModules) won't work on web.

Create `components/ProductCard.web.tsx` for web-specific code.

### Issue 3: "AsyncStorage not working"

**Solution**: AsyncStorage works on web via polyfill. Ensure it's imported:
```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
```

### Issue 4: Blank Page After Deployment

**Solution**: Check browser console for errors. Common causes:
- Missing trailing slash in redirects
- Wrong `publicPath` in build config
- CSS/image paths incorrect

### Issue 5: 404 on Page Refresh

**Solution**: Configure SPA fallback redirect in `netlify.toml` or `vercel.json`:

```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🚀 Continuous Deployment (CD) Setup

### Automatic Deployments

Both platforms support automatic deployments on git push:

1. **Push triggers build**: Every push to `main` branch
2. **Build runs**: Dependencies installed, code built
3. **Tests run**: `npm run typecheck` (optional)
4. **Deploy**: Production deployment if successful

### Pull Request Previews

Both platforms create preview URLs for PRs:

1. Push to feature branch
2. Create Pull Request
3. Preview link generated automatically
4. Deploy to production on merge to main

### Deployment Status

Add deployment badge to README:

```markdown
# BasketBook Mobile

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)

Or

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/basketbook-mobile)
```

---

## 📊 Monitoring & Analytics

### Netlify Analytics

1. **Site settings** → **Analytics**
2. Enable Netlify Analytics
3. View traffic, users, conversion rates

### Vercel Analytics

1. **Settings** → **Analytics**
2. Enable Web Analytics
3. Real-time dashboard with Core Web Vitals

### Error Tracking

Set up error monitoring:

```typescript
// Add to app/_layout.tsx
import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: "https://YOUR_SENTRY_DSN",
  enableInExpoDevelopment: true,
  debug: true,
});
```

---

## 🔐 Security Best Practices

### Environment Variables

**Never commit secrets**:
```bash
# .env (add to .gitignore)
EXPO_PUBLIC_API_URL=https://api.basketbook.com
EXPO_PUBLIC_API_KEY=your_api_key_here
```

### CORS Configuration

If calling external APIs:

```javascript
// vercel.json or netlify.toml
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### SSL/TLS

Both platforms provide **free HTTPS certificates** automatically.

---

## 📈 Scaling & Performance Tips

### Optimize Bundle Size

```bash
# Analyze bundle
npm install -g source-map-explorer
npm run build:web
source-map-explorer 'dist/**/*.js'
```

### Enable Caching

Netlify/Vercel automatically cache your assets. Ensure headers are set:

```toml
# netlify.toml
[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### Use CDN Image Optimization

Netlify/Vercel CDN automatically optimizes images:

```typescript
// Already using Unsplash URLs (optimized)
image: "https://images.unsplash.com/photo-1560806887...?w=400&q=80&auto=format"
```

---

## 🎯 Final Deployment Steps

### 1. Final Testing Locally

```powershell
npm run typecheck
npm run build:web
npx serve dist
```

### 2. Create Deployment Branch

```powershell
git checkout -b deploy/v1.0.0
git push origin deploy/v1.0.0
```

### 3. Monitor First Deployment

- Check build logs
- Wait for deployment to complete
- Test all features on live URL
- Monitor error rates

### 4. Set Up Rollback Plan

Keep track of commit SHAs for easy rollback:

```powershell
git log --oneline | head -5
```

---

## 📚 Additional Resources

### Netlify
- [Netlify Documentation](https://docs.netlify.com)
- [Netlify Build Guide](https://docs.netlify.com/configure-builds/overview/)
- [React Deployment](https://docs.netlify.com/frameworks-and-languages/react/)

### Vercel
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Build Guide](https://vercel.com/docs/concepts/projects/overview)
- [React on Vercel](https://vercel.com/docs/frameworks/react)

### Expo Web
- [Expo Web Documentation](https://docs.expo.dev/distribution/publishing-websites/)
- [Expo Router Web](https://expo.github.io/router/introduction)

---

## ✅ Deployment Success Checklist

- [ ] Code pushed to GitHub
- [ ] `netlify.toml` or `vercel.json` created
- [ ] `package.json` has `build:web` script
- [ ] Environment variables configured
- [ ] Build succeeds locally
- [ ] App works on deployed URL
- [ ] All features tested in production
- [ ] Monitoring/analytics enabled
- [ ] Error tracking configured
- [ ] Documentation updated

---

**Congratulations! Your BasketBook app is now live! 🎉**

For questions or issues, refer to the platform-specific documentation or contact support.

---

**Created**: June 8, 2026
**Version**: 1.0.0
