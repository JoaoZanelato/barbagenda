import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Platform,
} from "react-native";
import { X, MapPin, Star, Navigation } from "lucide-react-native";
import { styles } from "./styles";
import { Button } from "../Button";
import api from "../../services/API";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSchedule: () => void;
  tenant: any;
}

export function TenantProfileModal({
  isVisible,
  onClose,
  onSchedule,
  tenant,
}: Props) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible && tenant?.id) {
      loadReviews();
    }
  }, [isVisible, tenant]);

  async function loadReviews() {
    try {
      setLoading(true);
      const res = await api.get(`/mobile/reviews/${tenant.id}`);
      setReviews(res.data.reviews);
      setMetrics(res.data.metrics);
    } catch (error) {
      console.log("Erro reviews", error);
    } finally {
      setLoading(false);
    }
  }

  function openMaps() {
    if (!tenant.latitude || !tenant.longitude) return;

    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${tenant.latitude},${tenant.longitude}`;
    const label = tenant.name;

    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) Linking.openURL(url);
  }

  if (!tenant) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Foto Capa */}
        <Image
          source={{ uri: tenant.cover_url || tenant.logo_url }}
          style={styles.coverImage}
        />

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X color="#FFF" size={24} />
        </TouchableOpacity>

        <ScrollView style={styles.scrollContent}>
          <Text style={styles.title}>{tenant.name}</Text>

          <View style={styles.ratingContainer}>
            <Star fill="#EAB308" color="#EAB308" size={18} />
            <Text style={styles.ratingText}>
              {Number(metrics.average).toFixed(1)}
            </Text>
            <Text style={styles.ratingCount}>({metrics.count} avaliações)</Text>
          </View>

          {/* Endereço */}
          <View style={styles.addressContainer}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <MapPin color="#FFF" size={24} />
              <View style={{ flex: 1 }}>
                <Text style={styles.addressLabel}>Endereço</Text>
                <Text style={styles.addressText}>
                  {tenant.address}, {tenant.address_num} - {tenant.neighborhood}
                </Text>

                {tenant.latitude && (
                  <TouchableOpacity onPress={openMaps} style={styles.mapButton}>
                    <Navigation color="#22C55E" size={16} />
                    <Text style={styles.mapButtonText}>Abrir no Mapa</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Lista de Avaliações */}
          <Text style={styles.sectionTitle}>O que dizem os clientes</Text>

          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : reviews.length === 0 ? (
            <Text style={styles.emptyText}>Seja o primeiro a avaliar!</Text>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.reviewName}>{review.client.name}</Text>
                  <View style={{ flexDirection: "row" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        color={i < review.rating ? "#EAB308" : "#52525B"}
                        fill={i < review.rating ? "#EAB308" : "transparent"}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Botão Agendar */}
        <View style={styles.footer}>
          <Button title="📅 Agendar Horário" onPress={onSchedule} />
        </View>
      </View>
    </Modal>
  );
}
