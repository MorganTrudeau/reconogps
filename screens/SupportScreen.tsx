import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../RootStackParamList";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "support">;

const SupportScreen = ({ navigation }: NavigationProps) => {
  const { colors } = useTheme();

  return (
    <WebView
      source={{
        uri: `https://support.reconogps.com`,
      }}
      style={{ backgroundColor: colors.background }}
    />
  );
};

export default SupportScreen;
