import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Modalize } from "react-native-modalize";
import AssetSelectModal from "../components/Assets/AssetSelectModal";
import AppField from "../components/Core/AppField";
import AppTextInput from "../components/Core/AppTextInput";
import { useAlert } from "../hooks/useAlert";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { useHeaderRightSave } from "../hooks/useHeaderRightSave";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation";
import { getMySharedAssets } from "../redux/selectors/sharedAssets";
import { startSharingAsset } from "../redux/thunks/sharedAssets";
import { StaticAsset } from "../types";
import { validateNumber } from "../utils";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "share-new-asset"
>;

const ShareNewAssetScreen = ({ route, navigation }: NavigationProps) => {
  const Alert = useAlert();

  const { mySharedAssets, shareRequest } = useAppSelector((state) => ({
    majorToken: state.auth.majorToken,
    minorToken: state.auth.minorToken,
    mySharedAssets: getMySharedAssets(state),
    shareRequest: state.sharedAssets.startSharingAssetRequest,
  }));
  const dispatch = useAppDispatch();

  const sharedAssetImeis = useMemo(() => {
    return mySharedAssets.map((a) => a.IMEI);
  }, [mySharedAssets]);

  const selectAssetModal = useRef<Modalize>(null);

  const { theme } = useTheme();

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

    dispatch(
      startSharingAsset({ imei: selectedAsset.imei, days: trimmedDays })
    );
  };

  useHeaderRightSave({
    loading: shareRequest.loading,
    onPress: handleShareAsset,
    navigation,
  });

  return (
    <ScrollView
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
    </ScrollView>
  );
};

export default ShareNewAssetScreen;
