import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react-native";
import { router } from "expo-router";
import Button from "../../components/Button";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)");
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>S</Text>
          </View>
          <Text style={styles.brand}>Servify</Text>
          <Text style={styles.tagline}>Your trusted service marketplace</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>Sign in to your account</Text>

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
                placeholder="••••••••"
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

          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            onPress={handleLogin}
            loading={loading}
            icon={ArrowRight}
            iconPosition="right"
            size="lg"
            style={{ width: "100%", marginTop: 4 }}
          >
            Sign In
          </Button>
        </View>

        <TouchableOpacity style={styles.registerLink} onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.registerLinkText}>
            Don't have an account?{"  "}
            <Text style={styles.registerLinkBold}>Create one</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  logoSection: { alignItems: "center", marginBottom: 32 },
  logoBox: {
    width: 68, height: 68, borderRadius: 22,
    backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center",
    marginBottom: 12, ...SHADOW.orange,
  },
  logoLetter: { fontSize: 32, fontWeight: "900", color: "#fff" },
  brand: { fontSize: 28, fontWeight: "800", color: COLORS.text },
  tagline: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  card: { backgroundColor: "#fff", borderRadius: RADIUS.xxl, padding: 28, marginBottom: 20, ...SHADOW.md },
  cardTitle: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  cardSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4, marginBottom: 24 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary, marginBottom: 8 },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: COLORS.bg,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.text },
  eyeBtn: { padding: 2, marginLeft: 8 },
  forgot: { alignSelf: "flex-end", marginBottom: 20 },
  forgotText: { color: COLORS.primary, fontSize: 13, fontWeight: "600" },
  registerLink: { alignItems: "center" },
  registerLinkText: { color: COLORS.textSecondary, fontSize: 14 },
  registerLinkBold: { color: COLORS.primary, fontWeight: "700" },
});