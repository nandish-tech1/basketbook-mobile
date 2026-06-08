import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProductCard } from "@/components/ProductCard";
import { StatCard } from "@/components/StatCard";
import { useCart } from "@/context/CartContext";
import { CATEGORIES, PRODUCT_CATALOG, type Product } from "@/data/products";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ShopScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { spentToday, pendingCount, history } = useCart();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered: Product[] =
    activeCategory === null
      ? PRODUCT_CATALOG
      : PRODUCT_CATALOG.filter((p) => p.category === activeCategory);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const renderHeader = () => (
    <View>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text
          style={[
            styles.appName,
            { color: colors.foreground, fontFamily: "Inter_700Bold" },
          ]}
        >
          BasketBook
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
          ]}
        >
          Your grocery tracker
        </Text>
      </View>

      <View style={styles.statsBlock}>
        <StatCard
          label="Spent Today"
          value={
            spentToday >= 1000
              ? `₹${(spentToday / 1000).toFixed(1)}k`
              : `₹${spentToday % 1 === 0 ? spentToday.toFixed(0) : spentToday.toFixed(2)}`
          }
          accent
        />
        <View style={styles.statsRow}>
          <StatCard label="Pending Items" value={String(pendingCount)} small />
          <StatCard label="Sessions" value={String(history.length)} small />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.foreground, fontFamily: "Inter_700Bold" },
          ]}
        >
          Shop Products
        </Text>
      </View>

      <FlatList
        data={["All", ...CATEGORIES]}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => {
          const isActive =
            item === "All" ? activeCategory === null : activeCategory === item;
          return (
            <Pressable
              onPress={() => setActiveCategory(item === "All" ? null : item)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.card,
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: isActive ? colors.primaryForeground : colors.mutedForeground,
                    fontFamily: isActive ? "Inter_600SemiBold" : "Inter_400Regular",
                  },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 90 },
        ]}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => <ProductCard product={item} />}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filtered.length > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appName: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  statsBlock: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    letterSpacing: -0.3,
  },
  filterList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterText: {
    fontSize: 13,
  },
  grid: {
    paddingHorizontal: 16,
  },
  row: {
    gap: 12,
  },
});
