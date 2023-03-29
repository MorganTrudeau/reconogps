import React, { useState } from "react";
import MapboxGL from "@rnmapbox/maps";
import AppIcon from "../Core/AppIcon";
import { iconSize } from "../../styles";
import { IconSet } from "../../utils/enums";
import { Pressable, View, ViewProps } from "react-native";
import { ThemeProps } from "../../types/styles";
import AnimatedMarkerAnnotation from "./AnimatedMarkerAnnotation";

export type MarkerProps = ViewProps & {
  /**
   * Any coordinate between (0, 0) and (1, 1), where (0, 0) is the top-left corner of
   * the view, and (1, 1) is the bottom-right corner. Defaults to the center at (0.5, 0.5).
   */
  anchor?: {
    x: number;
    y: number;
  };

  /**
   * @v10
   *
   * Whether or not nearby markers on the map should all be displayed. If false, adjacent
   * markers will 'collapse' and only one will be shown. Defaults to false.
   */
  allowOverlap?: boolean;

  isSelected?: boolean;
  selectedId: string | null | undefined;
  latitude: number;
  longitude: number;
  id: string;
  title: string | undefined;
  onPress?: (val: { id: string; latitude: number; longitude: number }) => void;
} & ThemeProps;

const AssetMarkerView = ({
  theme,
  colors,
  selectedId,
  latitude,
  longitude,
  title,
  id,
  onPress,
  ...rest
}: MarkerProps) => {
  const isSelected = selectedId === id;
  return (
    <MapboxGL.MarkerView
      allowOverlap={true}
      coordinate={[longitude, latitude]}
      style={{ display: "flex", zIndex: 1 }}
      isSelected={isSelected}
    >
      {!!title && (
        <AnimatedMarkerAnnotation
          active={!!isSelected}
          title={title}
          {...{ theme, colors }}
        />
      )}
      <Pressable
        disabled={!onPress}
        style={{
          opacity: !selectedId ? 1 : isSelected ? 1 : 0.5,
        }}
        onPress={
          onPress ? () => onPress({ id, latitude, longitude }) : undefined
        }
      >
        <AppIcon
          name={IconSet.location}
          size={iconSize("xl")}
          color={colors.red}
        />
      </Pressable>
    </MapboxGL.MarkerView>
  );
};

export default AssetMarkerView;
