import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Hello 👋</Text>
      <Text style={styles.subtitle}>What service do you need today?</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  greeting: { fontSize: 28, fontWeight: "bold", marginTop: 60, color: "#1a1a1a" },
  subtitle: { fontSize: 16, color: "#888", marginTop: 8 },
});