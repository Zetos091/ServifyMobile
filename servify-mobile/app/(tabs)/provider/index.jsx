import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator, RefreshControl,
} from "react-native";
import {
  Briefcase, Star, DollarSign, Clock,
  ChevronRight, Plus, TrendingUp, Bell,
} from "lucide-react-native";
import { useState, useCallback } from "react";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { COLORS, RADIUS, SHADOW } from "../../../components/theme";
import { useAuth } from "../../../hooks/useAuth";
import { getProviderStats, getProviderBookings } from "../../../services/provider";

const STATUS_COLOR = {
  pending:   { bg: "#FFF7ED", text: "#EA580C" },
  accepted:  { bg: "#F0FDF4", text: "#16A34A" },
  completed: { bg: "#EFF6FF", text: "#2563EB" },
  rejected:  { bg: "#FFF1F2", text: "#E11D48" },
  cancelled: { bg: "#F9FAFB", text: "#6B7280" },
};

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["providerStats"],
    queryFn: getProviderStats,
  });

  const {
    data: bookings,
    isLoading: bookingsLoading,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ["providerBookings", "pending"],
    queryFn: () => getProviderBookings("pending"),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchBookings()]);
    setRefreshing(false);
  }, []);

  const isLoading = statsLoading || bookingsLoading;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good day,</Text>
              <Text style={styles.name}>{user?.full_name || "Provider"} 👋</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : (
            <View style={styles.statsGrid}>
              {[
                {
                  icon: Briefcase,
                  label: "Total Jobs",
                  value: stats?.total_jobs ?? "0",
                  color: COLORS.primary,
                },
                {
                  icon: Star,
                  label: "Rating",
                  value: stats?.average_rating ? Number(stats.average_rating).toFixed(1) : "N/A",
                  color: "#F59E0B",
                },
                {
                  icon: DollarSign,
                  label: "Earnings",
                  value: stats?.total_earnings ? `₱${Number(stats.total_earnings).toLocaleString()}` : "₱0",
                  color: COLORS.success,
                },
                {
                  icon: Clock,
                  label: "Pending",
                  value: stats?.pending_bookings ?? "0",
                  color: COLORS.info,
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <View key={stat.label} style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: stat.color + "18" }]}>
                      <Icon size={20} color={stat.color} />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push("/(tabs)/provider/services")}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryLight }]}>
                <Plus size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>Add Service</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push("/(tabs)/provider/bookings")}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#EFF6FF" }]}>
                <Briefcase size={20} color={COLORS.info} />
              </View>
              <Text style={styles.actionLabel}>Bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push("/(tabs)/provider/earnings")}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#F0FDF4" }]}>
                <TrendingUp size={20} color={COLORS.success} />
              </View>
              <Text style={styles.actionLabel}>Earnings</Text>
            </TouchableOpacity>
          </View>

          {/* Pending Bookings */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/provider/bookings")}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {bookingsLoading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 16 }} />
          ) : bookings?.length === 0 || !bookings ? (
            <View style={styles.emptyBox}>
              <Briefcase size={32} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No pending requests</Text>
              <Text style={styles.emptySubText}>New booking requests will appear here</Text>
            </View>
          ) : (
            bookings.slice(0, 3).map((booking) => {
              const statusStyle = STATUS_COLOR[booking.status] || STATUS_COLOR.pending;
              return (
                <TouchableOpacity
                  key={booking.id}
                  style={styles.bookingCard}
                  activeOpacity={0.8}
                  onPress={() => router.push("/(tabs)/provider/bookings")}
                >
                  <View style={styles.bookingLeft}>
                    <Text style={styles.bookingService} numberOfLines={1}>
                      {booking.service_title || "Service"}
                    </Text>
                    <Text style={styles.bookingClient}>
                      {booking.client_name || "Client"}
                    </Text>
                    <Text style={styles.bookingDate}>
                      {booking.booking_date} · {booking.booking_time}
                    </Text>
                  </View>
                  <View style={styles.bookingRight}>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {booking.status}
                      </Text>
                    </View>
                    <Text style={styles.bookingPrice}>₱{booking.total_price}</Text>
                  </View>
                </TouchableOpacity>
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

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  greeting: { fontSize: 14, color: COLORS.textSecondary },
  name: { fontSize: 22, fontWeight: "800", color: COLORS.text, marginTop: 2 },
  notifBtn: {
    width: 42, height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW.sm,
  },

  // Stats
  loadingBox: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: "47%",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: 16,
    ...SHADOW.sm,
  },
  statIcon: {
    width: 40, height: 40,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: { fontSize: 22, fontWeight: "800", color: COLORS.text, marginBottom: 2 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary },

  // Quick Actions
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: 14,
    alignItems: "center",
    ...SHADOW.sm,
  },
  actionIcon: {
    width: 44, height: 44,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionLabel: { fontSize: 12, fontWeight: "600", color: COLORS.text },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },

  // Booking cards
  bookingCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    ...SHADOW.sm,
  },
  bookingLeft: { flex: 1, marginRight: 12 },
  bookingService: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginBottom: 3 },
  bookingClient: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 3 },
  bookingDate: { fontSize: 12, color: COLORS.textMuted },
  bookingRight: { alignItems: "flex-end", gap: 8 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  bookingPrice: { fontSize: 15, fontWeight: "800", color: COLORS.primary },

  // Empty state
  emptyBox: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    ...SHADOW.sm,
  },
  emptyText: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginTop: 12 },
  emptySubText: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
});