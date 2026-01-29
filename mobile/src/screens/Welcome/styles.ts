import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { textStyles, fontFamily } from "../../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
    position: "relative", // Importante para o footer absolute funcionar bem
  },

  logoArea: {
    alignItems: "center",
    marginBottom: 60,
  },

  logoImage: {
    width: 240, // Logo maior
    height: 240,
    marginBottom: 20,
  },

  title: {
    fontFamily: fontFamily.heading, // Playfair Display
    fontSize: 36,
    color: colors.primary, // Dourado
    letterSpacing: 1,
  },

  subtitle: {
    ...textStyles.bodyRegular,
    marginTop: 8,
    textAlign: "center",
  },

  actions: { gap: 16 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 4, // Bordas mais retas (visual premium)
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight, // Fundo dourado suave
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 18,
    color: colors.text,
  },

  cardDesc: {
    ...textStyles.bodyRegular,
    fontSize: 14,
  },

  // Estilo do Copyright
  footer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    ...textStyles.bodyRegular,
    fontSize: 12,
    color: colors.textSecondary,
    opacity: 0.6,
    letterSpacing: 1,
  },
});
