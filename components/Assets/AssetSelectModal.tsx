import { Portal } from "@gorhom/portal";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { useTheme } from "../../hooks/useTheme";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useSelectItems } from "../../hooks/useSelectItems";
import SelectItem from "../SelectItem";
import ModalHeader from "../Modals/ModalHeader";
import { StaticAsset } from "../../types";
import EmptyList from "../EmptyList";
import { IconSet } from "../../utils/enums";

type Props = {
  onSelect: (selectedAssetData: StaticAsset[]) => void;
  singleSelect?: boolean;
  blacklistedImeis?: string[];
};

const AssetSelectModal = forwardRef<Modalize, Props>(
  ({ onSelect, singleSelect, blacklistedImeis }, ref) => {
    const { theme, colors } = useTheme();

    const staticAssets = useAppSelector(
      (state) => state.assets.staticData.entities
    );
    const assetData = useMemo(() => {
      return Object.values(staticAssets).filter(
        (asset) => !!asset
      ) as StaticAsset[];
    }, [staticAssets]);

    const {
      selectedIds,
      selectedData,
      selectId,
      selectAll,
      allSelected,
      isSelected,
    } = useSelectItems(assetData, undefined, undefined, singleSelect);

    useEffect(() => {
      onSelect(selectedData);
    }, [selectedData]);

    const [search, setSearch] = useState("");

    const closeModal = () => {
      ref && "current" in ref && ref.current?.close();
    };

    const renderAsset = ({ item }: { item: { name: string; id: string } }) => {
      const selected = isSelected(item.id);
      return (
        <SelectItem
          data={item}
          isSelected={selected}
          onSelect={(data) => selectId(data.id)}
          {...{ theme, colors }}
        />
      );
    };

    const renderHeader = () => {
      return (
        <View>
          <ModalHeader
            search={search}
            setSearch={setSearch}
            onRequestClose={closeModal}
            title={"Selected Assets"}
            theme={theme}
            colors={colors}
          />
          {!singleSelect && (
            <SelectItem
              data={{ id: "select-all", name: "Select All" }}
              isSelected={allSelected}
              onSelect={selectAll}
              style={theme.modalHeaderSelectAll}
              textStyle={theme.title}
              {...{ theme, colors }}
            />
          )}
        </View>
      );
    };

    const filteredAssets = useMemo(() => {
      const whiteListedAssets = blacklistedImeis
        ? assetData.filter((a) => !blacklistedImeis.includes(a.imei))
        : assetData;

      if (!search) {
        return whiteListedAssets;
      }
      return whiteListedAssets.filter((a) =>
        a.name.toUpperCase().includes(search.toUpperCase())
      );
    }, [search, blacklistedImeis, assetData]);

    return (
      <Portal>
        <Modalize
          ref={ref}
          modalStyle={theme.container}
          HeaderComponent={renderHeader()}
          flatListProps={{
            data: filteredAssets,
            renderItem: renderAsset,
            bounces: false,
            extraData: selectedIds,
            ListEmptyComponent: (
              <EmptyList
                theme={theme}
                colors={colors}
                icon={IconSet.asset}
                message={"No assets to show"}
              />
            ),
          }}
        />
      </Portal>
    );
  }
);

export default AssetSelectModal;
