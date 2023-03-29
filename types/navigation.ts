import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/utils";

type NavigationProps = NativeStackScreenProps<RootStackParamList, any>;

export type NavigationProp = NavigationProps["navigation"];
export type RouteProp = NavigationProps["route"];
