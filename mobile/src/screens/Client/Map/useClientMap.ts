import { useEffect, useState, useRef } from "react";
import { Alert } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import api from "../../../services/API"; // 👈 Importamos a API

export function useClientMap() {
  // 👈 Não precisa mais receber props
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  // Estados locais para controlar os dados do mapa
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMapData() {
      try {
        // 1. Pede Permissão e Pega GPS
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permissão de GPS negada");
        } else {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation(loc);
        }

        // 2. Busca Barbearias na API (O Mapa agora é independente!)
        console.log("[MAPA] Buscando barbearias...");
        const response = await api.get("/mobile/tenants");
        setTenants(response.data);
        console.log(`[MAPA] Encontradas: ${response.data.length}`);
      } catch (error) {
        console.log("Erro ao carregar mapa:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMapData();
  }, []);

  // 3. Filtra e Corrige Coordenadas
  const visibleTenants = tenants
    .map((t) => {
      // Converte vírgula para ponto e garante que é número
      const lat = parseFloat(String(t.latitude || "").replace(",", "."));
      const lng = parseFloat(String(t.longitude || "").replace(",", "."));
      return { ...t, latitude: lat, longitude: lng };
    })
    .filter((t) => {
      // Só exibe se for número válido e diferente de zero
      return (
        !isNaN(t.latitude) &&
        !isNaN(t.longitude) &&
        t.latitude !== 0 &&
        t.longitude !== 0
      );
    });

  // 4. Centralizar Mapa
  const handleCenterMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } else {
      Alert.alert("GPS", "Buscando sua localização...");
    }
  };

  return {
    mapRef,
    location,
    loading,
    visibleTenants,
    handleCenterMap,
  };
}
