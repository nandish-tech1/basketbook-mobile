# BasketBook Mobile - Quick Reference Guide

## 🚀 Quick Start (30 seconds)

```powershell
cd C:\Users\hp\Downloads\BasketBook-source\artifacts\mobile
npm install
npm run dev
# Press 'w' for web
```

---

## 📋 App Architecture at a Glance

### Screens (3 Tabs)
| Tab | File | Purpose |
|-----|------|---------|
| 🛒 Shop | `app/(tabs)/index.tsx` | Browse & add products |
| 🛍️ Basket | `app/(tabs)/cart.tsx` | View cart & checkout |
| 📜 History | `app/(tabs)/history.tsx` | View past purchases |

### Context Providers
| Context | File | Manages |
|---------|------|---------|
| 🛒 CartContext | `context/CartContext.tsx` | Cart & history state |
| 💰 PriceContext | `context/PriceContext.tsx` | Price calculations |
| 🔔 ToastContext | `context/ToastContext.tsx` | Notifications |

### Key Components
| Component | File | Usage |
|-----------|------|-------|
| ProductCard | `components/ProductCard.tsx` | Display product |
| StatCard | `components/StatCard.tsx` | Show statistics |
| ErrorBoundary | `components/ErrorBoundary.tsx` | Error handling |

---

## 🔧 Essential Commands

```powershell
# Install dependencies
npm install

# Start development
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Serve built app
npm run serve
```

---

## 📁 File Locations Reference

```
Root Files:
  ├─ app.json          → Expo config (name, version, plugins)
  ├─ tsconfig.json     → TypeScript config
  ├─ package.json      → Dependencies & scripts
  ├─ babel.config.js   → Babel transpiler
  └─ metro.config.js   → Metro bundler

App Code:
  ├─ app/
  │  ├─ _layout.tsx    → Root wrapper with providers
  │  └─ (tabs)/        → Tab-based navigation
  ├─ components/       → Reusable UI components
  ├─ context/          → State management
  ├─ data/             → Products catalog
  ├─ hooks/            → Custom hooks
  └─ constants/        → Colors & constants

Build Output:
  ├─ .expo/            → Expo cache (auto-generated)
  ├─ node_modules/     → Dependencies
  └─ dist/             → Build output
```

---

## 🎯 Core Data Structures

### Product
```typescript
{
  id: string;
  name: string;
  price: number;           // In INR
  unit: string;            // "per kg", "per dozen", etc.
  category: string;        // "Fruits", "Vegetables", etc.
  image: string;           // Unsplash URL
}
```

### Cart Item
```typescript
{
  productId: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  qty: number;
  addedAt: string;         // ISO timestamp
}
```

### History Entry
```typescript
{
  id: string;
  items: CartItem[];
  total: number;
  date: string;            // ISO timestamp
}
```

---

## 🔌 Using Context Hooks

### CartContext
```typescript
import { useCart } from "@/context/CartContext";

const { cart, history, addToCart, removeFromCart, updateQty, checkout } = useCart();

// Add to cart
addToCart(product, 2, undefined);

// Update quantity
updateQty("product-id", 1);  // +1
updateQty("product-id", -1); // -1

// Remove item
removeFromCart("product-id");

// Checkout
checkout();
```

### Colors Hook
```typescript
import { useColors } from "@/hooks/useColors";

const colors = useColors();
// colors.primary, colors.background, colors.border, etc.
```

---

## 🎨 Styling Pattern

```typescript
import { StyleSheet, View, Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
});

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
}
```

---

## 📱 Screen/Route Structure

### App Routes (Expo Router)
```
/                          → app/_layout.tsx
├─ (tabs)                  → app/(tabs)/_layout.tsx
│  ├─ /                    → app/(tabs)/index.tsx (Shop)
│  ├─ /cart                → app/(tabs)/cart.tsx (Basket)
│  └─ /history             → app/(tabs)/history.tsx (History)
└─ +not-found              → app/+not-found.tsx (404)
```

### Navigation Usage
```typescript
import { useRouter } from "expo-router";

const router = useRouter();

// Navigate
router.push("/");           // Shop
router.push("/cart");       // Basket
router.push("/history");    // History
router.back();              // Go back
```

