import { useCallback, useEffect, useRef, useState } from "react";

export const useFormDataChanged = (data: Object) => {
  const dataRef = useRef(data);
  const hasChanged = useRef(false);
  const [dataChanged, setDataChanged] = useState(false);
  useEffect(() => {
    if (
      !hasChanged.current &&
      JSON.stringify(dataRef.current) !== JSON.stringify(data)
    ) {
      hasChanged.current = true;
      setDataChanged(true);
    }
  }, [data]);

  const clearChanges = () => {
    dataRef.current = data;
    hasChanged.current = false;
    setDataChanged(false);
  };

  return { dataChanged, clearChanges };
};
