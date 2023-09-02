import React, { useCallback, useMemo, useRef, useState } from "react";
import { RootStackParamList } from "../navigation/utils";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../hooks/useTheme";
import { StatusBar, useWindowDimensions, View } from "react-native";
import { useAppDispatch } from "../hooks/useAppDispatch";
import AppMap from "../components/Core/AppMap";
import AssetsDisplayModal, {
  AssetsDisplayModalRef,
} from "../components/Assets/AssetsDisplayModal";
import { useAppSelector } from "../hooks/useAppSelector";
import { getCombinedAssets, getDynamicAssets } from "../redux/selectors/assets";
import MapboxGL, { RegionPayload } from "@rnmapbox/maps";
import { DynamicAsset } from "../types";
import { CameraRef } from "@rnmapbox/maps/javascript/components/Camera";
import AssetMarkerView, {
  MarkerProps,
} from "../components/Maps/AssetMarkerView";
import {
  createCameraPadding,
  defaultBounds,
  defaultCameraAnimationDuration,
  defaultCameraConfig,
  defaultCameraPadding,
  getBoundsFromCoordinates,
} from "../utils/maps";
import FocusAwareStatusBar from "../navigation/FocusAwareStatusBar";
import { Constants } from "../utils/constants";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "home">;

const HomeScreen = ({ navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const { height } = useWindowDimensions();

  const bottomSheetRef = useRef<AssetsDisplayModalRef>(null);
  const modalHeightRef = useRef<number>(height * 0.23);
  const mapCamera = useRef<CameraRef>(null);
  const zoomRef = useRef(0);

  const combinedAssets = useAppSelector((state) => getCombinedAssets(state));
  const dynamicAssets = useAppSelector((state) => getDynamicAssets(state));
  const staticAssetEntities = useAppSelector(
    (state) => state.assets.staticData.entities
  );
  const dispatch = useAppDispatch();

  const [selectedMarker, setSelectedMarker] = useState<{
    id: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<DynamicAsset | null>(null);

  // useEffect(() => {
  //   dispatch(loadStaticAssets());
  // }, []);

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
    (dynamicAsset: DynamicAsset): MarkerProps => {
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

  const markerProps: MarkerProps[] = useMemo(() => {
    if (selectedAsset) {
      return [createMarkerProps(selectedAsset)];
    }

    return dynamicAssets.map(createMarkerProps);

    return [];
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
    mapCamera.current?.setCamera({
      animationDuration: defaultCameraAnimationDuration,
      bounds: {
        ...defaultMapBounds,
        ...createCameraPadding({
          paddingBottom: modalHeightRef.current,
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
          paddingBottom: paddingBottom || modalHeightRef.current,
        }),
      },
    });

    return setSelectedAsset(asset);
  };

  const handleAssetPress = (assetId: string | null) => {
    console.log(assetId);
    if (!assetId) {
      return deselectAll();
    }

    const asset = dynamicAssets.find((asset) => asset.id === assetId);

    if (asset) {
      selectAsset(asset, height * Constants.BOTTOM_SHEET_SNAP_POINTS[1]);
    }
  };

  const handleRegionIsChange = (
    payload: GeoJSON.Feature<GeoJSON.Point, RegionPayload>
  ) => {
    zoomRef.current = payload.properties.zoomLevel;
  };

  const handleMapPress = useCallback(() => {
    // bottomSheetRef.current?.snapToIndex(0);
  }, []);

  return (
    <View style={theme.container}>
      <FocusAwareStatusBar style="dark" />
      <AppMap
        onPress={handleMapPress}
        onRegionIsChanging={handleRegionIsChange}
      >
        <MapboxGL.Camera
          defaultSettings={defaultCameraConfig}
          ref={mapCamera}
          animationDuration={defaultCameraAnimationDuration}
          bounds={defaultMapBounds}
        />
        {markerProps.map((props, index) => (
          <AssetMarkerView {...props} key={`${props.id}-${index}`} />
        ))}
      </AppMap>
      <AssetsDisplayModal
        onAssetSelected={handleAssetPress}
        onHeightChange={handleModalHeightChange}
        ref={bottomSheetRef}
        navigation={navigation}
      />
      <StatusBar barStyle={"dark-content"} />
    </View>
  );
};

export default HomeScreen;
