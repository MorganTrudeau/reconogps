import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import EmptyList from "../EmptyList";
import { Colors, Theme } from "../../types/styles";
import { Notification } from "../../types";
import AppText from "../Core/AppText";
import { spacing } from "../../styles";
import moment from "moment";

type Props = { theme: Theme; colors: Colors; notifications: Notification[] };

export const NotificationsList = ({ theme, colors, notifications }: Props) => {
  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <View style={[theme.borderBottom, styles.item]}>
        <View style={theme.row}>
          <AppText style={[theme.title, { color: colors.primary, flex: 1 }]}>
            {item.title}
          </AppText>
          <AppText>{moment.parseZone(item.time).fromNow()}</AppText>
        </View>
        <AppText>{item.AssetName}</AppText>
      </View>
    ),
    []
  );

  const renderEmpty = useCallback(
    () => (
      <EmptyList
        icon={"bell"}
        message="No new notifications"
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

const styles = StyleSheet.create({
  item: { paddingHorizontal: spacing("lg"), paddingVertical: spacing("md") },
});
