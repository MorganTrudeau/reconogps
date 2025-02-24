import React from "react";
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-aware-scroll-view";

const AppScrollView = (props: KeyboardAwareScrollViewProps) => {
  return (
    <KeyboardAwareScrollView
      extraHeight={150}
      enableResetScrollToCoords={false}
      {...props}
    />
  );
};

export default AppScrollView;
