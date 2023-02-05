import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RootStackParamList } from "../navigation";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../hooks/useTheme";
import { useWindowDimensions, View } from "react-native";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { loadStaticAssets } from "../redux/thunks/assets";
import AppMap from "../components/Core/AppMap";
import AssetsDisplayModal, {
  AssetsDisplayModalRef,
  BOTTOM_SHEET_SNAP_POINTS,
} from "../components/Assets/AssetsDisplayModal";
import { useAppSelector } from "../hooks/useAppSelector";
import { getCombinedAssets } from "../redux/selectors/assets";
import MapboxGL, { Point, RegionPayload } from "@rnmapbox/maps";
import { CombinedAsset } from "../types";
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

type NavigationProps = NativeStackScreenProps<RootStackParamList, "home">;

const HomeScreen = ({ navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const { height } = useWindowDimensions();

  const bottomSheetRef = useRef<AssetsDisplayModalRef>(null);
  const modalHeightRef = useRef<number>(height * 0.23);
  const mapCamera = useRef<CameraRef>(null);
  const zoomRef = useRef(0);

  const combinedAssets = useAppSelector((state) => getCombinedAssets(state));
  const dispatch = useAppDispatch();

  const [selectedMarker, setSelectedMarker] = useState<{
    id: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<CombinedAsset | null>(
    null
  );

  useEffect(() => {
    dispatch(loadStaticAssets());
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
    (combinedAsset: CombinedAsset): MarkerProps => {
      const { dynamicData, staticData } = combinedAsset;
      return {
        longitude: dynamicData.lng,
        latitude: dynamicData.lat,
        title: staticData.name,
        theme,
        colors,
        selectedId: selectedAsset?.staticData.id || selectedMarker?.id,
        id: combinedAsset.staticData.id,
        onPress: handleMarkerPress,
      };
    },
    [selectedAsset, selectedMarker, theme, colors, handleMarkerPress]
  );

  const markerProps: MarkerProps[] = useMemo(() => {
    if (selectedAsset) {
      return [createMarkerProps(selectedAsset)];
    }
    if (combinedAssets) {
      return combinedAssets.map(createMarkerProps);
    }
    return [];
  }, [combinedAssets, selectedAsset, createMarkerProps]);

  const defaultMapBounds = useMemo(() => {
    if (combinedAssets.length) {
      const bounds = getBoundsFromCoordinates(combinedAssets, (asset) => ({
        latitude: asset.dynamicData.lat,
        longitude: asset.dynamicData.lng,
      }));
      return { ...bounds, ...defaultCameraPadding };
    } else {
      return defaultBounds;
    }
  }, [combinedAssets]);

  const handleModalHeightChange = (modalHeight: number) => {
    console.log(modalHeight);
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

  const selectAsset = (asset: CombinedAsset, paddingBottom?: number) => {
    const bounds = getBoundsFromCoordinates(
      [asset],
      (asset) => ({
        latitude: asset.dynamicData.lat,
        longitude: asset.dynamicData.lng,
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
    if (!assetId) {
      return deselectAll();
    }

    const asset = combinedAssets.find(
      (asset) => asset.staticData.id === assetId
    );

    if (asset) {
      selectAsset(asset, height * BOTTOM_SHEET_SNAP_POINTS[1]);
    }
  };

  const handleRegionIsChange = (
    payload: GeoJSON.Feature<GeoJSON.Point, RegionPayload>
  ) => {
    zoomRef.current = payload.properties.zoomLevel;
  };

  const handleMapPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
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
      />
    </View>
  );
};

export default HomeScreen;
