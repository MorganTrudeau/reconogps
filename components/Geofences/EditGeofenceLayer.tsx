import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { iconSize, spacing } from "../../styles";
import AppIconButton from "../Core/AppIconButton";
import { useTheme } from "../../hooks/useTheme";
import { getHeaderHeight } from "../../navigation/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcon } from "../../types/styles";
import { DrawGeofenceTool } from "../../types/geofences";

const getVectorIconName = (drawTool: DrawGeofenceTool): MaterialIcon => {
  switch (drawTool) {
    case "polygon":
      return "vector-polygon";
    case "square":
      return "vector-square";
    case "circle":
      return "vector-circle";
    case "edit":
      return "pencil";
    case "erase":
      return "trash-can-outline";
    default:
      return "crosshairs-question";
  }
};

type Props = {
  activeDrawTool: DrawGeofenceTool | undefined;
  onDrawToolPress: (tool: DrawGeofenceTool) => void;
};

export const EditGeofenceLayer = ({
  activeDrawTool,
  onDrawToolPress,
}: Props) => {
  const { theme, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const getButtonProps = (vector: DrawGeofenceTool) => {
    return {
      theme,
      colors,
      name: getVectorIconName(vector),
      size: iconSize("xs"),
      style: [
        styles.iconButton,
        vector === activeDrawTool && { backgroundColor: colors.primary },
      ],
      color: vector === activeDrawTool ? colors.background : colors.primary,
      onPress: () => onDrawToolPress(vector),
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
        <AppIconButton {...getButtonProps("edit")} />
        <AppIconButton {...getButtonProps("erase")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: { marginBottom: spacing("xl") },
  iconButton: { marginBottom: spacing("md"), padding: spacing("md") },
});
