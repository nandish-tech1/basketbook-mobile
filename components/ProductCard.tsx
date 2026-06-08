import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { useCart } from "@/context/CartContext";
import { usePrices } from "@/context/PriceContext";
import { useToast } from "@/context/ToastContext";
import type { Product } from "@/data/products";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const colors = useColors();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { getPrice, updatePrice, resetPrice } = usePrices();
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const inputRef = useRef<TextInput>(null);

  const effectivePrice = getPrice(product.id, product.price);
  const isCustom = effectivePrice !== product.price;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleAdd = () => {
    addToCart(product, qty, effectivePrice);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showToast(`${product.name} added to basket`);
    scale.value = withSequence(
      withSpring(0.95, { duration: 80 }),
      withSpring(1, { duration: 200 })
    );
    setQty(1);
  };

  const openPriceEdit = () => {
    setPriceInput(effectivePrice.toString());
    setEditingPrice(true);
    Haptics.selectionAsync();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const commitPrice = () => {
    const parsed = parseFloat(priceInput);
    if (!isNaN(parsed) && parsed > 0) {
      updatePrice(product.id, parsed);
      showToast(`Price updated to ₹${parsed.toFixed(2)}`);
    }
    setEditingPrice(false);
  };

  const handlePriceLongPress = () => {
    if (!isCustom) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Reset Price",
      `Reset "${product.name}" to default ₹${product.price.toFixed(2)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetPrice(product.id);
            showToast("Price reset to default");
          },
        },
      ]
    );
  };

  return (
    <Animated.View
      style={[
        styles.card,
        animatedStyle,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          width: CARD_WIDTH,
        },
      ]}
    >
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: colors.muted },
        ]}
      >
        {imgError ? (
          <View style={[styles.imageFallback, { backgroundColor: colors.accent }]}>
            <Feather name="shopping-bag" size={28} color={colors.accentForeground} />
          </View>
        ) : (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        )}
        <View style={[styles.categoryBadge, { backgroundColor: colors.accent }]}>
          <Text
            style={[
              styles.categoryText,
              { color: colors.accentForeground, fontFamily: "Inter_500Medium" },
            ]}
          >
            {product.category}
          </Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
          ]}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <Pressable
          onPress={openPriceEdit}
          onLongPress={handlePriceLongPress}
          style={styles.priceRow}
          hitSlop={6}
        >
          {editingPrice ? (
            <TextInput
              ref={inputRef}
              value={priceInput}
              onChangeText={setPriceInput}
              onBlur={commitPrice}
              onSubmitEditing={commitPrice}
              keyboardType="decimal-pad"
              style={[
                styles.priceInput,
                {
                  color: colors.primary,
                  borderBottomColor: colors.primary,
                  fontFamily: "Inter_700Bold",
                },
              ]}
              autoFocus
              selectTextOnFocus
              returnKeyType="done"
              maxLength={8}
            />
          ) : (
            <>
              <Text
                style={[
                  styles.price,
                  { color: colors.primary, fontFamily: "Inter_700Bold" },
                ]}
              >
                ₹{effectivePrice % 1 === 0
                  ? effectivePrice.toFixed(0)
                  : effectivePrice.toFixed(2)}
              </Text>
              <Feather
                name="edit-2"
                size={10}
                color={isCustom ? colors.primary : colors.mutedForeground}
                style={styles.editIcon}
              />
            </>
          )}
        </Pressable>

        <Text
          style={[
            styles.unitLabel,
            { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
          ]}
        >
          {product.unit}{isCustom ? " · custom" : ""}
        </Text>
      </View>

      <View style={styles.controls}>
        <View
          style={[
            styles.qtySelector,
            { backgroundColor: colors.secondary, borderRadius: 10 },
          ]}
        >
          <Pressable
            onPress={() => {
              if (qty > 1) setQty((q) => q - 1);
              Haptics.selectionAsync();
            }}
            style={({ pressed }) => [styles.qtyBtn, { opacity: pressed ? 0.6 : 1 }]}
            hitSlop={4}
          >
            <Text
              style={[
                styles.qtyBtnText,
                {
                  color: qty === 1 ? colors.mutedForeground : colors.foreground,
                  fontFamily: "Inter_600SemiBold",
                },
              ]}
            >
              −
            </Text>
          </Pressable>
          <Text
            style={[
              styles.qtyValue,
              { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            {qty}
          </Text>
          <Pressable
            onPress={() => {
              setQty((q) => q + 1);
              Haptics.selectionAsync();
            }}
            style={({ pressed }) => [styles.qtyBtn, { opacity: pressed ? 0.6 : 1 }]}
            hitSlop={4}
          >
            <Text
              style={[
                styles.qtyBtnText,
                { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              +
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [
            styles.addBtn,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.82 : 1,
              borderRadius: 10,
            },
          ]}
        >
          <Text
            style={[
              styles.addBtnText,
              { color: colors.primaryForeground, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            Add
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: CARD_WIDTH * 0.75,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  imageFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  info: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 4,
  },
  name: {
    fontSize: 13,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  price: {
    fontSize: 16,
  },
  priceInput: {
    fontSize: 16,
    borderBottomWidth: 1.5,
    minWidth: 60,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  editIcon: {
    marginTop: 2,
  },
  unitLabel: {
    fontSize: 11,
    marginTop: 0,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 8,
  },
  qtySelector: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: 34,
  },
  qtyBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  qtyBtnText: { fontSize: 18, lineHeight: 22 },
  qtyValue: { fontSize: 14, minWidth: 22, textAlign: "center" },
  addBtn: {
    paddingHorizontal: 14,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { fontSize: 13 },
});
