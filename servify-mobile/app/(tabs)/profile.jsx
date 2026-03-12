import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import {
  User, MapPin, CreditCard, Bell, ShieldCheck,
  HelpCircle, Star, LogOut, ChevronRight
} from "lucide-react-native";
import { router } from "expo-router";
import { useUser } from "../../context/UserContext";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

const MENU = [
  {
    section: "ACCOUNT",
    items: [
      { icon: User,       label: "Edit Profile",      desc: "Update your personal info",    route: "/(tabs)/edit-profile" },
      { icon: MapPin,     label: "Saved Addresses",   desc: "Manage your locations",        route: "/(tabs)/saved-addresses" },
      { icon: CreditCard, label: "Payment Method",    desc: "Cash",                         route: "/(tabs)/payment-methods" },
    ],
  },
  {
    section: "PREFERENCES",
    items: [
      { icon: Bell,        label: "Notifications",     desc: "Manage your alerts",           route: "/(tabs)/notifications" },
      { icon: ShieldCheck, label: "Privacy & Security",desc: "Password and security",        route: "/(tabs)/privacy-security" },
    ],
  },
  {
    section: "SUPPORT",
    items: [
      { icon: HelpCircle, label: "Help & Support",    desc: "FAQs and contact us",          route: "/(tabs)/help-support" },
      { icon: Star,       label: "Rate the App",      desc: "Share your feedback",          route: "/(tabs)/rate-app" },
    ],
  },
];

export default function Profile() {
  const { user } = useUser();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.container}>

          {/* Header */}
          <Text style={styles.pageTitle}>Profile</Text>

          {/* Avatar card */}
          <View style={styles.avatarCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || "U"}</Text>
            </View>
            <View style={styles.avatarInfo}>
              <Text style={styles.userName}>{user?.name || "User Name"}</Text>
              <Text style={styles.userEmail}>{user?.email || "user@email.com"}</Text>
            </View>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => router.push("/(tabs)/edit-profile")}
              activeOpacity={0.75}
            >
              <User size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Menu sections */}
          {MENU.map((group) => (
            <View key={group.section} style={styles.section}>
              <Text style={styles.sectionLabel}>{group.section}</Text>
              <View style={styles.menuCard}>
                {group.items.map((item, index) => {
                  const Icon = item.icon;
                  const isLast = index === group.items.length - 1;
                  return (
                    <View key={item.label}>
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push(item.route)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.menuIconWrap}>
                          <Icon size={18} color={COLORS.primary} />
                        </View>
                        <View style={styles.menuText}>
                          <Text style={styles.menuLabel}>{item.label}</Text>
                          <Text style={styles.menuDesc}>{item.desc}</Text>
                        </View>
                        <ChevronRight size={16} color={COLORS.textMuted} />
                      </TouchableOpacity>
                      {!isLast && <View style={styles.menuDivider} />}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Log Out */}
          <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.85}>
            <LogOut size={18} color={COLORS.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Servify v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20 },
  pageTitle: { fontSize: 24, fontWeight: "800", color: COLORS.text, marginTop: 20, marginBottom: 20 },
  avatarCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: RADIUS.xxl, padding: 18, marginBottom: 28, gap: 14, ...SHADOW.sm },
  avatar: { width: 60, height: 60, borderRadius: RADIUS.xl, backgroundColor: "#FFF7ED", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#FED7AA" },
  avatarText: { fontSize: 24, fontWeight: "800", color: COLORS.primary },
  avatarInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  userEmail: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  editBtn: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight || "#FFF7ED", justifyContent: "center", alignItems: "center" },
  section: { marginBottom: 20 },
  sectionLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
  menuCard: { backgroundColor: "#fff", borderRadius: RADIUS.xl, overflow: "hidden", ...SHADOW.sm },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  menuIconWrap: { width: 42, height: 42, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight || "#FFF7ED", justifyContent: "center", alignItems: "center" },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  menuDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  menuDivider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 16 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#fff", borderRadius: RADIUS.xl, paddingVertical: 16, marginBottom: 16, borderWidth: 1.5, borderColor: "#FEE2E2", ...SHADOW.sm },
  logoutText: { fontSize: 15, fontWeight: "700", color: COLORS.error },
  version: { textAlign: "center", fontSize: 12, color: COLORS.textMuted, marginBottom: 8 },
});