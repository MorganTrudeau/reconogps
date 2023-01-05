import "expo-dev-menu";
import { NavigationContainer } from "@react-navigation/native";
import ThemeProvider from "./context/ThemeContext";
import NavigationStack from "./navigation";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <NavigationStack />
        <StatusBar style="light" />
      </ThemeProvider>
    </NavigationContainer>
  );
}
