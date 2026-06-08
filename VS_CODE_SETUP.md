# BasketBook Mobile - VS Code Setup Guide

## Prerequisites

Ensure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org)
- **Git** - [Download](https://git-scm.com)
- **VS Code** - [Download](https://code.visualstudio.com)

### Verify Installation
```powershell
node --version
npm --version
git --version
```

---

## Step 1: Open Project in VS Code

1. Launch VS Code
2. **File** → **Open Folder**
3. Navigate to: `C:\Users\hp\Downloads\BasketBook-source\artifacts\mobile`
4. Click **Select Folder**

---

## Step 2: Install Dependencies

### Option A: Using NPM (Recommended for Windows)
```powershell
npm install
```

### Option B: Using PNPM (Faster)
```powershell
# Install pnpm first if you don't have it
npm install -g pnpm

# Then install dependencies
pnpm install
```

**Wait for installation to complete** (this may take 2-5 minutes)

---

## Step 3: Install Recommended VS Code Extensions

Press `Ctrl+Shift+X` to open Extensions, then search and install:

### Essential Extensions
1. **ES7+ React/Redux/React-Native snippets**
   - ID: `dsznajder.es7-react-js-snippets`
   - Provides code snippets for React/React Native

2. **Prettier - Code formatter**
   - ID: `esbenp.prettier-vscode`
   - Auto-formats code on save

3. **ESLint**
   - ID: `dbaeumer.vscode-eslint`
   - Lints TypeScript/JavaScript code

4. **TypeScript Vue Plugin (Volar)**
   - ID: `Vue.vscode-typescript-vue-plugin`
   - Better TypeScript support

5. **Thunder Client** or **REST Client**
   - For testing API endpoints (optional)

### Recommended Extensions
6. **Material Icon Theme**
   - ID: `PKief.material-icon-theme`
   - Better file icons

7. **One Dark Pro**
   - ID: `zhuangtongfa.Material-theme`
   - Beautiful dark theme

---

## Step 4: Configure VS Code Settings

### Create/Edit `.vscode/settings.json`

Create a `.vscode` folder in the project root if it doesn't exist, then create `settings.json`:

```json
{
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[typescriptreact]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[javascript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSaveTimeout": 5000,
  "search.exclude": {
    "**/node_modules": true,
    "**/.expo": true,
    "**/dist": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/.expo": true
  }
}
```

---

## Step 5: Verify TypeScript Setup

Run type checking to ensure everything is configured correctly:

```powershell
npm run typecheck
```

Expected output: **No TypeScript errors**

---

## Step 6: Start Development Server

### Option A: Expo CLI
```powershell
npm run dev
```

This starts the Expo development server on `http://localhost:19000`

### Option B: Direct Expo Start
```powershell
npx expo start --localhost
```

### What to expect:
```
┌─────────────────────────────────────┐
│ Starting Metro Bundler              │
│ on http://localhost:19000           │
└─────────────────────────────────────┘

› Press a – open Android
› Press i – open iOS simulator
› Press w – open web
› Press e – clear all
› Press r – reload app
› Press j – open debugger
› Press o – toggle network inspector
```

---

## Step 7: Open the App

### On Web (Easiest for Development)
Press **`w`** in the terminal where expo is running

Expected: App opens in browser at `http://localhost:19001` showing:
- **Shop Tab**: Product list with add to cart buttons
- **Basket Tab**: Shopping cart with total
- **History Tab**: Purchase history

### On Android
- Requires Android Studio or physical device
- Press **`a`** in terminal
- Or scan QR code with Expo Go app

### On iOS
- Requires macOS with Xcode
- Press **`i`** in terminal
- Or scan QR code with Expo Go app

---

## Step 8: Test the App Features

### ✅ Shop Screen
1. Scroll through products
2. Click any product card
3. Enter quantity and tap "Add to Cart"

### ✅ Cart Screen
1. Switch to Basket tab
2. See added items with quantities
3. Adjust quantities or remove items
4. View total price
5. Tap "Checkout" to complete purchase

### ✅ History Screen
1. Switch to History tab
2. After checkout, purchase appears here
3. View spending statistics

### ✅ Persistence
1. Add items to cart
2. Close and reopen app
3. Cart should still contain items (AsyncStorage working)

---

## VS Code Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+D` | Open Debug panel |
| `Ctrl+J` | Toggle terminal |
| `Ctrl+Shift+X` | Open Extensions |
| `Ctrl+,` | Open Settings |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+L` | Select line |
| `Ctrl+/` | Toggle comment |
| `Ctrl+Shift+F` | Find in all files |
| `F12` | Go to definition |
| `Shift+F12` | Find all references |

---

## Debugging in VS Code

### Enable JavaScript Debugger

1. Open **Run & Debug** panel (`Ctrl+Shift+D`)
2. Click **Create a launch.json file**
3. Select **Node.js**
4. Add this configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Expo",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/expo",
      "args": ["start"],
      "console": "integratedTerminal"
    }
  ]
}
```

5. Click the green play button to start debugging

---

## Common Issues & Solutions

### Issue 1: "Port 19000 is already in use"
```powershell
# Kill the process using port 19000
npx kill-port 19000
npm run dev
```

### Issue 2: "Module not found" errors
```powershell
# Clear node_modules and reinstall
rm -r node_modules -Force
npm install
```

### Issue 3: TypeScript errors in VS Code
```powershell
# Reload VS Code window
Ctrl+Shift+P → "Developer: Reload Window"
```

### Issue 4: Hot reload not working
- Press `r` in terminal to manually reload
- Or press `Shift+R` for hard reload

### Issue 5: AsyncStorage data lost
- Delete app data or use DevTools
- Press `e` in terminal to clear cache

---

## Project Development Workflow

### 1. Edit Component
```typescript
// Example: components/ProductCard.tsx
export function ProductCard({ product }: { product: Product }) {
  return (
    <View style={styles.card}>
      <Text>{product.name}</Text>
    </View>
  );
}
```

### 2. Save File
- Prettier auto-formats on save
- ESLint checks for errors

### 3. View Changes
- Hot reload automatically updates app
- Or press `r` in terminal

### 4. Debug if Needed
- Open React Native Debugger
- Or check browser console
- Or check terminal for errors

---

## Useful NPM Scripts

```powershell
# Development
npm run dev              # Start Expo dev server

# Testing & Quality
npm run typecheck        # Check TypeScript types

# Production
npm run build            # Create production build
npm run serve            # Serve built app

# Type Definitions
npm run type-gen         # Generate types (if available)
```

---

## Performance Tips

1. **Use Memoization**
   ```typescript
   const MemoComponent = React.memo(MyComponent);
   ```

2. **Optimize Images**
   - Unsplash URLs are already optimized
   - Use `expo-image` for better performance

3. **Lazy Load Routes**
   - Expo Router handles this automatically

4. **Use React Query**
   - Already imported in project
   - Use for server state management

---

## Project Structure Quick Reference

```
📦 mobile
 ├─ 📂 app/              ← Routes & screens (Expo Router)
 ├─ 📂 components/       ← Reusable UI components
 ├─ 📂 context/          ← State management (Context API)
 ├─ 📂 data/             ← Static data (products)
 ├─ 📂 hooks/            ← Custom React hooks
 ├─ 📂 constants/        ← App constants (colors)
 ├─ 📂 assets/           ← Images, fonts, icons
 ├─ 📂 server/           ← Web server (for serve command)
 ├─ 📄 app.json          ← Expo configuration
 ├─ 📄 tsconfig.json     ← TypeScript config
 ├─ 📄 package.json      ← Dependencies
 └─ 📄 babel.config.js   ← Babel config
```

---

## Next: Start Coding!

You're now ready to develop. Start by:

1. **Run the app**: `npm run dev` → Press `w` for web
2. **Explore code**: Open files in Explorer (`Ctrl+Shift+E`)
3. **Edit components**: Make a small change and watch hot reload
4. **Check types**: `npm run typecheck` before committing

---

## Resources

- 📚 [Expo Documentation](https://docs.expo.dev)
- 📚 [React Native Docs](https://reactnative.dev)
- 🎓 [Expo Router Guide](https://expo.github.io/router)
- 🔧 [VS Code Tips](https://code.visualstudio.com/docs)

---

**Ready to build? Happy coding! 🚀**
