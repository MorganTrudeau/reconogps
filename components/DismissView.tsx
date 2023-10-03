import React, { useRef, useImperativeHandle, forwardRef } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
} from "react-native";
import { spacing } from "../styles";

export type DismissViewRef = {
  show: () => void;
  dismiss: (callback?: () => void) => void;
};

type Props = {
  children: React.ReactElement | React.ReactElement[];
  onDismiss?: () => void;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
};

const DismissView = (
  { children, onDismiss, opacity, style }: Props,
  ref: React.Ref<DismissViewRef> | undefined
) => {
  const animation = useRef(new Animated.Value(0)).current;
  const animating = useRef(false);

  const show = () => {
    if (animating.current) return;

    animating.current = true;
    setTimeout(
      () =>
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          animating.current = false;
        }),
      1
    );
  };

  const dismiss = (callback?: () => void) => {
    if (animating.current) return;
    animating.current = true;
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      animating.current = false;
      callback && callback();
      onDismiss && onDismiss();
    });
  };

  useImperativeHandle(ref, () => ({ show, dismiss }));

  return (
    <TouchableWithoutFeedback onPress={() => dismiss()}>
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: `rgba(0,0,0,${opacity || 0.3})`,
            opacity: animation,
          },
          style,
        ]}
      >
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing("xl"),
            opacity: animation,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          }}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default forwardRef(DismissView);
