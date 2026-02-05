import React, { useState } from "react";
import { View, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Navigation } from "lucide-react-native";

import { styles } from "./styles";
import { useClientMap } from "./useClientMap";
import { colors } from "../../../theme/colors";

import { TenantProfileModal } from "../../../components/TenantProfileModal";
import { SchedulingModal } from "../../../components/SchedulingModal";

// === MARCADOR ===
function TenantMarker({
  tenant,
  onPress,
}: {
  tenant: any;
  onPress: () => void;
}) {
  // Estado para controlar o "Renascimento"
  const [loaded, setLoaded] = useState(false);

  const imageUrl =
    tenant.logo_url && tenant.logo_url.length > 10
      ? tenant.logo_url
      : `https://ui-avatars.com/api/?background=D4AF37&color=fff&bold=true&name=${encodeURIComponent(tenant.name)}`;

  return (
    <Marker
      // 👇 O PULO DO GATO:
      // Mudando a key, forçamos o React a recriar o componente do zero.
      // Isso corrige o bug visual do Android que congela o layout errado.
      key={`${tenant.id}-${loaded ? "loaded" : "loading"}`}
      coordinate={{
        latitude: Number(tenant.latitude),
        longitude: Number(tenant.longitude),
      }}
      onPress={onPress}
      // Deixamos true para garantir que ele desenhe cada frame
      tracksViewChanges={true}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.markerSafeZone}>
        <View style={styles.profileBubble}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.profileImage}
            // Quando carregar, avisa para trocar a key e renascer
            onLoadEnd={() => setLoaded(true)}
            fadeDuration={0}
          />
        </View>
      </View>
    </Marker>
  );
}

// === TELA PRINCIPAL (Sem alterações) ===
export function ClientMap() {
  const { mapRef, location, loading, visibleTenants, handleCenterMap } =
    useClientMap();
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const handleOpenTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowProfileModal(true);
  };

  const handleSchedule = () => {
    setShowProfileModal(false);
    setTimeout(() => setIsScheduleOpen(true), 500);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#09090B",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#09090B" }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ width: "100%", height: "100%" }}
        mapType="hybrid"
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={{
          latitude: location?.coords.latitude || -23.55052,
          longitude: location?.coords.longitude || -46.633309,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        toolbarEnabled={false}
      >
        {visibleTenants.map((tenant) => (
          <TenantMarker
            key={tenant.id}
            tenant={tenant}
            onPress={() => handleOpenTenant(tenant)}
          />
        ))}
      </MapView>

      <View style={{ position: "absolute", bottom: 30, right: 20 }}>
        <TouchableOpacity onPress={handleCenterMap} style={styles.gpsButton}>
          <Navigation size={24} color="#FFF" fill={colors.primary} />
        </TouchableOpacity>
      </View>

      {selectedTenant && (
        <>
          <TenantProfileModal
            isVisible={showProfileModal}
            tenant={selectedTenant}
            onClose={() => setShowProfileModal(false)}
            onSchedule={handleSchedule}
          />
          <SchedulingModal
            isOpen={isScheduleOpen}
            onClose={() => setIsScheduleOpen(false)}
            onSuccess={() => setIsScheduleOpen(false)}
            tenantId={selectedTenant.id}
          />
        </>
      )}
    </View>
  );
}
