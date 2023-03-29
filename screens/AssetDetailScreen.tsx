import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { useWindowDimensions, View } from "react-native";
import { SceneMap, TabBar, TabBarProps, TabView } from "react-native-tab-view";
import AssetItem from "../components/Assets/AssetItem";
import { useAppSelector } from "../hooks/useAppSelector";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation/utils";

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
    { key: "first", title: "Status", navigation },
    { key: "second", title: "Alarm", navigation },
    { key: "third", title: "Playback", navigation },
    { key: "fourth", title: "Track", navigation },
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

const DummyRoute = () => {
  return null;
};

const renderScene = SceneMap({
  first: DummyRoute,
  second: DummyRoute,
  third: DummyRoute,
  fourth: DummyRoute,
});

export default AssetDetailScreen;
