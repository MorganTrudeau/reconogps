import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { spacing } from "../styles";
import { ThemeProps } from "../types/styles";
import AppText from "./Core/AppText";

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
} & ThemeProps;

const ConfirmCancelButtons = ({ onCancel, onConfirm, theme }: Props) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onCancel} style={{ marginEnd: spacing("xl") }}>
        <AppText style={theme.titleMeta}>Cancel</AppText>
      </Pressable>

      <Pressable onPress={onConfirm}>
        <AppText style={theme.titlePrimary}>Confirm</AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: spacing("xl"),
  },
});

export default ConfirmCancelButtons;
