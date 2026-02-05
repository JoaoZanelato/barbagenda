import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Camera, MapPin, Store } from "lucide-react-native";
import { useStoreConfig } from "./useStoreConfig";
import { styles } from "./styles";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { signOutBarber } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";
import { colors } from "../../../theme/colors";

export function StoreConfig() {
  const { signOut } = useAuth();
  const {
    data,
    setData,
    loading,
    handlePickImage,
    handleSave,
    handleGetLocation,
  } = useStoreConfig();

  const handleBarberLogout = () => {
    Alert.alert("Sair da Conta", "Tem certeza que deseja desconectar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          // 👇 MUDANÇA: "Fire and Forget"
          // Dispara a limpeza do token mas NÃO espera (await) ela terminar.
          // Se der erro, ninguém liga, o importante é o usuário sair.
          signOutBarber().catch(() => {});

          // Sai do app imediatamente
          await signOut();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Minha Loja</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Área da Logo */}
          <View style={styles.logoSection}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.logoButton}
            >
              {data.logo_url ? (
                <Image
                  source={{ uri: data.logo_url }}
                  style={styles.logoImage}
                />
              ) : (
                <View style={styles.placeholderLogo}>
                  <Store size={40} color={colors.primary} strokeWidth={1.5} />
                  <Text style={styles.logoText}>Logo da Loja</Text>
                </View>
              )}

              <View style={styles.editBadge}>
                <Camera size={14} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Formulário */}
          <View style={styles.formGroup}>
            <Text style={styles.sectionLabel}>DADOS GERAIS</Text>
            <Input
              placeholder="Nome da Barbearia"
              value={data.name}
              onChangeText={(t) => setData({ ...data, name: t })}
            />
            <Input
              placeholder="Telefone / WhatsApp"
              value={data.phone}
              onChangeText={(t) => setData({ ...data, phone: t })}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.sectionLabel}>ENDEREÇO</Text>
            <Input
              placeholder="Rua / Avenida"
              value={data.address}
              onChangeText={(t) => setData({ ...data, address: t })}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Número"
                  value={data.address_num}
                  onChangeText={(t) => setData({ ...data, address_num: t })}
                />
              </View>
              <View style={{ width: 10 }} />
              <View style={{ flex: 2 }}>
                <Input
                  placeholder="Bairro"
                  value={data.neighborhood}
                  onChangeText={(t) => setData({ ...data, neighborhood: t })}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.gpsButton,
                data.latitude ? styles.gpsButtonActive : {},
              ]}
              onPress={handleGetLocation}
            >
              <MapPin
                size={20}
                color={data.latitude ? "#10B981" : colors.primary}
              />
              <Text
                style={[
                  styles.gpsText,
                  data.latitude ? { color: "#10B981" } : {},
                ]}
              >
                {data.latitude
                  ? "Localização Atualizada ✓"
                  : "Atualizar Localização GPS"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            {loading ? (
              <ActivityIndicator color={colors.primary} size="large" />
            ) : (
              <Button title="Salvar Alterações" onPress={handleSave} />
            )}

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleBarberLogout}
            >
              <Text style={styles.logoutText}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
