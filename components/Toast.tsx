import React, { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "../styles";

type Props = { text: string; visible: boolean };

const Toast = ({ text, visible }: Props) => {
  const insets = useSafeAreaInsets();

  const visibleAnimation = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    if (visible) {
      visibleAnimation.value = withTiming(1, {
        easing: Easing.out(Easing.circle),
      });
    } else {
      visibleAnimation.value = withTiming(0, {
        easing: Easing.out(Easing.circle),
      });
    }
  }, [visible]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(visibleAnimation.value, [0, 1], [-10, 0]),
        },
      ],
      opacity: visibleAnimation.value,
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: spacing("md"),
          position: "absolute",
          top: insets.top + spacing("lg"),
          alignSelf: "center",
          borderRadius: 5,
        },
        animatedStyles,
      ]}
    >
      <Text style={{ color: "#fff", fontWeight: "600" }}>{text}</Text>
    </Animated.View>
  );
};

export default Toast;
