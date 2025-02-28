import React, { forwardRef, useContext } from "react";
import { StyleSheet } from "react-native";
import MapboxGL, {
  Atmosphere,
  RasterDemSource,
  SkyLayer,
  StyleURL,
  Terrain,
} from "@rnmapbox/maps";
import Config from "react-native-config";
import { MapLayerContext } from "../../context/MapLayerContext";
import FocusAwareStatusBar from "../../navigation/FocusAwareStatusBar";

MapboxGL.setAccessToken(Config.MAP_TOKEN);

type MapViewProps = React.ComponentProps<typeof MapboxGL.MapView>;

const AppMap = forwardRef<MapboxGL.MapView, MapViewProps>(function AppMap(
  { children, ...rest },
  ref
) {
  const mapLayerContext = useContext(MapLayerContext);

  return (
    <>
      <MapboxGL.MapView
        ref={ref}
        style={styles.map}
        attributionEnabled={false}
        logoEnabled={false}
        scaleBarEnabled={false}
        rotateEnabled={false}
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
      <FocusAwareStatusBar
        style={statusBarStyleForLayerStyle(mapLayerContext.layerStyle)}
      />
    </>
  );
});

const statusBarStyleForLayerStyle = (layerStyle: StyleURL) => {
  switch (layerStyle) {
    case StyleURL.Dark:
    case StyleURL.SatelliteStreet:
    case StyleURL.Satellite:
    case StyleURL.TrafficNight:
      return "light";
    default:
      return "dark";
  }
};

export default React.memo(AppMap);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
