import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
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
import {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AssetAlarms } from "../components/Assets/AssetAlarms";
import { AssetPlayback } from "../components/Assets/AssetPlayback";
import { StaticAsset } from "../types";
import { iconSize, spacing } from "../styles";
import { FormContext } from "../context/FormContext";
import { AssetGeofenceList } from "../components/Assets/AssetGeofenceList";
import AppText from "../components/Core/AppText";
import { ActivityIndicator } from "react-native";
import AppIcon from "../components/Core/AppIcon";
import Animated, { StretchInY } from "react-native-reanimated";
import { Colors, Theme } from "../types/styles";
import AppIconButton from "../components/Core/AppIconButton";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "asset-details"
>;

const AssetDetailScreen = ({ route, navigation }: NavigationProps) => {
  const { assetId } = route.params;

  const { theme, colors } = useTheme();
  const layout = useWindowDimensions();

  const staticAsset = useAppSelector((state) => state.assets.staticData.entities[assetId]);
  const dynamicAsset = useAppSelector((state) => state.assets.dynamicData.entities[assetId]);

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
    (props: TabBarProps<any>) => {
      return (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: colors.primary }}
          style={{ backgroundColor: colors.background }}
          labelStyle={{ textTransform: undefined }}
        />
      );
    },
    [colors]
  );

  const [loadingState, setLoadingState] = useState<{
    [index: string]: boolean;
  }>({});
  const loading = loadingState[routes[index].key];
  const setLoading = (loading: boolean, id: string) => {
    setLoadingState((s) => ({ ...s, [id]: loading }));
  };

  const [saveStates, setSaveStates] = useState<{
    [index: string]: { onSave: (() => void) | undefined; loading: boolean };
  }>({});
  const setSaveButton = (
    id: string,
    onSave: (() => void) | undefined,
    loading: boolean
  ) => {
    setSaveStates((s) => ({ ...s, [id]: { onSave, loading } }));
  };
  const saveState = saveStates[routes[index].key];

  return (
    <FormContext.Provider value={{ setSaveButton }}>
      <View style={theme.container}>
        <View style={theme.row}>
          {staticAsset && (
            <>
              <AssetItem
                asset={staticAsset}
                {...{ theme, colors }}
                showDetails={false}
                style={{ flex: 1 }}
                allowEditing
              />
              <AppIconButton
                name={"pencil"}
                {...{ theme, colors }}
                size={iconSize("md")}
                onPress={() => {
                  navigation.navigate("edit-asset", {
                    id: staticAsset.id,
                  });
                }}
                style={styles.editButton}
              />
            </>
          )}
        </View>

        {!!saveState?.onSave && (
          <SaveButton
            onSave={saveState.onSave}
            loading={saveState.loading}
            theme={theme}
            colors={colors}
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
    </FormContext.Provider>
  );
};

const SaveButton = React.memo(function SaveButton({
  onSave,
  loading,
  theme,
  colors,
}: {
  onSave: () => void;
  loading: boolean;
  theme: Theme;
  colors: Colors;
}) {
  return (
    <Animated.View entering={StretchInY.duration(200)}>
      <AnimatedPressable
        onPress={onSave}
        style={{
          height: 45,
          width: "100%",
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color={"#000000"} />
        ) : (
          <View style={theme.row}>
            <AppIcon
              name="check-circle"
              size={iconSize("sm")}
              style={{ marginRight: spacing("sm") }}
            />
            <AppText style={{ color: "#000000" }}>Save</AppText>
          </View>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
});

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
          <AssetDetail
            assetId={props.route.asset.id}
            navigation={props.route.navigation}
          />
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
    case "geofence":
      return (
        <AssetGeofenceList
          assetId={props.route.asset.id}
          navigation={props.route.navigation}
          ListComponent={BottomSheetFlatList}
          contentContainerStyle={{
            paddingBottom: insets.bottom + spacing("md"),
            paddingHorizontal: spacing("lg"),
          }}
        />
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

const styles = StyleSheet.create({
  editButton: { marginRight: spacing("sm") },
});
