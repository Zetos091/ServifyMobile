import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Image,
} from "react-native";
import { useState } from "react";
import { Star, ChevronLeft, ThumbsUp, Send } from "lucide-react-native";
import { router } from "expo-router";
import AlertModal from "../components/AlertModal";
import { COLORS, RADIUS, SHADOW } from "../components/theme";

const SERVICE_IMAGES = {
  Electrical: require("../assets/images/electrician.jpg"),
  Plumbing:   require("../assets/images/plumbing-nobg.png"),
  Cleaning:   require("../assets/images/cleaning.jpg"),
  Painting:   require("../assets/images/painter.jpg"),
  Carpentry:  require("../assets/images/carpentry.jpg"),
  "AC Repair":require("../assets/images/electrician.jpg"),
};

const QUICK_TAGS = [
  "Professional", "On Time", "Clean Work",
  "Great Value", "Friendly", "Would Recommend",
];

// In a real app this would come from route params
const BOOKING = {
  provider: "Maria Santos",
  service:  "Cleaning",
  date:     "Feb 28, 2026",
  price:    "₱560",
};

function StarRow({ rating, onRate }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onRate(n)} activeOpacity={0.8} style={styles.starBtn}>
          <Star
            size={40}
            color={COLORS.accent}
            fill={n <= rating ? COLORS.accent : "transparent"}
            strokeWidth={1.8}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const RATING_LABELS = ["", "Terrible", "Bad", "Okay", "Good", "Excellent!"];

export default function LeaveReview() {
  const [rating, setRating]       = useState(0);
  const [review, setReview]       = useState("");
  const [tags, setTags]           = useState([]);
  const [successModal, setSuccess] = useState(false);

  const toggleTag = (tag) =>
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const canSubmit = rating > 0 && review.trim().length >= 10;

  const image = SERVICE_IMAGES[BOOKING.service] || SERVICE_IMAGES["Electrical"];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave a Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Provider Card */}
        <View style={styles.providerCard}>
          <Image source={image} style={styles.providerImage} resizeMode="cover" />
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{BOOKING.provider}</Text>
            <Text style={styles.providerService}>{BOOKING.service}</Text>
            <View style={styles.bookingMeta}>
              <Text style={styles.metaText}>📅 {BOOKING.date}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>💰 {BOOKING.price}</Text>
            </View>
          </View>
        </View>

        {/* Star Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          <StarRow rating={rating} onRate={setRating} />
          {rating > 0 && (
            <Text style={styles.ratingLabel}>{RATING_LABELS[rating]}</Text>
          )}
        </View>

        {/* Quick Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What went well?</Text>
          <View style={styles.tagWrap}>
            {QUICK_TAGS.map((tag) => {
              const active = tags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tag, active && styles.tagActive]}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.8}
                >
                  {active && <ThumbsUp size={12} color="#fff" style={{ marginRight: 4 }} />}
                  <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Written Review */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Write your review</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share your experience with this provider... (min. 10 characters)"
            placeholderTextColor={COLORS.textMuted}
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{review.length} characters</Text>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={() => canSubmit && setSuccess(true)}
          activeOpacity={canSubmit ? 0.85 : 1}
        >
          <Send size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.submitText}>Submit Review</Text>
        </TouchableOpacity>

        {!canSubmit && (
          <Text style={styles.hint}>
            {rating === 0 ? "Please select a star rating" : "Review must be at least 10 characters"}
          </Text>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Success Modal */}
      <AlertModal
        visible={successModal}
        onClose={() => { setSuccess(false); router.back(); }}
        variant="success"
        title="Review Submitted!"
        message={`Thank you for reviewing ${BOOKING.provider}. Your feedback helps others find great service providers.`}
        confirmText="Done"
        onConfirm={() => router.back()}
        dismissOnBackdrop={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content:{ paddingHorizontal: 20, paddingTop: 8 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.bg,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW.sm,
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text },

  // Provider card
  providerCard: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.xl,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    ...SHADOW.sm,
  },
  providerImage: {
    width: 64, height: 64,
    borderRadius: RADIUS.lg,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#FED7AA",
  },
  providerInfo:   { flex: 1 },
  providerName:   { fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  providerService:{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  bookingMeta:    { flexDirection: "row", alignItems: "center" },
  metaText:       { fontSize: 12, color: COLORS.textMuted },
  metaDot:        { color: COLORS.textMuted, marginHorizontal: 6 },

  // Section
  section:      { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginBottom: 14 },

  // Stars
  starRow:   { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  starBtn:   { paddingHorizontal: 6 },
  ratingLabel: {
    textAlign: "center",
    fontSize: 16, fontWeight: "700",
    color: COLORS.primary,
    marginTop: 4,
  },

  // Tags
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
  },
  tagActive:     { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tagText:       { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  tagTextActive: { color: "#fff" },

  // Text area
  textArea: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 16,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 120,
    ...SHADOW.sm,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
  },

  // Submit
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    ...SHADOW.orange,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  hint:       { textAlign: "center", fontSize: 13, color: COLORS.textMuted },
});