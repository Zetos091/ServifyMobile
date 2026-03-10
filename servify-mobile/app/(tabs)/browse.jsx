import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import ServiceCard from "../../components/ServiceCard";
import AlertModal from "../../components/AlertModal";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

const FILTERS = ["All", "Plumbing", "Electrical", "Cleaning", "Painting", "AC Repair", "Carpentry"];

const SERVICES = [
  { name: "James Carter", service: "Electrical", rating: "4.9", reviews: 150, price: "₱350/hr", location: "Makati", available: true, badge: "Top Rated" },
  { name: "Maria Santos", service: "Cleaning", rating: "4.8", reviews: 95, price: "₱280/hr", location: "BGC", available: true, badge: "Popular" },
  { name: "Pedro Reyes", service: "Plumbing", rating: "4.7", reviews: 74, price: "₱400/hr", location: "Quezon City", available: false },
  { name: "Ana Lim", service: "Painting", rating: "4.6", reviews: 61, price: "₱320/hr", location: "Pasig", available: true },
  { name: "Carlos Bautista", service: "AC Repair", rating: "4.9", reviews: 112, price: "₱450/hr", location: "Mandaluyong", available: true, badge: "Popular" },
  { name: "Rosa Cruz", service: "Carpentry", rating: "4.5", reviews: 43, price: "₱380/hr", location: "Taguig", available: false },
];

export default function Browse() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [bookModal, setBookModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const filtered = SERVICES.filter((s) => {
    const matchFilter = activeFilter === "All" || s.service === activeFilter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.service.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleBook = (provider) => {
    setSelectedProvider(provider);
    setBookModal(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Browse <Text style={styles.titleOrange}>Services</Text></Text>
          <Text style={styles.subtitle}>{filtered.length} providers found</Text>
        </View>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search services or providers..."
          onFilterPress={() => {}}
        />

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, activeFilter === f && styles.chipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No providers found</Text>
              <Text style={styles.emptyDesc}>Try a different search or filter</Text>
            </View>
          ) : (
            filtered.map((p) => (
              <ServiceCard
                key={p.name}
                provider={p}
                onPress={() => {}}
                onBook={() => handleBook(p)}
              />
            ))
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      </View>

      {/* Book Confirmation Modal */}
      <AlertModal
        visible={bookModal}
        onClose={() => setBookModal(false)}
        variant="confirm"
        title={`Book ${selectedProvider?.name}?`}
        message={`You're about to book ${selectedProvider?.service} service at ${selectedProvider?.price}. You can reschedule anytime.`}
        confirmText="Confirm Booking"
        cancelText="Cancel"
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
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  filterScroll: { marginBottom: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    marginRight: 8,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  chipTextActive: { color: "#fff" },
  empty: { alignItems: "center", paddingTop: 80 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  emptyDesc: { fontSize: 14, color: COLORS.textSecondary },
});