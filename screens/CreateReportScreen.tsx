import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { createAlarmReport, getReportAlarms } from "../api/reports";
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
import { RootStackParamList } from "../navigation";
import { getContacts } from "../redux/selectors/contacts";
import { spacing } from "../styles";
import { Contact, ReportAlarm, StaticAsset } from "../types";
import { alertGeneralError, mapAlarmsResponse, validateEmail } from "../utils";
import { buildContactName } from "../utils/contacts";
import moment from "moment";
import { Constants } from "../utils/constants";
import { AlarmReportParams } from "../types/api";
import { Errors } from "../utils/enums";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "create-report"
>;

const CreateReportScreen = ({ navigation, route }: NavigationProps) => {
  const context = route.params.context;

  const { theme, colors } = useTheme();
  const Alert = useAlert();

  const assetSelectModal = useRef<Modalize>(null);
  const alarmSelectModal = useRef<Modalize>(null);
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
  const [externalEmail, setExternalEmail] = useState("");

  // Context specific field data
  const [alarms, setAlarms] = useState<ReportAlarm[]>([]);
  const [alarmsLoading, setAlarmsLoading] = useState(false);

  const { minorToken, majorToken, contacts } = useAppSelector((state) => ({
    minorToken: state.auth.minorToken,
    majorToken: state.auth.majorToken,
    contacts: getContacts(state),
  }));

  const loadFieldData = async () => {
    try {
      if (!(majorToken && minorToken)) {
        throw Errors.InvalidAuth;
      }

      if (context === "alarms") {
        try {
          setAlarmsLoading(true);
          const alarms = await getReportAlarms(majorToken, minorToken);
          setAlarmsLoading(false);
          setAlarms(mapAlarmsResponse(alarms));
        } catch (error) {
          setAlarmsLoading(false);
          throw error;
        }
      }
    } catch (error) {
      alertGeneralError(Alert, () => navigation.goBack());
    }
  };

  useEffect(() => {
    loadFieldData();
  }, []);

  const selectedAssetNames = useMemo(() => {
    return selectedAssets.map((asset) => asset.name).join(", ");
  }, [selectedAssets]);
  const selectedAlarmNames = useMemo(() => {
    return selectedAlarms.map((asset) => asset.AlertName).join(", ");
  }, [selectedAlarms]);
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

  const handleSendReport = async () => {
    try {
      if (!(majorToken && minorToken)) {
        throw Errors.InvalidAuth;
      }

      setSendReportLoading(true);

      const IMEIs = selectedAssets.map((asset) => asset.imei);
      const Emails = selectedContacts
        .map((contact) => contact.EMail)
        .filter((email) => email && validateEmail(email)) as string[];
      const AlertIds = selectedAlarms.map((alert) => alert.AlertId);

      if (validateEmail(externalEmail)) {
        Emails.push(externalEmail);
      }

      const params: AlarmReportParams = {
        MajorToken: majorToken,
        MinorToken: minorToken,
        IMEIs,
        Emails,
        Export: "PDF",
        Logo: "https://helper.quiktrak.com.au/logo/quiktrak/logo.png",
        DateFrom: moment(startDate).format(Constants.COM_TIMEFORMAT),
        DateTo: moment(endDate).format(Constants.COM_TIMEFORMAT),
        AlertIds,
      };

      if (context === "alarms") {
        await createAlarmReport(params);
      }

      setSendReportLoading(false);
    } catch (error) {
      console.log(error);
      setSendReportLoading(false);
    }
  };

  useHeaderRightSave({
    loading: sendReportLoading,
    navigation,
    onPress: handleSendReport,
  });

  return (
    <ScrollView
      style={theme.container}
      contentContainerStyle={theme.contentContainer}
    >
      <AppText style={[styles.screenMessage, theme.textMeta]}>
        Specify what to include in your report.
      </AppText>

      <AppField
        value={selectedAssetNames}
        placeholder={"Assets"}
        onPress={() => assetSelectModal.current?.open()}
      />

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

      <AssetSelectModal ref={assetSelectModal} onSelect={setSelectedAssets} />
      <SelectModal
        modalTitle="Selected Alarms"
        ref={alarmSelectModal}
        data={alarms}
        onSelect={setSelectedAlarms}
        idSelector={(alarm: ReportAlarm) => alarm.AlertId}
        nameSelector={(alarm: ReportAlarm) => alarm.AlertName}
      />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenMessage: { paddingTop: spacing("md"), paddingBottom: spacing("xs") },
});

export default CreateReportScreen;
