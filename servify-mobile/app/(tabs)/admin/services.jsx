import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
  RefreshControl, Switch, Alert,
} from "react-native";
import { Tag, MapPin, Trash2, Star } from "lucide-react-native";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { COLORS, RADIUS, SHADOW } from "../../../components/theme";
import { getAllServices, toggleServiceStatus, deleteService } from "../../../services/admin";

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: services, isLoading, refetch } = useQuery({
    queryKey: ["adminServices"],
    queryFn: getAllServices,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => toggleServiceStatus(id, is_active),
    onSuccess: () => queryClient.invalidateQueries(["adminServices"]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteService(id),
    onSuccess: () => queryClient.invalidateQueries(["adminServices"]),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  const handleDelete = (id, title) => {
    Alert.alert(
      "Delete Service",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate(id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>All Services</Text>
            <Text style={styles.subtitle}>{services?.length ?? 0} listings</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
          ) : !services?.length ? (
            <View style={styles.emptyBox}>
              <Tag size={36} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No services found</Text>
            </View>
          ) : (
            services.map((service) => (
              <View key={service.id} style={styles.card}>
                {/* Top */}
                <View style={styles.cardTop}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.serviceTitle} numberOfLines={1}>{service.title}</Text>
                    <Text style={styles.providerName}>{service.provider_name}</Text>
                    <View style={styles.metaRow}>
                      <View style={styles.categoryBadge}>
                        <Tag size={11} color={COLORS.primary} />
                        <Text style={styles.categoryText}>{service.category_name}</Text>
                      </View>
                      <View style={styles.ratingRow}>
                        <Star size={11} color={COLORS.warning} fill={COLORS.warning} />
                        <Text style={styles.ratingText}>
                          {Number(service.average_rating).toFixed(1)} ({service.review_count})
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.price}>₱{service.price}</Text>
                </View>

                {/* Description */}
                <Text style={styles.description} numberOfLines={2}>{service.description}</Text>

                {/* Location */}
                {service.location && (
                  <View style={styles.locationRow}>
                    <MapPin size={12} color={COLORS.textMuted} />
                    <Text style={styles.locationText}>{service.location}</Text>
                  </View>
                )}

                {/* Bottom */}
                <View style={styles.cardBottom}>
                  <View style={styles.toggleRow}>
                    <Switch
                      value={service.is_active}
                      onValueChange={(val) => toggleMutation.mutate({ id: service.id, is_active: val })}
                      trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
                      thumbColor={service.is_active ? COLORS.primary : COLORS.textMuted}
                    />
                    <Text style={[styles.toggleLabel, { color: service.is_active ? COLORS.success : COLORS.textMuted }]}>
                      {service.is_active ? "Active" : "Inactive"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(service.id, service.title)}
                  >
                    <Trash2 size={15} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
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
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12, ...SHADOW.sm },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  cardInfo: { flex: 1, marginRight: 12 },
  serviceTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  providerName: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  categoryBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  categoryText: { fontSize: 11, color: COLORS.primary, fontWeight: "600" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: "600" },
  price: { fontSize: 17, fontWeight: "800", color: COLORS.primary },
  description: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8, lineHeight: 18 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 12 },
  locationText: { fontSize: 12, color: COLORS.textMuted },
  cardBottom: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", borderTopWidth: 1,
    borderTopColor: COLORS.border, paddingTop: 12,
  },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  toggleLabel: { fontSize: 13, fontWeight: "600" },
  deleteBtn: {
    width: 36, height: 36, borderRadius: RADIUS.md,
    backgroundColor: "#FFF1F2", justifyContent: "center", alignItems: "center",
  },
  emptyBox: { alignItems: "center", paddingVertical: 48, backgroundColor: COLORS.card, borderRadius: RADIUS.xl, ...SHADOW.sm },
  emptyText: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginTop: 12 },
});