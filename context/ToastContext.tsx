import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Platform, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

function ToastOverlay() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (msg: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMessage(msg);
      setVisible(true);
      translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });

      timerRef.current = setTimeout(() => {
        translateY.value = withTiming(-120, { duration: 280 });
        opacity.value = withTiming(0, { duration: 280 });
        setTimeout(() => setVisible(false), 300);
      }, 2400);
    },
    [opacity, translateY]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const topOffset = Platform.OS === "web" ? 67 : insets.top;

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        animatedStyle,
        {
          top: topOffset + 12,
          backgroundColor: colors.foreground,
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.card, fontFamily: "Inter_500Medium" }]}>
        {message}
      </Text>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastKey, setToastKey] = useState(0);
  const [pendingMessage, setPendingMessage] = useState("");

  const showToast = useCallback((msg: string) => {
    setPendingMessage(msg);
    setToastKey((k) => k + 1);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastInner key={toastKey} message={pendingMessage} />
    </ToastContext.Provider>
  );
}

function ToastInner({ message }: { message: string }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);
  const [gone, setGone] = useState(false);

  React.useEffect(() => {
    if (!message) return;
    translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 200 });

    const t = setTimeout(() => {
      translateY.value = withTiming(-120, { duration: 280 });
      opacity.value = withTiming(0, { duration: 280 });
      setTimeout(() => setGone(true), 300);
    }, 2400);
    return () => clearTimeout(t);
  }, [message, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const topOffset = Platform.OS === "web" ? 67 : insets.top;

  if (gone || !message) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        animatedStyle,
        {
          top: topOffset + 12,
          backgroundColor: colors.foreground,
        },
      ]}
      pointerEvents="none"
    >
      <Text style={[styles.text, { color: colors.card, fontFamily: "Inter_500Medium" }]}>
        {message}
      </Text>
    </Animated.View>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: 20,
    right: 20,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
