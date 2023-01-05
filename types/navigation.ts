import type {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import type { RouteProp, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";

export type RootStackComponent<RouteName extends keyof RootStackParamList> =
  React.FC<{
    navigation: NavigationProp<RootStackParamList, RouteName>;
    route: RouteProp<RootStackParamList, RouteName>;
  }>;

export type ParamListBase = Record<string, object | undefined>;

export type ScreenComponentType<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList
> =
  | React.ComponentType<{
      route: RouteProp<ParamList, RouteName>;
      navigation: any;
    }>
  | React.ComponentType<{}>;
