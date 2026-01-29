import { useState } from "react";
import { Alert } from "react-native";
import { authService } from "../../../services/authService";

export function useClientAuth(onLoginSuccess: (token: string) => void) {
  const [step, setStep] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    if (!phone || !pin) return Alert.alert("Erro", "Preencha telefone e PIN.");
    if (step === "register" && !name)
      return Alert.alert("Erro", "Preencha seu nome.");

    setLoading(true);
    try {
      if (step === "login") {
        // Login
        const data = await authService.loginClient({ phone, pin });
        if (data.token) onLoginSuccess(data.token);
      } else {
        // Registro
        const data = await authService.registerClient({ name, phone, pin });

        // Se a API já retornar token no registro, loga direto
        if (data.token) {
          onLoginSuccess(data.token);
        } else {
          // Senão, manda ir pro login
          setStep("login");
          Alert.alert("Sucesso", "Conta criada! Agora faça login.");
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Verifique seus dados. O PIN deve ter 4 dígitos.");
    } finally {
      setLoading(false);
    }
  }

  function toggleStep() {
    setStep((prev) => (prev === "login" ? "register" : "login"));
    // Limpa campos sensíveis ao trocar
    setPin("");
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
