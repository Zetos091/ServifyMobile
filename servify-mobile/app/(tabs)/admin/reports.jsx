import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator, RefreshControl,
} from "react-native";
import { DollarSign, TrendingUp, Calendar, CheckCircle, Clock, XCircle } from "lucide-react-native";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { COLORS, RADIUS, SHADOW } from "../../../components/theme";
import { getRevenueReport, getAllBookings } from "../../../services/admin";

const TABS = ["all", "pending", "accepted", "completed", "cancelled"];

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const { data: revenue, isLoading: revenueLoading, refetch: refetchRevenue } = useQuery({ queryKey: ["adminRevenue"], queryFn: getRevenueReport });
  const { data: bookings, isLoading: bookingsLoading, refetch: refetchBookings } = useQuery({ queryKey: ["adminAllBookings", activeTab], queryFn: () => getAllBookings(activeTab === "all" ? "" : activeTab) });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchRevenue(), refetchBookings()]);
    setRefreshing(false);
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Reports</Text>
            <Text style={styles.subtitle}>Platform overview</Text>
          </View>

          {revenueLoading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginBottom: 20 }} />
          ) : (
            <>
              <View style={styles.heroCard}>
                <View style={styles.heroIcon}>
                  <TrendingUp size={28} color={COLORS.white} />
                </View>
                <Text style={styles.heroLabel}>Total Platform Revenue</Text>
                <Text style={styles.heroValue}>₱{Number(revenue?.total_revenue ?? 0).toLocaleString()}</Text>
                <Text style={styles.heroSub}>From {revenue?.total_completed ?? 0} completed bookings</Text>
              </View>

              <View style={styles.statsRow}>
                {[
                  { label: "This Month", value: `₱${Number(revenue?.this_month ?? 0).toLocaleString()}`, icon: DollarSign,   color: COLORS.success },
                  { label: "Completed",  value: revenue?.total_completed ?? 0,                          icon: CheckCircle,   color: COLORS.info },
                  { label: "Pending",    value: revenue?.total_pending ?? 0,                            icon: Clock,         color: COLORS.warning },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <View key={stat.label} style={styles.statCard}>
                      <View style={[styles.statIcon, { backgroundColor: stat.color + "18" }]}>
                        <Icon size={16} color={stat.color} />
                      </View>
                      <Text style={styles.statValue}>{stat.value}</Text>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          <Text style={styles.sectionTitle}>All Bookings</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabs}>
            {TABS.map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {bookingsLoading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 16 }} />
          ) : !bookings?.length ? (
            <View style={styles.emptyBox}>
              <Calendar size={32} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No {activeTab} bookings</Text>
            </View>
          ) : (
            bookings.map((booking) => {
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
  header: { marginTop: 16, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  heroCard: { backgroundColor: COLORS.primary, borderRadius: RADIUS.xxl, padding: 28, alignItems: "center", marginBottom: 16, ...SHADOW.orange },
  heroIcon: { width: 56, height: 56, borderRadius: RADIUS.xl, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", marginBottom: 12 },
  heroLabel: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 6 },
  heroValue: { fontSize: 38, fontWeight: "900", color: COLORS.white, marginBottom: 4 },
  heroSub: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 14, alignItems: "center", ...SHADOW.sm },
  statIcon: { width: 34, height: 34, borderRadius: RADIUS.md, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  statValue: { fontSize: 15, fontWeight: "800", color: COLORS.text, marginBottom: 2 },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, textAlign: "center" },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text, marginBottom: 12 },
  tabsScroll: { marginBottom: 14 },
  tabs: { flexDirection: "row", gap: 8, paddingRight: 20 },
  tab: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: "600", color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.white },
  bookingCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, ...SHADOW.sm },
  bookingLeft: { flex: 1, marginRight: 12 },
  bookingService: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginBottom: 3 },
  bookingMeta: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 3 },
  bookingDate: { fontSize: 11, color: COLORS.textMuted },
  bookingRight: { alignItems: "flex-end", gap: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  badgeText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  bookingPrice: { fontSize: 14, fontWeight: "800", color: COLORS.primary },
  emptyBox: { alignItems: "center", paddingVertical: 40, backgroundColor: COLORS.card, borderRadius: RADIUS.xl, ...SHADOW.sm },
  emptyText: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginTop: 10 },
});