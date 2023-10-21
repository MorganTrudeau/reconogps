import React from "react";
import { PlaybackEvent } from "../../types";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Image, Pressable, View } from "react-native";
import { getEventInfo } from "../../utils/playback";
import { EventIcons } from "../../utils/constants";
import { spacing } from "../../styles";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../Core/AppText";
import moment from "moment";
import { formatDateRange } from "../../utils/dates";

export const PlaybackEventList = ({
  events,
  onEventPress,
}: {
  events: PlaybackEvent[];
  onEventPress: (event: PlaybackEvent) => void;
}) => {
  const { theme } = useTheme();

  const renderItem = ({
    item,
    index,
  }: {
    item: PlaybackEvent;
    index: number;
  }) => {
    const eventInfo = getEventInfo(item);

    return (
      <Pressable
        onPress={() => onEventPress(item)}
        style={[theme.row, { paddingVertical: spacing("md") }]}
      >
        <Image
          source={EventIcons[eventInfo.icon]}
          style={{ height: 35, width: 35, marginRight: spacing("sm") }}
          resizeMode="contain"
        />
        <View>
          <AppText style={theme.title}>{eventInfo.title}</AppText>
          <AppText style={theme.textMeta}>
            {formatDateRange(item.beginTime, item.endTime)}
          </AppText>
        </View>
      </Pressable>
    );
  };

  return (
    <BottomSheetFlatList
      data={events}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingHorizontal: spacing("lg"),
        paddingVertical: spacing("md"),
      }}
    />
  );
};
