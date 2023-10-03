import React from "react";
import { Pressable, StyleSheet, Switch } from "react-native";
import { Colors, MaterialIcon, Theme } from "../types/styles";
import AppIcon from "./Core/AppIcon";
import AppText from "./Core/AppText";
import { iconSize, spacing } from "../styles";

export const SwitchItem = ({
  theme,
  colors,
  value,
  onChange,
  title,
  icon,
}: {
  theme: Theme;
  colors: Colors;
  value: boolean;
  onChange: (enabled: boolean) => void;
  title: string;
  icon: MaterialIcon;
}) => {
  return (
    <Pressable
      style={[theme.row, styles.container]}
      onPress={() => onChange(!value)}
    >
      <AppIcon
        name={icon}
        color={colors.primary}
        style={styles.icon}
        size={iconSize("sm")}
      />
      <AppText style={theme.flex}>{title}</AppText>
      <Switch
        trackColor={{ true: colors.primary, false: colors.surface }}
        value={value}
        onValueChange={(active) => onChange(active)}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: spacing("xl") },
  icon: { marginRight: spacing("md") },
});
