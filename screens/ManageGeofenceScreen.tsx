import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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
  getInitialGeofenceIgnoreBetweenState,
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

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "manage-geofence"
>;

const ManageGeofenceScreen = ({ route, navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();

  const geofenceCode = route.params?.geofenceCode;

  const notifySelectModal = useRef<AppModalRef>(null);
  const assetSelectModal = useRef<AppModalRef>(null);

  const { geofence, staticAssets } = useAppSelector((state) => ({
    geofence: geofenceCode
      ? state.geofences.data.entities[geofenceCode]
      : undefined,
    staticAssets: state.assets.staticData.entities,
  }));

  useEffect(() => {
    if (!geofenceCode) {
      navigation.goBack();
    }
  }, []);

  const [geofenceState, setGeofenceState] = useState<Geofence>(
    geofence as Geofence
  );
  const [ignoreBetween, setIgnoreBetween] = useState(
    getInitialGeofenceIgnoreBetweenState(geofenceState)
  );
  const [mapState, setMapState] = useState({
    lat: 0,
    lng: 0,
    radius: 0,
    coords: [],
    geoType: GeoTypes.CIRCLE,
  });

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
    let data = {
      Lat: mapState.lat,
      Lng: mapState.lng,
      Radius: mapState.radius,
      GeoType: mapState.geoType,
      GeoPolygon: "",
      Name: geofenceState.Name,
      Alerts: geofenceState.Alerts,
      Address: geofenceState.Address,
      AssetCodes: geofenceState.SelectedAssetList.map((a) => a.AsCode),
      ContactCodes: geofenceState.ContactList.map((c) => c.Code),
      AlertConfigState: geofenceState.State,
      Share: geofenceState.Share,

      Inverse: ignoreBetween.enabled ? 1 : 0,
      BeginTime: moment(ignoreBetween.from).utc().format("HH:mm:ss"),
      EndTime: moment(ignoreBetween.to).utc().format("HH:mm:ss"),
      DelayTime: 0,
      CycleType: 3, // NONE = 0, TIME = 1, DATE = 2, WEEK = 3
      Days: ignoreBetween.weekdays.toString(),
      Code: geofence?.Code,
    };

    if (geofenceState.GeoType !== GeoTypes.CIRCLE) {
      // if (!self.isClockwise(latlngs)) {
      //   latlngs = latlngs.reverse();
      // }
      data.GeoPolygon = "POLYGON((" + mapState.coords.join(",") + "))";
    }
  };

  return (
    <View style={theme.container}>
      {geofenceState && <GeofenceEditor geofence={geofenceState} />}
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

              <Pressable onPress={handleSave} style={theme.row}>
                <AppText
                  style={{ color: colors.primary, marginEnd: spacing("sm") }}
                >
                  Save
                </AppText>
                <AppIcon
                  color={colors.primary}
                  name={"check-circle"}
                  size={iconSize("md")}
                />
              </Pressable>
            </View>
            <AppField
              value={selectedAssetNames}
              onPress={() => assetSelectModal.current?.open()}
              placeholder="Assets"
            />
            <AppTextInput value={geofenceState.Name} placeholder="Name" />
            <AppTextInput value={geofenceState.Address} placeholder="Address" />
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
              enabled={!!geofenceState.Week.length}
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
                  Alerts: data.reduce((acc, d) => acc + d.id, 0),
                }));
              }}
              hideSearch
              modalTitle="Alarm Type"
              initialSelectedIds={[geofenceState.Alerts]}
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
