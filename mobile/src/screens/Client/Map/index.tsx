import React, { useState } from "react";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Navigation } from "lucide-react-native";

import { styles } from "./styles";
import { useClientMap } from "./useClientMap";
import { colors } from "../../../theme/colors";

import { TenantProfileModal } from "../../../components/TenantProfileModal";
import { SchedulingModal } from "../../../components/SchedulingModal";

// === LÓGICA DE STATUS ===
function getShopStatus(tenant: any) {
  const now = new Date();
  const currentHour = now.getHours();
  const day = now.getDay();

  // Domingo Fechado
  if (day === 0) return { isOpen: false, color: "red", text: "Fechado" };

  // 09:00 - 19:00 Aberto
  if (currentHour >= 9 && currentHour < 19) {
    return { isOpen: true, color: "green", text: "Aberto agora" };
  }

  return { isOpen: false, color: "red", text: "Fechado" };
}

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
        {visibleTenants.map((tenant) => {
          const status = getShopStatus(tenant);

          return (
            <Marker
              key={tenant.id}
              coordinate={{
                latitude: Number(tenant.latitude),
                longitude: Number(tenant.longitude),
              }}
              // Título nativo (aparece num balãozinho ao clicar)
              title={tenant.name}
              description={status.text}
              // A Cor nativa do pino Google
              pinColor={status.color}
              // Ao clicar no pino, abrimos o modal
              onPress={() => handleOpenTenant(tenant)}
            />
          );
        })}
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
