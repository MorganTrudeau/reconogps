import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation/utils";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { loadGeofences } from "../redux/thunks/geofences";
import { GeofencesList } from "../components/Geofences/GeofencesList";
import { useAppSelector } from "../hooks/useAppSelector";
import { getGeofences } from "../redux/selectors/geofences";
import { Geofence } from "../types";
import { iconSize } from "../styles";
import AppIcon from "../components/Core/AppIcon";
import {
  GeofenceOptions,
  GeofenceOptionsRef,
} from "../components/Geofences/GeofenceOptions";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "geofences">;

const GeofencesScreen = ({ navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();

  const geofenceOptions = useRef<GeofenceOptionsRef>(null);

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

  const handleOptionsPress = useCallback((geofence: Geofence) => {
    geofenceOptions.current?.open(geofence);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={theme.drawerHeaderRight}
          onPress={() => {
            navigation.navigate("manage-geofence");
          }}
        >
          <AppIcon
            name={"plus-circle"}
            size={iconSize("md")}
            color={colors.primary}
          />
        </Pressable>
      ),
    });
  }, []);

  return (
    <View style={theme.container}>
      <GeofencesList
        geofences={geofences}
        contentContainerStyle={theme.contentContainer}
        onRefresh={handleLoad}
        loading={loading}
        onPress={handleEdit}
        onOptionsPress={handleOptionsPress}
      />
      <GeofenceOptions ref={geofenceOptions} navigation={navigation} />
    </View>
  );
};

export default GeofencesScreen;
