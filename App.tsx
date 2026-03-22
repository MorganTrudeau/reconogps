import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
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
import PopoverProvider from "./context/PopoverContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NotificationsManager from "./services/NotificationsManager";
import { MapLayerProvider } from "./context/MapLayerContext";
import MessagingManager from "./firebase/MessagingManager";
import { DynamicAssetDataLoader } from "./services/DynamicAssetDataLoader";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
      <NavigationContainer>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaProvider>
              <ThemeProvider>
                <ToastProvider>
                  <PortalProvider>
                    <PopoverProvider>
                      <MapLayerProvider>
                        <StatusBar style="light" />
                        <NavigationStack />
                      </MapLayerProvider>
                    </PopoverProvider>
                  </PortalProvider>
                  <ToastManager />
                </ToastProvider>
                <MessagingManager />
                <AuthManager />
                <NotificationsManager />
                <DynamicAssetDataLoader />
              </ThemeProvider>
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </NavigationContainer>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
