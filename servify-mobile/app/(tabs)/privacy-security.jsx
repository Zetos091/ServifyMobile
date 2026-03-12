import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Switch, Modal, TextInput } from "react-native";
import { ChevronLeft, Lock, Eye, EyeOff, ShieldCheck, Trash2, Check, X } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import AlertModal from "../../components/AlertModal";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

// Defined outside to prevent keyboard dismiss
const PwInput = ({ label, value, onChange, placeholder, error }) => {
  const [show, setShow] = useState(false);
  return (
    <View style={pw.wrap}>
      <Text style={pw.label}>{label}</Text>
      <View style={[pw.row, error && pw.rowError]}>
        <TextInput
          style={pw.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={!show}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={() => setShow((s) => !s)} style={{ padding: 4 }}>
          {show ? <EyeOff size={18} color={COLORS.textMuted} /> : <Eye size={18} color={COLORS.textMuted} />}
        </TouchableOpacity>
      </View>
      {error ? <Text style={pw.error}>{error}</Text> : null}
    </View>
  );
};

export default function PrivacySecurity() {
  const [biometrics, setBiometrics] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (v) => {
    setForm((p) => ({ ...p, [field]: v }));
    setErrors((p) => ({ ...p, [field]: null }));
  };

  const validatePw = () => {
    const e = {};
    if (!form.current.trim()) e.current = "Current password is required";
    if (form.newPw.length < 8) e.newPw = "Password must be at least 8 characters";
    if (form.newPw !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSavePw = () => {
    if (!validatePw()) return;
    setShowPwModal(false);
    setForm({ current: "", newPw: "", confirm: "" });
    setErrors({});
    setShowSuccessAlert(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/(tabs)/profile")}>
              <ChevronLeft size={22} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Privacy & Security</Text>
            <View style={{ width: 38 }} />
          </View>

          {/* Password */}
          <Text style={styles.sectionLabel}>Account Security</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={() => setShowPwModal(true)} activeOpacity={0.7}>
              <View style={styles.iconWrap}>
                <Lock size={18} color={COLORS.primary} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Change Password</Text>
                <Text style={styles.rowDesc}>Update your account password</Text>
              </View>
              <ChevronLeft size={16} color={COLORS.textMuted} style={{ transform: [{ rotate: "180deg" }] }} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.iconWrap}>
                <ShieldCheck size={18} color={COLORS.primary} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Two-Factor Auth</Text>
                <Text style={styles.rowDesc}>Extra layer of account security</Text>
              </View>
              <Switch
                value={twoFA}
                onValueChange={setTwoFA}
                trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
                thumbColor={twoFA ? COLORS.primary : "#fff"}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.iconWrap}>
                <ShieldCheck size={18} color={COLORS.primary} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Biometric Login</Text>
                <Text style={styles.rowDesc}>Use fingerprint or face to log in</Text>
              </View>
              <Switch
                value={biometrics}
                onValueChange={setBiometrics}
                trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
                thumbColor={biometrics ? COLORS.primary : "#fff"}
              />
            </View>
          </View>

          {/* Danger zone */}
          <Text style={styles.sectionLabel}>Danger Zone</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={() => setShowDeleteAlert(true)} activeOpacity={0.7}>
              <View style={[styles.iconWrap, { backgroundColor: "#FFF1F2" }]}>
                <Trash2 size={18} color={COLORS.error} />
              </View>
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: COLORS.error }]}>Delete Account</Text>
                <Text style={styles.rowDesc}>Permanently remove your account and data</Text>
              </View>
              <ChevronLeft size={16} color={COLORS.textMuted} style={{ transform: [{ rotate: "180deg" }] }} />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={showPwModal} transparent animationType="slide">
        <View style={modal.overlay}>
          <View style={modal.sheet}>
            <View style={modal.header}>
              <Text style={modal.title}>Change Password</Text>
              <TouchableOpacity onPress={() => { setShowPwModal(false); setForm({ current: "", newPw: "", confirm: "" }); setErrors({}); }}>
                <X size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <PwInput label="Current Password" value={form.current} onChange={handleChange("current")} placeholder="Enter current password" error={errors.current} />
            <PwInput label="New Password" value={form.newPw} onChange={handleChange("newPw")} placeholder="At least 8 characters" error={errors.newPw} />
            <PwInput label="Confirm New Password" value={form.confirm} onChange={handleChange("confirm")} placeholder="Repeat new password" error={errors.confirm} />
            <TouchableOpacity style={modal.saveBtn} onPress={handleSavePw} activeOpacity={0.85}>
              <Check size={16} color="#fff" />
              <Text style={modal.saveBtnText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AlertModal
        visible={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        variant="success"
        title="Password Updated!"
        message="Your password has been changed successfully."
        confirmText="Done"
        onConfirm={() => setShowSuccessAlert(false)}
      />

      <AlertModal
        visible={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        variant="error"
        title="Delete Account?"
        message="This will permanently delete your account and all your data. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => setShowDeleteAlert(false)}
      />
    </SafeAreaView>
  );
}

const pw = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.bg, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1.5, borderColor: COLORS.border },
  rowError: { borderColor: COLORS.error, backgroundColor: "#FFF1F2" },
  input: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: "500" },
  error: { fontSize: 12, color: COLORS.error, marginTop: 5 },
});

const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(28,25,23,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 17, fontWeight: "800", color: COLORS.text },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 14, marginTop: 8, ...SHADOW.orange },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 24 },
  backBtn: { width: 38, height: 38, borderRadius: RADIUS.md, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", ...SHADOW.sm },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  sectionLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
  card: { backgroundColor: "#fff", borderRadius: RADIUS.xl, overflow: "hidden", marginBottom: 24, ...SHADOW.sm },
  row: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  iconWrap: { width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight || "#FFF7ED", justifyContent: "center", alignItems: "center" },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  rowDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 16 },
});