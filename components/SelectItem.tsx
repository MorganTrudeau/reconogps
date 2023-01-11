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
  data: { id: string; name: string };
  isSelected: boolean;
  onSelect: (data: any) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  CustomContent?: React.ReactElement;
} & ThemeProps;

const SelectItem = ({
  data,
  isSelected,
  onSelect,
  theme,
  colors,
  style,
  textStyle,
  CustomContent,
}: Props) => {
  return (
    <Pressable
      onPress={() => onSelect(data)}
      style={[theme.row, styles.container, theme.borderBottom, style]}
    >
      <AppCheckBox
        value={isSelected}
        {...{ theme, colors }}
        style={styles.checkbox}
      />
      {CustomContent !== undefined ? (
        CustomContent
      ) : (
        <AppText style={textStyle}>{data.name}</AppText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing("lg"),
    paddingVertical: spacing("md"),
  },
  checkbox: { marginRight: spacing("lg") },
});

export default SelectItem;
