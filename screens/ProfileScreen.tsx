import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, View, Switch } from "react-native";
import AppTextInput from "../components/Core/AppTextInput";
import { useAppSelector } from "../hooks/useAppSelector";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../RootStackParamList";
import { iconSize, spacing } from "../styles";
import { User } from "../types";
import { updateUserInfo } from "../redux/thunks/user";
import { useAppDispatch } from "../hooks/useAppDispatch";
import AppText from "../components/Core/AppText";
import { useHeaderRightSave } from "../hooks/useHeaderRightSave";
import { PermissionValues } from "../utils/enums";
import { isAgentOrDealer } from "../redux/selectors/user";
import AppField from "../components/Core/AppField";
import TimeZoneModal from "../components/Modals/TimeZoneModal";
import { Modalize } from "react-native-modalize";
import { constructTimeZoneId, getTimeZone } from "../utils/user";
import AppIcon from "../components/Core/AppIcon";
import AppScrollView from "../components/Core/AppScrollView";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "profile">;

const ProfileScreen = ({ navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();

  const timeZoneModalRef = useRef<Modalize>(null);

  const { activeUser, updateRequest, permissions2, agentOrDealer } =
    useAppSelector((state) => ({
      activeUser: state.activeUser.data || ({} as User),
      permissions2: state.activeUser.permissions2,
      updateRequest: state.activeUser.updateRequest,
      agentOrDealer: isAgentOrDealer(state),
    }));
  const dispatch = useAppDispatch();

  const [userUpdate, setUserUpdate] = useState<Partial<User>>({
    ...activeUser,
  });
  const [autoMonthlyReport, setAutoMonthlyReport] = useState(
    permissions2?.autoMonthlyReport || 0
  );
  const [timeZoneValue, setTimeZoneValue] = useState<string | null | undefined>(
    constructTimeZoneId(activeUser.TimeZone, activeUser.TimeZoneID)
  );
  const timeZoneName = useMemo(() => {
    const timeZoneObject = getTimeZone(timeZoneValue);
    return timeZoneObject ? timeZoneObject.name : "";
  }, [timeZoneValue]);

  const handleUpdate = (key: keyof User) => (val: string) => {
    setUserUpdate((s) => ({ ...s, [key]: val }));
  };

  const getValue = (key: keyof User): string => {
    const value =
      typeof userUpdate[key] === "string"
        ? String(userUpdate[key])
        : activeUser
        ? activeUser[key] !== null && activeUser[key] !== undefined
          ? String(activeUser[key]).trim()
          : ""
        : "";
    return value;
  };

  const handleUpdateUser = () => {
    Keyboard.dismiss();

    dispatch(
      updateUserInfo({
        // @ts-ignore we need to pass timezone value string as TimeZone for api
        update: { ...userUpdate, TimeZone: timeZoneValue },
        permissions2: !agentOrDealer ? { autoMonthlyReport } : {},
      })
    );
  };

  const handleChangePassword = () => {
    navigation.navigate("change-password");
  };

  useHeaderRightSave({
    loading: updateRequest.loading,
    navigation,
    onPress: handleUpdateUser,
    style: theme.drawerHeaderRight,
  });

  return (
    <View style={theme.container}>
      <AppScrollView contentContainerStyle={styles.inputContainer}>
        <AppTextInput
          placeholder="First Name"
          onChangeText={handleUpdate("FirstName")}
          value={getValue("FirstName")}
        />
        <AppTextInput
          placeholder="Last Name"
          onChangeText={handleUpdate("SurName")}
          value={getValue("SurName")}
        />
        <AppTextInput
          placeholder="Email"
          onChangeText={handleUpdate("Email")}
          value={getValue("Email")}
        />
        <AppTextInput
          placeholder="Phone Number"
          onChangeText={handleUpdate("Mobile")}
          // value={getValue("Mobile")}
        />
        <AppTextInput
          placeholder="Address"
          onChangeText={handleUpdate("Address0")}
          value={getValue("Address0")}
        />
        <AppTextInput
          placeholder="Country"
          onChangeText={handleUpdate("Address1")}
          value={getValue("Address1")}
        />
        <AppTextInput
          placeholder="City"
          onChangeText={handleUpdate("Address2")}
          value={getValue("Address2")}
        />
        <AppTextInput
          placeholder="State/Province"
          onChangeText={handleUpdate("Address3")}
          value={getValue("Address3")}
        />
        <AppTextInput
          placeholder="Zip/Postal Code"
          onChangeText={handleUpdate("Address4")}
          value={getValue("Address4")}
        />
        <AppField
          placeholder="Timezone"
          value={timeZoneName}
          onPress={() =>
            timeZoneModalRef.current && timeZoneModalRef.current.open()
          }
        />

        {!agentOrDealer && (
          <Pressable
            style={[theme.row, styles.settingContainer]}
            onPress={() =>
              setAutoMonthlyReport((v) =>
                v === 0 ? PermissionValues.AutoMonthlyReport : 0
              )
            }
          >
            <AppIcon
              name={"file-chart"}
              color={colors.primary}
              style={styles.passwordIcon}
              size={iconSize("sm")}
            />
            <AppText>Receive Monthly Account Report</AppText>
            <Switch
              trackColor={{ true: colors.primary, false: colors.surface }}
              value={
                (autoMonthlyReport & PermissionValues.AutoMonthlyReport) === 0
              }
              onValueChange={(active) =>
                setAutoMonthlyReport(
                  active ? 0 : PermissionValues.AutoMonthlyReport
                )
              }
              style={{ marginLeft: spacing("lg") }}
            />
          </Pressable>
        )}

        <Pressable
          style={[theme.row, styles.settingContainer]}
          onPress={handleChangePassword}
        >
          <AppIcon
            name={"key"}
            color={colors.primary}
            style={styles.passwordIcon}
            size={iconSize("sm")}
          />
          <AppText>Change Password</AppText>
        </Pressable>
      </AppScrollView>

      <TimeZoneModal
        ref={timeZoneModalRef}
        selectedTimeZoneId={timeZoneValue}
        onSelect={setTimeZoneValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: spacing("lg"),
    paddingBottom: spacing("md"),
  },
  settingContainer: { marginTop: spacing("xl") },
  passwordIcon: { marginRight: spacing("md") },
});

export default ProfileScreen;
