import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { spacing } from "../../styles";
import { StaticAsset } from "../../types";
import { constructImageUrl } from "../../utils";
import AppText from "../Core/AppText";

type Props = { asset: StaticAsset };

const AssetItem = ({ asset }: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: constructImageUrl(asset.icon) }}
        style={styles.icon}
        resizeMode="cover"
      />
      <AppText>{asset.name}</AppText>
    </View>
  );
};

const ICON_SIZE = 45;

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing("md"),
    paddingHorizontal: spacing("lg"),
    flexDirection: "row",
  },
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    marginRight: spacing("lg"),
  },
});

export default AssetItem;
