import { Tabs } from "expo-router";
import { Home, Search, Calendar, User } from "lucide-react-native";

export default function TabLayout() {
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