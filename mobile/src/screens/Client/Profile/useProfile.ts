import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native"; // 👈 Importante: Platform
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

      if (response.data.avatar_url) {
        setImage(response.data.avatar_url);
      }

      if (response.data.created_at) {
        const date = new Date(response.data.created_at);
        setMemberSince(format(date, "MMMM 'de' yyyy", { locale: ptBR }));
      }
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);
      setUserName("Cliente");
    } finally {
      setLoading(false);
    }
  }

  const pickImage = async () => {
    // 1. Permissões
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso às suas fotos para atualizar o perfil.",
      );
      return;
    }

    // 2. Abre a Galeria (CORRIGIDO: MediaType.Images)
    // O erro estava aqui: MediaTypeOptions não deve ser usado
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images, // 👈 Correção Vital
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri); // Preview imediato

      // 3. Montagem do Arquivo (CORRIGIDO PARA EVITAR ERROS DE REDE)
      const formData = new FormData();

      // Ajuste de URI para iOS (remove file://)
      const uri =
        Platform.OS === "ios"
          ? selectedImage.uri.replace("file://", "")
          : selectedImage.uri;

      // Pega o nome real do arquivo ou gera um
      const filename = uri.split("/").pop() || "profile.jpg";

      // Infere o tipo (jpg/png)
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("file", {
        uri,
        name: filename,
        type,
      } as any);

      try {
        console.log("Enviando foto...");

        // Timeout aumentado para uploads
        const uploadResponse = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 20000,
        });

        const uploadedUrl = uploadResponse.data.url;

        // Atualiza no banco
        await api.put("/mobile/profile", {
          avatar_url: uploadedUrl,
        });

        Alert.alert("Sucesso", "Foto de perfil atualizada!");
      } catch (error) {
        console.error("Erro no upload:", error);
        Alert.alert("Erro", "Falha ao enviar a imagem. Verifique sua conexão.");
      }
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza? Todos os seus dados serão perdidos.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete("/mobile/profile");
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
