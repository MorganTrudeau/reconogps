import { DrawerNavigationOptions } from "@react-navigation/drawer";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { AssetActivationEntry, EditContactData } from "../types";
import { Colors, Theme } from "../types/styles";

export type RootStackParamList = {
  login: undefined;
  signup: undefined;
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
  "change-password": undefined;
  "create-report": {
    context: "alarms" | "overview" | "runtime" | "stops" | "trips";
  };
  "share-new-asset": undefined;
  "subscribe-asset": undefined;
  "shared-asset-details": { sharedAssetCode: string };
  "manage-asset-alarms": {
    imeis: string; // comma separated list of asset imeis
  };
  assets: { onAddAssets: () => {} };
  "asset-details": { assetId: string };
  "add-assets": undefined;
  "activate-assets": { activationEntries: AssetActivationEntry[] };
  playback: {
    code: string;
    from: string;
    to: string;
    isIgnore: boolean;
    isOptimized: boolean;
  };
  notifications: undefined;
};

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
