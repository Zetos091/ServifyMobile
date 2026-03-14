import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView,
} from "react-native";
import { X } from "lucide-react-native";
import { COLORS, RADIUS, SHADOW } from "./theme";

const RATINGS = ["4.5+ Stars", "4+ Stars", "3.5+ Stars", "3 & below"];

/**
 * FilterModal component
 * @param {boolean} visible
 * @param {function} onClose
 * @param {object} filters - { maxPrice, selectedRating, selectedCategories }
 * @param {function} onFilterChange
 * @param {array} categories - [{ id, name, service_count }]
 */
export default function FilterModal({ visible, onClose, filters, onFilterChange, categories = [] }) {
  const { maxPrice = 25000, selectedRating = "" } = filters;

  const update = (patch) => onFilterChange({ ...filters, ...patch });

  const clearAll = () => {
    onFilterChange({ maxPrice: 25000, selectedRating: "", selectedCategories: [] });
  };

  const activeCount =
    (maxPrice < 25000 ? 1 : 0) +
    (selectedRating ? 1 : 0);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Filters {activeCount > 0 && <Text style={styles.badge}>{activeCount}</Text>}</Text>
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

          {/* Max Price */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Max Price</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>₱500</Text>
              <Text style={[styles.priceLabel, { color: COLORS.primary, fontWeight: "700" }]}>
                ₱{maxPrice.toLocaleString()}
              </Text>
            </View>
            {/* Custom slider using steps */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sliderSteps}
            >
              {[500, 2500, 5000, 7500, 10000, 15000, 20000, 25000].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[styles.stepBtn, maxPrice === val && styles.stepBtnActive]}
                  onPress={() => update({ maxPrice: val })}
                >
                  <Text style={[styles.stepText, maxPrice === val && styles.stepTextActive]}>
                    ₱{val >= 1000 ? `${val / 1000}k` : val}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Minimum Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minimum Rating</Text>
            {RATINGS.map((rating) => (
              <TouchableOpacity
                key={rating}
                style={styles.radioRow}
                onPress={() => update({ selectedRating: selectedRating === rating ? "" : rating })}
                activeOpacity={0.7}
              >
                <View style={[styles.radio, selectedRating === rating && styles.radioActive]}>
                  {selectedRating === rating && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.optionText}>{rating}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>

        {/* Apply button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.applyText}>Apply Filters{activeCount > 0 ? ` (${activeCount})` : ""}</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  closeBtn: { padding: 4 },
  title: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  badge: { color: COLORS.primary },
  clearText: { fontSize: 14, fontWeight: "600", color: COLORS.primary },

  body: { paddingHorizontal: 20, paddingBottom: 24 },

  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 14,
    letterSpacing: 0.2,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: "500" },

  sliderSteps: { flexDirection: "row", gap: 8, paddingRight: 8 },
  stepBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
  },
  stepBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepText: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  stepTextActive: { color: "#fff" },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  optionText: { fontSize: 14, color: COLORS.text },

  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 15,
    alignItems: "center",
    ...SHADOW.orange,
  },
  applyText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});