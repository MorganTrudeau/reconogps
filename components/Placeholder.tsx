import React, { useEffect, useRef } from "react";
import { ViewProps, Animated, StyleSheet } from "react-native";

const Placeholder = ({
  children,
  style,
  loading,
  ...rest
}: ViewProps & { loading: boolean }) => {
  const animation = useRef(new Animated.Value(0.05)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 0.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0.05,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[styles.placeholder, style, { opacity: animation }]}
      {...rest}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  placeholder: { backgroundColor: "white", borderRadius: 10 },
});

export default Placeholder;
