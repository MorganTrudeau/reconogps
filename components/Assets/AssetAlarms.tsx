import React, { useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../hooks/useTheme";
import { getAlarmSettings, getAvailableAlarms } from "../../api/alarms";
import { Contact, WeekDayId } from "../../types";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AppText from "../Core/AppText";
import IgnoreBetweenSelect from "../Dates/IgnoreBetweenSelect";
import SelectList from "../SelectList";
import ItemHeader from "../ItemHeader";
import SelectItem from "../SelectItem";
import AppTextInput from "../Core/AppTextInput";
import AppField from "../Core/AppField";
import {
  filterAlarmIdsForAssetSolution,
  filterEmailAlarmIdsForAssetSolution,
  getAlarmListTypeForSolution,
  getAlarmName,
  validateEmail,
  validateNumber,
} from "../../utils";
import ContactSelectModal from "../Contacts/ContactSelectModal";
import { spacing } from "../../styles";
import { Translations } from "../../utils/translations";
import { buildContactName } from "../../utils/contacts";
import { Modalize } from "react-native-modalize";
import moment from "moment";
import EmptyList from "../EmptyList";
import { IconSet } from "../../utils/enums";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type ContactData = Pick<Contact, "Mobile" | "EMail" | "FirstName" | "SubName">;
type OfflineOption = { name: string; id: string };
const defaultOfflineOptions = [
  { name: "24 Hours", id: "24" },
  { name: "48 Hours", id: "48" },
  { name: "72 Hours", id: "72" },
];

const ALL_ALARMS_OFF = 2147483647;

export const AssetAlarms = ({
  imeis,
  loadSettingsForImei,
}: {
  imeis: string[];
  loadSettingsForImei?: string;
}) => {
  const { theme, colors } = useTheme();
  const Toast = useToast();

  const contactSelectModal = useRef<Modalize>(null);

  const { asset, activeUserContact, majorToken, minorToken } = useAppSelector(
    (state) => {
      const activeUser = state.activeUser.data;

      return {
        majorToken: state.auth.majorToken as string,
        minorToken: state.auth.minorToken as string,
        asset: Object.values(state.assets.staticData.entities).find(
          (a) => a?.imei === imeis[0]
        ),
        activeUserContact: activeUser
          ? Object.values(state.contacts.data.entities).find(
              (c) => c?.EMail === activeUser.Email
            )
          : null,
      };
    }
  );

  const alarmType = getAlarmListTypeForSolution(asset?.solutionType);
  const offlineOptions = useRef(
    alarmType === 2
      ? defaultOfflineOptions
      : defaultOfflineOptions.filter((o) => o.id !== "24")
  ).current;

  const [state, setState] = useState<{
    alarmOptions: { name: string; id: string }[];
    emailAlarmOptions: { name: string; id: string }[];
    showOfflineOptions: boolean;
    showOverspeedOptions: boolean;
    loading: boolean;
  }>({
    alarmOptions: [],
    emailAlarmOptions: [],
    showOfflineOptions: false,
    showOverspeedOptions: false,
    loading: false,
  });

  const [overspeedEnabled, setOverspeedEnabled] = useState(true);
  const [overRoadSpeedEnabled, setOverRoadSpeedEnabled] = useState(true);
  const [overspeedAmount, setOverspeedAmount] = useState("");
  const [ignoreEnabled, setIgnoreEnabled] = useState(false);
  const [ignoreFrom, setIgnoreFrom] = useState(
    moment().hour(17).minute(0).millisecond(0).toDate()
  );
  const [ignoreTo, setIgnoreTo] = useState(
    moment().hour(5).minute(0).millisecond(0).toDate()
  );
  const [ignoreOnDays, setIgnoreOnDays] = useState<WeekDayId[]>([]);
  const [selectedAlarms, setSelectedAlarms] = useState<
    { name: string; id: number }[]
  >([]);
  const [selectedEmailAlarms, setSelectedEmailAlarms] = useState<
    { name: string; id: number }[]
  >([]);
  const [selectedOfflineOptions, setSelectedOfflineOptions] = useState<
    OfflineOption[]
  >([]);
  const [externalEmail, setExternalEmail] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<ContactData[]>(
    activeUserContact ? [activeUserContact] : []
  );

  const selectedContactNames = useMemo(() => {
    return selectedContacts
      .map((contact) => buildContactName(contact))
      .join(", ");
  }, [selectedContacts]);

  const loadAlarms = async () => {
    if (!asset) {
      return;
    }
    try {
      setState((s) => ({ ...s, loading: true }));

      const alarmResponse = await getAvailableAlarms(
        asset.solutionType,
        asset.productName
      );

      if (!alarmResponse.Push.length && !alarmResponse.Email.length) {
        throw "missing data";
      }

      const emailAlarms = filterEmailAlarmIdsForAssetSolution(
        alarmResponse.Email,
        asset.solutionType
      ).map((id) => ({ name: getAlarmName(id), id }));
      const pushAlarms = filterAlarmIdsForAssetSolution(
        alarmResponse.Push,
        asset.solutionType
      ).map((id) => ({ name: getAlarmName(id), id }));

      setState((s) => ({
        ...s,
        alarmOptions: pushAlarms,
        emailAlarmOptions: emailAlarms,
        showOfflineOptions: alarmResponse.Push.includes("67108864"),
        showOverspeedOptions:
          alarmType === 2 && alarmResponse.Push.includes("32"),
        loading: false,
      }));
    } catch (error) {
      Toast.show(Translations.errors.common);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const loadAlarmSettings = async (imei: string) => {
    try {
      const settings = await getAlarmSettings(majorToken, minorToken, imei);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadAlarms();
    if (loadSettingsForImei) {
      loadAlarmSettings(loadSettingsForImei);
    }
  }, []);

  if (!asset) {
    return (
      <EmptyList
        icon={IconSet.asset}
        message={"Asset not found"}
        {...{ theme, colors }}
      />
    );
  }

  if (state.loading) {
    return (
      <View style={theme.container}>
        <ActivityIndicator style={{ marginTop: spacing("lg") }} />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView scrollEnabled={false}>
      {alarmType === 2 && (
        <IgnoreBetweenSelect
          from={ignoreFrom}
          to={ignoreTo}
          onChangeFrom={setIgnoreFrom}
          onChangeTo={setIgnoreTo}
          headerStyle={styles.ignoreBetweenHeader}
          style={styles.ignoreBetweenSelect}
          weekDays={ignoreOnDays}
          onChangeWeekDays={setIgnoreOnDays}
          enabled={ignoreEnabled}
          title={"Ignore Alarms Schedule"}
          onToggleEnabled={setIgnoreEnabled}
        />
      )}
      <SelectList
        selectAllTitle={"Push Notifications"}
        hideSearch={true}
        flatListDisplay={false}
        data={state.alarmOptions}
        onSelect={setSelectedAlarms}
        autoSelectAll={!loadSettingsForImei}
        style={styles.optionsList}
      />
      <SelectList
        selectAllTitle={"Email Notifications"}
        hideSearch={true}
        flatListDisplay={false}
        data={state.emailAlarmOptions}
        onSelect={setSelectedEmailAlarms}
        style={styles.optionsList}
      />
      {state.showOfflineOptions && (
        <SelectList
          style={styles.optionsList}
          hideSearch={true}
          flatListDisplay={false}
          data={offlineOptions}
          onSelect={setSelectedOfflineOptions}
          selectAllTitle={"Offline Alarm"}
        />
      )}
      {state.showOverspeedOptions && (
        <View>
          <ItemHeader
            title={"Overspeed Alarm"}
            {...{ theme, colors }}
            style={styles.section}
            enabled={overspeedEnabled}
            onToggleEnabled={setOverspeedEnabled}
          />
          <View pointerEvents={overspeedEnabled ? "auto" : "none"}>
            <SelectItem
              data={{ id: "over-road-speed", name: "Over Road Speed" }}
              isSelected={overRoadSpeedEnabled}
              onSelect={() => setOverRoadSpeedEnabled(!overRoadSpeedEnabled)}
              style={!overspeedEnabled ? theme.disabledOpacity : undefined}
              {...{ theme, colors }}
            />
            <AppTextInput
              placeholder="Set Over Speed Amount"
              value={overspeedAmount}
              onChangeText={setOverspeedAmount}
              onFocus={() => setOverRoadSpeedEnabled(false)}
              containerStyle={[
                { marginHorizontal: spacing("lg") },
                (!overspeedEnabled || overRoadSpeedEnabled) &&
                  theme.disabledOpacity,
              ]}
              validation={validateNumber}
            />
          </View>
        </View>
      )}
      <View
        style={{
          paddingHorizontal: spacing("lg"),
          paddingTop: spacing("xl") + spacing("sm"),
        }}
      >
        <AppText style={[{ paddingBottom: spacing("xs") }, theme.textMeta]}>
          Select who will receive these alarms. Choose from your contacts and/or
          add an external email.
        </AppText>
        <AppField
          value={selectedContactNames}
          placeholder={"Contacts"}
          onPress={() => contactSelectModal.current?.open()}
        />

        <AppTextInput
          value={externalEmail}
          placeholder={"External Email"}
          onChangeText={setExternalEmail}
          validation={validateEmail}
          keyboardType={"email-address"}
          autoCapitalize={"none"}
          autoCorrect={false}
        />
      </View>

      <ContactSelectModal
        ref={contactSelectModal}
        onSelect={(contacts) => {
          contactSelectModal.current?.close();
          setSelectedContacts(contacts);
        }}
        singleSelect={true}
        initialSelectedIds={
          activeUserContact ? [activeUserContact.Code] : undefined
        }
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  optionsList: { marginTop: spacing("lg") },
  section: { paddingTop: spacing("xl"), paddingHorizontal: spacing("lg") },
  ignoreBetweenHeader: { paddingHorizontal: spacing("lg") },
  ignoreBetweenSelect: { paddingHorizontal: spacing("lg") },
});
