import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  backBtn: { marginTop: 40, marginBottom: 20 },
  textGray: { color: colors.textSecondary, fontSize: 16 },

  authBox: { flex: 1, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 30,
    textAlign: "center",
  },

  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceHighlight,
  },

  btnPrimary: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  btnText: { color: colors.black, fontWeight: "bold", fontSize: 16 },
});
