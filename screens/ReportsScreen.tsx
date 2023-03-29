import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useRef } from "react";
import { View } from "react-native";
import NavList, { NavListItem } from "../components/NavList";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation/utils";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "reports">;

const ReportsScreen = ({ navigation }: NavigationProps) => {
  const { theme } = useTheme();

  const handleNavigation =
    (context: "alarms" | "overview" | "stops" | "trips" | "runtime") => () => {
      navigation.navigate("create-report", { context });
    };

  const navItems: NavListItem[] = [
    {
      icon: "bell",
      title: "Alarm Report",
      onPress: handleNavigation("alarms"),
    },
    {
      icon: "file-chart",
      title: "Overview Report",
      onPress: handleNavigation("overview"),
    },
    {
      icon: "car-key",
      title: "Runtime / Ignition Report",
      onPress: handleNavigation("runtime"),
    },
    {
      icon: "hand-back-left",
      title: "Stops Report",
      onPress: handleNavigation("stops"),
    },
    {
      icon: "car-traction-control",
      title: "Trip Report",
      onPress: handleNavigation("trips"),
    },
  ];

  return (
    <View style={theme.container}>
      <NavList items={navItems} />
    </View>
  );
};

export default ReportsScreen;
