import { useState, useEffect } from "react";
import { Alert } from "react-native";
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

  async function loadData() {
    try {
      // Busca a lista de tenants (Como é admin, geralmente traz o dele ou a lista toda)
      // Ajuste conforme sua API real. Aqui assumimos que pega o primeiro da lista pública ou privada.
      const response = await api.get("/tenants");
      if (response.data.length > 0) setData(response.data[0]);
    } catch (error) {
      console.log("Erro ao carregar dados da loja", error);
    }
  }

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const selectedImage = result.assets[0];

      // Cria o FormData para envio
      const formData = new FormData();
      formData.append("file", {
        uri: selectedImage.uri,
        name: "logo.jpg", // Nome fixo ou dinâmico
        type: "image/jpeg", // Mime type
      } as any);

      try {
        setLoading(true);
        const response = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Atualiza o estado com a URL retornada do servidor
        setData((prev) => ({ ...prev, logo_url: response.data.url }));
        Alert.alert("Sucesso", "Logo enviada!");
      } catch (error) {
        Alert.alert("Erro", "Falha ao enviar imagem.");
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
