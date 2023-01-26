import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppText from "./Core/AppText";

type Props = {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  style?: StyleProp<ViewStyle>;
  size?: number;
};

const Avatar = ({ firstName, lastName, style, size = 40 }: Props) => {
  const { theme, colors } = useTheme();

  const abrev = `${firstName ? firstName.charAt(0) : ""}${
    lastName ? lastName.charAt(0) : ""
  }`;

  return (
    <View
      style={[
        {
          backgroundColor: colors.primary,
          height: size,
          width: size,
          borderRadius: size / 2,
        },
        styles.container,
        style,
      ]}
    >
      <AppText style={[theme.title, {fontSize: size / 2.5}]} allowFontScaling={false}>
        {abrev}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Avatar;
