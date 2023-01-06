import { useEffect, useRef } from "react";

export const usePlaceholderLoader = (val: any) => {
  const resolve = useRef<(value: void) => void>();
  const promise = useRef(
    new Promise<void>((r) => {
      resolve.current = r;
    })
  );

  useEffect(() => {}, []);

  return promise.current;
};
