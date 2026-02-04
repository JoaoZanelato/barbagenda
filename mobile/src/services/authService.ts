import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./API";

// Função para deslogar Barbeiro
export async function signOutBarber() {
  try {
    // 1. Avisa o backend para remover o token deste usuário
    await api.delete("/notifications/token");
  } catch (error) {
    console.log("Erro ao remover token no backend (ignorado)");
  } finally {
    // 2. Limpa dados locais
    await AsyncStorage.removeItem("@barber:token");
    await AsyncStorage.removeItem("@barber:user");
  }
}

// Função para deslogar Cliente
export async function signOutClient() {
  try {
    // 1. Avisa o backend
    await api.delete("/mobile/notifications/token");
  } catch (error) {
    console.log("Erro ao remover token cliente (ignorado)");
  } finally {
    // 2. Limpa dados locais
    await AsyncStorage.removeItem("@client:token");
    await AsyncStorage.removeItem("@client:user");
  }
}
