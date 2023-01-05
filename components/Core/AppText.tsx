import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "../../hooks/useTheme";

const AppText = ({ style, ...rest }: TextProps) => {
  const { theme } = useTheme();
  return <Text {...rest} style={[theme.text, style]} />;
};

export default AppText;
