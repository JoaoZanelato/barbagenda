import { StyleSheet, Platform } from "react-native";
import { colors } from "../../../theme/colors";
import { fontFamily } from "../../../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 60 : 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 4, // Alinha visualmente com os cards
  },

  headerTitle: {
    fontFamily: fontFamily.heading,
    fontSize: 28,
    color: colors.primary,
    letterSpacing: 0.5,
  },

  listContent: {
    paddingBottom: 40,
    gap: 20, // Mais espaço entre os cards
  },

  // --- O NOVO CARD PREMIUM ---
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,

    // Cor de fundo distinta do background principal
    backgroundColor: colors.surface,

    padding: 20,
    borderRadius: 12, // Bordas mais arredondadas (moderno)

    // Borda visível para separar as cores escuras
    borderWidth: 1,
    borderColor: colors.borderSubtle,

    // Sombra para dar profundidade (Elevated Look)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8, // Sombra forte no Android
  },

  // Avatar mais sofisticado
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: colors.primaryLight, // Fundo dourado suave
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary, // Aro dourado
  },

  avatarText: {
    fontFamily: fontFamily.heading,
    color: colors.primary,
    fontSize: 26,
  },

  cardTitle: {
    fontFamily: fontFamily.bodyBold,
    color: colors.text, // Branco forte
    fontSize: 18,
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  cardDesc: {
    fontFamily: fontFamily.body,
    color: colors.textSecondary, // Cinza claro
    fontSize: 14,
  },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    color: colors.textSecondary,
    fontFamily: fontFamily.body,
    textAlign: "center",
    marginTop: 40,
  },
});
