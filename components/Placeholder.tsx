import React, { useEffect, useRef } from "react";
import { ViewProps, Animated, StyleSheet, View } from "react-native";

const Placeholder = ({
  children,
  style,
  loading,
  height,
  width,
  ...rest
}: ViewProps & { loading: boolean; height?: number; width?: number }) => {
  const animation = useRef(new Animated.Value(0.05)).current;

  useEffect(() => {
    let animationLoop: Animated.CompositeAnimation;

    if (loading) {
      animationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 0.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0.05,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

      animationLoop.start();
    }

    return () => {
      animationLoop && animationLoop.stop();
    };
  }, [loading]);

  if (!loading) {
    return <View style={style}>{children}</View>;
  }

  return (
    <Animated.View
      style={[styles.placeholder, style, { opacity: animation, height, width }]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: { backgroundColor: "white", borderRadius: 10 },
});

export default Placeholder;
