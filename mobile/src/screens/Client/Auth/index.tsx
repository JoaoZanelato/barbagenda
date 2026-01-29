import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { User, Phone, Lock } from "lucide-react-native";
import { styles } from "./styles";
import { useClientAuth } from "./useClientAuth";
import { colors } from "../../../theme/colors";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled" // 👇 O SEGREDO: Permite clicar no input
      >
        <View style={styles.container}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.textGray}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.authBox}>
            <View style={styles.iconCircle}>
              <User size={40} color={colors.primary} />
            </View>

            <Text style={styles.title}>
              {step === "login" ? "Área do Cliente" : "Criar Nova Conta"}
            </Text>

            <View style={styles.formWidth}>
              {step === "register" && (
                <Input
                  placeholder="Seu Nome"
                  value={name}
                  onChangeText={setName}
                  icon={<User size={20} color={colors.textSecondary} />}
                />
              )}

              <Input
                placeholder="Telefone (DDD + Número)"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                icon={<Phone size={20} color={colors.textSecondary} />}
              />

              <Input
                placeholder="PIN (4 dígitos)"
                keyboardType="numeric"
                secureTextEntry
                value={pin}
                onChangeText={setPin}
                maxLength={4}
                icon={<Lock size={20} color={colors.textSecondary} />}
              />

              <Button
                title={step === "login" ? "Acessar" : "Cadastrar"}
                onPress={handleAuth}
                loading={loading}
                style={{ marginTop: 10 }}
              />

              <TouchableOpacity onPress={toggleStep}>
                <Text style={styles.link}>
                  {step === "login"
                    ? "Primeira vez? Crie sua conta"
                    : "Já tenho cadastro"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
