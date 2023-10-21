import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { FlatListProps, RefreshControl, StyleSheet, View } from "react-native";
import AssetItem from "../components/Assets/AssetItem";
import AppButton from "../components/Core/AppButton";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation/utils";
import { getStaticAssets } from "../redux/selectors/assets";
import { loadDynamicAssets } from "../redux/thunks/assets";
import { spacing } from "../styles";
import { CombinedAsset, StaticAsset } from "../types";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import FocusAwareStatusBar from "../navigation/FocusAwareStatusBar";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "assets">;
type Props = { onAssetPress?: (asset: CombinedAsset) => void } & Omit<
  FlatListProps<any>,
  "data" | "renderItem"
> &
  NavigationProps;

const AssetListScreen = ({
  onAssetPress,
  navigation,
  route,
  ...rest
}: Props) => {
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

  const renderListEmptyComponent = () => {
    return (
      <View style={{ paddingHorizontal: spacing("lg") }}>
        <AppButton
          icon={"plus"}
          title={"Add your first asset"}
          onPress={() => route.params.onAddAssets()}
        />
      </View>
    );
  };

  return (
    <>
      <FocusAwareStatusBar style="dark" />
      <BottomSheetFlatList
        data={assets}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderListEmptyComponent}
        {...rest}
      />
    </>
  );
};

const styles = StyleSheet.create({
  listContent: { paddingTop: spacing("md") },
});

export default AssetListScreen;
