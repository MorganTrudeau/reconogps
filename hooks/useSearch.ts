import { useMemo, useState } from "react";

export const useSearch = <T>(
  data: T[],
  searchTermSelector: (item: T) => string
) => {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) {
      return data;
    }

    return data.filter((item) =>
      searchTermSelector(item).toUpperCase().includes(search.toUpperCase())
    );
  }, [data, search]);

  return { search, setSearch, filteredData };
};
