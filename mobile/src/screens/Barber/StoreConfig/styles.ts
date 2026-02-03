import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#09090B" },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { color: "#FFF", fontSize: 24, fontWeight: "bold", marginBottom: 20 },

  logoContainer: { alignItems: "center", marginBottom: 20 },
  logoButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#27272A",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  logoImage: { width: 100, height: 100 },
  logoText: { color: colors.primary, marginTop: 8, fontSize: 14 },

  label: { color: "#A1A1AA", marginBottom: 6, fontSize: 14, fontWeight: "500" },
  input: {
    backgroundColor: "#18181B",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#27272A",
  },

  row: { flexDirection: "row", gap: 10 },
  flex1: { flex: 1 },
  flex2: { flex: 2 },

  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 10,
  },
  saveText: { color: "#09090B", fontWeight: "bold", fontSize: 16 },

  logoutButton: {
    marginTop: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: { color: "#EF4444", fontWeight: "bold" },
});
