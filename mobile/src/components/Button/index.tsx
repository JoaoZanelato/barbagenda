import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import { styles } from "./styles";
import { colors } from "../../theme/colors";

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "outline";
}

export function Button({
  title,
  loading,
  variant = "primary",
  style,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        variant === "outline" && styles.outline,
        (loading || rest.disabled) && styles.disabled,
        style,
      ]}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? colors.text : colors.black}
        />
      ) : (
        <Text
          style={[styles.text, variant === "outline" && styles.outlineText]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
