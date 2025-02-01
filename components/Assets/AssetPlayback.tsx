import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import AppField from "../Core/AppField";
import DateTimeModal from "../Modals/DateTimeModal";
import { Constants } from "../../utils/constants";
import moment from "moment";
import { BORDER_RADIUS_MD, BORDER_RADIUS_SM, spacing } from "../../styles";
import { Pressable, StyleSheet, View } from "react-native";
import SelectModal from "../Modals/SelectModal";
import { Modalize } from "react-native-modalize";
import { SwitchItem } from "../SwitchItem";
import AppButton from "../Core/AppButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/utils";
import AppText from "../Core/AppText";
import { Colors } from "../../types/styles";

type NavigationProp = NativeStackScreenProps<
  RootStackParamList,
  any
>["navigation"];

export const AssetPlayback = ({
  assetId,
  navigation,
}: {
  assetId: string;
  navigation: NavigationProp;
}) => {
  const { theme, colors } = useTheme();

  const eventsModal = useRef<Modalize>(null);

  const [startDateModalVisible, setStartDateModalVisible] = useState(false);
  const [endDateModalVisible, setEndDateModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(
    moment().subtract(1, "hour").toDate()
  );
  const [endDate, setEndDate] = useState(moment().toDate());
  const [events, setEvents] = useState<any[]>([]);
  const [optimized, setOptimized] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimePreset>("last-hour");
  const timeFilterRef = useRef<TimePreset>("last-hour");

  const handleTimePresetPress = useCallback((preset: TimePreset) => {
    if (timeFilterRef.current === preset) {
      return;
    }
    timeFilterRef.current = preset;
    setTimeFilter(preset);

    const hours = preset === "last-hour" ? 1 : preset === "last-12" ? 12 : 24;

    setStartDate(moment().subtract(hours, "hours").toDate());
    setEndDate(new Date());
  }, []);

  const eventsString = useMemo(() => {
    return events.map((e) => e.name).join(", ");
  }, [events]);

  const formattedFrom = useMemo(
    () => moment(startDate).format("lll"),
    [startDate]
  );
  const formattedTo = useMemo(() => moment(endDate).format("lll"), [endDate]);

  const startPlayback = () => {
    navigation.navigate("playback", {
      code: assetId,
      from: moment.utc(startDate).format("YYYY-MM-DDTHH:mm:ss"),
      to: moment.utc(endDate).format("YYYY-MM-DDTHH:mm:ss"),
      isIgnore: true,
      isOptimized: optimized,
    });
  };

  return (
    <>
      <View
        style={{
          paddingHorizontal: spacing("lg"),
        }}
      >
        <PresetButton
          title={"Last hour"}
          colors={colors}
          preset={"last-hour"}
          onPress={handleTimePresetPress}
          selected={timeFilter === "last-hour"}
        />
        <PresetButton
          title={"Last 12 hours"}
          colors={colors}
          preset={"last-12"}
          onPress={handleTimePresetPress}
          selected={timeFilter === "last-12"}
        />
        <PresetButton
          title={"Last 24 hours"}
          colors={colors}
          preset={"last-24"}
          onPress={handleTimePresetPress}
          selected={timeFilter === "last-24"}
        />
        <PresetButton
          title={"Custom time"}
          colors={colors}
          preset={"custom"}
          onPress={handleTimePresetPress}
          selected={timeFilter === "custom"}
        />
        {timeFilter === "custom" && (
          <>
            <AppField
              placeholder="Start time"
              value={formattedFrom}
              onPress={() => setStartDateModalVisible(true)}
            />
            <AppField
              placeholder="End time"
              value={formattedTo}
              onPress={() => setEndDateModalVisible(true)}
            />
          </>
        )}
        <AppField
          value={eventsString}
          placeholder={"Playback events"}
          onPress={() => eventsModal.current?.open()}
        />
        <SwitchItem
          value={optimized}
          onChange={setOptimized}
          title={"Show optimized route"}
          icon={"go-kart-track"}
          {...{ theme, colors }}
        />
        <SwitchItem
          value={sendEmail}
          onChange={setSendEmail}
          title={"Send by email"}
          icon={"email"}
          {...{ theme, colors }}
        />
        <AppButton
          title={"Generate Playback"}
          style={styles.button}
          onPress={startPlayback}
        />
      </View>

      <DateTimeModal
        mode="datetime"
        theme={theme}
        colors={colors}
        date={startDate}
        isVisible={startDateModalVisible}
        onConfirm={(date) => {
          setStartDateModalVisible(false);
          setStartDate(date);
        }}
        onCancel={() => setStartDateModalVisible(false)}
      />
      <DateTimeModal
        mode="datetime"
        theme={theme}
        colors={colors}
        date={endDate}
        isVisible={endDateModalVisible}
        onConfirm={(date) => {
          setEndDateModalVisible(false);
          setEndDate(date);
        }}
        onCancel={() => setEndDateModalVisible(false)}
      />
      <SelectModal
        ref={eventsModal}
        data={Constants.PLAYBACK_EVENTS}
        onSelect={setEvents}
        autoSelectAll={true}
        hideSearch={true}
        selectAllTitle="Playback Events"
      />
    </>
  );
};

type TimePreset = "last-hour" | "last-12" | "last-24" | "custom";

const PresetButton = React.memo(
  ({
    title,
    colors,
    onPress,
    selected,
    preset,
  }: {
    title: string;
    colors: Colors;
    selected: boolean;
    onPress: (preset: TimePreset) => void;
    preset: TimePreset;
  }) => {
    return (
      <Pressable
        style={[
          styles.timePreset,
          { borderColor: selected ? colors.primary : colors.border },
        ]}
        onPress={() => onPress(preset)}
      >
        <AppText>{title}</AppText>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  button: { marginTop: spacing("xl") },
  timePreset: {
    borderRadius: BORDER_RADIUS_SM,
    borderWidth: 2,
    padding: spacing("md"),
    marginTop: spacing("md"),
  },
});
