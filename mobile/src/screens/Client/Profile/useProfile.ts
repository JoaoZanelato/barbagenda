import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "../../../services/API";

export function useProfile(onLogout: () => void) {
  const [image, setImage] = useState<string | null>(null);
  const [userName, setUserName] = useState("Carregando...");
  const [memberSince, setMemberSince] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      // 1. Imagem Local
      const savedImage = await AsyncStorage.getItem("@barber:profile_image");
      if (savedImage) setImage(savedImage);

      // 2. Dados da API (Nome e Data)
      const response = await api.get("/mobile/profile");
      setUserName(response.data.name);

      const date = new Date(response.data.created_at);
      setMemberSince(format(date, "MMMM 'de' yyyy", { locale: ptBR })); // Ex: "fevereiro de 2026"
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);
      setUserName("Cliente");
    } finally {
      setLoading(false);
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso às suas fotos.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImageUri = result.assets[0].uri;
      setImage(newImageUri);
      await AsyncStorage.setItem("@barber:profile_image", newImageUri);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza? Todos os seus dados e agendamentos serão perdidos permanentemente.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete("/mobile/profile");
              Alert.alert("Conta excluída", "Sentiremos sua falta!");
              onLogout(); // Desloga o usuário
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a conta.");
            }
          },
        },
      ],
    );
  };

  return {
    image,
    userName,
    memberSince,
    loading,
    pickImage,
    handleDeleteAccount,
  };
}
