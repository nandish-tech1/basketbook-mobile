import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { type CartItem, useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { cart, removeFromCart, updateQty, checkout, pendingCount } = useCart();

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const tabBarHeight = useBottomTabBarHeight();
  const bottomPad = insets.bottom;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    checkout();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View
      style={[
        styles.itemCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.imageWrap,
          { backgroundColor: colors.muted, borderRadius: 12 },
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="cover"
          onError={() => {}}
        />
      </View>

      <View style={styles.itemInfo}>
        <Text
          style={[
            styles.itemName,
            { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
          ]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.itemPrice,
            { color: colors.primary, fontFamily: "Inter_700Bold" },
          ]}
        >
          ₹{(item.price * item.qty).toFixed(2)}
        </Text>
        <Text
          style={[
            styles.itemUnit,
            { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
          ]}
        >
          ₹{item.price % 1 === 0 ? item.price.toFixed(0) : item.price.toFixed(2)} {item.unit ?? "each"}
        </Text>
      </View>

      <View style={styles.itemActions}>
        <Pressable
          onPress={() => {
            removeFromCart(item.productId);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={({ pressed }) => [
            styles.removeBtn,
            { backgroundColor: colors.secondary, opacity: pressed ? 0.6 : 1 },
          ]}
          hitSlop={6}
        >
          <Feather name="trash-2" size={14} color={colors.destructive} />
        </Pressable>

        <View
          style={[
            styles.qtyRow,
            { backgroundColor: colors.secondary, borderRadius: 10 },
          ]}
        >
          <Pressable
            onPress={() => {
              updateQty(item.productId, -1);
              Haptics.selectionAsync();
            }}
            style={({ pressed }) => [
              styles.qtyBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text
              style={[
                styles.qtyBtnText,
                {
                  color: item.qty === 1 ? colors.mutedForeground : colors.foreground,
                  fontFamily: "Inter_600SemiBold",
                },
              ]}
            >
              −
            </Text>
          </Pressable>
          <Text
            style={[
              styles.qtyVal,
              { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            {item.qty}
          </Text>
          <Pressable
            onPress={() => {
              updateQty(item.productId, 1);
              Haptics.selectionAsync();
            }}
            style={({ pressed }) => [
              styles.qtyBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
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
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text
          style={[
            styles.title,
            { color: colors.foreground, fontFamily: "Inter_700Bold" },
          ]}
        >
          Your Basket
        </Text>
        {pendingCount > 0 && (
          <View
            style={[
              styles.countBadge,
              { backgroundColor: colors.accent },
            ]}
          >
            <Text
              style={[
                styles.countText,
                { color: colors.accentForeground, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              {pendingCount} item{pendingCount !== 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="shopping-cart" size={52} color={colors.border} />
          <Text
            style={[
              styles.emptyTitle,
              { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            Basket is empty
          </Text>
          <Text
            style={[
              styles.emptyText,
              { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
            ]}
          >
            Add products from the Shop tab
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.productId}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.list,
              { paddingBottom: tabBarHeight + 160 },
            ]}
            showsVerticalScrollIndicator={false}
          />

          <View
            style={[
              styles.footer,
              {
                backgroundColor: colors.card,
                borderTopColor: colors.border,
                paddingBottom: 16,
                bottom: tabBarHeight,
              },
            ]}
          >
            <View style={styles.totalRow}>
              <Text
                style={[
                  styles.totalLabel,
                  { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
                ]}
              >
                Total
              </Text>
              <Text
                style={[
                  styles.totalValue,
                  { color: colors.foreground, fontFamily: "Inter_700Bold" },
                ]}
              >
                ₹{cartTotal.toFixed(2)}
              </Text>
            </View>

            <Pressable
              onPress={handleCheckout}
              style={({ pressed }) => [
                styles.checkoutBtn,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.85 : 1,
                  borderRadius: 14,
                },
              ]}
            >
              <Feather name="check" size={18} color={colors.primaryForeground} />
              <Text
                style={[
                  styles.checkoutText,
                  { color: colors.primaryForeground, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                Checkout
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: { fontSize: 28, letterSpacing: -0.5 },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countText: { fontSize: 13 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingBottom: 80,
  },
  emptyTitle: { fontSize: 18, marginTop: 8 },
  emptyText: { fontSize: 14 },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  itemCard: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    gap: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  imageWrap: {
    width: 64,
    height: 64,
    overflow: "hidden",
  },
  itemImage: { width: "100%", height: "100%" },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { fontSize: 14, lineHeight: 19 },
  itemPrice: { fontSize: 16 },
  itemUnit: { fontSize: 12 },
  itemActions: {
    alignItems: "center",
    gap: 8,
  },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
    width: 80,
  },
  qtyBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  qtyBtnText: { fontSize: 16 },
  qtyVal: { fontSize: 14, textAlign: "center", minWidth: 20 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 15 },
  totalValue: { fontSize: 24, letterSpacing: -0.5 },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  checkoutText: { fontSize: 16 },
});
