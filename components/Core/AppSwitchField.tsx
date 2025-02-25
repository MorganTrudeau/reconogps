import { Pressable, StyleSheet, Switch } from "react-native";
import AppIcon from "./AppIcon";
import AppText from "./AppText";
import { Colors, MaterialIcon, Theme } from "../../types/styles";
import { iconSize, spacing } from "../../styles";
import { useMemo } from "react";
import AppSwitch from "./AppSwitch";

const AppSwitchField = ({
  onPress,
  value,
  title,
  colors,
  icon,
}: {
  onPress: () => void;
  value: boolean;
  title: string;
  colors: Colors;
  icon?: MaterialIcon;
}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {!!icon && (
        <AppIcon
          name={"file-chart"}
          color={colors.primary}
          style={styles.icon}
          size={iconSize("sm")}
        />
      )}
      <AppText style={{ flex: 1 }}>{title}</AppText>
      <AppSwitch
        value={value}
        onValueChange={onPress}
        thumbColor={colors.white}
        style={styles.switch}
      />
    </Pressable>
  );
};

export default AppSwitchField;

const styles = StyleSheet.create({
  container: {
    marginTop: spacing("xl"),
    flexDirection: "row",
    alignItems: "center",
  },
  icon: { marginRight: spacing("md") },
  switch: { marginLeft: spacing("lg") },
});
