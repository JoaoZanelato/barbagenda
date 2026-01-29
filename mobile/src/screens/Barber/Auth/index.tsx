import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles";
import { useBarberAuth } from "./useBarberAuth";
import { colors } from "../../../theme/colors";

interface Props {
  onLoginSuccess: (token: string) => void;
  onBack: () => void;
}

export function BarberAuth({ onLoginSuccess, onBack }: Props) {
  const { email, setEmail, password, setPassword, loading, handleLogin } =
    useBarberAuth(onLoginSuccess);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.textGray}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.authBox}>
        <Text style={styles.title}>Acesso Profissional</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#71717A"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          placeholderTextColor="#71717A"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <Text style={styles.btnText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
