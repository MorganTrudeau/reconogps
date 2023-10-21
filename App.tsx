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
import { StripeProvider } from "@stripe/stripe-react-native";
import PopoverProvider from "./context/PopoverContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
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
                        <NavigationStack />
                      </PopoverProvider>
                    </StripeProvider>
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
    </GestureHandlerRootView>
  );
}
