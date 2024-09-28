import { useMemo } from "react";
import { View } from "react-native";
import WebView from "react-native-webview";
import { getHeaderHeight, RootStackParamList } from "../navigation/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "street-view"
>;

const StreetViewScreen = ({ route }: NavigationProps) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { latitude, longitude } = route.params;

  const html = useMemo(() => {
    return `<!DOCTYPE html>
<!--
         @license
         Copyright 2019 Google LLC. All Rights Reserved.
         SPDX-License-Identifier: Apache-2.0
        -->
<html>
  <head>
     <meta charset="utf-8" 
          name="viewport" 
          content="width=device-width, 
                   initial-scale=1.0" />
    <title>Street View split-map-panes</title>
    <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIZhMtfF3RkEWMu39efN8ICvVFL9Yf8SQ"
      defer
    ></script>
    <!-- jsFiddle will insert css and js -->
    <style>
      html,
      body {
        height: 100%;
        margin: 0;
        padding: 0;
      }

      #map,
      #pano {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="pano" style="padding=30px"></div>
    <div id="control"></div>

    <script>
      function initialize() {
        const fenway = { lat: ${latitude}, lng: ${longitude} };

        const panorama = new google.maps.StreetViewPanorama(
          document.getElementById("pano"),
          {
            position: fenway,
            pov: {
              heading: 34,
              pitch: 10,
            },
          }
        );
      }
      window.onload = function () {
        initialize();
      };
    </script>
  </body>
</html>
`;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: colors.background,
      }}
    >
      <WebView
        source={{ html }}
        style={{ flex: 1 }}
        injectedJavaScriptBeforeContentLoaded={`
        window.onerror = function(message, sourcefile, lineno, colno, error) {
          alert("Message: " + message + " - Source: " + sourcefile + " Line: " + lineno + ":" + colno);
          return true;
          };
          true;
          `}
      />
    </View>
  );
};

export default StreetViewScreen;
