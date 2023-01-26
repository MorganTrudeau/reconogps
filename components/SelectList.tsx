import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleProp, View, ViewStyle } from "react-native";
import { useSearch } from "../hooks/useSearch";
import { useSelectItems } from "../hooks/useSelectItems";
import { useTheme } from "../hooks/useTheme";
import { spacing } from "../styles";
import AppTextInput from "./Core/AppTextInput";
import SelectAllHeader from "./SelectAllHeader";
import SelectItem from "./SelectItem";

const defaultIdSelector = (data: any) => data.id;
const defaultNameSelector = (data: any) => data.name;

export type Props = {
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
  flatListDisplay?: boolean;
  selectAllTitle?: string;
  style?: StyleProp<ViewStyle>;
};

const SelectList = ({
  data,
  onSelect,
  idSelector = defaultIdSelector,
  nameSelector = defaultNameSelector,
  initialSelectedIds,
  customItemContent,
  ListEmptyComponent,
  autoSelectAll,
  singleSelect,
  hideSearch,
  flatListDisplay = true,
  selectAllTitle,
  style,
}: Props) => {
  const { theme, colors } = useTheme();

  const keyExtractor = (item: any, index: number) =>
    `${idSelector(item)}-${index}`;

  const renderItem = ({ item }: { item: any; index: number }) => {
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

  const { search, setSearch, filteredData } = useSearch(data, nameSelector);

  const {
    selectedIds,
    selectedData,
    selectId,
    selectAll,
    allSelected,
    isSelected,
  } = useSelectItems(
    filteredData,
    initialSelectedIds,
    idSelector,
    singleSelect,
    autoSelectAll
  );

  useEffect(() => {
    onSelect(selectedData);
  }, [selectedData]);

  const renderHeader = () => {
    return (
      <View>
        {!hideSearch && (
          <AppTextInput
            style={{
              marginTop: spacing("md"),
              marginHorizontal: spacing("lg"),
            }}
            placeholder={"Search"}
            animatedPlaceholder={false}
            value={search}
            onChangeText={setSearch}
          />
        )}

        <SelectAllHeader
          title={selectAllTitle}
          isSelected={allSelected}
          onPress={selectAll}
          style={theme.modalHeaderSelectAll}
          {...{ theme, colors }}
        />
      </View>
    );
  };

  if (!flatListDisplay) {
    return (
      <View style={style}>
        {renderHeader()}
        {data.map((item, index) => (
          <View key={keyExtractor(item, index)}>
            {renderItem({ item, index })}
          </View>
        ))}
      </View>
    );
  }

  return (
    <FlatList
      {...{
        keyExtractor,
        data: filteredData,
        renderItem: renderItem,
        extraData: selectedIds,
        ListHeaderComponent: renderHeader(),
        ListEmptyComponent,
        style,
      }}
    />
  );
};

export default SelectList;
