import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { X, Calendar, User, Check, Scissors } from "lucide-react-native";
import { format } from "date-fns";
import { styles } from "./styles";
import { useScheduling } from "./useScheduling";
import { colors } from "../../theme/colors";
import { Button } from "../Button"; // Usando nosso novo componente
import { Input } from "../Input"; // Usando nosso novo componente

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tenantId?: string;
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
    totalDuration,
    totalPrice,
    handleFinish,
  } = useScheduling(isOpen, onClose, onSuccess, tenantId);

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Novo Agendamento</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* STEP 1: PROFISSIONAL */}
            {step === 1 && (
              <View>
                <Text style={styles.stepTitle}>1. Escolha o Profissional</Text>
                {loading ? (
                  <ActivityIndicator
                    color={colors.primary}
                    style={styles.loadingContainer}
                  />
                ) : (
                  pros.map((pro) => (
                    <TouchableOpacity
                      key={pro.id}
                      onPress={() => setSelectedPro(pro.id)}
                      style={[
                        styles.card,
                        selectedPro === pro.id && styles.cardSelected,
                      ]}
                    >
                      <User
                        size={20}
                        color={
                          selectedPro === pro.id
                            ? colors.text
                            : colors.textSecondary
                        }
                      />
                      <Text
                        style={[
                          styles.cardText,
                          selectedPro === pro.id && styles.textSelected,
                        ]}
                      >
                        {pro.name}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}

            {/* STEP 2: SERVIÇOS */}
            {step === 2 && (
              <View>
                <Text style={styles.stepTitle}>2. Selecione os Serviços</Text>
                {services.map((svc) => {
                  const isSelected = !!selectedServices.find(
                    (s) => s.id === svc.id,
                  );
                  return (
                    <TouchableOpacity
                      key={svc.id}
                      onPress={() => toggleService(svc)}
                      style={[
                        styles.serviceRow,
                        isSelected && styles.cardSelected,
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected,
                          ]}
                        >
                          {isSelected && (
                            <Check size={12} color={colors.black} />
                          )}
                        </View>
                        <View>
                          <Text style={styles.textWhite}>{svc.name}</Text>
                          <Text style={styles.textGray}>
                            {svc.duration_minutes} min
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.textGold}>R$ {svc.price}</Text>
                    </TouchableOpacity>
                  );
                })}
                <Text style={styles.summaryText}>
                  Total: {totalDuration} min | R$ {totalPrice}
                </Text>
              </View>
            )}

            {/* STEP 3: DATA E HORA */}
            {step === 3 && (
              <View>
                <Text style={styles.stepTitle}>3. Escolha Data e Hora</Text>
                <Input
                  placeholder="AAAA-MM-DD"
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                  icon={<Calendar size={20} color={colors.textSecondary} />}
                />

                {loading ? (
                  <ActivityIndicator
                    color={colors.primary}
                    style={styles.loadingContainer}
                  />
                ) : (
                  <View style={styles.slotsGrid}>
                    {slots.map((slot) => (
                      <TouchableOpacity
                        key={slot}
                        onPress={() => setSelectedSlot(slot)}
                        style={[
                          styles.slotBadge,
                          selectedSlot === slot && styles.slotSelected,
                        ]}
                      >
                        <Text
                          style={
                            selectedSlot === slot
                              ? styles.textBlack
                              : styles.textGray
                          }
                        >
                          {format(new Date(slot), "HH:mm")}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {slots.length === 0 && !loading && (
                      <Text style={styles.textGray}>
                        Nenhum horário disponível para esta data.
                      </Text>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* STEP 4: RESUMO */}
            {step === 4 && (
              <View>
                <Text style={styles.stepTitle}>4. Confirmar Agendamento</Text>
                <View
                  style={[
                    styles.card,
                    {
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 5,
                    },
                  ]}
                >
                  <Text style={styles.textWhite}>
                    📅 {selectedDate} às{" "}
                    {selectedSlot && format(new Date(selectedSlot), "HH:mm")}
                  </Text>
                  <Text style={styles.textGray}>
                    ✂️ {selectedServices.length} serviços selecionados
                  </Text>
                  <Text style={styles.textGold}>
                    💰 Total: R$ {totalPrice.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* FOOTER */}
          <View style={styles.footer}>
            {step > 1 ? (
              <Button
                title="Voltar"
                onPress={() => setStep(step - 1)}
                variant="outline"
                style={{ width: "45%" }}
              />
            ) : (
              <View style={{ width: "45%" }} />
            )}

            {step < 4 ? (
              <Button
                title="Próximo"
                onPress={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !selectedPro) ||
                  (step === 2 && selectedServices.length === 0) ||
                  (step === 3 && !selectedSlot)
                }
                style={{ width: "45%" }}
              />
            ) : (
              <Button
                title="Confirmar"
                onPress={handleFinish}
                loading={loading}
                style={{ width: "45%", backgroundColor: colors.success }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
