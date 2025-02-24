import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppScrollView from "../Core/AppScrollView";
import { AssetAvatarUpload } from "../Assets/AssetAvatarUpload";
import AssetAvatar from "../Assets/AssetAvatar";
import { colors, spacing } from "../../styles";
import AppTextInput from "../Core/AppTextInput";
import SelectModal from "../Modals/SelectModal";
import { Modalize } from "react-native-modalize";
import AppField from "../Core/AppField";
import { Contact, SpeedUnit, StaticAsset } from "../../types";
import { useToast } from "../../hooks/useToast";
import { useForm } from "../../hooks/useForm";
import { editAsset } from "../../redux/thunks/assets";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFormDataChanged } from "../../hooks/useFormDataChanged";
import SpeedUnitSelectModal from "../Modals/SpeedUnitSelectModal";
import AppText from "../Core/AppText";
import { ContactSelectField } from "../Contacts/ContactSelectField";
import { loadContacts } from "../../redux/thunks/contacts";
import { Theme } from "../../types/styles";
import AppSwitchField from "../Core/AppSwitchField";

const EditAsset = ({
  asset,
  assetTypes,
  theme,
}: {
  asset: StaticAsset;
  assetTypes: string[];
  theme: Theme;
}) => {
  const Toast = useToast();
  const Insets = useSafeAreaInsets();

  const dispatch = useAppDispatch();

  const assetSelect = useRef<Modalize>(null);

  useEffect(() => {
    dispatch(loadContacts());
  }, []);

  const [assetData, setAssetData] = useState({
    ...asset,
  });

  const { dataChanged, clearChanges } = useFormDataChanged(assetData);

  const handleSave = async () => {
    // if (assetImg.length && assetImg.data("name")) {
    //   params.icon = assetImg.data("name");
    // };
    await dispatch(editAsset(assetData)).unwrap();
    clearChanges();
    Toast.show("Asset updated");
  };

  const handleError = () => {
    Toast.show("Something went wrong. Please try again.");
  };

  useForm("edit-asset", dataChanged, handleSave, handleError);

  const assetTypesSelectData = useMemo(
    () => (assetTypes || []).map((name) => ({ id: name, name })),
    [assetTypes]
  );

  const handleSelectAssetType = useCallback(
    (types: { id: string; name: string }[]) => {
      assetSelect.current?.close();
      setAssetData((d) => ({
        ...d,
        assetType: types[0] ? types[0].id : d.assetType,
      }));
    },
    []
  );

  const handleSelectSpeedUnit = useCallback(
    (data: { id: SpeedUnit; name: string }[]) => {
      setAssetData((d) => ({
        ...d,
        speedUnit: data[0] ? data[0].id : d.speedUnit,
      }));
    },
    []
  );

  const handleSelectContact = useCallback((data: Contact[]) => {
    setAssetData((d) => ({
      ...d,
      driverCode: data[0] ? data[0].Code : d.driverCode,
    }));
  }, []);

  const handleToggleSpeedAlerts = useCallback(() => {
    setAssetData((d) => ({
      ...d,
      roadSpeed: d.roadSpeed === "True" ? "False" : "True",
    }));
  }, []);

  const dataToggleUpdates = useMemo(
    () =>
      (["onStaticDrift", "onWifi", "roadSpeed"] as const).reduce(
        (acc, key) => ({
          ...acc,
          [key]: () =>
            setAssetData((s) => ({
              ...s,
              [key]: s[key] === "True" ? "False" : "True",
            })),
        }),
        {} as {
          [Property in keyof Pick<
            StaticAsset,
            "onStaticDrift" | "onWifi" | "roadSpeed"
          >]: () => void;
        }
      ),
    []
  );

  const dataTextUpdaters = useMemo(
    () =>
      (
        [
          "name",
          "registration",
          "make",
          "model",
          "color",
          "year",
          "maxSpeed",
          "initialMileage",
          "initialAccHours",
        ] as const
      ).reduce(
        (acc, key) => ({
          ...acc,
          [key]: (val: string) => {
            setAssetData((s) => ({ ...s, [key]: val }));
          },
        }),
        {} as {
          [Property in keyof Pick<
            StaticAsset,
            | "name"
            | "registration"
            | "make"
            | "model"
            | "color"
            | "year"
            | "maxSpeed"
            | "initialMileage"
            | "initialAccHours"
          >]: (val: string) => void;
        }
      ),
    []
  );

  const renderSectionTitle = useCallback((title: string) => {
    return (
      <AppText style={[theme.title, { marginTop: spacing("xl") }]}>
        {title}
      </AppText>
    );
  }, []);

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

      {renderSectionTitle("Device Information")}
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

      {renderSectionTitle("Asset Details")}
      <AppTextInput
        placeholder="Name"
        value={assetData.name}
        onChangeText={dataTextUpdaters.name}
      />
      <AppTextInput
        placeholder="Registration"
        value={assetData.registration}
        onChangeText={dataTextUpdaters.registration}
      />
      <AppTextInput
        placeholder="Make"
        value={assetData.make}
        onChangeText={dataTextUpdaters.make}
      />
      <AppTextInput
        placeholder="Model"
        value={assetData.model}
        onChangeText={dataTextUpdaters.model}
      />
      <AppTextInput
        placeholder="Color"
        value={assetData.color}
        onChangeText={dataTextUpdaters.color}
      />
      <AppTextInput
        placeholder="Year"
        value={assetData.year}
        onChangeText={dataTextUpdaters.year}
      />
      <AppTextInput
        placeholder="Initial Mileage"
        value={String(assetData.initialMileage)}
        onChangeText={dataTextUpdaters.initialMileage}
      />
      <AppTextInput
        placeholder="Initial runtime"
        value={String(assetData.initialAccHours)}
        onChangeText={dataTextUpdaters.initialAccHours}
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
        initialSelectedIds={asset.assetType}
      />

      {renderSectionTitle("Monitoring")}
      <SpeedUnitSelectModal
        value={assetData.speedUnit}
        modalTitle="Speed unit"
        onSelect={handleSelectSpeedUnit}
        singleSelect
        initialSelectedIds={asset.speedUnit}
      />
      <AppTextInput
        placeholder="Speed limit threshold"
        value={String(assetData.maxSpeed)}
        onChangeText={dataTextUpdaters.maxSpeed}
      />
      <AppSwitchField
        title="Road Speed Alerts"
        onPress={dataToggleUpdates.roadSpeed}
        value={assetData.roadSpeed === "True"}
        colors={colors}
      />
      <AppSwitchField
        title="Static Movement Detection"
        onPress={dataToggleUpdates.onStaticDrift}
        value={assetData.onStaticDrift === "True"}
        colors={colors}
      />
      <AppSwitchField
        title="Enhanced Positioning (LBS/WIFI)"
        onPress={dataToggleUpdates.onWifi}
        value={assetData.onWifi === "True"}
        colors={colors}
      />

      {renderSectionTitle("Access")}
      <ContactSelectField
        onSelect={handleSelectContact}
        customerCodes={[assetData.driverCode]}
        title="Driver"
        singleSelect
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
