import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  LogOut,
  Camera,
  User,
  Trash2,
  CalendarDays,
} from "lucide-react-native";
import { styles } from "./styles";
import { useProfile } from "./useProfile";
import { colors } from "../../../theme/colors";

interface Props {
  onLogout: () => void;
}

export function Profile({ onLogout }: Props) {
  // Passamos o onLogout para o hook poder deslogar ao excluir
  const {
    image,
    userName,
    memberSince,
    loading,
    pickImage,
    handleDeleteAccount,
  } = useProfile(onLogout);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 100 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholderAvatar}>
            <User size={60} color="#52525B" />
          </View>
        )}

        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          <Camera size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Nome */}
      <Text style={styles.name}>{userName}</Text>

      {/* Data de Cadastro */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 8,
          opacity: 0.7,
        }}
      >
        <CalendarDays size={14} color="#A1A1AA" />
        <Text style={styles.subtitle}> Membro desde {memberSince}</Text>
      </View>

      <View style={styles.divider} />

      {/* Botão Sair */}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <LogOut size={20} color="#E4E4E7" />
        <Text style={styles.logoutText}>Sair do Aplicativo</Text>
      </TouchableOpacity>

      {/* Botão Excluir Conta (Zona de Perigo) */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteAccount}
      >
        <Trash2 size={20} color="#EF4444" />
        <Text style={styles.deleteText}>Excluir minha conta</Text>
      </TouchableOpacity>
    </View>
  );
}
