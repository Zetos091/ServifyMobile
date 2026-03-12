import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform,
  ScrollView, Alert,
} from "react-native";
import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react-native";
import { router } from "expo-router";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { register } from "../../services/auth";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    if (!form.full_name.trim()) {
      Alert.alert("Missing Field", "Please enter your full name.");
      return false;
    }
    if (!form.email.trim()) {
      Alert.alert("Missing Field", "Please enter your email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    if (!form.phone_number.trim()) {
      Alert.alert("Missing Field", "Please enter your phone number.");
      return false;
    }
    if (form.password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return false;
    }
    if (form.password !== form.confirm_password) {
      Alert.alert("Password Mismatch", "Passwords do not match. Please try again.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(
        form.full_name.trim(),
        form.email.trim().toLowerCase(),
        form.password,
        form.phone_number.trim()
      );
      Alert.alert(
        "Account Created! 🎉",
        "Your account has been created successfully. Please log in.",
        [{ text: "Log In", onPress: () => router.replace("/(auth)/login") }]
      );
    } catch (error) {
      const msg =
        error.response?.data?.message || "Registration failed. Please try again.";
      Alert.alert("Registration Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>

      {/* ── HERO TOP ── */}
      <View style={styles.hero}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>S</Text>
        </View>
        <Text style={styles.heroTitle}>Join Servify</Text>
        <Text style={styles.heroSub}>Create your free account today</Text>
      </View>

      {/* ── BOTTOM SHEET ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.sheetWrapper}
      >
        <ScrollView
          contentContainerStyle={styles.sheet}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sheetTitle}>Create Account</Text>

          {/* Full Name */}
          <InputField
            icon={User}
            placeholder="Enter your full name"
            value={form.full_name}
            onChangeText={(v) => update("full_name", v)}
            autoCapitalize="words"
          />

          {/* Email */}
          <InputField
            icon={Mail}
            placeholder="Enter your email"
            value={form.email}
            onChangeText={(v) => update("email", v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Phone Number */}
          <InputField
            icon={Phone}
            placeholder="Enter your phone number"
            value={form.phone_number}
            onChangeText={(v) => update("phone_number", v)}
            keyboardType="phone-pad"
          />

          {/* Password */}
          <InputField
            icon={Lock}
            placeholder="Create a password"
            value={form.password}
            onChangeText={(v) => update("password", v)}
            secureTextEntry={!showPass}
            rightIcon={showPass ? EyeOff : Eye}
            onRightIconPress={() => setShowPass(!showPass)}
          />

          {/* Confirm Password */}
          <InputField
            icon={Lock}
            placeholder="Confirm your password"
            value={form.confirm_password}
            onChangeText={(v) => update("confirm_password", v)}
            secureTextEntry={!showConfirm}
            rightIcon={showConfirm ? EyeOff : Eye}
            onRightIconPress={() => setShowConfirm(!showConfirm)}
          />

          {/* Password match indicator */}
          {form.confirm_password.length > 0 && (
            <View style={styles.matchRow}>
              <View style={[
                styles.matchDot,
                { backgroundColor: form.password === form.confirm_password ? COLORS.success : COLORS.error }
              ]} />
              <Text style={[
                styles.matchText,
                { color: form.password === form.confirm_password ? COLORS.success : COLORS.error }
              ]}>
                {form.password === form.confirm_password ? "Passwords match" : "Passwords do not match"}
              </Text>
            </View>
          )}

          {/* Register Button */}
          <Button
            onPress={handleRegister}
            loading={loading}
            icon={ArrowRight}
            iconPosition="right"
            size="lg"
            style={styles.registerBtn}
          >
            Create Account
          </Button>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text style={styles.loginText}>
              Already have an account?{"  "}
              <Text style={styles.loginBold}>Sign in</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.primary },

  // Hero
  hero: {
    flex: 0.32,
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
    width: 64, height: 64,
    borderRadius: RADIUS.xxl,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  logoLetter: { fontSize: 30, fontWeight: "900", color: COLORS.card },
  heroTitle: { fontSize: 26, fontWeight: "800", color: COLORS.card, marginBottom: 4 },
  heroSub: { fontSize: 13, color: "rgba(255,255,255,0.8)" },

  // Sheet
  sheetWrapper: { flex: 0.68 },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 40,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 20,
  },

  // Password match
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -6,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  matchDot: {
    width: 8, height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  matchText: { fontSize: 12, fontWeight: "600" },

  // Button
  registerBtn: { width: "100%", marginTop: 8 },

  // Login link
  loginLink: { marginTop: 20, alignItems: "center" },
  loginText: { fontSize: 13, color: COLORS.textSecondary },
  loginBold: { color: COLORS.primary, fontWeight: "700" },
});