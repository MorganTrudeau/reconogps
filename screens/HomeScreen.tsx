import React from "react";
import { RootStackParamList } from "../navigation";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import AssetsList from "../components/Assets/AssetsList";
import { spacing } from "../styles";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "home">;

const HomeScreen = ({ navigation }: NavigationProps) => {
  const { theme } = useTheme();

  return (
    <View style={theme.container}>
      <AssetsList contentContainerStyle={styles.list} />
    </View>
  );
};

const styles = StyleSheet.create({ list: { paddingTop: spacing("md") } });

export default HomeScreen;
