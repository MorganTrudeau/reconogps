import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../hooks/useTheme";
import AssetDetailScreen from "../screens/AssetDetailScreen";
import AssetListScreen from "../screens/AssetListScreen";
import { getDefaultStackOptions } from "./utils";

const Stack = createNativeStackNavigator();

export const AssetStack = () => {
  const { theme, colors } = useTheme();
  const defaultOptions = getDefaultStackOptions(theme, colors);
  return (
    <Stack.Navigator screenOptions={defaultOptions}>
      <Stack.Screen
        name="assets"
        options={{ headerShown: false }}
        // @ts-ignore
        component={AssetListScreen}
      />
      <Stack.Screen
        name="asset-details"
        options={{ headerShown: false }}
        // @ts-ignore
        component={AssetDetailScreen}
      />
    </Stack.Navigator>
  );
};
