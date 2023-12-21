import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { iconSize, spacing } from "../../styles";
import AppIconButton from "../Core/AppIconButton";
import { useTheme } from "../../hooks/useTheme";
import { getHeaderHeight } from "../../navigation/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcon } from "../../types/styles";

type Vector = "polygon" | "square" | "circle";

const getVectorIconName = (vector: Vector): MaterialIcon => {
  if (vector === "polygon") {
    return "vector-polygon";
  } else if (vector === "square") {
    return "vector-square";
  } else {
    return "vector-circle";
  }
};

export const EditGeofenceLayer = () => {
  const { theme, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [activeVector, setActiveVector] = useState<Vector>();

  const getButtonProps = (vector: Vector) => {
    return {
      theme,
      colors,
      name: getVectorIconName(vector),
      size: iconSize("xs"),
      style: [
        styles.iconButton,
        vector === activeVector && { backgroundColor: colors.primary },
      ],
      color: vector === activeVector ? colors.background : colors.primary,
      onPress: () =>
        setActiveVector((v) => (v === vector ? undefined : vector)),
    };
  };

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          padding: spacing("lg"),
          alignItems: "flex-end",
          paddingTop: getHeaderHeight() + insets.top,
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.buttonGroup}>
        <AppIconButton {...getButtonProps("polygon")} />
        <AppIconButton {...getButtonProps("square")} />
        <AppIconButton {...getButtonProps("circle")} />
      </View>

      <View style={styles.buttonGroup}>
        <AppIconButton
          {...{ theme, colors }}
          name="pencil"
          size={iconSize("xs")}
          style={styles.iconButton}
        />
        <AppIconButton
          {...{ theme, colors }}
          name="trash-can-outline"
          size={iconSize("xs")}
          style={styles.iconButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: { marginBottom: spacing("xl") },
  iconButton: { marginBottom: spacing("md"), padding: spacing("md") },
});
