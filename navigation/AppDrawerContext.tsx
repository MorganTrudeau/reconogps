import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { logout } from "../redux/thunks/auth";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { ActivityIndicator } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppDrawerIcon from "./AppDrawerIcon";
import { useAlert } from "../hooks/useAlert";

const AppDraweContent = (props: any) => {
  const { colors } = useTheme();
  const Alert = useAlert();
  const dispatch = useAppDispatch();
  const { minorToken, logoutRequest } = useAppSelector((state) => ({
    minorToken: state.auth.minorToken,
    logoutRequest: state.auth.logoutRequest,
  }));

  const handleLogout = async () => {
    try {
      await new Promise((resolve, reject) =>
        Alert.alert("Logout", "Are you sure you want to log out?", [
          { text: "No", onPress: reject },
          { text: "Yes", onPress: resolve },
        ])
      );
    } catch (error) {
      return;
    }

    if (minorToken) {
      dispatch(logout({ minorToken, deviceToken: "asdf" }));
    }
  };

  const renderLogoutIcon = ({
    size,
    color,
  }: {
    size: number;
    color: string;
  }) => {
    return logoutRequest.loading ? (
      <ActivityIndicator color={color} />
    ) : (
      <AppDrawerIcon {...{ size, color }} icon={"power"} />
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        inactiveTintColor={"white"}
        {...props}
        label="Logout"
        onPress={handleLogout}
        icon={renderLogoutIcon}
      />
    </DrawerContentScrollView>
  );
};

export default AppDraweContent;
