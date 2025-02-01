import React, { useCallback } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { PlaybackTrip, PlaybackTripDetail, StaticAsset } from "../../types";
import { PlaybackTripDetailListItem } from "./PlaybackTripDetailListItem";
import { spacing } from "../../styles";
import { useAppSelector } from "../../hooks/useAppSelector";
import EmptyList from "../EmptyList";
import { useTheme } from "../../hooks/useTheme";

const defaultDetails: PlaybackTripDetail[] = [];

export const PlaybackTrips = ({
  trips,
  assetId,
}: {
  trips: PlaybackTrip | null | undefined;
  assetId: string;
}) => {
  const { theme, colors } = useTheme();

  const staticAsset = useAppSelector(
    (state) => state.assets.staticData.entities[assetId] as StaticAsset
  );

  const renderTrip = useCallback(
    ({ item, index }: { item: PlaybackTripDetail; index: number }) => {
      return (
        <PlaybackTripDetailListItem
          playbackTripDetail={item}
          speedUnit={staticAsset?.speedUnit}
          tripNumber={index + 1}
        />
      );
    },
    [assetId]
  );

  const renderEmpty = useCallback(
    () => (
      <EmptyList
        icon={"map-marker-path"}
        theme={theme}
        colors={colors}
        message={"No trips for this time frame"}
      />
    ),
    [colors, theme]
  );

  return (
    <BottomSheetFlatList
      data={trips?.Details || defaultDetails}
      renderItem={renderTrip}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={{
        paddingHorizontal: spacing("lg"),
        paddingVertical: spacing("md"),
      }}
    />
  );
};
