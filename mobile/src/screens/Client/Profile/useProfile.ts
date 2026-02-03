import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
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
      const response = await api.get("/mobile/profile");
      setUserName(response.data.name);

      // Se tiver foto no banco, usa ela.
      if (response.data.avatar_url) {
        setImage(response.data.avatar_url);
      }

      const date = new Date(response.data.created_at);
      setMemberSince(format(date, "MMMM 'de' yyyy", { locale: ptBR }));
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
        "Precisamos de acesso às suas fotos para atualizar o perfil.",
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
      const selectedImage = result.assets[0];

      // Atualiza visualmente na hora
      setImage(selectedImage.uri);

      // Prepara Upload
      const formData = new FormData();
      formData.append("file", {
        uri: selectedImage.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      try {
        // 1. Envia arquivo
        const uploadResponse = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const uploadedUrl = uploadResponse.data.url;

        // 2. Salva URL no perfil do usuário no banco
        await api.put("/mobile/profile", {
          avatar_url: uploadedUrl,
        });

        Alert.alert("Sucesso", "Foto de perfil atualizada!");
      } catch (error) {
        Alert.alert("Erro", "Falha ao salvar a foto no servidor.");
        console.log(error);
      }
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
              onLogout();
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
