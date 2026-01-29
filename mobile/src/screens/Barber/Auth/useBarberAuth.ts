import { useState } from "react";
import { Alert } from "react-native";
import { authService } from "../../../services/authService";

export function useBarberAuth(onLoginSuccess: (token: string) => void) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      return Alert.alert("Atenção", "Preencha e-mail e senha.");
    }

    setLoading(true);
    try {
      // Usa o Service centralizado
      const data = await authService.loginBarber({ email, password });

      if (data.token) {
        onLoginSuccess(data.token);
      }
    } catch (error) {
      Alert.alert("Erro", "Credenciais inválidas ou erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return { email, setEmail, password, setPassword, loading, handleLogin };
}
