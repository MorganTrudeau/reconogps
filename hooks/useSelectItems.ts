import { useMemo, useState } from "react";

export const useSelectItems = (
  data: any[],
  initalSelectedIds: string[] = [],
  idSelector: (val: any) => string = (val: any) => val.id,
  singleSelect?: boolean
) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initalSelectedIds);

  const ids = useMemo(() => {
    return data.map(idSelector);
  }, [data]);
  const selectedData = useMemo(() => {
    return selectedIds.map((id) => data.find((d) => idSelector(d) === id));
  }, [selectedIds]);

  const allSelected = selectedIds.length === ids.length;
  const selectAll = () => {
    allSelected ? setSelectedIds([]) : setSelectedIds([...ids]);
  };

  const selectId = (id: string) => {
    if (singleSelect) {
      setSelectedIds([id]);
    } else {
      setSelectedIds((selectedIds) =>
        selectedIds.includes(id)
          ? selectedIds.filter((i) => i !== id)
          : [...selectedIds, id]
      );
    }
  };

  const isSelected = (id: string) => {
    return selectedIds.includes(id);
  };

  return {
    selectedIds,
    selectedData,
    selectId,
    selectAll,
    isSelected,
    allSelected,
  };
};
