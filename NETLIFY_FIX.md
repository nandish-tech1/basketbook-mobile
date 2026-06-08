# 🔧 Netlify Deployment Fix

## Problem
Your first Netlify build failed with this error:
```
sh: 1: expo: not found
Error message: Command failed with exit code 127
```

## Root Cause
The `netlify.toml` was using `npm run build:web` which calls `expo` command, but Expo CLI wasn't available in the Netlify build environment.

## Solution ✅

### What Was Fixed
Updated `netlify.toml` to use `npx expo` instead of `expo`:

```toml
# BEFORE (broken)
command = "npm install --legacy-peer-deps && npm run build:web"

# AFTER (fixed)
command = "npm install --legacy-peer-deps && npx expo export -p web --output-dir=dist"
```

### Why This Works
- `npx` automatically finds and runs the expo CLI from node_modules
- No need to install expo globally
- Works in Netlify's sandboxed build environment
- Directly calls `expo export` for web build

### Changes Made
Updated all build commands in `netlify.toml`:
- ✅ `[build]` section
- ✅ `[context.production]` section
- ✅ `[context.deploy-preview]` section
- ✅ `[context.branch-deploy]` section
- ✅ Added `node_version = "20"` for consistency

## How to Deploy Again

### Step 1: Changes Are Already Pushed ✅
The fix has been committed and pushed to GitHub. 

Verify:
```powershell
git log --oneline -5
# Should show the netlify fix commit
```

### Step 2: Trigger New Build on Netlify
1. Go to https://app.netlify.com
2. Open your "basketbook-mobile" site
3. Go to **Deployments**
4. Click **Trigger deploy** → **Deploy site**

OR simply push a new commit:
```powershell
git add .
git commit -m "Trigger netlify rebuild"
git push origin main
```

### Step 3: Monitor the Build
1. Watch the build logs in Netlify
2. Should now progress past the "expo not found" error
3. Build should complete successfully

## Expected Build Output
When fixed, you should see:
```
$ npm install --legacy-peer-deps && npx expo export -p web --output-dir=dist
...
✔ Expo export completed successfully
```

## If Build Still Fails

### Debug Steps
1. **Check Node version**: Verify Netlify is using Node.js 20.x
   - Site Settings → Build & Deploy → Environment → Node version

2. **Check dependencies**: Ensure all packages are listed in `package.json`
   ```powershell
   npm list expo
   npm list @expo/cli
   ```

3. **Try building locally**:
   ```powershell
   npm install --legacy-peer-deps
   npx expo export -p web --output-dir=dist
   ```

4. **Check for TypeScript errors**:
   ```powershell
   npm run typecheck
   ```

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Still says "expo not found" | Clear Netlify cache: **Deploys → Trigger deploy → Clear cache and deploy** |
| Build timeout | Increase timeout in netlify.toml: `timeout = 900` |
| Out of memory | Check if node_modules is being cached properly |
| TypeScript errors | Run `npm run typecheck` locally to find issues |

## Updated netlify.toml

Your current `netlify.toml` now has:

```toml
[build]
  command = "npm install --legacy-peer-deps && npx expo export -p web --output-dir=dist"
  publish = "dist"
  functions = "api"
  node_version = "20"

[dev]
  command = "npm run dev"
  port = 3000

[context.production]
  command = "npm install --legacy-peer-deps && npx expo export -p web --output-dir=dist"
  environment = { NODE_ENV = "production" }

[context.deploy-preview]
  command = "npm install --legacy-peer-deps && npx expo export -p web --output-dir=dist"

[context.branch-deploy]
  command = "npm install --legacy-peer-deps && npx expo export -p web --output-dir=dist"

# ... rest of redirects and headers
```

## Quick Actions

### Rebuild Now (Recommended)
```powershell
# Just push to trigger automatic rebuild
git add .
git commit -m "Rebuild with fixed netlify.toml"
git push origin main
```

### Test Build Locally First
```powershell
cd C:\Users\hp\Downloads\basketbook-mobile\artifacts\mobile
npm install --legacy-peer-deps
npx expo export -p web --output-dir=dist
# Check if dist/ folder is created successfully
```

## Next Steps

1. ✅ Push fix to GitHub (already done)
2. ⏭️ Trigger new build on Netlify
3. 🎉 Monitor build completion
4. 🚀 Visit your live site at `https://your-site.netlify.app`

---

**Status**: Ready to redeploy ✅

Last Updated: June 8, 2026
