import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import ContactsList from "../components/Contacts/ContactsList";
import AppTextInput from "../components/Core/AppTextInput";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { useTheme } from "../hooks/useTheme";
import { RootStackParamList } from "../RootStackParamList";
import { getContacts } from "../redux/selectors/contacts";
import { deleteContact, loadContacts } from "../redux/thunks/contacts";
import { iconSize, spacing } from "../styles";
import OptionsModal, {
  OptionModalItem,
} from "../components/Modals/OptionsModal";
import { Contact } from "../types";
import { Modalize } from "react-native-modalize";
import { useIsFocused } from "@react-navigation/native";
import { useUpdated } from "../hooks/useUpdated";
import { contactToEditContactData } from "../utils/contacts";
import Avatar from "../components/Avatar";
import AppText from "../components/Core/AppText";
import AppIcon from "../components/Core/AppIcon";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "contacts">;

const ContactsScreen = ({ navigation }: NavigationProps) => {
  const { theme, colors } = useTheme();
  const isFocused = useIsFocused();

  const [search, setSearch] = useState("");
  const [selectedContact, selectContact] = useState<Contact | null>(null);

  const optionsModalRef = useRef<Modalize>(null);
  const closeModal = () => {
    optionsModalRef.current && optionsModalRef.current.close();
  };

  useUpdated(isFocused, (currentFocus, prevFocus) => {
    if (prevFocus && !currentFocus) {
      closeModal();
    }
  });

  const { contacts, loadRequest, deleteRequest } = useAppSelector((state) => ({
    contacts: getContacts(state),
    loadRequest: state.contacts.loadRequest,
    deleteRequest: state.contacts.deleteRequest,
  }));
  const dispatch = useAppDispatch();

  useUpdated(deleteRequest.success, (currentSuccess, prevSuccess) => {
    if (currentSuccess && !prevSuccess) {
      closeModal();
    }
  });

  const handleLoadContacts = () => {
    dispatch(loadContacts());
  };

  useEffect(() => {
    handleLoadContacts();

    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={theme.drawerHeaderRight}
          onPress={() => navigation.navigate("manage-contact")}
        >
          <AppIcon
            name={"plus-circle"}
            size={iconSize("md")}
            color={colors.primary}
          />
        </Pressable>
      ),
    });
  }, []);

  const handleEditSelectedContact = () => {
    if (!selectedContact) {
      return closeModal();
    }
    navigation.navigate("manage-contact", {
      editContactData: contactToEditContactData(selectedContact),
    });
  };

  const handleDeleteSelectedContact = () => {
    if (!selectedContact) {
      return closeModal();
    }
    dispatch(deleteContact(selectedContact.Code));
  };

  const handleContactPress = (contact: Contact) => {
    navigation.navigate("manage-contact", {
      editContactData: contactToEditContactData(contact),
    });
  };

  const handleContactOptionsPress = (contact: Contact) => {
    selectContact(contact);
    optionsModalRef.current && optionsModalRef.current.open();
  };

  const filteredContacts = useMemo(() => {
    if (!search) {
      return contacts;
    }

    return contacts.filter((contact) =>
      (
        (contact.FirstName || "") +
        " " +
        (contact.SubName || "") +
        (contact.EMail || "")
      )
        .toUpperCase()
        .includes(search.toUpperCase())
    );
  }, [contacts, search]);

  const options: OptionModalItem[] = [
    {
      value: "edit",
      text: "Edit Contact",
      icon: "pencil",
      onPress: handleEditSelectedContact,
    },
    {
      value: "delete",
      text: "Delete Contact",
      icon: "delete",
      destructive: true,
      onPress: handleDeleteSelectedContact,
      loading: deleteRequest.loading,
    },
  ];

  const renderOptionsHeader = () => {
    if (!selectedContact) {
      return null;
    }

    return (
      <View style={theme.optionsHeader}>
        <Avatar
          firstName={selectedContact.FirstName}
          lastName={selectedContact.SubName}
          size={40}
          style={{ marginRight: spacing("lg") }}
        />
        <AppText
          style={theme.titleLarge}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {selectedContact.FirstName || ""}
          {selectedContact.FirstName && selectedContact.SubName ? " " : ""}
          {selectedContact.SubName || ""}
        </AppText>
      </View>
    );
  };

  return (
    <View style={theme.container}>
      <AppTextInput
        style={styles.searchInput}
        animatedPlaceholder={false}
        placeholder={"Search"}
        onChangeText={setSearch}
        value={search}
      />
      <ContactsList
        contacts={filteredContacts}
        loading={loadRequest.loading}
        onRefresh={handleLoadContacts}
        onPress={handleContactPress}
        onOptionsPress={handleContactOptionsPress}
      />
      <OptionsModal
        options={options}
        ref={optionsModalRef}
        HeaderComponent={renderOptionsHeader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    marginHorizontal: spacing("lg"),
    marginBottom: spacing("md"),
    marginTop: spacing("sm"),
  },
});

export default ContactsScreen;
