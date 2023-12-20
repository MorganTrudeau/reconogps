import React from "react";
import { Image, ImageStyle, StyleSheet } from "react-native";
import { spacing } from "../../styles";
import { StaticAsset } from "../../types";
import { constructImageUrl } from "../../utils";
import { assetHasIcon } from "../../utils/assets";
import Avatar from "../Avatar";

const AssetAvatar = ({
  asset,
  size = ICON_SIZE,
  style,
}: {
  asset: StaticAsset;
  size?: number;
  style?: ImageStyle;
}) => {
  const iconStyle = [
    styles.icon,
    { height: size, width: size, borderRadius: size / 2 },
    style,
  ];

  return !assetHasIcon(asset) ? (
    <Avatar
      firstName={asset.name.charAt(0)}
      lastName={asset.name.charAt(1)}
      size={size}
      style={iconStyle}
    />
  ) : (
    <Image
      source={{ uri: constructImageUrl(asset.icon) }}
      style={iconStyle}
      resizeMode="cover"
    />
  );
};

const ICON_SIZE = 40;

const styles = StyleSheet.create({
  icon: {
    marginRight: spacing("lg"),
  },
});

export default AssetAvatar;
