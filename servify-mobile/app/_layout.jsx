import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "../context/UserContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </UserProvider>
    </QueryClientProvider>
  );
}