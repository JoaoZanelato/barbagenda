import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  placeholderAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#27272A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#3F3F46",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#09090B",
  },
  name: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    color: "#A1A1AA",
    fontSize: 14,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#27272A",
    marginVertical: 30,
  },

  // Botão Sair (Neutro)
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181B",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#27272A",
    marginBottom: 16,
  },
  logoutText: {
    color: "#E4E4E7",
    fontSize: 16,
    fontWeight: "600",
  },

  // Botão Excluir (Perigo)
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)", // Fundo vermelho transparente
    padding: 16,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  deleteText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
