import * as React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPassword";
import { useTheme } from "../hooks/useTheme";
import { Colors, Theme } from "../types/styles";

export type RootStackParamList = {
  login: undefined;
  "forgot-password": undefined;
};

const Stack = createNativeStackNavigator();

const defaultOptions: NativeStackNavigationOptions = {
  headerStyle: {},
};

const getDefaultOptions = (
  theme: Theme,
  colors: Colors
): NativeStackNavigationOptions => {
  return {
    headerTintColor: colors.primary,
    headerTitleStyle: theme.titleLarge,
    headerStyle: {
      backgroundColor: colors.background,
    },
  };
};

function NavigationStack() {
  const { theme, colors } = useTheme();
  const defaultOptions = getDefaultOptions(theme, colors);
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
}

export default NavigationStack;
