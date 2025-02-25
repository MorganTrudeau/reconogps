import { Pressable, View, ViewStyle } from "react-native";
import AppIcon from "../Core/AppIcon";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/utils";
import { iconSize } from "../../styles";
import AppText from "../Core/AppText";
import { useAppSelector } from "../../hooks/useAppSelector";
import { Colors, Theme } from "../../types/styles";

export const NotificationsButton = ({
  theme,
  colors,
  style,
}: {
  theme: Theme;
  colors: Colors;
  style?: ViewStyle;
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const unreadNotifications = useAppSelector(
    (state) => state.notifications.unreadCount
  );
  return (
    <Pressable
      onPress={() => navigation.navigate("notifications")}
      hitSlop={20}
      style={[theme.iconButton, style]}
    >
      <View>
        <AppIcon
          name="bell"
          {...{ theme, colors }}
          color={colors.primary}
          size={iconSize("sm")}
        />
        {!!unreadNotifications && (
          <View style={[$unreadCount, { backgroundColor: colors.red }]}>
            <AppText style={theme.textSmall}>{unreadNotifications}</AppText>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const UNREAD_COUNT_SIZE = 15;

const $unreadCount: ViewStyle = {
  height: UNREAD_COUNT_SIZE,
  width: UNREAD_COUNT_SIZE,
  borderRadius: UNREAD_COUNT_SIZE / 2,
  position: "absolute",
  top: -1,
  right: -UNREAD_COUNT_SIZE * 0.3,
  justifyContent: "center",
  alignItems: "center",
};
