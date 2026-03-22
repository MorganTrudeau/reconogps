import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleURL } from "@rnmapbox/maps";
import React, { createContext, useEffect } from "react";
import { ViewProps } from "react-native";

let savedLayerStyle = StyleURL.SatelliteStreet;

const SAVED_LAYER_STYLE_ASYNC_KEY = "SAVED_LAYER_STYLE_ASYNC_KEY";

const getSavedLayerStyle = async () => {
  try {
    const _savedLayerStyle = (await AsyncStorage.getItem(
      SAVED_LAYER_STYLE_ASYNC_KEY
    )) as StyleURL | null;
    if (_savedLayerStyle) {
      savedLayerStyle = _savedLayerStyle;
    }
  } catch (error) {
    // Failed to get saved layer style
  }
};
getSavedLayerStyle();

const saveLayerStyle = async (layerStyle: StyleURL) => {
  try {
    await AsyncStorage.setItem(SAVED_LAYER_STYLE_ASYNC_KEY, layerStyle);
  } catch (error) {
    // Failed to save layer style
  }
};

export const MapLayerContext = createContext({
  layerStyle: StyleURL.Street,
  setLayerStyle: (styleURL: StyleURL) => {},
});

export const MapLayerProvider = ({
  children,
}: {
  children: ViewProps["children"];
}) => {
  const [layerStyle, setLayerStyle] = React.useState(savedLayerStyle);

  useEffect(() => {
    if (layerStyle !== savedLayerStyle) {
      savedLayerStyle = layerStyle;
      saveLayerStyle(layerStyle);
    }
  }, [layerStyle]);

  const value = React.useMemo(
    () => ({ layerStyle, setLayerStyle }),
    [layerStyle, setLayerStyle]
  );

  return (
    <MapLayerContext.Provider value={value}>
      {children}
    </MapLayerContext.Provider>
  );
};
