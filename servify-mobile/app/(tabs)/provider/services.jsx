import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
  RefreshControl, Switch, Alert,
} from "react-native";
import { Plus, Edit2, Trash2, MapPin, Tag } from "lucide-react-native";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { COLORS, RADIUS, SHADOW } from "../../../components/theme";
import { getProviderServices, toggleServiceStatus, deleteService } from "../../../services/provider";

export default function ProviderServices() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: services, isLoading, refetch } = useQuery({
    queryKey: ["providerServices"],
    queryFn: getProviderServices,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => toggleServiceStatus(id, is_active),
    onSuccess: () => queryClient.invalidateQueries(["providerServices"]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteService(id),
    onSuccess: () => queryClient.invalidateQueries(["providerServices"]),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  const handleDelete = (id, title) => {
    Alert.alert("Delete Service", `Are you sure you want to delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>My Services</Text>
              <Text style={styles.subtitle}>{services?.length ?? 0} listing{services?.length !== 1 ? "s" : ""}</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
              <Plus size={20} color={COLORS.white} />
              <Text style={styles.addBtnText}>Add New</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
          ) : !services?.length ? (
            <View style={styles.emptyBox}>
              <Tag size={36} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No services yet</Text>
              <Text style={styles.emptySubText}>Tap "Add New" to create your first service listing</Text>
            </View>
          ) : (
            services.map((service) => (
              <View key={service.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.serviceTitle} numberOfLines={1}>{service.title}</Text>
                    <View style={styles.categoryRow}>
                      <Tag size={12} color={COLORS.primary} />
                      <Text style={styles.categoryText}>{service.category_name}</Text>
                    </View>
                  </View>
                  <Text style={styles.price}>₱{service.price}</Text>
                </View>

                <Text style={styles.description} numberOfLines={2}>{service.description}</Text>

                {service.location && (
                  <View style={styles.locationRow}>
                    <MapPin size={13} color={COLORS.textMuted} />
                    <Text style={styles.locationText}>{service.location}</Text>
                  </View>
                )}

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
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
                      <Edit2 size={15} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.7} onPress={() => handleDelete(service.id, service.title)}>
                      <Trash2 size={15} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  addBtn: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.full, gap: 6, ...SHADOW.orange },
  addBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 14 },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12, ...SHADOW.sm },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  cardInfo: { flex: 1, marginRight: 12 },
  serviceTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 4 },
  categoryRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  categoryText: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  price: { fontSize: 18, fontWeight: "800", color: COLORS.primary },
  description: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8, lineHeight: 18 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 12 },
  locationText: { fontSize: 12, color: COLORS.textMuted },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12 },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  toggleLabel: { fontSize: 13, fontWeight: "600" },
  actions: { flexDirection: "row", gap: 8 },
  editBtn: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center" },
  deleteBtn: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: COLORS.errorLight, justifyContent: "center", alignItems: "center" },
  emptyBox: { alignItems: "center", paddingVertical: 48, backgroundColor: COLORS.card, borderRadius: RADIUS.xl, ...SHADOW.sm },
  emptyText: { fontSize: 16, fontWeight: "700", color: COLORS.text, marginTop: 14 },
  emptySubText: { fontSize: 13, color: COLORS.textMuted, marginTop: 6, textAlign: "center", paddingHorizontal: 24 },
});