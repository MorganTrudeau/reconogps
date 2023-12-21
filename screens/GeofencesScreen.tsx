import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation/utils";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { loadGeofences } from "../redux/thunks/geofences";
import { GeofencesList } from "../components/Geofences/GeofencesList";
import { useAppSelector } from "../hooks/useAppSelector";
import { getGeofences } from "../redux/selectors/geofences";
import { Geofence } from "../types";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "geofences">;

const GeofencesScreen = ({ navigation }: NavigationProps) => {
  const { theme } = useTheme();
  const { geofences, loading } = useAppSelector((state) => ({
    geofences: getGeofences(state),
    loading: state.geofences.loadRequest.loading,
  }));
  const dispatch = useAppDispatch();

  const handleLoad = () => dispatch(loadGeofences());

  useEffect(() => {
    handleLoad();
  }, []);

  const handleEdit = useCallback(
    (geofence: Geofence) =>
      navigation.navigate("manage-geofence", { geofenceCode: geofence.Code }),
    []
  );

  return (
    <View style={theme.container}>
      <GeofencesList
        geofences={geofences}
        contentContainerStyle={theme.contentContainer}
        onRefresh={handleLoad}
        loading={loading}
        onEdit={handleEdit}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default GeofencesScreen;
