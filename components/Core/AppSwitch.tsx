import React from "react";
import { Platform, Switch, SwitchProps } from "react-native";
import { useTheme } from "../../hooks/useTheme";

const AppSwitch = ({ style, ...rest }: SwitchProps) => {
  const { colors } = useTheme();
  return (
    <Switch
      trackColor={{ true: colors.primary, false: colors.surface }}
      style={[$iosTransform, style]}
      thumbColor={colors.white}
      {...rest}
    />
  );
};

export default AppSwitch;

const $iosTransform = Platform.select({
  ios: { transform: [{ scale: 0.8 }], right: -3 },
  default: undefined,
});
