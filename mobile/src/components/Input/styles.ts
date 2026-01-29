import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fontFamily } from "../../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface, // Fundo mais escuro
    borderRadius: 4, // Bordas mais retas
    borderWidth: 1,
    borderColor: colors.borderSubtle, // Borda cinza sutil
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56, // Altura fixa mais elegante
  },
  input: {
    flex: 1,
    height: "100%",
    color: colors.text,
    fontFamily: fontFamily.body, // Nova fonte
    fontSize: 16,
  },
  icon: {
    marginRight: 12,
  },
  // Dica futura: Adicionar estado de "foco" para mudar a cor da borda para colors.primary
});
