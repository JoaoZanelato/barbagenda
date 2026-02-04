import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "../../../services/API";
import { signOutClient } from "../../../services/authService"; // 👈

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
      if (response.data.avatar_url) setImage(response.data.avatar_url);
      if (response.data.created_at) {
        const date = new Date(response.data.created_at);
        setMemberSince(format(date, "MMMM 'de' yyyy", { locale: ptBR }));
      }
    } catch (error) {
      setUserName("Cliente");
    } finally {
      setLoading(false);
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão", "Acesso às fotos necessário.");
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];
        setImage(selectedImage.uri);

        const formData = new FormData();
        const uri =
          Platform.OS === "ios"
            ? selectedImage.uri.replace("file://", "")
            : selectedImage.uri;
        const filename = uri.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("file", { uri, name: filename, type } as any);

        const uploadResponse = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await api.put("/mobile/profile", {
          avatar_url: uploadResponse.data.url,
        });
        Alert.alert("Sucesso", "Foto atualizada!");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao enviar imagem.");
    }
  };

  // 👇 Logout Seguro
  const handleLogout = async () => {
    setLoading(true);
    await signOutClient();
    setLoading(false);
    onLogout();
  };

  const handleDeleteAccount = () => {
    Alert.alert("Excluir Conta", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim, excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete("/mobile/profile");
            handleLogout();
          } catch (error) {
            Alert.alert("Erro", "Falha ao excluir.");
          }
        },
      },
    ]);
  };

  return {
    image,
    userName,
    memberSince,
    loading,
    pickImage,
    handleLogout,
    handleDeleteAccount,
  };
}
