import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AppTextInput from "../components/Core/AppTextInput";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../navigation";
import { spacing } from "../styles";

import { AddContactData, EditContactData } from "../types";
import { addContact, editContact } from "../redux/thunks/contacts";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAlert } from "../hooks/useAlert";
import { useAppSelector } from "../hooks/useAppSelector";
import { useUpdated } from "../hooks/useUpdated";
import { alertGeneralError } from "../utils";
import { useHeaderRightSave } from "../hooks/useHeaderRightSave";
import { useToast } from "../hooks/useToast";

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "manage-contact"
>;

const AddContactScreen = ({ route, navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const Alert = useAlert();
  const Toast = useToast();

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

  const { loading, success } = useAppSelector(
    (state) => state.contacts.addContact
  );
  const dispatch = useAppDispatch();

  useUpdated(success, (currentSuccess, prevSuccess) => {
    if (currentSuccess && !prevSuccess) {
      Toast.show(isEditing ? "Contact Edited" : "Contact Added");
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
    if (!contactData.FirstName.length) {
      return Alert.alert(
        "Incomplete Contact",
        "Please add a first name for your contact."
      );
    }
    if (!contactData.SubName.length) {
      return Alert.alert(
        "Incomplete Contact",
        "Please add a last name for your contact."
      );
    }
    if (isEditing) {
      if (!("Code" in contactData)) {
        return alertGeneralError(Alert, () => navigation.goBack);
      }
      console.log(contactData);
      dispatch(editContact(contactData));
    } else {
      dispatch(addContact(contactData));
    }
  };

  useEffect(() => {
    if (isEditing) {
      navigation.setOptions({ headerTitle: "Edit Contact" });
    }
  }, []);

  useHeaderRightSave({
    loading,
    navigation,
    onPress: handleAddContact,
  });

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
