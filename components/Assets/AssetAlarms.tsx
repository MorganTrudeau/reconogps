import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useToast } from "../../hooks/useToast";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../hooks/useTheme";
import {
  getAlarmSettings,
  getAvailableAlarms,
  setAlarmSetting,
} from "../../api/alarms";
import { AlarmUserConfiguration, Contact, WeekDayId } from "../../types";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
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
import { iconSize, spacing } from "../../styles";
import { Translations } from "../../utils/translations";
import { buildContactName } from "../../utils/contacts";
import { Modalize } from "react-native-modalize";
import moment from "moment";
import EmptyList from "../EmptyList";
import { IconSet } from "../../utils/enums";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  getDefaultOfflineAlarmOptions,
  getEnabledAlarmsValue,
  getOfflineAlarmOptions,
  overspeedAlarmsEnabled,
  overspeedAlarmsSupported,
} from "../../utils/alarms";
import { FormContext } from "../../context/FormContext";
import AppIcon from "../Core/AppIcon";

const formId = "alarm";

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

  const { asset, activeUserContact, majorToken, minorToken, contacts } =
    useAppSelector((state) => {
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
        contacts: state.contacts.data,
      };
    });

  const alarmType = getAlarmListTypeForSolution(asset?.solutionType);

  const redPushRef = useRef(0);
  const redEmailRef = useRef(0);

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

  const savedUserConfig = useRef({
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

  const [userConfigState, setUserConfigState] = useState(
    savedUserConfig.current
  );
  const [loading, setLoading] = useState(false);

  // const [externalEmail, setExternalEmail] = useState("");
  // const [contactEmails, setContactEmails] = useState<ContactData[]>(
  //   activeUserContact ? [activeUserContact] : []
  // );

  const selectedContactNames = useMemo(() => {
    return userConfigState.selectedContacts
      .map((contact) => buildContactName(contact))
      .join(", ");
  }, [userConfigState.selectedContacts]);

  const formContext = useContext(FormContext);

  const changeSetting = (arg: Parameters<typeof setUserConfigState>[0]) => {
    setUserConfigState(arg);
  };

  const saveSettings = useCallback(async () => {
    const pushAlarmValue =
      getEnabledAlarmsValue(
        state.alarmOptions.map((a) => a.id),
        userConfigState.selectedAlarms.map((a) => a.id)
      ) - redPushRef.current;
    const emailAlarmValue =
      getEnabledAlarmsValue(
        state.emailAlarmOptions.map((a) => a.id),
        userConfigState.selectedEmailAlarms.map((a) => a.id)
      ) - redEmailRef.current;

    let params = {
      MinorToken: minorToken,
      MajorToken: majorToken,
      imeis: imeis.join(","),
      IsEmailNotification: true,
      IsPushNotification: true,
      HolderContact: minorToken,
      CustomEmails:
        userConfigState.selectedContacts.map((c) => c.EMail).join(",") +
        (userConfigState.externalEmail
          ? `,${userConfigState.externalEmail}`
          : ""),
      alarmOptions: pushAlarmValue,
      alarmEmailOptions: emailAlarmValue,
      AlertTypes: pushAlarmValue,
      EmailAlertTypes: emailAlarmValue,
      IsIgnore: userConfigState.ignoreEnabled ? 1 : 0,
      Weeks: userConfigState.ignoreOnDays.join(","),
      DateFrom: moment.utc(userConfigState.ignoreFrom).format("HH:mm"),
      DateTo: moment.utc(userConfigState.ignoreTo).format("HH:mm"),
      MaxSpeed:
        !userConfigState.overRoadSpeedEnabled && userConfigState.overspeedAmount
          ? Number(userConfigState.overspeedAmount)
          : 0,
      OfflineHours: userConfigState.offlineOptions.map((o) => o.id).join(","),
      SpeedingMode: !userConfigState.overspeedEnabled
        ? 0
        : userConfigState.overRoadSpeedEnabled
        ? 1
        : !userConfigState.overRoadSpeedEnabled &&
          userConfigState.overspeedAmount
        ? 2
        : 0,
    };

    try {
      setLoading(true);
      await setAlarmSetting(params);
      savedUserConfig.current = userConfigState;
      Toast.show("Alarm settings updated");
      formContext?.setSaveButton(() => null, formId);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [userConfigState]);

  const saveSettingsRef = useRef(saveSettings);

  useEffect(() => {
    saveSettingsRef.current = saveSettings;
  }, [saveSettings]);

  useEffect(() => {
    if (loading) {
      formContext?.setSaveButton(
        () => <ActivityIndicator color={colors.primary} />,
        formId
      );
    } else if (
      JSON.stringify(userConfigState) !==
      JSON.stringify(savedUserConfig.current)
    ) {
      formContext?.setSaveButton(
        () => (
          <Pressable
            onPress={() => saveSettingsRef.current()}
            hitSlop={spacing("md")}
          >
            <AppIcon
              name="check-circle"
              color={colors.primary}
              size={iconSize("md")}
            />
          </Pressable>
        ),
        formId
      );
    } else {
      formContext.setSaveButton(() => null, formId);
    }
  }, [userConfigState, loading]);

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

      if (alarmResponse.Push.includes("67108864")) {
        redPush += 67108864;
        _showOfflineOptions = true;

        if (userConfig && userConfig.OfflineHours) {
          _offlineOptions = getOfflineAlarmOptions(userConfig);
        } else {
          _offlineOptions = getOfflineAlarmOptions();
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

      for (var i = pushAlarms.length - 1; i >= 0; i--) {
        redPush += pushAlarms[i].id;
      }
      for (let i = emailAlarms.length - 1; i >= 0; i--) {
        redEmail += emailAlarms[i].id;
      }

      redPushRef.current = redPush;
      redEmailRef.current = redEmail;

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
        selectedContacts: userConfigState.selectedContacts,
      };

      if (userConfig) {
        const { BeginTime, EndTime } = userConfig;
        const [beginHours, beginMinutes] = BeginTime.split(":");
        const [endHours, endMinutes] = EndTime.split(":");

        userSettings.ignoreEnabled = userConfig.IsIgnore === 1;
        userSettings.ignoreFrom = moment()
          .utc()
          .hour(Number(beginHours))
          .minute(Number(beginMinutes))
          .millisecond(0)
          .toDate();
        userSettings.ignoreTo = moment()
          .utc()
          .hour(Number(endHours))
          .minute(Number(endMinutes))
          .millisecond(0)
          .toDate();
        if (userConfig.Weeks) {
          userSettings.ignoreOnDays = userConfig.Weeks.split(
            ","
          ) as WeekDayId[];
        }
        userSettings.overRoadSpeedEnabled = userConfig.SpeedingMode === 1;
        userSettings.selectedContacts = userConfig.CustomEmails.split(",")
          .map((email) =>
            Object.values(contacts.entities).find((c) => c?.EMail === email)
          )
          .filter((c) => c) as Contact[];
      }

      savedUserConfig.current = { ...savedUserConfig.current, ...userSettings };

      setUserConfigState((s) => ({ ...s, ...userSettings }));

      setState((s) => ({
        ...s,
        alarmOptions: pushAlarms,
        emailAlarmOptions: emailAlarms,
        showOfflineOptions: _showOfflineOptions,
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

      loadAlarms(settings);
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
            onChangeWeekDays={(ignoreOnDays) => {
              changeSetting((s) => ({ ...s, ignoreOnDays }));
            }}
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
                    overRoadSpeedEnabled: false,
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
            value={userConfigState.externalEmail}
            placeholder={"External Email"}
            onChangeText={(externalEmail) =>
              setUserConfigState((s) => ({ ...s, externalEmail }))
            }
            validation={validateEmail}
            keyboardType={"email-address"}
            autoCapitalize={"none"}
            autoCorrect={false}
          />
        </View>

        <ContactSelectModal
          ref={contactSelectModal}
          onSelect={(selectedContacts) => {
            setUserConfigState((s) => ({ ...s, selectedContacts }));
          }}
          initialSelectedIds={userConfigState.selectedContacts.map(
            (c) => c.Code
          )}
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
