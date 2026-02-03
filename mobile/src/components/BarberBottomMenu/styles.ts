import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#18181B",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#27272A",
    paddingBottom: 25, // Ajuste para iPhones sem botão home
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontSize: 12,
    color: "#71717A",
    fontWeight: "600",
  },
  activeText: {
    color: colors.primary,
  },
});
