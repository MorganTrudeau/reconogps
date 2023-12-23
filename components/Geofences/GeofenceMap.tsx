import MapboxGL, {
  CircleLayerStyle,
  FillLayerStyle,
  LineLayerStyle,
  MapView,
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
  findCenterCoordinate,
} from "../../utils/maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  GestureResponderEvent,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { DrawGeofenceTool } from "../../types/geofences";
import { DrawGeofenceTools, GeoTypes } from "../../utils/enums";
import { getGeofenceCoords } from "../../utils/geofences";

export type Props = {
  geofence: Geofence;
  activeDrawTool?: DrawGeofenceTool;
  onDrawComplete: (data: {
    centerCoord: number[];
    coords: number[][];
    radius: number;
    geoType: 1 | 2;
  }) => void;
};

export const GeofenceMap = ({
  geofence,
  activeDrawTool,
  onDrawComplete,
}: Props) => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const { Lat: lat, Lng: lng } = geofence;

  const map = useRef<MapView>(null);

  const geofenceVector = useMemo(
    () => ({
      geoType: geofence.GeoType,
      coords: getGeofenceCoords(geofence),
    }),
    [geofence]
  );

  const lastActiveDrawTool = useRef<DrawGeofenceTool>();
  const firstDrawPoint = useRef<number[]>();
  const circleRadius = useRef<number>(0);

  const [drawCoords, setDrawPoints] = useState<number[][]>([]);
  const [drawGeoType, setDrawGeoType] = useState<1 | 2>(2);

  const geofenceShape: {
    type: "FeatureCollection";
    features: GeoJSON.FeatureCollection["features"];
  } = useMemo(() => {
    const coords = drawCoords.length ? drawCoords : geofenceVector.coords;

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
  }, [drawCoords, geofenceVector.coords, activeDrawTool]);

  const defaultMapBounds = useMemo(() => {
    const bounds = getBoundsFromCoordinates(
      geofenceVector.coords.length ? geofenceVector.coords : [[lng, lat]],
      ([longitude, latitude]) => ({ latitude, longitude }),
      0.0015
    );
    return {
      ...bounds,
      ...createCameraPadding({
        paddingBottom: insets.bottom + height * 0.25,
        paddingTop: insets.top + 60,
      }),
    };
  }, [lat, lng]);

  const handleTouchStart = async ({ nativeEvent }: GestureResponderEvent) => {
    if (!activeDrawTool || nativeEvent.touches.length > 1) {
      return;
    }
    const point = await map.current?.getCoordinateFromView([
      nativeEvent.locationX,
      nativeEvent.locationY,
    ]);

    if (point) {
      firstDrawPoint.current = point;
      if (
        activeDrawTool !== DrawGeofenceTools.CIRCLE &&
        activeDrawTool !== DrawGeofenceTools.SQUARE
      ) {
        setDrawPoints((p) =>
          lastActiveDrawTool.current &&
          activeDrawTool !== lastActiveDrawTool.current
            ? [point]
            : [...p, point]
        );
      }
      setDrawGeoType(activeDrawTool === DrawGeofenceTools.CIRCLE ? 1 : 2);
      lastActiveDrawTool.current = activeDrawTool;
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
            circleRadius.current = distanceBetweenCoords(coord1, point);
            const circleCoords = createCircleCoords(
              coord1,
              circleRadius.current
            );
            setDrawPoints(circleCoords);
          }
        } else {
          const coord1 = firstDrawPoint.current;
          if (coord1) {
            const squareCoords = createSquareCoords(coord1, point);
            console.log(squareCoords);
            if (squareCoords) {
              setDrawPoints(squareCoords);
            }
          }
        }
      } else {
        setDrawPoints((p) => {
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
    if (drawCoords.length > 3) {
      onDrawComplete({
        centerCoord: findCenterCoordinate(drawCoords),
        coords: drawCoords,
        radius: circleRadius.current,
        geoType: drawGeoType,
      });
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
        <MapboxGL.CircleLayer
          id="circle"
          style={{
            ...layerStyles.circle,
            visibility:
              drawGeoType === GeoTypes.CIRCLE ||
              geofenceVector.geoType === GeoTypes.CIRCLE
                ? "none"
                : "visible",
          }}
        />
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
