import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Modalize } from "react-native-modalize";
import { useTheme } from "../../hooks/useTheme";
import { spacing } from "../../styles";
import { WeekDayId } from "../../types";
import { Constants } from "../../utils/constants";
import AppField from "../Core/AppField";
import AppSwitch from "../Core/AppSwitch";
import AppText from "../Core/AppText";
import ItemHeader from "../ItemHeader";
import DateTimeModal from "../Modals/DateTimeModal";
import WeekDaySelectModal from "./WeekDaySelectModal";

type Props = {
  enabled?: boolean;
  from: Date;
  to: Date;
  weekDays: WeekDayId[];
  onToggleEnabled: (enabled: boolean) => void;
  onChangeFrom: (date: Date) => void;
  onChangeTo: (date: Date) => void;
  onChangeWeekDays: (weekDays: WeekDayId[]) => void;
  style?: StyleProp<ViewStyle>;
  title?: string;
  headerStyle?: ViewStyle;
};

const IgnoreBetweenSelect = ({
  enabled,
  onToggleEnabled,
  from,
  to,
  weekDays,
  onChangeFrom,
  onChangeTo,
  onChangeWeekDays,
  style,
  title = "Ignore Between",
  headerStyle,
}: Props) => {
  const { theme, colors } = useTheme();

  const workDaySelectModal = useRef<Modalize>(null);

  const [dateFromModalVisible, setDateFromModalVisible] = useState(false);
  const [dateToModalVisible, setDateToModalVisible] = useState(false);

  const formattedFrom = useMemo(
    () => moment(from).format(Constants.MOMENT_TIME_FORMAT),
    [from]
  );
  const formattedTo = useMemo(
    () => moment(to).format(Constants.MOMENT_TIME_FORMAT),
    [to]
  );

  const handleChangeWeekDays = (data: { name: string; id: WeekDayId }[]) => {
    return onChangeWeekDays(data.map((d) => d.id));
  };

  const weekDayNames = useMemo(() => {
    return weekDays
      .map((weekDayId) => moment().day(weekDayId).format("ddd"))
      .join(", ");
  }, [weekDays]);

  return (
    <>
      <ItemHeader
        title={title}
        enabled={enabled}
        onToggleEnabled={onToggleEnabled}
        style={headerStyle}
        {...{ theme, colors }}
      />
      <View
        style={[style, enabled === false ? theme.disabledOpacity : undefined]}
        pointerEvents={enabled === false ? "none" : "auto"}
      >
        <View style={theme.row}>
          {/* <AppIcon
          name={IconSet.time}
          size={iconSize("md")}
          color={colors.primary}
        /> */}
          <AppField
            placeholder="Start Time"
            value={formattedFrom}
            onPress={() => setDateFromModalVisible(true)}
            containerStyle={{ flex: 1, marginRight: spacing("sm") }}
          />
          <AppField
            placeholder="End Time"
            value={formattedTo}
            onPress={() => setDateToModalVisible(true)}
            containerStyle={{ flex: 1, marginLeft: spacing("sm") }}
          />
        </View>
        <AppField
          value={weekDayNames}
          placeholder={"Days to Ignore"}
          onPress={() => workDaySelectModal.current?.open()}
        />
      </View>
      <DateTimeModal
        mode="time"
        theme={theme}
        colors={colors}
        date={from}
        isVisible={dateFromModalVisible}
        onConfirm={(date) => {
          setDateFromModalVisible(false);
          onChangeFrom(date);
        }}
        onCancel={() => setDateFromModalVisible(false)}
      />
      <DateTimeModal
        mode="time"
        theme={theme}
        colors={colors}
        date={to}
        isVisible={dateToModalVisible}
        onConfirm={(date) => {
          setDateToModalVisible(false);
          onChangeTo(date);
        }}
        onCancel={() => setDateToModalVisible(false)}
      />
      <WeekDaySelectModal
        ref={workDaySelectModal}
        onSelect={handleChangeWeekDays}
      />
    </>
  );
};

export default IgnoreBetweenSelect;
