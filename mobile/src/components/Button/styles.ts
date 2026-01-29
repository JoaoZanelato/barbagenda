import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { textStyles } from "../../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingVertical: 16, // Um pouco mais alto
    borderRadius: 4, // Bordas menos arredondadas são mais elegantes/sérias
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    // Sombra dourada sutil
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: colors.surfaceHighlight,
  },
  text: {
    ...textStyles.buttonText, // Usa a nova fonte Bold
    color: colors.background, // Texto preto sobre o dourado
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary, // Borda dourada fina
    shadowOpacity: 0, // Sem sombra no outline
    elevation: 0,
  },
  outlineText: {
    ...textStyles.buttonText,
    color: colors.primary, // Texto dourado
  },
});
