import moment from "moment";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { iconSize, spacing } from "../../styles";
import { SharedAssetListData } from "../../types";
import { ThemeProps } from "../../types/styles";
import AppIcon from "../Core/AppIcon";
import AppText from "../Core/AppText";
import * as Clipboard from "expo-clipboard";
import { useToast } from "../../hooks/useToast";
import { Constants } from "../../utils/constants";

type Props = {
  sharedAsset: SharedAssetListData;
  onPress: (sharedAsset: SharedAssetListData) => void;
  onOptionsPress: (sharedAsset: SharedAssetListData) => void;
} & ThemeProps;

const SharedAssetItem = ({
  sharedAsset,
  theme,
  colors,
  onPress,
  onOptionsPress,
}: Props) => {
  const Toast = useToast();

  const formattedEndTime = useMemo(() => {
    return moment(sharedAsset.EndTime).format(
      Constants.MOMENT_DATE_TIME_FORMAT
    );
  }, [sharedAsset.EndTime]);

  const copyCode = async () => {
    try {
      await Clipboard.setStringAsync(sharedAsset.Code);
      Toast.show("Share Code Copied");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable style={styles.container} onPress={() => onPress(sharedAsset)}>
      <View style={styles.inner}>
        <AppText style={styles.contactText}>
          {sharedAsset.asset ? sharedAsset.asset.name : sharedAsset.IMEI}
        </AppText>
        <View style={theme.row}>
          <AppIcon
            size={iconSize("sm")}
            color={colors.primary}
            name={"minus-box"}
            style={styles.icon}
          />
          <AppText
            style={[{ marginRight: spacing("xl") }, theme.textSmallMeta]}
          >
            {formattedEndTime}
          </AppText>
          <Pressable style={theme.row} onPress={copyCode}>
            <AppIcon
              size={iconSize("sm")}
              color={colors.primary}
              name={"pound-box"}
              style={styles.icon}
            />
            <AppText style={theme.textSmallMeta}>{sharedAsset.Code}</AppText>
          </Pressable>
        </View>
      </View>
      <Pressable hitSlop={10} onPress={() => onOptionsPress(sharedAsset)}>
        <AppIcon
          name={"dots-vertical"}
          size={iconSize("md")}
          color={colors.primary}
        />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing("md"),
    flexDirection: "row",
    alignItems: "center",
  },
  inner: { flex: 1 },
  contactText: { marginBottom: spacing("sm") },
  icon: { marginRight: 5 },
});

export default SharedAssetItem;
