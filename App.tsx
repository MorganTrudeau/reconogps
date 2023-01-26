import "react-native-gesture-handler";
import "expo-dev-menu";

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

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <ThemeProvider>
              <ToastProvider>
                <PortalProvider>
                  <NavigationStack />
                </PortalProvider>
                <ToastManager />
              </ToastProvider>
              <AuthManager />
              <StatusBar style="light" />
            </ThemeProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
}
