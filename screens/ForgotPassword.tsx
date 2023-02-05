import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { spacing } from "../styles";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../RootStackParamList";
import AppTextInput from "../components/Core/AppTextInput";
import AppText from "../components/Core/AppText";
import AppButton from "../components/Core/AppButton";
import { getPasswordResetCode, resetPassword } from "../api/auth";
import { errorToMessage } from "../utils";
import { useAlert } from "../hooks/useAlert";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "forgot-password"
>;

const ForgotPasswordScreen = ({ navigation }: NavigationProps) => {
  const { theme } = useTheme();
  const Alert = useAlert();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkCode, setCheckCode] = useState<number | undefined>(undefined);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendCode = async () => {
    if (!email) {
      return;
    }
    try {
      setLoading(true);
      const res = await getPasswordResetCode(email);
      console.log("Result: ", res);
      if (res && res.Data && res.Data.CheckCode) {
        setCheckCode(res.Data.CheckCode);
      } else {
        throw "code_missing";
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Send code error: ", error);
      Alert.alert("Failed to reset password", errorToMessage(error));
    }
  };

  const handleReset = async () => {
    if (!email) {
      return Alert.alert(
        "Incomplete Fields",
        "Enter your email before continuing."
      );
    }
    if (!code) {
      return Alert.alert(
        "Incomplete Fields",
        "Enter the code we sent to your email before continuing."
      );
    }
    if (!newPassword) {
      return Alert.alert(
        "Incomplete Fields",
        "Enter a new password before continuing."
      );
    }
    try {
      setLoading(true);
      const res = await resetPassword(email, code, newPassword);
      console.log("Result: ", res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Password reset error: ", error);
      Alert.alert("Failed to reset password", errorToMessage(error));
    }
  };

  const getButtonPressAction = () => {
    if (!checkCode) {
      return handleSendCode;
    } else {
      return handleReset;
    }
  };

  const getInstruction = () => {
    if (!checkCode) {
      return "Enter your email and we will send you a password reset code.";
    } else {
      return "Enter the code we sent to your email and your new password.";
    }
  };

  const getButtonTitle = () => {
    if (!checkCode) {
      return "Confirm Email";
    } else {
      return "Reset Password";
    }
  };

  return (
    <View style={[theme.container, styles.container]}>
      <AppText style={styles.message}>{getInstruction()}</AppText>

      {!checkCode ? (
        <AppTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          autoCapitalize="none"
          autoCorrect={false}
          style={checkCode ? { opacity: 0.5 } : undefined}
          editable={!checkCode}
          onSubmitEditing={getButtonPressAction()}
        />
      ) : (
        <>
          <AppTextInput
            value={code}
            onChangeText={setCode}
            placeholder="Code"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={"number-pad"}
          />
          <AppTextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </>
      )}

      <AppButton
        title={getButtonTitle()}
        style={styles.resetButton}
        onPress={getButtonPressAction()}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing("lg") },
  message: { textAlign: "center", marginTop: spacing("sm") },
  resetButton: { marginTop: spacing("xl") },
});

export default ForgotPasswordScreen;
