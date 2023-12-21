import React, { forwardRef, useRef, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AppIconButton from "./AppIconButton";
import { useTheme } from "../../hooks/useTheme";
import { BORDER_RADIUS_MD, spacing } from "../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetProps } from "@gorhom/bottom-sheet";
import { StyleSheet, ViewStyle } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { useCombinedRefs } from "../../hooks/useCombinedRefs";
import { useUpdated } from "../../hooks/useUpdated";

type Props = BottomSheetProps & { closeButtonStyles?: ViewStyle };

export const AppBottomSheet = forwardRef<BottomSheet, Props>(
  function AppBottomSheet({ onChange, ...rest }, ref) {
    const { theme, colors } = useTheme();
    const insets = useSafeAreaInsets();

    const innerRef = useRef<BottomSheet>(null);

    const combinedRef = useCombinedRefs(innerRef, ref);

    const handleOpenModal = () => {
      innerRef.current?.snapToIndex(0);
    };

    const closed = useRef(false);

    const handleIndexChange = (_index: number) => {
      if (onChange) {
        onChange(_index);
      }
      if (_index < 0) {
        closed.current = true;
        closeSharedValue.value = withTiming(1);
      } else if (closed.current) {
        closed.current = false;
        closeSharedValue.value = withTiming(0);
      }
    };

    const closeSharedValue = useSharedValue(0);
    const closeButtonStyles = useAnimatedStyle(() => ({
      opacity: closeSharedValue.value,
      transform: [{ scale: closeSharedValue.value }],
    }));

    return (
      <>
        <Animated.View
          style={[
            styles.openButton,
            { bottom: insets.bottom + spacing("lg") },
            closeButtonStyles,
          ]}
        >
          <AppIconButton
            onPress={handleOpenModal}
            name={"chevron-up"}
            {...{ theme, colors }}
          />
        </Animated.View>

        <BottomSheet
          enablePanDownToClose
          onChange={handleIndexChange}
          backgroundStyle={{ backgroundColor: colors.background }}
          style={{
            backgroundColor: colors.background,
            borderTopRightRadius: BORDER_RADIUS_MD,
            borderTopLeftRadius: BORDER_RADIUS_MD,
          }}
          handleIndicatorStyle={{ backgroundColor: colors.white }}
          {...rest}
          ref={combinedRef}
        />
      </>
    );
  }
);

const styles = StyleSheet.create({
  openButton: {
    position: "absolute",
    right: spacing("lg"),
    bottom: spacing("lg"),
  },
});
