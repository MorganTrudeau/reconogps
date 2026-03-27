import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RootStackParamList } from "../navigation/utils";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../hooks/useTheme";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import AppMap from "../components/Core/AppMap";
import AssetsDisplayModal, {
  AssetsDisplayModalRef,
} from "../components/Assets/AssetsDisplayModal";
import { useAppSelector } from "../hooks/useAppSelector";
import { getCombinedAssets, getDynamicAssets } from "../redux/selectors/assets";
import MapboxGL, { ShapeSource } from "@rnmapbox/maps";
import { DynamicAsset } from "../types";
import { MarkerProps } from "../components/Maps/AssetMarkerView";
import {
  createCameraPadding,
  defaultBounds,
  defaultCameraAnimationDuration,
  defaultCameraConfig,
  defaultCameraPadding,
  getBoundsFromCoordinates,
} from "../utils/maps";
import { Constants } from "../utils/constants";
import AppText from "../components/Core/AppText";
import { Colors } from "../types/styles";
import { BORDER_RADIUS_SM, iconSize, spacing } from "../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapLayerSelect } from "../components/Maps/MapLayerSelect";
import { MapState } from "@rnmapbox/maps";
import AppIconButton from "../components/Core/AppIconButton";
import { NotificationsButton } from "../components/Notifications/NotificationsButton";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "home">;
type MarkerData = { id: string; longitude: number; latitude: number };

