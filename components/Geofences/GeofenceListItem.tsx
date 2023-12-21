import React, { useMemo, useRef } from "react";
import AppText from "../Core/AppText";
import { Pressable, StyleSheet, View } from "react-native";
import { Geofence } from "../../types";
import AppIcon from "../Core/AppIcon";
import { iconSize, spacing } from "../../styles";
import { useTheme } from "../../hooks/useTheme";
import OptionsModal, { OptionModalItem } from "../Modals/OptionsModal";
import { AppModalRef } from "../Core/AppModal";

export const GeofenceListItem = ({
  geofence,
  onPress,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  geofence: Geofence;
  onPress: (geofence: Geofence) => void;
  onEdit?: (geofence: Geofence) => void;
  onToggleActive?: (geofence: Geofence) => void;
  onDelete?: (geofence: Geofence) => void;
}) => {
  const { colors, theme } = useTheme();

  const optionsModal = useRef<AppModalRef>(null);

  const options = useMemo(() => {
    const _options: OptionModalItem[] = [];

    if (onEdit) {
      _options.push({
        value: "edit",
        onPress: () => onEdit(geofence),
        icon: "note-edit",
        text: "Edit",
      });
    }

    if (onToggleActive) {
      _options.push({
        value: "toggle-active",
        onPress: () => onToggleActive(geofence),
        icon: geofence.State === 1 ? "broadcast-off" : "broadcast",
        text: geofence.State === 1 ? "Deactivate" : "Activate",
      });
    }

    if (onDelete) {
      _options.push({
        value: "delete",
        onPress: () => onDelete(geofence),
        icon: "trash-can",
        text: "Delete",
      });
    }

    return _options;
  }, [geofence]);

  return (
    <>
      <Pressable onPress={() => onPress(geofence)} style={styles.container}>
        <View style={theme.flex}>
          <AppText>{geofence.Name}</AppText>
          {!!geofence.Address && (
            <AppText style={[theme.textSmallMeta, , styles.address]}>
              {geofence.Address}
            </AppText>
          )}
        </View>
        <AppIcon
          name="dots-vertical"
          color={colors.primary}
          size={iconSize("md")}
          onPress={() => optionsModal.current?.open()}
        />
        {!!options.length && (
          <OptionsModal options={options} ref={optionsModal} />
        )}
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing("md"),
    flexDirection: "row",
    alignItems: "center",
  },
  address: { marginTop: spacing("xs") },
});
