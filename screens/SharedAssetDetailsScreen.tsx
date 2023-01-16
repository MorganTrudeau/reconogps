import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useRef } from "react";
import { ScrollView, View } from "react-native";
import AppField from "../components/Core/AppField";
import { useAppSelector } from "../hooks/useAppSelector";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation";
import * as Clipboard from "expo-clipboard";
import { useToast } from "../hooks/useToast";
import EmptyList from "../components/EmptyList";
import { spacing } from "../styles";
import moment from "moment";
import { Constants } from "../utils/constants";
import FooterButton from "../components/FooterButton";
import ExtendSharedAssetExpiryModal from "../components/Modals/ExtendSharedAssetExpiryModal";
import { AppModalRef } from "../components/Core/AppModal";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "shared-asset-details"
>;

const SharedAssetDetailsScreen = ({ navigation, route }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const Toast = useToast();

  const extendExpiryModal = useRef<AppModalRef>(null);

  const sharedAssetCode = route.params.sharedAssetCode;

  const sharedAsset = useAppSelector(
    (state) => state.sharedAssets.mySharedAssets.entities[sharedAssetCode]
  );

  const asset = useAppSelector(
    (state) =>
      sharedAsset &&
      state.assets.staticData.entities &&
      Object.values(state.assets.staticData.entities).find(
        (a) => a?.imei === sharedAsset.IMEI
      )
  );

  const copyCode = async () => {
    if (!sharedAsset) {
      return;
    }
    try {
      await Clipboard.setStringAsync(sharedAsset.Code);
      Toast.show("Share Code Copied");
    } catch (error) {
      console.log(error);
    }
  };

  const extendExpiry = () => {
    extendExpiryModal.current?.open();
  };

  useEffect(() => {
    if (asset) {
      navigation.setOptions({ headerTitle: asset.name });
    }
  }, [asset]);

  const formattedStartDate = useMemo(() => {
    if (!sharedAsset) {
      return "";
    }
    return moment(sharedAsset.CreateTime).format(
      Constants.MOMENT_DATE_TIME_FORMAT
    );
  }, [sharedAsset]);

  const formattedEndDate = useMemo(() => {
    if (!sharedAsset) {
      return "";
    }
    return moment(sharedAsset.EndTime).format(
      Constants.MOMENT_DATE_TIME_FORMAT
    );
  }, [sharedAsset]);

  if (!sharedAsset) {
    return (
      <View style={theme.container}>
        <EmptyList
          message="No shared asset found"
          icon="share-variant"
          theme={theme}
          colors={colors}
          style={{ marginTop: spacing("md") }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={theme.container}
        contentContainerStyle={theme.contentContainer}
      >
        <AppField
          placeholder={"Share Code"}
          value={sharedAsset?.Code || ""}
          endIcon={"content-copy"}
          onPress={copyCode}
        />
        <AppField placeholder={"IMEI"} value={sharedAsset.IMEI || ""} />
        <AppField
          placeholder={"Name"}
          value={asset?.name || sharedAsset.IMEI}
        />
        <AppField placeholder={"Date Shared"} value={formattedStartDate} />
        <AppField placeholder={"Expiry Date"} value={formattedEndDate} />
      </ScrollView>
      <FooterButton
        title={"Extend Expiry Date"}
        icon={"autorenew"}
        onPress={extendExpiry}
      />
      <ExtendSharedAssetExpiryModal
        ref={extendExpiryModal}
        sharedAssetCode={sharedAsset.Code}
      />
    </View>
  );
};

export default SharedAssetDetailsScreen;
