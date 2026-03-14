import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, ActivityIndicator, RefreshControl,
} from "react-native";
import { TrendingUp, DollarSign, CheckCircle, Clock } from "lucide-react-native";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { COLORS, RADIUS, SHADOW } from "../../../components/theme";
import { getProviderEarnings } from "../../../services/provider";

export default function ProviderEarnings() {
  const [refreshing, setRefreshing] = useState(false);

  const { data: earnings, isLoading, refetch } = useQuery({
    queryKey: ["providerEarnings"],
    queryFn: getProviderEarnings,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

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
            <Text style={styles.title}>Earnings</Text>
            <Text style={styles.subtitle}>Your income overview</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
          ) : (
            <>
              {/* Total Earnings Hero Card */}
              <View style={styles.heroCard}>
                <View style={styles.heroIcon}>
                  <TrendingUp size={28} color="#fff" />
                </View>
                <Text style={styles.heroLabel}>Total Earnings</Text>
                <Text style={styles.heroValue}>
                  ₱{earnings?.total_earnings
                    ? Number(earnings.total_earnings).toLocaleString()
                    : "0"}
                </Text>
                <Text style={styles.heroSub}>
                  From {earnings?.total_completed ?? 0} completed jobs
                </Text>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                {[
                  {
                    icon: CheckCircle,
                    label: "Completed",
                    value: earnings?.total_completed ?? 0,
                    color: COLORS.success,
                  },
                  {
                    icon: Clock,
                    label: "Pending",
                    value: earnings?.pending_payout ?? 0,
                    color: COLORS.warning,
                  },
                  {
                    icon: DollarSign,
                    label: "This Month",
                    value: `₱${earnings?.this_month
                      ? Number(earnings.this_month).toLocaleString()
                      : "0"}`,
                    color: COLORS.info,
                  },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <View key={stat.label} style={styles.statCard}>
                      <View style={[styles.statIcon, { backgroundColor: stat.color + "18" }]}>
                        <Icon size={18} color={stat.color} />
                      </View>
                      <Text style={styles.statValue}>{stat.value}</Text>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                  );
                })}
              </View>

              {/* Recent Transactions */}
              <Text style={styles.sectionTitle}>Recent Transactions</Text>

              {earnings?.transactions?.length === 0 || !earnings?.transactions ? (
                <View style={styles.emptyBox}>
                  <DollarSign size={32} color={COLORS.textMuted} />
                  <Text style={styles.emptyText}>No transactions yet</Text>
                  <Text style={styles.emptySubText}>
                    Completed bookings will appear here
                  </Text>
                </View>
              ) : (
                earnings.transactions.map((tx) => (
                  <View key={tx.id} style={styles.txCard}>
                    <View style={styles.txLeft}>
                      <Text style={styles.txService} numberOfLines={1}>
                        {tx.service_title || "Service"}
                      </Text>
                      <Text style={styles.txDate}>{tx.booking_date}</Text>
                    </View>
                    <View style={styles.txRight}>
                      <Text style={styles.txAmount}>+₱{tx.total_price}</Text>
                      <View style={[
                        styles.txBadge,
                        { backgroundColor: COLORS.success + "18" }
                      ]}>
                        <Text style={[styles.txBadgeText, { color: COLORS.success }]}>
                          Completed
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </>
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

  // Hero card
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xxl,
    padding: 28,
    alignItems: "center",
    marginBottom: 16,
    ...SHADOW.orange,
  },
  heroIcon: {
    width: 56, height: 56,
    borderRadius: RADIUS.xl,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  heroLabel: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 6 },
  heroValue: { fontSize: 40, fontWeight: "900", color: "#fff", marginBottom: 4 },
  heroSub: { fontSize: 13, color: "rgba(255,255,255,0.7)" },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: 14,
    alignItems: "center",
    ...SHADOW.sm,
  },
  statIcon: {
    width: 36, height: 36,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 2 },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, textAlign: "center" },

  // Section
  sectionTitle: {
    fontSize: 17, fontWeight: "800",
    color: COLORS.text, marginBottom: 12,
  },

  // Transaction card
  txCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    ...SHADOW.sm,
  },
  txLeft: { flex: 1, marginRight: 12 },
  txService: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginBottom: 3 },
  txDate: { fontSize: 12, color: COLORS.textMuted },
  txRight: { alignItems: "flex-end", gap: 6 },
  txAmount: { fontSize: 16, fontWeight: "800", color: COLORS.success },
  txBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  txBadgeText: { fontSize: 10, fontWeight: "700" },

  // Empty
  emptyBox: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    ...SHADOW.sm,
  },
  emptyText: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginTop: 12 },
  emptySubText: {
    fontSize: 13, color: COLORS.textMuted,
    marginTop: 4, textAlign: "center",
    paddingHorizontal: 24,
  },
});