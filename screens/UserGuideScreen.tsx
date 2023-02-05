import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../RootStackParamList";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "user-guide">;

const UserGuideScreen = ({ navigation }: NavigationProps) => {
  const { colors } = useTheme();

  return (
    <WebView
      source={{
        uri: `https://manuals.reconogps.com/app-guide.pdf`,
      }}
      style={{ backgroundColor: colors.background }}
    />
  );
};

export default UserGuideScreen;
