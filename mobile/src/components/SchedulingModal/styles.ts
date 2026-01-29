import { StyleSheet, Dimensions, Platform } from "react-native";
import { colors } from "../../theme/colors";
import { fontFamily } from "../../theme/fonts";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // Fundo escuro transparente
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  // A "Caixa" do Modal
  container: {
    width: "100%",
    height: height * 0.85, // Altura Fixa de 85% da tela
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    display: "flex",
    flexDirection: "column", // Garante estrutura vertical
  },

  // Cabeçalho Fixo
  header: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },

  title: {
    fontFamily: fontFamily.heading,
    fontSize: 20,
    color: colors.text,
    letterSpacing: 0.5,
  },

  // Conteúdo Rolável (Flex 1 para ocupar todo o espaço disponível)
  content: {
    flex: 1,
    padding: 20,
    width: "100%",
  },

  // --- CARDS DE SELEÇÃO ---
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: 12,
  },

  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: "rgba(212, 175, 55, 0.05)",
  },

  optionText: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 16,
    color: colors.textSecondary,
    flex: 1,
  },

  textSelected: {
    color: colors.primary,
  },

  priceText: {
    fontFamily: fontFamily.bodyBold,
    color: colors.text,
    fontSize: 14,
  },

  priceSelected: {
    color: colors.primary,
  },

  // --- GRADE DE HORÁRIOS ---
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // 'flex-start' corrige o buraco no meio da lista
    justifyContent: "flex-start",
    gap: 10,
    paddingBottom: 20,
  },

  timeSlot: {
    width: "30%", // Largura para 3 colunas (aprox)
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: "center",
    marginBottom: 8,
  },

  timeSlotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  timeText: {
    fontFamily: fontFamily.bodyBold,
    color: colors.text,
    fontSize: 14,
  },

  timeTextSelected: {
    color: colors.background,
  },

  // Rodapé Fixo (Altura Dinâmica)
  footer: {
    // Altura automática baseada no conteúdo (botão)
    paddingVertical: 20,
    paddingHorizontal: 20,

    // Espaço extra para iPhones sem botão físico
    paddingBottom: Platform.OS === "ios" ? 34 : 24,

    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    backgroundColor: colors.background,

    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  backText: {
    color: colors.textSecondary,
    fontFamily: fontFamily.body,
    textDecorationLine: "underline",
  },

  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    fontFamily: fontFamily.body,
    marginTop: 20,
  },
});
