import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView
} from "react-native";
import { ChevronLeft, Banknote, CheckCircle2, Info } from "lucide-react-native";
import { router } from "expo-router";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

export default function PaymentMethods() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/(tabs)/profile")}>
              <ChevronLeft size={22} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Payment Method</Text>
            <View style={{ width: 38 }} />
          </View>

          {/* Section label */}
          <Text style={styles.sectionLabel}>Available Methods</Text>

          {/* Cash on Service Card — selected/active */}
          <View style={styles.cashCard}>
            <View style={styles.cashIconWrap}>
              <Banknote size={28} color={COLORS.primary} />
            </View>
            <View style={styles.cashInfo}>
              <Text style={styles.cashTitle}>Cash on Service</Text>
              <Text style={styles.cashDesc}>Pay in cash directly to your service provider upon completion of the service.</Text>
            </View>
            <View style={styles.checkWrap}>
              <CheckCircle2 size={22} color={COLORS.primary} fill={COLORS.primary} />
            </View>
          </View>

          {/* How it works */}
          <Text style={styles.sectionLabel}>How it works</Text>
          <View style={styles.stepsCard}>
            {[
              { step: "1", title: "Book your service", desc: "Choose your service and schedule a booking." },
              { step: "2", title: "Service is completed", desc: "Your provider completes the job at your location." },
              { step: "3", title: "Pay in cash", desc: "Hand payment directly to your service provider." },
            ].map((item, index, arr) => (
              <View key={item.step}>
                <View style={styles.stepRow}>
                  <View style={styles.stepBubble}>
                    <Text style={styles.stepNumber}>{item.step}</Text>
                  </View>
                  <View style={styles.stepText}>
                    <Text style={styles.stepTitle}>{item.title}</Text>
                    <Text style={styles.stepDesc}>{item.desc}</Text>
                  </View>
                </View>
                {index < arr.length - 1 && <View style={styles.stepConnector} />}
              </View>
            ))}
          </View>

          {/* Info notice */}
          <View style={styles.noticeCard}>
            <Info size={16} color="#92400E" style={{ marginTop: 1 }} />
            <Text style={styles.noticeText}>
              Online payment options such as GCash, cards, and bank transfers are not yet available. We'll notify you when they become supported.
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 28 },
  backBtn: { width: 38, height: 38, borderRadius: RADIUS.md, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", ...SHADOW.sm },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text },

  sectionLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 },

  // ── Cash card ──
  cashCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: RADIUS.xl,
    padding: 18,
    marginBottom: 28,
    borderWidth: 2,
    borderColor: COLORS.primary,
    gap: 14,
    ...SHADOW.orange,
  },
  cashIconWrap: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight || "#FFF3E8",
    justifyContent: "center",
    alignItems: "center",
  },
  cashInfo: { flex: 1 },
  cashTitle: { fontSize: 15, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  cashDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  checkWrap: { alignSelf: "flex-start", marginTop: 2 },

  // ── Steps card ──
  stepsCard: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.xl,
    padding: 20,
    marginBottom: 20,
    ...SHADOW.sm,
  },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  stepBubble: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  stepNumber: { color: "#fff", fontWeight: "800", fontSize: 14 },
  stepText: { flex: 1 },
  stepTitle: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginBottom: 3 },
  stepDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  stepConnector: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.border || "#E8E0D8",
    marginLeft: 15,
    marginVertical: 6,
  },

  // ── Notice ──
  noticeCard: {
    flexDirection: "row",
    backgroundColor: "#FFFBEB",
    borderRadius: RADIUS.xl,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  noticeText: { flex: 1, fontSize: 13, color: "#92400E", lineHeight: 20 },
});