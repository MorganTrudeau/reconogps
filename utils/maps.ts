import {
  CameraBounds,
  CameraPadding,
  CameraStop,
} from "@rnmapbox/maps/javascript/components/Camera";
import { Dimensions } from "react-native";
import { spacing } from "../styles";
import { DynamicAsset, LatLng } from "../types";
import { Translations } from "./translations";
import { Constants } from "./constants";

export const getDirectionCardinal = (degrees: number) => {
  let ret: string = Translations.direction.unknown;
  switch (true) {
    case degrees >= 338 || degrees <= 22:
      ret = Translations.direction.north;
      break;
    case degrees >= 23 && degrees <= 75:
      ret = Translations.direction.north_east;
      break;
    case degrees >= 76 && degrees <= 112:
      ret = Translations.direction.east;
      break;
    case degrees >= 113 && degrees <= 157:
      ret = Translations.direction.south_east;
      break;
    case degrees >= 158 && degrees <= 202:
      ret = Translations.direction.south;
      break;
    case degrees >= 203 && degrees <= 247:
      ret = Translations.direction.south_west;
      break;
    case degrees >= 248 && degrees <= 292:
      ret = Translations.direction.west;
      break;
    case degrees >= 293 && degrees <= 337:
      ret = Translations.direction.north_west;
      break;
  }
  return ret;
};

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
  paddingBottom: DEVICE_HEIGHT * Constants.BOTTOM_SHEET_SNAP_POINTS[0],
});
export const defaultBounds = {
  ne: [-123.55, 49.0],
  paddingBottom: 267.2,
  paddingLeft: 14,
  paddingRight: 14,
  paddingTop: 14,
  sw: [-121.62, 50.0],
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
  offset: number = 0.015
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

export const distanceBetweenCoords = (coords1: number[], coords2: number[]) => {
  const [lng1, lat1] = coords1;
  const [lng2, lat2] = coords2;

  const earthRadius = 6371000; // Earth's radius in meters
  const degToRad = (degrees: number) => (degrees * Math.PI) / 180;

  // Convert latitude and longitude from degrees to radians
  const phi1 = degToRad(lat1);
  const phi2 = degToRad(lat2);
  const deltaPhi = degToRad(lat2 - lat1);
  const deltaLambda = degToRad(lng2 - lng1);

  // Haversine formula
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate distance
  const distance = earthRadius * c;

  return distance;
};

export const createCircleCoords = (coords: number[], radius: number) => {
  const [lng, lat] = coords;

  const degreesBetweenPoints = 8; //45 sides
  const numberOfPoints = Math.floor(360 / degreesBetweenPoints);
  const distRadians = radius / 6371000; // earth radius in meters
  const centerLatRadians = (lat * Math.PI) / 180;
  const centerLonRadians = (lng * Math.PI) / 180;
  const points: number[][] = [];

  for (let i = 0; i < numberOfPoints; i++) {
    const degrees = i * degreesBetweenPoints;
    const degreeRadians = (degrees * Math.PI) / 180;
    const pointLatRadians = Math.asin(
      Math.sin(centerLatRadians) * Math.cos(distRadians) +
        Math.cos(centerLatRadians) *
          Math.sin(distRadians) *
          Math.cos(degreeRadians)
    );
    const pointLonRadians =
      centerLonRadians +
      Math.atan2(
        Math.sin(degreeRadians) *
          Math.sin(distRadians) *
          Math.cos(centerLatRadians),
        Math.cos(distRadians) -
          Math.sin(centerLatRadians) * Math.sin(pointLatRadians)
      );
    const pointLat = (pointLatRadians * 180) / Math.PI;
    const pointLon = (pointLonRadians * 180) / Math.PI;
    const point = [pointLon, pointLat];
    points.push(point);
  }

  return points;
};

export const createSquareCoords = (coord1: number[], coord2: number[]) => {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const coord1Position = findCoordBearingPosition(coord1, coord2);

  if (coord1Position === "SW") {
    return [
      coord1, // SW
      [lng1, lat2], // NW
      coord2, // NE
      [lng2, lat1], // SE
    ];
  } else if (coord1Position === "NW") {
    return [
      [lng1, lat2], // SW
      coord1, // NW
      [lng2, lat1], // NE
      coord2, // SE
    ];
  } else if (coord1Position === "NE") {
    return [
      coord2, // SW
      [lng2, lat1], // NW
      coord1, // NE
      [lng1, lat2], // SE
    ];
  } else if (coord1Position === "SE") {
    return [
      [lng2, lat1], // SW
      coord2, // NW
      [lng1, lat2], // NE
      coord1, // SE
    ];
  }
};

const findCoordBearingPosition = (coord1: number[], coord2: number[]) => {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  if (lng1 <= lng2 && lat1 <= lat2) {
    return "SW";
  } else if (lng1 <= lng2 && lat1 >= lat2) {
    return "NW";
  } else if (lng1 >= lng2 && lat1 <= lat2) {
    return "SE";
  } else if (lng1 >= lng2 && lat1 >= lat2) {
    return "NE";
  } else if (lng1 === lng2 && lat1 < lat2) {
    return "S";
  } else if (lng1 === lng2 && lat1 > lat2) {
    return "N";
  } else if (lng1 < lng2 && lat1 === lat2) {
    return "E";
  } else if (lng1 > lng2 && lat1 === lat2) {
    return "W";
  } else {
    return undefined;
  }
};

const calculateCoordinateDiff = (coord1: number[], coord2: number[]) => {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  // Calculate the absolute differences between x and y coordinates
  const longitudeDiff = Math.abs(lng2 - lng1);
  const latitudeDiff = Math.abs(lat2 - lat1);

  return { longitudeDiff, latitudeDiff };
};

export const calculateNewCoordinate = (
  coord: number[],
  distance: number,
  bearing: number
) => {
  const [lng, lat] = coord;

  // Function to convert degrees to radians
  const toRadians = (degrees: number) => {
    return degrees * (Math.PI / 180);
  };

  // Function to convert radians to degrees
  const toDegrees = (radians: number) => {
    return radians * (180 / Math.PI);
  };

  const earthRadius = 6371000; // approximate radius of Earth in meters

  // Convert latitude and longitude from degrees to radians
  const latRad = toRadians(lat);
  const lonRad = toRadians(lng);

  // Convert bearing from degrees to radians
  const bearingRad = toRadians(bearing);

  // Convert distance from meters to radians
  const distanceRad = distance / earthRadius;

  // Calculate new latitude using the Haversine formula
  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(distanceRad) +
      Math.cos(latRad) * Math.sin(distanceRad) * Math.cos(bearingRad)
  );

  // Calculate new longitude using the Haversine formula
  const newLonRad =
    lonRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(distanceRad) * Math.cos(latRad),
      Math.cos(distanceRad) - Math.sin(latRad) * Math.sin(newLatRad)
    );

  // Convert new latitude and longitude from radians to degrees
  const newLat = toDegrees(newLatRad);
  const newLon = toDegrees(newLonRad);

  return [newLat, newLon];
};
