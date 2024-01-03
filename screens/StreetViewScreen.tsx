import { useMemo } from "react";
import WebView from "react-native-webview";

const StreetViewScreen = () => {
  const html = useMemo(() => {
    return `<!doctype html>
        <!--
         @license
         Copyright 2019 Google LLC. All Rights Reserved.
         SPDX-License-Identifier: Apache-2.0
        -->
        <html>
          <head>
            <title>Street View split-map-panes</title>
            <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
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
                    margin: 0;
                    padding: 0;
                }
            </style>
          </head>
          <body>
        
            <div id="pano"></div>
        
            <script
              src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initialize&v=weekly"
              defer
            ></script>

            <script>
                function initialize() {
                    const fenway = { lat: 42.345573, lng: -71.098326 };
                
                    const panorama = new google.maps.StreetViewPanorama(
                      document.getElementById("pano"),
                      {
                        position: fenway,
                        pov: {
                          heading: 34,
                          pitch: 10,
                        },
                      },
                    );
                }
                initialize();
            </script>
          </body>
        </html>`;
  }, []);

  return <WebView source={{ html }} style={{ flex: 1 }} />;
};

export default StreetViewScreen;
