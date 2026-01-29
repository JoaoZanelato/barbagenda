import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fontFamily } from "../../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },

  // 👇 ESTILO DO GLOW DOURADO
  focused: {
    borderColor: colors.primary, // Borda Dourada
    // Sombra para iOS (Glow)
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 }, // Sombra centralizada
    shadowOpacity: 0.5, // Intensidade do brilho
    shadowRadius: 10, // Tamanho do esfumaçado
    // Sombra para Android (Elevation)
    elevation: 5,
    backgroundColor: colors.surface, // Garante que o fundo não fique transparente
  },

  input: {
    flex: 1,
    height: "100%",
    color: colors.text,
    fontFamily: fontFamily.body,
    fontSize: 16,
  },

  icon: {
    marginRight: 12,
  },
});
