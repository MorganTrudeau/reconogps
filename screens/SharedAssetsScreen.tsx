import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation/utils";
import {
  TabView,
  SceneMap,
  TabBar,
  TabBarProps,
  SceneRendererProps,
  NavigationState,
} from "react-native-tab-view";
import { iconSize, spacing } from "../styles";
import AppText from "../components/Core/AppText";
import {
  loadMySharedAssets,
  loadSubscribedAssets,
} from "../redux/thunks/sharedAssets";
import { useAppSelector } from "../hooks/useAppSelector";
import SharedAssetsList from "../components/Assets/SharedAssetsList";
import AppIcon from "../components/Core/AppIcon";
import {
  getMySharedAssets,
  getSubscribedAssets,
} from "../redux/selectors/sharedAssets";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import SubscribeSharedAssetModal from "../components/Modals/SubscribeSharedAssetModal";
import { Modalize } from "react-native-modalize";
import { NavigationProp } from "../types/navigation";

type TabRouteProps = { key: string; title: string; navigation: NavigationProp };

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "shared-assets"
>;

const SharedAssetsScreen = ({ navigation }: NavigationProps) => {
  const subscribeAssetModal = useRef<Modalize>(null);

  const { theme, colors } = useTheme();

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "My Assets", navigation },
    { key: "second", title: "Subscribed", navigation },
  ]);

  const renderTabBar = (props: TabBarProps<any>) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ backgroundColor: colors.background }}
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={theme.drawerHeaderRight}
          onPress={() => {
            if (index === 0) {
              const route = index === 0 ? "share-new-asset" : "subscribe-asset";
              navigation.navigate(route);
            } else {
              subscribeAssetModal.current?.open();
            }
          }}
        >
          <AppIcon
            name={"plus-circle"}
            color={colors.primary}
            size={iconSize("md")}
          />
        </Pressable>
      ),
    });
  }, [index]);

  return (
    <View style={theme.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
      <SubscribeSharedAssetModal ref={subscribeAssetModal} />
    </View>
  );
};

const selectMySharedAssetsLoading = (state: RootState) =>
  state.sharedAssets.loadMySharedAssetsRequest.loading;
const FirstRoute = (props: SceneRendererProps & { route: TabRouteProps }) => {
  return (
    <SharedAssetTab
      loadSharedAssetsThunk={loadMySharedAssets}
      sharedAssetsSelector={getMySharedAssets}
      sharedAssetsLoadingSelector={selectMySharedAssetsLoading}
      context={"shared"}
      navigation={props.route.navigation}
    />
  );
};

const selectSubscribedAssetsLoading = (state: RootState) =>
  state.sharedAssets.loadMySharedAssetsRequest.loading;
const SecondRoute = (props: SceneRendererProps & { route: TabRouteProps }) => {
  return (
    <SharedAssetTab
      loadSharedAssetsThunk={loadSubscribedAssets}
      sharedAssetsSelector={getSubscribedAssets}
      sharedAssetsLoadingSelector={selectSubscribedAssetsLoading}
      context={"subscribed"}
      navigation={props.route.navigation}
    />
  );
};

const SharedAssetTab = ({
  loadSharedAssetsThunk,
  sharedAssetsSelector,
  sharedAssetsLoadingSelector,
  context,
  navigation,
}: {
  loadSharedAssetsThunk:
    | typeof loadMySharedAssets
    | typeof loadSubscribedAssets;
  sharedAssetsSelector: typeof getMySharedAssets | typeof getSubscribedAssets;
  sharedAssetsLoadingSelector: (state: RootState) => boolean;
  context: "shared" | "subscribed";
  navigation: NavigationProp;
}) => {
  const { theme, colors } = useTheme();

  const { sharedAssets, loading } = useAppSelector((state) => ({
    majorToken: state.auth.majorToken,
    minorToken: state.auth.minorToken,
    sharedAssets: sharedAssetsSelector(state),
    loading: sharedAssetsLoadingSelector(state),
  }));
  const dispatch = useAppDispatch();

  const loadData = async () => {
    dispatch(loadSharedAssetsThunk());
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={[theme.container, theme.contentContainer]}>
      <AppText style={[theme.textMeta, styles.infoMessage]}>
        These are assets shared by you
      </AppText>

      <SharedAssetsList
        sharedAssets={sharedAssets}
        onRefresh={loadData}
        loading={loading}
        theme={theme}
        colors={colors}
        context={context}
        navigation={navigation}
      />
    </View>
  );
};

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const styles = StyleSheet.create({
  searchInput: { marginBottom: spacing("sm") },
  infoMessage: { textAlign: "center", marginVertical: spacing("md") },
});

export default SharedAssetsScreen;