const HomeScreen = ({ navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const bottomSheetRef = useRef<AssetsDisplayModalRef>(null);
  const modalHeightRef = useRef<number>(height * 0.23);
  const mapCamera = useRef<MapboxGL.Camera>(null);
  const zoomRef = useRef(0);
  const shapeSource = useRef<ShapeSource>(null);

  const combinedAssets = useAppSelector((state) => getCombinedAssets(state));
  const dynamicAssets = useAppSelector((state) => getDynamicAssets(state));
  const staticAssetEntities = useAppSelector(
    (state) => state.assets.staticData.entities
  );

  const [selectedMarker, setSelectedMarker] = useState<{
    id: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<DynamicAsset | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={theme.row}>
          <NotificationsButton
            theme={theme}
            colors={colors}
            style={styles.notificationButton}
          />
          <MapLayerSelect />
        </View>
      ),
    });
  }, []);

  const handleMarkerPress = useCallback(
    (marker: { id: string; longitude: number; latitude: number }) => {
      if (selectedMarker?.id === marker.id) {
        const asset = combinedAssets.find(
          (asset) => asset.staticData.id === marker.id
        );
        if (asset) {
          setSelectedMarker(null);
          return bottomSheetRef.current?.navigateToAsset(asset.staticData.id);
        }
      }
      selectMarker(marker);
    },
    [selectedMarker]
  );

  const createMarkerProps = useCallback(
    (
      dynamicAsset: DynamicAsset
    ): Pick<
      MarkerProps,
      | "longitude"
      | "latitude"
      | "title"
      | "theme"
      | "colors"
      | "selectedId"
      | "id"
      | "onPress"
    > => {
      const staticAsset = staticAssetEntities[dynamicAsset.id];
      return {
        longitude: dynamicAsset.lng,
        latitude: dynamicAsset.lat,
        title: staticAsset?.name,
        theme,
        colors,
        selectedId: selectedAsset?.id || selectedMarker?.id,
        id: dynamicAsset.id,
        onPress: handleMarkerPress,
      };
    },
    [selectedAsset, selectedMarker, theme, colors, handleMarkerPress]
  );

  const markerProps = useMemo(() => {
    if (selectedAsset) {
      return [createMarkerProps(selectedAsset)];
    }

    return dynamicAssets.map(createMarkerProps);
  }, [dynamicAssets, selectedAsset, createMarkerProps]);

  const defaultMapBounds = useMemo(() => {
    if (dynamicAssets.length) {
      const bounds = getBoundsFromCoordinates(dynamicAssets, (asset) => ({
        latitude: asset.lat,
        longitude: asset.lng,
      }));
      return { ...bounds, ...defaultCameraPadding };
    } else {
      return defaultBounds;
    }
  }, [combinedAssets]);

  const handleModalHeightChange = (modalHeight: number) => {
    modalHeightRef.current = modalHeight;
  };

  const selectMarker = (
    marker: {
      id: string;
      latitude: number;
      longitude: number;
    },
    paddingBottom?: number
  ) => {
    mapCamera.current?.setCamera({
      animationDuration: defaultCameraAnimationDuration,
      centerCoordinate: [marker.longitude, marker.latitude],
      padding: createCameraPadding({
        paddingBottom: paddingBottom || modalHeightRef.current,
      }),
      zoomLevel: zoomRef.current < 16 ? zoomRef.current + 2 : zoomRef.current,
    });

    setSelectedMarker(marker);
  };

  const deselectAll = () => {
    bottomSheetRef.current?.snapToIndex(0);
    mapCamera.current?.setCamera({
      animationDuration: defaultCameraAnimationDuration,
      bounds: {
        ...defaultMapBounds,
        ...createCameraPadding({
          paddingBottom: height * Constants.BOTTOM_SHEET_SNAP_POINTS[0],
        }),
      },
    });
    if (selectedMarker) {
      setSelectedMarker(null);
    }
    if (selectedAsset) {
      setSelectedAsset(null);
    }
  };

  const selectAsset = (asset: DynamicAsset, paddingBottom?: number) => {
    const bounds = getBoundsFromCoordinates(
      [asset],
      (asset) => ({
        latitude: asset.lat,
        longitude: asset.lng,
      }),
      0.0005
    );
    mapCamera.current?.setCamera({
      animationDuration: defaultCameraAnimationDuration,
      bounds: {
        ...bounds,
        ...createCameraPadding({
          paddingBottom: (paddingBottom || modalHeightRef.current) + 30,
        }),
      },
    });

    return setSelectedAsset(asset);
  };

  const handleAssetPress = (assetId: string | null) => {
    if (!assetId) {
      return deselectAll();
    }

    const asset = dynamicAssets.find((asset) => asset.id === assetId);

    if (asset) {
      selectAsset(asset, height * Constants.BOTTOM_SHEET_SNAP_POINTS[1]);
    }
  };

  const handleCameraChanged = (payload: MapState) => {
    zoomRef.current = payload.properties.zoom;
  };

  const handleMapPress = useCallback(() => {
    setSelectedMarker(null);
    // bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const eventShapes = useMemo(() => {
    const shape: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features:
        // (focusedPoint ? [focusedPoint] : playbackEvents).map(
        markerProps.map((props) => {
          const feature: GeoJSON.FeatureCollection["features"][number] = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [props.longitude, props.latitude],
            },
            /**
             * A value that uniquely identifies this feature in a
             * https://tools.ietf.org/html/rfc7946#section-3.2.
             */
            id: props.id,
            /**
             * Properties associated with this feature.
             */
            properties: {
              icon: "pin",
            },
          };
          return feature;
        }),
    };

    return shape;
  }, [markerProps]);

  return (
    <View style={theme.container}>
      <AppMap onPress={handleMapPress} onCameraChanged={handleCameraChanged}>
        <MapboxGL.Images images={{ pin: require("../assets/pin.png") }} />

        {selectedMarker && !selectedAsset && (
          <MapboxGL.MarkerView
            anchor={{
              x: 0.5,
              y: 2,
            }}
            coordinate={[selectedMarker.longitude, selectedMarker.latitude]}
          >
            <Pressable onPress={() => handleMarkerPress(selectedMarker)}>
              <CustomCalloutView
                colors={colors}
                markerData={selectedMarker}
                onViewDetails={handleMarkerPress}
              />
            </Pressable>
          </MapboxGL.MarkerView>
        )}

        <MapboxGL.Camera
          defaultSettings={defaultCameraConfig}
          ref={mapCamera}
          animationDuration={defaultCameraAnimationDuration}
          bounds={defaultMapBounds}
        />

        <MapboxGL.ShapeSource
          ref={shapeSource}
          shape={eventShapes}
          id="a-symbolLocationSource"
          hitbox={{ width: 18, height: 18 }}
          onPress={async (point) => {
            if (point.features[0].properties?.cluster) {
              const collection: GeoJSON.FeatureCollection =
                await shapeSource.current?.getClusterLeaves(
                  point.features[0],
                  point.features[0].properties.point_count,
                  0
                );
              // Do what you want if the user clicks the cluster
              if (collection?.features) {
                const coords = collection.features.map((feature) => {
                  // @ts-ignore
                  return feature.geometry.coordinates;
                });

                const bounds = getBoundsFromCoordinates(
                  coords,
                  (point) => ({
                    latitude: point[1],
                    longitude: point[0],
                  }),
                  0
                );

                mapCamera.current?.fitBounds(
                  bounds.ne,
                  bounds.sw,
                  [insets.top + 50, 50, modalHeightRef.current + 50, 50],
                  400
                );
              }
            } else {
              const index = markerProps.findIndex(
                (val) => val.id === point.features[0].id
              );

              if (index > -1) {
                const props = markerProps[index];
                props?.onPress?.(markerProps[index]);
              }

              mapCamera.current?.setCamera({
                animationDuration: 400,
                // @ts-ignore
                centerCoordinate: point.features[0].geometry.coordinates,
                padding: createCameraPadding({
                  paddingBottom: modalHeightRef.current,
                }),
              });
            }
          }}
          cluster
        >
          <MapboxGL.SymbolLayer
            id="pointCount"
            style={layerStyles.clusterCount}
          />

          <MapboxGL.CircleLayer
            id="clusteredPoints"
            belowLayerID="pointCount"
            filter={["has", "point_count"]}
            style={{
              circleColor: colors.primary,
              circleRadius: [
                "step",
                ["get", "point_count"],
                20,
                100,
                25,
                250,
                30,
                750,
                40,
              ],
              circleOpacity: 0.95,
              circleStrokeWidth: 0,
              circleStrokeColor: colors.primary,
            }}
          />

          <MapboxGL.SymbolLayer
            id="singlePoint"
            filter={["!", ["has", "point_count"]]}
            style={{
              iconImage: ["get", "icon"],
              iconSize: 1,
              iconHaloColor: "black",
              iconHaloWidth: 10,
              iconColor: "white",
              iconAllowOverlap: true,
              iconAnchor: "bottom",
            }}
          />
        </MapboxGL.ShapeSource>
      </AppMap>
      <AssetsDisplayModal
        onAssetSelected={handleAssetPress}
        onHeightChange={handleModalHeightChange}
        ref={bottomSheetRef}
        navigation={navigation}
      />
    </View>
  );
};

