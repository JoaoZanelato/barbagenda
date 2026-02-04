import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native"; // 👈 Importante: Platform
import * as ImagePicker from "expo-image-picker";
import api from "../../../services/API";

export function useStoreConfig() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    phone: "",
    address: "",
    address_num: "",
    neighborhood: "",
    logo_url: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  // 👇 Função para corrigir URLs antigas (localhost -> IP real)
  const fixImageURL = (url: string) => {
    if (!url) return "";
    const baseURL = api.defaults.baseURL; // Pega o IP configurado (http://192...)
    if (!baseURL) return url;

    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      return url.replace(/http:\/\/(localhost|127\.0\.0\.1):3333/g, baseURL);
    }
    return url;
  };

  async function loadData() {
    try {
      const response = await api.get("/tenants");
      if (response.data.length > 0) {
        const tenant = response.data[0];
        // Aplica a correção na logo ao carregar
        setData({
          ...tenant,
          logo_url: fixImageURL(tenant.logo_url),
        });
      }
    } catch (error) {
      console.log("Erro ao carregar dados da loja", error);
    }
  }

  async function handlePickImage() {
    // 1. Permissões
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso às fotos.");
      return;
    }

    // 2. Seleção (Sintaxe Nova)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // 👈 Correção do botão travado
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const selectedImage = result.assets[0];

      // 3. Montagem do Arquivo (Correção do Network Error)
      const formData = new FormData();

      const uri =
        Platform.OS === "ios"
          ? selectedImage.uri.replace("file://", "")
          : selectedImage.uri;

      const filename = uri.split("/").pop() || "logo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("file", {
        uri,
        name: filename,
        type,
      } as any);

      try {
        setLoading(true);
        console.log("Enviando logo...");

        const response = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 20000,
        });

        const uploadedUrl = response.data.url;

        // Atualiza estado com a URL (já corrigida para exibir na hora)
        setData((prev) => ({
          ...prev,
          logo_url: fixImageURL(uploadedUrl),
        }));

        Alert.alert("Sucesso", "Logo enviada!");
      } catch (error) {
        console.error("Erro upload:", error);
        Alert.alert("Erro", "Falha ao enviar imagem. Verifique a rede.");
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      await api.put("/tenants/profile", data);
      Alert.alert("Sucesso", "Dados da barbearia atualizados!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    setData,
    loading,
    handlePickImage,
    handleSave,
  };
}
