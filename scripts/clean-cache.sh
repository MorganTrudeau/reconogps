#!/bin/bash
# Ripped from: https://gist.githubusercontent.com/townofdon/087c7c0bb773adb158f20339c7e13408/raw/53ccb3430cf870c3cdeecead82bc12c3644f2f53/react-native-nuke.sh
# ReactNative script to clean all the things
# usage:
# - add each item below as a separate script in package.json
# - add one final script:
#   - "clean": "yarn clean-node-modules && yarn clean-pods && yarn clean-ios && yarn clean-android && yarn clean-rn-cache"
# - alternatively, copy this shell script and add the following cmd to package.json:
#   - "clean": "./react-native-clean-sh"
#   - you may need to run `sudo chmod 777 ./react-native-clean-sh before this script can run`

echo "                              ____                      "
echo "                      __,-~~/~    \`---.                 "
echo "                    _/_,---(      ,    )                "
echo "                __ /        <    /   )  \___            "
echo "               ====------------------===;;;==           "
echo "                   \/  ~\"~\"~\"~\"~\"~\~\"~)~\",1/            "
echo "                   (_ (   \  (     >    \)              "
echo "                    \_( _ <         >_>'                "
echo "                       ~ \`-i' ::>|--\"                   "
echo "                           I;|.|.|                      "
echo "                          <|i::|i|>                     "
echo "                           |[::|.|                      "
echo "                            ||: |                       "
echo "______________________REACT NATIVE CLEAN ALL________________ "

# clean-node-modules
echo "____________________________________________________________"
echo "About to clean node_modules"
rm -rf node_modules
echo "Done cleaning node_modules"
echo "____________________________________________________________"
# clean-pods
echo "____________________________________________________________"
echo "About to clean pods and reinstall them"
cd ios && rm -rf Pods && cd ..
echo "Done cleaning pods"
echo "____________________________________________________________"
#reinstall node_modules
echo "____________________________________________________________"
echo "About to install node_modules"
yarn
echo "Done installing node_modules"
echo "____________________________________________________________"
# clean-ios
echo "____________________________________________________________"
echo "About to clean the builds for iOS"
rm -rf ios/build && rm -rf ~/Library/Developer/Xcode/DerivedData && rm -rf ./ios/DerivedData
echo "Done cleaning builds for iOS"
echo "____________________________________________________________"
#reinstall pods
echo "____________________________________________________________"
echo "About to install pods"
cd ios && pod deintegrate && pod update && cd ..
echo "Done installing pods"
echo "____________________________________________________________"
# clean-rn-cache
echo "____________________________________________________________"
echo "About to clean rn cache"
rm -rf $TMPDIR/react-* && rm -rf $TMPDIR/react-native-packager-cache-* && rm -rf $TMPDIR/metro-bundler-cache-*
echo "Done cleaning rn cache"
echo "____________________________________________________________"