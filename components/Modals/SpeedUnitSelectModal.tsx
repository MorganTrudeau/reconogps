import React, { forwardRef, useRef } from "react";
import SelectModal, { Props } from "./SelectModal";
import { Modalize } from "react-native-modalize";
import AppField from "../Core/AppField";
import { SpeedUnit } from "../../types";
import { getSpeedUnit } from "../../utils/assets";

const selectItems: { id: SpeedUnit; name: string }[] = [
  { id: "KPH", name: getSpeedUnit("KPH") },
  { id: "MPH", name: getSpeedUnit("MPH") },
  { id: "MPS", name: getSpeedUnit("MPS") },
  { id: "KT", name: getSpeedUnit("KT") },
];

const SpeedUnitSelectModal = (
  props: Omit<Props, "data"> & { value: SpeedUnit }
) => {
  const speedUnitSelect = useRef<Modalize>(null);
  return (
    <>
      <AppField
        value={getSpeedUnit(props.value)}
        placeholder={"Speed unit"}
        onPress={() => speedUnitSelect.current?.open()}
      />
      <SelectModal ref={speedUnitSelect} data={selectItems} {...props} />
    </>
  );
};

export default SpeedUnitSelectModal;
