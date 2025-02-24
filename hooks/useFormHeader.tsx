import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
import { FormContextType } from "../context/FormContext";
import { NavigationProp } from "../types/navigation";
import { useTheme } from "./useTheme";
import AppIcon from "../components/Core/AppIcon";
import React, { useCallback } from "react";
import { Colors, Theme } from "../types/styles";
import { iconSize, spacing } from "../styles";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import AppText from "../components/Core/AppText";

export const useFormHeader = (
  navigation: NavigationProp,
  style?: StyleProp<ViewStyle>
) => {
  const { colors, theme } = useTheme();

  const setSaveButton: FormContextType["setSaveButton"] = useCallback(
    (formId, onSave, loading) => {
      navigation.setOptions({
        headerRight: () =>
          loading ? (
            <Loading colors={colors} style={style} />
          ) : (
            <Save
              onPress={onSave}
              theme={theme}
              colors={colors}
              style={style}
            />
          ),
      });
    },
    []
  );

  return { setSaveButton };
};

const Save = React.memo(
  ({
    onPress,
    theme,
    colors,
    style,
  }: {
    onPress: (() => void) | undefined;
    theme: Theme;
    colors: Colors;
    style?: StyleProp<ViewStyle>;
  }) => {
    const color = !onPress ? colors.empty : colors.primary;

    return !onPress ? null : (
      <Animated.View entering={FadeIn}>
        <Pressable style={[theme.row, style]} onPress={onPress} hitSlop={15}>
          <AppText style={{ color, marginRight: spacing("sm") }}>Save</AppText>
          <AppIcon color={color} name={"check-circle"} size={iconSize("md")} />
        </Pressable>
      </Animated.View>
    );
  }
);

const Loading = React.memo(
  ({ colors, style }: { colors: Colors; style?: StyleProp<ViewStyle> }) => {
    return (
      <Animated.View entering={FadeIn}>
        <ActivityIndicator color={colors.primary} style={style} />
      </Animated.View>
    );
  }
);
