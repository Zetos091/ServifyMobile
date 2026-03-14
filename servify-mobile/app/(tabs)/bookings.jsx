import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from "react-native";
import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { Calendar, Clock, User, Star, X, Eye } from "lucide-react-native";
import AlertModal from "../../components/AlertModal";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";
import { getClientBookings, cancelBooking } from "../../services/bookings";
import { getProfile } from "../../services/auth";

const TABS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];
const STATUS_ORDER = { pending: 0, confirmed: 1, completed: 2, cancelled: 3 };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(raw) {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(raw) {
  if (!raw) return "—";
  if (/AM|PM/i.test(raw)) return raw;
  const [h, m] = raw.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${suffix}`;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  pending:   { bg: "#FEF9C3", text: "#A16207" },
  confirmed: { bg: "#DBEAFE", text: "#1D4ED8" },
  completed: { bg: "#DCFCE7", text: "#15803D" },
  cancelled: { bg: "#FEE2E2", text: "#B91C1C" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: "#F3F4F6", text: "#6B7280" };
  return (
    <View style={[badgeStyles.wrap, { backgroundColor: s.bg }]}>
      <Text style={[badgeStyles.label, { color: s.text }]}>{status}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  wrap:  { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 },
  label: { fontSize: 11, fontWeight: "700", textTransform: "lowercase" },
});

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, onCancel }) {
  const isPending   = booking.status === "pending";
  const isCompleted = booking.status === "completed";

  return (
    <View style={cardStyles.card}>
      {/* Top row */}
      <View style={cardStyles.topRow}>
        <View style={cardStyles.topLeft}>
          <Text style={cardStyles.serviceName} numberOfLines={1}>
            {booking.service_name ?? booking.service}
          </Text>
          <StatusBadge status={booking.status} />
        </View>
        <Text style={cardStyles.price}>
          ₱{Number(booking.total_price ?? booking.price).toFixed(2)}
        </Text>
      </View>

      {/* Meta */}
      <View style={cardStyles.meta}>
        <View style={cardStyles.metaRow}>
          <Calendar size={13} color="#6B7280" />
          <Text style={cardStyles.metaText}>
            {formatDate(booking.booking_date ?? booking.date)}
          </Text>
        </View>
        <View style={cardStyles.metaRow}>
          <Clock size={13} color="#6B7280" />
          <Text style={cardStyles.metaText}>
            {formatTime(booking.booking_time ?? booking.time)}
          </Text>
        </View>
        <View style={cardStyles.metaRow}>
          <User size={13} color="#6B7280" />
          <Text style={cardStyles.metaText}>
            Provider: {booking.provider_name ?? booking.provider}
          </Text>
        </View>
      </View>

      <View style={cardStyles.divider} />

      {/* Actions */}
      <View style={cardStyles.actions}>
        {isPending ? (
          <TouchableOpacity
            style={cardStyles.cancelBtn}
            onPress={() => onCancel(booking)}
          >
            <X size={13} color="#DC2626" />
            <Text style={cardStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        ) : isCompleted && !booking.reviewed ? (
          <TouchableOpacity
            style={cardStyles.reviewBtn}
            onPress={() => router.push(`/rate-app?bookingId=${booking.id}`)}
          >
            <Star size={13} color="#D97706" fill="#D97706" />
            <Text style={cardStyles.reviewText}>Leave a Review</Text>
          </TouchableOpacity>
        ) : isCompleted && booking.reviewed ? (
          <Text style={cardStyles.reviewedText}>Reviewed</Text>
        ) : (
          <View style={{ flex: 0 }} />
        )}

        <TouchableOpacity
          style={cardStyles.detailsBtn}
          onPress={() => router.push(`/booking-details?id=${booking.id}`)}
        >
          <Eye size={13} color="#fff" />
          <Text style={cardStyles.detailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  topLeft:     { flexDirection: "row", alignItems: "center", gap: 8, flex: 1, flexWrap: "wrap", marginRight: 8 },
  serviceName: { fontSize: 15, fontWeight: "700", color: "#111827", flexShrink: 1 },
  price:       { fontSize: 15, fontWeight: "800", color: "#111827" },
  meta:        { gap: 6, marginBottom: 14 },
  metaRow:     { flexDirection: "row", alignItems: "center", gap: 7 },
  metaText:    { fontSize: 13, color: "#6B7280" },
  divider:     { height: 1, backgroundColor: "#F3F4F6", marginBottom: 12 },
  actions:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 36 },
  cancelBtn:   { flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1.5, borderColor: "#FECACA", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  cancelText:  { color: "#DC2626", fontWeight: "700", fontSize: 13 },
  reviewBtn:   { flexDirection: "row", alignItems: "center", gap: 5 },
  reviewText:  { color: "#D97706", fontWeight: "700", fontSize: 13 },
  reviewedText:{ color: "#9CA3AF", fontSize: 13, fontStyle: "italic" },
  detailsBtn:  { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#111827", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  detailsText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
function TabBar({ activeTab, setActiveTab, bookings }) {
  function countFor(tab) {
    if (tab === "All") return bookings.length;
    return bookings.filter((b) => b.status === tab.toLowerCase()).length;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={tabStyles.scroll}
      contentContainerStyle={tabStyles.row}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[tabStyles.tab, isActive && tabStyles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
          >
            <Text style={[tabStyles.tabText, isActive && tabStyles.tabTextActive]}>
              {tab}
            </Text>
            <View style={[tabStyles.badge, isActive && tabStyles.badgeActive]}>
              <Text style={[tabStyles.badgeText, isActive && tabStyles.badgeTextActive]}>
                {countFor(tab)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const tabStyles = StyleSheet.create({
  scroll:        { flexGrow: 0, marginBottom: 16 },
  row:           { flexDirection: "row", gap: 8, paddingVertical: 2 },
  tab:           { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 99, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB" },
  tabActive:     { backgroundColor: "#111827", borderColor: "#111827" },
  tabText:       { fontSize: 12, fontWeight: "600", color: "#374151" },
  tabTextActive: { color: "#fff" },
  badge:         { backgroundColor: "#F3F4F6", borderRadius: 99, minWidth: 18, paddingHorizontal: 4, alignItems: "center", justifyContent: "center" },
  badgeActive:   { backgroundColor: "rgba(255,255,255,0.25)" },
  badgeText:     { fontSize: 10, fontWeight: "700", color: "#6B7280", lineHeight: 16 },
  badgeTextActive: { color: "#fff" },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Bookings() {
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [selected, setSelected]   = useState(null);

  // Refresh on every screen focus
  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  async function fetchBookings(isRefresh = false) {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const user = await getProfile();
      const data = await getClientBookings(user.id);
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("fetchBookings error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const filtered = (
    activeTab === "All"
      ? [...bookings]
      : bookings.filter((b) => b.status === activeTab.toLowerCase())
  ).sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99));

  function handleCancelPress(booking) {
    setSelected(booking);
    setCancelModal(true);
  }

  async function handleConfirmCancel() {
    if (!selected) return;
    try {
      await cancelBooking(selected.id);
      setBookings((prev) =>
        prev.map((b) => (b.id === selected.id ? { ...b, status: "cancelled" } : b))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setCancelModal(false);
      setSelected(null);
    }
  }

  const Header = (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>View and manage your service bookings.</Text>
      </View>
      <TabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookings={bookings}
      />
    </View>
  );

  const Empty = (
    <View style={styles.center}>
      <Calendar size={48} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} bookings</Text>
      <Text style={styles.emptySubtitle}>Your bookings will appear here.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={loading ? [] : filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <BookingCard booking={item} onCancel={handleCancelPress} />
        )}
        ListHeaderComponent={Header}
        ListEmptyComponent={loading ? (
          <View style={styles.center}>
            <Text style={styles.loadingText}>Loading bookings…</Text>
          </View>
        ) : Empty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBookings(true)}
            colors={["#111827"]}
            tintColor="#111827"
          />
        }
      />

      <AlertModal
        visible={cancelModal}
        onClose={() => setCancelModal(false)}
        variant="error"
        title="Cancel Booking?"
        message={`Are you sure you want to cancel your ${selected?.service_name ?? selected?.service} booking with ${selected?.provider_name ?? selected?.provider}? This cannot be undone.`}
        confirmText="Yes, Cancel"
        cancelText="Keep Booking"
        onConfirm={handleConfirmCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: "#F9FAFB" },
  listContent: { paddingHorizontal: 16, paddingBottom: 32 },
  header:      { marginTop: 20, marginBottom: 16 },
  title:       { fontSize: 24, fontWeight: "800", color: "#111827" },
  subtitle:    { fontSize: 13, color: "#6B7280", marginTop: 2 },
  center:      { alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 10 },
  loadingText: { fontSize: 14, color: "#9CA3AF" },
  emptyTitle:  { fontSize: 16, fontWeight: "600", color: "#374151" },
  emptySubtitle: { fontSize: 13, color: "#9CA3AF" },
});