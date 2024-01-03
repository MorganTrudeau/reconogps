import React, { useCallback, useContext, useMemo, useRef } from "react";
import { useTheme } from "../../hooks/useTheme";
import AppIconButton from "../Core/AppIconButton";
import { StyleURL } from "@rnmapbox/maps";
import OptionsModal, { OptionModalItem } from "../Modals/OptionsModal";
import { AppModalRef } from "../Core/AppModal";
import { View, ViewStyle } from "react-native";
import { iconSize, spacing } from "../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getHeaderHeight } from "../../navigation/utils";
import { MapLayerContext } from "../../context/MapLayerContext";

const layerStyles = [
  StyleURL.Street,
  StyleURL.SatelliteStreet,
  StyleURL.Light,
  StyleURL.Dark,
  StyleURL.Satellite,
  StyleURL.TrafficDay,
  StyleURL.TrafficNight,
] as const;

const getLayerTitle = (layerStyle: StyleURL) => {
  switch (layerStyle) {
    case StyleURL.Street:
      return "Street";
    case StyleURL.Dark:
      return "Dark";
    case StyleURL.Light:
      return "Light";
    case StyleURL.Satellite:
      return "Satellite";
    case StyleURL.SatelliteStreet:
      return "Satellite Street";
    case StyleURL.TrafficDay:
      return "Traffic Day";
    case StyleURL.TrafficNight:
      return "Traffic Night";
  }
};

const getLayerImage = (layerStyle: StyleURL) => {};

export const MapLayerSelect = () => {
  const { theme, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const mapLayerContext = useContext(MapLayerContext);

  const optionsModal = useRef<AppModalRef>(null);

  const options: OptionModalItem[] = useMemo(() => {
    return layerStyles.map((layerStyle) => ({
      text: getLayerTitle(layerStyle),
      value: layerStyle,
      onPress: () => {
        optionsModal.current?.close();
        mapLayerContext.setLayerStyle(layerStyle);
      },
    }));
  }, []);

  const openOptions = useCallback(() => {
    console.log(optionsModal.current);
    optionsModal.current?.open();
  }, []);

  return (
    <>
      <AppIconButton
        name="layers"
        {...{ theme, colors }}
        onPress={openOptions}
        style={$buttonStyle}
        size={iconSize("sm")}
      />
      <OptionsModal options={options} ref={optionsModal} />
    </>
  );
};

const BUTTON_SIZE = 37;

const $buttonStyle: ViewStyle = {
  marginRight: spacing("md"),
  padding: 0,
  height: BUTTON_SIZE,
  width: BUTTON_SIZE,
};
