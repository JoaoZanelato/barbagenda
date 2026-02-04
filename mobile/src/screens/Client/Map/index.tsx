import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import * as Location from "expo-location";
import { colors } from "../../../theme/colors";
import { MapPin, Navigation } from "lucide-react-native";

interface Props {
  tenants: any[];
  onSelectTenant: (tenant: any) => void;
}

export function ClientMap({ tenants, onSelectTenant }: Props) {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "O mapa precisa da sua localização.");
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoading(false);
    })();
  }, []);

  // Filtra apenas barbearias com localização cadastrada
  const visibleTenants = tenants.filter((t) => t.latitude && t.longitude);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        // Usa Google Maps no Android se configurado, ou Apple Maps no iOS
        provider={undefined}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude: location?.coords.latitude || -23.55052, // Fallback (SP)
          longitude: location?.coords.longitude || -46.633309,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {visibleTenants.map((tenant) => (
          <Marker
            key={tenant.id}
            coordinate={{
              latitude: Number(tenant.latitude),
              longitude: Number(tenant.longitude),
            }}
            onCalloutPress={() => onSelectTenant(tenant)} // Abre o modal ao clicar no balão
            onPress={() => onSelectTenant(tenant)} // Abre ao clicar no pino (opcional)
          >
            {/* Custom Marker (Opcional) */}
            <View style={styles.markerContainer}>
              <Image
                source={{
                  uri: tenant.logo_url || "https://via.placeholder.com/50",
                }}
                style={styles.markerImage}
              />
              <View style={styles.markerArrow} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Botão flutuante para centralizar */}
      <TouchableOpacity
        style={styles.gpsButton}
        onPress={() => {
          if (location && mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            });
          }
        }}
      >
        <Navigation size={24} color="#FFF" fill={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#09090B" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#09090B",
  },
  map: { width: "100%", height: "100%" },

  // Estilo do Marcador Personalizado
  markerContainer: { alignItems: "center" },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "#000",
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.primary,
    transform: [{ rotate: "180deg" }],
    marginTop: -2,
  },
  gpsButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#27272A",
    padding: 12,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
