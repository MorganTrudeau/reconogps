import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { spacing } from "../../styles";
import AppText from "./AppText";

type Props = {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  titleProps?: TextProps;
  loading?: boolean;
} & PressableProps;

const AppButton = ({
  style,
  title,
  titleStyle,
  titleProps = defaultTitleProps,
  loading,
  ...rest
}: Props) => {
  const { theme, colors } = useTheme();
  return (
    <Pressable {...rest} style={[theme.button, style]}>
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
});

export default AppButton;
