import { useEffect, useState, useRef } from "react";
import { Alert } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";

export function useClientMap(tenants: any[] = []) {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // 1. Pega Localização Inicial
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (error) {
        console.log("Erro GPS:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2. Filtra Barbeiros com GPS Válido
  // Garante que é array e que tem lat/long numéricos
  const safeTenants = Array.isArray(tenants) ? tenants : [];
  const visibleTenants = safeTenants.filter(
    (t) =>
      t.latitude &&
      t.longitude &&
      !isNaN(Number(t.latitude)) &&
      !isNaN(Number(t.longitude)),
  );

  // 3. Centralizar no Usuário
  const handleCenterMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } else {
      Alert.alert("Aguarde", "Obtendo sua localização...");
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
