import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { logout } from "../redux/thunks/auth";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import AppDrawerIcon from "./AppDrawerIcon";
import { useAlert } from "../hooks/useAlert";
import { iconSize, spacing } from "../styles";
import AppIconButton from "../components/Core/AppIconButton";
import { useTheme } from "../hooks/useTheme";
import AppIcon from "../components/Core/AppIcon";
import AppText from "../components/Core/AppText";

const AppDrawerContent = (props: DrawerContentComponentProps) => {
  const Alert = useAlert();
  const { theme, colors } = useTheme();
  const dispatch = useAppDispatch();
  const { logoutRequest, unreadNotifications } = useAppSelector((state) => ({
    minorToken: state.auth.minorToken,
    logoutRequest: state.auth.logoutRequest,
    unreadNotifications: state.notifications.unreadCount,
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
      <View style={styles.header}>
        <Image
          source={require("../assets/recono-logo.png")}
          style={styles.logo}
          resizeMode={"contain"}
        />
        <Pressable onPress={() => props.navigation.navigate("notifications")}>
          <AppIcon
            name="bell"
            {...{ theme, colors }}
            color={colors.primary}
            size={iconSize("md")}
          />
          {!!unreadNotifications && (
            <View style={[styles.unreadCount, { backgroundColor: colors.red }]}>
              <AppText style={theme.textSmall}>1</AppText>
            </View>
          )}
        </Pressable>
      </View>
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
const UNREAD_COUNT_SIZE = 15;

const styles = StyleSheet.create({
  logo: {
    height: ICON_HEIGHT,
    width: ICON_WIDTH,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: spacing("md"),
    marginBottom: spacing("md") * 2,
  },
  unreadCount: {
    height: UNREAD_COUNT_SIZE,
    width: UNREAD_COUNT_SIZE,
    borderRadius: UNREAD_COUNT_SIZE / 2,
    position: "absolute",
    top: 0,
    right: -UNREAD_COUNT_SIZE * 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppDrawerContent;
