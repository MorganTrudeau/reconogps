import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "alarm-settings"
>;

const AlarmSettingsScreen = ({ navigation }: NavigationProps) => {
  const { theme } = useTheme();

  return <View style={theme.container}></View>;
};

export default AlarmSettingsScreen;
