import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import AppScrollView from "../Core/AppScrollView";
import { AssetAvatarUpload } from "../Assets/AssetAvatarUpload";
import AssetAvatar from "../Assets/AssetAvatar";
import { colors, spacing } from "../../styles";
import AppTextInput from "../Core/AppTextInput";
import SelectModal from "../Modals/SelectModal";
import { Modalize } from "react-native-modalize";
import AppField from "../Core/AppField";
import { StaticAsset } from "../../types";
import { useToast } from "../../hooks/useToast";
import { useForm } from "../../hooks/useForm";
import { editAsset } from "../../redux/thunks/assets";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EditAsset = ({
  asset,
  assetTypes,
}: {
  asset: StaticAsset;
  assetTypes: string[];
}) => {
  const Toast = useToast();
  const Insets = useSafeAreaInsets();

  const dispatch = useAppDispatch();

  const assetSelect = useRef<Modalize>(null);

  const [assetData, setAssetData] = useState({
    ...asset,
  });

  const handleSave = async () => {
    // if (assetImg.length && assetImg.data("name")) {
    //   params.icon = assetImg.data("name");
    // }

    await dispatch(editAsset(assetData));
    Toast.show("Asset updated");
  };

  const handleError = () => {
    Toast.show("Something went wrong. Please try again.");
  };

  useForm("edit-asset", assetData, handleSave, handleError);

  const assetTypesSelectData = useMemo(
    () => (assetTypes || []).map((name) => ({ id: name, name })),
    [assetTypes]
  );

  const handleSelectAssetType = (types: { id: string; name: string }[]) => {
    assetSelect.current?.close();
    setAssetData((d) => ({ ...d, assetType: types[0]?.name || "" }));
  };

  const dataUpdaters = useMemo(
    () =>
      Object.keys(asset).reduce(
        (acc, key) => ({
          ...acc,
          [key]: (val: string) => {
            setAssetData((s) => ({ ...s, [key]: val }));
          },
        }),
        {} as { [Property in keyof StaticAsset]: (val: string) => void }
      ),
    []
  );

  return (
    <AppScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: spacing("lg") + Insets.bottom },
      ]}
    >
      <AssetAvatarUpload
        assetId={asset.id}
        imei={asset.imei}
        style={styles.avatar}
      >
        <AssetAvatar asset={asset} size={100} />
      </AssetAvatarUpload>

      <AppTextInput placeholder="IMEI" value={asset.imei} editable={false} />
      <AppTextInput
        placeholder="Device type"
        value={asset.productName}
        editable={false}
      />
      <AppTextInput
        placeholder="Solution"
        value={asset.solutionType}
        editable={false}
      />

      <View style={styles.spacer} />

      <AppTextInput
        placeholder="Name"
        value={assetData.name}
        onChangeText={dataUpdaters.name}
      />
      <AppTextInput
        placeholder="Registration"
        value={assetData.registration}
        onChangeText={dataUpdaters.registration}
      />
      <AppTextInput
        placeholder="Make"
        value={assetData.make}
        onChangeText={dataUpdaters.make}
      />
      <AppTextInput
        placeholder="Model"
        value={assetData.model}
        onChangeText={dataUpdaters.model}
      />
      <AppTextInput
        placeholder="Color"
        value={assetData.color}
        onChangeText={dataUpdaters.color}
      />
      <AppTextInput
        placeholder="Year"
        value={assetData.year}
        onChangeText={dataUpdaters.year}
      />

      <AppTextInput
        placeholder="Initial Mileage"
        value={String(assetData.initialMileage)}
        onChangeText={dataUpdaters.initialMileage}
      />

      <AppField
        value={assetData.assetType}
        placeholder={"Assset type"}
        onPress={() => assetSelect.current?.open()}
      />

      <SelectModal
        modalTitle="Asset Type"
        ref={assetSelect}
        data={assetTypesSelectData}
        onSelect={handleSelectAssetType}
        singleSelect
        initialSelectedIds={[assetData.assetType]}
      />
    </AppScrollView>
  );
};

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: spacing("lg") },
  avatar: { alignSelf: "center" },
  avatarText: { alignSelf: "center" },
  spacer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginTop: spacing("xl"),
    marginBottom: spacing("sm"),
  },
});

export default EditAsset;
