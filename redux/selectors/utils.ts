import { Dictionary } from "@reduxjs/toolkit";

export const listOfEntities = <T>(ids: string[], entities: Dictionary<T>) => {
  return ids.reduce((acc, id) => {
    const asset = entities[id];
    if (asset) {
      return [...acc, asset];
    }
    return acc;
  }, [] as T[]);
};
