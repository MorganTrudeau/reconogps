import { Portal } from "@gorhom/portal";
import React, { forwardRef, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { useTheme } from "../../hooks/useTheme";
import { iconSize, spacing } from "../../styles";
import { timeZones } from "../../utils/data";
import AppText from "../Core/AppText";
import AppTextInput from "../Core/AppTextInput";
import AppIcon from "../Core/AppIcon";

type Props = {
  selectedTimeZoneId: string | null | undefined;
  onSelect: (timeZoneId: string | undefined) => void;
};

const TimeZoneModal = forwardRef<Modalize, Props>(
  ({ selectedTimeZoneId, onSelect }, ref) => {
    const { theme, colors } = useTheme();

    const [search, setSearch] = useState("");

    const closeModal = () => {
      ref && "current" in ref && ref.current?.close();
    };

    const renderTimeZone = ({
      item,
    }: {
      item: { value: string; name: string };
    }) => {
      const isSelected = item.value === selectedTimeZoneId;

      return (
        <Pressable
          style={styles.item}
          onPress={() => {
            onSelect(item.value);
          }}
        >
          <AppText numberOfLines={1} ellipsizeMode={"tail"} style={{ flex: 1 }}>
            {item.name}
          </AppText>
          {isSelected && (
            <AppIcon
              name={"check-circle"}
              size={iconSize("md")}
              color={colors.primary}
              style={styles.check}
            />
          )}
        </Pressable>
      );
    };

    const renderHeader = () => {
      return (
        <View style={styles.header}>
          <View style={theme.row}>
            <AppText style={[theme.titleLarge, { flex: 1 }]}>Time Zone</AppText>
            <Pressable onPress={closeModal}>
              <AppIcon
                name={"close"}
                color={colors.primary}
                size={iconSize("md")}
              />
            </Pressable>
          </View>
          <AppTextInput
            style={{ marginTop: spacing("md") }}
            placeholder={"Search"}
            animatedPlaceholder={false}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      );
    };

    const filteredTimeZones = useMemo(() => {
      if (!search) {
        return timeZones;
      }
      return timeZones.filter((t) =>
        t.name.toUpperCase().includes(search.toUpperCase())
      );
    }, [search]);

    return (
      <Portal>
        <Modalize
          ref={ref}
          modalStyle={theme.container}
          HeaderComponent={renderHeader()}
          flatListProps={{
            data: filteredTimeZones,
            renderItem: renderTimeZone,
            bounces: false,
          }}
        />
      </Portal>
    );
  }
);

const CHECK_ICON_SIZE = iconSize("md");

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing("lg"),
    paddingVertical: spacing("md"),
  },
  item: {
    paddingHorizontal: spacing("lg"),
    paddingVertical: spacing("md"),
    flexDirection: "row",
    alignItems: "center",
    paddingRight: CHECK_ICON_SIZE + spacing("lg") * 2,
  },
  check: { position: "absolute", right: spacing("lg") },
});

export default TimeZoneModal;
