import React, {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { iconSize, spacing } from "../../styles";
import BottomSheet from "@gorhom/bottom-sheet";
import { AssetStack } from "../../navigation/AssetStack";
import { NavigationState, useNavigation } from "@react-navigation/native";
import AppIcon from "../Core/AppIcon";
import { useUpdated } from "../../hooks/useUpdated";
import { RootStackParamList } from "../../navigation/utils";
import AppIconButton from "../Core/AppIconButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationProp } from "../../types/navigation";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Constants } from "../../utils/constants";
import { AppBottomSheet } from "../Core/AppBottomSheet";

const SNAP_POINTS = Constants.BOTTOM_SHEET_SNAP_POINTS.map(
  (num) => `${num * 100}%`
);

const initialIndex = 0;

export type AssetsDisplayModalRef = {
  navigateToAsset: (assetId: string) => void;
  snapToIndex: (index: number) => void;
};

type Props = {
  onAssetSelected?: (assetId: string | null) => void;
  onHeightChange?: (height: number) => void;
  navigation: NavigationProp;
};

const AssetsDisplayModal = forwardRef<AssetsDisplayModalRef, Props>(
  ({ onAssetSelected, onHeightChange }, ref) => {
    const { colors, theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const { height } = useWindowDimensions();

    const index = useRef(initialIndex);

    const bottomSheetRef = useRef<BottomSheet>(null);

    const [navigationState, setNavigationState] =
      useState<NavigationState<RootStackParamList>>();

    const handleNavigationStateChange = (
      navigationState: NavigationState<RootStackParamList>
    ) => {
      if (
        navigationState &&
        typeof navigationState.index === "number" &&
        navigationState.type === "stack"
      ) {
        setNavigationState(navigationState);
      }
    };

    useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => {
        bottomSheetRef.current?.snapToIndex(index);
      },
      navigateToAsset: (assetId: string) => {
        navigation.navigate("asset-details", { assetId });
      },
    }));

    useUpdated(navigationState, (currentState, prevState) => {
      if (!currentState) {
        return;
      }
      const prevIndex = prevState?.index;
      const currentIndex = currentState.index;
      if (currentIndex && currentIndex !== prevIndex && currentIndex > 0) {
        bottomSheetRef.current?.snapToIndex(1);
      }
      const prevRoute =
        !!prevState && !!prevIndex ? prevState.routes[prevIndex] : null;
      const route = currentState.routes[currentIndex];
      if (prevRoute?.name !== route.name) {
        if (onAssetSelected) {
          if (
            route.name === "asset-details" &&
            route.params &&
            "assetId" in route.params &&
            route.params.assetId
          ) {
            onAssetSelected(route.params.assetId);
          } else {
            onAssetSelected(null);
          }
        }
      }
    });

    const handleIndexChange = (_index: number) => {
      if (_index < 0) {
        onHeightChange && onHeightChange(0);
      } else {
        const snapPoint = Constants.BOTTOM_SHEET_SNAP_POINTS[_index];
        const modalHeight = height * snapPoint;
        onHeightChange && onHeightChange(modalHeight);
        index.current = _index;
      }
    };

    const handleHeaderRightPress = () => {
      const nextIndex = index.current - 1;
      if (nextIndex >= 0) {
        bottomSheetRef.current?.snapToIndex(nextIndex);
      } else {
        bottomSheetRef.current?.close();
      }
    };

    const handleAddAssets = () => {
      navigation.navigate("add-assets");
    };

    const renderHeaderRight = useCallback(() => {
      return (
        <Pressable
          hitSlop={10}
          style={styles.headerRightButton}
          onPress={handleHeaderRightPress}
        >
          <AppIcon
            name={"chevron-down"}
            size={iconSize("lg")}
            color={colors.white}
          />
        </Pressable>
      );
    }, []);

    const renderHandle = useCallback(() => {
      return (
        <View style={styles.handle}>
          <HeaderLeft navigationIndex={navigationState?.index || 0} />
          <View style={styles.logoContainer}>
            <MemoizedLogo />
          </View>
          {renderHeaderRight()}
        </View>
      );
    }, [navigationState?.index]);

    return (
      <AppBottomSheet
        ref={bottomSheetRef}
        onChange={handleIndexChange}
        index={initialIndex}
        snapPoints={SNAP_POINTS}
        handleComponent={renderHandle}
      >
        <AssetStack
          onAddAssets={handleAddAssets}
          onStateChange={handleNavigationStateChange}
        />
      </AppBottomSheet>
    );
  }
);

const MemoizedLogo = React.memo(() => {
  return (
    <Image
      source={require("../../assets/recono-logo.png")}
      style={styles.logo}
      resizeMode={"contain"}
    />
  );
});

const HeaderLeft = ({ navigationIndex }: { navigationIndex: number }) => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation();

  if (navigationIndex && navigationIndex > 0) {
    return (
      <Pressable
        style={styles.headerLeftButton}
        onPress={navigation.goBack}
        hitSlop={10}
      >
        <AppIcon
          name={"chevron-left"}
          color={colors.white}
          size={iconSize("lg")}
        />
      </Pressable>
    );
  }
  return <View style={styles.headerLeftButton} />;
};

const BORDER_RADIUS = 15;
const ICON_RATIO = 140 / 800;
const ICON_WIDTH = 70;
const ICON_HEIGHT = ICON_WIDTH * ICON_RATIO;

const styles = StyleSheet.create({
  listContent: { paddingTop: spacing("md") },
  logoContainer: { flex: 3, alignItems: "center" },
  logo: {
    height: ICON_HEIGHT,
    width: ICON_WIDTH,
    marginHorizontal: spacing("lg"),
  },
  handle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing("sm"),
    justifyContent: "space-between",
    height: ICON_HEIGHT + spacing("lg") * 2,
  },
  headerLeftButton: { flex: 1 },
  headerRightButton: { flex: 1, alignItems: "flex-end" },
  openButton: {
    position: "absolute",
    right: spacing("lg"),
    bottom: spacing("lg"),
  },
});

const NavigationContainedAssetDisplayModal = forwardRef<
  AssetsDisplayModalRef,
  Props
>((props, ref) => {
  return <AssetsDisplayModal {...props} ref={ref} />;
});

export default NavigationContainedAssetDisplayModal;
