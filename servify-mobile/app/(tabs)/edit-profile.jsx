import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { User, Mail, Phone, Camera, ChevronLeft, Check } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import AlertModal from "../../components/AlertModal";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";
import { useAuth } from "../../hooks/useAuth";  // ✅ useAuth instead of useUser

const Field = ({ icon: Icon, label, field, placeholder, keyboard, value, error, onChange }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.inputRow, error && styles.inputError]}>
      <Icon size={16} color={error ? COLORS.error : COLORS.primary} style={{ marginRight: 10 }} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboard || "default"}
        autoCapitalize={field === "name" ? "words" : "none"}
        autoCorrect={false}
      />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export default function EditProfile() {
  const { user } = useAuth();  // ✅ use useAuth

  const [form, setForm] = useState({
    name: user?.full_name || "",   // ✅ matches your auth user shape
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [errors, setErrors] = useState({});
  const [successModal, setSuccessModal] = useState(false);

  const handleChange = (field) => (value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      // TODO: call your API to update user, e.g. await updateProfile(form)
      setSuccessModal(true);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 48 }}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/(tabs)/profile")}>
                <ChevronLeft size={22} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.title}>Edit Profile</Text>
              <View style={{ width: 38 }} />
            </View>

            <View style={styles.avatarSection}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {form.name?.[0]?.toUpperCase() || "U"}
                  </Text>
                </View>
                <TouchableOpacity style={styles.cameraBtn}>
                  <Camera size={14} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </View>

            <View style={styles.formCard}>
              <Field
                icon={User} label="Full Name" field="name"
                placeholder="Enter your full name"
                value={form.name} error={errors.name}
                onChange={handleChange("name")}
              />
              <Field
                icon={Mail} label="Email Address" field="email"
                placeholder="Enter your email" keyboard="email-address"
                value={form.email} error={errors.email}
                onChange={handleChange("email")}
              />
              <Field
                icon={Phone} label="Phone Number" field="phone"
                placeholder="Enter your phone number" keyboard="phone-pad"
                value={form.phone} error={errors.phone}
                onChange={handleChange("phone")}
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Check size={18} color="#fff" />
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={successModal}
        onClose={() => { setSuccessModal(false); router.push("/(tabs)/profile"); }}
        variant="success"
        title="Profile Updated!"
        message="Your personal information has been saved successfully."
        confirmText="Done"
        onConfirm={() => router.push("/(tabs)/profile")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20, paddingTop: 0 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 24 },
  backBtn: { width: 38, height: 38, borderRadius: RADIUS.md, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", ...SHADOW.sm },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  avatarSection: { alignItems: "center", marginBottom: 28 },
  avatarWrap: { position: "relative", marginBottom: 10 },
  avatar: { width: 90, height: 90, borderRadius: RADIUS.xl, backgroundColor: "#FFF7ED", justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#FED7AA" },
  avatarText: { fontSize: 36, fontWeight: "800", color: COLORS.primary },
  cameraBtn: { position: "absolute", bottom: 0, right: 0, backgroundColor: COLORS.primary, borderRadius: RADIUS.full, width: 28, height: 28, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff" },
  changePhotoText: { fontSize: 13, fontWeight: "600", color: COLORS.primary },
  formCard: { backgroundColor: "#fff", borderRadius: RADIUS.xxl, padding: 20, marginBottom: 20, ...SHADOW.sm, gap: 18 },
  fieldWrap: {},
  fieldLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.bg, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1.5, borderColor: COLORS.border },
  inputError: { borderColor: COLORS.error, backgroundColor: "#FFF1F2" },
  input: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: "500" },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 5, marginLeft: 2 },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 16, ...SHADOW.orange },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});