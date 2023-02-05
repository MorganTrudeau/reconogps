import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { useUpdated } from "../../hooks/useUpdated";
import { BORDER_RADIUS_SM, spacing } from "../../styles";
import { ThemeProps } from "../../types/styles";
import AppText from "../Core/AppText";

type Props = { active: boolean; title: string } & ThemeProps;

const AnimatedMarkerAnnotation = ({ active, title, colors, theme }: Props) => {
  const activeAnimation = useRef(new Animated.Value(active ? 1 : 0)).current;

  const animateActive = () => {
    Animated.timing(activeAnimation, {
      toValue: 1,
      useNativeDriver: true,
      duration: 200,
    }).start();
  };

  const animatedInactive = () => {
    Animated.timing(activeAnimation, {
      toValue: 0,
      useNativeDriver: true,
      duration: 150,
    }).start();
  };

  useUpdated(active, (isActive) => {
    if (isActive) {
      animateActive();
    } else {
      animatedInactive();
    }
  });

  return (
    <Animated.View
      pointerEvents={"none"}
      style={{
        position: "absolute",
        bottom: 42,
        // zIndex: 10,
        // elevation: 10,
        opacity: activeAnimation,
        alignItems: "center",
        alignSelf: "center",
        transform: [
          {
            scale: activeAnimation,
          },
          {
            translateY: activeAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      }}
    >
      <View
        style={{
          backgroundColor: colors.background,
          bottom: -TAIL_SIZE / 2,
          height: TAIL_SIZE,
          width: TAIL_SIZE,
          position: "absolute",
          transform: [{ rotate: "45deg" }],
        }}
      />
      <View
        style={{
          backgroundColor: colors.background,
          padding: spacing("sm"),
          borderRadius: BORDER_RADIUS_SM,
        }}
      >
        <AppText>{title}</AppText>
      </View>
    </Animated.View>
  );
};

const TAIL_SIZE = 10;

export default AnimatedMarkerAnnotation;
