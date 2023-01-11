import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Animated,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { iconSize, spacing } from "../../styles";
import { useUpdated } from "../../hooks/useUpdated";
import { useTheme } from "../../hooks/useTheme";
import AppIcon from "./AppIcon";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  animatedPlaceholder?: boolean;
  validation?: (val: string) => boolean;
} & TextInputProps;

const AppTextInput = forwardRef<TextInput, Props>(
  (
    {
      style,
      containerStyle,
      placeholder,
      value,
      animatedPlaceholder = true,
      validation,
      ...rest
    }: Props,
    ref
  ) => {
    const { theme, colors } = useTheme();

    const [invalidValue, setInvalidValue] = useState(false);

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

    const handleBlur = (
      event: NativeSyntheticEvent<TextInputFocusEventData>
    ) => {
      if (rest.onBlur) {
        rest.onBlur(event);
      }
      if (validation && value) {
        const valid = validation(value);
        setInvalidValue(!valid);
      }
    };

    return (
      <View
        style={[
          styles.container,
          !!placeholder && animatedPlaceholder && { marginTop: spacing("xl") },
          containerStyle,
        ]}
      >
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
            invalidValue && { borderBottomWidth: 1, borderColor: colors.red },
            style,
          ]}
          value={value}
          onBlur={handleBlur}
        />
        {usingSecureTextEntry ? (
          <Pressable
            onPress={() => setSecureTextEntry(!secureTextEntry)}
            style={styles.eyeIcon}
          >
            <AppIcon
              name={secureTextEntry ? "eye-off" : "eye"}
              size={EYE_ICON_SIZE}
              color={colors.primary}
            />
          </Pressable>
        ) : null}

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
      </View>
    );
  }
);

const EYE_ICON_SIZE = iconSize("md");

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  placeholder: { position: "absolute", left: spacing("md"), top: -10 },
  eyeIcon: { position: "absolute", right: spacing("lg") },
});

export default AppTextInput;
