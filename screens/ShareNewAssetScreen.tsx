import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Modalize } from "react-native-modalize";
import AssetSelectModal from "../components/Assets/AssetSelectModal";
import AppField from "../components/Core/AppField";
import AppScrollView from "../components/Core/AppScrollView";
import AppTextInput from "../components/Core/AppTextInput";
import { useAlert } from "../hooks/useAlert";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { useHeaderRightSave } from "../hooks/useHeaderRightSave";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation/utils";
import { getMySharedAssets } from "../redux/selectors/sharedAssets";
import { startSharingAsset } from "../redux/thunks/sharedAssets";
import { StaticAsset } from "../types";
import { validateNumber } from "../utils";
import { FormContext } from "../context/FormContext";
import ShareAssetForm from "../components/Assets/ShareAssetForm";
import { useFormHeader } from "../hooks/useFormHeader";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "share-new-asset"
>;

const ShareNewAssetScreen = ({ navigation }: NavigationProps) => {
  const mySharedAssets = useAppSelector((state) => getMySharedAssets(state));
  const { theme } = useTheme();
  const { setSaveButton } = useFormHeader(navigation);
  return (
    <FormContext.Provider value={{ setSaveButton }}>
      <ShareAssetForm mySharedAssets={mySharedAssets} theme={theme} />
    </FormContext.Provider>
  );
};

export default ShareNewAssetScreen;
