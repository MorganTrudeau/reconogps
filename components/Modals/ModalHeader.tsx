import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { iconSize, spacing } from "../../styles";
import { ThemeProps } from "../../types/styles";
import AppIcon from "../Core/AppIcon";
import AppText from "../Core/AppText";
import AppTextInput from "../Core/AppTextInput";

type Props = {
  showSearch?: boolean;
  search?: string;
  setSearch?: (search: string) => void;
  onRequestClose: () => void;
  title: string;
} & ThemeProps;

const ModalHeader = ({
  showSearch = true,
  search,
  setSearch,
  theme,
  colors,
  title,
  onRequestClose,
}: Props) => {
  return (
    <View style={styles.header}>
      <View style={theme.row}>
        <AppText style={[theme.titleLarge, { flex: 1 }]}>{title}</AppText>
        <Pressable onPress={onRequestClose}>
          <AppIcon
            name={"close"}
            color={colors.primary}
            size={iconSize("md")}
          />
        </Pressable>
      </View>
      {showSearch && (
        <AppTextInput
          style={{ marginTop: spacing("md") }}
          placeholder={"Search"}
          animatedPlaceholder={false}
          value={search}
          onChangeText={setSearch}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing("lg"),
    paddingVertical: spacing("md"),
  },
});

export default ModalHeader;
