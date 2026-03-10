import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from "react-native";
import { MapPin, Home, Briefcase, Plus, Trash2, ChevronLeft, Check, X } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import AlertModal from "../../components/AlertModal";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

const LABEL_ICONS = { Home, Work: Briefcase, Other: MapPin };
const LABEL_COLORS = { Home: "#3B82F6", Work: "#8B5CF6", Other: COLORS.primary };

const INITIAL = [
  { id: "1", label: "Home", address: "123 Main Street, Apt 4B", city: "New York, NY 10001" },
  { id: "2", label: "Work", address: "456 Office Ave, Floor 12", city: "New York, NY 10018" },
];

// ✅ Outside the screen component — prevents keyboard dismiss on re-render
const AddressInput = ({ label, icon: Icon, value, error, onChange, placeholder }) => (
  <View>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.inputRow, error && styles.inputError]}>
      <Icon size={16} color={error ? COLORS.error : COLORS.primary} style={{ marginRight: 10 }} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        autoCorrect={false}
      />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ label: "Home", address: "", city: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.address.trim()) e.address = "Street address is required";
    if (!form.city.trim()) e.city = "City is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    setAddresses((prev) => [...prev, { id: Date.now().toString(), ...form }]);
    setForm({ label: "Home", address: "", city: "" });
    setErrors({});
    setShowForm(false);
  };

  const handleDelete = () => {
    setAddresses((prev) => prev.filter((a) => a.id !== deleteTarget));
    setDeleteTarget(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/(tabs)/profile")}>
              <ChevronLeft size={22} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Saved Addresses</Text>
            <View style={{ width: 38 }} />
          </View>

          {addresses.length > 0 && (
            <View style={styles.listCard}>
              {addresses.map((item, index) => {
                const Icon = LABEL_ICONS[item.label] || MapPin;
                const color = LABEL_COLORS[item.label] || COLORS.primary;
                return (
                  <View key={item.id} style={[styles.addressItem, index < addresses.length - 1 && styles.addressBorder]}>
                    <View style={[styles.iconCircle, { backgroundColor: color + "18" }]}>
                      <Icon size={18} color={color} />
                    </View>
                    <View style={styles.addressText}>
                      <Text style={styles.addressLabel}>{item.label}</Text>
                      <Text style={styles.addressStreet}>{item.address}</Text>
                      <Text style={styles.addressCity}>{item.city}</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => setDeleteTarget(item.id)}>
                      <Trash2 size={16} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {addresses.length === 0 && !showForm && (
            <View style={styles.emptyState}>
              <MapPin size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No saved addresses</Text>
              <Text style={styles.emptyDesc}>Add your home, work, or other locations for faster booking</Text>
            </View>
          )}

          {showForm && (
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>New Address</Text>
                <TouchableOpacity onPress={() => { setShowForm(false); setErrors({}); }}>
                  <X size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>Label</Text>
              <View style={styles.labelRow}>
                {["Home", "Work", "Other"].map((l) => {
                  const color = LABEL_COLORS[l];
                  const active = form.label === l;
                  return (
                    <TouchableOpacity
                      key={l}
                      style={[styles.labelChip, active && { backgroundColor: color, borderColor: color }]}
                      onPress={() => setForm((p) => ({ ...p, label: l }))}
                    >
                      <Text style={[styles.labelChipText, active && { color: "#fff" }]}>{l}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <AddressInput
                label="Street Address"
                icon={MapPin}
                value={form.address}
                error={errors.address}
                onChange={handleChange("address")}
                placeholder="123 Main Street, Apt 4B"
              />
              <View style={{ height: 14 }} />
              <AddressInput
                label="City / State / ZIP"
                icon={MapPin}
                value={form.city}
                error={errors.city}
                onChange={handleChange("city")}
                placeholder="New York, NY 10001"
              />

              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd} activeOpacity={0.85}>
                <Check size={16} color="#fff" />
                <Text style={styles.saveBtnText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          )}

          {!showForm && (
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)} activeOpacity={0.85}>
              <Plus size={18} color={COLORS.primary} />
              <Text style={styles.addBtnText}>Add New Address</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>

      <AlertModal
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        variant="error"
        title="Delete Address?"
        message="This address will be permanently removed from your saved locations."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 24 },
  backBtn: { width: 38, height: 38, borderRadius: RADIUS.md, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", ...SHADOW.sm },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  listCard: { backgroundColor: "#fff", borderRadius: RADIUS.xxl, marginBottom: 16, overflow: "hidden", ...SHADOW.sm },
  addressItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  addressBorder: { borderBottomWidth: 1, borderBottomColor: "#FAF9F8" },
  iconCircle: { width: 44, height: 44, borderRadius: RADIUS.md, justifyContent: "center", alignItems: "center", marginRight: 14 },
  addressText: { flex: 1 },
  addressLabel: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginBottom: 3 },
  addressStreet: { fontSize: 13, color: COLORS.textSecondary },
  addressCity: { fontSize: 12, color: COLORS.textMuted, marginTop: 1 },
  deleteBtn: { padding: 8 },
  emptyState: { alignItems: "center", paddingVertical: 48, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  emptyDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", lineHeight: 19 },
  formCard: { backgroundColor: "#fff", borderRadius: RADIUS.xxl, padding: 20, marginBottom: 16, ...SHADOW.sm, gap: 8 },
  formHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  formTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  fieldLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  labelRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  labelChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.bg },
  labelChipText: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.bg, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1.5, borderColor: COLORS.border },
  inputError: { borderColor: COLORS.error, backgroundColor: "#FFF1F2" },
  input: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: "500" },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 4 },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 14, marginTop: 8, ...SHADOW.orange },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fff", borderRadius: RADIUS.xl, paddingVertical: 16, borderWidth: 1.5, borderColor: COLORS.primary, borderStyle: "dashed" },
  addBtnText: { color: COLORS.primary, fontSize: 15, fontWeight: "700" },
});