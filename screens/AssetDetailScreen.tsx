import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, { useCallback } from "react";
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
  const [routes] = React.useState([
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
      key: "playback",
      title: "Playback",
      navigation,
      asset: staticAsset,
    },
    {
      key: "geofence",
      title: "Geofence",
      navigation,
      asset: staticAsset,
    },
  ]);

  const renderTabBar = useCallback(
    (props: TabBarProps<any>) => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: colors.primary }}
        style={{ backgroundColor: colors.background }}
        //   tabStyle={{ height: 45 }}
        labelStyle={{ textTransform: undefined }}
      />
    ),
    [colors]
  );

  return (
    <View style={theme.container}>
      {staticAsset && (
        <AssetItem
          asset={staticAsset}
          {...{ theme, colors }}
          showDetails={false}
        />
      )}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </View>
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
          contentContainerStyle={{ paddingBottom: insets.bottom }}
        >
          <AssetDetail assetId={props.route.asset.id} />
        </BottomSheetScrollView>
      );
    case "alarm":
      return (
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom }}
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
          contentContainerStyle={{ paddingBottom: insets.bottom }}
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
