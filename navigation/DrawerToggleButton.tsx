import { DrawerNavigationProp } from "@react-navigation/drawer";
import { PlatformPressable } from "@react-navigation/elements";
import {
  DrawerActions,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import * as React from "react";
import {
  Image,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useAppSelector } from "../hooks/useAppSelector";
import { useTheme } from "../hooks/useTheme";
import AppText from "../components/Core/AppText";

type Props = {
  accessibilityLabel?: string;
  pressColor?: string;
  pressOpacity?: number;
  tintColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function DrawerToggleButton({ tintColor, ...rest }: Props) {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

//   const { theme, colors } = useTheme();

//   const unreadNotifications = useAppSelector(
//     (state) => state.notifications.unreadCount
//   );

  return (
    <PlatformPressable
      style={styles.touchable}
      {...rest}
      accessible
      accessibilityRole="button"
      android_ripple={{ borderless: true }}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      hitSlop={Platform.select({
        ios: undefined,
        default: { top: 16, right: 16, bottom: 16, left: 16 },
      })}
    >
      <Image
        style={[styles.icon, tintColor ? { tintColor } : null]}
        source={require("../assets/toggle-drawer-icon.png")}
        fadeDuration={0}
      />
      {/* {!!unreadNotifications && (
        <View style={[styles.unreadCount, { backgroundColor: colors.red }]}>
          <AppText style={theme.textSmall}>{unreadNotifications}</AppText>
        </View>
      )} */}
    </PlatformPressable>
  );
}

const UNREAD_COUNT_SIZE = 15;

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
    margin: 3,
    resizeMode: "contain",
  },
  touchable: {
    marginHorizontal: 11,
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
