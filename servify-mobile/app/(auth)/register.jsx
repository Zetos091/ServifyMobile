import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Briefcase, UserCheck } from "lucide-react-native";
import { router } from "expo-router";
import Button from "../../components/Button";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)");
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoBox}>
              <Text style={styles.logoLetter}>S</Text>
            </View>
            <Text style={styles.brand}>Servify</Text>
            <Text style={styles.tagline}>Join thousands of users today</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create Account</Text>
            <Text style={styles.cardSubtitle}>Fill in your details to get started</Text>

            {/* Role Toggle */}
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleBtn, role === "client" && styles.roleBtnActive]}
                onPress={() => setRole("client")}
                activeOpacity={0.8}
              >
                <UserCheck size={18} color={role === "client" ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.roleBtnText, role === "client" && styles.roleBtnTextActive]}>Client</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleBtn, role === "provider" && styles.roleBtnActive]}
                onPress={() => setRole("provider")}
                activeOpacity={0.8}
              >
                <Briefcase size={18} color={role === "provider" ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.roleBtnText, role === "provider" && styles.roleBtnTextActive]}>Provider</Text>
              </TouchableOpacity>
            </View>

            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputRow}>
                <User size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Juan dela Cruz"
                  placeholderTextColor={COLORS.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputRow}>
                <Mail size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputRow}>
                <Lock size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Min. 8 characters"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  {showPass ? <EyeOff size={18} color={COLORS.textMuted} /> : <Eye size={18} color={COLORS.textMuted} />}
                </TouchableOpacity>
              </View>
            </View>

            <Button onPress={handleRegister} loading={loading} size="lg" style={{ width: "100%", marginTop: 8 }}>
              Create Account
            </Button>
          </View>

          <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
            <Text style={styles.loginLinkText}>
              Already have an account?{"  "}
              <Text style={styles.loginLinkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 32 },
  logoSection: { alignItems: "center", marginBottom: 28 },
  logoBox: { width: 68, height: 68, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", marginBottom: 12, ...SHADOW.orange },
  logoLetter: { fontSize: 32, fontWeight: "900", color: "#fff" },
  brand: { fontSize: 28, fontWeight: "800", color: COLORS.text },
  tagline: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  card: { backgroundColor: "#fff", borderRadius: RADIUS.xxl, padding: 28, marginBottom: 20, ...SHADOW.md },
  cardTitle: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  cardSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4, marginBottom: 20 },
  roleContainer: { flexDirection: "row", backgroundColor: COLORS.bg, borderRadius: RADIUS.lg, padding: 4, marginBottom: 20 },
  roleBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 11, borderRadius: RADIUS.md },
  roleBtnActive: { backgroundColor: "#fff", ...SHADOW.sm },
  roleBtnText: { fontSize: 14, fontWeight: "600", color: COLORS.textMuted },
  roleBtnTextActive: { color: COLORS.primary },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary, marginBottom: 8 },
  inputRow: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: COLORS.bg },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.text },
  eyeBtn: { padding: 2, marginLeft: 8 },
  loginLink: { alignItems: "center" },
  loginLinkText: { color: COLORS.textSecondary, fontSize: 14 },
  loginLinkBold: { color: COLORS.primary, fontWeight: "700" },
});