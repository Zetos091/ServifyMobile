import {
  View, Text, FlatList, ScrollView,
  TouchableOpacity, StyleSheet, SafeAreaView,
  ActivityIndicator, RefreshControl,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import SearchBar from "../../components/SearchBar";
import ServiceCard from "../../components/ServiceCard";
import AlertModal from "../../components/AlertModal";
import { COLORS, RADIUS } from "../../components/theme";
import { getServices, getCategories } from "../../services/services";

export default function Browse() {
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [bookModal, setBookModal]       = useState(false);
  const [selectedProvider, setSelected] = useState(null);

  const [services, setServices]         = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [error, setError]               = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    getCategories()
      .then((cats) => setCategories([{ id: "all", name: "All" }, ...cats]))
      .catch((err) => console.warn("Failed to load categories:", err));
  }, []);

  const fetchServices = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await getServices({ category_name: activeFilter, search });
      const normalised = data.map((s) => ({
        id:        s.id,
        name:      s.title,
        service:   s.provider_name,
        title:     s.title,
        rating:    parseFloat(s.average_rating).toFixed(1),
        reviews:   parseInt(s.review_count, 10),
        price:     `₱${parseFloat(s.price).toLocaleString()}/hr`,
        location:  s.location ?? "N/A",
        available: s.is_active,
        image:     s.image_url ?? null,
        badge:     parseInt(s.review_count, 10) >= 100  ? "Top Rated"
               : parseInt(s.jobs_completed, 10) >= 50 ? "Popular"
               : undefined,
      }));
      setServices(normalised);
    } catch (err) {
      const msg = err.response?.data?.message || "Could not load services. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter, search]);

  useEffect(() => {
    if (!isFocused) return;
    let cancelled = false;
    const delay = search.trim() ? 400 : 0;
    const timer = setTimeout(() => {
      if (!cancelled) fetchServices();
    }, delay);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [isFocused, activeFilter, search]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchServices({ silent: true });
  }, [fetchServices]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Browse <Text style={styles.titleOrange}>Services</Text>
          </Text>
          <Text style={styles.subtitle}>
            {loading ? "Loading…" : `${services.length} providers found`}
          </Text>
        </View>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search services or providers..."
          onFilterPress={() => {}}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
          style={styles.chipScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, activeFilter === cat.name && styles.chipActive]}
              onPress={() => setActiveFilter(cat.name)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, activeFilter === cat.name && styles.chipTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      {!loading && error && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchServices()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No providers found</Text>
              <Text style={styles.emptyDesc}>Try a different search or filter</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ServiceCard
              provider={item}
              onPress={() => router.push({ pathname: "/(tabs)/service-detail", params: { id: item.id } })}
              onBook={() => router.push({ pathname: "/(tabs)/service-detail", params: { id: item.id } })}
            />
          )}
        />
      )}

      <AlertModal
        visible={bookModal}
        onClose={() => setBookModal(false)}
        variant="confirm"
        title={`Book ${selectedProvider?.name}?`}
        message={`You're about to book ${selectedProvider?.service} service at ${selectedProvider?.price}. You can reschedule anytime.`}
        confirmText="Confirm Booking"
        cancelText="Cancel"
        onConfirm={() => setBookModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  top: { paddingHorizontal: 20, paddingTop: 16, backgroundColor: COLORS.bg },
  header:      { marginBottom: 16 },
  title:       { fontSize: 26, fontWeight: "800", color: COLORS.text },
  titleOrange: { color: COLORS.primary },
  subtitle:    { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  chipScroll: { marginBottom: 16, flexGrow: 0 },
  chipRow:    { flexDirection: "row", alignItems: "center", paddingRight: 8 },
  chip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    marginRight: 8,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive:     { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText:       { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  chipTextActive: { color: "#fff" },
  list:       { paddingHorizontal: 20, paddingBottom: 32 },
  empty:      { alignItems: "center", paddingTop: 80 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  emptyDesc:  { fontSize: 14, color: COLORS.textSecondary },
  centered:  { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 60 },
  errorText: { fontSize: 15, color: "#e74c3c", marginBottom: 12, textAlign: "center" },
  retryBtn:  { paddingHorizontal: 24, paddingVertical: 10, borderRadius: RADIUS.full, backgroundColor: COLORS.primary },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});