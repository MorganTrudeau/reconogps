import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/utils";
import { useAppSelector } from "../hooks/useAppSelector";
import { BORDER_RADIUS_MD, iconSize, spacing } from "../styles";
import AppTextInput from "../components/Core/AppTextInput";
import AppField from "../components/Core/AppField";
import SelectModal from "../components/Modals/SelectModal";
import { Geofence, StaticAsset } from "../types";
import {
  geofenceAlertName,
  getGeofenceCoords,
  getInitialGeofenceIgnoreBetweenState,
  makeDefaultGeofence,
} from "../utils/geofences";
import { AppModalRef } from "../components/Core/AppModal";
import AssetSelectModal from "../components/Assets/AssetSelectModal";
import { ContactSelectField } from "../components/Contacts/ContactSelectField";
import IgnoreBetweenSelect from "../components/Dates/IgnoreBetweenSelect";
import moment from "moment";
import { SwitchItem } from "../components/SwitchItem";
import AppText from "../components/Core/AppText";
import AppIcon from "../components/Core/AppIcon";
import { GeoTypes } from "../utils/enums";
import { AppBottomSheet } from "../components/Core/AppBottomSheet";
import { GeofenceEditor } from "../components/Geofences/GeofenceEditor";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { addGeofence, editGeofence } from "../redux/thunks/geofences";
import { EditGeofenceParams } from "../types/api";
import { useToast } from "../hooks/useToast";
import { useAlert } from "../hooks/useAlert";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "manage-geofence"
>;

