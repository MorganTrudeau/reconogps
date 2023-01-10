import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { iconSize } from "../styles";
import { FeatherIcon } from "../types/styles";

const AppDrawerIcon = ({ size, color, icon }: Props) => {
  return <Feather {...{ size: iconSize("sm"), color }} name={icon} />;
};

export default AppDrawerIcon;

type Props = {
  size: number;
  color: string;
  focused: boolean;
  icon: FeatherIcon;
};
