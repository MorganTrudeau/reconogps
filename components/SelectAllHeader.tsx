import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { spacing } from "../styles";
import { ThemeProps } from "../types/styles";
import AppCheckBox from "./Core/AppCheckBox";
import AppText from "./Core/AppText";

type Props = {
  isSelected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
} & ThemeProps;

const SelectAllHeader = ({
  isSelected,
  onPress,
  theme,
  colors,
  style,
  textStyle,
  title,
  titleStyle,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={[theme.row, styles.container, theme.borderBottom, style]}
    >
      <View style={styles.titleContainer}>
        {!!title && (
          <AppText style={[theme.title, titleStyle]}>{title}</AppText>
        )}
      </View>

      <AppText style={[theme.title, textStyle]}>Select All</AppText>
      <AppCheckBox
        value={isSelected}
        {...{ theme, colors }}
        style={styles.checkbox}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing("lg"),
    paddingVertical: spacing("md"),
  },
  titleContainer: { flex: 1 },
  checkbox: { marginLeft: spacing("lg") },
});

export default SelectAllHeader;
