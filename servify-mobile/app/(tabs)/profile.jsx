import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { User, MapPin, CreditCard, Bell, Shield, HelpCircle, Star, LogOut, ChevronRight, Edit2 } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import AlertModal from "../../components/AlertModal";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";
import { useUser } from "../../context/UserContext";

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile", desc: "Update your personal info", route: "/(tabs)/edit-profile" },
      { icon: MapPin, label: "Saved Addresses", desc: "Manage your locations", route: "/(tabs)/saved-addresses" },
      { icon: CreditCard, label: "Payment Method", desc: "Cash and E-wallets", route: "/(tabs)/payment-methods" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", desc: "Manage your alerts" },
      { icon: Shield, label: "Privacy & Security", desc: "Password and security" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help & Support", desc: "FAQs and contact us" },
      { icon: Star, label: "Rate the App", desc: "Share your feedback" },
    ],
  },
];

export default function Profile() {
  const [logoutModal, setLogoutModal] = useState(false);
  const { user } = useUser(); // ✅ reads live user data

  const handleMenuPress = (item) => {
    if (item.route) router.push(item.route);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>

          {/* Profile Card — now shows live user.name and user.email */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name?.[0]?.toUpperCase() || "U"}</Text>
              </View>
              <TouchableOpacity style={styles.editBtn} onPress={() => router.push("/(tabs)/edit-profile")}>
                <Edit2 size={12} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>

            <View style={styles.statsRow}>
              {[
                { value: "12", label: "Bookings" },
                { value: "4.8", label: "Rating" },
                { value: "3", label: "Reviews" },
              ].map((s, i) => (
                <View key={s.label} style={[styles.stat, i < 2 && styles.statBorder]}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {MENU_SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.menuCard}>
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.label}
                      style={[styles.menuItem, index < section.items.length - 1 && styles.menuItemBorder]}
                      activeOpacity={0.7}
                      onPress={() => handleMenuPress(item)}
                    >
                      <View style={styles.menuIconCircle}>
                        <Icon size={18} color={COLORS.primary} />
                      </View>
                      <View style={styles.menuText}>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <Text style={styles.menuDesc}>{item.desc}</Text>
                      </View>
                      <ChevronRight size={16} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.logoutBtn} onPress={() => setLogoutModal(true)} activeOpacity={0.8}>
            <LogOut size={18} color={COLORS.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Servify v1.0.0</Text>
          <View style={{ height: 32 }} />
        </View>
      </ScrollView>

      <AlertModal
        visible={logoutModal}
        onClose={() => setLogoutModal(false)}
        variant="warning"
        title="Log Out?"
        message="Are you sure you want to log out of your Servify account?"
        confirmText="Log Out"
        cancelText="Stay"
        onConfirm={() => router.replace("/(auth)/login")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20 },
  header: { marginTop: 16, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  profileCard: { backgroundColor: "#fff", borderRadius: RADIUS.xxl, padding: 20, marginBottom: 24, alignItems: "center", ...SHADOW.sm },
  avatarWrap: { position: "relative", marginBottom: 14 },
  avatar: { width: 80, height: 80, borderRadius: RADIUS.xl, backgroundColor: "#FFF7ED", justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#FED7AA" },
  avatarText: { fontSize: 32, fontWeight: "800", color: COLORS.primary },
  editBtn: { position: "absolute", bottom: -4, right: -4, backgroundColor: "#fff", borderRadius: 10, width: 28, height: 28, justifyContent: "center", alignItems: "center", ...SHADOW.sm },
  profileInfo: { alignItems: "center", marginBottom: 20 },
  userName: { fontSize: 20, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  userEmail: { fontSize: 14, color: COLORS.textSecondary },
  statsRow: { flexDirection: "row", width: "100%", backgroundColor: COLORS.bg, borderRadius: RADIUS.lg, overflow: "hidden" },
  stat: { flex: 1, alignItems: "center", paddingVertical: 14 },
  statBorder: { borderRightWidth: 1, borderRightColor: COLORS.border },
  statValue: { fontSize: 20, fontWeight: "800", color: COLORS.primary, marginBottom: 2 },
  statLabel: { fontSize: 11, color: COLORS.textSecondary },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: 10, textTransform: "uppercase" },
  menuCard: { backgroundColor: "#fff", borderRadius: RADIUS.xl, overflow: "hidden", ...SHADOW.sm },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: "#FAF9F8" },
  menuIconCircle: { width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center", marginRight: 14 },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  menuDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 1 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#fff", borderRadius: RADIUS.xl, paddingVertical: 16, marginBottom: 14, borderWidth: 1.5, borderColor: "#FECACA", ...SHADOW.sm },
  logoutText: { color: COLORS.error, fontWeight: "700", fontSize: 15 },
  version: { textAlign: "center", color: COLORS.textMuted, fontSize: 12 },
});