import { Portal } from "@gorhom/portal";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { useTheme } from "../../hooks/useTheme";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useSelectItems } from "../../hooks/useSelectItems";
import SelectItem from "../SelectItem";
import ModalHeader from "../Modals/ModalHeader";

type Props = {
  onSelect: (selectedAssetData: { name: string; id: string }[]) => void;
};

const AlarmSelectModal = forwardRef<Modalize, Props>(({ onSelect }, ref) => {
  const { theme, colors } = useTheme();

  const staticAssets = useAppSelector(
    (state) => state.assets.staticData.entities
  );
  const assetData = useMemo(() => {
    return Object.values(staticAssets)
      .map((asset) => (asset ? { name: asset.name, id: asset.id } : null))
      .filter((asset) => !!asset) as { name: string; id: string }[];
  }, [staticAssets]);

  const {
    selectedIds,
    selectedData,
    selectId,
    selectAll,
    allSelected,
    isSelected,
  } = useSelectItems(assetData);

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
        <SelectItem
          data={{ id: "select-all", name: "Select All" }}
          isSelected={allSelected}
          onSelect={selectAll}
          style={theme.modalHeaderSelectAll}
          textStyle={theme.title}
          {...{ theme, colors }}
        />
      </View>
    );
  };

  const filteredAssets = useMemo(() => {
    if (!search) {
      return assetData;
    }
    return assetData.filter((a) =>
      a.name.toUpperCase().includes(search.toUpperCase())
    );
  }, [search]);

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
        }}
      />
    </Portal>
  );
});

export default AlarmSelectModal;
