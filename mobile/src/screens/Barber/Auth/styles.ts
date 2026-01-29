import { StyleSheet, Platform } from "react-native";
import { colors } from "../../../theme/colors";
import { fontFamily } from "../../../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: Platform.OS === "android" ? 60 : 24,
  },

  backBtn: { marginBottom: 20, alignSelf: "flex-start" },

  textGray: {
    color: colors.textSecondary,
    fontFamily: fontFamily.body,
    fontSize: 16,
  },

  authBox: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
  },

  // 👇 Ícone de destaque
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  title: {
    fontFamily: fontFamily.heading,
    fontSize: 32,
    color: colors.primary,
    marginBottom: 40,
    textAlign: "center",
    letterSpacing: 1,
  },

  formWidth: {
    width: "100%",
  },
});
