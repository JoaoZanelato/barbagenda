import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import { fontFamily } from "../../../theme/fonts"; // Importando a fonte

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Preto Profundo (#09090B)
    padding: 24,
  },

  backBtn: {
    marginBottom: 40,
    marginTop: 20,
    alignSelf: "flex-start",
  },
  textGray: {
    color: colors.textSecondary,
    fontFamily: fontFamily.body,
    fontSize: 16,
  },

  authBox: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 80,
  },

  // Título de Luxo
  title: {
    fontFamily: fontFamily.heading, // Playfair Display
    fontSize: 32,
    color: colors.primary, // Dourado
    marginBottom: 40,
    textAlign: "center",
    letterSpacing: 1,
  },

  // Links (Esqueci senha / Cadastrar)
  link: {
    color: colors.primary,
    textAlign: "center",
    marginTop: 24,
    fontFamily: fontFamily.bodyBold,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
