import React, { useEffect, useRef } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  Value,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { iconSize } from "../../styles";
import { ThemeProps } from "../../types/styles";
import AppIcon from "./AppIcon";

type Props = {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
} & ThemeProps;

const AppCheckBox = ({ value, onValueChange, style, theme, colors }: Props) => {
  const checkAnimation = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    if (value) {
      checkAnimation.value = withSpring(1);
    } else {
      checkAnimation.value = withTiming(0, { duration: 100 });
    }
  }, [value]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkAnimation.value }],
    };
  });

  return (
    <Pressable
      onPress={onValueChange ? () => onValueChange(!value) : undefined}
      disabled={!onValueChange}
      style={[styles.container, style]}
    >
      <AppIcon
        name={"checkbox-blank-circle-outline"}
        color={colors.empty}
        size={CHECK_ICON_SIZE}
        style={styles.checkIcon}
      />
      <Animated.View style={[styles.checkIcon, animatedStyles]}>
        <AppIcon
          name={"checkbox-marked-circle"}
          color={colors.primary}
          size={CHECK_ICON_SIZE}
        />
      </Animated.View>
    </Pressable>
  );
};

const CHECK_ICON_SIZE = iconSize("md");

const styles = StyleSheet.create({
  container: {
    height: CHECK_ICON_SIZE,
    width: CHECK_ICON_SIZE,
  },
  checkIcon: { position: "absolute" },
});

export default AppCheckBox;
