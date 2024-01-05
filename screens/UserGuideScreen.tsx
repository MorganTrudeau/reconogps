import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation/utils";
import { Platform } from "react-native";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "user-guide">;

const pdfUrl = "https://manuals.reconogps.com/app-guide.pdf";
const uri = Platform.select({
  android: `https://docs.google.com/gview?embedded=true&url=${pdfUrl}`,
  default: pdfUrl,
});
const source = {
  uri,
};

const UserGuideScreen = ({}: NavigationProps) => {
  const { colors } = useTheme();
  return (
    <WebView source={source} style={{ backgroundColor: colors.background }} />
  );
};

export default UserGuideScreen;
