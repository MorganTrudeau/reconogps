import { createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "./utils";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const navigate = <K extends keyof RootStackParamList>(
  name: K,
  params?: RootStackParamList[K]
) => {
  if (!navigationRef.isReady()) {
    return;
  }
  // @ts-expect-error Typing is correct
  navigationRef.navigate(name, params);
};

const goBack = () => {
  if (!navigationRef.isReady() || navigationRef.canGoBack()) {
    return;
  }
  navigationRef.goBack();
};

function getCurrentRoute() {
  if (!navigationRef.isReady()) {
    return;
  }
  return navigationRef.getCurrentRoute();
}

// add other navigation functions that you need and export them

export default {
  navigate,
  goBack,
  getCurrentRoute,
};
