import React, { useMemo, useRef } from "react";
import AppField from "../Core/AppField";
import { AppModalRef } from "../Core/AppModal";
import { useAppSelector } from "../../hooks/useAppSelector";
import { buildContactName } from "../../utils/contacts";
import ContactSelectModal, {
  Props as ContactSelectModalProps,
} from "./ContactSelectModal";

type Props = {
  customerCodes: string[];
  title?: string;
} & ContactSelectModalProps;

export const ContactSelectField = ({
  customerCodes,
  onSelect,
  title = "Contacts",
  ...rest
}: Props) => {
  const contactSelectModal = useRef<AppModalRef>(null);

  const contacts = useAppSelector((state) => state.contacts.data.entities);

  const selectedContactNames = useMemo(() => {
    return customerCodes
      .filter((contactCode) => !!contactCode)
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
        {...rest}
      />
    </>
  );
};
