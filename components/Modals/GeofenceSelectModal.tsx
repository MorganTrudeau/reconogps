import React, { forwardRef } from "react";
import { Modalize } from "react-native-modalize";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../hooks/useTheme";
import { getGeofences } from "../../redux/selectors/geofences";
import { Geofence } from "../../types";
import { IconSet } from "../../utils/enums";
import EmptyList from "../EmptyList";
import SelectModal, { Props as SelectModalProps } from "./SelectModal";

const idSelector = (data: Geofence) => data.Code;
const nameSelector = (data: Geofence) => data.Name;

type Props = Omit<SelectModalProps, "data">;

const GeofenceSelectModal = forwardRef<Modalize, Props>((props, ref) => {
  const { theme, colors } = useTheme();

  const geofences = useAppSelector((state) => getGeofences(state));

  return (
    <SelectModal
      ref={ref}
      modalTitle={"Geofences"}
      data={geofences}
      idSelector={idSelector}
      nameSelector={nameSelector}
      ListEmptyComponent={
        <EmptyList
          icon={IconSet.geofences}
          message={"No geofences created"}
          theme={theme}
          colors={colors}
        />
      }
      {...props}
    />
  );
});

export default GeofenceSelectModal;
