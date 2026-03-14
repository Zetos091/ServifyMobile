import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
  RefreshControl, Switch, Alert,
} from "react-native";
import { User, Trash2, Shield, Briefcase, Users } from "lucide-react-native";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { COLORS, RADIUS, SHADOW } from "../../../components/theme";
import { getAllUsers, toggleUserStatus, deleteUser } from "../../../services/admin";

const TABS = ["all", "client", "provider", "admin"];

const ROLE_CONFIG = {
  client:   { color: COLORS.info,    bg: "#EFF6FF", icon: User },
  provider: { color: COLORS.primary, bg: COLORS.primaryLight, icon: Briefcase },
  admin:    { color: COLORS.warning, bg: "#FFFBEB", icon: Shield },
};

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["adminUsers", activeTab],
    queryFn: () => getAllUsers(activeTab === "all" ? "" : activeTab),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => toggleUserStatus(id, is_active),
    onSuccess: () => queryClient.invalidateQueries(["adminUsers"]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries(["adminUsers"]),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [activeTab]);

  const handleDelete = (id, name) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete "${name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate(id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Users</Text>
          <Text style={styles.subtitle}>{users?.length ?? 0} total</Text>
        </View>

        {/* Role Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
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
          ) : !users?.length ? (
            <View style={styles.emptyBox}>
              <Users size={36} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          ) : (
            users.map((user) => {
              const role = ROLE_CONFIG[user.user_type] || ROLE_CONFIG.client;
              const RoleIcon = role.icon;
              return (
                <View key={user.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    {/* Avatar */}
                    <View style={[styles.avatar, { backgroundColor: role.bg }]}>
                      <Text style={[styles.avatarText, { color: role.color }]}>
                        {user.full_name?.[0]?.toUpperCase() || "U"}
                      </Text>
                    </View>

                    {/* Info */}
                    <View style={styles.info}>
                      <Text style={styles.userName}>{user.full_name}</Text>
                      <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
                      <View style={[styles.roleBadge, { backgroundColor: role.bg }]}>
                        <RoleIcon size={11} color={role.color} />
                        <Text style={[styles.roleText, { color: role.color }]}>
                          {user.user_type}
                        </Text>
                      </View>
                    </View>

                    {/* Delete */}
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(user.id, user.full_name)}
                    >
                      <Trash2 size={15} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>

                  {/* Toggle active */}
                  <View style={styles.cardBottom}>
                    <Text style={styles.toggleLabel}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Text>
                    <Switch
                      value={user.is_active}
                      onValueChange={(val) => toggleMutation.mutate({ id: user.id, is_active: val })}
                      trackColor={{ false: COLORS.border, true: COLORS.primary + "60" }}
                      thumbColor={user.is_active ? COLORS.primary : COLORS.textMuted}
                    />
                  </View>
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
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  tabsScroll: { marginBottom: 16 },
  tabs: { flexDirection: "row", gap: 8, paddingRight: 20 },
  tab: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: RADIUS.full, backgroundColor: COLORS.card,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  tabTextActive: { color: "#fff" },
  card: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.xl,
    padding: 16, marginBottom: 10, ...SHADOW.sm,
  },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: {
    width: 46, height: 46, borderRadius: RADIUS.lg,
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: "800" },
  info: { flex: 1 },
  userName: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  userEmail: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6 },
  roleBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  roleText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  deleteBtn: {
    width: 34, height: 34, borderRadius: RADIUS.md,
    backgroundColor: "#FFF1F2", justifyContent: "center", alignItems: "center",
  },
  cardBottom: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", borderTopWidth: 1,
    borderTopColor: COLORS.border, paddingTop: 10,
  },
  toggleLabel: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  emptyBox: {
    alignItems: "center", paddingVertical: 48,
    backgroundColor: COLORS.card, borderRadius: RADIUS.xl, ...SHADOW.sm,
  },
  emptyText: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginTop: 12 },
});