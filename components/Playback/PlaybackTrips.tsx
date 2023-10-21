import React, { useCallback } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { PlaybackTrip, PlaybackTripDetail, StaticAsset } from "../../types";
import { PlaybackTripDetailListItem } from "./PlaybackTripDetailListItem";
import { spacing } from "../../styles";
import { useAppSelector } from "../../hooks/useAppSelector";

const defaultDetails: PlaybackTripDetail[] = [];

export const PlaybackTrips = ({
  trips,
  assetId,
}: {
  trips: PlaybackTrip | null | undefined;
  assetId: string;
}) => {
  const staticAsset = useAppSelector(
    (state) => state.assets.staticData.entities[assetId] as StaticAsset
  );

  const renderTrip = useCallback(
    ({ item, index }: { item: PlaybackTripDetail; index: number }) => {
      // console.log(trip);
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

  return (
    <BottomSheetFlatList
      data={trips?.Details || defaultDetails}
      renderItem={renderTrip}
      contentContainerStyle={{
        paddingHorizontal: spacing("lg"),
        paddingVertical: spacing("md"),
      }}
    />
  );
};
