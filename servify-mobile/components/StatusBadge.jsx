import { View, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS } from "./theme";

const VARIANTS = {
  confirmed: { bg: "#F0FDF4", text: "#15803D", label: "Confirmed" },
  pending:   { bg: "#FFFBEB", text: "#B45309", label: "Pending" },
  completed: { bg: "#EFF6FF", text: "#1D4ED8", label: "Completed" },
  cancelled: { bg: "#FFF1F2", text: "#BE123C", label: "Cancelled" },
  popular:   { bg: "#FFF7ED", text: COLORS.primary, label: "Popular" },
  topRated:  { bg: "#FFF7ED", text: COLORS.primary, label: "Top Rated" },
  new:       { bg: "#F0FDF4", text: "#15803D", label: "New" },
};

/**
 * StatusBadge
 * @param {string} status - "confirmed" | "pending" | "completed" | "cancelled" | "popular" | "topRated" | "new"
 * @param {string} customLabel - override default label
 */
export default function StatusBadge({ status, customLabel }) {
  const config = VARIANTS[status] || VARIANTS.pending;
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>
        {customLabel || config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  text: { fontSize: 11, fontWeight: "700" },
});