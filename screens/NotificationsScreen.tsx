import React from "react";
import { View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/utils";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "notifications"
>;

const NotificationsScreen = () => {
  const { theme } = useTheme();

  //   const notifications  = useSelector(
  //     (state: RootState) => state.notifications.data
  //   );

  return <View style={theme.container}></View>;
};

export default NotificationsScreen;
