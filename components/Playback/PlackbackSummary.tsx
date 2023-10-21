import React, { useMemo } from "react";
import { PlaybackTrip, SpeedUnit, StaticAsset } from "../../types";
import { getMileageUnit, getSpeedUnit } from "../../utils/assets";
import moment from "moment";
import { useAppSelector } from "../../hooks/useAppSelector";
import { Translations } from "../../utils/translations";
import { View } from "react-native";
import { Colors, MaterialIcon, Theme } from "../../types/styles";
import { iconSize, spacing } from "../../styles";
import AppIcon from "../Core/AppIcon";
import AppText from "../Core/AppText";
import { useTheme } from "../../hooks/useTheme";
import { IconSet } from "../../utils/enums";

export const PlaybackSummary = ({
  trip,
  from,
  to,
  assetId,
}: {
  trip: PlaybackTrip | null | undefined;
  from: string;
  to: string;
  assetId: string;
}) => {
  const { theme, colors } = useTheme();

  const staticAsset = useAppSelector(
    (state) => state.assets.staticData.entities[assetId] as StaticAsset
  );

  const summary = useMemo(() => {
    let list: { icon: MaterialIcon; title: string; text: string }[] = [
      {
        icon: IconSet.dateFrom,
        title: "Playback Start",
        text: moment(from).format("lll"),
      },
      {
        icon: IconSet.dateTo,
        title: "Playback End",
        text: moment(to).format("lll"),
      },
      {
        icon: IconSet.time,
        title: "Total Duration",
        text: trip?.Total.Duration
          ? trip.Total.Duration
          : Translations.common.na,
      },
      {
        icon: IconSet.mileage,
        title: "Total Mileage",
        text: trip?.Total.Distance
          ? trip.Total.Distance + " " + getMileageUnit(staticAsset.speedUnit)
          : Translations.common.na,
      },
    ];

    if (trip && trip.Details.length) {
      let MaxSpeed = 0;
      let AvgSpeed = 0;
      for (let detail of trip.Details) {
        // @ts-ignore
        AvgSpeed += parseFloat(detail.AvgSpeed);
        // @ts-ignore
        if (MaxSpeed < parseFloat(detail.MaxSpeed)) {
          // @ts-ignore
          MaxSpeed = parseFloat(detail.MaxSpeed);
        }
      }
      if (AvgSpeed) {
        AvgSpeed = AvgSpeed / trip.Details.length;
        list.push({
          icon: "speedometer-medium",
          title: "Average Speed",
          text:
            // @ts-ignore
            parseFloat(AvgSpeed).toFixed(1) +
            " " +
            getSpeedUnit(staticAsset.speedUnit),
        });
      }
      if (MaxSpeed) {
        list.push({
          icon: "speedometer",
          title: "Max Speed",
          text:
            // @ts-ignore
            parseFloat(MaxSpeed).toFixed(1) +
            " " +
            getSpeedUnit(staticAsset.speedUnit),
        });
      }
    }
    list.push(
      {
        icon: IconSet.fuel,
        title: "Total Fuel",
        text: trip?.Total.Fuel
          ? trip.Total.Fuel + " " + "L"
          : Translations.common.na,
      },
      {
        icon: "car",
        title: "Registration",
        text: staticAsset.registration
          ? staticAsset.registration
          : Translations.common.na,
      },
      {
        icon: "car",
        title: "Make",
        text: staticAsset.make ? staticAsset.make : Translations.common.na,
      },
      {
        icon: "car",
        title: "Model",
        text: staticAsset.model ? staticAsset.model : Translations.common.na,
      },
      {
        icon: IconSet.color,
        title: "Color",
        text: staticAsset.color ? staticAsset.color : Translations.common.na,
      },
      {
        icon: "calendar-month-outline",
        title: "Year",
        text: staticAsset.year ? staticAsset.year : Translations.common.na,
      }
    );
    return list;
  }, [trip]);

  return (
    <View
      style={{
        paddingHorizontal: spacing("lg"),
        paddingVertical: spacing("md"),
      }}
    >
      {summary.map(({ icon, title, text }) => (
        <SummaryItem
          icon={icon}
          title={title}
          text={text}
          theme={theme}
          colors={colors}
        />
      ))}
    </View>
  );
};

const SummaryItem = ({
  icon,
  text,
  title,
  colors,
  theme,
}: {
  icon: MaterialIcon;
  text: string;
  title: string;
  colors: Colors;
  theme: Theme;
}) => {
  return (
    <View
      style={{
        paddingVertical: spacing("md"),
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <AppIcon
        name={icon}
        color={colors.primary}
        size={iconSize("md")}
        style={{ marginEnd: spacing("lg") }}
      />
      <AppText style={[theme.title, { flex: 1 }]}>{title}</AppText>
      <AppText>{text}</AppText>
    </View>
  );
};
