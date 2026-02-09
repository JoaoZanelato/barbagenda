import React, { useState } from "react";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Navigation } from "lucide-react-native";

import { styles } from "./styles";
import { useClientMap } from "./useClientMap";
import { colors } from "../../../theme/colors";

import { TenantProfileModal } from "../../../components/TenantProfileModal";
import { SchedulingModal } from "../../../components/SchedulingModal";

// Função auxiliar de status
function getShopStatus(tenant: any) {
  const now = new Date();
  const currentHour = now.getHours();
  const day = now.getDay();
  if (day === 0) return { isOpen: false, color: "red", text: "Fechado" };
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

  // Ao clicar no pino, abrimos APENAS o perfil
  const handleOpenTenant = (tenant: any) => {
    setIsScheduleOpen(false); // Garante que o agendamento comece fechado
    setSelectedTenant(tenant);
    setShowProfileModal(true);
  };

  // Ao clicar em "Agendar" dentro do perfil
  const handleSchedule = () => {
    setShowProfileModal(false);
    // Pequeno delay para suavizar a transição entre modais
    setTimeout(() => {
      setIsScheduleOpen(true);
    }, 300);
  };

  const handleCloseSchedule = () => {
    setIsScheduleOpen(false);
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
              title={tenant.name}
              description={status.text}
              pinColor={status.color}
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

      {/* RENDERIZAÇÃO BLINDADA */}
      {/* 1. Modal de Perfil: Renderiza se tiver tenant */}
      {selectedTenant && (
        <TenantProfileModal
          isVisible={showProfileModal}
          tenant={selectedTenant}
          onClose={() => setShowProfileModal(false)}
          onSchedule={handleSchedule}
        />
      )}

      {/* 2. Modal de Agendamento: SÓ RENDERIZA SE 'isScheduleOpen' FOR TRUE */}
      {/* Isso impede que ele busque dados (/details) ou abra sozinho */}
      {selectedTenant && isScheduleOpen && (
        <SchedulingModal
          isOpen={true} // Agora podemos passar sempre true, pois o controle é feito pelo pai
          onClose={handleCloseSchedule}
          onSuccess={() => {
            setIsScheduleOpen(false);
          }}
          tenantId={selectedTenant.id}
        />
      )}
    </View>
  );
}
