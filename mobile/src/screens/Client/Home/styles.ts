import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    color: "#A1A1AA",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
  title: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "PlayfairDisplay_700Bold",
  },

  // Avatar do Usuário (Canto Superior Direito)
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181B",
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  searchInput: {
    flex: 1,
    color: "#FFF",
    fontFamily: "Montserrat_400Regular",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Card
  card: {
    flexDirection: "row",
    backgroundColor: "#18181B",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#27272A",
    alignItems: "center",
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#27272A",
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: '#27272A', // Removi o fundo para ficar mais limpo com texto longo
    // paddingHorizontal: 6,
    // paddingVertical: 2,
    // borderRadius: 4,
    marginRight: 8,
  },
  ratingText: {
    color: "#71717A",
    fontSize: 12,
    marginLeft: 4,
  },
  distance: {
    color: "#71717A",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
});
