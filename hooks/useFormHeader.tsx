import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import { FormContextType } from "../context/FormContext";
import { NavigationProp } from "../types/navigation";
import { useTheme } from "./useTheme";
import AppIcon from "../components/Core/AppIcon";
import React, { useCallback } from "react";
import { Colors } from "../types/styles";
import { iconSize } from "../styles";

export const useFormHeader = (
  navigation: NavigationProp,
  style?: StyleProp<ViewStyle>
) => {
  const { colors } = useTheme();

  const setSaveButton: FormContextType["setSaveButton"] = useCallback(
    (formId, onSave, loading) => {
      navigation.setOptions({
        headerRight: () =>
          loading ? (
            <Loading colors={colors} style={style} />
          ) : (
            <Save onPress={onSave} colors={colors} style={style} />
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
    colors,
    style,
  }: {
    onPress: (() => void) | undefined;
    colors: Colors;
    style?: StyleProp<ViewStyle>;
  }) => {
    const color = !onPress ? colors.empty : colors.primary;

    return (
      <Pressable style={style} onPress={onPress} hitSlop={15}>
        <AppIcon color={color} name={"check-circle"} size={iconSize("md")} />
      </Pressable>
    );
  }
);

const Loading = React.memo(
  ({ colors, style }: { colors: Colors; style?: StyleProp<ViewStyle> }) => {
    return <ActivityIndicator color={colors.primary} style={style} />;
  }
);
