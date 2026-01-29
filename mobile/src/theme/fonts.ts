import { StyleSheet } from "react-native";

// Nomes das fontes carregadas
export const fontFamily = {
  heading: "PlayfairDisplay_700Bold",
  body: "Montserrat_400Regular",
  bodyBold: "Montserrat_700Bold",
};

// Estilos prontos para usar
export const textStyles = StyleSheet.create({
  headingXl: {
    fontFamily: fontFamily.heading,
    fontSize: 32,
    color: "#FFFFFF",
  },
  headingLg: {
    fontFamily: fontFamily.heading,
    fontSize: 24,
    color: "#FFFFFF",
  },
  bodyRegular: {
    fontFamily: fontFamily.body,
    fontSize: 16,
    color: "#A1A1AA",
  },
  bodyBold: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  buttonText: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 16,
    letterSpacing: 0.5, // Um pouco de espaçamento dá um ar premium
  },
});
