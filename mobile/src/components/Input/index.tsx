import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { styles } from "./styles";
import { colors } from "../../theme/colors";

interface Props extends TextInputProps {
  icon?: React.ReactNode;
}

export function Input({ icon, style, ...rest }: Props) {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textSecondary}
        {...rest}
      />
    </View>
  );
}
