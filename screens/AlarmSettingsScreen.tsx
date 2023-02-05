import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AssetSelectList from "../components/Assets/AssetSelectList";
import AppIcon from "../components/Core/AppIcon";
import AppText from "../components/Core/AppText";
import { useHeaderRightSave } from "../hooks/useHeaderRightSave";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../RootStackParamList";
import { iconSize, spacing } from "../styles";
import { StaticAsset } from "../types";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "alarm-settings"
>;

const AlarmSettingsScreen = ({ navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();

  const [selectedAssets, setSelectedAssets] = useState<StaticAsset[]>([]);

  const manageAlarms = () => {
    if (!selectedAssets.length) {
      return;
    }
    navigation.navigate("manage-asset-alarms", {
      imeis: selectedAssets.map((a) => a.imei).join(","),
    });
  };

  useHeaderRightSave({
    navigation,
    onPress: manageAlarms,
    style: theme.drawerHeaderRight,
    disabled: !selectedAssets.length,
  });

  return (
    <View style={theme.container}>
      <View style={styles.messageContainer}>
        <AppText style={theme.textMeta}>
          Select assets to set up alarms.
        </AppText>
      </View>
      <AssetSelectList onSelect={setSelectedAssets} />
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    paddingHorizontal: spacing("lg"),
    paddingTop: spacing("sm"),
    paddingBottom: spacing("sm"),
    alignItems: "center",
  },
});

export default AlarmSettingsScreen;
