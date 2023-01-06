import React from "react";
import { RootStackParamList } from "../navigation";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import AssetsList from "../components/Assets/AssetsList";
import { useAppSelector } from "../hooks/useAppSelector";
import { spacing } from "../styles";
import { getStaticAssets } from "../redux/selectors/assets";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "home">;

const HomeScreen = ({ navigation }: NavigationProps) => {
  const { theme } = useTheme();

  const { staticAssets } = useAppSelector((state) => ({
    staticAssets: getStaticAssets(state),
  }));

  return (
    <View style={theme.container}>
      <AssetsList assets={staticAssets} contentContainerStyle={styles.list} />
    </View>
  );
};

const styles = StyleSheet.create({ list: { paddingTop: spacing("md") } });

export default HomeScreen;
