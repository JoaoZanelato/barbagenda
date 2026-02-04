import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#18181B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#27272A",
    // Segurança para iPhones com notch (área segura inferior)
    paddingBottom: 24,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minWidth: 60, // Aumenta área de toque
  },
  text: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: "Inter_400Regular", // Garante a fonte padrão se tiver
  },
  activeText: {
    color: colors.primary,
    fontWeight: "bold",
    fontFamily: "Inter_700Bold",
  },
});
