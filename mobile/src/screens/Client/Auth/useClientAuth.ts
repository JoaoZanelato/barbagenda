import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext"; // 👈 Importa o Contexto

export function useClientAuth() {
  const { signIn } = useAuth(); // 👈 Pega a função de login global

  const [step, setStep] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleStep() {
    setStep((prev) => (prev === "login" ? "register" : "login"));
  }

  async function handleAuth() {
    // Validações básicas
    if (!phone || !pin) {
      return Alert.alert("Atenção", "Preencha telefone e PIN.");
    }
    if (step === "register" && !name) {
      return Alert.alert("Atenção", "Preencha seu nome.");
    }

    setLoading(true);
    try {
      let response;

      if (step === "login") {
        // === LOGIN ===
        response = await authService.loginClient({ phone, pin });
      } else {
        // === CADASTRO ===
        response = await authService.registerClient({ name, phone, pin });
      }

      const { token, ...user } = response;

      // 1. Salva no celular
      await AsyncStorage.setItem("@client:token", token);
      await AsyncStorage.setItem("@client:user", JSON.stringify(user));

      // 2. Avisa o App todo que o cliente entrou
      await signIn("client", token);
    } catch (error: any) {
      console.log("Erro Auth Cliente:", error);
      const msg =
        error.response?.data?.error || "Erro na autenticação. Tente novamente.";
      Alert.alert("Ops", msg);
    } finally {
      setLoading(false);
    }
  }

  return {
    step,
    name,
    setName,
    phone,
    setPhone,
    pin,
    setPin,
    loading,
    handleAuth,
    toggleStep,
  };
}
