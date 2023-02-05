import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  StyleSheet,
} from "react-native";
import AssetItem from "../components/Assets/AssetItem";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation";
import { getStaticAssets } from "../redux/selectors/assets";
import { loadDynamicAssets } from "../redux/thunks/assets";
import { spacing } from "../styles";
import { CombinedAsset, StaticAsset } from "../types";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "assets">;
type Props = { onAssetPress?: (asset: CombinedAsset) => void } & Omit<
  FlatListProps<any>,
  "data" | "renderItem"
> &
  NavigationProps;

const AssetListScreen = ({ onAssetPress, navigation, ...rest }: Props) => {
  const { theme, colors } = useTheme();

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

  const handleAssetPress = (combinedAsset: CombinedAsset) => {
    navigation.navigate("asset-details", {
      assetId: combinedAsset.staticData.id,
    });
  };

  const renderItem = ({ item }: { item: StaticAsset; index: number }) => {
    return (
      <AssetItem
        asset={item}
        {...{ theme, colors }}
        onPress={handleAssetPress}
      />
    );
  };

  return (
    <FlatList
      data={assets}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.listContent}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  listContent: { paddingTop: spacing("md") },
});

export default AssetListScreen;
