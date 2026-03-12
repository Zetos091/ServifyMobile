import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
} from "react-native";
import {
  User, MapPin, CreditCard, Bell, Shield,
  HelpCircle, Star, LogOut, ChevronRight, Edit2,
} from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import AlertModal from "../../components/AlertModal";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";
import { logout } from "../../services/auth";
import { useAuth } from "../../hooks/useAuth";

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: User,       label: "Edit Profile",      desc: "Update your personal info" },
      { icon: MapPin,     label: "Saved Addresses",   desc: "Manage your locations" },
      { icon: CreditCard, label: "Payment Methods",   desc: "Cards and e-wallets" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell,   label: "Notifications",     desc: "Manage your alerts" },
      { icon: Shield, label: "Privacy & Security", desc: "Password and security" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help & Support", desc: "FAQs and contact us" },
      { icon: Star,       label: "Rate the App",   desc: "Share your feedback" },
    ],
  },
];

export default function Profile() {
  const { user, loading } = useAuth();
  const [logoutModal, setLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      router.replace("/(auth)/login");
    } finally {
      setLoggingOut(false);
      setLogoutModal(false);
    }
  };

  // Get first letter of name for avatar
  const avatarLetter = user?.full_name?.[0]?.toUpperCase() || "U";

  // Show loading spinner while fetching user
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{avatarLetter}</Text>
              </View>
              <TouchableOpacity style={styles.editBtn}>
                <Edit2 size={12} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.userName}>
                {user?.full_name || "User"}
              </Text>
              <Text style={styles.userEmail}>
                {user?.email || ""}
              </Text>
              {/* Show user type badge */}
              {user?.user_type && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                  </Text>
                </View>
              )}
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              {[
                { value: "12", label: "Bookings" },
                { value: "4.8", label: "Rating" },
                { value: "3",  label: "Reviews" },
              ].map((s, i) => (
                <View key={s.label} style={[styles.stat, i < 2 && styles.statBorder]}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Menu Sections */}
          {MENU_SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.menuCard}>
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.label}
                      style={[
                        styles.menuItem,
                        index < section.items.length - 1 && styles.menuItemBorder,
                      ]}
                      activeOpacity={0.7}
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

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setLogoutModal(true)}
            activeOpacity={0.8}
            disabled={loggingOut}
          >
            <LogOut size={18} color={COLORS.error} />
            <Text style={styles.logoutText}>
              {loggingOut ? "Logging out..." : "Log Out"}
            </Text>
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
        onConfirm={handleLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  header: { marginTop: 16, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    ...SHADOW.sm,
  },
  avatarWrap: { position: "relative", marginBottom: 14 },
  avatar: {
    width: 80, height: 80,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FED7AA",
  },
  avatarText: { fontSize: 32, fontWeight: "800", color: COLORS.primary },
  editBtn: {
    position: "absolute",
    bottom: -4, right: -4,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    width: 28, height: 28,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW.sm,
  },
  profileInfo: { alignItems: "center", marginBottom: 20 },
  userName: { fontSize: 20, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  userEmail: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
  stat: { flex: 1, alignItems: "center", paddingVertical: 14 },
  statBorder: { borderRightWidth: 1, borderRightColor: COLORS.border },
  statValue: { fontSize: 20, fontWeight: "800", color: COLORS.primary, marginBottom: 2 },
  statLabel: { fontSize: 11, color: COLORS.textSecondary },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 13, fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  menuCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    ...SHADOW.sm,
  },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: "#FAF9F8" },
  menuIconCircle: {
    width: 40, height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  menuDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 1 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    paddingVertical: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "#FECACA",
    ...SHADOW.sm,
  },
  logoutText: { color: COLORS.error, fontWeight: "700", fontSize: 15 },
  version: { textAlign: "center", color: COLORS.textMuted, fontSize: 12 },
});