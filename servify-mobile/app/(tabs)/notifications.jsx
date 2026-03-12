import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Switch } from "react-native";
import { ChevronLeft, Bell, Tag, Star, Megaphone, Wrench } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

const SETTINGS = [
  {
    section: "Bookings",
    items: [
      { id: "booking_confirmed", icon: Wrench, label: "Booking Confirmed", desc: "When your service booking is accepted", default: true },
      { id: "booking_reminder", icon: Bell, label: "Booking Reminder", desc: "Reminders before your scheduled service", default: true },
      { id: "booking_completed", icon: Star, label: "Service Completed", desc: "When your service is marked done", default: true },
    ],
  },
  {
    section: "Promotions",
    items: [
      { id: "promos", icon: Tag, label: "Deals & Promos", desc: "Exclusive discounts and special offers", default: false },
      { id: "announcements", icon: Megaphone, label: "App Announcements", desc: "New features and app updates", default: false },
    ],
  },
];

export default function Notifications() {
  const init = {};
  SETTINGS.forEach((s) => s.items.forEach((i) => (init[i.id] = i.default)));
  const [prefs, setPrefs] = useState(init);

  const toggle = (id) => setPrefs((p) => ({ ...p, [id]: !p[id] }));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/(tabs)/profile")}>
              <ChevronLeft size={22} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Notifications</Text>
            <View style={{ width: 38 }} />
          </View>

          <Text style={styles.subtitle}>Choose which alerts you'd like to receive.</Text>

          {SETTINGS.map((group) => (
            <View key={group.section} style={styles.section}>
              <Text style={styles.sectionLabel}>{group.section}</Text>
              <View style={styles.card}>
                {group.items.map((item, index) => {
                  const Icon = item.icon;
                  const isLast = index === group.items.length - 1;
                  return (
                    <View key={item.id}>
                      <View style={styles.row}>
                        <View style={styles.iconWrap}>
                          <Icon size={18} color={COLORS.primary} />
                        </View>
                        <View style={styles.rowText}>
                          <Text style={styles.rowLabel}>{item.label}</Text>
                          <Text style={styles.rowDesc}>{item.desc}</Text>
                        </View>
                        <Switch
                          value={prefs[item.id]}
                          onValueChange={() => toggle(item.id)}
                          trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
                          thumbColor={prefs[item.id] ? COLORS.primary : "#fff"}
                        />
                      </View>
                      {!isLast && <View style={styles.divider} />}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 8 },
  backBtn: { width: 38, height: 38, borderRadius: RADIUS.md, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", ...SHADOW.sm },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 24, lineHeight: 19 },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
  card: { backgroundColor: "#fff", borderRadius: RADIUS.xl, overflow: "hidden", ...SHADOW.sm },
  row: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  iconWrap: { width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight || "#FFF7ED", justifyContent: "center", alignItems: "center" },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  rowDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, lineHeight: 17 },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 16 },
});