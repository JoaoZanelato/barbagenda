import { useState } from "react";
import { Alert } from "react-native";
import api from "../../../services/API";

export function useClientAuth(onLoginSuccess: (token: string) => void) {
  const [step, setStep] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    if (!phone || !pin) return Alert.alert("Erro", "Preencha os campos.");
    if (step === "register" && !name)
      return Alert.alert("Erro", "Preencha o nome.");

    setLoading(true);
    try {
      const url = step === "login" ? "/mobile/login" : "/mobile/register";
      const payload = step === "login" ? { phone, pin } : { name, phone, pin };

      const response = await api.post(url, payload);

      if (response.data.token) {
        // Se a API retornar token direto no registro ou login
        onLoginSuccess(response.data.token);
      } else if (step === "register") {
        // Se o registro apenas criar a conta
        setStep("login");
        Alert.alert("Sucesso", "Conta criada! Faça login.");
      }
    } catch (error) {
      Alert.alert("Erro", "Verifique seus dados ou conexão.");
    } finally {
      setLoading(false);
    }
  }

  function toggleStep() {
    setStep((prev) => (prev === "login" ? "register" : "login"));
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
