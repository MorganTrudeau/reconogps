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
import ProfileScreen from "../screens/ProfileScreen";
import GeofencesScreen from "../screens/GeofencesScreen";
import AlarmSettingsScreen from "../screens/AlarmSettingsScreen";
import SharedAssetsScreen from "../screens/SharedAssetsScreen";
import ReportsScreen from "../screens/ReportsScreen";
import ContactsScreen from "../screens/ContactsScreen";
import UserGuideScreen from "../screens/UserGuideScreen";
import SupportScreen from "../screens/SupportScreen";
import AddContactScreen from "../screens/AddContactScreen";
import { AddContactData, Contact, EditContactData } from "../types";

const Drawer = createDrawerNavigator();

export type RootStackParamList = {
  login: undefined;
  "forgot-password": undefined;
  home: undefined;
  profile: undefined;
  geofences: undefined;
  "alarm-settings": undefined;
  "shared-assets": undefined;
  reports: undefined;
  contacts: undefined;
  "user-guide": undefined;
  support: undefined;
  "manage-contact": undefined | { editContactData: EditContactData };
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
    headerBackTitle: "Back",
    headerShadowVisible: false,
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
    headerShadowVisible: false,
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

const DrawerStack = () => {
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
      <Drawer.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
          drawerLabel: "Profile",
          drawerIcon: (props) => <AppDrawerIcon {...props} icon={"user"} />,
          unmountOnBlur: true,
        }}
        // @ts-ignore
        component={ProfileScreen}
      />
      <Drawer.Screen
        name="geofences"
        options={{
          headerTitle: "Geofences",
          drawerLabel: "Geofences",
          drawerIcon: (props) => <AppDrawerIcon {...props} icon={"maximize"} />,
        }}
        // @ts-ignore
        component={GeofencesScreen}
      />
      <Drawer.Screen
        name="alarm-settings"
        options={{
          headerTitle: "Alarms",
          drawerLabel: "Alarms",
          drawerIcon: (props) => <AppDrawerIcon {...props} icon={"bell"} />,
        }}
        // @ts-ignore
        component={AlarmSettingsScreen}
      />
      <Drawer.Screen
        name="shared-assets"
        options={{
          headerTitle: "Shared Assets",
          drawerLabel: "Shared Assets",
          drawerIcon: (props) => <AppDrawerIcon {...props} icon={"share-2"} />,
        }}
        // @ts-ignore
        component={SharedAssetsScreen}
      />
      <Drawer.Screen
        name="reports"
        options={{
          headerTitle: "Reports",
          drawerLabel: "Reports",
          drawerIcon: (props) => (
            <AppDrawerIcon {...props} icon={"bar-chart-2"} />
          ),
        }}
        // @ts-ignore
        component={ReportsScreen}
      />
      <Drawer.Screen
        name="contacts"
        options={{
          headerTitle: "Contacts",
          drawerLabel: "Contacts",
          drawerIcon: (props) => <AppDrawerIcon {...props} icon={"users"} />,
        }}
        // @ts-ignore
        component={ContactsScreen}
      />
      <Drawer.Screen
        name="user-guide"
        options={{
          headerTitle: "User Guide",
          drawerLabel: "User Guide",
          drawerIcon: (props) => (
            <AppDrawerIcon {...props} icon={"clipboard"} />
          ),
          unmountOnBlur: true,
        }}
        // @ts-ignore
        component={UserGuideScreen}
      />
      <Drawer.Screen
        name="support"
        options={{
          headerTitle: "Support",
          drawerLabel: "Support",
          drawerIcon: (props) => <AppDrawerIcon {...props} icon={"info"} />,
          unmountOnBlur: true,
        }}
        // @ts-ignore
        component={SupportScreen}
      />
    </Drawer.Navigator>
  );
};

const MainStack = () => {
  const { theme, colors } = useTheme();
  const defaultOptions = getDefaultStackOptions(theme, colors);
  return (
    <Stack.Navigator screenOptions={defaultOptions}>
      <Stack.Screen
        name="dashboard"
        options={{ headerShown: false }}
        // @ts-ignore
        component={DrawerStack}
      />
      <Stack.Screen
        name="manage-contact"
        options={{
          title: "Add Contact",
        }}
        // @ts-ignore
        component={AddContactScreen}
      />
    </Stack.Navigator>
  );
};

const NavigationStack = () => {
  const { isLoggedIn } = useAppSelector((state) => ({
    isLoggedIn: state.auth.minorToken,
  }));

  return isLoggedIn ? <MainStack /> : <AuthStack />;
};

export default NavigationStack;
