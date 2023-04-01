import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import AppText from "../components/Core/AppText";
import AppTextInput from "../components/Core/AppTextInput";
import { useHeaderRightSave } from "../hooks/useHeaderRightSave";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";
import { RootStackParamList } from "../navigation/utils";
import { BORDER_RADIUS_SM, iconSize, spacing } from "../styles";
import { Errors } from "../utils/enums";
import { Translations } from "../utils/translations";
import functions from "@react-native-firebase/functions";
import {
  AssetActivationEntry,
  AssetActivationFormData,
  AssetActivationInfo,
} from "../types";
import AddAssetForm from "../components/Assets/AddAssetForm";
import AppScrollView from "../components/Core/AppScrollView";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import AppIcon from "../components/Core/AppIcon";
import { getAssetTypeIcon } from "../utils/assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppButton from "../components/Core/AppButton";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "add-assets">;

const AddAssetsScreen = ({ navigation, route }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const Toast = useToast();
  const insets = useSafeAreaInsets();

  const [assetImei, setAssetImei] = useState("0868450045012661");
  const [loading, setLoading] = useState(false);

  const [activationInfo, setActivationInfo] =
    useState<AssetActivationInfo | null>(null);
  const [formData, setFormData] = useState<AssetActivationFormData | null>(
    null
  );

  const [activationData, setActivationData] = useState<AssetActivationEntry[]>(
    []
  );

  const editFormData = (entry: AssetActivationEntry) => {
    setFormData(entry.formData);
    setActivationInfo(entry.info);
  };

  const startActivation = async () => {
    try {
      setLoading(true);

      const res = await functions().httpsCallable("loadAssetActivationInfo")({
        imei: assetImei,
      });

      console.log(res.data);

      if (res && res.data && res.data.ssp && res.data.asset) {
        setActivationInfo(res.data);
      } else {
        throw Errors.InvalidData;
      }

      setLoading(false);
    } catch (error) {
      console.log("startActivation error: ", error);
      setLoading(false);
      Toast.show(
        //@ts-ignore
        error?.code === "not-found" ? error.message : Translations.errors.common
      );
    }
  };

  const activateAssets = () => {
    navigation.navigate("activate-assets", {
      activationEntries: activationData,
    });
  };

  const handleFormSubmit = (activationData: AssetActivationEntry) => {
    setAssetImei("");
    setActivationData((data) =>
      data.find(
        (data) => data.info.asset.IMEI === activationData.info.asset.IMEI
      )
        ? data.map((d) =>
            d.info.asset.IMEI === activationData.info.asset.IMEI
              ? activationData
              : d
          )
        : [...data, activationData]
    );
    setActivationInfo(null);
  };

  // useHeaderRightSave({
  //   navigation,
  //   onPress: startActivation,
  //   disabled: !assetImei.length,
  //   loading,
  // });

  return (
    <AppScrollView
      style={theme.container}
      contentContainerStyle={[
        theme.contentContainer,
        {
          paddingTop: spacing("md"),
          paddingBottom: insets.bottom + spacing("md"),
        },
      ]}
    >
      {activationInfo ? (
        <AddAssetForm
          activationInfo={activationInfo}
          containerStyle={{ alignSelf: "stretch" }}
          onSubmit={handleFormSubmit}
          initialFormData={formData}
        />
      ) : (
        <>
          <AppText
            style={[
              theme.text,
              { textAlign: "center", marginBottom: spacing("sm") },
            ]}
          >
            Enter the IMEI on your GPS unit to add an asset.
          </AppText>
          <View style={theme.row}>
            <AppTextInput
              placeholder={"IMEI"}
              value={assetImei}
              onChangeText={(imei) => setAssetImei(imei)}
              containerStyle={{ flex: 1 }}
            />
            {loading ? (
              <ActivityIndicator
                color={colors.primary}
                style={styles.imeiSubmitButton}
              />
            ) : (
              <Pressable
                disabled={!assetImei}
                onPress={startActivation}
                style={styles.imeiSubmitButton}
              >
                <AppIcon
                  color={!assetImei ? colors.empty : colors.primary}
                  name={"check-circle"}
                  size={iconSize("md")}
                />
              </Pressable>
            )}
          </View>

          {activationData.length > 0 && (
            <AppText
              style={[
                theme.titleMeta,
                { marginTop: spacing("xl"), marginBottom: spacing("sm") },
              ]}
            >
              Assets Added
            </AppText>
          )}
          {activationData.map((data) => {
            return (
              <Pressable
                style={[
                  styles.activationEntry,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => editFormData(data)}
                key={data.info.asset.IMEI}
              >
                <AppIcon
                  name={getAssetTypeIcon(data.formData.type)}
                  size={iconSize("lg")}
                  color={colors.primary}
                  style={{ marginRight: spacing("lg") }}
                />
                <View style={{ flex: 1 }}>
                  <AppText style={theme.title}>{data.formData.name}</AppText>
                  <AppText
                    style={[theme.textSmallMeta, { marginTop: spacing("xs") }]}
                  >
                    {data.info.ssp.Products[0].Name}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
          {activationData.length > 0 && (
            <AppButton
              onPress={activateAssets}
              title={"Activate Assets"}
              style={{ marginTop: spacing("lg") }}
            />
          )}
        </>
      )}

      {/* {renderInputs()} */}
      {/* <Pressable
        onPress={() => setAssetImeis((imeis) => [...imeis, ""])}
        style={[
          theme.row,
          {
            alignSelf: "flex-start",
            paddingVertical: spacing("md"),
            marginTop: spacing("sm"),
          },
        ]}
      >
        <AppIcon name={"plus"} color={colors.primary} size={iconSize("md")} />
        <AppText style={[theme.title, { marginLeft: spacing("sm") }]}>
          Add another asset
        </AppText>
      </Pressable> */}
    </AppScrollView>
  );
};

const styles = StyleSheet.create({
  imeiSubmitButton: { marginTop: spacing("xl"), marginLeft: spacing("md") },
  activationEntry: {
    flexDirection: "row",
    alignSelf: "center",
    paddingHorizontal: spacing("lg"),
    paddingVertical: spacing("md"),
    borderRadius: BORDER_RADIUS_SM,
    marginBottom: spacing("md"),
  },
});

export default AddAssetsScreen;
