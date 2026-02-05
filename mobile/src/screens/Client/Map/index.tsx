import React from "react";
import { View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Navigation } from "lucide-react-native";

import { styles } from "./styles";
import { useClientMap } from "./useClientMap";
import { colors } from "../../../theme/colors";

interface Props {
  tenants?: any[];
  onSelectTenant: (tenant: any) => void;
}

export function ClientMap({ tenants = [], onSelectTenant }: Props) {
  const { mapRef, location, loading, visibleTenants, handleCenterMap } =
    useClientMap(tenants);

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
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType="hybrid" // Híbrido para ver ruas + satélite
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={{
          latitude: location?.coords.latitude || -23.55052,
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
            // 👇 AÇÃO: Ao clicar, chama a função que abre o Modal de Perfil na Home
            onPress={() => onSelectTenant(tenant)}
            // 👇 Otimização para imagens customizadas no Android
            tracksViewChanges={false}
          >
            {/* 👇 VISUAL: Foto da Barbearia como Marcador */}
            <View style={styles.markerContainer}>
              <Image
                source={{
                  uri: tenant.logo_url || "https://via.placeholder.com/50",
                }}
                style={styles.markerImage}
                resizeMode="cover"
              />
              {/* Triângulo embaixo da bolinha para parecer um pino */}
              <View style={styles.markerArrow} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Botão Flutuante para Centralizar GPS */}
      <TouchableOpacity style={styles.gpsButton} onPress={handleCenterMap}>
        <Navigation size={24} color="#FFF" fill={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}
