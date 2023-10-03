import { Portal } from "@gorhom/portal";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { View, ViewComponent } from "react-native";
import { Modalize } from "react-native-modalize";
import { useTheme } from "../../hooks/useTheme";
import { useSelectItems } from "../../hooks/useSelectItems";
import SelectItem from "../SelectItem";
import ModalHeader from "../Modals/ModalHeader";
import SelectAllHeader from "../SelectAllHeader";
import { spacing } from "../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const defaultIdSelector = (data: any) => data.id;
const defaultNameSelector = (data: any) => data.name;

export type Props = {
  modalTitle?: string;
  data: any[];
  onSelect: (selectedAssetData: any[]) => void;
  initialSelectedIds?: string[];
  idSelector?: (data: any) => string;
  nameSelector?: (data: any) => string;
  customItemContent?: (data: any) => React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
  autoSelectAll?: boolean;
  singleSelect?: boolean;
  hideSearch?: boolean;
  selectAllTitle?: string;
};

const SelectModal = forwardRef<Modalize, Props>(
  (
    {
      data,
      onSelect,
      idSelector = defaultIdSelector,
      nameSelector = defaultNameSelector,
      initialSelectedIds,
      modalTitle,
      customItemContent,
      ListEmptyComponent,
      autoSelectAll,
      singleSelect,
      hideSearch,
      selectAllTitle,
    },
    ref
  ) => {
    const { theme, colors } = useTheme();
    const insets = useSafeAreaInsets();

    const {
      selectedIds,
      selectedData,
      selectId,
      selectAll,
      allSelected,
      isSelected,
    } = useSelectItems(
      data,
      initialSelectedIds,
      idSelector,
      singleSelect,
      autoSelectAll
    );

    useEffect(() => {
      onSelect(selectedData);
    }, [selectedData]);

    const [search, setSearch] = useState("");

    const closeModal = () => {
      ref && "current" in ref && ref.current?.close();
    };

    const renderItem = ({ item }: { item: any }) => {
      const selected = isSelected(idSelector(item));
      const name = nameSelector(item);
      const id = idSelector(item);
      const CustomContent = customItemContent
        ? customItemContent(item)
        : undefined;
      return (
        <SelectItem
          data={{ id, name }}
          isSelected={selected}
          onSelect={(data) => selectId(data.id)}
          CustomContent={CustomContent}
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
            title={modalTitle}
            theme={theme}
            colors={colors}
            showSearch={!hideSearch}
          />
        </View>
      );
    };

    const filteredData = useMemo(() => {
      if (!search) {
        return data;
      }
      return data.filter((a) =>
        nameSelector(a).toUpperCase().includes(search.toUpperCase())
      );
    }, [search, data]);

    return (
      <Portal>
        <Modalize
          ref={ref}
          modalStyle={theme.modalContainer}
          HeaderComponent={renderHeader()}
          adjustToContentHeight
          flatListProps={{
            keyExtractor: (item, index) => `${idSelector(item)}-${index}`,
            data: filteredData,
            renderItem: renderItem,
            bounces: false,
            extraData: selectedIds,
            ListHeaderComponent: (
              <SelectAllHeader
                title={selectAllTitle}
                isSelected={allSelected}
                onPress={selectAll}
                style={theme.modalHeaderSelectAll}
                {...{ theme, colors }}
              />
            ),
            ListEmptyComponent,
            contentContainerStyle: {
              paddingBottom: spacing("md") + insets.bottom,
            },
          }}
        />
      </Portal>
    );
  }
);

export default SelectModal;
