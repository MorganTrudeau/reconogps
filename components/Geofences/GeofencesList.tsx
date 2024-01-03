import React, { useCallback, useMemo } from "react";
import { Geofence } from "../../types";
import { FlatList, FlatListProps, RefreshControl } from "react-native";
import { GeofenceListItem } from "./GeofenceListItem";
import EmptyList from "../EmptyList";
import { useTheme } from "../../hooks/useTheme";
import { IconSet } from "../../utils/enums";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

export type Props = {
  geofences: Geofence[];
  loading: boolean;
  onRefresh: () => void;
  onOptionsPress: (geofence: Geofence) => void;
  onPress: (geofence: Geofence) => void;
  ListComponent?: typeof FlatList | typeof BottomSheetFlatList;
} & Omit<FlatListProps<Geofence>, "data" | "renderItem">;

export const GeofencesList = ({
  geofences,
  loading,
  onRefresh,
  onPress,
  onOptionsPress,
  ListComponent,
  ...rest
}: Props) => {
  const { theme, colors } = useTheme();

  const List = useMemo(() => ListComponent || FlatList, [ListComponent]);

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
    <List
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
