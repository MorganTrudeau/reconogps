import React from "react";
import { Pressable, PressableProps, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { iconSize, spacing } from "../styles";
import { MaterialIcon } from "../types/styles";
import AppIcon from "./Core/AppIcon";
import AppText from "./Core/AppText";

type Props = PressableProps & {
  title: string;
  icon?: MaterialIcon;
  style?: ViewStyle;
};

const FooterButton = ({ title, icon, style, ...rest }: Props) => {
  const insets = useSafeAreaInsets();
  const { theme, colors } = useTheme();

  return (
    <Pressable
      {...rest}
      style={[
        styles.button,
        {
          paddingBottom: spacing("lg") + insets.bottom,
          backgroundColor: colors.primary,
        },
        style,
      ]}
    >
      {!!icon && (
        <AppIcon name={icon} style={styles.icon} size={iconSize("md")} />
      )}
      <AppText style={[theme.title, { color: colors.background }]}>
        {title}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: spacing("lg"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { marginRight: spacing("md") },
});

export default FooterButton;
