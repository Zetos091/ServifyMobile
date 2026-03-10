import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Search, X, SlidersHorizontal } from "lucide-react-native";
import { COLORS, RADIUS, SHADOW } from "./theme";

/**
 * SearchBar component
 * @param {string} value
 * @param {function} onChangeText
 * @param {string} placeholder
 * @param {function} onFilterPress - shows filter button if provided
 */
export default function SearchBar({ value, onChangeText, placeholder = "Search...", onFilterPress }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        <Search size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
        />
        {value?.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")} style={styles.clearBtn}>
            <X size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {onFilterPress && (
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
          <SlidersHorizontal size={18} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  bar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...SHADOW.sm,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.text },
  clearBtn: { padding: 2 },
  filterBtn: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    width: 46,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW.sm,
  },
});