export default HomeScreen;

const ANNOTATION_SIZE = 20;

const styles = StyleSheet.create({
  annotationContainer: {
    alignItems: "center",
    backgroundColor: "#e5b2ae",
    borderColor: "rgba(0, 0, 0, 0.45)",
    borderRadius: ANNOTATION_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    height: ANNOTATION_SIZE,
    justifyContent: "center",
    overflow: "hidden",
    width: ANNOTATION_SIZE,
  },
  notificationButton: { marginRight: spacing("md") },
});

const layerStyles = {
  lineLayer: {
    lineColor: "#3e8feb",
    lineCap: "round",
    lineJoin: "round",
    lineWidth: 3,
  },
  singlePoint: {
    circleColor: "green",
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: "white",
    circleRadius: 5,
    circlePitchAlignment: "map",
  },
  clusteredPoints: {},
  clusterCount: {
    textField: "{point_count}",
    textSize: 12,
    // textPitchAlignment: "viewport",
  },
};

type CustomCalloutViewProps = {
  colors: Colors;
  markerData: MarkerData;
  onViewDetails: (markerData: MarkerData) => void;
};

const CustomCalloutView = ({
  colors,
  markerData,
  onViewDetails,
}: CustomCalloutViewProps) => {
  const staticAsset = useAppSelector(
    (state) => state.assets.staticData.entities[markerData.id]
  );

  return (
    <View
      style={{
        backgroundColor: colors.background,
        padding: spacing("md"),
        borderRadius: BORDER_RADIUS_SM,
      }}
    >
      <AppText>{staticAsset?.name}</AppText>
    </View>
  );
};
