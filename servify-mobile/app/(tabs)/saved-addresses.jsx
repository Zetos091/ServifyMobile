import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Modal, FlatList, TextInput,
  KeyboardAvoidingView, Platform
} from "react-native";
import { MapPin, Home, Briefcase, Plus, Trash2, ChevronLeft, Check, X, ChevronDown, Star } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import AlertModal from "../../components/AlertModal";
import { COLORS, RADIUS, SHADOW } from "../../components/theme";

// ─── Philippine Address Data ──────────────────────────────────────────────
const PH_ADDRESS = {
  "NCR": {
    "Metro Manila": ["Caloocan","Las Piñas","Makati","Malabon","Mandaluyong","Manila","Marikina","Muntinlupa","Navotas","Parañaque","Pasay","Pasig","Pateros","Quezon City","San Juan","Taguig","Valenzuela"],
  },
  "Region I – Ilocos": {
    "Ilocos Norte": ["Adams","Bacarra","Badoc","Bangui","Banna","Batac","Burgos","Carasi","Currimao","Dingras","Dumalneg","Laoag","Marcos","Nueva Era","Pagudpud","Paoay","Pasuquin","Piddig","Pinili","San Nicolas","Sarrat","Solsona","Vintar"],
    "Ilocos Sur": ["Alilem","Banayoyo","Bantay","Burgos","Cabugao","Candon","Caoayan","Cervantes","Galimuyod","Gregorio del Pilar","Lidlidda","Magsingal","Nagbukel","Narvacan","Quirino","Salcedo","San Emilio","San Esteban","San Ildefonso","San Juan","San Vicente","Santa","Santa Catalina","Santa Cruz","Santa Lucia","Santa Maria","Santiago","Santo Domingo","Sigay","Sinait","Sugpon","Suyo","Tagudin","Vigan"],
    "La Union": ["Agoo","Aringay","Bacnotan","Bagulin","Balaoan","Bangar","Bauang","Burgos","Caba","Luna","Naguilian","Pugo","Rosario","San Fernando","San Gabriel","San Juan","Santo Tomas","Santol","Sudipen","Tubao"],
    "Pangasinan": ["Agno","Aguilar","Alaminos","Alcala","Anda","Asingan","Balungao","Bani","Basista","Bautista","Bayambang","Binalonan","Binmaley","Bolinao","Bugallon","Burgos","Calasiao","Dagupan","Dasol","Infanta","Labrador","Laoac","Lingayen","Mabini","Malasiqui","Manaoag","Mangaldan","Mangatarem","Mapandan","Natividad","Pozorrubio","Rosales","San Carlos","San Fabian","San Jacinto","San Manuel","San Nicolas","San Quintin","Santa Barbara","Santa Maria","Santo Tomas","Sison","Sual","Tayug","Umingan","Urbiztondo","Urdaneta","Villasis"],
  },
  "Region III – Central Luzon": {
    "Aurora": ["Baler","Casiguran","Dilasag","Dinalungan","Dingalan","Dipaculao","Maria Aurora","San Luis"],
    "Bataan": ["Abucay","Bagac","Balanga","Dinalupihan","Hermosa","Limay","Mariveles","Morong","Orani","Orion","Pilar","Samal"],
    "Bulacan": ["Angat","Balagtas","Baliuag","Bocaue","Bulakan","Bustos","Calumpit","Doña Remedios Trinidad","Guiguinto","Hagonoy","Malolos","Marilao","Meycauayan","Norzagaray","Obando","Pandi","Paombong","Plaridel","Pulilan","San Ildefonso","San Jose del Monte","San Miguel","San Rafael","Santa Maria"],
    "Nueva Ecija": ["Aliaga","Bongabon","Cabanatuan","Cabiao","Carranglan","Cuyapo","Gabaldon","Gapan","General Mamerto Natividad","General Tinio","Guimba","Jaen","Laur","Licab","Llanera","Lupao","Munoz","Nampicuan","Palayan","Pantabangan","Peñaranda","Quezon","Rizal","San Antonio","San Isidro","San Jose City","San Leonardo","Santa Rosa","Santo Domingo","Talavera","Talugtug","Zaragoza"],
    "Pampanga": ["Angeles","Apalit","Arayat","Bacolor","Candaba","Floridablanca","Guagua","Lubao","Mabalacat","Macabebe","Magalang","Masantol","Mexico","Minalin","Porac","San Fernando","San Luis","San Simon","Santa Ana","Santa Rita","Santo Tomas","Sasmuan"],
    "Tarlac": ["Anao","Bamban","Camiling","Capas","Concepcion","Gerona","La Paz","Mayantoc","Moncada","Paniqui","Pura","Ramos","San Clemente","San Jose","San Manuel","Santa Ignacia","Tarlac City","Victoria"],
    "Zambales": ["Botolan","Cabangan","Candelaria","Castillejos","Iba","Masinloc","Olongapo","Palauig","San Antonio","San Felipe","San Marcelino","San Narciso","Santa Cruz","Subic"],
  },
  "Region IV-A – CALABARZON": {
    "Batangas": ["Agoncillo","Alitagtag","Balayan","Balete","Batangas City","Bauan","Calaca","Calatagan","Cuenca","Ibaan","Laurel","Lemery","Lian","Lipa","Lobo","Mabini","Malvar","Mataas na Kahoy","Nasugbu","Padre Garcia","Rosario","San Jose","San Juan","San Luis","San Nicolas","San Pascual","Santa Teresita","Santo Tomas","Taal","Talisay","Tanauan","Taysan","Tingloy","Tuy"],
    "Cavite": ["Alfonso","Amadeo","Bacoor","Carmona","Cavite City","Dasmariñas","General Emilio Aguinaldo","General Mariano Alvarez","General Trias","Imus","Indang","Kawit","Magallanes","Maragondon","Mendez","Naic","Noveleta","Rosario","Silang","Tagaytay","Tanza","Ternate","Trece Martires"],
    "Laguna": ["Alaminos","Bay","Biñan","Cabuyao","Calamba","Calauan","Cavinti","Famy","Kalayaan","Liliw","Los Baños","Luisiana","Lumban","Mabitac","Magdalena","Majayjay","Nagcarlan","Paete","Pagsanjan","Pakil","Pangil","Pila","Rizal","San Pablo","San Pedro","Santa Cruz","Santa Maria","Santa Rosa","Siniloan","Victoria"],
    "Quezon": ["Agdangan","Alabat","Atimonan","Buenavista","Burdeos","Calauag","Candelaria","Catanauan","Dolores","General Luna","General Nakar","Guinayangan","Gumaca","Infanta","Jomalig","Lopez","Lucban","Lucena","Macalelon","Mauban","Mulanay","Padre Burgos","Pagbilao","Panukulan","Patnanungan","Perez","Pitogo","Plaridel","Polillo","Quezon","Real","Sampaloc","San Andres","San Antonio","San Francisco","San Narciso","Sariaya","Tagkawayan","Tayabas","Tiaong","Unisan"],
    "Rizal": ["Angono","Antipolo","Baras","Binangonan","Cainta","Cardona","Jalajala","Morong","Pililla","Rodriguez","San Mateo","Tanay","Taytay","Teresa"],
  },
  "Region V – Bicol": {
    "Albay": ["Bacacay","Camalig","Daraga","Guinobatan","Jovellar","Legazpi","Libon","Ligao","Malilipot","Malinao","Manito","Oas","Pio Duran","Polangui","Rapu-Rapu","Santo Domingo","Tabaco","Tiwi"],
    "Camarines Norte": ["Basud","Capalonga","Daet","Jose Panganiban","Labo","Mercedes","Paracale","San Lorenzo Ruiz","San Vicente","Santa Elena","Talisay","Vinzons"],
    "Camarines Sur": ["Baao","Balatan","Bato","Bombon","Buhi","Bula","Cabusao","Calabanga","Camaligan","Canaman","Caramoan","Del Gallego","Gainza","Garchitorena","Goa","Iriga","Lagonoy","Libmanan","Lupi","Magarao","Milaor","Minalabac","Nabua","Naga","Ocampo","Pamplona","Pasacao","Pili","Presentacion","Ragay","Sagñay","San Fernando","San Jose","Sipocot","Siruma","Tigaon","Tinambac"],
    "Sorsogon": ["Barcelona","Bulan","Bulusan","Casiguran","Castilla","Donsol","Gubat","Irosin","Juban","Magallanes","Matnog","Pilar","Prieto Diaz","Santa Magdalena","Sorsogon City"],
  },
  "Region VI – Western Visayas": {
    "Aklan": ["Altavas","Balete","Banga","Batan","Buruanga","Ibajay","Kalibo","Lezo","Libacao","Madalag","Makato","Malay","Malinao","Nabas","New Washington","Numancia","Tangalan"],
    "Iloilo": ["Ajuy","Alimodian","Anilao","Badiangan","Balasan","Banate","Barotac Nuevo","Barotac Viejo","Batad","Bingawan","Cabatuan","Calinog","Carles","Concepcion","Dingle","Dueñas","Dumangas","Estancia","Igbaras","Iloilo City","Janiuay","Lambunao","Leganes","Lemery","Leon","Maasin","Miagao","Mina","New Lucena","Oton","Pavia","Pototan","San Dionisio","San Enrique","San Joaquin","San Miguel","San Rafael","Santa Barbara","Sara","Tigbauan","Tubungan","Zarraga"],
    "Negros Occidental": ["Bacolod","Bago","Binalbagan","Cadiz","Calatrava","Candoni","Cauayan","Escalante","Himamaylan","Hinigaran","Hinoba-an","Ilog","Isabela","Kabankalan","La Carlota","La Castellana","Manapla","Murcia","Pontevedra","Pulupandan","Sagay","San Carlos","San Enrique","Silay","Sipalay","Toboso","Valladolid","Victorias"],
  },
  "Region VII – Central Visayas": {
    "Bohol": ["Alburquerque","Alicia","Anda","Antequera","Baclayon","Balilihan","Batuan","Bien Unido","Bilar","Buenavista","Calape","Candijay","Carmen","Catigbian","Clarin","Corella","Cortes","Dagohoy","Danao","Dauis","Dimiao","Duero","Garcia Hernandez","Getafe","Guindulman","Inabanga","Jagna","Lila","Loay","Loboc","Loon","Mabini","Maribojoc","Panglao","Pilar","Sagbayan","San Isidro","San Miguel","Sevilla","Sierra Bullones","Sikatuna","Tagbilaran","Talibon","Trinidad","Tubigon","Ubay","Valencia"],
    "Cebu": ["Alcantara","Alcoy","Alegria","Aloguinsan","Argao","Asturias","Badian","Balamban","Bantayan","Barili","Bogo","Boljoon","Borbon","Carcar","Carmen","Catmon","Cebu City","Compostela","Consolacion","Cordova","Daanbantayan","Dalaguete","Danao","Dumanjug","Ginatilan","Lapu-Lapu","Liloan","Madridejos","Malabuyoc","Mandaue","Medellin","Minglanilla","Moalboal","Naga","Oslob","Pilar","Pinamungajan","Poro","Ronda","Samboan","San Fernando","San Francisco","San Remigio","Santa Fe","Santander","Sibonga","Sogod","Tabogon","Tabuelan","Talisay","Toledo","Tuburan","Tudela"],
    "Negros Oriental": ["Amlan","Ayungon","Bacong","Bais","Basay","Bayawan","Bindoy","Canlaon","Dauin","Dumaguete","Guihulngan","Jimalalud","La Libertad","Mabinay","Manjuyod","Pamplona","San Jose","Santa Catalina","Siaton","Sibulan","Tanjay","Tayasan","Valencia","Vallehermoso","Zamboanguita"],
  },
  "Region XI – Davao": {
    "Davao del Norte": ["Asuncion","Braulio E. Dujali","Carmen","Kapalong","New Corella","Panabo","San Isidro","Santo Tomas","Tagum","Talaingod"],
    "Davao del Sur": ["Bansalan","Davao City","Digos","Hagonoy","Kiblawan","Magsaysay","Malalag","Matanao","Padada","Santa Cruz","Sulop"],
    "Davao Oriental": ["Baganga","Banaybanay","Boston","Caraga","Cateel","Governor Generoso","Lupon","Manay","Mati","San Isidro","Tarragona"],
  },
  "Region XII – SOCCSKSARGEN": {
    "Cotabato": ["Alamada","Aleosan","Antipas","Arakan","Banisilan","Carmen","Kabacan","Kidapawan","Libungan","M'lang","Magpet","Makilala","Matalam","Midsayap","Pigkawayan","Pikit","President Roxas","Tulunan"],
    "South Cotabato": ["Banga","General Santos","Koronadal","Lake Sebu","Norala","Polomolok","Santo Niño","Surallah","T'boli","Tampakan","Tantangan","Tupi"],
    "Sarangani": ["Alabel","Glan","Kiamba","Maasim","Maitum","Malapatan","Malungon"],
  },
  "CAR – Cordillera": {
    "Benguet": ["Atok","Bakun","Bokod","Buguias","Itogon","Kabayan","Kapangan","Kibungan","La Trinidad","Mankayan","Sablan","Tuba","Tublay"],
    "Ifugao": ["Aguinaldo","Alfonso Lista","Asipulo","Banaue","Hingyon","Hungduan","Kiangan","Lagawe","Lamut","Mayoyao","Tinoc"],
    "Mountain Province": ["Barlig","Bauko","Besao","Bontoc","Natonin","Paracelis","Sabangan","Sadanga","Sagada","Tadian"],
  },
};

