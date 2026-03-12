import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from "react-native";
import { CreditCard, Plus, Trash2, ChevronLeft, Check, X, Wallet } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import AlertModal from "../../components/AlertModal";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

const detectCardType = (num) => {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  return "Card";
};

const CARD_COLORS = { Visa: "#1A1F71", Mastercard: "#EB001B", Amex: "#007BC1", Card: COLORS.primary };

const formatCardNumber = (val) => val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (val) => {
  const d = val.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};
const maskCard = (num) => `•••• •••• •••• ${num.replace(/\s/g, "").slice(-4)}`;

// ✅ Outside screen component — prevents keyboard dismiss
const CardInput = ({ label, value, onChange, placeholder, keyboard, secure, maxLen, suffix }) => (
  <View style={{ flex: 1 }}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboard || "default"}
        secureTextEntry={!!secure}
        maxLength={maxLen}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {suffix ? <Text style={styles.cardTypeTag}>{suffix}</Text> : null}
    </View>
  </View>
);

const INITIAL = [
  { id: "1", type: "Visa", number: "4111 1111 1111 2345", name: "User Name", expiry: "12/26" },
];

export default function PaymentMethods() {
  const [cards, setCards] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (field, formatter) => (value) => {
    const formatted = formatter ? formatter(value) : value;
    setForm((p) => ({ ...p, [field]: formatted }));
    setErrors((p) => ({ ...p, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (form.number.replace(/\s/g, "").length < 13) e.number = "Enter a valid card number";
    if (!form.name.trim()) e.name = "Cardholder name is required";
    if (form.expiry.length < 5) e.expiry = "Enter a valid expiry date";
    if (form.cvv.length < 3) e.cvv = "Enter a valid CVV";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    const type = detectCardType(form.number);
    setCards((prev) => [...prev, { id: Date.now().toString(), type, ...form }]);
    setForm({ number: "", name: "", expiry: "", cvv: "" });
    setErrors({});
    setShowForm(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/(tabs)/profile")}>
              <ChevronLeft size={22} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Payment Methods</Text>
            <View style={{ width: 38 }} />
          </View>

          {cards.map((card) => {
            const color = CARD_COLORS[card.type] || COLORS.primary;
            return (
              <View key={card.id} style={[styles.cardVisual, { backgroundColor: color }]}>
                <View style={styles.cardTop}>
                  <View style={styles.cardChip} />
                  <Text style={styles.cardTypeBadge}>{card.type}</Text>
                </View>
                <Text style={styles.cardNumber}>{maskCard(card.number)}</Text>
                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.cardMiniLabel}>Cardholder</Text>
                    <Text style={styles.cardMiniValue}>{card.name}</Text>
                  </View>
                  <View>
                    <Text style={styles.cardMiniLabel}>Expires</Text>
                    <Text style={styles.cardMiniValue}>{card.expiry}</Text>
                  </View>
                  <TouchableOpacity style={styles.cardDeleteBtn} onPress={() => setDeleteTarget(card.id)}>
                    <Trash2 size={15} color="rgba(255,255,255,0.8)" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          <View style={styles.walletRow}>
            <View style={styles.walletIcon}>
              <Wallet size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.walletLabel}>E-Wallet</Text>
              <Text style={styles.walletDesc}>GCash, PayMaya, and more — coming soon</Text>
            </View>
          </View>

          {cards.length === 0 && !showForm && (
            <View style={styles.emptyState}>
              <CreditCard size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No payment methods</Text>
              <Text style={styles.emptyDesc}>Add a card to pay for services quickly and securely</Text>
            </View>
          )}

          {showForm && (
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Add New Card</Text>
                <TouchableOpacity onPress={() => { setShowForm(false); setErrors({}); }}>
                  <X size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>Card Number</Text>
              <View style={[styles.inputRow, errors.number && styles.inputError]}>
                <CreditCard size={16} color={errors.number ? COLORS.error : COLORS.primary} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  value={form.number}
                  onChangeText={handleChange("number", formatCardNumber)}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="number-pad"
                  maxLength={19}
                  autoCorrect={false}
                />
                {form.number.length > 0 && (
                  <Text style={[styles.cardTypeTag, { color: CARD_COLORS[detectCardType(form.number)] }]}>
                    {detectCardType(form.number)}
                  </Text>
                )}
              </View>
              {errors.number ? <Text style={styles.errorText}>{errors.number}</Text> : null}

              <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Cardholder Name</Text>
              <View style={[styles.inputRow, errors.name && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  value={form.name}
                  onChangeText={handleChange("name")}
                  placeholder="As it appears on card"
                  placeholderTextColor={COLORS.textMuted}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

              <View style={styles.rowFields}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>Expiry Date</Text>
                  <View style={[styles.inputRow, errors.expiry && styles.inputError]}>
                    <TextInput
                      style={styles.input}
                      value={form.expiry}
                      onChangeText={handleChange("expiry", formatExpiry)}
                      placeholder="MM/YY"
                      placeholderTextColor={COLORS.textMuted}
                      keyboardType="number-pad"
                      maxLength={5}
                      autoCorrect={false}
                    />
                  </View>
                  {errors.expiry ? <Text style={styles.errorText}>{errors.expiry}</Text> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>CVV</Text>
                  <View style={[styles.inputRow, errors.cvv && styles.inputError]}>
                    <TextInput
                      style={styles.input}
                      value={form.cvv}
                      onChangeText={handleChange("cvv", (v) => v.replace(/\D/g, "").slice(0, 4))}
                      placeholder="•••"
                      placeholderTextColor={COLORS.textMuted}
                      keyboardType="number-pad"
                      secureTextEntry
                      maxLength={4}
                      autoCorrect={false}
                    />
                  </View>
                  {errors.cvv ? <Text style={styles.errorText}>{errors.cvv}</Text> : null}
                </View>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd} activeOpacity={0.85}>
                <Check size={16} color="#fff" />
                <Text style={styles.saveBtnText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          )}

          {!showForm && (
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)} activeOpacity={0.85}>
              <Plus size={18} color={COLORS.primary} />
              <Text style={styles.addBtnText}>Add New Card</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>

      <AlertModal
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        variant="error"
        title="Remove Card?"
        message="This card will be permanently removed from your payment methods."
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={() => { setCards((p) => p.filter((c) => c.id !== deleteTarget)); setDeleteTarget(null); }}
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
  cardVisual: { borderRadius: RADIUS.xxl, padding: 22, marginBottom: 14, minHeight: 160 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  cardChip: { width: 36, height: 26, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.3)", borderWidth: 1, borderColor: "rgba(255,255,255,0.4)" },
  cardTypeBadge: { color: "#fff", fontWeight: "800", fontSize: 16, opacity: 0.9 },
  cardNumber: { color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 3, marginBottom: 20 },
  cardBottom: { flexDirection: "row", alignItems: "flex-end", gap: 24 },
  cardMiniLabel: { color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  cardMiniValue: { color: "#fff", fontSize: 13, fontWeight: "700" },
  cardDeleteBtn: { marginLeft: "auto", padding: 6 },
  walletRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: RADIUS.xl, padding: 16, marginBottom: 16, gap: 14, ...SHADOW.sm },
  walletIcon: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center" },
  walletLabel: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  walletDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  emptyState: { alignItems: "center", paddingVertical: 48, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  emptyDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", lineHeight: 19 },
  formCard: { backgroundColor: "#fff", borderRadius: RADIUS.xxl, padding: 20, marginBottom: 16, ...SHADOW.sm, gap: 8 },
  formHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  formTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  fieldLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.bg, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1.5, borderColor: COLORS.border },
  inputError: { borderColor: COLORS.error, backgroundColor: "#FFF1F2" },
  input: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: "500" },
  cardTypeTag: { fontSize: 12, fontWeight: "700" },
  rowFields: { flexDirection: "row", gap: 12 },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 4 },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 14, marginTop: 8, ...SHADOW.orange },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fff", borderRadius: RADIUS.xl, paddingVertical: 16, borderWidth: 1.5, borderColor: COLORS.primary, borderStyle: "dashed" },
  addBtnText: { color: COLORS.primary, fontSize: 15, fontWeight: "700" },
});