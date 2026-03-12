import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, RADIUS } from "./theme";

/**
 * InputField component
 * @param {string} label
 * @param {ReactNode} icon - Lucide icon component
 * @param {ReactNode} rightIcon - Lucide icon component (for password toggle etc)
 * @param {function} onRightIconPress
 * @param {string} placeholder
 * @param {boolean} secureTextEntry
 * @param {string} keyboardType
 * @param {string} autoCapitalize
 * @param {string} value
 * @param {function} onChangeText
 * @param {object} style - extra style for container
 */
export default function InputField({
  label,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconPress,
  style,
  ...props
}) {
  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        {Icon && <Icon size={18} color={COLORS.textMuted} style={styles.iconLeft} />}
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.textMuted}
          {...props}
        />
        {RightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.iconRight}>
            <RightIcon size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  iconLeft: { marginRight: 10 },
  iconRight: { marginLeft: 8, padding: 2 },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
});