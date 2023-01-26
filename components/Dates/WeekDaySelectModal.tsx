import React, { forwardRef } from "react";
import { Modalize } from "react-native-modalize";
import SelectModal, { Props as SelectModalProps } from "../Modals/SelectModal";

const weekDays = [
  { id: "0", name: "Sunday" },
  { id: "1", name: "Monday" },
  { id: "2", name: "Tuesday" },
  { id: "3", name: "Wednesday" },
  { id: "4", name: "Thursday" },
  { id: "5", name: "Friday" },
  { id: "6", name: "Saturday" },
];

type Props = Omit<SelectModalProps, "data">;

const WeekDaySelectModal = forwardRef<Modalize, Props>((props, ref) => {
  return (
    <SelectModal
      ref={ref}
      data={weekDays}
      modalTitle={"Selected Weekdays"}
      {...props}
    />
  );
});

export default WeekDaySelectModal;
