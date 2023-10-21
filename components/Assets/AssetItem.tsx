import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { iconSize, spacing } from "../../styles";
import { CombinedAsset, StaticAsset } from "../../types";
import AppText from "../Core/AppText";
import { usePlaceholderLoader } from "../../hooks/usePlaceholderLoader";
import Placeholder from "../Placeholder";
import AssetAvatar from "./AssetAvatar";
import { useAppSelector } from "../../hooks/useAppSelector";
import { ThemeProps } from "../../types/styles";
import AppIcon from "../Core/AppIcon";
import { IconSet } from "../../utils/enums";
import { geocodeLatLong } from "../../api/position";

type Props = {
  asset: StaticAsset;
  onPress?: (asset: CombinedAsset) => void;
  showDetails?: boolean;
} & ThemeProps;

const AssetItem = ({
  asset,
  onPress,
  theme,
  colors,
  showDetails = true,
}: Props) => {
  const dynamicData = useAppSelector(
    (state) => state.assets.dynamicData.entities[asset.id]
  );

  const [address, setAddress] = useState(undefined);

  const lat = dynamicData?.lat;
  const lng = dynamicData?.lng;

  const getAddress = async (lat: number, lng: number) => {
    try {
      const address = await geocodeLatLong(lat, lng);
      setAddress(address);
    } catch (error) {
      console.log("Failed to find address: ", error);
    }
  };

  useEffect(() => {
    if (lat && lng && showDetails) {
      getAddress(lat, lng);
    }
  }, [lat, lng, showDetails]);

  const isMoving = dynamicData && dynamicData.speed > 0;

  return (
    <Pressable
      style={styles.container}
      disabled={!onPress}
      onPress={() =>
        onPress &&
        asset &&
        onPress({ staticData: asset, dynamicData: dynamicData })
      }
    >
      <AssetAvatar asset={asset} />
      <View style={styles.content}>
        <AppText>{asset.name}</AppText>
        {!dynamicData ? (
          <>
            <Placeholder
              loading={true}
              {...{ height: 6, width: 150 }}
              style={styles.placeholder1}
            />
          </>
        ) : (
          <View style={{ paddingTop: spacing("xs") }}>
            {isMoving ? (
              <AppText style={[theme.textSmall, { color: colors.green }]}>
                Moving
              </AppText>
            ) : (
              <AppText style={theme.textSmallMeta}>
                Last Update {dynamicData.positionTime}
              </AppText>
            )}
            {showDetails && (
              <View style={[theme.row, { marginTop: spacing("sm") }]}>
                <View style={theme.row}>
                  <AppIcon
                    name={isMoving ? IconSet.speedFast : IconSet.speedSlow}
                    color={colors.primary}
                    style={{ marginRight: 5 }}
                    size={iconSize("xs")}
                  />
                  <AppText
                    style={[theme.textSmall, { marginRight: spacing("md") }]}
                  >
                    {dynamicData.speed} km/h
                  </AppText>
                  <AppIcon
                    name={IconSet.voltage}
                    color={colors.primary}
                    style={{ marginRight: 2 }}
                    size={iconSize("xs")}
                  />
                  <AppText style={theme.textSmall}>
                    {dynamicData.alt.toFixed(1)}
                  </AppText>
                </View>
              </View>
            )}
          </View>
        )}
        {showDetails ? (
          address ? (
            <View style={styles.addressContainer}>
              <AppIcon
                name={IconSet.location}
                color={colors.primary}
                style={{ marginRight: 5 }}
                size={iconSize("xs")}
              />
              <AppText
                style={[
                  theme.textSmall,
                  {
                    flexShrink: 1,
                    marginRight: spacing("md"),
                  },
                ]}
              >
                {address}
              </AppText>
            </View>
          ) : (
            <Placeholder
              loading={true}
              style={styles.placeholder2}
              {...{ height: 6, width: 120 }}
            />
          )
        ) : null}
      </View>
    </Pressable>
  );
};

const ICON_SIZE = 45;

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing("md"),
    paddingHorizontal: spacing("lg"),
    flexDirection: "row",
  },
  content: { flex: 1 },
  addressContainer: {
    flexDirection: "row",
    paddingTop: spacing("sm"),
    flex: 1,
  },
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    marginRight: spacing("lg"),
  },
  placeholder1: {
    marginTop: spacing("md"),
  },
  placeholder2: {
    marginTop: 4,
  },
  infoIcon: { marginRight: 5 },
});

export default AssetItem;
