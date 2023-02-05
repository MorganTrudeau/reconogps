import React from "react";
import { StyleSheet } from "react-native";
import MapboxGL, { MapViewProps } from "@rnmapbox/maps";

MapboxGL.setAccessToken(
  "sk.eyJ1IjoicmVjb25vZ3BzIiwiYSI6ImNsZGRvbmVscTAwNHczcHFxOWd6cHFnZ3gifQ.6H6bpyJG6L6NAafD9Ds4AQ"
);

const AppMap = (props: MapViewProps) => {
  return (
    <MapboxGL.MapView
      style={styles.map}
      rotateEnabled={false}
      pitchEnabled={false}
      attributionEnabled={false}
      logoEnabled={false}
      scaleBarEnabled={false}
      {...props}
    />
  );
};

export default React.memo(AppMap);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
