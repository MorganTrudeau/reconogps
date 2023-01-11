import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcon } from "../../types/styles";
import { TextProps } from "react-native";

type IconProps = TextProps & {
  /**
   * Size of the icon, can also be passed as fontSize in the style object.
   *
   * @default 12
   */
  size?: number;
  name: MaterialIcon;
  color?: string;
};

const AppIcon = (props: IconProps) => {
  return <MaterialCommunityIcons {...props} />;
};

export default AppIcon;
