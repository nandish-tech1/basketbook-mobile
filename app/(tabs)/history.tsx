import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { type CartItem, type HistoryEntry, useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";

function fmtAmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

interface MonthGroup {
  key: string;
  label: string;
  sessions: HistoryEntry[];
  total: number;
  itemCount: number;
  products: { name: string; qty: number; unitPrice: number; amount: number; unit: string }[];
}

function MonthCard({ group }: { group: MonthGroup }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconWrap, { backgroundColor: colors.accent }]}>
            <Feather name="calendar" size={18} color={colors.accentForeground} />
          </View>
          <View style={styles.cardMeta}>
            <Text
              style={[styles.cardDate, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}
            >
              {group.label}
            </Text>
            <Text
              style={[styles.cardTime, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}
            >
              {group.sessions.length} session{group.sessions.length !== 1 ? "s" : ""} · {group.itemCount} items
            </Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.cardTotal, { color: colors.primary, fontFamily: "Inter_700Bold" }]}>
            {fmtAmt(group.total)}
          </Text>
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.mutedForeground}
          />
        </View>
      </View>

      {expanded && (
        <View style={[styles.itemList, { borderTopColor: colors.border }]}>
          <Text
            style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}
          >
            Products purchased
          </Text>
          {group.products.map((p) => (
            <View key={p.name} style={styles.itemRow}>
              <Text
                style={[styles.itemName, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
                numberOfLines={1}
              >
                {p.name}
              </Text>
              <View style={styles.itemPriceQtyContainer}>
                <Text
                  style={[styles.itemUnit, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}
                >
                  ₹{p.unitPrice} {p.unit} × {p.qty}
                </Text>
              </View>
              <Text
                style={[styles.itemTotal, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}
              >
                {fmtAmt(p.amount)}
              </Text>
            </View>
          ))}
          <View style={[styles.sessionTotal, { borderTopColor: colors.border }]}>
            <Text
              style={[styles.sessionTotalLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}
            >
              Monthly total
            </Text>
            <Text
              style={[styles.sessionTotalValue, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}
            >
              {fmtAmt(group.total)}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

function SessionCard({ entry }: { entry: HistoryEntry }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const totalItems = entry.items.reduce((s, i) => s + i.qty, 0);

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconWrap, { backgroundColor: colors.accent }]}>
            <Feather name="shopping-bag" size={18} color={colors.accentForeground} />
          </View>
          <View style={styles.cardMeta}>
            <Text
              style={[styles.cardDate, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}
            >
              {formatDate(entry.date)}
            </Text>
            <Text
              style={[styles.cardTime, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}
            >
              {formatTime(entry.date)} · {totalItems} item{totalItems !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.cardTotal, { color: colors.primary, fontFamily: "Inter_700Bold" }]}>
            {fmtAmt(entry.total)}
          </Text>
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.mutedForeground}
          />
        </View>
      </View>

      {expanded && (
        <View style={[styles.itemList, { borderTopColor: colors.border }]}>
          {entry.items.map((item) => (
            <View key={item.productId} style={styles.itemRow}>
              <Text
                style={[styles.itemName, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <View style={styles.itemPriceQtyContainer}>
                <Text
                  style={[styles.itemUnit, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}
                >
                  ₹{item.price} {item.unit} × {item.qty}
                </Text>
              </View>
              <Text
                style={[styles.itemTotal, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}
              >
                {fmtAmt(item.price * item.qty)}
              </Text>
            </View>
          ))}
          <View style={[styles.sessionTotal, { borderTopColor: colors.border }]}>
            <Text
              style={[styles.sessionTotalLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}
            >
              Session total
            </Text>
            <Text
              style={[styles.sessionTotalValue, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}
            >
              {fmtAmt(entry.total)}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

type TabType = "monthly" | "sessions";

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { history } = useCart();
  const [activeTab, setActiveTab] = useState<TabType>("monthly");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const allTimeTotal = history.reduce((sum, e) => sum + e.total, 0);

  const monthGroups: MonthGroup[] = useMemo(() => {
    const map = new Map<string, HistoryEntry[]>();
    for (const entry of history) {
      const key = monthKey(entry.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(entry);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, sessions]) => {
        const total = sessions.reduce((s, e) => s + e.total, 0);
        const itemCount = sessions.reduce(
          (s, e) => s + e.items.reduce((ss, i) => ss + i.qty, 0),
          0
        );
        const productMap = new Map<
          string,
          { name: string; qty: number; amount: number; unit: string; unitPrice: number }
        >();
        for (const session of sessions) {
          for (const item of session.items) {
            const existing = productMap.get(item.productId);
            if (existing) {
              existing.qty += item.qty;
              existing.amount += item.price * item.qty;
            } else {
              productMap.set(item.productId, {
                name: item.name,
                qty: item.qty,
                amount: item.price * item.qty,
                unit: item.unit ?? "",
                unitPrice: item.price,
              });
            }
          }
        }
        return {
          key,
          label: monthLabel(key),
          sessions,
          total,
          itemCount,
          products: Array.from(productMap.values()),
        };
      });
  }, [history]);

  const isEmpty = history.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
            History
          </Text>
          {!isEmpty && (
            <Text style={[styles.allTime, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              All time: {fmtAmt(allTimeTotal)}
            </Text>
          )}
        </View>

        {!isEmpty && (
          <View style={[styles.toggleRow, { backgroundColor: colors.secondary, borderRadius: 12 }]}>
            {(["monthly", "sessions"] as TabType[]).map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.toggleBtn,
                  activeTab === tab && {
                    backgroundColor: colors.card,
                    borderRadius: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.08,
                    shadowRadius: 3,
                    elevation: 2,
                  },
                ]}
              >
                <Feather
                  name={tab === "monthly" ? "bar-chart-2" : "list"}
                  size={14}
                  color={activeTab === tab ? colors.primary : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.toggleText,
                    {
                      color: activeTab === tab ? colors.foreground : colors.mutedForeground,
                      fontFamily: activeTab === tab ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {tab === "monthly" ? "Monthly" : "Sessions"}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {isEmpty ? (
        <View style={styles.empty}>
          <Feather name="clock" size={52} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
            No sessions yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Checkout from your basket to record a session
          </Text>
        </View>
      ) : activeTab === "monthly" ? (
        <FlatList
          data={monthGroups}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => <MonthCard group={item} />}
          contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 90 }]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SessionCard entry={item} />}
          contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 90 }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTop: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: { fontSize: 28, letterSpacing: -0.5 },
  allTime: { fontSize: 13 },
  toggleRow: {
    flexDirection: "row",
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  toggleText: { fontSize: 13 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingBottom: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 18, marginTop: 8 },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardMeta: { gap: 2, flex: 1 },
  cardDate: { fontSize: 15 },
  cardTime: { fontSize: 13 },
  cardRight: { alignItems: "flex-end", gap: 4 },
  cardTotal: { fontSize: 18 },
  itemList: {
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 8,
  },
  sectionLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 2 },
  itemName: { flex: 1, fontSize: 13 },
  itemUnit: { fontSize: 11 },
  itemQtyPrice: { fontSize: 13 },
  itemPriceQtyContainer: { flex: 1.5, paddingHorizontal: 4 },
  itemTotal: { fontSize: 13, minWidth: 52, textAlign: "right" },
  sessionTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  sessionTotalLabel: { fontSize: 13 },
  sessionTotalValue: { fontSize: 15 },
});
