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

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <NavigationStack />
            <AuthManager />
            <StatusBar style="light" />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
}
