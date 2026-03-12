import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { ChevronLeft, ChevronDown, ChevronUp, MessageCircle, Mail, Phone } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

const FAQS = [
  { q: "How do I book a service?", a: "Tap 'Browse' on the bottom nav, pick a service category, choose a provider, select your preferred date and time, then confirm your booking." },
  { q: "Can I reschedule or cancel a booking?", a: "Yes! Go to 'Bookings', tap the booking you want to change, and select 'Reschedule' or 'Cancel'. Cancellations must be made at least 2 hours before the scheduled time." },
  { q: "How do I pay for a service?", a: "All payments are made in cash directly to the service provider upon completion of the service. No online payment is required." },
  { q: "What if I'm not satisfied with the service?", a: "You can rate and leave a review after every service. If there's a serious issue, contact our support team and we'll help resolve it." },
  { q: "How do I update my profile or address?", a: "Go to 'Profile' → 'Edit Profile' to update your name, email, or phone. For addresses, tap 'Saved Addresses'." },
  { q: "Is my personal information secure?", a: "Yes. We take privacy seriously. Your data is encrypted and never sold to third parties. See Privacy & Security settings for more options." },
];

const FAQItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.faqItem}>
      <TouchableOpacity style={styles.faqQ} onPress={() => setOpen((o) => !o)} activeOpacity={0.7}>
        <Text style={styles.faqQText}>{item.q}</Text>
        {open ? <ChevronUp size={18} color={COLORS.primary} /> : <ChevronDown size={18} color={COLORS.textMuted} />}
      </TouchableOpacity>
      {open && <Text style={styles.faqA}>{item.a}</Text>}
    </View>
  );
};

export default function HelpSupport() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/(tabs)/profile")}>
              <ChevronLeft size={22} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Help & Support</Text>
            <View style={{ width: 38 }} />
          </View>

          {/* Contact cards */}
          <Text style={styles.sectionLabel}>Contact Us</Text>
          <View style={styles.contactRow}>
            {[
              { icon: MessageCircle, label: "Live Chat", sub: "Chat with us", color: "#3B82F6" },
              { icon: Mail, label: "Email", sub: "support@servify.ph", color: "#8B5CF6" },
              { icon: Phone, label: "Call Us", sub: "+63 900 000 0000", color: COLORS.primary },
            ].map((c) => (
              <TouchableOpacity key={c.label} style={styles.contactCard} activeOpacity={0.75}>
                <View style={[styles.contactIcon, { backgroundColor: c.color + "18" }]}>
                  <c.icon size={22} color={c.color} />
                </View>
                <Text style={styles.contactLabel}>{c.label}</Text>
                <Text style={styles.contactSub}>{c.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQs */}
          <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>
          <View style={styles.faqCard}>
            {FAQS.map((item, index) => (
              <View key={index}>
                <FAQItem item={item} />
                {index < FAQS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 24 },
  backBtn: { width: 38, height: 38, borderRadius: RADIUS.md, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", ...SHADOW.sm },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  sectionLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 },
  contactRow: { flexDirection: "row", gap: 10, marginBottom: 28 },
  contactCard: { flex: 1, backgroundColor: "#fff", borderRadius: RADIUS.xl, padding: 14, alignItems: "center", gap: 6, ...SHADOW.sm },
  contactIcon: { width: 48, height: 48, borderRadius: RADIUS.md, justifyContent: "center", alignItems: "center" },
  contactLabel: { fontSize: 13, fontWeight: "700", color: COLORS.text },
  contactSub: { fontSize: 10, color: COLORS.textSecondary, textAlign: "center" },
  faqCard: { backgroundColor: "#fff", borderRadius: RADIUS.xl, overflow: "hidden", ...SHADOW.sm, marginBottom: 24 },
  faqItem: { paddingHorizontal: 16 },
  faqQ: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, gap: 12 },
  faqQText: { flex: 1, fontSize: 14, fontWeight: "700", color: COLORS.text, lineHeight: 20 },
  faqA: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, paddingBottom: 16 },
  divider: { height: 1, backgroundColor: COLORS.border },
});