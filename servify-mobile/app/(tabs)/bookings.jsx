import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useState } from "react";
import { Calendar, Clock, DollarSign, RotateCcw, X, Star } from "lucide-react-native";
import AlertModal from "../../components/AlertModal";
import StatusBadge from "../../components/StatusBadge";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

const TABS = ["Upcoming", "Completed", "Cancelled"];

const BOOKINGS = {
  Upcoming: [
    { id: 1, provider: "James Carter", service: "Electrical", date: "Mar 12, 2026", time: "10:00 AM", price: "₱700", status: "confirmed" },
    { id: 2, provider: "Carlos Bautista", service: "AC Repair", date: "Mar 15, 2026", time: "2:00 PM", price: "₱900", status: "pending" },
  ],
  Completed: [
    { id: 3, provider: "Maria Santos", service: "Cleaning", date: "Feb 28, 2026", time: "9:00 AM", price: "₱560", status: "completed" },
    { id: 4, provider: "Ana Lim", service: "Painting", date: "Feb 20, 2026", time: "11:00 AM", price: "₱1,280", status: "completed" },
  ],
  Cancelled: [
    { id: 5, provider: "Pedro Reyes", service: "Plumbing", date: "Feb 10, 2026", time: "3:00 PM", price: "₱400", status: "cancelled" },
  ],
};

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My <Text style={styles.titleOrange}>Bookings</Text></Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              <View style={[styles.tabCount, activeTab === tab && styles.tabCountActive]}>
                <Text style={[styles.tabCountText, activeTab === tab && styles.tabCountTextActive]}>
                  {BOOKINGS[tab].length}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {BOOKINGS[activeTab].length === 0 ? (
            <View style={styles.empty}>
              <Calendar size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} bookings</Text>
            </View>
          ) : (
            BOOKINGS[activeTab].map((booking) => {
              const initials = booking.provider.split(" ").map((w) => w[0]).join("");
              return (
                <View key={booking.id} style={styles.card}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.providerName}>{booking.provider}</Text>
                      <Text style={styles.serviceName}>{booking.service}</Text>
                    </View>
                    <StatusBadge status={booking.status} />
                  </View>

                  {/* Details */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Calendar size={14} color={COLORS.primary} />
                      <View style={styles.detailText}>
                        <Text style={styles.detailLabel}>Date</Text>
                        <Text style={styles.detailValue}>{booking.date}</Text>
                      </View>
                    </View>
                    <View style={styles.detailItem}>
                      <Clock size={14} color={COLORS.primary} />
                      <View style={styles.detailText}>
                        <Text style={styles.detailLabel}>Time</Text>
                        <Text style={styles.detailValue}>{booking.time}</Text>
                      </View>
                    </View>
                    <View style={styles.detailItem}>
                      <DollarSign size={14} color={COLORS.primary} />
                      <View style={styles.detailText}>
                        <Text style={styles.detailLabel}>Total</Text>
                        <Text style={[styles.detailValue, { color: COLORS.primary }]}>{booking.price}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Actions */}
                  {activeTab === "Upcoming" && (
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => { setSelectedBooking(booking); setCancelModal(true); }}
                      >
                        <X size={14} color={COLORS.error} />
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rescheduleBtn}>
                        <RotateCcw size={14} color="#fff" />
                        <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {activeTab === "Completed" && (
                    <TouchableOpacity style={styles.reviewBtn}>
                      <Star size={14} color={COLORS.accent} fill={COLORS.accent} />
                      <Text style={styles.reviewBtnText}>Leave a Review</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      </View>

      <AlertModal
        visible={cancelModal}
        onClose={() => setCancelModal(false)}
        variant="error"
        title="Cancel Booking?"
        message={`Are you sure you want to cancel your ${selectedBooking?.service} booking with ${selectedBooking?.provider}? This cannot be undone.`}
        confirmText="Yes, Cancel"
        cancelText="Keep Booking"
        onConfirm={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 16, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  titleOrange: { color: COLORS.primary },
  tabRow: { flexDirection: "row", backgroundColor: "#fff", borderRadius: RADIUS.xl, padding: 4, marginBottom: 20, ...SHADOW.sm },
  tab: { flex: 1, flexDirection: "row", paddingVertical: 10, borderRadius: RADIUS.lg, alignItems: "center", justifyContent: "center", gap: 6 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: "600", color: COLORS.textSecondary },
  tabTextActive: { color: "#fff" },
  tabCount: { backgroundColor: COLORS.border, borderRadius: RADIUS.full, minWidth: 18, paddingHorizontal: 5, alignItems: "center" },
  tabCountActive: { backgroundColor: "rgba(255,255,255,0.3)" },
  tabCountText: { fontSize: 10, fontWeight: "700", color: COLORS.textSecondary },
  tabCountTextActive: { color: "#fff" },
  card: { backgroundColor: "#fff", borderRadius: RADIUS.xl, padding: 16, marginBottom: 14, ...SHADOW.sm },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  avatar: { width: 46, height: 46, borderRadius: RADIUS.md, backgroundColor: "#FFF7ED", justifyContent: "center", alignItems: "center", marginRight: 12, borderWidth: 2, borderColor: "#FED7AA" },
  avatarText: { fontSize: 16, fontWeight: "800", color: COLORS.primary },
  cardInfo: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  serviceName: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  detailsGrid: { flexDirection: "row", backgroundColor: COLORS.bg, borderRadius: RADIUS.md, padding: 12, marginBottom: 14, gap: 8 },
  detailItem: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 8 },
  detailText: {},
  detailLabel: { fontSize: 11, color: COLORS.textMuted },
  detailValue: { fontSize: 12, fontWeight: "700", color: COLORS.text, marginTop: 2 },
  actions: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderWidth: 1.5, borderColor: "#FECACA", borderRadius: RADIUS.md, paddingVertical: 11 },
  cancelBtnText: { color: COLORS.error, fontWeight: "700", fontSize: 13 },
  rescheduleBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 11, ...SHADOW.orange },
  rescheduleBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  reviewBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#FFFBEB", borderRadius: RADIUS.md, paddingVertical: 11 },
  reviewBtnText: { color: "#B45309", fontWeight: "700", fontSize: 13 },
  empty: { alignItems: "center", paddingTop: 80, gap: 14 },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: COLORS.textSecondary },
});