const REGIONS = Object.keys(PH_ADDRESS);
const LABEL_COLORS = { Home: "#3B82F6", Work: "#8B5CF6", Other: COLORS.primary };

const INITIAL = [
  { id: "1", label: "Home", isDefault: true, street: "123 Rizal St.", barangay: "Dampol 2nd A", city: "Pulilan", province: "Bulacan", region: "Region III – Central Luzon", postal: "3015" },
  { id: "2", label: "Work", isDefault: false, street: "456 Ortigas Ave", barangay: "Bagong Ilog", city: "Pasig", province: "Metro Manila", region: "NCR", postal: "1600" },
];

const formatFullAddress = (item) =>
  `${item.street}, Brgy. ${item.barangay}, ${item.city}, ${item.province}, ${item.region}, ${item.postal}`;

// ─── Dropdown ─────────────────────────────────────────────────────────────
const Dropdown = ({ label, value, options, onSelect, placeholder, disabled, error }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={dd.wrap}>
      <Text style={dd.label}>{label}</Text>
      <TouchableOpacity style={[dd.btn, error && dd.btnError, disabled && dd.btnDisabled]} onPress={() => !disabled && setOpen(true)} activeOpacity={0.7}>
        <Text style={[dd.btnText, !value && dd.placeholder]} numberOfLines={1}>{value || placeholder}</Text>
        <ChevronDown size={16} color={disabled ? COLORS.textMuted : error ? COLORS.error : COLORS.primary} />
      </TouchableOpacity>
      {error ? <Text style={dd.errorText}>{error}</Text> : null}
      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity style={dd.overlay} onPress={() => setOpen(false)} activeOpacity={1}>
          <View style={dd.sheet}>
            <View style={dd.sheetHeader}>
              <Text style={dd.sheetTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}><X size={20} color={COLORS.textMuted} /></TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={[dd.option, item === value && dd.optionActive]} onPress={() => { onSelect(item); setOpen(false); }}>
                  <Text style={[dd.optionText, item === value && dd.optionTextActive]}>{item}</Text>
                  {item === value ? <Check size={16} color={COLORS.primary} /> : null}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={dd.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// ─── Text Input ───────────────────────────────────────────────────────────
const InputField = ({ label, value, onChange, placeholder, keyboard, maxLen, error }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.inputRow, error && styles.inputError]}>
      <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted} keyboardType={keyboard || "default"}
        maxLength={maxLen} autoCorrect={false} autoCapitalize="words" />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────
