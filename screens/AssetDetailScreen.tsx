import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import {
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabBarProps,
  TabView,
} from "react-native-tab-view";
import AssetItem from "../components/Assets/AssetItem";
import { useAppSelector } from "../hooks/useAppSelector";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation/utils";
import { AssetDetail } from "../components/Assets/AssetDetail";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AssetAlarms } from "../components/Assets/AssetAlarms";
import { AssetPlayback } from "../components/Assets/AssetPlayback";
import { StaticAsset } from "../types";
import { spacing } from "../styles";

export const AssetDetailContext = React.createContext<{
  setActionButton: React.Dispatch<React.SetStateAction<React.FC<any>>>;
}>({ setActionButton: () => {} });

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "asset-details"
>;

const AssetDetailScreen = ({ route, navigation }: NavigationProps) => {
  const { assetId } = route.params;

  const { theme, colors } = useTheme();
  const layout = useWindowDimensions();

  const { staticAsset, dynamicAsset } = useAppSelector((state) => ({
    staticAsset: state.assets.staticData.entities[assetId],
    dynamicAsset: state.assets.dynamicData.entities[assetId],
  }));

  const [index, setIndex] = React.useState(0);
  const routes = useMemo(() => {
    const _routes = [
      {
        key: "status",
        title: "Status",
        navigation,
        asset: staticAsset,
      },
      {
        key: "alarm",
        title: "Alarms",
        navigation,
        asset: staticAsset,
      },
      {
        key: "geofence",
        title: "Geofence",
        navigation,
        asset: staticAsset,
      },
    ];

    if (staticAsset?.solutionType === "Track") {
      _routes.splice(2, 0, {
        key: "playback",
        title: "Playback",
        navigation,
        asset: staticAsset,
      });
    }

    return _routes;
  }, [staticAsset]);

  const renderTabBar = useCallback(
    (props: TabBarProps<any>) => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: colors.primary }}
        style={{ backgroundColor: colors.background }}
        labelStyle={{ textTransform: undefined }}
      />
    ),
    [colors]
  );

  const [ActionButton, setActionButton] = useState<React.FC<any>>(
    () => () => null
  );

  return (
    <AssetDetailContext.Provider value={{ setActionButton }}>
      <View style={theme.container}>
        <View style={theme.row}>
          {staticAsset && (
            <AssetItem
              asset={staticAsset}
              {...{ theme, colors }}
              showDetails={false}
              style={{ flex: 1 }}
            />
          )}
          <ActionButton />
        </View>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
    </AssetDetailContext.Provider>
  );
};

type SceneProps = SceneRendererProps & {
  route: {
    key: "status" | "alarm" | "playback" | "geofence";
    title: string;
    navigation: NativeStackNavigationProp<
      RootStackParamList,
      "asset-details",
      undefined
    >;
    asset: StaticAsset;
  };
};

const DummyRoute = (props: SceneProps) => {
  const insets = useSafeAreaInsets();

  switch (props.route.key) {
    case "status":
      return (
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: insets.bottom + spacing("md"),
          }}
        >
          <AssetDetail assetId={props.route.asset.id} />
        </BottomSheetScrollView>
      );
    case "alarm":
      return (
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: insets.bottom + spacing("md"),
          }}
        >
          <AssetAlarms
            imeis={[props.route.asset.imei]}
            loadSettingsForImei={props.route.asset.imei}
          />
        </BottomSheetScrollView>
      );
    case "playback":
      return (
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: insets.bottom + spacing("md"),
          }}
        >
          <AssetPlayback
            assetId={props.route.asset.id}
            navigation={props.route.navigation}
          />
        </BottomSheetScrollView>
      );
    default:
      return null;
  }
};

const renderScene = SceneMap({
  status: DummyRoute,
  alarm: DummyRoute,
  playback: DummyRoute,
  geofence: DummyRoute,
});

export default AssetDetailScreen;
