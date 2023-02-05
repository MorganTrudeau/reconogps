import React, { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import AppTextInput from "../components/Core/AppTextInput";
import { spacing } from "../styles";
import AppText from "../components/Core/AppText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../RootStackParamList";
import AppButton from "../components/Core/AppButton";
import { useAlert } from "../hooks/useAlert";
import { errorToMessage } from "../utils";
import { login } from "../redux/thunks/auth";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootState } from "../redux/store";
import { useUpdated } from "../hooks/useUpdated";
import AppScrollView from "../components/Core/AppScrollView";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "login">;

const LoginScreen = ({ navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const Alert = useAlert();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector(
    (state: RootState) => state.auth.loginRequest
  );

  useUpdated(error, (currentError, prevError) => {
    if (!prevError && currentError) {
      Alert.alert("Login Failed", errorToMessage(currentError));
    }
  });

  const passwordInput = useRef<TextInput | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleForgotPassword = () => {
    navigation.navigate("forgot-password");
  };

  const handleLogin = async () => {
    if (!username) {
      return Alert.alert(
        "Login Incomplete",
        "Enter your email or username before logging in."
      );
    }
    if (!password) {
      return Alert.alert(
        "Login Incomplete",
        "Enter your password before logging in."
      );
    }
    dispatch(login({ account: username, password }));
  };

  const focusPassword = () => {
    passwordInput.current && passwordInput.current.focus();
  };

  return (
    <AppScrollView
      keyboardShouldPersistTaps="handled"
      style={theme.container}
      contentContainerStyle={styles.container}
    >
      <View style={[styles.iconContainer, { marginTop: insets.top }]}>
        <Image source={require("../assets/icon.png")} style={styles.icon} />
      </View>
      <View style={styles.inputContainer}>
        <AppTextInput
          {...{ theme, colors }}
          placeholder="Email or username"
          onChangeText={setUsername}
          autoCapitalize={"none"}
          autoCorrect={false}
          value={username}
          onSubmitEditing={focusPassword}
        />
        <AppTextInput
          {...{ theme, colors }}
          ref={passwordInput}
          placeholder="Password"
          containerStyle={styles.passwordInput}
          onChangeText={setPassword}
          autoCapitalize={"none"}
          secureTextEntry={true}
          autoCorrect={false}
          value={password}
          onSubmitEditing={handleLogin}
        />
        <Pressable
          onPress={handleForgotPassword}
          style={styles.forgotPasswordButton}
        >
          <AppText {...{ theme, colors }} style={theme.textMeta}>
            Forgot Password
          </AppText>
        </Pressable>
        <AppButton
          {...{ theme, colors }}
          title="Login"
          style={styles.loginButton}
          onPress={handleLogin}
          loading={loading}
        />
      </View>
    </AppScrollView>
  );
};

const ICON_SIZE = 180;

const styles = StyleSheet.create({
  container: { flex: 1 },
  iconContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  icon: { height: ICON_SIZE, width: ICON_SIZE },
  inputContainer: { flex: 2.5, padding: spacing("lg") },
  passwordInput: {},
  forgotPasswordButton: { marginTop: spacing("lg") },
  loginButton: { marginTop: spacing("xl") },
});

export default LoginScreen;
