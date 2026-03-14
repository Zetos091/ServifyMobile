import { Stack } from "expo-router";
import { COLORS } from "../../../components/theme";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bg },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="users" />
      <Stack.Screen name="services" />
      <Stack.Screen name="reports" />
    </Stack>
  );
}