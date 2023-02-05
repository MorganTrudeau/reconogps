import {
  CameraBounds,
  CameraPadding,
  CameraStop,
} from "@rnmapbox/maps/javascript/components/Camera";
import { Dimensions } from "react-native";
import { BOTTOM_SHEET_SNAP_POINTS } from "../components/Assets/AssetsDisplayModal";
import { spacing } from "../styles";
import { DynamicAsset, LatLng } from "../types";

export const getCoordinatesFromDynamicAssets = (
  dynamicAssets: DynamicAsset[]
): LatLng[] => {
  return dynamicAssets.map((asset) => ({
    latitude: asset.lat,
    longitude: asset.lng,
  }));
};

const { height: DEVICE_HEIGHT } = Dimensions.get("window");

const minCameraPadding = spacing("lg");

export const createCameraPadding = (
  cameraPaddingConfig: Partial<CameraPadding> = {}
) => {
  const {
    paddingBottom = 0,
    paddingTop = 0,
    paddingRight = 0,
    paddingLeft = 0,
  } = cameraPaddingConfig;
  return {
    paddingLeft: paddingLeft + minCameraPadding,
    paddingRight: paddingRight + minCameraPadding,
    paddingTop: paddingTop + minCameraPadding,
    paddingBottom: paddingBottom + minCameraPadding,
  };
};

export const defaultCameraPadding = createCameraPadding({
  paddingBottom: DEVICE_HEIGHT * BOTTOM_SHEET_SNAP_POINTS[0],
});
export const defaultBounds = {
  ne: [-122.69639222222222, 49.16037444444444],
  paddingBottom: 267.2,
  paddingLeft: 14,
  paddingRight: 14,
  paddingTop: 14,
  sw: [-122.69855055555556, 49.15870888888889],
};

export const defaultCameraCenterCoordinate = [-123.1207, 49.2827];
export const defaultCameraAnimationDuration = 700;
export const defaultCameraConfig: CameraStop = {
  centerCoordinate: defaultCameraCenterCoordinate,
  bounds: defaultBounds,
};

export const getBoundsFromCoordinates = <T>(
  data: T[],
  latLngSelector: (value: T) => LatLng,
  offset: number = 0.001
): CameraBounds => {
  let north: number | undefined = 0;
  let east: number | undefined = 0;
  let south: number | undefined = 0;
  let west: number | undefined = 0;

  data.forEach((value) => {
    const { latitude, longitude } = latLngSelector(value);
    if (!east || longitude > east) {
      east = longitude;
    }
    if (!west || longitude < west) {
      west = longitude;
    }
    if (!north || latitude < north) {
      north = latitude;
    }
    if (!south || latitude > south) {
      south = latitude;
    }
  });

  return {
    ne: [east + offset, north + offset],
    sw: [west - offset, south - offset],
  };
};
