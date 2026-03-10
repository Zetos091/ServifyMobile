import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image } from "react-native";
import { Bell, ChevronRight, Wrench, Zap, Paintbrush, Wind, Hammer, Layers } from "lucide-react-native";
import { router } from "expo-router";
import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import ServiceCard from "../../components/ServiceCard";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

const CATEGORIES = [
  { icon: Wrench, label: "Plumbing", color: "#3B82F6" },
  { icon: Zap, label: "Electrical", color: "#F59E0B" },
  { icon: Layers, label: "Cleaning", color: "#22C55E" },
  { icon: Paintbrush, label: "Painting", color: "#A855F7" },
  { icon: Wind, label: "AC Repair", color: "#06B6D4" },
  { icon: Hammer, label: "Carpentry", color: "#EF4444" },
];

const TOP_PROVIDERS = [
  { name: "James Carter", service: "Electrical", rating: "4.9", reviews: 150, price: "₱350/hr", location: "Makati", available: true, badge: "Top Rated" },
  { name: "Maria Santos", service: "Cleaning", rating: "4.8", reviews: 95, price: "₱280/hr", location: "BGC", available: true, badge: "Popular" },
];

const NEARBY = [
  { name: "Pedro Reyes", service: "Plumbing", rating: "4.7", reviews: 74, price: "₱400/hr", location: "Pasig", available: false },
  { name: "Ana Lim", service: "Painting", rating: "4.6", reviews: 61, price: "₱320/hr", location: "Pasig", available: true },
  { name: "Carlos B.", service: "Carpentry", rating: "4.5", reviews: 43, price: "₱380/hr", location: "Taguig", available: true },
];

export default function Home() {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.headingLine}>
              Find a <Text style={styles.headingOrange}>Service</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Bell size={20} color={COLORS.text} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="What service do you need?"
          onFilterPress={() => {}}
        />

        {/* Hero Banner */}
        <View style={styles.banner}>
          {/* Text Side */}
          <View style={styles.bannerContent}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>Popular Pick</Text>
            </View>
            <Text style={styles.bannerTitle}>Hire a{"\n"}Service Man</Text>
            <Text style={styles.bannerSub}>Ready to help, brings{"\n"}tools & experience</Text>
            <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.85}>
              <Text style={styles.bannerBtnText}>Book Now</Text>
            </TouchableOpacity>
          </View>

          {/* Hero figure — anchored to bottom-right, tall enough to overflow */}
          <View style={styles.bannerImageWrap}>
            <Image
              source={require("../../assets/images/plumbing-removebg.png")}
              style={styles.bannerImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <TouchableOpacity style={styles.seeAllBtn} onPress={() => router.push("/(tabs)/browse")}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <TouchableOpacity key={cat.label} style={styles.categoryCard} activeOpacity={0.8}>
                <View style={[styles.categoryIconCircle, { backgroundColor: cat.color + "18" }]}>
                  <Icon size={22} color={cat.color} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Top Providers */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Providers</Text>
          <TouchableOpacity style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        {TOP_PROVIDERS.map((p) => (
          <ServiceCard key={p.name} provider={p} onPress={() => {}} onBook={() => {}} />
        ))}

        {/* Near You */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Near You</Text>
          <TouchableOpacity style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          {NEARBY.map((p) => (
            <ServiceCard key={p.name} provider={p} variant="compact" onPress={() => {}} />
          ))}
        </ScrollView>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const BANNER_HEIGHT = 210;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1, paddingHorizontal: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 16,
    marginBottom: 20,
  },
  greeting: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 4 },
  headingLine: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  headingOrange: { color: COLORS.primary },
  bellBtn: {
    position: "relative",
    width: 44, height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW.sm,
  },
  bellDot: {
    position: "absolute",
    top: 10, right: 10,
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  // ─── Banner ───────────────────────────────────────────────
  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xxl,
    height: BANNER_HEIGHT,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 28,
    ...SHADOW.orange,
  },
  bannerContent: {
    flex: 1,
    paddingLeft: 22,
    paddingTop: 22,
    paddingBottom: 22,
    justifyContent: "center",
  },
  bannerBadge: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  bannerBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 28,
    marginBottom: 6,
  },
  bannerSub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 18,
  },
  bannerBtn: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.md,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  bannerBtnText: { color: COLORS.primary, fontWeight: "800", fontSize: 13 },

  // Image anchored to bottom-right corner, taller than banner so feet crop naturally
  bannerImageWrap: {
    width: 150,
    position: "relative",
    overflow: "hidden",
  },
  bannerImage: {
    position: "absolute",
    bottom: -100,       // push feet slightly below banner edge → natural standing crop
    right: -80,
    width: 300,
    height: BANNER_HEIGHT + 150, // taller than banner so figure fills height nicely
  },

  // ─── Sections ─────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text },
  seeAllBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { fontSize: 13, fontWeight: "600", color: COLORS.primary },

  categoryScroll: { marginBottom: 28 },
  categoryCard: { alignItems: "center", marginRight: 16 },
  categoryIconCircle: {
    width: 58, height: 58,
    borderRadius: RADIUS.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryLabel: { fontSize: 12, fontWeight: "600", color: COLORS.textSecondary },
});