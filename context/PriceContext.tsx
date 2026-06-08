import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const PRICES_KEY = "basketbook_prices_v1";

interface PriceContextType {
  getPrice: (productId: string, defaultPrice: number) => number;
  updatePrice: (productId: string, price: number) => void;
  resetPrice: (productId: string) => void;
  customPrices: Record<string, number>;
}

const PriceContext = createContext<PriceContextType | null>(null);

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PRICES_KEY)
      .then((raw) => {
        if (raw) setCustomPrices(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => setInitialized(true));
  }, []);

  useEffect(() => {
    if (!initialized) return;
    AsyncStorage.setItem(PRICES_KEY, JSON.stringify(customPrices)).catch(() => {});
  }, [customPrices, initialized]);

  const getPrice = useCallback(
    (productId: string, defaultPrice: number) =>
      customPrices[productId] ?? defaultPrice,
    [customPrices]
  );

  const updatePrice = useCallback((productId: string, price: number) => {
    setCustomPrices((prev) => ({ ...prev, [productId]: price }));
  }, []);

  const resetPrice = useCallback((productId: string) => {
    setCustomPrices((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  return (
    <PriceContext.Provider value={{ getPrice, updatePrice, resetPrice, customPrices }}>
      {children}
    </PriceContext.Provider>
  );
}

export function usePrices(): PriceContextType {
  const ctx = useContext(PriceContext);
  if (!ctx) throw new Error("usePrices must be inside PriceProvider");
  return ctx;
}
