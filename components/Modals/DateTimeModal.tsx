import React from "react";
import { Pressable, Text } from "react-native";
import DateTimePickerModal, {
  cancelButtonStyles,
  confirmButtonStyles,
  ReactNativeModalDateTimePickerProps,
  ConfirmButtonPropTypes,
  CancelButtonPropTypes,
} from "react-native-modal-datetime-picker";
import { ThemeProps } from "../../types/styles";

const DateTimeModal = ({
  theme,
  colors,
  ...rest
}: ThemeProps & ReactNativeModalDateTimePickerProps) => {
  const renderConfirmButton = (props: ConfirmButtonPropTypes) => {
    return (
      <Pressable
        onPress={props.onPress}
        style={[
          // @ts-ignore not seeing type as style
          confirmButtonStyles.button,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        <Text
          style={[
            // @ts-ignore not seeing type as style
            confirmButtonStyles.text,
            { color: colors.primary },
          ]}
        >
          Confirm
        </Text>
      </Pressable>
    );
  };

  const renderCancelButton = (props: CancelButtonPropTypes) => {
    return (
      <Pressable
        onPress={props.onPress}
        style={[
          // @ts-ignore not seeing type as style
          cancelButtonStyles.button,
          { backgroundColor: colors.background },
        ]}
      >
        <Text
          style={[
            // @ts-ignore not seeing type as style
            cancelButtonStyles.text,
            { color: colors.textMeta },
          ]}
        >
          Cancel
        </Text>
      </Pressable>
    );
  };

  return (
    <DateTimePickerModal
      {...rest}
      buttonTextColorIOS={colors.primary}
      isDarkModeEnabled={true}
      pickerContainerStyleIOS={{ backgroundColor: colors.background }}
      // @ts-ignore not recognizing iOS prop type
      textColor={colors.text}
      customConfirmButtonIOS={renderConfirmButton}
      customCancelButtonIOS={renderCancelButton}
    />
  );
};

export default DateTimeModal;
