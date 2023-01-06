import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { logout } from "../redux/thunks/auth";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { ActivityIndicator, Image, StyleSheet } from "react-native";
import AppDrawerIcon from "./AppDrawerIcon";
import { useAlert } from "../hooks/useAlert";
import { spacing } from "../styles";

const AppDrawerContent = (props: any) => {
  const Alert = useAlert();
  const dispatch = useAppDispatch();
  const { logoutRequest } = useAppSelector((state) => ({
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

    dispatch(logout());
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
      <AppDrawerIcon focused={false} {...{ size, color }} icon={"power"} />
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <Image
        source={require("../assets/recono-logo.png")}
        style={styles.logo}
        resizeMode={"contain"}
      />
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

const ICON_RATIO = 140 / 800;
const ICON_WIDTH = 120;
const ICON_HEIGHT = ICON_WIDTH * ICON_RATIO;

const styles = StyleSheet.create({
  logo: {
    height: ICON_HEIGHT,
    width: ICON_WIDTH,
    marginHorizontal: 10,
    marginTop: spacing("md"),
    marginBottom: spacing("md") * 2,
  },
});

export default AppDrawerContent;
