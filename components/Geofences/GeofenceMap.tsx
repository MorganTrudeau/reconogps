import MapboxGL, { FillLayerStyle, LineLayerStyle } from "@rnmapbox/maps";
import React, { useMemo } from "react";
import AppMap from "../Core/AppMap";
import { Geofence } from "../../types";
import {
  getBoundsFromCoordinates,
  createCameraPadding,
  defaultCameraConfig,
  defaultCameraAnimationDuration,
} from "../../utils/maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const GeofenceMap = ({ geofence }: { geofence: Geofence }) => {
  const insets = useSafeAreaInsets();

  const { Lat: lat, Lng: lng } = geofence;

  const defaultMapBounds = useMemo(() => {
    const bounds = getBoundsFromCoordinates(
      [{ latitude: lat, longitude: lng }],
      (point) => point
    );
    return {
      ...bounds,
      ...createCameraPadding({
        paddingBottom: insets.bottom,
        paddingTop: insets.top + 60,
      }),
    };
  }, [lat, lng]);

  const geofenceShape: {
    type: "FeatureCollection";
    features: GeoJSON.FeatureCollection["features"];
  } = useMemo(() => {
    const inputString = geofence.GeoPolygon;

    const pattern =
      /(\w+)\(\(([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)(?:,\s*[-+]?\d+\.\d+\s+[-+]?\d+\.\d+)*\)\)/;
    const match = inputString.match(pattern);

    if (match) {
      const name = match[1]; // Extracting the name dynamically

      const coordPattern = /([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)/g;
      let coordMatch;
      const coords = [];

      while ((coordMatch = coordPattern.exec(match[0])) !== null) {
        coords.push([parseFloat(coordMatch[1]), parseFloat(coordMatch[2])]);
      }

      const result = {
        name: name,
        coords: coords,
      };

      return {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              // (result.name.charAt(0) +
              //   result.name.substring(1).toLowerCase()) as "Polygon",
              coordinates: [coords],
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: coords,
            },
            properties: {},
          },
        ],
      } as const;
    } else {
      return {
        type: "FeatureCollection",
        features: [],
      };
    }
  }, [geofence]);

  const handlePress = (e) => {
    console.log("PRESS", e);
  };

  const handleTouchStart = (e) => {
    console.log("TOUCH START", e);
  };
  const handleTouchMove = (e) => {
    console.log("TOUCH MOVE", e);
  };
  const handleTouchEnd = (e) => {
    console.log("TOUCH END", e);
  };

  return (
    <AppMap
      onPress={handlePress}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}

    >
      <MapboxGL.Camera
        defaultSettings={defaultCameraConfig}
        animationDuration={defaultCameraAnimationDuration}
        bounds={defaultMapBounds}
      />
      <MapboxGL.ShapeSource id="geofenceShape" shape={geofenceShape}>
        <MapboxGL.FillLayer id="fill" style={layerStyles.fill} />
        <MapboxGL.LineLayer id="line" style={layerStyles.line} />
      </MapboxGL.ShapeSource>
    </AppMap>
  );
};

const layerStyles: { fill: FillLayerStyle; line: LineLayerStyle } = {
  fill: {
    fillAntialias: true,
    fillColor: "red",
    fillOutlineColor: "red",
    fillOpacity: 0.1,
  },
  line: { lineWidth: 3, lineColor: "red" },
};
