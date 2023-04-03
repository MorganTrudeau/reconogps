import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { iconSize, spacing } from "../../styles";
import { MaterialIcon } from "../../types/styles";
import AppIcon from "./AppIcon";
import AppText from "./AppText";

type Props = {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  titleProps?: TextProps;
  loading?: boolean;
  style?: ViewStyle;
  icon?: MaterialIcon;
} & PressableProps;

const AppButton = ({
  style,
  title,
  titleStyle,
  titleProps = defaultTitleProps,
  loading,
  icon,
  ...rest
}: Props) => {
  const { theme, colors } = useTheme();
  return (
    <Pressable {...rest} style={[theme.button, style]}>
      {!!icon && (
        <AppIcon
          name={icon}
          color={colors.black}
          size={iconSize("md")}
          style={styles.icon}
        />
      )}
      <AppText
        {...{ theme, colors, ...titleProps }}
        style={[theme.buttonTitle, titleStyle]}
      >
        {title}
      </AppText>
      {loading ? (
        <ActivityIndicator color={colors.black} style={styles.loading} />
      ) : null}
    </Pressable>
  );
};

const defaultTitleProps = {};

const styles = StyleSheet.create({
  loading: { position: "absolute", right: spacing("lg") },
  icon: { position: "absolute", left: spacing("lg") },
});

export default AppButton;
