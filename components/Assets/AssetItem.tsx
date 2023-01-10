import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { spacing } from "../../styles";
import { StaticAsset } from "../../types";
import { constructImageUrl } from "../../utils";
import AppText from "../Core/AppText";
import { usePlaceholderLoader } from "../../hooks/usePlaceholderLoader";
import { LinearGradient } from "expo-linear-gradient";
import Placeholder from "../Placeholder";
import Avatar from "../Avatar";

type Props = { asset: StaticAsset };

const AssetItem = ({ asset }: Props) => {
  const placeholderLoader = usePlaceholderLoader(undefined);

  return (
    <View style={styles.container}>
      {asset.icon === "activation.png" ? (
        <Avatar
          firstName={asset.name.charAt(0)}
          lastName={asset.name.charAt(1)}
          size={ICON_SIZE}
          style={styles.icon}
        />
      ) : (
        <Image
          source={{ uri: constructImageUrl(asset.icon) }}
          style={styles.icon}
          resizeMode="cover"
        />
      )}
      <View>
        <AppText>{asset.name}</AppText>
        <Placeholder loading={true} style={styles.placeholder1} />
        <Placeholder loading={true} style={styles.placeholder2} />
      </View>
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
  placeholder1: {
    marginTop: spacing("md"),
    height: 6,
    width: 150,
  },
  placeholder2: {
    height: 6,
    width: 120,
    marginTop: 4,
  },
});

export default AssetItem;
