import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  backBtn: { marginBottom: 20, marginTop: 40 },
  textGray: { color: colors.textSecondary },
  authBox: { justifyContent: "center", flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
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
  btnText: { color: colors.black, fontWeight: "bold" },
  link: { color: colors.primary, textAlign: "center", marginTop: 20 },
});
