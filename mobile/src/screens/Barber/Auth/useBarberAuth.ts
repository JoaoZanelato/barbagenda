import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext"; // 👈 Importa o Contexto

export function useBarberAuth() {
  const { signIn } = useAuth(); // 👈 Pega a função de login global

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      return Alert.alert("Atenção", "Preencha e-mail e senha.");
    }

    setLoading(true);
    try {
      // 1. Faz login na API
      const response = await authService.loginBarber({ email, password });
      const { token, ...user } = response;

      // 2. Salva no celular
      await AsyncStorage.setItem("@barber:token", token);
      await AsyncStorage.setItem("@barber:user", JSON.stringify(user));

      // 3. Avisa o App todo que o barbeiro entrou
      await signIn("barber", token);
    } catch (error: any) {
      console.log("Erro Login Barbeiro:", error);
      const msg =
        error.response?.data?.error ||
        "Erro ao fazer login. Verifique seus dados.";
      Alert.alert("Ops", msg);
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
  };
}
