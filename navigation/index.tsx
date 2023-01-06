import * as React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";

import { useTheme } from "../hooks/useTheme";
import { Colors, Theme } from "../types/styles";
import { useAppSelector } from "../hooks/useAppSelector";
// Screens
import HomeScreen from "../screens/HomeScreen";
import ForgotPasswordScreen from "../screens/ForgotPassword";
import LoginScreen from "../screens/LoginScreen";
import AppDrawerContent from "./AppDrawerContext";
import AppDrawerIcon from "./AppDrawerIcon";

const Drawer = createDrawerNavigator();

export type RootStackParamList = {
  login: undefined;
  "forgot-password": undefined;
  home: undefined;
};

const Stack = createNativeStackNavigator();

const getDefaultStackOptions = (
  theme: Theme,
  colors: Colors
): NativeStackNavigationOptions => {
  return {
    headerTintColor: colors.primary,
    headerTitleStyle: theme.titleLarge,
    headerStyle: theme.header,
  };
};

const getDefaultDrawerOptions = (
  theme: Theme,
  colors: Colors
): DrawerNavigationOptions => {
  return {
    headerTintColor: colors.primary,
    headerTitleStyle: theme.titleLarge,
    headerTitle: "",
    headerStyle: theme.header,
    drawerStyle: { backgroundColor: colors.background },
    drawerActiveBackgroundColor: colors.primary,
    drawerActiveTintColor: colors.black,
    drawerInactiveTintColor: colors.text,
  };
};

const AuthStack = () => {
  const { theme, colors } = useTheme();
  const defaultOptions = getDefaultStackOptions(theme, colors);
  return (
    <Stack.Navigator screenOptions={defaultOptions}>
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
        // @ts-ignore
        component={LoginScreen}
      />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Forgot Password" }}
        // @ts-ignore
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  const { theme, colors } = useTheme();
  const defaultOptions = getDefaultDrawerOptions(theme, colors);
  return (
    <Drawer.Navigator
      screenOptions={defaultOptions}
      initialRouteName="home"
      drawerContent={AppDrawerContent}
    >
      <Drawer.Screen
        name="home"
        options={{
          headerTitle: "Home",
          drawerLabel: "Home",
          drawerIcon: (props) => <AppDrawerIcon {...props} icon={"home"} />,
        }}
        // @ts-ignore
        component={HomeScreen}
      />
    </Drawer.Navigator>
  );
};

const NavigationStack = () => {
  const { isLoggedIn } = useAppSelector((state) => ({
    isLoggedIn: state.auth.minorToken,
  }));

  return isLoggedIn ? <MainStack /> : <AuthStack />;
};

export default NavigationStack;
