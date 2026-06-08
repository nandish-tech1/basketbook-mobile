# BasketBook Mobile App - Complete Project Analysis

## Project Overview
**BasketBook** is a React Native Expo application for shopping and managing groceries/products with cart and purchase history functionality. It's built with TypeScript, Expo Router for navigation, and uses modern React patterns.

---

## 📱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native (v0.81.5) with Expo (v54.0.27) |
| **Language** | TypeScript 5.9.2 |
| **Navigation** | Expo Router v6.0.17 |
| **State Management** | Context API + React Query |
| **Storage** | AsyncStorage (local persistence) |
| **Styling** | React Native StyleSheet |
| **Animations** | React Native Reanimated v4.1.1 |
| **Fonts** | Expo Google Fonts (Inter family) |
| **Icons** | Expo Vector Icons + SF Symbols |

---

## 📁 Project Structure

```
mobile/
├── app/                          # Expo Router app directory
│   ├── _layout.tsx              # Root layout with providers
│   ├── +not-found.tsx           # 404 route
│   └── (tabs)/                  # Tab group layout
│       ├── _layout.tsx          # Tab navigation setup
│       ├── index.tsx            # Shop/Products screen
│       ├── cart.tsx             # Shopping cart screen
│       └── history.tsx          # Purchase history screen
│
├── components/                   # Reusable React components
│   ├── ErrorBoundary.tsx        # Error handling wrapper
│   ├── ErrorFallback.tsx        # Error UI display
│   ├── KeyboardAwareScrollViewCompat.tsx  # Keyboard handling
│   ├── ProductCard.tsx          # Product display card
│   └── StatCard.tsx             # Statistics display
│
├── context/                      # React Context providers
│   ├── CartContext.tsx          # Cart & history state management
│   ├── PriceContext.tsx         # Pricing utilities
│   └── ToastContext.tsx         # Toast notifications
│
├── data/
│   └── products.ts              # Product catalog (142 products)
│
├── hooks/
│   └── useColors.ts             # Color theme management
│
├── constants/
│   └── colors.ts                # Color palette definitions
│
├── server/                       # Backend server
│   ├── serve.js                 # Web server
│   └── templates/               # HTML templates
│
├── scripts/
│   └── build.js                 # Build configuration
│
├── assets/
│   └── images/                  # App icons & images
│
├── config files:
│   ├── app.json                 # Expo configuration
│   ├── tsconfig.json            # TypeScript config
│   ├── babel.config.js          # Babel configuration
│   ├── metro.config.js          # Metro bundler config
│   ├── package.json             # Dependencies
│   └── expo-env.d.ts            # Type definitions
```

---

## 🎯 Key Features

### 1. **Shop Screen** (`app/(tabs)/index.tsx`)
- Browse product catalog
- Search/filter products by category
- View product details
- Add items to cart with quantity
- Real-time pricing display

### 2. **Cart/Basket Screen** (`app/(tabs)/cart.tsx`)
- View all added items
- Adjust quantities
- Remove items
- Calculate total price
- Checkout functionality
- Price override support (e.g., discount apply)

### 3. **History Screen** (`app/(tabs)/history.tsx`)
- View past purchases
- Track spending over time
- View "spent today" statistics
- Purchase details with timestamps

### 4. **State Management**

#### CartContext
- **State**: `cart[]`, `history[]`, `spentToday`, `pendingCount`
- **Actions**:
  - `addToCart(product, qty, priceOverride?)` - Add item to cart
  - `removeFromCart(productId)` - Remove item from cart
  - `updateQty(productId, delta)` - Update quantity
  - `checkout()` - Finalize purchase and save to history
- **Persistence**: AsyncStorage (keys: `basketbook_cart_v1`, `basketbook_history_v1`)

#### PriceContext
- Handles pricing calculations and currency formatting

#### ToastContext
- Manages toast notifications for user feedback

### 5. **Product Catalog**
- 142 products across categories:
  - Fruits (Apples, Bananas, Avocados, etc.)
  - Vegetables (Tomatoes, Carrots, etc.)
  - Dairy & Proteins
  - Pantry Items
  - Beverages
- Each product has: id, name, price, unit, category, image (from Unsplash)

---

## 🚀 Available Scripts

```bash
# Development server (Expo)
npm run dev
# or
pnpm exec expo start --localhost

# Build for production
npm run build

# Start web server
npm run serve

# Type checking
npm run typecheck
```

---

