import React from "react";
import { Switch, SwitchProps } from "react-native";
import { useTheme } from "../../hooks/useTheme";

const AppSwitch = ({ style, ...rest }: SwitchProps) => {
  const { colors } = useTheme();
  return (
    <Switch
      trackColor={{ true: colors.primary, false: colors.surface }}
      style={[{ transform: [{ scale: 0.8 }], right: -3 }, style]}
      {...rest}
    />
  );
};

export default AppSwitch;
