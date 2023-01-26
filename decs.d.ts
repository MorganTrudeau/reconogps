module "@env";

module "react-native-loading-placeholder";

type ObjectValues<T> = T[keyof T][];
type ObjectKeys<T> = (keyof T)[];
type ObjectEntries<T> = [keyof T, T[keyof T]][];

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
  values<T>(o: T): ObjectValues<T>;
  entries<T>(o: T): ObjectEntries<T>;
}
