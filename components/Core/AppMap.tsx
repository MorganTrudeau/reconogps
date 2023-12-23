import React, { forwardRef } from "react";
import { StyleSheet } from "react-native";
import MapboxGL, {
  Atmosphere,
  MapViewProps,
  RasterDemSource,
  SkyLayer,
  Terrain,
} from "@rnmapbox/maps";
import { getMapStyleUrl } from "../../utils/maps";

MapboxGL.setAccessToken(
  "sk.eyJ1IjoicmVjb25vZ3BzIiwiYSI6ImNsZGRvbmVscTAwNHczcHFxOWd6cHFnZ3gifQ.6H6bpyJG6L6NAafD9Ds4AQ"
);

const AppMap = forwardRef<MapboxGL.MapView, MapViewProps>(function AppMap(
  { children, ...rest },
  ref
) {
  return (
    <MapboxGL.MapView
      ref={ref}
      style={styles.map}
      attributionEnabled={false}
      logoEnabled={false}
      scaleBarEnabled={false}
      styleURL={getMapStyleUrl("satellite")}
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
