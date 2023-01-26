import React, { forwardRef, useMemo } from "react";
import { Modalize } from "react-native-modalize";
import { useAppSelector } from "../../hooks/useAppSelector";
import { getStaticAssets } from "../../redux/selectors/assets";
import SelectModal, { Props as SelectModalProps } from "../Modals/SelectModal";

type Props = {
  blacklistedImeis?: string[];
} & Omit<SelectModalProps, "data">;

const AssetSelectModal = forwardRef<Modalize, Props>(
  ({ blacklistedImeis, ...rest }, ref) => {
    const staticAssets = useAppSelector((state) => getStaticAssets(state));

    const whiteListedAssets = useMemo(() => {
      return blacklistedImeis
        ? staticAssets.filter((a) => !blacklistedImeis.includes(a.imei))
        : staticAssets;
    }, [blacklistedImeis, staticAssets]);

    return (
      <SelectModal
        ref={ref}
        modalTitle={"Selected Assets"}
        data={whiteListedAssets}
        {...rest}
      />
    );
  }
);

export default AssetSelectModal;
