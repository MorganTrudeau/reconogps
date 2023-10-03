import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../hooks/useTheme";
import AddAssetsScreen from "../screens/AddAssetsScreen";
import AssetDetailScreen from "../screens/AssetDetailScreen";
import AssetListScreen from "../screens/AssetListScreen";
import SubscribeAssetsScreen from "../screens/SubscribeAssetsScreen";
import { RootStackParamList, getDefaultStackOptions } from "./utils";
import { NavigationState } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export const AssetStack = ({
  onAddAssets,
  onStateChange,
}: {
  onAddAssets: () => void;
  onStateChange: (state: NavigationState<RootStackParamList>) => void;
}) => {
  const { theme, colors } = useTheme();
  const defaultOptions = getDefaultStackOptions(theme, colors);

  return (
    <Stack.Navigator
      screenOptions={defaultOptions}
      screenListeners={{
        state: (e) => {
          // Do something with the state
          // console.log("state changed", e.data);
          // @ts-ignore
          onStateChange(e?.data?.state);
        },
      }}
    >
      <Stack.Screen
        name="assets"
        options={{ headerShown: false }}
        // @ts-ignore
        component={AssetListScreen}
        initialParams={{ onAddAssets }}
      />
      <Stack.Screen
        name="asset-details"
        options={{ headerShown: false }}
        // @ts-ignore
        component={AssetDetailScreen}
      />
      <Stack.Screen
        name="add-assets"
        options={{ title: "Add Assets" }}
        // @ts-ignore
        component={AddAssetsScreen}
      />
      <Stack.Screen
        name="activate-assets"
        options={{ title: "Activate Assets" }}
        // @ts-ignore
        component={SubscribeAssetsScreen}
      />
    </Stack.Navigator>
  );
};
