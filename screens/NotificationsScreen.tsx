import React, { useCallback, useEffect, useMemo } from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { RootState } from "../redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/utils";
import { NotificationsList } from "../components/Notifications/NotificationsList";
import AppIcon from "../components/Core/AppIcon";
import { iconSize } from "../styles";
import { useAlert } from "../hooks/useAlert";
import {
  clearNotifications,
  clearUnreadCount,
} from "../redux/reducers/notifications";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "notifications"
>;

const NotificationsScreen = ({ navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const Alert = useAlert();

  const notifications = useAppSelector((state) => state.notifications.data);
  const dispatch = useAppDispatch();

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => (a.time > b.time ? -1 : 1)),
    [notifications]
  );

  const handleClearNotifications = useCallback(async () => {
    Alert.alert(
      "Clear notifications",
      "Do you want to clear your notification history?",
      [
        { text: "Cancel" },
        {
          text: "Clear notifications",
          onPress: () => dispatch(clearNotifications()),
        },
      ]
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearUnreadCount());
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleClearNotifications}>
          <AppIcon
            name={"delete"}
            size={iconSize("md")}
            color={colors.primary}
          />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <View style={theme.container}>
      <NotificationsList
        notifications={sortedNotifications}
        theme={theme}
        colors={colors}
      />
    </View>
  );
};

export default NotificationsScreen;
