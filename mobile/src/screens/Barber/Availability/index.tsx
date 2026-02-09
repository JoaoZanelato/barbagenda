import React from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Clock } from "lucide-react-native";
import { styles } from "./styles";
import { useAvailability } from "./useAvailability";
import { Button } from "../../../components/Button";
import { colors } from "../../../theme/colors";

export function Availability() {
  const {
    schedule,
    loading,
    daysLabel,
    handleToggleDay,
    handleChangeTime,
    handleSave,
  } = useAvailability();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Horários de Trabalho</Text>
            <Text style={styles.subtitle}>
              Defina sua disponibilidade semanal
            </Text>
          </View>
          <Clock color={colors.primary} size={28} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {schedule.map((day) => (
            <View
              key={day.day_of_week}
              style={[styles.dayCard, !day.enabled && { opacity: 0.5 }]}
            >
              {/* Header do Dia (Switch) */}
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>
                  {daysLabel[day.day_of_week]}
                </Text>
                <Switch
                  value={day.enabled}
                  onValueChange={() => handleToggleDay(day.day_of_week)}
                  trackColor={{ false: "#3F3F46", true: colors.primary }}
                  thumbColor={"#FFF"}
                />
              </View>

              {/* Inputs de Horário (Só mostra se habilitado) */}
              {day.enabled && (
                <>
                  <View style={styles.timeRow}>
                    <View style={styles.timeInputGroup}>
                      <Text style={styles.label}>Início</Text>
                      <TextInput
                        style={styles.timeInput}
                        value={day.start_time}
                        placeholder="09:00"
                        placeholderTextColor="#52525B"
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                        onChangeText={(t) =>
                          handleChangeTime(day.day_of_week, "start_time", t)
                        }
                      />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.timeInputGroup}>
                      <Text style={styles.label}>Fim</Text>
                      <TextInput
                        style={styles.timeInput}
                        value={day.end_time}
                        placeholder="18:00"
                        placeholderTextColor="#52525B"
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                        onChangeText={(t) =>
                          handleChangeTime(day.day_of_week, "end_time", t)
                        }
                      />
                    </View>
                  </View>

                  <View style={[styles.timeRow, { marginTop: 12 }]}>
                    <View style={styles.timeInputGroup}>
                      <Text style={styles.label}>Almoço Início</Text>
                      <TextInput
                        style={styles.timeInput}
                        value={day.lunch_start}
                        placeholder="12:00"
                        placeholderTextColor="#52525B"
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                        onChangeText={(t) =>
                          handleChangeTime(day.day_of_week, "lunch_start", t)
                        }
                      />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.timeInputGroup}>
                      <Text style={styles.label}>Almoço Fim</Text>
                      <TextInput
                        style={styles.timeInput}
                        value={day.lunch_end}
                        placeholder="13:00"
                        placeholderTextColor="#52525B"
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                        onChangeText={(t) =>
                          handleChangeTime(day.day_of_week, "lunch_end", t)
                        }
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          {loading ? (
            <ActivityIndicator color={colors.primary} size="large" />
          ) : (
            <Button title="Salvar Disponibilidade" onPress={handleSave} />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
