import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { Modalize } from "react-native-modalize";
import {
  createAlarmReport,
  createOverviewReport,
  createReport,
  CreateReportErrors,
  getReportAlarms,
} from "../api/reports";
import AssetSelectModal from "../components/Assets/AssetSelectModal";
import AppField from "../components/Core/AppField";
import AppText from "../components/Core/AppText";
import AppTextInput from "../components/Core/AppTextInput";
import DateTimeModal from "../components/Modals/DateTimeModal";
import SelectModal from "../components/Modals/SelectModal";
import { useAlert } from "../hooks/useAlert";
import { useAppSelector } from "../hooks/useAppSelector";
import { useHeaderRightSave } from "../hooks/useHeaderRightSave";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../RootStackParamList";
import { getContacts } from "../redux/selectors/contacts";
import { spacing } from "../styles";
import {
  Contact,
  Geofence,
  OverviewReportOption,
  ReportAlarm,
  StaticAsset,
} from "../types";
import {
  alertGeneralError,
  mapAlarmsResponse,
  validateEmail,
  validateNumber,
} from "../utils";
import { buildContactName } from "../utils/contacts";
import moment from "moment";
import { Errors } from "../utils/enums";
import OverviewReportOptionsModal from "../components/Modals/OverviewReportOptionsModal";
import { loadGeofences } from "../redux/thunks/geofences";
import { useAppDispatch } from "../hooks/useAppDispatch";
import GeofenceSelectModal from "../components/Modals/GeofenceSelectModal";
import AppScrollView from "../components/Core/AppScrollView";
import { reportOptions } from "../utils/data";
import AppCheckBox from "../components/Core/AppCheckBox";
import { useToast } from "../hooks/useToast";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "create-report"
>;

