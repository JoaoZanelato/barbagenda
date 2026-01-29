import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
// 👇 Adicionei ChevronLeft e ChevronRight
import {
  X,
  User,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import { styles } from "./styles";
import { useScheduling } from "./useScheduling";
import { colors } from "../../theme/colors";
import { Button } from "../Button";
// 👇 Adicionei addDays, subDays e parseISO
import { format, addDays, subDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tenantId: string;
}

export function SchedulingModal({
  isOpen,
  onClose,
  onSuccess,
  tenantId,
}: Props) {
  const {
    step,
    setStep,
    loading,
    pros,
    services,
    slots,
    selectedPro,
    setSelectedPro,
    selectedServices,
    toggleService,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    totalPrice,
    handleFinish,
  } = useScheduling(isOpen, onClose, onSuccess, tenantId);

  // Helpers para mudar a data
  const handlePrevDay = () => {
    const prev = subDays(parseISO(selectedDate), 1);
    // Impede voltar para antes de hoje (Opcional, mas recomendado)
    if (prev < new Date().setHours(0, 0, 0, 0)) return;
    setSelectedDate(format(prev, "yyyy-MM-dd"));
    setSelectedSlot(""); // Limpa seleção anterior
  };

  const handleNextDay = () => {
    const next = addDays(parseISO(selectedDate), 1);
    setSelectedDate(format(next, "yyyy-MM-dd"));
    setSelectedSlot("");
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {step === 1
                ? "Escolha o Profissional"
                : step === 2
                  ? "Selecione os Serviços"
                  : "Data e Horário"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View
              style={[
                styles.content,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 200,
                },
              ]}
            >
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ color: colors.textSecondary, marginTop: 16 }}>
                Carregando...
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {/* PASSO 1: PROFISSIONAIS */}
              {step === 1 && (
                <FlatList
                  data={pros}
                  keyExtractor={(item) => item.id}
                  style={styles.content}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>
                      Nenhum profissional disponível.
                    </Text>
                  }
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.optionCard,
                        selectedPro === item.id && styles.optionSelected,
                      ]}
                      onPress={() => setSelectedPro(item.id)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <User
                          size={20}
                          color={
                            selectedPro === item.id
                              ? colors.primary
                              : colors.textSecondary
                          }
                        />
                        <Text
                          style={[
                            styles.optionText,
                            selectedPro === item.id && styles.textSelected,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}

              {/* PASSO 2: SERVIÇOS */}
              {step === 2 && (
                <FlatList
                  data={services}
                  keyExtractor={(item) => item.id}
                  style={styles.content}
                  renderItem={({ item }) => {
                    const isSelected = !!selectedServices.find(
                      (s) => s.id === item.id,
                    );
                    return (
                      <TouchableOpacity
                        style={[
                          styles.optionCard,
                          isSelected && styles.optionSelected,
                        ]}
                        onPress={() => toggleService(item)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.optionText,
                              isSelected && styles.textSelected,
                            ]}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              color: colors.textSecondary,
                              fontSize: 12,
                            }}
                          >
                            {item.duration_minutes} min
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.priceText,
                            isSelected && styles.priceSelected,
                          ]}
                        >
                          R$ {Number(item.price).toFixed(2)}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}

              {/* PASSO 3: DATA E HORÁRIO (Com Seletor de Data) */}
              {step === 3 && (
                <ScrollView style={styles.content}>
                  {/* 👇 SELETOR DE DATA */}
                  <View
                    style={{
                      marginBottom: 24,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: colors.surface,
                      padding: 12,
                      borderRadius: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={handlePrevDay}
                      style={{ padding: 8 }}
                    >
                      <ChevronLeft size={24} color={colors.primary} />
                    </TouchableOpacity>

                    <View style={{ alignItems: "center" }}>
                      <CalendarIcon
                        size={20}
                        color={colors.primary}
                        style={{ marginBottom: 4 }}
                      />
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: 16,
                          fontFamily: "PlayfairDisplay_700Bold",
                          fontWeight: "bold",
                        }}
                      >
                        {format(parseISO(selectedDate), "EEE, dd 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={handleNextDay}
                      style={{ padding: 8 }}
                    >
                      <ChevronRight size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={{
                      color: colors.textSecondary,
                      marginBottom: 12,
                      textAlign: "center",
                    }}
                  >
                    Horários disponíveis
                  </Text>

                  {/* Grade de Horários */}
                  <View style={styles.timeSlotsContainer}>
                    {slots.length > 0 ? (
                      slots.map((time) => (
                        <TouchableOpacity
                          key={time}
                          style={[
                            styles.timeSlot,
                            selectedSlot === time && styles.timeSlotSelected,
                          ]}
                          onPress={() => setSelectedSlot(time)}
                        >
                          <Text
                            style={[
                              styles.timeText,
                              selectedSlot === time && styles.timeTextSelected,
                            ]}
                          >
                            {time}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.emptyText}>
                        Agenda cheia ou indisponível.
                      </Text>
                    )}
                  </View>
                </ScrollView>
              )}
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            {step > 1 && (
              <TouchableOpacity
                onPress={() => setStep(step - 1)}
                style={styles.backButton}
              >
                <Text style={styles.backText}>Voltar</Text>
              </TouchableOpacity>
            )}

            <View style={{ flex: 1 }}>
              {step === 1 && (
                <Button
                  title="Continuar"
                  onPress={() => setStep(2)}
                  disabled={!selectedPro}
                />
              )}
              {step === 2 && (
                <Button
                  title={`Confirmar (R$ ${totalPrice.toFixed(2)})`}
                  onPress={() => setStep(3)}
                  disabled={selectedServices.length === 0}
                />
              )}
              {step === 3 && (
                <Button
                  title="Finalizar Agendamento"
                  onPress={handleFinish}
                  disabled={!selectedSlot}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
