import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#18181B",
    borderTopWidth: 1,
    borderTopColor: "#27272A",
    paddingBottom: 20, // Espaço seguro para iPhones sem botão home
    paddingTop: 10,
    height: 80,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  text: {
    fontSize: 10,
    color: "#71717A",
    fontWeight: "600",
  },
  activeText: {
    color: colors.primary,
  },
});
