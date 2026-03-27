export const listOfEntities = <T>(ids: string[], entities: Record<string, T | undefined>) => {
  return ids.reduce((acc, id) => {
    const asset = entities[id];
    if (asset) {
      return [...acc, asset];
    }
    return acc;
  }, [] as T[]);
};
