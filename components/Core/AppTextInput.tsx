import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { iconSize, spacing } from "../../styles";
import { useUpdated } from "../../hooks/useUpdated";
import { useTheme } from "../../hooks/useTheme";

type Props = { containerStyle?: StyleProp<ViewStyle> } & TextInputProps;

const AppTextInput = forwardRef<TextInput, Props>(
  ({ style, containerStyle, placeholder, value, ...rest }: Props, ref) => {
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

    const [secureTextEntry, setSecureTextEntry] = useState(
      rest.secureTextEntry
    );
    const usingSecureTextEntry = typeof secureTextEntry === "boolean";

    return (
      <View style={[styles.container, containerStyle]}>
        <TextInput
          // @ts-ignore
          ref={ref}
          selectionColor={colors.primary}
          placeholderTextColor={colors.textMeta}
          placeholder={placeholder}
          {...rest}
          secureTextEntry={secureTextEntry}
          style={[
            theme.textInput,
            usingSecureTextEntry && {
              paddingRight: EYE_ICON_SIZE + spacing("lg") * 1.5,
            },
            style,
          ]}
        />
        {usingSecureTextEntry ? (
          <Pressable
            onPress={() => setSecureTextEntry(!secureTextEntry)}
            style={styles.eyeIcon}
          >
            <Feather
              name={secureTextEntry ? "eye-off" : "eye"}
              size={EYE_ICON_SIZE}
              color={colors.primary}
            />
          </Pressable>
        ) : null}

        {!!placeholder && (
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
      </View>
    );
  }
);

const EYE_ICON_SIZE = iconSize("md");

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing("xl"),
  },
  placeholder: { position: "absolute", left: spacing("md"), top: -10 },
  eyeIcon: { position: "absolute", right: spacing("lg") },
});

export default AppTextInput;
