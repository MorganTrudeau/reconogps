import { useEffect, useMemo, useRef, useState } from "react";
import { useUpdated } from "./useUpdated";

export const useSelectItems = (
  data: any[],
  initalSelectedIds?: string[],
  idSelector: (val: any) => string = (val: any) => val.id,
  singleSelect?: boolean,
  autoSelectAll?: boolean
) => {
  const ids = useMemo(() => {
    return data.map(idSelector);
  }, [data]);

  const [selectedIds, setSelectedIds] = useState<string[]>(
    initalSelectedIds ? initalSelectedIds : autoSelectAll ? ids : []
  );

  const selectedData = useMemo(() => {
    return selectedIds
      .map((id) => data.find((d) => idSelector(d) === id))
      .filter((d) => !!d);
  }, [selectedIds]);

  const allSelected = !!ids.length && selectedIds.length === ids.length;
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

  useUpdated(ids, (currentIds, prevIds) => {
    // Handle auto selecting data that loads async
    if (prevIds.length === 0 && currentIds.length > 0 && autoSelectAll) {
      setSelectedIds(ids);
    } else {
      setSelectedIds((stateIds) => stateIds.filter((id) => ids.includes(id)));
    }
  });

  return {
    selectedIds,
    selectedData,
    selectId,
    selectAll,
    isSelected,
    allSelected,
  };
};
