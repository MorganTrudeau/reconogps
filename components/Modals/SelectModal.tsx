import { Portal } from "@gorhom/portal";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { View, ViewComponent } from "react-native";
import { Modalize } from "react-native-modalize";
import { useTheme } from "../../hooks/useTheme";
import { useSelectItems } from "../../hooks/useSelectItems";
import SelectItem from "../SelectItem";
import ModalHeader from "../Modals/ModalHeader";

const defaultIdSelector = (data: any) => data.id;
const defaultNameSelector = (data: any) => data.name;

type Props = {
  modalTitle: string;
  data: any[];
  onSelect: (selectedAssetData: any[]) => void;
  initialSelectedIds?: string[];
  idSelector?: (data: any) => string;
  nameSelector?: (data: any) => string;
  customItemContent?: (data: any) => React.ReactElement;
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
    },
    ref
  ) => {
    const { theme, colors } = useTheme();

    const {
      selectedIds,
      selectedData,
      selectId,
      selectAll,
      allSelected,
      isSelected,
    } = useSelectItems(data, initialSelectedIds, idSelector);

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
          modalStyle={theme.container}
          HeaderComponent={renderHeader()}
          flatListProps={{
            keyExtractor: (item, index) => `${idSelector(item)}-${index}`,
            data: filteredData,
            renderItem: renderItem,
            bounces: false,
            extraData: selectedIds,
            ListHeaderComponent: (
              <SelectItem
                data={{ id: "select-all", name: "Select All" }}
                isSelected={allSelected}
                onSelect={selectAll}
                style={theme.modalHeaderSelectAll}
                textStyle={theme.title}
                {...{ theme, colors }}
              />
            ),
          }}
        />
      </Portal>
    );
  }
);

export default SelectModal;
