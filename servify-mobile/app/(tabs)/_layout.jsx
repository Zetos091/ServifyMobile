import { Tabs } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import {
  Home, Search, Calendar, User,
  Briefcase, BarChart2, Settings,
} from "lucide-react-native";
import { COLORS } from "../../components/theme";
import { useAuth } from "../../hooks/useAuth";

const SCREEN_OPTIONS = {
  headerShown: false,
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: COLORS.textMuted,
  tabBarStyle: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    height: 62,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: "600",
  },
};

// Every screen that should NOT appear in any tab bar
const HIDDEN = [
  "edit-profile",
  "saved-addresses",
  "payment-methods",
  "notifications",
  "privacy-security",
  "help-support",
  "rate-app",
  "review",
];

function ClientTabs() {
  return (
    <Tabs screenOptions={SCREEN_OPTIONS}>
      <Tabs.Screen name="index"    options={{ title: "Home",     tabBarIcon: ({ color }) => <Home     color={color} size={22} /> }} />
      <Tabs.Screen name="browse"   options={{ title: "Browse",   tabBarIcon: ({ color }) => <Search   color={color} size={22} /> }} />
      <Tabs.Screen name="bookings" options={{ title: "Bookings", tabBarIcon: ({ color }) => <Calendar color={color} size={22} /> }} />
      <Tabs.Screen name="profile"  options={{ title: "Profile",  tabBarIcon: ({ color }) => <User     color={color} size={22} /> }} />
      {/* Hide other role sections */}
      <Tabs.Screen name="provider" options={{ href: null }} />
      <Tabs.Screen name="admin"    options={{ href: null }} />
      {/* Hide utility screens */}
      {HIDDEN.map((name) => <Tabs.Screen key={name} name={name} options={{ href: null }} />)}
    </Tabs>
  );
}

function ProviderTabs() {
  return (
    <Tabs screenOptions={SCREEN_OPTIONS}>
      <Tabs.Screen name="provider" options={{ title: "Dashboard", tabBarIcon: ({ color }) => <Home      color={color} size={22} /> }} />
      <Tabs.Screen name="browse"   options={{ title: "Services",  tabBarIcon: ({ color }) => <Briefcase color={color} size={22} /> }} />
      <Tabs.Screen name="bookings" options={{ title: "Bookings",  tabBarIcon: ({ color }) => <Calendar  color={color} size={22} /> }} />
      <Tabs.Screen name="profile"  options={{ title: "Profile",   tabBarIcon: ({ color }) => <User      color={color} size={22} /> }} />
      {/* Hide other role sections */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="admin" options={{ href: null }} />
      {/* Hide utility screens */}
      {HIDDEN.map((name) => <Tabs.Screen key={name} name={name} options={{ href: null }} />)}
    </Tabs>
  );
}

function AdminTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#F97316" }}>
      <Tabs.Screen name="index"            options={{ title: "Home",     tabBarIcon: ({ color }) => <Home     color={color} size={22} /> }} />
      <Tabs.Screen name="browse"           options={{ title: "Browse",   tabBarIcon: ({ color }) => <Search   color={color} size={22} /> }} />
      <Tabs.Screen name="bookings"         options={{ title: "Bookings", tabBarIcon: ({ color }) => <Calendar color={color} size={22} /> }} />
      <Tabs.Screen name="profile"          options={{ title: "Profile",  tabBarIcon: ({ color }) => <User     color={color} size={22} /> }} />
      {/* Hidden from tab bar */}
      <Tabs.Screen name="service-detail"   options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="edit-profile"     options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="saved-addresses"  options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="payment-methods"  options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="notifications"    options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="privacy-security" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="help-support"     options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="rate-app"         options={{ href: null, headerShown: false }} />
    </Tabs>
  );
}

export default function TabLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  switch (user?.user_type) {
    case "provider": return <ProviderTabs />;
    case "admin":    return <AdminTabs />;
    case "client":
    default:         return <ClientTabs />;
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },
});