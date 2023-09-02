import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { iconSize, spacing } from "../../styles";
import AppIcon from "../Core/AppIcon";
import AppText from "../Core/AppText";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../hooks/useTheme";
import { Colors, MaterialIcon, Theme } from "../../types/styles";
import moment from "moment";
import { geocodeLatLong } from "../../api/position";
import { formatDuration } from "../../utils/dates";
import {
  IsImmobilisationSupported,
  IsLockDoorSupported,
  getAssetDirection,
  getMileage,
  isDoorLocked,
  isGeolocked,
  isImmobilized,
} from "../../utils/assets";
import AppSwitch from "../Core/AppSwitch";
import { userHasAllPermissions } from "../../utils/user";
import { IconSet } from "../../utils/enums";
import { changeGeolockStatus, changeRelayStatus } from "../../api/assets";
import { useToast } from "../../hooks/useToast";

export const AssetDetail = ({ assetId }: { assetId: string }) => {
  const { theme, colors } = useTheme();
  const Toast = useToast();

  const { dynamicAsset, staticAsset, activeUser, majorToken, minorToken } =
    useAppSelector((state) => ({
      minorToken: state.auth.minorToken as string,
      majorToken: state.auth.majorToken as string,
      dynamicAsset: state.assets.dynamicData.entities[assetId],
      staticAsset: state.assets.staticData.entities[assetId],
      activeUser: state.activeUser.data,
    }));

  const [address, setAddress] = useState(undefined);

  const lat = dynamicAsset?.lat;
  const lng = dynamicAsset?.lng;

  const getAddress = async (lat: number, lng: number) => {
    try {
      const address = await geocodeLatLong(lat, lng);
      setAddress(address);
    } catch (error) {
      console.log("Failed to find address: ", error);
    }
  };

  console.log(staticAsset);

  // Permissions
  const allPermissions = activeUser && userHasAllPermissions(activeUser);
  const immobilisationSupported =
    staticAsset && IsImmobilisationSupported(staticAsset);
  const lockDoorSupported = staticAsset && IsLockDoorSupported(staticAsset);

  // State
  const [geoLocked, setGeoLocked] = useState(
    staticAsset && isGeolocked(staticAsset)
  );
  const [doorLocked, setDoorLocked] = useState(
    lockDoorSupported && isDoorLocked(staticAsset)
  );
  const [immobilized, setImmobilized] = useState(
    immobilisationSupported && isImmobilized(staticAsset)
  );

  console.log(assetId);

  // Toggle states
  const changingGeolock = useRef(false);
  const handleGeoLock = async (enabled: boolean) => {
    if (changingGeolock.current) {
      return;
    }

    changingGeolock.current = true;
    setGeoLocked(enabled);

    try {
      await changeGeolockStatus(
        majorToken,
        minorToken,
        assetId,
        enabled ? "on" : "off"
      );
      Toast.show(
        `Geofences ${enabled ? "enabled" : "disabled"} for this asset`
      );
      changingGeolock.current = false;
    } catch (error) {
      changingGeolock.current = false;
    }
  };

  const handleDoorLock = (enabled: boolean) => {
    setDoorLocked(enabled);
  };

  const changingImmobilization = useRef(false);
  const handleToggleImmobilization = async (enabled: boolean) => {
    if (changingImmobilization.current) {
      return;
    }

    changingImmobilization.current = true;
    setImmobilized(enabled);

    try {
      await changeRelayStatus(
        majorToken,
        minorToken,
        assetId,
        enabled ? "on" : "off"
      );
      Toast.show(`Immobilization ${enabled ? "enabled" : "disabled"}`);
      changingImmobilization.current = false;
    } catch (error) {
      changingImmobilization.current = false;
    }
  };

  useEffect(() => {
    if (lat && lng) {
      getAddress(lat, lng);
    }
  }, [lat, lng]);

  if (!(dynamicAsset && staticAsset)) {
    return <ActivityIndicator color={colors.primary} />;
  }

  const isMoving = dynamicAsset.speed > 0;
  const ignitionStatus = (dynamicAsset.status & 1) > 0 ? "ON" : "OFF";

  return (
    <>
      <View style={styles.statusFeatureBar}>
        <StatusFeature
          theme={theme}
          icon={"power"}
          title={"Ignition"}
          status={ignitionStatus}
          colors={colors}
          iconColor={ignitionStatus === "OFF" ? colors.red : colors.green}
        />
        <StatusFeature
          theme={theme}
          icon={"speedometer"}
          title={"Speed"}
          status={dynamicAsset.speed + staticAsset.speedUnit.toLowerCase()}
          colors={colors}
        />
        <StatusFeature
          theme={theme}
          icon={"compass-outline"}
          title={"Direction"}
          status={getAssetDirection(dynamicAsset)}
          colors={colors}
        />
      </View>
      <View style={styles.statusBarSection}>
        <StatusBar
          theme={theme}
          icon={"satellite-uplink"}
          title={"Updated"}
          status={moment(dynamicAsset.positionTime).fromNow()}
          colors={colors}
        />
      </View>
      {(immobilisationSupported || lockDoorSupported) && (
        <View style={styles.statusBarSection}>
          {allPermissions && (
            <StatusBar
              theme={theme}
              icon={IconSet.geofences}
              title={"Geofences"}
              status={geoLocked ? "Enabled" : "Disabled"}
              colors={colors}
              onToggle={handleGeoLock}
              toggleValue={geoLocked}
            />
          )}
          {immobilisationSupported && (
            <StatusBar
              theme={theme}
              icon={"lock"}
              title={"Immobilization"}
              status={immobilized ? "Enabled" : "Disabled"}
              colors={colors}
              onToggle={handleToggleImmobilization}
              toggleValue={immobilized}
            />
          )}
          {lockDoorSupported && (
            <StatusBar
              theme={theme}
              icon={"car-door-lock"}
              title={"Door Lock"}
              status={doorLocked ? "Enabled" : "Disabled"}
              colors={colors}
              onToggle={handleDoorLock}
              toggleValue={doorLocked}
            />
          )}
        </View>
      )}
      <View style={styles.statusBarSection}>
        <StatusBar
          theme={theme}
          icon={"map-marker-radius"}
          title={"Location"}
          status={address}
          colors={colors}
        />
        <StatusBar
          theme={theme}
          icon={"pause-octagon"}
          title={"Time stopped"}
          status={formatDuration(dynamicAsset.staticTime)}
          colors={colors}
        />
      </View>
      <View style={styles.statusBarSection}>
        <StatusBar
          theme={theme}
          icon={"battery-charging"}
          title={"Battery voltage"}
          status={dynamicAsset.alt + "V"}
          colors={colors}
        />
        <StatusBar
          theme={theme}
          icon={"engine"}
          title={"Engine hours"}
          status={moment().diff(dynamicAsset.launchHours * 1000, "hours") + "h"}
          colors={colors}
        />
        <StatusBar
          theme={theme}
          icon={"road-variant"}
          title={"Mileage"}
          status={getMileage(dynamicAsset, staticAsset)}
          colors={colors}
        />
      </View>
    </>
  );
};

