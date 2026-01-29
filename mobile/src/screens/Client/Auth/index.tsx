import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles";
import { useClientAuth } from "./useClientAuth";
import { colors } from "../../../theme/colors";

interface Props {
  onLoginSuccess: (token: string) => void;
  onBack: () => void;
}

export function ClientAuth({ onLoginSuccess, onBack }: Props) {
  const {
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
  } = useClientAuth(onLoginSuccess);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.textGray}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.authBox}>
        <Text style={styles.title}>
          {step === "login" ? "Login Cliente" : "Criar Conta"}
        </Text>

        {step === "register" && (
          <TextInput
            style={styles.input}
            placeholder="Seu Nome"
            placeholderTextColor="#71717A"
            value={name}
            onChangeText={setName}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Telefone (somente números)"
          keyboardType="phone-pad"
          placeholderTextColor="#71717A"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="PIN (4 dígitos)"
          keyboardType="numeric"
          secureTextEntry
          placeholderTextColor="#71717A"
          value={pin}
          onChangeText={setPin}
          maxLength={4}
        />

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.btnText}>
              {step === "login" ? "Entrar" : "Cadastrar"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleStep}>
          <Text style={styles.link}>
            {step === "login" ? "Não tem conta? Cadastre-se" : "Já tenho conta"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
