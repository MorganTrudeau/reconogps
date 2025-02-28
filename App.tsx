import "react-native-gesture-handler";

import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from "@react-navigation/native";
import ThemeProvider from "./context/ThemeContext";
import NavigationStack from "./navigation";
import { StatusBar } from "expo-status-bar";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AuthManager from "./services/AuthManager";
import { PortalProvider } from "@gorhom/portal";
import ToastProvider from "./context/ToastContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ToastManager from "./services/ToastManager";
import { StripeProvider } from "@stripe/stripe-react-native";
import PopoverProvider from "./context/PopoverContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NotificationsManager from "./services/NotificationsManager";
import { MapLayerProvider } from "./context/MapLayerContext";
import MessagingManager from "./firebase/MessagingManager";
import { DynamicAssetDataLoader } from "./services/DynamicAssetDataLoader";
import { hide } from "react-native-bootsplash";
import { colors } from "./styles";

const hideSplash = () => hide({ fade: true });

const navigationTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer onReady={hideSplash} theme={navigationTheme}>
            <SafeAreaProvider>
              <ThemeProvider>
                <ToastProvider>
                  <PortalProvider>
                    <StripeProvider
                      publishableKey="pk_test_51M1LLjCDBFeHvOGCnqXOb5rYjJmc7hHk94sR8upPbKCY6eJiNd2WW1ncV1eeeqcmzlATHoOGt1zZYAc12RfHHyaV00tfUzHwvo"
                      urlScheme="reconogps" // required for 3D Secure and bank redirects
                      merchantIdentifier="merchant.com.reconogps.app.dev" // required for Apple Pay
                    >
                      <PopoverProvider>
                        <MapLayerProvider>
                          {/* <StatusBar style="light" /> */}
                          <NavigationStack />
                        </MapLayerProvider>
                      </PopoverProvider>
                    </StripeProvider>
                  </PortalProvider>
                  <ToastManager />
                </ToastProvider>
                <MessagingManager />
                <AuthManager />
                <NotificationsManager />
                <DynamicAssetDataLoader />
              </ThemeProvider>
            </SafeAreaProvider>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
