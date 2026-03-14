import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { getProfile } from "../services/auth";
import { COLORS } from "../components/theme";

const queryClient = new QueryClient();

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await SecureStore.getItemAsync("token");
        const inAuth = segments[0] === "(auth)";

        if (!token) {
          if (!inAuth) router.replace("/(auth)/login");
          setChecking(false);
          return;
        }

        const user = await getProfile();

        if (inAuth) {
          redirectByRole(router, user?.user_type);
        }
      } catch (err) {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("refreshToken");
        router.replace("/(auth)/login");
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, [segments]);

  if (checking) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return null;
}

export function redirectByRole(router, userType) {
  switch (userType) {
    case "provider":
      router.replace("/(tabs)/provider");
      break;
    case "admin":
      router.replace("/(tabs)/admin");
      break;
    case "client":
    default:
      router.replace("/(tabs)");
      break;
  }
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

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },
});

