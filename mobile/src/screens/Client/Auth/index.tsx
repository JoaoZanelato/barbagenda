import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // 👈 Importação necessária
import { User, Phone, Lock } from "lucide-react-native";
import { styles } from "./styles";
import { useClientAuth } from "./useClientAuth";
import { colors } from "../../../theme/colors";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export function ClientAuth() {
  const navigation = useNavigation(); // 👈 Hook de navegação

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
  } = useClientAuth();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // 👇 CORREÇÃO 1: Background aqui evita a barra branca ao subir o teclado
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* 👇 CORREÇÃO 2: navigation.goBack() faz o botão funcionar */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
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
