import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform,
  ScrollView, Alert,
} from "react-native";
import { useCallback, useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react-native";
import { router } from "expo-router";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import SocialButton from "../../components/SocialButton";
import { login } from "../../services/auth";

// ✅ Moved OUTSIDE component so it never re-creates on render
const RememberCheckbox = ({ value, onToggle }) => (
  <TouchableOpacity
    style={styles.rememberRow}
    onPress={onToggle}
    activeOpacity={0.7}
  >
    <View style={[styles.checkbox, value && styles.checkboxActive]}>
      {value && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.rememberText}>Remember me</Text>
  </TouchableOpacity>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ useCallback prevents new function reference on every render
  const toggleShowPass = useCallback(() => setShowPass((v) => !v), []);
  const toggleRemember = useCallback(() => setRemember((v) => !v), []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace("/(tabs)");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Login failed. Check your credentials.";
      Alert.alert("Login Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    Alert.alert("Coming Soon", `${provider} login will be available soon!`);
  };

  return (
    // ✅ SafeAreaView no longer holds backgroundColor — prevents flash
    <SafeAreaView style={styles.root}>

      {/* ── HERO TOP ── */}
      {/* ✅ pointerEvents="none" prevents hero from capturing touches and causing re-layout */}
      <View style={styles.hero} pointerEvents="none">
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>S</Text>
        </View>
        <Text style={styles.heroTitle}>Servify</Text>
        <Text style={styles.heroSub}>Your trusted service marketplace</Text>
      </View>

      {/* ── BOTTOM SHEET ── */}
      {/* ✅ Use "position" behavior on Android to avoid layout jumps */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        style={styles.sheetWrapper}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
      >
        <ScrollView
          contentContainerStyle={styles.sheet}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          // ✅ These two prevent scroll/layout recalculation on state change
          bounces={false}
          overScrollMode="never"
        >
          <Text style={styles.sheetTitle}>Welcome back!</Text>

          <InputField
            icon={Mail}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            icon={Lock}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            rightIcon={showPass ? EyeOff : Eye}
            onRightIconPress={toggleShowPass}  // ✅ stable reference
          />

          <View style={styles.rowBetween}>
            {/* ✅ extracted component with stable toggle */}
            <RememberCheckbox value={remember} onToggle={toggleRemember} />
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            onPress={handleLogin}
            loading={loading}
            icon={ArrowRight}
            iconPosition="right"
            size="lg"
            style={styles.loginBtn}
          >
            Login
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.dividerLine} />
          </View>

          <SocialButton provider="google" onPress={() => handleSocialLogin("Google")} />
          <SocialButton provider="facebook" onPress={() => handleSocialLogin("Facebook")} />

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.registerText}>
              Don't have an account?{"  "}
              <Text style={styles.registerBold}>Create an account</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.primary },

  hero: {
    flex: 0.42,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    width: 280, height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: -80, right: -60,
  },
  circle2: {
    position: "absolute",
    width: 200, height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -40, left: -40,
  },
  logoBox: {
    width: 72, height: 72,
    borderRadius: RADIUS.xxl,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  logoLetter: { fontSize: 36, fontWeight: "900", color: COLORS.card },
  heroTitle: { fontSize: 32, fontWeight: "800", color: COLORS.card, marginBottom: 6 },
  heroSub: { fontSize: 14, color: "rgba(255,255,255,0.8)" },

  sheetWrapper: { flex: 0.58 },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 24,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  rememberRow: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 18, height: 18,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: { color: COLORS.card, fontSize: 11, fontWeight: "bold" },
  rememberText: { fontSize: 13, color: COLORS.textSecondary },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },

  loginBtn: { width: "100%" },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { marginHorizontal: 12, color: COLORS.textMuted, fontSize: 13 },

  registerLink: { marginTop: 8, alignItems: "center" },
  registerText: { fontSize: 13, color: COLORS.textSecondary },
  registerBold: { color: COLORS.primary, fontWeight: "700" },
});