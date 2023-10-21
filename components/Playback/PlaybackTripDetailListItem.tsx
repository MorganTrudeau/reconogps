import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { PlaybackTripDetail, SpeedUnit } from "../../types";
import AppCheckBox from "../Core/AppCheckBox";
import { useTheme } from "../../hooks/useTheme";
import { iconSize, spacing } from "../../styles";
import AppText from "../Core/AppText";
import moment from "moment";
import { AddressText } from "../LocationText";
import { Colors, MaterialIcon, Theme } from "../../types/styles";
import AppIcon from "../Core/AppIcon";
import { getMileageUnit, getSpeedUnit } from "../../utils/assets";

export const PlaybackTripDetailListItem = ({
  playbackTripDetail,
  speedUnit,
  tripNumber,
}: {
  tripNumber: number;
  playbackTripDetail: PlaybackTripDetail;
  speedUnit: SpeedUnit;
}) => {
  const { theme, colors } = useTheme();

  //   const [active, setActive] = useState(true);

  console.log(playbackTripDetail);

  return (
    <Pressable
      //   onPress={() => setActive((a) => !a)}
      style={{
        paddingVertical: spacing("lg"),
        flexDirection: "row",
        borderBottomColor: colors.border,
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}
    >
      {/* <AppCheckBox
        value={active}
        onValueChange={setActive}
        theme={theme}
        colors={colors}
      /> */}
      <View style={{ flex: 1 }}>
        <AppText style={{ color: colors.primary, marginBottom: spacing("sm") }}>
          Trip #{tripNumber}
        </AppText>
        <AppText style={theme.title}>
          Start{"  "}
          <AppText style={theme.textMeta}>
            {moment
              .utc(playbackTripDetail.StartTime, "YYYY/MM/DD HH:mm:ss")
              .format("lll")}
          </AppText>
        </AppText>
        <AddressText
          lng={playbackTripDetail.StartLng}
          lat={playbackTripDetail.StartLat}
          viewProps={{ style: { marginTop: spacing("xs") } }}
        />

        <View style={{ paddingVertical: spacing("md") }}>
          <View style={theme.row}>
            <StatusItem
              icon={"clock"}
              text={playbackTripDetail.Duration}
              desc={"Duration"}
              theme={theme}
              colors={colors}
            />
            <StatusItem
              icon={"road-variant"}
              text={
                playbackTripDetail.Distance + " " + getMileageUnit(speedUnit)
              }
              desc={"Distance"}
              theme={theme}
              colors={colors}
            />
          </View>
          <View style={theme.row}>
            <StatusItem
              icon={"speedometer-medium"}
              text={playbackTripDetail.AvgSpeed + " " + getSpeedUnit(speedUnit)}
              desc={"Avg speed"}
              theme={theme}
              colors={colors}
            />
            <StatusItem
              icon={"speedometer"}
              text={playbackTripDetail.MaxSpeed + " " + getSpeedUnit(speedUnit)}
              desc={"Max speed"}
              theme={theme}
              colors={colors}
            />
          </View>
        </View>

        <AppText style={theme.title}>
          End{"  "}
          <AppText style={theme.textMeta}>
            {moment
              .utc(playbackTripDetail.EndTime, "YYYY/MM/DD HH:mm:ss")
              .format("lll")}
          </AppText>
        </AppText>
        <AddressText
          lng={playbackTripDetail.EndLng}
          lat={playbackTripDetail.EndLat}
          viewProps={{ style: { marginTop: spacing("xs") } }}
        />
      </View>
    </Pressable>
  );
};

const StatusItem = ({
  icon,
  text,
  desc,
  theme,
  colors,
}: {
  icon: MaterialIcon;
  text: string | number;
  desc: string;
  theme: Theme;
  colors: Colors;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        paddingVertical: spacing("sm"),
      }}
    >
      <AppIcon name={icon} color={colors.primary} size={iconSize("sm")} />
      <View style={{ paddingStart: spacing("md") }}>
        <AppText>{text}</AppText>
        <AppText style={theme.textSmallMeta}>{desc}</AppText>
      </View>
    </View>
  );
};
