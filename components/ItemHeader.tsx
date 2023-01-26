import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { spacing } from "../styles";
import { ThemeProps } from "../types/styles";
import AppSwitch from "./Core/AppSwitch";
import AppText from "./Core/AppText";

type Props = {
  enabled?: boolean;
  onToggleEnabled?: (boolean: boolean) => void;
  title: string;
  style?: ViewStyle;
} & ThemeProps;

const ItemHeader = ({
  theme,
  colors,
  enabled,
  onToggleEnabled,
  title,
  style,
}: Props) => {
  return (
    <View style={[theme.row, theme.borderBottom, styles.container, style]}>
      <AppText style={[theme.title, { flex: 1 }]}>{title}</AppText>
      {typeof enabled === "boolean" && (
        <AppSwitch value={enabled} onValueChange={onToggleEnabled} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: spacing("md") },
});

export default ItemHeader;
