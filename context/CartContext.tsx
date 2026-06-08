import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Product } from "@/data/products";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  qty: number;
  addedAt: string;
}

export interface HistoryEntry {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
}

interface CartContextType {
  cart: CartItem[];
  history: HistoryEntry[];
  spentToday: number;
  pendingCount: number;
  addToCart: (product: Product, qty: number, priceOverride?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, delta: number) => void;
  checkout: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "basketbook_cart_v1";
const HISTORY_KEY = "basketbook_history_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [cartRaw, historyRaw] = await Promise.all([
          AsyncStorage.getItem(CART_KEY),
          AsyncStorage.getItem(HISTORY_KEY),
        ]);
        if (cartRaw) setCart(JSON.parse(cartRaw));
        if (historyRaw) setHistory(JSON.parse(historyRaw));
      } catch {
        // ignore parse errors
      }
      setInitialized(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    AsyncStorage.setItem(CART_KEY, JSON.stringify(cart)).catch(() => {});
  }, [cart, initialized]);

  useEffect(() => {
    if (!initialized) return;
    AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history)).catch(() => {});
  }, [history, initialized]);

  const spentToday = useMemo(() => {
    const today = new Date().toDateString();
    const historyToday = history
      .filter((e) => new Date(e.date).toDateString() === today)
      .reduce((sum, e) => sum + e.total, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    return historyToday + cartTotal;
  }, [history, cart]);

  const pendingCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const addToCart = useCallback(
    (product: Product, qty: number, priceOverride?: number) => {
      const price = priceOverride ?? product.price;
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        if (existing) {
          return prev.map((item) =>
            item.productId === product.id
              ? { ...item, qty: item.qty + qty, price }
              : item
          );
        }
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          price,
          unit: product.unit,
          category: product.category,
          image: product.image,
          qty,
          addedAt: new Date().toISOString(),
        };
        return [...prev, newItem];
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQty = useCallback((productId: string, delta: number) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.productId === productId
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      );
      return updated;
    });
  }, []);

  const checkout = useCallback(() => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const entry: HistoryEntry = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      items: [...cart],
      total,
      date: new Date().toISOString(),
    };
    setHistory((prev) => [entry, ...prev]);
    setCart([]);
  }, [cart]);

  const value: CartContextType = {
    cart,
    history,
    spentToday,
    pendingCount,
    addToCart,
    removeFromCart,
    updateQty,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
