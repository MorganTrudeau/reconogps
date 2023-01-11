import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import AppText from "../components/Core/AppText";
import AppTextInput from "../components/Core/AppTextInput";
import { useAlert } from "../hooks/useAlert";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { useHeaderRightSave } from "../hooks/useHeaderRightSave";
import { useTheme } from "../hooks/useTheme";
import { useUpdated } from "../hooks/useUpdated";
import { RootStackParamList } from "../navigation";
import { changePassword } from "../redux/thunks/auth";
import { spacing } from "../styles";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "change-password"
>;

const ChangePasswordScreen = ({ navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const Alert = useAlert();

  const newPasswordInput = useRef<TextInput>(null);
  const confirmPasswordInput = useRef<TextInput>(null);

  const [state, setState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { changePasswordRequest } = useAppSelector((state) => ({
    changePasswordRequest: state.auth.changePasswordRequest,
  }));
  const dispatch = useAppDispatch();

  useUpdated(changePasswordRequest.success, (success, prevSuccess) => {
    if (success && !prevSuccess) {
      navigation.goBack();
    }
  });

  const handleForgotPassword = () => {
    navigation.navigate("forgot-password");
  };

  const handleChangePassword = () => {
    const { oldPassword, newPassword, confirmPassword } = state;
    if (!(oldPassword && newPassword && confirmPassword)) {
      return Alert.alert(
        "Incomplete Fields",
        "Fill out all fields before submitting."
      );
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert(
        "Passwords do not match",
        "Your confirming password does not match your new password."
      );
    }
    dispatch(changePassword({ oldPassword, newPassword }));
  };

  useHeaderRightSave({
    loading: changePasswordRequest.loading,
    navigation,
    onPress: handleChangePassword,
  });

  return (
    <View style={theme.container}>
      <ScrollView contentContainerStyle={styles.listContent}>
        <AppTextInput
          placeholder="Current password"
          value={state.oldPassword}
          onChangeText={(oldPassword) =>
            setState((s) => ({ ...s, oldPassword }))
          }
          autoCapitalize={"none"}
          autoCorrect={false}
          secureTextEntry={true}
          onSubmitEditing={() =>
            newPasswordInput.current && newPasswordInput.current.focus()
          }
        />
        <AppTextInput
          ref={newPasswordInput}
          placeholder="New password"
          value={state.newPassword}
          onChangeText={(newPassword) =>
            setState((s) => ({ ...s, newPassword }))
          }
          autoCapitalize={"none"}
          autoCorrect={false}
          secureTextEntry={true}
          onSubmitEditing={() =>
            confirmPasswordInput.current && confirmPasswordInput.current.focus()
          }
        />
        <AppTextInput
          ref={confirmPasswordInput}
          placeholder="Confirm new password"
          value={state.confirmPassword}
          onChangeText={(confirmPassword) =>
            setState((s) => ({ ...s, confirmPassword }))
          }
          autoCapitalize={"none"}
          autoCorrect={false}
          secureTextEntry={true}
        />

        <Pressable></Pressable>

        <AppText style={styles.forgotMessage}>
          If you forgot your password{" "}
          <AppText
            style={{ color: colors.primary }}
            onPress={handleForgotPassword}
          >
            Click here.
          </AppText>
        </AppText>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: { flexGrow: 1, paddingHorizontal: spacing("lg") },
  forgotMessage: { marginTop: spacing("xl") },
});

export default ChangePasswordScreen;
