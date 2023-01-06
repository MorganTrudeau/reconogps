import React from "react";
import { FlatList, FlatListProps } from "react-native";
import { StaticAsset } from "../../types";
import AssetItem from "./AssetItem";

type Props = { assets: StaticAsset[] };

const AssetsList = ({
  assets,
  ...rest
}: Props & Omit<FlatListProps<StaticAsset>, "data" | "renderItem">) => {
  const renderItem = ({ item, index }: { item: StaticAsset; index: number }) => {
    return <AssetItem asset={item} />;
  };

  return <FlatList data={assets} renderItem={renderItem} {...rest} />;
};

export default AssetsList;
