import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppScrollView from "../components/Core/AppScrollView";
import { useAppSelector } from "../hooks/useAppSelector";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation/utils";
import { spacing } from "../styles";
import { AssetAlarms } from "../components/Assets/AssetAlarms";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "manage-asset-alarms"
>;

const ManageAssetAlarmsScreen = ({ navigation, route }: NavigationProps) => {
  const imeis =
    route.params.imeis && typeof route.params.imeis === "string"
      ? route.params.imeis.split(",")
      : [];

  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const { asset } = useAppSelector((state) => {
    const activeUser = state.activeUser.data;

    return {
      asset: Object.values(state.assets.staticData.entities).find(
        (a) => a?.imei === imeis[0]
      ),
      activeUserContact: activeUser
        ? Object.values(state.contacts.data.entities).find(
            (c) => c?.EMail === activeUser.Email
          )
        : null,
    };
  });

  useEffect(() => {
    if (imeis.length === 1 && asset) {
      navigation.setOptions({ headerTitle: asset.name });
    }
  }, []);

  return (
    <AppScrollView
      style={theme.container}
      contentContainerStyle={{ paddingBottom: spacing("md") + insets.bottom }}
    >
      <AssetAlarms imeis={imeis} />
    </AppScrollView>
  );
};

const styles = StyleSheet.create({
  optionsList: { marginTop: spacing("lg") },
  section: { paddingTop: spacing("xl"), paddingHorizontal: spacing("lg") },
  ignoreBetweenSelect: { paddingHorizontal: spacing("lg") },
});

export default ManageAssetAlarmsScreen;
