import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getGeofences } from "../../redux/selectors/geofences";
import {
  GeofencesList,
  Props as GeofenceListProps,
} from "../Geofences/GeofencesList";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { loadGeofences } from "../../redux/thunks/geofences";
import { RootStackParamList } from "../../navigation/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Geofence } from "../../types";
import {
  GeofenceOptions,
  GeofenceOptionsRef,
} from "../Geofences/GeofenceOptions";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { FlatList } from "react-native";
import EmptyList from "../EmptyList";
import { useTheme } from "../../hooks/useTheme";
import { IconSet } from "../../utils/enums";

type NavigationProp = NativeStackScreenProps<
  RootStackParamList,
  any
>["navigation"];

type Props = {
  assetId: string;
  navigation: NavigationProp;
  ListComponent?: typeof FlatList | typeof BottomSheetFlatList;
} & Partial<GeofenceListProps>;

export const AssetGeofenceList = ({ assetId, navigation, ...rest }: Props) => {
  const { theme, colors } = useTheme();

  const geofenceOptions = useRef<GeofenceOptionsRef>(null);

  const { geofences, loading } = useSelector((state: RootState) => ({
    geofences: getGeofences(state).filter((g) =>
      g.SelectedAssetList.find((a) => a.AsCode === assetId)
    ),
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

  const openOptions = useCallback((geofence: Geofence) => {
    geofenceOptions.current?.open(geofence);
  }, []);

  const renderEmpty = useCallback(() => {
    return (
      <EmptyList
        theme={theme}
        colors={colors}
        icon={IconSet.geofences}
        message={"No geofences for this asset"}
      />
    );
  }, []);

  return (
    <>
      <GeofencesList
        {...rest}
        geofences={geofences}
        loading={loading}
        onRefresh={handleLoad}
        onOptionsPress={openOptions}
        onPress={handleEdit}
        ListEmptyComponent={renderEmpty}
      />
      <GeofenceOptions ref={geofenceOptions} navigation={navigation} />
    </>
  );
};
