import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS, RADIUS, SHADOW } from "./theme";

/**
 * Button component
 * @param {string} variant - "primary" | "secondary" | "outline" | "ghost" | "danger"
 * @param {string} size - "sm" | "md" | "lg"
 * @param {boolean} loading
 * @param {boolean} disabled
 * @param {ReactNode} icon - Lucide icon component
 * @param {string} iconPosition - "left" | "right"
 */
export default function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  style,
}) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : COLORS.primary} size="small" />
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon
              size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
              color={variant === "primary" ? "#fff" : variant === "danger" ? COLORS.error : COLORS.primary}
              style={styles.iconLeft}
            />
          )}
          <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`]]}>
            {children}
          </Text>
          {Icon && iconPosition === "right" && (
            <Icon
              size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
              color={variant === "primary" ? "#fff" : variant === "danger" ? COLORS.error : COLORS.primary}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.lg,
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
    ...SHADOW.orange,
  },
  secondary: {
    backgroundColor: COLORS.primaryLight,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: "#FFF1F1",
    borderWidth: 1.5,
    borderColor: "#FECACA",
  },
  disabled: {
    opacity: 0.5,
  },
  // Sizes
  size_sm: { paddingHorizontal: 14, paddingVertical: 8 },
  size_md: { paddingHorizontal: 20, paddingVertical: 13 },
  size_lg: { paddingHorizontal: 24, paddingVertical: 16 },
  // Text
  text: { fontWeight: "700" },
  text_primary: { color: "#fff" },
  text_secondary: { color: COLORS.primary },
  text_outline: { color: COLORS.primary },
  text_ghost: { color: COLORS.primary },
  text_danger: { color: COLORS.error },
  textSize_sm: { fontSize: 13 },
  textSize_md: { fontSize: 15 },
  textSize_lg: { fontSize: 16 },
  // Icon spacing
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
});