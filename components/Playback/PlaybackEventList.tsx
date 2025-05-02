import React, { useCallback, useMemo } from "react";
import { PlaybackEvent, PlaybackPoint } from "../../types";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Image, Pressable, View } from "react-native";
import { getEventInfo } from "../../utils/playback";
import { EventIcons } from "../../utils/constants";
import { spacing } from "../../styles";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../Core/AppText";
import moment from "moment";
import { formatDateRange } from "../../utils/dates";
import EmptyList from "../EmptyList";

export const PlaybackEventList = ({
  events,
  points,
  onPress,
}: {
  events: PlaybackEvent[];
  points: PlaybackPoint[];
  onPress: (event: PlaybackEvent | PlaybackPoint) => void;
}) => {
  const { theme, colors } = useTheme();

  const playbackData = useMemo(() => {
    return [...points, ...events].sort(
      (a, b) => a.positionTime - b.positionTime
    );
  }, [points, events]);

  const renderItem = ({
    item,
    index,
  }: {
    item: PlaybackEvent | PlaybackPoint;
    index: number;
  }) => {
    const eventInfo = getEventInfo(item);

    return (
      <Pressable
        onPress={() => onPress(item)}
        style={[theme.row, { paddingVertical: spacing("md") }]}
      >
        <Image
          source={EventIcons[eventInfo.icon]}
          style={{ height: 35, width: 35, marginRight: spacing("sm") }}
          resizeMode="contain"
        />
        <View>
          <AppText style={theme.title}>{eventInfo.title}</AppText>
          {!!(
            "beginTime" in item &&
            "endTime" in item &&
            item.beginTime &&
            item.endTime
          ) ? (
            <AppText style={theme.textMeta}>
              {formatDateRange(item.beginTime, item.endTime)}
            </AppText>
          ) : (
            <AppText style={theme.textMeta}>
              {item.positionTime &&
                moment(item.positionTime).format("MMM D h:mma")}
            </AppText>
          )}
        </View>
      </Pressable>
    );
  };

  const renderEmpty = useCallback(
    () => (
      <EmptyList
        icon={"map-marker-radius"}
        theme={theme}
        colors={colors}
        message={"No activity for this time frame"}
      />
    ),
    [theme, colors]
  );

  return (
    <BottomSheetFlatList
      data={playbackData}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={{
        paddingHorizontal: spacing("lg"),
        paddingVertical: spacing("md"),
      }}
    />
  );
};
