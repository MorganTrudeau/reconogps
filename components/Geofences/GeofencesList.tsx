import React, { useCallback } from "react";
import { Geofence } from "../../types";
import { FlatList, FlatListProps, RefreshControl } from "react-native";
import { GeofenceListItem } from "./GeofenceListItem";
import { useNavigation } from "@react-navigation/native";

type Props = {
  geofences: Geofence[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (geofence: Geofence) => void;
} & Omit<FlatListProps<Geofence>, "data" | "renderItem">;

export const GeofencesList = ({
  geofences,
  loading,
  onRefresh,
  onEdit,
  ...rest
}: Props) => {
  const navigation = useNavigation();

  const toggleGeofenceActive = useCallback((geofence: Geofence) => {}, []);

  const deleteGeofence = useCallback(async (geofence: Geofence) => {}, []);

  const renderGeofence = useCallback(
    ({ item }: { item: Geofence }) => {
      return (
        <GeofenceListItem
          geofence={item}
          onPress={onEdit}
          onEdit={onEdit}
          onToggleActive={toggleGeofenceActive}
          onDelete={deleteGeofence}
        />
      );
    },
    [onEdit, toggleGeofenceActive, deleteGeofence]
  );

  return (
    <FlatList
      data={geofences}
      renderItem={renderGeofence}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
      {...rest}
    />
  );
};
