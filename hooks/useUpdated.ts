import { useEffect, useRef } from "react";

export const useUpdated = <T>(
  val: T,
  onChange: (val: T, prevVal: T) => void
) => {
  const prevVal = useRef(val);
  useEffect(() => {
    if (prevVal.current !== val && typeof onChange === "function") {
      onChange(val, prevVal.current);
    }
    prevVal.current = val;
  }, [val]);
};
