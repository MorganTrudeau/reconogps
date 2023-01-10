import { AddContactData, Contact, EditContactData } from "../types";

export const contactToEditContactData = (contact: Contact): EditContactData => {
  return {
    FirstName: contact.FirstName || "",
    SubName: contact.SubName || "",
    EMail: contact.EMail || "",
    Mobile: contact.Mobile || "",
    Phone: contact.Phone || "",
    Code: contact.Code,
  };
};
