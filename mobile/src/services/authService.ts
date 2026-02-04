import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./API";

// Deslogar Barbeiro
export async function signOutBarber() {
  try {
    await api.delete("/notifications/token");
  } catch (error) {
    console.log("Erro ao remover token (ignorado)");
  } finally {
    await AsyncStorage.removeItem("@barber:token");
    await AsyncStorage.removeItem("@barber:user");
  }
}

// Deslogar Cliente
export async function signOutClient() {
  try {
    await api.delete("/mobile/notifications/token");
  } catch (error) {
    console.log("Erro ao remover token cliente (ignorado)");
  } finally {
    await AsyncStorage.removeItem("@client:token");
    await AsyncStorage.removeItem("@client:user");
  }
}
