import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation/utils";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  deleteGeofence,
  loadGeofences,
  toggleGeofenceActive,
} from "../redux/thunks/geofences";
import { GeofencesList } from "../components/Geofences/GeofencesList";
import { useAppSelector } from "../hooks/useAppSelector";
import { getGeofences } from "../redux/selectors/geofences";
import { Geofence } from "../types";
import { iconSize } from "../styles";
import AppIcon from "../components/Core/AppIcon";
import { useAlert } from "../hooks/useAlert";
import { AppModalRef } from "../components/Core/AppModal";
import OptionsModal, {
  OptionModalItem,
} from "../components/Modals/OptionsModal";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "geofences">;

const GeofencesScreen = ({ navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const Alert = useAlert();

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

  const handleToggleActive = useCallback((geofence: Geofence) => {
    dispatch(toggleGeofenceActive(geofence));
  }, []);

  const handleDelete = useCallback(async (geofence: Geofence) => {
    const shouldDelete = await new Promise((resolve) =>
      Alert.alert(
        "Delete Geofence",
        "Are you sure you want to delete this geofence? This cannot be undone.",
        [
          { text: "No", onPress: () => resolve(false) },
          { text: "Yes", onPress: () => resolve(true) },
        ]
      )
    );
    if (!shouldDelete) {
      return;
    }
    dispatch(deleteGeofence({ code: geofence.Code }));
  }, []);

  const optionsModal = useRef<AppModalRef>(null);

  const [geofenceForOptions, setGeofenceForOptions] = useState<Geofence>();

  const handleOptionsPress = useCallback((geofence: Geofence) => {
    optionsModal.current?.open();
    setGeofenceForOptions(geofence);
  }, []);

  const handleOptionsClose = useCallback(
    () => setGeofenceForOptions(undefined),
    []
  );

  const options = useMemo(() => {
    const _options: OptionModalItem[] = [];

    _options.push({
      value: "edit",
      onPress: () => geofenceForOptions && handleEdit(geofenceForOptions),
      icon: "note-edit",
      text: "Edit",
      closeOnPress: true,
    });

    _options.push({
      value: "toggle-active",
      onPress: () =>
        geofenceForOptions && handleToggleActive(geofenceForOptions),
      icon: geofenceForOptions?.State === 1 ? "broadcast-off" : "broadcast",
      text: geofenceForOptions?.State === 1 ? "Deactivate" : "Activate",
      closeOnPress: true,
    });

    _options.push({
      value: "delete",
      onPress: () => geofenceForOptions && handleDelete(geofenceForOptions),
      icon: "trash-can",
      text: "Delete",
      closeOnPress: true,
    });

    return _options;
  }, [geofenceForOptions]);

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
      {!!options.length && (
        <OptionsModal
          options={options}
          ref={optionsModal}
          onClosed={handleOptionsClose}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default GeofencesScreen;
