import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useAppSelector } from "../../hooks/useAppSelector";
import { getStaticAssets } from "../../redux/selectors/assets";
import { iconSize, spacing } from "../../styles";
import { StaticAsset } from "../../types";
import AppText from "../Core/AppText";
import SelectList, { Props as SelectListProps } from "../SelectList";
import AssetAvatar from "./AssetAvatar";

const AssetSelectList = (props: Omit<SelectListProps, "data">) => {
  const staticAssets = useAppSelector((state) => getStaticAssets(state));

  const renderItemContent = (item: StaticAsset) => {
    return (
      <View style={styles.item}>
        <AssetAvatar asset={item} size={iconSize("xl")} style={styles.icon} />
        <AppText>{item.name}</AppText>
      </View>
    );
  };

  return (
    <SelectList
      data={staticAssets}
      customItemContent={renderItemContent}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: spacing("md") },
});

export default AssetSelectList;
