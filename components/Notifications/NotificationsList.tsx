import React, { useCallback } from "react";
import { FlatList, View } from "react-native";
import EmptyList from "../EmptyList";
import { Colors, Theme } from "../../types/styles";
import { Notification } from "../../types";

type Props = { theme: Theme; colors: Colors; notifications: Notification[] };

export const NotificationsList = ({ theme, colors, notifications }: Props) => {
  const renderItem = useCallback(() => <View></View>, []);

  const renderEmpty = useCallback(
    () => (
      <EmptyList
        icon={"bell"}
        message="No new notification"
        theme={theme}
        colors={colors}
      />
    ),
    []
  );

  return (
    <FlatList
      data={notifications}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
    />
  );
};
