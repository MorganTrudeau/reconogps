import React, { useMemo, useRef, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useSearch } from "../../hooks/useSearch";
import { useToast } from "../../hooks/useToast";
import { useUpdated } from "../../hooks/useUpdated";
import {
  stopSharingAsset,
  unsubscribeSharedAsset,
} from "../../redux/thunks/sharedAssets";
import { spacing } from "../../styles";
import { SharedAsset, SharedAssetListData } from "../../types";
import { NavigationProp } from "../../types/navigation";
import { ThemeProps } from "../../types/styles";
import AppTextInput from "../Core/AppTextInput";
import EmptyList from "../EmptyList";
import OptionsModal, { OptionModalItem } from "../Modals/OptionsModal";
import SharedAssetItem from "./SharedAssetItem";
import * as Clipboard from "expo-clipboard";
import ExtendSharedAssetExpiryModal from "../Modals/ExtendSharedAssetExpiryModal";
import { AppModalRef } from "../Core/AppModal";
import AppText from "../Core/AppText";

const keyExtractor = (item: SharedAsset) => item.Code;

type Props = {
  sharedAssets: SharedAsset[];
  onRefresh: () => void;
  loading: boolean;
  context: "shared" | "subscribed";
  navigation: NavigationProp;
} & ThemeProps;

const SharedAssetsList = ({
  sharedAssets,
  theme,
  colors,
  onRefresh,
  loading,
  context,
  navigation,
}: Props) => {
  const Toast = useToast();

  const optionsModal = useRef<Modalize>(null);
  const extendExpiryModal = useRef<AppModalRef>(null);

  const [selectedAsset, setSelectedAsset] =
    useState<SharedAssetListData | null>(null);

  const {
    staticAssetData,
    unsubscribeSharedAssetRequest,
    stopSharingAssetRequest,
  } = useAppSelector((state) => ({
    staticAssetData: state.assets.staticData.entities,
    unsubscribeSharedAssetRequest:
      state.sharedAssets.unsubscribeSharedAssetRequest,
    stopSharingAssetRequest: state.sharedAssets.stopSharingAssetRequest,
  }));
  const dispatch = useAppDispatch();

  useUpdated(unsubscribeSharedAssetRequest.success, (success, prevSuccess) => {
    if (success && !prevSuccess) {
      optionsModal.current?.close();
    }
  });

  useUpdated(stopSharingAssetRequest.success, (success, prevSuccess) => {
    if (success && !prevSuccess) {
      optionsModal.current?.close();
    }
  });

  const sharedAssetListData: SharedAssetListData[] = useMemo(() => {
    if (!staticAssetData) {
      return sharedAssets;
    }
    return sharedAssets.map((sharedAsset) => ({
      ...sharedAsset,
      asset: Object.values(staticAssetData).find(
        (staticAsset) => staticAsset?.imei === sharedAsset.IMEI
      ),
    }));
  }, [staticAssetData, sharedAssets]);

  const { search, setSearch, filteredData } = useSearch(
    sharedAssetListData,
    (sharedAsset) => sharedAsset.asset?.name || sharedAsset.IMEI || ""
  );

  const openOptions = (sharedAsset: SharedAssetListData) => {
    setSelectedAsset(sharedAsset);
    optionsModal.current?.open();
  };

  const handleOptionPress =
    (func: (sharedAsset: SharedAsset) => void) => () => {
      if (!selectedAsset) {
        optionsModal.current?.close();
        return;
      }
      func(selectedAsset);
    };

  const handleUnsubscribe = (selectedAsset: SharedAsset) => {
    dispatch(unsubscribeSharedAsset({ imei: selectedAsset.IMEI }));
  };

  const handleView = (sharedAsset: SharedAssetListData) => {
    if (context === "subscribed") {
      return;
    }
    navigation.navigate("shared-asset-details", {
      sharedAssetCode: sharedAsset.Code,
    });
  };

  const handleCopy = async (selectedAsset: SharedAsset) => {
    try {
      await Clipboard.setStringAsync(selectedAsset.Code);
      Toast.show("Share Code Copied");
    } catch (error) {
      console.log(error);
    }
  };

  const handleExtend = (selectedAsset: SharedAsset) => {
    extendExpiryModal.current?.open();
  };

  const handleRemoveShared = (selectedAsset: SharedAsset) => {
    dispatch(stopSharingAsset({ imei: selectedAsset.IMEI }));
  };

  const options: OptionModalItem[] =
    context === "subscribed"
      ? [
          {
            value: "unsubscribe",
            onPress: handleOptionPress(handleUnsubscribe),
            icon: "delete",
            text: "Unsubscribe",
            destructive: true,
            loading: unsubscribeSharedAssetRequest.loading,
          },
        ]
      : [
          {
            value: "view",
            onPress: handleOptionPress(handleView),
            text: "View Details",
            icon: "eye",
            closeOnPress: true,
          },
          {
            value: "copy",
            onPress: handleOptionPress(handleCopy),
            text: "Copy Sharing Code",
            icon: "content-copy",
            closeOnPress: true,
          },
          {
            value: "extend",
            onPress: handleOptionPress(handleExtend),
            text: "Extend Expiry Date",
            icon: "autorenew",
            closeOnPress: true,
          },
          {
            value: "remove",
            onPress: handleOptionPress(handleRemoveShared),
            text: "Remove",
            icon: "delete",
            destructive: true,
            loading: stopSharingAssetRequest.loading,
          },
        ];

  const renderOptionsHeader = () => {
    if (!selectedAsset) {
      return null;
    }

    return (
      <View style={theme.optionsHeader}>
        <AppText
          style={theme.titleLarge}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {selectedAsset.asset?.name || selectedAsset.IMEI}
        </AppText>
      </View>
    );
  };

  const renderItem = ({ item }: { item: SharedAsset; index: number }) => {
    return (
      <SharedAssetItem
        sharedAsset={item}
        {...{ theme, colors }}
        onPress={handleView}
        onOptionsPress={openOptions}
      />
    );
  };

  const renderListHeader = () => {
    return (
      <AppTextInput
        style={styles.searchInput}
        placeholder={"Search"}
        animatedPlaceholder={false}
        autoCorrect={false}
        value={search}
        onChangeText={setSearch}
      />
    );
  };

  return (
    <>
      <FlatList
        keyExtractor={keyExtractor}
        data={filteredData}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListHeaderComponent={renderListHeader()}
        ListEmptyComponent={
          <EmptyList
            colors={colors}
            theme={theme}
            icon={"share-variant"}
            message={"No shared assets to show"}
          />
        }
      />
      <OptionsModal
        ref={optionsModal}
        options={options}
        HeaderComponent={renderOptionsHeader}
      />
      <ExtendSharedAssetExpiryModal
        ref={extendExpiryModal}
        sharedAssetCode={selectedAsset?.Code}
      />
    </>
  );
};

const styles = StyleSheet.create({
  searchInput: { marginBottom: spacing("sm") },
});

export default SharedAssetsList;
