import { TouchableOpacity, Text } from "react-native";

export default function Button({ label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-teal-500 px-6 py-3 rounded-2xl"
    >
      <Text className="text-white font-bold text-base">
        {label}
      </Text>
    </TouchableOpacity>
  );
}