const ManageGeofenceScreen = ({ route, navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const Toast = useToast();
  const Alert = useAlert();

  const geofenceCode = route.params?.geofenceCode;

  const notifySelectModal = useRef<AppModalRef>(null);
  const assetSelectModal = useRef<AppModalRef>(null);

  const { geofence, staticAssets } = useAppSelector((state) => ({
    geofence: geofenceCode
      ? state.geofences.data.entities[geofenceCode]
      : undefined,
    staticAssets: state.assets.staticData.entities,
  }));
  const dispatch = useAppDispatch();

  const [geofenceState, setGeofenceState] = useState<Geofence>(
    geofence || makeDefaultGeofence()
  );
  const [ignoreBetween, setIgnoreBetween] = useState(
    getInitialGeofenceIgnoreBetweenState(geofenceState)
  );
  const [mapState, setMapState] = useState<{
    centerCoord: number[];
    radius: number;
    coords: number[][];
    geoType: 1 | 2;
  }>({
    centerCoord: [geofenceState.Lng, geofenceState.Lat],
    radius: geofenceState.Radius,
    coords: getGeofenceCoords(geofenceState),
    geoType: geofenceState.GeoType,
  });
  const [loading, setLoading] = useState(false);

  console.log("GEOFENCE", geofence);
  console.log("MAPSTATE", mapState);

  const selectedAssetNames = useMemo(() => {
    return geofenceState.SelectedAssetList.reduce((acc, selectedAsset) => {
      const staticAsset = staticAssets[selectedAsset.AsCode];

      if (staticAsset) {
        return acc + (acc.length ? ", " : "") + staticAsset.name;
      } else {
        return acc;
      }
    }, "");
  }, [staticAssets, geofenceState.SelectedAssetList]);

  const handleSave = async () => {
    let data: Omit<EditGeofenceParams, "MajorToken" | "MinorToken"> = {
      Lat: mapState.centerCoord[1],
      Lng: mapState.centerCoord[0],
      Radius: mapState.radius,
      GeoType: mapState.geoType,

      Name: geofenceState.Name,
      Alerts:
        geofenceState.Alerts === 24 ? "8,16" : geofenceState.Alerts.toString(),
      Address: geofenceState.Address,
      AssetCodes: geofenceState.SelectedAssetList.map(
        (a) => a.AsCode
      ).toString(),
      ContactCodes: geofenceState.ContactList.map((c) => c.Code).toString(),
      AlertConfigState: geofenceState.State,
      Share: geofenceState.Share,

      Inverse: (ignoreBetween.enabled ? 1 : 0) as 0 | 1,
      BeginTime: moment(ignoreBetween.from).utc().format("HH:mm:ss"),
      EndTime: moment(ignoreBetween.to).utc().format("HH:mm:ss"),
      DelayTime: 0 as 0,
      CycleType: 3 as 3, // NONE = 0, TIME = 1, DATE = 2, WEEK = 3
      Days: ignoreBetween.weekdays.toString(),

      Code: geofence?.Code,

      InSpeedLimit: 0,
      RelayTime: 30,
      Relay: 0,
    };

    if (!data.Name) {
      return Alert.alert("Missing Name", "Enter a name for this geofence.");
    }
    if (!data.AssetCodes.length) {
      return Alert.alert("Missing Assets", "Add assets to this geofence.");
    }
    if (!data.Alerts) {
      return Alert.alert(
        "Missing Alarm Type",
        "Select an alarm type for this geofence."
      );
    }
    if (!mapState.coords.length) {
      return Alert.alert("Missing Geofence", "Draw your geofence on the map.");
    }
    if (mapState.coords.length && mapState.coords.length < 4) {
      return Alert.alert(
        "Incomplete Geofence",
        "Finish drawing your geofence. It should have at least for points."
      );
    }

    if (data.GeoType !== GeoTypes.CIRCLE) {
      // if (!self.isClockwise(latlngs)) {
      //   latlngs = latlngs.reverse();
      // }
      data.GeoPolygon =
        "POLYGON((" + mapState.coords.map((c) => c.join(" ")).join(",") + "))";
    }

    try {
      setLoading(true);
      if (data.Code) {
        await dispatch(editGeofence(data));
        Toast.show("Geofence edited successfully");
      } else {
        await dispatch(addGeofence(data));
        Toast.show("Geofence created successfully");
      }
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
    }
  };

  const geofenceComplete =
    geofenceState.Name &&
    geofenceState.Alerts &&
    geofenceState.SelectedAssetList.length &&
    mapState.coords.length > 3;

  return (
    <View style={theme.container}>
      {geofenceState && (
        <GeofenceEditor geofence={geofenceState} onDrawComplete={setMapState} />
      )}
      {geofenceState && (
        <AppBottomSheet
          // ref={bottomSheet}
          index={0}
          snapPoints={["25%", "85%"]}
          backgroundStyle={{ backgroundColor: colors.background }}
          style={{
            backgroundColor: colors.background,
            borderTopRightRadius: BORDER_RADIUS_MD,
            borderTopLeftRadius: BORDER_RADIUS_MD,
          }}
          handleIndicatorStyle={{ backgroundColor: colors.white }}
        >
          <View style={theme.contentContainer}>
            <View style={styles.header}>
              <AppText style={theme.titleLarge}>Geofence</AppText>

              {loading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Pressable onPress={handleSave} style={theme.row}>
                  <AppText
                    style={{
                      color: geofenceComplete ? colors.primary : colors.empty,
                      marginEnd: spacing("sm"),
                    }}
                  >
                    Save
                  </AppText>
                  <AppIcon
                    color={geofenceComplete ? colors.primary : colors.empty}
                    name={"check-circle"}
                    size={iconSize("md")}
                  />
                </Pressable>
              )}
            </View>
            <AppField
              value={selectedAssetNames}
              onPress={() => assetSelectModal.current?.open()}
              placeholder="Assets"
            />
            <AppTextInput
              value={geofenceState.Name}
              placeholder="Name"
              onChangeText={(Name) => setGeofenceState((g) => ({ ...g, Name }))}
            />
            <AppTextInput
              value={geofenceState.Address}
              placeholder="Address"
              onChangeText={(Address) =>
                setGeofenceState((g) => ({ ...g, Address }))
              }
            />
            <AppField
              value={geofenceAlertName(geofenceState.Alerts)}
              placeholder="Alarm Type"
              onPress={() => notifySelectModal.current?.open()}
            />
            <ContactSelectField
              customerCodes={geofenceState.ContactList.map((c) => c.Code)}
              onSelect={(contacts) => {
                setGeofenceState((g) => ({
                  ...g,
                  ContactList: contacts.map((c) => ({
                    Code: c.Code,
                    Mail: c.EMail,
                  })),
                }));
              }}
              title={"Notify Emails"}
            />
            <IgnoreBetweenSelect
              from={ignoreBetween.from}
              to={ignoreBetween.to}
              onChangeFrom={(ignoreFrom) =>
                setIgnoreBetween((i) => ({ ...i, from: ignoreFrom }))
              }
              onChangeTo={(ignoreTo) =>
                setIgnoreBetween((i) => ({ ...i, to: ignoreTo }))
              }
              headerStyle={styles.ignoreBetweenHeader}
              style={styles.ignoreBetweenSelect}
              weekDays={ignoreBetween.weekdays}
              onChangeWeekDays={(ignoreOnDays) =>
                setIgnoreBetween((i) => ({ ...i, weekdays: ignoreOnDays }))
              }
              enabled={ignoreBetween.enabled}
              title={"Ignore Alarms Schedule"}
              onToggleEnabled={(ignoreEnabled) =>
                setIgnoreBetween((i) => ({ ...i, enabled: ignoreEnabled }))
              }
            />

            <SwitchItem
              title="Share"
              theme={theme}
              colors={colors}
              value={geofenceState.Share === 1}
              onChange={(enabled: boolean) =>
                setGeofenceState((g) => ({ ...g, Share: enabled ? 1 : 0 }))
              }
            />

            <SwitchItem
              title="Active"
              theme={theme}
              colors={colors}
              value={geofenceState.State === 1}
              onChange={(enabled: boolean) =>
                setGeofenceState((g) => ({ ...g, State: enabled ? 1 : 0 }))
              }
            />

            <AssetSelectModal
              ref={assetSelectModal}
              onSelect={(data: StaticAsset[]) => {
                setGeofenceState((g) => ({
                  ...g,
                  SelectedAssetList: data.map((a) => ({
                    IMEI: a.imei,
                    AsCode: a.id,
                  })),
                }));
              }}
              initialSelectedIds={geofenceState.SelectedAssetList.map(
                (a) => a.AsCode
              )}
            />
            <SelectModal
              ref={notifySelectModal}
              data={notifySelectData}
              onSelect={(data: { id: number; name: string }[]) => {
                setGeofenceState((g) => ({
                  ...g,
                  Alerts: data.reduce((acc, d) => acc + d.id, 0) as unknown as
                    | 8
                    | 16
                    | 24,
                }));
              }}
              hideSearch
              modalTitle="Alarm Type"
              initialSelectedIds={
                geofenceState.Alerts === 24 ? [16, 8] : [geofenceState.Alerts]
              }
            />
          </View>
        </AppBottomSheet>
      )}
      <StatusBar style="dark" />
    </View>
  );
};

const notifySelectData = [
  { id: 16, name: "Out" },
  { id: 8, name: "In" },
];

const styles = StyleSheet.create({
  ignoreBetweenHeader: { marginTop: spacing("md") },
  ignoreBetweenSelect: { marginBottom: spacing("md") },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: spacing("md"),
    justifyContent: "space-between",
  },
});

export default ManageGeofenceScreen;
