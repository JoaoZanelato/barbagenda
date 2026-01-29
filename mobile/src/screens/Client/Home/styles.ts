import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import { fontFamily, textStyles } from "../../../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },

  // Título da Página com Fonte Serifada
  headerTitle: {
    fontFamily: fontFamily.heading,
    fontSize: 28,
    color: colors.primary, // Dourado
  },

  listContent: { paddingBottom: 40, gap: 16 },

  // Cartão de Barbearia - Estilo Premium
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 4, // Bordas retas
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    // Sombra sutil
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // Avatar com borda dourada
  avatar: {
    width: 56,
    height: 56,
    backgroundColor: colors.surface,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },

  avatarText: {
    fontFamily: fontFamily.heading,
    color: colors.primary,
    fontSize: 24,
  },

  cardTitle: {
    fontFamily: fontFamily.bodyBold,
    color: colors.text,
    fontSize: 18,
    marginBottom: 4,
  },

  cardDesc: {
    fontFamily: fontFamily.body,
    color: colors.textSecondary,
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
