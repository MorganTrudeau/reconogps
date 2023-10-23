import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../hooks/useTheme";
import { getAlarmSettings, getAvailableAlarms } from "../../api/alarms";
import { AlarmUserConfiguration, Contact, WeekDayId } from "../../types";
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
import {
  getDefaultOfflineAlarmOptions,
  getOfflineAlarmOptions,
  overspeedAlarmsEnabled,
  overspeedAlarmsSupported,
} from "../../utils/alarms";
import AppButton from "../Core/AppButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AssetDetailContext } from "../../screens/AssetDetailScreen";
import AppIconButton from "../Core/AppIconButton";

type ContactData = Pick<Contact, "Mobile" | "EMail" | "FirstName" | "SubName">;

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
  const insets = useSafeAreaInsets();

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

  const [state, setState] = useState<{
    alarmOptions: { name: string; id: number }[];
    emailAlarmOptions: { name: string; id: number }[];
    offlineOptions: { name: string; id: string }[];
    showOfflineOptions: boolean;
    showOverspeedOptions: boolean;
    loading: boolean;
  }>({
    alarmOptions: [],
    emailAlarmOptions: [],
    showOfflineOptions: false,
    offlineOptions: getDefaultOfflineAlarmOptions(),
    showOverspeedOptions: false,
    loading: false,
  });

  const [userConfigState, setUserConfigState] = useState({
    ignoreEnabled: false,
    ignoreFrom: moment().hour(17).minute(0).millisecond(0).toDate(),
    ignoreTo: moment().hour(5).minute(0).millisecond(0).toDate(),
    ignoreOnDays: [] as WeekDayId[],
    selectedAlarms: [] as { name: string; id: number }[],
    selectedEmailAlarms: [] as { name: string; id: number }[],
    offlineOptions: getOfflineAlarmOptions(),
    overspeedEnabled: false,
    overRoadSpeedEnabled: false,
    overspeedAmount: "",
    externalEmail: "",
    selectedContacts: activeUserContact ? [activeUserContact] : [],
  });

  const assetDisplayContext = useContext(AssetDetailContext);

  const changeSetting = (arg: Parameters<typeof setUserConfigState>[0]) => {
    // assetDisplayContext.setActionButton(() => () => (
    //   <AppIconButton
    //     name="check-circle"
    //     {...{ theme, colors }}
    //   />
    // ));
    setUserConfigState(arg);
  };

  const [externalEmail, setExternalEmail] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<ContactData[]>(
    activeUserContact ? [activeUserContact] : []
  );

  const selectedContactNames = useMemo(() => {
    return selectedContacts
      .map((contact) => buildContactName(contact))
      .join(", ");
  }, [selectedContacts]);

  const loadAlarms = async (userConfig?: AlarmUserConfiguration) => {
    const AlertTypes = userConfig?.AlertTypes;
    const EmailAlertTypes = userConfig?.EmailAlertTypes;

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

      let emailAlarms = filterEmailAlarmIdsForAssetSolution(
        alarmResponse.Email,
        asset.solutionType
      ).map((id) => ({
        name: getAlarmName(id),
        id: Number(id),
      }));
      let pushAlarms = filterAlarmIdsForAssetSolution(
        alarmResponse.Push,
        asset.solutionType
      ).map((id) => ({
        name: getAlarmName(id),
        id: Number(id),
      }));

      let redPush = 0;
      let redEmail = 0;
      let _offlineOptions: { name: string; id: string }[] = [];
      let _showOfflineOptions = false;
      let _offlineValue = false;

      if (alarmResponse.Push.indexOf("67108864") !== -1) {
        redPush += 67108864;
        _showOfflineOptions = true;

        if (userConfig && userConfig.OfflineHours) {
          _offlineOptions = getOfflineAlarmOptions(userConfig);
        } else {
          _offlineOptions = getOfflineAlarmOptions();
        }

        if (AlertTypes && AlertTypes & 67108864) {
          _offlineValue = false;
        } else {
          _offlineValue = true;
        }
      }

      // const assetType = asset.assetType;
      // const showAdditionalBlocks =
      //   !assetType ||
      //   (assetType &&
      //     assetType.toLowerCase() !== "boat" &&
      //     assetType.toLowerCase() !== "jetski");

      let showOverspeedOptions = false;
      let overspeedEnabled = false;
      let overspeedAmount = 0;

      if (alarmType == 2) {
        if (overspeedAlarmsSupported(alarmResponse)) {
          redPush += 32;
          showOverspeedOptions = true;
          overspeedEnabled = overspeedAlarmsEnabled(userConfig);
          overspeedAmount = userConfig?.MaxSpeed || 0;
        }
      } else {
        _offlineOptions = _offlineOptions.filter((el) => +el.id > 24);
      }

      pushAlarms = pushAlarms.filter((el) => el.id != 32 && el.id != 67108864);
      emailAlarms = emailAlarms.filter(
        (el) => el.id != 32 && el.id != 67108864
      );
      // if(AlarmSolution.toLowerCase().indexOf('witi') !== -1){
      // alarmList = alarmList.map(el => el).filter(el => el.val == 8 || el.val == 1024 || el.val == 16 || el.val == 512 || el.val == 4 || el.val == 131072 );
      // alarmEmailList = alarmEmailList.map(el => el).filter(el => el.val == 8 || el.val == 1024 || el.val == 16 || el.val == 512 || el.val == 4 || el.val == 131072 );
      // }else{
      // alarmList = alarmList.map(el => el).filter(el => el.val == 65536 || el.val == 32768 || el.val == 1048576 || el.val == 131072 || el.val == 1024 || el.val == 8 || el.val == 16 || el.val == 128 || el.val == 512 || el.val == 4 || el.val == 2 || el.val == 256 || el.val == 33554432 || el.val == 2097152 || el.val == 16777216)
      // alarmEmailList = alarmEmailList.map(el => el).filter(el => el.val == 8 || el.val == 1024 || el.val == 16 || el.val == 512 || el.val == 4 || el.val == 131072 || el.val == 1048576 )
      // }
      for (var i = pushAlarms.length - 1; i >= 0; i--) {
        redPush += pushAlarms[i].id;
      }
      for (let i = emailAlarms.length - 1; i >= 0; i--) {
        redEmail += emailAlarms[i].id;
      }

      // self.$setState({
      //   ALL_JUST_CUSTOM_PUSH_ALARMS_OFF: redPush,
      //   ALL_JUST_CUSTOM_EMAIL_ALARMS_OFF: redEmail,
      //   ShowAlarmList: true,
      //   Alarms: pushAlarms,
      //   AlarmsEmail: emailAlarms,
      //   IgnoreBetweenState: !!(
      //     LiveAssetSettings && LiveAssetSettings.IsIgnore == 1
      //   ),
      //   SpeedingMode:
      //     LiveAssetSettings && LiveAssetSettings.SpeedingMode
      //       ? LiveAssetSettings.SpeedingMode
      //       : 1,
      // });

      // if(data.LiveAssetSettings?.HolderContact){
      // let index = self.ContactList.findIndex((item) => item.Code === data.LiveAssetSettings?.HolderContact)
      // self.ContactList[ index === -1 ? 0 : index ].Selected = true
      // }
      if (userConfig?.CustomEmails) {
        let arrEmails = userConfig?.CustomEmails?.split(",");
        for (let i = arrEmails.length - 1; i >= 0; i--) {
          // let index = self.ContactList.findIndex(
          //   (item) => item.EMail === arrEmails[i]
          // );
          // self.ContactList[index === -1 ? 0 : index].Selected = true;
        }
      }

      // self.$setState({
      //   OfflineOptions: offlineOptions,
      //   EmailsToSend: arrEmails,
      // });

      // if (AlarmListType == 2) {
      //   self.$app.utils.nextFrame(() => {
      //     self.initIgnoreBetweenBlock(LiveAssetSettings);
      //   });
      // }

      // self.$app.utils.nextFrame(() => {
      //   self.initToggleAllAlarms(AlarmOptions);
      // });

      console.log(alarmType, alarmResponse.Push);

      const userSettings = {
        ignoreEnabled: userConfigState.ignoreEnabled,
        ignoreFrom: userConfigState.ignoreFrom,
        ignoreTo: userConfigState.ignoreTo,
        ignoreOnDays: userConfigState.ignoreOnDays,
        selectedAlarms: pushAlarms.filter(
          (a) => !(AlertTypes && AlertTypes & a.id)
        ),
        selectedEmailAlarms: emailAlarms.filter(
          (a) => !(EmailAlertTypes && EmailAlertTypes & a.id)
        ),
        offlineOptions: _offlineOptions,
        overspeedEnabled: overspeedEnabled,
        overRoadSpeedEnabled: userConfigState.overRoadSpeedEnabled,
        overspeedAmount: String(overspeedAmount),
      };

      if (userConfig) {
        const { BeginTime, EndTime } = userConfig;
        const [beginHours, beginMinutes] = BeginTime.split(":");
        const [endHours, endMinutes] = EndTime.split(":");

        userSettings.ignoreEnabled = userConfig.IsIgnore === 1;
        userSettings.ignoreFrom = moment()
          .hour(Number(beginHours))
          .minute(Number(beginMinutes))
          .millisecond(0)
          .toDate();
        userSettings.ignoreTo = moment()
          .hour(Number(endHours))
          .minute(Number(endMinutes))
          .millisecond(0)
          .toDate();
        userSettings.ignoreOnDays = userConfig.Weeks.split(",") as WeekDayId[];
        userSettings.overRoadSpeedEnabled = userConfig.SpeedingMode === 1;
      }

      setUserConfigState((s) => ({ ...s, ...userSettings }));

      setState((s) => ({
        ...s,
        alarmOptions: pushAlarms,
        emailAlarmOptions: emailAlarms,
        showOfflineOptions: alarmResponse.Push.includes("67108864"),
        showOverspeedOptions: showOverspeedOptions,
        loading: false,
      }));
    } catch (error) {
      console.error(error);
      Toast.show(Translations.errors.common);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const loadAlarmSettings = async (imei: string) => {
    try {
      if (!asset) {
        throw new Error("missing asset");
      }

      const settings = await getAlarmSettings(majorToken, minorToken, imei);

      // AlarmListType: alarmType, //live
      // AssetType: asset.assetType,
      // AlarmOptions: settings.AlertTypes,
      // AlarmEmailOptions: settings.EmailAlertTypes,
      // LiveAssetSettings: settings,

      loadAlarms(settings);

      console.log(settings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loadSettingsForImei) {
      loadAlarmSettings(loadSettingsForImei);
    } else {
      loadAlarms();
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
    <>
      <KeyboardAwareScrollView scrollEnabled={false} style={styles.container}>
        {alarmType === 2 && (
          <IgnoreBetweenSelect
            from={userConfigState.ignoreFrom}
            to={userConfigState.ignoreTo}
            onChangeFrom={(ignoreFrom) =>
              changeSetting((s) => ({ ...s, ignoreFrom }))
            }
            onChangeTo={(ignoreTo) =>
              changeSetting((s) => ({ ...s, ignoreTo }))
            }
            headerStyle={styles.ignoreBetweenHeader}
            style={styles.ignoreBetweenSelect}
            weekDays={userConfigState.ignoreOnDays}
            onChangeWeekDays={(ignoreOnDays) =>
              changeSetting((s) => ({ ...s, ignoreOnDays }))
            }
            enabled={userConfigState.ignoreEnabled}
            title={"Ignore Alarms Schedule"}
            onToggleEnabled={(ignoreEnabled) =>
              changeSetting((s) => ({ ...s, ignoreEnabled }))
            }
          />
        )}
        <SelectList
          selectAllTitle={"Push Notifications"}
          hideSearch={true}
          flatListDisplay={false}
          data={state.alarmOptions}
          onSelect={(selectedAlarms) =>
            changeSetting((s) => ({ ...s, selectedAlarms }))
          }
          autoSelectAll={!loadSettingsForImei}
          style={styles.optionsList}
          initialSelectedIds={userConfigState.selectedAlarms.map((a) => a.id)}
        />
        <SelectList
          selectAllTitle={"Email Notifications"}
          hideSearch={true}
          flatListDisplay={false}
          data={state.emailAlarmOptions}
          onSelect={(selectedEmailAlarms) =>
            changeSetting((s) => ({ ...s, selectedEmailAlarms }))
          }
          style={styles.optionsList}
          initialSelectedIds={userConfigState.selectedEmailAlarms.map(
            (a) => a.id
          )}
        />
        {state.showOfflineOptions && (
          <SelectList
            style={styles.optionsList}
            hideSearch={true}
            flatListDisplay={false}
            data={state.offlineOptions}
            onSelect={(offlineOptions) =>
              changeSetting((s) => ({ ...s, offlineOptions }))
            }
            initialSelectedIds={userConfigState.offlineOptions.map((o) => o.id)}
            selectAllTitle={"Offline Alarm"}
          />
        )}
        {state.showOverspeedOptions && (
          <View>
            <ItemHeader
              title={"Overspeed Alarm"}
              {...{ theme, colors }}
              style={styles.section}
              enabled={userConfigState.overspeedEnabled}
              onToggleEnabled={(overspeedEnabled) =>
                changeSetting((s) => ({ ...s, overspeedEnabled }))
              }
            />
            <View
              pointerEvents={userConfigState.overspeedEnabled ? "auto" : "none"}
            >
              <SelectItem
                data={{ id: "over-road-speed", name: "Over Road Speed" }}
                isSelected={userConfigState.overRoadSpeedEnabled}
                onSelect={() =>
                  changeSetting((s) => ({
                    ...s,
                    overRoadSpeedEnabled: !s.overRoadSpeedEnabled,
                  }))
                }
                style={
                  !userConfigState.overspeedEnabled
                    ? theme.disabledOpacity
                    : undefined
                }
                {...{ theme, colors }}
              />
              <AppTextInput
                placeholder="Set Over Speed Amount"
                value={userConfigState.overspeedAmount}
                onChangeText={(overspeedAmount) =>
                  changeSetting((s) => ({ ...s, overspeedAmount }))
                }
                onFocus={() =>
                  changeSetting((s) => ({
                    ...s,
                    overRoadSpeedEnabled: !s.overRoadSpeedEnabled,
                  }))
                }
                containerStyle={[
                  { marginHorizontal: spacing("lg") },
                  (!userConfigState.overspeedEnabled ||
                    userConfigState.overRoadSpeedEnabled) &&
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
            Select who will receive these alarms. Choose from your contacts
            and/or add an external email.
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
            setSelectedContacts(contacts);
          }}
          initialSelectedIds={
            activeUserContact ? [activeUserContact.Code] : undefined
          }
        />
      </KeyboardAwareScrollView>
    </>
  );
};

const SAVE_BAR_HEIGHT = 60;

const styles = StyleSheet.create({
  container: {},
  optionsList: { marginTop: spacing("lg") },
  section: { paddingTop: spacing("xl"), paddingHorizontal: spacing("lg") },
  ignoreBetweenHeader: { paddingHorizontal: spacing("lg") },
  ignoreBetweenSelect: { paddingHorizontal: spacing("lg") },
  saveBar: {
    position: "absolute",
    top: 0,
    alignItems: "flex-end",
    left: 0,
    right: 0,
    height: SAVE_BAR_HEIGHT,
  },
  saveButton: { paddingVertical: spacing("md") },
});
