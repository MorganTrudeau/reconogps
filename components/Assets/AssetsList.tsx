import React, { useEffect } from "react";
import { FlatList, FlatListProps, RefreshControl } from "react-native";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { StaticAsset } from "../../types";
import AssetItem from "./AssetItem";
import { loadDynamicAssets } from "../../redux/thunks/assets";
import { useAppSelector } from "../../hooks/useAppSelector";
import { getStaticAssets } from "../../redux/selectors/assets";

type Props = {} & Omit<FlatListProps<StaticAsset>, "data" | "renderItem">;

const AssetsList = (props: Props) => {
  const { assets, ids, loading } = useAppSelector((state) => ({
    assets: getStaticAssets(state),
    ids: state.assets.staticData.ids as string[],
    loading: state.assets.staticLoadRequest.loading,
  }));
  const dispatch = useAppDispatch();

  const load = () => {
    dispatch(loadDynamicAssets({ ids }));
  };

  useEffect(() => {
    load();
  }, []);

  const renderItem = ({
    item,
    index,
  }: {
    item: StaticAsset;
    index: number;
  }) => {
    return <AssetItem asset={item} />;
  };

  return (
    <FlatList
      data={assets}
      renderItem={renderItem}
      {...props}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    />
  );
};

export default AssetsList;
