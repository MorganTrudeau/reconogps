import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { iconSize, spacing } from "../../styles";
import { useUpdated } from "../../hooks/useUpdated";
import { useTheme } from "../../hooks/useTheme";
import AppText from "./AppText";
import AppIcon from "./AppIcon";

export type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  animatedPlaceholder?: boolean;
  onPress?: () => void;
  placeholder?: string;
  value: string;
  loading?: boolean;
};

const AppField = ({
  containerStyle,
  placeholder,
  value,
  onPress,
  animatedPlaceholder = true,
  loading,
}: Props) => {
  const { theme, colors } = useTheme();

  const placeholderAnimation = useRef(
    new Animated.Value(!!value ? 1 : 0)
  ).current;

  useUpdated(value, (val, prevVal) => {
    if (typeof val !== "string" || typeof prevVal !== "string") {
      return;
    }
    const prevLength = prevVal.length;
    const length = val.length;
    if (prevLength === 0 && length > 0) {
      Animated.timing(placeholderAnimation, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else if (prevLength > 0 && length === 0) {
      Animated.timing(placeholderAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  });

  useEffect(() => {
    if (typeof value === "string" && value.length === 1) {
      Animated.timing(placeholderAnimation, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else if (typeof value === "string" && value.length === 0) {
      Animated.timing(placeholderAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [value]);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.container,
        !!placeholder && animatedPlaceholder && { marginTop: spacing("xl") },
        containerStyle,
      ]}
    >
      <View
        style={[
          theme.textInput,
          {
            paddingRight: ICON_SIZE + ICON_RIGHT + spacing("lg"),
          },
        ]}
      >
        <AppText
          numberOfLines={1}
          ellipsizeMode={"tail"}
          style={!value ? { color: colors.textMeta } : undefined}
        >
          {value ? value : placeholder}
        </AppText>
      </View>

      {loading ? (
        <ActivityIndicator
          style={[styles.icon, { right: ICON_RIGHT * 1.5 }]}
          color={colors.primary}
        />
      ) : (
        <AppIcon
          name={"chevron-down"}
          size={ICON_SIZE}
          color={colors.primary}
          style={styles.icon}
        />
      )}

      {!!placeholder && animatedPlaceholder && (
        <Animated.Text
          style={[
            theme.textPrimary,
            styles.placeholder,
            {
              opacity: placeholderAnimation,
              transform: [
                {
                  translateY: placeholderAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [5, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {placeholder}
        </Animated.Text>
      )}
    </Pressable>
  );
};

const ICON_SIZE = iconSize("md");
const ICON_RIGHT = 5;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  placeholder: { position: "absolute", left: spacing("md"), top: -10 },
  icon: { position: "absolute", right: ICON_RIGHT },
});

export default AppField;
