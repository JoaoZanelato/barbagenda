import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { textStyles, fontFamily } from "../../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
    // position: 'relative' é o padrão, mas garante que o absolute funcione dentro dele
  },

  logoArea: {
    alignItems: "center",
    marginBottom: 60,
  },

  logoImage: {
    width: 320,
    height: 320,
    marginBottom: 16,
  },

  title: {
    fontFamily: fontFamily.heading,
    fontSize: 36,
    color: colors.primary,
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
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
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

  // 👇 NOVO ESTILO PARA O RODAPÉ
  footer: {
    position: "absolute", // Fixa na tela
    bottom: 40, // Distância do fundo
    alignSelf: "center", // Centraliza horizontalmente
    ...textStyles.bodyRegular,
    fontSize: 12,
    color: colors.textSecondary,
    opacity: 0.6, // Deixa sutil e elegante
    letterSpacing: 1,
  },
});
