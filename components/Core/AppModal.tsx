import { Portal } from "@gorhom/portal";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ModalProps } from "react-native-modal";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useBackHandler } from "../../hooks/useBackHandler";
import { useUpdated } from "../../hooks/useUpdated";
import { spacing } from "../../styles";

export type AppModalRef = { open: () => void; close: () => void };

export type Props = Partial<ModalProps> & { children: ModalProps["children"] };

const AppModal = forwardRef<{ open: () => void; close: () => void }, Props>(
  (
    { children, animationInTiming = 300, animationOutTiming = 300, ...rest },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    useUpdated(visible, (currentVisible, prevVisible) => {
      if (currentVisible && !prevVisible) {
        setContentVisible(true);
      } else if (prevVisible && !visible) {
        setTimeout(() => {
          setContentVisible(false);
        }, animationOutTiming);
      }
    });

    const close = () => setVisible(false);
    const open = () => setVisible(true);

    useImperativeHandle(ref, () => ({
      close,
      open,
    }));

    useBackHandler(() => {
      close();
      return true;
    }, !visible);

    const visibleAnimation = useSharedValue(visible ? 1 : 0);

    useEffect(() => {
      if (visible) {
        visibleAnimation.value = withTiming(1, {
          duration: animationInTiming,
          easing: Easing.out(Easing.cubic),
        });
      } else {
        visibleAnimation.value = withTiming(0, {
          duration: animationOutTiming,
        });
      }
    }, [visible]);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        opacity: visibleAnimation.value,
      };
    });

    return (
      <Portal>
        <Animated.View
          pointerEvents={visible ? "auto" : "none"}
          style={[StyleSheet.absoluteFillObject, animatedStyles]}
        >
          <Pressable
            onPress={close}
            style={[StyleSheet.absoluteFillObject, styles.backdrop]}
          />
          {contentVisible && (
            <View style={styles.content} pointerEvents={"box-none"}>
              {children}
            </View>
          )}
        </Animated.View>
      </Portal>
    );
  }
);

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    padding: spacing("lg"),
    justifyContent: "center",
  },
});

export default AppModal;
