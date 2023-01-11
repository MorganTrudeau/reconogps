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

export const buildContactName = (contact: Contact): string =>
  `${contact.FirstName || ""}${
    contact.FirstName && contact.SubName ? " " : ""
  }${contact.SubName || ""}`;
