import React, { useMemo, useRef, useState } from "react";
import { Modalize } from "react-native-modalize";
import AssetSelectModal from "../../components/Assets/AssetSelectModal";
import AppField from "../../components/Core/AppField";
import AppScrollView from "../../components/Core/AppScrollView";
import AppTextInput from "../../components/Core/AppTextInput";
import { useAlert } from "../../hooks/useAlert";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { startSharingAsset } from "../../redux/thunks/sharedAssets";
import { SharedAsset, StaticAsset } from "../../types";
import { validateNumber } from "../../utils";
import { useForm } from "../../hooks/useForm";
import { Theme } from "../../types/styles";

const ShareAssetForm = ({
  mySharedAssets,
  theme,
}: {
  mySharedAssets: SharedAsset[];
  theme: Theme;
}) => {
  const Alert = useAlert();

  const dispatch = useAppDispatch();

  const sharedAssetImeis = useMemo(() => {
    return mySharedAssets.map((a) => a.IMEI);
  }, [mySharedAssets]);

  const selectAssetModal = useRef<Modalize>(null);

  const [selectedAsset, setSelectedAsset] = useState<StaticAsset | null>(null);
  const [dayCount, setDayCount] = useState("30");

  const handleShareAsset = async () => {
    const trimmedDays = dayCount.trim();

    if (!trimmedDays || isNaN(Number(trimmedDays))) {
      return Alert.alert(
        "Invalid Days",
        "Please enter a number of days to share"
      );
    }

    if (!selectedAsset) {
      return Alert.alert("Asset Missing", "Please select an asset to share");
    }

    await dispatch(
      startSharingAsset({ imei: selectedAsset.imei, days: trimmedDays })
    ).unwrap();
  };

  useForm("share-asset", !!(selectedAsset && dayCount), handleShareAsset);

  return (
    <AppScrollView
      style={theme.container}
      contentContainerStyle={theme.contentContainer}
    >
      <AppField
        value={selectedAsset?.name || ""}
        placeholder={"Asset"}
        onPress={() => selectAssetModal.current?.open()}
      />
      <AppTextInput
        value={dayCount}
        onChangeText={setDayCount}
        placeholder={"Number of days to share"}
        keyboardType={"number-pad"}
        validation={validateNumber}
      />
      <AssetSelectModal
        ref={selectAssetModal}
        onSelect={(assets) => {
          setSelectedAsset(assets[0]);
          selectAssetModal.current?.close();
        }}
        singleSelect={true}
        blacklistedImeis={sharedAssetImeis}
      />
    </AppScrollView>
  );
};

export default ShareAssetForm;
