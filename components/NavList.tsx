import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { iconSize, spacing } from "../styles";
import { MaterialIcon } from "../types/styles";
import AppText from "./Core/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type NavListItem = {
  icon: MaterialIcon;
  title: string;
  onPress: () => void;
};

type Props = { items: NavListItem[] };

const NavList = ({ items }: Props) => {
  const { theme, colors } = useTheme();

  const renderItem = (item: NavListItem) => {
    return (
      <Pressable style={styles.item} key={item.title} onPress={item.onPress}>
        <MaterialCommunityIcons
          name={item.icon}
          color={colors.primary}
          size={iconSize("md")}
          style={styles.icon}
        />
        <View style={[theme.row, theme.borderBottom, styles.itemInner]}>
          <AppText style={styles.title}>{item.title}</AppText>
          <MaterialCommunityIcons
            color={colors.white}
            size={iconSize("md")}
            name={"chevron-right"}
            style={styles.chevron}
          />
        </View>
      </Pressable>
    );
  };

  return <ScrollView>{items.map(renderItem)}</ScrollView>;
};

const styles = StyleSheet.create({
  item: {
    paddingLeft: spacing("lg"),
    flexDirection: "row",
    alignItems: "center",
  },
  itemInner: {
    flex: 1,
    alignSelf: "stretch",
    height: "100%",
    paddingVertical: spacing("lg"),
  },
  icon: { marginRight: spacing("lg") },
  chevron: { position: "absolute", right: spacing("sm") },
  title: { flex: 1 },
});

export default NavList;
