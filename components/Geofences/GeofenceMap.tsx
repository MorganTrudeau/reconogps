import MapboxGL, {
  CircleLayerStyle,
  FillLayerStyle,
  LineLayerStyle,
  MapView,
  MarkerView,
  SymbolLayerStyle,
} from "@rnmapbox/maps";
import React, { useMemo, useRef, useState } from "react";
import AppMap from "../Core/AppMap";
import { Geofence } from "../../types";
import {
  getBoundsFromCoordinates,
  createCameraPadding,
  defaultCameraConfig,
  defaultCameraAnimationDuration,
  distanceBetweenCoords,
  createCircleCoords,
  createSquareCoords,
} from "../../utils/maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { DrawGeofenceTool } from "../../types/geofences";
import { DrawGeofenceTools } from "../../utils/enums";

export const GeofenceMap = ({
  geofence,
  activeDrawTool,
}: {
  geofence: Geofence;
  activeDrawTool?: DrawGeofenceTool;
}) => {
  const insets = useSafeAreaInsets();

  const { Lat: lat, Lng: lng } = geofence;

  const map = useRef<MapView>(null);

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

  const geofenceCoords = useMemo(() => {
    const inputString = geofence.GeoPolygon;

    const pattern =
      /(\w+)\(\(([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)(?:,\s*[-+]?\d+\.\d+\s+[-+]?\d+\.\d+)*\)\)/;
    const match = inputString.match(pattern);

    if (match) {
      const coordPattern = /([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)/g;
      let coordMatch;
      const coords = [];

      while ((coordMatch = coordPattern.exec(match[0])) !== null) {
        coords.push([parseFloat(coordMatch[1]), parseFloat(coordMatch[2])]);
      }

      return coords;
    } else {
      return [];
    }
  }, []);

  const firstDrawPoint = useRef<number[]>();
  const [points, setPoints] = useState<number[][]>([]);

  const geofenceShape: {
    type: "FeatureCollection";
    features: GeoJSON.FeatureCollection["features"];
  } = useMemo(() => {
    const coords = points.length ? points : geofenceCoords;

    const feature: {
      type: "FeatureCollection";
      features: GeoJSON.FeatureCollection["features"];
    } = {
      type: "FeatureCollection",
      features: [],
    };

    if (coords.length < 2) {
      feature.features.push({
        type: "Feature",
        geometry: {
          type: "MultiPoint",
          coordinates: coords,
        },
        properties: {},
      });
    } else if (coords.length < 4) {
      feature.features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coords,
        },
        properties: {},
      });
    } else {
      feature.features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [coords],
        },
      });
    }

    return feature;
  }, [points, geofenceCoords, activeDrawTool]);

  // const handlePress = (feature: GeoJSON.Feature) => {
  //   if (feature.geometry.type === "Point") {
  //     const coords = feature.geometry.coordinates;
  //     setPoints((p) => [...p, coords]);
  //   }
  // };

  const handleTouchStart = async ({ nativeEvent }: GestureResponderEvent) => {
    console.log(nativeEvent);
    if (!activeDrawTool || nativeEvent.touches.length > 1) {
      return;
    }
    const point = await map.current?.getCoordinateFromView([
      nativeEvent.locationX,
      nativeEvent.locationY,
    ]);

    if (point) {
      if (
        activeDrawTool === DrawGeofenceTools.CIRCLE ||
        activeDrawTool === DrawGeofenceTools.SQUARE
      ) {
        firstDrawPoint.current = point;
      } else {
        setPoints((p) => [...p, point]);
      }
    }
  };
  const handleTouchMove = async ({ nativeEvent }: GestureResponderEvent) => {
    if (!activeDrawTool || nativeEvent.touches.length > 1) {
      return;
    }
    const point = await map.current?.getCoordinateFromView([
      nativeEvent.locationX,
      nativeEvent.locationY,
    ]);
    if (point) {
      if (
        activeDrawTool === DrawGeofenceTools.CIRCLE ||
        activeDrawTool === DrawGeofenceTools.SQUARE
      ) {
        if (activeDrawTool === DrawGeofenceTools.CIRCLE) {
          const coord1 = firstDrawPoint.current;
          if (coord1) {
            const radius = distanceBetweenCoords(coord1, point);
            const circleCoords = createCircleCoords(coord1, radius);
            setPoints(circleCoords);
          }
        } else {
          const coord1 = firstDrawPoint.current;
          if (coord1) {
            const squareCoords = createSquareCoords(coord1, point);
            console.log(squareCoords);
            if (squareCoords) {
              setPoints(squareCoords);
            }
          }
        }
      } else {
        setPoints((p) => {
          const newPoints = p.length > 1 ? p.slice(0, p.length - 1) : p;
          return [...newPoints, point];
        });
      }
    }
  };
  const handleTouchEnd = ({ nativeEvent }: GestureResponderEvent) => {
    if (!activeDrawTool || nativeEvent.touches.length > 1) {
      return;
    }
    if (nativeEvent.touches.length > 1) {
      return;
    }
  };

  return (
    <AppMap
      ref={map}
      scrollEnabled={!activeDrawTool}
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
        <MapboxGL.CircleLayer id="circle" style={layerStyles.circle} />
      </MapboxGL.ShapeSource>
    </AppMap>
  );
};

const layerStyles: {
  fill: FillLayerStyle;
  line: LineLayerStyle;
  points: SymbolLayerStyle;
  circle: CircleLayerStyle;
} = {
  fill: {
    fillAntialias: true,
    fillColor: "red",
    fillOutlineColor: "red",
    fillOpacity: 0.1,
  },
  line: { lineWidth: 3, lineColor: "red" },
  points: {
    iconImage: require("../../assets/pin.png"),
  },
  circle: {
    circleColor: "red",
  },
};

const styles = StyleSheet.create({
  marker: { height: 10, width: 10, borderRaidus: 5, backgroundColor: "red" },
});
