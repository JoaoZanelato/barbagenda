import { StyleSheet, Platform } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#18181B",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#27272A",
    // 👇 Ajuste para Safe Area do iPhone (Notch)
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    justifyContent: "space-around",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minWidth: 60,
  },
  text: {
    fontSize: 10, // Texto um pouco menor para delicadeza
    color: "#71717A",
    fontWeight: "600",
  },
  activeText: {
    color: colors.primary,
  },
});
