import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootStackParamList } from "../navigation/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import EmptyList from "../components/EmptyList";
import EditAsset from "../components/Assets/EditAsset";
import { useFormHeader } from "../hooks/useFormHeader";
import { FormContext } from "../context/FormContext";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "edit-asset">;

const AssetEditScreen = ({ navigation, route }: NavigationProps) => {
  const { theme, colors } = useTheme();

  const { asset, assetTypes, majorToken, minorToken } = useAppSelector(
    (state) => ({
      asset: state.assets.staticData.entities[route.params.id],
      assetTypes: state.activeUser.assetTypes,
      majorToken: state.auth.majorToken as string,
      minorToken: state.auth.minorToken as string,
    })
  );

  const { setSaveButton } = useFormHeader(navigation);
  const contextValue = useMemo(() => ({ setSaveButton }), [setSaveButton]);

  return (
    <FormContext.Provider value={contextValue}>
      <View style={theme.container}>
        {!asset ? (
          <EmptyList
            icon="truck"
            message="Asset not found"
            theme={theme}
            colors={colors}
          />
        ) : (
          <EditAsset asset={asset} assetTypes={assetTypes} theme={theme} />
        )}
      </View>
    </FormContext.Provider>
  );
};

export default AssetEditScreen;
