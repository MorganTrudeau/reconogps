import React, { useCallback, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import AppButton from "../components/Core/AppButton";
import AppTextInput from "../components/Core/AppTextInput";
import { useTheme } from "../hooks/useTheme";
import { spacing } from "../styles";
import functions from "@react-native-firebase/functions";
import { useAlert } from "../hooks/useAlert";
import { login } from "../redux/thunks/auth";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { startRegistration } from "../redux/reducers/auth";
import AppScrollView from "../components/Core/AppScrollView";

type AccountDetails = {
  Name: string;
  FirstName: string;
  SurName: string;
  Mail: string;
  LoginName: string;
  Mobile: string;
};

const SignUpScreen = () => {
  const { theme } = useTheme();
  const Alert = useAlert();

  const dispatch = useAppDispatch();

  const firstNameInput = useRef<TextInput>(null);
  const lastNameInput = useRef<TextInput>(null);
  const emailInput = useRef<TextInput>(null);
  const loginNameInput = useRef<TextInput>(null);
  const phoneInput = useRef<TextInput>(null);

  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    Name: "",
    FirstName: "",
    SurName: "",
    Mail: "",
    LoginName: "",
    Mobile: "",
  });
  const [loading, setLoading] = useState(false);

  const updateAccountDetails = useCallback(
    (key: keyof AccountDetails) => (val: string) => {
      setAccountDetails((s) => ({ ...s, [key]: val }));
    },
    []
  );

  const handleError = (error: unknown) => {
    let errorMessage = "Something went wrong. Please try again.";

    switch (error) {
      case "loginName incorrect":
        errorMessage = "Login name is taken. Please enter another login name.";
      case "email incorrect":
        errorMessage = "Email is in use. Please enter another email.";
    }

    Alert.alert("Sign Up Incomplete", errorMessage);
  };

  const handleConfirm = async () => {
    if (!accountDetails.Name) {
      return Alert.alert(
        "Account Details Incomplete",
        "Enter an account name."
      );
    }
    if (!accountDetails.FirstName) {
      return Alert.alert("Account Details Incomplete", "Enter a first name.");
    }
    if (!accountDetails.SurName) {
      return Alert.alert("Account Details Incomplete", "Enter a last name.");
    }
    if (!accountDetails.Mail) {
      return Alert.alert("Account Details Incomplete", "Enter an email.");
    }
    if (!accountDetails.LoginName) {
      return Alert.alert("Account Details Incomplete", "Enter a login name.");
    }
    if (!accountDetails.Mobile) {
      return Alert.alert("Account Details Incomplete", "Enter a phone number.");
    }
    try {
      setLoading(true);
      const res = await functions().httpsCallable("createAccount")(
        accountDetails
      );
      setLoading(false);

      if (!(res.data.MajorCode === "000" && res.data.MinorCode === "0000")) {
        handleError(res.data.Data?.error);
      } else {
        dispatch(startRegistration());
        dispatch(
          login({ account: accountDetails.LoginName, password: "888888" })
        );
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <AppScrollView
      style={theme.container}
      contentContainerStyle={theme.contentContainer}
    >
      <AppTextInput
        placeholder="Account Name"
        onChangeText={updateAccountDetails("Name")}
        value={accountDetails.Name}
        required
        onSubmitEditing={() => {
          firstNameInput.current?.focus();
        }}
        autoCorrect={false}
        autoCapitalize={"words"}
        autoComplete={"off"}
      />
      <AppTextInput
        ref={firstNameInput}
        placeholder="First Name"
        onChangeText={updateAccountDetails("FirstName")}
        value={accountDetails.FirstName}
        required
        onSubmitEditing={() => {
          lastNameInput.current?.focus();
        }}
        autoCapitalize={"words"}
        autoCorrect={false}
        autoComplete={"name-given"}
      />
      <AppTextInput
        ref={lastNameInput}
        placeholder="Last Name"
        onChangeText={updateAccountDetails("SurName")}
        value={accountDetails.SurName}
        required
        onSubmitEditing={() => {
          loginNameInput.current?.focus();
        }}
        autoCapitalize={"words"}
        autoCorrect={false}
        autoComplete={"name-family"}
      />
      <AppTextInput
        ref={loginNameInput}
        placeholder="Login Username"
        onChangeText={updateAccountDetails("LoginName")}
        value={accountDetails.LoginName}
        required
        onSubmitEditing={() => {
          phoneInput.current?.focus();
        }}
        autoCapitalize={"none"}
        autoCorrect={false}
        autoComplete={"off"}
      />
      <AppTextInput
        ref={phoneInput}
        placeholder="Phone Number"
        onChangeText={updateAccountDetails("Mobile")}
        value={accountDetails.Mobile}
        required
        onSubmitEditing={() => {
          emailInput.current?.focus();
        }}
        autoCapitalize={"none"}
        keyboardType={"phone-pad"}
        autoCorrect={false}
        autoComplete={"email"}
      />
      <AppTextInput
        ref={emailInput}
        placeholder="Email"
        onChangeText={updateAccountDetails("Mail")}
        value={accountDetails.Mail}
        required
        onSubmitEditing={handleConfirm}
        autoCapitalize={"none"}
        keyboardType={"email-address"}
        autoCorrect={false}
        autoComplete={"email"}
      />
      <AppButton
        onPress={handleConfirm}
        title={"Sign Up"}
        style={{ marginTop: spacing("lg") * 2 }}
        loading={loading}
      />
    </AppScrollView>
  );
};

export default SignUpScreen;
