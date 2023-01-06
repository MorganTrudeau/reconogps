import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import AppTextInput from "../components/Core/AppTextInput";
import { useAppSelector } from "../hooks/useAppSelector";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation";
import { spacing } from "../styles";
import { User } from "../types";
import Feather from "@expo/vector-icons/Feather";
import { updateUserInfo } from "../redux/thunks/user";
import { useAppDispatch } from "../hooks/useAppDispatch";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "profile">;

const ProfileScreen = ({ navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();

  const { activeUser, updateRequest } = useAppSelector((state) => ({
    activeUser: state.activeUser.data,
    updateRequest: state.activeUser.updateRequest,
  }));
  const dispatch = useAppDispatch();

  const [userUpdate, setUserUpdate] = useState<Partial<User>>({});

  const userUpdateRef = useRef(userUpdate);
  userUpdateRef.current = { ...(activeUser || {}), ...userUpdate };

  const handleUpdate = (key: keyof User) => (val: string) => {
    setUserUpdate((s) => ({ ...s, [key]: val }));
  };

  const getValue = (key: keyof User): string => {
    const value =
      typeof userUpdate[key] === "string"
        ? String(userUpdate[key])
        : activeUser
        ? activeUser[key] !== null && activeUser[key] !== undefined
          ? String(activeUser[key]).trim()
          : ""
        : "";
    return value;
  };

  const handleUpdateUser = () => {
    console.log(userUpdateRef.current);
    Keyboard.dismiss();
    dispatch(updateUserInfo(userUpdateRef.current));
  };

  const renderSaveButton = () => {
    return (
      <Pressable style={styles.headerRight} onPress={handleUpdateUser}>
        <Feather color={colors.primary} name={"check-circle"} size={20} />
      </Pressable>
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.headerRight}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  const setHeaderRightSaveButton = () => {
    navigation.setOptions({ headerRight: renderSaveButton });
  };

  const setHeaderRightLoading = () => {
    navigation.setOptions({ headerRight: renderLoading });
  };

  useEffect(() => {
    setHeaderRightSaveButton();
  }, []);

  useEffect(() => {
    if (updateRequest.loading) {
      setHeaderRightLoading();
    } else {
      setHeaderRightSaveButton();
    }
  }, [updateRequest.loading]);

  return (
    <View style={theme.container}>
      <ScrollView contentContainerStyle={styles.inputContainer}>
        <AppTextInput
          placeholder="First Name"
          onChangeText={handleUpdate("FirstName")}
          value={getValue("FirstName")}
        />
        <AppTextInput
          placeholder="Last Name"
          onChangeText={handleUpdate("SurName")}
          value={getValue("SurName")}
        />
        <AppTextInput
          placeholder="Email"
          onChangeText={handleUpdate("Email")}
          value={getValue("Email")}
        />
        <AppTextInput
          placeholder="Phone Number"
          onChangeText={handleUpdate("Mobile")}
          // value={getValue("Mobile")}
        />
        <AppTextInput
          placeholder="Address"
          onChangeText={handleUpdate("Address0")}
          value={getValue("Address0")}
        />
        <AppTextInput
          placeholder="Country"
          onChangeText={handleUpdate("Address1")}
          value={getValue("Address1")}
        />
        <AppTextInput
          placeholder="City"
          onChangeText={handleUpdate("Address2")}
          value={getValue("Address2")}
        />
        <AppTextInput
          placeholder="State/Province"
          onChangeText={handleUpdate("Address3")}
          value={getValue("Address3")}
        />
        <AppTextInput
          placeholder="Zip/Postal Code"
          onChangeText={handleUpdate("Address4")}
          value={getValue("Address4")}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: spacing("lg"),
    paddingBottom: spacing("md"),
  },
  headerRight: { marginHorizontal: 11, padding: 3 },
});

export default ProfileScreen;
