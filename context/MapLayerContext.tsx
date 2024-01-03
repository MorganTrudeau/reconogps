import { StyleURL } from "@rnmapbox/maps";
import React, { createContext } from "react";
import { ViewProps } from "react-native";

export const MapLayerContext = createContext({
  layerStyle: StyleURL.Street,
  setLayerStyle: (styleURL: StyleURL) => {},
});

export const MapLayerProvider = ({
  children,
}: {
  children: ViewProps["children"];
}) => {
  const [layerStyle, setLayerStyle] = React.useState(StyleURL.Street);

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
