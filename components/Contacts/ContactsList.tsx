import React from "react";
import { FlatList, FlatListProps, RefreshControl } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Contact } from "../../types";
import EmptyList from "../EmptyList";
import ContactItem from "./ContactItem";

const keyExtractor = (item: Contact) => item.Code;

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
  const { theme, colors } = useTheme();

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
      keyExtractor={keyExtractor}
      data={contacts}
      renderItem={renderItem}
      {...rest}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <EmptyList
          theme={theme}
          colors={colors}
          icon={"account-multiple"}
          message={"No contacts to show"}
        />
      }
    />
  );
};

export default ContactsList;
