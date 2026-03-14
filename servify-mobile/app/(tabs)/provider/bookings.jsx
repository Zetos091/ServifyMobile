import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
  RefreshControl, Alert,
} from "react-native";
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle } from "lucide-react-native";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { COLORS, RADIUS, SHADOW } from "../../../components/theme";
import { getProviderBookings, updateBookingStatus } from "../../../services/provider";

const TABS = ["pending", "accepted", "completed", "rejected"];

export default function ProviderBookings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  const [refreshing, setRefreshing] = useState(false);

  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ["providerBookings", activeTab],
    queryFn: () => getProviderBookings(activeTab),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["providerBookings"]);
      queryClient.invalidateQueries(["providerStats"]);
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [activeTab]);

  const handleAccept = (booking) => {
    Alert.alert("Accept Booking", `Accept booking from ${booking.client_name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Accept", onPress: () => statusMutation.mutate({ id: booking.id, status: "accepted" }) },
    ]);
  };

  const handleReject = (booking) => {
    Alert.alert("Reject Booking", `Reject booking from ${booking.client_name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Reject", style: "destructive", onPress: () => statusMutation.mutate({ id: booking.id, status: "rejected" }) },
    ]);
  };

  const handleComplete = (booking) => {
    Alert.alert("Mark as Completed", "Mark this booking as completed?", [
      { text: "Cancel", style: "cancel" },
      { text: "Complete", onPress: () => statusMutation.mutate({ id: booking.id, status: "completed" }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bookings</Text>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
          ) : !bookings?.length ? (
            <View style={styles.emptyBox}>
              <Calendar size={36} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No {activeTab} bookings</Text>
            </View>
          ) : (
            bookings.map((booking) => {
              const s = COLORS[`status${booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}`] || COLORS.statusPending;
              return (
                <View key={booking.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.serviceTitle} numberOfLines={1}>{booking.service_title || "Service"}</Text>
                    <View style={[styles.badge, { backgroundColor: s.bg }]}>
                      <Text style={[styles.badgeText, { color: s.text }]}>{booking.status}</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}><User size={13} color={COLORS.textMuted} /><Text style={styles.infoText}>{booking.client_name || "Client"}</Text></View>
                  <View style={styles.infoRow}>
                    <Calendar size={13} color={COLORS.textMuted} /><Text style={styles.infoText}>{booking.booking_date}</Text>
                    <Clock size={13} color={COLORS.textMuted} style={{ marginLeft: 12 }} /><Text style={styles.infoText}>{booking.booking_time}</Text>
                  </View>
                  {booking.user_location && (
                    <View style={styles.infoRow}><MapPin size={13} color={COLORS.textMuted} /><Text style={styles.infoText} numberOfLines={1}>{booking.user_location}</Text></View>
                  )}
                  {booking.notes && <Text style={styles.notes}>"{booking.notes}"</Text>}
                  <Text style={styles.price}>₱{booking.total_price}</Text>

                  {booking.status === "pending" && (
                    <View style={styles.btnRow}>
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(booking)} activeOpacity={0.8}>
                        <XCircle size={16} color={COLORS.error} />
                        <Text style={styles.rejectText}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(booking)} activeOpacity={0.8}>
                        <CheckCircle size={16} color={COLORS.white} />
                        <Text style={styles.acceptText}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {booking.status === "accepted" && (
                    <TouchableOpacity style={styles.completeBtn} onPress={() => handleComplete(booking)} activeOpacity={0.8}>
                      <CheckCircle size={16} color={COLORS.white} />
                      <Text style={styles.acceptText}>Mark as Completed</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 16, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  tabsScroll: { marginBottom: 16 },
  tabs: { flexDirection: "row", gap: 8, paddingRight: 20 },
  tab: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.white },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12, ...SHADOW.sm },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  serviceTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text, flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  badgeText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  infoText: { fontSize: 13, color: COLORS.textSecondary },
  notes: { fontSize: 13, color: COLORS.textMuted, fontStyle: "italic", marginTop: 4, marginBottom: 4 },
  price: { fontSize: 18, fontWeight: "800", color: COLORS.primary, marginTop: 8, marginBottom: 12 },
  btnRow: { flexDirection: "row", gap: 10 },
  rejectBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 11, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.errorBorder, backgroundColor: COLORS.errorLight },
  rejectText: { fontSize: 14, fontWeight: "700", color: COLORS.error },
  acceptBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 11, borderRadius: RADIUS.lg, backgroundColor: COLORS.success },
  acceptText: { fontSize: 14, fontWeight: "700", color: COLORS.white },
  completeBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 11, borderRadius: RADIUS.lg, backgroundColor: COLORS.info },
  emptyBox: { alignItems: "center", paddingVertical: 48, backgroundColor: COLORS.card, borderRadius: RADIUS.xl, marginTop: 8, ...SHADOW.sm },
  emptyText: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginTop: 12 },
});