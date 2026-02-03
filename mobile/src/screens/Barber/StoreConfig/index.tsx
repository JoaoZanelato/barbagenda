import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Camera, Save, LogOut } from "lucide-react-native";
import { styles } from "./styles";
import { useStoreConfig } from "./useStoreConfig";

interface Props {
  onLogout: () => void;
}

export function StoreConfig({ onLogout }: Props) {
  const { data, setData, loading, handlePickImage, handleSave } =
    useStoreConfig();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Minha Barbearia</Text>

      {/* Upload de Logo */}
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={handlePickImage} style={styles.logoButton}>
          {data.logo_url ? (
            <Image source={{ uri: data.logo_url }} style={styles.logoImage} />
          ) : (
            <Camera color="#71717A" />
          )}
        </TouchableOpacity>
        <Text style={styles.logoText}>Alterar Logo</Text>
      </View>

      {/* Formulário */}
      <Text style={styles.label}>Nome da Barbearia</Text>
      <TextInput
        style={styles.input}
        value={data.name}
        onChangeText={(t) => setData({ ...data, name: t })}
        placeholderTextColor="#52525B"
      />

      <Text style={styles.label}>WhatsApp</Text>
      <TextInput
        style={styles.input}
        value={data.phone}
        onChangeText={(t) => setData({ ...data, phone: t })}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Endereço (Rua)</Text>
      <TextInput
        style={styles.input}
        value={data.address}
        onChangeText={(t) => setData({ ...data, address: t })}
      />

      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.input}
            value={data.address_num}
            onChangeText={(t) => setData({ ...data, address_num: t })}
          />
        </View>
        <View style={styles.flex2}>
          <Text style={styles.label}>Bairro</Text>
          <TextInput
            style={styles.input}
            value={data.neighborhood}
            onChangeText={(t) => setData({ ...data, neighborhood: t })}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#09090B" />
        ) : (
          <>
            <Save size={20} color="#09090B" />
            <Text style={styles.saveText}>Salvar Alterações</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <LogOut size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
