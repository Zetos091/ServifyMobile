import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator, RefreshControl,
} from "react-native";
import { Users, Briefcase, Calendar, DollarSign, TrendingUp, Bell, AlertCircle } from "lucide-react-native";
import { useState, useCallback } from "react";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { COLORS, RADIUS, SHADOW } from "../../../components/theme";
import { useAuth } from "../../../hooks/useAuth";
import { getAdminStats, getAllBookings } from "../../../services/admin";

const STAT_CONFIG = [
  { key: "total_users",    label: "Total Users", icon: Users,      color: COLORS.info },
  { key: "total_services", label: "Services",    icon: Briefcase,  color: COLORS.primary },
  { key: "total_bookings", label: "Bookings",    icon: Calendar,   color: COLORS.warning },
  { key: "total_revenue",  label: "Revenue",     icon: DollarSign, color: COLORS.success },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({ queryKey: ["adminStats"], queryFn: getAdminStats });
  const { data: bookings, isLoading: bookingsLoading, refetch: refetchBookings } = useQuery({ queryKey: ["adminBookings", "pending"], queryFn: () => getAllBookings("pending") });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchBookings()]);
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Admin Panel</Text>
              <Text style={styles.name}>{user?.full_name || "Administrator"} 👋</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {statsLoading ? (
            <View style={styles.loadingBox}><ActivityIndicator color={COLORS.primary} /></View>
          ) : (
            <View style={styles.statsGrid}>
              {STAT_CONFIG.map((stat) => {
                const Icon = stat.icon;
                const value = stats?.[stat.key] ?? 0;
                const display = stat.key === "total_revenue" ? `₱${Number(value).toLocaleString()}` : value;
                return (
                  <View key={stat.key} style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: stat.color + "18" }]}>
                      <Icon size={20} color={stat.color} />
                    </View>
                    <Text style={styles.statValue}>{display}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.actionsRow}>
            {[
              { label: "Users",    icon: Users,      color: COLORS.info,    bg: COLORS.infoLight,    route: "/(tabs)/admin/users" },
              { label: "Services", icon: Briefcase,  color: COLORS.primary, bg: COLORS.primaryLight, route: "/(tabs)/admin/services" },
              { label: "Reports",  icon: TrendingUp, color: COLORS.success, bg: COLORS.successLight, route: "/(tabs)/admin/reports" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <TouchableOpacity key={action.label} style={styles.actionBtn} onPress={() => router.push(action.route)} activeOpacity={0.8}>
                  <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                    <Icon size={20} color={action.color} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Bookings</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/admin/reports")}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {bookingsLoading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 16 }} />
          ) : !bookings?.length ? (
            <View style={styles.emptyBox}>
              <AlertCircle size={32} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No pending bookings</Text>
            </View>
          ) : (
            bookings.slice(0, 4).map((booking) => {
              const s = COLORS[`status${booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}`] || COLORS.statusPending;
              return (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={styles.bookingLeft}>
                    <Text style={styles.bookingService} numberOfLines={1}>{booking.service_title || "Service"}</Text>
                    <Text style={styles.bookingMeta}>{booking.client_name} → {booking.provider_name}</Text>
                    <Text style={styles.bookingDate}>{booking.booking_date} · {booking.booking_time}</Text>
                  </View>
                  <View style={styles.bookingRight}>
                    <View style={[styles.badge, { backgroundColor: s.bg }]}>
                      <Text style={[styles.badgeText, { color: s.text }]}>{booking.status}</Text>
                    </View>
                    <Text style={styles.bookingPrice}>₱{booking.total_price}</Text>
                  </View>
                </View>
              );
            })
          )}
          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16, marginBottom: 20 },
  greeting: { fontSize: 13, color: COLORS.textSecondary, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  name: { fontSize: 22, fontWeight: "800", color: COLORS.text, marginTop: 2 },
  notifBtn: { width: 42, height: 42, borderRadius: RADIUS.md, backgroundColor: COLORS.card, justifyContent: "center", alignItems: "center", ...SHADOW.sm },
  loadingBox: { height: 120, justifyContent: "center", alignItems: "center" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  statCard: { width: "47%", backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 16, ...SHADOW.sm },
  statIcon: { width: 40, height: 40, borderRadius: RADIUS.md, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  statValue: { fontSize: 22, fontWeight: "800", color: COLORS.text, marginBottom: 2 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary },
  actionsRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  actionBtn: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 14, alignItems: "center", ...SHADOW.sm },
  actionIcon: { width: 44, height: 44, borderRadius: RADIUS.md, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  actionLabel: { fontSize: 12, fontWeight: "600", color: COLORS.text },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },
  bookingCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, ...SHADOW.sm },
  bookingLeft: { flex: 1, marginRight: 12 },
  bookingService: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginBottom: 3 },
  bookingMeta: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 3 },
  bookingDate: { fontSize: 11, color: COLORS.textMuted },
  bookingRight: { alignItems: "flex-end", gap: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  badgeText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  bookingPrice: { fontSize: 14, fontWeight: "800", color: COLORS.primary },
  emptyBox: { alignItems: "center", paddingVertical: 32, backgroundColor: COLORS.card, borderRadius: RADIUS.xl, ...SHADOW.sm },
  emptyText: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginTop: 10 },
});