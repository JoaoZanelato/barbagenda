import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useStoreConfig } from "./useStoreConfig";
import { styles } from "./styles";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { signOutBarber } from "../../../services/authService"; // 👈 Importe isso

interface Props {
  onLogout: () => void;
}

export function StoreConfig({ onLogout }: Props) {
  const { data, setData, loading, handlePickImage, handleSave } =
    useStoreConfig();

  // 👇 Função de Logout do Barbeiro
  const handleBarberLogout = async () => {
    await signOutBarber();
    onLogout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuração da Loja</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Logo Upload */}
        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={handlePickImage} style={styles.logoButton}>
            {data.logo_url ? (
              <Image source={{ uri: data.logo_url }} style={styles.logo} />
            ) : (
              <View style={styles.placeholderLogo}>
                <Text style={styles.placeholderText}>+ Logo</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.hint}>Toque para alterar a logo</Text>
        </View>

        <Input
          placeholder="Nome da Barbearia"
          value={data.name}
          onChangeText={(t) => setData({ ...data, name: t })}
        />

        <Input
          placeholder="Telefone"
          value={data.phone}
          onChangeText={(t) => setData({ ...data, phone: t })}
          keyboardType="phone-pad"
        />

        <Input
          placeholder="Endereço"
          value={data.address}
          onChangeText={(t) => setData({ ...data, address: t })}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Input
              placeholder="Número"
              value={data.address_num}
              onChangeText={(t) => setData({ ...data, address_num: t })}
            />
          </View>
          <View style={{ flex: 2 }}>
            <Input
              placeholder="Bairro"
              value={data.neighborhood}
              onChangeText={(t) => setData({ ...data, neighborhood: t })}
            />
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          {loading ? (
            <ActivityIndicator color="#FF231F7C" />
          ) : (
            <Button title="Salvar Alterações" onPress={handleSave} />
          )}
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleBarberLogout}
        >
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        {/* Espaço extra no final */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
