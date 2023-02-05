import { DrawerNavigationOptions } from "@react-navigation/drawer";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Colors, Theme } from "../types/styles";

export const getDefaultStackOptions = (
  theme: Theme,
  colors: Colors
): NativeStackNavigationOptions => {
  return {
    headerTintColor: colors.primary,
    headerTitleStyle: theme.titleLarge,
    headerStyle: theme.header,
    headerBackTitle: "Back",
    headerShadowVisible: false,
  };
};

export const getDefaultDrawerOptions = (
  theme: Theme,
  colors: Colors
): DrawerNavigationOptions => {
  return {
    headerTintColor: colors.primary,
    headerTitleStyle: theme.titleLarge,
    headerTitle: "",
    headerStyle: theme.header,
    headerShadowVisible: false,
    drawerStyle: { backgroundColor: colors.background },
    drawerActiveBackgroundColor: colors.primary,
    drawerActiveTintColor: colors.black,
    drawerInactiveTintColor: colors.text,
  };
};
