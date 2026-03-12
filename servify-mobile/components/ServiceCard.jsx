import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Star, MapPin } from "lucide-react-native";
import { COLORS, RADIUS, SHADOW } from "./theme";

const SERVICE_IMAGES = {
  Electrical: require("../assets/images/electrician.jpg"),
  Plumbing: require("../assets/images/plumbing-nobg.png"),
  Cleaning: require("../assets/images/cleaning.jpg"),
  Painting: require("../assets/images/painter.jpg"),
  Carpentry: require("../assets/images/carpentry.jpg"),
  "AC Repair": require("../assets/images/electrician.jpg"),
};

/**
 * ServiceCard — displays a service provider card
 * @param {object} provider - { name, service, rating, reviews, price, location, available, badge }
 * @param {string} variant - "full" | "compact"
 * @param {function} onPress
 * @param {function} onBook
 */
export default function ServiceCard({ provider, variant = "full", onPress, onBook }) {
  const image = SERVICE_IMAGES[provider.service] || SERVICE_IMAGES["Electrical"];

  if (variant === "compact") {
    return (
      <TouchableOpacity style={styles.compact} onPress={onPress} activeOpacity={0.85}>
        <Image source={image} style={styles.compactImage} resizeMode="cover" />
        <View style={styles.compactOverlay} />
        <View style={styles.compactContent}>
          <Text style={styles.compactName} numberOfLines={1}>{provider.name}</Text>
          <Text style={styles.compactService} numberOfLines={1}>{provider.service}</Text>
          <View style={styles.compactRating}>
            <Star size={11} color={COLORS.accent} fill={COLORS.accent} />
            <Text style={styles.compactRatingText}>{provider.rating}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.top}>
        <View style={styles.imageWrap}>
          <Image source={image} style={styles.providerImage} resizeMode="cover" />
          <View style={[styles.onlineDot, { backgroundColor: provider.available ? COLORS.success : COLORS.textMuted }]} />
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{provider.name}</Text>
            {provider.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{provider.badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.service}>{provider.service}</Text>
          <View style={styles.metaRow}>
            <Star size={12} color={COLORS.accent} fill={COLORS.accent} />
            <Text style={styles.rating}>{provider.rating}</Text>
            <Text style={styles.reviews}>({provider.reviews})</Text>
            <MapPin size={11} color={COLORS.textMuted} style={{ marginLeft: 8 }} />
            <Text style={styles.location}>{provider.location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <View>
          <Text style={styles.priceLabel}>Starting at</Text>
          <Text style={styles.price}>{provider.price}</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={onBook} activeOpacity={0.8}>
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: 16,
    marginBottom: 12,
    ...SHADOW.sm,
  },
  top: { flexDirection: "row", marginBottom: 14 },
  imageWrap: { position: "relative", marginRight: 14 },
  providerImage: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: "#FED7AA",
    backgroundColor: "#FFF7ED",
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  info: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  name: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginRight: 6 },
  badge: { backgroundColor: "#FFF7ED", borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: "700", color: COLORS.primary },
  service: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  metaRow: { flexDirection: "row", alignItems: "center" },
  rating: { fontSize: 12, fontWeight: "700", color: COLORS.text, marginLeft: 3 },
  reviews: { fontSize: 12, color: COLORS.textMuted, marginLeft: 2 },
  location: { fontSize: 12, color: COLORS.textMuted, marginLeft: 3 },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F4",
    paddingTop: 12,
  },
  priceLabel: { fontSize: 11, color: COLORS.textMuted },
  price: { fontSize: 16, fontWeight: "800", color: COLORS.primary },
  bookBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: 20,
    paddingVertical: 10,
    ...SHADOW.orange,
  },
  bookBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  // Compact — image card with overlay like the reference
  compact: {
    width: 140,
    height: 180,
    borderRadius: RADIUS.xl,
    marginRight: 12,
    overflow: "hidden",
    ...SHADOW.md,
  },
  compactImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  compactOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  compactContent: {
    position: "absolute",
    bottom: 16,
    left: 12,
    right: 12,
  },
  compactName: { fontSize: 13, fontWeight: "700", color: "#fff", marginBottom: 2 },
  compactService: { fontSize: 11, color: "rgba(255,255,255,0.8)", marginBottom: 5 },
  compactRating: { flexDirection: "row", alignItems: "center", gap: 3 },
  compactRatingText: { fontSize: 12, fontWeight: "700", color: "#fff" },
});