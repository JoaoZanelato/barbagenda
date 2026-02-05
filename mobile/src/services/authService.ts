import api from "./API";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 👇 Tipos separados para não confundir
export interface BarberLoginDTO {
  email?: string;
  password?: string;
}

export interface ClientLoginDTO {
  phone: string;
  pin: string;
}

export interface ClientRegisterDTO {
  name: string;
  phone: string;
  pin: string;
}

// === BARBEIRO (Email + Senha) ===
async function loginBarber({ email, password }: BarberLoginDTO) {
  // Rota WEB padrão
  const response = await api.post("/login", { email, password });
  return response.data;
}

async function signOutBarber() {
  try {
    await api.delete("/notifications/token");
  } catch {}
  await AsyncStorage.removeItem("@barber:token");
  await AsyncStorage.removeItem("@barber:user");
}

// === CLIENTE (Telefone + PIN) ===
async function loginClient({ phone, pin }: ClientLoginDTO) {
  // Rota MOBILE específica
  const response = await api.post("/mobile/login", { phone, pin });
  return response.data;
}

async function registerClient({ name, phone, pin }: ClientRegisterDTO) {
  const response = await api.post("/mobile/register", { name, phone, pin });
  return response.data;
}

async function signOutClient() {
  try {
    await api.delete("/mobile/notifications/token");
  } catch {}
  await AsyncStorage.removeItem("@client:token");
  await AsyncStorage.removeItem("@client:user");
}

export const authService = {
  loginBarber,
  signOutBarber,
  loginClient,
  registerClient,
  signOutClient,
};
