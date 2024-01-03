import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { RootStackParamList } from "../../navigation/utils";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  deleteGeofence,
  toggleGeofenceActive,
} from "../../redux/thunks/geofences";
import { Geofence } from "../../types";
import { useAlert } from "../../hooks/useAlert";
import { AppModalRef } from "../Core/AppModal";
import OptionsModal, { OptionModalItem } from "../Modals/OptionsModal";

type NavigationProp = NativeStackScreenProps<
  RootStackParamList,
  any
>["navigation"];
export type GeofenceOptionsRef = {
  open: (geofence: Geofence) => void;
  close: () => void;
};

export const GeofenceOptions = forwardRef<
  GeofenceOptionsRef,
  { navigation: NavigationProp }
>(function GeofenceOptions({ navigation }, ref) {
  const Alert = useAlert();

  const dispatch = useAppDispatch();

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

  const open = useCallback((geofence: Geofence) => {
    optionsModal.current?.open();
    setGeofenceForOptions(geofence);
  }, []);

  const close = useCallback(() => setGeofenceForOptions(undefined), []);

  useImperativeHandle(ref, () => ({ open, close }));

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

  return !!options.length ? (
    <OptionsModal options={options} ref={optionsModal} onClosed={close} />
  ) : null;
});
