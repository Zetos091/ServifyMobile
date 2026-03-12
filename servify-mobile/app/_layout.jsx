import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";

const queryClient = new QueryClient();

// This checks if the user is logged in and redirects accordingly
function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = await SecureStore.getItemAsync("token");
      const inAuth = segments[0] === "(auth)";

      if (!token && !inAuth) {
        // Not logged in → send to login
        router.replace("/(auth)/login");
      } else if (token && inAuth) {
        // Already logged in → send to home
        router.replace("/(tabs)");
      }

      setChecking(false);
    }

    checkAuth();
  }, [segments]);

  // Show loading spinner while checking token
  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0D1B2A" }}>
        <ActivityIndicator size="large" color="#00B4D8" />
      </View>
    );
  }

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <AuthGate />
    </QueryClientProvider>
  );
}