const StatusBar = ({
  icon,
  title,
  status,
  theme,
  colors,
  iconColor,
  onToggle,
  toggleValue,
}: {
  icon: MaterialIcon;
  title: string;
  status: string | number | null | undefined;
  theme: Theme;
  colors: Colors;
  iconColor?: string;
  onToggle?: (enabled: boolean) => void;
  toggleValue?: boolean;
}) => {
  return (
    <View
      style={[styles.statusBarContainer, { backgroundColor: colors.surface }]}
    >
      <AppIcon
        name={icon}
        size={iconSize("lg")}
        color={iconColor || colors.primary}
        style={styles.statusBarIcon}
      />
      <View style={{ flex: 1 }}>
        <AppText style={theme.textSmallMeta}>{title}</AppText>
        <AppText style={[theme.text, { marginTop: spacing("xs") }]}>
          {status}
        </AppText>
      </View>
      {typeof onToggle === "function" && (
        <AppSwitch value={!!toggleValue} onValueChange={onToggle} />
      )}
    </View>
  );
};

const StatusFeature = ({
  icon,
  title,
  status,
  theme,
  colors,
  iconColor,
}: {
  icon: MaterialIcon;
  title: string;
  status: string | number | null | undefined;
  theme: Theme;
  colors: Colors;
  iconColor?: string;
}) => {
  return (
    <View style={styles.statusFeatureContainer}>
      <AppIcon
        name={icon}
        size={45}
        color={iconColor || colors.primary}
        style={styles.statusFeatureIcon}
      />
      <AppText style={[theme.title, styles.statusTitle]}>{status}</AppText>
      <AppText style={theme.textSmallMeta}>{title}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  statusFeatureBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusFeatureContainer: {
    padding: spacing("md"),
    paddingVertical: spacing("xl"),
    alignItems: "center",
    flex: 1,
  },
  statusFeatureIcon: { marginBottom: spacing("sm") },
  statusTitle: { textAlign: "center" },

  statusBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing("md"),
    marginVertical: 1,
    // alignItems: "center",
    // flex: 1,
  },
  statusBarIcon: { marginEnd: spacing("lg") },
  statusBarSection: { paddingVertical: spacing("sm") },
});
