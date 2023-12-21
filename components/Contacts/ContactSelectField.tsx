import React, { useMemo, useRef } from "react";
import AppField from "../Core/AppField";
import { AppModalRef } from "../Core/AppModal";
import { useAppSelector } from "../../hooks/useAppSelector";
import { buildContactName } from "../../utils/contacts";
import ContactSelectModal from "./ContactSelectModal";
import { Contact } from "../../types";

type Props = {
  customerCodes: string[];
  onSelect: (contacts: Contact[]) => void;
  title?: string;
};

export const ContactSelectField = ({
  customerCodes,
  onSelect,
  title = "Contacts",
}: Props) => {
  const contactSelectModal = useRef<AppModalRef>(null);

  const contacts = useAppSelector((state) => state.contacts.data.entities);

  const selectedContactNames = useMemo(() => {
    return customerCodes
      .map((contactCode) => {
        const contact = contacts[contactCode];
        if (contact) {
          return buildContactName(contact);
        }
        return "Unknown";
      })
      .join(", ");
  }, [customerCodes, contacts]);

  return (
    <>
      <AppField
        value={selectedContactNames}
        placeholder={title}
        onPress={() => contactSelectModal.current?.open()}
      />

      <ContactSelectModal
        ref={contactSelectModal}
        onSelect={onSelect}
        initialSelectedIds={customerCodes}
        modalTitle={title}
      />
    </>
  );
};
