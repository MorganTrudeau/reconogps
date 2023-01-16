import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { iconSize, spacing } from "../styles";
import AppIcon from "./Core/AppIcon";
import AppText from "./Core/AppText";
import { MaterialIcon, ThemeProps } from "../types/styles";

type Props = {
  icon: MaterialIcon;
  message: string;
  style?: StyleProp<ViewStyle>;
} & ThemeProps;

const EmptyList = ({ icon, message, colors, theme, style }: Props) => {
  return (
    <View style={[theme.row, styles.container, style]}>
      <AppIcon
        name={icon}
        size={ICON_SIZE}
        color={colors.primary}
        style={styles.icon}
      />
      <AppText style={theme.title}>{message}</AppText>
      <View style={styles.spacer} />
    </View>
  );
};

const ICON_SIZE = iconSize("lg");

const styles = StyleSheet.create({
  container: { justifyContent: "center", padding: spacing("lg") },
  icon: { marginRight: spacing("lg") },
  spacer: { height: ICON_SIZE, width: ICON_SIZE },
});

export default EmptyList;
