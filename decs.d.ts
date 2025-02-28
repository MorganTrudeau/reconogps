module "react-native-loading-placeholder";

type ObjectValues<T> = T[keyof T][];
type ObjectKeys<T> = (keyof T)[];
type ObjectEntries<T> = [keyof T, T[keyof T]][];

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
  values<T>(o: T): ObjectValues<T>;
  entries<T>(o: T): ObjectEntries<T>;
}

declare module "react-native-config" {
  export interface NativeConfig {
    HOSTNAME?: string;
    API_URL: string;
    GEOCODE_API_URL: string;
    GEOCODE_API_URL2: string;
    IMAGE_URL: string;
    PACKAGE_NAME: string;
    DEALER_TOKEN: string;
    MAP_TOKEN: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
