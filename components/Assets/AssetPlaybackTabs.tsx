import React, { useCallback, useMemo } from "react";
import { useWindowDimensions, View } from "react-native";
import {
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabBarProps,
  TabView,
} from "react-native-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { PlaybackEvent, PlaybackPoint, StaticAsset } from "../../types";
import { PlaybackEventList } from "../Playback/PlaybackEventList";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { PlaybackTrips } from "../Playback/PlaybackTrips";

type Props = {
  playbackEvents: PlaybackEvent[];
  playbackPoints: PlaybackPoint[];
  onEventPress: (event: PlaybackEvent) => void;
  from: string;
  to: string;
  assetId: string;
};

export const AssetPlaybackTabs = ({
  playbackEvents,
  playbackPoints,
  onEventPress,
  from,
  to,
  assetId,
}: Props) => {
  const { theme, colors } = useTheme();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const routes = useMemo(
    () => [
      {
        key: "activity",
        title: "Activity",
        playbackEvents,
        playbackPoints,
        onEventPress,
        from,
        to,
        assetId,
      },
      {
        key: "trips",
        title: "Trips",
        playbackEvents,
        playbackPoints,
        onEventPress,
        from,
        to,
        assetId,
      },
      {
        key: "summary",
        title: "Summary",
        playbackEvents,
        playbackPoints,
        onEventPress,
        from,
        to,
        assetId,
      },
    ],
    [playbackEvents, playbackPoints, onEventPress, from, to, assetId]
  );

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
    key: "activity" | "trips" | "summary";
    title: string;
  } & Props;
};

const MasterRoute = (props: SceneProps) => {
  const insets = useSafeAreaInsets();

  switch (props.route.key) {
    case "activity":
      return (
        <PlaybackEventList
          events={props.route.playbackEvents}
          onEventPress={props.route.onEventPress}
        />
      );
    case "trips":
      return (
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom }}
        >
          <PlaybackTrips />
        </BottomSheetScrollView>
      );
    // case "summary":
    //   return (
    //     <BottomSheetScrollView
    //       contentContainerStyle={{ paddingBottom: insets.bottom }}
    //     ></BottomSheetScrollView>
    //   );
    default:
      return null;
  }
};

const renderScene = SceneMap({
  activity: MasterRoute,
  trips: MasterRoute,
  summary: MasterRoute,
});

export default AssetPlaybackTabs;
