import React, { useEffect } from "react";
import { RootStackParamList } from "../navigation";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import AssetsList from "../components/Assets/AssetsList";
import { spacing } from "../styles";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { loadStaticAssets } from "../redux/thunks/assets";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "home">;

const HomeScreen = ({ navigation }: NavigationProps) => {
  const { theme } = useTheme();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadStaticAssets());
  }, []);

  return (
    <View style={theme.container}>
      <AssetsList contentContainerStyle={styles.list} />
    </View>
  );
};

const styles = StyleSheet.create({ list: { paddingTop: spacing("md") } });

export default HomeScreen;
