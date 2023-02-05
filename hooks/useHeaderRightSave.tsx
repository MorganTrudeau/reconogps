import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "./useTheme";
import { useEffect, useRef } from "react";
import { RootStackParamList } from "../RootStackParamList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { iconSize } from "../styles";
import AppIcon from "../components/Core/AppIcon";

type Navigation = NativeStackScreenProps<RootStackParamList, any>["navigation"];

export const useHeaderRightSave = ({
  loading,
  navigation,
  onPress,
  style,
  disabled,
}: {
  loading?: boolean;
  navigation: Navigation;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) => {
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

  const { colors } = useTheme();

  const renderSaveButton = () => {
    return (
      <Pressable style={style} onPress={() => onPressRef.current()}>
        <AppIcon
          color={disabled ? colors.empty : colors.primary}
          name={"check-circle"}
          size={iconSize("md")}
        />
      </Pressable>
    );
  };

  const renderLoading = () => {
    return (
      <View style={style}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  const setHeaderRightSaveButton = () => {
    navigation.setOptions({ headerRight: renderSaveButton });
  };

  const setHeaderRightLoading = () => {
    navigation.setOptions({ headerRight: renderLoading });
  };

  useEffect(() => {
    setHeaderRightSaveButton();
  }, []);

  useEffect(() => {
    if (loading) {
      setHeaderRightLoading();
    } else {
      setHeaderRightSaveButton();
    }
  }, [loading, disabled]);
};
