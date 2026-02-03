import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { format } from "date-fns";
import { Clock, Trash2, CheckCircle } from "lucide-react-native";
import { styles } from "./styles";
import { useBarberAgenda } from "./useBarberAgenda";
import { colors } from "../../../theme/colors";

export function BarberAgenda() {
  const { appointments, refreshing, loadAgenda, handleStatus } =
    useBarberAgenda();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda de Hoje</Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={loadAgenda}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum agendamento hoje.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.userInfo}>
                {item.client_avatar ? (
                  <Image
                    source={{ uri: item.client_avatar }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarLetter}>
                      {item.client_name ? item.client_name[0] : "C"}
                    </Text>
                  </View>
                )}
                <View>
                  <Text style={styles.clientName}>{item.client_name}</Text>
                  <Text style={styles.serviceText}>
                    {item.services?.name} - R$ {item.total_price}
                  </Text>
                </View>
              </View>

              <View style={styles.timeBadge}>
                <Clock size={14} color={colors.primary} />
                <Text style={styles.timeText}>
                  {format(new Date(item.start_time), "HH:mm")}
                </Text>
              </View>
            </View>

            {/* Ações (Só aparecem se ainda estiver Agendado) */}
            {item.status === "scheduled" && (
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  onPress={() => handleStatus(item.id, "cancelled")}
                  style={styles.cancelButton}
                >
                  <Trash2 size={16} color="#EF4444" />
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleStatus(item.id, "completed")}
                  style={styles.completeButton}
                >
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={styles.completeText}>Concluir</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
