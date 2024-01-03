import React, { forwardRef, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import MapboxGL, {
  Atmosphere,
  RasterDemSource,
  SkyLayer,
  Terrain,
} from "@rnmapbox/maps";
import { MAP_TOKEN } from "@env";
import { getMapStyleUrl } from "../../utils/maps";
import AppIconButton from "./AppIconButton";
import { MapLayerSelect } from "../Maps/MapLayerSelect";
import { MapLayerContext } from "../../context/MapLayerContext";

MapboxGL.setAccessToken(MAP_TOKEN);

type MapViewProps = React.ComponentProps<typeof MapboxGL.MapView>;

const AppMap = forwardRef<MapboxGL.MapView, MapViewProps>(function AppMap(
  { children, ...rest },
  ref
) {
  const mapLayerContext = useContext(MapLayerContext);

  return (
    <MapboxGL.MapView
      ref={ref}
      style={styles.map}
      attributionEnabled={false}
      logoEnabled={false}
      scaleBarEnabled={false}
      styleURL={mapLayerContext.layerStyle}
      {...rest}
    >
      {children}
      <RasterDemSource
        id="mapbox-dem"
        url="mapbox://mapbox.mapbox-terrain-dem-v1"
        tileSize={514}
        maxZoomLevel={14}
      >
        <Atmosphere
          style={{
            color: "rgb(186, 210, 235)",
            highColor: "rgb(36, 92, 223)",
            horizonBlend: 0.02,
            spaceColor: "rgb(11, 11, 25)",
            starIntensity: 0.6,
          }}
        />
        <SkyLayer
          id="sky-layer"
          style={{
            skyType: "atmosphere",
            skyAtmosphereSun: [0.0, 0.0],
            skyAtmosphereSunIntensity: 15.0,
          }}
        />
        <Terrain style={{ exaggeration: 1.5 }} />
      </RasterDemSource>
    </MapboxGL.MapView>
  );
});

export default React.memo(AppMap);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
