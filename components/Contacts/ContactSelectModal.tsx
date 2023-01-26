import React, { forwardRef } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../hooks/useTheme";
import { getContacts } from "../../redux/selectors/contacts";
import { Contact } from "../../types";
import { buildContactName } from "../../utils/contacts";
import AppText from "../Core/AppText";
import SelectModal, { Props as SelectModalProps } from "../Modals/SelectModal";

type Props = Omit<SelectModalProps, "data">;

const ContactSelectModal = forwardRef<Modalize, Props>((props, ref) => {
  const { theme } = useTheme();

  const contacts = useAppSelector((state) => getContacts(state));

  const renderContactSelectContact = (contact: Contact) => {
    return (
      <View>
        <AppText>{buildContactName(contact)}</AppText>
        <AppText style={theme.textMeta}>{contact.EMail}</AppText>
      </View>
    );
  };

  return (
    <SelectModal
      modalTitle="Selected Contacts"
      ref={ref}
      data={contacts}
      nameSelector={(contact: Contact) => buildContactName(contact)}
      idSelector={(contact: Contact) => contact.Code}
      customItemContent={renderContactSelectContact}
      {...props}
    />
  );
});

export default ContactSelectModal;
