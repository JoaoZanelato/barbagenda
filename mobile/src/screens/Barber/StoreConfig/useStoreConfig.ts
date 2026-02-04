import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location"; // 👈 Importe
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
    latitude: null as number | null, // 👈 Novos campos
    longitude: null as number | null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const fixImageURL = (url: string) => {
    if (!url) return "";
    const baseURL = api.defaults.baseURL;
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
        setData({
          ...tenant,
          logo_url: fixImageURL(tenant.logo_url),
        });
      }
    } catch (error) {
      console.log("Erro ao carregar dados da loja", error);
    }
  }

  // 👇 NOVA FUNÇÃO: Pegar GPS
  async function handleGetLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Erro",
        "Precisamos de permissão para pegar sua localização.",
      );
      return;
    }

    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      setData((prev) => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
      Alert.alert("Sucesso", "Localização GPS capturada!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter localização.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso às fotos.");
      return;
    }

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
        const uploadedUrl = response.data.url;
        setData((prev) => ({ ...prev, logo_url: fixImageURL(uploadedUrl) }));
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
      Alert.alert("Sucesso", "Dados atualizados!");
    } catch (error) {
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
    handleGetLocation, // 👈 Exporte
  };
}
