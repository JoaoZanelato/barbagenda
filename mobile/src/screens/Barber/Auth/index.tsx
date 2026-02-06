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
import { Mail, Lock, Briefcase } from "lucide-react-native";
import { styles } from "./styles";
import { useBarberAuth } from "./useBarberAuth";
import { colors } from "../../../theme/colors";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export function BarberAuth() {
  const navigation = useNavigation(); // 👈 Hook de navegação
  const { email, setEmail, password, setPassword, loading, handleLogin } =
    useBarberAuth();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // 👇 CORREÇÃO 1: Background aqui evita a barra branca
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* 👇 CORREÇÃO 2: navigation.goBack() */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.textGray}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.authBox}>
            <View style={styles.iconCircle}>
              <Briefcase size={40} color={colors.primary} />
            </View>

            <Text style={styles.title}>Portal Profissional</Text>

            <View style={styles.formWidth}>
              <Input
                placeholder="E-mail Corporativo"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                icon={<Mail size={20} color={colors.textSecondary} />}
              />

              <Input
                placeholder="Senha de Acesso"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                icon={<Lock size={20} color={colors.textSecondary} />}
              />

              <Button
                title="Entrar no Painel"
                onPress={handleLogin}
                loading={loading}
                style={{ marginTop: 10 }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
