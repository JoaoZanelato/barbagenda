import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 16,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.surfaceHighlight,
  },
  outlineText: {
    color: colors.textSecondary,
  },
});