## 🔧 Configuration Details

### Expo Configuration (`app.json`)
- **App Name**: BasketBook
- **Slug**: mobile
- **Version**: 1.0.0
- **Orientation**: Portrait only
- **New Architecture**: Enabled
- **Features**:
  - Typed Routes (TypeScript routes)
  - React Compiler (experimental optimization)
- **Plugins**: expo-router, expo-font, expo-web-browser

### TypeScript (`tsconfig.json`)
- Extends Expo base config
- **Strict Mode**: Enabled
- **Base URL**: Root (`.`)
- **Path Aliases**: `@/*` → `.*`
- **Includes**: All `.ts`, `.tsx`, and `.expo/types`

### Babel (`babel.config.js`)
- Uses `babel-preset-expo`
- React Compiler plugin enabled
- Import metadata transformation enabled

---

## 📦 Key Dependencies

### Core
- `react`: Latest (catalog version)
- `react-native`: 0.81.5
- `expo`: ~54.0.27
- `expo-router`: ~6.0.17 (file-based routing)

### UI & Styling
- `react-native-gesture-handler`: ~2.28.0 (gesture support)
- `react-native-reanimated`: ~4.1.1 (animations)
- `react-native-safe-area-context`: ~5.6.0 (safe areas)
- `expo-blur`: ~15.0.8 (blur effects)
- `expo-glass-effect`: ~0.1.4 (glass morphism)
- `expo-linear-gradient`: ~15.0.8 (gradients)
- `expo-symbols`: ~1.0.8 (SF Symbols on iOS)

### Fonts & Icons
- `@expo-google-fonts/inter`: Inter typeface family
- `@expo/vector-icons`: Feather, MaterialIcons, etc.

### State & Data
- `@tanstack/react-query`: Data fetching & caching (catalog)
- `@react-native-async-storage/async-storage`: 2.2.0 (local storage)
- `zod`: Data validation (catalog)
- `zod-validation-error`: Better error messages

### Keyboard & Interaction
- `react-native-keyboard-controller`: 1.18.5 (keyboard handling)
- `react-native-screens`: ~4.16.0 (screen optimization)
- `react-native-web`: ^0.21.0 (web support)

### Development
- TypeScript 5.9.2
- Babel with React Compiler plugin
- @expo/cli for development

---

## 🎨 Color System

**File**: `constants/colors.ts`
- Light mode colors
- Dark mode colors
- Semantic colors: primary, secondary, background, foreground, border, etc.

**Usage**: Through `useColors()` hook from `hooks/useColors.ts`

---

## 🔄 Data Flow

```
User Action
    ↓
Component (ProductCard, etc.)
    ↓
Context Action (addToCart, updateQty, etc.)
    ↓
CartContext State Update
    ↓
AsyncStorage Persistence
    ↓
UI Re-render
```

---

## ⚠️ Error Handling

### ErrorBoundary Component
- Catches React rendering errors
- Displays fallback UI (ErrorFallback)
- Prevents app crashes

### ErrorFallback Component
- User-friendly error message
- Recovery button options

---

## 📱 Platform Support

- **iOS**: Full support with native tabs and glass effect
- **Android**: Full support
- **Web**: Partial (React Native Web)

---

## 🔐 Local Storage Keys

| Key | Purpose |
|-----|---------|
| `basketbook_cart_v1` | Current shopping cart |
| `basketbook_history_v1` | Purchase history |

---

## 🎯 Next Steps / Development Areas

1. **Backend Integration**: Connect to real API
2. **Authentication**: User login/signup
3. **Payment Integration**: Stripe/PayPal
4. **Search & Filter**: Advanced product filtering
5. **Analytics**: Track user behavior
6. **Push Notifications**: Order updates
7. **Performance**: Image caching, code splitting

---

## 🐛 Known Patterns & Best Practices

✅ **Implemented**:
- TypeScript for type safety
- Context API for state management
- Expo Router for type-safe routing
- Error boundaries for error handling
- Persistent storage with AsyncStorage
- Keyboard-aware scrolling
- Platform-specific UI (native tabs on iOS)

⚡ **Optimization Opportunities**:
- React Query for server state
- Image optimization
- Code splitting by route
- Memoization with `useMemo` and `useCallback`

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Expo Router Docs](https://expo.github.io/router)
- [TypeScript React](https://www.typescriptlang.org/docs/handbook/react.html)

---

**Generated**: June 8, 2026
**Version**: 1.0.0
