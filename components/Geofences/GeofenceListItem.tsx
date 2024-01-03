import React from "react";
import AppText from "../Core/AppText";
import { Pressable, StyleSheet, View } from "react-native";
import { Geofence } from "../../types";
import AppIcon from "../Core/AppIcon";
import { iconSize, spacing } from "../../styles";
import { useTheme } from "../../hooks/useTheme";
import { useAppSelector } from "../../hooks/useAppSelector";

export const GeofenceListItem = ({
  geofence,
  onPress,
  onOptionsPress,
}: {
  geofence: Geofence;
  onPress: (geofence: Geofence) => void;
  onOptionsPress?: (geofence: Geofence) => void;
}) => {
  const { colors, theme } = useTheme();

  const toggleActive = useAppSelector(
    (state) => state.geofences.toggleActive === geofence.Code
  );

  return (
    <Pressable onPress={() => onPress(geofence)} style={styles.container}>
      <View style={theme.flex}>
        <AppText>{geofence.Name}</AppText>
        {!!geofence.Address && (
          <AppText style={[theme.textSmallMeta, , styles.address]}>
            {geofence.Address}
          </AppText>
        )}
      </View>
      <View
        style={[
          styles.stateIndicator,
          {
            backgroundColor: toggleActive
              ? colors.empty
              : geofence.State
              ? colors.green
              : colors.red,
          },
        ]}
      />
      {typeof onOptionsPress === "function" && (
        <AppIcon
          name="dots-vertical"
          color={colors.primary}
          size={iconSize("md")}
          onPress={() => onOptionsPress(geofence)}
          style={styles.icon}
        />
      )}
    </Pressable>
  );
};

const STATE_INDICATOR_SIZE = 10;

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing("md"),
    flexDirection: "row",
    alignItems: "center",
  },
  address: { marginTop: spacing("xs") },
  stateIndicator: {
    height: STATE_INDICATOR_SIZE,
    width: STATE_INDICATOR_SIZE,
    borderRadius: STATE_INDICATOR_SIZE / 2,
    marginRight: spacing("md"),
  },
  icon: { marginRight: -spacing("sm") },
});
