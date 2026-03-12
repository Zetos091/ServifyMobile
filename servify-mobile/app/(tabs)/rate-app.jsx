import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from "react-native";
import { ChevronLeft, Star, Send } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import AlertModal from "../../components/AlertModal";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

const LABELS = ["Terrible", "Bad", "Okay", "Good", "Excellent"];
const QUICK_TAGS = ["Easy to use", "Great providers", "Fast booking", "Good value", "Needs improvement", "More services needed"];

// Defined outside to prevent keyboard issues
const ReviewInput = ({ value, onChange }) => (
  <View style={styles.textAreaWrap}>
    <TextInput
      style={styles.textArea}
      value={value}
      onChangeText={onChange}
      placeholder="Tell us what you love or what we can improve..."
      placeholderTextColor={COLORS.textMuted}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      autoCorrect
    />
    <Text style={styles.charCount}>{value.length}/300</Text>
  </View>
);

export default function RateApp() {
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState([]);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (t) => setTags((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/(tabs)/profile")}>
              <ChevronLeft size={22} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Rate the App</Text>
            <View style={{ width: 38 }} />
          </View>

          {/* Hero */}
          <View style={styles.heroCard}>
            <Text style={styles.heroEmoji}>🧡</Text>
            <Text style={styles.heroTitle}>Enjoying Servify?</Text>
            <Text style={styles.heroDesc}>Your feedback helps us improve the experience for everyone.</Text>
          </View>

          {/* Stars */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Your Rating</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setRating(n)} activeOpacity={0.7}>
                  <Star
                    size={44}
                    color={n <= rating ? "#F59E0B" : COLORS.border}
                    fill={n <= rating ? "#F59E0B" : "transparent"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={styles.ratingLabel}>{LABELS[rating - 1]}</Text>
            )}
          </View>

          {/* Quick tags */}
          {rating > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>What stood out?</Text>
              <View style={styles.tagsWrap}>
                {QUICK_TAGS.map((t) => {
                  const active = tags.includes(t);
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[styles.tag, active && styles.tagActive]}
                      onPress={() => toggleTag(t)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.tagText, active && styles.tagTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Written review */}
          {rating > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Leave a comment (optional)</Text>
              <ReviewInput value={review} onChange={(v) => setReview(v.slice(0, 300))} />
            </View>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={rating === 0}
          >
            <Send size={16} color="#fff" />
            <Text style={styles.submitBtnText}>Submit Review</Text>
          </TouchableOpacity>

          {rating === 0 && (
            <Text style={styles.hint}>Tap a star to rate before submitting</Text>
          )}

        </View>
      </ScrollView>

      <AlertModal
        visible={submitted}
        onClose={() => { setSubmitted(false); router.push("/(tabs)/profile"); }}
        variant="success"
        title="Thanks for your feedback!"
        message="Your review helps us make Servify better for everyone."
        confirmText="Done"
        onConfirm={() => { setSubmitted(false); router.push("/(tabs)/profile"); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 24 },
  backBtn: { width: 38, height: 38, borderRadius: RADIUS.md, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", ...SHADOW.sm },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  heroCard: { backgroundColor: "#fff", borderRadius: RADIUS.xxl, padding: 28, alignItems: "center", marginBottom: 16, ...SHADOW.sm, gap: 8 },
  heroEmoji: { fontSize: 44 },
  heroTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  heroDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", lineHeight: 19 },
  card: { backgroundColor: "#fff", borderRadius: RADIUS.xl, padding: 20, marginBottom: 14, ...SHADOW.sm },
  cardLabel: { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary, marginBottom: 14 },
  starsRow: { flexDirection: "row", justifyContent: "center", gap: 8 },
  ratingLabel: { textAlign: "center", marginTop: 12, fontSize: 15, fontWeight: "700", color: "#F59E0B" },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.bg },
  tagActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tagText: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  tagTextActive: { color: "#fff" },
  textAreaWrap: { backgroundColor: COLORS.bg, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, padding: 14 },
  textArea: { fontSize: 14, color: COLORS.text, minHeight: 90, lineHeight: 21 },
  charCount: { fontSize: 11, color: COLORS.textMuted, textAlign: "right", marginTop: 6 },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 16, ...SHADOW.orange },
  submitBtnDisabled: { backgroundColor: COLORS.border, shadowOpacity: 0 },
  submitBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  hint: { textAlign: "center", fontSize: 12, color: COLORS.textMuted, marginTop: 10 },
});