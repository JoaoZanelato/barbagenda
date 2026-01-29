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
    zIndex: 1, // Garante que fique acima de outros elementos se houver sobreposição
  },
  input: {
    flex: 1,
    // height: '100%', // Removi para evitar bugs de layout no Android
    color: colors.text,
    fontFamily: fontFamily.body,
    fontSize: 16,
    paddingVertical: 0, // Garante alinhamento do texto
  },
  icon: {
    marginRight: 12,
  },
});
