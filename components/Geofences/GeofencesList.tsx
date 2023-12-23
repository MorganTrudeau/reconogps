import React, { useCallback } from "react";
import { Geofence } from "../../types";
import { FlatList, FlatListProps, RefreshControl } from "react-native";
import { GeofenceListItem } from "./GeofenceListItem";
import { useNavigation } from "@react-navigation/native";
import EmptyList from "../EmptyList";
import { useTheme } from "../../hooks/useTheme";
import { IconSet } from "../../utils/enums";

type Props = {
  geofences: Geofence[];
  loading: boolean;
  onRefresh: () => void;
  onOptionsPress: (geofence: Geofence) => void;
  onPress: (geofence: Geofence) => void;
} & Omit<FlatListProps<Geofence>, "data" | "renderItem">;

export const GeofencesList = ({
  geofences,
  loading,
  onRefresh,
  onPress,
  onOptionsPress,
  ...rest
}: Props) => {
  const { theme, colors } = useTheme();

  const renderGeofence = useCallback(
    ({ item }: { item: Geofence }) => {
      return (
        <GeofenceListItem
          geofence={item}
          onPress={onPress}
          onOptionsPress={onOptionsPress}
        />
      );
    },
    [onOptionsPress, onPress]
  );

  return (
    <FlatList
      data={geofences}
      renderItem={renderGeofence}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <EmptyList
          theme={theme}
          colors={colors}
          icon={IconSet.geofences}
          message={"No geofences created"}
        />
      }
      {...rest}
    />
  );
};