export default function SavedAddresses() {
  const [addresses, setAddresses] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const EMPTY = { label: "Home", isDefault: false, street: "", barangay: "", city: "", province: "", region: "", postal: "" };
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const provinces = form.region ? Object.keys(PH_ADDRESS[form.region] || {}) : [];
  const cities = form.region && form.province ? (PH_ADDRESS[form.region]?.[form.province] || []) : [];

  const setRegion   = (v) => { setForm((p) => ({ ...p, region: v, province: "", city: "" })); setErrors((p) => ({ ...p, region: null })); };
  const setProvince = (v) => { setForm((p) => ({ ...p, province: v, city: "" })); setErrors((p) => ({ ...p, province: null })); };
  const setCity     = (v) => { setForm((p) => ({ ...p, city: v })); setErrors((p) => ({ ...p, city: null })); };
  const handleText  = (field) => (v) => { setForm((p) => ({ ...p, [field]: v })); setErrors((p) => ({ ...p, [field]: null })); };

  const openEdit = (item) => {
    setForm({ ...item });
    setEditingId(item.id);
    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY);
    setErrors({});
  };

  const setAsDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const validate = () => {
    const e = {};
    if (!form.street.trim())   e.street   = "House no. / street is required";
    if (!form.barangay.trim()) e.barangay = "Barangay is required";
    if (!form.region)          e.region   = "Please select a region";
    if (!form.province)        e.province = "Please select a province";
    if (!form.city)            e.city     = "Please select a city";
    if (!form.postal.trim())   e.postal   = "Postal code is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingId) {
      setAddresses((prev) => prev.map((a) => a.id === editingId ? { ...form, id: editingId } : a));
    } else {
      const isFirst = addresses.length === 0;
      setAddresses((prev) => [...prev, { id: Date.now().toString(), ...form, isDefault: isFirst }]);
    }
    closeForm();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={24}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 48 }}>
          <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/(tabs)/profile")}>
                <ChevronLeft size={22} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.title}>My Addresses</Text>
              <View style={{ width: 38 }} />
            </View>

            {/* Address Cards — Shopee style */}
            {addresses.map((item, index) => {
              const color = LABEL_COLORS[item.label] || COLORS.primary;
              return (
                <TouchableOpacity key={item.id} style={styles.addressCard} onPress={() => openEdit(item)} activeOpacity={0.75}>
                  {/* Top row: label badge + delete */}
                  <View style={styles.cardTopRow}>
                    <View style={[styles.labelBadge, { borderColor: color }]}>
                      <Text style={[styles.labelBadgeText, { color }]}>{item.label}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setDeleteTarget(item.id)} style={styles.deleteBtn}>
                      <Trash2 size={16} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>

                  {/* Full address — single block like Shopee */}
                  <Text style={styles.fullAddress}>{formatFullAddress(item)}</Text>

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Bottom: Default tag + Set as default button */}
                  <View style={styles.cardBottomRow}>
                    {item.isDefault ? (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    ) : (
                      <TouchableOpacity style={styles.setDefaultBtn} onPress={(e) => { e.stopPropagation?.(); setAsDefault(item.id); }}>
                        <Text style={styles.setDefaultText}>Set as Default</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            {addresses.length === 0 && !showForm && (
              <View style={styles.emptyState}>
                <MapPin size={40} color={COLORS.textMuted} />
                <Text style={styles.emptyTitle}>No saved addresses</Text>
                <Text style={styles.emptyDesc}>Add your home, work, or other locations for faster booking</Text>
              </View>
            )}

            {/* Add Form */}
            {showForm && (
              <View style={styles.formCard}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>{editingId ? "Edit Address" : "New Address"}</Text>
                  <TouchableOpacity onPress={closeForm}>
                    <X size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>

                {/* Label */}
                <Text style={styles.fieldLabel}>Label</Text>
                <View style={styles.labelRow}>
                  {["Home", "Work", "Other"].map((l) => {
                    const color = LABEL_COLORS[l];
                    const active = form.label === l;
                    return (
                      <TouchableOpacity key={l}
                        style={[styles.labelChip, active && { backgroundColor: color, borderColor: color }]}
                        onPress={() => setForm((p) => ({ ...p, label: l }))}
                      >
                        <Text style={[styles.labelChipText, active && { color: "#fff" }]}>{l}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <InputField label="House No. / Street" value={form.street}
                  onChange={handleText("street")} placeholder="e.g. #139 St. Joseph St." error={errors.street} />

                <InputField label="Barangay" value={form.barangay}
                  onChange={handleText("barangay")} placeholder="e.g. Dampol 2nd A" error={errors.barangay} />

                <Dropdown label="Region" value={form.region} options={REGIONS}
                  onSelect={setRegion} placeholder="Select region" error={errors.region} />

                <Dropdown label="Province / District" value={form.province} options={provinces}
                  onSelect={setProvince} placeholder={form.region ? "Select province" : "Select region first"}
                  disabled={!form.region} error={errors.province} />

                <Dropdown label="City / Municipality" value={form.city} options={cities}
                  onSelect={setCity} placeholder={form.province ? "Select city" : "Select province first"}
                  disabled={!form.province} error={errors.city} />

                <InputField label="Postal Code" value={form.postal}
                  onChange={handleText("postal")} placeholder="e.g. 3015"
                  keyboard="number-pad" maxLen={4} error={errors.postal} />

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
                  <Check size={16} color="#fff" />
                  <Text style={styles.saveBtnText}>{editingId ? "Update Address" : "Save Address"}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Add Button */}
            {!showForm && (
              <TouchableOpacity style={styles.addBtn} onPress={() => { setEditingId(null); setForm(EMPTY); setShowForm(true); }} activeOpacity={0.85}>
                <Plus size={18} color={COLORS.primary} />
                <Text style={styles.addBtnText}>Add a new address</Text>
              </TouchableOpacity>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        variant="error"
        title="Delete Address?"
        message="This address will be permanently removed from your saved locations."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => { setAddresses((p) => p.filter((a) => a.id !== deleteTarget)); setDeleteTarget(null); }}
      />
    </SafeAreaView>
  );
}

// ─── Dropdown Styles ──────────────────────────────────────────────────────
const dd = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  btn: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.bg, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1.5, borderColor: COLORS.border },
  btnError: { borderColor: COLORS.error, backgroundColor: "#FFF1F2" },
  btnDisabled: { opacity: 0.45 },
  btnText: { fontSize: 15, color: COLORS.text, fontWeight: "500", flex: 1 },
  placeholder: { color: COLORS.textMuted },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 5 },
  overlay: { flex: 1, backgroundColor: "rgba(28,25,23,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, maxHeight: "70%", paddingBottom: 32 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sheetTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  option: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 20 },
  optionActive: { backgroundColor: COLORS.primaryLight },
  optionText: { fontSize: 15, color: COLORS.text },
  optionTextActive: { color: COLORS.primary, fontWeight: "700" },
  separator: { height: 1, backgroundColor: "#FAF9F8", marginHorizontal: 20 },
});

// ─── Screen Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 24 },
  backBtn: { width: 38, height: 38, borderRadius: RADIUS.md, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", ...SHADOW.sm },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text },

  // ── Shopee-style address card ──
  addressCard: { backgroundColor: "#fff", borderRadius: RADIUS.xl, padding: 16, marginBottom: 12, ...SHADOW.sm },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  labelBadge: { borderWidth: 1.5, borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  labelBadgeText: { fontSize: 12, fontWeight: "700" },
  deleteBtn: { padding: 4 },
  fullAddress: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
  cardDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  cardBottomRow: { flexDirection: "row", alignItems: "center" },
  defaultBadge: { borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 4 },
  defaultBadgeText: { fontSize: 12, fontWeight: "700", color: COLORS.primary },
  setDefaultBtn: { paddingVertical: 4 },
  setDefaultText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: "600" },

  emptyState: { alignItems: "center", paddingVertical: 48, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  emptyDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", lineHeight: 19 },

  formCard: { backgroundColor: "#fff", borderRadius: RADIUS.xxl, padding: 20, marginBottom: 16, ...SHADOW.sm },
  formHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  formTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  fieldLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  fieldWrap: { marginBottom: 14 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.bg, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1.5, borderColor: COLORS.border },
  inputError: { borderColor: COLORS.error, backgroundColor: "#FFF1F2" },
  input: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: "500" },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 5 },
  labelRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  labelChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.bg },
  labelChipText: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: 14, marginTop: 4, ...SHADOW.orange },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fff", borderRadius: RADIUS.xl, paddingVertical: 16, borderWidth: 1.5, borderColor: COLORS.primary, borderStyle: "dashed", marginTop: 4 },
  addBtnText: { color: COLORS.primary, fontSize: 15, fontWeight: "700" },
});