import React from "react";
import { FlatList, FlatListProps, RefreshControl } from "react-native";
import { Contact } from "../../types";
import ContactItem from "./ContactItem";

type Props = {
  contacts: Contact[];
  loading: boolean;
  onRefresh: () => void;
  onPress?: (contact: Contact) => void;
  onOptionsPress?: (contact: Contact) => void;
} & Omit<FlatListProps<Contact>, "data" | "renderItem">;

const ContactsList = ({
  contacts,
  loading,
  onRefresh,
  onPress,
  onOptionsPress,
  ...rest
}: Props) => {
  const renderItem = ({ item, index }: { item: Contact; index: number }) => {
    return (
      <ContactItem
        contact={item}
        onPress={onPress}
        onOptionsPress={onOptionsPress}
      />
    );
  };

  return (
    <FlatList
      data={contacts}
      renderItem={renderItem}
      {...rest}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    />
  );
};

export default ContactsList;
