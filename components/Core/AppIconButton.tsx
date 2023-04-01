import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { iconSize } from "../../styles";
import { ThemeProps } from "../../types/styles";
import AppIcon, { IconProps } from "./AppIcon";

type Props = Omit<IconProps, "style"> &
  ThemeProps & { style?: StyleProp<ViewStyle> };

const AppIconButton = ({ theme, colors, style, onPress, ...rest }: Props) => {
  return (
    <Pressable style={[theme.iconButton, style]} onPress={onPress}>
      <AppIcon color={colors.primary} size={iconSize("lg")} {...rest} />
    </Pressable>
  );
};

export default AppIconButton;
