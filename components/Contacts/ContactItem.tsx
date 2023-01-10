import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { iconSize, spacing } from "../../styles";
import { Contact } from "../../types";
import Avatar from "../Avatar";
import AppText from "../Core/AppText";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  contact: Contact;
  onPress?: (contact: Contact) => void;
  onOptionsPress?: (contact: Contact) => void;
};

const ContactItem = ({ contact, onPress, onOptionsPress }: Props) => {
  const { theme, colors } = useTheme();
  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress && onPress(contact)}
    >
      <Avatar
        firstName={contact.FirstName}
        lastName={contact.SubName}
        style={styles.avatar}
      />

      <View style={styles.content}>
        <AppText numberOfLines={1} ellipsizeMode={"tail"}>
          {contact.FirstName || ""}
          {contact.FirstName && contact.SubName ? " " : ""}
          {contact.SubName || ""}
        </AppText>

        {!!contact.EMail && (
          <AppText
            style={theme.textMeta}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {contact.EMail}
          </AppText>
        )}
      </View>

      <Pressable onPress={() => onOptionsPress && onOptionsPress(contact)}>
        <Feather
          name={"more-vertical"}
          color={colors.primary}
          size={iconSize("md")}
        />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing("lg"),
    paddingVertical: spacing("md"),
  },
  content: { flex: 1 },
  avatar: { marginRight: spacing("lg") },
});

export default ContactItem;
