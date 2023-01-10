import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import AppTextInput from "../components/Core/AppTextInput";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation";
import { iconSize, spacing } from "../styles";
import Feather from "@expo/vector-icons/Feather";

import { AddContactData, EditContactData } from "../types";
import { addContact, editContact } from "../redux/thunks/contacts";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAlert } from "../hooks/useAlert";
import { useAppSelector } from "../hooks/useAppSelector";
import { useUpdated } from "../hooks/useUpdated";
import { alertGeneralError } from "../utils";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "manage-contact"
>;

const AddContactScreen = ({ route, navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const Alert = useAlert();

  const isEditing = !!route.params?.editContactData;

  const [contactData, setContactData] = useState<
    AddContactData | EditContactData
  >(
    isEditing
      ? route.params.editContactData
      : {
          FirstName: "",
          SubName: "",
          EMail: "",
          Mobile: "",
          Phone: "",
        }
  );
  const contactDataRef = useRef(contactData);
  contactDataRef.current = contactData;

  const { loading, success } = useAppSelector(
    (state) => state.contacts.addContact
  );
  const dispatch = useAppDispatch();

  useUpdated(success, (currentSuccess, prevSuccess) => {
    if (currentSuccess && !prevSuccess) {
      navigation.goBack();
    }
  });

  const updateContactData = (key: keyof AddContactData) => (val: string) => {
    setContactData((state) => ({ ...state, [key]: val }));
  };

  const getContactValue = (key: keyof AddContactData): string => {
    return contactData[key] || "";
  };

  const handleAddContact = () => {
    console.log(contactDataRef.current);
    if (!contactDataRef.current.FirstName.length) {
      return Alert.alert(
        "Incomplete Contact",
        "Please add a first name for your contact."
      );
    }
    if (!contactDataRef.current.SubName.length) {
      return Alert.alert(
        "Incomplete Contact",
        "Please add a last name for your contact."
      );
    }
    if (isEditing) {
      if (!("Code" in contactDataRef.current)) {
        return alertGeneralError(Alert, () => navigation.goBack);
      }
      dispatch(editContact(contactDataRef.current));
    } else {
      dispatch(addContact(contactDataRef.current));
    }
  };

  const setHeaderRightAddButton = () => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleAddContact}>
          <Feather
            name={"check-circle"}
            size={iconSize("md")}
            color={colors.primary}
          />
        </Pressable>
      ),
    });
  };

  const setHeaderRightLoading = () => {
    navigation.setOptions({
      headerRight: () => <ActivityIndicator color={colors.primary} />,
    });
  };

  useEffect(() => {
    if (isEditing) {
      navigation.setOptions({ headerTitle: "Edit Contact" });
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setHeaderRightLoading();
    } else {
      setHeaderRightAddButton();
    }
  }, [loading]);

  return (
    <View style={theme.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <AppTextInput
          placeholder="First Name"
          onChangeText={updateContactData("FirstName")}
          value={getContactValue("FirstName")}
          autoCapitalize={"words"}
          autoCorrect={false}
        />
        <AppTextInput
          placeholder="Last Name"
          onChangeText={updateContactData("SubName")}
          value={getContactValue("SubName")}
          autoCapitalize={"words"}
          autoCorrect={false}
        />
        <AppTextInput
          placeholder="Email"
          onChangeText={updateContactData("EMail")}
          value={getContactValue("EMail")}
          autoCapitalize={"none"}
          autoCorrect={false}
          keyboardType={"email-address"}
        />
        <AppTextInput
          placeholder="Mobile Number"
          onChangeText={updateContactData("Mobile")}
          value={getContactValue("Mobile")}
          autoCapitalize={"none"}
          autoCorrect={false}
          keyboardType={"number-pad"}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollViewContainer: { flexGrow: 1, paddingHorizontal: spacing("lg") },
});

export default AddContactScreen;
