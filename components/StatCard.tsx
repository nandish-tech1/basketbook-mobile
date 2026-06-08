import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface StatCardProps {
  label: string;
  value: string;
  accent?: boolean;
  small?: boolean;
}

export function StatCard({ label, value, accent = false, small = false }: StatCardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        small && styles.cardSmall,
        {
          backgroundColor: accent ? colors.primary : colors.card,
          borderColor: accent ? colors.primary : colors.border,
        },
      ]}
    >
      <Text
        style={[
          small ? styles.valueSmall : styles.value,
          {
            color: accent ? colors.primaryForeground : colors.foreground,
            fontFamily: "Inter_700Bold",
          },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.label,
          {
            color: accent
              ? "rgba(255,255,255,0.8)"
              : colors.mutedForeground,
            fontFamily: "Inter_400Regular",
          },
        ]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardSmall: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  value: {
    fontSize: 20,
    marginBottom: 3,
    textAlign: "center",
  },
  valueSmall: {
    fontSize: 18,
    marginBottom: 2,
    textAlign: "center",
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
