import React, { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { styles } from "./styles";
import { colors } from "../../theme/colors";

interface Props extends TextInputProps {
  icon?: React.ReactNode;
}

export function Input({ icon, style, ...rest }: Props) {
  // Estado para controlar o foco
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.focused, // Aplica o Glow se estiver focado
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}

      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textSecondary}
        onFocus={() => setIsFocused(true)} // Ativa o Glow
        onBlur={() => setIsFocused(false)} // Desativa o Glow
        {...rest}
      />
    </View>
  );
}