---

## 🔍 Product Catalog Categories

The `data/products.ts` contains 142+ products in:
- 🍎 Fruits (Apples, Bananas, Avocados, etc.)
- 🥕 Vegetables (Tomatoes, Carrots, Broccoli, etc.)
- 🥛 Dairy & Proteins (Milk, Cheese, Chicken, etc.)
- 🍚 Pantry Items (Rice, Wheat, Oil, etc.)
- 🥤 Beverages (Juice, Coffee, Tea, etc.)

Each product has an Unsplash image URL for visual display.

---

## 💾 Local Storage

### AsyncStorage Keys
```typescript
"basketbook_cart_v1"       // Current cart items
"basketbook_history_v1"    // Purchase history
```

### Data Persistence
- Automatically saved when cart changes
- Restored on app startup
- Can be cleared from React DevTools

---

## 🐛 Debugging

### In VS Code
1. Open **Run & Debug** (`Ctrl+Shift+D`)
2. Select "Expo" configuration
3. Click green play button
4. Set breakpoints by clicking line numbers

### In Browser Console
```javascript
// When running on web
localStorage.getItem("basketbook_cart_v1")  // View cart
localStorage.clear()                        // Clear all storage
```

### In Terminal
```powershell
npm run dev
# Then press:
# r → reload
# R → hard reload
# e → clear cache
# d → toggle debugger
```

---

## 📦 Package Highlights

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based routing (like Next.js) |
| `react-native-reanimated` | Smooth animations |
| `@tanstack/react-query` | Server state management |
| `zod` | TypeScript schema validation |
| `async-storage` | Persistent local storage |
| `@expo-google-fonts/inter` | Inter font family |

---

## ⚡ Performance Tips

```typescript
// Memoize expensive computations
const totalPrice = useMemo(() => {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}, [cart]);

// Prevent unnecessary re-renders
const handleAddToCart = useCallback((product) => {
  addToCart(product, 1);
}, [addToCart]);

// Use React.memo for expensive components
const ProductCard = React.memo(({ product }) => {
  return <View>{product.name}</View>;
});
```

---

## 🎨 Color Customization

Edit `constants/colors.ts`:
```typescript
export const colors = {
  light: {
    primary: "#007AFF",      // Main brand color
    background: "#FFFFFF",   // App background
    foreground: "#000000",   // Text color
    border: "#E5E5E5",       // Divider color
    // ... more colors
  },
  dark: {
    // Dark mode colors
  },
};
```

---

## 🔐 Adding Authentication (Future)

Structure for adding login:
```typescript
// Create auth context
export const AuthContext = createContext<AuthContextType | null>(null);

// Use in _layout.tsx
export default function RootLayout() {
  const { isSignedIn } = useAuth();
  
  return (
    <Stack>
      {isSignedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="auth/login" />
      )}
    </Stack>
  );
}
```

---

## 🚀 Deployment Steps

### Build
```powershell
npm run build
```

### Deploy Options
- **Expo**: `eas build` and `eas submit`
- **Android**: Build APK for Google Play
- **iOS**: Build IPA for App Store
- **Web**: Build for web hosting

---

## 📖 Important Files to Know

| File | Why Important |
|------|---------------|
| `app/_layout.tsx` | Root component, providers setup |
| `app/(tabs)/_layout.tsx` | Tab navigation config |
| `context/CartContext.tsx` | Core business logic |
| `data/products.ts` | Product source of truth |
| `app.json` | Expo & app configuration |
| `tsconfig.json` | TypeScript settings |

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| App won't start | Clear cache: `npm install` then `npm run dev` |
| Port 19000 in use | `npx kill-port 19000` |
| TypeScript errors | `npm run typecheck` to diagnose |
| Hot reload not working | Press `r` in terminal |
| Old data persisting | Clear AsyncStorage in DevTools |

---

## 🔗 Useful Links

- [Expo Documentation](https://docs.expo.dev)
- [React Native API Reference](https://reactnative.dev/docs/flatlist)
- [Expo Router Examples](https://github.com/expo/router/tree/main/apps/demo)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Version**: 1.0.0
**Last Updated**: June 8, 2026
