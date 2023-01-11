import React from "react";
import { iconSize } from "../styles";
import { MaterialIcon } from "../types/styles";
import AppIcon from "../components/Core/AppIcon";

const AppDrawerIcon = ({ size, color, icon }: Props) => {
  return <AppIcon {...{ size: iconSize("md"), color }} name={icon} />;
};

export default AppDrawerIcon;

type Props = {
  size: number;
  color: string;
  focused: boolean;
  icon: MaterialIcon;
};
