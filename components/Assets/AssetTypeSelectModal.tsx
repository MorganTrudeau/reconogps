import { Portal } from "@gorhom/portal";
import React, { forwardRef, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { iconSize, spacing } from "../../styles";
import {
  getAssetTypeIcon,
  getAssetTypeName,
  sortAssetTypes,
} from "../../utils/assets";
import AppIcon from "../Core/AppIcon";
import AppText from "../Core/AppText";
import ModalHeader from "../Modals/ModalHeader";

type AssetTypeSelectProps = {
  assetTypes: string[];
  onTypeChange: (type: string) => void;
};

const AssetTypeSelect = ({
  assetTypes,
  onTypeChange,
}: AssetTypeSelectProps) => {
  const { theme, colors } = useTheme();

  const renderType = (type: string) => {
    return (
      <Pressable
        key={type}
        style={[styles.typeItem, theme.borderBottom]}
        onPress={() => onTypeChange(type)}
      >
        <AppIcon
          name={getAssetTypeIcon(type)}
          color={colors.primary}
          size={iconSize("lg")}
          style={{ marginRight: spacing("lg") }}
        />
        <AppText style={theme.title}>{getAssetTypeName(type)}</AppText>
      </Pressable>
    );
  };

  return <View>{assetTypes.map(renderType)}</View>;
};

type AssetTypeSelectModalProps = AssetTypeSelectProps & {};

const AssetTypeSelectModal = forwardRef<Modalize, AssetTypeSelectModalProps>(
  (props, ref) => {
    const { theme, colors } = useTheme();
    const insets = useSafeAreaInsets();

    const closeModal = () => {
      ref && "current" in ref && ref.current?.close();
    };

    const renderHeader = () => {
      return (
        <ModalHeader
          onRequestClose={closeModal}
          title={"Asset Type"}
          theme={theme}
          colors={colors}
          showSearch={false}
        />
      );
    };

    return (
      <Portal>
        <Modalize
          ref={ref}
          modalStyle={theme.container}
          HeaderComponent={renderHeader()}
          scrollViewProps={{
            contentContainerStyle: {
              paddingBottom: insets.bottom + spacing("md"),
            },
          }}
        >
          <AssetTypeSelect {...props} />
        </Modalize>
      </Portal>
    );
  }
);

export default AssetTypeSelectModal;

const styles = StyleSheet.create({
  typeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing("lg"),
    paddingVertical: spacing("md"),
  },
});
