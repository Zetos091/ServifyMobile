import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, SHADOW } from "./theme";

/**
 * SocialButton component
 * @param {string} provider - "google" | "facebook"
 * @param {function} onPress
 */
export default function SocialButton({ provider = "google", onPress }) {
  const config = {
    google: {
      label: "Google",
      color: "#4285F4",
      symbol: "G",
      symbolStyle: { fontStyle: "italic" },
    },
    facebook: {
      label: "Facebook",
      color: "#1877F2",
      symbol: "f",
      symbolStyle: {},
    },
  };

  const { label, color, symbol, symbolStyle } = config[provider];

  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.symbol, { color }, symbolStyle]}>{symbol}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingVertical: 13,
    marginBottom: 12,
    backgroundColor: COLORS.card,
    ...SHADOW.sm,
  },
  symbol: {
    fontSize: 18,
    fontWeight: "900",
    marginRight: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
});