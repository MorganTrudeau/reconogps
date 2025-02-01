import React, { useEffect } from "react";
import { View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/utils";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { loadNotifications } from "../redux/thunks/notifications";
import { NotificationsList } from "../components/Notifications/NotificationsList";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "notifications"
>;

const NotificationsScreen = () => {
  const { theme, colors } = useTheme();

  const notifications = useSelector(
    (state: RootState) => state.notifications.data
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadNotifications());
  }, []);

  return (
    <View style={theme.container}>
      <NotificationsList
        notifications={notifications}
        theme={theme}
        colors={colors}
      />
    </View>
  );
};

export default NotificationsScreen;
