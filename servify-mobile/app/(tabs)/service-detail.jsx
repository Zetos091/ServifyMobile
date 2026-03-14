import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Image, ActivityIndicator, TextInput,
  KeyboardAvoidingView, Platform, Modal,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
  ChevronLeft, Star, MapPin, Heart, MessageCircle,
  Calendar, Clock, ChevronDown, ChevronUp, CheckCircle2,
} from "lucide-react-native";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";
import { getServiceById } from "../../services/services";
import { createBooking } from "../../services/bookings";
import AlertModal from "../../components/AlertModal";

// ─── Helpers ────────────────────────────────────────────────────────────────

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const TIMES = [
  "08:00 AM","09:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","01:00 PM","02:00 PM","03:00 PM",
  "04:00 PM","05:00 PM","06:00 PM",
];

function toISODate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}

function formatDisplayDate(year, month, day) {
  return `${MONTHS[month]} ${day}, ${year}`;
}

// ─── Mini Calendar ───────────────────────────────────────────────────────────

function MiniCalendar({ selectedDate, onSelect }) {
  const today   = new Date();
  const [viewY, setViewY] = useState(today.getFullYear());
  const [viewM, setViewM] = useState(today.getMonth());

  const firstDay   = new Date(viewY, viewM, 1).getDay();
  const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const prevMonth = () => {
    if (viewM === 0) { setViewM(11); setViewY(y => y - 1); }
    else setViewM(m => m - 1);
  };
  const nextMonth = () => {
    if (viewM === 11) { setViewM(0); setViewY(y => y + 1); }
    else setViewM(m => m + 1);
  };

  const isPast = (day) => {
    if (!day) return false;
    const d = new Date(viewY, viewM, day);
    d.setHours(0,0,0,0);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  };

  return (
    <View style={cal.wrap}>
      <View style={cal.header}>
        <TouchableOpacity onPress={prevMonth} style={cal.navBtn}>
          <ChevronLeft size={18} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={cal.month}>{MONTHS[viewM]} {viewY}</Text>
        <TouchableOpacity onPress={nextMonth} style={cal.navBtn}>
          <ChevronLeft size={18} color={COLORS.text} style={{ transform:[{rotate:"180deg"}] }} />
        </TouchableOpacity>
      </View>

      <View style={cal.dayRow}>
        {DAYS.map(d => <Text key={d} style={cal.dayLabel}>{d}</Text>)}
      </View>

      <View style={cal.grid}>
        {cells.map((day, i) => {
          const iso     = day ? toISODate(viewY, viewM, day) : null;
          const isSelected = iso === selectedDate;
          const past    = isPast(day);
          return (
            <TouchableOpacity
              key={i}
              style={[cal.cell, isSelected && cal.cellSelected, (!day || past) && cal.cellDisabled]}
              onPress={() => day && !past && onSelect(iso)}
              disabled={!day || past}
              activeOpacity={0.7}
            >
              {day ? (
                <Text style={[cal.cellText, isSelected && cal.cellTextSelected, past && cal.cellTextDisabled]}>
                  {day}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Time Picker ─────────────────────────────────────────────────────────────

function TimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TouchableOpacity style={tp.btn} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Clock size={16} color={COLORS.primary} />
        <Text style={tp.btnText}>{value}</Text>
        <ChevronDown size={16} color={COLORS.textMuted} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <TouchableOpacity style={tp.overlay} activeOpacity={1} onPress={() => setOpen(false)} />
        <View style={tp.sheet}>
          <Text style={tp.sheetTitle}>Select Time</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {TIMES.map(t => (
              <TouchableOpacity
                key={t}
                style={[tp.option, t === value && tp.optionActive]}
                onPress={() => { onChange(t); setOpen(false); }}
              >
                <Text style={[tp.optionText, t === value && tp.optionTextActive]}>{t}</Text>
                {t === value && <CheckCircle2 size={18} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function ServiceDetail() {
  const { id } = useLocalSearchParams();

  const [service, setService]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [saved, setSaved]         = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Booking state
  const [selectedPkg, setSelectedPkg]       = useState(null);
  const [selectedDate, setSelectedDate]     = useState(null);
  const [selectedTime, setSelectedTime]     = useState("09:00 AM");
  const [location, setLocation]             = useState("");
  const [notes, setNotes]                   = useState("");
  const [booking, setBooking]               = useState(false);
  const [successModal, setSuccessModal]     = useState(false);
  const [errorModal, setErrorModal]         = useState(false);
  const [errorMsg, setErrorMsg]             = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getServiceById(id);
      setService(data);
      // Pre-select first package if any
      if (data.packages?.length > 0) setSelectedPkg(data.packages[0]);
    } catch {
      setError("Could not load service details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const resolvedPrice = selectedPkg
    ? selectedPkg.price
    : service?.price ?? 0;

  const handleBook = async () => {
    if (!selectedDate) {
      setErrorMsg("Please select a date.");
      setErrorModal(true);
      return;
    }
    if (!location.trim()) {
      setErrorMsg("Please enter your service location.");
      setErrorModal(true);
      return;
    }

    setBooking(true);
    try {
      await createBooking({
        service_id:    service.id,
        provider_id:   service.provider_id,
        booking_date:  selectedDate,
        booking_time:  selectedTime,
        user_location: location.trim(),
        total_price:   resolvedPrice,
        notes:         notes.trim() || null,
      });
      setSuccessModal(true);
    } catch (err) {
      console.log("Booking error status:", err.response?.status);
      console.log("Booking error data:", JSON.stringify(err.response?.data));
      setErrorMsg(err.response?.data?.message || "Booking failed. Please try again.");
      setErrorModal(true);
    } finally {
      setBooking(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Error ──
  if (error || !service) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.centered}>
          <Text style={s.errorText}>{error || "Service not found."}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={load}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const hasPackages = service.packages?.length > 0;
  const avgRating   = parseFloat(service.average_rating || 0).toFixed(1);
  const reviews     = service.reviews || [];

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          {/* ── Hero Image ── */}
          <View style={s.heroWrap}>
            {service.image_url
              ? <Image source={{ uri: service.image_url }} style={s.heroImage} resizeMode="cover" />
              : <View style={[s.heroImage, s.heroPlaceholder]} />
            }
            <View style={s.heroOverlay} />

            {/* Back + Save */}
            <View style={s.heroActions}>
              <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
                <ChevronLeft size={22} color={COLORS.text} />
              </TouchableOpacity>
              <TouchableOpacity style={s.iconBtn} onPress={() => setSaved(v => !v)}>
                <Heart size={20} color={saved ? COLORS.error : COLORS.text} fill={saved ? COLORS.error : "transparent"} />
              </TouchableOpacity>
            </View>

            {/* Category chip */}
            <View style={s.categoryChip}>
              <Text style={s.categoryChipText}>{service.category_name}</Text>
            </View>
          </View>

          <View style={s.body}>

            {/* ── Title + Rating ── */}
            <View style={s.titleRow}>
              <Text style={s.title}>{service.title}</Text>
            </View>
            <View style={s.metaRow}>
              <Star size={14} color={COLORS.accent} fill={COLORS.accent} />
              <Text style={s.rating}>{avgRating}</Text>
              <Text style={s.reviewCount}>({service.review_count} reviews)</Text>
              {service.location ? (
                <>
                  <MapPin size={13} color={COLORS.textMuted} style={{ marginLeft: 10 }} />
                  <Text style={s.location}>{service.location}</Text>
                </>
              ) : null}
            </View>

            {/* ── Provider ── */}
            <View style={s.providerCard}>
              <View style={s.providerAvatar}>
                {service.provider_image
                  ? <Image source={{ uri: service.provider_image }} style={s.providerAvatarImg} />
                  : <Text style={s.providerAvatarText}>{service.provider_name?.[0]?.toUpperCase()}</Text>
                }
              </View>
              <View style={s.providerInfo}>
                <Text style={s.providerName}>{service.provider_name}</Text>
                <View style={s.providerMeta}>
                  <Star size={12} color={COLORS.accent} fill={COLORS.accent} />
                  <Text style={s.providerRating}>{avgRating} rating</Text>
                  <Text style={s.providerJobs}> · {service.jobs_completed} jobs done</Text>
                </View>
                {service.provider_bio ? (
                  <Text style={s.providerBio} numberOfLines={2}>{service.provider_bio}</Text>
                ) : null}
              </View>
              <TouchableOpacity style={s.contactBtn}>
                <MessageCircle size={16} color={COLORS.primary} />
                <Text style={s.contactBtnText}>Contact</Text>
              </TouchableOpacity>
            </View>

            {/* ── Tabs ── */}
            <View style={s.tabs}>
              {["description","reviews"].map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[s.tab, activeTab === tab && s.tabActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Description Tab ── */}
            {activeTab === "description" && (
              <View style={s.section}>
                <Text style={s.sectionLabel}>About this service</Text>
                <Text style={s.description}>{service.description || "No description provided."}</Text>
              </View>
            )}

            {/* ── Reviews Tab ── */}
            {activeTab === "reviews" && (
              <View style={s.section}>
                {reviews.length === 0 ? (
                  <View style={s.emptyReviews}>
                    <Star size={32} color={COLORS.border} />
                    <Text style={s.emptyReviewsText}>No reviews yet</Text>
                  </View>
                ) : (
                  reviews.map((r, i) => (
                    <View key={i} style={s.reviewCard}>
                      <View style={s.reviewHeader}>
                        <View style={s.reviewAvatar}>
                          <Text style={s.reviewAvatarText}>{r.reviewer_name?.[0]?.toUpperCase()}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.reviewName}>{r.reviewer_name}</Text>
                          <View style={{ flexDirection: "row", gap: 2, marginTop: 2 }}>
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} size={11} color={COLORS.accent}
                                fill={j < r.rating ? COLORS.accent : "transparent"} />
                            ))}
                          </View>
                        </View>
                      </View>
                      {r.comment ? <Text style={s.reviewComment}>{r.comment}</Text> : null}
                    </View>
                  ))
                )}
              </View>
            )}

            {/* ── Package Selection ── */}
            {hasPackages && (
              <View style={s.section}>
                <Text style={s.sectionLabel}>Select Package</Text>
                {service.packages.map((pkg, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[s.pkgCard, selectedPkg?.name === pkg.name && s.pkgCardActive]}
                    onPress={() => setSelectedPkg(pkg)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[s.pkgName, selectedPkg?.name === pkg.name && s.pkgNameActive]}>
                        {pkg.name}
                      </Text>
                      {pkg.description ? (
                        <Text style={s.pkgDesc}>{pkg.description}</Text>
                      ) : null}
                      {pkg.duration ? (
                        <Text style={s.pkgDuration}>⏱ {pkg.duration}</Text>
                      ) : null}
                    </View>
                    <Text style={[s.pkgPrice, selectedPkg?.name === pkg.name && s.pkgPriceActive]}>
                      ₱{parseFloat(pkg.price).toLocaleString()}
                    </Text>
                    {selectedPkg?.name === pkg.name && (
                      <CheckCircle2 size={18} color={COLORS.primary} style={{ marginLeft: 8 }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* ── Booking Panel ── */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Select Date</Text>
              <MiniCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />
            </View>

            <View style={s.section}>
              <Text style={s.sectionLabel}>Preferred Time</Text>
              <TimePicker value={selectedTime} onChange={setSelectedTime} />
            </View>

            <View style={s.section}>
              <Text style={s.sectionLabel}>Service Location</Text>
              <TextInput
                style={s.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter your full address..."
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={s.section}>
              <Text style={s.sectionLabel}>Add a Note <Text style={s.optional}>(optional)</Text></Text>
              <TextInput
                style={[s.input, s.inputMulti]}
                value={notes}
                onChangeText={v => setNotes(v.slice(0, 300))}
                placeholder="Any special instructions for the provider..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <Text style={s.charCount}>{notes.length}/300</Text>
            </View>

            {/* ── Summary + Book ── */}
            <View style={s.summaryCard}>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>
                  {hasPackages ? "Package" : "Service"}
                </Text>
                <Text style={s.summaryValue}>
                  {selectedPkg ? selectedPkg.name : service.title}
                </Text>
              </View>
              {selectedDate && (
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>Date & Time</Text>
                  <Text style={s.summaryValue}>
                    {selectedDate
                      ? `${selectedDate} · ${selectedTime}`
                      : "—"}
                  </Text>
                </View>
              )}
              <View style={[s.summaryRow, { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border }]}>
                <Text style={s.totalLabel}>Total</Text>
                <Text style={s.totalPrice}>₱{parseFloat(resolvedPrice).toLocaleString()}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[s.bookBtn, booking && s.bookBtnDisabled]}
              onPress={handleBook}
              activeOpacity={0.85}
              disabled={booking}
            >
              {booking
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Calendar size={18} color="#fff" />
                    <Text style={s.bookBtnText}>Book Service</Text>
                  </>
              }
            </TouchableOpacity>
            <Text style={s.noCharge}>You won't be charged yet</Text>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={successModal}
        onClose={() => { setSuccessModal(false); router.push("/(tabs)/bookings"); }}
        variant="success"
        title="Booking Confirmed!"
        message={`Your booking for ${service.title} on ${selectedDate} at ${selectedTime} has been submitted.`}
        confirmText="View Bookings"
        onConfirm={() => { setSuccessModal(false); router.push("/(tabs)/bookings"); }}
      />

      <AlertModal
        visible={errorModal}
        onClose={() => setErrorModal(false)}
        variant="error"
        title="Oops!"
        message={errorMsg}
        confirmText="OK"
        onConfirm={() => setErrorModal(false)}
      />
    </SafeAreaView>
  );
}

// ─── Calendar styles ─────────────────────────────────────────────────────────
const cal = StyleSheet.create({
  wrap:        { backgroundColor: "#fff", borderRadius: RADIUS.xl, padding: 16, ...SHADOW.sm },
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  navBtn:      { width: 32, height: 32, borderRadius: RADIUS.md, backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" },
  month:       { fontSize: 15, fontWeight: "800", color: COLORS.text },
  dayRow:      { flexDirection: "row", marginBottom: 6 },
  dayLabel:    { flex: 1, textAlign: "center", fontSize: 12, fontWeight: "700", color: COLORS.textMuted },
  grid:        { flexDirection: "row", flexWrap: "wrap" },
  cell:        { width: "14.28%", aspectRatio: 1, justifyContent: "center", alignItems: "center" },
  cellSelected:{ backgroundColor: COLORS.primary, borderRadius: RADIUS.full },
  cellDisabled:{ opacity: 0.3 },
  cellText:    { fontSize: 13, fontWeight: "600", color: COLORS.text },
  cellTextSelected: { color: "#fff", fontWeight: "800" },
  cellTextDisabled: { color: COLORS.textMuted },
});

// ─── Time picker styles ───────────────────────────────────────────────────────
const tp = StyleSheet.create({
  btn:          { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#fff", borderRadius: RADIUS.lg, padding: 14, borderWidth: 1.5, borderColor: COLORS.border, ...SHADOW.sm },
  btnText:      { flex: 1, fontSize: 15, fontWeight: "600", color: COLORS.text },
  overlay:      { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet:        { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: "60%", paddingBottom: 40 },
  sheetTitle:   { fontSize: 17, fontWeight: "800", color: COLORS.text, marginBottom: 16 },
  option:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  optionActive: { },
  optionText:   { fontSize: 15, color: COLORS.text, fontWeight: "500" },
  optionTextActive: { color: COLORS.primary, fontWeight: "700" },
});

// ─── Main styles ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: COLORS.bg },
  centered:{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  errorText: { fontSize: 15, color: COLORS.error, textAlign: "center", marginBottom: 12 },
  retryBtn:  { paddingHorizontal: 24, paddingVertical: 10, borderRadius: RADIUS.full, backgroundColor: COLORS.primary },
  retryText: { color: "#fff", fontWeight: "700" },

  heroWrap:        { height: 280, position: "relative" },
  heroImage:       { width: "100%", height: "100%" },
  heroPlaceholder: { backgroundColor: "#FED7AA" },
  heroOverlay:     { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.15)" },
  heroActions:     { position: "absolute", top: 48, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between" },
  iconBtn:         { width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: "rgba(255,255,255,0.92)", justifyContent: "center", alignItems: "center", ...SHADOW.sm },
  categoryChip:    { position: "absolute", bottom: 16, left: 16, backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 6 },
  categoryChipText:{ color: "#fff", fontSize: 12, fontWeight: "700" },

  body:        { paddingHorizontal: 20, paddingTop: 20 },
  titleRow:    { marginBottom: 6 },
  title:       { fontSize: 24, fontWeight: "900", color: COLORS.text, lineHeight: 30 },
  metaRow:     { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  rating:      { fontSize: 13, fontWeight: "800", color: COLORS.text, marginLeft: 4 },
  reviewCount: { fontSize: 13, color: COLORS.textMuted, marginLeft: 2 },
  location:    { fontSize: 13, color: COLORS.textMuted, marginLeft: 3 },

  providerCard:    { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#fff", borderRadius: RADIUS.xl, padding: 16, marginBottom: 20, gap: 12, ...SHADOW.sm },
  providerAvatar:  { width: 52, height: 52, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#FED7AA", overflow: "hidden" },
  providerAvatarImg: { width: "100%", height: "100%" },
  providerAvatarText: { fontSize: 22, fontWeight: "800", color: COLORS.primary },
  providerInfo:    { flex: 1 },
  providerName:    { fontSize: 15, fontWeight: "800", color: COLORS.text, marginBottom: 3 },
  providerMeta:    { flexDirection: "row", alignItems: "center" },
  providerRating:  { fontSize: 12, color: COLORS.textSecondary, marginLeft: 3 },
  providerJobs:    { fontSize: 12, color: COLORS.textMuted },
  providerBio:     { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 17 },
  contactBtn:      { flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 8 },
  contactBtnText:  { fontSize: 13, fontWeight: "700", color: COLORS.primary },

  tabs:         { flexDirection: "row", backgroundColor: "#fff", borderRadius: RADIUS.xl, padding: 4, marginBottom: 20, ...SHADOW.sm },
  tab:          { flex: 1, paddingVertical: 10, borderRadius: RADIUS.lg, alignItems: "center" },
  tabActive:    { backgroundColor: COLORS.primary },
  tabText:      { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  tabTextActive:{ color: "#fff" },

  section:      { marginBottom: 20 },
  sectionLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 },
  description:  { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },

  emptyReviews:     { alignItems: "center", paddingVertical: 32, gap: 8 },
  emptyReviewsText: { fontSize: 14, color: COLORS.textMuted },
  reviewCard:       { backgroundColor: "#fff", borderRadius: RADIUS.lg, padding: 14, marginBottom: 10, ...SHADOW.sm },
  reviewHeader:     { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  reviewAvatar:     { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center" },
  reviewAvatarText: { fontSize: 14, fontWeight: "800", color: COLORS.primary },
  reviewName:       { fontSize: 14, fontWeight: "700", color: COLORS.text },
  reviewComment:    { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },

  pkgCard:       { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: RADIUS.lg, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: COLORS.border, ...SHADOW.sm },
  pkgCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  pkgName:       { fontSize: 14, fontWeight: "700", color: COLORS.text },
  pkgNameActive: { color: COLORS.primary },
  pkgDesc:       { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  pkgDuration:   { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  pkgPrice:      { fontSize: 16, fontWeight: "800", color: COLORS.text },
  pkgPriceActive:{ color: COLORS.primary },

  input:       { backgroundColor: "#fff", borderRadius: RADIUS.lg, padding: 14, fontSize: 14, color: COLORS.text, borderWidth: 1.5, borderColor: COLORS.border },
  inputMulti:  { minHeight: 80 },
  optional:    { fontWeight: "400", textTransform: "none", fontSize: 11 },
  charCount:   { fontSize: 11, color: COLORS.textMuted, textAlign: "right", marginTop: 4 },

  summaryCard: { backgroundColor: "#fff", borderRadius: RADIUS.xl, padding: 16, marginBottom: 16, ...SHADOW.sm },
  summaryRow:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  summaryLabel:{ fontSize: 13, color: COLORS.textSecondary },
  summaryValue:{ fontSize: 13, fontWeight: "600", color: COLORS.text },
  totalLabel:  { fontSize: 15, fontWeight: "800", color: COLORS.text },
  totalPrice:  { fontSize: 20, fontWeight: "900", color: COLORS.primary },

  bookBtn:         { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 16, ...SHADOW.orange },
  bookBtnDisabled: { opacity: 0.6 },
  bookBtnText:     { color: "#fff", fontSize: 16, fontWeight: "800" },
  noCharge:        { textAlign: "center", fontSize: 12, color: COLORS.textMuted, marginTop: 8 },
});