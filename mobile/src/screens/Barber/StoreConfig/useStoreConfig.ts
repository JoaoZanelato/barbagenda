import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
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
    latitude: null as number | null,
    longitude: null as number | null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const fixImageURL = (url: string) => {
    if (!url) return "";
    if (!url.includes("http")) return `${api.defaults.baseURL}/files/${url}`;
    return url;
  };

  async function loadData() {
    try {
      const response = await api.get("/tenants");
      // 👇 Verifica se retornou array e pega o primeiro item
      if (Array.isArray(response.data) && response.data.length > 0) {
        const tenant = response.data[0];
        setData({ ...tenant, logo_url: fixImageURL(tenant.logo_url) });
      } else if (response.data && !Array.isArray(response.data)) {
        // Caso a API retorne objeto direto
        setData({
          ...response.data,
          logo_url: fixImageURL(response.data.logo_url),
        });
      }
    } catch (error) {
      console.log("Erro ao carregar loja", error);
    }
  }

  async function handleGetLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Erro", "Sem permissão de GPS.");

    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      setData((prev) => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
      Alert.alert("Sucesso", "Localização capturada!");
    } catch {
      Alert.alert("Erro", "Falha ao pegar GPS.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Erro", "Sem permissão de Fotos.");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const selectedImage = result.assets[0];
      const formData = new FormData();
      const uri =
        Platform.OS === "ios"
          ? selectedImage.uri.replace("file://", "")
          : selectedImage.uri;
      const filename = uri.split("/").pop() || "logo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("file", { uri, name: filename, type } as any);

      try {
        setLoading(true);
        const response = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setData((prev) => ({ ...prev, logo_url: response.data.url }));
        Alert.alert("Sucesso", "Logo enviada! Salve para confirmar.");
      } catch {
        Alert.alert("Erro", "Falha ao enviar imagem.");
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      // 👇 Envia apenas os dados necessários
      const payload = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        address_num: data.address_num,
        neighborhood: data.neighborhood,
        logo_url: data.logo_url,
        latitude: data.latitude,
        longitude: data.longitude,
      };

      await api.put("/tenants/profile", payload);
      Alert.alert("Sucesso", "Dados atualizados!");
    } catch (error: any) {
      console.log("Erro Save:", error.response?.data);
      Alert.alert("Erro", "Não foi possível salvar.");
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
    handleGetLocation,
  };
}
