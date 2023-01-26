import React, { forwardRef } from "react";
import { Modalize } from "react-native-modalize";
import { OverviewReportOption } from "../../types";
import { reportOptions } from "../../utils/data";
import SelectModal, { Props as SelectModalProps } from "./SelectModal";

const idSelector = (data: OverviewReportOption) => data.Value;
const nameSelector = (data: OverviewReportOption) => data.Name;

type Props = Omit<SelectModalProps, "data">;

const OverviewReportOptionsModal = forwardRef<Modalize, Props>((props, ref) => {
  return (
    <SelectModal
      ref={ref}
      modalTitle={"Report Options"}
      data={reportOptions}
      idSelector={idSelector}
      nameSelector={nameSelector}
      {...props}
    />
  );
});

export default OverviewReportOptionsModal;