const CreateReportScreen = ({ navigation, route }: NavigationProps) => {
  const context = route.params.context;

  const { theme, colors } = useTheme();
  const Alert = useAlert();
  const Toast = useToast();

  const assetSelectModal = useRef<Modalize>(null);
  const alarmSelectModal = useRef<Modalize>(null);
  const geofenceSelectModal = useRef<Modalize>(null);
  const overviewOptionsModal = useRef<Modalize>(null);
  const contactSelectModal = useRef<Modalize>(null);

  // General State
  const [sendReportLoading, setSendReportLoading] = useState(false);
  const [startDateModalVisible, setStartDateModalVisible] = useState(false);
  const [endDateModalVisible, setEndDateModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(
    moment().subtract(1, "day").toDate()
  );
  const [endDate, setEndDate] = useState(moment().toDate());
  const [selectedAssets, setSelectedAssets] = useState<StaticAsset[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [selectedAlarms, setSelectedAlarms] = useState<ReportAlarm[]>([]);
  const [selectedGeofences, setSelectedGeofences] = useState<Geofence[]>([]);
  const [externalEmail, setExternalEmail] = useState("");
  const [ignitionOnTime, setIgnitionOnTime] = useState("5");
  const [ignitionOffTime, setIgnitionOffTime] = useState("5");
  const [trackingIgnitionOn, setTrackingIgnitionOn] = useState(true);
  const [trackingIgnitionOff, setTrackingIgnitionOff] = useState(true);
  const [stopTime, setStopTime] = useState("2");

  // Context specific field data
  const [alarmsLoading, setAlarmsLoading] = useState(false);
  const [alarms, setAlarms] = useState<ReportAlarm[]>([]);
  const [overviewOptions, setOverviewOptions] =
    useState<OverviewReportOption[]>(reportOptions);

  const { minorToken, majorToken, contacts, geofenceLoadRequest } =
    useAppSelector((state) => ({
      minorToken: state.auth.minorToken,
      majorToken: state.auth.majorToken,
      contacts: getContacts(state),
      geofenceLoadRequest: state.geofences.loadRequest,
    }));
  const dispatch = useAppDispatch();

  const minimumDate = useRef(moment().subtract(30, "days").toDate()).current;

  const loadFieldData = async () => {
    try {
      if (!(majorToken && minorToken)) {
        throw Errors.InvalidAuth;
      }

      if (context === "overview") {
        dispatch(loadGeofences());
      }

      if (context === "alarms" || context === "overview") {
        try {
          setAlarmsLoading(true);
          const alarmResponse = await getReportAlarms(majorToken, minorToken);
          setAlarmsLoading(false);
          setAlarms(mapAlarmsResponse(alarmResponse));
        } catch (error) {
          setAlarmsLoading(false);
          throw error;
        }
      }
    } catch (error) {
      alertGeneralError(Alert, () => navigation.goBack());
    }
  };

  const setNavigationTitle = () => {
    let headerTitle = "Create Report";

    switch (context) {
      case "overview":
        headerTitle = "Overview Report";
        break;
      case "alarms":
        headerTitle = "Alarm Report";
        break;
      case "stops":
        headerTitle = "Stops Report";
        break;
      case "trips":
        headerTitle = "Trips Report";
        break;
      case "runtime":
        headerTitle = "Runtime Report";
        break;
    }

    navigation.setOptions({ headerTitle });
  };

  useEffect(() => {
    setNavigationTitle();
    loadFieldData();
  }, []);

  const selectedAssetNames = useMemo(() => {
    return selectedAssets.map((asset) => asset.name).join(", ");
  }, [selectedAssets]);
  const selectedOverviewOptionNames = useMemo(() => {
    return overviewOptions.map((asset) => asset.Name).join(", ");
  }, [overviewOptions]);
  const selectedAlarmNames = useMemo(() => {
    return selectedAlarms.map((asset) => asset.AlertName).join(", ");
  }, [selectedAlarms]);
  const selectedGeofenceNames = useMemo(() => {
    return selectedGeofences.map((asset) => asset.Name).join(", ");
  }, [selectedGeofences]);
  const selectedContactNames = useMemo(() => {
    return selectedContacts
      .map((contact) => buildContactName(contact))
      .join(", ");
  }, [selectedContacts]);

  const renderContactSelectContact = (contact: Contact) => {
    return (
      <View>
        <AppText>{buildContactName(contact)}</AppText>
        <AppText style={theme.textMeta}>{contact.EMail}</AppText>
      </View>
    );
  };

  const handleReportError = (error: unknown) => {
    console.log(error);
    setSendReportLoading(false);

    if (error === CreateReportErrors.MISSING_EMAILS) {
      return Alert.alert(
        "Missing Recipients",
        "Please select a contact or enter an email to receive this report."
      );
    }

    if (error === CreateReportErrors.MISSING_ASSETS) {
      return Alert.alert(
        "Missing Assets",
        "Please select at least one asset to include in your report."
      );
    }

    if (error === CreateReportErrors.MISSING_IGNITION_ON_TIME) {
      return Alert.alert(
        "Missing Ignition On Time",
        "Please enter the number of minutes ignition was ON to include in your report."
      );
    }

    if (error === CreateReportErrors.MISSING_IGNITION_OFF_TIME) {
      return Alert.alert(
        "Missing Ignition On Time",
        "Please enter the number of minutes ignition was OFF to include in your report."
      );
    }

    if (error === CreateReportErrors.MISSING_STOP_TIME) {
      return Alert.alert(
        "Missing Stop TIme",
        "Please enter the number of minutes an asset was stopped to include in your report."
      );
    }

    Toast.show("Sending report failed. Try again.");
  };

  const handleSendReport = async () => {
    try {
      Keyboard.dismiss();

      setSendReportLoading(true);

      await createReport(
        context,
        majorToken,
        minorToken,
        selectedContacts,
        externalEmail,
        startDate,
        endDate,
        selectedAssets,
        reportOptions,
        selectedGeofences,
        selectedAlarms,
        trackingIgnitionOn,
        ignitionOnTime,
        trackingIgnitionOff,
        ignitionOffTime,
        stopTime
      );

      Toast.show("Report has been sent");

      navigation.goBack();
    } catch (error) {
      handleReportError(error);
    }
  };

  useHeaderRightSave({
    loading: sendReportLoading,
    navigation,
    onPress: handleSendReport,
  });

  return (
    <AppScrollView
      style={theme.container}
      contentContainerStyle={theme.contentContainer}
    >
      <AppText style={[styles.screenMessage, theme.textMeta]}>
        Specify what to include in your report.
      </AppText>

      <AppField
        value={moment(startDate).format("MMM DD YYYY, hh:mm")}
        placeholder={"Start Date & Time"}
        onPress={() => setStartDateModalVisible(true)}
      />

      <AppField
        value={moment(endDate).format("MMM DD YYYY, hh:mm")}
        placeholder={"End Date & Time"}
        onPress={() => setEndDateModalVisible(true)}
      />

      <AppField
        value={selectedAssetNames}
        placeholder={"Assets"}
        onPress={() => assetSelectModal.current?.open()}
      />

      {context === "runtime" && (
        <>
          <View style={theme.row}>
            <AppTextInput
              placeholder="Ignition On (Mins)"
              containerStyle={{ flex: 1 }}
              value={ignitionOnTime}
              onChangeText={setIgnitionOnTime}
              validation={validateNumber}
              required={trackingIgnitionOn}
            />
            <AppCheckBox
              {...{ theme, colors }}
              style={{ marginTop: spacing("xl"), marginLeft: spacing("md") }}
              value={trackingIgnitionOn}
              onValueChange={setTrackingIgnitionOn}
            />
          </View>
          <View style={theme.row}>
            <AppTextInput
              placeholder="Ignition Off (Mins)"
              containerStyle={{ flex: 1 }}
              value={ignitionOffTime}
              onChangeText={setIgnitionOffTime}
              validation={validateNumber}
              required={trackingIgnitionOff}
            />
            <AppCheckBox
              {...{ theme, colors }}
              style={{ marginTop: spacing("xl"), marginLeft: spacing("md") }}
              value={trackingIgnitionOff}
              onValueChange={setTrackingIgnitionOff}
            />
          </View>
        </>
      )}

      {context === "stops" && (
        <AppTextInput
          value={stopTime}
          onChangeText={setStopTime}
          placeholder="Stationary (Mins)"
          validation={validateNumber}
          required={true}
        />
      )}

      {context === "overview" && (
        <>
          <AppField
            value={selectedGeofenceNames}
            placeholder={"Geofences"}
            onPress={() => geofenceSelectModal.current?.open()}
            loading={geofenceLoadRequest.loading}
          />
          <AppField
            value={selectedOverviewOptionNames}
            placeholder={"Report Options"}
            onPress={() => overviewOptionsModal.current?.open()}
          />
        </>
      )}

      {(context === "alarms" || context === "overview") && (
        <AppField
          value={selectedAlarmNames}
          placeholder={"Alarms"}
          onPress={() => alarmSelectModal.current?.open()}
          loading={alarmsLoading}
        />
      )}

      <AppText
        style={[
          { paddingTop: spacing("xl"), paddingBottom: spacing("xs") },
          theme.textMeta,
        ]}
      >
        Select who will receive your report. Choose from your contacts and/or
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

      <AssetSelectModal
        ref={assetSelectModal}
        onSelect={setSelectedAssets}
        autoSelectAll={true}
      />

      {(context === "alarms" || context === "overview") && (
        <SelectModal
          modalTitle="Selected Alarms"
          ref={alarmSelectModal}
          data={alarms}
          onSelect={setSelectedAlarms}
          idSelector={(alarm: ReportAlarm) => alarm.AlertId}
          nameSelector={(alarm: ReportAlarm) => alarm.AlertName}
          autoSelectAll={true}
        />
      )}

      {context === "overview" && (
        <>
          <GeofenceSelectModal
            ref={geofenceSelectModal}
            onSelect={setSelectedGeofences}
            autoSelectAll={true}
          />
          <OverviewReportOptionsModal
            ref={overviewOptionsModal}
            onSelect={setOverviewOptions}
            autoSelectAll={true}
          />
        </>
      )}

      <SelectModal
        modalTitle="Selected Contacts"
        ref={contactSelectModal}
        data={contacts}
        onSelect={setSelectedContacts}
        nameSelector={(contact: Contact) => buildContactName(contact)}
        idSelector={(contact: Contact) => contact.Code}
        customItemContent={renderContactSelectContact}
      />

      <DateTimeModal
        {...{ theme, colors }}
        isVisible={startDateModalVisible}
        date={startDate}
        mode="datetime"
        onConfirm={(date) => {
          setStartDate(date);
          setStartDateModalVisible(false);
        }}
        onCancel={() => setStartDateModalVisible(false)}
        minimumDate={minimumDate}
      />

      <DateTimeModal
        {...{ theme, colors }}
        isVisible={endDateModalVisible}
        mode="datetime"
        date={endDate}
        onConfirm={(date) => {
          setEndDate(date);
          setEndDateModalVisible(false);
        }}
        onCancel={() => setEndDateModalVisible(false)}
      />
    </AppScrollView>
  );
};

const styles = StyleSheet.create({
  screenMessage: { paddingTop: spacing("md"), paddingBottom: spacing("xs") },
});

export default CreateReportScreen;
